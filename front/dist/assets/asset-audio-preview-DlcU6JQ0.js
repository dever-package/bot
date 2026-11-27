import { j as at } from "./preloadable-CbkzeflN.js";
function qt(t) {
  if (typeof t != "string")
    return t;
  const n = t.trim();
  if (!vt(n))
    return t;
  try {
    return JSON.parse(n);
  } catch {
    return t;
  }
}
function _(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function Ar(t) {
  return _(t) ? t : {};
}
function l(t) {
  return typeof t == "string" ? t.trim() : "";
}
function Ir(t) {
  const n = Number(t || 0);
  return Number.isFinite(n) ? n : 0;
}
function B(t) {
  if (t == null || t === "")
    return;
  const n = Number(t);
  return Number.isFinite(n) ? n : void 0;
}
function _t(t) {
  const n = String(t || "").trim(), r = Xt(n), e = rn(r);
  for (const o of yt([n, r, e])) {
    const i = qt(o);
    if (i !== o)
      return i;
    const s = tn(o);
    if (s !== o)
      return s;
  }
  return t;
}
function Or(t) {
  const n = String(t || "").trim();
  for (const r of pt(n)) {
    const e = _t(r);
    if (e !== r)
      return e;
  }
  return t;
}
function E(t) {
  const n = [];
  for (const r of pt(
    String(t || "").trim()
  )) {
    const e = _t(r);
    e !== r && n.push(e);
  }
  return n;
}
function Xt(t) {
  let n = "", r = !1, e = !1;
  for (const o of t) {
    if (e) {
      n += o, e = !1;
      continue;
    }
    if (o === "\\") {
      n += o, e = r;
      continue;
    }
    if (o === '"') {
      r = !r, n += o;
      continue;
    }
    if (r && o.charCodeAt(0) < 32) {
      n += nn(o);
      continue;
    }
    n += o;
  }
  return n;
}
function pt(t) {
  const n = [t];
  for (const r of t.matchAll(/```(?:json|storyboard)?\s*([\s\S]*?)```/gi))
    n.push(String(r[1] || "").trim());
  return n.push(...Qt(t)), yt(n);
}
function Qt(t) {
  const n = [];
  for (let r = 0; r < t.length; r += 1) {
    const e = t[r];
    if (e !== "{" && e !== "[")
      continue;
    const o = Zt(t, r);
    o && (n.push(o), r += o.length - 1);
  }
  return n;
}
function Zt(t, n) {
  const r = [];
  let e = !1, o = !1;
  for (let i = n; i < t.length; i += 1) {
    const s = t[i];
    if (o) {
      o = !1;
      continue;
    }
    if (e && s === "\\") {
      o = !0;
      continue;
    }
    if (s === '"') {
      e = !e;
      continue;
    }
    if (e)
      continue;
    if (s === "{" || s === "[") {
      r.push(s);
      continue;
    }
    if (s !== "}" && s !== "]")
      continue;
    const a = s === "}" ? "{" : "[";
    if (r.pop() !== a)
      return "";
    if (r.length === 0)
      return t.slice(n, i + 1).trim();
  }
  return "";
}
function vt(t) {
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function tn(t) {
  if (!t.startsWith('"') || !t.endsWith('"'))
    return t;
  try {
    const n = JSON.parse(t);
    return typeof n == "string" ? n : t;
  } catch {
    return t;
  }
}
function nn(t) {
  switch (t) {
    case `
`:
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    default:
      return `\\u${t.charCodeAt(0).toString(16).padStart(4, "0")}`;
  }
}
function rn(t) {
  const n = t.trim();
  return !n.includes('\\"') || !n.startsWith("{") && !n.startsWith("[") ? t : n.replace(/\\"/g, '"');
}
function yt(t) {
  const n = /* @__PURE__ */ new Set();
  return t.filter((r) => {
    const e = String(r || "").trim();
    return !e || n.has(e) ? !1 : (n.add(e), !0);
  });
}
function kr(...t) {
  return t.find(
    (n) => n != null
  );
}
function wr(t) {
  try {
    return JSON.stringify(t);
  } catch {
    return "";
  }
}
function v(t) {
  if (!Array.isArray(t))
    return [];
  const n = [], r = /* @__PURE__ */ new Set(), e = /* @__PURE__ */ new Set();
  for (const o of t) {
    if (!_(o))
      continue;
    const i = R(o.asset_id ?? o.assetId), s = bt(o.kind), a = J(o.purpose);
    if (!i || !s || !a || e.has(i))
      continue;
    let c = String(o.key || "").trim() || W(i);
    if (r.has(c) && (c = W(i)), r.has(c))
      continue;
    const f = R(o.version_id ?? o.versionId), u = String(o.label || "").trim() || `参考素材 ${n.length + 1}`;
    n.push({
      key: c,
      asset_id: i,
      ...f ? { version_id: f } : {},
      label: u,
      kind: s,
      purpose: a
    }), r.add(c), e.add(i);
  }
  return n;
}
function Mr(t, n, r, e, o, i) {
  const s = new Map(
    v(n).map((m) => [
      m.asset_id,
      m
    ])
  ), a = new Map(
    r.flatMap((m) => {
      const d = R(m.refId);
      return d ? [[d, m]] : [];
    })
  ), c = [], f = (t?.parts || []).map((m) => ({ ...m })), u = /* @__PURE__ */ new Set();
  for (const [m, d] of (t?.parts || []).entries()) {
    if (d.type !== "reference" || d.ref_type !== "asset")
      continue;
    const p = R(d.ref_id);
    if (!p || u.has(p))
      continue;
    const g = s.get(p), y = a.get(p), h = bt(y?.kind) || g?.kind;
    if (!h)
      continue;
    const S = R(y?.versionID || d.ref_version_id), M = String(y?.title || d.label || g?.label || "").trim() || `参考素材 ${c.length + 1}`, I = gt(
      h,
      o,
      i
    ), x = J(d.purpose), b = J(
      g?.purpose
    ), A = [x, b].find(
      (Jt) => I.some((Ht) => Ht.value === Jt)
    ) || on(h, o, i), V = f[m];
    V?.type === "reference" && (V.purpose = A || void 0), c.push({
      key: g?.key || W(p),
      asset_id: p,
      ...S ? { version_id: S } : {},
      label: M,
      kind: h,
      purpose: A
    }), u.add(p);
  }
  return {
    content: t ? { ...t, parts: f } : void 0,
    references: c
  };
}
function xr(t, n) {
  return n.filter(
    (r) => r.work_types.length === 0 || r.work_types.includes(t)
  ).map((r) => ({
    key: r.key,
    label: r.name,
    acceptedKinds: [...r.media_kinds]
  }));
}
function gt(t, n, r) {
  return r.filter(
    (e) => e.media_kinds.includes(t) && (e.work_types.length === 0 || e.work_types.includes(n))
  ).map((e) => ({ value: e.key, label: e.name }));
}
function ht(t, n) {
  return n.find((r) => r.key === t);
}
function en(t, n) {
  return ht(t, n)?.name || t;
}
function Cr(t, n, r, e) {
  const o = r.find((s) => s.key === n);
  if (!o || e.length === 0)
    return "分镜作品类型或参考用途配置无效";
  const i = /* @__PURE__ */ new Map();
  for (const s of t) {
    const a = ht(
      s.purpose,
      e
    );
    if (!a)
      return `参考素材“${s.label}”的用途无效`;
    if (!a.media_kinds.includes(s.kind))
      return `参考素材“${s.label}”的类型不支持用途“${a.name}”`;
    if (a.work_types.length > 0 && !a.work_types.includes(n))
      return `当前作品类型不支持“${s.label}”的用途“${a.name}”`;
    const c = (i.get(s.purpose) || 0) + 1;
    if (i.set(s.purpose, c), a.max_count > 0 && c > a.max_count)
      return `用途“${a.name}”最多只能选择 ${a.max_count} 个素材`;
  }
  for (const s of o.required_reference_purposes)
    if (!i.get(s))
      return `${o.name}必须添加“${en(
        s,
        e
      )}”`;
  return "";
}
function W(t) {
  return `ref-${t}`;
}
function J(t) {
  const n = String(t || "").trim();
  return n || void 0;
}
function on(t, n, r) {
  const e = gt(t, n, r);
  return r.find(
    (i) => i.default_media_kinds.includes(t) && (i.work_types.length === 0 || i.work_types.includes(n))
  )?.key || e[0]?.value || "";
}
function bt(t) {
  const n = String(t || "").trim().toLowerCase();
  return n === "image" || n === "video" || n === "audio" ? n : void 0;
}
function R(t) {
  const n = Number(t || 0);
  return Number.isInteger(n) && n > 0 ? n : 0;
}
function sn(t) {
  return typeof t == "string" && t.length > 0 && t.trim() === t;
}
const H = [
  { value: "auto", label: "自动", columns: 0, rows: 0, capacity: 9 },
  { value: "2x2", label: "2×2", columns: 2, rows: 2, capacity: 4 },
  { value: "3x2", label: "3×2", columns: 3, rows: 2, capacity: 6 },
  { value: "3x3", label: "3×3", columns: 3, rows: 3, capacity: 9 }
], an = new Set(
  H.map((t) => t.value)
);
function cn(t) {
  const n = String(t || "").trim().toLowerCase();
  return an.has(n) ? n : "auto";
}
function un(t) {
  const n = cn(t);
  return H.find((r) => r.value === n) || H[0];
}
function Nr(t, n) {
  const r = un(t), e = Math.max(0, Math.trunc(Number(n) || 0));
  return r.value !== "auto" ? r : e === 0 || e > 6 ? { columns: 3, rows: 3, capacity: 9 } : e > 4 ? { columns: 3, rows: 2, capacity: 6 } : e > 2 ? { columns: 2, rows: 2, capacity: 4 } : { columns: 2, rows: 1, capacity: 2 };
}
function Rr(t) {
  const n = Math.max(0, Math.trunc(Number(t) || 0));
  return n <= 1 ? { columns: 1, rows: 1, capacity: 1 } : n === 2 ? { columns: 2, rows: 1, capacity: 2 } : { columns: 2, rows: 2, capacity: 4 };
}
function Tr(t, n) {
  const r = Math.max(0, Math.trunc(Number(n) || 0) - 1);
  return Math.min(
    r,
    Math.max(0, Math.trunc(Number(t) || 0))
  );
}
const fn = 50, dn = 13, mn = [
  "first_frame",
  "last_frame",
  "first_last",
  "next_first",
  "references",
  "none"
], ln = "first_frame";
function St(t) {
  return t === "first_last" ? "first_last" : "first_frame";
}
const Dr = {
  first_frame: "首帧",
  last_frame: "尾帧",
  first_last: "首尾帧",
  next_first: "首帧 → 下一镜首帧",
  references: "参考图组",
  none: "无参考图"
};
function _n(t) {
  const n = Number(t);
  return Number.isInteger(n) && n > 0 ? n : void 0;
}
function Er(t, n) {
  const r = _n(t);
  return n ? Math.max(r || 0, dn) : r;
}
function At(t) {
  return t === "start" || t === "end" ? t : void 0;
}
function pn(t) {
  return At(t) || "start";
}
function Br(t) {
  return pn(t) === "end" ? "lastFrame" : "firstFrame";
}
function Pr(t) {
  return mn.includes(t) ? t : void 0;
}
function Lr(t) {
  switch (t) {
    case "first_frame":
      return [{ frameRole: "start", mediaIndex: 1 }];
    case "last_frame":
      return [{ frameRole: "end", mediaIndex: 1 }];
    case "first_last":
      return yn();
    default:
      return [];
  }
}
function Ur(t, n) {
  return n + ":" + t;
}
function K(t) {
  return typeof t == "string" ? t.trim() : "";
}
function yn() {
  return [
    { frameRole: "start", mediaIndex: 1 },
    { frameRole: "end", mediaIndex: 2 }
  ];
}
function zr(t) {
  if (!Array.isArray(t))
    return [];
  const n = [], r = /* @__PURE__ */ new Set(), e = /* @__PURE__ */ new Set();
  for (const o of t) {
    if (!o || typeof o != "object" || Array.isArray(o))
      continue;
    const i = o, s = At(i.frameRole ?? i.frame_role), a = Number(i.mediaIndex ?? i.media_index);
    !s || !Number.isInteger(a) || a <= 0 || r.has(s) || e.has(a) || (r.add(s), e.add(a), n.push({ frameRole: s, mediaIndex: a }));
  }
  return n.sort((o, i) => o.mediaIndex - i.mediaIndex);
}
function Fr(t) {
  return Array.isArray(t) ? t.map((n) => {
    if (!n || typeof n != "object" || Array.isArray(n))
      return;
    const r = n, e = K(r.prompt);
    if (!e)
      return;
    const o = K(r.title);
    return {
      title: o || "画面",
      description: K(r.description) || o || e,
      prompt: e
    };
  }).filter((n) => !!n) : [];
}
function jr(t, n) {
  return t?.find((r) => r.frameRole === n)?.mediaIndex || 0;
}
function $r(t, n, r) {
  const e = t[n], o = e.continue_previous ? t[n - 1] : void 0;
  return {
    start: n === 0 && r ? null : o ? { shotId: o.id, shotIndex: n - 1, role: "end" } : { shotId: e.id, shotIndex: n, role: "start" },
    end: { shotId: e.id, shotIndex: n, role: "end" }
  };
}
function Gr(t, n, r, e) {
  const o = t[n], i = gn(t, n, r, e);
  if (!o || !i)
    return {
      anchorID: "",
      anchorFrameRole: "",
      anchorShotIndex: -1,
      materialIDs: C(o?.material_ids),
      referenceKeys: C(o?.reference_keys),
      includeGlobalReferences: !0
    };
  const s = t[i.shotIndex];
  return {
    anchorID: i.id,
    anchorFrameRole: i.frameRole,
    anchorShotIndex: i.shotIndex,
    // A close-up may not show the whole subject or environment. A new
    // framing still needs the current identity, prop and scene references.
    materialIDs: C(o.material_ids).filter(
      (a) => r === "start" || !s?.material_ids?.includes(a)
    ),
    referenceKeys: r === "start" ? C(o.reference_keys) : hn(o.reference_keys, s?.reference_keys),
    includeGlobalReferences: !1
  };
}
function gn(t, n, r, e) {
  const o = t[n];
  if (!o)
    return;
  if (r === "end")
    return n > 0 && o.continue_previous ? { id: t[n - 1].id, shotIndex: n - 1, frameRole: "end" } : { id: o.id, shotIndex: n, frameRole: "start" };
  if (!o.match_previous || n <= 0) return;
  if (o.handoff?.match_action)
    return { id: t[n - 1].id, shotIndex: n - 1, frameRole: "end" };
  const i = new Set(o.material_ids || []), s = (d) => e.filter((p) => p.type === d && i.has(p.id)).map((p) => p.id), a = s("character"), c = s("prop"), f = s("scene"), u = new Set(e.filter((d) => d.type === "scene").map((d) => d.id)), m = a.length ? a : c.length ? c : f;
  for (let d = n - 1; d >= 0; d -= 1) {
    const p = t[d], g = t[d + 1];
    if (g.scene_index != null && p.scene_index != null && g.scene_index !== p.scene_index && !g.match_previous && !g.continue_previous) break;
    const y = p.material_ids || [], h = y.filter((S) => u.has(S));
    if (f.length && h.length && (f.length !== h.length || !f.every((S) => h.includes(S)))) break;
    if (!(!f.every((S) => y.includes(S)) || !m.some((S) => y.includes(S))))
      return { id: p.id, shotIndex: d, frameRole: "end" };
  }
}
function hn(t, n) {
  const r = new Set(C(n));
  return C(t).filter(
    (e) => !r.has(e)
  );
}
function C(t) {
  return [
    ...new Set((t || []).map((n) => n.trim()).filter(Boolean))
  ];
}
const It = 4, q = /* @__PURE__ */ new Set([2, 3, 4, 5]);
function tt(t) {
  if (t == null || String(t).trim() === "")
    return It;
  const n = Number(t);
  if (!Number.isInteger(n) || !q.has(n))
    throw new Error("最短镜头时长必须是 2 到 5 秒");
  return n;
}
function Vr(t) {
  if (!(t == null || String(t).trim() === ""))
    try {
      return tt(t);
    } catch {
      return;
    }
}
function Kr(t) {
  if (!Array.isArray(t))
    return [];
  const n = /* @__PURE__ */ new Set(), r = t.map((e) => {
    const o = _(e) ? e : {}, i = tt(o.seconds), s = Number(o.sort);
    if (n.has(i) || !Number.isInteger(s))
      throw new Error("分镜最短时长注册信息无效");
    return n.add(i), {
      seconds: i,
      name: String(o.name || "").trim() || `${i} 秒`,
      sort: s
    };
  });
  if (r.length !== q.size || [...q].some(
    (e) => !n.has(e)
  ))
    throw new Error("分镜最短时长注册信息无效");
  return r.sort((e, o) => e.sort - o.sort);
}
function bn(t) {
  return t.capture_duration ?? t.duration;
}
function Yr(t) {
  const n = t.shots.map(bn);
  return [...new Set(n.filter(kt))].sort(
    (r, e) => r - e
  );
}
function Wr(t, n) {
  const r = Ot(
    n
  );
  return r.length === 0 ? t : t.filter((e) => {
    const o = new Set(
      (e.supported_options?.duration || []).map(
        (i) => String(i).trim()
      )
    );
    return r.every((i) => o.has(String(i)));
  });
}
function Jr(t) {
  const n = Ot(
    t
  );
  return n.length > 0 ? `没有同时支持 ${n.join("、")} 秒的可用视频模型` : "";
}
function Ot(t) {
  const n = Array.isArray(t) ? t : [];
  return [
    ...new Set(n.map(Number).filter(kt))
  ].sort((r, e) => r - e);
}
function kt(t) {
  return Number.isInteger(t) && t >= 2;
}
const Sn = {
  image: {
    direct: ["image", "image_url", "imageUrl"],
    collections: ["images", "image_urls", "imageUrls"]
  },
  video: {
    direct: ["video", "video_url", "videoUrl"],
    collections: ["videos", "video_urls", "videoUrls"]
  },
  audio: {
    direct: ["audio", "audio_url", "audioUrl"],
    collections: ["audios", "audio_urls", "audioUrls"]
  },
  file: {
    direct: ["file", "file_url", "fileUrl"],
    collections: ["files", "file_urls", "fileUrls"]
  }
}, An = [
  "rich",
  "content",
  "output",
  "result",
  "data",
  "body",
  "value",
  "json",
  "media_files",
  "mediaFiles",
  "text"
];
function nt(t) {
  return Object.fromEntries(
    t.map((n) => [n, /* @__PURE__ */ new Map()])
  );
}
function z(t, n, r = {}) {
  const e = {
    media: t,
    enabledKinds: Object.keys(t),
    seen: r.seen || /* @__PURE__ */ new Set(),
    requestedKind: r.kind
  };
  O(n, e, 0, r.kind);
}
function Hr(t, n) {
  const e = nt(n === "audio" ? ["audio", "image"] : [n]);
  return z(e, t, { kind: n }), wt(e), Array.from(e[n].values());
}
function wt(t) {
  const n = t.audio, r = t.image;
  if (!n || !r || n.size === 0 || n.size !== r.size)
    return;
  const e = Array.from(r.values());
  Array.from(n.values()).forEach((o, i) => {
    if (o.thumbnail)
      return;
    const s = Mt(
      "audio",
      o.url,
      e[i]?.url || ""
    );
    s && n.set(o.url, { ...o, thumbnail: s });
  });
}
function O(t, n, r, e, o = "") {
  if (t == null || r > 12)
    return;
  if (Array.isArray(t)) {
    const u = t.length > 1 ? "" : o;
    t.forEach(
      (m) => O(
        m,
        n,
        r + 1,
        e,
        u
      )
    );
    return;
  }
  if (typeof t == "string") {
    const u = E(t);
    if (u.length > 0) {
      u.forEach(
        (d) => O(
          d,
          n,
          r + 1,
          e,
          o
        )
      );
      return;
    }
    const m = e || n.requestedKind || wn(t);
    m && n.media[m] && rt(t) && In(
      n.media,
      m,
      t.trim(),
      o
    );
    return;
  }
  if (typeof t != "object" || n.seen.has(t))
    return;
  n.seen.add(t);
  const i = t, s = _(i.attrs) ? i.attrs : void 0, a = kn(
    i.type,
    i.kind,
    i.media_type,
    i.mediaType,
    i.mime
  ), c = On(
    i,
    s,
    o
  ), f = e || n.requestedKind;
  if (f && n.media[f] && (!a || a === f))
    for (const u of ct(i, f))
      O(
        u,
        n,
        r + 1,
        f,
        c
      );
  for (const u of n.enabledKinds) {
    const m = Sn[u];
    for (const d of m.direct)
      O(
        i[d],
        n,
        r + 1,
        u,
        c
      );
    for (const d of m.collections)
      O(
        i[d],
        n,
        r + 1,
        u,
        c
      );
  }
  if (a && n.media[a]) {
    for (const u of ct(i, a))
      O(
        u,
        n,
        r + 1,
        a,
        c
      );
    O(
      i.attrs,
      n,
      r + 1,
      a,
      c
    );
  }
  for (const u of An)
    O(
      i[u],
      n,
      r + 1
    );
}
function ct(t, n) {
  const r = [
    t.url,
    t.src,
    t.file_url,
    t.fileUrl,
    t.download_url,
    t.downloadUrl
  ];
  return n === "file" ? (r.push(t.download, t.open_url, t.openUrl, t.path), [
    r.find(
      (e) => typeof e == "string" && rt(e)
    )
  ]) : r;
}
function In(t, n, r, e) {
  const o = t[n];
  if (!o)
    return;
  const i = Mt(
    n,
    r,
    e
  ), s = o.get(r);
  if (s?.thumbnail || !i) {
    s || o.set(r, { url: r });
    return;
  }
  o.set(r, { url: r, thumbnail: i });
}
function Mt(t, n, r) {
  const e = r.trim();
  return !e || t !== "image" && e === n.trim() ? "" : e;
}
function On(t, n, r) {
  for (const e of [
    t.thumbnail,
    t.thumbnail_url,
    t.thumbnailUrl,
    t.poster,
    t.poster_url,
    t.posterUrl,
    t.cover,
    t.cover_url,
    t.coverUrl,
    t.first_frame_url,
    t.firstFrameUrl,
    n?.thumbnail,
    n?.thumbnail_url,
    n?.thumbnailUrl,
    n?.poster,
    n?.cover,
    r
  ])
    if (typeof e == "string" && rt(e))
      return e.trim();
  return "";
}
function kn(...t) {
  for (const n of t) {
    const r = String(n || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
    if (["image", "mediaimage", "editormediaimage"].includes(r) || r.startsWith("image/"))
      return "image";
    if (["video", "mediavideo", "editormediavideo"].includes(r) || r.startsWith("video/"))
      return "video";
    if (["audio", "music", "voice", "mediaaudio", "editormediaaudio"].includes(
      r
    ) || r.startsWith("audio/"))
      return "audio";
    if (["file", "mediafile", "editormediafile"].includes(r) || r.startsWith("application/") || r.startsWith("text/"))
      return "file";
  }
}
function wn(t) {
  const n = t.trim();
  if (/^data:image\//i.test(n) || /\.(png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i.test(n))
    return "image";
  if (/^data:video\//i.test(n) || /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(n))
    return "video";
  if (/^data:audio\//i.test(n) || /\.(mp3|wav|ogg|m4a|aac)(?:[?#].*)?$/i.test(n))
    return "audio";
}
function rt(t) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(t.trim());
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const X = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!X || Object.keys(X).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const et = ["image", "video", "audio"], Mn = 64, xn = 128 * 1024, F = /* @__PURE__ */ Symbol("content-output-cache-miss"), ut = Ct(), ft = Ct(), Cn = X, Nn = Cn.normalizeEnergonOutput;
function w(...t) {
  for (const n of t)
    if (typeof n == "string" && n.trim())
      return n.trim();
  return "";
}
function qr(t) {
  const n = T(
    t,
    ["lyrics", "lyric", "lrc", "song_lyrics", "songLyrics"],
    /* @__PURE__ */ new Set(),
    0
  );
  if (n)
    return { label: "歌词", text: n };
  const r = T(
    t,
    ["text"],
    /* @__PURE__ */ new Set(),
    0
  );
  return r ? { label: "创作内容", text: r } : null;
}
function T(t, n, r, e) {
  if (t == null || e > 12)
    return "";
  if (typeof t == "string") {
    for (const o of E(t)) {
      const i = T(o, n, r, e + 1);
      if (i)
        return i;
    }
    return "";
  }
  if (Array.isArray(t)) {
    for (const o of t) {
      const i = T(o, n, r, e + 1);
      if (i)
        return i;
    }
    return "";
  }
  if (!_(t) || r.has(t))
    return "";
  r.add(t);
  for (const o of n) {
    const i = P(t[o], e + 1);
    if (i)
      return i;
  }
  for (const o of [
    "output",
    "result",
    "data",
    "body",
    "value",
    "json",
    "rich",
    "content"
  ]) {
    const i = T(t[o], n, r, e + 1);
    if (i)
      return i;
  }
  return "";
}
function P(t, n) {
  if (t == null || n > 12)
    return "";
  if (typeof t == "string") {
    const r = t.trim();
    if (!r || /^(https?:\/\/|\/|data:|blob:)/i.test(r))
      return "";
    const e = E(r);
    return e.length > 0 ? e.map((o) => P(o, n + 1)).filter(Boolean).join(`
`) : r;
  }
  if (Array.isArray(t))
    return t.map((r) => P(r, n + 1)).filter(Boolean).join(`
`);
  if (!_(t))
    return "";
  for (const r of ["text", "content", "line", "lines", "value"]) {
    const e = P(t[r], n + 1);
    if (e)
      return e;
  }
  return "";
}
function Rn(t) {
  const n = Tn(t);
  return !n || n.hasMedia ? "" : n.markdown;
}
function Tn(t) {
  const n = jn(t);
  return !n || !Dt(n) ? null : {
    markdown: n.content.map(Et).join(`

`).trim(),
    plainText: n.content.map(Bt).join(`

`).trim(),
    hasMedia: Pt(n)
  };
}
function Xr(t) {
  return /(^|\n)\s*(#{1,6}\s|[-*+]\s|>\s|\d+\.\s|```)/m.test(t) || /(\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)]+\)|`[^`]+`)/.test(t);
}
function Qr(t) {
  return Dn(t).length > 0;
}
function Dn(t) {
  const n = j(t);
  return et.filter((r) => n[r].size > 0);
}
function En(t) {
  const n = j(t);
  return et.reduce(
    (r, e) => r + n[e].size,
    0
  );
}
function Zr(t, n) {
  return Array.from(j(t)[n].keys());
}
function vr(t, n) {
  return Array.from(j(t)[n].values());
}
function Bn(t) {
  const n = Pn(t);
  return n ? Array.from(
    new Set(n.frames.map((r) => r.image.trim()).filter(Boolean))
  ) : [];
}
function Pn(t) {
  const n = Nt(ft, t);
  return n !== F ? n : Rt(
    ft,
    t,
    U(t, /* @__PURE__ */ new Set(), 0)
  );
}
function te(t, n) {
  const r = n.trim().toLowerCase();
  return r ? L(t, r, /* @__PURE__ */ new Set(), 0) : !1;
}
function ne(...t) {
  let n, r, e = 0;
  for (const o of t) {
    if (!xt(o))
      continue;
    n === void 0 && (n = o);
    const i = En(o);
    i > e && (r = o, e = i);
  }
  return e > 0 ? r : n;
}
function xt(t) {
  return t == null || t === "" ? !1 : Array.isArray(t) ? t.length > 0 : typeof t == "object" ? Object.keys(t).length > 0 : !0;
}
function j(t) {
  const n = Nt(ut, t);
  if (n !== F)
    return n;
  const r = nt(et), e = Bn(t), o = /* @__PURE__ */ new Set();
  for (const i of Ln(t))
    z(r, i, { seen: o });
  return z(r, t), wt(r), e.length > 0 && (r.image = new Map(
    e.map((i) => [i, { url: i, thumbnail: i }])
  )), Rt(ut, t, r);
}
function Ct() {
  return {
    objects: /* @__PURE__ */ new WeakMap(),
    strings: /* @__PURE__ */ new Map()
  };
}
function Nt(t, n) {
  if (n && typeof n == "object")
    return t.objects.has(n) ? t.objects.get(n) : F;
  if (!Tt(n) || !t.strings.has(n))
    return F;
  const r = t.strings.get(n);
  return t.strings.delete(n), t.strings.set(n, r), r;
}
function Rt(t, n, r) {
  if (n && typeof n == "object")
    return t.objects.set(n, r), r;
  if (!Tt(n))
    return r;
  for (t.strings.delete(n), t.strings.set(n, r); t.strings.size > Mn; ) {
    const e = t.strings.keys().next().value;
    if (typeof e != "string")
      break;
    t.strings.delete(e);
  }
  return r;
}
function Tt(t) {
  return typeof t == "string" && t.length <= xn;
}
function Ln(t) {
  if (!xt(t))
    return [];
  const n = Nn?.(t);
  return Array.isArray(n) && n.length > 0 ? n : Array.isArray(t) ? t : [t];
}
function L(t, n, r, e) {
  return t == null || e > 12 ? !1 : typeof t == "string" ? E(t).some(
    (o) => L(o, n, r, e + 1)
  ) : Array.isArray(t) ? t.some(
    (o) => L(o, n, r, e + 1)
  ) : !_(t) || r.has(t) ? !1 : (r.add(t), String(t.type || "").trim().toLowerCase() === n ? !0 : [
    t.json,
    t.output,
    t.result,
    t.data,
    t.content,
    t.body,
    t.value,
    t.text,
    t.finalOutput,
    t.final_output,
    t.rich
  ].some(
    (o) => L(o, n, r, e + 1)
  ));
}
function U(t, n, r) {
  if (t == null || r > 12)
    return null;
  if (typeof t == "string") {
    const o = t.trim();
    if (!o || !o.startsWith("{") && !o.startsWith("["))
      return null;
    try {
      return U(JSON.parse(o), n, r + 1);
    } catch {
      return null;
    }
  }
  if (Array.isArray(t)) {
    for (const o of t) {
      const i = U(o, n, r + 1);
      if (i)
        return i;
    }
    return null;
  }
  if (!_(t) || n.has(t))
    return null;
  n.add(t);
  const e = Un(t);
  if (e)
    return e;
  for (const o of [
    "json",
    "storyboard_grid",
    "output",
    "result",
    "data",
    "content",
    "body",
    "value",
    "text",
    "rich"
  ]) {
    const i = U(t[o], n, r + 1);
    if (i)
      return i;
  }
  return null;
}
function Un(t) {
  if (String(t.type || "").trim().toLowerCase() !== "storyboard_grid" || !Array.isArray(t.frames))
    return null;
  const n = t.frames.map(zn).filter((r) => !!r).sort((r, e) => r.order - e.order);
  return n.length < 2 || n.length > fn ? null : {
    type: "storyboard_grid",
    version: Math.max(1, Math.trunc(Number(t.version) || 1)),
    title: w(t.title, "宫格图片"),
    summary: w(t.summary),
    frames: n
  };
}
function zn(t, n) {
  if (!_(t))
    return null;
  const r = Math.max(1, Math.trunc(Number(t.order) || n + 1));
  return {
    id: w(t.id, `frame-${String(r).padStart(2, "0")}`),
    order: r,
    title: w(
      t.title,
      `画面 ${String(r).padStart(2, "0")}`
    ),
    description: w(t.description),
    prompt: w(t.prompt),
    status: w(t.status),
    image: Fn(
      t.image,
      t.image_url,
      t.imageUrl
    ),
    error: w(t.error),
    assetID: dt(t.asset_id, t.assetId, t.assetID),
    assetVersionID: dt(
      t.asset_version_id,
      t.assetVersionId,
      t.assetVersionID
    )
  };
}
function Fn(...t) {
  for (const n of t) {
    const r = nt(["image"]);
    z(r, n, { kind: "image" });
    const e = r.image.values().next().value;
    if (e?.url)
      return e.url;
  }
  return "";
}
function dt(...t) {
  for (const n of t) {
    const r = Math.trunc(Number(n) || 0);
    if (r > 0)
      return r;
  }
  return 0;
}
function jn(t) {
  return _(t) ? t.type === "doc" && Array.isArray(t.content) ? t : _(t.rich) && t.rich.type === "doc" && Array.isArray(t.rich.content) ? t.rich : null : null;
}
function Dt(t) {
  return _(t) ? t.type === "text" ? !Array.isArray(t.marks) || t.marks.length === 0 : t.type === "hardBreak" ? !0 : $(t) ? !!Lt(t) : t.type !== "doc" && t.type !== "paragraph" ? !1 : Array.isArray(t.content) && t.content.every(Dt) : !1;
}
function Et(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : $(t) ? `![${$n(
    String(t.attrs?.alt || t.attrs?.caption || "图片")
  )}](<${Gn(Lt(t))}>)` : Array.isArray(t.content) ? t.content.map(Et).join("") : "";
}
function Bt(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : $(t) ? "" : Array.isArray(t.content) ? t.content.map(Bt).join("") : "";
}
function Pt(t) {
  return $(t) || !!t.content?.some((n) => Pt(n));
}
function $(t) {
  return ["image", "mediaImage", "editorMediaImage"].includes(
    String(t.type || "")
  );
}
function Lt(t) {
  return String(t.attrs?.src || "").trim();
}
function $n(t) {
  return t.replace(/([\\\[\]])/g, "\\$1");
}
function Gn(t) {
  return t.replace(/</g, "%3C").replace(/>/g, "%3E");
}
const Q = 9, Ut = 2, Vn = 50, mt = /* @__PURE__ */ new Set([
  "未命名",
  "未命名分镜",
  "分镜",
  "分镜脚本",
  "暂无内容简介",
  "围绕当前主题展开并完成一个连贯事件"
]), Kn = ["photoreal", "stylized"], re = {
  photoreal: "写实影像",
  stylized: "非写实影像"
}, Yn = [
  "16:9",
  "9:16",
  "1:1",
  "4:3",
  "3:4",
  "21:9"
], Wn = "16:9", Jn = [
  "shot_images",
  "final_video",
  "shot_videos",
  "storyboard_only"
], Y = {
  output_target: "final_video",
  voice_mode: "native",
  subtitle_mode: "off"
};
function ot(t, n, r, e) {
  if (!_(t)) return;
  const o = l(t.outgoing), i = l(t.outgoing_motion), s = l(t.camera_through), a = n ? l(t.incoming) : "", c = l(t.sound_cue), f = r && t.match_action === !0, u = e ? l(t.camera_path) : "";
  if (!o && !i && !s && !a && !c && !f && !u) return;
  const m = Math.round(k(t.sound_lead_ms) ?? 0);
  return {
    outgoing: o,
    ...i ? { outgoing_motion: i } : {},
    ...s ? { camera_through: s } : {},
    incoming: a,
    sound_cue: c,
    sound_lead_ms: n && c && m >= 100 ? Math.min(900, m) : 0,
    ...n && t.reaction_cut === !0 ? { reaction_cut: !0 } : {},
    ...f ? { match_action: !0 } : {},
    ...u ? { camera_path: u } : {}
  };
}
function Hn(t, n) {
  return (n === "video" ? t.video_prompt : n === "start" ? t.start_framing : t.end_framing)?.trim() || "";
}
function ee(t, n) {
  return t.prompt_overrides?.[n] || Hn(t, n);
}
function qn(t) {
  if (!_(t)) return;
  const n = l(t.start).trim(), r = l(t.end).trim(), e = l(t.video).trim();
  return n || r || e ? { ...n && { start: n }, ...r && { end: r }, ...e && { video: e } } : void 0;
}
function Xn(t, n) {
  return n > 0 && t.continue_previous;
}
const Qn = [
  "storyboard",
  "json",
  "output",
  "result",
  "data",
  "content",
  "body",
  "value",
  "text",
  "finalOutput",
  "final_output",
  "rich"
];
function oe(t) {
  return or(t, ir);
}
function ie(t, n) {
  if (!_(t) || !Array.isArray(t.materials))
    return null;
  const r = t.materials.map(Gt);
  if (r.some((s) => !s))
    return null;
  const e = r, o = new Set(
    e.map((s) => s.id)
  );
  if (o.size !== e.length)
    return null;
  const i = Vt(t.shot, n, o);
  return i ? { shot: i, materials: e } : null;
}
function se(t) {
  return t.timeline_duration_ms && t.timeline_duration_ms > 0 ? Math.round(t.timeline_duration_ms) / 1e3 : zt(t.shots);
}
function zt(t) {
  return t.reduce(
    (n, r) => n + Math.max(0, Number(r.duration) || 0),
    0
  );
}
function lt(t) {
  return Number.isInteger(t) && t >= Ut;
}
function ae(t, n) {
  const r = new Map(
    t.materials.map((e) => [e.id, e])
  );
  return n.material_ids.map((e) => r.get(e)).filter((e) => !!e);
}
function ce(t) {
  return {
    id: `shot-${t + 1}`,
    order: t + 1,
    duration: It,
    beat: "",
    transition: "",
    transition_type: "none",
    transition_duration_ms: 0,
    description: "",
    spatial_layout: "",
    start_framing: "",
    end_framing: "",
    camera_instruction: "",
    video_prompt: "",
    material_ids: [],
    reference_keys: [],
    shot_image_mode: ln,
    match_previous: !1,
    continue_previous: !1,
    continuity_anchor: "",
    continuity_state: { entry: "", exit: "" },
    speech: [],
    captions: []
  };
}
function ue(t, n) {
  const r = new Set(t.map((i) => i.id));
  let e = t.filter((i) => i.type === n).length + 1, o = `${n}-${e}`;
  for (; r.has(o); )
    e += 1, o = `${n}-${e}`;
  return {
    id: o,
    type: n,
    name: "",
    prompt: "",
    voice: "",
    reference_keys: []
  };
}
function fe(t, n) {
  const r = [], e = [];
  for (const o of t.shots) {
    o.material_ids.includes(n) && r.push(o.id);
    for (const i of o.speech)
      i.character_id === n && e.push(i.id);
  }
  return { shotIds: r, speechIds: e };
}
function de(t) {
  let n = 0;
  const r = [];
  for (const e of t.shots) {
    for (const o of [...e.speech].sort((i, s) => i.start_time - s.start_time))
      o.kind === "narration" && o.text.trim() && r.push({ speech: o, startTime: n + o.start_time, shotId: e.id });
    n += e.duration;
  }
  return r;
}
function Zn(t) {
  const n = Yt(t.workflow), r = v(t.references), e = new Set(r.map((s) => s.key)), o = new Set(
    t.materials.map((s) => s.id)
  ), i = t.shots.map((s, a) => {
    const c = a > 0 && !s.continuity_state.time_jump?.trim(), f = c && !!s.continue_previous, u = c && !f && !!s.match_previous;
    return {
      ...s,
      id: s.id || `shot-${a + 1}`,
      order: a + 1,
      transition: a > 0 ? s.transition.trim() : "",
      handoff: ot(
        s.handoff,
        a > 0 || !!t.chapter_boundary,
        u,
        f || a === 0 && t.chapter_boundary?.connection === "continue"
      ),
      transition_type: "none",
      transition_duration_ms: 0,
      material_ids: D(s.material_ids).filter(
        (m) => o.has(m)
      ),
      reference_keys: D(s.reference_keys).filter(
        (m) => e.has(m)
      ),
      shot_image_mode: St(s.shot_image_mode),
      shared_end_shot_id: "",
      match_previous: u,
      continue_previous: f,
      continuity_anchor: f ? s.continuity_anchor.trim() : "",
      continuity_state: Ft(
        s.continuity_state
      ),
      lyric_line_indexes: Kt(
        s.lyric_line_indexes
      )
    };
  });
  return i.forEach((s, a) => {
    const c = Xn(s, a);
    if (a > 0 && (c || s.match_previous && s.handoff?.match_action)) {
      const f = i[a - 1];
      s.continuity_state.facts || (s.continuity_state.entry = f.continuity_state.exit || s.continuity_state.entry), c && (s.start_framing = f.end_framing || s.start_framing);
    }
  }), {
    ...t,
    version: Q,
    workflow: n,
    production_plan: it(
      t.production_plan,
      t.work_type
    ),
    target_duration: !i.length && t.screenplay ? t.target_duration : zt(i),
    target_shot_count: i.length,
    lyrics_lrc: t.work_type === "mv" ? String(t.lyrics_lrc || "") : "",
    narrator_voice: t.narrator_voice.trim(),
    aspect_ratio: jt(t.aspect_ratio),
    references: r,
    materials: t.materials.map((s) => ({
      ...s,
      voice: s.type === "character" ? s.voice.trim() : "",
      reference_keys: D(s.reference_keys).filter(
        (a) => e.has(a)
      )
    })),
    shots: i
  };
}
function Ft(t) {
  const n = _(t) ? t : {};
  return {
    entry: l(n.entry).trim(),
    exit: l(n.exit).trim(),
    ...Array.isArray(n.facts) ? { facts: n.facts, time_jump: l(n.time_jump) } : {}
  };
}
function vn(t, n) {
  return t.material_ids.filter((r) => n.has(r)).sort().join(`
`);
}
function me(t, n) {
  const r = new Map(t.shots.map((i, s) => [i.id, s])), e = new Set([...t.materials, ...n.materials].filter((i) => i.type === "scene").map((i) => i.id)), o = (i) => vn(i, e);
  return {
    ...n,
    shots: n.shots.map((i, s) => {
      const a = r.get(i.id) ?? -1, c = t.shots[a], f = t.shots[a - 1], u = n.shots[s - 1], m = f?.id !== u?.id;
      let d = !!(u && i.continue_previous), p = !!(u && i.match_previous);
      const g = o(i), y = u ? o(u) : "", h = !!(c && g !== o(c)) || !!(f && y !== o(f)), S = i.handoff?.camera_path, M = d && !!S && !m && (!h || S !== c?.handoff?.camera_path);
      if (u) {
        const b = !!(g && g === y), A = !!(c && (i.start_framing !== c.start_framing || i.continuity_state.entry !== c.continuity_state.entry));
        !!i.continuity_state.time_jump?.trim() || !d && !p && (!!(c?.continue_previous || c?.match_previous) || i.scene_index != null && u.scene_index != null && i.scene_index !== u.scene_index) || !M && !b && (g || y || m || A) ? (d = !1, p = !1) : (m || h || d && A) && (d = (b || M) && !!i.continuity_state.entry.trim() && i.continuity_state.entry.trim() === u.continuity_state.exit.trim() && (i.start_framing || "").trim() === (u.end_framing || "").trim(), p = b && !d);
      }
      let I = {};
      if (!d && (h || m) && c?.continue_previous && f && (i.continuity_state.entry === c.continuity_state.entry && c.continuity_state.entry === f.continuity_state.exit && (I.continuity_state = { ...i.continuity_state, entry: "" }), i.start_framing === c.start_framing && c.start_framing === f.end_framing)) {
        const b = { ...i.reference_contents };
        delete b.start_framing, I = { ...I, start_framing: "", reference_contents: b };
      }
      const x = s === 0 && n.chapter_boundary?.connection === "continue";
      return {
        ...i,
        ...I,
        transition: !u || m ? "" : i.transition,
        handoff: m || h && !M ? void 0 : ot(
          i.handoff,
          !!(u || x),
          !d && p,
          d || x
        ),
        match_previous: !d && p,
        continue_previous: d,
        continuity_anchor: d ? i.continuity_anchor : ""
      };
    })
  };
}
function le(t) {
  return t.workflow.status === "confirmed";
}
function it(t, n) {
  const r = _(t) ? t : {}, e = l(r.output_target).toLowerCase(), o = {
    output_target: Jn.includes(
      e
    ) ? e : Y.output_target,
    voice_mode: r.voice_mode === "auto" || r.voice_mode === "off" ? r.voice_mode : Y.voice_mode,
    subtitle_mode: _r(
      r.subtitle_mode,
      Y.subtitle_mode
    ),
    shot_visual_strategy: "auto"
  };
  return n === "mv" ? {
    ...o,
    voice_mode: "off",
    subtitle_mode: "off"
  } : o;
}
function _e(t) {
  return {
    ...it(
      t.production_plan,
      t.work_type
    ),
    output_target: "final_video"
  };
}
function pe(t) {
  return t.production_plan.output_target !== "storyboard_only";
}
function st(t) {
  return ["shot_videos", "final_video"].includes(
    t.production_plan.output_target
  );
}
function ye(t) {
  return t.production_plan.output_target === "final_video";
}
function G(t) {
  return t.work_type === "mv";
}
function ge(t) {
  return !G(t) && st(t) && t.production_plan.voice_mode === "auto" && nr(t) > 0;
}
function tr(t) {
  return !G(t) && st(t) && t.production_plan.voice_mode === "native";
}
function he(t, n) {
  const r = t.shots[n], e = t.shots[n + 1], o = e?.handoff?.sound_lead_ms || 0;
  return !r || !e || !o || G(t) || tr(t) && (r.speech.length > 0 || e.speech.some((i) => i.start_time * 1e3 < o)) ? 0 : o;
}
function be(t) {
  return !G(t) && st(t) && t.production_plan.subtitle_mode === "auto" && rr(t) > 0;
}
function nr(t) {
  return t.shots.reduce(
    (n, r) => n + r.speech.filter(hr).length,
    0
  );
}
function rr(t) {
  return t.shots.reduce(
    (n, r) => n + er(r).length,
    0
  );
}
function er(t) {
  const n = t.speech.filter((e) => e.subtitle_enabled && !!e.text.trim()).map((e) => ({
    id: `subtitle-${e.id}`,
    text: e.subtitle_text.trim() || e.text.trim(),
    start_time: e.start_time,
    speech_id: e.id,
    source: "speech"
  })), r = t.captions.filter((e) => !!e.text.trim()).map((e) => ({
    id: e.id,
    text: e.text.trim(),
    start_time: e.start_time,
    end_time: e.end_time,
    source: "caption"
  }));
  return [...n, ...r].sort(
    (e, o) => e.start_time - o.start_time
  );
}
function Se(t) {
  return `${t.title.trim() || "分镜脚本"} · ${t.shots.length} 个镜头`;
}
function Ae(t) {
  return t.summary.trim() || $t("", t.shots);
}
function Ie(t, n) {
  return { ...t, style_prompt: n };
}
function jt(t) {
  const n = l(t);
  return Yn.includes(n) ? n : Wn;
}
function or(t, n) {
  return N(t, /* @__PURE__ */ new Set(), 0, n);
}
function N(t, n, r, e) {
  if (t == null || r > 10)
    return null;
  if (typeof t == "string") {
    for (const a of E(t)) {
      const c = N(a, n, r + 1, e);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object" || n.has(t))
    return null;
  if (n.add(t), Array.isArray(t)) {
    for (const a of t) {
      const c = N(a, n, r + 1, e);
      if (c)
        return c;
    }
    return null;
  }
  const o = t, i = e(o);
  if (i)
    return i;
  const s = pr(o);
  if (s) {
    const a = N(s, n, r + 1, e);
    if (a)
      return a;
  }
  for (const a of Qn) {
    const c = o[a];
    if (c == null || c === t)
      continue;
    const f = N(c, n, r + 1, e);
    if (f)
      return f;
  }
  return null;
}
function ir(t) {
  const n = l(t.visual_mode).toLowerCase(), r = cr(t.work_type);
  let e;
  try {
    e = tt(t.min_shot_duration);
  } catch {
    return null;
  }
  if (l(t.type).toLowerCase() !== "storyboard" || k(t.version) !== Q || typeof t.title != "string" || typeof t.narrator_voice != "string" || typeof t.style_prompt != "string" || !dr(n) || !r || !Array.isArray(t.references) || !Array.isArray(t.materials) || !Array.isArray(t.shots))
    return null;
  const o = _(t.workflow) && t.workflow.status === "draft", i = t.screenplay == null ? void 0 : sr(t.screenplay);
  if (i === null) return null;
  const s = ur(t.storyline);
  if (!s)
    return null;
  const a = v(t.references);
  if (a.length !== t.references.length)
    return null;
  const c = t.materials.map(Gt);
  if (c.some((b) => !b))
    return null;
  const f = c, u = /* @__PURE__ */ new Set();
  for (const b of f) {
    if (u.has(b.id))
      return null;
    u.add(b.id);
  }
  const m = /* @__PURE__ */ new Set(), d = _(t.chapter_boundary) && t.chapter_boundary.connection === "continue", p = t.shots.map(
    (b, A) => Vt(b, A, u, o, A === 0 && d)
  );
  if (p.some((b) => !b))
    return null;
  const g = p;
  for (const [b, A] of g.entries()) {
    if (m.has(A.id))
      return null;
    m.add(A.id);
  }
  const y = k(t.target_duration), h = k(t.target_shot_count);
  if (y == null || !Number.isInteger(y) || y < Ut || h == null || !Number.isInteger(h) || h < (i && o && !g.length ? 0 : 1) || h > Vn)
    return null;
  const S = ar(t, r);
  if (S === null)
    return null;
  const M = Yt(t.workflow), I = $t(
    l(t.summary),
    g
  ), x = {
    ...t,
    type: "storyboard",
    version: Q,
    work_type: r,
    workflow: M,
    screenplay: i,
    production_plan: it(
      t.production_plan,
      r
    ),
    title: fr(t.title, I, g),
    summary: I,
    target_duration: y,
    target_shot_count: h,
    min_shot_duration: e,
    ...S,
    lyrics_lrc: r === "mv" ? l(t.lyrics_lrc) : "",
    narrator_voice: t.narrator_voice.trim(),
    storyline: s,
    style_prompt: t.style_prompt,
    visual_mode: n,
    aspect_ratio: jt(t.aspect_ratio),
    references: a,
    materials: f,
    shots: g
  };
  return Zn(x);
}
function sr(t) {
  if (!_(t)) return null;
  const { source: n, source_passages: r, parts: e } = t;
  return !_(n) || !Array.isArray(r) || !Array.isArray(e) || typeof n.unit_id != "string" || !n.unit_id || !["work_asset_id", "work_version_id", "asset_id", "version_id"].every(
    (o) => Number.isInteger(n[o]) && Number(n[o]) > 0
  ) || !r.length || !r.every(
    (o) => _(o) && typeof o.id == "string" && typeof o.text == "string"
  ) || !e.length || !e.every(
    (o) => _(o) && typeof o.title == "string" && typeof o.description == "string" && ["reset", "match", "continue"].includes(String(o.connection)) && Number.isInteger(o.source_start) && Number(o.source_start) > 0 && Number.isInteger(o.source_end) && Number(o.source_end) >= Number(o.source_start) && Number(o.source_end) <= r.length && Number.isInteger(o.target_duration) && Number(o.target_duration) > 0
  ) ? null : t;
}
function ar(t, n) {
  if ([
    t.storyboard_range_start_ms,
    t.storyboard_range_end_ms,
    t.storyboard_soundtrack_duration_ms,
    t.timeline_duration_ms
  ].every((a) => a == null || a === ""))
    return {};
  const e = B(t.storyboard_range_start_ms), o = B(t.storyboard_range_end_ms), i = B(
    t.storyboard_soundtrack_duration_ms
  ), s = B(t.timeline_duration_ms);
  return n !== "mv" || e == null || o == null || i == null || s == null || ![e, o, i, s].every(
    Number.isInteger
  ) || e < 0 || o <= e || o > i || s !== o - e ? null : {
    storyboard_range_start_ms: e,
    storyboard_range_end_ms: o,
    storyboard_soundtrack_duration_ms: i,
    timeline_duration_ms: s
  };
}
function cr(t) {
  const n = l(t).toLowerCase();
  return n ? sn(n) ? n : null : "short";
}
function ur(t) {
  if (!_(t))
    return null;
  const n = l(t.setup), r = l(t.development), e = l(t.payoff);
  return { setup: n, development: r, payoff: e };
}
function $t(t, n) {
  const r = t.trim();
  if (r)
    return r;
  const e = n.map((o) => o.description.trim()).filter(Boolean);
  return e.length > 0 ? e.join("；") : "暂无内容简介";
}
function fr(t, n, r) {
  const e = t.trim();
  if (e && !mt.has(e))
    return e;
  const o = [n, r[0]?.beat, r[0]?.description].map((s) => String(s || "").trim()).find((s) => s && !mt.has(s));
  if (!o)
    return "分镜脚本";
  const i = o.split(/[\r\n。！？!?；;]/, 1)[0].trim();
  return Array.from(i).slice(0, 24).join("") || "分镜脚本";
}
function dr(t) {
  return Kn.includes(t);
}
function Gt(t) {
  if (!_(t))
    return null;
  const n = l(t.type).toLowerCase();
  return !yr(n) || typeof t.id != "string" || !t.id.trim() || typeof t.name != "string" || typeof t.prompt != "string" || typeof t.voice != "string" || !Array.isArray(t.reference_keys) ? null : {
    ...t,
    id: t.id.trim(),
    type: n,
    name: t.name.trim().replace(/^[@#]+/, ""),
    prompt: t.prompt.trim(),
    voice: n === "character" ? t.voice.trim() : "",
    reference_keys: D(t.reference_keys.map(l))
  };
}
function Vt(t, n, r, e = !1, o = !1) {
  if (!_(t) || typeof t.id != "string" || !t.id.trim() || typeof t.beat != "string" || !e && !t.beat.trim() || typeof t.transition != "string" || typeof t.match_previous != "boolean" || typeof t.description != "string" || t.spatial_layout != null && typeof t.spatial_layout != "string" || t.start_framing != null && typeof t.start_framing != "string" || t.end_framing != null && typeof t.end_framing != "string" || typeof t.camera_instruction != "string" || typeof t.video_prompt != "string" || typeof t.continue_previous != "boolean" || typeof t.continuity_anchor != "string" || !_(t.continuity_state) || typeof t.continuity_state.entry != "string" || typeof t.continuity_state.exit != "string" || !Array.isArray(t.material_ids) || !Array.isArray(t.reference_keys) || !Array.isArray(t.speech) || !Array.isArray(t.captions))
    return null;
  const i = k(t.duration);
  if (i == null || !lt(i))
    return null;
  const s = k(t.capture_duration);
  if (t.capture_duration != null && (s == null || !lt(s) || s < i))
    return null;
  const a = t.material_ids.map(l);
  if (a.some((y) => !y || !r.has(y)) || new Set(a).size !== a.length)
    return null;
  const c = t.speech.map(mr);
  if (c.some((y) => !y))
    return null;
  const f = t.captions.map(lr);
  if (f.some(
    (y) => !y || y.end_time > i
  ))
    return null;
  const u = n > 0 && t.continue_previous;
  if (n === 0 && (t.match_previous || t.continue_previous) || t.match_previous && t.continue_previous)
    return null;
  const m = n > 0 && !u && t.match_previous, d = t.transition.trim(), p = t.continuity_anchor.trim(), g = Ft(
    t.continuity_state
  );
  return {
    ...t,
    id: t.id.trim(),
    order: n + 1,
    duration: i,
    capture_duration: s ?? void 0,
    beat: t.beat.trim(),
    transition: n > 0 ? d : "",
    handoff: ot(
      t.handoff,
      n > 0 || o,
      m,
      u || o
    ),
    transition_type: "none",
    transition_duration_ms: 0,
    description: t.description,
    spatial_layout: l(t.spatial_layout),
    start_framing: l(t.start_framing),
    end_framing: l(t.end_framing),
    camera_instruction: t.camera_instruction,
    video_prompt: t.video_prompt,
    prompt_overrides: qn(t.prompt_overrides),
    material_ids: a,
    reference_keys: D(t.reference_keys.map(l)),
    shot_image_mode: St(t.shot_image_mode),
    shared_end_shot_id: "",
    match_previous: m,
    continue_previous: u,
    continuity_anchor: u ? p : "",
    continuity_state: g,
    lyric_line_indexes: Kt(
      t.lyric_line_indexes
    ),
    speech: c,
    captions: f
  };
}
function Kt(t) {
  return Array.isArray(t) ? [
    ...new Set(
      t.map(Number).filter((n) => Number.isInteger(n) && n > 0)
    )
  ].sort((n, r) => n - r) : [];
}
function mr(t) {
  if (!_(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string" || typeof t.subtitle_enabled != "boolean" || typeof t.subtitle_text != "string")
    return null;
  const n = l(t.kind).toLowerCase(), r = k(t.start_time);
  if (n !== "dialogue" && n !== "narration" || r == null || r < 0)
    return null;
  if (n === "narration") {
    const o = {
      ...t,
      id: t.id.trim(),
      kind: n,
      text: t.text,
      start_time: r,
      subtitle_enabled: t.subtitle_enabled,
      subtitle_text: t.subtitle_text
    };
    return delete o.character_id, delete o.speaker_mode, o;
  }
  const e = l(t.speaker_mode).toLowerCase();
  return typeof t.character_id != "string" || e !== "visible" && e !== "offscreen" ? null : {
    ...t,
    id: t.id.trim(),
    kind: n,
    text: t.text,
    start_time: r,
    character_id: t.character_id.trim(),
    speaker_mode: e,
    subtitle_enabled: t.subtitle_enabled,
    subtitle_text: t.subtitle_text
  };
}
function lr(t) {
  if (!_(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string")
    return null;
  const n = l(t.type).toLowerCase(), r = k(t.start_time), e = k(t.end_time);
  return !gr(n) || r == null || e == null || r < 0 || e <= r ? null : {
    ...t,
    id: t.id.trim(),
    type: n,
    text: t.text,
    start_time: r,
    end_time: e
  };
}
function Yt(t) {
  const n = _(t) ? t : {}, r = l(n.status).toLowerCase() === "confirmed" ? "confirmed" : "draft";
  return {
    status: r,
    confirmed_at: r === "confirmed" ? l(n.confirmed_at) : ""
  };
}
function _r(t, n) {
  const r = l(t).toLowerCase();
  return r === "auto" || r === "off" ? r : n;
}
function pr(t) {
  const n = Rn(t);
  if (n)
    return n;
  if (!_(t))
    return "";
  const r = t.type === "doc" ? t : _(t.rich) && t.rich.type === "doc" ? t.rich : null;
  return r ? Wt(r).trim() : "";
}
function Wt(t) {
  if (!_(t))
    return "";
  if (t.type === "text")
    return l(t.text);
  if (t.type === "hardBreak")
    return `
`;
  if (!Array.isArray(t.content))
    return "";
  const n = t.type === "doc" || t.type === "paragraph" || t.type === "codeBlock" ? `
` : "";
  return t.content.map(Wt).join(n);
}
function yr(t) {
  return t === "character" || t === "scene" || t === "prop";
}
function gr(t) {
  return t === "caption" || t === "title" || t === "highlight";
}
function hr(t) {
  return t.text.trim().length > 0;
}
function D(t) {
  return [...new Set(t.map((n) => n.trim()).filter(Boolean))];
}
function k(t) {
  const n = typeof t == "number" ? t : Number.NaN;
  return Number.isFinite(n) ? n : null;
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const Z = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!Z || Object.keys(Z).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const br = Z.EnergonAudioPlayer;
function Oe({
  src: t,
  autoPlay: n = !1
}) {
  return /* @__PURE__ */ at("div", { className: "wb-asset-audio-preview", children: /* @__PURE__ */ at(
    br,
    {
      src: t,
      autoPlay: n,
      className: "h-full min-h-0 border-0 bg-transparent p-0 shadow-none"
    }
  ) });
}
export {
  l as $,
  Vn as A,
  gt as B,
  en as C,
  ht as D,
  fe as E,
  Ae as F,
  re as G,
  Yn as H,
  Ie as I,
  ce as J,
  xt as K,
  Pn as L,
  Ut as M,
  Bn as N,
  te as O,
  tt as P,
  It as Q,
  xr as R,
  Kn as S,
  Cr as T,
  Wr as U,
  Jr as V,
  Mr as W,
  tr as X,
  he as Y,
  de as Z,
  Ar as _,
  Zr as a,
  dn as a0,
  _n as a1,
  Er as a2,
  Ur as a3,
  zr as a4,
  Pr as a5,
  Br as a6,
  jr as a7,
  w as a8,
  kr as a9,
  Yr as aA,
  bn as aB,
  er as aC,
  Gr as aD,
  ee as aE,
  vt as aF,
  Tn as aG,
  Xr as aH,
  or as aI,
  Gt as aJ,
  En as aK,
  Ln as aL,
  Nr as aM,
  Tr as aN,
  Rr as aO,
  un as aP,
  H as aQ,
  Se as aR,
  Qr as aa,
  ne as ab,
  Nt as ac,
  Rt as ad,
  F as ae,
  Ct as af,
  Or as ag,
  Nn as ah,
  Xt as ai,
  yt as aj,
  fn as ak,
  Oe as al,
  Ir as am,
  cn as an,
  Vr as ao,
  v as ap,
  sn as aq,
  B as ar,
  Ot as as,
  Fr as at,
  At as au,
  Kr as av,
  pe as aw,
  Lr as ax,
  Dr as ay,
  ae as az,
  ie as b,
  Dn as c,
  wr as d,
  qt as e,
  Rn as f,
  Hr as g,
  qr as h,
  _ as i,
  vr as j,
  _e as k,
  nr as l,
  rr as m,
  Zn as n,
  G as o,
  oe as p,
  st as q,
  me as r,
  Hn as s,
  se as t,
  ge as u,
  be as v,
  ye as w,
  ue as x,
  le as y,
  $r as z
};
