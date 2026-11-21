import { r as ue, t as we } from "./asset-audio-preview-CsYcyVm8.js";
import { E as be } from "./asset-preview-DonyTaaN.js";
import { i as Se } from "./space-assistant-layout-B9KyeCM0.js";
const ce = /* @__PURE__ */ new Set([
  "image",
  "video",
  "audio",
  "file"
]);
function en(e) {
  return e.type === "file" || e.type === "files";
}
function Me(e) {
  return e.type === "prompt";
}
function nn(e) {
  return ![
    "hidden",
    "description",
    "prompt",
    "file",
    "files"
  ].includes(e.type);
}
function rn(e) {
  const n = Array.from(
    new Set(
      (e.accepted_kinds || e.asset_kinds || []).map(Z).filter((t) => !!t)
    )
  );
  return n.length > 0 ? n : [];
}
function Re(e) {
  return (e.accepted_kinds || []).map(Z).filter(
    (n) => !!n && ce.has(n)
  );
}
function I(e) {
  const n = Z(e);
  return n && ce.has(n) ? n : void 0;
}
function xe(e) {
  return e.type !== "files" ? 1 : Math.max(0, Number(e.max_files || 0));
}
function Z(e) {
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
function Ce(e, n) {
  return !!(e && Se(e.source_rule) && n > 0 && !e.sources.some(
    (t) => t.target_id === n || t.id === n
  ));
}
function tn(e, n) {
  return Ce(e, n.selectedTargetId || 0) ? n.paramValues || {} : Oe(e.params || [], n);
}
function Fe(e) {
  const n = e.default_value ?? "";
  if (e.type === "switch")
    return Ke(n);
  if (e.type === "multi_option")
    return ee(e, ie(n));
  if (e.type === "files")
    return ne(ie(n));
  if (e.type === "option" || e.type === "select") {
    const t = P(e.options || [], n) || e.options?.[0];
    return A(
      e,
      R(t) || n
    );
  }
  return A(e, n);
}
function fe(e) {
  const n = {};
  for (const t of e)
    !t.key || t.type === "description" || t.defer_default || (n[t.key] = Fe(t));
  return n;
}
function on(e) {
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
function sn(e, n, t) {
  const r = fe(e), i = new Map(
    t.map((o) => [o.key, o])
  );
  for (const o of e) {
    const u = i.get(o.key);
    o.key && u && Object.prototype.hasOwnProperty.call(n, o.key) && $e(o, u, n[o.key]) && (r[o.key] = ee(o, n[o.key]));
  }
  return r;
}
function Oe(e, n) {
  const t = fe(e), r = n.paramValues || {};
  for (const o of e)
    o.key && Object.prototype.hasOwnProperty.call(r, o.key) && (t[o.key] = ee(
      o,
      r[o.key]
    ));
  const i = e.find(Me);
  return i?.key && n.prompt?.trim() && (t[i.key] = n.prompt), Ue(e, t, void 0, r);
}
function A(e, n) {
  if (e.value_type !== "number" || n === "")
    return n;
  const t = Number(n);
  return Number.isFinite(t) ? t : n;
}
function Ue(e, n, t, r = n) {
  const i = { ...n };
  for (const o of e) {
    const u = o.option_filter_key;
    if (!u) continue;
    const m = e.find((f) => f.key === u);
    if (!m) continue;
    const s = P(o.options || [], n[o.key]);
    if (!Object.prototype.hasOwnProperty.call(r, u) && s?.group) {
      const f = P(m.options || [], s.group);
      f && (i[u] = R(f));
    }
    if ((t === u || !Object.prototype.hasOwnProperty.call(r, o.key)) && s?.group !== String(i[u] || "")) {
      const f = (o.options || []).find((g) => g.group === String(i[u] || ""));
      i[o.key] = f ? R(f) : "";
    }
  }
  return i;
}
function ee(e, n) {
  if (e.type === "option" || e.type === "select") {
    const t = P(e.options || [], n) || P(e.options || [], e.default_value) || e.options?.[0];
    return A(
      e,
      R(t) || n
    );
  }
  return e.type === "multi_option" ? ne(n).map((t) => {
    const r = P(e.options || [], t);
    return A(
      e,
      R(r) || t
    );
  }) : A(e, n);
}
function $e(e, n, t) {
  if (e.type !== n.type || e.value_type !== n.value_type)
    return !1;
  if (e.type === "option" || e.type === "select") {
    const r = e.options || [];
    return r.length === 0 || !!P(r, t);
  }
  if (e.type === "multi_option") {
    const r = e.options || [];
    return r.length === 0 || ne(t).every(
      (i) => !!P(r, i)
    );
  }
  return e.value_type === "number" ? t === "" || Number.isFinite(Number(t)) : !0;
}
function R(e) {
  return e ? String(e.native_value || "").trim() || String(e.value || "").trim() || String(e.name || "").trim() || String(e.id || "") : "";
}
function P(e, n) {
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
    const o = e.find(
      (u) => String(i(u) ?? "").trim() === t
    );
    if (o)
      return o;
  }
}
function an(e, n, t = [e]) {
  return n.some(
    (r) => P(t, r) === e
  );
}
function ie(e) {
  if (typeof e != "string")
    return e;
  try {
    return JSON.parse(e);
  } catch {
    return e;
  }
}
function ne(e) {
  return Array.isArray(e) ? e.map((n) => String(n)).filter(Boolean) : typeof e == "string" ? e ? [e] : [] : e ? [String(e)] : [];
}
function Ke(e) {
  if (typeof e == "boolean")
    return e;
  const n = String(e ?? "").trim().toLowerCase();
  return n === "1" || n === "true" || n === "yes" || n === "on";
}
await window.DeverFront?.ensureCompat?.(["@/components/agent/stream-request-params", "@/components/searchable-option-picker"]);
const H = window.DeverFront?.sdk?.getCompatModule("@/components/agent/stream-request-params");
if (!H || Object.keys(H).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
const J = window.DeverFront?.sdk?.getCompatModule("@/components/searchable-option-picker");
if (!J || Object.keys(J).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/searchable-option-picker");
const N = H, de = N.filterActivePowerParams || ((e) => e), un = N.isPowerParamConditionController || (() => !1), cn = N.shouldDisplayPowerParam || (() => !0), fn = J.SearchableOptionPicker, dn = N.PowerParamOptionDialog, mn = N.normalizeParamPreviewType;
N.PowerParamField;
N.PowerParamPopover;
function B(e, n, t = []) {
  return (e?.parts || []).filter((r) => {
    if (r.type !== "reference") return !1;
    const i = t.find(
      ({ edge: o }) => o.id === r.ref_origin_id
    );
    return (i ? w(i.source) : I(
      z(n, r)?.kind
    )) === "image";
  });
}
function b(e) {
  return `${e.ref_type}:${e.ref_id}:${e.ref_version_id || 0}:${e.ref_origin_id || ""}`;
}
function oe(e, n, t) {
  const r = e.find(le);
  return `${r ? R(
    P(r.options || [], n[r.key])
  ) : "default"}:${t}`;
}
function Ne(e, n, t, r, i) {
  return {
    ...e,
    [n]: {
      version: 1,
      parts: B(t, r, i)
    }
  };
}
function ln({
  content: e,
  items: n,
  connections: t,
  params: r,
  previousValues: i,
  nextValues: o,
  previousMode: u,
  nextMode: m,
  selections: s
}) {
  const f = Ne(
    s,
    oe(r, i, u),
    e,
    n,
    t
  ), g = oe(r, o, m), c = new Map(
    B(f[g], n, t).map((d) => [
      b(d),
      d
    ])
  ), a = new Set(
    B(e, n, t)
  ), l = ge(
    de(r, o)
  ), _ = O(l, "image", m), y = m === "shared_reference" && _.some(F);
  return { content: e && {
    ...e,
    parts: e.parts.map((d) => {
      if (d.type !== "reference" || !a.has(d)) return d;
      const k = c.get(b(d));
      if (k)
        return {
          ...d,
          usage: k.usage,
          ref_media_url: k.ref_media_url,
          ref_media_index: k.ref_media_index,
          ref_media_items: k.ref_media_items,
          ref_media_excluded: k.ref_media_excluded
        };
      if (f[g])
        return {
          ...d,
          usage: void 0,
          ref_media_url: void 0,
          ref_media_index: void 0,
          ref_media_items: [],
          ref_media_excluded: !0
        };
      if (y) {
        const h = d.ref_media_items?.length === 1 ? d.ref_media_items[0] : d.ref_media_url || d.ref_media_index ? {
          url: d.ref_media_url || "",
          index: d.ref_media_index || 0
        } : d.ref_media_count === 1 ? { url: "", index: 1 } : void 0, U = _.find(
          ($) => K($.key)
        )?.key;
        return {
          ...d,
          usage: void 0,
          ref_media_url: void 0,
          ref_media_index: void 0,
          ref_media_items: h && U ? [{ ...h, usage: U }] : [],
          ref_media_excluded: !h
        };
      }
      const M = _[0]?.key;
      return {
        ...d,
        usage: M,
        ref_media_excluded: void 0,
        ref_media_items: d.ref_media_items?.map((h) => ({
          ...h,
          usage: void 0
        }))
      };
    })
  }, selections: f };
}
function me(e) {
  return e.flatMap((n) => n.ref_media_excluded ? [] : (n.ref_media_items?.length ? n.ref_media_items : n.ref_media_url || n.ref_media_index ? [
    {
      url: n.ref_media_url || "",
      index: n.ref_media_index || 0,
      usage: n.usage
    }
  ] : n.ref_media_count === 1 && n.usage ? [{ url: "", index: 1, usage: n.usage }] : []).filter((r) => r.usage && _e(r.usage)).map((r) => ({ part: n, media: r })));
}
function gn(e, n, t, r) {
  const i = me(n);
  if (r && i.find(
    (m) => m.media.usage !== t && b(m.part) === b(r.part) && (m.media.url ? m.media.url === r.media.url : m.media.index === r.media.index)
  ))
    throw new Error("这张图片已用于另一个位置，请先取消原有选择");
  const u = new Set(n.map(b));
  return {
    ...e,
    parts: e.parts.map((m) => {
      if (m.type !== "reference" || !u.has(b(m)))
        return m;
      const s = b(m), f = i.filter(
        (g) => b(g.part) === s && g.media.usage !== t
      ).map((g) => g.media);
      return r && s === b(r.part) && f.push({ ...r.media, usage: t }), {
        ...m,
        usage: void 0,
        ref_media_url: void 0,
        ref_media_index: void 0,
        ref_media_items: f,
        ref_media_excluded: f.length === 0
      };
    })
  };
}
const Ee = "referencemode", Ie = "references";
function _n({
  node: e,
  content: n,
  items: t,
  connections: r,
  params: i,
  values: o,
  requestedMode: u,
  additionalSources: m = []
}) {
  const s = ge(
    de(i, o)
  ), f = e.outputType || e.power?.outputType;
  return Ve({
    targetKind: f && f !== "general" ? void 0 : w(e) || e.power?.kind || e.kind,
    content: n,
    items: t,
    connections: r,
    mediaOptions: s,
    requestedMode: u,
    additionalSources: m
  });
}
function pn(e, n) {
  return e.flatMap(({ edge: t, source: r }) => {
    const i = he(n, r), o = Number(
      i?.refId || r.asset?.id || r.resultRef?.asset_id || 0
    );
    return o <= 0 ? [] : [
      {
        refType: "asset",
        refId: o,
        versionId: Number(
          i?.versionID || r.asset?.version?.id || r.asset?.version_id || r.resultRef?.version_id || 0
        ),
        label: ve(r, i),
        usage: String(t.mediaUsage || ""),
        trigger: "@",
        origin: "edge",
        originID: t.id,
        contentSelection: i?.contentSelection,
        mediaCount: x(r)
      }
    ];
  });
}
function w(e) {
  if (!e)
    return;
  const n = [e.kind, e.asset?.kind, e.power?.kind], t = [e.asset?.version?.content, e.resultOutput];
  if (ue(t)?.frames.some((o) => !!o.image))
    return "image";
  let i = !1;
  for (const o of n) {
    const u = I(o);
    if (u === "file") {
      i = !0;
      continue;
    }
    if (u)
      return u;
  }
  return i && De(t) ? "file" : void 0;
}
function Ae(e) {
  return !!w(e);
}
function De(e) {
  return e.some(
    (n) => Y(n, /* @__PURE__ */ new Set(), 0)
  );
}
function Y(e, n, t) {
  if (e == null || t > 10)
    return !1;
  if (typeof e == "string")
    return /^(?:https?:\/\/|\/|data:)/i.test(e.trim());
  if (Array.isArray(e))
    return e.some((i) => Y(i, n, t + 1));
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
  ].some((i) => Y(i, n, t + 1));
}
function yn(e, n, t) {
  return t.some((i) => {
    const o = w(i);
    return o === "video" || o === "audio";
  }) && Be(
    e,
    n,
    Ie
  ) || n;
}
function le(e) {
  return V(e.key) === Ee;
}
function Be(e, n, t) {
  const r = e.find(le);
  if (!r?.key)
    return n;
  const i = P(
    r.options || [],
    t
  );
  if (!i)
    return;
  const o = P(
    r.options || [],
    n[r.key]
  );
  return R(o) === R(i) ? n : {
    ...n,
    [r.key]: R(i)
  };
}
function ge(e) {
  const n = e.flatMap((t) => {
    if (t.type !== "file" && t.type !== "files")
      return [];
    const r = String(t.key || "").trim(), i = Re(t);
    return !r || i.length === 0 ? [] : [
      {
        key: r,
        label: String(t.name || r),
        maxFiles: xe(t),
        acceptedKinds: i
      }
    ];
  });
  return D(
    n.map(
      (t) => F(t) ? { ...t, maxFiles: 1 } : t
    )
  );
}
function kn(e) {
  return e.find((n) => K(n.key))?.key || "firstFrame";
}
function Ve({
  targetKind: e,
  content: n,
  items: t,
  connections: r,
  mediaOptions: i,
  requestedMode: o,
  additionalSources: u = []
}) {
  const m = ze(
    n,
    t,
    r,
    u
  ), s = m.reduce(
    (p, Pe) => p + Pe.amount,
    0
  ), f = m.some((p) => K(p.usage)) && m.some((p) => T(p.usage)), g = I(e) === "video" && i.some((p) => p.acceptedKinds.includes("image")), c = O(
    i,
    "image",
    "per_image"
  ), a = O(
    i,
    "image",
    "shared_reference"
  ), l = c.length > 0, _ = a.some(F), y = (!_ || m.every((p) => p.amount === 1)) && Le(a, s), v = a.length > 0, d = _ ? a.filter(F) : [], k = [
    {
      value: "per_image",
      label: "每图一条视频",
      enabled: l,
      reason: l ? void 0 : "当前能力没有可逐张接收图片的参数"
    },
    {
      value: "shared_reference",
      label: _ ? d.some((p) => T(p.key)) ? "首尾帧生成" : "首帧生成" : "多图共同参考",
      enabled: v,
      reason: v ? void 0 : _ ? "当前能力不能将这些图片作为同一次首尾帧输入" : "当前能力不能在一次请求中接收这些参考图片"
    }
  ];
  if (!g)
    return {
      active: !1,
      imageCount: s,
      structured: m.some((p) => p.structured),
      explicitFramePair: f,
      options: k,
      frameUsages: d,
      error: ""
    };
  const M = m.some((p) => p.structured), h = f && v ? "shared_reference" : M && l ? "per_image" : v && y ? "shared_reference" : "per_image", U = k.find(
    (p) => p.value === o
  ), $ = U?.value || h, te = k.some((p) => p.enabled);
  return {
    active: g,
    imageCount: s,
    structured: M,
    explicitFramePair: f,
    mode: te ? $ : void 0,
    defaultMode: h,
    options: k,
    frameUsages: d,
    error: te ? U && !U.enabled ? U.reason || "当前能力不支持该生成方式" : $ === "shared_reference" && _ && m.some(
      (p) => p.amount > 0 && T(p.usage)
    ) && !m.some(
      (p) => p.amount > 0 && K(p.usage)
    ) ? "选择尾帧时请同时选择首帧" : $ === "shared_reference" && _ && s > 2 ? "首帧和尾帧各选择1张图片" : $ === "shared_reference" && _ && s === 0 && m.length > 0 ? "请选择首帧图片" : $ === "per_image" && s === 0 && m.length > 0 ? "请选择用于生成视频的图片" : "" : "当前能力无法接收这组图片素材"
  };
}
function ze(e, n, t, r) {
  const i = new Map(
    t.map(
      (s) => [
        S(
          s.edge.id,
          C(s)
        ),
        s
      ]
    )
  ), o = /* @__PURE__ */ new Set(), u = [];
  for (const s of e?.parts || []) {
    if (s.type !== "reference" || !re(s.ref_type))
      continue;
    const f = s.ref_type === "asset" && s.ref_origin_id ? i.get(
      S(s.ref_origin_id, s.ref_id)
    ) : void 0, g = f ? he(n, f.source) : z(n, s);
    if ((f ? w(f.source) : I(g?.kind)) !== "image")
      continue;
    f && o.add(
      S(
        f.edge.id,
        C(f)
      )
    );
    const a = f ? x(f.source) : j(g, "image", s.ref_media_count);
    u.push(
      ...X(
        s,
        a,
        f?.edge.mediaUsage
      ).map((l) => ({
        amount: l.amount,
        usage: l.usage,
        structured: G(f?.source, g)
      }))
    );
  }
  for (const s of t) {
    const f = S(
      s.edge.id,
      C(s)
    );
    o.has(f) || w(s.source) !== "image" || u.push({
      amount: x(s.source),
      usage: String(s.edge.mediaUsage || ""),
      structured: G(s.source)
    });
  }
  const m = new Set(
    t.map((s) => s.source.id)
  );
  for (const s of r)
    m.has(s.id) || w(s) !== "image" || u.push({
      amount: x(s),
      usage: "",
      structured: G(s)
    });
  return u;
}
function G(e, n) {
  return !!(e?.storyboardItem?.itemType === "shot_image" || ue([
    e?.asset?.version?.content,
    e?.resultOutput,
    n?.output,
    n?.asset
  ]));
}
function Te(e, n) {
  return e.find((t) => t.key === n);
}
function K(e) {
  const n = V(e);
  return n === "firstframe" || n === "startframe";
}
function T(e) {
  const n = V(e);
  return n === "lastframe" || n === "endframe";
}
function _e(e) {
  const n = V(e);
  return n === "firstframe" || n === "startframe" || n === "lastframe" || n === "endframe";
}
function qe(e) {
  if (!e.acceptedKinds.includes("image"))
    return !1;
  const n = V(e.key);
  return ["images", "reference", "referenceimage", "referenceimages"].includes(
    n
  );
}
function D(e) {
  return e.map((n, t) => ({ option: n, index: t })).sort(
    (n, t) => se(n.option) - se(t.option) || n.index - t.index
  ).map(({ option: n }) => n);
}
function se(e) {
  return qe(e) ? 0 : K(e.key) ? 1 : T(e.key) ? 2 : 3;
}
function F(e) {
  return _e(e.key);
}
function O(e, n, t) {
  const r = e.filter(
    (u) => u.acceptedKinds.includes(n)
  );
  if (n !== "image" || !t)
    return r;
  const i = r.filter((u) => !F(u));
  if (t === "shared_reference")
    return D(i.length > 0 ? i : r);
  const o = r.filter((u) => K(u.key));
  return o.length > 0 ? D(o) : D(i);
}
function vn(e, n) {
  if (!n)
    return e;
  const t = /* @__PURE__ */ new Set();
  for (const r of ["image", "video", "audio", "file"])
    for (const i of O(
      e,
      r,
      n
    ))
      t.add(i);
  return e.filter((r) => t.has(r));
}
function Le(e, n) {
  let t = n;
  for (const r of e) {
    const i = E(r);
    if (i <= 0 || (t -= i, t <= 0))
      return !0;
  }
  return !1;
}
function V(e) {
  return String(e || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
}
function hn(e, n, t, r, i = {}, o = !1, u) {
  const m = new Map(
    (n?.parts || []).flatMap(
      (c) => c.type === "reference" && c.ref_type === "asset" && c.ref_origin === "edge" && c.ref_origin_id ? [
        [
          S(c.ref_origin_id, c.ref_id),
          c
        ]
      ] : []
    )
  ), s = e.flatMap(
    (c) => {
      const a = w(c.source);
      if (!a)
        return [];
      const l = x(c.source), _ = m.get(
        S(
          c.edge.id,
          C(c)
        )
      );
      return X(
        _,
        l,
        Ge(c, i)
      ).map((y, v) => ({
        referenceKey: `${Qe(c)}:${v}`,
        label: Ye(c),
        kind: a,
        ...y,
        required: !0
      }));
    }
  );
  for (const [c, a] of (n?.parts || []).entries()) {
    if (a.type !== "reference" || !re(a.ref_type) || a.ref_origin === "edge")
      continue;
    const l = z(t, a), _ = I(l?.kind);
    _ && s.push(
      ...X(
        a,
        j(l, _, a.ref_media_count)
      ).map((y, v) => ({
        referenceKey: `${a.ref_type}:${a.ref_id}:${c}:${v}`,
        label: String(a.label || l?.title || "引用素材"),
        kind: _,
        ...y,
        required: o
      }))
    );
  }
  const f = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Set();
  for (const c of s) {
    if (c.amount === 0) continue;
    const a = `${c.referenceKey}:${c.usage}`;
    if (g.has(a))
      continue;
    g.add(a);
    const l = O(
      r,
      c.kind,
      u
    );
    if (l.length === 0) {
      if (c.required)
        return `当前能力未配置可接收${ke(c.kind)}素材的参数`;
      continue;
    }
    const _ = Te(l, c.usage);
    if (c.usage && !_)
      return `「${c.label}」的素材用途与当前能力参数不兼容`;
    const y = _ || (l.length === 1 ? l[0] : void 0);
    if (!y)
      return `请为「${c.label}」选择素材用途`;
    const v = c.kind === "image" && u === "per_image", d = v ? 1 : c.amount, k = E(y) > 0 ? Math.max(
      E(y) - (f.get(y.key) || 0),
      0
    ) : 0;
    if (!v && !c.mediaSelected && c.mediaCount > 1 && E(y) > 0 && c.mediaCount > k)
      return `「${c.label}」包含 ${c.mediaCount} 项素材，请从引用中选择具体素材`;
    if (!q(y, f, d))
      return `${y.label}参数最多接收 ${E(y)} 个素材`;
    v || L(f, y.key, d);
  }
  return "";
}
function Pn(e, n, t, r, i = [], o) {
  const u = t.filter(Ae), m = u.flatMap((a) => {
    const l = w(a);
    return l ? [l] : [];
  }), s = D(
    n.filter(
      (a) => m.every(
        (l) => O([a], l, o).includes(
          a
        )
      )
    )
  );
  if (m.length === 0 || s.length === 0) {
    const a = m[0];
    return {
      usage: void 0,
      options: [],
      error: m.length > 1 ? "当前能力未配置可同时接收该分组媒体素材的参数" : `当前能力未配置可接收${ke(a || "file")}素材的参数`
    };
  }
  if (o === "shared_reference" && m.every((a) => a === "image") && s.some(F))
    return { usage: s[0].key, options: s, error: "" };
  const f = je(
    e,
    n,
    r,
    i,
    o
  ), g = o === "per_image" && m.every((a) => a === "image") ? 1 : u.reduce(
    (a, l) => a + x(l),
    0
  ), c = s.filter(
    (a) => q(a, f, g)
  );
  return c.length === 0 ? {
    usage: void 0,
    options: [],
    error: `${s[0].label}参数已达到素材数量上限`
  } : {
    usage: c[0].key,
    options: c,
    error: ""
  };
}
function wn(e, n, t, r, i, o) {
  if (!n || r.length === 0)
    return { content: n, assignments: {} };
  if (o === "shared_reference" && O(r, "image", o).some(
    F
  )) {
    const a = B(
      e,
      t,
      i
    ), l = new Set(a.map(b)), _ = new Set(B(n, t, i)), y = new Set(
      me(a).map((d) => d.media.usage)
    ), v = n.parts.map((d) => {
      if (d.type !== "reference" || !_.has(d) || l.has(b(d)) || d.ref_media_excluded || d.ref_media_items?.length)
        return d;
      const k = d.usage || r.find((h) => K(h.key))?.key, M = j(
        z(t, d),
        "image",
        d.ref_media_count
      );
      return k && !y.has(k) && (d.ref_media_url || d.ref_media_index || M === 1) ? (y.add(k), { ...d, usage: k }) : {
        ...d,
        usage: void 0,
        ref_media_url: void 0,
        ref_media_index: void 0,
        ref_media_items: [],
        ref_media_excluded: !0
      };
    });
    return { content: { ...n, parts: v }, assignments: {} };
  }
  const u = new Map(
    Q(
      e,
      t,
      i,
      o
    ).map((a) => [a.key, a])
  ), s = [...Q(
    n,
    t,
    i,
    o
  )].sort((a, l) => {
    const _ = ae(
      a,
      u.get(a.key)
    ), y = ae(
      l,
      u.get(l.key)
    );
    return _ - y || a.partIndex - l.partIndex;
  }), f = n.parts.map((a) => ({ ...a })), g = {}, c = /* @__PURE__ */ new Map();
  for (const a of s) {
    if (a.amount === 0) continue;
    const l = u.get(a.key), _ = O(
      r,
      a.kind,
      o
    ), y = a.usage && a.usage !== l?.usage ? a.usage : "", d = He(
      _,
      c,
      a.kind === "image" && o === "per_image" ? 1 : a.amount,
      y,
      l?.usage || a.usage
    )?.key || "";
    d && (a.kind === "image" && o === "per_image" || L(c, d, a.amount));
    const k = f[a.partIndex];
    k?.type === "reference" && (k.usage = d || void 0, k.ref_media_items?.length && (k.ref_media_items = k.ref_media_items.map((M) => ({
      ...M,
      usage: _.some((h) => h.key === M.usage) ? M.usage : d || void 0
    })))), a.connection && d !== String(a.connection.edge.mediaUsage || "") && (g[a.connection.edge.id] = d || void 0);
  }
  return { content: { ...n, parts: f }, assignments: g };
}
function je(e, n, t, r = [], i) {
  const o = /* @__PURE__ */ new Map(), u = Q(
    t,
    r,
    e,
    i
  ), m = /* @__PURE__ */ new Set();
  for (const s of u) {
    const f = n.find((g) => g.key === s.usage);
    f && !(s.kind === "image" && i === "per_image") && L(o, f.key, s.amount), s.connection && m.add(
      S(
        s.connection.edge.id,
        C(s.connection)
      )
    );
  }
  for (const s of e) {
    const f = S(
      s.edge.id,
      C(s)
    );
    if (m.has(f))
      continue;
    const g = String(s.edge.mediaUsage || ""), c = n.find((a) => a.key === g);
    c && !(w(s.source) === "image" && i === "per_image") && L(
      o,
      c.key,
      x(s.source)
    );
  }
  return o;
}
function Ge(e, n) {
  return String(
    Object.prototype.hasOwnProperty.call(n, e.edge.id) ? n[e.edge.id] || "" : e.edge.mediaUsage || ""
  );
}
function Q(e, n, t, r) {
  if (!e)
    return [];
  const i = new Map(
    t.map((u) => [
      S(
        u.edge.id,
        C(u)
      ),
      u
    ])
  ), o = /* @__PURE__ */ new Map();
  return e.parts.flatMap((u, m) => {
    if (u.type !== "reference" || !re(u.ref_type))
      return [];
    const s = u.ref_type === "asset" && u.ref_origin_id ? i.get(
      S(u.ref_origin_id, u.ref_id)
    ) : void 0, f = z(n, u), g = s ? w(s.source) : I(f?.kind);
    if (!g)
      return [];
    const c = s ? `edge:${S(
      s.edge.id,
      C(s)
    )}` : `${u.ref_type}:${u.ref_id}:${u.ref_version_id || 0}`, a = o.get(c) || 0;
    return o.set(c, a + 1), [
      {
        key: s ? c : `${c}:${a}`,
        partIndex: m,
        kind: g,
        amount: u.ref_media_excluded ? 0 : g === "image" && r === "per_image" ? 1 : s ? W(
          u,
          x(s.source)
        ) : W(
          u,
          j(
            f,
            g,
            u.ref_media_count
          )
        ),
        usage: String(u.usage || ""),
        connection: s
      }
    ];
  });
}
function ae(e, n) {
  return e.usage && e.usage !== n?.usage ? 0 : n ? 1 : 2;
}
function He(e, n, t, ...r) {
  for (const i of r) {
    const o = e.find((u) => u.key === i);
    if (o && q(o, n, t))
      return o;
  }
  return e.find(
    (i) => q(i, n, t)
  );
}
function E(e) {
  return F(e) ? 1 : e.maxFiles;
}
function q(e, n, t = 1) {
  const r = E(e);
  return r <= 0 || (n.get(e.key) || 0) + t <= r;
}
function L(e, n, t = 1) {
  e.set(n, (e.get(n) || 0) + t);
}
function pe(e, n) {
  return Je(e, n).map((t) => t.url);
}
function Je(e, n) {
  if (n === "image") {
    const t = we(e);
    if (t.length > 0)
      return t.map((r) => ({ url: r, thumbnail: r }));
  }
  return be(e, n);
}
function x(e) {
  const n = w(e);
  return !e || !n || n === "file" ? 1 : Math.max(
    1,
    pe(
      [e.asset?.version?.content, e.resultOutput],
      n
    ).length
  );
}
function j(e, n, t = 0) {
  return !e || n === "file" ? Math.max(1, t) : Math.max(
    1,
    t,
    pe(e.output, n).length
  );
}
function ye(e) {
  return !!((e?.ref_media_items?.length || 0) > 0 || String(e?.ref_media_url || "").trim() || Number(e?.ref_media_index || 0) > 0);
}
function W(e, n) {
  return e?.ref_media_excluded ? 0 : (e?.ref_media_items?.length || 0) > 0 ? e?.ref_media_items?.length || 0 : ye(e) ? 1 : Math.max(1, n);
}
function X(e, n, t = "") {
  const r = String(e?.usage || t || "");
  return e?.ref_media_excluded ? [{ amount: 0, mediaCount: n, mediaSelected: !0, usage: r }] : e?.ref_media_items?.length ? e.ref_media_items.map((i) => ({
    amount: 1,
    mediaCount: n,
    mediaSelected: !0,
    usage: i.usage || r
  })) : [
    {
      amount: W(e, n),
      mediaCount: n,
      mediaSelected: ye(e),
      usage: r
    }
  ];
}
function S(e, n) {
  return `${String(e || "")}:${Number(n || 0)}`;
}
function re(e) {
  return e === "asset" || e === "material";
}
function z(e, n) {
  return e.find(
    (t) => (t.refType || "asset") === n.ref_type && Number(t.refId || 0) === Number(n.ref_id || 0) && (!n.ref_version_id || Number(t.versionID || 0) === Number(n.ref_version_id))
  );
}
function C(e) {
  return Number(
    e.source.asset?.id || e.source.resultRef?.asset_id || 0
  );
}
function ke(e) {
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
function Ye(e) {
  return ve(e.source);
}
function ve(e, n) {
  for (const t of [e.asset?.name, n?.title, e.title]) {
    const r = String(t || "").trim();
    if (r)
      return r;
  }
  return "媒体素材";
}
function Qe(e) {
  const n = Number(
    e.source.asset?.id || e.source.resultRef?.asset_id || 0
  );
  return n > 0 ? `asset:${n}` : `node:${e.source.id}`;
}
function he(e, n) {
  const t = Number(n.asset?.id || n.resultRef?.asset_id || 0), r = Number(
    n.asset?.version?.id || n.asset?.version_id || n.resultRef?.version_id || 0
  );
  return e.find(
    (i) => (i.refType || "asset") === "asset" && Number(i.refId || 0) === t && (!r || Number(i.versionID || 0) === r)
  ) || e.find((i) => i.id === n.id);
}
export {
  de as A,
  ge as B,
  vn as C,
  cn as D,
  hn as E,
  Ne as F,
  oe as G,
  kn as H,
  ln as I,
  Ue as J,
  sn as K,
  Ae as L,
  Oe as M,
  Pn as N,
  fe as O,
  dn as P,
  fn as S,
  w as a,
  he as b,
  pe as c,
  Je as d,
  rn as e,
  nn as f,
  un as g,
  on as h,
  en as i,
  le as j,
  pn as k,
  B as l,
  W as m,
  mn as n,
  ee as o,
  Ke as p,
  P as q,
  wn as r,
  gn as s,
  R as t,
  an as u,
  Me as v,
  tn as w,
  Ce as x,
  yn as y,
  _n as z
};
