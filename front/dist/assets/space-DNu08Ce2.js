import { c as S, j as y } from "./createLucideIcon-CEtb6KSk.js";
import { c as N, C as P, E as V, g as W } from "./runtime-entry-CIrzyMsA.js";
const z = [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
], ue = S("arrow-up", z);
const H = [
  ["circle", { cx: "6", cy: "6", r: "3", key: "1lh9wr" }],
  ["path", { d: "M8.12 8.12 12 12", key: "1alkpv" }],
  ["path", { d: "M20 4 8.12 15.88", key: "xgtan2" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["path", { d: "M14.8 14.8 20 20", key: "ptml3r" }]
], le = S("scissors", H);
function de(e, n, r, t, i) {
  if (!n || !r || n === r)
    return e;
  const s = e.findIndex((l) => i(l) === n);
  if (s < 0)
    return e;
  const o = [...e], [f] = o.splice(s, 1), u = o.findIndex((l) => i(l) === r);
  return u < 0 ? e : (o.splice(u + (t === "after" ? 1 : 0), 0, f), o);
}
function ge(e, n, r) {
  if (!n.length)
    return e;
  const t = new Map(e.map((o) => [r(o), o])), i = [];
  for (const o of n)
    t.has(o) && i.push(t.get(o));
  const s = new Set(i.map(r));
  return [
    ...i,
    ...e.filter((o) => !s.has(r(o)))
  ];
}
function pe(e, n) {
  return e.length === n.length && e.every((r, t) => r === n[t]);
}
function k(e, n) {
  const r = String(e || ""), t = Q(n);
  if (!r || t.length === 0)
    return {
      version: 1,
      parts: r ? [{ type: "text", text: r }] : []
    };
  const i = [];
  let s = 0;
  for (; s < r.length; ) {
    const o = X(r, s, t);
    if (!o) {
      I(i, r.slice(s));
      break;
    }
    o.index > s && I(i, r.slice(s, o.index)), i.push({
      type: "reference",
      ref_type: o.target.refType,
      ref_id: o.target.refId,
      label: p(o.target.label),
      usage: o.target.usage,
      ref_trigger: o.target.trigger || "@",
      ref_version_id: o.target.versionId,
      ref_origin: o.target.origin,
      ref_origin_id: o.target.originID
    }), s = o.index + o.target.mention.length;
  }
  return { version: 1, parts: i };
}
function U(e, n) {
  return k(
    e,
    Y(n)
  );
}
function ve(e, n) {
  const r = A(
    n,
    m
  ), t = k(e, r), i = new Set(
    K(t).map(
      m
    )
  ), s = r.filter(
    (f) => !i.has(m(f))
  );
  if (!s.length)
    return t;
  const o = [];
  for (let f = 0; f < s.length; f += 1)
    Z(
      o,
      s[f],
      f === s.length - 1 ? t.parts[0] : void 0
    );
  return { version: 1, parts: [...o, ...t.parts] };
}
function G(e) {
  return !!e?.parts.some((n) => n.type === "reference");
}
function ye(e, n, r) {
  if (!n || !e.includes("@") && !e.includes("#"))
    return n;
  const t = k(e, [
    ...K(n),
    ...r
  ]);
  return G(t) ? t : n;
}
function K(e) {
  return e ? e.parts.filter((n) => n.type === "reference").map(
    (n) => ({
      refType: n.ref_type,
      refId: n.ref_id,
      label: p(n.label),
      usage: n.usage,
      trigger: n.ref_trigger === "#" ? "#" : "@",
      versionId: n.ref_version_id,
      origin: n.ref_origin,
      originID: n.ref_origin_id
    })
  ) : [];
}
function J(e) {
  return e ? e.parts.map(
    (n) => n.type === "text" ? n.text : `${n.ref_trigger === "#" ? "#" : "@"}${p(n.label)}`
  ).join("") : "";
}
function he(e, n, r) {
  const t = A(
    r.filter(
      (c) => c.origin === "edge" && !!c.originID
    ),
    (c) => String(c.originID || "")
  ), i = new Map(
    t.map((c) => [String(c.originID), c])
  ), s = n?.version === 1 ? n.parts : e ? [{ type: "text", text: e }] : [], o = [], f = /* @__PURE__ */ new Set();
  let u = !1;
  for (const c of s) {
    if (c.type === "reference" && c.ref_origin === "edge" && c.ref_origin_id) {
      const a = i.get(c.ref_origin_id);
      if (!a) {
        u = !0;
        continue;
      }
      C(o, a), f.add(c.ref_origin_id), u = !1;
      continue;
    }
    if (c.type === "text") {
      let a = c.text;
      if (u && /^\s/.test(a)) {
        const g = o[o.length - 1];
        (!g || g.type === "text" && /\s$/.test(g.text)) && (a = a.slice(1));
      }
      I(o, a), u = !1;
      continue;
    }
    o.push({ ...c }), u = !1;
  }
  const l = t.filter(
    (c) => !f.has(String(c.originID))
  );
  if (l.length > 0) {
    const c = [];
    l.forEach((a, g) => {
      C(c, a), O(
        c,
        g === l.length - 1 ? o[0] : void 0
      );
    }), o.unshift(...c);
  }
  const v = { version: 1, parts: o };
  return {
    value: J(v),
    content: v
  };
}
function p(e) {
  return e.trim().replace(/^[@#]+/, "").trim();
}
function Q(e) {
  const n = /* @__PURE__ */ new Map();
  for (const r of e) {
    if (r.refId <= 0)
      continue;
    const t = r.trigger || "@", i = p(r.label);
    if (!i)
      continue;
    const s = `${t}${i}`;
    n.has(s) || n.set(s, { ...r, mention: s });
  }
  return [...n.values()].sort(
    (r, t) => t.mention.length - r.mention.length
  );
}
function X(e, n, r) {
  let t;
  for (const i of r) {
    const s = e.indexOf(i.mention, n);
    s < 0 || (!t || s < t.index || s === t.index && i.mention.length > t.target.mention.length) && (t = { index: s, target: i });
  }
  return t;
}
function I(e, n) {
  if (!n)
    return;
  const r = e[e.length - 1];
  if (r?.type === "text") {
    r.text += n;
    return;
  }
  e.push({ type: "text", text: n });
}
function A(e, n = B) {
  const r = [], t = /* @__PURE__ */ new Set();
  for (const i of e) {
    if (i.refId <= 0 || !p(i.label))
      continue;
    const s = n(i);
    t.has(s) || (t.add(s), r.push(i));
  }
  return r;
}
function Y(e) {
  const n = /* @__PURE__ */ new Map();
  for (const r of e) {
    const t = p(r.label);
    if (r.refId <= 0 || !t)
      continue;
    const i = `${r.trigger || "@"}${t}`, s = m(r), o = n.get(i);
    if (!o) {
      n.set(i, {
        target: r,
        targetKey: s,
        ambiguous: !1
      });
      continue;
    }
    o.targetKey !== s && (o.ambiguous = !0);
  }
  return [...n.values()].filter((r) => !r.ambiguous).map((r) => r.target);
}
function m(e) {
  return `${B(e)}:${e.usage || ""}`;
}
function B(e) {
  return e.originID ? `${e.refType}:${e.refId}:${e.origin || ""}:${e.originID}` : `${e.refType}:${e.refId}`;
}
function C(e, n) {
  e.push({
    type: "reference",
    ref_type: n.refType,
    ref_id: n.refId,
    label: p(n.label),
    usage: n.usage,
    ref_trigger: n.trigger || "@",
    ref_version_id: n.versionId,
    ref_origin: n.origin,
    ref_origin_id: n.originID
  });
}
function Z(e, n, r) {
  C(e, n), O(e, r);
}
function O(e, n) {
  n?.type === "text" && /^\s/.test(n.text) || I(e, " ");
}
const E = W(
  "@/components/reference-composer"
), D = E.ReferenceEditor, M = E.ReferenceContentView, L = V(void 0);
function xe({
  value: e,
  content: n,
  items: r,
  placeholder: t,
  disabled: i,
  textEditable: s,
  autoFocus: o,
  className: f,
  layerZIndex: u,
  usageOptions: l = [],
  pickerRequest: v,
  onPickerRequestConsumed: c,
  onReferenceDelete: a,
  onReferenceUsageChange: g,
  onChange: x,
  onSubmit: h,
  assetReferenceProvider: _
}) {
  const T = ne(r);
  return /* @__PURE__ */ y(
    q,
    {
      value: e,
      content: n,
      adapter: T,
      placeholder: t,
      disabled: i,
      textEditable: s,
      autoFocus: o,
      className: f,
      layerZIndex: u,
      usageOptions: l,
      pickerRequest: v,
      onPickerRequestConsumed: c,
      onReferenceDelete: a,
      onReferenceUsageChange: g,
      onChange: x,
      onSubmit: h,
      assetReferenceProvider: _
    }
  );
}
function q({
  value: e,
  content: n,
  adapter: r,
  placeholder: t,
  disabled: i,
  textEditable: s = !0,
  autoFocus: o,
  className: f,
  layerZIndex: u,
  usageOptions: l = [],
  pickerRequest: v,
  onPickerRequestConsumed: c,
  onReferenceDelete: a,
  onReferenceUsageChange: g,
  onChange: x,
  onSubmit: h,
  assetReferenceProvider: _
}) {
  const T = P(
    L
  ), $ = _ || T, j = n || U(e, r.options), F = l.map(
    (d) => [
      d.key,
      d.label,
      d.maxFiles || 0,
      ...d.acceptedKinds || []
    ].join(":")
  ).join("|");
  return D ? /* @__PURE__ */ y(
    D,
    {
      value: e,
      content: j,
      references: r.options,
      placeholder: t,
      disabled: i,
      textEditable: s,
      autoFocus: o,
      className: f,
      layerZIndex: u,
      pickerScopes: ["current"],
      pickerSearchPlaceholder: "搜索当前画布的内容或素材",
      loadReferences: r.loadReferences,
      loadPreview: r.loadPreview,
      providers: $ ? [$] : void 0,
      usageOptions: l,
      pickerRequest: v,
      onPickerRequestConsumed: c,
      onReferenceDelete: a,
      onReferenceUsageChange: g,
      onChange: x,
      onSubmit: h
    },
    F
  ) : /* @__PURE__ */ y(
    "textarea",
    {
      className: f,
      value: e,
      disabled: i,
      readOnly: !s,
      placeholder: t,
      onChange: (d) => x(d.target.value),
      onKeyDown: (d) => {
        h && (d.metaKey || d.ctrlKey) && d.key === "Enter" && (d.preventDefault(), h());
      }
    }
  );
}
function me({
  value: e,
  content: n,
  adapter: r,
  placeholder: t = "",
  className: i = ""
}) {
  const s = P(
    L
  ), o = n ? ee(n, r.options) : U(e, r.options);
  return !M || !o?.parts.length ? /* @__PURE__ */ y("span", { className: i, children: e || t }) : /* @__PURE__ */ y("span", { className: `ws-canvas-reference-text ${i}`.trim(), children: /* @__PURE__ */ y(
    M,
    {
      content: o,
      fallback: e || t,
      references: r.options,
      loadPreview: (f) => f.refType === "asset" && s?.loadPreview ? s.loadPreview(f) : r.loadPreview(f)
    }
  ) });
}
function ee(e, n) {
  const r = new Map(
    n.map((t) => [
      w(t.refType, t.refId),
      t.label
    ])
  );
  return {
    ...e,
    parts: e.parts.map(
      (t) => t.type === "reference" ? {
        ...t,
        label: p(
          r.get(w(t.ref_type, t.ref_id)) || t.label
        )
      } : t
    )
  };
}
function ne(e) {
  return N(() => {
    const n = re(e), r = /* @__PURE__ */ new Map(), t = n.flatMap((i) => {
      const s = Number(i.refId || 0), o = Number(i.versionID || 0);
      if (s <= 0 || o <= 0)
        return [];
      const f = te(i, s);
      return r.set(
        w(f.refType, f.refId),
        i
      ), [f];
    });
    return {
      options: t,
      loadReferences: async (i) => ({
        items: i.scope === "current" ? ce(t, i.query) : []
      }),
      loadPreview: async (i) => ie(
        r.get(
          w(i.refType, i.refId)
        ),
        i
      )
    };
  }, [e]);
}
function re(e) {
  const n = [], r = /* @__PURE__ */ new Set();
  for (const t of e) {
    const i = R(t.title);
    if (!i)
      continue;
    const s = `${t.source}:${t.id}`;
    r.has(s) || (r.add(s), n.push({ ...t, title: i }));
  }
  return n;
}
function te(e, n) {
  return {
    key: `canvas:${e.source}:${e.id}`,
    refType: "asset",
    refId: n,
    versionID: Number(e.versionID || 0) || void 0,
    label: R(e.title),
    description: b(e),
    preview: {
      text: b(e),
      kind: e.kind,
      url: se(e)
    }
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
  const r = oe(e);
  return {
    refType: n.refType,
    refId: n.refId,
    title: R(e.title),
    text: b(e),
    media: r,
    content: r.length > 0 ? void 0 : e.output
  };
}
function w(e, n) {
  return `${e}:${n}`;
}
function oe(e) {
  return [
    { kind: "image", url: e.preview.imageUrl },
    { kind: "video", url: e.preview.videoUrl },
    { kind: "audio", url: e.preview.audioUrl },
    { kind: "file", url: e.preview.fileUrl }
  ].filter((r) => r.url).map((r) => ({
    ...r,
    label: R(e.title)
  }));
}
function se(e) {
  return e.preview.imageUrl || e.preview.videoUrl || e.preview.audioUrl || e.preview.fileUrl || "";
}
function b(e) {
  const n = String(e.preview.text || "").trim();
  return !n || n === e.title ? e.kind === "text" ? "画布文本内容" : "画布生成素材" : n.length > 160 ? `${n.slice(0, 160)}...` : n;
}
function ce(e, n) {
  const r = n.trim().toLowerCase();
  return r ? e.filter(
    (t) => [t.label, t.description, t.preview?.kind].some(
      (i) => String(i || "").toLowerCase().includes(r)
    )
  ) : e;
}
function R(e) {
  return String(e || "").trim().replace(/^@+/, "");
}
export {
  ue as A,
  me as C,
  le as S,
  q as a,
  ve as b,
  K as c,
  L as d,
  he as e,
  xe as f,
  J as g,
  G as h,
  de as m,
  p as n,
  ge as o,
  ye as r,
  pe as s,
  ne as u
};
