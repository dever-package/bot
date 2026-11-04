import { g as X, y as Y, Q as Z, R as w } from "./writing-document-YwPtpDvk.js";
import { r as ee, p as d, k as N, h as te, q as ne, i as l, G as j, H as U, g as C, I as re, s as h, f as A, n as ie, m as g } from "./content-view-0gIO2Kkv.js";
import { p as oe, ap as F } from "./asset-preview-D6nljO8_.js";
function $e(e) {
  const t = X(e.output);
  if (!t) return [e];
  const r = [
    ...Y.map((n) => ({
      kind: "section",
      id: n.id,
      title: n.label
    })),
    ...t.units.filter((n) => n.has_body).map((n) => ({
      kind: "unit",
      id: n.id,
      title: `${Z(t.units, n.id)} ${n.title}`
    }))
  ];
  return [
    e,
    ...r.map((n) => ({
      ...e,
      id: `${e.id}:${n.kind}:${n.id}`,
      title: `${e.title} · ${n.title}`,
      contentSelection: { kind: n.kind, ids: [n.id] },
      preview: { ...e.preview, text: n.title },
      output: void 0
    }))
  ];
}
function we(e, t) {
  const r = (t?.parts || []).flatMap(
    (n) => n.type === "reference" && n.ref_content_selection && n.ref_version_id ? [
      {
        key: `writing-pinned:${n.ref_id}:${n.ref_version_id}:${w(n.ref_content_selection)}`,
        refType: n.ref_type,
        refId: n.ref_id,
        label: n.label,
        versionID: n.ref_version_id,
        origin: n.ref_origin,
        originID: n.ref_origin_id,
        contentSelection: n.ref_content_selection
      }
    ] : []
  );
  return [...e, ...r];
}
function Ce(e, t, r) {
  return {
    ...e,
    parts: e.parts.map((n) => {
      if (n.type !== "reference" || n.ref_content_selection) return n;
      const o = t?.parts.find(
        (f) => f.type === "reference" && f.ref_type === n.ref_type && f.ref_id === n.ref_id && f.ref_version_id === n.ref_version_id && f.ref_origin_id === n.ref_origin_id && f.label === n.label
      ), s = r.find(
        (f) => f.refType === n.ref_type && f.refId === n.ref_id && f.versionID === n.ref_version_id && f.label === n.label
      ), i = o?.type === "reference" ? o.ref_content_selection : s?.contentSelection;
      return i ? { ...n, ref_content_selection: i } : n;
    })
  };
}
function Te(e) {
  return `writing:${w(e)}`;
}
function Me(e, t, r) {
  const n = fe(e, t), o = r || e.kind, s = N(n);
  if (s)
    return {
      mode: "storyboard_grid",
      value: s,
      format: "json",
      summary: W(s),
      downloadUrl: ""
    };
  const i = oe(n);
  if (i)
    return {
      mode: "storyboard",
      value: i,
      format: "json",
      summary: F(i),
      downloadUrl: ""
    };
  const f = z(n);
  if (f) {
    if (o === "text") {
      const m = U(f);
      return b(m?.markdown || C(f));
    }
    const a = pe(n) ? null : U(f);
    return a && re(a.plainText) ? b(a.markdown) : O(f);
  }
  const u = S(n);
  if (u)
    return {
      mode: "file",
      value: u,
      format: "json",
      summary: u.description || u.name || "文件内容",
      downloadUrl: u.url
    };
  const _ = le(n);
  if (_)
    return b(_);
  const y = ce(n);
  if (y)
    return O(y);
  const c = $(n) || e.description || "";
  return b(c);
}
function De(e, t, r = {}) {
  const n = r.includeNodeResult === !1 ? t?.content : ee(
    t?.content,
    e.asset?.version?.content,
    e.resultOutput,
    B(e, "result", "output")
  ), o = d(n);
  if (N(o))
    return;
  const s = te(o);
  for (const f of [o, d(s)])
    if (ne(f))
      return se(f);
  const i = de(e.kind, o);
  if (i)
    return i;
}
function se(e) {
  const r = j(e).map((n) => {
    if (!l(n) || n.json === void 0)
      return n;
    const o = { ...n };
    return delete o.json, o;
  });
  return r.length === 1 ? r[0] : r;
}
function fe(e, t) {
  return ie(
    t?.content,
    e.asset?.version?.content,
    e.resultOutput,
    B(e, "result", "output"),
    e.description
  );
}
function K(e) {
  if (e.mode === "storyboard" || e.mode === "storyboard_grid")
    return e.value;
  if (e.mode === "file")
    return ae(e.value);
  const t = String(e.value || "");
  return e.format === "markdown" ? { format: "markdown", text: t } : h(d(t)) || me(t);
}
function Ue(e) {
  return A(K(e));
}
function Oe(e, t) {
  const r = { ...e, value: t };
  if (r.mode === "storyboard")
    r.summary = F(t);
  else if (r.mode === "storyboard_grid")
    r.summary = W(t);
  else if (r.mode === "file") {
    const n = t;
    r.summary = n.description || n.name || "文件内容", r.downloadUrl = n.url;
  } else
    r.summary = T(C(K(r)));
  return r;
}
function W(e) {
  return g(
    e.summary,
    `${e.title || "宫格图片"} · ${e.frames.length} 张`
  );
}
function O(e) {
  const t = C(e);
  return {
    mode: "rich",
    value: A(e),
    format: "json",
    summary: T(t),
    downloadUrl: E(e)
  };
}
function b(e) {
  return {
    mode: "rich",
    value: e,
    format: "markdown",
    summary: T(e),
    downloadUrl: ""
  };
}
function ce(e) {
  if (typeof e == "string" && d(e) === e)
    return null;
  const t = j(e), r = [];
  return k(
    t,
    r,
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    0
  ), r.length === 0 ? null : h({ type: "doc", content: r });
}
function k(e, t, r, n, o, s) {
  if (e == null || s > 12)
    return;
  const i = d(e);
  if (typeof i == "string") {
    L(t, i, n);
    return;
  }
  if (Array.isArray(i)) {
    i.forEach(
      (u) => k(
        u,
        t,
        r,
        n,
        o,
        s + 1
      )
    );
    return;
  }
  if (!l(i) || r.has(i))
    return;
  r.add(i);
  const f = z(i);
  if (f) {
    for (const u of f.content || [])
      t.push(u);
    return;
  }
  L(
    t,
    g(i.title, i.text),
    n
  ), ue(i, t, o);
  for (const u of [
    "rich",
    "content",
    "output",
    "result",
    "data",
    "body",
    "value"
  ])
    i[u] !== void 0 && k(
      i[u],
      t,
      r,
      n,
      o,
      s + 1
    );
}
function ue(e, t, r) {
  const n = [
    { kind: "image", values: [e.image, e.image_url, e.imageUrl, e.images] },
    { kind: "video", values: [e.video, e.video_url, e.videoUrl, e.videos] },
    { kind: "audio", values: [e.audio, e.audio_url, e.audioUrl, e.audios] }
  ];
  for (const o of n)
    for (const s of o.values)
      for (const i of x(s)) {
        const f = `${o.kind}:${i}`;
        r.has(f) || (r.add(f), t.push({
          type: ge(o.kind),
          attrs: { src: i }
        }));
      }
}
function L(e, t, r) {
  const n = String(t || "").trim();
  !n || G(n) || M(n) || r.has(n) || (r.add(n), e.push({
    type: "paragraph",
    content: [{ type: "text", text: n }]
  }));
}
function x(e) {
  return Array.isArray(e) ? e.flatMap(x) : typeof e == "string" ? G(e.trim()) ? [e.trim()] : [] : l(e) ? [
    e.url,
    e.src,
    e.path,
    e.download_url,
    e.downloadUrl
  ].flatMap(x) : [];
}
function S(e) {
  const t = d(e);
  if (Array.isArray(t)) {
    for (const n of t) {
      const o = S(n);
      if (o)
        return o;
    }
    return null;
  }
  if (!l(t))
    return null;
  const r = _e(
    t.file,
    t.file_url,
    t.fileUrl,
    t.files
  );
  if (r)
    return {
      url: r,
      name: g(t.name, t.filename, t.title) || P(r),
      description: g(
        t.description,
        t.text,
        t.summary
      )
    };
  for (const n of ["content", "output", "result", "data", "body", "value"])
    if (t[n] !== void 0) {
      const o = S(t[n]);
      if (o)
        return o;
    }
  return null;
}
function ae(e) {
  return {
    type: "file",
    file_url: e.url,
    name: e.name || P(e.url),
    description: e.description.trim()
  };
}
function de(e, t) {
  if (e !== "image" && e !== "video" && e !== "audio")
    return;
  const r = x(t);
  if (r.length !== 0)
    return {
      [`${e}s`]: r
    };
}
function $(e) {
  const t = d(e);
  if (typeof t == "string")
    return M(t) ? "" : t;
  if (Array.isArray(t))
    return t.map($).filter(Boolean).join(`

`);
  if (!l(t))
    return "";
  const r = g(
    t.text,
    t.summary,
    t.description
  );
  if (r)
    return r;
  for (const n of ["content", "output", "result", "data", "body", "value"])
    if (t[n] !== void 0) {
      const o = $(t[n]);
      if (o)
        return o;
    }
  return "";
}
function le(e) {
  const t = d(e);
  return typeof t == "string" ? M(t) ? "" : t : l(t) && String(t.format || "").trim().toLowerCase() === "markdown" ? g(t.text, t.markdown) : "";
}
function me(e) {
  const t = e.split(/\n{2,}/).map((r) => r.trim());
  return {
    type: "doc",
    content: (t.length ? t : [""]).map((r) => ({
      type: "paragraph",
      content: r ? [{ type: "text", text: r }] : []
    }))
  };
}
function E(e) {
  if (!e || typeof e != "object")
    return "";
  if (["editorMediaImage", "editorMediaVideo", "editorMediaAudio"].includes(
    String(e.type || "")
  ))
    return String(e.attrs?.src || "").trim();
  for (const t of Array.isArray(e.content) ? e.content : []) {
    const r = E(t);
    if (r)
      return r;
  }
  return "";
}
function z(e) {
  const t = d(e);
  if (!l(t))
    return null;
  if (String(t.type || "") === "doc")
    return h(t);
  const r = Object.keys(t).filter((n) => n !== "format");
  return r.length === 1 && r[0] === "rich" ? h(t.rich) : String(t.format || "").trim().toLowerCase() === "rich_json" ? h(t.rich ?? t.content) : null;
}
function pe(e) {
  const t = d(e);
  return l(t) && String(t.format || "").trim().toLowerCase() === "rich_json";
}
function ge(e) {
  return {
    image: "editorMediaImage",
    video: "editorMediaVideo",
    audio: "editorMediaAudio"
  }[e];
}
function _e(...e) {
  for (const t of e) {
    const r = x(t)[0];
    if (r)
      return r;
  }
  return "";
}
function B(e, ...t) {
  let r = e;
  for (const n of t) {
    if (!l(r))
      return;
    r = r[n];
  }
  return r;
}
function P(e) {
  const r = (e.split(/[?#]/)[0] || "").split("/").pop() || "";
  try {
    return decodeURIComponent(r) || "文件";
  } catch {
    return r || "文件";
  }
}
function T(e) {
  const t = String(e || "").replace(/\s+/g, " ").trim();
  return t.length > 120 ? `${t.slice(0, 120)}…` : t || "暂无内容";
}
function G(e) {
  return /^(https?:\/\/|\/|data:)/i.test(e);
}
function M(e) {
  const t = e.trim();
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function D(e, t) {
  const r = String(e || ""), n = xe(t);
  if (!r || n.length === 0)
    return {
      version: 1,
      parts: r ? [{ type: "text", text: r }] : []
    };
  const o = [];
  let s = 0;
  for (; s < r.length; ) {
    const i = ve(r, s, n);
    if (!i) {
      v(o, r.slice(s));
      break;
    }
    i.index > s && v(o, r.slice(s, i.index)), o.push({
      type: "reference",
      ref_type: i.target.refType,
      ref_id: i.target.refId,
      label: p(i.target.label),
      usage: i.target.usage,
      purpose: i.target.purpose,
      ref_trigger: i.target.trigger || "@",
      ref_version_id: i.target.versionId,
      ref_origin: i.target.origin,
      ref_origin_id: i.target.originID,
      ref_media_url: i.target.mediaURL,
      ref_media_index: i.target.mediaIndex,
      ref_media_count: i.target.mediaCount,
      ref_media_items: i.target.mediaItems,
      ref_media_excluded: i.target.mediaExcluded,
      ref_content_selection: i.target.contentSelection
    }), s = i.index + i.target.mention.length;
  }
  return { version: 1, parts: o };
}
function Le(e, t) {
  return D(
    e,
    be(t)
  );
}
function Ne(e, t) {
  const r = V(
    t,
    I
  ), n = D(e, r), o = new Set(
    J(n).map(
      I
    )
  ), s = r.filter(
    (f) => !o.has(I(f))
  );
  if (!s.length)
    return n;
  const i = [];
  for (let f = 0; f < s.length; f += 1)
    Q(
      i,
      s[f],
      f === s.length - 1 ? n.parts[0] : void 0
    );
  return { version: 1, parts: [...i, ...n.parts] };
}
function ye(e) {
  return !!e?.parts.some((t) => t.type === "reference");
}
function je(e, t, r) {
  if (!t || !e.includes("@") && !e.includes("#"))
    return t;
  const n = D(e, [
    ...J(t),
    ...r
  ]);
  return ye(n) ? n : t;
}
function J(e) {
  return e ? e.parts.filter((t) => t.type === "reference").map(
    (t) => ({
      refType: t.ref_type,
      refId: t.ref_id,
      label: p(t.label),
      usage: t.usage,
      purpose: t.purpose,
      trigger: t.ref_trigger === "#" ? "#" : "@",
      versionId: t.ref_version_id,
      origin: t.ref_origin,
      originID: t.ref_origin_id,
      mediaURL: t.ref_media_url,
      mediaIndex: t.ref_media_index,
      mediaCount: t.ref_media_count,
      mediaItems: t.ref_media_items,
      mediaExcluded: t.ref_media_excluded,
      contentSelection: t.ref_content_selection
    })
  ) : [];
}
function he(e) {
  return e ? e.parts.map(
    (t) => t.type === "text" ? t.text : `${t.ref_trigger === "#" ? "#" : "@"}${p(t.label)}`
  ).join("") : "";
}
function Ae(e, t, r) {
  const n = V(
    r.filter(
      (c) => c.origin === "edge" && !!c.originID
    ),
    R
  ), o = new Map(
    n.map((c) => [
      R(c),
      c
    ])
  ), s = t?.version === 1 ? t.parts : e ? [{ type: "text", text: e }] : [], i = [], f = /* @__PURE__ */ new Set();
  let u = !1;
  for (const c of s) {
    if (c.type === "reference" && c.ref_origin === "edge" && c.ref_origin_id) {
      const a = R({
        refId: c.ref_id,
        originID: c.ref_origin_id
      }), m = o.get(a);
      if (!m) {
        u = !0;
        continue;
      }
      q(i, {
        ...m,
        usage: c.usage,
        purpose: c.purpose,
        mediaURL: c.ref_media_url,
        mediaIndex: c.ref_media_index,
        mediaCount: c.ref_media_count,
        mediaItems: c.ref_media_items,
        mediaExcluded: c.ref_media_excluded,
        contentSelection: c.ref_content_selection,
        ...c.ref_content_selection ? { versionId: c.ref_version_id, label: c.label } : {}
      }), f.add(a), u = !1;
      continue;
    }
    if (c.type === "text") {
      let a = c.text;
      if (u && /^\s/.test(a)) {
        const m = i[i.length - 1];
        (!m || m.type === "text" && /\s$/.test(m.text)) && (a = a.slice(1));
      }
      v(i, a), u = !1;
      continue;
    }
    i.push({ ...c }), u = !1;
  }
  const _ = n.filter(
    (c) => !f.has(R(c))
  );
  if (_.length > 0) {
    const c = i[i.length - 1];
    c && (c.type !== "text" || !/\s$/.test(c.text)) && v(i, " ");
    for (const a of _)
      Q(i, a);
  }
  const y = { version: 1, parts: i };
  return {
    value: he(y),
    content: y
  };
}
function p(e) {
  return e.trim().replace(/^[@#]+/, "").trim();
}
function xe(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e) {
    if (r.refId <= 0)
      continue;
    const n = r.trigger || "@", o = p(r.label);
    if (!o)
      continue;
    const s = `${n}${o}`;
    t.has(s) || t.set(s, { ...r, mention: s });
  }
  return [...t.values()].sort(
    (r, n) => n.mention.length - r.mention.length
  );
}
function ve(e, t, r) {
  let n;
  for (const o of r) {
    const s = e.indexOf(o.mention, t);
    s < 0 || (!n || s < n.index || s === n.index && o.mention.length > n.target.mention.length) && (n = { index: s, target: o });
  }
  return n;
}
function v(e, t) {
  if (!t)
    return;
  const r = e[e.length - 1];
  if (r?.type === "text") {
    r.text += t;
    return;
  }
  e.push({ type: "text", text: t });
}
function V(e, t = H) {
  const r = [], n = /* @__PURE__ */ new Set();
  for (const o of e) {
    if (o.refId <= 0 || !p(o.label))
      continue;
    const s = t(o);
    n.has(s) || (n.add(s), r.push(o));
  }
  return r;
}
function be(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e) {
    const n = p(r.label);
    if (r.refId <= 0 || !n)
      continue;
    const o = `${r.trigger || "@"}${n}`, s = I(r), i = t.get(o);
    if (!i) {
      t.set(o, {
        target: r,
        targetKey: s,
        ambiguous: !1
      });
      continue;
    }
    i.targetKey !== s && (i.ambiguous = !0);
  }
  return [...t.values()].filter((r) => !r.ambiguous).map((r) => r.target);
}
function I(e) {
  return `${H(e)}:${e.usage || ""}:${e.purpose || ""}`;
}
function H(e) {
  const t = e.originID ? `${e.refType}:${e.refId}:${e.origin || ""}:${e.originID}` : `${e.refType}:${e.refId}`;
  return e.contentSelection ? `${t}:${e.versionId || 0}:${w(e.contentSelection)}` : t;
}
function R(e) {
  return `${String(e.originID || "")}:${Number(e.refId || 0)}`;
}
function q(e, t) {
  e.push({
    type: "reference",
    ref_type: t.refType,
    ref_id: t.refId,
    label: p(t.label),
    usage: t.usage,
    purpose: t.purpose,
    ref_trigger: t.trigger || "@",
    ref_version_id: t.versionId,
    ref_origin: t.origin,
    ref_origin_id: t.originID,
    ref_media_url: t.mediaURL,
    ref_media_index: t.mediaIndex,
    ref_media_count: t.mediaCount,
    ref_media_items: t.mediaItems,
    ref_media_excluded: t.mediaExcluded,
    ref_content_selection: t.contentSelection
  });
}
function Q(e, t, r) {
  q(e, t), Re(e, r);
}
function Re(e, t) {
  t?.type === "text" && /^\s/.test(t.text) || v(e, " ");
}
export {
  p as a,
  Me as b,
  Le as c,
  De as d,
  Ue as e,
  je as f,
  Ae as g,
  J as h,
  Ne as i,
  he as j,
  ye as k,
  $e as l,
  Oe as n,
  we as p,
  Ce as r,
  K as s,
  Te as w
};
