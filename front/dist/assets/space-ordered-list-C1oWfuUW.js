import { p as te, E as he, F as ve } from "./storyboard-grid-view-CJXm84yJ.js";
import { m as be } from "./space-sequence-card-CzyxbAhV.js";
const re = /* @__PURE__ */ new Set([
  "image",
  "video",
  "audio",
  "file"
]);
function Ze(e) {
  return e.type === "file" || e.type === "files";
}
function ke(e) {
  return e.type === "prompt";
}
function en(e) {
  return ![
    "hidden",
    "description",
    "prompt",
    "file",
    "files"
  ].includes(e.type);
}
function nn(e) {
  const n = Array.from(
    new Set(
      (e.accepted_kinds || e.asset_kinds || []).map(H).filter((r) => !!r)
    )
  );
  if (n.length > 0)
    return n;
  const t = `${e.name || ""} ${e.key || ""}`.toLowerCase();
  return /video|视频/.test(t) ? ["video"] : /audio|music|音频|音乐/.test(t) ? ["audio"] : /image|img|photo|picture|图片|图像|参考图|首帧|尾帧/.test(t) ? ["image"] : /text|文本|提示词|文案/.test(t) ? ["file"] : ["image", "audio", "video", "file"];
}
function Pe(e) {
  return (e.accepted_kinds || []).map(H).filter(
    (n) => !!n && re.has(n)
  );
}
function O(e) {
  const n = H(e);
  return n && re.has(n) ? n : void 0;
}
function Re(e) {
  return e.type !== "files" ? 1 : Math.max(0, Number(e.max_files || 0));
}
function H(e) {
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
function xe(e) {
  const n = e.default_value ?? "";
  if (e.type === "switch")
    return we(n);
  if (e.type === "multi_option")
    return J(e, Z(n));
  if (e.type === "files")
    return W(Z(n));
  if (e.type === "option" || e.type === "select") {
    const t = R(e.options || [], n) || e.options?.[0];
    return S(
      e,
      w(t) || n
    );
  }
  return S(e, n);
}
function ie(e) {
  const n = {};
  for (const t of e)
    !t.key || t.type === "description" || (n[t.key] = xe(t));
  return n;
}
function tn(e, n, t) {
  const r = ie(e), o = new Map(
    t.map((s) => [s.key, s])
  );
  for (const s of e) {
    const i = o.get(s.key);
    s.key && i && Object.prototype.hasOwnProperty.call(n, s.key) && Me(s, i, n[s.key]) && (r[s.key] = J(s, n[s.key]));
  }
  return r;
}
function rn(e, n) {
  const t = ie(e), r = n.paramValues || {};
  for (const s of e)
    s.key && Object.prototype.hasOwnProperty.call(r, s.key) && (t[s.key] = J(
      s,
      r[s.key]
    ));
  const o = e.find(ke);
  return o?.key && n.prompt.trim() && (t[o.key] = n.prompt), t;
}
function S(e, n) {
  if (e.value_type !== "number" || n === "")
    return n;
  const t = Number(n);
  return Number.isFinite(t) ? t : n;
}
function J(e, n) {
  if (e.type === "option" || e.type === "select") {
    const t = R(e.options || [], n) || e.options?.[0];
    return S(
      e,
      w(t) || n
    );
  }
  return e.type === "multi_option" ? W(n).map((t) => {
    const r = R(e.options || [], t);
    return S(
      e,
      w(r) || t
    );
  }) : S(e, n);
}
function Me(e, n, t) {
  if (e.type !== n.type || e.value_type !== n.value_type)
    return !1;
  if (e.type === "option" || e.type === "select") {
    const r = e.options || [];
    return r.length === 0 || !!R(r, t);
  }
  if (e.type === "multi_option") {
    const r = e.options || [];
    return r.length === 0 || W(t).every(
      (o) => !!R(r, o)
    );
  }
  return e.value_type === "number" ? t === "" || Number.isFinite(Number(t)) : !0;
}
function w(e) {
  return e ? String(e.native_value || "").trim() || String(e.value || "").trim() || String(e.name || "").trim() || String(e.id || "") : "";
}
function R(e, n) {
  const t = String(n ?? "").trim();
  if (!t)
    return;
  const r = [
    (o) => o.native_value,
    (o) => o.value,
    (o) => o.name,
    (o) => o.id
  ];
  for (const o of r) {
    const s = e.find(
      (i) => String(o(i) ?? "").trim() === t
    );
    if (s)
      return s;
  }
}
function sn(e, n, t = [e]) {
  return n.some(
    (r) => R(t, r) === e
  );
}
function Z(e) {
  if (typeof e != "string")
    return e;
  try {
    return JSON.parse(e);
  } catch {
    return e;
  }
}
function W(e) {
  return Array.isArray(e) ? e.map((n) => String(n)).filter(Boolean) : typeof e == "string" ? e ? [e] : [] : e ? [String(e)] : [];
}
function we(e) {
  if (typeof e == "boolean")
    return e;
  const n = String(e ?? "").trim().toLowerCase();
  return n === "1" || n === "true" || n === "yes" || n === "on";
}
const F = be, Ie = F.filterActivePowerParams || ((e) => e), on = F.isPowerParamConditionController || (() => !1), an = F.shouldDisplayPowerParam || (() => !0), cn = F.PowerParamOptionDialog, un = F.normalizeParamPreviewType, Se = "referencemode", Ce = "frames", $e = "references";
function fn({
  node: e,
  content: n,
  items: t,
  connections: r,
  params: o,
  values: s,
  requestedMode: i,
  additionalSources: d = []
}) {
  const c = (l) => {
    const m = se(o, s, l);
    return m ? Fe(Ie(o, m)) : [];
  };
  return Ke({
    targetKind: b(e) || e.power?.kind || e.kind,
    content: n,
    items: t,
    connections: r,
    mediaOptionsByMode: {
      per_image: c("per_image"),
      shared_reference: c("shared_reference")
    },
    requestedMode: i,
    additionalSources: d
  });
}
function dn(e, n) {
  return e.flatMap(({ edge: t, source: r }) => {
    const o = de(n, r), s = Number(
      o?.refId || r.asset?.id || r.resultRef?.asset_id || 0
    );
    return s <= 0 ? [] : [
      {
        refType: "asset",
        refId: s,
        versionId: Number(
          o?.versionID || r.asset?.version?.id || r.asset?.version_id || r.resultRef?.version_id || 0
        ),
        label: fe(r, o),
        usage: String(t.mediaUsage || ""),
        trigger: "@",
        origin: "edge",
        originID: t.id,
        mediaCount: k(r)
      }
    ];
  });
}
function b(e) {
  if (!e)
    return;
  const n = [e.kind, e.asset?.kind, e.power?.kind], t = [e.asset?.version?.content, e.resultOutput];
  if (te(t)?.frames.some((s) => !!s.image))
    return "image";
  let o = !1;
  for (const s of n) {
    const i = O(s);
    if (i === "file") {
      o = !0;
      continue;
    }
    if (i)
      return i;
  }
  return o && Ne(t) ? "file" : void 0;
}
function Ue(e) {
  return !!b(e);
}
function Ne(e) {
  return e.some(
    (n) => z(n, /* @__PURE__ */ new Set(), 0)
  );
}
function z(e, n, t) {
  if (e == null || t > 10)
    return !1;
  if (typeof e == "string")
    return /^(?:https?:\/\/|\/|data:)/i.test(e.trim());
  if (Array.isArray(e))
    return e.some((o) => z(o, n, t + 1));
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
  ].some((o) => z(o, n, t + 1));
}
function ln(e, n, t, r) {
  const o = t.some((i) => {
    const d = b(i);
    return d === "video" || d === "audio";
  });
  if (!o && !r)
    return n;
  const s = r || (o ? "shared_reference" : void 0);
  return s && se(e, n, s) || n;
}
function Oe(e) {
  return K(e.key) === Se;
}
function se(e, n, t) {
  const r = e.find(Oe);
  if (!r?.key)
    return n;
  const o = t === "per_image" && e.some(
    (d) => (d.type === "file" || d.type === "files") && (B(d.key) || String(d.name || "").includes("首帧"))
  ) ? Ce : $e, s = R(
    r.options || [],
    o
  );
  if (!s)
    return;
  const i = R(
    r.options || [],
    n[r.key]
  );
  return w(i) === w(s) ? n : {
    ...n,
    [r.key]: w(s)
  };
}
function Fe(e) {
  const n = e.flatMap((t) => {
    if (t.type !== "file" && t.type !== "files")
      return [];
    const r = String(t.key || "").trim(), o = Pe(t);
    return !r || o.length === 0 ? [] : [
      {
        key: r,
        label: String(t.name || r),
        maxFiles: Re(t),
        acceptedKinds: o
      }
    ];
  });
  return C(
    n.map(
      (t) => Y(t) ? { ...t, maxFiles: 1 } : t
    )
  );
}
function Ke({
  targetKind: e,
  content: n,
  items: t,
  connections: r,
  mediaOptionsByMode: o,
  requestedMode: s,
  additionalSources: i = []
}) {
  const d = De(
    n,
    t,
    r,
    i
  ), c = d.reduce(
    (y, _e) => y + _e.amount,
    0
  ), l = d.some((y) => B(y.usage)) && d.some((y) => oe(y.usage)), m = O(e) === "video" && c > 1 && !l, f = $(
    o.per_image,
    "image",
    "per_image"
  ), a = $(
    o.shared_reference,
    "image",
    "shared_reference"
  ), u = f.length > 0, g = a.length > 0, p = [
    {
      value: "per_image",
      label: "逐图生成",
      enabled: u,
      reason: u ? void 0 : "当前能力没有可逐张接收图片的参数"
    },
    {
      value: "shared_reference",
      label: "共同参考",
      enabled: g,
      reason: g ? void 0 : "当前能力没有可接收多图的参考参数"
    }
  ];
  if (!m)
    return {
      active: !1,
      imageCount: c,
      structured: d.some((y) => y.structured),
      explicitFramePair: l,
      options: p,
      error: ""
    };
  const _ = d.some((y) => y.structured), h = _ ? u ? "per_image" : "shared_reference" : g ? "shared_reference" : "per_image", L = p.find(
    (y) => y.value === s && y.enabled
  )?.value || h, X = p.some((y) => y.enabled);
  return {
    active: m,
    imageCount: c,
    structured: _,
    explicitFramePair: l,
    mode: X ? L : void 0,
    defaultMode: h,
    options: p,
    error: X ? "" : "当前能力无法接收这组图片素材"
  };
}
function De(e, n, t, r) {
  const o = new Map(
    t.map(
      (c) => [
        v(
          c.edge.id,
          P(c)
        ),
        c
      ]
    )
  ), s = /* @__PURE__ */ new Set(), i = [];
  for (const c of e?.parts || []) {
    if (c.type !== "reference" || c.ref_type !== "asset")
      continue;
    const l = c.ref_origin_id ? o.get(
      v(c.ref_origin_id, c.ref_id)
    ) : void 0, m = l ? de(n, l.source) : n.find(
      (u) => Number(u.refId || 0) === Number(c.ref_id || 0) && (!c.ref_version_id || Number(u.versionID || 0) === Number(c.ref_version_id))
    );
    if ((l ? b(l.source) : O(m?.kind)) !== "image")
      continue;
    l && s.add(
      v(
        l.edge.id,
        P(l)
      )
    );
    const a = l ? k(l.source) : A(m, "image", c.ref_media_count);
    i.push({
      amount: U(c, a),
      usage: String(c.usage || l?.edge.mediaUsage || ""),
      structured: V(l?.source, m)
    });
  }
  for (const c of t) {
    const l = v(
      c.edge.id,
      P(c)
    );
    s.has(l) || b(c.source) !== "image" || i.push({
      amount: k(c.source),
      usage: String(c.edge.mediaUsage || ""),
      structured: V(c.source)
    });
  }
  const d = new Set(
    t.map((c) => c.source.id)
  );
  for (const c of r)
    d.has(c.id) || b(c) !== "image" || i.push({
      amount: k(c),
      usage: "",
      structured: V(c)
    });
  return i;
}
function V(e, n) {
  return !!(e?.storyboardItem?.itemType === "shot_image" || te([
    e?.asset?.version?.content,
    e?.resultOutput,
    n?.output,
    n?.asset
  ]));
}
function Ee(e, n) {
  return e.find((t) => t.key === n);
}
function B(e) {
  const n = K(e);
  return n === "firstframe" || n === "startframe";
}
function oe(e) {
  const n = K(e);
  return n === "lastframe" || n === "endframe";
}
function Te(e) {
  const n = K(e);
  return n === "firstframe" || n === "startframe" || n === "lastframe" || n === "endframe";
}
function Ae(e) {
  if (!e.acceptedKinds.includes("image"))
    return !1;
  const n = K(e.key), t = String(e.label || "").trim();
  return ["images", "reference", "referenceimage", "referenceimages"].includes(
    n
  ) || t.includes("参考图") || t.includes("参考图片");
}
function C(e) {
  return e.map((n, t) => ({ option: n, index: t })).sort(
    (n, t) => ee(n.option) - ee(t.option) || n.index - t.index
  ).map(({ option: n }) => n);
}
function ee(e) {
  return Ae(e) ? 0 : B(e.key) || e.label.includes("首帧") ? 1 : oe(e.key) || e.label.includes("尾帧") ? 2 : 3;
}
function Y(e) {
  return Te(e.key) || e.label.includes("首帧") || e.label.includes("尾帧");
}
function $(e, n, t) {
  const r = e.filter(
    (i) => i.acceptedKinds.includes(n)
  );
  if (n !== "image" || !t)
    return r;
  const o = r.filter((i) => !Y(i));
  if (t === "shared_reference")
    return C(o);
  const s = r.filter(
    (i) => B(i.key) || i.label.includes("首帧")
  );
  return s.length > 0 ? C(s) : C(o);
}
function K(e) {
  return String(e || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
}
function mn(e, n, t, r, o = {}, s = !1, i) {
  const d = new Map(
    (n?.parts || []).flatMap(
      (a) => a.type === "reference" && a.ref_type === "asset" && a.ref_origin === "edge" && a.ref_origin_id ? [
        [
          v(a.ref_origin_id, a.ref_id),
          a
        ]
      ] : []
    )
  ), c = e.flatMap(
    (a) => {
      const u = b(a.source);
      if (!u)
        return [];
      const g = k(a.source), p = d.get(
        v(
          a.edge.id,
          P(a)
        )
      );
      return [
        {
          referenceKey: qe(a),
          label: ze(a),
          kind: u,
          amount: U(p, g),
          mediaCount: g,
          mediaSelected: G(p),
          usage: Le(a, o),
          required: !0
        }
      ];
    }
  ), l = new Map(
    t.flatMap((a) => {
      const u = Number(a.refId || 0);
      return u > 0 ? [[u, a]] : [];
    })
  );
  for (const [a, u] of (n?.parts || []).entries()) {
    if (u.type !== "reference" || u.ref_type !== "asset" || u.ref_origin === "edge")
      continue;
    const g = l.get(Number(u.ref_id || 0)), p = O(g?.kind);
    p && c.push({
      referenceKey: `asset:${u.ref_id}:${a}`,
      label: String(u.label || g?.title || "引用素材"),
      kind: p,
      amount: U(
        u,
        A(g, p, u.ref_media_count)
      ),
      mediaCount: A(
        g,
        p,
        u.ref_media_count
      ),
      mediaSelected: G(u),
      usage: String(u.usage || ""),
      required: s
    });
  }
  const m = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Set();
  for (const a of c) {
    const u = `${a.referenceKey}:${a.usage}`;
    if (f.has(u))
      continue;
    f.add(u);
    const g = $(
      r,
      a.kind,
      i
    );
    if (g.length === 0) {
      if (a.required)
        return `当前能力未配置可接收${ue(a.kind)}素材的参数`;
      continue;
    }
    const p = Ee(g, a.usage);
    if (a.usage && !p)
      return `「${a.label}」的素材用途与当前能力参数不兼容`;
    const _ = p || (g.length === 1 ? g[0] : void 0);
    if (!_)
      return `请为「${a.label}」选择素材用途`;
    const h = a.kind === "image" && i === "per_image", M = h ? 1 : a.amount, L = I(_) > 0 ? Math.max(
      I(_) - (m.get(_.key) || 0),
      0
    ) : 0;
    if (!h && !a.mediaSelected && a.mediaCount > 1 && I(_) > 0 && a.mediaCount > L)
      return `「${a.label}」包含 ${a.mediaCount} 项素材，请从引用中选择具体素材`;
    if (!j(_, m, M))
      return `${_.label}参数最多接收 ${I(_)} 个素材`;
    h || T(m, _.key, M);
  }
  return "";
}
function gn(e, n, t, r, o = [], s) {
  const i = t.filter(Ue), d = i.flatMap((a) => {
    const u = b(a);
    return u ? [u] : [];
  }), c = C(
    n.filter(
      (a) => d.every(
        (u) => $([a], u, s).includes(
          a
        )
      )
    )
  );
  if (d.length === 0 || c.length === 0) {
    const a = d[0];
    return {
      usage: void 0,
      error: d.length > 1 ? "当前能力未配置可同时接收该分组媒体素材的参数" : `当前能力未配置可接收${ue(a || "file")}素材的参数`
    };
  }
  const l = Be(
    e,
    n,
    r,
    o,
    s
  ), m = s === "per_image" && d.every((a) => a === "image") ? 1 : i.reduce(
    (a, u) => a + k(u),
    0
  ), f = ae(
    c,
    l,
    m
  );
  return f ? {
    usage: f.key,
    error: ""
  } : {
    usage: void 0,
    error: `${c[0].label}参数已达到素材数量上限`
  };
}
function pn(e, n, t, r, o, s) {
  if (!n || r.length === 0)
    return { content: n, assignments: {} };
  const i = new Map(
    q(
      e,
      t,
      o,
      s
    ).map((a) => [a.key, a])
  ), c = [...q(
    n,
    t,
    o,
    s
  )].sort((a, u) => {
    const g = ne(
      a,
      i.get(a.key)
    ), p = ne(
      u,
      i.get(u.key)
    );
    return g - p || a.partIndex - u.partIndex;
  }), l = n.parts.map((a) => ({ ...a })), m = {}, f = /* @__PURE__ */ new Map();
  for (const a of c) {
    const u = i.get(a.key), g = $(
      r,
      a.kind,
      s
    ), p = a.usage && a.usage !== u?.usage ? a.usage : "", h = ae(
      g,
      f,
      a.kind === "image" && s === "per_image" ? 1 : a.amount,
      p,
      u?.usage || a.usage
    )?.key || "";
    h && (a.kind === "image" && s === "per_image" || T(f, h, a.amount));
    const M = l[a.partIndex];
    M?.type === "reference" && (M.usage = h || void 0), a.connection && h !== String(a.connection.edge.mediaUsage || "") && (m[a.connection.edge.id] = h || void 0);
  }
  return { content: { ...n, parts: l }, assignments: m };
}
function Be(e, n, t, r = [], o) {
  const s = /* @__PURE__ */ new Map(), i = q(
    t,
    r,
    e,
    o
  ), d = /* @__PURE__ */ new Set();
  for (const c of i) {
    const l = n.find((m) => m.key === c.usage);
    l && !(c.kind === "image" && o === "per_image") && T(s, l.key, c.amount), c.connection && d.add(
      v(
        c.connection.edge.id,
        P(c.connection)
      )
    );
  }
  for (const c of e) {
    const l = v(
      c.edge.id,
      P(c)
    );
    if (d.has(l))
      continue;
    const m = String(c.edge.mediaUsage || ""), f = n.find((a) => a.key === m);
    f && !(b(c.source) === "image" && o === "per_image") && T(
      s,
      f.key,
      k(c.source)
    );
  }
  return s;
}
function Le(e, n) {
  return String(
    Object.prototype.hasOwnProperty.call(n, e.edge.id) ? n[e.edge.id] || "" : e.edge.mediaUsage || ""
  );
}
function q(e, n, t, r) {
  if (!e)
    return [];
  const o = new Map(
    t.map((i) => [
      v(
        i.edge.id,
        P(i)
      ),
      i
    ])
  ), s = /* @__PURE__ */ new Map();
  return e.parts.flatMap((i, d) => {
    if (i.type !== "reference" || i.ref_type !== "asset")
      return [];
    const c = i.ref_origin_id ? o.get(
      v(i.ref_origin_id, i.ref_id)
    ) : void 0, l = n.find(
      (u) => Number(u.refId || 0) === Number(i.ref_id || 0) && (!i.ref_version_id || Number(u.versionID || 0) === Number(i.ref_version_id))
    ), m = c ? b(c.source) : O(l?.kind);
    if (!m)
      return [];
    const f = c ? `edge:${v(
      c.edge.id,
      P(c)
    )}` : `asset:${i.ref_id}:${i.ref_version_id || 0}`, a = s.get(f) || 0;
    return s.set(f, a + 1), [
      {
        key: c ? f : `${f}:${a}`,
        partIndex: d,
        kind: m,
        amount: m === "image" && r === "per_image" ? 1 : c ? U(
          i,
          k(c.source)
        ) : U(
          i,
          A(
            l,
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
function ne(e, n) {
  return e.usage && e.usage !== n?.usage ? 0 : n ? 1 : 2;
}
function ae(e, n, t, ...r) {
  for (const o of r) {
    const s = e.find((i) => i.key === o);
    if (s && j(s, n, t))
      return s;
  }
  return e.find(
    (o) => j(o, n, t)
  );
}
function I(e) {
  return Y(e) ? 1 : e.maxFiles;
}
function j(e, n, t = 1) {
  const r = I(e);
  return r <= 0 || (n.get(e.key) || 0) + t <= r;
}
function T(e, n, t = 1) {
  e.set(n, (e.get(n) || 0) + t);
}
function ce(e, n) {
  return Ve(e, n).map((t) => t.url);
}
function Ve(e, n) {
  if (n === "image") {
    const t = he(e);
    if (t.length > 0)
      return t.map((r) => ({ url: r, thumbnail: r }));
  }
  return ve(e, n);
}
function k(e) {
  const n = b(e);
  return !e || !n || n === "file" ? 1 : Math.max(
    1,
    ce(
      [e.asset?.version?.content, e.resultOutput],
      n
    ).length
  );
}
function A(e, n, t = 0) {
  return !e || n === "file" ? Math.max(1, t) : Math.max(
    1,
    t,
    ce(e.output, n).length
  );
}
function G(e) {
  return !!((e?.ref_media_items?.length || 0) > 0 || String(e?.ref_media_url || "").trim() || Number(e?.ref_media_index || 0) > 0);
}
function U(e, n) {
  return (e?.ref_media_items?.length || 0) > 0 ? e?.ref_media_items?.length || 0 : G(e) ? 1 : Math.max(1, n);
}
function v(e, n) {
  return `${String(e || "")}:${Number(n || 0)}`;
}
function P(e) {
  return Number(
    e.source.asset?.id || e.source.resultRef?.asset_id || 0
  );
}
function ue(e) {
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
function ze(e) {
  return fe(e.source);
}
function fe(e, n) {
  for (const t of [e.asset?.name, n?.title, e.title]) {
    const r = String(t || "").trim();
    if (r)
      return r;
  }
  return "媒体素材";
}
function qe(e) {
  const n = Number(
    e.source.asset?.id || e.source.resultRef?.asset_id || 0
  );
  return n > 0 ? `asset:${n}` : `node:${e.source.id}`;
}
function de(e, n) {
  const t = Number(n.asset?.id || n.resultRef?.asset_id || 0), r = Number(
    n.asset?.version?.id || n.asset?.version_id || n.resultRef?.version_id || 0
  );
  return e.find(
    (o) => Number(o.refId || 0) === t && (!r || Number(o.versionID || 0) === r)
  ) || e.find((o) => o.id === n.id);
}
function Q(e, n) {
  const t = String(e || ""), r = He(n);
  if (!t || r.length === 0)
    return {
      version: 1,
      parts: t ? [{ type: "text", text: t }] : []
    };
  const o = [];
  let s = 0;
  for (; s < t.length; ) {
    const i = Je(t, s, r);
    if (!i) {
      N(o, t.slice(s));
      break;
    }
    i.index > s && N(o, t.slice(s, i.index)), o.push({
      type: "reference",
      ref_type: i.target.refType,
      ref_id: i.target.refId,
      label: x(i.target.label),
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
    }), s = i.index + i.target.mention.length;
  }
  return { version: 1, parts: o };
}
function yn(e, n) {
  return Q(
    e,
    We(n)
  );
}
function _n(e, n) {
  const t = me(
    n,
    E
  ), r = Q(e, t), o = new Set(
    le(r).map(
      E
    )
  ), s = t.filter(
    (d) => !o.has(E(d))
  );
  if (!s.length)
    return r;
  const i = [];
  for (let d = 0; d < s.length; d += 1)
    ye(
      i,
      s[d],
      d === s.length - 1 ? r.parts[0] : void 0
    );
  return { version: 1, parts: [...i, ...r.parts] };
}
function je(e) {
  return !!e?.parts.some((n) => n.type === "reference");
}
function hn(e, n, t) {
  if (!n || !e.includes("@") && !e.includes("#"))
    return n;
  const r = Q(e, [
    ...le(n),
    ...t
  ]);
  return je(r) ? r : n;
}
function le(e) {
  return e ? e.parts.filter((n) => n.type === "reference").map(
    (n) => ({
      refType: n.ref_type,
      refId: n.ref_id,
      label: x(n.label),
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
function Ge(e) {
  return e ? e.parts.map(
    (n) => n.type === "text" ? n.text : `${n.ref_trigger === "#" ? "#" : "@"}${x(n.label)}`
  ).join("") : "";
}
function vn(e, n, t) {
  const r = me(
    t.filter(
      (f) => f.origin === "edge" && !!f.originID
    ),
    D
  ), o = new Map(
    r.map((f) => [D(f), f])
  ), s = n?.version === 1 ? n.parts : e ? [{ type: "text", text: e }] : [], i = [], d = /* @__PURE__ */ new Set();
  let c = !1;
  for (const f of s) {
    if (f.type === "reference" && f.ref_origin === "edge" && f.ref_origin_id) {
      const a = D({
        refId: f.ref_id,
        originID: f.ref_origin_id
      }), u = o.get(a);
      if (!u) {
        c = !0;
        continue;
      }
      pe(i, {
        ...u,
        purpose: f.purpose,
        mediaURL: f.ref_media_url,
        mediaIndex: f.ref_media_index,
        mediaCount: f.ref_media_count,
        mediaItems: f.ref_media_items
      }), d.add(a), c = !1;
      continue;
    }
    if (f.type === "text") {
      let a = f.text;
      if (c && /^\s/.test(a)) {
        const u = i[i.length - 1];
        (!u || u.type === "text" && /\s$/.test(u.text)) && (a = a.slice(1));
      }
      N(i, a), c = !1;
      continue;
    }
    i.push({ ...f }), c = !1;
  }
  const l = r.filter(
    (f) => !d.has(D(f))
  );
  if (l.length > 0) {
    const f = i[i.length - 1];
    f && (f.type !== "text" || !/\s$/.test(f.text)) && N(i, " ");
    for (const a of l)
      ye(i, a);
  }
  const m = { version: 1, parts: i };
  return {
    value: Ge(m),
    content: m
  };
}
function x(e) {
  return e.trim().replace(/^[@#]+/, "").trim();
}
function He(e) {
  const n = /* @__PURE__ */ new Map();
  for (const t of e) {
    if (t.refId <= 0)
      continue;
    const r = t.trigger || "@", o = x(t.label);
    if (!o)
      continue;
    const s = `${r}${o}`;
    n.has(s) || n.set(s, { ...t, mention: s });
  }
  return [...n.values()].sort(
    (t, r) => r.mention.length - t.mention.length
  );
}
function Je(e, n, t) {
  let r;
  for (const o of t) {
    const s = e.indexOf(o.mention, n);
    s < 0 || (!r || s < r.index || s === r.index && o.mention.length > r.target.mention.length) && (r = { index: s, target: o });
  }
  return r;
}
function N(e, n) {
  if (!n)
    return;
  const t = e[e.length - 1];
  if (t?.type === "text") {
    t.text += n;
    return;
  }
  e.push({ type: "text", text: n });
}
function me(e, n = ge) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const o of e) {
    if (o.refId <= 0 || !x(o.label))
      continue;
    const s = n(o);
    r.has(s) || (r.add(s), t.push(o));
  }
  return t;
}
function We(e) {
  const n = /* @__PURE__ */ new Map();
  for (const t of e) {
    const r = x(t.label);
    if (t.refId <= 0 || !r)
      continue;
    const o = `${t.trigger || "@"}${r}`, s = E(t), i = n.get(o);
    if (!i) {
      n.set(o, {
        target: t,
        targetKey: s,
        ambiguous: !1
      });
      continue;
    }
    i.targetKey !== s && (i.ambiguous = !0);
  }
  return [...n.values()].filter((t) => !t.ambiguous).map((t) => t.target);
}
function E(e) {
  return `${ge(e)}:${e.usage || ""}:${e.purpose || ""}`;
}
function ge(e) {
  return e.originID ? `${e.refType}:${e.refId}:${e.origin || ""}:${e.originID}` : `${e.refType}:${e.refId}`;
}
function D(e) {
  return `${String(e.originID || "")}:${Number(e.refId || 0)}`;
}
function pe(e, n) {
  e.push({
    type: "reference",
    ref_type: n.refType,
    ref_id: n.refId,
    label: x(n.label),
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
function ye(e, n, t) {
  pe(e, n), Ye(e, t);
}
function Ye(e, n) {
  n?.type === "text" && /^\s/.test(n.text) || N(e, " ");
}
function bn(e, n, t, r, o) {
  if (!n || !t || n === t)
    return e;
  const s = e.findIndex((l) => o(l) === n);
  if (s < 0)
    return e;
  const i = [...e], [d] = i.splice(s, 1), c = i.findIndex((l) => o(l) === t);
  return c < 0 ? e : (i.splice(c + (r === "after" ? 1 : 0), 0, d), i);
}
function kn(e, n, t) {
  if (!n.length)
    return e;
  const r = new Map(e.map((i) => [t(i), i])), o = [];
  for (const i of n)
    r.has(i) && o.push(r.get(i));
  const s = new Set(o.map(t));
  return [
    ...o,
    ...e.filter((i) => !s.has(t(i)))
  ];
}
function Pn(e, n) {
  return e.length === n.length && e.every((t, r) => t === n[r]);
}
export {
  Ie as A,
  an as B,
  Oe as C,
  Fe as D,
  mn as E,
  ke as F,
  tn as G,
  hn as H,
  ie as I,
  _n as J,
  Ge as K,
  je as L,
  le as M,
  Ue as N,
  gn as O,
  cn as P,
  ce as a,
  b,
  yn as c,
  de as d,
  Ve as e,
  nn as f,
  en as g,
  on as h,
  Ze as i,
  dn as j,
  pn as k,
  U as l,
  bn as m,
  x as n,
  kn as o,
  un as p,
  J as q,
  vn as r,
  Pn as s,
  we as t,
  R as u,
  sn as v,
  w,
  rn as x,
  fn as y,
  ln as z
};
