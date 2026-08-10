import { a as p } from "./_commonjsHelpers-CTFd9u1x.js";
import { m as G } from "./reference-composer-CvyqrYax.js";
import { d as R, j as A, b as K } from "./react-C7Xtl8sB.js";
import { c as _, a as Y, n as B } from "./space-ordered-list-C1oWfuUW.js";
import { C as L } from "./node-detail-storyboard-grid-Cwlx2Bai.js";
const H = ["current"], N = [], D = G, T = D.ReferenceEditor, $ = D.ReferenceContentView;
function de({
  value: e,
  content: n,
  items: i,
  placeholder: r,
  disabled: t,
  textEditable: o,
  autoFocus: f,
  className: a,
  layerZIndex: u,
  usageOptions: d = N,
  usageField: s = "usage",
  mediaUsageOptions: c,
  autoAssignUsage: v = !0,
  pickerRequest: E,
  onPickerRequestConsumed: P,
  onReferenceDelete: h,
  onReferenceUsageChange: I,
  onChange: C,
  onBlur: m,
  onSubmit: w,
  assetReferenceProvider: M
}) {
  const x = X(i);
  return /* @__PURE__ */ p(
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
      layerZIndex: u,
      usageOptions: d,
      usageField: s,
      mediaUsageOptions: c,
      autoAssignUsage: v,
      pickerRequest: E,
      onPickerRequestConsumed: P,
      onReferenceDelete: h,
      onReferenceUsageChange: I,
      onChange: C,
      onBlur: m,
      onSubmit: w,
      assetReferenceProvider: M
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
  layerZIndex: u,
  usageOptions: d = N,
  usageField: s = "usage",
  mediaUsageOptions: c,
  autoAssignUsage: v = !0,
  pickerRequest: E,
  onPickerRequestConsumed: P,
  onReferenceDelete: h,
  onReferenceUsageChange: I,
  onChange: C,
  onBlur: m,
  onSubmit: w,
  assetReferenceProvider: M
}) {
  const x = A(
    L
  ), k = M || x, V = R(
    () => k ? [k] : void 0,
    [k]
  ), z = K(
    (l) => U(l, i, k),
    [k, i]
  ), F = R(
    () => n || _(e, i.options),
    [i.options, n, e]
  ), W = R(
    () => `${s}:${S(
      d
    )}:${S(c || [])}`,
    [c, s, d]
  );
  return T ? /* @__PURE__ */ p(
    T,
    {
      value: e,
      content: F,
      references: i.options,
      placeholder: r,
      disabled: t,
      textEditable: o,
      autoFocus: f,
      className: a,
      layerZIndex: u,
      pickerScopes: H,
      pickerSearchPlaceholder: "搜索当前画布的内容或素材",
      loadReferences: i.loadReferences,
      loadPreview: z,
      providers: V,
      usageOptions: d,
      usageField: s,
      mediaUsageOptions: c,
      autoAssignUsage: v,
      showMediaAliases: !0,
      allowMultiMediaSelection: !0,
      pickerRequest: E,
      onPickerRequestConsumed: P,
      onReferenceDelete: h,
      onReferenceUsageChange: I,
      onChange: C,
      onBlur: m,
      onSubmit: w
    },
    W
  ) : /* @__PURE__ */ p(
    "textarea",
    {
      className: a,
      value: e,
      disabled: t,
      readOnly: !o,
      placeholder: r,
      onChange: (l) => C(l.target.value),
      onBlur: m,
      onKeyDown: (l) => {
        w && (l.metaKey || l.ctrlKey) && l.key === "Enter" && (l.preventDefault(), w());
      }
    }
  );
}
function S(e) {
  return e.map(
    (n) => [
      n.key,
      n.label,
      n.maxFiles || 0,
      ...n.acceptedKinds || []
    ].join(":")
  ).join("|");
}
function le({
  value: e,
  content: n,
  adapter: i,
  placeholder: r = "",
  className: t = ""
}) {
  const o = A(
    L
  ), f = K(
    (u) => U(u, i, o),
    [i, o]
  ), a = n ? Q(n, i.options) : _(e, i.options);
  return !$ || !a?.parts.length ? /* @__PURE__ */ p("span", { className: t, children: e || r }) : /* @__PURE__ */ p("span", { className: `ws-canvas-reference-text ${t}`.trim(), children: /* @__PURE__ */ p(
    $,
    {
      content: a,
      fallback: e || r,
      references: i.options,
      showMediaAliases: !0,
      loadPreview: f
    }
  ) });
}
async function U(e, n, i) {
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
      g(r.refType, r.refId),
      r.label
    ])
  );
  return {
    ...e,
    parts: e.parts.map(
      (r) => r.type === "reference" ? {
        ...r,
        label: B(
          i.get(g(r.ref_type, r.ref_id)) || r.label
        )
      } : r
    )
  };
}
function X(e) {
  return R(() => {
    const n = Z(e), i = /* @__PURE__ */ new Map(), r = n.flatMap((t) => {
      const o = Number(t.refId || 0), f = Number(t.versionID || 0);
      if (o <= 0 || f <= 0)
        return [];
      const a = q(t, o);
      return i.set(
        g(a.refType, a.refId),
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
          g(t.refType, t.refId)
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
  const i = j(e);
  return {
    key: `canvas:${e.source}:${e.id}`,
    refType: "asset",
    refId: n,
    versionID: Number(e.versionID || 0) || void 0,
    label: y(e.title),
    description: b(e),
    preview: {
      text: b(e),
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
  const i = j(e);
  return {
    refType: n.refType,
    refId: n.refId,
    title: y(e.title),
    text: b(e),
    media: i,
    content: i.length > 0 ? void 0 : e.output
  };
}
function g(e, n) {
  return `${e}:${n}`;
}
function j(e) {
  const n = O(e.kind), i = ne(e.output, n), r = re(e), t = i.length > 0 ? i : r, o = y(e.title), f = /* @__PURE__ */ new Set(), a = t.flatMap((s) => {
    const c = s.url.trim(), v = `${s.kind}:${c}`;
    return !c || f.has(v) ? [] : (f.add(v), [{ ...s, url: c }]);
  }), u = a.reduce((s, c) => (s.set(c.kind, (s.get(c.kind) || 0) + 1), s), /* @__PURE__ */ new Map()), d = /* @__PURE__ */ new Map();
  return a.map((s) => {
    const c = (d.get(s.kind) || 0) + 1;
    return d.set(s.kind, c), {
      kind: s.kind,
      url: s.url,
      index: c,
      label: (u.get(s.kind) || 0) > 1 ? `${o} · ${te(s.kind)} ${c}` : o
    };
  });
}
function ne(e, n) {
  const r = ["image", "video", "audio"].flatMap(
    (o) => Y(e, o).map((f) => ({ kind: o, url: f }))
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
  ], i = O(e.kind), r = i ? n.filter((t) => t.kind === i && t.url) : [];
  return r.length > 0 ? r : n.filter((t) => t.url);
}
function O(e) {
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
function b(e) {
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
  de as C,
  le as a,
  J as b,
  X as u
};
