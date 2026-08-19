import { j as v } from "./preloadable-Bomi5PEU.js";
import { u as g, i as _, e as K } from "./_commonjsHelpers-61wyk6v6.js";
import { c as D, n as Y, a as B } from "./space-sequence-card-BHJhPhFZ.js";
import { C as L } from "./node-detail-storyboard-grid-Dj6kOUmq.js";
await window.DeverFront?.ensureCompat?.(["@/components/reference-composer"]);
const b = window.DeverFront?.sdk?.getCompatModule("@/components/reference-composer");
if (!b || Object.keys(b).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/reference-composer");
const H = ["current"], N = [], U = b, $ = U.ReferenceEditor, S = U.ReferenceContentView;
function fe({
  value: e,
  content: n,
  items: i,
  placeholder: r,
  disabled: t,
  textEditable: o,
  autoFocus: f,
  className: a,
  layerZIndex: l,
  usageOptions: d = N,
  usageField: s = "usage",
  mediaUsageOptions: c,
  autoAssignUsage: p = !0,
  pickerRequest: h,
  onPickerRequestConsumed: E,
  onReferenceDelete: M,
  onReferenceUsageChange: P,
  onChange: m,
  onBlur: C,
  onSubmit: w,
  assetReferenceProvider: I
}) {
  const x = X(i);
  return /* @__PURE__ */ v(
    J,
    {
      value: e,
      content: n,
      adapter: x,
      placeholder: r,
      disabled: t,
      textEditable: o,
      autoFocus: f,
      className: a,
      layerZIndex: l,
      usageOptions: d,
      usageField: s,
      mediaUsageOptions: c,
      autoAssignUsage: p,
      pickerRequest: h,
      onPickerRequestConsumed: E,
      onReferenceDelete: M,
      onReferenceUsageChange: P,
      onChange: m,
      onBlur: C,
      onSubmit: w,
      assetReferenceProvider: I
    }
  );
}
function J({
  value: e,
  content: n,
  adapter: i,
  placeholder: r,
  disabled: t,
  textEditable: o = !0,
  autoFocus: f,
  className: a,
  layerZIndex: l,
  usageOptions: d = N,
  usageField: s = "usage",
  mediaUsageOptions: c,
  autoAssignUsage: p = !0,
  pickerRequest: h,
  onPickerRequestConsumed: E,
  onReferenceDelete: M,
  onReferenceUsageChange: P,
  onChange: m,
  onBlur: C,
  onSubmit: w,
  assetReferenceProvider: I
}) {
  const x = _(
    L
  ), k = I || x, V = g(
    () => k ? [k] : void 0,
    [k]
  ), z = K(
    (u) => j(u, i, k),
    [k, i]
  ), W = g(
    () => n || D(e, i.options),
    [i.options, n, e]
  ), G = g(
    () => `${s}:${A(
      d
    )}:${A(c || [])}`,
    [c, s, d]
  );
  return $ ? /* @__PURE__ */ v(
    $,
    {
      value: e,
      content: W,
      references: i.options,
      placeholder: r,
      disabled: t,
      textEditable: o,
      autoFocus: f,
      className: a,
      layerZIndex: l,
      pickerScopes: H,
      pickerSearchPlaceholder: "搜索当前画布的内容或素材",
      loadReferences: i.loadReferences,
      loadPreview: z,
      providers: V,
      usageOptions: d,
      usageField: s,
      mediaUsageOptions: c,
      autoAssignUsage: p,
      showMediaAliases: !0,
      allowMultiMediaSelection: !0,
      pickerRequest: h,
      onPickerRequestConsumed: E,
      onReferenceDelete: M,
      onReferenceUsageChange: P,
      onChange: m,
      onBlur: C,
      onSubmit: w
    },
    G
  ) : /* @__PURE__ */ v(
    "textarea",
    {
      className: a,
      value: e,
      disabled: t,
      readOnly: !o,
      placeholder: r,
      onChange: (u) => m(u.target.value),
      onBlur: C,
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
  adapter: i,
  placeholder: r = "",
  className: t = ""
}) {
  const o = _(
    L
  ), f = K(
    (l) => j(l, i, o),
    [i, o]
  ), a = n ? Q(n, i.options) : D(e, i.options);
  return !S || !a?.parts.length ? /* @__PURE__ */ v("span", { className: t, children: e || r }) : /* @__PURE__ */ v("span", { className: `ws-canvas-reference-text ${t}`.trim(), children: /* @__PURE__ */ v(
    S,
    {
      content: a,
      fallback: e || r,
      references: i.options,
      showMediaAliases: !0,
      loadPreview: f
    }
  ) });
}
async function j(e, n, i) {
  const r = e.refType === "asset" ? i?.loadPreview : void 0;
  if (!r)
    return n.loadPreview(e);
  try {
    const t = await r(e);
    if (t.media.length > 0 || t.content != null)
      return {
        refType: "asset",
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
function Q(e, n) {
  const i = new Map(
    n.map((r) => [
      R(r.refType, r.refId),
      r.label
    ])
  );
  return {
    ...e,
    parts: e.parts.map(
      (r) => r.type === "reference" ? {
        ...r,
        label: Y(
          i.get(R(r.ref_type, r.ref_id)) || r.label
        )
      } : r
    )
  };
}
function X(e) {
  return g(() => {
    const n = Z(e), i = /* @__PURE__ */ new Map(), r = n.flatMap((t) => {
      const o = Number(t.refId || 0), f = Number(t.versionID || 0);
      if (o <= 0 || f <= 0)
        return [];
      const a = q(t, o);
      return i.set(
        R(a.refType, a.refId),
        t
      ), [a];
    });
    return {
      options: r,
      loadReferences: async (t) => ({
        items: t.scope === "current" ? ie(r, t.query) : []
      }),
      loadPreview: async (t) => ee(
        i.get(
          R(t.refType, t.refId)
        ),
        t
      )
    };
  }, [e]);
}
function Z(e) {
  const n = [], i = /* @__PURE__ */ new Set();
  for (const r of e) {
    const t = y(r.title);
    if (!t)
      continue;
    const o = `${r.source}:${r.id}`;
    i.has(o) || (i.add(o), n.push({ ...r, title: t }));
  }
  return n;
}
function q(e, n) {
  const i = O(e);
  return {
    key: `canvas:${e.source}:${e.id}`,
    refType: "asset",
    refId: n,
    versionID: Number(e.versionID || 0) || void 0,
    label: y(e.title),
    description: T(e),
    preview: {
      text: T(e),
      kind: i[0]?.kind || e.kind,
      url: i[0]?.url || ""
    },
    mediaCount: i.length
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
  const i = O(e);
  return {
    refType: n.refType,
    refId: n.refId,
    title: y(e.title),
    text: T(e),
    media: i,
    content: i.length > 0 ? void 0 : e.output
  };
}
function R(e, n) {
  return `${e}:${n}`;
}
function O(e) {
  const n = F(e.kind), i = ne(e.output, n), r = re(e), t = i.length > 0 ? i : r, o = y(e.title), f = /* @__PURE__ */ new Set(), a = t.flatMap((s) => {
    const c = s.url.trim(), p = `${s.kind}:${c}`;
    return !c || f.has(p) ? [] : (f.add(p), [{ ...s, url: c }]);
  }), l = a.reduce((s, c) => (s.set(c.kind, (s.get(c.kind) || 0) + 1), s), /* @__PURE__ */ new Map()), d = /* @__PURE__ */ new Map();
  return a.map((s) => {
    const c = (d.get(s.kind) || 0) + 1;
    return d.set(s.kind, c), {
      kind: s.kind,
      url: s.url,
      index: c,
      label: (l.get(s.kind) || 0) > 1 ? `${o} · ${te(s.kind)} ${c}` : o
    };
  });
}
function ne(e, n) {
  const r = ["image", "video", "audio"].flatMap(
    (o) => B(e, o).map((f) => ({ kind: o, url: f }))
  );
  if (!n || n === "file")
    return r;
  const t = r.filter(
    (o) => o.kind === n
  );
  return t.length > 0 ? t : r;
}
function re(e) {
  const n = [
    { kind: "image", url: e.preview.imageUrl },
    { kind: "video", url: e.preview.videoUrl },
    { kind: "audio", url: e.preview.audioUrl },
    { kind: "file", url: e.preview.fileUrl }
  ], i = F(e.kind), r = i ? n.filter((t) => t.kind === i && t.url) : [];
  return r.length > 0 ? r : n.filter((t) => t.url);
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
function ie(e, n) {
  const i = n.trim().toLowerCase();
  return i ? e.filter(
    (r) => [r.label, r.description, r.preview?.kind].some(
      (t) => String(t || "").toLowerCase().includes(i)
    )
  ) : e;
}
function y(e) {
  return String(e || "").trim().replace(/^@+/, "");
}
export {
  fe as C,
  de as a,
  J as b,
  X as u
};
