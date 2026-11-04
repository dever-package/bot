import { k as de, J as xe, a as fe } from "./content-view-0gIO2Kkv.js";
import { aq as Ie, ad as Ce, ac as Oe, ar as Fe, C as Ue } from "./asset-preview-D6nljO8_.js";
import { i as Ne } from "./space-loading-FH4pJ97O.js";
import { d as se } from "./space-reference-content-K_sxMShu.js";
const me = /* @__PURE__ */ new Set([
  "image",
  "video",
  "audio",
  "file"
]);
function mn(e) {
  return e.type === "file" || e.type === "files";
}
function $e(e) {
  return e.type === "prompt";
}
function ln(e) {
  return ![
    "hidden",
    "description",
    "prompt",
    "file",
    "files"
  ].includes(e.type);
}
function gn(e) {
  const n = Array.from(
    new Set(
      (e.accepted_kinds || e.asset_kinds || []).map(ee).filter((t) => !!t)
    )
  );
  return n.length > 0 ? n : [];
}
function Ae(e) {
  return (e.accepted_kinds || []).map(ee).filter(
    (n) => !!n && me.has(n)
  );
}
function A(e) {
  const n = ee(e);
  return n && me.has(n) ? n : void 0;
}
function Ke(e) {
  return e.type !== "files" ? 1 : Math.max(0, Number(e.max_files || 0));
}
function ee(e) {
  const n = String(e || "").toLowerCase();
  return n === "rich" ? "richtext" : n === "music" ? "audio" : [
    "collection",
    "text",
    "image",
    "audio",
    "video",
    "richtext",
    "file"
  ].includes(n) ? n : void 0;
}
function Ee(e, n) {
  return !!(e && Ne(e.source_rule) && n > 0 && !e.sources.some(
    (t) => t.target_id === n || t.id === n
  ));
}
function _n(e, n) {
  return Ee(e, n.selectedTargetId || 0) ? n.paramValues || {} : Be(e.params || [], n);
}
function De(e) {
  const n = e.default_value ?? "";
  if (e.type === "switch")
    return ze(n);
  if (e.type === "multi_option")
    return ne(e, oe(n));
  if (e.type === "files")
    return re(oe(n));
  if (e.type === "option" || e.type === "select") {
    const t = k(e.options || [], n) || e.options?.[0];
    return E(
      e,
      S(t) || n
    );
  }
  return E(e, n);
}
function le(e) {
  const n = {};
  for (const t of e)
    !t.key || t.type === "description" || t.defer_default || (n[t.key] = De(t));
  return n;
}
function pn(e) {
  const n = [], t = /* @__PURE__ */ new Map();
  for (const r of e) {
    if (!r.group) {
      n.push({ key: `param:${r.key}`, param: r });
      continue;
    }
    let i = t.get(r.group.id);
    i || (i = { key: `group:${r.group.id}`, group: r.group, params: [] }, t.set(r.group.id, i), n.push(i)), i.params.push(r);
  }
  return n;
}
function yn(e, n, t) {
  const r = le(e), i = new Map(
    t.map((s) => [s.key, s])
  );
  for (const s of e) {
    const o = i.get(s.key);
    s.key && o && Object.prototype.hasOwnProperty.call(n, s.key) && Le(s, o, n[s.key]) && (r[s.key] = ne(s, n[s.key]));
  }
  return r;
}
function Be(e, n) {
  const t = le(e), r = n.paramValues || {};
  for (const s of e)
    s.key && Object.prototype.hasOwnProperty.call(r, s.key) && (t[s.key] = ne(
      s,
      r[s.key]
    ));
  const i = e.find($e);
  return i?.key && n.prompt?.trim() && (t[i.key] = n.prompt), Ve(e, t, void 0, r);
}
function E(e, n) {
  if (e.value_type !== "number" || n === "")
    return n;
  const t = Number(n);
  return Number.isFinite(t) ? t : n;
}
function Ve(e, n, t, r = n) {
  const i = { ...n };
  for (const s of e) {
    const o = s.option_filter_key;
    if (!o) continue;
    const u = e.find((d) => d.key === o);
    if (!u) continue;
    const a = k(s.options || [], n[s.key]);
    if (!Object.prototype.hasOwnProperty.call(r, o) && a?.group) {
      const d = k(u.options || [], a.group);
      d && (i[o] = S(d));
    }
    if ((t === o || !Object.prototype.hasOwnProperty.call(r, s.key)) && a?.group !== String(i[o] || "")) {
      const d = (s.options || []).find((g) => g.group === String(i[o] || ""));
      i[s.key] = d ? S(d) : "";
    }
  }
  return i;
}
function ne(e, n) {
  if (e.type === "option" || e.type === "select") {
    const t = k(e.options || [], n) || k(e.options || [], e.default_value) || e.options?.[0];
    return E(
      e,
      S(t) || n
    );
  }
  return e.type === "multi_option" ? re(n).map((t) => {
    const r = k(e.options || [], t);
    return E(
      e,
      S(r) || t
    );
  }) : E(e, n);
}
function Le(e, n, t) {
  if (e.type !== n.type || e.value_type !== n.value_type)
    return !1;
  if (e.type === "option" || e.type === "select") {
    const r = e.options || [];
    return r.length === 0 || !!k(r, t);
  }
  if (e.type === "multi_option") {
    const r = e.options || [];
    return r.length === 0 || re(t).every(
      (i) => !!k(r, i)
    );
  }
  return e.value_type === "number" ? t === "" || Number.isFinite(Number(t)) : !0;
}
function S(e) {
  return e ? String(e.native_value || "").trim() || String(e.value || "").trim() || String(e.name || "").trim() || String(e.id || "") : "";
}
function k(e, n) {
  const t = String(n ?? "").trim();
  if (!t)
    return;
  const r = [
    (i) => i.native_value,
    (i) => i.value,
    (i) => i.name,
    (i) => i.id
  ];
  for (const i of r) {
    const s = e.find(
      (o) => String(i(o) ?? "").trim() === t
    );
    if (s)
      return s;
  }
}
function hn(e, n, t = [e]) {
  return n.some(
    (r) => k(t, r) === e
  );
}
function oe(e) {
  if (typeof e != "string")
    return e;
  try {
    return JSON.parse(e);
  } catch {
    return e;
  }
}
function re(e) {
  return Array.isArray(e) ? e.map((n) => String(n)).filter(Boolean) : typeof e == "string" ? e ? [e] : [] : e ? [String(e)] : [];
}
function ze(e) {
  if (typeof e == "boolean")
    return e;
  const n = String(e ?? "").trim().toLowerCase();
  return n === "1" || n === "true" || n === "yes" || n === "on";
}
await window.DeverFront?.ensureCompat?.(["@/components/agent/stream-request-params", "@/components/searchable-option-picker"]);
const J = window.DeverFront?.sdk?.getCompatModule("@/components/agent/stream-request-params");
if (!J || Object.keys(J).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
const H = window.DeverFront?.sdk?.getCompatModule("@/components/searchable-option-picker");
if (!H || Object.keys(H).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/searchable-option-picker");
const V = J, ge = V.filterActivePowerParams || ((e) => e), vn = V.isPowerParamConditionController || (() => !1), kn = V.shouldDisplayPowerParam || (() => !0), bn = H.SearchableOptionPicker, wn = V.PowerParamOptionDialog, Pn = V.normalizeParamPreviewType;
function B(e, n, t = []) {
  return (e?.parts || []).filter((r) => {
    if (r.type !== "reference") return !1;
    const i = t.find(
      ({ edge: s }) => s.id === r.ref_origin_id
    );
    return (i ? b(i.source) : A(
      z(n, r)?.kind
    )) === "image";
  });
}
function w(e) {
  return `${e.ref_type}:${e.ref_id}:${e.ref_version_id || 0}:${e.ref_origin_id || ""}`;
}
function ae(e, n, t) {
  const r = e.find(pe);
  return `${r ? S(
    k(r.options || [], n[r.key])
  ) : "default"}:${t}`;
}
function Te(e, n, t, r, i) {
  return {
    ...e,
    [n]: {
      version: 1,
      parts: B(t, r, i)
    }
  };
}
function Mn({
  content: e,
  items: n,
  connections: t,
  params: r,
  previousValues: i,
  nextValues: s,
  previousMode: o,
  nextMode: u,
  selections: a
}) {
  const d = Te(
    a,
    ae(r, i, o),
    e,
    n,
    t
  ), g = ae(r, s, u), f = new Map(
    B(d[g], n, t).map((m) => [
      w(m),
      m
    ])
  ), c = new Set(
    B(e, n, t)
  ), l = ye(
    ge(r, s)
  ), _ = U(l, "image", u), y = u === "shared_reference" && _.some(I);
  return { content: e && {
    ...e,
    parts: e.parts.map((m) => {
      if (m.type !== "reference" || !c.has(m)) return m;
      const h = f.get(w(m));
      if (h)
        return {
          ...m,
          usage: h.usage,
          ref_media_url: h.ref_media_url,
          ref_media_index: h.ref_media_index,
          ref_media_items: h.ref_media_items,
          ref_media_excluded: h.ref_media_excluded
        };
      if (d[g])
        return {
          ...m,
          usage: void 0,
          ref_media_url: void 0,
          ref_media_index: void 0,
          ref_media_items: [],
          ref_media_excluded: !0
        };
      if (y) {
        const M = m.ref_media_items?.length === 1 ? m.ref_media_items[0] : m.ref_media_url || m.ref_media_index ? {
          url: m.ref_media_url || "",
          index: m.ref_media_index || 0
        } : m.ref_media_count === 1 ? { url: "", index: 1 } : void 0, C = _.find(
          (O) => F(O.key)
        )?.key;
        return {
          ...m,
          usage: void 0,
          ref_media_url: void 0,
          ref_media_index: void 0,
          ref_media_items: M && C ? [{ ...M, usage: C }] : [],
          ref_media_excluded: !M
        };
      }
      const N = _[0]?.key;
      return {
        ...m,
        usage: N,
        ref_media_excluded: void 0,
        ref_media_items: m.ref_media_items?.map((M) => ({
          ...M,
          usage: void 0
        }))
      };
    })
  }, selections: d };
}
function _e(e) {
  return e.flatMap((n) => n.ref_media_excluded ? [] : (n.ref_media_items?.length ? n.ref_media_items : n.ref_media_url || n.ref_media_index ? [
    {
      url: n.ref_media_url || "",
      index: n.ref_media_index || 0,
      usage: n.usage
    }
  ] : n.ref_media_count === 1 && n.usage ? [{ url: "", index: 1, usage: n.usage }] : []).filter((r) => r.usage && he(r.usage)).map((r) => ({ part: n, media: r })));
}
function Sn(e, n, t, r) {
  const i = _e(n);
  if (r && i.find(
    (u) => u.media.usage !== t && w(u.part) === w(r.part) && (u.media.url ? u.media.url === r.media.url : u.media.index === r.media.index)
  ))
    throw new Error("这张图片已用于另一个位置，请先取消原有选择");
  const o = new Set(n.map(w));
  return {
    ...e,
    parts: e.parts.map((u) => {
      if (u.type !== "reference" || !o.has(w(u)))
        return u;
      const a = w(u), d = i.filter(
        (g) => w(g.part) === a && g.media.usage !== t
      ).map((g) => g.media);
      return r && a === w(r.part) && d.push({ ...r.media, usage: t }), {
        ...u,
        usage: void 0,
        ref_media_url: void 0,
        ref_media_index: void 0,
        ref_media_items: d,
        ref_media_excluded: d.length === 0
      };
    })
  };
}
const je = "referencemode", qe = "references";
function Rn({
  node: e,
  content: n,
  items: t,
  connections: r,
  params: i,
  values: s,
  requestedMode: o,
  additionalSources: u = []
}) {
  const a = ye(
    ge(i, s)
  ), d = e.outputType || e.power?.outputType;
  return Qe({
    targetKind: d && d !== "general" ? void 0 : b(e) || e.power?.kind || e.kind,
    content: n,
    items: t,
    connections: r,
    mediaOptions: a,
    requestedMode: o,
    additionalSources: u
  });
}
function xn(e, n) {
  return e.flatMap(({ edge: t, source: r }) => {
    const i = Me(n, r), s = Number(
      i?.refId || r.asset?.id || r.resultRef?.asset_id || 0
    );
    return s <= 0 ? [] : [
      {
        refType: "asset",
        refId: s,
        versionId: Number(
          i?.versionID || r.asset?.version?.id || r.asset?.version_id || r.resultRef?.version_id || 0
        ),
        label: Pe(r, i),
        usage: String(t.mediaUsage || ""),
        trigger: "@",
        origin: "edge",
        originID: t.id,
        contentSelection: i?.contentSelection,
        mediaCount: R(r)
      }
    ];
  });
}
function b(e) {
  if (!e)
    return;
  const n = [e.kind, e.asset?.kind, e.power?.kind], t = [e.asset?.version?.content, e.resultOutput];
  if (de(t)?.frames.some((s) => !!s.image))
    return "image";
  let i = !1;
  for (const s of n) {
    const o = A(s);
    if (o === "file") {
      i = !0;
      continue;
    }
    if (o)
      return o;
  }
  return i && Je(t) ? "file" : void 0;
}
function Ge(e) {
  return !!b(e);
}
function Je(e) {
  return e.some(
    (n) => Q(n, /* @__PURE__ */ new Set(), 0)
  );
}
function Q(e, n, t) {
  if (e == null || t > 10)
    return !1;
  if (typeof e == "string")
    return /^(?:https?:\/\/|\/|data:)/i.test(e.trim());
  if (Array.isArray(e))
    return e.some((i) => Q(i, n, t + 1));
  if (typeof e != "object" || n.has(e))
    return !1;
  n.add(e);
  const r = e;
  return [
    r.file,
    r.files,
    r.file_url,
    r.fileUrl,
    r.url,
    r.src,
    r.download,
    r.download_url,
    r.downloadUrl,
    r.open_url,
    r.path,
    r.output,
    r.result,
    r.data,
    r.content,
    r.body,
    r.value,
    r.json,
    r.media_files,
    r.mediaFiles
  ].some((i) => Q(i, n, t + 1));
}
function In(e, n, t) {
  return t.some((i) => {
    const s = b(i);
    return s === "video" || s === "audio";
  }) && He(
    e,
    n,
    qe
  ) || n;
}
function pe(e) {
  return L(e.key) === je;
}
function He(e, n, t) {
  const r = e.find(pe);
  if (!r?.key)
    return n;
  const i = k(
    r.options || [],
    t
  );
  if (!i)
    return;
  const s = k(
    r.options || [],
    n[r.key]
  );
  return S(s) === S(i) ? n : {
    ...n,
    [r.key]: S(i)
  };
}
function ye(e) {
  const n = e.flatMap((t) => {
    if (t.type !== "file" && t.type !== "files")
      return [];
    const r = String(t.key || "").trim(), i = Ae(t);
    return !r || i.length === 0 ? [] : [
      {
        key: r,
        label: String(t.name || r),
        maxFiles: Ke(t),
        acceptedKinds: i
      }
    ];
  });
  return D(
    n.map(
      (t) => I(t) ? { ...t, maxFiles: 1 } : t
    )
  );
}
function Cn(e) {
  return e.find((n) => F(n.key))?.key || "firstFrame";
}
function Qe({
  targetKind: e,
  content: n,
  items: t,
  connections: r,
  mediaOptions: i,
  requestedMode: s,
  additionalSources: o = []
}) {
  const u = Ye(
    n,
    t,
    r,
    o
  ), a = u.reduce(
    (p, Re) => p + Re.amount,
    0
  ), d = u.some((p) => F(p.usage)) && u.some((p) => T(p.usage)), g = A(e) === "video" && i.some((p) => p.acceptedKinds.includes("image")), f = U(
    i,
    "image",
    "per_image"
  ), c = U(
    i,
    "image",
    "shared_reference"
  ), l = f.length > 0, _ = c.some(I), y = (!_ || u.every((p) => p.amount === 1)) && Ze(c, a), v = c.length > 0, m = _ ? c.filter(I) : [], h = [
    {
      value: "per_image",
      label: "每图一条视频",
      enabled: l,
      reason: l ? void 0 : "当前能力没有可逐张接收图片的参数"
    },
    {
      value: "shared_reference",
      label: _ ? m.some((p) => T(p.key)) ? "首尾帧生成" : "首帧生成" : "多图共同参考",
      enabled: v,
      reason: v ? void 0 : _ ? "当前能力不能将这些图片作为同一次首尾帧输入" : "当前能力不能在一次请求中接收这些参考图片"
    }
  ];
  if (!g)
    return {
      active: !1,
      imageCount: a,
      structured: u.some((p) => p.structured),
      explicitFramePair: d,
      options: h,
      frameUsages: m,
      error: ""
    };
  const N = u.some((p) => p.structured), M = d && v ? "shared_reference" : N && l ? "per_image" : v && y ? "shared_reference" : "per_image", C = h.find(
    (p) => p.value === s
  ), O = C?.value || M, ie = h.some((p) => p.enabled);
  return {
    active: g,
    imageCount: a,
    structured: N,
    explicitFramePair: d,
    mode: ie ? O : void 0,
    defaultMode: M,
    options: h,
    frameUsages: m,
    error: ie ? C && !C.enabled ? C.reason || "当前能力不支持该生成方式" : O === "shared_reference" && _ && u.some(
      (p) => p.amount > 0 && T(p.usage)
    ) && !u.some(
      (p) => p.amount > 0 && F(p.usage)
    ) ? "选择尾帧时请同时选择首帧" : O === "shared_reference" && _ && a > 2 ? "首帧和尾帧各选择1张图片" : O === "shared_reference" && _ && a === 0 && u.length > 0 ? "请选择首帧图片" : O === "per_image" && a === 0 && u.length > 0 ? "请选择用于生成视频的图片" : "" : "当前能力无法接收这组图片素材"
  };
}
function Ye(e, n, t, r) {
  const i = new Map(
    t.map(
      (a) => [
        P(
          a.edge.id,
          x(a)
        ),
        a
      ]
    )
  ), s = /* @__PURE__ */ new Set(), o = [];
  for (const a of e?.parts || []) {
    if (a.type !== "reference" || !te(a.ref_type))
      continue;
    const d = a.ref_type === "asset" && a.ref_origin_id ? i.get(
      P(a.ref_origin_id, a.ref_id)
    ) : void 0, g = d ? Me(n, d.source) : z(n, a);
    if ((d ? b(d.source) : A(g?.kind)) !== "image")
      continue;
    d && s.add(
      P(
        d.edge.id,
        x(d)
      )
    );
    const c = d ? R(d.source) : q(g, "image", a.ref_media_count);
    o.push(
      ...Z(
        a,
        c,
        d?.edge.mediaUsage
      ).map((l) => ({
        amount: l.amount,
        usage: l.usage,
        structured: G(d?.source, g)
      }))
    );
  }
  for (const a of t) {
    const d = P(
      a.edge.id,
      x(a)
    );
    s.has(d) || b(a.source) !== "image" || o.push({
      amount: R(a.source),
      usage: String(a.edge.mediaUsage || ""),
      structured: G(a.source)
    });
  }
  const u = new Set(
    t.map((a) => a.source.id)
  );
  for (const a of r)
    u.has(a.id) || b(a) !== "image" || o.push({
      amount: R(a),
      usage: "",
      structured: G(a)
    });
  return o;
}
function G(e, n) {
  return !!(e?.storyboardItem?.itemType === "shot_image" || de([
    e?.asset?.version?.content,
    e?.resultOutput,
    n?.output,
    n?.asset
  ]));
}
function We(e, n) {
  return e.find((t) => t.key === n);
}
function F(e) {
  const n = L(e);
  return n === "firstframe" || n === "startframe";
}
function T(e) {
  const n = L(e);
  return n === "lastframe" || n === "endframe";
}
function he(e) {
  const n = L(e);
  return n === "firstframe" || n === "startframe" || n === "lastframe" || n === "endframe";
}
function Xe(e) {
  if (!e.acceptedKinds.includes("image"))
    return !1;
  const n = L(e.key);
  return ["images", "reference", "referenceimage", "referenceimages"].includes(
    n
  );
}
function D(e) {
  return e.map((n, t) => ({ option: n, index: t })).sort(
    (n, t) => ce(n.option) - ce(t.option) || n.index - t.index
  ).map(({ option: n }) => n);
}
function ce(e) {
  return Xe(e) ? 0 : F(e.key) ? 1 : T(e.key) ? 2 : 3;
}
function I(e) {
  return he(e.key);
}
function U(e, n, t) {
  const r = e.filter(
    (o) => o.acceptedKinds.includes(n)
  );
  if (n !== "image" || !t)
    return r;
  const i = r.filter((o) => !I(o));
  if (t === "shared_reference")
    return D(i.length > 0 ? i : r);
  const s = r.filter((o) => F(o.key));
  return s.length > 0 ? D(s) : D(i);
}
function On(e, n) {
  if (!n)
    return e;
  const t = /* @__PURE__ */ new Set();
  for (const r of ["image", "video", "audio", "file"])
    for (const i of U(
      e,
      r,
      n
    ))
      t.add(i);
  return e.filter((r) => t.has(r));
}
function Ze(e, n) {
  let t = n;
  for (const r of e) {
    const i = $(r);
    if (i <= 0 || (t -= i, t <= 0))
      return !0;
  }
  return !1;
}
function L(e) {
  return String(e || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
}
function Fn(e, n, t, r, i = {}, s = !1, o) {
  const u = new Map(
    (n?.parts || []).flatMap(
      (f) => f.type === "reference" && f.ref_type === "asset" && f.ref_origin === "edge" && f.ref_origin_id ? [
        [
          P(f.ref_origin_id, f.ref_id),
          f
        ]
      ] : []
    )
  ), a = e.flatMap(
    (f) => {
      const c = b(f.source);
      if (!c)
        return [];
      const l = R(f.source), _ = u.get(
        P(
          f.edge.id,
          x(f)
        )
      );
      return Z(
        _,
        l,
        nn(f, i)
      ).map((y, v) => ({
        referenceKey: `${sn(f)}:${v}`,
        label: tn(f),
        kind: c,
        ...y,
        required: !0
      }));
    }
  );
  for (const [f, c] of (n?.parts || []).entries()) {
    if (c.type !== "reference" || !te(c.ref_type) || c.ref_origin === "edge")
      continue;
    const l = z(t, c), _ = A(l?.kind);
    _ && a.push(
      ...Z(
        c,
        q(l, _, c.ref_media_count)
      ).map((y, v) => ({
        referenceKey: `${c.ref_type}:${c.ref_id}:${f}:${v}`,
        label: String(c.label || l?.title || "引用素材"),
        kind: _,
        ...y,
        required: s
      }))
    );
  }
  const d = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Set();
  for (const f of a) {
    if (f.amount === 0) continue;
    const c = `${f.referenceKey}:${f.usage}`;
    if (g.has(c))
      continue;
    g.add(c);
    const l = U(
      r,
      f.kind,
      o
    );
    if (l.length === 0) {
      if (f.required)
        return `当前能力未配置可接收${we(f.kind)}素材的参数`;
      continue;
    }
    const _ = We(l, f.usage);
    if (f.usage && !_)
      return `「${f.label}」的素材用途与当前能力参数不兼容`;
    const y = _ || (l.length === 1 ? l[0] : void 0);
    if (!y)
      return `请为「${f.label}」选择素材用途`;
    const v = f.kind === "image" && o === "per_image", m = v ? 1 : f.amount, h = $(y) > 0 ? Math.max(
      $(y) - (d.get(y.key) || 0),
      0
    ) : 0;
    if (!v && !f.mediaSelected && f.mediaCount > 1 && $(y) > 0 && f.mediaCount > h)
      return `「${f.label}」包含 ${f.mediaCount} 项素材，请从引用中选择具体素材`;
    if (!W(y, d, m))
      return `${y.label}参数最多接收 ${$(y)} 个素材`;
    v || j(d, y.key, m);
  }
  return "";
}
function Un(e, n, t, r, i = [], s) {
  const o = t.filter(Ge), u = o.flatMap((c) => {
    const l = b(c);
    return l ? [l] : [];
  }), a = D(
    n.filter(
      (c) => u.every(
        (l) => U([c], l, s).includes(
          c
        )
      )
    )
  );
  if (u.length === 0 || a.length === 0) {
    const c = u[0];
    return {
      usage: void 0,
      error: u.length > 1 ? "当前能力未配置可同时接收该分组媒体素材的参数" : `当前能力未配置可接收${we(c || "file")}素材的参数`
    };
  }
  if (s === "shared_reference" && u.every((c) => c === "image") && a.some(I))
    return { usage: a[0].key, error: "" };
  const d = en(
    e,
    n,
    r,
    i,
    s
  ), g = s === "per_image" && u.every((c) => c === "image") ? 1 : o.reduce(
    (c, l) => c + R(l),
    0
  ), f = ve(
    a,
    d,
    g
  );
  return f ? {
    usage: f.key,
    error: ""
  } : {
    usage: void 0,
    error: `${a[0].label}参数已达到素材数量上限`
  };
}
function Nn(e, n, t, r, i, s) {
  if (!n || r.length === 0)
    return { content: n, assignments: {} };
  if (s === "shared_reference" && r.some(I)) {
    const c = B(
      e,
      t,
      i
    ), l = new Set(c.map(w)), _ = new Set(B(n, t, i)), y = new Set(
      _e(c).map((m) => m.media.usage)
    ), v = n.parts.map((m) => {
      if (m.type !== "reference" || !_.has(m) || l.has(w(m)) || m.ref_media_excluded || m.ref_media_items?.length)
        return m;
      const h = m.usage || r.find((M) => F(M.key))?.key, N = q(
        z(t, m),
        "image",
        m.ref_media_count
      );
      return h && !y.has(h) && (m.ref_media_url || m.ref_media_index || N === 1) ? (y.add(h), { ...m, usage: h }) : {
        ...m,
        usage: void 0,
        ref_media_url: void 0,
        ref_media_index: void 0,
        ref_media_items: [],
        ref_media_excluded: !0
      };
    });
    return { content: { ...n, parts: v }, assignments: {} };
  }
  const o = new Map(
    Y(
      e,
      t,
      i,
      s
    ).map((c) => [c.key, c])
  ), a = [...Y(
    n,
    t,
    i,
    s
  )].sort((c, l) => {
    const _ = ue(
      c,
      o.get(c.key)
    ), y = ue(
      l,
      o.get(l.key)
    );
    return _ - y || c.partIndex - l.partIndex;
  }), d = n.parts.map((c) => ({ ...c })), g = {}, f = /* @__PURE__ */ new Map();
  for (const c of a) {
    if (c.amount === 0) continue;
    const l = o.get(c.key), _ = U(
      r,
      c.kind,
      s
    ), y = c.usage && c.usage !== l?.usage ? c.usage : "", m = ve(
      _,
      f,
      c.kind === "image" && s === "per_image" ? 1 : c.amount,
      y,
      l?.usage || c.usage
    )?.key || "";
    m && (c.kind === "image" && s === "per_image" || j(f, m, c.amount));
    const h = d[c.partIndex];
    h?.type === "reference" && (h.usage = m || void 0), c.connection && m !== String(c.connection.edge.mediaUsage || "") && (g[c.connection.edge.id] = m || void 0);
  }
  return { content: { ...n, parts: d }, assignments: g };
}
function en(e, n, t, r = [], i) {
  const s = /* @__PURE__ */ new Map(), o = Y(
    t,
    r,
    e,
    i
  ), u = /* @__PURE__ */ new Set();
  for (const a of o) {
    const d = n.find((g) => g.key === a.usage);
    d && !(a.kind === "image" && i === "per_image") && j(s, d.key, a.amount), a.connection && u.add(
      P(
        a.connection.edge.id,
        x(a.connection)
      )
    );
  }
  for (const a of e) {
    const d = P(
      a.edge.id,
      x(a)
    );
    if (u.has(d))
      continue;
    const g = String(a.edge.mediaUsage || ""), f = n.find((c) => c.key === g);
    f && !(b(a.source) === "image" && i === "per_image") && j(
      s,
      f.key,
      R(a.source)
    );
  }
  return s;
}
function nn(e, n) {
  return String(
    Object.prototype.hasOwnProperty.call(n, e.edge.id) ? n[e.edge.id] || "" : e.edge.mediaUsage || ""
  );
}
function Y(e, n, t, r) {
  if (!e)
    return [];
  const i = new Map(
    t.map((o) => [
      P(
        o.edge.id,
        x(o)
      ),
      o
    ])
  ), s = /* @__PURE__ */ new Map();
  return e.parts.flatMap((o, u) => {
    if (o.type !== "reference" || !te(o.ref_type))
      return [];
    const a = o.ref_type === "asset" && o.ref_origin_id ? i.get(
      P(o.ref_origin_id, o.ref_id)
    ) : void 0, d = z(n, o), g = a ? b(a.source) : A(d?.kind);
    if (!g)
      return [];
    const f = a ? `edge:${P(
      a.edge.id,
      x(a)
    )}` : `${o.ref_type}:${o.ref_id}:${o.ref_version_id || 0}`, c = s.get(f) || 0;
    return s.set(f, c + 1), [
      {
        key: a ? f : `${f}:${c}`,
        partIndex: u,
        kind: g,
        amount: o.ref_media_excluded ? 0 : g === "image" && r === "per_image" ? 1 : a ? X(
          o,
          R(a.source)
        ) : X(
          o,
          q(
            d,
            g,
            o.ref_media_count
          )
        ),
        usage: String(o.usage || ""),
        connection: a
      }
    ];
  });
}
function ue(e, n) {
  return e.usage && e.usage !== n?.usage ? 0 : n ? 1 : 2;
}
function ve(e, n, t, ...r) {
  for (const i of r) {
    const s = e.find((o) => o.key === i);
    if (s && W(s, n, t))
      return s;
  }
  return e.find(
    (i) => W(i, n, t)
  );
}
function $(e) {
  return I(e) ? 1 : e.maxFiles;
}
function W(e, n, t = 1) {
  const r = $(e);
  return r <= 0 || (n.get(e.key) || 0) + t <= r;
}
function j(e, n, t = 1) {
  e.set(n, (e.get(n) || 0) + t);
}
function ke(e, n) {
  return rn(e, n).map((t) => t.url);
}
function rn(e, n) {
  if (n === "image") {
    const t = xe(e);
    if (t.length > 0)
      return t.map((r) => ({ url: r, thumbnail: r }));
  }
  return Ie(e, n);
}
function R(e) {
  const n = b(e);
  return !e || !n || n === "file" ? 1 : Math.max(
    1,
    ke(
      [e.asset?.version?.content, e.resultOutput],
      n
    ).length
  );
}
function q(e, n, t = 0) {
  return !e || n === "file" ? Math.max(1, t) : Math.max(
    1,
    t,
    ke(e.output, n).length
  );
}
function be(e) {
  return !!((e?.ref_media_items?.length || 0) > 0 || String(e?.ref_media_url || "").trim() || Number(e?.ref_media_index || 0) > 0);
}
function X(e, n) {
  return e?.ref_media_excluded ? 0 : (e?.ref_media_items?.length || 0) > 0 ? e?.ref_media_items?.length || 0 : be(e) ? 1 : Math.max(1, n);
}
function Z(e, n, t = "") {
  const r = String(e?.usage || t || "");
  return e?.ref_media_excluded ? [{ amount: 0, mediaCount: n, mediaSelected: !0, usage: r }] : e?.ref_media_items?.length ? e.ref_media_items.map((i) => ({
    amount: 1,
    mediaCount: n,
    mediaSelected: !0,
    usage: i.usage || r
  })) : [
    {
      amount: X(e, n),
      mediaCount: n,
      mediaSelected: be(e),
      usage: r
    }
  ];
}
function P(e, n) {
  return `${String(e || "")}:${Number(n || 0)}`;
}
function te(e) {
  return e === "asset" || e === "material";
}
function z(e, n) {
  return e.find(
    (t) => (t.refType || "asset") === n.ref_type && Number(t.refId || 0) === Number(n.ref_id || 0) && (!n.ref_version_id || Number(t.versionID || 0) === Number(n.ref_version_id))
  );
}
function x(e) {
  return Number(
    e.source.asset?.id || e.source.resultRef?.asset_id || 0
  );
}
function we(e) {
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
function tn(e) {
  return Pe(e.source);
}
function Pe(e, n) {
  for (const t of [e.asset?.name, n?.title, e.title]) {
    const r = String(t || "").trim();
    if (r)
      return r;
  }
  return "媒体素材";
}
function sn(e) {
  const n = Number(
    e.source.asset?.id || e.source.resultRef?.asset_id || 0
  );
  return n > 0 ? `asset:${n}` : `node:${e.source.id}`;
}
function Me(e, n) {
  const t = Number(n.asset?.id || n.resultRef?.asset_id || 0), r = Number(
    n.asset?.version?.id || n.asset?.version_id || n.resultRef?.version_id || 0
  );
  return e.find(
    (i) => (i.refType || "asset") === "asset" && Number(i.refId || 0) === t && (!r || Number(i.versionID || 0) === r)
  ) || e.find((i) => i.id === n.id);
}
function $n(e, n, t) {
  const r = /* @__PURE__ */ new Map();
  for (const i of t) {
    const s = i.storyboardItem;
    if (s?.sourceNodeId === n && s.itemType === "shot_image" && s.shotId) {
      const o = r.get(s.shotId) || {};
      if (Ce(s.shotImageMode) === "references") {
        o.referenceNode = i, r.set(s.shotId, o);
        continue;
      }
      const u = Oe(
        s.frameMediaItems
      );
      if (u.length)
        for (const a of u)
          o[a.frameRole] = {
            node: i,
            mediaIndex: a.mediaIndex
          };
      else
        o[Fe(s.frameRole)] = {
          node: i,
          mediaIndex: 1
        };
      r.set(s.shotId, o);
    }
  }
  return e.shots.map((i) => {
    const s = r.get(i.id), o = Ue(i);
    if (o.nodeMode === "references")
      return {
        shot: i,
        start: K(),
        references: on(s?.referenceNode)
      };
    if (o.nodeMode === "last_frame")
      return {
        shot: i,
        start: K(s?.end)
      };
    if (o.nodeMode === "none")
      return {
        shot: i,
        start: K()
      };
    const u = o.mode === "next_first" ? r.get(i.shared_end_shot_id || "")?.start : s?.end;
    return {
      shot: i,
      start: K(s?.start),
      ...u ? { end: K(u) } : {}
    };
  });
}
function on(e) {
  const n = e ? Se(e) : void 0;
  return (n ? fe(n, "image") : []).slice(0, 4).map((r) => ({ node: e, imageURL: r }));
}
function K(e) {
  const n = e ? Se(e.node) : void 0;
  return {
    node: e?.node,
    imageURL: n ? an(n, e?.mediaIndex || 1) : ""
  };
}
function an(e, n) {
  const t = e && typeof e == "object" && !Array.isArray(e) ? e : void 0, r = t?.meta && typeof t.meta == "object" && !Array.isArray(t.meta) ? t.meta : void 0, s = (Array.isArray(r?.items) ? r.items : []).find((u) => !u || typeof u != "object" || Array.isArray(u) ? !1 : Number(u.order) === n);
  return String(s?.image || "").trim() || fe(e, "image")[n - 1] || "";
}
function Se(e) {
  const n = e.resultRef?.asset_id ?? e.asset?.id, t = e.resultRef?.version_id ?? e.asset?.version?.id ?? e.asset?.version_id, i = [e.asset?.version, ...e.asset?.versions || []].find(
    (s) => s && s.id === t && s.asset_id === n
  );
  return i ? se(e, i, {
    includeNodeResult: !1
  }) : se({
    ...e,
    asset: void 0,
    result: void 0,
    resultOutput: e.resultOutput
  });
}
function An(e, n, t, r, i) {
  if (!n || !t || n === t)
    return e;
  const s = e.findIndex((d) => i(d) === n);
  if (s < 0)
    return e;
  const o = [...e], [u] = o.splice(s, 1), a = o.findIndex((d) => i(d) === t);
  return a < 0 ? e : (o.splice(a + (r === "after" ? 1 : 0), 0, u), o);
}
function Kn(e, n, t) {
  if (!n.length)
    return e;
  const r = new Map(e.map((o) => [t(o), o])), i = [];
  for (const o of n)
    r.has(o) && i.push(r.get(o));
  const s = new Set(i.map(t));
  return [
    ...i,
    ...e.filter((o) => !s.has(t(o)))
  ];
}
function En(e, n) {
  return e.length === n.length && e.every((t, r) => t === n[r]);
}
export {
  _n as A,
  Ee as B,
  In as C,
  Rn as D,
  ge as E,
  ye as F,
  On as G,
  kn as H,
  Fn as I,
  Te as J,
  ae as K,
  Cn as L,
  Mn as M,
  Ve as N,
  yn as O,
  wn as P,
  le as Q,
  Se as R,
  bn as S,
  Ge as T,
  Be as U,
  Un as V,
  b as a,
  Me as b,
  ke as c,
  En as d,
  rn as e,
  gn as f,
  ln as g,
  vn as h,
  mn as i,
  pn as j,
  pe as k,
  xn as l,
  An as m,
  B as n,
  Kn as o,
  Sn as p,
  X as q,
  Nn as r,
  $n as s,
  Pn as t,
  ne as u,
  ze as v,
  k as w,
  S as x,
  hn as y,
  $e as z
};
