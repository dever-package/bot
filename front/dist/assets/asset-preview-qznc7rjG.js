import { a as g, j as s, F as $n } from "./react-D9GkiX5b.js";
import { b as bt, a as k, d as q, u as zn, q as Fn, S as Bn } from "./file-kind-D6bMOzYN.js";
import { b7 as jn, r as v, j as Un, b8 as Vn, c as he, n as ge, J as Gn, d as vn, X as Hn, af as Yn, a7 as _e, ae as H, q as Kn, b as jt, aJ as Jn, aG as Wn, b9 as qn, ba as Xn, _ as Zn } from "./vendor-icons-fVDtJt66.js";
import { V as be, r as Qn, R as tr, a as er, M as te } from "./media-inspector-gallery-DtgvXWvq.js";
import { c as nr } from "./preloadable-CT3tMmBD.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./asset-preview-CdPA4RIK.css", import.meta.url).href]);
function rr(t) {
  if (typeof t != "string")
    return t;
  const e = t.trim();
  if (!Ut(e))
    return t;
  try {
    return JSON.parse(e);
  } catch {
    return t;
  }
}
function w(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function So(t) {
  return w(t) ? t : {};
}
function N(t) {
  return typeof t == "string" ? t.trim() : "";
}
function No(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) ? e : 0;
}
function Q(t) {
  if (t == null || t === "")
    return;
  const e = Number(t);
  return Number.isFinite(e) ? e : void 0;
}
function we(t) {
  const e = String(t || "").trim(), n = ir(e), r = ur(n);
  for (const i of Ne([e, n, r])) {
    const o = rr(i);
    if (o !== i)
      return o;
    const a = ar(i);
    if (a !== i)
      return a;
  }
  return t;
}
function Ao(t) {
  const e = String(t || "").trim();
  for (const n of Se(e)) {
    const r = we(n);
    if (r !== n)
      return r;
  }
  return t;
}
function X(t) {
  const e = [];
  for (const n of Se(
    String(t || "").trim()
  )) {
    const r = we(n);
    r !== n && e.push(r);
  }
  return e;
}
function ir(t) {
  let e = "", n = !1, r = !1;
  for (const i of t) {
    if (r) {
      e += i, r = !1;
      continue;
    }
    if (i === "\\") {
      e += i, r = n;
      continue;
    }
    if (i === '"') {
      n = !n, e += i;
      continue;
    }
    if (n && i.charCodeAt(0) < 32) {
      e += cr(i);
      continue;
    }
    e += i;
  }
  return e;
}
function Se(t) {
  const e = [t];
  for (const n of t.matchAll(/```(?:json|storyboard)?\s*([\s\S]*?)```/gi))
    e.push(String(n[1] || "").trim());
  return e.push(...or(t)), Ne(e);
}
function or(t) {
  const e = [];
  for (let n = 0; n < t.length; n += 1) {
    const r = t[n];
    if (r !== "{" && r !== "[")
      continue;
    const i = sr(t, n);
    i && (e.push(i), n += i.length - 1);
  }
  return e;
}
function sr(t, e) {
  const n = [];
  let r = !1, i = !1;
  for (let o = e; o < t.length; o += 1) {
    const a = t[o];
    if (i) {
      i = !1;
      continue;
    }
    if (r && a === "\\") {
      i = !0;
      continue;
    }
    if (a === '"') {
      r = !r;
      continue;
    }
    if (r)
      continue;
    if (a === "{" || a === "[") {
      n.push(a);
      continue;
    }
    if (a !== "}" && a !== "]")
      continue;
    const c = a === "}" ? "{" : "[";
    if (n.pop() !== c)
      return "";
    if (n.length === 0)
      return t.slice(e, o + 1).trim();
  }
  return "";
}
function Ut(t) {
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function ar(t) {
  if (!t.startsWith('"') || !t.endsWith('"'))
    return t;
  try {
    const e = JSON.parse(t);
    return typeof e == "string" ? e : t;
  } catch {
    return t;
  }
}
function cr(t) {
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
function ur(t) {
  const e = t.trim();
  return !e.includes('\\"') || !e.startsWith("{") && !e.startsWith("[") ? t : e.replace(/\\"/g, '"');
}
function Ne(t) {
  const e = /* @__PURE__ */ new Set();
  return t.filter((n) => {
    const r = String(n || "").trim();
    return !r || e.has(r) ? !1 : (e.add(r), !0);
  });
}
function xo(...t) {
  return t.find(
    (e) => e != null
  );
}
function Io(t) {
  try {
    return JSON.stringify(t);
  } catch {
    return "";
  }
}
await window.DeverFront?.ensureCompat?.(["@/components/media/first-frame-video"]);
const Ct = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!Ct || Object.keys(Ct).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const dr = Ct.FirstFrameVideo, lr = 56;
function ee(t, e) {
  const n = t.getBoundingClientRect(), r = Math.min(
    lr,
    n.height * 0.25
  );
  return e >= n.bottom - r;
}
function fr({
  src: t,
  poster: e = "",
  alt: n = "",
  className: r,
  style: i,
  title: o,
  draggable: a = !1,
  ariaLabel: c,
  onLoad: u,
  onError: l,
  onMediaSize: y,
  objectFit: d = "cover",
  allowDragFromVideo: f = !1,
  playButtonOnly: p = !1
}) {
  const _ = bt(null), [b, m] = k(""), [A, M] = k(""), [x, h] = k(""), [D, C] = k(""), [I, xt] = k(""), B = b === t, E = A === t, Z = x === t, Rn = D !== t && I !== t, Dn = p || !E && !B, En = !p && B && !E, Pn = p ? { bottom: 12, right: 12 } : {
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)"
  };
  q(() => {
    const S = _.current;
    if (!S || !f || p) return;
    const P = (U) => {
      ee(S, U.clientY) && U.stopPropagation();
    }, j = (U) => {
      const Qt = U.touches[0];
      Qt && ee(S, Qt.clientY) && U.stopPropagation();
    };
    return S.addEventListener("mousedown", P), S.addEventListener("touchstart", j, {
      passive: !0
    }), () => {
      S.removeEventListener("mousedown", P), S.removeEventListener("touchstart", j);
    };
  }, [f, p]);
  function It(S) {
    S.stopPropagation();
  }
  function Zt() {
    m((S) => S === t ? "" : S), M((S) => S === t ? "" : S), h((S) => S === t ? "" : S);
  }
  function Ln(S) {
    S.preventDefault(), S.stopPropagation();
    const P = _.current;
    if (P) {
      if (Z) {
        h((j) => j === t ? "" : j), P.pause();
        return;
      }
      m(t), h(t), E || M(""), P.play().catch(() => {
        Zt(), l?.();
      });
    }
  }
  return /* @__PURE__ */ g(
    "div",
    {
      className: [
        "relative isolate block h-full w-full overflow-hidden bg-muted",
        r
      ].filter(Boolean).join(" "),
      style: i,
      title: o,
      draggable: a,
      children: [
        /* @__PURE__ */ s(
          dr,
          {
            videoRef: _,
            src: t,
            poster: e || void 0,
            controls: B && !p,
            playsInline: !0,
            preload: "none",
            draggable: a,
            "aria-hidden": E ? void 0 : !0,
            className: [
              f ? "" : "nodrag",
              "nopan nowheel absolute inset-0 block h-full w-full",
              E ? "opacity-100" : "pointer-events-none opacity-0"
            ].join(" "),
            style: { objectFit: d },
            onPointerDown: p || f ? void 0 : It,
            onClick: p ? void 0 : It,
            onLoadedMetadata: (S) => y?.(
              S.currentTarget.videoWidth,
              S.currentTarget.videoHeight
            ),
            onPlaying: () => {
              M(t), h(t);
            },
            onPause: () => h((S) => S === t ? "" : S),
            onEnded: () => h((S) => S === t ? "" : S),
            onError: () => {
              Zt(), l?.();
            }
          }
        ),
        E ? null : /* @__PURE__ */ s(
          be,
          {
            src: t,
            poster: e,
            alt: n,
            className: "pointer-events-none absolute inset-0 z-[1] block h-full w-full",
            style: { objectFit: d },
            draggable: a,
            ariaHidden: !0,
            onLoad: () => {
              C(t), u?.();
            },
            onError: () => {
              xt(t), l?.();
            },
            onMediaSize: y
          }
        ),
        Dn ? /* @__PURE__ */ s(
          "button",
          {
            type: "button",
            className: "nodrag nopan nowheel absolute z-[2] inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/65 p-0 text-white shadow-lg backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80",
            style: Pn,
            "aria-label": Z ? "暂停视频" : c ? `播放${c}` : "播放视频",
            "aria-pressed": Z,
            onPointerDown: It,
            onClick: Ln,
            children: Z ? /* @__PURE__ */ s(jn, { size: 16, className: "fill-current", "aria-hidden": "true" }) : Rn && !E ? /* @__PURE__ */ s(
              v,
              {
                size: 16,
                className: "animate-spin",
                "aria-hidden": "true"
              }
            ) : /* @__PURE__ */ s(
              Un,
              {
                size: 16,
                className: "translate-x-px fill-current",
                "aria-hidden": "true"
              }
            )
          }
        ) : En ? /* @__PURE__ */ s(
          "span",
          {
            className: "pointer-events-none absolute left-1/2 top-1/2 z-[2] inline-flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/65 text-white shadow-lg backdrop-blur-sm",
            role: "status",
            "aria-label": "正在加载视频",
            children: /* @__PURE__ */ s(v, { size: 16, className: "animate-spin", "aria-hidden": "true" })
          }
        ) : null
      ]
    }
  );
}
const mr = {
  audio: "editorMediaAudio",
  image: "editorMediaImage",
  mediaAudio: "editorMediaAudio",
  mediaImage: "editorMediaImage",
  mediaVideo: "editorMediaVideo",
  video: "editorMediaVideo"
}, Ae = [
  "rich",
  "value",
  "doc",
  "document",
  "content",
  "data",
  "output",
  "result",
  "body"
];
function Mo(t) {
  const e = xe(t);
  return e.length > 120 ? `${e.slice(0, 120)}...` : e;
}
function xe(t) {
  return et(t).replace(/\s+/g, " ").trim();
}
function pr(t) {
  if (typeof t != "string")
    return "";
  const e = t.trim();
  if (!_r(e))
    return "";
  const n = e.search(/"rich"\s*:/), r = n >= 0 ? e.slice(n) : e, i = [], o = /"text"\s*:\s*"((?:\\.|[^"\\])*)"/g;
  let a = null;
  for (; (a = o.exec(r)) !== null; ) {
    const c = br(a[1]).trim();
    c && i.push(c);
  }
  return i.join(" ").replace(/\s+/g, " ").trim();
}
function Vt(t) {
  const e = V(t, /* @__PURE__ */ new Set());
  return Gt(e) ? e : null;
}
function ko(t) {
  try {
    return xe(t);
  } catch {
    return "";
  }
}
function Co(t) {
  try {
    return Vt(t);
  } catch {
    return null;
  }
}
function et(t) {
  if (typeof t == "string") {
    const r = t.trim();
    if (Ut(r)) {
      const i = Ce(r);
      if (i !== void 0)
        return et(i).trim();
    }
    return pr(r) || t;
  }
  if (Array.isArray(t))
    return t.map(et).filter(Boolean).join(" ");
  if (!w(t))
    return "";
  const e = Vt(t);
  if (e)
    return ke(e);
  const n = [
    typeof t.text == "string" ? t.text : "",
    typeof t.markdown == "string" ? t.markdown : ""
  ];
  for (const r of Ae)
    t[r] != null && n.push(et(t[r]));
  return n.filter(Boolean).join(" ");
}
function V(t, e) {
  if (typeof t == "string") {
    const r = t.trim();
    if (!Ut(r))
      return null;
    const i = Ce(r);
    return i === void 0 ? null : V(i, e);
  }
  if (Array.isArray(t)) {
    const r = ne({ type: "doc", content: t });
    if (Gt(r))
      return r;
    for (const i of t) {
      const o = V(i, e);
      if (o)
        return o;
    }
    return null;
  }
  if (!w(t) || e.has(t))
    return null;
  e.add(t);
  const n = ne(t);
  if (n)
    return n;
  if (String(t.format || "").toLowerCase() === "rich_json" && t.rich != null) {
    const r = V(t.rich, e);
    if (r)
      return r;
  }
  for (const r of Ae) {
    if (t[r] == null)
      continue;
    const i = V(t[r], e);
    if (i)
      return i;
  }
  return null;
}
function ne(t) {
  return !w(t) || Me(t.type) !== "doc" ? null : {
    type: "doc",
    attrs: w(t.attrs) ? t.attrs : void 0,
    content: Ie(t.content)
  };
}
function Ie(t) {
  return Array.isArray(t) ? t.map(yr).filter((e) => !!e) : [];
}
function yr(t) {
  if (!w(t))
    return null;
  const e = Me(t.type) || hr(t);
  if (!e)
    return null;
  const n = { type: e }, r = w(t.attrs) ? { ...t.attrs } : {};
  if (e === "heading" && dt(r.level) <= 0) {
    const a = dt(t.level);
    a > 0 && (r.level = a);
  }
  Object.keys(r).length > 0 && (n.attrs = r);
  const i = gr(t.marks);
  if (i.length > 0 && (n.marks = i), e === "text") {
    const a = $(t.text);
    return a ? (n.text = a, n) : null;
  }
  const o = Ie(t.content);
  return o.length > 0 && (n.content = o), n;
}
function hr(t) {
  if (typeof t.text == "string")
    return "text";
  const e = w(t.attrs) ? t.attrs : {};
  return dt(e.level) > 0 || dt(t.level) > 0 ? "heading" : "";
}
function gr(t) {
  return Array.isArray(t) ? t.map((e) => {
    if (!w(e))
      return null;
    const n = $(e.type);
    return n ? {
      type: n,
      attrs: w(e.attrs) ? e.attrs : void 0
    } : null;
  }).filter(
    (e) => !!e
  ) : [];
}
function Me(t) {
  const e = $(t);
  return mr[e] || e;
}
function ke(t) {
  return t ? t.type === "text" ? t.text || "" : t.type === "editorMediaImage" || t.type === "editorMediaVideo" || t.type === "editorMediaAudio" ? $(t.attrs?.alt || t.attrs?.title || t.attrs?.src) : (t.content || []).map(ke).filter(Boolean).join(" ") : "";
}
function Gt(t) {
  return t ? t.type === "text" ? !!$(t.text) : t.type === "editorMediaImage" || t.type === "editorMediaVideo" || t.type === "editorMediaAudio" ? !!$(t.attrs?.src) : (t.content || []).some(Gt) : !1;
}
function Ce(t) {
  try {
    return JSON.parse(t);
  } catch {
    return;
  }
}
function _r(t) {
  return t.includes("rich_json") || t.includes('"rich"') || t.includes("agent_run_id") || t.includes("node_run_id");
}
function br(t) {
  try {
    return JSON.parse(`"${t}"`);
  } catch {
    return t.replace(/\\"/g, '"').replace(/\\n/g, `
`).replace(/\\t/g, "	").replace(/\\\\/g, "\\");
  }
}
function dt(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) ? e : 0;
}
function $(t) {
  return t == null ? "" : String(t).trim();
}
function vt(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  for (const i of t) {
    if (!w(i))
      continue;
    const o = Y(i.asset_id ?? i.assetId), a = Re(i.kind), c = Tt(i.purpose);
    if (!o || !a || !c || r.has(o))
      continue;
    let u = String(i.key || "").trim() || Ot(o);
    if (n.has(u) && (u = Ot(o)), n.has(u))
      continue;
    const l = Y(i.version_id ?? i.versionId), y = String(i.label || "").trim() || `参考素材 ${e.length + 1}`;
    e.push({
      key: u,
      asset_id: o,
      ...l ? { version_id: l } : {},
      label: y,
      kind: a,
      purpose: c
    }), n.add(u), r.add(o);
  }
  return e;
}
function Oo(t, e, n, r, i, o) {
  const a = new Map(
    vt(e).map((d) => [
      d.asset_id,
      d
    ])
  ), c = new Map(
    n.flatMap((d) => {
      const f = Y(d.refId);
      return f ? [[f, d]] : [];
    })
  ), u = [], l = (t?.parts || []).map((d) => ({ ...d })), y = /* @__PURE__ */ new Set();
  for (const [d, f] of (t?.parts || []).entries()) {
    if (f.type !== "reference" || f.ref_type !== "asset")
      continue;
    const p = Y(f.ref_id);
    if (!p || y.has(p))
      continue;
    const _ = a.get(p), b = c.get(p), m = Re(b?.kind) || _?.kind;
    if (!m)
      continue;
    const A = Y(b?.versionID || f.ref_version_id), M = String(b?.title || f.label || _?.label || "").trim() || `参考素材 ${u.length + 1}`, x = Oe(
      m,
      i,
      o
    ), h = Tt(f.purpose), D = Tt(
      _?.purpose
    ), C = [h, D].find(
      (xt) => x.some((B) => B.value === xt)
    ) || Sr(m, i, o), I = l[d];
    I?.type === "reference" && (I.purpose = C || void 0), u.push({
      key: _?.key || Ot(p),
      asset_id: p,
      ...A ? { version_id: A } : {},
      label: M,
      kind: m,
      purpose: C
    }), y.add(p);
  }
  return {
    content: t ? { ...t, parts: l } : void 0,
    references: u
  };
}
function To(t, e) {
  return e.filter(
    (n) => n.work_types.length === 0 || n.work_types.includes(t)
  ).map((n) => ({
    key: n.key,
    label: n.name,
    acceptedKinds: [...n.media_kinds]
  }));
}
function Oe(t, e, n) {
  return n.filter(
    (r) => r.media_kinds.includes(t) && (r.work_types.length === 0 || r.work_types.includes(e))
  ).map((r) => ({ value: r.key, label: r.name }));
}
function Te(t, e) {
  return e.find((n) => n.key === t);
}
function wr(t, e) {
  return Te(t, e)?.name || t;
}
function Ro(t, e, n, r) {
  const i = n.find((a) => a.key === e);
  if (!i || r.length === 0)
    return "分镜作品类型或参考用途配置无效";
  const o = /* @__PURE__ */ new Map();
  for (const a of t) {
    const c = Te(
      a.purpose,
      r
    );
    if (!c)
      return `参考素材“${a.label}”的用途无效`;
    if (!c.media_kinds.includes(a.kind))
      return `参考素材“${a.label}”的类型不支持用途“${c.name}”`;
    if (c.work_types.length > 0 && !c.work_types.includes(e))
      return `当前作品类型不支持“${a.label}”的用途“${c.name}”`;
    const u = (o.get(a.purpose) || 0) + 1;
    if (o.set(a.purpose, u), c.max_count > 0 && u > c.max_count)
      return `用途“${c.name}”最多只能选择 ${c.max_count} 个素材`;
  }
  for (const a of i.required_reference_purposes)
    if (!o.get(a))
      return `${i.name}必须添加“${wr(
        a,
        r
      )}”`;
  return "";
}
function Ot(t) {
  return `ref-${t}`;
}
function Tt(t) {
  const e = String(t || "").trim();
  return e || void 0;
}
function Sr(t, e, n) {
  const r = Oe(t, e, n);
  return n.find(
    (o) => o.default_media_kinds.includes(t) && (o.work_types.length === 0 || o.work_types.includes(e))
  )?.key || r[0]?.value || "";
}
function Re(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "image" || e === "video" || e === "audio" ? e : void 0;
}
function Y(t) {
  const e = Number(t || 0);
  return Number.isInteger(e) && e > 0 ? e : 0;
}
function Nr(t) {
  return typeof t == "string" && t.length > 0 && t.trim() === t;
}
const Ar = "素材库", xr = [
  { key: "project", label: "创作" },
  { key: "tool", label: "工具" },
  { key: "dialogue", label: "对话" },
  { key: "upload", label: "上传" },
  { key: "import", label: "导入" },
  { key: "official", label: Ar }
], Ir = [
  { key: "work", label: "作品" },
  { key: "material", label: "素材" }
], Mr = [
  { key: "collection", label: "集合" },
  { key: "text", label: "文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "richtext", label: "富文本" },
  { key: "file", label: "文件" }
];
function Do(t, e = {}) {
  const n = e.fallback || "资产", r = Ht(xr, t, n);
  return e[t] || r;
}
function Eo(t) {
  return Ht(Ir, t, "素材");
}
function De(t) {
  return Ht(Mr, t, "资产");
}
function Po(t) {
  if (t.length === 0 || t.some((r) => ["text", "richtext", "file"].includes(r)))
    return;
  const e = {
    image: "image/*",
    audio: "audio/*",
    video: "video/*"
  }, n = t.map((r) => e[r]).filter((r) => !!r);
  return n.length > 0 ? Array.from(new Set(n)).join(",") : void 0;
}
function Lo(t, e) {
  return t && (e.length === 0 || e.some((n) => ["richtext", "video"].includes(n)));
}
function $o(t) {
  return t.id <= 0 ? !1 : t.libraryType === "material" ? t.version?.content != null : t.versionID > 0;
}
function Ht(t, e, n) {
  return t.find((r) => r.key === e)?.label || n;
}
const lt = [
  { value: "auto", label: "自动", columns: 0, rows: 0, capacity: 9 },
  { value: "2x2", label: "2×2", columns: 2, rows: 2, capacity: 4 },
  { value: "3x2", label: "3×2", columns: 3, rows: 2, capacity: 6 },
  { value: "3x3", label: "3×3", columns: 3, rows: 3, capacity: 9 }
], kr = new Set(
  lt.map((t) => t.value)
);
function Yt(t) {
  const e = String(t || "").trim().toLowerCase();
  return kr.has(e) ? e : "auto";
}
function Ee(t) {
  const e = Yt(t);
  return lt.find((n) => n.value === e) || lt[0];
}
function Cr(t, e) {
  const n = Ee(t), r = Math.max(0, Math.trunc(Number(e) || 0));
  return n.value !== "auto" ? n : r === 0 || r > 6 ? { columns: 3, rows: 3, capacity: 9 } : r > 4 ? { columns: 3, rows: 2, capacity: 6 } : r > 2 ? { columns: 2, rows: 2, capacity: 4 } : { columns: 2, rows: 1, capacity: 2 };
}
function Or(t) {
  const e = Math.max(0, Math.trunc(Number(t) || 0));
  return e <= 1 ? { columns: 1, rows: 1, capacity: 1 } : e === 2 ? { columns: 2, rows: 1, capacity: 2 } : { columns: 2, rows: 2, capacity: 4 };
}
function Tr(t, e) {
  const n = Math.max(0, Math.trunc(Number(e) || 0) - 1);
  return Math.min(
    n,
    Math.max(0, Math.trunc(Number(t) || 0))
  );
}
const Rr = 50, Pe = 5, Le = [
  "first_frame",
  "last_frame",
  "first_last",
  "references",
  "none"
], ft = "first_frame", zo = {
  first_frame: "首帧",
  last_frame: "尾帧",
  first_last: "首尾帧",
  references: "参考图组",
  none: "无参考图"
};
function $e(t) {
  const e = Number(t);
  return Number.isInteger(e) && e > 0 ? e : void 0;
}
function Fo(t) {
  return ($e(t) || 0) >= Pe;
}
function Bo(t, e) {
  const n = $e(t);
  return e ? Math.max(n || 0, Pe) : n;
}
function ze(t) {
  return t === "start" || t === "end" ? t : void 0;
}
function Dr(t) {
  return ze(t) || "start";
}
function jo(t) {
  return Dr(t) === "end" ? "lastFrame" : "firstFrame";
}
function Er(t) {
  return Pr(t) || ft;
}
function Pr(t) {
  return Le.includes(t) ? t : void 0;
}
function Lr(t) {
  switch (t) {
    case "first_frame":
      return [{ frameRole: "start", mediaIndex: 1 }];
    case "last_frame":
      return [{ frameRole: "end", mediaIndex: 1 }];
    case "first_last":
      return jr();
    default:
      return [];
  }
}
function z(t) {
  const e = Er(t.shot_image_mode), n = !!t.continue_previous, r = !!t.match_previous, i = Fr(
    e,
    r,
    n
  );
  let o = i;
  return n && i === "first_frame" && (o = "none"), {
    mode: i,
    nodeMode: o,
    frameMediaItems: Lr(o),
    referenceMode: i === "references" ? "references" : i === "none" ? "" : "frames"
  };
}
function Fe(t) {
  const e = t.map((n) => {
    const r = z(n);
    return !mt(n) && (r.mode === "first_last" || r.mode === "last_frame") ? z({ ...n, shot_image_mode: "first_frame" }) : r;
  });
  for (let n = e.length - 1; n > 0; n -= 1) {
    const r = t[n], i = e[n];
    Br(r, i) && $r(t, e, n - 1);
  }
  return e;
}
function mt(t) {
  const e = t.continuity_state && typeof t.continuity_state == "object" && !Array.isArray(t.continuity_state) ? t.continuity_state : {}, n = L(e.entry), r = L(e.exit);
  return !!n && !!r && n !== r || zr(t.camera_instruction);
}
function $r(t, e, n) {
  for (let r = n; r >= 0; r -= 1) {
    if (nt(e[r].frameMediaItems, "end"))
      return;
    const i = t[r], o = mt(i);
    if (e[r].nodeMode === "first_frame" && !i.continue_previous && !o)
      return;
    if (!(i.continue_previous && !o)) {
      e[r] = z({
        ...i,
        shot_image_mode: o ? i.continue_previous ? "last_frame" : "first_last" : "first_frame"
      });
      return;
    }
  }
}
function zr(t) {
  const e = L(t).toLowerCase().replace(/\s+/g, "");
  return [
    "推近",
    "推进",
    "推远",
    "拉近",
    "拉远",
    "横移",
    "纵移",
    "平移",
    "跟拍",
    "跟随",
    "摇镜",
    "摇摄",
    "环绕",
    "变焦",
    "升起",
    "上升",
    "下降",
    "上移",
    "下移",
    "旋转",
    "甩镜",
    "手持晃动",
    "向前移动",
    "向后移动",
    "dolly",
    "pushin",
    "pullout",
    "pan",
    "tilt",
    "zoom",
    "tracking",
    "orbit",
    "crane"
  ].some((n) => e.includes(n));
}
function L(t) {
  return typeof t == "string" ? t.trim() : "";
}
function Uo(t) {
  return Le.filter(
    (e) => z({ ...t, shot_image_mode: e }).mode === e
  );
}
function Fr(t, e, n) {
  return n && t === "first_last" ? "last_frame" : t === "last_frame" && !n || n && (t === "references" || t === "none") || e && t === "none" ? ft : t;
}
function Br(t, e) {
  return !!t.match_previous || !!t.continue_previous && e.nodeMode === "last_frame";
}
function jr() {
  return [
    { frameRole: "start", mediaIndex: 1 },
    { frameRole: "end", mediaIndex: 2 }
  ];
}
function Vo(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  for (const i of t) {
    if (!i || typeof i != "object" || Array.isArray(i))
      continue;
    const o = i, a = ze(o.frameRole ?? o.frame_role), c = Number(o.mediaIndex ?? o.media_index);
    !a || !Number.isInteger(c) || c <= 0 || n.has(a) || r.has(c) || (n.add(a), r.add(c), e.push({ frameRole: a, mediaIndex: c }));
  }
  return e.sort((i, o) => i.mediaIndex - o.mediaIndex);
}
function Go(t) {
  return Array.isArray(t) ? t.map((e) => {
    if (!e || typeof e != "object" || Array.isArray(e))
      return;
    const n = e, r = L(n.prompt);
    if (!r)
      return;
    const i = L(n.title);
    return {
      title: i || "画面",
      description: L(n.description) || i || r,
      prompt: r
    };
  }).filter(
    (e) => !!e
  ) : [];
}
function nt(t, e) {
  return t?.find((n) => n.frameRole === e)?.mediaIndex || 0;
}
function vo(t, e, n) {
  const r = t[e], i = Ur(t, e, n);
  if (!r || !i)
    return {
      anchorID: "",
      anchorFrameRole: "",
      anchorShotIndex: -1,
      materialIDs: pt(r?.material_ids),
      referenceKeys: pt(r?.reference_keys),
      includeGlobalReferences: !0
    };
  const o = t[i.shotIndex];
  return {
    anchorID: i.id,
    anchorFrameRole: i.frameRole,
    anchorShotIndex: i.shotIndex,
    materialIDs: re(
      r.material_ids,
      o?.material_ids
    ),
    referenceKeys: re(
      r.reference_keys,
      o?.reference_keys
    ),
    includeGlobalReferences: !1
  };
}
function Ur(t, e, n) {
  const r = t[e];
  if (!r)
    return;
  const i = Fe(t);
  if (n === "end" && !r.continue_previous)
    return nt(i[e]?.frameMediaItems, "start") ? { id: r.id, shotIndex: e, frameRole: "start" } : void 0;
  if (!(n === "start" && !r.match_previous && !r.continue_previous || e <= 0))
    for (let o = e - 1; o >= 0; o -= 1) {
      const a = i[o];
      if (nt(a?.frameMediaItems, "end"))
        return {
          id: t[o].id,
          shotIndex: o,
          frameRole: "end"
        };
      if (nt(a?.frameMediaItems, "start") && !mt(t[o]))
        return {
          id: t[o].id,
          shotIndex: o,
          frameRole: "start"
        };
      if (!t[o].continue_previous || mt(t[o]))
        return;
    }
}
function re(t, e) {
  const n = new Set(pt(e));
  return pt(t).filter(
    (r) => !n.has(r)
  );
}
function pt(t) {
  return [
    ...new Set((t || []).map((e) => e.trim()).filter(Boolean))
  ];
}
const Be = 4, Rt = /* @__PURE__ */ new Set([2, 3, 4, 5]);
function wt(t) {
  if (t == null || String(t).trim() === "")
    return Be;
  const e = Number(t);
  if (!Number.isInteger(e) || !Rt.has(e))
    throw new Error("最短镜头时长必须是 2 到 5 秒");
  return e;
}
function Ho(t) {
  if (!(t == null || String(t).trim() === ""))
    try {
      return wt(t);
    } catch {
      return;
    }
}
function Yo(t) {
  if (!Array.isArray(t))
    return [];
  const e = /* @__PURE__ */ new Set(), n = t.map((r) => {
    const i = w(r) ? r : {}, o = wt(i.seconds), a = Number(i.sort);
    if (e.has(o) || !Number.isInteger(a))
      throw new Error("分镜最短时长注册信息无效");
    return e.add(o), {
      seconds: o,
      name: String(i.name || "").trim() || `${o} 秒`,
      sort: a
    };
  });
  if (n.length !== Rt.size || [...Rt].some(
    (r) => !e.has(r)
  ))
    throw new Error("分镜最短时长注册信息无效");
  return n.sort((r, i) => r.sort - i.sort);
}
function Ko(t) {
  const e = [
    wt(t.min_shot_duration),
    ...t.shots.map((n) => Number(n.duration))
  ];
  return [...new Set(e.filter(Ue))].sort(
    (n, r) => n - r
  );
}
function Jo(t, e) {
  const n = je(
    e
  );
  return n.length === 0 ? t : t.filter((r) => {
    const i = new Set(
      (r.supported_options?.duration || []).map(
        (o) => String(o).trim()
      )
    );
    return n.every((o) => i.has(String(o)));
  });
}
function Wo(t) {
  const e = je(
    t
  );
  return e.length > 0 ? `没有同时支持 ${e.join("、")} 秒的可用视频模型` : "";
}
function je(t) {
  const e = Array.isArray(t) ? t : [];
  return [
    ...new Set(e.map(Number).filter(Ue))
  ].sort((n, r) => n - r);
}
function Ue(t) {
  return Number.isInteger(t) && t >= 2;
}
const Vr = {
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
}, Gr = [
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
function Kt(t) {
  return Object.fromEntries(
    t.map((e) => [e, /* @__PURE__ */ new Map()])
  );
}
function yt(t, e, n = {}) {
  const r = {
    media: t,
    enabledKinds: Object.keys(t),
    seen: n.seen || /* @__PURE__ */ new Set(),
    requestedKind: n.kind
  };
  O(e, r, 0, n.kind);
}
function vr(t, e) {
  const r = Kt(e === "audio" ? ["audio", "image"] : [e]);
  return yt(r, t, { kind: e }), Ve(r), Array.from(r[e].values());
}
function Ve(t) {
  const e = t.audio, n = t.image;
  if (!e || !n || e.size === 0 || e.size !== n.size)
    return;
  const r = Array.from(n.values());
  Array.from(e.values()).forEach((i, o) => {
    if (i.thumbnail)
      return;
    const a = Ge(
      "audio",
      i.url,
      r[o]?.url || ""
    );
    a && e.set(i.url, { ...i, thumbnail: a });
  });
}
function O(t, e, n, r, i = "") {
  if (t == null || n > 12)
    return;
  if (Array.isArray(t)) {
    const y = t.length > 1 ? "" : i;
    t.forEach(
      (d) => O(
        d,
        e,
        n + 1,
        r,
        y
      )
    );
    return;
  }
  if (typeof t == "string") {
    const y = X(t);
    if (y.length > 0) {
      y.forEach(
        (f) => O(
          f,
          e,
          n + 1,
          r,
          i
        )
      );
      return;
    }
    const d = r || e.requestedKind || Jr(t);
    d && e.media[d] && ve(t) && Hr(
      e.media,
      d,
      t.trim(),
      i
    );
    return;
  }
  if (typeof t != "object" || e.seen.has(t))
    return;
  e.seen.add(t);
  const o = t, a = w(o.attrs) ? o.attrs : void 0, c = Kr(
    o.type,
    o.kind,
    o.media_type,
    o.mediaType,
    o.mime
  ), u = Yr(
    o,
    a,
    i
  ), l = r || e.requestedKind;
  if (l && e.media[l] && (!c || c === l))
    for (const y of ie(o, l))
      O(
        y,
        e,
        n + 1,
        l,
        u
      );
  for (const y of e.enabledKinds) {
    const d = Vr[y];
    for (const f of d.direct)
      O(
        o[f],
        e,
        n + 1,
        y,
        u
      );
    for (const f of d.collections)
      O(
        o[f],
        e,
        n + 1,
        y,
        u
      );
  }
  if (c && e.media[c]) {
    for (const y of ie(o, c))
      O(
        y,
        e,
        n + 1,
        c,
        u
      );
    O(
      o.attrs,
      e,
      n + 1,
      c,
      u
    );
  }
  for (const y of Gr)
    O(
      o[y],
      e,
      n + 1
    );
}
function ie(t, e) {
  const n = [
    t.url,
    t.src,
    t.file_url,
    t.fileUrl,
    t.download_url,
    t.downloadUrl
  ];
  return e === "file" && n.push(t.download, t.open_url, t.openUrl, t.path), n;
}
function Hr(t, e, n, r) {
  const i = t[e];
  if (!i)
    return;
  const o = Ge(
    e,
    n,
    r
  ), a = i.get(n);
  if (a?.thumbnail || !o) {
    a || i.set(n, { url: n });
    return;
  }
  i.set(n, { url: n, thumbnail: o });
}
function Ge(t, e, n) {
  const r = n.trim();
  return !r || t !== "image" && r === e.trim() ? "" : r;
}
function Yr(t, e, n) {
  for (const r of [
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
    e?.thumbnail,
    e?.thumbnail_url,
    e?.thumbnailUrl,
    e?.poster,
    e?.cover,
    n
  ])
    if (typeof r == "string" && ve(r))
      return r.trim();
  return "";
}
function Kr(...t) {
  for (const e of t) {
    const n = String(e || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
    if (["image", "mediaimage", "editormediaimage"].includes(n) || n.startsWith("image/"))
      return "image";
    if (["video", "mediavideo", "editormediavideo"].includes(n) || n.startsWith("video/"))
      return "video";
    if (["audio", "music", "voice", "mediaaudio", "editormediaaudio"].includes(
      n
    ) || n.startsWith("audio/"))
      return "audio";
    if (["file", "mediafile", "editormediafile"].includes(n) || n.startsWith("application/") || n.startsWith("text/"))
      return "file";
  }
}
function Jr(t) {
  const e = t.trim();
  if (/^data:image\//i.test(e) || /\.(png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i.test(e))
    return "image";
  if (/^data:video\//i.test(e) || /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(e))
    return "video";
  if (/^data:audio\//i.test(e) || /\.(mp3|wav|ogg|m4a|aac)(?:[?#].*)?$/i.test(e))
    return "audio";
}
function ve(t) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(t.trim());
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const Dt = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!Dt || Object.keys(Dt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const Jt = ["image", "video", "audio"], Wr = 64, qr = 128 * 1024, ht = /* @__PURE__ */ Symbol("content-output-cache-miss"), oe = We(), se = We(), Xr = Dt, Zr = Xr.normalizeEnergonOutput;
function T(...t) {
  for (const e of t)
    if (typeof e == "string" && e.trim())
      return e.trim();
  return "";
}
function Qr(t) {
  const e = K(
    t,
    ["lyrics", "lyric", "lrc", "song_lyrics", "songLyrics"],
    /* @__PURE__ */ new Set(),
    0
  );
  if (e)
    return { label: "歌词", text: e };
  const n = K(
    t,
    ["text"],
    /* @__PURE__ */ new Set(),
    0
  );
  return n ? { label: "创作内容", text: n } : null;
}
function K(t, e, n, r) {
  if (t == null || r > 12)
    return "";
  if (typeof t == "string") {
    for (const i of X(t)) {
      const o = K(i, e, n, r + 1);
      if (o)
        return o;
    }
    return "";
  }
  if (Array.isArray(t)) {
    for (const i of t) {
      const o = K(i, e, n, r + 1);
      if (o)
        return o;
    }
    return "";
  }
  if (!w(t) || n.has(t))
    return "";
  n.add(t);
  for (const i of e) {
    const o = rt(t[i], r + 1);
    if (o)
      return o;
  }
  for (const i of [
    "output",
    "result",
    "data",
    "body",
    "value",
    "json",
    "rich",
    "content"
  ]) {
    const o = K(t[i], e, n, r + 1);
    if (o)
      return o;
  }
  return "";
}
function rt(t, e) {
  if (t == null || e > 12)
    return "";
  if (typeof t == "string") {
    const n = t.trim();
    if (!n || /^(https?:\/\/|\/|data:|blob:)/i.test(n))
      return "";
    const r = X(n);
    return r.length > 0 ? r.map((i) => rt(i, e + 1)).filter(Boolean).join(`
`) : n;
  }
  if (Array.isArray(t))
    return t.map((n) => rt(n, e + 1)).filter(Boolean).join(`
`);
  if (!w(t))
    return "";
  for (const n of ["text", "content", "line", "lines", "value"]) {
    const r = rt(t[n], e + 1);
    if (r)
      return r;
  }
  return "";
}
function ti(t) {
  const e = He(t);
  return !e || e.hasMedia ? "" : e.markdown;
}
function He(t) {
  const e = ci(t);
  return !e || !tn(e) ? null : {
    markdown: e.content.map(en).join(`

`).trim(),
    plainText: e.content.map(nn).join(`

`).trim(),
    hasMedia: rn(e)
  };
}
function ei(t) {
  return /(^|\n)\s*(#{1,6}\s|[-*+]\s|>\s|\d+\.\s|```)/m.test(t) || /(\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)]+\)|`[^`]+`)/.test(t);
}
function qo(t) {
  return ni(t).length > 0;
}
function ni(t) {
  const e = Nt(t);
  return Jt.filter((n) => e[n].size > 0);
}
function Ye(t) {
  const e = Nt(t);
  return Jt.reduce(
    (n, r) => n + e[r].size,
    0
  );
}
function Xo(t, e) {
  return Array.from(Nt(t)[e].keys());
}
function Ke(t, e) {
  return Array.from(Nt(t)[e].values());
}
function ri(t) {
  const e = Je(t);
  return e ? Array.from(
    new Set(e.frames.map((n) => n.image.trim()).filter(Boolean))
  ) : [];
}
function Je(t) {
  const e = qe(se, t);
  return e !== ht ? e : Xe(
    se,
    t,
    ot(t, /* @__PURE__ */ new Set(), 0)
  );
}
function ii(t, e) {
  const n = e.trim().toLowerCase();
  return n ? it(t, n, /* @__PURE__ */ new Set(), 0) : !1;
}
function Zo(...t) {
  let e, n, r = 0;
  for (const i of t) {
    if (!St(i))
      continue;
    e === void 0 && (e = i);
    const o = Ye(i);
    o > r && (n = i, r = o);
  }
  return r > 0 ? n : e;
}
function St(t) {
  return t == null || t === "" ? !1 : Array.isArray(t) ? t.length > 0 : typeof t == "object" ? Object.keys(t).length > 0 : !0;
}
function Nt(t) {
  const e = qe(oe, t);
  if (e !== ht)
    return e;
  const n = Kt(Jt), r = ri(t), i = /* @__PURE__ */ new Set();
  for (const o of Qe(t))
    yt(n, o, { seen: i });
  return yt(n, t), Ve(n), r.length > 0 && (n.image = new Map(
    r.map((o) => [o, { url: o, thumbnail: o }])
  )), Xe(oe, t, n);
}
function We() {
  return {
    objects: /* @__PURE__ */ new WeakMap(),
    strings: /* @__PURE__ */ new Map()
  };
}
function qe(t, e) {
  if (e && typeof e == "object")
    return t.objects.has(e) ? t.objects.get(e) : ht;
  if (!Ze(e) || !t.strings.has(e))
    return ht;
  const n = t.strings.get(e);
  return t.strings.delete(e), t.strings.set(e, n), n;
}
function Xe(t, e, n) {
  if (e && typeof e == "object")
    return t.objects.set(e, n), n;
  if (!Ze(e))
    return n;
  for (t.strings.delete(e), t.strings.set(e, n); t.strings.size > Wr; ) {
    const r = t.strings.keys().next().value;
    if (typeof r != "string")
      break;
    t.strings.delete(r);
  }
  return n;
}
function Ze(t) {
  return typeof t == "string" && t.length <= qr;
}
function Qe(t) {
  if (!St(t))
    return [];
  const e = Zr?.(t);
  return Array.isArray(e) && e.length > 0 ? e : Array.isArray(t) ? t : [t];
}
function it(t, e, n, r) {
  return t == null || r > 12 ? !1 : typeof t == "string" ? X(t).some(
    (i) => it(i, e, n, r + 1)
  ) : Array.isArray(t) ? t.some(
    (i) => it(i, e, n, r + 1)
  ) : !w(t) || n.has(t) ? !1 : (n.add(t), String(t.type || "").trim().toLowerCase() === e ? !0 : [
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
    (i) => it(i, e, n, r + 1)
  ));
}
function ot(t, e, n) {
  if (t == null || n > 12)
    return null;
  if (typeof t == "string") {
    const i = t.trim();
    if (!i || !i.startsWith("{") && !i.startsWith("["))
      return null;
    try {
      return ot(JSON.parse(i), e, n + 1);
    } catch {
      return null;
    }
  }
  if (Array.isArray(t)) {
    for (const i of t) {
      const o = ot(i, e, n + 1);
      if (o)
        return o;
    }
    return null;
  }
  if (!w(t) || e.has(t))
    return null;
  e.add(t);
  const r = oi(t);
  if (r)
    return r;
  for (const i of [
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
    const o = ot(t[i], e, n + 1);
    if (o)
      return o;
  }
  return null;
}
function oi(t) {
  if (String(t.type || "").trim().toLowerCase() !== "storyboard_grid" || !Array.isArray(t.frames))
    return null;
  const e = t.frames.map(si).filter((n) => !!n).sort((n, r) => n.order - r.order);
  return e.length < 2 || e.length > Rr ? null : {
    type: "storyboard_grid",
    version: Math.max(1, Math.trunc(Number(t.version) || 1)),
    title: T(t.title, "宫格图片"),
    summary: T(t.summary),
    frames: e
  };
}
function si(t, e) {
  if (!w(t))
    return null;
  const n = Math.max(1, Math.trunc(Number(t.order) || e + 1));
  return {
    id: T(t.id, `frame-${String(n).padStart(2, "0")}`),
    order: n,
    title: T(
      t.title,
      `画面 ${String(n).padStart(2, "0")}`
    ),
    description: T(t.description),
    prompt: T(t.prompt),
    status: T(t.status),
    image: ai(
      t.image,
      t.image_url,
      t.imageUrl
    ),
    error: T(t.error),
    assetID: ae(t.asset_id, t.assetId, t.assetID),
    assetVersionID: ae(
      t.asset_version_id,
      t.assetVersionId,
      t.assetVersionID
    )
  };
}
function ai(...t) {
  for (const e of t) {
    const n = Kt(["image"]);
    yt(n, e, { kind: "image" });
    const r = n.image.values().next().value;
    if (r?.url)
      return r.url;
  }
  return "";
}
function ae(...t) {
  for (const e of t) {
    const n = Math.trunc(Number(e) || 0);
    if (n > 0)
      return n;
  }
  return 0;
}
function ci(t) {
  return w(t) ? t.type === "doc" && Array.isArray(t.content) ? t : w(t.rich) && t.rich.type === "doc" && Array.isArray(t.rich.content) ? t.rich : null : null;
}
function tn(t) {
  return w(t) ? t.type === "text" ? !Array.isArray(t.marks) || t.marks.length === 0 : t.type === "hardBreak" ? !0 : At(t) ? !!on(t) : t.type !== "doc" && t.type !== "paragraph" ? !1 : Array.isArray(t.content) && t.content.every(tn) : !1;
}
function en(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : At(t) ? `![${ui(
    String(t.attrs?.alt || t.attrs?.caption || "图片")
  )}](<${di(on(t))}>)` : Array.isArray(t.content) ? t.content.map(en).join("") : "";
}
function nn(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : At(t) ? "" : Array.isArray(t.content) ? t.content.map(nn).join("") : "";
}
function rn(t) {
  return At(t) || !!t.content?.some((e) => rn(e));
}
function At(t) {
  return ["image", "mediaImage", "editorMediaImage"].includes(
    String(t.type || "")
  );
}
function on(t) {
  return String(t.attrs?.src || "").trim();
}
function ui(t) {
  return t.replace(/([\\\[\]])/g, "\\$1");
}
function di(t) {
  return t.replace(/</g, "%3C").replace(/>/g, "%3E");
}
const Et = 9, sn = 2, li = 50, ce = /* @__PURE__ */ new Set([
  "未命名",
  "未命名分镜",
  "分镜",
  "分镜脚本",
  "暂无内容简介",
  "围绕当前主题展开并完成一个连贯事件"
]), fi = [
  "none",
  "fade",
  "crossfade",
  "fadeblack",
  "fadewhite",
  "wipeleft",
  "wiperight"
], Qo = {
  none: "硬切",
  fade: "淡化",
  crossfade: "交叉溶解",
  fadeblack: "黑场淡化",
  fadewhite: "白场淡化",
  wipeleft: "向左擦除",
  wiperight: "向右擦除"
}, mi = ["photoreal", "stylized"], ts = {
  photoreal: "写实影像",
  stylized: "非写实影像"
}, pi = [
  "16:9",
  "9:16",
  "1:1",
  "4:3",
  "3:4",
  "21:9"
], yi = "16:9", es = {
  character: "角色",
  scene: "场景",
  prop: "道具"
}, hi = [
  "shot_images",
  "final_video",
  "shot_videos",
  "storyboard_only"
], tt = {
  output_target: "shot_images",
  voice_mode: "auto",
  subtitle_mode: "auto",
  lip_sync_mode: "off"
};
function an(t, e) {
  return e > 0 && (t.match_previous || t.continue_previous);
}
const gi = [
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
function _i(t) {
  return G(t, /* @__PURE__ */ new Set(), 0);
}
function ns(t, e) {
  if (!w(t) || !Array.isArray(t.materials))
    return null;
  const n = t.materials.map(gn);
  if (n.some((a) => !a))
    return null;
  const r = n, i = new Set(
    r.map((a) => a.id)
  );
  if (i.size !== r.length)
    return null;
  const o = _n(t.shot, e, i);
  return o ? { shot: o, materials: r } : null;
}
function rs(t) {
  return t.timeline_duration_ms && t.timeline_duration_ms > 0 ? Math.round(t.timeline_duration_ms) / 1e3 : cn(t.shots);
}
function cn(t) {
  return t.reduce(
    (e, n) => e + Math.max(0, Number(n.duration) || 0),
    0
  );
}
function bi(t) {
  return Number.isInteger(t) && t >= sn;
}
function is(t, e) {
  const n = new Map(
    t.materials.map((r) => [r.id, r])
  );
  return e.material_ids.map((r) => n.get(r)).filter((r) => !!r);
}
function os(t) {
  return {
    id: `shot-${t + 1}`,
    order: t + 1,
    duration: Be,
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
    shot_image_mode: ft,
    match_previous: !1,
    continue_previous: !1,
    continuity_anchor: "",
    continuity_state: { entry: "", exit: "" },
    speech: [],
    captions: []
  };
}
function ss(t, e) {
  const n = new Set(t.map((o) => o.id));
  let r = t.filter((o) => o.type === e).length + 1, i = `${e}-${r}`;
  for (; n.has(i); )
    r += 1, i = `${e}-${r}`;
  return {
    id: i,
    type: e,
    name: "",
    prompt: "",
    voice: "",
    reference_keys: []
  };
}
function as(t, e) {
  const n = [], r = [];
  for (const i of t.shots) {
    i.material_ids.includes(e) && n.push(i.id);
    for (const o of i.speech)
      o.character_id === e && r.push(o.id);
  }
  return { shotIds: n, speechIds: r };
}
function cs(t, e = "dialogue") {
  const n = new Set(t.speech.map((o) => o.id));
  let r = t.speech.length + 1, i = `${t.id}-speech-${r}`;
  for (; n.has(i); )
    r += 1, i = `${t.id}-speech-${r}`;
  return {
    id: i,
    kind: e,
    text: "",
    start_time: 0,
    subtitle_enabled: !0,
    subtitle_text: "",
    ...e === "dialogue" ? { character_id: "", speaker_mode: "offscreen" } : {}
  };
}
function us(t) {
  const e = new Set(t.captions.map((i) => i.id));
  let n = t.captions.length + 1, r = `${t.id}-caption-${n}`;
  for (; e.has(r); )
    n += 1, r = `${t.id}-caption-${n}`;
  return {
    id: r,
    type: "caption",
    text: "",
    start_time: 0,
    end_time: Math.min(t.duration, 2)
  };
}
function wi(t) {
  const e = wn(t.workflow), n = vt(t.references), r = new Set(n.map((c) => c.key)), i = new Set(
    t.materials.map((c) => c.id)
  ), o = t.shots.map((c, u) => {
    const l = u > 0 ? yn(c.transition_type) : "none", y = Math.round(
      Number(c.transition_duration_ms)
    ), d = u > 0 && !!c.continue_previous, f = u > 0 && !d && !!c.match_previous;
    return {
      ...c,
      id: c.id || `shot-${u + 1}`,
      order: u + 1,
      transition: u > 0 ? c.transition.trim() : "",
      transition_type: l,
      transition_duration_ms: l !== "none" ? Math.min(
        5e3,
        Math.max(
          100,
          Number.isFinite(y) ? y : 100
        )
      ) : 0,
      material_ids: J(c.material_ids).filter(
        (p) => i.has(p)
      ),
      reference_keys: J(c.reference_keys).filter(
        (p) => r.has(p)
      ),
      shot_image_mode: z({
        ...c,
        match_previous: f,
        continue_previous: d
      }).mode,
      match_previous: f,
      continue_previous: d,
      continuity_anchor: d ? c.continuity_anchor.trim() : "",
      continuity_state: un(
        c.continuity_state
      ),
      lyric_line_indexes: bn(
        c.lyric_line_indexes
      )
    };
  });
  o.forEach((c, u) => {
    an(c, u) && (c.continuity_state.entry = o[u - 1].continuity_state.exit);
  });
  const a = Fe(o);
  return o.forEach((c, u) => {
    c.shot_image_mode = a[u].mode;
  }), {
    ...t,
    version: Et,
    workflow: e,
    production_plan: Wt(
      t.production_plan,
      t.work_type
    ),
    target_duration: cn(o),
    target_shot_count: o.length,
    lyrics_lrc: t.work_type === "mv" ? String(t.lyrics_lrc || "") : "",
    narrator_voice: t.narrator_voice.trim(),
    aspect_ratio: pn(t.aspect_ratio),
    references: n,
    materials: t.materials.map((c) => ({
      ...c,
      voice: c.type === "character" ? c.voice.trim() : "",
      reference_keys: J(c.reference_keys).filter(
        (u) => r.has(u)
      )
    })),
    shots: o
  };
}
function un(t) {
  const e = w(t) ? t : {};
  return {
    entry: N(e.entry).trim(),
    exit: N(e.exit).trim()
  };
}
function ds(t, e) {
  const n = /* @__PURE__ */ new Map();
  return t.shots.forEach((r, i) => {
    i > 0 && n.set(r.id, t.shots[i - 1].id);
  }), {
    ...e,
    shots: e.shots.map((r, i) => {
      const o = i > 0 ? e.shots[i - 1].id : "", a = i === 0 || n.get(r.id) !== o;
      return {
        ...r,
        transition: a ? "" : r.transition,
        transition_type: a ? "none" : r.transition_type,
        transition_duration_ms: a ? 0 : r.transition_duration_ms,
        match_previous: !a && !r.continue_previous ? r.match_previous : !1,
        continue_previous: !a && !!r.continue_previous,
        continuity_anchor: !a && r.continue_previous ? r.continuity_anchor : ""
      };
    })
  };
}
function ls(t) {
  return t.workflow.status === "confirmed";
}
function Wt(t, e) {
  const n = w(t) ? t : {}, r = N(n.output_target).toLowerCase(), i = {
    output_target: hi.includes(
      r
    ) ? r : tt.output_target,
    voice_mode: Mt(
      n.voice_mode,
      tt.voice_mode
    ),
    subtitle_mode: Mt(
      n.subtitle_mode,
      tt.subtitle_mode
    ),
    lip_sync_mode: Mt(
      n.lip_sync_mode,
      tt.lip_sync_mode
    ),
    shot_visual_strategy: "auto"
  };
  return e === "mv" ? {
    ...i,
    voice_mode: "off",
    subtitle_mode: "off",
    lip_sync_mode: "off"
  } : i;
}
function fs(t, e) {
  return {
    ...Wt(
      t.production_plan,
      t.work_type
    ),
    output_target: "final_video",
    lip_sync_mode: t.work_type !== "mv" && e && t.shots.some(mn) ? "auto" : "off"
  };
}
function ms(t) {
  return t.production_plan.output_target !== "storyboard_only";
}
function dn(t) {
  return ["shot_videos", "final_video"].includes(
    t.production_plan.output_target
  );
}
function ps(t) {
  return t.production_plan.output_target === "final_video";
}
function ln(t) {
  return t.work_type === "mv";
}
function Si(t) {
  return !ln(t) && dn(t) && t.production_plan.voice_mode === "auto" && Ni(t) > 0;
}
function ys(t) {
  return !ln(t) && dn(t) && t.production_plan.subtitle_mode === "auto" && Ai(t) > 0;
}
function hs(t) {
  return Si(t) && t.production_plan.lip_sync_mode === "auto" && t.shots.some(mn);
}
function Ni(t) {
  return t.shots.reduce(
    (e, n) => e + n.speech.filter($i).length,
    0
  );
}
function Ai(t) {
  return t.shots.reduce(
    (e, n) => e + xi(n).length,
    0
  );
}
function xi(t) {
  const e = t.speech.filter((r) => r.subtitle_enabled && !!r.text.trim()).map((r) => ({
    id: `subtitle-${r.id}`,
    text: r.subtitle_text.trim() || r.text.trim(),
    start_time: r.start_time,
    speech_id: r.id,
    source: "speech"
  })), n = t.captions.filter((r) => !!r.text.trim()).map((r) => ({
    id: r.id,
    text: r.text.trim(),
    start_time: r.start_time,
    end_time: r.end_time,
    source: "caption"
  }));
  return [...e, ...n].sort(
    (r, i) => r.start_time - i.start_time
  );
}
function fn(t) {
  return t.kind === "dialogue" && t.speaker_mode === "visible" && !!t.text.trim();
}
function mn(t) {
  return t.speech.some(fn);
}
function gs(t) {
  return new Set(
    t.speech.filter(fn).map((e) => e.character_id?.trim()).filter((e) => !!e)
  );
}
function _s(t) {
  return `${t.title.trim() || "分镜脚本"} · ${t.shots.length} 个镜头`;
}
function bs(t) {
  return t.summary.trim() || hn("", t.shots);
}
function ws(t, e) {
  return { ...t, style_prompt: e };
}
function pn(t) {
  const e = N(t);
  return pi.includes(e) ? e : yi;
}
function yn(t) {
  const e = N(t);
  return fi.includes(e) ? e : "none";
}
function G(t, e, n) {
  if (t == null || n > 10)
    return null;
  if (typeof t == "string") {
    for (const a of X(t)) {
      const c = G(a, e, n + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object" || e.has(t))
    return null;
  if (e.add(t), Array.isArray(t)) {
    for (const a of t) {
      const c = G(a, e, n + 1);
      if (c)
        return c;
    }
    return null;
  }
  const r = t, i = Ii(r);
  if (i)
    return i;
  const o = Ei(r);
  if (o) {
    const a = G(o, e, n + 1);
    if (a)
      return a;
  }
  for (const a of gi) {
    const c = r[a];
    if (c == null || c === t)
      continue;
    const u = G(c, e, n + 1);
    if (u)
      return u;
  }
  return null;
}
function Ii(t) {
  const e = N(t.visual_mode).toLowerCase(), n = ki(t.work_type);
  let r;
  try {
    r = wt(t.min_shot_duration);
  } catch {
    return null;
  }
  if (N(t.type).toLowerCase() !== "storyboard" || R(t.version) !== Et || typeof t.title != "string" || typeof t.narrator_voice != "string" || typeof t.style_prompt != "string" || !Ti(e) || !n || !Array.isArray(t.references) || !Array.isArray(t.materials) || !Array.isArray(t.shots))
    return null;
  const i = w(t.workflow) && t.workflow.status === "draft", o = Ci(t.storyline);
  if (!o)
    return null;
  const a = vt(t.references);
  if (a.length !== t.references.length)
    return null;
  const c = t.materials.map(gn);
  if (c.some((x) => !x))
    return null;
  const u = c, l = /* @__PURE__ */ new Set();
  for (const x of u) {
    if (l.has(x.id))
      return null;
    l.add(x.id);
  }
  const y = /* @__PURE__ */ new Set(), d = t.shots.map(
    (x, h) => _n(x, h, l, i)
  );
  if (d.some((x) => !x))
    return null;
  const f = d;
  for (const [x, h] of f.entries()) {
    if (y.has(h.id) || !i && an(h, x) && h.continuity_state.entry !== f[x - 1].continuity_state.exit)
      return null;
    y.add(h.id);
  }
  const p = R(t.target_duration), _ = R(t.target_shot_count);
  if (p == null || !Number.isInteger(p) || p < sn || _ == null || !Number.isInteger(_) || _ < 1 || _ > li)
    return null;
  const b = Mi(t, n);
  if (b === null)
    return null;
  const m = wn(t.workflow), A = hn(
    N(t.summary),
    f
  ), M = {
    ...t,
    type: "storyboard",
    version: Et,
    work_type: n,
    workflow: m,
    production_plan: Wt(
      t.production_plan,
      n
    ),
    title: Oi(t.title, A, f),
    summary: A,
    target_duration: p,
    target_shot_count: _,
    min_shot_duration: r,
    ...b,
    lyrics_lrc: n === "mv" ? N(t.lyrics_lrc) : "",
    narrator_voice: t.narrator_voice.trim(),
    storyline: o,
    style_prompt: t.style_prompt,
    visual_mode: e,
    aspect_ratio: pn(t.aspect_ratio),
    references: a,
    materials: u,
    shots: f
  };
  return wi(M);
}
function Mi(t, e) {
  if ([
    t.storyboard_range_start_ms,
    t.storyboard_range_end_ms,
    t.storyboard_soundtrack_duration_ms,
    t.timeline_duration_ms
  ].every((c) => c == null || c === ""))
    return {};
  const r = Q(t.storyboard_range_start_ms), i = Q(t.storyboard_range_end_ms), o = Q(
    t.storyboard_soundtrack_duration_ms
  ), a = Q(t.timeline_duration_ms);
  return e !== "mv" || r == null || i == null || o == null || a == null || ![r, i, o, a].every(
    Number.isInteger
  ) || r < 0 || i <= r || i > o || a !== i - r ? null : {
    storyboard_range_start_ms: r,
    storyboard_range_end_ms: i,
    storyboard_soundtrack_duration_ms: o,
    timeline_duration_ms: a
  };
}
function ki(t) {
  const e = N(t).toLowerCase();
  return e ? Nr(e) ? e : null : "short";
}
function Ci(t) {
  if (!w(t))
    return null;
  const e = N(t.setup), n = N(t.development), r = N(t.payoff);
  return { setup: e, development: n, payoff: r };
}
function hn(t, e) {
  const n = t.trim();
  if (n)
    return n;
  const r = e.map((i) => i.description.trim()).filter(Boolean);
  return r.length > 0 ? r.join("；") : "暂无内容简介";
}
function Oi(t, e, n) {
  const r = t.trim();
  if (r && !ce.has(r))
    return r;
  const i = [e, n[0]?.beat, n[0]?.description].map((a) => String(a || "").trim()).find((a) => a && !ce.has(a));
  if (!i)
    return "分镜脚本";
  const o = i.split(/[\r\n。！？!?；;]/, 1)[0].trim();
  return Array.from(o).slice(0, 24).join("") || "分镜脚本";
}
function Ti(t) {
  return mi.includes(t);
}
function gn(t) {
  if (!w(t))
    return null;
  const e = N(t.type).toLowerCase();
  return !Pi(e) || typeof t.id != "string" || !t.id.trim() || typeof t.name != "string" || typeof t.prompt != "string" || typeof t.voice != "string" || !Array.isArray(t.reference_keys) ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    name: t.name.trim().replace(/^[@#]+/, ""),
    prompt: t.prompt.trim(),
    voice: e === "character" ? t.voice.trim() : "",
    reference_keys: J(t.reference_keys.map(N))
  };
}
function _n(t, e, n, r = !1) {
  if (!w(t) || typeof t.id != "string" || !t.id.trim() || typeof t.beat != "string" || !r && !t.beat.trim() || typeof t.transition != "string" || typeof t.transition_type != "string" || typeof t.match_previous != "boolean" || typeof t.description != "string" || t.spatial_layout != null && typeof t.spatial_layout != "string" || t.start_framing != null && typeof t.start_framing != "string" || t.end_framing != null && typeof t.end_framing != "string" || typeof t.camera_instruction != "string" || typeof t.video_prompt != "string" || typeof t.continue_previous != "boolean" || typeof t.continuity_anchor != "string" || !w(t.continuity_state) || typeof t.continuity_state.entry != "string" || typeof t.continuity_state.exit != "string" || !Array.isArray(t.material_ids) || !Array.isArray(t.reference_keys) || !Array.isArray(t.speech) || !Array.isArray(t.captions))
    return null;
  const i = R(t.duration);
  if (i == null || !bi(i))
    return null;
  const o = t.material_ids.map(N);
  if (o.some((m) => !m || !n.has(m)) || new Set(o).size !== o.length)
    return null;
  const a = t.speech.map(Ri);
  if (a.some((m) => !m))
    return null;
  const c = t.captions.map(Di);
  if (c.some(
    (m) => !m || m.end_time > i
  ))
    return null;
  const u = e > 0 && t.continue_previous;
  if (e === 0 && (t.match_previous || t.continue_previous) || t.match_previous && t.continue_previous)
    return null;
  const l = e > 0 && !u && t.match_previous, y = z({
    shot_image_mode: t.shot_image_mode,
    match_previous: l,
    continue_previous: u
  }).mode, d = t.transition.trim();
  if (!r && e > 0 && !d)
    return null;
  const f = t.continuity_anchor.trim();
  if (!r && u && !f)
    return null;
  const p = un(
    t.continuity_state
  );
  if (!r && (!p.entry || !p.exit))
    return null;
  const _ = yn(
    t.transition_type
  ), b = R(t.transition_duration_ms);
  return _ !== t.transition_type || b == null || !Number.isInteger(b) || b < 0 || b > 5e3 || e === 0 && (_ !== "none" || b !== 0) || e > 0 && _ === "none" && b !== 0 || e > 0 && _ !== "none" && b < 100 ? null : {
    ...t,
    id: t.id.trim(),
    order: e + 1,
    duration: i,
    beat: t.beat.trim(),
    transition: e > 0 ? d : "",
    transition_type: e > 0 ? _ : "none",
    transition_duration_ms: e > 0 && _ !== "none" ? b : 0,
    description: t.description,
    spatial_layout: N(t.spatial_layout),
    start_framing: N(t.start_framing),
    end_framing: N(t.end_framing),
    camera_instruction: t.camera_instruction,
    video_prompt: t.video_prompt,
    material_ids: o,
    reference_keys: J(t.reference_keys.map(N)),
    shot_image_mode: y,
    match_previous: l,
    continue_previous: u,
    continuity_anchor: u ? f : "",
    continuity_state: p,
    lyric_line_indexes: bn(
      t.lyric_line_indexes
    ),
    speech: a,
    captions: c
  };
}
function bn(t) {
  return Array.isArray(t) ? [
    ...new Set(
      t.map(Number).filter((e) => Number.isInteger(e) && e > 0)
    )
  ].sort((e, n) => e - n) : [];
}
function Ri(t) {
  if (!w(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string" || typeof t.subtitle_enabled != "boolean" || typeof t.subtitle_text != "string")
    return null;
  const e = N(t.kind).toLowerCase(), n = R(t.start_time);
  if (e !== "dialogue" && e !== "narration" || n == null || n < 0)
    return null;
  if (e === "narration") {
    const i = {
      ...t,
      id: t.id.trim(),
      kind: e,
      text: t.text,
      start_time: n,
      subtitle_enabled: t.subtitle_enabled,
      subtitle_text: t.subtitle_text
    };
    return delete i.character_id, delete i.speaker_mode, i;
  }
  const r = N(t.speaker_mode).toLowerCase();
  return typeof t.character_id != "string" || r !== "visible" && r !== "offscreen" ? null : {
    ...t,
    id: t.id.trim(),
    kind: e,
    text: t.text,
    start_time: n,
    character_id: t.character_id.trim(),
    speaker_mode: r,
    subtitle_enabled: t.subtitle_enabled,
    subtitle_text: t.subtitle_text
  };
}
function Di(t) {
  if (!w(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string")
    return null;
  const e = N(t.type).toLowerCase(), n = R(t.start_time), r = R(t.end_time);
  return !Li(e) || n == null || r == null || n < 0 || r <= n ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    text: t.text,
    start_time: n,
    end_time: r
  };
}
function wn(t) {
  const e = w(t) ? t : {}, n = N(e.status).toLowerCase() === "confirmed" ? "confirmed" : "draft";
  return {
    status: n,
    confirmed_at: n === "confirmed" ? N(e.confirmed_at) : ""
  };
}
function Mt(t, e) {
  const n = N(t).toLowerCase();
  return n === "auto" || n === "off" ? n : e;
}
function Ei(t) {
  const e = ti(t);
  if (e)
    return e;
  if (!w(t))
    return "";
  const n = t.type === "doc" ? t : w(t.rich) && t.rich.type === "doc" ? t.rich : null;
  return n ? Sn(n).trim() : "";
}
function Sn(t) {
  if (!w(t))
    return "";
  if (t.type === "text")
    return N(t.text);
  if (t.type === "hardBreak")
    return `
`;
  if (!Array.isArray(t.content))
    return "";
  const e = t.type === "doc" || t.type === "paragraph" || t.type === "codeBlock" ? `
` : "";
  return t.content.map(Sn).join(e);
}
function Pi(t) {
  return t === "character" || t === "scene" || t === "prop";
}
function Li(t) {
  return t === "caption" || t === "title" || t === "highlight";
}
function $i(t) {
  return t.text.trim().length > 0;
}
function J(t) {
  return [...new Set(t.map((e) => e.trim()).filter(Boolean))];
}
function R(t) {
  const e = typeof t == "number" ? t : Number.NaN;
  return Number.isFinite(e) ? e : null;
}
await window.DeverFront?.ensureCompat?.(["@/page/nodes/show/tooltip"]);
const Pt = window.DeverFront?.sdk?.getCompatModule("@/page/nodes/show/tooltip");
if (!Pt || Object.keys(Pt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/page/nodes/show/tooltip");
const zi = Pt.HoverTip, Fi = 12e3;
function gt({
  label: t,
  side: e = "top",
  sideOffset: n = 7,
  className: r = "",
  children: i
}) {
  return /* @__PURE__ */ s(
    zi,
    {
      content: t,
      side: e,
      sideOffset: n,
      layerZIndex: Fi,
      className: `max-w-80 whitespace-normal break-words ${r}`.trim(),
      children: i
    }
  );
}
const Nn = {
  image: "images",
  audio: "audios",
  video: "videos",
  file: "files"
};
function An(t, e) {
  const n = Nn[t], r = n ? qt(e, t) : [];
  if (n && r.length > 0)
    return { [n]: r };
  const i = Vt(e);
  if (!i)
    return e;
  const o = He(i);
  return o && (t === "text" || ei(o.plainText)) ? { text: o.markdown } : { rich: i };
}
function Bi(t, e) {
  return qt(t, e)[0] || "";
}
function qt(t, e) {
  return xn(t, e).map((n) => n.url);
}
function xn(t, e) {
  return ji(e) ? vr(t, e) : [];
}
function Ss(t, e) {
  if (!Nn[e])
    return 0;
  const n = qt(t, e).length;
  if (!t || typeof t != "object" || Array.isArray(t))
    return n;
  const r = Number(
    t.media_count || 0
  );
  return Math.max(
    n,
    Number.isFinite(r) ? Math.trunc(r) : 0
  );
}
function ji(t) {
  return t === "image" || t === "video" || t === "audio" || t === "file";
}
function _t(t, e = 0) {
  if (e > 8 || t == null) return "";
  if (typeof t == "string") return In(t) ? "" : t.trim();
  if (Array.isArray(t))
    return t.map((r) => _t(r, e + 1)).filter(Boolean)[0] || "";
  if (typeof t != "object") return "";
  const n = t;
  for (const r of [
    "summary",
    "title",
    "text",
    "caption",
    "content",
    "output",
    "result"
  ]) {
    const i = _t(n[r], e + 1);
    if (i) return i;
  }
  return "";
}
function Ns(t) {
  const e = t?.source?.prompt;
  return typeof e == "string" ? e.trim() : "";
}
function Ui(t) {
  const e = Bi(t, "file"), n = st(t) || Qn(e), r = n.match(/\.([a-z0-9]{1,10})$/i)?.[1] || "";
  return { url: e, name: n, extension: r };
}
function st(t, e = 0) {
  if (t == null || e > 8) return "";
  if (typeof t == "string") {
    const r = t.trim();
    return In(r) ? "" : r;
  }
  if (Array.isArray(t)) {
    for (const r of t) {
      const i = st(r, e + 1);
      if (i) return i;
    }
    return "";
  }
  if (typeof t != "object") return "";
  const n = t;
  for (const r of [
    "name",
    "file_name",
    "fileName",
    "filename",
    "label",
    "title"
  ]) {
    const i = st(n[r], e + 1);
    if (i) return i;
  }
  for (const r of [
    "file",
    "files",
    "attrs",
    "data",
    "content",
    "output",
    "result"
  ]) {
    const i = st(n[r], e + 1);
    if (i) return i;
  }
  return "";
}
function In(t) {
  return /^(https?:\/\/|\/|data:|blob:)/.test(t.trim());
}
const Vi = [
  "title",
  "text",
  "reasoning",
  "progress",
  "error",
  "json"
], Gi = /* @__PURE__ */ new Set([
  "audio",
  "editormediaaudio",
  "editormediaembed",
  "editormediaexternal",
  "editormediaimage",
  "editormediavideo",
  "externalmedia",
  "image",
  "mediaaudio",
  "mediaembed",
  "mediaexternal",
  "mediaimage",
  "mediavideo",
  "video"
]), vi = /* @__PURE__ */ new Set([
  "agentabilityplaceholder",
  "agenttaskplaceholder",
  "horizontalrule"
]);
function Hi({
  items: t,
  mediaCount: e,
  previewMediaURL: n,
  outputMediaURLs: r = []
}) {
  if (t.length > 1 || e > 1)
    return !0;
  const i = e === 1 && W(n) !== "" && r.length === 1 && W(r[0]) === W(n);
  return t.some(
    (o) => Yi(o, i)
  );
}
function Yi(t, e) {
  return Lt(t) ? Vi.some((n) => ct(t[n])) ? !0 : ct(t.rich) ? !e || at(t.rich, /* @__PURE__ */ new Set(), 0) : !1 : ct(t);
}
function at(t, e, n) {
  if (t == null || t === "")
    return !1;
  if (n > 32)
    return !0;
  if (typeof t == "string") {
    const i = t.trim();
    if (!i)
      return !1;
    try {
      return at(
        JSON.parse(i),
        e,
        n + 1
      );
    } catch {
      return !0;
    }
  }
  if (Array.isArray(t))
    return t.some(
      (i) => at(i, e, n + 1)
    );
  if (!Lt(t) || e.has(t))
    return !0;
  e.add(t);
  const r = Ki(t.type);
  if (r === "text")
    return W(t.text) !== "";
  if (Gi.has(r)) {
    const i = Lt(t.attrs) ? t.attrs : void 0;
    return ct(i?.caption);
  }
  return vi.has(r) ? !0 : Array.isArray(t.content) ? t.content.some(
    (i) => at(i, e, n + 1)
  ) : !1;
}
function ct(t) {
  return t == null ? !1 : typeof t == "string" ? t.trim() !== "" : Array.isArray(t) ? t.length > 0 : typeof t == "object" ? Object.keys(t).length > 0 : !0;
}
function Lt(t) {
  return t != null && typeof t == "object" && !Array.isArray(t);
}
function Ki(t) {
  return W(t).toLowerCase().replace(/[\s_-]+/g, "");
}
function W(t) {
  return typeof t == "string" ? t.trim() : "";
}
function As(t, e) {
  if (Wi(t, e))
    return !1;
  const n = Ye(t), r = Qe(t), i = Mn(e);
  return Hi({
    items: r,
    mediaCount: n,
    previewMediaURL: i?.url,
    outputMediaURLs: i ? Ke(t, i.kind).map(
      (o) => o.url
    ) : []
  });
}
function Ji(t, e) {
  if (!e)
    return null;
  const n = Ke(t, e);
  return n.length > 1 ? { kind: e, items: n } : null;
}
function xs(t) {
  return Mn(t)?.kind;
}
function Mn(t) {
  if (t?.videoUrl)
    return { kind: "video", url: t.videoUrl };
  if (t?.imageUrl)
    return { kind: "image", url: t.imageUrl };
  if (t?.audioUrl)
    return { kind: "audio", url: t.audioUrl };
}
function Wi(t, e) {
  const n = $t(t, /* @__PURE__ */ new Set(), 0);
  return !n || !e ? !1 : [
    e.imageUrl,
    e.videoUrl,
    e.audioUrl,
    e.fileUrl
  ].some((r) => String(r || "").trim() === n);
}
function $t(t, e, n) {
  if (t == null || n > 12)
    return "";
  if (typeof t == "string")
    return t.trim();
  if (Array.isArray(t))
    return t.length === 1 ? $t(t[0], e, n + 1) : "";
  if (typeof t != "object" || e.has(t))
    return "";
  e.add(t);
  const i = Object.entries(t).filter(
    ([o, a]) => !["type", "kind", "format", "version"].includes(o) && St(a)
  ).map(([, o]) => o);
  return i.length === 1 ? $t(i[0], e, n + 1) : "";
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const zt = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!zt || Object.keys(zt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const ue = zt, de = ue.ContentView || ue.EnergonContentView;
function Xt({
  output: t,
  fallback: e = "",
  streaming: n = !1,
  emptyText: r = "暂无内容",
  className: i,
  markdownClassName: o,
  richClassName: a,
  mediaLayout: c = "default"
}) {
  const u = kn(t, e);
  return de ? /* @__PURE__ */ s(ut, { className: i, children: /* @__PURE__ */ s(
    de,
    {
      output: u,
      streaming: n,
      emptyText: r,
      markdownClassName: o,
      richClassName: a,
      mediaLayout: c
    }
  ) }) : e ? /* @__PURE__ */ s("div", { className: i, children: e }) : null;
}
function kn(t, e = "") {
  return St(t) ? t : e ? { text: e } : t;
}
function ut({
  className: t,
  children: e
}) {
  const n = (r) => {
    qi(r.target) && r.stopPropagation();
  };
  return /* @__PURE__ */ s(
    "div",
    {
      className: t,
      onPointerDown: n,
      onClick: n,
      children: e
    }
  );
}
function qi(t) {
  return t instanceof Element && !!t.closest(
    "a, button, input, textarea, select, audio, video, [role='button']"
  );
}
function Cn(t, e) {
  const n = Cr(e, t), r = Math.max(1, Math.ceil(t / n.capacity)), [i, o] = k(0), a = Tr(i, r);
  return {
    shape: n,
    pageCount: r,
    pageIndex: a,
    pageOffset: a * n.capacity,
    setPageIndex: o
  };
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/dropdown-menu", "@/components/energon/content-view"]);
const F = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dropdown-menu");
if (!F || Object.keys(F).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dropdown-menu");
const Xi = F.DropdownMenu, Zi = F.DropdownMenuContent, Qi = F.DropdownMenuItem, to = F.DropdownMenuTrigger, Ft = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!Ft || Object.keys(Ft).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const eo = Ft.EnergonAudioPlayer, no = {
  image: "图片",
  video: "视频",
  audio: "音频"
}, ro = {
  image: "张",
  video: "个",
  audio: "个"
};
function On({
  layout: t,
  countLabel: e,
  pageIndex: n,
  pageCount: r,
  disabled: i = !1,
  leading: o,
  actions: a,
  onLayoutChange: c,
  onPageChange: u
}) {
  const l = Yt(t), y = Ee(l);
  return /* @__PURE__ */ g("header", { className: "ws-media-grid-toolbar", children: [
    /* @__PURE__ */ g("div", { className: "ws-media-grid-toolbar-main", children: [
      o,
      /* @__PURE__ */ g(Xi, { modal: !1, children: [
        /* @__PURE__ */ s(to, { asChild: !0, children: /* @__PURE__ */ g(
          "button",
          {
            type: "button",
            className: "ws-media-grid-layout-trigger nodrag nopan",
            disabled: i || !c,
            "aria-label": "选择每页宫格布局",
            onClick: (d) => d.stopPropagation(),
            children: [
              /* @__PURE__ */ s(Vn, { size: 14 }),
              y.label,
              /* @__PURE__ */ s(he, { size: 12 })
            ]
          }
        ) }),
        /* @__PURE__ */ s(
          Zi,
          {
            align: "start",
            className: "ws-media-grid-layout-menu",
            onClick: (d) => d.stopPropagation(),
            children: lt.map((d) => /* @__PURE__ */ g(
              Qi,
              {
                className: "ws-media-grid-layout-item",
                onSelect: () => {
                  u(0), c?.(d.value);
                },
                children: [
                  /* @__PURE__ */ s("span", { children: d.label }),
                  /* @__PURE__ */ s("small", { children: d.value === "auto" ? "按结果排版" : `每页 ${d.capacity} 格` }),
                  d.value === l ? /* @__PURE__ */ s(ge, { size: 13 }) : null
                ]
              },
              d.value
            ))
          }
        )
      ] }),
      /* @__PURE__ */ s("span", { className: "ws-media-grid-count", children: e }),
      r > 1 ? /* @__PURE__ */ g("div", { className: "ws-media-grid-page-controls", "aria-label": "宫格分页", children: [
        /* @__PURE__ */ s(
          "button",
          {
            type: "button",
            className: "nodrag nopan",
            disabled: n <= 0,
            title: "上一页",
            "aria-label": "上一页",
            onClick: (d) => {
              d.stopPropagation(), u(Math.max(0, n - 1));
            },
            children: /* @__PURE__ */ s(Gn, { size: 14 })
          }
        ),
        /* @__PURE__ */ g("span", { children: [
          n + 1,
          "/",
          r
        ] }),
        /* @__PURE__ */ s(
          "button",
          {
            type: "button",
            className: "nodrag nopan",
            disabled: n >= r - 1,
            title: "下一页",
            "aria-label": "下一页",
            onClick: (d) => {
              d.stopPropagation(), u(Math.min(r - 1, n + 1));
            },
            children: /* @__PURE__ */ s(vn, { size: 14 })
          }
        )
      ] }) : null
    ] }),
    a ? /* @__PURE__ */ s("div", { className: "ws-media-grid-toolbar-actions", children: a }) : null
  ] });
}
function io({
  kind: t,
  items: e,
  label: n,
  compact: r = !1
}) {
  const [i, o] = k("auto"), a = Cn(e.length, i), c = r ? Or(e.length) : a.shape, u = r ? 0 : a.pageOffset, l = e.slice(u, u + c.capacity), y = Array.from(
    { length: c.capacity },
    (p, _) => l[_]
  ), d = no[t], f = ro[t];
  return /* @__PURE__ */ g(
    "section",
    {
      className: `ws-media-grid-view is-${t}${r ? " is-compact" : ""}`,
      children: [
        r ? /* @__PURE__ */ s(
          "span",
          {
            className: "ws-media-grid-compact-count",
            "aria-label": `共 ${e.length} ${f}`,
            children: e.length > c.capacity ? `共${e.length}${f}` : `${e.length}${f}`
          }
        ) : /* @__PURE__ */ s(
          On,
          {
            layout: i,
            countLabel: `${e.length} ${f}`,
            pageIndex: a.pageIndex,
            pageCount: a.pageCount,
            onLayoutChange: o,
            onPageChange: a.setPageIndex
          }
        ),
        /* @__PURE__ */ s("div", { className: "ws-media-grid-body nowheel", children: /* @__PURE__ */ s(
          "div",
          {
            className: "ws-media-grid-list",
            style: {
              gridTemplateColumns: `repeat(${c.columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${c.rows}, minmax(0, 1fr))`
            },
            children: y.map((p, _) => {
              const b = u + _, m = `${n || d} ${b + 1}`;
              return p ? /* @__PURE__ */ s(
                "figure",
                {
                  className: t === "audio" ? "is-audio" : void 0,
                  "aria-label": t === "audio" ? m : void 0,
                  children: /* @__PURE__ */ s(oo, { kind: t, item: p, label: m })
                },
                `${p.url}-${b}`
              ) : /* @__PURE__ */ s("figure", { className: "is-empty" }, `empty-${b}`);
            })
          }
        ) })
      ]
    }
  );
}
function oo({
  kind: t,
  item: e,
  label: n
}) {
  const { url: r } = e;
  return t === "image" ? /* @__PURE__ */ s(
    "img",
    {
      src: r,
      alt: n,
      loading: "lazy",
      decoding: "async",
      draggable: !1
    }
  ) : t === "video" ? /* @__PURE__ */ s(
    fr,
    {
      src: r,
      poster: e.thumbnail,
      draggable: !1,
      ariaLabel: n,
      objectFit: "cover"
    },
    r
  ) : /* @__PURE__ */ g(
    "div",
    {
      className: `ws-media-grid-audio-card${e.thumbnail ? " has-cover" : ""}`,
      children: [
        e.thumbnail ? /* @__PURE__ */ s("img", { src: e.thumbnail, alt: "", loading: "lazy", decoding: "async" }) : null,
        /* @__PURE__ */ s(
          eo,
          {
            src: r,
            preload: "none",
            className: "ws-media-grid-audio-player nodrag nopan"
          }
        )
      ]
    }
  );
}
function so(t) {
  if (!t) return !1;
  const e = document.querySelectorAll('[data-slot="dialog-layer"]');
  return e.item(e.length - 1)?.contains(t) || !1;
}
const Is = 10040;
function ao({
  ariaLabel: t,
  header: e,
  children: n,
  onRequestClose: r,
  onEscape: i,
  layer: o = "default"
}) {
  const a = bt(null);
  q(() => {
    const u = (l) => {
      l.key !== "Escape" || l.defaultPrevented || !so(a.current) || (l.preventDefault(), l.stopImmediatePropagation(), (i || r)());
    };
    return window.addEventListener("keydown", u), () => window.removeEventListener("keydown", u);
  }, [i, r]);
  const c = /* @__PURE__ */ s(
    "div",
    {
      ref: a,
      className: `wb-detail-backdrop ${o === "nested" ? "is-nested" : ""}`.trim(),
      "data-slot": "dialog-layer",
      role: "presentation",
      onMouseDown: (u) => {
        u.stopPropagation(), u.target === u.currentTarget && r();
      },
      children: /* @__PURE__ */ g(
        "section",
        {
          className: "wb-detail-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": t,
          onMouseDown: (u) => u.stopPropagation(),
          children: [
            e,
            n
          ]
        }
      )
    }
  );
  return typeof document > "u" ? null : nr(c, document.body);
}
function co({
  icon: t,
  title: e,
  subtitle: n,
  titleStatus: r,
  versionSelect: i,
  state: o,
  updatedAt: a,
  actions: c,
  downloadUrl: u,
  onClose: l
}) {
  return /* @__PURE__ */ g("header", { className: "wb-detail-head", children: [
    /* @__PURE__ */ g("div", { className: "wb-detail-heading", children: [
      /* @__PURE__ */ s("span", { className: "wb-detail-kind-icon", "aria-hidden": "true", children: t }),
      /* @__PURE__ */ g("div", { children: [
        /* @__PURE__ */ s("strong", { children: e || "详情" }),
        n ? /* @__PURE__ */ s("span", { children: n }) : null
      ] })
    ] }),
    r && /* @__PURE__ */ s("div", { className: "wb-detail-title-status", children: r }),
    /* @__PURE__ */ g("div", { className: "wb-detail-meta", children: [
      i,
      o,
      a ? /* @__PURE__ */ s("time", { children: a }) : null
    ] }),
    /* @__PURE__ */ g("div", { className: "wb-detail-actions", children: [
      c,
      u ? /* @__PURE__ */ s(gt, { label: "下载内容", children: /* @__PURE__ */ s(
        tr,
        {
          url: u,
          name: e,
          className: "wb-detail-icon-button"
        }
      ) }) : null,
      /* @__PURE__ */ s(gt, { label: "关闭", children: /* @__PURE__ */ s(
        "button",
        {
          type: "button",
          className: "wb-detail-icon-button",
          onClick: l,
          "aria-label": "关闭详情",
          children: /* @__PURE__ */ s(Hn, { size: 18 })
        }
      ) })
    ] })
  ] });
}
function Ms({
  options: t,
  currentVersionId: e,
  selectedVersionId: n,
  total: r,
  hasMore: i,
  loading: o,
  loadingMore: a,
  error: c,
  disabled: u = !1,
  onSelect: l,
  onLoadMore: y,
  onRetry: d
}) {
  const [f, p] = k(!1), _ = bt(null), b = t.find((m) => m.id === n) || t.find((m) => m.id === e);
  return q(() => {
    if (!f) return;
    const m = (A) => {
      _.current?.contains(A.target) || p(!1);
    };
    return document.addEventListener("mousedown", m), () => document.removeEventListener("mousedown", m);
  }, [f]), !n && !o ? null : /* @__PURE__ */ g("div", { className: "wb-detail-version-select", ref: _, children: [
    /* @__PURE__ */ g(
      "button",
      {
        type: "button",
        className: "wb-detail-version-trigger",
        "aria-haspopup": "listbox",
        "aria-expanded": f,
        disabled: u || o && t.length === 0,
        onClick: () => p((m) => !m),
        children: [
          o && t.length === 0 ? /* @__PURE__ */ s(v, { size: 12, className: "wb-detail-spin" }) : null,
          /* @__PURE__ */ s("span", { children: fe(b?.version) }),
          r > 0 ? /* @__PURE__ */ g("small", { children: [
            r,
            " 个版本"
          ] }) : null,
          /* @__PURE__ */ s(he, { size: 13 })
        ]
      }
    ),
    f ? /* @__PURE__ */ s("div", { className: "wb-detail-version-menu", role: "listbox", children: /* @__PURE__ */ g(
      "div",
      {
        className: "wb-detail-version-options",
        onScroll: (m) => {
          const A = m.currentTarget;
          i && !a && A.scrollHeight - A.scrollTop - A.clientHeight < 36 && y();
        },
        children: [
          t.length > 0 ? t.map((m) => {
            const A = m.id === n, M = m.id === e;
            return /* @__PURE__ */ g(
              "button",
              {
                type: "button",
                role: "option",
                "aria-selected": A,
                className: A ? "is-selected" : "",
                onClick: () => {
                  p(!1), l(m.value);
                },
                children: [
                  /* @__PURE__ */ g("span", { children: [
                    /* @__PURE__ */ s("strong", { children: fe(m.version) }),
                    M ? /* @__PURE__ */ s("small", { children: "当前" }) : null
                  ] }),
                  /* @__PURE__ */ s("time", { children: uo(m.updatedAt) }),
                  A ? /* @__PURE__ */ s(ge, { size: 13 }) : /* @__PURE__ */ s("i", { "aria-hidden": "true" })
                ]
              },
              m.id
            );
          }) : c ? /* @__PURE__ */ s(le, { error: c, onRetry: d }) : /* @__PURE__ */ g("div", { className: "wb-detail-version-message", children: [
            o ? /* @__PURE__ */ s(v, { size: 14, className: "wb-detail-spin" }) : null,
            /* @__PURE__ */ s("span", { children: o ? "正在读取版本" : "暂无版本" })
          ] }),
          c && t.length > 0 ? /* @__PURE__ */ s(le, { error: c, onRetry: d }) : null,
          a ? /* @__PURE__ */ g("div", { className: "wb-detail-version-loading", children: [
            /* @__PURE__ */ s(v, { size: 13, className: "wb-detail-spin" }),
            "正在加载更多"
          ] }) : null
        ]
      }
    ) }) : null
  ] });
}
function le({
  error: t,
  onRetry: e
}) {
  return /* @__PURE__ */ g("div", { className: "wb-detail-version-message is-error", children: [
    /* @__PURE__ */ s("span", { children: t }),
    /* @__PURE__ */ g("button", { type: "button", onClick: e, children: [
      /* @__PURE__ */ s(Yn, { size: 12 }),
      "重试"
    ] })
  ] });
}
function fe(t) {
  const e = Number(t || 0);
  return e > 0 ? `第${e}版` : "版本";
}
function uo(t) {
  const e = String(t || "").trim();
  return e ? e.replace("T", " ").replace(/\.\d+(Z)?$/, "").replace(/Z$/, "") : "";
}
function lo({
  items: t,
  initialItemID: e,
  onClose: n
}) {
  const r = me(t, e), [i, o] = k(r), a = t.map((l) => `${String(l.id)}:${l.url}`).join(`
`);
  q(() => {
    o(me(t, e));
  }, [e, a]);
  const c = Math.min(
    Math.max(0, i),
    Math.max(0, t.length - 1)
  ), u = t[c];
  return u ? /* @__PURE__ */ s(
    ao,
    {
      ariaLabel: "图片预览",
      layer: "nested",
      onRequestClose: n,
      header: /* @__PURE__ */ s(
        co,
        {
          icon: /* @__PURE__ */ s(_e, { size: 16 }),
          title: u.name || "图片预览",
          subtitle: `图片 ${c + 1}/${t.length}`,
          downloadUrl: u.url,
          onClose: n
        }
      ),
      children: /* @__PURE__ */ s("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ s(
        er,
        {
          kind: "image",
          items: t,
          activeIndex: c,
          onSelect: o
        }
      ) })
    }
  ) : null;
}
function me(t, e) {
  const n = t.findIndex((r) => String(r.id) === String(e));
  return n >= 0 ? n : 0;
}
function Tn({
  grid: t,
  variant: e = "compact",
  readonly: n = !0,
  renderFrameAction: r,
  onFrameChange: i,
  onFrameImport: o,
  onEmptyFrameImport: a,
  capacity: c,
  showHeader: u = !0,
  showCaptions: l = !0,
  columns: y,
  rows: d,
  frameOffset: f = 0,
  previewFrames: p
}) {
  const [_, b] = k(
    null
  ), m = zn(
    () => (p || t.frames).filter((h) => !!h.image).map((h) => ({
      id: h.id || h.order,
      name: h.title || `画面 ${h.order}`,
      url: h.image,
      thumbnail: h.image
    })),
    [t.frames, p]
  ), A = Math.max(
    t.frames.length,
    Math.trunc(Number(c) || 0)
  ), M = Array.from(
    { length: A },
    (h, D) => t.frames[D]
  ), x = {
    ...y ? { gridTemplateColumns: `repeat(${y}, minmax(0, 1fr))` } : {},
    ...d ? { gridTemplateRows: `repeat(${d}, minmax(0, 1fr))` } : {}
  };
  return /* @__PURE__ */ g("section", { className: `ws-storyboard-grid-output is-${e}`, children: [
    u ? /* @__PURE__ */ g("header", { children: [
      /* @__PURE__ */ s("strong", { children: t.title }),
      t.summary ? /* @__PURE__ */ s("p", { children: t.summary }) : null
    ] }) : null,
    /* @__PURE__ */ s(
      "div",
      {
        className: "ws-storyboard-grid-output-list",
        "data-count": M.length,
        style: x,
        children: M.map((h, D) => {
          const C = f + D;
          return h ? /* @__PURE__ */ g("figure", { className: h.image ? "" : "is-empty", children: [
            h.image ? /* @__PURE__ */ s(
              fo,
              {
                frame: h,
                onPreview: () => b(h.id || h.order)
              },
              `${h.id}:${h.image}`
            ) : o ? /* @__PURE__ */ s(
              "button",
              {
                type: "button",
                className: "ws-storyboard-grid-frame-empty nodrag nopan",
                title: "导入图片",
                "aria-label": `向第 ${h.order} 格导入图片`,
                onClick: (I) => {
                  I.preventDefault(), I.stopPropagation(), o(h, C);
                },
                children: /* @__PURE__ */ s(H, { size: 18 })
              }
            ) : /* @__PURE__ */ s("div", { className: "ws-storyboard-grid-output-error", children: h.error || "暂无图片" }),
            h.image && o ? /* @__PURE__ */ s(
              "button",
              {
                type: "button",
                className: "ws-storyboard-grid-frame-import nodrag nopan",
                title: "替换图片",
                "aria-label": `替换第 ${h.order} 格图片`,
                onClick: (I) => {
                  I.preventDefault(), I.stopPropagation(), o(h, C);
                },
                children: /* @__PURE__ */ s(H, { size: 14 })
              }
            ) : null,
            l ? /* @__PURE__ */ g("figcaption", { children: [
              /* @__PURE__ */ s("span", { children: String(h.order).padStart(2, "0") }),
              e === "detail" && !n && i ? /* @__PURE__ */ s(
                "input",
                {
                  value: h.title,
                  "aria-label": `第 ${h.order} 格标题`,
                  onChange: (I) => i(C, { title: I.target.value })
                }
              ) : /* @__PURE__ */ s("strong", { children: h.title })
            ] }) : null,
            e === "detail" ? /* @__PURE__ */ g("div", { className: "ws-storyboard-grid-output-details", children: [
              n || !i ? /* @__PURE__ */ s("p", { children: h.description || "暂无画面说明" }) : /* @__PURE__ */ s(
                "textarea",
                {
                  value: h.description,
                  rows: 3,
                  "aria-label": `第 ${h.order} 格说明`,
                  placeholder: "画面说明",
                  onChange: (I) => i(C, {
                    description: I.target.value
                  })
                }
              ),
              r ? /* @__PURE__ */ s("div", { className: "ws-storyboard-grid-output-actions", children: r(h, C) }) : null
            ] }) : null
          ] }, h.id) : /* @__PURE__ */ s("figure", { className: "is-empty", children: a ? /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              className: "ws-storyboard-grid-frame-empty nodrag nopan",
              title: "导入图片",
              "aria-label": `向第 ${C + 1} 格导入图片`,
              onClick: (I) => {
                I.preventDefault(), I.stopPropagation(), a(C);
              },
              children: /* @__PURE__ */ s(H, { size: 18 })
            }
          ) : null }, `empty-${C}`);
        })
      }
    ),
    _ != null && m.length > 0 ? /* @__PURE__ */ s(
      lo,
      {
        items: m,
        initialItemID: _,
        onClose: () => b(null)
      }
    ) : null
  ] });
}
function fo({
  frame: t,
  onPreview: e
}) {
  const [n, r] = k(!1);
  return n ? /* @__PURE__ */ s("div", { className: "ws-storyboard-grid-output-error", children: t.error || "图片加载失败" }) : /* @__PURE__ */ s(
    "button",
    {
      type: "button",
      className: "ws-storyboard-grid-image nodrag nopan",
      title: "预览图片",
      "aria-label": `预览第 ${t.order} 格图片`,
      onClick: (i) => {
        i.preventDefault(), i.stopPropagation(), e();
      },
      children: /* @__PURE__ */ s(
        "img",
        {
          src: t.image,
          alt: t.title,
          loading: "lazy",
          decoding: "async",
          onError: () => r(!0)
        }
      )
    }
  );
}
function ks({
  grid: t,
  aspectRatio: e,
  running: n = !1,
  onImport: r,
  onFrameImport: i,
  onSlotImport: o,
  onEdit: a,
  layout: c = "auto",
  onLayoutChange: u
}) {
  const l = Yt(c), y = t?.frames.length || 0, d = Cn(y, l), f = t ? {
    ...t,
    frames: t.frames.slice(
      d.pageOffset,
      d.pageOffset + d.shape.capacity
    )
  } : null, p = t?.frames.filter((b) => b.image).length || 0, _ = y > 0 && p !== y ? `${p}/${y} 张` : `${y} 张`;
  return /* @__PURE__ */ g(
    "section",
    {
      className: `ws-storyboard-grid-canvas ${n ? "is-running" : ""}`,
      children: [
        /* @__PURE__ */ s(
          On,
          {
            layout: l,
            countLabel: _,
            pageIndex: d.pageIndex,
            pageCount: d.pageCount,
            disabled: n || !u,
            leading: /* @__PURE__ */ g("span", { children: [
              "比例 ",
              e || "自动"
            ] }),
            actions: r || t && a ? /* @__PURE__ */ g($n, { children: [
              r ? /* @__PURE__ */ g(
                "button",
                {
                  type: "button",
                  className: "nodrag nopan",
                  disabled: n,
                  onClick: (b) => {
                    b.stopPropagation(), r();
                  },
                  children: [
                    /* @__PURE__ */ s(H, { size: 14 }),
                    /* @__PURE__ */ s("span", { children: t ? "批量导入" : "导入图片" })
                  ]
                }
              ) : null,
              t && a ? /* @__PURE__ */ g(
                "button",
                {
                  type: "button",
                  className: "nodrag nopan",
                  disabled: n,
                  onClick: (b) => {
                    b.stopPropagation(), a();
                  },
                  children: [
                    /* @__PURE__ */ s(Kn, { size: 14 }),
                    /* @__PURE__ */ s("span", { children: "编辑" })
                  ]
                }
              ) : null
            ] }) : void 0,
            onLayoutChange: u,
            onPageChange: d.setPageIndex
          }
        ),
        /* @__PURE__ */ s("div", { className: "ws-storyboard-grid-canvas-body nowheel", children: f ? /* @__PURE__ */ s(
          Tn,
          {
            grid: f,
            previewFrames: t?.frames,
            capacity: d.shape.capacity,
            columns: d.shape.columns,
            rows: d.shape.rows,
            frameOffset: d.pageOffset,
            showHeader: !1,
            showCaptions: !1,
            onFrameImport: n ? void 0 : i,
            onEmptyFrameImport: n ? void 0 : o
          }
        ) : /* @__PURE__ */ s(
          "div",
          {
            className: "ws-storyboard-grid-placeholder",
            "aria-busy": n,
            style: {
              gridTemplateColumns: `repeat(${d.shape.columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${d.shape.rows}, minmax(0, 1fr))`
            },
            children: Array.from({ length: d.shape.capacity }, (b, m) => /* @__PURE__ */ s(
              "button",
              {
                type: "button",
                className: "nodrag nopan",
                disabled: n || !o,
                title: "导入图片",
                "aria-label": `向宫格导入图片，第 ${m + 1} 格`,
                onClick: (A) => {
                  A.stopPropagation(), o?.(m);
                },
                children: /* @__PURE__ */ s(H, { size: 18 })
              },
              m
            ))
          }
        ) })
      ]
    }
  );
}
const mo = Fn(
  () => import("./space-storyboard-view-C5VDP6HW.js").then((t) => ({
    default: t.StoryboardView
  }))
);
function Cs({
  output: t,
  fallback: e = "",
  streaming: n = !1,
  emptyText: r = "暂无内容",
  className: i,
  markdownClassName: o,
  richClassName: a,
  mediaLayout: c = "default",
  mediaGridKind: u,
  compactMediaGrid: l = !1,
  storyboardEditable: y = !1,
  storyboardDisabled: d = !1,
  onStoryboardSave: f
}) {
  const p = kn(t, e), _ = _i(p), b = Je(p);
  if (b)
    return /* @__PURE__ */ s(ut, { className: i, children: /* @__PURE__ */ s(Tn, { grid: b }) });
  if (_)
    return /* @__PURE__ */ s(ut, { className: i, children: /* @__PURE__ */ s(Bn, { fallback: /* @__PURE__ */ s("div", { className: "min-h-24", "aria-busy": "true" }), children: /* @__PURE__ */ s(
      mo,
      {
        storyboard: _,
        editable: y,
        disabled: d,
        onSave: f
      }
    ) }) });
  const m = Ji(p, u);
  return m ? /* @__PURE__ */ s(
    ut,
    {
      className: [i, "ws-media-grid-content"].filter(Boolean).join(" "),
      children: /* @__PURE__ */ s(
        io,
        {
          kind: m.kind,
          items: m.items,
          label: e,
          compact: l
        }
      )
    }
  ) : /* @__PURE__ */ s(
    Xt,
    {
      output: p,
      fallback: e,
      streaming: n,
      emptyText: r,
      className: i,
      markdownClassName: o,
      richClassName: a,
      mediaLayout: c
    }
  );
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const Bt = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!Bt || Object.keys(Bt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const po = Bt.EnergonAudioPlayer;
function pe({
  src: t,
  prompt: e = "",
  detailed: n = !1,
  autoPlay: r = !1
}) {
  const i = /* @__PURE__ */ s(
    "div",
    {
      className: [
        "wb-asset-audio-preview",
        n ? "is-detail" : ""
      ].filter(Boolean).join(" "),
      children: /* @__PURE__ */ s(
        po,
        {
          src: t,
          detailed: n,
          autoPlay: r,
          className: "h-full min-h-0 border-0 bg-transparent p-0 shadow-none"
        }
      )
    }
  );
  return n ? /* @__PURE__ */ g("div", { className: "wb-asset-audio-detail", children: [
    i,
    e ? /* @__PURE__ */ g("section", { className: "wb-asset-audio-prompt", children: [
      /* @__PURE__ */ g("header", { children: [
        /* @__PURE__ */ s(jt, { "aria-hidden": "true" }),
        /* @__PURE__ */ s("strong", { children: "语音文本" })
      ] }),
      /* @__PURE__ */ s("p", { children: e })
    ] }) : null
  ] }) : i;
}
function ye({
  content: t,
  summary: e,
  compact: n = !1
}) {
  const r = Ui(t), i = r.name || e || "文件", o = r.extension ? r.extension.toUpperCase() : "FILE", a = r.extension ? `${r.extension.toUpperCase()} 文件` : "文件";
  return n ? /* @__PURE__ */ g("div", { className: "wb-asset-file-card-preview", children: [
    /* @__PURE__ */ s("strong", { children: o }),
    /* @__PURE__ */ s(gt, { label: i, children: /* @__PURE__ */ s("p", { children: i }) }),
    /* @__PURE__ */ s("span", { children: "文件" })
  ] }) : /* @__PURE__ */ g("section", { className: "wb-asset-file-preview", children: [
    /* @__PURE__ */ s("span", { className: "wb-asset-file-icon", children: /* @__PURE__ */ s(jt, { "aria-hidden": "true" }) }),
    /* @__PURE__ */ g("div", { className: "wb-asset-file-copy", children: [
      /* @__PURE__ */ s(gt, { label: i, children: /* @__PURE__ */ s("strong", { children: i }) }),
      /* @__PURE__ */ s("span", { children: a })
    ] }),
    r.url ? /* @__PURE__ */ g("a", { href: r.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ s(Jn, { "aria-hidden": "true" }),
      /* @__PURE__ */ s("span", { children: "打开文件" })
    ] }) : /* @__PURE__ */ s("span", { className: "wb-asset-file-unavailable", children: "文件暂不可用" })
  ] });
}
function kt({
  kind: t,
  src: e,
  poster: n
}) {
  const r = bt(null), [i, o] = k(""), [a, c] = k(""), [u, l] = k(""), y = i === e, d = a === e, f = u === e;
  q(() => {
    const b = r.current;
    if (!e || !b || typeof IntersectionObserver > "u") {
      o(e);
      return;
    }
    const m = new IntersectionObserver(
      (A) => {
        A.some((M) => M.isIntersecting) && (o(e), m.disconnect());
      },
      { rootMargin: "320px 0px" }
    );
    return m.observe(b), () => m.disconnect();
  }, [e]);
  function p() {
    c(e), l("");
  }
  function _() {
    c(""), l(e);
  }
  return /* @__PURE__ */ g(
    "div",
    {
      ref: r,
      className: [
        "wb-asset-lazy-cover",
        `is-${t}`,
        d ? "is-loaded" : "is-pending",
        f ? "is-failed" : ""
      ].filter(Boolean).join(" "),
      children: [
        y && (t === "video" || !f) ? t === "image" ? /* @__PURE__ */ s(
          "img",
          {
            src: e,
            alt: "",
            loading: "lazy",
            decoding: "async",
            onLoad: p,
            onError: _
          }
        ) : /* @__PURE__ */ s(
          be,
          {
            src: e,
            poster: n,
            style: { position: "absolute", inset: 0 },
            ariaHidden: !0,
            onLoad: p,
            onError: _
          }
        ) : null,
        f ? /* @__PURE__ */ s("span", { children: "封面加载失败" }) : null
      ]
    }
  );
}
function yo({
  kind: t,
  content: e,
  summary: n
}) {
  const r = An(t, e), i = n || _t(e) || De(t), o = ii(r, "storyboard") ? { text: i } : r;
  return /* @__PURE__ */ s("div", { className: `wb-asset-card-text-preview is-${t}`, children: /* @__PURE__ */ s(
    Xt,
    {
      output: o,
      fallback: i,
      emptyText: i,
      className: "wb-asset-card-text-content",
      markdownClassName: "wb-asset-card-prose",
      richClassName: "wb-asset-card-prose"
    }
  ) });
}
function Os({
  kind: t,
  content: e,
  summary: n,
  prompt: r,
  compact: i = !1
}) {
  const o = xn(e, t), a = o.map((u) => u.url), c = a[0] || "";
  if (!i) {
    const u = t === "audio" ? Qr(e) : null;
    if ((t === "image" || t === "video") && a.length > 0)
      return /* @__PURE__ */ s(
        te,
        {
          kind: t,
          mediaItems: o,
          downloadable: !0,
          className: "wb-asset-media-gallery"
        }
      );
    if (t === "audio")
      return o.length > 0 && (o.length > 1 || o[0]?.thumbnail) ? /* @__PURE__ */ s(
        te,
        {
          kind: "audio",
          mediaItems: o,
          downloadable: !0,
          className: "wb-asset-media-gallery",
          supplementalText: u
        }
      ) : /* @__PURE__ */ s(pe, { src: c, prompt: r, detailed: !0 });
    if (t === "file")
      return /* @__PURE__ */ s(ye, { content: e, summary: n });
    const l = An(t, e);
    return /* @__PURE__ */ s(
      Xt,
      {
        output: l,
        fallback: n || "",
        emptyText: "该版本暂无可预览内容",
        className: "wb-asset-preview-content",
        markdownClassName: "wb-asset-detail-prose",
        richClassName: "wb-asset-detail-prose",
        mediaLayout: "detail"
      }
    );
  }
  return t === "image" && c ? /* @__PURE__ */ s(kt, { kind: "image", src: c }) : t === "video" && c ? /* @__PURE__ */ s(
    kt,
    {
      kind: "video",
      src: c,
      poster: o[0]?.thumbnail
    }
  ) : t === "audio" ? o[0]?.thumbnail ? /* @__PURE__ */ s(kt, { kind: "image", src: o[0].thumbnail }) : /* @__PURE__ */ s(pe, { src: c }) : t === "file" ? /* @__PURE__ */ s(ye, { content: e, summary: n, compact: !0 }) : t === "text" || t === "richtext" ? /* @__PURE__ */ s(yo, { kind: t, content: e, summary: n }) : /* @__PURE__ */ s("div", { className: "wb-asset-card-fallback", children: /* @__PURE__ */ s("p", { children: n || _t(e) || De(t) }) });
}
function Ts({ kind: t }) {
  switch (t) {
    case "collection":
      return /* @__PURE__ */ s(Zn, { "aria-hidden": "true" });
    case "image":
      return /* @__PURE__ */ s(_e, { "aria-hidden": "true" });
    case "audio":
      return /* @__PURE__ */ s(Xn, { "aria-hidden": "true" });
    case "video":
      return /* @__PURE__ */ s(qn, { "aria-hidden": "true" });
    case "file":
      return /* @__PURE__ */ s(Wn, { "aria-hidden": "true" });
    default:
      return /* @__PURE__ */ s(jt, { "aria-hidden": "true" });
  }
}
export {
  He as $,
  pe as A,
  gt as B,
  Cs as C,
  Is as D,
  Ts as E,
  Je as F,
  ii as G,
  Ns as H,
  Eo as I,
  xr as J,
  Mr as K,
  Ir as L,
  Lo as M,
  wt as N,
  Be as O,
  To as P,
  Ro as Q,
  Jo as R,
  Tn as S,
  Wo as T,
  Oo as U,
  ri as V,
  xn as W,
  Zo as X,
  qo as Y,
  Qe as Z,
  _s as _,
  An as a,
  xi as a$,
  ei as a0,
  xo as a1,
  T as a2,
  Pr as a3,
  Vo as a4,
  Dr as a5,
  z as a6,
  es as a7,
  Oe as a8,
  wr as a9,
  Si as aA,
  dn as aB,
  ms as aC,
  gs as aD,
  fs as aE,
  Ni as aF,
  Ai as aG,
  mn as aH,
  ps as aI,
  So as aJ,
  No as aK,
  Yt as aL,
  Ho as aM,
  vt as aN,
  $e as aO,
  Nr as aP,
  Mo as aQ,
  Q as aR,
  je as aS,
  Go as aT,
  ze as aU,
  Yo as aV,
  ns as aW,
  Vt as aX,
  Fo as aY,
  Ko as aZ,
  Fe as a_,
  Te as aa,
  wi as ab,
  cs as ac,
  us as ad,
  an as ae,
  sn as af,
  Uo as ag,
  zo as ah,
  Er as ai,
  fi as aj,
  Qo as ak,
  as as al,
  bs as am,
  mi as an,
  ts as ao,
  pi as ap,
  rs as aq,
  li as ar,
  ds as as,
  ss as at,
  os as au,
  ws as av,
  cn as aw,
  bi as ax,
  hs as ay,
  ys as az,
  Po as b,
  fn as b0,
  vo as b1,
  is as b2,
  ln as b3,
  N as b4,
  Pe as b5,
  Bo as b6,
  jo as b7,
  nt as b8,
  Ao as b9,
  As as ba,
  xs as bb,
  fr as bc,
  ee as bd,
  qe as be,
  Xe as bf,
  ht as bg,
  pr as bh,
  ko as bi,
  We as bj,
  Zr as bk,
  ir as bl,
  Ne as bm,
  $o as bn,
  Rr as bo,
  Ji as bp,
  ks as bq,
  Do as c,
  ni as d,
  Xo as e,
  qt as f,
  Io as g,
  xe as h,
  so as i,
  ti as j,
  w as k,
  _i as l,
  ls as m,
  Bi as n,
  Ke as o,
  rr as p,
  Qr as q,
  co as r,
  Co as s,
  uo as t,
  Ms as u,
  ao as v,
  St as w,
  Ss as x,
  Os as y,
  De as z
};
