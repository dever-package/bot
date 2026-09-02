import { b2 as ue, bC as xe, bc as Me, B as ie } from "./upload-asset-api-BHoUDUjk.js";
import { a as se, j as P } from "./runtime-entry-9YhLBCWA.js";
import { G as oe } from "./vendor-icons-DgDZMD4Q.js";
import { d as Se } from "./_commonjsHelpers-C76sftkf.js";
const de = /* @__PURE__ */ new Set([
  "image",
  "video",
  "audio",
  "file"
]);
function un(e) {
  return e.type === "file" || e.type === "files";
}
function Ie(e) {
  return e.type === "prompt";
}
function dn(e) {
  return ![
    "hidden",
    "description",
    "prompt",
    "file",
    "files"
  ].includes(e.type);
}
function ln(e) {
  const n = Array.from(
    new Set(
      (e.accepted_kinds || e.asset_kinds || []).map(X).filter((r) => !!r)
    )
  );
  if (n.length > 0)
    return n;
  const t = `${e.name || ""} ${e.key || ""}`.toLowerCase();
  return /video|视频/.test(t) ? ["video"] : /audio|music|音频|音乐/.test(t) ? ["audio"] : /image|img|photo|picture|图片|图像|参考图|首帧|尾帧/.test(t) ? ["image"] : /text|文本|提示词|文案/.test(t) ? ["file"] : ["image", "audio", "video", "file"];
}
function Ce(e) {
  return (e.accepted_kinds || []).map(X).filter(
    (n) => !!n && de.has(n)
  );
}
function F(e) {
  const n = X(e);
  return n && de.has(n) ? n : void 0;
}
function $e(e) {
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
function Te(e) {
  const n = e.default_value ?? "";
  if (e.type === "switch")
    return Oe(n);
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
    !t.key || t.type === "description" || (n[t.key] = Te(t));
  return n;
}
function mn(e, n, t) {
  const r = le(e), s = new Map(
    t.map((o) => [o.key, o])
  );
  for (const o of e) {
    const i = s.get(o.key);
    o.key && i && Object.prototype.hasOwnProperty.call(n, o.key) && Ue(o, i, n[o.key]) && (r[o.key] = Z(o, n[o.key]));
  }
  return r;
}
function gn(e, n) {
  const t = le(e), r = n.paramValues || {};
  for (const o of e)
    o.key && Object.prototype.hasOwnProperty.call(r, o.key) && (t[o.key] = Z(
      o,
      r[o.key]
    ));
  const s = e.find(Ie);
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
function Ue(e, n, t) {
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
function pn(e, n, t = [e]) {
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
function Oe(e) {
  if (typeof e == "boolean")
    return e;
  const n = String(e ?? "").trim().toLowerCase();
  return n === "1" || n === "true" || n === "yes" || n === "on";
}
await window.DeverFront?.ensureCompat?.(["@/components/agent/stream-request-params"]);
const H = window.DeverFront?.sdk?.getCompatModule("@/components/agent/stream-request-params");
if (!H || Object.keys(H).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
const K = H, De = K.filterActivePowerParams || ((e) => e), yn = K.isPowerParamConditionController || (() => !1), _n = K.shouldDisplayPowerParam || (() => !0), vn = K.PowerParamOptionDialog, bn = K.normalizeParamPreviewType, Fe = "referencemode", Ke = "references";
function hn({
  node: e,
  content: n,
  items: t,
  connections: r,
  params: s,
  values: o,
  requestedMode: i,
  additionalSources: u = []
}) {
  const c = Le(
    De(s, o)
  );
  return qe({
    targetKind: R(e) || e.power?.kind || e.kind,
    content: n,
    items: t,
    connections: r,
    mediaOptions: c,
    requestedMode: i,
    additionalSources: u
  });
}
function kn(e, n) {
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
  if (ue(t)?.frames.some((o) => !!o.image))
    return "image";
  let s = !1;
  for (const o of n) {
    const i = F(o);
    if (i === "file") {
      s = !0;
      continue;
    }
    if (i)
      return i;
  }
  return s && Ae(t) ? "file" : void 0;
}
function Ne(e) {
  return !!R(e);
}
function Ae(e) {
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
function Rn(e, n, t) {
  return t.some((s) => {
    const o = R(s);
    return o === "video" || o === "audio";
  }) && Be(
    e,
    n,
    Ke
  ) || n;
}
function Ee(e) {
  return N(e.key) === Fe;
}
function Be(e, n, t) {
  const r = e.find(Ee);
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
    const r = String(t.key || "").trim(), s = Ce(t);
    return !r || s.length === 0 ? [] : [
      {
        key: r,
        label: String(t.name || r),
        maxFiles: $e(t),
        acceptedKinds: s
      }
    ];
  });
  return U(
    n.map(
      (t) => V(t) ? { ...t, maxFiles: 1 } : t
    )
  );
}
function Pn(e) {
  return e.find(
    (n) => z(n.key) || n.label.includes("首帧")
  )?.key || "firstFrame";
}
function qe({
  targetKind: e,
  content: n,
  items: t,
  connections: r,
  mediaOptions: s,
  requestedMode: o,
  additionalSources: i = []
}) {
  const u = ze(
    n,
    t,
    r,
    i
  ), c = u.reduce(
    (y, we) => y + we.amount,
    0
  ), d = u.some((y) => z(y.usage)) && u.some((y) => me(y.usage)), m = F(e) === "video" && c > 1, a = $(
    s,
    "image",
    "per_image"
  ), f = $(
    s,
    "image",
    "shared_reference"
  ), l = a.length > 0, g = f.some(
    V
  ), p = (!g || u.every((y) => y.amount === 1)) && He(f, c), b = [
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
      structured: u.some((y) => y.structured),
      explicitFramePair: d,
      options: b,
      error: ""
    };
  const v = u.some((y) => y.structured), h = d && p ? "shared_reference" : v && l ? "per_image" : p ? "shared_reference" : "per_image", A = b.find(
    (y) => y.value === o && y.enabled
  )?.value || h, _ = b.some((y) => y.enabled);
  return {
    active: m,
    imageCount: c,
    structured: v,
    explicitFramePair: d,
    mode: _ ? A : void 0,
    defaultMode: h,
    options: b,
    error: _ ? "" : "当前能力无法接收这组图片素材"
  };
}
function ze(e, n, t, r) {
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
    if ((d ? R(d.source) : F(m?.kind)) !== "image")
      continue;
    d && o.add(
      k(
        d.edge.id,
        x(d)
      )
    );
    const f = d ? w(d.source) : q(m, "image", c.ref_media_count);
    i.push({
      amount: O(c, f),
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
  const u = new Set(
    t.map((c) => c.source.id)
  );
  for (const c of r)
    u.has(c.id) || R(c) !== "image" || i.push({
      amount: w(c),
      usage: "",
      structured: G(c)
    });
  return i;
}
function G(e, n) {
  return !!(e?.storyboardItem?.itemType === "shot_image" || ue([
    e?.asset?.version?.content,
    e?.resultOutput,
    n?.output,
    n?.asset
  ]));
}
function Ve(e, n) {
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
function je(e) {
  const n = N(e);
  return n === "firstframe" || n === "startframe" || n === "lastframe" || n === "endframe";
}
function Ge(e) {
  if (!e.acceptedKinds.includes("image"))
    return !1;
  const n = N(e.key), t = String(e.label || "").trim();
  return ["images", "reference", "referenceimage", "referenceimages"].includes(
    n
  ) || t.includes("参考图") || t.includes("参考图片");
}
function U(e) {
  return e.map((n, t) => ({ option: n, index: t })).sort(
    (n, t) => ce(n.option) - ce(t.option) || n.index - t.index
  ).map(({ option: n }) => n);
}
function ce(e) {
  return Ge(e) ? 0 : z(e.key) || e.label.includes("首帧") ? 1 : me(e.key) || e.label.includes("尾帧") ? 2 : 3;
}
function V(e) {
  return je(e.key) || e.label.includes("首帧") || e.label.includes("尾帧");
}
function $(e, n, t) {
  const r = e.filter(
    (i) => i.acceptedKinds.includes(n)
  );
  if (n !== "image" || !t)
    return r;
  const s = r.filter((i) => !V(i));
  if (t === "shared_reference")
    return U(s.length > 0 ? s : r);
  const o = r.filter(
    (i) => z(i.key) || i.label.includes("首帧")
  );
  return o.length > 0 ? U(o) : U(s);
}
function wn(e, n) {
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
function He(e, n) {
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
function xn(e, n, t, r, s = {}, o = !1, i) {
  const u = new Map(
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
      const f = R(a.source);
      if (!f)
        return [];
      const l = w(a.source), g = u.get(
        k(
          a.edge.id,
          x(a)
        )
      );
      return [
        {
          referenceKey: Xe(a),
          label: Ye(a),
          kind: f,
          amount: O(g, l),
          mediaCount: l,
          mediaSelected: Y(g),
          usage: We(a, s),
          required: !0
        }
      ];
    }
  );
  for (const [a, f] of (n?.parts || []).entries()) {
    if (f.type !== "reference" || !ne(f.ref_type) || f.ref_origin === "edge")
      continue;
    const l = te(t, f), g = F(l?.kind);
    g && c.push({
      referenceKey: `${f.ref_type}:${f.ref_id}:${a}`,
      label: String(f.label || l?.title || "引用素材"),
      kind: g,
      amount: O(
        f,
        q(l, g, f.ref_media_count)
      ),
      mediaCount: q(
        l,
        g,
        f.ref_media_count
      ),
      mediaSelected: Y(f),
      usage: String(f.usage || ""),
      required: o
    });
  }
  const d = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Set();
  for (const a of c) {
    const f = `${a.referenceKey}:${a.usage}`;
    if (m.has(f))
      continue;
    m.add(f);
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
    const g = Ve(l, a.usage);
    if (a.usage && !g)
      return `「${a.label}」的素材用途与当前能力参数不兼容`;
    const p = g || (l.length === 1 ? l[0] : void 0);
    if (!p)
      return `请为「${a.label}」选择素材用途`;
    const b = a.kind === "image" && i === "per_image", v = b ? 1 : a.amount, h = I(p) > 0 ? Math.max(
      I(p) - (d.get(p.key) || 0),
      0
    ) : 0;
    if (!b && !a.mediaSelected && a.mediaCount > 1 && I(p) > 0 && a.mediaCount > h)
      return `「${a.label}」包含 ${a.mediaCount} 项素材，请从引用中选择具体素材`;
    if (!Q(p, d, v))
      return `${p.label}参数最多接收 ${I(p)} 个素材`;
    b || L(d, p.key, v);
  }
  return "";
}
function Mn(e, n, t, r, s = [], o) {
  const i = t.filter(Ne), u = i.flatMap((f) => {
    const l = R(f);
    return l ? [l] : [];
  }), c = U(
    n.filter(
      (f) => u.every(
        (l) => $([f], l, o).includes(
          f
        )
      )
    )
  );
  if (u.length === 0 || c.length === 0) {
    const f = u[0];
    return {
      usage: void 0,
      error: u.length > 1 ? "当前能力未配置可同时接收该分组媒体素材的参数" : `当前能力未配置可接收${ye(f || "file")}素材的参数`
    };
  }
  const d = Je(
    e,
    n,
    r,
    s,
    o
  ), m = o === "per_image" && u.every((f) => f === "image") ? 1 : i.reduce(
    (f, l) => f + w(l),
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
function Sn(e, n, t, r, s, o) {
  if (!n || r.length === 0)
    return { content: n, assignments: {} };
  const i = new Map(
    W(
      e,
      t,
      s,
      o
    ).map((f) => [f.key, f])
  ), c = [...W(
    n,
    t,
    s,
    o
  )].sort((f, l) => {
    const g = fe(
      f,
      i.get(f.key)
    ), p = fe(
      l,
      i.get(l.key)
    );
    return g - p || f.partIndex - l.partIndex;
  }), d = n.parts.map((f) => ({ ...f })), m = {}, a = /* @__PURE__ */ new Map();
  for (const f of c) {
    const l = i.get(f.key), g = $(
      r,
      f.kind,
      o
    ), p = f.usage && f.usage !== l?.usage ? f.usage : "", v = ge(
      g,
      a,
      f.kind === "image" && o === "per_image" ? 1 : f.amount,
      p,
      l?.usage || f.usage
    )?.key || "";
    v && (f.kind === "image" && o === "per_image" || L(a, v, f.amount));
    const h = d[f.partIndex];
    h?.type === "reference" && (h.usage = v || void 0), f.connection && v !== String(f.connection.edge.mediaUsage || "") && (m[f.connection.edge.id] = v || void 0);
  }
  return { content: { ...n, parts: d }, assignments: m };
}
function Je(e, n, t, r = [], s) {
  const o = /* @__PURE__ */ new Map(), i = W(
    t,
    r,
    e,
    s
  ), u = /* @__PURE__ */ new Set();
  for (const c of i) {
    const d = n.find((m) => m.key === c.usage);
    d && !(c.kind === "image" && s === "per_image") && L(o, d.key, c.amount), c.connection && u.add(
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
    if (u.has(d))
      continue;
    const m = String(c.edge.mediaUsage || ""), a = n.find((f) => f.key === m);
    a && !(R(c.source) === "image" && s === "per_image") && L(
      o,
      a.key,
      w(c.source)
    );
  }
  return o;
}
function We(e, n) {
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
  return e.parts.flatMap((i, u) => {
    if (i.type !== "reference" || !ne(i.ref_type))
      return [];
    const c = i.ref_type === "asset" && i.ref_origin_id ? s.get(
      k(i.ref_origin_id, i.ref_id)
    ) : void 0, d = te(n, i), m = c ? R(c.source) : F(d?.kind);
    if (!m)
      return [];
    const a = c ? `edge:${k(
      c.edge.id,
      x(c)
    )}` : `${i.ref_type}:${i.ref_id}:${i.ref_version_id || 0}`, f = o.get(a) || 0;
    return o.set(a, f + 1), [
      {
        key: c ? a : `${a}:${f}`,
        partIndex: u,
        kind: m,
        amount: m === "image" && r === "per_image" ? 1 : c ? O(
          i,
          w(c.source)
        ) : O(
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
function fe(e, n) {
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
  return V(e) ? 1 : e.maxFiles;
}
function Q(e, n, t = 1) {
  const r = I(e);
  return r <= 0 || (n.get(e.key) || 0) + t <= r;
}
function L(e, n, t = 1) {
  e.set(n, (e.get(n) || 0) + t);
}
function pe(e, n) {
  return Qe(e, n).map((t) => t.url);
}
function Qe(e, n) {
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
function O(e, n) {
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
function Ye(e) {
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
function Xe(e) {
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
  const t = String(e || ""), r = nn(n);
  if (!t || r.length === 0)
    return {
      version: 1,
      parts: t ? [{ type: "text", text: t }] : []
    };
  const s = [];
  let o = 0;
  for (; o < t.length; ) {
    const i = tn(t, o, r);
    if (!i) {
      D(s, t.slice(o));
      break;
    }
    i.index > o && D(s, t.slice(o, i.index)), s.push({
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
function In(e, n) {
  return re(
    e,
    rn(n)
  );
}
function Cn(e, n) {
  const t = he(
    n,
    B
  ), r = re(e, t), s = new Set(
    be(r).map(
      B
    )
  ), o = t.filter(
    (u) => !s.has(B(u))
  );
  if (!o.length)
    return r;
  const i = [];
  for (let u = 0; u < o.length; u += 1)
    Pe(
      i,
      o[u],
      u === o.length - 1 ? r.parts[0] : void 0
    );
  return { version: 1, parts: [...i, ...r.parts] };
}
function Ze(e) {
  return !!e?.parts.some((n) => n.type === "reference");
}
function $n(e, n, t) {
  if (!n || !e.includes("@") && !e.includes("#"))
    return n;
  const r = re(e, [
    ...be(n),
    ...t
  ]);
  return Ze(r) ? r : n;
}
function be(e) {
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
function en(e) {
  return e ? e.parts.map(
    (n) => n.type === "text" ? n.text : `${n.ref_trigger === "#" ? "#" : "@"}${S(n.label)}`
  ).join("") : "";
}
function Tn(e, n, t) {
  const r = he(
    t.filter(
      (a) => a.origin === "edge" && !!a.originID
    ),
    E
  ), s = new Map(
    r.map((a) => [E(a), a])
  ), o = n?.version === 1 ? n.parts : e ? [{ type: "text", text: e }] : [], i = [], u = /* @__PURE__ */ new Set();
  let c = !1;
  for (const a of o) {
    if (a.type === "reference" && a.ref_origin === "edge" && a.ref_origin_id) {
      const f = E({
        refId: a.ref_id,
        originID: a.ref_origin_id
      }), l = s.get(f);
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
      }), u.add(f), c = !1;
      continue;
    }
    if (a.type === "text") {
      let f = a.text;
      if (c && /^\s/.test(f)) {
        const l = i[i.length - 1];
        (!l || l.type === "text" && /\s$/.test(l.text)) && (f = f.slice(1));
      }
      D(i, f), c = !1;
      continue;
    }
    i.push({ ...a }), c = !1;
  }
  const d = r.filter(
    (a) => !u.has(E(a))
  );
  if (d.length > 0) {
    const a = i[i.length - 1];
    a && (a.type !== "text" || !/\s$/.test(a.text)) && D(i, " ");
    for (const f of d)
      Pe(i, f);
  }
  const m = { version: 1, parts: i };
  return {
    value: en(m),
    content: m
  };
}
function S(e) {
  return e.trim().replace(/^[@#]+/, "").trim();
}
function nn(e) {
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
function tn(e, n, t) {
  let r;
  for (const s of t) {
    const o = e.indexOf(s.mention, n);
    o < 0 || (!r || o < r.index || o === r.index && s.mention.length > r.target.mention.length) && (r = { index: o, target: s });
  }
  return r;
}
function D(e, n) {
  if (!n)
    return;
  const t = e[e.length - 1];
  if (t?.type === "text") {
    t.text += n;
    return;
  }
  e.push({ type: "text", text: n });
}
function he(e, n = ke) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const s of e) {
    if (s.refId <= 0 || !S(s.label))
      continue;
    const o = n(s);
    r.has(o) || (r.add(o), t.push(s));
  }
  return t;
}
function rn(e) {
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
  Re(e, n), sn(e, t);
}
function sn(e, n) {
  n?.type === "text" && /^\s/.test(n.text) || D(e, " ");
}
function Un(e, n, t, r, s) {
  if (!n || !t || n === t)
    return e;
  const o = e.findIndex((d) => s(d) === n);
  if (o < 0)
    return e;
  const i = [...e], [u] = i.splice(o, 1), c = i.findIndex((d) => s(d) === t);
  return c < 0 ? e : (i.splice(c + (r === "after" ? 1 : 0), 0, u), i);
}
function On(e, n, t) {
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
function Dn(e, n) {
  return e.length === n.length && e.every((t, r) => t === n[r]);
}
function Fn({
  itemId: e,
  index: n,
  durationLabel: t,
  className: r,
  dragClassName: s,
  selected: o = !1,
  readonly: i = !1,
  wholeCardDraggable: u = !1,
  dragging: c = !1,
  dropPlacement: d,
  ariaLabel: m,
  headerActions: a,
  children: f,
  onSelect: l,
  onDragStart: g,
  onDragOver: p,
  onDrop: b,
  onDragEnd: v
}) {
  const h = Se(!1);
  function j(_) {
    const y = _.target;
    if (u && y instanceof HTMLElement && y.closest("button, a, input, textarea, select")) {
      _.preventDefault();
      return;
    }
    h.current = !0, _.dataTransfer.effectAllowed = "move", _.dataTransfer.setData("text/plain", e), u && _.dataTransfer.setDragImage(_.currentTarget, 28, 18), g();
  }
  function A() {
    v(), window.setTimeout(() => {
      h.current = !1;
    }, 0);
  }
  return /* @__PURE__ */ se(
    "article",
    {
      className: [
        "ws-sequence-card",
        r,
        o ? "is-selected" : "",
        u && !i ? "is-drag-enabled" : "",
        c ? "is-dragging" : "",
        d ? `is-drop-${d}` : ""
      ].filter(Boolean).join(" "),
      "data-sequence-item-id": e,
      "aria-label": m,
      draggable: !i && u,
      onClick: () => {
        h.current || l();
      },
      onDragStart: !i && u ? j : void 0,
      onDragOver: i ? void 0 : (_) => {
        _.preventDefault(), _.dataTransfer.dropEffect = "move", p(_);
      },
      onDrop: i ? void 0 : (_) => {
        _.preventDefault(), b();
      },
      onDragEnd: !i && u ? A : void 0,
      children: [
        /* @__PURE__ */ se("header", { children: [
          u ? /* @__PURE__ */ P(ie, { label: i ? void 0 : "拖动卡片排序", children: /* @__PURE__ */ P("span", { className: s, "aria-hidden": "true", children: /* @__PURE__ */ P(oe, { size: 13 }) }) }) : /* @__PURE__ */ P(ie, { label: i ? void 0 : "拖动排序", children: /* @__PURE__ */ P(
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
        f
      ]
    }
  );
}
export {
  hn as A,
  De as B,
  Le as C,
  wn as D,
  _n as E,
  xn as F,
  Ie as G,
  Pn as H,
  mn as I,
  $n as J,
  le as K,
  Cn as L,
  en as M,
  Ze as N,
  be as O,
  vn as P,
  Ne as Q,
  Mn as R,
  Fn as S,
  pe as a,
  R as b,
  In as c,
  ve as d,
  Qe as e,
  ln as f,
  dn as g,
  yn as h,
  un as i,
  Ee as j,
  kn as k,
  Sn as l,
  Un as m,
  S as n,
  On as o,
  O as p,
  bn as q,
  Tn as r,
  Dn as s,
  Z as t,
  Oe as u,
  M as v,
  pn as w,
  C as x,
  gn as y,
  Rn as z
};
