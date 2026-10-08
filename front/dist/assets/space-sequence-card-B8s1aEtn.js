import { a$ as fe, b4 as xe, b5 as Me, B as ie } from "./node-detail-content-DEcv8fc7.js";
import { i as Se } from "./preloadable-B6OSmL0f.js";
import { a as se, j as P } from "./react-CDpwMNlY.js";
import { G as oe } from "./vendor-icons-Cz5zFzlk.js";
import { e as Ie } from "./file-kind-DFeonxO2.js";
const de = /* @__PURE__ */ new Set([
  "image",
  "video",
  "audio",
  "file"
]);
function gn(e) {
  return e.type === "file" || e.type === "files";
}
function Ce(e) {
  return e.type === "prompt";
}
function pn(e) {
  return ![
    "hidden",
    "description",
    "prompt",
    "file",
    "files"
  ].includes(e.type);
}
function yn(e) {
  const n = Array.from(
    new Set(
      (e.accepted_kinds || e.asset_kinds || []).map(X).filter((t) => !!t)
    )
  );
  return n.length > 0 ? n : [];
}
function $e(e) {
  return (e.accepted_kinds || []).map(X).filter(
    (n) => !!n && de.has(n)
  );
}
function D(e) {
  const n = X(e);
  return n && de.has(n) ? n : void 0;
}
function Te(e) {
  return e.type !== "files" ? 1 : Math.max(0, Number(e.max_files || 0));
}
function X(e) {
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
function Ue(e, n) {
  return !!(e && Se(e.source_rule) && n > 0 && !e.sources.some(
    (t) => t.target_id === n || t.id === n
  ));
}
function _n(e, n) {
  return Ue(e, n.selectedTargetId || 0) ? n.paramValues || {} : Oe(e.params || [], n);
}
function Fe(e) {
  const n = e.default_value ?? "";
  if (e.type === "switch")
    return Ke(n);
  if (e.type === "multi_option")
    return Z(e, ae(n));
  if (e.type === "files")
    return ee(ae(n));
  if (e.type === "option" || e.type === "select") {
    const t = M(e.options || [], n) || e.options?.[0];
    return T(
      e,
      C(t) || n
    );
  }
  return T(e, n);
}
function le(e) {
  const n = {};
  for (const t of e)
    !t.key || t.type === "description" || (n[t.key] = Fe(t));
  return n;
}
function vn(e, n, t) {
  const r = le(e), s = new Map(
    t.map((o) => [o.key, o])
  );
  for (const o of e) {
    const i = s.get(o.key);
    o.key && i && Object.prototype.hasOwnProperty.call(n, o.key) && De(o, i, n[o.key]) && (r[o.key] = Z(o, n[o.key]));
  }
  return r;
}
function Oe(e, n) {
  const t = le(e), r = n.paramValues || {};
  for (const o of e)
    o.key && Object.prototype.hasOwnProperty.call(r, o.key) && (t[o.key] = Z(
      o,
      r[o.key]
    ));
  const s = e.find(Ce);
  return s?.key && n.prompt.trim() && (t[s.key] = n.prompt), t;
}
function T(e, n) {
  if (e.value_type !== "number" || n === "")
    return n;
  const t = Number(n);
  return Number.isFinite(t) ? t : n;
}
function Z(e, n) {
  if (e.type === "option" || e.type === "select") {
    const t = M(e.options || [], n) || e.options?.[0];
    return T(
      e,
      C(t) || n
    );
  }
  return e.type === "multi_option" ? ee(n).map((t) => {
    const r = M(e.options || [], t);
    return T(
      e,
      C(r) || t
    );
  }) : T(e, n);
}
function De(e, n, t) {
  if (e.type !== n.type || e.value_type !== n.value_type)
    return !1;
  if (e.type === "option" || e.type === "select") {
    const r = e.options || [];
    return r.length === 0 || !!M(r, t);
  }
  if (e.type === "multi_option") {
    const r = e.options || [];
    return r.length === 0 || ee(t).every(
      (s) => !!M(r, s)
    );
  }
  return e.value_type === "number" ? t === "" || Number.isFinite(Number(t)) : !0;
}
function C(e) {
  return e ? String(e.native_value || "").trim() || String(e.value || "").trim() || String(e.name || "").trim() || String(e.id || "") : "";
}
function M(e, n) {
  const t = String(n ?? "").trim();
  if (!t)
    return;
  const r = [
    (s) => s.native_value,
    (s) => s.value,
    (s) => s.name,
    (s) => s.id
  ];
  for (const s of r) {
    const o = e.find(
      (i) => String(s(i) ?? "").trim() === t
    );
    if (o)
      return o;
  }
}
function hn(e, n, t = [e]) {
  return n.some(
    (r) => M(t, r) === e
  );
}
function ae(e) {
  if (typeof e != "string")
    return e;
  try {
    return JSON.parse(e);
  } catch {
    return e;
  }
}
function ee(e) {
  return Array.isArray(e) ? e.map((n) => String(n)).filter(Boolean) : typeof e == "string" ? e ? [e] : [] : e ? [String(e)] : [];
}
function Ke(e) {
  if (typeof e == "boolean")
    return e;
  const n = String(e ?? "").trim().toLowerCase();
  return n === "1" || n === "true" || n === "yes" || n === "on";
}
await window.DeverFront?.ensureCompat?.(["@/components/agent/stream-request-params"]);
const H = window.DeverFront?.sdk?.getCompatModule("@/components/agent/stream-request-params");
if (!H || Object.keys(H).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
const K = H, Ne = K.filterActivePowerParams || ((e) => e), bn = K.isPowerParamConditionController || (() => !1), kn = K.shouldDisplayPowerParam || (() => !0), Rn = K.PowerParamOptionDialog, Pn = K.normalizeParamPreviewType, Ae = "referencemode", Ee = "references";
function wn({
  node: e,
  content: n,
  items: t,
  connections: r,
  params: s,
  values: o,
  requestedMode: i,
  additionalSources: f = []
}) {
  const c = Le(
    Ne(s, o)
  );
  return je({
    targetKind: R(e) || e.power?.kind || e.kind,
    content: n,
    items: t,
    connections: r,
    mediaOptions: c,
    requestedMode: i,
    additionalSources: f
  });
}
function xn(e, n) {
  return e.flatMap(({ edge: t, source: r }) => {
    const s = ve(n, r), o = Number(
      s?.refId || r.asset?.id || r.resultRef?.asset_id || 0
    );
    return o <= 0 ? [] : [
      {
        refType: "asset",
        refId: o,
        versionId: Number(
          s?.versionID || r.asset?.version?.id || r.asset?.version_id || r.resultRef?.version_id || 0
        ),
        label: _e(r, s),
        usage: String(t.mediaUsage || ""),
        trigger: "@",
        origin: "edge",
        originID: t.id,
        mediaCount: w(r)
      }
    ];
  });
}
function R(e) {
  if (!e)
    return;
  const n = [e.kind, e.asset?.kind, e.power?.kind], t = [e.asset?.version?.content, e.resultOutput];
  if (fe(t)?.frames.some((o) => !!o.image))
    return "image";
  let s = !1;
  for (const o of n) {
    const i = D(o);
    if (i === "file") {
      s = !0;
      continue;
    }
    if (i)
      return i;
  }
  return s && Ve(t) ? "file" : void 0;
}
function Be(e) {
  return !!R(e);
}
function Ve(e) {
  return e.some(
    (n) => J(n, /* @__PURE__ */ new Set(), 0)
  );
}
function J(e, n, t) {
  if (e == null || t > 10)
    return !1;
  if (typeof e == "string")
    return /^(?:https?:\/\/|\/|data:)/i.test(e.trim());
  if (Array.isArray(e))
    return e.some((s) => J(s, n, t + 1));
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
  ].some((s) => J(s, n, t + 1));
}
function Mn(e, n, t) {
  return t.some((s) => {
    const o = R(s);
    return o === "video" || o === "audio";
  }) && ze(
    e,
    n,
    Ee
  ) || n;
}
function qe(e) {
  return N(e.key) === Ae;
}
function ze(e, n, t) {
  const r = e.find(qe);
  if (!r?.key)
    return n;
  const s = M(
    r.options || [],
    t
  );
  if (!s)
    return;
  const o = M(
    r.options || [],
    n[r.key]
  );
  return C(o) === C(s) ? n : {
    ...n,
    [r.key]: C(s)
  };
}
function Le(e) {
  const n = e.flatMap((t) => {
    if (t.type !== "file" && t.type !== "files")
      return [];
    const r = String(t.key || "").trim(), s = $e(t);
    return !r || s.length === 0 ? [] : [
      {
        key: r,
        label: String(t.name || r),
        maxFiles: Te(t),
        acceptedKinds: s
      }
    ];
  });
  return U(
    n.map(
      (t) => L(t) ? { ...t, maxFiles: 1 } : t
    )
  );
}
function Sn(e) {
  return e.find((n) => z(n.key))?.key || "firstFrame";
}
function je({
  targetKind: e,
  content: n,
  items: t,
  connections: r,
  mediaOptions: s,
  requestedMode: o,
  additionalSources: i = []
}) {
  const f = Ge(
    n,
    t,
    r,
    i
  ), c = f.reduce(
    (y, we) => y + we.amount,
    0
  ), d = f.some((y) => z(y.usage)) && f.some((y) => me(y.usage)), m = D(e) === "video" && c > 1, a = $(
    s,
    "image",
    "per_image"
  ), u = $(
    s,
    "image",
    "shared_reference"
  ), l = a.length > 0, g = u.some(
    L
  ), p = (!g || f.every((y) => y.amount === 1)) && Qe(u, c), h = [
    {
      value: "per_image",
      label: "逐图生成",
      enabled: l,
      reason: l ? void 0 : "当前能力没有可逐张接收图片的参数"
    },
    {
      value: "shared_reference",
      label: g ? "首尾帧生成" : "共同参考",
      enabled: p,
      reason: p ? void 0 : g ? "当前能力不能将这些图片作为同一次首尾帧输入" : "当前能力不能在一次请求中接收这些参考图片"
    }
  ];
  if (!m)
    return {
      active: !1,
      imageCount: c,
      structured: f.some((y) => y.structured),
      explicitFramePair: d,
      options: h,
      error: ""
    };
  const v = f.some((y) => y.structured), b = d && p ? "shared_reference" : v && l ? "per_image" : p ? "shared_reference" : "per_image", A = h.find(
    (y) => y.value === o && y.enabled
  )?.value || b, _ = h.some((y) => y.enabled);
  return {
    active: m,
    imageCount: c,
    structured: v,
    explicitFramePair: d,
    mode: _ ? A : void 0,
    defaultMode: b,
    options: h,
    error: _ ? "" : "当前能力无法接收这组图片素材"
  };
}
function Ge(e, n, t, r) {
  const s = new Map(
    t.map(
      (c) => [
        k(
          c.edge.id,
          x(c)
        ),
        c
      ]
    )
  ), o = /* @__PURE__ */ new Set(), i = [];
  for (const c of e?.parts || []) {
    if (c.type !== "reference" || !ne(c.ref_type))
      continue;
    const d = c.ref_type === "asset" && c.ref_origin_id ? s.get(
      k(c.ref_origin_id, c.ref_id)
    ) : void 0, m = d ? ve(n, d.source) : te(n, c);
    if ((d ? R(d.source) : D(m?.kind)) !== "image")
      continue;
    d && o.add(
      k(
        d.edge.id,
        x(d)
      )
    );
    const u = d ? w(d.source) : q(m, "image", c.ref_media_count);
    i.push({
      amount: F(c, u),
      usage: String(c.usage || d?.edge.mediaUsage || ""),
      structured: G(d?.source, m)
    });
  }
  for (const c of t) {
    const d = k(
      c.edge.id,
      x(c)
    );
    o.has(d) || R(c.source) !== "image" || i.push({
      amount: w(c.source),
      usage: String(c.edge.mediaUsage || ""),
      structured: G(c.source)
    });
  }
  const f = new Set(
    t.map((c) => c.source.id)
  );
  for (const c of r)
    f.has(c.id) || R(c) !== "image" || i.push({
      amount: w(c),
      usage: "",
      structured: G(c)
    });
  return i;
}
function G(e, n) {
  return !!(e?.storyboardItem?.itemType === "shot_image" || fe([
    e?.asset?.version?.content,
    e?.resultOutput,
    n?.output,
    n?.asset
  ]));
}
function He(e, n) {
  return e.find((t) => t.key === n);
}
function z(e) {
  const n = N(e);
  return n === "firstframe" || n === "startframe";
}
function me(e) {
  const n = N(e);
  return n === "lastframe" || n === "endframe";
}
function Je(e) {
  const n = N(e);
  return n === "firstframe" || n === "startframe" || n === "lastframe" || n === "endframe";
}
function We(e) {
  if (!e.acceptedKinds.includes("image"))
    return !1;
  const n = N(e.key);
  return ["images", "reference", "referenceimage", "referenceimages"].includes(
    n
  );
}
function U(e) {
  return e.map((n, t) => ({ option: n, index: t })).sort(
    (n, t) => ce(n.option) - ce(t.option) || n.index - t.index
  ).map(({ option: n }) => n);
}
function ce(e) {
  return We(e) ? 0 : z(e.key) ? 1 : me(e.key) ? 2 : 3;
}
function L(e) {
  return Je(e.key);
}
function $(e, n, t) {
  const r = e.filter(
    (i) => i.acceptedKinds.includes(n)
  );
  if (n !== "image" || !t)
    return r;
  const s = r.filter((i) => !L(i));
  if (t === "shared_reference")
    return U(s.length > 0 ? s : r);
  const o = r.filter(
    (i) => z(i.key)
  );
  return o.length > 0 ? U(o) : U(s);
}
function In(e, n) {
  if (!n)
    return e;
  const t = /* @__PURE__ */ new Set();
  for (const r of ["image", "video", "audio", "file"])
    for (const s of $(
      e,
      r,
      n
    ))
      t.add(s);
  return e.filter((r) => t.has(r));
}
function Qe(e, n) {
  let t = n;
  for (const r of e) {
    const s = I(r);
    if (s <= 0 || (t -= s, t <= 0))
      return !0;
  }
  return !1;
}
function N(e) {
  return String(e || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
}
function Cn(e, n, t, r, s = {}, o = !1, i) {
  const f = new Map(
    (n?.parts || []).flatMap(
      (a) => a.type === "reference" && a.ref_type === "asset" && a.ref_origin === "edge" && a.ref_origin_id ? [
        [
          k(a.ref_origin_id, a.ref_id),
          a
        ]
      ] : []
    )
  ), c = e.flatMap(
    (a) => {
      const u = R(a.source);
      if (!u)
        return [];
      const l = w(a.source), g = f.get(
        k(
          a.edge.id,
          x(a)
        )
      );
      return [
        {
          referenceKey: nn(a),
          label: en(a),
          kind: u,
          amount: F(g, l),
          mediaCount: l,
          mediaSelected: Y(g),
          usage: Xe(a, s),
          required: !0
        }
      ];
    }
  );
  for (const [a, u] of (n?.parts || []).entries()) {
    if (u.type !== "reference" || !ne(u.ref_type) || u.ref_origin === "edge")
      continue;
    const l = te(t, u), g = D(l?.kind);
    g && c.push({
      referenceKey: `${u.ref_type}:${u.ref_id}:${a}`,
      label: String(u.label || l?.title || "引用素材"),
      kind: g,
      amount: F(
        u,
        q(l, g, u.ref_media_count)
      ),
      mediaCount: q(
        l,
        g,
        u.ref_media_count
      ),
      mediaSelected: Y(u),
      usage: String(u.usage || ""),
      required: o
    });
  }
  const d = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Set();
  for (const a of c) {
    const u = `${a.referenceKey}:${a.usage}`;
    if (m.has(u))
      continue;
    m.add(u);
    const l = $(
      r,
      a.kind,
      i
    );
    if (l.length === 0) {
      if (a.required)
        return `当前能力未配置可接收${ye(a.kind)}素材的参数`;
      continue;
    }
    const g = He(l, a.usage);
    if (a.usage && !g)
      return `「${a.label}」的素材用途与当前能力参数不兼容`;
    const p = g || (l.length === 1 ? l[0] : void 0);
    if (!p)
      return `请为「${a.label}」选择素材用途`;
    const h = a.kind === "image" && i === "per_image", v = h ? 1 : a.amount, b = I(p) > 0 ? Math.max(
      I(p) - (d.get(p.key) || 0),
      0
    ) : 0;
    if (!h && !a.mediaSelected && a.mediaCount > 1 && I(p) > 0 && a.mediaCount > b)
      return `「${a.label}」包含 ${a.mediaCount} 项素材，请从引用中选择具体素材`;
    if (!Q(p, d, v))
      return `${p.label}参数最多接收 ${I(p)} 个素材`;
    h || V(d, p.key, v);
  }
  return "";
}
function $n(e, n, t, r, s = [], o) {
  const i = t.filter(Be), f = i.flatMap((u) => {
    const l = R(u);
    return l ? [l] : [];
  }), c = U(
    n.filter(
      (u) => f.every(
        (l) => $([u], l, o).includes(
          u
        )
      )
    )
  );
  if (f.length === 0 || c.length === 0) {
    const u = f[0];
    return {
      usage: void 0,
      error: f.length > 1 ? "当前能力未配置可同时接收该分组媒体素材的参数" : `当前能力未配置可接收${ye(u || "file")}素材的参数`
    };
  }
  const d = Ye(
    e,
    n,
    r,
    s,
    o
  ), m = o === "per_image" && f.every((u) => u === "image") ? 1 : i.reduce(
    (u, l) => u + w(l),
    0
  ), a = ge(
    c,
    d,
    m
  );
  return a ? {
    usage: a.key,
    error: ""
  } : {
    usage: void 0,
    error: `${c[0].label}参数已达到素材数量上限`
  };
}
function Tn(e, n, t, r, s, o) {
  if (!n || r.length === 0)
    return { content: n, assignments: {} };
  const i = new Map(
    W(
      e,
      t,
      s,
      o
    ).map((u) => [u.key, u])
  ), c = [...W(
    n,
    t,
    s,
    o
  )].sort((u, l) => {
    const g = ue(
      u,
      i.get(u.key)
    ), p = ue(
      l,
      i.get(l.key)
    );
    return g - p || u.partIndex - l.partIndex;
  }), d = n.parts.map((u) => ({ ...u })), m = {}, a = /* @__PURE__ */ new Map();
  for (const u of c) {
    const l = i.get(u.key), g = $(
      r,
      u.kind,
      o
    ), p = u.usage && u.usage !== l?.usage ? u.usage : "", v = ge(
      g,
      a,
      u.kind === "image" && o === "per_image" ? 1 : u.amount,
      p,
      l?.usage || u.usage
    )?.key || "";
    v && (u.kind === "image" && o === "per_image" || V(a, v, u.amount));
    const b = d[u.partIndex];
    b?.type === "reference" && (b.usage = v || void 0), u.connection && v !== String(u.connection.edge.mediaUsage || "") && (m[u.connection.edge.id] = v || void 0);
  }
  return { content: { ...n, parts: d }, assignments: m };
}
function Ye(e, n, t, r = [], s) {
  const o = /* @__PURE__ */ new Map(), i = W(
    t,
    r,
    e,
    s
  ), f = /* @__PURE__ */ new Set();
  for (const c of i) {
    const d = n.find((m) => m.key === c.usage);
    d && !(c.kind === "image" && s === "per_image") && V(o, d.key, c.amount), c.connection && f.add(
      k(
        c.connection.edge.id,
        x(c.connection)
      )
    );
  }
  for (const c of e) {
    const d = k(
      c.edge.id,
      x(c)
    );
    if (f.has(d))
      continue;
    const m = String(c.edge.mediaUsage || ""), a = n.find((u) => u.key === m);
    a && !(R(c.source) === "image" && s === "per_image") && V(
      o,
      a.key,
      w(c.source)
    );
  }
  return o;
}
function Xe(e, n) {
  return String(
    Object.prototype.hasOwnProperty.call(n, e.edge.id) ? n[e.edge.id] || "" : e.edge.mediaUsage || ""
  );
}
function W(e, n, t, r) {
  if (!e)
    return [];
  const s = new Map(
    t.map((i) => [
      k(
        i.edge.id,
        x(i)
      ),
      i
    ])
  ), o = /* @__PURE__ */ new Map();
  return e.parts.flatMap((i, f) => {
    if (i.type !== "reference" || !ne(i.ref_type))
      return [];
    const c = i.ref_type === "asset" && i.ref_origin_id ? s.get(
      k(i.ref_origin_id, i.ref_id)
    ) : void 0, d = te(n, i), m = c ? R(c.source) : D(d?.kind);
    if (!m)
      return [];
    const a = c ? `edge:${k(
      c.edge.id,
      x(c)
    )}` : `${i.ref_type}:${i.ref_id}:${i.ref_version_id || 0}`, u = o.get(a) || 0;
    return o.set(a, u + 1), [
      {
        key: c ? a : `${a}:${u}`,
        partIndex: f,
        kind: m,
        amount: m === "image" && r === "per_image" ? 1 : c ? F(
          i,
          w(c.source)
        ) : F(
          i,
          q(
            d,
            m,
            i.ref_media_count
          )
        ),
        usage: String(i.usage || ""),
        connection: c
      }
    ];
  });
}
function ue(e, n) {
  return e.usage && e.usage !== n?.usage ? 0 : n ? 1 : 2;
}
function ge(e, n, t, ...r) {
  for (const s of r) {
    const o = e.find((i) => i.key === s);
    if (o && Q(o, n, t))
      return o;
  }
  return e.find(
    (s) => Q(s, n, t)
  );
}
function I(e) {
  return L(e) ? 1 : e.maxFiles;
}
function Q(e, n, t = 1) {
  const r = I(e);
  return r <= 0 || (n.get(e.key) || 0) + t <= r;
}
function V(e, n, t = 1) {
  e.set(n, (e.get(n) || 0) + t);
}
function pe(e, n) {
  return Ze(e, n).map((t) => t.url);
}
function Ze(e, n) {
  if (n === "image") {
    const t = xe(e);
    if (t.length > 0)
      return t.map((r) => ({ url: r, thumbnail: r }));
  }
  return Me(e, n);
}
function w(e) {
  const n = R(e);
  return !e || !n || n === "file" ? 1 : Math.max(
    1,
    pe(
      [e.asset?.version?.content, e.resultOutput],
      n
    ).length
  );
}
function q(e, n, t = 0) {
  return !e || n === "file" ? Math.max(1, t) : Math.max(
    1,
    t,
    pe(e.output, n).length
  );
}
function Y(e) {
  return !!((e?.ref_media_items?.length || 0) > 0 || String(e?.ref_media_url || "").trim() || Number(e?.ref_media_index || 0) > 0);
}
function F(e, n) {
  return (e?.ref_media_items?.length || 0) > 0 ? e?.ref_media_items?.length || 0 : Y(e) ? 1 : Math.max(1, n);
}
function k(e, n) {
  return `${String(e || "")}:${Number(n || 0)}`;
}
function ne(e) {
  return e === "asset" || e === "material";
}
function te(e, n) {
  return e.find(
    (t) => (t.refType || "asset") === n.ref_type && Number(t.refId || 0) === Number(n.ref_id || 0) && (!n.ref_version_id || Number(t.versionID || 0) === Number(n.ref_version_id))
  );
}
function x(e) {
  return Number(
    e.source.asset?.id || e.source.resultRef?.asset_id || 0
  );
}
function ye(e) {
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
function en(e) {
  return _e(e.source);
}
function _e(e, n) {
  for (const t of [e.asset?.name, n?.title, e.title]) {
    const r = String(t || "").trim();
    if (r)
      return r;
  }
  return "媒体素材";
}
function nn(e) {
  const n = Number(
    e.source.asset?.id || e.source.resultRef?.asset_id || 0
  );
  return n > 0 ? `asset:${n}` : `node:${e.source.id}`;
}
function ve(e, n) {
  const t = Number(n.asset?.id || n.resultRef?.asset_id || 0), r = Number(
    n.asset?.version?.id || n.asset?.version_id || n.resultRef?.version_id || 0
  );
  return e.find(
    (s) => (s.refType || "asset") === "asset" && Number(s.refId || 0) === t && (!r || Number(s.versionID || 0) === r)
  ) || e.find((s) => s.id === n.id);
}
function re(e, n) {
  const t = String(e || ""), r = sn(n);
  if (!t || r.length === 0)
    return {
      version: 1,
      parts: t ? [{ type: "text", text: t }] : []
    };
  const s = [];
  let o = 0;
  for (; o < t.length; ) {
    const i = on(t, o, r);
    if (!i) {
      O(s, t.slice(o));
      break;
    }
    i.index > o && O(s, t.slice(o, i.index)), s.push({
      type: "reference",
      ref_type: i.target.refType,
      ref_id: i.target.refId,
      label: S(i.target.label),
      usage: i.target.usage,
      purpose: i.target.purpose,
      ref_trigger: i.target.trigger || "@",
      ref_version_id: i.target.versionId,
      ref_origin: i.target.origin,
      ref_origin_id: i.target.originID,
      ref_media_url: i.target.mediaURL,
      ref_media_index: i.target.mediaIndex,
      ref_media_count: i.target.mediaCount,
      ref_media_items: i.target.mediaItems
    }), o = i.index + i.target.mention.length;
  }
  return { version: 1, parts: s };
}
function Un(e, n) {
  return re(
    e,
    an(n)
  );
}
function Fn(e, n) {
  const t = be(
    n,
    B
  ), r = re(e, t), s = new Set(
    he(r).map(
      B
    )
  ), o = t.filter(
    (f) => !s.has(B(f))
  );
  if (!o.length)
    return r;
  const i = [];
  for (let f = 0; f < o.length; f += 1)
    Pe(
      i,
      o[f],
      f === o.length - 1 ? r.parts[0] : void 0
    );
  return { version: 1, parts: [...i, ...r.parts] };
}
function tn(e) {
  return !!e?.parts.some((n) => n.type === "reference");
}
function On(e, n, t) {
  if (!n || !e.includes("@") && !e.includes("#"))
    return n;
  const r = re(e, [
    ...he(n),
    ...t
  ]);
  return tn(r) ? r : n;
}
function he(e) {
  return e ? e.parts.filter((n) => n.type === "reference").map(
    (n) => ({
      refType: n.ref_type,
      refId: n.ref_id,
      label: S(n.label),
      usage: n.usage,
      purpose: n.purpose,
      trigger: n.ref_trigger === "#" ? "#" : "@",
      versionId: n.ref_version_id,
      origin: n.ref_origin,
      originID: n.ref_origin_id,
      mediaURL: n.ref_media_url,
      mediaIndex: n.ref_media_index,
      mediaCount: n.ref_media_count,
      mediaItems: n.ref_media_items
    })
  ) : [];
}
function rn(e) {
  return e ? e.parts.map(
    (n) => n.type === "text" ? n.text : `${n.ref_trigger === "#" ? "#" : "@"}${S(n.label)}`
  ).join("") : "";
}
function Dn(e, n, t) {
  const r = be(
    t.filter(
      (a) => a.origin === "edge" && !!a.originID
    ),
    E
  ), s = new Map(
    r.map((a) => [E(a), a])
  ), o = n?.version === 1 ? n.parts : e ? [{ type: "text", text: e }] : [], i = [], f = /* @__PURE__ */ new Set();
  let c = !1;
  for (const a of o) {
    if (a.type === "reference" && a.ref_origin === "edge" && a.ref_origin_id) {
      const u = E({
        refId: a.ref_id,
        originID: a.ref_origin_id
      }), l = s.get(u);
      if (!l) {
        c = !0;
        continue;
      }
      Re(i, {
        ...l,
        purpose: a.purpose,
        mediaURL: a.ref_media_url,
        mediaIndex: a.ref_media_index,
        mediaCount: a.ref_media_count,
        mediaItems: a.ref_media_items
      }), f.add(u), c = !1;
      continue;
    }
    if (a.type === "text") {
      let u = a.text;
      if (c && /^\s/.test(u)) {
        const l = i[i.length - 1];
        (!l || l.type === "text" && /\s$/.test(l.text)) && (u = u.slice(1));
      }
      O(i, u), c = !1;
      continue;
    }
    i.push({ ...a }), c = !1;
  }
  const d = r.filter(
    (a) => !f.has(E(a))
  );
  if (d.length > 0) {
    const a = i[i.length - 1];
    a && (a.type !== "text" || !/\s$/.test(a.text)) && O(i, " ");
    for (const u of d)
      Pe(i, u);
  }
  const m = { version: 1, parts: i };
  return {
    value: rn(m),
    content: m
  };
}
function S(e) {
  return e.trim().replace(/^[@#]+/, "").trim();
}
function sn(e) {
  const n = /* @__PURE__ */ new Map();
  for (const t of e) {
    if (t.refId <= 0)
      continue;
    const r = t.trigger || "@", s = S(t.label);
    if (!s)
      continue;
    const o = `${r}${s}`;
    n.has(o) || n.set(o, { ...t, mention: o });
  }
  return [...n.values()].sort(
    (t, r) => r.mention.length - t.mention.length
  );
}
function on(e, n, t) {
  let r;
  for (const s of t) {
    const o = e.indexOf(s.mention, n);
    o < 0 || (!r || o < r.index || o === r.index && s.mention.length > r.target.mention.length) && (r = { index: o, target: s });
  }
  return r;
}
function O(e, n) {
  if (!n)
    return;
  const t = e[e.length - 1];
  if (t?.type === "text") {
    t.text += n;
    return;
  }
  e.push({ type: "text", text: n });
}
function be(e, n = ke) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const s of e) {
    if (s.refId <= 0 || !S(s.label))
      continue;
    const o = n(s);
    r.has(o) || (r.add(o), t.push(s));
  }
  return t;
}
function an(e) {
  const n = /* @__PURE__ */ new Map();
  for (const t of e) {
    const r = S(t.label);
    if (t.refId <= 0 || !r)
      continue;
    const s = `${t.trigger || "@"}${r}`, o = B(t), i = n.get(s);
    if (!i) {
      n.set(s, {
        target: t,
        targetKey: o,
        ambiguous: !1
      });
      continue;
    }
    i.targetKey !== o && (i.ambiguous = !0);
  }
  return [...n.values()].filter((t) => !t.ambiguous).map((t) => t.target);
}
function B(e) {
  return `${ke(e)}:${e.usage || ""}:${e.purpose || ""}`;
}
function ke(e) {
  return e.originID ? `${e.refType}:${e.refId}:${e.origin || ""}:${e.originID}` : `${e.refType}:${e.refId}`;
}
function E(e) {
  return `${String(e.originID || "")}:${Number(e.refId || 0)}`;
}
function Re(e, n) {
  e.push({
    type: "reference",
    ref_type: n.refType,
    ref_id: n.refId,
    label: S(n.label),
    usage: n.usage,
    purpose: n.purpose,
    ref_trigger: n.trigger || "@",
    ref_version_id: n.versionId,
    ref_origin: n.origin,
    ref_origin_id: n.originID,
    ref_media_url: n.mediaURL,
    ref_media_index: n.mediaIndex,
    ref_media_count: n.mediaCount,
    ref_media_items: n.mediaItems
  });
}
function Pe(e, n, t) {
  Re(e, n), cn(e, t);
}
function cn(e, n) {
  n?.type === "text" && /^\s/.test(n.text) || O(e, " ");
}
function Kn(e, n, t, r, s) {
  if (!n || !t || n === t)
    return e;
  const o = e.findIndex((d) => s(d) === n);
  if (o < 0)
    return e;
  const i = [...e], [f] = i.splice(o, 1), c = i.findIndex((d) => s(d) === t);
  return c < 0 ? e : (i.splice(c + (r === "after" ? 1 : 0), 0, f), i);
}
function Nn(e, n, t) {
  if (!n.length)
    return e;
  const r = new Map(e.map((i) => [t(i), i])), s = [];
  for (const i of n)
    r.has(i) && s.push(r.get(i));
  const o = new Set(s.map(t));
  return [
    ...s,
    ...e.filter((i) => !o.has(t(i)))
  ];
}
function An(e, n) {
  return e.length === n.length && e.every((t, r) => t === n[r]);
}
function En({
  itemId: e,
  index: n,
  durationLabel: t,
  className: r,
  dragClassName: s,
  selected: o = !1,
  readonly: i = !1,
  wholeCardDraggable: f = !1,
  dragging: c = !1,
  dropPlacement: d,
  ariaLabel: m,
  headerActions: a,
  children: u,
  onSelect: l,
  onDragStart: g,
  onDragOver: p,
  onDrop: h,
  onDragEnd: v
}) {
  const b = Ie(!1);
  function j(_) {
    const y = _.target;
    if (f && y instanceof HTMLElement && y.closest("button, a, input, textarea, select")) {
      _.preventDefault();
      return;
    }
    b.current = !0, _.dataTransfer.effectAllowed = "move", _.dataTransfer.setData("text/plain", e), f && _.dataTransfer.setDragImage(_.currentTarget, 28, 18), g();
  }
  function A() {
    v(), window.setTimeout(() => {
      b.current = !1;
    }, 0);
  }
  return /* @__PURE__ */ se(
    "article",
    {
      className: [
        "ws-sequence-card",
        r,
        o ? "is-selected" : "",
        f && !i ? "is-drag-enabled" : "",
        c ? "is-dragging" : "",
        d ? `is-drop-${d}` : ""
      ].filter(Boolean).join(" "),
      "data-sequence-item-id": e,
      "aria-label": m,
      draggable: !i && f,
      onClick: () => {
        b.current || l();
      },
      onDragStart: !i && f ? j : void 0,
      onDragOver: i ? void 0 : (_) => {
        _.preventDefault(), _.dataTransfer.dropEffect = "move", p(_);
      },
      onDrop: i ? void 0 : (_) => {
        _.preventDefault(), h();
      },
      onDragEnd: !i && f ? A : void 0,
      children: [
        /* @__PURE__ */ se("header", { children: [
          f ? /* @__PURE__ */ P(ie, { label: i ? void 0 : "拖动卡片排序", children: /* @__PURE__ */ P("span", { className: s, "aria-hidden": "true", children: /* @__PURE__ */ P(oe, { size: 13 }) }) }) : /* @__PURE__ */ P(ie, { label: i ? void 0 : "拖动排序", children: /* @__PURE__ */ P(
            "button",
            {
              type: "button",
              className: s,
              draggable: !i,
              disabled: i,
              "aria-label": `拖动${m}排序`,
              onClick: (_) => _.stopPropagation(),
              onDragStart: j,
              onDragEnd: A,
              children: /* @__PURE__ */ P(oe, { size: 13 })
            }
          ) }),
          /* @__PURE__ */ P("strong", { children: String(n + 1).padStart(2, "0") }),
          /* @__PURE__ */ P("span", { children: t }),
          a || /* @__PURE__ */ P("i", { "aria-hidden": "true" })
        ] }),
        u
      ]
    }
  );
}
export {
  Ue as A,
  Mn as B,
  wn as C,
  Ne as D,
  Le as E,
  In as F,
  kn as G,
  Cn as H,
  Sn as I,
  vn as J,
  On as K,
  le as L,
  rn as M,
  Fn as N,
  he as O,
  Rn as P,
  tn as Q,
  Be as R,
  En as S,
  Oe as T,
  $n as U,
  pe as a,
  R as b,
  Un as c,
  ve as d,
  Ze as e,
  yn as f,
  pn as g,
  bn as h,
  gn as i,
  qe as j,
  xn as k,
  Tn as l,
  Kn as m,
  S as n,
  Nn as o,
  F as p,
  Pn as q,
  Dn as r,
  An as s,
  Z as t,
  Ke as u,
  M as v,
  hn as w,
  C as x,
  Ce as y,
  _n as z
};
