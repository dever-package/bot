import { a as g, j as s, F as $n } from "./react-5Z-wsVEn.js";
import { b as ht, a as k, d as W, u as zn, q as Fn, S as Bn } from "./file-kind-D6bMOzYN.js";
import { b7 as jn, r as V, j as Un, b8 as Vn, c as ye, n as he, J as Gn, d as vn, X as Hn, af as Yn, a7 as ge, ae as G, q as Kn, b as Bt, aJ as Jn, aG as Wn, b9 as qn, ba as Xn, _ as Zn } from "./vendor-icons-fVDtJt66.js";
import { V as _e, r as Qn, R as tr, a as er, M as Qt } from "./media-inspector-gallery-BJGVC-F2.js";
import { c as nr } from "./preloadable-CT3tMmBD.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./asset-preview-CdPA4RIK.css", import.meta.url).href]);
function rr(t) {
  if (typeof t != "string")
    return t;
  const e = t.trim();
  if (!jt(e))
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
function go(t) {
  return w(t) ? t : {};
}
function x(t) {
  return typeof t == "string" ? t.trim() : "";
}
function _o(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) ? e : 0;
}
function Z(t) {
  if (t == null || t === "")
    return;
  const e = Number(t);
  return Number.isFinite(e) ? e : void 0;
}
function be(t) {
  const e = String(t || "").trim(), n = ir(e), r = ur(n);
  for (const i of Se([e, n, r])) {
    const o = rr(i);
    if (o !== i)
      return o;
    const a = ar(i);
    if (a !== i)
      return a;
  }
  return t;
}
function bo(t) {
  const e = String(t || "").trim();
  for (const n of we(e)) {
    const r = be(n);
    if (r !== n)
      return r;
  }
  return t;
}
function q(t) {
  const e = [];
  for (const n of we(
    String(t || "").trim()
  )) {
    const r = be(n);
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
function we(t) {
  const e = [t];
  for (const n of t.matchAll(/```(?:json|storyboard)?\s*([\s\S]*?)```/gi))
    e.push(String(n[1] || "").trim());
  return e.push(...or(t)), Se(e);
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
function jt(t) {
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
function Se(t) {
  const e = /* @__PURE__ */ new Set();
  return t.filter((n) => {
    const r = String(n || "").trim();
    return !r || e.has(r) ? !1 : (e.add(r), !0);
  });
}
function wo(...t) {
  return t.find(
    (e) => e != null
  );
}
function So(t) {
  try {
    return JSON.stringify(t);
  } catch {
    return "";
  }
}
await window.DeverFront?.ensureCompat?.(["@/components/media/first-frame-video"]);
const kt = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!kt || Object.keys(kt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const dr = kt.FirstFrameVideo, lr = 56;
function te(t, e) {
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
  onError: f,
  onMediaSize: l,
  objectFit: d = "cover",
  allowDragFromVideo: m = !1,
  playButtonOnly: y = !1
}) {
  const _ = ht(null), [b, p] = k(""), [N, M] = k(""), [A, h] = k(""), [D, C] = k(""), [I, xt] = k(""), z = b === t, E = N === t, X = A === t, Rn = D !== t && I !== t, Dn = y || !E && !z, En = !y && z && !E, Pn = y ? { bottom: 12, right: 12 } : {
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)"
  };
  W(() => {
    const S = _.current;
    if (!S || !m || y) return;
    const P = (B) => {
      te(S, B.clientY) && B.stopPropagation();
    }, F = (B) => {
      const Zt = B.touches[0];
      Zt && te(S, Zt.clientY) && B.stopPropagation();
    };
    return S.addEventListener("mousedown", P), S.addEventListener("touchstart", F, {
      passive: !0
    }), () => {
      S.removeEventListener("mousedown", P), S.removeEventListener("touchstart", F);
    };
  }, [m, y]);
  function Nt(S) {
    S.stopPropagation();
  }
  function Xt() {
    p((S) => S === t ? "" : S), M((S) => S === t ? "" : S), h((S) => S === t ? "" : S);
  }
  function Ln(S) {
    S.preventDefault(), S.stopPropagation();
    const P = _.current;
    if (P) {
      if (X) {
        h((F) => F === t ? "" : F), P.pause();
        return;
      }
      p(t), h(t), E || M(""), P.play().catch(() => {
        Xt(), f?.();
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
            controls: z && !y,
            playsInline: !0,
            preload: "none",
            draggable: a,
            "aria-hidden": E ? void 0 : !0,
            className: [
              m ? "" : "nodrag",
              "nopan nowheel absolute inset-0 block h-full w-full",
              E ? "opacity-100" : "pointer-events-none opacity-0"
            ].join(" "),
            style: { objectFit: d },
            onPointerDown: y || m ? void 0 : Nt,
            onClick: y ? void 0 : Nt,
            onLoadedMetadata: (S) => l?.(
              S.currentTarget.videoWidth,
              S.currentTarget.videoHeight
            ),
            onPlaying: () => {
              M(t), h(t);
            },
            onPause: () => h((S) => S === t ? "" : S),
            onEnded: () => h((S) => S === t ? "" : S),
            onError: () => {
              Xt(), f?.();
            }
          }
        ),
        E ? null : /* @__PURE__ */ s(
          _e,
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
              xt(t), f?.();
            },
            onMediaSize: l
          }
        ),
        Dn ? /* @__PURE__ */ s(
          "button",
          {
            type: "button",
            className: "nodrag nopan nowheel absolute z-[2] inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/65 p-0 text-white shadow-lg backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80",
            style: Pn,
            "aria-label": X ? "暂停视频" : c ? `播放${c}` : "播放视频",
            "aria-pressed": X,
            onPointerDown: Nt,
            onClick: Ln,
            children: X ? /* @__PURE__ */ s(jn, { size: 16, className: "fill-current", "aria-hidden": "true" }) : Rn && !E ? /* @__PURE__ */ s(
              V,
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
            children: /* @__PURE__ */ s(V, { size: 16, className: "animate-spin", "aria-hidden": "true" })
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
}, xe = [
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
function xo(t) {
  const e = Ne(t);
  return e.length > 120 ? `${e.slice(0, 120)}...` : e;
}
function Ne(t) {
  return tt(t).replace(/\s+/g, " ").trim();
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
function Ut(t) {
  const e = j(t, /* @__PURE__ */ new Set());
  return Vt(e) ? e : null;
}
function No(t) {
  try {
    return Ne(t);
  } catch {
    return "";
  }
}
function Ao(t) {
  try {
    return Ut(t);
  } catch {
    return null;
  }
}
function tt(t) {
  if (typeof t == "string") {
    const r = t.trim();
    if (jt(r)) {
      const i = ke(r);
      if (i !== void 0)
        return tt(i).trim();
    }
    return pr(r) || t;
  }
  if (Array.isArray(t))
    return t.map(tt).filter(Boolean).join(" ");
  if (!w(t))
    return "";
  const e = Ut(t);
  if (e)
    return Me(e);
  const n = [
    typeof t.text == "string" ? t.text : "",
    typeof t.markdown == "string" ? t.markdown : ""
  ];
  for (const r of xe)
    t[r] != null && n.push(tt(t[r]));
  return n.filter(Boolean).join(" ");
}
function j(t, e) {
  if (typeof t == "string") {
    const r = t.trim();
    if (!jt(r))
      return null;
    const i = ke(r);
    return i === void 0 ? null : j(i, e);
  }
  if (Array.isArray(t)) {
    const r = ee({ type: "doc", content: t });
    if (Vt(r))
      return r;
    for (const i of t) {
      const o = j(i, e);
      if (o)
        return o;
    }
    return null;
  }
  if (!w(t) || e.has(t))
    return null;
  e.add(t);
  const n = ee(t);
  if (n)
    return n;
  if (String(t.format || "").toLowerCase() === "rich_json" && t.rich != null) {
    const r = j(t.rich, e);
    if (r)
      return r;
  }
  for (const r of xe) {
    if (t[r] == null)
      continue;
    const i = j(t[r], e);
    if (i)
      return i;
  }
  return null;
}
function ee(t) {
  return !w(t) || Ie(t.type) !== "doc" ? null : {
    type: "doc",
    attrs: w(t.attrs) ? t.attrs : void 0,
    content: Ae(t.content)
  };
}
function Ae(t) {
  return Array.isArray(t) ? t.map(yr).filter((e) => !!e) : [];
}
function yr(t) {
  if (!w(t))
    return null;
  const e = Ie(t.type) || hr(t);
  if (!e)
    return null;
  const n = { type: e }, r = w(t.attrs) ? { ...t.attrs } : {};
  if (e === "heading" && ct(r.level) <= 0) {
    const a = ct(t.level);
    a > 0 && (r.level = a);
  }
  Object.keys(r).length > 0 && (n.attrs = r);
  const i = gr(t.marks);
  if (i.length > 0 && (n.marks = i), e === "text") {
    const a = L(t.text);
    return a ? (n.text = a, n) : null;
  }
  const o = Ae(t.content);
  return o.length > 0 && (n.content = o), n;
}
function hr(t) {
  if (typeof t.text == "string")
    return "text";
  const e = w(t.attrs) ? t.attrs : {};
  return ct(e.level) > 0 || ct(t.level) > 0 ? "heading" : "";
}
function gr(t) {
  return Array.isArray(t) ? t.map((e) => {
    if (!w(e))
      return null;
    const n = L(e.type);
    return n ? {
      type: n,
      attrs: w(e.attrs) ? e.attrs : void 0
    } : null;
  }).filter(
    (e) => !!e
  ) : [];
}
function Ie(t) {
  const e = L(t);
  return mr[e] || e;
}
function Me(t) {
  return t ? t.type === "text" ? t.text || "" : t.type === "editorMediaImage" || t.type === "editorMediaVideo" || t.type === "editorMediaAudio" ? L(t.attrs?.alt || t.attrs?.title || t.attrs?.src) : (t.content || []).map(Me).filter(Boolean).join(" ") : "";
}
function Vt(t) {
  return t ? t.type === "text" ? !!L(t.text) : t.type === "editorMediaImage" || t.type === "editorMediaVideo" || t.type === "editorMediaAudio" ? !!L(t.attrs?.src) : (t.content || []).some(Vt) : !1;
}
function ke(t) {
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
function ct(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) ? e : 0;
}
function L(t) {
  return t == null ? "" : String(t).trim();
}
function Gt(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  for (const i of t) {
    if (!w(i))
      continue;
    const o = v(i.asset_id ?? i.assetId), a = Te(i.kind), c = Ot(i.purpose);
    if (!o || !a || !c || r.has(o))
      continue;
    let u = String(i.key || "").trim() || Ct(o);
    if (n.has(u) && (u = Ct(o)), n.has(u))
      continue;
    const f = v(i.version_id ?? i.versionId), l = String(i.label || "").trim() || `参考素材 ${e.length + 1}`;
    e.push({
      key: u,
      asset_id: o,
      ...f ? { version_id: f } : {},
      label: l,
      kind: a,
      purpose: c
    }), n.add(u), r.add(o);
  }
  return e;
}
function Io(t, e, n, r, i, o) {
  const a = new Map(
    Gt(e).map((d) => [
      d.asset_id,
      d
    ])
  ), c = new Map(
    n.flatMap((d) => {
      const m = v(d.refId);
      return m ? [[m, d]] : [];
    })
  ), u = [], f = (t?.parts || []).map((d) => ({ ...d })), l = /* @__PURE__ */ new Set();
  for (const [d, m] of (t?.parts || []).entries()) {
    if (m.type !== "reference" || m.ref_type !== "asset")
      continue;
    const y = v(m.ref_id);
    if (!y || l.has(y))
      continue;
    const _ = a.get(y), b = c.get(y), p = Te(b?.kind) || _?.kind;
    if (!p)
      continue;
    const N = v(b?.versionID || m.ref_version_id), M = String(b?.title || m.label || _?.label || "").trim() || `参考素材 ${u.length + 1}`, A = Ce(
      p,
      i,
      o
    ), h = Ot(m.purpose), D = Ot(
      _?.purpose
    ), C = [h, D].find(
      (xt) => A.some((z) => z.value === xt)
    ) || Sr(p, i, o), I = f[d];
    I?.type === "reference" && (I.purpose = C || void 0), u.push({
      key: _?.key || Ct(y),
      asset_id: y,
      ...N ? { version_id: N } : {},
      label: M,
      kind: p,
      purpose: C
    }), l.add(y);
  }
  return {
    content: t ? { ...t, parts: f } : void 0,
    references: u
  };
}
function Mo(t, e) {
  return e.filter(
    (n) => n.work_types.length === 0 || n.work_types.includes(t)
  ).map((n) => ({
    key: n.key,
    label: n.name,
    acceptedKinds: [...n.media_kinds]
  }));
}
function Ce(t, e, n) {
  return n.filter(
    (r) => r.media_kinds.includes(t) && (r.work_types.length === 0 || r.work_types.includes(e))
  ).map((r) => ({ value: r.key, label: r.name }));
}
function Oe(t, e) {
  return e.find((n) => n.key === t);
}
function wr(t, e) {
  return Oe(t, e)?.name || t;
}
function ko(t, e, n, r) {
  const i = n.find((a) => a.key === e);
  if (!i || r.length === 0)
    return "分镜作品类型或参考用途配置无效";
  const o = /* @__PURE__ */ new Map();
  for (const a of t) {
    const c = Oe(
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
function Ct(t) {
  return `ref-${t}`;
}
function Ot(t) {
  const e = String(t || "").trim();
  return e || void 0;
}
function Sr(t, e, n) {
  const r = Ce(t, e, n);
  return n.find(
    (o) => o.default_media_kinds.includes(t) && (o.work_types.length === 0 || o.work_types.includes(e))
  )?.key || r[0]?.value || "";
}
function Te(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "image" || e === "video" || e === "audio" ? e : void 0;
}
function v(t) {
  const e = Number(t || 0);
  return Number.isInteger(e) && e > 0 ? e : 0;
}
function xr(t) {
  return typeof t == "string" && t.length > 0 && t.trim() === t;
}
const Nr = "素材库", Ar = [
  { key: "project", label: "创作" },
  { key: "tool", label: "工具" },
  { key: "dialogue", label: "对话" },
  { key: "upload", label: "上传" },
  { key: "import", label: "导入" },
  { key: "official", label: Nr }
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
function Co(t, e = {}) {
  const n = e.fallback || "资产", r = vt(Ar, t, n);
  return e[t] || r;
}
function Oo(t) {
  return vt(Ir, t, "素材");
}
function Re(t) {
  return vt(Mr, t, "资产");
}
function To(t) {
  if (t.length === 0 || t.some((r) => ["text", "richtext", "file"].includes(r)))
    return;
  const e = {
    image: "image/*",
    audio: "audio/*",
    video: "video/*"
  }, n = t.map((r) => e[r]).filter((r) => !!r);
  return n.length > 0 ? Array.from(new Set(n)).join(",") : void 0;
}
function Ro(t, e) {
  return t && (e.length === 0 || e.some((n) => ["richtext", "video"].includes(n)));
}
function Do(t) {
  return t.id <= 0 ? !1 : t.libraryType === "material" ? t.version?.content != null : t.versionID > 0;
}
function vt(t, e, n) {
  return t.find((r) => r.key === e)?.label || n;
}
const ut = [
  { value: "auto", label: "自动", columns: 0, rows: 0, capacity: 9 },
  { value: "2x2", label: "2×2", columns: 2, rows: 2, capacity: 4 },
  { value: "3x2", label: "3×2", columns: 3, rows: 2, capacity: 6 },
  { value: "3x3", label: "3×3", columns: 3, rows: 3, capacity: 9 }
], kr = new Set(
  ut.map((t) => t.value)
);
function Ht(t) {
  const e = String(t || "").trim().toLowerCase();
  return kr.has(e) ? e : "auto";
}
function De(t) {
  const e = Ht(t);
  return ut.find((n) => n.value === e) || ut[0];
}
function Cr(t, e) {
  const n = De(t), r = Math.max(0, Math.trunc(Number(e) || 0));
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
const Rr = 50, Ee = 5, Pe = [
  "first_frame",
  "last_frame",
  "first_last",
  "next_first",
  "references",
  "none"
], dt = "first_frame", Eo = {
  first_frame: "首帧",
  last_frame: "尾帧",
  first_last: "首尾帧",
  next_first: "首帧 → 下一镜首帧",
  references: "参考图组",
  none: "无参考图"
};
function Le(t) {
  const e = Number(t);
  return Number.isInteger(e) && e > 0 ? e : void 0;
}
function Po(t) {
  return (Le(t) || 0) >= Ee;
}
function Lo(t, e) {
  const n = Le(t);
  return e ? Math.max(n || 0, Ee) : n;
}
function $e(t) {
  return t === "start" || t === "end" ? t : void 0;
}
function Dr(t) {
  return $e(t) || "start";
}
function $o(t) {
  return Dr(t) === "end" ? "lastFrame" : "firstFrame";
}
function ze(t) {
  return Er(t) || dt;
}
function Er(t) {
  return Pe.includes(t) ? t : void 0;
}
function Pr(t) {
  switch (t) {
    case "first_frame":
      return [{ frameRole: "start", mediaIndex: 1 }];
    case "last_frame":
      return [{ frameRole: "end", mediaIndex: 1 }];
    case "first_last":
      return $r();
    default:
      return [];
  }
}
function gt(t) {
  const e = ze(t.shot_image_mode), n = !!t.continue_previous, r = !!t.match_previous, i = Lr(
    e,
    r,
    n
  );
  let o = i === "next_first" ? "first_frame" : i;
  return n && i === "first_frame" && (o = "none"), {
    mode: i,
    nodeMode: o,
    frameMediaItems: Pr(o),
    referenceMode: i === "references" ? "references" : i === "none" ? "" : "frames"
  };
}
function Fe(t) {
  return t.map(gt);
}
function H(t) {
  return typeof t == "string" ? t.trim() : "";
}
function zo(t) {
  return Pe.filter(
    (e) => !(e === "next_first" && t.continue_previous) && gt({ ...t, shot_image_mode: e }).mode === e
  );
}
function Lr(t, e, n) {
  return n && t === "first_last" ? "last_frame" : t === "last_frame" && !n || n && (t === "references" || t === "none") || e && t === "none" ? dt : t;
}
function $r() {
  return [
    { frameRole: "start", mediaIndex: 1 },
    { frameRole: "end", mediaIndex: 2 }
  ];
}
function Fo(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  for (const i of t) {
    if (!i || typeof i != "object" || Array.isArray(i))
      continue;
    const o = i, a = $e(o.frameRole ?? o.frame_role), c = Number(o.mediaIndex ?? o.media_index);
    !a || !Number.isInteger(c) || c <= 0 || n.has(a) || r.has(c) || (n.add(a), r.add(c), e.push({ frameRole: a, mediaIndex: c }));
  }
  return e.sort((i, o) => i.mediaIndex - o.mediaIndex);
}
function Bo(t) {
  return Array.isArray(t) ? t.map((e) => {
    if (!e || typeof e != "object" || Array.isArray(e))
      return;
    const n = e, r = H(n.prompt);
    if (!r)
      return;
    const i = H(n.title);
    return {
      title: i || "画面",
      description: H(n.description) || i || r,
      prompt: r
    };
  }).filter((e) => !!e) : [];
}
function At(t, e) {
  return t?.find((n) => n.frameRole === e)?.mediaIndex || 0;
}
function jo(t, e, n) {
  const r = t[e], i = zr(t, e, n);
  if (!r || !i)
    return {
      anchorID: "",
      anchorFrameRole: "",
      anchorShotIndex: -1,
      materialIDs: lt(r?.material_ids),
      referenceKeys: lt(r?.reference_keys),
      includeGlobalReferences: !0
    };
  const o = t[i.shotIndex];
  return {
    anchorID: i.id,
    anchorFrameRole: i.frameRole,
    anchorShotIndex: i.shotIndex,
    materialIDs: ne(
      r.material_ids,
      o?.material_ids
    ),
    referenceKeys: ne(
      r.reference_keys,
      o?.reference_keys
    ),
    includeGlobalReferences: !1
  };
}
function zr(t, e, n) {
  const r = t[e];
  if (!r)
    return;
  const i = Fe(t);
  if (n === "end" && !r.continue_previous)
    return At(i[e]?.frameMediaItems, "start") ? { id: r.id, shotIndex: e, frameRole: "start" } : void 0;
  if (!(n === "start" && !r.match_previous && !r.continue_previous || e <= 0))
    for (let o = e - 1; o >= 0; o -= 1) {
      const a = i[o];
      if (At(a?.frameMediaItems, "end"))
        return {
          id: t[o].id,
          shotIndex: o,
          frameRole: "end"
        };
      if (At(a?.frameMediaItems, "start"))
        return {
          id: t[o].id,
          shotIndex: o,
          frameRole: "start"
        };
      if (!t[o].continue_previous)
        return;
    }
}
function ne(t, e) {
  const n = new Set(lt(e));
  return lt(t).filter(
    (r) => !n.has(r)
  );
}
function lt(t) {
  return [
    ...new Set((t || []).map((e) => e.trim()).filter(Boolean))
  ];
}
function Uo(t, e, n) {
  const r = t[e];
  if (r?.shot_image_mode !== "next_first") return "";
  const i = t[e + 1];
  if (!i) return "最后一镜没有下一镜，请改用首帧或独立首尾帧";
  if (r.shared_end_shot_id !== i.id)
    return "来源不再是相邻下一镜，请重新选择结束画面";
  if (r.continue_previous || i.continue_previous || !i.match_previous)
    return "须使用计划首帧直接连续，不能与真实视频尾帧续接混用";
  if (!["first_frame", "first_last", "next_first"].includes(
    ze(i.shot_image_mode)
  ))
    return "下一镜没有可共享的首帧";
  if (i.transition_type && i.transition_type !== "none")
    return "下一镜不能设置转场效果";
  const o = (l) => l && typeof l == "object" ? l : {}, a = H(o(r.continuity_state).exit);
  if (!a || a !== H(o(i.continuity_state).entry))
    return "结束状态必须与下一镜入镜状态完全一致";
  if (!r.end_framing?.trim() || r.end_framing.trim() !== i.start_framing?.trim())
    return "结束构图必须与下一镜起始构图完全一致";
  const c = n, u = c.filter(
    (l) => r.material_ids?.includes(l.id)
  ), f = c.filter(
    (l) => i.material_ids?.includes(l.id)
  );
  return !u.some((l) => l.type === "scene") || u.length !== f.length || u.some((l) => !i.material_ids?.includes(l.id)) ? "必须保持同一场景与相同主体素材" : "";
}
const Be = 4, Tt = /* @__PURE__ */ new Set([2, 3, 4, 5]);
function _t(t) {
  if (t == null || String(t).trim() === "")
    return Be;
  const e = Number(t);
  if (!Number.isInteger(e) || !Tt.has(e))
    throw new Error("最短镜头时长必须是 2 到 5 秒");
  return e;
}
function Vo(t) {
  if (!(t == null || String(t).trim() === ""))
    try {
      return _t(t);
    } catch {
      return;
    }
}
function Go(t) {
  if (!Array.isArray(t))
    return [];
  const e = /* @__PURE__ */ new Set(), n = t.map((r) => {
    const i = w(r) ? r : {}, o = _t(i.seconds), a = Number(i.sort);
    if (e.has(o) || !Number.isInteger(a))
      throw new Error("分镜最短时长注册信息无效");
    return e.add(o), {
      seconds: o,
      name: String(i.name || "").trim() || `${o} 秒`,
      sort: a
    };
  });
  if (n.length !== Tt.size || [...Tt].some(
    (r) => !e.has(r)
  ))
    throw new Error("分镜最短时长注册信息无效");
  return n.sort((r, i) => r.sort - i.sort);
}
function vo(t) {
  const e = [
    _t(t.min_shot_duration),
    ...t.shots.map((n) => Number(n.duration))
  ];
  return [...new Set(e.filter(Ue))].sort(
    (n, r) => n - r
  );
}
function Ho(t, e) {
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
function Yo(t) {
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
const Fr = {
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
}, Br = [
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
function Yt(t) {
  return Object.fromEntries(
    t.map((e) => [e, /* @__PURE__ */ new Map()])
  );
}
function ft(t, e, n = {}) {
  const r = {
    media: t,
    enabledKinds: Object.keys(t),
    seen: n.seen || /* @__PURE__ */ new Set(),
    requestedKind: n.kind
  };
  O(e, r, 0, n.kind);
}
function jr(t, e) {
  const r = Yt(e === "audio" ? ["audio", "image"] : [e]);
  return ft(r, t, { kind: e }), Ve(r), Array.from(r[e].values());
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
    const l = t.length > 1 ? "" : i;
    t.forEach(
      (d) => O(
        d,
        e,
        n + 1,
        r,
        l
      )
    );
    return;
  }
  if (typeof t == "string") {
    const l = q(t);
    if (l.length > 0) {
      l.forEach(
        (m) => O(
          m,
          e,
          n + 1,
          r,
          i
        )
      );
      return;
    }
    const d = r || e.requestedKind || vr(t);
    d && e.media[d] && ve(t) && Ur(
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
  const o = t, a = w(o.attrs) ? o.attrs : void 0, c = Gr(
    o.type,
    o.kind,
    o.media_type,
    o.mediaType,
    o.mime
  ), u = Vr(
    o,
    a,
    i
  ), f = r || e.requestedKind;
  if (f && e.media[f] && (!c || c === f))
    for (const l of re(o, f))
      O(
        l,
        e,
        n + 1,
        f,
        u
      );
  for (const l of e.enabledKinds) {
    const d = Fr[l];
    for (const m of d.direct)
      O(
        o[m],
        e,
        n + 1,
        l,
        u
      );
    for (const m of d.collections)
      O(
        o[m],
        e,
        n + 1,
        l,
        u
      );
  }
  if (c && e.media[c]) {
    for (const l of re(o, c))
      O(
        l,
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
  for (const l of Br)
    O(
      o[l],
      e,
      n + 1
    );
}
function re(t, e) {
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
function Ur(t, e, n, r) {
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
function Vr(t, e, n) {
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
function Gr(...t) {
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
function vr(t) {
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
const Rt = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!Rt || Object.keys(Rt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const Kt = ["image", "video", "audio"], Hr = 64, Yr = 128 * 1024, mt = /* @__PURE__ */ Symbol("content-output-cache-miss"), ie = We(), oe = We(), Kr = Rt, Jr = Kr.normalizeEnergonOutput;
function T(...t) {
  for (const e of t)
    if (typeof e == "string" && e.trim())
      return e.trim();
  return "";
}
function Wr(t) {
  const e = Y(
    t,
    ["lyrics", "lyric", "lrc", "song_lyrics", "songLyrics"],
    /* @__PURE__ */ new Set(),
    0
  );
  if (e)
    return { label: "歌词", text: e };
  const n = Y(
    t,
    ["text"],
    /* @__PURE__ */ new Set(),
    0
  );
  return n ? { label: "创作内容", text: n } : null;
}
function Y(t, e, n, r) {
  if (t == null || r > 12)
    return "";
  if (typeof t == "string") {
    for (const i of q(t)) {
      const o = Y(i, e, n, r + 1);
      if (o)
        return o;
    }
    return "";
  }
  if (Array.isArray(t)) {
    for (const i of t) {
      const o = Y(i, e, n, r + 1);
      if (o)
        return o;
    }
    return "";
  }
  if (!w(t) || n.has(t))
    return "";
  n.add(t);
  for (const i of e) {
    const o = et(t[i], r + 1);
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
    const o = Y(t[i], e, n, r + 1);
    if (o)
      return o;
  }
  return "";
}
function et(t, e) {
  if (t == null || e > 12)
    return "";
  if (typeof t == "string") {
    const n = t.trim();
    if (!n || /^(https?:\/\/|\/|data:|blob:)/i.test(n))
      return "";
    const r = q(n);
    return r.length > 0 ? r.map((i) => et(i, e + 1)).filter(Boolean).join(`
`) : n;
  }
  if (Array.isArray(t))
    return t.map((n) => et(n, e + 1)).filter(Boolean).join(`
`);
  if (!w(t))
    return "";
  for (const n of ["text", "content", "line", "lines", "value"]) {
    const r = et(t[n], e + 1);
    if (r)
      return r;
  }
  return "";
}
function qr(t) {
  const e = He(t);
  return !e || e.hasMedia ? "" : e.markdown;
}
function He(t) {
  const e = ii(t);
  return !e || !tn(e) ? null : {
    markdown: e.content.map(en).join(`

`).trim(),
    plainText: e.content.map(nn).join(`

`).trim(),
    hasMedia: rn(e)
  };
}
function Xr(t) {
  return /(^|\n)\s*(#{1,6}\s|[-*+]\s|>\s|\d+\.\s|```)/m.test(t) || /(\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)]+\)|`[^`]+`)/.test(t);
}
function Ko(t) {
  return Zr(t).length > 0;
}
function Zr(t) {
  const e = wt(t);
  return Kt.filter((n) => e[n].size > 0);
}
function Ye(t) {
  const e = wt(t);
  return Kt.reduce(
    (n, r) => n + e[r].size,
    0
  );
}
function Jo(t, e) {
  return Array.from(wt(t)[e].keys());
}
function Ke(t, e) {
  return Array.from(wt(t)[e].values());
}
function Qr(t) {
  const e = Je(t);
  return e ? Array.from(
    new Set(e.frames.map((n) => n.image.trim()).filter(Boolean))
  ) : [];
}
function Je(t) {
  const e = qe(oe, t);
  return e !== mt ? e : Xe(
    oe,
    t,
    rt(t, /* @__PURE__ */ new Set(), 0)
  );
}
function ti(t, e) {
  const n = e.trim().toLowerCase();
  return n ? nt(t, n, /* @__PURE__ */ new Set(), 0) : !1;
}
function Wo(...t) {
  let e, n, r = 0;
  for (const i of t) {
    if (!bt(i))
      continue;
    e === void 0 && (e = i);
    const o = Ye(i);
    o > r && (n = i, r = o);
  }
  return r > 0 ? n : e;
}
function bt(t) {
  return t == null || t === "" ? !1 : Array.isArray(t) ? t.length > 0 : typeof t == "object" ? Object.keys(t).length > 0 : !0;
}
function wt(t) {
  const e = qe(ie, t);
  if (e !== mt)
    return e;
  const n = Yt(Kt), r = Qr(t), i = /* @__PURE__ */ new Set();
  for (const o of Qe(t))
    ft(n, o, { seen: i });
  return ft(n, t), Ve(n), r.length > 0 && (n.image = new Map(
    r.map((o) => [o, { url: o, thumbnail: o }])
  )), Xe(ie, t, n);
}
function We() {
  return {
    objects: /* @__PURE__ */ new WeakMap(),
    strings: /* @__PURE__ */ new Map()
  };
}
function qe(t, e) {
  if (e && typeof e == "object")
    return t.objects.has(e) ? t.objects.get(e) : mt;
  if (!Ze(e) || !t.strings.has(e))
    return mt;
  const n = t.strings.get(e);
  return t.strings.delete(e), t.strings.set(e, n), n;
}
function Xe(t, e, n) {
  if (e && typeof e == "object")
    return t.objects.set(e, n), n;
  if (!Ze(e))
    return n;
  for (t.strings.delete(e), t.strings.set(e, n); t.strings.size > Hr; ) {
    const r = t.strings.keys().next().value;
    if (typeof r != "string")
      break;
    t.strings.delete(r);
  }
  return n;
}
function Ze(t) {
  return typeof t == "string" && t.length <= Yr;
}
function Qe(t) {
  if (!bt(t))
    return [];
  const e = Jr?.(t);
  return Array.isArray(e) && e.length > 0 ? e : Array.isArray(t) ? t : [t];
}
function nt(t, e, n, r) {
  return t == null || r > 12 ? !1 : typeof t == "string" ? q(t).some(
    (i) => nt(i, e, n, r + 1)
  ) : Array.isArray(t) ? t.some(
    (i) => nt(i, e, n, r + 1)
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
    (i) => nt(i, e, n, r + 1)
  ));
}
function rt(t, e, n) {
  if (t == null || n > 12)
    return null;
  if (typeof t == "string") {
    const i = t.trim();
    if (!i || !i.startsWith("{") && !i.startsWith("["))
      return null;
    try {
      return rt(JSON.parse(i), e, n + 1);
    } catch {
      return null;
    }
  }
  if (Array.isArray(t)) {
    for (const i of t) {
      const o = rt(i, e, n + 1);
      if (o)
        return o;
    }
    return null;
  }
  if (!w(t) || e.has(t))
    return null;
  e.add(t);
  const r = ei(t);
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
    const o = rt(t[i], e, n + 1);
    if (o)
      return o;
  }
  return null;
}
function ei(t) {
  if (String(t.type || "").trim().toLowerCase() !== "storyboard_grid" || !Array.isArray(t.frames))
    return null;
  const e = t.frames.map(ni).filter((n) => !!n).sort((n, r) => n.order - r.order);
  return e.length < 2 || e.length > Rr ? null : {
    type: "storyboard_grid",
    version: Math.max(1, Math.trunc(Number(t.version) || 1)),
    title: T(t.title, "宫格图片"),
    summary: T(t.summary),
    frames: e
  };
}
function ni(t, e) {
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
    image: ri(
      t.image,
      t.image_url,
      t.imageUrl
    ),
    error: T(t.error),
    assetID: se(t.asset_id, t.assetId, t.assetID),
    assetVersionID: se(
      t.asset_version_id,
      t.assetVersionId,
      t.assetVersionID
    )
  };
}
function ri(...t) {
  for (const e of t) {
    const n = Yt(["image"]);
    ft(n, e, { kind: "image" });
    const r = n.image.values().next().value;
    if (r?.url)
      return r.url;
  }
  return "";
}
function se(...t) {
  for (const e of t) {
    const n = Math.trunc(Number(e) || 0);
    if (n > 0)
      return n;
  }
  return 0;
}
function ii(t) {
  return w(t) ? t.type === "doc" && Array.isArray(t.content) ? t : w(t.rich) && t.rich.type === "doc" && Array.isArray(t.rich.content) ? t.rich : null : null;
}
function tn(t) {
  return w(t) ? t.type === "text" ? !Array.isArray(t.marks) || t.marks.length === 0 : t.type === "hardBreak" ? !0 : St(t) ? !!on(t) : t.type !== "doc" && t.type !== "paragraph" ? !1 : Array.isArray(t.content) && t.content.every(tn) : !1;
}
function en(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : St(t) ? `![${oi(
    String(t.attrs?.alt || t.attrs?.caption || "图片")
  )}](<${si(on(t))}>)` : Array.isArray(t.content) ? t.content.map(en).join("") : "";
}
function nn(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : St(t) ? "" : Array.isArray(t.content) ? t.content.map(nn).join("") : "";
}
function rn(t) {
  return St(t) || !!t.content?.some((e) => rn(e));
}
function St(t) {
  return ["image", "mediaImage", "editorMediaImage"].includes(
    String(t.type || "")
  );
}
function on(t) {
  return String(t.attrs?.src || "").trim();
}
function oi(t) {
  return t.replace(/([\\\[\]])/g, "\\$1");
}
function si(t) {
  return t.replace(/</g, "%3C").replace(/>/g, "%3E");
}
const Dt = 9, sn = 2, ai = 50, ae = /* @__PURE__ */ new Set([
  "未命名",
  "未命名分镜",
  "分镜",
  "分镜脚本",
  "暂无内容简介",
  "围绕当前主题展开并完成一个连贯事件"
]), ci = [
  "none",
  "fade",
  "crossfade",
  "fadeblack",
  "fadewhite",
  "wipeleft",
  "wiperight"
], qo = {
  none: "硬切",
  fade: "淡化",
  crossfade: "交叉溶解",
  fadeblack: "黑场淡化",
  fadewhite: "白场淡化",
  wipeleft: "向左擦除",
  wiperight: "向右擦除"
}, ui = ["photoreal", "stylized"], Xo = {
  photoreal: "写实影像",
  stylized: "非写实影像"
}, di = [
  "16:9",
  "9:16",
  "1:1",
  "4:3",
  "3:4",
  "21:9"
], li = "16:9", Zo = {
  character: "角色",
  scene: "场景",
  prop: "道具"
}, fi = [
  "shot_images",
  "final_video",
  "shot_videos",
  "storyboard_only"
], Q = {
  output_target: "shot_images",
  voice_mode: "auto",
  subtitle_mode: "auto",
  lip_sync_mode: "off"
};
function an(t, e) {
  return e > 0 && (t.match_previous || t.continue_previous);
}
const mi = [
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
function pi(t) {
  return U(t, /* @__PURE__ */ new Set(), 0);
}
function Qo(t, e) {
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
function ts(t) {
  return t.timeline_duration_ms && t.timeline_duration_ms > 0 ? Math.round(t.timeline_duration_ms) / 1e3 : cn(t.shots);
}
function cn(t) {
  return t.reduce(
    (e, n) => e + Math.max(0, Number(n.duration) || 0),
    0
  );
}
function yi(t) {
  return Number.isInteger(t) && t >= sn;
}
function es(t, e) {
  const n = new Map(
    t.materials.map((r) => [r.id, r])
  );
  return e.material_ids.map((r) => n.get(r)).filter((r) => !!r);
}
function ns(t) {
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
    shot_image_mode: dt,
    match_previous: !1,
    continue_previous: !1,
    continuity_anchor: "",
    continuity_state: { entry: "", exit: "" },
    speech: [],
    captions: []
  };
}
function rs(t, e) {
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
function is(t, e) {
  const n = [], r = [];
  for (const i of t.shots) {
    i.material_ids.includes(e) && n.push(i.id);
    for (const o of i.speech)
      o.character_id === e && r.push(o.id);
  }
  return { shotIds: n, speechIds: r };
}
function os(t, e = "dialogue") {
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
function ss(t) {
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
function hi(t) {
  const e = wn(t.workflow), n = Gt(t.references), r = new Set(n.map((c) => c.key)), i = new Set(
    t.materials.map((c) => c.id)
  ), o = t.shots.map((c, u) => {
    const f = u > 0 ? yn(c.transition_type) : "none", l = Math.round(
      Number(c.transition_duration_ms)
    ), d = u > 0 && !!c.continue_previous, m = u > 0 && !d && !!c.match_previous;
    return {
      ...c,
      id: c.id || `shot-${u + 1}`,
      order: u + 1,
      transition: u > 0 ? c.transition.trim() : "",
      transition_type: f,
      transition_duration_ms: f !== "none" ? Math.min(
        5e3,
        Math.max(
          100,
          Number.isFinite(l) ? l : 100
        )
      ) : 0,
      material_ids: K(c.material_ids).filter(
        (y) => i.has(y)
      ),
      reference_keys: K(c.reference_keys).filter(
        (y) => r.has(y)
      ),
      shot_image_mode: gt({
        ...c,
        match_previous: m,
        continue_previous: d
      }).mode,
      shared_end_shot_id: c.shot_image_mode === "next_first" && c.shared_end_shot_id || "",
      match_previous: m,
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
    version: Dt,
    workflow: e,
    production_plan: Jt(
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
      reference_keys: K(c.reference_keys).filter(
        (u) => r.has(u)
      )
    })),
    shots: o
  };
}
function un(t) {
  const e = w(t) ? t : {};
  return {
    entry: x(e.entry).trim(),
    exit: x(e.exit).trim()
  };
}
function as(t, e) {
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
function cs(t) {
  return t.workflow.status === "confirmed";
}
function Jt(t, e) {
  const n = w(t) ? t : {}, r = x(n.output_target).toLowerCase(), i = {
    output_target: fi.includes(
      r
    ) ? r : Q.output_target,
    voice_mode: It(
      n.voice_mode,
      Q.voice_mode
    ),
    subtitle_mode: It(
      n.subtitle_mode,
      Q.subtitle_mode
    ),
    lip_sync_mode: It(
      n.lip_sync_mode,
      Q.lip_sync_mode
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
function us(t, e) {
  return {
    ...Jt(
      t.production_plan,
      t.work_type
    ),
    output_target: "final_video",
    lip_sync_mode: t.work_type !== "mv" && e && t.shots.some(mn) ? "auto" : "off"
  };
}
function ds(t) {
  return t.production_plan.output_target !== "storyboard_only";
}
function dn(t) {
  return ["shot_videos", "final_video"].includes(
    t.production_plan.output_target
  );
}
function ls(t) {
  return t.production_plan.output_target === "final_video";
}
function ln(t) {
  return t.work_type === "mv";
}
function gi(t) {
  return !ln(t) && dn(t) && t.production_plan.voice_mode === "auto" && _i(t) > 0;
}
function fs(t) {
  return !ln(t) && dn(t) && t.production_plan.subtitle_mode === "auto" && bi(t) > 0;
}
function ms(t) {
  return gi(t) && t.production_plan.lip_sync_mode === "auto" && t.shots.some(mn);
}
function _i(t) {
  return t.shots.reduce(
    (e, n) => e + n.speech.filter(Di).length,
    0
  );
}
function bi(t) {
  return t.shots.reduce(
    (e, n) => e + wi(n).length,
    0
  );
}
function wi(t) {
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
function ps(t) {
  return new Set(
    t.speech.filter(fn).map((e) => e.character_id?.trim()).filter((e) => !!e)
  );
}
function ys(t) {
  return `${t.title.trim() || "分镜脚本"} · ${t.shots.length} 个镜头`;
}
function hs(t) {
  return t.summary.trim() || hn("", t.shots);
}
function gs(t, e) {
  return { ...t, style_prompt: e };
}
function pn(t) {
  const e = x(t);
  return di.includes(e) ? e : li;
}
function yn(t) {
  const e = x(t);
  return ci.includes(e) ? e : "none";
}
function U(t, e, n) {
  if (t == null || n > 10)
    return null;
  if (typeof t == "string") {
    for (const a of q(t)) {
      const c = U(a, e, n + 1);
      if (c)
        return c;
    }
    return null;
  }
  if (typeof t != "object" || e.has(t))
    return null;
  if (e.add(t), Array.isArray(t)) {
    for (const a of t) {
      const c = U(a, e, n + 1);
      if (c)
        return c;
    }
    return null;
  }
  const r = t, i = Si(r);
  if (i)
    return i;
  const o = Oi(r);
  if (o) {
    const a = U(o, e, n + 1);
    if (a)
      return a;
  }
  for (const a of mi) {
    const c = r[a];
    if (c == null || c === t)
      continue;
    const u = U(c, e, n + 1);
    if (u)
      return u;
  }
  return null;
}
function Si(t) {
  const e = x(t.visual_mode).toLowerCase(), n = Ni(t.work_type);
  let r;
  try {
    r = _t(t.min_shot_duration);
  } catch {
    return null;
  }
  if (x(t.type).toLowerCase() !== "storyboard" || R(t.version) !== Dt || typeof t.title != "string" || typeof t.narrator_voice != "string" || typeof t.style_prompt != "string" || !Mi(e) || !n || !Array.isArray(t.references) || !Array.isArray(t.materials) || !Array.isArray(t.shots))
    return null;
  const i = w(t.workflow) && t.workflow.status === "draft", o = Ai(t.storyline);
  if (!o)
    return null;
  const a = Gt(t.references);
  if (a.length !== t.references.length)
    return null;
  const c = t.materials.map(gn);
  if (c.some((A) => !A))
    return null;
  const u = c, f = /* @__PURE__ */ new Set();
  for (const A of u) {
    if (f.has(A.id))
      return null;
    f.add(A.id);
  }
  const l = /* @__PURE__ */ new Set(), d = t.shots.map(
    (A, h) => _n(A, h, f, i)
  );
  if (d.some((A) => !A))
    return null;
  const m = d;
  for (const [A, h] of m.entries()) {
    if (l.has(h.id) || !i && an(h, A) && h.continuity_state.entry !== m[A - 1].continuity_state.exit)
      return null;
    l.add(h.id);
  }
  const y = R(t.target_duration), _ = R(t.target_shot_count);
  if (y == null || !Number.isInteger(y) || y < sn || _ == null || !Number.isInteger(_) || _ < 1 || _ > ai)
    return null;
  const b = xi(t, n);
  if (b === null)
    return null;
  const p = wn(t.workflow), N = hn(
    x(t.summary),
    m
  ), M = {
    ...t,
    type: "storyboard",
    version: Dt,
    work_type: n,
    workflow: p,
    production_plan: Jt(
      t.production_plan,
      n
    ),
    title: Ii(t.title, N, m),
    summary: N,
    target_duration: y,
    target_shot_count: _,
    min_shot_duration: r,
    ...b,
    lyrics_lrc: n === "mv" ? x(t.lyrics_lrc) : "",
    narrator_voice: t.narrator_voice.trim(),
    storyline: o,
    style_prompt: t.style_prompt,
    visual_mode: e,
    aspect_ratio: pn(t.aspect_ratio),
    references: a,
    materials: u,
    shots: m
  };
  return hi(M);
}
function xi(t, e) {
  if ([
    t.storyboard_range_start_ms,
    t.storyboard_range_end_ms,
    t.storyboard_soundtrack_duration_ms,
    t.timeline_duration_ms
  ].every((c) => c == null || c === ""))
    return {};
  const r = Z(t.storyboard_range_start_ms), i = Z(t.storyboard_range_end_ms), o = Z(
    t.storyboard_soundtrack_duration_ms
  ), a = Z(t.timeline_duration_ms);
  return e !== "mv" || r == null || i == null || o == null || a == null || ![r, i, o, a].every(
    Number.isInteger
  ) || r < 0 || i <= r || i > o || a !== i - r ? null : {
    storyboard_range_start_ms: r,
    storyboard_range_end_ms: i,
    storyboard_soundtrack_duration_ms: o,
    timeline_duration_ms: a
  };
}
function Ni(t) {
  const e = x(t).toLowerCase();
  return e ? xr(e) ? e : null : "short";
}
function Ai(t) {
  if (!w(t))
    return null;
  const e = x(t.setup), n = x(t.development), r = x(t.payoff);
  return { setup: e, development: n, payoff: r };
}
function hn(t, e) {
  const n = t.trim();
  if (n)
    return n;
  const r = e.map((i) => i.description.trim()).filter(Boolean);
  return r.length > 0 ? r.join("；") : "暂无内容简介";
}
function Ii(t, e, n) {
  const r = t.trim();
  if (r && !ae.has(r))
    return r;
  const i = [e, n[0]?.beat, n[0]?.description].map((a) => String(a || "").trim()).find((a) => a && !ae.has(a));
  if (!i)
    return "分镜脚本";
  const o = i.split(/[\r\n。！？!?；;]/, 1)[0].trim();
  return Array.from(o).slice(0, 24).join("") || "分镜脚本";
}
function Mi(t) {
  return ui.includes(t);
}
function gn(t) {
  if (!w(t))
    return null;
  const e = x(t.type).toLowerCase();
  return !Ti(e) || typeof t.id != "string" || !t.id.trim() || typeof t.name != "string" || typeof t.prompt != "string" || typeof t.voice != "string" || !Array.isArray(t.reference_keys) ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    name: t.name.trim().replace(/^[@#]+/, ""),
    prompt: t.prompt.trim(),
    voice: e === "character" ? t.voice.trim() : "",
    reference_keys: K(t.reference_keys.map(x))
  };
}
function _n(t, e, n, r = !1) {
  if (!w(t) || typeof t.id != "string" || !t.id.trim() || typeof t.beat != "string" || !r && !t.beat.trim() || typeof t.transition != "string" || typeof t.transition_type != "string" || typeof t.match_previous != "boolean" || typeof t.description != "string" || t.spatial_layout != null && typeof t.spatial_layout != "string" || t.start_framing != null && typeof t.start_framing != "string" || t.end_framing != null && typeof t.end_framing != "string" || typeof t.camera_instruction != "string" || typeof t.video_prompt != "string" || typeof t.continue_previous != "boolean" || typeof t.continuity_anchor != "string" || !w(t.continuity_state) || typeof t.continuity_state.entry != "string" || typeof t.continuity_state.exit != "string" || !Array.isArray(t.material_ids) || !Array.isArray(t.reference_keys) || !Array.isArray(t.speech) || !Array.isArray(t.captions))
    return null;
  const i = R(t.duration);
  if (i == null || !yi(i))
    return null;
  const o = t.material_ids.map(x);
  if (o.some((p) => !p || !n.has(p)) || new Set(o).size !== o.length)
    return null;
  const a = t.speech.map(ki);
  if (a.some((p) => !p))
    return null;
  const c = t.captions.map(Ci);
  if (c.some(
    (p) => !p || p.end_time > i
  ))
    return null;
  const u = e > 0 && t.continue_previous;
  if (e === 0 && (t.match_previous || t.continue_previous) || t.match_previous && t.continue_previous)
    return null;
  const f = e > 0 && !u && t.match_previous, l = gt({
    shot_image_mode: t.shot_image_mode,
    match_previous: f,
    continue_previous: u
  }).mode, d = t.transition.trim();
  if (!r && e > 0 && !d)
    return null;
  const m = t.continuity_anchor.trim();
  if (!r && u && !m)
    return null;
  const y = un(
    t.continuity_state
  );
  if (!r && (!y.entry || !y.exit))
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
    spatial_layout: x(t.spatial_layout),
    start_framing: x(t.start_framing),
    end_framing: x(t.end_framing),
    camera_instruction: t.camera_instruction,
    video_prompt: t.video_prompt,
    material_ids: o,
    reference_keys: K(t.reference_keys.map(x)),
    shot_image_mode: l,
    shared_end_shot_id: l === "next_first" ? x(t.shared_end_shot_id) : "",
    match_previous: f,
    continue_previous: u,
    continuity_anchor: u ? m : "",
    continuity_state: y,
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
function ki(t) {
  if (!w(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string" || typeof t.subtitle_enabled != "boolean" || typeof t.subtitle_text != "string")
    return null;
  const e = x(t.kind).toLowerCase(), n = R(t.start_time);
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
  const r = x(t.speaker_mode).toLowerCase();
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
function Ci(t) {
  if (!w(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string")
    return null;
  const e = x(t.type).toLowerCase(), n = R(t.start_time), r = R(t.end_time);
  return !Ri(e) || n == null || r == null || n < 0 || r <= n ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    text: t.text,
    start_time: n,
    end_time: r
  };
}
function wn(t) {
  const e = w(t) ? t : {}, n = x(e.status).toLowerCase() === "confirmed" ? "confirmed" : "draft";
  return {
    status: n,
    confirmed_at: n === "confirmed" ? x(e.confirmed_at) : ""
  };
}
function It(t, e) {
  const n = x(t).toLowerCase();
  return n === "auto" || n === "off" ? n : e;
}
function Oi(t) {
  const e = qr(t);
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
    return x(t.text);
  if (t.type === "hardBreak")
    return `
`;
  if (!Array.isArray(t.content))
    return "";
  const e = t.type === "doc" || t.type === "paragraph" || t.type === "codeBlock" ? `
` : "";
  return t.content.map(Sn).join(e);
}
function Ti(t) {
  return t === "character" || t === "scene" || t === "prop";
}
function Ri(t) {
  return t === "caption" || t === "title" || t === "highlight";
}
function Di(t) {
  return t.text.trim().length > 0;
}
function K(t) {
  return [...new Set(t.map((e) => e.trim()).filter(Boolean))];
}
function R(t) {
  const e = typeof t == "number" ? t : Number.NaN;
  return Number.isFinite(e) ? e : null;
}
await window.DeverFront?.ensureCompat?.(["@/page/nodes/show/tooltip"]);
const Et = window.DeverFront?.sdk?.getCompatModule("@/page/nodes/show/tooltip");
if (!Et || Object.keys(Et).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/page/nodes/show/tooltip");
const Ei = Et.HoverTip, Pi = 12e3;
function pt({
  label: t,
  side: e = "top",
  sideOffset: n = 7,
  className: r = "",
  children: i
}) {
  return /* @__PURE__ */ s(
    Ei,
    {
      content: t,
      side: e,
      sideOffset: n,
      layerZIndex: Pi,
      className: `max-w-80 whitespace-normal break-words ${r}`.trim(),
      children: i
    }
  );
}
const xn = {
  image: "images",
  audio: "audios",
  video: "videos",
  file: "files"
};
function Nn(t, e) {
  const n = xn[t], r = n ? Wt(e, t) : [];
  if (n && r.length > 0)
    return { [n]: r };
  const i = Ut(e);
  if (!i)
    return e;
  const o = He(i);
  return o && (t === "text" || Xr(o.plainText)) ? { text: o.markdown } : { rich: i };
}
function Li(t, e) {
  return Wt(t, e)[0] || "";
}
function Wt(t, e) {
  return An(t, e).map((n) => n.url);
}
function An(t, e) {
  return $i(e) ? jr(t, e) : [];
}
function _s(t, e) {
  if (!xn[e])
    return 0;
  const n = Wt(t, e).length;
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
function $i(t) {
  return t === "image" || t === "video" || t === "audio" || t === "file";
}
function yt(t, e = 0) {
  if (e > 8 || t == null) return "";
  if (typeof t == "string") return In(t) ? "" : t.trim();
  if (Array.isArray(t))
    return t.map((r) => yt(r, e + 1)).filter(Boolean)[0] || "";
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
    const i = yt(n[r], e + 1);
    if (i) return i;
  }
  return "";
}
function bs(t) {
  const e = t?.source?.prompt;
  return typeof e == "string" ? e.trim() : "";
}
function zi(t) {
  const e = Li(t, "file"), n = it(t) || Qn(e), r = n.match(/\.([a-z0-9]{1,10})$/i)?.[1] || "";
  return { url: e, name: n, extension: r };
}
function it(t, e = 0) {
  if (t == null || e > 8) return "";
  if (typeof t == "string") {
    const r = t.trim();
    return In(r) ? "" : r;
  }
  if (Array.isArray(t)) {
    for (const r of t) {
      const i = it(r, e + 1);
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
    const i = it(n[r], e + 1);
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
    const i = it(n[r], e + 1);
    if (i) return i;
  }
  return "";
}
function In(t) {
  return /^(https?:\/\/|\/|data:|blob:)/.test(t.trim());
}
const Fi = [
  "title",
  "text",
  "reasoning",
  "progress",
  "error",
  "json"
], Bi = /* @__PURE__ */ new Set([
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
]), ji = /* @__PURE__ */ new Set([
  "agentabilityplaceholder",
  "agenttaskplaceholder",
  "horizontalrule"
]);
function Ui({
  items: t,
  mediaCount: e,
  previewMediaURL: n,
  outputMediaURLs: r = []
}) {
  if (t.length > 1 || e > 1)
    return !0;
  const i = e === 1 && J(n) !== "" && r.length === 1 && J(r[0]) === J(n);
  return t.some(
    (o) => Vi(o, i)
  );
}
function Vi(t, e) {
  return Pt(t) ? Fi.some((n) => st(t[n])) ? !0 : st(t.rich) ? !e || ot(t.rich, /* @__PURE__ */ new Set(), 0) : !1 : st(t);
}
function ot(t, e, n) {
  if (t == null || t === "")
    return !1;
  if (n > 32)
    return !0;
  if (typeof t == "string") {
    const i = t.trim();
    if (!i)
      return !1;
    try {
      return ot(
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
      (i) => ot(i, e, n + 1)
    );
  if (!Pt(t) || e.has(t))
    return !0;
  e.add(t);
  const r = Gi(t.type);
  if (r === "text")
    return J(t.text) !== "";
  if (Bi.has(r)) {
    const i = Pt(t.attrs) ? t.attrs : void 0;
    return st(i?.caption);
  }
  return ji.has(r) ? !0 : Array.isArray(t.content) ? t.content.some(
    (i) => ot(i, e, n + 1)
  ) : !1;
}
function st(t) {
  return t == null ? !1 : typeof t == "string" ? t.trim() !== "" : Array.isArray(t) ? t.length > 0 : typeof t == "object" ? Object.keys(t).length > 0 : !0;
}
function Pt(t) {
  return t != null && typeof t == "object" && !Array.isArray(t);
}
function Gi(t) {
  return J(t).toLowerCase().replace(/[\s_-]+/g, "");
}
function J(t) {
  return typeof t == "string" ? t.trim() : "";
}
function ws(t, e) {
  if (Hi(t, e))
    return !1;
  const n = Ye(t), r = Qe(t), i = Mn(e);
  return Ui({
    items: r,
    mediaCount: n,
    previewMediaURL: i?.url,
    outputMediaURLs: i ? Ke(t, i.kind).map(
      (o) => o.url
    ) : []
  });
}
function vi(t, e) {
  if (!e)
    return null;
  const n = Ke(t, e);
  return n.length > 1 ? { kind: e, items: n } : null;
}
function Ss(t) {
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
function Hi(t, e) {
  const n = Lt(t, /* @__PURE__ */ new Set(), 0);
  return !n || !e ? !1 : [
    e.imageUrl,
    e.videoUrl,
    e.audioUrl,
    e.fileUrl
  ].some((r) => String(r || "").trim() === n);
}
function Lt(t, e, n) {
  if (t == null || n > 12)
    return "";
  if (typeof t == "string")
    return t.trim();
  if (Array.isArray(t))
    return t.length === 1 ? Lt(t[0], e, n + 1) : "";
  if (typeof t != "object" || e.has(t))
    return "";
  e.add(t);
  const i = Object.entries(t).filter(
    ([o, a]) => !["type", "kind", "format", "version"].includes(o) && bt(a)
  ).map(([, o]) => o);
  return i.length === 1 ? Lt(i[0], e, n + 1) : "";
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const $t = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!$t || Object.keys($t).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const ce = $t, ue = ce.ContentView || ce.EnergonContentView;
function qt({
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
  return ue ? /* @__PURE__ */ s(at, { className: i, children: /* @__PURE__ */ s(
    ue,
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
  return bt(t) ? t : e ? { text: e } : t;
}
function at({
  className: t,
  children: e
}) {
  const n = (r) => {
    Yi(r.target) && r.stopPropagation();
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
function Yi(t) {
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
const $ = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dropdown-menu");
if (!$ || Object.keys($).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dropdown-menu");
const Ki = $.DropdownMenu, Ji = $.DropdownMenuContent, Wi = $.DropdownMenuItem, qi = $.DropdownMenuTrigger, zt = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!zt || Object.keys(zt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const Xi = zt.EnergonAudioPlayer, Zi = {
  image: "图片",
  video: "视频",
  audio: "音频"
}, Qi = {
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
  const f = Ht(t), l = De(f);
  return /* @__PURE__ */ g("header", { className: "ws-media-grid-toolbar", children: [
    /* @__PURE__ */ g("div", { className: "ws-media-grid-toolbar-main", children: [
      o,
      /* @__PURE__ */ g(Ki, { modal: !1, children: [
        /* @__PURE__ */ s(qi, { asChild: !0, children: /* @__PURE__ */ g(
          "button",
          {
            type: "button",
            className: "ws-media-grid-layout-trigger nodrag nopan",
            disabled: i || !c,
            "aria-label": "选择每页宫格布局",
            onClick: (d) => d.stopPropagation(),
            children: [
              /* @__PURE__ */ s(Vn, { size: 14 }),
              l.label,
              /* @__PURE__ */ s(ye, { size: 12 })
            ]
          }
        ) }),
        /* @__PURE__ */ s(
          Ji,
          {
            align: "start",
            className: "ws-media-grid-layout-menu",
            onClick: (d) => d.stopPropagation(),
            children: ut.map((d) => /* @__PURE__ */ g(
              Wi,
              {
                className: "ws-media-grid-layout-item",
                onSelect: () => {
                  u(0), c?.(d.value);
                },
                children: [
                  /* @__PURE__ */ s("span", { children: d.label }),
                  /* @__PURE__ */ s("small", { children: d.value === "auto" ? "按结果排版" : `每页 ${d.capacity} 格` }),
                  d.value === f ? /* @__PURE__ */ s(he, { size: 13 }) : null
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
function to({
  kind: t,
  items: e,
  label: n,
  compact: r = !1
}) {
  const [i, o] = k("auto"), a = Cn(e.length, i), c = r ? Or(e.length) : a.shape, u = r ? 0 : a.pageOffset, f = e.slice(u, u + c.capacity), l = Array.from(
    { length: c.capacity },
    (y, _) => f[_]
  ), d = Zi[t], m = Qi[t];
  return /* @__PURE__ */ g(
    "section",
    {
      className: `ws-media-grid-view is-${t}${r ? " is-compact" : ""}`,
      children: [
        r ? /* @__PURE__ */ s(
          "span",
          {
            className: "ws-media-grid-compact-count",
            "aria-label": `共 ${e.length} ${m}`,
            children: e.length > c.capacity ? `共${e.length}${m}` : `${e.length}${m}`
          }
        ) : /* @__PURE__ */ s(
          On,
          {
            layout: i,
            countLabel: `${e.length} ${m}`,
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
            children: l.map((y, _) => {
              const b = u + _, p = `${n || d} ${b + 1}`;
              return y ? /* @__PURE__ */ s(
                "figure",
                {
                  className: t === "audio" ? "is-audio" : void 0,
                  "aria-label": t === "audio" ? p : void 0,
                  children: /* @__PURE__ */ s(eo, { kind: t, item: y, label: p })
                },
                `${y.url}-${b}`
              ) : /* @__PURE__ */ s("figure", { className: "is-empty" }, `empty-${b}`);
            })
          }
        ) })
      ]
    }
  );
}
function eo({
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
          Xi,
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
function no(t) {
  if (!t) return !1;
  const e = document.querySelectorAll('[data-slot="dialog-layer"]');
  return e.item(e.length - 1)?.contains(t) || !1;
}
const xs = 10040;
function ro({
  ariaLabel: t,
  header: e,
  children: n,
  onRequestClose: r,
  onEscape: i,
  layer: o = "default"
}) {
  const a = ht(null);
  W(() => {
    const u = (f) => {
      f.key !== "Escape" || f.defaultPrevented || !no(a.current) || (f.preventDefault(), f.stopImmediatePropagation(), (i || r)());
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
function io({
  icon: t,
  title: e,
  subtitle: n,
  titleStatus: r,
  versionSelect: i,
  state: o,
  updatedAt: a,
  actions: c,
  downloadUrl: u,
  onClose: f
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
      u ? /* @__PURE__ */ s(pt, { label: "下载内容", children: /* @__PURE__ */ s(
        tr,
        {
          url: u,
          name: e,
          className: "wb-detail-icon-button"
        }
      ) }) : null,
      /* @__PURE__ */ s(pt, { label: "关闭", children: /* @__PURE__ */ s(
        "button",
        {
          type: "button",
          className: "wb-detail-icon-button",
          onClick: f,
          "aria-label": "关闭详情",
          children: /* @__PURE__ */ s(Hn, { size: 18 })
        }
      ) })
    ] })
  ] });
}
function Ns({
  options: t,
  currentVersionId: e,
  selectedVersionId: n,
  total: r,
  hasMore: i,
  loading: o,
  loadingMore: a,
  error: c,
  disabled: u = !1,
  onSelect: f,
  onLoadMore: l,
  onRetry: d
}) {
  const [m, y] = k(!1), _ = ht(null), b = t.find((p) => p.id === n) || t.find((p) => p.id === e);
  return W(() => {
    if (!m) return;
    const p = (N) => {
      _.current?.contains(N.target) || y(!1);
    };
    return document.addEventListener("mousedown", p), () => document.removeEventListener("mousedown", p);
  }, [m]), !n && !o ? null : /* @__PURE__ */ g("div", { className: "wb-detail-version-select", ref: _, children: [
    /* @__PURE__ */ g(
      "button",
      {
        type: "button",
        className: "wb-detail-version-trigger",
        "aria-haspopup": "listbox",
        "aria-expanded": m,
        disabled: u || o && t.length === 0,
        onClick: () => y((p) => !p),
        children: [
          o && t.length === 0 ? /* @__PURE__ */ s(V, { size: 12, className: "wb-detail-spin" }) : null,
          /* @__PURE__ */ s("span", { children: le(b?.version) }),
          r > 0 ? /* @__PURE__ */ g("small", { children: [
            r,
            " 个版本"
          ] }) : null,
          /* @__PURE__ */ s(ye, { size: 13 })
        ]
      }
    ),
    m ? /* @__PURE__ */ s("div", { className: "wb-detail-version-menu", role: "listbox", children: /* @__PURE__ */ g(
      "div",
      {
        className: "wb-detail-version-options",
        onScroll: (p) => {
          const N = p.currentTarget;
          i && !a && N.scrollHeight - N.scrollTop - N.clientHeight < 36 && l();
        },
        children: [
          t.length > 0 ? t.map((p) => {
            const N = p.id === n, M = p.id === e;
            return /* @__PURE__ */ g(
              "button",
              {
                type: "button",
                role: "option",
                "aria-selected": N,
                className: N ? "is-selected" : "",
                onClick: () => {
                  y(!1), f(p.value);
                },
                children: [
                  /* @__PURE__ */ g("span", { children: [
                    /* @__PURE__ */ s("strong", { children: le(p.version) }),
                    M ? /* @__PURE__ */ s("small", { children: "当前" }) : null
                  ] }),
                  /* @__PURE__ */ s("time", { children: oo(p.updatedAt) }),
                  N ? /* @__PURE__ */ s(he, { size: 13 }) : /* @__PURE__ */ s("i", { "aria-hidden": "true" })
                ]
              },
              p.id
            );
          }) : c ? /* @__PURE__ */ s(de, { error: c, onRetry: d }) : /* @__PURE__ */ g("div", { className: "wb-detail-version-message", children: [
            o ? /* @__PURE__ */ s(V, { size: 14, className: "wb-detail-spin" }) : null,
            /* @__PURE__ */ s("span", { children: o ? "正在读取版本" : "暂无版本" })
          ] }),
          c && t.length > 0 ? /* @__PURE__ */ s(de, { error: c, onRetry: d }) : null,
          a ? /* @__PURE__ */ g("div", { className: "wb-detail-version-loading", children: [
            /* @__PURE__ */ s(V, { size: 13, className: "wb-detail-spin" }),
            "正在加载更多"
          ] }) : null
        ]
      }
    ) }) : null
  ] });
}
function de({
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
function le(t) {
  const e = Number(t || 0);
  return e > 0 ? `第${e}版` : "版本";
}
function oo(t) {
  const e = String(t || "").trim();
  return e ? e.replace("T", " ").replace(/\.\d+(Z)?$/, "").replace(/Z$/, "") : "";
}
function so({
  items: t,
  initialItemID: e,
  onClose: n
}) {
  const r = fe(t, e), [i, o] = k(r), a = t.map((f) => `${String(f.id)}:${f.url}`).join(`
`);
  W(() => {
    o(fe(t, e));
  }, [e, a]);
  const c = Math.min(
    Math.max(0, i),
    Math.max(0, t.length - 1)
  ), u = t[c];
  return u ? /* @__PURE__ */ s(
    ro,
    {
      ariaLabel: "图片预览",
      layer: "nested",
      onRequestClose: n,
      header: /* @__PURE__ */ s(
        io,
        {
          icon: /* @__PURE__ */ s(ge, { size: 16 }),
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
function fe(t, e) {
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
  showCaptions: f = !0,
  columns: l,
  rows: d,
  frameOffset: m = 0,
  previewFrames: y
}) {
  const [_, b] = k(
    null
  ), p = zn(
    () => (y || t.frames).filter((h) => !!h.image).map((h) => ({
      id: h.id || h.order,
      name: h.title || `画面 ${h.order}`,
      url: h.image,
      thumbnail: h.image
    })),
    [t.frames, y]
  ), N = Math.max(
    t.frames.length,
    Math.trunc(Number(c) || 0)
  ), M = Array.from(
    { length: N },
    (h, D) => t.frames[D]
  ), A = {
    ...l ? { gridTemplateColumns: `repeat(${l}, minmax(0, 1fr))` } : {},
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
        style: A,
        children: M.map((h, D) => {
          const C = m + D;
          return h ? /* @__PURE__ */ g("figure", { className: h.image ? "" : "is-empty", children: [
            h.image ? /* @__PURE__ */ s(
              ao,
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
                children: /* @__PURE__ */ s(G, { size: 18 })
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
                children: /* @__PURE__ */ s(G, { size: 14 })
              }
            ) : null,
            f ? /* @__PURE__ */ g("figcaption", { children: [
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
              children: /* @__PURE__ */ s(G, { size: 18 })
            }
          ) : null }, `empty-${C}`);
        })
      }
    ),
    _ != null && p.length > 0 ? /* @__PURE__ */ s(
      so,
      {
        items: p,
        initialItemID: _,
        onClose: () => b(null)
      }
    ) : null
  ] });
}
function ao({
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
function As({
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
  const f = Ht(c), l = t?.frames.length || 0, d = Cn(l, f), m = t ? {
    ...t,
    frames: t.frames.slice(
      d.pageOffset,
      d.pageOffset + d.shape.capacity
    )
  } : null, y = t?.frames.filter((b) => b.image).length || 0, _ = l > 0 && y !== l ? `${y}/${l} 张` : `${l} 张`;
  return /* @__PURE__ */ g(
    "section",
    {
      className: `ws-storyboard-grid-canvas ${n ? "is-running" : ""}`,
      children: [
        /* @__PURE__ */ s(
          On,
          {
            layout: f,
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
                    /* @__PURE__ */ s(G, { size: 14 }),
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
        /* @__PURE__ */ s("div", { className: "ws-storyboard-grid-canvas-body nowheel", children: m ? /* @__PURE__ */ s(
          Tn,
          {
            grid: m,
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
            children: Array.from({ length: d.shape.capacity }, (b, p) => /* @__PURE__ */ s(
              "button",
              {
                type: "button",
                className: "nodrag nopan",
                disabled: n || !o,
                title: "导入图片",
                "aria-label": `向宫格导入图片，第 ${p + 1} 格`,
                onClick: (N) => {
                  N.stopPropagation(), o?.(p);
                },
                children: /* @__PURE__ */ s(G, { size: 18 })
              },
              p
            ))
          }
        ) })
      ]
    }
  );
}
const co = Fn(
  () => import("./space-storyboard-view-DZvikRbe.js").then((t) => ({
    default: t.StoryboardView
  }))
);
function Is({
  output: t,
  fallback: e = "",
  streaming: n = !1,
  emptyText: r = "暂无内容",
  className: i,
  markdownClassName: o,
  richClassName: a,
  mediaLayout: c = "default",
  mediaGridKind: u,
  compactMediaGrid: f = !1,
  storyboardEditable: l = !1,
  storyboardDisabled: d = !1,
  onStoryboardSave: m
}) {
  const y = kn(t, e), _ = pi(y), b = Je(y);
  if (b)
    return /* @__PURE__ */ s(at, { className: i, children: /* @__PURE__ */ s(Tn, { grid: b }) });
  if (_)
    return /* @__PURE__ */ s(at, { className: i, children: /* @__PURE__ */ s(Bn, { fallback: /* @__PURE__ */ s("div", { className: "min-h-24", "aria-busy": "true" }), children: /* @__PURE__ */ s(
      co,
      {
        storyboard: _,
        editable: l,
        disabled: d,
        onSave: m
      }
    ) }) });
  const p = vi(y, u);
  return p ? /* @__PURE__ */ s(
    at,
    {
      className: [i, "ws-media-grid-content"].filter(Boolean).join(" "),
      children: /* @__PURE__ */ s(
        to,
        {
          kind: p.kind,
          items: p.items,
          label: e,
          compact: f
        }
      )
    }
  ) : /* @__PURE__ */ s(
    qt,
    {
      output: y,
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
const Ft = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!Ft || Object.keys(Ft).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const uo = Ft.EnergonAudioPlayer;
function me({
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
        uo,
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
        /* @__PURE__ */ s(Bt, { "aria-hidden": "true" }),
        /* @__PURE__ */ s("strong", { children: "语音文本" })
      ] }),
      /* @__PURE__ */ s("p", { children: e })
    ] }) : null
  ] }) : i;
}
function pe({
  content: t,
  summary: e,
  compact: n = !1
}) {
  const r = zi(t), i = r.name || e || "文件", o = r.extension ? r.extension.toUpperCase() : "FILE", a = r.extension ? `${r.extension.toUpperCase()} 文件` : "文件";
  return n ? /* @__PURE__ */ g("div", { className: "wb-asset-file-card-preview", children: [
    /* @__PURE__ */ s("strong", { children: o }),
    /* @__PURE__ */ s(pt, { label: i, children: /* @__PURE__ */ s("p", { children: i }) }),
    /* @__PURE__ */ s("span", { children: "文件" })
  ] }) : /* @__PURE__ */ g("section", { className: "wb-asset-file-preview", children: [
    /* @__PURE__ */ s("span", { className: "wb-asset-file-icon", children: /* @__PURE__ */ s(Bt, { "aria-hidden": "true" }) }),
    /* @__PURE__ */ g("div", { className: "wb-asset-file-copy", children: [
      /* @__PURE__ */ s(pt, { label: i, children: /* @__PURE__ */ s("strong", { children: i }) }),
      /* @__PURE__ */ s("span", { children: a })
    ] }),
    r.url ? /* @__PURE__ */ g("a", { href: r.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ s(Jn, { "aria-hidden": "true" }),
      /* @__PURE__ */ s("span", { children: "打开文件" })
    ] }) : /* @__PURE__ */ s("span", { className: "wb-asset-file-unavailable", children: "文件暂不可用" })
  ] });
}
function Mt({
  kind: t,
  src: e,
  poster: n
}) {
  const r = ht(null), [i, o] = k(""), [a, c] = k(""), [u, f] = k(""), l = i === e, d = a === e, m = u === e;
  W(() => {
    const b = r.current;
    if (!e || !b || typeof IntersectionObserver > "u") {
      o(e);
      return;
    }
    const p = new IntersectionObserver(
      (N) => {
        N.some((M) => M.isIntersecting) && (o(e), p.disconnect());
      },
      { rootMargin: "320px 0px" }
    );
    return p.observe(b), () => p.disconnect();
  }, [e]);
  function y() {
    c(e), f("");
  }
  function _() {
    c(""), f(e);
  }
  return /* @__PURE__ */ g(
    "div",
    {
      ref: r,
      className: [
        "wb-asset-lazy-cover",
        `is-${t}`,
        d ? "is-loaded" : "is-pending",
        m ? "is-failed" : ""
      ].filter(Boolean).join(" "),
      children: [
        l && (t === "video" || !m) ? t === "image" ? /* @__PURE__ */ s(
          "img",
          {
            src: e,
            alt: "",
            loading: "lazy",
            decoding: "async",
            onLoad: y,
            onError: _
          }
        ) : /* @__PURE__ */ s(
          _e,
          {
            src: e,
            poster: n,
            style: { position: "absolute", inset: 0 },
            ariaHidden: !0,
            onLoad: y,
            onError: _
          }
        ) : null,
        m ? /* @__PURE__ */ s("span", { children: "封面加载失败" }) : null
      ]
    }
  );
}
function lo({
  kind: t,
  content: e,
  summary: n
}) {
  const r = Nn(t, e), i = n || yt(e) || Re(t), o = ti(r, "storyboard") ? { text: i } : r;
  return /* @__PURE__ */ s("div", { className: `wb-asset-card-text-preview is-${t}`, children: /* @__PURE__ */ s(
    qt,
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
function Ms({
  kind: t,
  content: e,
  summary: n,
  prompt: r,
  compact: i = !1
}) {
  const o = An(e, t), a = o.map((u) => u.url), c = a[0] || "";
  if (!i) {
    const u = t === "audio" ? Wr(e) : null;
    if ((t === "image" || t === "video") && a.length > 0)
      return /* @__PURE__ */ s(
        Qt,
        {
          kind: t,
          mediaItems: o,
          downloadable: !0,
          className: "wb-asset-media-gallery"
        }
      );
    if (t === "audio")
      return o.length > 0 && (o.length > 1 || o[0]?.thumbnail) ? /* @__PURE__ */ s(
        Qt,
        {
          kind: "audio",
          mediaItems: o,
          downloadable: !0,
          className: "wb-asset-media-gallery",
          supplementalText: u
        }
      ) : /* @__PURE__ */ s(me, { src: c, prompt: r, detailed: !0 });
    if (t === "file")
      return /* @__PURE__ */ s(pe, { content: e, summary: n });
    const f = Nn(t, e);
    return /* @__PURE__ */ s(
      qt,
      {
        output: f,
        fallback: n || "",
        emptyText: "该版本暂无可预览内容",
        className: "wb-asset-preview-content",
        markdownClassName: "wb-asset-detail-prose",
        richClassName: "wb-asset-detail-prose",
        mediaLayout: "detail"
      }
    );
  }
  return t === "image" && c ? /* @__PURE__ */ s(Mt, { kind: "image", src: c }) : t === "video" && c ? /* @__PURE__ */ s(
    Mt,
    {
      kind: "video",
      src: c,
      poster: o[0]?.thumbnail
    }
  ) : t === "audio" ? o[0]?.thumbnail ? /* @__PURE__ */ s(Mt, { kind: "image", src: o[0].thumbnail }) : /* @__PURE__ */ s(me, { src: c }) : t === "file" ? /* @__PURE__ */ s(pe, { content: e, summary: n, compact: !0 }) : t === "text" || t === "richtext" ? /* @__PURE__ */ s(lo, { kind: t, content: e, summary: n }) : /* @__PURE__ */ s("div", { className: "wb-asset-card-fallback", children: /* @__PURE__ */ s("p", { children: n || yt(e) || Re(t) }) });
}
function ks({ kind: t }) {
  switch (t) {
    case "collection":
      return /* @__PURE__ */ s(Zn, { "aria-hidden": "true" });
    case "image":
      return /* @__PURE__ */ s(ge, { "aria-hidden": "true" });
    case "audio":
      return /* @__PURE__ */ s(Xn, { "aria-hidden": "true" });
    case "video":
      return /* @__PURE__ */ s(qn, { "aria-hidden": "true" });
    case "file":
      return /* @__PURE__ */ s(Wn, { "aria-hidden": "true" });
    default:
      return /* @__PURE__ */ s(Bt, { "aria-hidden": "true" });
  }
}
export {
  He as $,
  me as A,
  pt as B,
  Is as C,
  xs as D,
  ks as E,
  Je as F,
  ti as G,
  bs as H,
  Oo as I,
  Ar as J,
  Mr as K,
  Ir as L,
  Ro as M,
  _t as N,
  Be as O,
  Mo as P,
  ko as Q,
  Ho as R,
  Tn as S,
  Yo as T,
  Io as U,
  Qr as V,
  An as W,
  Wo as X,
  Ko as Y,
  Qe as Z,
  ys as _,
  Nn as a,
  vo as a$,
  Xr as a0,
  wo as a1,
  T as a2,
  Er as a3,
  Fo as a4,
  Dr as a5,
  gt as a6,
  Zo as a7,
  Ce as a8,
  wr as a9,
  ms as aA,
  fs as aB,
  gi as aC,
  dn as aD,
  ds as aE,
  ps as aF,
  us as aG,
  _i as aH,
  bi as aI,
  mn as aJ,
  ls as aK,
  go as aL,
  _o as aM,
  Ht as aN,
  Vo as aO,
  Gt as aP,
  Le as aQ,
  xr as aR,
  xo as aS,
  Z as aT,
  je as aU,
  Bo as aV,
  $e as aW,
  Go as aX,
  Qo as aY,
  Ut as aZ,
  Po as a_,
  Oe as aa,
  hi as ab,
  os as ac,
  ss as ad,
  an as ae,
  sn as af,
  zo as ag,
  Eo as ah,
  ze as ai,
  ci as aj,
  qo as ak,
  is as al,
  hs as am,
  ui as an,
  Xo as ao,
  di as ap,
  ts as aq,
  ai as ar,
  as,
  rs as at,
  ns as au,
  gs as av,
  qt as aw,
  cn as ax,
  Uo as ay,
  yi as az,
  To as b,
  Fe as b0,
  wi as b1,
  fn as b2,
  jo as b3,
  es as b4,
  ln as b5,
  x as b6,
  Ee as b7,
  Lo as b8,
  $o as b9,
  At as ba,
  bo as bb,
  ws as bc,
  Ss as bd,
  fr as be,
  te as bf,
  qe as bg,
  Xe as bh,
  mt as bi,
  pr as bj,
  No as bk,
  We as bl,
  Jr as bm,
  ir as bn,
  Se as bo,
  Do as bp,
  Rr as bq,
  vi as br,
  As as bs,
  Co as c,
  Zr as d,
  Jo as e,
  Wt as f,
  So as g,
  Ne as h,
  no as i,
  qr as j,
  w as k,
  pi as l,
  cs as m,
  Li as n,
  Ke as o,
  rr as p,
  Wr as q,
  io as r,
  Ao as s,
  oo as t,
  Ns as u,
  ro as v,
  bt as w,
  _s as x,
  Ms as y,
  Re as z
};
