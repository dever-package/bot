import { L as me, N as Pe } from "./asset-audio-preview-DlcU6JQ0.js";
import { l as be } from "./asset-preview-B63J-8X6.js";
import { i as Se } from "./space-assistant-layout-B9KyeCM0.js";
const le = /* @__PURE__ */ new Set([
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
      (e.accepted_kinds || e.asset_kinds || []).map(ee).filter((t) => !!t)
    )
  );
  return n.length > 0 ? n : [];
}
function Re(e) {
  return (e.accepted_kinds || []).map(ee).filter(
    (n) => !!n && le.has(n)
  );
}
function A(e) {
  const n = ee(e);
  return n && le.has(n) ? n : void 0;
}
function xe(e) {
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
    return ne(e, ue(n));
  if (e.type === "files")
    return re(ue(n));
  if (e.type === "option" || e.type === "select") {
    const t = P(e.options || [], n) || e.options?.[0];
    return B(
      e,
      x(t) || n
    );
  }
  return B(e, n);
}
function ge(e) {
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
  const r = ge(e), i = new Map(
    t.map((s) => [s.key, s])
  );
  for (const s of e) {
    const a = i.get(s.key);
    s.key && a && Object.prototype.hasOwnProperty.call(n, s.key) && $e(s, a, n[s.key]) && (r[s.key] = ne(s, n[s.key]));
  }
  return r;
}
function Oe(e, n) {
  const t = ge(e), r = n.paramValues || {};
  for (const s of e)
    s.key && Object.prototype.hasOwnProperty.call(r, s.key) && (t[s.key] = ne(
      s,
      r[s.key]
    ));
  const i = e.find(Me);
  return i?.key && n.prompt?.trim() && (t[i.key] = n.prompt), Ue(e, t, void 0, r);
}
function B(e, n) {
  if (e.value_type !== "number" || n === "")
    return n;
  const t = Number(n);
  return Number.isFinite(t) ? t : n;
}
function Ue(e, n, t, r = n) {
  const i = { ...n };
  for (const s of e) {
    const a = s.option_filter_key;
    if (!a) continue;
    const d = e.find((f) => f.key === a);
    if (!d) continue;
    const o = P(s.options || [], n[s.key]);
    if (!Object.prototype.hasOwnProperty.call(r, a) && o?.group) {
      const f = P(d.options || [], o.group);
      f && (i[a] = x(f));
    }
    if ((t === a || !Object.prototype.hasOwnProperty.call(r, s.key)) && o?.group !== String(i[a] || "")) {
      const f = (s.options || []).find((l) => l.group === String(i[a] || ""));
      i[s.key] = f ? x(f) : "";
    }
  }
  return i;
}
function ne(e, n) {
  if (e.type === "option" || e.type === "select") {
    const t = P(e.options || [], n) || P(e.options || [], e.default_value) || e.options?.[0];
    return B(
      e,
      x(t) || n
    );
  }
  return e.type === "multi_option" ? re(n).map((t) => {
    const r = P(e.options || [], t);
    return B(
      e,
      x(r) || t
    );
  }) : B(e, n);
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
    return r.length === 0 || re(t).every(
      (i) => !!P(r, i)
    );
  }
  return e.value_type === "number" ? t === "" || Number.isFinite(Number(t)) : !0;
}
function x(e) {
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
    const s = e.find(
      (a) => String(i(a) ?? "").trim() === t
    );
    if (s)
      return s;
  }
}
function an(e, n, t = [e]) {
  return n.some(
    (r) => P(t, r) === e
  );
}
function ue(e) {
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
function Ke(e) {
  if (typeof e == "boolean")
    return e;
  const n = String(e ?? "").trim().toLowerCase();
  return n === "1" || n === "true" || n === "yes" || n === "on";
}
await window.DeverFront?.ensureCompat?.(["@/components/agent/stream-request-params", "@/components/searchable-option-picker"]);
const J = window.DeverFront?.sdk?.getCompatModule("@/components/agent/stream-request-params");
if (!J || Object.keys(J).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
const Q = window.DeverFront?.sdk?.getCompatModule("@/components/searchable-option-picker");
if (!Q || Object.keys(Q).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/searchable-option-picker");
const E = J, te = E.filterActivePowerParams || ((e) => e), un = E.isPowerParamConditionController || (() => !1), cn = E.shouldDisplayPowerParam || (() => !0), fn = Q.SearchableOptionPicker, dn = E.PowerParamOptionDialog, mn = E.normalizeParamPreviewType;
E.PowerParamField;
E.PowerParamPopover;
function z(e, n, t = []) {
  return (e?.parts || []).filter((r) => {
    if (r.type !== "reference") return !1;
    const i = t.find(
      ({ edge: s }) => s.id === r.ref_origin_id
    );
    return (i ? b(i.source) : A(
      D(n, r)?.kind
    )) === "image";
  });
}
function M(e) {
  return `${e.ref_type}:${e.ref_id}:${e.ref_version_id || 0}:${e.ref_origin_id || ""}`;
}
function ce(e, n, t) {
  const r = e.find(_e);
  return `${r ? x(
    P(r.options || [], n[r.key])
  ) : t === "shared_reference" && F(
    oe(te(e, n)),
    "image",
    t
  ).some(C) ? "frames" : "default"}:${t}`;
}
function Ne(e, n, t, r, i) {
  return {
    ...e,
    [n]: {
      version: 1,
      parts: z(t, r, i)
    }
  };
}
function ln({
  content: e,
  items: n,
  connections: t,
  params: r,
  previousParams: i = r,
  previousValues: s,
  nextValues: a,
  previousMode: d,
  nextMode: o,
  selections: f
}) {
  const l = Ne(
    f,
    ce(i, s, d),
    e,
    n,
    t
  ), c = ce(r, a, o), u = new Map(
    z(l[c], n, t).map((_) => [
      M(_),
      _
    ])
  ), m = new Set(
    z(e, n, t)
  ), h = oe(
    te(r, a)
  ), y = F(h, "image", o), v = o === "shared_reference" && y.some(C), g = v && d === "shared_reference" ? ie([...m]).filter(
    ({ media: _ }) => y.some((w) => w.key === _.usage)
  ) : [], k = y.find(
    (_) => N(_.key)
  )?.key;
  return { content: e && {
    ...e,
    parts: e.parts.map((_) => {
      if (_.type !== "reference" || !m.has(_)) return _;
      const w = u.get(M(_));
      if (w)
        return {
          ..._,
          usage: w.usage,
          ref_media_url: w.ref_media_url,
          ref_media_index: w.ref_media_index,
          ref_media_items: w.ref_media_items,
          ref_media_excluded: w.ref_media_excluded
        };
      if (l[c])
        return {
          ..._,
          usage: void 0,
          ref_media_url: void 0,
          ref_media_index: void 0,
          ref_media_items: [],
          ref_media_excluded: !0
        };
      if (v) {
        const O = g.filter((p) => p.part === _).map((p) => p.media);
        if (k && g.length === 0 && m.size === 1 && !_.ref_media_excluded) {
          const p = _.ref_media_items?.length === 1 ? _.ref_media_items[0] : _.ref_media_url || _.ref_media_index ? {
            url: _.ref_media_url || "",
            index: _.ref_media_index || 0
          } : _.ref_media_count === 1 ? { url: "", index: 1 } : void 0;
          p && O.push({ ...p, usage: k });
        }
        return {
          ..._,
          usage: void 0,
          ref_media_url: void 0,
          ref_media_index: void 0,
          ref_media_items: O,
          ref_media_excluded: O.length === 0
        };
      }
      const K = y[0]?.key;
      return {
        ..._,
        usage: K,
        ref_media_excluded: void 0,
        ref_media_items: _.ref_media_items?.map((O) => ({
          ...O,
          usage: void 0
        }))
      };
    })
  }, selections: l };
}
function ie(e) {
  return e.flatMap((n) => n.ref_media_excluded ? [] : (n.ref_media_items?.length ? n.ref_media_items : n.ref_media_url || n.ref_media_index ? [
    {
      url: n.ref_media_url || "",
      index: n.ref_media_index || 0,
      usage: n.usage
    }
  ] : n.ref_media_count === 1 && n.usage ? [{ url: "", index: 1, usage: n.usage }] : []).filter((r) => r.usage && pe(r.usage)).map((r) => ({ part: n, media: r })));
}
function gn(e, n, t) {
  return e.flatMap((r) => {
    const i = t.find(
      ({ edge: o }) => o.id === r.ref_origin_id
    )?.source, s = D(n, r), a = se(
      s?.output ?? i?.asset?.version?.content ?? i?.resultOutput,
      "image"
    ), d = a.length ? a : s?.preview.imageUrl ? [s.preview.imageUrl] : [];
    return d.map((o, f) => ({
      part: r,
      media: { url: o, index: f + 1 },
      label: d.length === 1 ? r.label : `${r.label} · 图 ${f + 1}`
    }));
  });
}
function _n(e, n, t, r) {
  const i = r && M(r.part), s = new Set(n.map(M));
  if (i && !s.has(i))
    throw new Error("引用图片已变化，请重新选择");
  const a = ie(n);
  if (r && a.find(
    (o) => o.media.usage !== t && M(o.part) === i && (o.media.url ? o.media.url === r.media.url : o.media.index === r.media.index)
  ))
    throw new Error("这张图片已用于另一个位置，请先取消原有选择");
  return {
    ...e,
    parts: e.parts.map((o) => {
      if (o.type !== "reference" || !s.has(M(o)))
        return o;
      const f = M(o), l = a.filter(
        (c) => M(c.part) === f && c.media.usage !== t
      ).map((c) => c.media);
      return r && f === i && l.push({ ...r.media, usage: t }), {
        ...o,
        usage: void 0,
        ref_media_url: void 0,
        ref_media_index: void 0,
        ref_media_items: l,
        ref_media_excluded: l.length === 0
      };
    })
  };
}
const Ee = "referencemode", Ie = "references";
function pn({
  node: e,
  content: n,
  items: t,
  connections: r,
  params: i,
  values: s,
  requestedMode: a,
  additionalSources: d = []
}) {
  const o = oe(
    te(i, s)
  ), f = e.outputType || e.power?.outputType;
  return Ve({
    targetKind: f && f !== "general" ? void 0 : b(e) || e.power?.kind || e.kind,
    content: n,
    items: t,
    connections: r,
    mediaOptions: o,
    requestedMode: a,
    additionalSources: d
  });
}
function yn(e, n) {
  return e.flatMap(({ edge: t, source: r }) => {
    const i = ve(n, r), s = Number(
      i?.refId || r.asset?.id || r.resultRef?.asset_id || 0
    );
    return s <= 0 ? [] : [
      {
        refType: "asset",
        refId: s,
        versionId: Number(
          i?.versionID || r.asset?.version?.id || r.asset?.version_id || r.resultRef?.version_id || 0
        ),
        label: ke(r, i),
        usage: String(t.mediaUsage || ""),
        trigger: "@",
        origin: "edge",
        originID: t.id,
        contentSelection: i?.contentSelection,
        mediaCount: U(r)
      }
    ];
  });
}
function b(e) {
  if (!e)
    return;
  const n = [e.kind, e.asset?.kind, e.power?.kind], t = [e.asset?.version?.content, e.resultOutput];
  if (me(t)?.frames.some((s) => !!s.image))
    return "image";
  let i = !1;
  for (const s of n) {
    const a = A(s);
    if (a === "file") {
      i = !0;
      continue;
    }
    if (a)
      return a;
  }
  return i && De(t) ? "file" : void 0;
}
function Ae(e) {
  return !!b(e);
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
function hn(e, n, t) {
  return t.some((i) => {
    const s = b(i);
    return s === "video" || s === "audio";
  }) && Be(
    e,
    n,
    Ie
  ) || n;
}
function _e(e) {
  return L(e.key) === Ee;
}
function Be(e, n, t) {
  const r = e.find(_e);
  if (!r?.key)
    return n;
  const i = P(
    r.options || [],
    t
  );
  if (!i)
    return;
  const s = P(
    r.options || [],
    n[r.key]
  );
  return x(s) === x(i) ? n : {
    ...n,
    [r.key]: x(i)
  };
}
function oe(e) {
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
  return V(
    n.map(
      (t) => C(t) ? { ...t, maxFiles: 1 } : t
    )
  );
}
function kn(e) {
  return e.find((n) => N(n.key))?.key || "firstFrame";
}
function Ve({
  targetKind: e,
  content: n,
  items: t,
  connections: r,
  mediaOptions: i,
  requestedMode: s,
  additionalSources: a = []
}) {
  const d = ze(
    n,
    t,
    r,
    a
  ), o = d.reduce(
    (p, we) => p + we.amount,
    0
  ), f = d.some((p) => N(p.usage)) && d.some((p) => T(p.usage)), l = A(e) === "video" && i.some((p) => p.acceptedKinds.includes("image")), c = F(
    i,
    "image",
    "per_image"
  ), u = F(
    i,
    "image",
    "shared_reference"
  ), m = c.length > 0, h = u.some(C), y = (!h || d.every((p) => p.amount === 1)) && qe(u, o), v = u.length > 0, g = h ? u.filter(C) : [], k = [
    {
      value: "per_image",
      label: "每图一条视频",
      enabled: m,
      reason: m ? void 0 : "当前能力没有可逐张接收图片的参数"
    },
    {
      value: "shared_reference",
      label: h ? g.some((p) => T(p.key)) ? "首尾帧生成" : "首帧生成" : "多图共同参考",
      enabled: v,
      reason: v ? void 0 : h ? "当前能力不能将这些图片作为同一次首尾帧输入" : "当前能力不能在一次请求中接收这些参考图片"
    }
  ];
  if (!l)
    return {
      active: !1,
      imageCount: o,
      structured: d.some((p) => p.structured),
      explicitFramePair: f,
      options: k,
      frameUsages: g,
      error: ""
    };
  const R = d.some((p) => p.structured), _ = f && v ? "shared_reference" : R && m ? "per_image" : v && y ? "shared_reference" : "per_image", w = k.find(
    (p) => p.value === s
  ), K = w?.value || _, O = k.some((p) => p.enabled);
  return {
    active: l,
    imageCount: o,
    structured: R,
    explicitFramePair: f,
    mode: O ? K : void 0,
    defaultMode: _,
    options: k,
    frameUsages: g,
    error: O ? w && !w.enabled ? w.reason || "当前能力不支持该生成方式" : K === "shared_reference" && h && d.some(
      (p) => p.amount > 0 && T(p.usage)
    ) && !d.some(
      (p) => p.amount > 0 && N(p.usage)
    ) ? "选择尾帧时请同时选择首帧" : K === "shared_reference" && h && o > 2 ? "首帧和尾帧各选择1张图片" : K === "shared_reference" && h && o === 0 && d.length > 0 ? "请选择首帧图片" : K === "per_image" && o === 0 && d.length > 0 ? "请选择用于生成视频的图片" : "" : "当前能力无法接收这组图片素材"
  };
}
function ze(e, n, t, r) {
  const i = new Map(
    t.map(
      (o) => [
        S(
          o.edge.id,
          $(o)
        ),
        o
      ]
    )
  ), s = /* @__PURE__ */ new Set(), a = [];
  for (const o of e?.parts || []) {
    if (o.type !== "reference" || !ae(o.ref_type))
      continue;
    const f = o.ref_type === "asset" && o.ref_origin_id ? i.get(
      S(o.ref_origin_id, o.ref_id)
    ) : void 0, l = f ? ve(n, f.source) : D(n, o);
    if ((f ? b(f.source) : A(l?.kind)) !== "image")
      continue;
    f && s.add(
      S(
        f.edge.id,
        $(f)
      )
    );
    const u = f ? U(f.source) : G(l, "image", o.ref_media_count);
    a.push(
      ...Z(
        o,
        u,
        f?.edge.mediaUsage
      ).map((m) => ({
        amount: m.amount,
        usage: m.usage,
        structured: H(f?.source, l)
      }))
    );
  }
  for (const o of t) {
    const f = S(
      o.edge.id,
      $(o)
    );
    s.has(f) || b(o.source) !== "image" || a.push({
      amount: U(o.source),
      usage: String(o.edge.mediaUsage || ""),
      structured: H(o.source)
    });
  }
  const d = new Set(
    t.map((o) => o.source.id)
  );
  for (const o of r)
    d.has(o.id) || b(o) !== "image" || a.push({
      amount: U(o),
      usage: "",
      structured: H(o)
    });
  return a;
}
function H(e, n) {
  return !!(e?.storyboardItem?.itemType === "shot_image" || me([
    e?.asset?.version?.content,
    e?.resultOutput,
    n?.output,
    n?.asset
  ]));
}
function Le(e, n) {
  return e.find((t) => t.key === n);
}
function N(e) {
  const n = L(e);
  return n === "firstframe" || n === "startframe";
}
function T(e) {
  const n = L(e);
  return n === "lastframe" || n === "endframe";
}
function pe(e) {
  const n = L(e);
  return n === "firstframe" || n === "startframe" || n === "lastframe" || n === "endframe";
}
function Te(e) {
  if (!e.acceptedKinds.includes("image"))
    return !1;
  const n = L(e.key);
  return ["images", "reference", "referenceimage", "referenceimages"].includes(
    n
  );
}
function V(e) {
  return e.map((n, t) => ({ option: n, index: t })).sort(
    (n, t) => fe(n.option) - fe(t.option) || n.index - t.index
  ).map(({ option: n }) => n);
}
function fe(e) {
  return Te(e) ? 0 : N(e.key) ? 1 : T(e.key) ? 2 : 3;
}
function C(e) {
  return pe(e.key);
}
function F(e, n, t) {
  const r = e.filter(
    (a) => a.acceptedKinds.includes(n)
  );
  if (n !== "image" || !t)
    return r;
  const i = r.filter((a) => !C(a));
  if (t === "shared_reference")
    return V(i.length > 0 ? i : r);
  const s = r.filter((a) => N(a.key));
  return s.length > 0 ? V(s) : V(i);
}
function vn(e, n) {
  if (!n)
    return e;
  const t = /* @__PURE__ */ new Set();
  for (const r of ["image", "video", "audio", "file"])
    for (const i of F(
      e,
      r,
      n
    ))
      t.add(i);
  return e.filter((r) => t.has(r));
}
function qe(e, n) {
  let t = n;
  for (const r of e) {
    const i = I(r);
    if (i <= 0 || (t -= i, t <= 0))
      return !0;
  }
  return !1;
}
function L(e) {
  return String(e || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
}
function wn(e, n, t, r, i = {}, s = !1, a) {
  const d = new Map(
    (n?.parts || []).flatMap(
      (c) => c.type === "reference" && c.ref_type === "asset" && c.ref_origin === "edge" && c.ref_origin_id ? [
        [
          S(c.ref_origin_id, c.ref_id),
          c
        ]
      ] : []
    )
  ), o = e.flatMap(
    (c) => {
      const u = b(c.source);
      if (!u)
        return [];
      const m = U(c.source), h = d.get(
        S(
          c.edge.id,
          $(c)
        )
      );
      return Z(
        h,
        m,
        Ge(c, i)
      ).map((y, v) => ({
        referenceKey: `${Ye(c)}:${v}`,
        label: Qe(c),
        kind: u,
        ...y,
        required: !0
      }));
    }
  );
  for (const [c, u] of (n?.parts || []).entries()) {
    if (u.type !== "reference" || !ae(u.ref_type) || u.ref_origin === "edge")
      continue;
    const m = D(t, u), h = A(m?.kind);
    h && o.push(
      ...Z(
        u,
        G(m, h, u.ref_media_count)
      ).map((y, v) => ({
        referenceKey: `${u.ref_type}:${u.ref_id}:${c}:${v}`,
        label: String(u.label || m?.title || "引用素材"),
        kind: h,
        ...y,
        required: s
      }))
    );
  }
  const f = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Set();
  for (const c of o) {
    if (c.amount === 0) continue;
    const u = `${c.referenceKey}:${c.usage}`;
    if (l.has(u))
      continue;
    l.add(u);
    const m = F(
      r,
      c.kind,
      a
    );
    if (m.length === 0) {
      if (c.required)
        return `当前能力未配置可接收${he(c.kind)}素材的参数`;
      continue;
    }
    const h = Le(m, c.usage);
    if (c.usage && !h)
      return `「${c.label}」的素材用途与当前能力参数不兼容`;
    const y = h || (m.length === 1 ? m[0] : void 0);
    if (!y)
      return `请为「${c.label}」选择素材用途`;
    const v = c.kind === "image" && a === "per_image", g = v ? 1 : c.amount, k = I(y) > 0 ? Math.max(
      I(y) - (f.get(y.key) || 0),
      0
    ) : 0;
    if (!v && !c.mediaSelected && c.mediaCount > 1 && I(y) > 0 && c.mediaCount > k)
      return `「${c.label}」包含 ${c.mediaCount} 项素材，请从引用中选择具体素材`;
    if (!q(y, f, g))
      return `${y.label}参数最多接收 ${I(y)} 个素材`;
    v || j(f, y.key, g);
  }
  return "";
}
function Pn(e, n, t, r, i = [], s) {
  const a = t.filter(Ae), d = a.flatMap((u) => {
    const m = b(u);
    return m ? [m] : [];
  }), o = V(
    n.filter(
      (u) => d.every(
        (m) => F([u], m, s).includes(
          u
        )
      )
    )
  );
  if (d.length === 0 || o.length === 0) {
    const u = d[0];
    return {
      usage: void 0,
      options: [],
      error: d.length > 1 ? "当前能力未配置可同时接收该分组媒体素材的参数" : `当前能力未配置可接收${he(u || "file")}素材的参数`
    };
  }
  if (s === "shared_reference" && d.every((u) => u === "image") && o.some(C))
    return { usage: o[0].key, options: o, error: "" };
  const f = je(
    e,
    n,
    r,
    i,
    s
  ), l = s === "per_image" && d.every((u) => u === "image") ? 1 : a.reduce(
    (u, m) => u + U(m),
    0
  ), c = o.filter(
    (u) => q(u, f, l)
  );
  return c.length === 0 ? {
    usage: void 0,
    options: [],
    error: `${o[0].label}参数已达到素材数量上限`
  } : {
    usage: c[0].key,
    options: c,
    error: ""
  };
}
function bn(e, n, t, r, i, s) {
  if (!n || r.length === 0)
    return { content: n, assignments: {} };
  if (s === "shared_reference" && F(r, "image", s).some(
    C
  )) {
    const u = z(
      e,
      t,
      i
    ), m = new Set(u.map(M)), h = new Set(z(n, t, i)), y = new Set(
      ie(u).map((g) => g.media.usage)
    ), v = n.parts.map((g) => {
      if (g.type !== "reference" || !h.has(g) || m.has(M(g)) || g.ref_media_excluded || g.ref_media_items?.length)
        return g;
      const k = g.usage || r.find((_) => N(_.key))?.key, R = G(
        D(t, g),
        "image",
        g.ref_media_count
      );
      return k && !y.has(k) && (g.ref_media_url || g.ref_media_index || R === 1) ? (y.add(k), { ...g, usage: k }) : {
        ...g,
        usage: void 0,
        ref_media_url: void 0,
        ref_media_index: void 0,
        ref_media_items: [],
        ref_media_excluded: !0
      };
    });
    return { content: { ...n, parts: v }, assignments: {} };
  }
  const a = new Map(
    W(
      e,
      t,
      i,
      s
    ).map((u) => [u.key, u])
  ), o = [...W(
    n,
    t,
    i,
    s
  )].sort((u, m) => {
    const h = de(
      u,
      a.get(u.key)
    ), y = de(
      m,
      a.get(m.key)
    );
    return h - y || u.partIndex - m.partIndex;
  }), f = n.parts.map((u) => ({ ...u })), l = {}, c = /* @__PURE__ */ new Map();
  for (const u of o) {
    if (u.amount === 0) continue;
    const m = a.get(u.key), h = F(
      r,
      u.kind,
      s
    ), y = u.usage && u.usage !== m?.usage ? u.usage : "", g = He(
      h,
      c,
      u.kind === "image" && s === "per_image" ? 1 : u.amount,
      y,
      m?.usage || u.usage
    )?.key || "";
    g && (u.kind === "image" && s === "per_image" || j(c, g, u.amount));
    const k = f[u.partIndex];
    k?.type === "reference" && (k.usage = g || void 0, k.ref_media_items?.length && (k.ref_media_items = k.ref_media_items.map((R) => ({
      ...R,
      usage: h.some((_) => _.key === R.usage) ? R.usage : g || void 0
    })))), u.connection && g !== String(u.connection.edge.mediaUsage || "") && (l[u.connection.edge.id] = g || void 0);
  }
  return { content: { ...n, parts: f }, assignments: l };
}
function je(e, n, t, r = [], i) {
  const s = /* @__PURE__ */ new Map(), a = W(
    t,
    r,
    e,
    i
  ), d = /* @__PURE__ */ new Set();
  for (const o of a) {
    const f = n.find((l) => l.key === o.usage);
    f && !(o.kind === "image" && i === "per_image") && j(s, f.key, o.amount), o.connection && d.add(
      S(
        o.connection.edge.id,
        $(o.connection)
      )
    );
  }
  for (const o of e) {
    const f = S(
      o.edge.id,
      $(o)
    );
    if (d.has(f))
      continue;
    const l = String(o.edge.mediaUsage || ""), c = n.find((u) => u.key === l);
    c && !(b(o.source) === "image" && i === "per_image") && j(
      s,
      c.key,
      U(o.source)
    );
  }
  return s;
}
function Ge(e, n) {
  return String(
    Object.prototype.hasOwnProperty.call(n, e.edge.id) ? n[e.edge.id] || "" : e.edge.mediaUsage || ""
  );
}
function W(e, n, t, r) {
  if (!e)
    return [];
  const i = new Map(
    t.map((a) => [
      S(
        a.edge.id,
        $(a)
      ),
      a
    ])
  ), s = /* @__PURE__ */ new Map();
  return e.parts.flatMap((a, d) => {
    if (a.type !== "reference" || !ae(a.ref_type))
      return [];
    const o = a.ref_type === "asset" && a.ref_origin_id ? i.get(
      S(a.ref_origin_id, a.ref_id)
    ) : void 0, f = D(n, a), l = o ? b(o.source) : A(f?.kind);
    if (!l)
      return [];
    const c = o ? `edge:${S(
      o.edge.id,
      $(o)
    )}` : `${a.ref_type}:${a.ref_id}:${a.ref_version_id || 0}`, u = s.get(c) || 0;
    return s.set(c, u + 1), [
      {
        key: o ? c : `${c}:${u}`,
        partIndex: d,
        kind: l,
        amount: a.ref_media_excluded ? 0 : l === "image" && r === "per_image" ? 1 : o ? X(
          a,
          U(o.source)
        ) : X(
          a,
          G(
            f,
            l,
            a.ref_media_count
          )
        ),
        usage: String(a.usage || ""),
        connection: o
      }
    ];
  });
}
function de(e, n) {
  return e.usage && e.usage !== n?.usage ? 0 : n ? 1 : 2;
}
function He(e, n, t, ...r) {
  for (const i of r) {
    const s = e.find((a) => a.key === i);
    if (s && q(s, n, t))
      return s;
  }
  return e.find(
    (i) => q(i, n, t)
  );
}
function I(e) {
  return C(e) ? 1 : e.maxFiles;
}
function q(e, n, t = 1) {
  const r = I(e);
  return r <= 0 || (n.get(e.key) || 0) + t <= r;
}
function j(e, n, t = 1) {
  e.set(n, (e.get(n) || 0) + t);
}
function se(e, n) {
  return Je(e, n).map((t) => t.url);
}
function Je(e, n) {
  if (n === "image") {
    const t = Pe(e);
    if (t.length > 0)
      return t.map((r) => ({ url: r, thumbnail: r }));
  }
  return be(e, n);
}
function U(e) {
  const n = b(e);
  return !e || !n || n === "file" ? 1 : Math.max(
    1,
    se(
      [e.asset?.version?.content, e.resultOutput],
      n
    ).length
  );
}
function G(e, n, t = 0) {
  return !e || n === "file" ? Math.max(1, t) : Math.max(
    1,
    t,
    se(e.output, n).length
  );
}
function ye(e) {
  return !!((e?.ref_media_items?.length || 0) > 0 || String(e?.ref_media_url || "").trim() || Number(e?.ref_media_index || 0) > 0);
}
function X(e, n) {
  return e?.ref_media_excluded ? 0 : (e?.ref_media_items?.length || 0) > 0 ? e?.ref_media_items?.length || 0 : ye(e) ? 1 : Math.max(1, n);
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
      mediaSelected: ye(e),
      usage: r
    }
  ];
}
function S(e, n) {
  return `${String(e || "")}:${Number(n || 0)}`;
}
function ae(e) {
  return e === "asset" || e === "material";
}
function D(e, n) {
  return e.find(
    (t) => (t.refType || "asset") === n.ref_type && Number(t.refId || 0) === Number(n.ref_id || 0) && (!n.ref_version_id || Number(t.versionID || 0) === Number(n.ref_version_id))
  );
}
function $(e) {
  return Number(
    e.source.asset?.id || e.source.resultRef?.asset_id || 0
  );
}
function he(e) {
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
function Qe(e) {
  return ke(e.source);
}
function ke(e, n) {
  for (const t of [e.asset?.name, n?.title, e.title]) {
    const r = String(t || "").trim();
    if (r)
      return r;
  }
  return "媒体素材";
}
function Ye(e) {
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
    (i) => (i.refType || "asset") === "asset" && Number(i.refId || 0) === t && (!r || Number(i.versionID || 0) === r)
  ) || e.find((i) => i.id === n.id);
}
export {
  hn as A,
  pn as B,
  te as C,
  oe as D,
  vn as E,
  cn as F,
  wn as G,
  Ne as H,
  ce as I,
  kn as J,
  ln as K,
  Ue as L,
  sn as M,
  Ae as N,
  Oe as O,
  dn as P,
  Pn as Q,
  ge as R,
  fn as S,
  b as a,
  ve as b,
  se as c,
  Je as d,
  rn as e,
  nn as f,
  un as g,
  on as h,
  en as i,
  _e as j,
  yn as k,
  z as l,
  ie as m,
  gn as n,
  X as o,
  mn as p,
  ne as q,
  bn as r,
  _n as s,
  Ke as t,
  P as u,
  x as v,
  an as w,
  Me as x,
  tn as y,
  Ce as z
};
