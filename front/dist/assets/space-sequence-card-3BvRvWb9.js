import { b2 as we, aN as Pe, au as ce, B as te } from "./upload-asset-api-CJCwVOwh.js";
import { a as re, j as w } from "./preloadable-Bomi5PEU.js";
import { b2 as ie } from "./vendor-icons-B3DKX3la.js";
import { d as xe } from "./_commonjsHelpers-61wyk6v6.js";
function cn(e, n, t, r, s) {
  if (!n || !t || n === t)
    return e;
  const o = e.findIndex((l) => s(l) === n);
  if (o < 0)
    return e;
  const i = [...e], [d] = i.splice(o, 1), c = i.findIndex((l) => s(l) === t);
  return c < 0 ? e : (i.splice(c + (r === "after" ? 1 : 0), 0, d), i);
}
function un(e, n, t) {
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
function fn(e, n) {
  return e.length === n.length && e.every((t, r) => t === n[r]);
}
function X(e, n) {
  const t = String(e || ""), r = Ie(n);
  if (!t || r.length === 0)
    return {
      version: 1,
      parts: t ? [{ type: "text", text: t }] : []
    };
  const s = [];
  let o = 0;
  for (; o < t.length; ) {
    const i = Ce(t, o, r);
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
function dn(e, n) {
  return X(
    e,
    $e(n)
  );
}
function ln(e, n) {
  const t = fe(
    n,
    q
  ), r = X(e, t), s = new Set(
    ue(r).map(
      q
    )
  ), o = t.filter(
    (d) => !s.has(q(d))
  );
  if (!o.length)
    return r;
  const i = [];
  for (let d = 0; d < o.length; d += 1)
    me(
      i,
      o[d],
      d === o.length - 1 ? r.parts[0] : void 0
    );
  return { version: 1, parts: [...i, ...r.parts] };
}
function Me(e) {
  return !!e?.parts.some((n) => n.type === "reference");
}
function mn(e, n, t) {
  if (!n || !e.includes("@") && !e.includes("#"))
    return n;
  const r = X(e, [
    ...ue(n),
    ...t
  ]);
  return Me(r) ? r : n;
}
function ue(e) {
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
function Se(e) {
  return e ? e.parts.map(
    (n) => n.type === "text" ? n.text : `${n.ref_trigger === "#" ? "#" : "@"}${S(n.label)}`
  ).join("") : "";
}
function gn(e, n, t) {
  const r = fe(
    t.filter(
      (f) => f.origin === "edge" && !!f.originID
    ),
    B
  ), s = new Map(
    r.map((f) => [B(f), f])
  ), o = n?.version === 1 ? n.parts : e ? [{ type: "text", text: e }] : [], i = [], d = /* @__PURE__ */ new Set();
  let c = !1;
  for (const f of o) {
    if (f.type === "reference" && f.ref_origin === "edge" && f.ref_origin_id) {
      const a = B({
        refId: f.ref_id,
        originID: f.ref_origin_id
      }), u = s.get(a);
      if (!u) {
        c = !0;
        continue;
      }
      le(i, {
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
      O(i, a), c = !1;
      continue;
    }
    i.push({ ...f }), c = !1;
  }
  const l = r.filter(
    (f) => !d.has(B(f))
  );
  if (l.length > 0) {
    const f = i[i.length - 1];
    f && (f.type !== "text" || !/\s$/.test(f.text)) && O(i, " ");
    for (const a of l)
      me(i, a);
  }
  const m = { version: 1, parts: i };
  return {
    value: Se(m),
    content: m
  };
}
function S(e) {
  return e.trim().replace(/^[@#]+/, "").trim();
}
function Ie(e) {
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
function Ce(e, n, t) {
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
function fe(e, n = de) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const s of e) {
    if (s.refId <= 0 || !S(s.label))
      continue;
    const o = n(s);
    r.has(o) || (r.add(o), t.push(s));
  }
  return t;
}
function $e(e) {
  const n = /* @__PURE__ */ new Map();
  for (const t of e) {
    const r = S(t.label);
    if (t.refId <= 0 || !r)
      continue;
    const s = `${t.trigger || "@"}${r}`, o = q(t), i = n.get(s);
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
function q(e) {
  return `${de(e)}:${e.usage || ""}:${e.purpose || ""}`;
}
function de(e) {
  return e.originID ? `${e.refType}:${e.refId}:${e.origin || ""}:${e.originID}` : `${e.refType}:${e.refId}`;
}
function B(e) {
  return `${String(e.originID || "")}:${Number(e.refId || 0)}`;
}
function le(e, n) {
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
function me(e, n, t) {
  le(e, n), Ue(e, t);
}
function Ue(e, n) {
  n?.type === "text" && /^\s/.test(n.text) || O(e, " ");
}
const ge = /* @__PURE__ */ new Set([
  "image",
  "video",
  "audio",
  "file"
]);
function pn(e) {
  return e.type === "file" || e.type === "files";
}
function De(e) {
  return e.type === "prompt";
}
function yn(e) {
  return ![
    "hidden",
    "description",
    "prompt",
    "file",
    "files"
  ].includes(e.type);
}
function _n(e) {
  const n = Array.from(
    new Set(
      (e.accepted_kinds || e.asset_kinds || []).map(Z).filter((r) => !!r)
    )
  );
  if (n.length > 0)
    return n;
  const t = `${e.name || ""} ${e.key || ""}`.toLowerCase();
  return /video|视频/.test(t) ? ["video"] : /audio|music|音频|音乐/.test(t) ? ["audio"] : /image|img|photo|picture|图片|图像|参考图|首帧|尾帧/.test(t) ? ["image"] : /text|文本|提示词|文案/.test(t) ? ["file"] : ["image", "audio", "video", "file"];
}
function Ne(e) {
  return (e.accepted_kinds || []).map(Z).filter(
    (n) => !!n && ge.has(n)
  );
}
function F(e) {
  const n = Z(e);
  return n && ge.has(n) ? n : void 0;
}
function Oe(e) {
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
function Te(e) {
  const n = e.default_value ?? "";
  if (e.type === "switch")
    return Ke(n);
  if (e.type === "multi_option")
    return ee(e, se(n));
  if (e.type === "files")
    return ne(se(n));
  if (e.type === "option" || e.type === "select") {
    const t = M(e.options || [], n) || e.options?.[0];
    return D(
      e,
      C(t) || n
    );
  }
  return D(e, n);
}
function pe(e) {
  const n = {};
  for (const t of e)
    !t.key || t.type === "description" || (n[t.key] = Te(t));
  return n;
}
function vn(e, n, t) {
  const r = pe(e), s = new Map(
    t.map((o) => [o.key, o])
  );
  for (const o of e) {
    const i = s.get(o.key);
    o.key && i && Object.prototype.hasOwnProperty.call(n, o.key) && Fe(o, i, n[o.key]) && (r[o.key] = ee(o, n[o.key]));
  }
  return r;
}
function bn(e, n) {
  const t = pe(e), r = n.paramValues || {};
  for (const o of e)
    o.key && Object.prototype.hasOwnProperty.call(r, o.key) && (t[o.key] = ee(
      o,
      r[o.key]
    ));
  const s = e.find(De);
  return s?.key && n.prompt.trim() && (t[s.key] = n.prompt), t;
}
function D(e, n) {
  if (e.value_type !== "number" || n === "")
    return n;
  const t = Number(n);
  return Number.isFinite(t) ? t : n;
}
function ee(e, n) {
  if (e.type === "option" || e.type === "select") {
    const t = M(e.options || [], n) || e.options?.[0];
    return D(
      e,
      C(t) || n
    );
  }
  return e.type === "multi_option" ? ne(n).map((t) => {
    const r = M(e.options || [], t);
    return D(
      e,
      C(r) || t
    );
  }) : D(e, n);
}
function Fe(e, n, t) {
  if (e.type !== n.type || e.value_type !== n.value_type)
    return !1;
  if (e.type === "option" || e.type === "select") {
    const r = e.options || [];
    return r.length === 0 || !!M(r, t);
  }
  if (e.type === "multi_option") {
    const r = e.options || [];
    return r.length === 0 || ne(t).every(
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
function se(e) {
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
await window.DeverFront?.ensureCompat?.(["@/components/agent/stream-request-params"]);
const H = window.DeverFront?.sdk?.getCompatModule("@/components/agent/stream-request-params");
if (!H || Object.keys(H).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
const K = H, Ae = K.filterActivePowerParams || ((e) => e), kn = K.isPowerParamConditionController || (() => !1), Rn = K.shouldDisplayPowerParam || (() => !0), wn = K.PowerParamOptionDialog, Pn = K.normalizeParamPreviewType, Ee = "referencemode", Be = "references";
function xn({
  node: e,
  content: n,
  items: t,
  connections: r,
  params: s,
  values: o,
  requestedMode: i,
  additionalSources: d = []
}) {
  const c = je(
    Ae(s, o)
  );
  return Ge({
    targetKind: R(e) || e.power?.kind || e.kind,
    content: n,
    items: t,
    connections: r,
    mediaOptions: c,
    requestedMode: i,
    additionalSources: d
  });
}
function Mn(e, n) {
  return e.flatMap(({ edge: t, source: r }) => {
    const s = ke(n, r), o = Number(
      s?.refId || r.asset?.id || r.resultRef?.asset_id || 0
    );
    return o <= 0 ? [] : [
      {
        refType: "asset",
        refId: o,
        versionId: Number(
          s?.versionID || r.asset?.version?.id || r.asset?.version_id || r.resultRef?.version_id || 0
        ),
        label: he(r, s),
        usage: String(t.mediaUsage || ""),
        trigger: "@",
        origin: "edge",
        originID: t.id,
        mediaCount: P(r)
      }
    ];
  });
}
function R(e) {
  if (!e)
    return;
  const n = [e.kind, e.asset?.kind, e.power?.kind], t = [e.asset?.version?.content, e.resultOutput];
  if (ce(t)?.frames.some((o) => !!o.image))
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
  return s && ze(t) ? "file" : void 0;
}
function qe(e) {
  return !!R(e);
}
function ze(e) {
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
function Sn(e, n, t) {
  return t.some((s) => {
    const o = R(s);
    return o === "video" || o === "audio";
  }) && Ve(
    e,
    n,
    Be
  ) || n;
}
function Le(e) {
  return A(e.key) === Ee;
}
function Ve(e, n, t) {
  const r = e.find(Le);
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
function je(e) {
  const n = e.flatMap((t) => {
    if (t.type !== "file" && t.type !== "files")
      return [];
    const r = String(t.key || "").trim(), s = Ne(t);
    return !r || s.length === 0 ? [] : [
      {
        key: r,
        label: String(t.name || r),
        maxFiles: Oe(t),
        acceptedKinds: s
      }
    ];
  });
  return N(
    n.map(
      (t) => j(t) ? { ...t, maxFiles: 1 } : t
    )
  );
}
function In(e) {
  return e.find(
    (n) => V(n.key) || n.label.includes("首帧")
  )?.key || "firstFrame";
}
function Ge({
  targetKind: e,
  content: n,
  items: t,
  connections: r,
  mediaOptions: s,
  requestedMode: o,
  additionalSources: i = []
}) {
  const d = He(
    n,
    t,
    r,
    i
  ), c = d.reduce(
    (y, Re) => y + Re.amount,
    0
  ), l = d.some((y) => V(y.usage)) && d.some((y) => ye(y.usage)), m = F(e) === "video" && c > 1, f = $(
    s,
    "image",
    "per_image"
  ), a = $(
    s,
    "image",
    "shared_reference"
  ), u = f.length > 0, g = a.some(
    j
  ), p = (!g || d.every((y) => y.amount === 1)) && Ye(a, c), _ = [
    {
      value: "per_image",
      label: "逐图生成",
      enabled: u,
      reason: u ? void 0 : "当前能力没有可逐张接收图片的参数"
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
      structured: d.some((y) => y.structured),
      explicitFramePair: l,
      options: _,
      error: ""
    };
  const b = d.some((y) => y.structured), h = l && p ? "shared_reference" : b && u ? "per_image" : p ? "shared_reference" : "per_image", E = _.find(
    (y) => y.value === o && y.enabled
  )?.value || h, v = _.some((y) => y.enabled);
  return {
    active: m,
    imageCount: c,
    structured: b,
    explicitFramePair: l,
    mode: v ? E : void 0,
    defaultMode: h,
    options: _,
    error: v ? "" : "当前能力无法接收这组图片素材"
  };
}
function He(e, n, t, r) {
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
    if (c.type !== "reference" || c.ref_type !== "asset")
      continue;
    const l = c.ref_origin_id ? s.get(
      k(c.ref_origin_id, c.ref_id)
    ) : void 0, m = l ? ke(n, l.source) : n.find(
      (u) => Number(u.refId || 0) === Number(c.ref_id || 0) && (!c.ref_version_id || Number(u.versionID || 0) === Number(c.ref_version_id))
    );
    if ((l ? R(l.source) : F(m?.kind)) !== "image")
      continue;
    l && o.add(
      k(
        l.edge.id,
        x(l)
      )
    );
    const a = l ? P(l.source) : L(m, "image", c.ref_media_count);
    i.push({
      amount: T(c, a),
      usage: String(c.usage || l?.edge.mediaUsage || ""),
      structured: G(l?.source, m)
    });
  }
  for (const c of t) {
    const l = k(
      c.edge.id,
      x(c)
    );
    o.has(l) || R(c.source) !== "image" || i.push({
      amount: P(c.source),
      usage: String(c.edge.mediaUsage || ""),
      structured: G(c.source)
    });
  }
  const d = new Set(
    t.map((c) => c.source.id)
  );
  for (const c of r)
    d.has(c.id) || R(c) !== "image" || i.push({
      amount: P(c),
      usage: "",
      structured: G(c)
    });
  return i;
}
function G(e, n) {
  return !!(e?.storyboardItem?.itemType === "shot_image" || ce([
    e?.asset?.version?.content,
    e?.resultOutput,
    n?.output,
    n?.asset
  ]));
}
function Je(e, n) {
  return e.find((t) => t.key === n);
}
function V(e) {
  const n = A(e);
  return n === "firstframe" || n === "startframe";
}
function ye(e) {
  const n = A(e);
  return n === "lastframe" || n === "endframe";
}
function We(e) {
  const n = A(e);
  return n === "firstframe" || n === "startframe" || n === "lastframe" || n === "endframe";
}
function Qe(e) {
  if (!e.acceptedKinds.includes("image"))
    return !1;
  const n = A(e.key), t = String(e.label || "").trim();
  return ["images", "reference", "referenceimage", "referenceimages"].includes(
    n
  ) || t.includes("参考图") || t.includes("参考图片");
}
function N(e) {
  return e.map((n, t) => ({ option: n, index: t })).sort(
    (n, t) => oe(n.option) - oe(t.option) || n.index - t.index
  ).map(({ option: n }) => n);
}
function oe(e) {
  return Qe(e) ? 0 : V(e.key) || e.label.includes("首帧") ? 1 : ye(e.key) || e.label.includes("尾帧") ? 2 : 3;
}
function j(e) {
  return We(e.key) || e.label.includes("首帧") || e.label.includes("尾帧");
}
function $(e, n, t) {
  const r = e.filter(
    (i) => i.acceptedKinds.includes(n)
  );
  if (n !== "image" || !t)
    return r;
  const s = r.filter((i) => !j(i));
  if (t === "shared_reference")
    return N(s.length > 0 ? s : r);
  const o = r.filter(
    (i) => V(i.key) || i.label.includes("首帧")
  );
  return o.length > 0 ? N(o) : N(s);
}
function Cn(e, n) {
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
function Ye(e, n) {
  let t = n;
  for (const r of e) {
    const s = I(r);
    if (s <= 0 || (t -= s, t <= 0))
      return !0;
  }
  return !1;
}
function A(e) {
  return String(e || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
}
function $n(e, n, t, r, s = {}, o = !1, i) {
  const d = new Map(
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
      const g = P(a.source), p = d.get(
        k(
          a.edge.id,
          x(a)
        )
      );
      return [
        {
          referenceKey: tn(a),
          label: nn(a),
          kind: u,
          amount: T(p, g),
          mediaCount: g,
          mediaSelected: Y(p),
          usage: Ze(a, s),
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
    const g = l.get(Number(u.ref_id || 0)), p = F(g?.kind);
    p && c.push({
      referenceKey: `asset:${u.ref_id}:${a}`,
      label: String(u.label || g?.title || "引用素材"),
      kind: p,
      amount: T(
        u,
        L(g, p, u.ref_media_count)
      ),
      mediaCount: L(
        g,
        p,
        u.ref_media_count
      ),
      mediaSelected: Y(u),
      usage: String(u.usage || ""),
      required: o
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
        return `当前能力未配置可接收${be(a.kind)}素材的参数`;
      continue;
    }
    const p = Je(g, a.usage);
    if (a.usage && !p)
      return `「${a.label}」的素材用途与当前能力参数不兼容`;
    const _ = p || (g.length === 1 ? g[0] : void 0);
    if (!_)
      return `请为「${a.label}」选择素材用途`;
    const b = a.kind === "image" && i === "per_image", h = b ? 1 : a.amount, U = I(_) > 0 ? Math.max(
      I(_) - (m.get(_.key) || 0),
      0
    ) : 0;
    if (!b && !a.mediaSelected && a.mediaCount > 1 && I(_) > 0 && a.mediaCount > U)
      return `「${a.label}」包含 ${a.mediaCount} 项素材，请从引用中选择具体素材`;
    if (!Q(_, m, h))
      return `${_.label}参数最多接收 ${I(_)} 个素材`;
    b || z(m, _.key, h);
  }
  return "";
}
function Un(e, n, t, r, s = [], o) {
  const i = t.filter(qe), d = i.flatMap((a) => {
    const u = R(a);
    return u ? [u] : [];
  }), c = N(
    n.filter(
      (a) => d.every(
        (u) => $([a], u, o).includes(
          a
        )
      )
    )
  );
  if (d.length === 0 || c.length === 0) {
    const a = d[0];
    return {
      usage: void 0,
      error: d.length > 1 ? "当前能力未配置可同时接收该分组媒体素材的参数" : `当前能力未配置可接收${be(a || "file")}素材的参数`
    };
  }
  const l = Xe(
    e,
    n,
    r,
    s,
    o
  ), m = o === "per_image" && d.every((a) => a === "image") ? 1 : i.reduce(
    (a, u) => a + P(u),
    0
  ), f = _e(
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
function Dn(e, n, t, r, s, o) {
  if (!n || r.length === 0)
    return { content: n, assignments: {} };
  const i = new Map(
    W(
      e,
      t,
      s,
      o
    ).map((a) => [a.key, a])
  ), c = [...W(
    n,
    t,
    s,
    o
  )].sort((a, u) => {
    const g = ae(
      a,
      i.get(a.key)
    ), p = ae(
      u,
      i.get(u.key)
    );
    return g - p || a.partIndex - u.partIndex;
  }), l = n.parts.map((a) => ({ ...a })), m = {}, f = /* @__PURE__ */ new Map();
  for (const a of c) {
    const u = i.get(a.key), g = $(
      r,
      a.kind,
      o
    ), p = a.usage && a.usage !== u?.usage ? a.usage : "", b = _e(
      g,
      f,
      a.kind === "image" && o === "per_image" ? 1 : a.amount,
      p,
      u?.usage || a.usage
    )?.key || "";
    b && (a.kind === "image" && o === "per_image" || z(f, b, a.amount));
    const h = l[a.partIndex];
    h?.type === "reference" && (h.usage = b || void 0), a.connection && b !== String(a.connection.edge.mediaUsage || "") && (m[a.connection.edge.id] = b || void 0);
  }
  return { content: { ...n, parts: l }, assignments: m };
}
function Xe(e, n, t, r = [], s) {
  const o = /* @__PURE__ */ new Map(), i = W(
    t,
    r,
    e,
    s
  ), d = /* @__PURE__ */ new Set();
  for (const c of i) {
    const l = n.find((m) => m.key === c.usage);
    l && !(c.kind === "image" && s === "per_image") && z(o, l.key, c.amount), c.connection && d.add(
      k(
        c.connection.edge.id,
        x(c.connection)
      )
    );
  }
  for (const c of e) {
    const l = k(
      c.edge.id,
      x(c)
    );
    if (d.has(l))
      continue;
    const m = String(c.edge.mediaUsage || ""), f = n.find((a) => a.key === m);
    f && !(R(c.source) === "image" && s === "per_image") && z(
      o,
      f.key,
      P(c.source)
    );
  }
  return o;
}
function Ze(e, n) {
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
  return e.parts.flatMap((i, d) => {
    if (i.type !== "reference" || i.ref_type !== "asset")
      return [];
    const c = i.ref_origin_id ? s.get(
      k(i.ref_origin_id, i.ref_id)
    ) : void 0, l = n.find(
      (u) => Number(u.refId || 0) === Number(i.ref_id || 0) && (!i.ref_version_id || Number(u.versionID || 0) === Number(i.ref_version_id))
    ), m = c ? R(c.source) : F(l?.kind);
    if (!m)
      return [];
    const f = c ? `edge:${k(
      c.edge.id,
      x(c)
    )}` : `asset:${i.ref_id}:${i.ref_version_id || 0}`, a = o.get(f) || 0;
    return o.set(f, a + 1), [
      {
        key: c ? f : `${f}:${a}`,
        partIndex: d,
        kind: m,
        amount: m === "image" && r === "per_image" ? 1 : c ? T(
          i,
          P(c.source)
        ) : T(
          i,
          L(
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
function ae(e, n) {
  return e.usage && e.usage !== n?.usage ? 0 : n ? 1 : 2;
}
function _e(e, n, t, ...r) {
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
  return j(e) ? 1 : e.maxFiles;
}
function Q(e, n, t = 1) {
  const r = I(e);
  return r <= 0 || (n.get(e.key) || 0) + t <= r;
}
function z(e, n, t = 1) {
  e.set(n, (e.get(n) || 0) + t);
}
function ve(e, n) {
  return en(e, n).map((t) => t.url);
}
function en(e, n) {
  if (n === "image") {
    const t = we(e);
    if (t.length > 0)
      return t.map((r) => ({ url: r, thumbnail: r }));
  }
  return Pe(e, n);
}
function P(e) {
  const n = R(e);
  return !e || !n || n === "file" ? 1 : Math.max(
    1,
    ve(
      [e.asset?.version?.content, e.resultOutput],
      n
    ).length
  );
}
function L(e, n, t = 0) {
  return !e || n === "file" ? Math.max(1, t) : Math.max(
    1,
    t,
    ve(e.output, n).length
  );
}
function Y(e) {
  return !!((e?.ref_media_items?.length || 0) > 0 || String(e?.ref_media_url || "").trim() || Number(e?.ref_media_index || 0) > 0);
}
function T(e, n) {
  return (e?.ref_media_items?.length || 0) > 0 ? e?.ref_media_items?.length || 0 : Y(e) ? 1 : Math.max(1, n);
}
function k(e, n) {
  return `${String(e || "")}:${Number(n || 0)}`;
}
function x(e) {
  return Number(
    e.source.asset?.id || e.source.resultRef?.asset_id || 0
  );
}
function be(e) {
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
function nn(e) {
  return he(e.source);
}
function he(e, n) {
  for (const t of [e.asset?.name, n?.title, e.title]) {
    const r = String(t || "").trim();
    if (r)
      return r;
  }
  return "媒体素材";
}
function tn(e) {
  const n = Number(
    e.source.asset?.id || e.source.resultRef?.asset_id || 0
  );
  return n > 0 ? `asset:${n}` : `node:${e.source.id}`;
}
function ke(e, n) {
  const t = Number(n.asset?.id || n.resultRef?.asset_id || 0), r = Number(
    n.asset?.version?.id || n.asset?.version_id || n.resultRef?.version_id || 0
  );
  return e.find(
    (s) => Number(s.refId || 0) === t && (!r || Number(s.versionID || 0) === r)
  ) || e.find((s) => s.id === n.id);
}
function Nn({
  itemId: e,
  index: n,
  durationLabel: t,
  className: r,
  dragClassName: s,
  selected: o = !1,
  readonly: i = !1,
  wholeCardDraggable: d = !1,
  dragging: c = !1,
  dropPlacement: l,
  ariaLabel: m,
  headerActions: f,
  children: a,
  onSelect: u,
  onDragStart: g,
  onDragOver: p,
  onDrop: _,
  onDragEnd: b
}) {
  const h = xe(!1);
  function U(v) {
    const y = v.target;
    if (d && y instanceof HTMLElement && y.closest("button, a, input, textarea, select")) {
      v.preventDefault();
      return;
    }
    h.current = !0, v.dataTransfer.effectAllowed = "move", v.dataTransfer.setData("text/plain", e), d && v.dataTransfer.setDragImage(v.currentTarget, 28, 18), g();
  }
  function E() {
    b(), window.setTimeout(() => {
      h.current = !1;
    }, 0);
  }
  return /* @__PURE__ */ re(
    "article",
    {
      className: [
        "ws-sequence-card",
        r,
        o ? "is-selected" : "",
        d && !i ? "is-drag-enabled" : "",
        c ? "is-dragging" : "",
        l ? `is-drop-${l}` : ""
      ].filter(Boolean).join(" "),
      "data-sequence-item-id": e,
      "aria-label": m,
      draggable: !i && d,
      onClick: () => {
        h.current || u();
      },
      onDragStart: !i && d ? U : void 0,
      onDragOver: i ? void 0 : (v) => {
        v.preventDefault(), v.dataTransfer.dropEffect = "move", p(v);
      },
      onDrop: i ? void 0 : (v) => {
        v.preventDefault(), _();
      },
      onDragEnd: !i && d ? E : void 0,
      children: [
        /* @__PURE__ */ re("header", { children: [
          d ? /* @__PURE__ */ w(te, { label: i ? void 0 : "拖动卡片排序", children: /* @__PURE__ */ w("span", { className: s, "aria-hidden": "true", children: /* @__PURE__ */ w(ie, { size: 13 }) }) }) : /* @__PURE__ */ w(te, { label: i ? void 0 : "拖动排序", children: /* @__PURE__ */ w(
            "button",
            {
              type: "button",
              className: s,
              draggable: !i,
              disabled: i,
              "aria-label": `拖动${m}排序`,
              onClick: (v) => v.stopPropagation(),
              onDragStart: U,
              onDragEnd: E,
              children: /* @__PURE__ */ w(ie, { size: 13 })
            }
          ) }),
          /* @__PURE__ */ w("strong", { children: String(n + 1).padStart(2, "0") }),
          /* @__PURE__ */ w("span", { children: t }),
          f || /* @__PURE__ */ w("i", { "aria-hidden": "true" })
        ] }),
        a
      ]
    }
  );
}
export {
  xn as A,
  Ae as B,
  je as C,
  Cn as D,
  Rn as E,
  $n as F,
  De as G,
  In as H,
  vn as I,
  mn as J,
  pe as K,
  ln as L,
  Se as M,
  Me as N,
  ue as O,
  wn as P,
  qe as Q,
  Un as R,
  Nn as S,
  ve as a,
  R as b,
  dn as c,
  ke as d,
  en as e,
  _n as f,
  yn as g,
  kn as h,
  pn as i,
  Le as j,
  Mn as k,
  Dn as l,
  cn as m,
  S as n,
  un as o,
  T as p,
  Pn as q,
  gn as r,
  fn as s,
  ee as t,
  Ke as u,
  M as v,
  hn as w,
  C as x,
  bn as y,
  Sn as z
};
