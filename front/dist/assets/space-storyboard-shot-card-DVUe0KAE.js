import { p as oe, O as Me, f as Re, g as P } from "./storyboard-grid-view-BldHSQpc.js";
import { c as V, a as h, j as g, F as ce } from "./createLucideIcon-fWv1XcFy.js";
import { U as we, B as Ie } from "./user-round-5NX4bvyQ.js";
import { C as Ce } from "./copy-BlmHyHAH.js";
import { L as Ne } from "./link-2-fCVybg_U.js";
import { T as $e } from "./trash-2-C2PWG3er.js";
import { e as De } from "./runtime-entry-ClkZDmNs.js";
import { s as Pe, S as Te, a as Ue, b as Ee, c as Ae } from "./space-content-view-TucLzffi.js";
const Fe = [
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
  ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
  ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
], te = V("grip-vertical", Fe);
const Ke = [
  [
    "path",
    {
      d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
      key: "18887p"
    }
  ],
  ["path", { d: "M7 11h10", key: "1twpyw" }],
  ["path", { d: "M7 15h6", key: "d9of3u" }],
  ["path", { d: "M7 7h8", key: "af5zfr" }]
], Oe = V("message-square-text", Ke);
const Le = [
  ["path", { d: "M13 21h8", key: "1jsn5i" }],
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
], ze = V("pen-line", Le);
const Be = [
  ["circle", { cx: "6", cy: "6", r: "3", key: "1lh9wr" }],
  ["path", { d: "M8.12 8.12 12 12", key: "1alkpv" }],
  ["path", { d: "M20 4 8.12 15.88", key: "xgtan2" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["path", { d: "M14.8 14.8 20 20", key: "ptml3r" }]
], qe = V("scissors", Be);
function je(e) {
  const n = e.default_value ?? "";
  if (e.type === "switch")
    return Ge(n);
  if (e.type === "multi_option")
    return Ve(e, ie(n));
  if (e.type === "files")
    return de(ie(n));
  if (e.type === "option" || e.type === "select") {
    const r = N(e.options || [], n) || e.options?.[0];
    return T(
      e,
      C(r) || n
    );
  }
  return T(e, n);
}
function Cn(e) {
  const n = {};
  for (const r of e)
    !r.key || r.type === "description" || (n[r.key] = je(r));
  return n;
}
function T(e, n) {
  if (e.value_type !== "number" || n === "")
    return n;
  const r = Number(n);
  return Number.isFinite(r) ? r : n;
}
function Ve(e, n) {
  if (e.type === "option" || e.type === "select") {
    const r = N(e.options || [], n) || e.options?.[0];
    return T(
      e,
      C(r) || n
    );
  }
  return e.type === "multi_option" ? de(n).map((r) => {
    const t = N(e.options || [], r);
    return T(
      e,
      C(t) || r
    );
  }) : T(e, n);
}
function C(e) {
  return e ? String(e.native_value || "").trim() || String(e.value || "").trim() || String(e.name || "").trim() || String(e.id || "") : "";
}
function N(e, n) {
  const r = String(n ?? "").trim();
  if (!r)
    return;
  const t = [
    (s) => s.native_value,
    (s) => s.value,
    (s) => s.name,
    (s) => s.id
  ];
  for (const s of t) {
    const c = e.find(
      (i) => String(s(i) ?? "").trim() === r
    );
    if (c)
      return c;
  }
}
function Nn(e, n, r = [e]) {
  return n.some(
    (t) => N(r, t) === e
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
function de(e) {
  return Array.isArray(e) ? e.map((n) => String(n)).filter(Boolean) : typeof e == "string" ? e ? [e] : [] : e ? [String(e)] : [];
}
function Ge(e) {
  if (typeof e == "boolean")
    return e;
  const n = String(e ?? "").trim().toLowerCase();
  return n === "1" || n === "true" || n === "yes" || n === "on";
}
const ue = /* @__PURE__ */ new Set([
  "image",
  "video",
  "audio",
  "file"
]);
function $n(e) {
  return e.type === "file" || e.type === "files";
}
function Dn(e) {
  return e.type === "prompt";
}
function Pn(e) {
  return ![
    "hidden",
    "description",
    "prompt",
    "file",
    "files"
  ].includes(e.type);
}
function Tn(e) {
  const n = Array.from(
    new Set(
      (e.accepted_kinds || e.asset_kinds || []).map(ee).filter((t) => !!t)
    )
  );
  if (n.length > 0)
    return n;
  const r = `${e.name || ""} ${e.key || ""}`.toLowerCase();
  return /video|视频/.test(r) ? ["video"] : /audio|music|音频|音乐/.test(r) ? ["audio"] : /image|img|photo|picture|图片|图像|参考图|首帧|尾帧/.test(r) ? ["image"] : /text|文本|提示词|文案/.test(r) ? ["file"] : ["image", "audio", "video", "file"];
}
function He(e) {
  return (e.accepted_kinds || []).map(ee).filter(
    (n) => !!n && ue.has(n)
  );
}
function K(e) {
  const n = ee(e);
  return n && ue.has(n) ? n : void 0;
}
function Je(e) {
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
const We = "referencemode", Ye = "frames", Qe = "references";
function Un(e, n) {
  return e.flatMap(({ edge: r, source: t }) => {
    const s = ye(n, t), c = Number(
      s?.refId || t.asset?.id || t.resultRef?.asset_id || 0
    );
    return c <= 0 ? [] : [
      {
        refType: "asset",
        refId: c,
        versionId: Number(
          s?.versionID || t.asset?.version?.id || t.asset?.version_id || t.resultRef?.version_id || 0
        ),
        label: pe(t, s),
        usage: String(r.mediaUsage || ""),
        trigger: "@",
        origin: "edge",
        originID: r.id,
        mediaCount: M(t)
      }
    ];
  });
}
function x(e) {
  if (!e)
    return;
  const n = [e.kind, e.asset?.kind, e.power?.kind], r = [e.asset?.version?.content, e.resultOutput];
  if (oe(r)?.frames.some((c) => !!c.image))
    return "image";
  let s = !1;
  for (const c of n) {
    const i = K(c);
    if (i === "file") {
      s = !0;
      continue;
    }
    if (i)
      return i;
  }
  return s && Ze(r) ? "file" : void 0;
}
function Xe(e) {
  return !!x(e);
}
function Ze(e) {
  return e.some(
    (n) => Y(n, /* @__PURE__ */ new Set(), 0)
  );
}
function Y(e, n, r) {
  if (e == null || r > 10)
    return !1;
  if (typeof e == "string")
    return /^(?:https?:\/\/|\/|data:)/i.test(e.trim());
  if (Array.isArray(e))
    return e.some((s) => Y(s, n, r + 1));
  if (typeof e != "object" || n.has(e))
    return !1;
  n.add(e);
  const t = e;
  return [
    t.file,
    t.files,
    t.file_url,
    t.fileUrl,
    t.url,
    t.src,
    t.download,
    t.download_url,
    t.downloadUrl,
    t.open_url,
    t.path,
    t.output,
    t.result,
    t.data,
    t.content,
    t.body,
    t.value,
    t.json,
    t.media_files,
    t.mediaFiles
  ].some((s) => Y(s, n, r + 1));
}
function En(e, n, r, t) {
  const s = r.some((i) => {
    const u = x(i);
    return u === "video" || u === "audio";
  });
  if (!s && !t)
    return n;
  const c = t || (s ? "shared_reference" : void 0);
  return c && nn(e, n, c) || n;
}
function en(e) {
  return O(e.key) === We;
}
function nn(e, n, r) {
  const t = e.find(en);
  if (!t?.key)
    return n;
  const s = r === "per_image" && e.some(
    (u) => (u.type === "file" || u.type === "files") && (G(u.key) || String(u.name || "").includes("首帧"))
  ) ? Ye : Qe, c = N(
    t.options || [],
    s
  );
  if (!c)
    return;
  const i = N(
    t.options || [],
    n[t.key]
  );
  return C(i) === C(c) ? n : {
    ...n,
    [t.key]: C(c)
  };
}
function An(e) {
  const n = e.flatMap((r) => {
    if (r.type !== "file" && r.type !== "files")
      return [];
    const t = String(r.key || "").trim(), s = He(r);
    return !t || s.length === 0 ? [] : [
      {
        key: t,
        label: String(r.name || t),
        maxFiles: Je(r),
        acceptedKinds: s
      }
    ];
  });
  return U(
    n.map(
      (r) => ne(r) ? { ...r, maxFiles: 1 } : r
    )
  );
}
function Fn({
  targetKind: e,
  content: n,
  items: r,
  connections: t,
  mediaOptionsByMode: s,
  requestedMode: c,
  additionalSources: i = []
}) {
  const u = rn(
    n,
    r,
    t,
    i
  ), o = u.reduce(
    (p, L) => p + L.amount,
    0
  ), l = u.some((p) => G(p.usage)) && u.some((p) => fe(p.usage)), m = K(e) === "video" && o > 1 && !l, f = E(
    s.per_image,
    "image",
    "per_image"
  ), a = E(
    s.shared_reference,
    "image",
    "shared_reference"
  ), d = f.length > 0, y = a.length > 0, _ = [
    {
      value: "per_image",
      label: "逐图生成",
      enabled: d,
      reason: d ? void 0 : "当前能力没有可逐张接收图片的参数"
    },
    {
      value: "shared_reference",
      label: "共同参考",
      enabled: y,
      reason: y ? void 0 : "当前能力没有可接收多图的参考参数"
    }
  ];
  if (!m)
    return {
      active: !1,
      imageCount: o,
      structured: u.some((p) => p.structured),
      explicitFramePair: l,
      options: _,
      error: ""
    };
  const b = u.some((p) => p.structured), v = b ? d ? "per_image" : "shared_reference" : y ? "shared_reference" : "per_image", I = _.find(
    (p) => p.value === c && p.enabled
  )?.value || v, $ = _.some((p) => p.enabled);
  return {
    active: m,
    imageCount: o,
    structured: b,
    explicitFramePair: l,
    mode: $ ? I : void 0,
    defaultMode: v,
    options: _,
    error: $ ? "" : "当前能力无法接收这组图片素材"
  };
}
function rn(e, n, r, t) {
  const s = new Map(
    r.map((o) => [
      k(
        o.edge.id,
        R(o)
      ),
      o
    ])
  ), c = /* @__PURE__ */ new Set(), i = [];
  for (const o of e?.parts || []) {
    if (o.type !== "reference" || o.ref_type !== "asset")
      continue;
    const l = o.ref_origin_id ? s.get(
      k(o.ref_origin_id, o.ref_id)
    ) : void 0, m = l ? ye(n, l.source) : n.find(
      (d) => Number(d.refId || 0) === Number(o.ref_id || 0) && (!o.ref_version_id || Number(d.versionID || 0) === Number(o.ref_version_id))
    );
    if ((l ? x(l.source) : K(m?.kind)) !== "image")
      continue;
    l && c.add(
      k(
        l.edge.id,
        R(l)
      )
    );
    const a = l ? M(l.source) : j(m, "image", o.ref_media_count);
    i.push({
      amount: A(o, a),
      usage: String(o.usage || l?.edge.mediaUsage || ""),
      structured: H(
        l?.source,
        m
      )
    });
  }
  for (const o of r) {
    const l = k(
      o.edge.id,
      R(o)
    );
    c.has(l) || x(o.source) !== "image" || i.push({
      amount: M(o.source),
      usage: String(o.edge.mediaUsage || ""),
      structured: H(o.source)
    });
  }
  const u = new Set(
    r.map((o) => o.source.id)
  );
  for (const o of t)
    u.has(o.id) || x(o) !== "image" || i.push({
      amount: M(o),
      usage: "",
      structured: H(o)
    });
  return i;
}
function H(e, n) {
  return !!(e?.storyboardItem?.itemType === "shot_image" || oe([
    e?.asset?.version?.content,
    e?.resultOutput,
    n?.output,
    n?.asset
  ]));
}
function tn(e, n) {
  return e.find((r) => r.key === n);
}
function G(e) {
  const n = O(e);
  return n === "firstframe" || n === "startframe";
}
function fe(e) {
  const n = O(e);
  return n === "lastframe" || n === "endframe";
}
function sn(e) {
  const n = O(e);
  return n === "firstframe" || n === "startframe" || n === "lastframe" || n === "endframe";
}
function an(e) {
  if (!e.acceptedKinds.includes("image"))
    return !1;
  const n = O(e.key), r = String(e.label || "").trim();
  return ["images", "reference", "referenceimage", "referenceimages"].includes(
    n
  ) || r.includes("参考图") || r.includes("参考图片");
}
function U(e) {
  return e.map((n, r) => ({ option: n, index: r })).sort(
    (n, r) => se(n.option) - se(r.option) || n.index - r.index
  ).map(({ option: n }) => n);
}
function se(e) {
  return an(e) ? 0 : G(e.key) || e.label.includes("首帧") ? 1 : fe(e.key) || e.label.includes("尾帧") ? 2 : 3;
}
function ne(e) {
  return sn(e.key) || e.label.includes("首帧") || e.label.includes("尾帧");
}
function E(e, n, r) {
  const t = e.filter(
    (i) => i.acceptedKinds.includes(n)
  );
  if (n !== "image" || !r)
    return t;
  const s = t.filter(
    (i) => !ne(i)
  );
  if (r === "shared_reference")
    return U(s);
  const c = t.filter(
    (i) => G(i.key) || i.label.includes("首帧")
  );
  return c.length > 0 ? U(c) : U(s);
}
function O(e) {
  return String(e || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
}
function Kn(e, n, r, t, s = {}, c = !1, i) {
  const u = new Map(
    (n?.parts || []).flatMap(
      (a) => a.type === "reference" && a.ref_type === "asset" && a.ref_origin === "edge" && a.ref_origin_id ? [[k(a.ref_origin_id, a.ref_id), a]] : []
    )
  ), o = e.flatMap(
    (a) => {
      const d = x(a.source);
      if (!d)
        return [];
      const y = M(a.source), _ = u.get(
        k(
          a.edge.id,
          R(a)
        )
      );
      return [
        {
          referenceKey: un(a),
          label: dn(a),
          kind: d,
          amount: A(_, y),
          mediaCount: y,
          mediaSelected: Z(_),
          usage: cn(a, s),
          required: !0
        }
      ];
    }
  ), l = new Map(
    r.flatMap((a) => {
      const d = Number(a.refId || 0);
      return d > 0 ? [[d, a]] : [];
    })
  );
  for (const [a, d] of (n?.parts || []).entries()) {
    if (d.type !== "reference" || d.ref_type !== "asset" || d.ref_origin === "edge")
      continue;
    const y = l.get(Number(d.ref_id || 0)), _ = K(y?.kind);
    _ && o.push({
      referenceKey: `asset:${d.ref_id}:${a}`,
      label: String(d.label || y?.title || "引用素材"),
      kind: _,
      amount: A(
        d,
        j(y, _, d.ref_media_count)
      ),
      mediaCount: j(
        y,
        _,
        d.ref_media_count
      ),
      mediaSelected: Z(d),
      usage: String(d.usage || ""),
      required: c
    });
  }
  const m = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Set();
  for (const a of o) {
    const d = `${a.referenceKey}:${a.usage}`;
    if (f.has(d))
      continue;
    f.add(d);
    const y = E(
      t,
      a.kind,
      i
    );
    if (y.length === 0) {
      if (a.required)
        return `当前能力未配置可接收${me(a.kind)}素材的参数`;
      continue;
    }
    const _ = tn(y, a.usage);
    if (a.usage && !_)
      return `「${a.label}」的素材用途与当前能力参数不兼容`;
    const b = _ || (y.length === 1 ? y[0] : void 0);
    if (!b)
      return `请为「${a.label}」选择素材用途`;
    const v = a.kind === "image" && i === "per_image", S = v ? 1 : a.amount, I = D(b) > 0 ? Math.max(
      D(b) - (m.get(b.key) || 0),
      0
    ) : 0;
    if (!v && !a.mediaSelected && a.mediaCount > 1 && D(b) > 0 && a.mediaCount > I)
      return `「${a.label}」包含 ${a.mediaCount} 项素材，请从引用中选择具体素材`;
    if (!X(b, m, S))
      return `${b.label}参数最多接收 ${D(b)} 个素材`;
    v || q(m, b.key, S);
  }
  return "";
}
function On(e, n, r, t, s = [], c) {
  const i = r.filter(Xe), u = i.flatMap((a) => {
    const d = x(a);
    return d ? [d] : [];
  }), o = U(
    n.filter(
      (a) => u.every(
        (d) => E(
          [a],
          d,
          c
        ).includes(a)
      )
    )
  );
  if (u.length === 0 || o.length === 0) {
    const a = u[0];
    return {
      usage: void 0,
      error: u.length > 1 ? "当前能力未配置可同时接收该分组媒体素材的参数" : `当前能力未配置可接收${me(a || "file")}素材的参数`
    };
  }
  const l = on(
    e,
    n,
    t,
    s,
    c
  ), m = c === "per_image" && u.every((a) => a === "image") ? 1 : i.reduce(
    (a, d) => a + M(d),
    0
  ), f = le(
    o,
    l,
    m
  );
  return f ? {
    usage: f.key,
    error: ""
  } : {
    usage: void 0,
    error: `${o[0].label}参数已达到素材数量上限`
  };
}
function Ln(e, n, r, t, s, c) {
  if (!n || t.length === 0)
    return { content: n, assignments: {} };
  const i = new Map(
    Q(e, r, s, c).map(
      (a) => [a.key, a]
    )
  ), o = [...Q(
    n,
    r,
    s,
    c
  )].sort((a, d) => {
    const y = ae(
      a,
      i.get(a.key)
    ), _ = ae(
      d,
      i.get(d.key)
    );
    return y - _ || a.partIndex - d.partIndex;
  }), l = n.parts.map((a) => ({ ...a })), m = {}, f = /* @__PURE__ */ new Map();
  for (const a of o) {
    const d = i.get(a.key), y = E(
      t,
      a.kind,
      c
    ), _ = a.usage && a.usage !== d?.usage ? a.usage : "", v = le(
      y,
      f,
      a.kind === "image" && c === "per_image" ? 1 : a.amount,
      _,
      d?.usage || a.usage
    )?.key || "";
    v && (a.kind === "image" && c === "per_image" || q(f, v, a.amount));
    const S = l[a.partIndex];
    S?.type === "reference" && (S.usage = v || void 0), a.connection && v !== String(a.connection.edge.mediaUsage || "") && (m[a.connection.edge.id] = v || void 0);
  }
  return { content: { ...n, parts: l }, assignments: m };
}
function on(e, n, r, t = [], s) {
  const c = /* @__PURE__ */ new Map(), i = Q(
    r,
    t,
    e,
    s
  ), u = /* @__PURE__ */ new Set();
  for (const o of i) {
    const l = n.find((m) => m.key === o.usage);
    l && !(o.kind === "image" && s === "per_image") && q(c, l.key, o.amount), o.connection && u.add(
      k(
        o.connection.edge.id,
        R(o.connection)
      )
    );
  }
  for (const o of e) {
    const l = k(
      o.edge.id,
      R(o)
    );
    if (u.has(l))
      continue;
    const m = String(o.edge.mediaUsage || ""), f = n.find((a) => a.key === m);
    f && !(x(o.source) === "image" && s === "per_image") && q(
      c,
      f.key,
      M(o.source)
    );
  }
  return c;
}
function cn(e, n) {
  return String(
    Object.prototype.hasOwnProperty.call(n, e.edge.id) ? n[e.edge.id] || "" : e.edge.mediaUsage || ""
  );
}
function Q(e, n, r, t) {
  if (!e)
    return [];
  const s = new Map(
    r.map((i) => [
      k(
        i.edge.id,
        R(i)
      ),
      i
    ])
  ), c = /* @__PURE__ */ new Map();
  return e.parts.flatMap((i, u) => {
    if (i.type !== "reference" || i.ref_type !== "asset")
      return [];
    const o = i.ref_origin_id ? s.get(
      k(i.ref_origin_id, i.ref_id)
    ) : void 0, l = n.find(
      (d) => Number(d.refId || 0) === Number(i.ref_id || 0) && (!i.ref_version_id || Number(d.versionID || 0) === Number(i.ref_version_id))
    ), m = o ? x(o.source) : K(l?.kind);
    if (!m)
      return [];
    const f = o ? `edge:${k(
      o.edge.id,
      R(o)
    )}` : `asset:${i.ref_id}:${i.ref_version_id || 0}`, a = c.get(f) || 0;
    return c.set(f, a + 1), [
      {
        key: o ? f : `${f}:${a}`,
        partIndex: u,
        kind: m,
        amount: m === "image" && t === "per_image" ? 1 : o ? A(
          i,
          M(o.source)
        ) : A(
          i,
          j(l, m, i.ref_media_count)
        ),
        usage: String(i.usage || ""),
        connection: o
      }
    ];
  });
}
function ae(e, n) {
  return e.usage && e.usage !== n?.usage ? 0 : n ? 1 : 2;
}
function le(e, n, r, ...t) {
  for (const s of t) {
    const c = e.find((i) => i.key === s);
    if (c && X(c, n, r))
      return c;
  }
  return e.find(
    (s) => X(s, n, r)
  );
}
function D(e) {
  return ne(e) ? 1 : e.maxFiles;
}
function X(e, n, r = 1) {
  const t = D(e);
  return t <= 0 || (n.get(e.key) || 0) + r <= t;
}
function q(e, n, r = 1) {
  e.set(n, (e.get(n) || 0) + r);
}
function ge(e, n) {
  if (n === "image") {
    const r = Me(e);
    if (r.length > 0)
      return r;
  }
  return Re(e, n);
}
function M(e) {
  const n = x(e);
  return !e || !n || n === "file" ? 1 : Math.max(
    1,
    ge(
      [e.asset?.version?.content, e.resultOutput],
      n
    ).length
  );
}
function j(e, n, r = 0) {
  return !e || n === "file" ? Math.max(1, r) : Math.max(
    1,
    r,
    ge(e.output, n).length
  );
}
function Z(e) {
  return !!((e?.ref_media_items?.length || 0) > 0 || String(e?.ref_media_url || "").trim() || Number(e?.ref_media_index || 0) > 0);
}
function A(e, n) {
  return (e?.ref_media_items?.length || 0) > 0 ? e?.ref_media_items?.length || 0 : Z(e) ? 1 : Math.max(1, n);
}
function k(e, n) {
  return `${String(e || "")}:${Number(n || 0)}`;
}
function R(e) {
  return Number(
    e.source.asset?.id || e.source.resultRef?.asset_id || 0
  );
}
function me(e) {
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
function dn(e) {
  return pe(e.source);
}
function pe(e, n) {
  for (const r of [e.asset?.name, n?.title, e.title]) {
    const t = String(r || "").trim();
    if (t)
      return t;
  }
  return "媒体素材";
}
function un(e) {
  const n = Number(
    e.source.asset?.id || e.source.resultRef?.asset_id || 0
  );
  return n > 0 ? `asset:${n}` : `node:${e.source.id}`;
}
function ye(e, n) {
  const r = Number(n.asset?.id || n.resultRef?.asset_id || 0), t = Number(
    n.asset?.version?.id || n.asset?.version_id || n.resultRef?.version_id || 0
  );
  return e.find(
    (s) => Number(s.refId || 0) === r && (!t || Number(s.versionID || 0) === t)
  ) || e.find((s) => s.id === n.id);
}
function re(e, n) {
  const r = String(e || ""), t = gn(n);
  if (!r || t.length === 0)
    return {
      version: 1,
      parts: r ? [{ type: "text", text: r }] : []
    };
  const s = [];
  let c = 0;
  for (; c < r.length; ) {
    const i = mn(r, c, t);
    if (!i) {
      F(s, r.slice(c));
      break;
    }
    i.index > c && F(s, r.slice(c, i.index)), s.push({
      type: "reference",
      ref_type: i.target.refType,
      ref_id: i.target.refId,
      label: w(i.target.label),
      usage: i.target.usage,
      ref_trigger: i.target.trigger || "@",
      ref_version_id: i.target.versionId,
      ref_origin: i.target.origin,
      ref_origin_id: i.target.originID,
      ref_media_url: i.target.mediaURL,
      ref_media_index: i.target.mediaIndex,
      ref_media_count: i.target.mediaCount,
      ref_media_items: i.target.mediaItems
    }), c = i.index + i.target.mention.length;
  }
  return { version: 1, parts: s };
}
function zn(e, n) {
  return re(
    e,
    pn(n)
  );
}
function Bn(e, n) {
  const r = he(
    n,
    B
  ), t = re(e, r), s = new Set(
    _e(t).map(
      B
    )
  ), c = r.filter(
    (u) => !s.has(B(u))
  );
  if (!c.length)
    return t;
  const i = [];
  for (let u = 0; u < c.length; u += 1)
    ke(
      i,
      c[u],
      u === c.length - 1 ? t.parts[0] : void 0
    );
  return { version: 1, parts: [...i, ...t.parts] };
}
function fn(e) {
  return !!e?.parts.some((n) => n.type === "reference");
}
function qn(e, n, r) {
  if (!n || !e.includes("@") && !e.includes("#"))
    return n;
  const t = re(e, [
    ..._e(n),
    ...r
  ]);
  return fn(t) ? t : n;
}
function _e(e) {
  return e ? e.parts.filter((n) => n.type === "reference").map(
    (n) => ({
      refType: n.ref_type,
      refId: n.ref_id,
      label: w(n.label),
      usage: n.usage,
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
function ln(e) {
  return e ? e.parts.map(
    (n) => n.type === "text" ? n.text : `${n.ref_trigger === "#" ? "#" : "@"}${w(n.label)}`
  ).join("") : "";
}
function jn(e, n, r) {
  const t = he(
    r.filter(
      (f) => f.origin === "edge" && !!f.originID
    ),
    z
  ), s = new Map(
    t.map((f) => [z(f), f])
  ), c = n?.version === 1 ? n.parts : e ? [{ type: "text", text: e }] : [], i = [], u = /* @__PURE__ */ new Set();
  let o = !1;
  for (const f of c) {
    if (f.type === "reference" && f.ref_origin === "edge" && f.ref_origin_id) {
      const a = z({
        refId: f.ref_id,
        originID: f.ref_origin_id
      }), d = s.get(a);
      if (!d) {
        o = !0;
        continue;
      }
      ve(i, {
        ...d,
        mediaURL: f.ref_media_url,
        mediaIndex: f.ref_media_index,
        mediaCount: f.ref_media_count,
        mediaItems: f.ref_media_items
      }), u.add(a), o = !1;
      continue;
    }
    if (f.type === "text") {
      let a = f.text;
      if (o && /^\s/.test(a)) {
        const d = i[i.length - 1];
        (!d || d.type === "text" && /\s$/.test(d.text)) && (a = a.slice(1));
      }
      F(i, a), o = !1;
      continue;
    }
    i.push({ ...f }), o = !1;
  }
  const l = t.filter(
    (f) => !u.has(z(f))
  );
  if (l.length > 0) {
    const f = i[i.length - 1];
    f && (f.type !== "text" || !/\s$/.test(f.text)) && F(i, " ");
    for (const a of l)
      ke(i, a);
  }
  const m = { version: 1, parts: i };
  return {
    value: ln(m),
    content: m
  };
}
function w(e) {
  return e.trim().replace(/^[@#]+/, "").trim();
}
function gn(e) {
  const n = /* @__PURE__ */ new Map();
  for (const r of e) {
    if (r.refId <= 0)
      continue;
    const t = r.trigger || "@", s = w(r.label);
    if (!s)
      continue;
    const c = `${t}${s}`;
    n.has(c) || n.set(c, { ...r, mention: c });
  }
  return [...n.values()].sort(
    (r, t) => t.mention.length - r.mention.length
  );
}
function mn(e, n, r) {
  let t;
  for (const s of r) {
    const c = e.indexOf(s.mention, n);
    c < 0 || (!t || c < t.index || c === t.index && s.mention.length > t.target.mention.length) && (t = { index: c, target: s });
  }
  return t;
}
function F(e, n) {
  if (!n)
    return;
  const r = e[e.length - 1];
  if (r?.type === "text") {
    r.text += n;
    return;
  }
  e.push({ type: "text", text: n });
}
function he(e, n = be) {
  const r = [], t = /* @__PURE__ */ new Set();
  for (const s of e) {
    if (s.refId <= 0 || !w(s.label))
      continue;
    const c = n(s);
    t.has(c) || (t.add(c), r.push(s));
  }
  return r;
}
function pn(e) {
  const n = /* @__PURE__ */ new Map();
  for (const r of e) {
    const t = w(r.label);
    if (r.refId <= 0 || !t)
      continue;
    const s = `${r.trigger || "@"}${t}`, c = B(r), i = n.get(s);
    if (!i) {
      n.set(s, {
        target: r,
        targetKey: c,
        ambiguous: !1
      });
      continue;
    }
    i.targetKey !== c && (i.ambiguous = !0);
  }
  return [...n.values()].filter((r) => !r.ambiguous).map((r) => r.target);
}
function B(e) {
  return `${be(e)}:${e.usage || ""}`;
}
function be(e) {
  return e.originID ? `${e.refType}:${e.refId}:${e.origin || ""}:${e.originID}` : `${e.refType}:${e.refId}`;
}
function z(e) {
  return `${String(e.originID || "")}:${Number(e.refId || 0)}`;
}
function ve(e, n) {
  e.push({
    type: "reference",
    ref_type: n.refType,
    ref_id: n.refId,
    label: w(n.label),
    usage: n.usage,
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
function ke(e, n, r) {
  ve(e, n), yn(e, r);
}
function yn(e, n) {
  n?.type === "text" && /^\s/.test(n.text) || F(e, " ");
}
function Vn(e, n, r, t, s) {
  if (!n || !r || n === r)
    return e;
  const c = e.findIndex((l) => s(l) === n);
  if (c < 0)
    return e;
  const i = [...e], [u] = i.splice(c, 1), o = i.findIndex((l) => s(l) === r);
  return o < 0 ? e : (i.splice(o + (t === "after" ? 1 : 0), 0, u), i);
}
function Gn(e, n, r) {
  if (!n.length)
    return e;
  const t = new Map(e.map((i) => [r(i), i])), s = [];
  for (const i of n)
    t.has(i) && s.push(t.get(i));
  const c = new Set(s.map(r));
  return [
    ...s,
    ...e.filter((i) => !c.has(r(i)))
  ];
}
function Hn(e, n) {
  return e.length === n.length && e.every((r, t) => r === n[t]);
}
function _n({
  itemId: e,
  index: n,
  durationLabel: r,
  className: t,
  dragClassName: s,
  selected: c = !1,
  readonly: i = !1,
  wholeCardDraggable: u = !1,
  dragging: o = !1,
  dropPlacement: l,
  ariaLabel: m,
  headerActions: f,
  children: a,
  onSelect: d,
  onDragStart: y,
  onDragOver: _,
  onDrop: b,
  onDragEnd: v
}) {
  const S = De(!1);
  function I(p) {
    const L = p.target;
    if (u && L instanceof HTMLElement && L.closest("button, a, input, textarea, select")) {
      p.preventDefault();
      return;
    }
    S.current = !0, p.dataTransfer.effectAllowed = "move", p.dataTransfer.setData("text/plain", e), u && p.dataTransfer.setDragImage(p.currentTarget, 28, 18), y();
  }
  function $() {
    v(), window.setTimeout(() => {
      S.current = !1;
    }, 0);
  }
  return /* @__PURE__ */ h(
    "article",
    {
      className: [
        "ws-sequence-card",
        t,
        c ? "is-selected" : "",
        u && !i ? "is-drag-enabled" : "",
        o ? "is-dragging" : "",
        l ? `is-drop-${l}` : ""
      ].filter(Boolean).join(" "),
      "data-sequence-item-id": e,
      "aria-label": m,
      draggable: !i && u,
      onClick: () => {
        S.current || d();
      },
      onDragStart: !i && u ? I : void 0,
      onDragOver: i ? void 0 : (p) => {
        p.preventDefault(), p.dataTransfer.dropEffect = "move", _(p);
      },
      onDrop: i ? void 0 : (p) => {
        p.preventDefault(), b();
      },
      onDragEnd: !i && u ? $ : void 0,
      children: [
        /* @__PURE__ */ h("header", { children: [
          u ? /* @__PURE__ */ g(P, { label: i ? void 0 : "拖动卡片排序", children: /* @__PURE__ */ g("span", { className: s, "aria-hidden": "true", children: /* @__PURE__ */ g(te, { size: 13 }) }) }) : /* @__PURE__ */ g(P, { label: i ? void 0 : "拖动排序", children: /* @__PURE__ */ g(
            "button",
            {
              type: "button",
              className: s,
              draggable: !i,
              disabled: i,
              "aria-label": `拖动${m}排序`,
              onClick: (p) => p.stopPropagation(),
              onDragStart: I,
              onDragEnd: $,
              children: /* @__PURE__ */ g(te, { size: 13 })
            }
          ) }),
          /* @__PURE__ */ g("strong", { children: String(n + 1).padStart(2, "0") }),
          /* @__PURE__ */ g("span", { children: r }),
          f || /* @__PURE__ */ g("i", { "aria-hidden": "true" })
        ] }),
        a
      ]
    }
  );
}
function Jn({
  shot: e,
  index: n,
  storyboard: r,
  selected: t = !1,
  editable: s = !1,
  dragging: c = !1,
  dropPlacement: i,
  onOpen: u,
  onDuplicate: o,
  onRemove: l,
  onDragStart: m,
  onDragOver: f,
  onDrop: a,
  onDragEnd: d
}) {
  const y = e.speech.filter((_) => _.text.trim()).length;
  return /* @__PURE__ */ h(
    _n,
    {
      itemId: e.id,
      index: n,
      durationLabel: `${e.duration}秒`,
      className: "ws-storyboard-card",
      dragClassName: "ws-storyboard-card-drag",
      selected: t,
      readonly: !s,
      wholeCardDraggable: !0,
      dragging: c,
      dropPlacement: i,
      ariaLabel: `镜头 ${n + 1}`,
      onSelect: u,
      onDragStart: m || W,
      onDragOver: f || bn,
      onDrop: a || W,
      onDragEnd: d || W,
      headerActions: /* @__PURE__ */ g("span", { className: "ws-storyboard-card-count", children: y ? `${y} 条语音` : "无语音" }),
      children: [
        /* @__PURE__ */ g(
          hn,
          {
            shot: e,
            storyboard: r
          }
        ),
        /* @__PURE__ */ h("footer", { children: [
          /* @__PURE__ */ g(P, { label: s ? "编辑镜头" : "查看镜头", children: /* @__PURE__ */ g(
            "button",
            {
              type: "button",
              "aria-label": s ? "编辑镜头" : "查看镜头",
              onClick: J(u),
              children: /* @__PURE__ */ g(ze, { size: 13 })
            }
          ) }),
          s && o ? /* @__PURE__ */ g(P, { label: "复制镜头", children: /* @__PURE__ */ g(
            "button",
            {
              type: "button",
              "aria-label": "复制镜头",
              onClick: J(o),
              children: /* @__PURE__ */ g(Ce, { size: 13 })
            }
          ) }) : null,
          s && l ? /* @__PURE__ */ g(P, { label: "删除镜头", children: /* @__PURE__ */ g(
            "button",
            {
              type: "button",
              className: "is-danger",
              "aria-label": "删除镜头",
              onClick: J(l),
              children: /* @__PURE__ */ g($e, { size: 13 })
            }
          ) }) : null
        ] })
      ]
    }
  );
}
function Wn({
  shot: e,
  index: n,
  storyboard: r,
  onOpen: t
}) {
  return /* @__PURE__ */ h(
    "button",
    {
      type: "button",
      className: "ws-storyboard-compact-card nodrag nopan",
      disabled: !t,
      onMouseDown: (s) => s.stopPropagation(),
      onClick: (s) => {
        s.preventDefault(), s.stopPropagation(), t?.();
      },
      children: [
        /* @__PURE__ */ h("span", { className: "ws-storyboard-compact-head", children: [
          /* @__PURE__ */ g("strong", { children: String(n + 1).padStart(2, "0") }),
          /* @__PURE__ */ h("span", { children: [
            e.duration,
            "秒"
          ] }),
          /* @__PURE__ */ g(
            xe,
            {
              continues: e.continue_previous,
              matches: e.match_previous
            }
          )
        ] }),
        /* @__PURE__ */ g("span", { className: "ws-storyboard-compact-description", children: e.beat || e.description || `镜头 ${n + 1}` }),
        /* @__PURE__ */ g("span", { className: "ws-storyboard-compact-materials", children: /* @__PURE__ */ g(Se, { shot: e, storyboard: r }) })
      ]
    }
  );
}
function hn({ shot: e, storyboard: n }) {
  const r = e.speech.filter((o) => o.text.trim()), t = r[0], s = new Map(
    n.materials.filter((o) => o.type === "character").map((o) => [o.id, o.name])
  ), c = [...new Set(r.map(Ue))], i = Ee(e).length, u = Ae(e);
  return /* @__PURE__ */ h(ce, { children: [
    /* @__PURE__ */ h("div", { className: "ws-storyboard-card-preview", children: [
      /* @__PURE__ */ g("span", { children: /* @__PURE__ */ g(
        xe,
        {
          continues: e.continue_previous,
          matches: e.match_previous
        }
      ) }),
      /* @__PURE__ */ g("strong", { children: e.beat || `镜头 ${e.order} 的叙事变化` }),
      /* @__PURE__ */ g("p", { children: e.description || "等待补充镜头内容" })
    ] }),
    /* @__PURE__ */ h("div", { className: "ws-storyboard-card-body", children: [
      /* @__PURE__ */ h("div", { className: "ws-storyboard-card-tags", children: [
        /* @__PURE__ */ g(Se, { shot: e, storyboard: n }),
        c.map((o) => /* @__PURE__ */ g("span", { children: o }, o)),
        i ? /* @__PURE__ */ h("span", { children: [
          i,
          " 条字幕"
        ] }) : null,
        u ? /* @__PURE__ */ g("span", { className: "is-lip-sync", children: "可选口型" }) : null
      ] }),
      /* @__PURE__ */ g("p", { className: "ws-storyboard-card-camera", children: e.camera_instruction || "未设置镜头语言" }),
      t ? /* @__PURE__ */ h("p", { className: "ws-storyboard-card-speech", children: [
        t.kind === "dialogue" ? /* @__PURE__ */ g(we, { size: 12 }) : /* @__PURE__ */ g(Ie, { size: 12 }),
        /* @__PURE__ */ g("strong", { children: t.kind === "dialogue" ? s.get(t.character_id || "") || "待选角色" : "旁白" }),
        /* @__PURE__ */ g("span", { children: t.text })
      ] }) : /* @__PURE__ */ h("p", { className: "ws-storyboard-card-speech is-empty", children: [
        /* @__PURE__ */ g(Oe, { size: 12 }),
        /* @__PURE__ */ g("span", { children: "当前镜头没有对白或旁白" })
      ] })
    ] })
  ] });
}
function Se({
  shot: e,
  storyboard: n
}) {
  const r = /* @__PURE__ */ new Map();
  for (const t of Pe(n, e))
    r.set(t.type, (r.get(t.type) || 0) + 1);
  return r.size ? /* @__PURE__ */ g(ce, { children: ["character", "scene", "prop"].map(
    (t) => r.get(t) ? /* @__PURE__ */ h("span", { children: [
      Te[t],
      " ",
      r.get(t)
    ] }, t) : null
  ) }) : /* @__PURE__ */ g("span", { className: "is-empty", children: "无关联素材" });
}
function xe({
  continues: e,
  matches: n
}) {
  const r = e || n;
  return /* @__PURE__ */ h(
    "span",
    {
      className: `ws-storyboard-continuity ${r ? "is-linked" : "is-cut"}`,
      children: [
        r ? /* @__PURE__ */ g(Ne, { size: 11 }) : /* @__PURE__ */ g(qe, { size: 11 }),
        e ? "延续上镜" : n ? "匹配上镜" : "切镜"
      ]
    }
  );
}
function J(e) {
  return (n) => {
    n.stopPropagation(), e();
  };
}
function W() {
}
function bn(e) {
}
export {
  fn as A,
  _e as B,
  Wn as C,
  Xe as D,
  En as E,
  An as F,
  On as G,
  Dn as H,
  Fn as I,
  nn as J,
  en as K,
  Kn as L,
  Oe as M,
  _n as S,
  ge as a,
  Tn as b,
  zn as c,
  Pn as d,
  Un as e,
  Ln as f,
  Ve as g,
  N as h,
  $n as i,
  Nn as j,
  C as k,
  x as l,
  ye as m,
  w as n,
  Gn as o,
  Ge as p,
  Hn as q,
  jn as r,
  A as s,
  Vn as t,
  Jn as u,
  qn as v,
  Cn as w,
  qe as x,
  Bn as y,
  ln as z
};
