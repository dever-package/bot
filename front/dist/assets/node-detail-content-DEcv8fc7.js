import { V as Wn, r as Jn, R as qn, a as Xn } from "./media-inspector-gallery-Ci5KbK6m.js";
import { a as _, j as c, F as Zn } from "./react-CDpwMNlY.js";
import { e as xe, a as O, b as pt, u as Qn, p as tr, S as er } from "./file-kind-DFeonxO2.js";
import { ba as nr, r as H, j as rr, bb as ir, c as Me, n as Ne, Y as or, d as sr, X as ar, ah as cr, a9 as ur, ab as Y, q as dr, b as lr } from "./vendor-icons-Cz5zFzlk.js";
import { a as fr } from "./preloadable-B6OSmL0f.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./node-detail-content-ucjeAfqr.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/components/media/first-frame-video"]);
const Tt = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!Tt || Object.keys(Tt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const mr = Tt.FirstFrameVideo, pr = 56;
function ae(t, e) {
  const n = t.getBoundingClientRect(), r = Math.min(
    pr,
    n.height * 0.25
  );
  return e >= n.bottom - r;
}
function yr({
  src: t,
  poster: e = "",
  alt: n = "",
  className: r,
  style: i,
  title: o,
  draggable: s = !1,
  ariaLabel: a,
  onLoad: u,
  onError: p,
  onMediaSize: f,
  objectFit: d = "cover",
  allowDragFromVideo: m = !1,
  playButtonOnly: l = !1
}) {
  const b = xe(null), [S, h] = O(""), [x, A] = O(""), [C, g] = O(""), [E, I] = O(""), [M, Ot] = O(""), B = S === t, P = x === t, et = C === t, Gn = E !== t && M !== t, vn = l || !P && !B, Hn = !l && B && !P, Yn = l ? "bottom-2 left-2" : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";
  pt(() => {
    const w = b.current;
    if (!w || !m || l) return;
    const L = (V) => {
      ae(w, V.clientY) && V.stopPropagation();
    }, F = (V) => {
      const se = V.touches[0];
      se && ae(w, se.clientY) && V.stopPropagation();
    };
    return w.addEventListener("mousedown", L), w.addEventListener("touchstart", F, {
      passive: !0
    }), () => {
      w.removeEventListener("mousedown", L), w.removeEventListener("touchstart", F);
    };
  }, [m, l]);
  function Rt(w) {
    w.stopPropagation();
  }
  function oe() {
    h((w) => w === t ? "" : w), A((w) => w === t ? "" : w), g((w) => w === t ? "" : w);
  }
  function Kn(w) {
    w.preventDefault(), w.stopPropagation();
    const L = b.current;
    if (L) {
      if (et) {
        g((F) => F === t ? "" : F), L.pause();
        return;
      }
      h(t), g(t), P || A(""), L.play().catch(() => {
        oe(), p?.();
      });
    }
  }
  return /* @__PURE__ */ _(
    "div",
    {
      className: [
        "relative isolate block h-full w-full overflow-hidden bg-muted",
        r
      ].filter(Boolean).join(" "),
      style: i,
      title: o,
      draggable: s,
      children: [
        /* @__PURE__ */ c(
          mr,
          {
            videoRef: b,
            src: t,
            poster: e || void 0,
            controls: B && !l,
            playsInline: !0,
            preload: "none",
            draggable: s,
            "aria-hidden": P ? void 0 : !0,
            className: [
              m ? "" : "nodrag",
              "nopan nowheel absolute inset-0 block h-full w-full",
              P ? "opacity-100" : "pointer-events-none opacity-0"
            ].join(" "),
            style: { objectFit: d },
            onPointerDown: l || m ? void 0 : Rt,
            onClick: l ? void 0 : Rt,
            onLoadedMetadata: (w) => f?.(
              w.currentTarget.videoWidth,
              w.currentTarget.videoHeight
            ),
            onPlaying: () => {
              A(t), g(t);
            },
            onPause: () => g((w) => w === t ? "" : w),
            onEnded: () => g((w) => w === t ? "" : w),
            onError: () => {
              oe(), p?.();
            }
          }
        ),
        P ? null : /* @__PURE__ */ c(
          Wn,
          {
            src: t,
            poster: e,
            alt: n,
            className: "pointer-events-none absolute inset-0 z-[1] block h-full w-full",
            style: { objectFit: d },
            draggable: s,
            ariaHidden: !0,
            onLoad: () => {
              I(t), u?.();
            },
            onError: () => {
              Ot(t), p?.();
            },
            onMediaSize: f
          }
        ),
        vn ? /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: `nodrag nopan nowheel absolute z-[2] inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/65 p-0 text-white shadow-lg backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 ${Yn}`,
            "aria-label": et ? "暂停视频" : a ? `播放${a}` : "播放视频",
            "aria-pressed": et,
            onPointerDown: Rt,
            onClick: Kn,
            children: et ? /* @__PURE__ */ c(nr, { size: 16, className: "fill-current", "aria-hidden": "true" }) : Gn && !P ? /* @__PURE__ */ c(
              H,
              {
                size: 16,
                className: "animate-spin",
                "aria-hidden": "true"
              }
            ) : /* @__PURE__ */ c(
              rr,
              {
                size: 16,
                className: "translate-x-px fill-current",
                "aria-hidden": "true"
              }
            )
          }
        ) : Hn ? /* @__PURE__ */ c(
          "span",
          {
            className: "pointer-events-none absolute left-1/2 top-1/2 z-[2] inline-flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/65 text-white shadow-lg backdrop-blur-sm",
            role: "status",
            "aria-label": "正在加载视频",
            children: /* @__PURE__ */ c(H, { size: 16, className: "animate-spin", "aria-hidden": "true" })
          }
        ) : null
      ]
    }
  );
}
function R(t) {
  if (typeof t != "string")
    return t;
  const e = t.trim();
  if (!Kt(e))
    return t;
  try {
    return JSON.parse(e);
  } catch {
    return t;
  }
}
function y(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
function Uo(t) {
  return y(t) ? t : {};
}
function k(t) {
  return typeof t == "string" ? t.trim() : "";
}
function jo(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) ? e : 0;
}
function nt(t) {
  if (t == null || t === "")
    return;
  const e = Number(t);
  return Number.isFinite(e) ? e : void 0;
}
function Ie(t) {
  const e = String(t || "").trim(), n = hr(e), r = wr(n);
  for (const i of Oe([e, n, r])) {
    const o = R(i);
    if (o !== i)
      return o;
    const s = br(i);
    if (s !== i)
      return s;
  }
  return t;
}
function Bo(t) {
  const e = String(t || "").trim();
  for (const n of Ce(e)) {
    const r = Ie(n);
    if (r !== n)
      return r;
  }
  return t;
}
function Q(t) {
  const e = [];
  for (const n of Ce(
    String(t || "").trim()
  )) {
    const r = Ie(n);
    r !== n && e.push(r);
  }
  return e;
}
function hr(t) {
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
      e += Sr(i);
      continue;
    }
    e += i;
  }
  return e;
}
function Ce(t) {
  const e = [t];
  for (const n of t.matchAll(/```(?:json|storyboard)?\s*([\s\S]*?)```/gi))
    e.push(String(n[1] || "").trim());
  return e.push(...gr(t)), Oe(e);
}
function gr(t) {
  const e = [];
  for (let n = 0; n < t.length; n += 1) {
    const r = t[n];
    if (r !== "{" && r !== "[")
      continue;
    const i = _r(t, n);
    i && (e.push(i), n += i.length - 1);
  }
  return e;
}
function _r(t, e) {
  const n = [];
  let r = !1, i = !1;
  for (let o = e; o < t.length; o += 1) {
    const s = t[o];
    if (i) {
      i = !1;
      continue;
    }
    if (r && s === "\\") {
      i = !0;
      continue;
    }
    if (s === '"') {
      r = !r;
      continue;
    }
    if (r)
      continue;
    if (s === "{" || s === "[") {
      n.push(s);
      continue;
    }
    if (s !== "}" && s !== "]")
      continue;
    const a = s === "}" ? "{" : "[";
    if (n.pop() !== a)
      return "";
    if (n.length === 0)
      return t.slice(e, o + 1).trim();
  }
  return "";
}
function Kt(t) {
  return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
}
function br(t) {
  if (!t.startsWith('"') || !t.endsWith('"'))
    return t;
  try {
    const e = JSON.parse(t);
    return typeof e == "string" ? e : t;
  } catch {
    return t;
  }
}
function Sr(t) {
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
function wr(t) {
  const e = t.trim();
  return !e.includes('\\"') || !e.startsWith("{") && !e.startsWith("[") ? t : e.replace(/\\"/g, '"');
}
function Oe(t) {
  const e = /* @__PURE__ */ new Set();
  return t.filter((n) => {
    const r = String(n || "").trim();
    return !r || e.has(r) ? !1 : (e.add(r), !0);
  });
}
function kr(...t) {
  return t.find(
    (e) => e != null
  );
}
function Re(t) {
  try {
    return JSON.stringify(t);
  } catch {
    return "";
  }
}
const Ar = {
  audio: "editorMediaAudio",
  image: "editorMediaImage",
  mediaAudio: "editorMediaAudio",
  mediaImage: "editorMediaImage",
  mediaVideo: "editorMediaVideo",
  video: "editorMediaVideo"
}, De = [
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
function Fo(t) {
  const e = tt(t);
  return e.length > 120 ? `${e.slice(0, 120)}...` : e;
}
function tt(t) {
  return ot(t).replace(/\s+/g, " ").trim();
}
function xr(t) {
  if (typeof t != "string")
    return "";
  const e = t.trim();
  if (!Cr(e))
    return "";
  const n = e.search(/"rich"\s*:/), r = n >= 0 ? e.slice(n) : e, i = [], o = /"text"\s*:\s*"((?:\\.|[^"\\])*)"/g;
  let s = null;
  for (; (s = o.exec(r)) !== null; ) {
    const a = Or(s[1]).trim();
    a && i.push(a);
  }
  return i.join(" ").replace(/\s+/g, " ").trim();
}
function Wt(t) {
  const e = G(t, /* @__PURE__ */ new Set());
  return Jt(e) ? e : null;
}
function Vo(t) {
  try {
    return tt(t);
  } catch {
    return "";
  }
}
function K(t) {
  try {
    return Wt(t);
  } catch {
    return null;
  }
}
function ot(t) {
  if (typeof t == "string") {
    const r = t.trim();
    if (Kt(r)) {
      const i = Le(r);
      if (i !== void 0)
        return ot(i).trim();
    }
    return xr(r) || t;
  }
  if (Array.isArray(t))
    return t.map(ot).filter(Boolean).join(" ");
  if (!y(t))
    return "";
  const e = Wt(t);
  if (e)
    return Pe(e);
  const n = [
    typeof t.text == "string" ? t.text : "",
    typeof t.markdown == "string" ? t.markdown : ""
  ];
  for (const r of De)
    t[r] != null && n.push(ot(t[r]));
  return n.filter(Boolean).join(" ");
}
function G(t, e) {
  if (typeof t == "string") {
    const r = t.trim();
    if (!Kt(r))
      return null;
    const i = Le(r);
    return i === void 0 ? null : G(i, e);
  }
  if (Array.isArray(t)) {
    const r = ce({ type: "doc", content: t });
    if (Jt(r))
      return r;
    for (const i of t) {
      const o = G(i, e);
      if (o)
        return o;
    }
    return null;
  }
  if (!y(t) || e.has(t))
    return null;
  e.add(t);
  const n = ce(t);
  if (n)
    return n;
  if (String(t.format || "").toLowerCase() === "rich_json" && t.rich != null) {
    const r = G(t.rich, e);
    if (r)
      return r;
  }
  for (const r of De) {
    if (t[r] == null)
      continue;
    const i = G(t[r], e);
    if (i)
      return i;
  }
  return null;
}
function ce(t) {
  return !y(t) || Ee(t.type) !== "doc" ? null : {
    type: "doc",
    attrs: y(t.attrs) ? t.attrs : void 0,
    content: Te(t.content)
  };
}
function Te(t) {
  return Array.isArray(t) ? t.map(Mr).filter((e) => !!e) : [];
}
function Mr(t) {
  if (!y(t))
    return null;
  const e = Ee(t.type) || Nr(t);
  if (!e)
    return null;
  const n = { type: e }, r = y(t.attrs) ? { ...t.attrs } : {};
  if (e === "heading" && yt(r.level) <= 0) {
    const s = yt(t.level);
    s > 0 && (r.level = s);
  }
  Object.keys(r).length > 0 && (n.attrs = r);
  const i = Ir(t.marks);
  if (i.length > 0 && (n.marks = i), e === "text") {
    const s = z(t.text);
    return s ? (n.text = s, n) : null;
  }
  const o = Te(t.content);
  return o.length > 0 && (n.content = o), n;
}
function Nr(t) {
  if (typeof t.text == "string")
    return "text";
  const e = y(t.attrs) ? t.attrs : {};
  return yt(e.level) > 0 || yt(t.level) > 0 ? "heading" : "";
}
function Ir(t) {
  return Array.isArray(t) ? t.map((e) => {
    if (!y(e))
      return null;
    const n = z(e.type);
    return n ? {
      type: n,
      attrs: y(e.attrs) ? e.attrs : void 0
    } : null;
  }).filter(
    (e) => !!e
  ) : [];
}
function Ee(t) {
  const e = z(t);
  return Ar[e] || e;
}
function Pe(t) {
  return t ? t.type === "text" ? t.text || "" : t.type === "editorMediaImage" || t.type === "editorMediaVideo" || t.type === "editorMediaAudio" ? z(t.attrs?.alt || t.attrs?.title || t.attrs?.src) : (t.content || []).map(Pe).filter(Boolean).join(" ") : "";
}
function Jt(t) {
  return t ? t.type === "text" ? !!z(t.text) : t.type === "editorMediaImage" || t.type === "editorMediaVideo" || t.type === "editorMediaAudio" ? !!z(t.attrs?.src) : (t.content || []).some(Jt) : !1;
}
function Le(t) {
  try {
    return JSON.parse(t);
  } catch {
    return;
  }
}
function Cr(t) {
  return t.includes("rich_json") || t.includes('"rich"') || t.includes("agent_run_id") || t.includes("node_run_id");
}
function Or(t) {
  try {
    return JSON.parse(`"${t}"`);
  } catch {
    return t.replace(/\\"/g, '"').replace(/\\n/g, `
`).replace(/\\t/g, "	").replace(/\\\\/g, "\\");
  }
}
function yt(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) ? e : 0;
}
function z(t) {
  return t == null ? "" : String(t).trim();
}
function qt(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  for (const i of t) {
    if (!y(i))
      continue;
    const o = W(i.asset_id ?? i.assetId), s = Ue(i.kind), a = Pt(i.purpose);
    if (!o || !s || !a || r.has(o))
      continue;
    let u = String(i.key || "").trim() || Et(o);
    if (n.has(u) && (u = Et(o)), n.has(u))
      continue;
    const p = W(i.version_id ?? i.versionId), f = String(i.label || "").trim() || `参考素材 ${e.length + 1}`;
    e.push({
      key: u,
      asset_id: o,
      ...p ? { version_id: p } : {},
      label: f,
      kind: s,
      purpose: a
    }), n.add(u), r.add(o);
  }
  return e;
}
function Go(t, e, n, r, i, o) {
  const s = new Map(
    qt(e).map((d) => [
      d.asset_id,
      d
    ])
  ), a = new Map(
    n.flatMap((d) => {
      const m = W(d.refId);
      return m ? [[m, d]] : [];
    })
  ), u = [], p = (t?.parts || []).map((d) => ({ ...d })), f = /* @__PURE__ */ new Set();
  for (const [d, m] of (t?.parts || []).entries()) {
    if (m.type !== "reference" || m.ref_type !== "asset")
      continue;
    const l = W(m.ref_id);
    if (!l || f.has(l))
      continue;
    const b = s.get(l), S = a.get(l), h = Ue(S?.kind) || b?.kind;
    if (!h)
      continue;
    const x = W(S?.versionID || m.ref_version_id), A = String(S?.title || m.label || b?.label || "").trim() || `参考素材 ${u.length + 1}`, C = $e(
      h,
      i,
      o
    ), g = Pt(m.purpose), E = Pt(
      b?.purpose
    ), I = [g, E].find(
      (Ot) => C.some((B) => B.value === Ot)
    ) || Dr(h, i, o), M = p[d];
    M?.type === "reference" && (M.purpose = I || void 0), u.push({
      key: b?.key || Et(l),
      asset_id: l,
      ...x ? { version_id: x } : {},
      label: A,
      kind: h,
      purpose: I
    }), f.add(l);
  }
  return {
    content: t ? { ...t, parts: p } : void 0,
    references: u
  };
}
function vo(t, e) {
  return e.filter(
    (n) => n.work_types.length === 0 || n.work_types.includes(t)
  ).map((n) => ({
    key: n.key,
    label: n.name,
    acceptedKinds: [...n.media_kinds]
  }));
}
function $e(t, e, n) {
  return n.filter(
    (r) => r.media_kinds.includes(t) && (r.work_types.length === 0 || r.work_types.includes(e))
  ).map((r) => ({ value: r.key, label: r.name }));
}
function ze(t, e) {
  return e.find((n) => n.key === t);
}
function Rr(t, e) {
  return ze(t, e)?.name || t;
}
function Ho(t, e, n, r) {
  const i = n.find((s) => s.key === e);
  if (!i || r.length === 0)
    return "分镜作品类型或参考用途配置无效";
  const o = /* @__PURE__ */ new Map();
  for (const s of t) {
    const a = ze(
      s.purpose,
      r
    );
    if (!a)
      return `参考素材“${s.label}”的用途无效`;
    if (!a.media_kinds.includes(s.kind))
      return `参考素材“${s.label}”的类型不支持用途“${a.name}”`;
    if (a.work_types.length > 0 && !a.work_types.includes(e))
      return `当前作品类型不支持“${s.label}”的用途“${a.name}”`;
    const u = (o.get(s.purpose) || 0) + 1;
    if (o.set(s.purpose, u), a.max_count > 0 && u > a.max_count)
      return `用途“${a.name}”最多只能选择 ${a.max_count} 个素材`;
  }
  for (const s of i.required_reference_purposes)
    if (!o.get(s))
      return `${i.name}必须添加“${Rr(
        s,
        r
      )}”`;
  return "";
}
function Et(t) {
  return `ref-${t}`;
}
function Pt(t) {
  const e = String(t || "").trim();
  return e || void 0;
}
function Dr(t, e, n) {
  const r = $e(t, e, n);
  return n.find(
    (o) => o.default_media_kinds.includes(t) && (o.work_types.length === 0 || o.work_types.includes(e))
  )?.key || r[0]?.value || "";
}
function Ue(t) {
  const e = String(t || "").trim().toLowerCase();
  return e === "image" || e === "video" || e === "audio" ? e : void 0;
}
function W(t) {
  const e = Number(t || 0);
  return Number.isInteger(e) && e > 0 ? e : 0;
}
function Tr(t) {
  return typeof t == "string" && t.length > 0 && t.trim() === t;
}
const Er = "素材库", Pr = [
  { key: "project", label: "创作" },
  { key: "tool", label: "工具" },
  { key: "dialogue", label: "对话" },
  { key: "upload", label: "上传" },
  { key: "import", label: "导入" },
  { key: "official", label: Er }
], Lr = [
  { key: "work", label: "作品" },
  { key: "material", label: "素材" }
], $r = [
  { key: "collection", label: "集合" },
  { key: "text", label: "文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "richtext", label: "富文本" },
  { key: "file", label: "文件" }
];
function Yo(t, e = {}) {
  const n = e.fallback || "资产", r = Xt(Pr, t, n);
  return e[t] || r;
}
function Ko(t) {
  return Xt(Lr, t, "素材");
}
function Wo(t) {
  return Xt($r, t, "资产");
}
function Jo(t) {
  if (t.length === 0 || t.some((r) => ["text", "richtext", "file"].includes(r)))
    return;
  const e = {
    image: "image/*",
    audio: "audio/*",
    video: "video/*"
  }, n = t.map((r) => e[r]).filter((r) => !!r);
  return n.length > 0 ? Array.from(new Set(n)).join(",") : void 0;
}
function qo(t, e) {
  return t && (e.length === 0 || e.some((n) => ["richtext", "video"].includes(n)));
}
function Xo(t) {
  return t.id <= 0 ? !1 : t.libraryType === "material" ? t.version?.content != null : t.versionID > 0;
}
function Xt(t, e, n) {
  return t.find((r) => r.key === e)?.label || n;
}
const ht = [
  { value: "auto", label: "自动", columns: 0, rows: 0, capacity: 9 },
  { value: "2x2", label: "2×2", columns: 2, rows: 2, capacity: 4 },
  { value: "3x2", label: "3×2", columns: 3, rows: 2, capacity: 6 },
  { value: "3x3", label: "3×3", columns: 3, rows: 3, capacity: 9 }
], zr = new Set(
  ht.map((t) => t.value)
);
function Zt(t) {
  const e = String(t || "").trim().toLowerCase();
  return zr.has(e) ? e : "auto";
}
function je(t) {
  const e = Zt(t);
  return ht.find((n) => n.value === e) || ht[0];
}
function Ur(t, e) {
  const n = je(t), r = Math.max(0, Math.trunc(Number(e) || 0));
  return n.value !== "auto" ? n : r === 0 || r > 6 ? { columns: 3, rows: 3, capacity: 9 } : r > 4 ? { columns: 3, rows: 2, capacity: 6 } : r > 2 ? { columns: 2, rows: 2, capacity: 4 } : { columns: 2, rows: 1, capacity: 2 };
}
function jr(t) {
  const e = Math.max(0, Math.trunc(Number(t) || 0));
  return e <= 1 ? { columns: 1, rows: 1, capacity: 1 } : e === 2 ? { columns: 2, rows: 1, capacity: 2 } : { columns: 2, rows: 2, capacity: 4 };
}
function Br(t, e) {
  const n = Math.max(0, Math.trunc(Number(e) || 0) - 1);
  return Math.min(
    n,
    Math.max(0, Math.trunc(Number(t) || 0))
  );
}
const Fr = 50, Be = 5, Fe = [
  "first_frame",
  "last_frame",
  "first_last",
  "references",
  "none"
], gt = "first_frame", Zo = {
  first_frame: "首帧",
  last_frame: "尾帧",
  first_last: "首尾帧",
  references: "参考图组",
  none: "无参考图"
};
function Ve(t) {
  const e = Number(t);
  return Number.isInteger(e) && e > 0 ? e : void 0;
}
function Qo(t) {
  return (Ve(t) || 0) >= Be;
}
function ts(t, e) {
  const n = Ve(t);
  return e ? Math.max(n || 0, Be) : n;
}
function Ge(t) {
  return t === "start" || t === "end" ? t : void 0;
}
function Vr(t) {
  return Ge(t) || "start";
}
function es(t) {
  return Vr(t) === "end" ? "lastFrame" : "firstFrame";
}
function Gr(t) {
  return vr(t) || gt;
}
function vr(t) {
  return Fe.includes(t) ? t : void 0;
}
function Hr(t) {
  switch (t) {
    case "first_frame":
      return [{ frameRole: "start", mediaIndex: 1 }];
    case "last_frame":
      return [{ frameRole: "end", mediaIndex: 1 }];
    case "first_last":
      return qr();
    default:
      return [];
  }
}
function U(t) {
  const e = Gr(t.shot_image_mode), n = !!t.continue_previous, r = !!t.match_previous, i = Wr(
    e,
    r,
    n
  );
  let o = i;
  return n && i === "first_frame" && (o = "none"), {
    mode: i,
    nodeMode: o,
    frameMediaItems: Hr(o),
    referenceMode: i === "references" ? "references" : i === "none" ? "" : "frames"
  };
}
function ve(t) {
  const e = t.map((n) => {
    const r = U(n);
    return !_t(n) && (r.mode === "first_last" || r.mode === "last_frame") ? U({ ...n, shot_image_mode: "first_frame" }) : r;
  });
  for (let n = e.length - 1; n > 0; n -= 1) {
    const r = t[n], i = e[n];
    Jr(r, i) && Yr(t, e, n - 1);
  }
  return e;
}
function _t(t) {
  const e = t.continuity_state && typeof t.continuity_state == "object" && !Array.isArray(t.continuity_state) ? t.continuity_state : {}, n = $(e.entry), r = $(e.exit);
  return !!n && !!r && n !== r || Kr(t.camera_instruction);
}
function Yr(t, e, n) {
  for (let r = n; r >= 0; r -= 1) {
    if (st(e[r].frameMediaItems, "end"))
      return;
    const i = t[r], o = _t(i);
    if (e[r].nodeMode === "first_frame" && !i.continue_previous && !o)
      return;
    if (!(i.continue_previous && !o)) {
      e[r] = U({
        ...i,
        shot_image_mode: o ? i.continue_previous ? "last_frame" : "first_last" : "first_frame"
      });
      return;
    }
  }
}
function Kr(t) {
  const e = $(t).toLowerCase().replace(/\s+/g, "");
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
function $(t) {
  return typeof t == "string" ? t.trim() : "";
}
function ns(t) {
  return Fe.filter(
    (e) => U({ ...t, shot_image_mode: e }).mode === e
  );
}
function Wr(t, e, n) {
  return n && t === "first_last" ? "last_frame" : t === "last_frame" && !n || n && (t === "references" || t === "none") || e && t === "none" ? gt : t;
}
function Jr(t, e) {
  return !!t.match_previous || !!t.continue_previous && e.nodeMode === "last_frame";
}
function qr() {
  return [
    { frameRole: "start", mediaIndex: 1 },
    { frameRole: "end", mediaIndex: 2 }
  ];
}
function rs(t) {
  if (!Array.isArray(t))
    return [];
  const e = [], n = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  for (const i of t) {
    if (!i || typeof i != "object" || Array.isArray(i))
      continue;
    const o = i, s = Ge(o.frameRole ?? o.frame_role), a = Number(o.mediaIndex ?? o.media_index);
    !s || !Number.isInteger(a) || a <= 0 || n.has(s) || r.has(a) || (n.add(s), r.add(a), e.push({ frameRole: s, mediaIndex: a }));
  }
  return e.sort((i, o) => i.mediaIndex - o.mediaIndex);
}
function is(t) {
  return Array.isArray(t) ? t.map((e) => {
    if (!e || typeof e != "object" || Array.isArray(e))
      return;
    const n = e, r = $(n.prompt);
    if (!r)
      return;
    const i = $(n.title);
    return {
      title: i || "画面",
      description: $(n.description) || i || r,
      prompt: r
    };
  }).filter(
    (e) => !!e
  ) : [];
}
function st(t, e) {
  return t?.find((n) => n.frameRole === e)?.mediaIndex || 0;
}
function os(t, e, n) {
  const r = t[e], i = Xr(t, e, n);
  if (!r || !i)
    return {
      anchorID: "",
      anchorFrameRole: "",
      anchorShotIndex: -1,
      materialIDs: bt(r?.material_ids),
      referenceKeys: bt(r?.reference_keys),
      includeGlobalReferences: !0
    };
  const o = t[i.shotIndex];
  return {
    anchorID: i.id,
    anchorFrameRole: i.frameRole,
    anchorShotIndex: i.shotIndex,
    materialIDs: ue(
      r.material_ids,
      o?.material_ids
    ),
    referenceKeys: ue(
      r.reference_keys,
      o?.reference_keys
    ),
    includeGlobalReferences: !1
  };
}
function Xr(t, e, n) {
  const r = t[e];
  if (!r)
    return;
  const i = ve(t);
  if (n === "end" && !r.continue_previous)
    return st(i[e]?.frameMediaItems, "start") ? { id: r.id, shotIndex: e, frameRole: "start" } : void 0;
  if (!(n === "start" && !r.match_previous && !r.continue_previous || e <= 0))
    for (let o = e - 1; o >= 0; o -= 1) {
      const s = i[o];
      if (st(s?.frameMediaItems, "end"))
        return {
          id: t[o].id,
          shotIndex: o,
          frameRole: "end"
        };
      if (st(s?.frameMediaItems, "start") && !_t(t[o]))
        return {
          id: t[o].id,
          shotIndex: o,
          frameRole: "start"
        };
      if (!t[o].continue_previous || _t(t[o]))
        return;
    }
}
function ue(t, e) {
  const n = new Set(bt(e));
  return bt(t).filter(
    (r) => !n.has(r)
  );
}
function bt(t) {
  return [
    ...new Set((t || []).map((e) => e.trim()).filter(Boolean))
  ];
}
const He = 4, Lt = /* @__PURE__ */ new Set([2, 3, 4, 5]);
function At(t) {
  if (t == null || String(t).trim() === "")
    return He;
  const e = Number(t);
  if (!Number.isInteger(e) || !Lt.has(e))
    throw new Error("最短镜头时长必须是 2 到 5 秒");
  return e;
}
function ss(t) {
  if (!(t == null || String(t).trim() === ""))
    try {
      return At(t);
    } catch {
      return;
    }
}
function as(t) {
  if (!Array.isArray(t))
    return [];
  const e = /* @__PURE__ */ new Set(), n = t.map((r) => {
    const i = y(r) ? r : {}, o = At(i.seconds), s = Number(i.sort);
    if (e.has(o) || !Number.isInteger(s))
      throw new Error("分镜最短时长注册信息无效");
    return e.add(o), {
      seconds: o,
      name: String(i.name || "").trim() || `${o} 秒`,
      sort: s
    };
  });
  if (n.length !== Lt.size || [...Lt].some(
    (r) => !e.has(r)
  ))
    throw new Error("分镜最短时长注册信息无效");
  return n.sort((r, i) => r.sort - i.sort);
}
function cs(t) {
  const e = [
    At(t.min_shot_duration),
    ...t.shots.map((n) => Number(n.duration))
  ];
  return [...new Set(e.filter(Ke))].sort(
    (n, r) => n - r
  );
}
function us(t, e) {
  const n = Ye(
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
function ds(t) {
  const e = Ye(
    t
  );
  return e.length > 0 ? `没有同时支持 ${e.join("、")} 秒的可用视频模型` : "";
}
function Ye(t) {
  const e = Array.isArray(t) ? t : [];
  return [
    ...new Set(e.map(Number).filter(Ke))
  ].sort((n, r) => n - r);
}
function Ke(t) {
  return Number.isInteger(t) && t >= 2;
}
const Zr = {
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
}, Qr = [
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
function Qt(t) {
  return Object.fromEntries(
    t.map((e) => [e, /* @__PURE__ */ new Map()])
  );
}
function St(t, e, n = {}) {
  const r = {
    media: t,
    enabledKinds: Object.keys(t),
    seen: n.seen || /* @__PURE__ */ new Set(),
    requestedKind: n.kind
  };
  D(e, r, 0, n.kind);
}
function ti(t, e) {
  const r = Qt(e === "audio" ? ["audio", "image"] : [e]);
  return St(r, t, { kind: e }), We(r), Array.from(r[e].values());
}
function We(t) {
  const e = t.audio, n = t.image;
  if (!e || !n || e.size === 0 || e.size !== n.size)
    return;
  const r = Array.from(n.values());
  Array.from(e.values()).forEach((i, o) => {
    if (i.thumbnail)
      return;
    const s = Je(
      "audio",
      i.url,
      r[o]?.url || ""
    );
    s && e.set(i.url, { ...i, thumbnail: s });
  });
}
function D(t, e, n, r, i = "") {
  if (t == null || n > 12)
    return;
  if (Array.isArray(t)) {
    const f = t.length > 1 ? "" : i;
    t.forEach(
      (d) => D(
        d,
        e,
        n + 1,
        r,
        f
      )
    );
    return;
  }
  if (typeof t == "string") {
    const f = Q(t);
    if (f.length > 0) {
      f.forEach(
        (m) => D(
          m,
          e,
          n + 1,
          r,
          i
        )
      );
      return;
    }
    const d = r || e.requestedKind || ii(t);
    d && e.media[d] && qe(t) && ei(
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
  const o = t, s = y(o.attrs) ? o.attrs : void 0, a = ri(
    o.type,
    o.kind,
    o.media_type,
    o.mediaType,
    o.mime
  ), u = ni(
    o,
    s,
    i
  ), p = r || e.requestedKind;
  if (p && e.media[p] && (!a || a === p))
    for (const f of de(o, p))
      D(
        f,
        e,
        n + 1,
        p,
        u
      );
  for (const f of e.enabledKinds) {
    const d = Zr[f];
    for (const m of d.direct)
      D(
        o[m],
        e,
        n + 1,
        f,
        u
      );
    for (const m of d.collections)
      D(
        o[m],
        e,
        n + 1,
        f,
        u
      );
  }
  if (a && e.media[a]) {
    for (const f of de(o, a))
      D(
        f,
        e,
        n + 1,
        a,
        u
      );
    D(
      o.attrs,
      e,
      n + 1,
      a,
      u
    );
  }
  for (const f of Qr)
    D(
      o[f],
      e,
      n + 1
    );
}
function de(t, e) {
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
function ei(t, e, n, r) {
  const i = t[e];
  if (!i)
    return;
  const o = Je(
    e,
    n,
    r
  ), s = i.get(n);
  if (s?.thumbnail || !o) {
    s || i.set(n, { url: n });
    return;
  }
  i.set(n, { url: n, thumbnail: o });
}
function Je(t, e, n) {
  const r = n.trim();
  return !r || t !== "image" && r === e.trim() ? "" : r;
}
function ni(t, e, n) {
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
    if (typeof r == "string" && qe(r))
      return r.trim();
  return "";
}
function ri(...t) {
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
function ii(t) {
  const e = t.trim();
  if (/^data:image\//i.test(e) || /\.(png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i.test(e))
    return "image";
  if (/^data:video\//i.test(e) || /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(e))
    return "video";
  if (/^data:audio\//i.test(e) || /\.(mp3|wav|ogg|m4a|aac)(?:[?#].*)?$/i.test(e))
    return "audio";
}
function qe(t) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(t.trim());
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const $t = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!$t || Object.keys($t).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const te = ["image", "video", "audio"], oi = 64, si = 128 * 1024, wt = /* @__PURE__ */ Symbol("content-output-cache-miss"), le = en(), fe = en(), ai = $t, ci = ai.normalizeEnergonOutput;
function N(...t) {
  for (const e of t)
    if (typeof e == "string" && e.trim())
      return e.trim();
  return "";
}
function ls(t) {
  const e = J(
    t,
    ["lyrics", "lyric", "lrc", "song_lyrics", "songLyrics"],
    /* @__PURE__ */ new Set(),
    0
  );
  if (e)
    return { label: "歌词", text: e };
  const n = J(
    t,
    ["text"],
    /* @__PURE__ */ new Set(),
    0
  );
  return n ? { label: "创作内容", text: n } : null;
}
function J(t, e, n, r) {
  if (t == null || r > 12)
    return "";
  if (typeof t == "string") {
    for (const i of Q(t)) {
      const o = J(i, e, n, r + 1);
      if (o)
        return o;
    }
    return "";
  }
  if (Array.isArray(t)) {
    for (const i of t) {
      const o = J(i, e, n, r + 1);
      if (o)
        return o;
    }
    return "";
  }
  if (!y(t) || n.has(t))
    return "";
  n.add(t);
  for (const i of e) {
    const o = at(t[i], r + 1);
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
    const o = J(t[i], e, n, r + 1);
    if (o)
      return o;
  }
  return "";
}
function at(t, e) {
  if (t == null || e > 12)
    return "";
  if (typeof t == "string") {
    const n = t.trim();
    if (!n || /^(https?:\/\/|\/|data:|blob:)/i.test(n))
      return "";
    const r = Q(n);
    return r.length > 0 ? r.map((i) => at(i, e + 1)).filter(Boolean).join(`
`) : n;
  }
  if (Array.isArray(t))
    return t.map((n) => at(n, e + 1)).filter(Boolean).join(`
`);
  if (!y(t))
    return "";
  for (const n of ["text", "content", "line", "lines", "value"]) {
    const r = at(t[n], e + 1);
    if (r)
      return r;
  }
  return "";
}
function Xe(t) {
  const e = kt(t);
  return !e || e.hasMedia ? "" : e.markdown;
}
function kt(t) {
  const e = hi(t);
  return !e || !sn(e) ? null : {
    markdown: e.content.map(an).join(`

`).trim(),
    plainText: e.content.map(cn).join(`

`).trim(),
    hasMedia: un(e)
  };
}
function Ze(t) {
  return /(^|\n)\s*(#{1,6}\s|[-*+]\s|>\s|\d+\.\s|```)/m.test(t) || /(\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)]+\)|`[^`]+`)/.test(t);
}
function ui(t) {
  return di(t).length > 0;
}
function di(t) {
  const e = Nt(t);
  return te.filter((n) => e[n].size > 0);
}
function Qe(t) {
  const e = Nt(t);
  return te.reduce(
    (n, r) => n + e[r].size,
    0
  );
}
function fs(t, e) {
  return Array.from(Nt(t)[e].keys());
}
function tn(t, e) {
  return Array.from(Nt(t)[e].values());
}
function li(t) {
  const e = xt(t);
  return e ? Array.from(
    new Set(e.frames.map((n) => n.image.trim()).filter(Boolean))
  ) : [];
}
function xt(t) {
  const e = nn(fe, t);
  return e !== wt ? e : rn(
    fe,
    t,
    ut(t, /* @__PURE__ */ new Set(), 0)
  );
}
function ms(t, e) {
  const n = e.trim().toLowerCase();
  return n ? ct(t, n, /* @__PURE__ */ new Set(), 0) : !1;
}
function fi(...t) {
  let e, n, r = 0;
  for (const i of t) {
    if (!Mt(i))
      continue;
    e === void 0 && (e = i);
    const o = Qe(i);
    o > r && (n = i, r = o);
  }
  return r > 0 ? n : e;
}
function Mt(t) {
  return t == null || t === "" ? !1 : Array.isArray(t) ? t.length > 0 : typeof t == "object" ? Object.keys(t).length > 0 : !0;
}
function Nt(t) {
  const e = nn(le, t);
  if (e !== wt)
    return e;
  const n = Qt(te), r = li(t), i = /* @__PURE__ */ new Set();
  for (const o of It(t))
    St(n, o, { seen: i });
  return St(n, t), We(n), r.length > 0 && (n.image = new Map(
    r.map((o) => [o, { url: o, thumbnail: o }])
  )), rn(le, t, n);
}
function en() {
  return {
    objects: /* @__PURE__ */ new WeakMap(),
    strings: /* @__PURE__ */ new Map()
  };
}
function nn(t, e) {
  if (e && typeof e == "object")
    return t.objects.has(e) ? t.objects.get(e) : wt;
  if (!on(e) || !t.strings.has(e))
    return wt;
  const n = t.strings.get(e);
  return t.strings.delete(e), t.strings.set(e, n), n;
}
function rn(t, e, n) {
  if (e && typeof e == "object")
    return t.objects.set(e, n), n;
  if (!on(e))
    return n;
  for (t.strings.delete(e), t.strings.set(e, n); t.strings.size > oi; ) {
    const r = t.strings.keys().next().value;
    if (typeof r != "string")
      break;
    t.strings.delete(r);
  }
  return n;
}
function on(t) {
  return typeof t == "string" && t.length <= si;
}
function It(t) {
  if (!Mt(t))
    return [];
  const e = ci?.(t);
  return Array.isArray(e) && e.length > 0 ? e : Array.isArray(t) ? t : [t];
}
function ct(t, e, n, r) {
  return t == null || r > 12 ? !1 : typeof t == "string" ? Q(t).some(
    (i) => ct(i, e, n, r + 1)
  ) : Array.isArray(t) ? t.some(
    (i) => ct(i, e, n, r + 1)
  ) : !y(t) || n.has(t) ? !1 : (n.add(t), String(t.type || "").trim().toLowerCase() === e ? !0 : [
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
    (i) => ct(i, e, n, r + 1)
  ));
}
function ut(t, e, n) {
  if (t == null || n > 12)
    return null;
  if (typeof t == "string") {
    const i = t.trim();
    if (!i || !i.startsWith("{") && !i.startsWith("["))
      return null;
    try {
      return ut(JSON.parse(i), e, n + 1);
    } catch {
      return null;
    }
  }
  if (Array.isArray(t)) {
    for (const i of t) {
      const o = ut(i, e, n + 1);
      if (o)
        return o;
    }
    return null;
  }
  if (!y(t) || e.has(t))
    return null;
  e.add(t);
  const r = mi(t);
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
    const o = ut(t[i], e, n + 1);
    if (o)
      return o;
  }
  return null;
}
function mi(t) {
  if (String(t.type || "").trim().toLowerCase() !== "storyboard_grid" || !Array.isArray(t.frames))
    return null;
  const e = t.frames.map(pi).filter((n) => !!n).sort((n, r) => n.order - r.order);
  return e.length < 2 || e.length > Fr ? null : {
    type: "storyboard_grid",
    version: Math.max(1, Math.trunc(Number(t.version) || 1)),
    title: N(t.title, "宫格图片"),
    summary: N(t.summary),
    frames: e
  };
}
function pi(t, e) {
  if (!y(t))
    return null;
  const n = Math.max(1, Math.trunc(Number(t.order) || e + 1));
  return {
    id: N(t.id, `frame-${String(n).padStart(2, "0")}`),
    order: n,
    title: N(
      t.title,
      `画面 ${String(n).padStart(2, "0")}`
    ),
    description: N(t.description),
    prompt: N(t.prompt),
    status: N(t.status),
    image: yi(
      t.image,
      t.image_url,
      t.imageUrl
    ),
    error: N(t.error),
    assetID: me(t.asset_id, t.assetId, t.assetID),
    assetVersionID: me(
      t.asset_version_id,
      t.assetVersionId,
      t.assetVersionID
    )
  };
}
function yi(...t) {
  for (const e of t) {
    const n = Qt(["image"]);
    St(n, e, { kind: "image" });
    const r = n.image.values().next().value;
    if (r?.url)
      return r.url;
  }
  return "";
}
function me(...t) {
  for (const e of t) {
    const n = Math.trunc(Number(e) || 0);
    if (n > 0)
      return n;
  }
  return 0;
}
function hi(t) {
  return y(t) ? t.type === "doc" && Array.isArray(t.content) ? t : y(t.rich) && t.rich.type === "doc" && Array.isArray(t.rich.content) ? t.rich : null : null;
}
function sn(t) {
  return y(t) ? t.type === "text" ? !Array.isArray(t.marks) || t.marks.length === 0 : t.type === "hardBreak" ? !0 : Ct(t) ? !!dn(t) : t.type !== "doc" && t.type !== "paragraph" ? !1 : Array.isArray(t.content) && t.content.every(sn) : !1;
}
function an(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : Ct(t) ? `![${gi(
    String(t.attrs?.alt || t.attrs?.caption || "图片")
  )}](<${_i(dn(t))}>)` : Array.isArray(t.content) ? t.content.map(an).join("") : "";
}
function cn(t) {
  return t.type === "text" ? String(t.text || "") : t.type === "hardBreak" ? `
` : Ct(t) ? "" : Array.isArray(t.content) ? t.content.map(cn).join("") : "";
}
function un(t) {
  return Ct(t) || !!t.content?.some((e) => un(e));
}
function Ct(t) {
  return ["image", "mediaImage", "editorMediaImage"].includes(
    String(t.type || "")
  );
}
function dn(t) {
  return String(t.attrs?.src || "").trim();
}
function gi(t) {
  return t.replace(/([\\\[\]])/g, "\\$1");
}
function _i(t) {
  return t.replace(/</g, "%3C").replace(/>/g, "%3E");
}
const zt = 9, ln = 2, bi = 50, pe = /* @__PURE__ */ new Set([
  "未命名",
  "未命名分镜",
  "分镜",
  "分镜脚本",
  "暂无内容简介",
  "围绕当前主题展开并完成一个连贯事件"
]), Si = [
  "none",
  "fade",
  "crossfade",
  "fadeblack",
  "fadewhite",
  "wipeleft",
  "wiperight"
], ps = {
  none: "硬切",
  fade: "淡化",
  crossfade: "交叉溶解",
  fadeblack: "黑场淡化",
  fadewhite: "白场淡化",
  wipeleft: "向左擦除",
  wiperight: "向右擦除"
}, wi = ["photoreal", "stylized"], ys = {
  photoreal: "写实影像",
  stylized: "非写实影像"
}, ki = [
  "16:9",
  "9:16",
  "1:1",
  "4:3",
  "3:4",
  "21:9"
], Ai = "16:9", hs = {
  character: "角色",
  scene: "场景",
  prop: "道具"
}, xi = [
  "shot_images",
  "final_video",
  "shot_videos",
  "storyboard_only"
], rt = {
  output_target: "shot_images",
  voice_mode: "auto",
  subtitle_mode: "auto",
  lip_sync_mode: "off"
};
function fn(t, e) {
  return e > 0 && (t.match_previous || t.continue_previous);
}
const Mi = [
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
function mn(t) {
  return v(t, /* @__PURE__ */ new Set(), 0);
}
function gs(t, e) {
  if (!y(t) || !Array.isArray(t.materials))
    return null;
  const n = t.materials.map(xn);
  if (n.some((s) => !s))
    return null;
  const r = n, i = new Set(
    r.map((s) => s.id)
  );
  if (i.size !== r.length)
    return null;
  const o = Mn(t.shot, e, i);
  return o ? { shot: o, materials: r } : null;
}
function _s(t) {
  return t.timeline_duration_ms && t.timeline_duration_ms > 0 ? Math.round(t.timeline_duration_ms) / 1e3 : pn(t.shots);
}
function pn(t) {
  return t.reduce(
    (e, n) => e + Math.max(0, Number(n.duration) || 0),
    0
  );
}
function Ni(t) {
  return Number.isInteger(t) && t >= ln;
}
function bs(t, e) {
  const n = new Map(
    t.materials.map((r) => [r.id, r])
  );
  return e.material_ids.map((r) => n.get(r)).filter((r) => !!r);
}
function Ss(t) {
  return {
    id: `shot-${t + 1}`,
    order: t + 1,
    duration: He,
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
    shot_image_mode: gt,
    match_previous: !1,
    continue_previous: !1,
    continuity_anchor: "",
    continuity_state: { entry: "", exit: "" },
    speech: [],
    captions: []
  };
}
function ws(t, e) {
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
function ks(t, e) {
  const n = [], r = [];
  for (const i of t.shots) {
    i.material_ids.includes(e) && n.push(i.id);
    for (const o of i.speech)
      o.character_id === e && r.push(o.id);
  }
  return { shotIds: n, speechIds: r };
}
function As(t, e = "dialogue") {
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
function xs(t) {
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
function Ii(t) {
  const e = In(t.workflow), n = qt(t.references), r = new Set(n.map((a) => a.key)), i = new Set(
    t.materials.map((a) => a.id)
  ), o = t.shots.map((a, u) => {
    const p = u > 0 ? kn(a.transition_type) : "none", f = Math.round(
      Number(a.transition_duration_ms)
    ), d = u > 0 && !!a.continue_previous, m = u > 0 && !d && !!a.match_previous;
    return {
      ...a,
      id: a.id || `shot-${u + 1}`,
      order: u + 1,
      transition: u > 0 ? a.transition.trim() : "",
      transition_type: p,
      transition_duration_ms: p !== "none" ? Math.min(
        5e3,
        Math.max(
          100,
          Number.isFinite(f) ? f : 100
        )
      ) : 0,
      material_ids: q(a.material_ids).filter(
        (l) => i.has(l)
      ),
      reference_keys: q(a.reference_keys).filter(
        (l) => r.has(l)
      ),
      shot_image_mode: U({
        ...a,
        match_previous: m,
        continue_previous: d
      }).mode,
      match_previous: m,
      continue_previous: d,
      continuity_anchor: d ? a.continuity_anchor.trim() : "",
      continuity_state: yn(
        a.continuity_state
      ),
      lyric_line_indexes: Nn(
        a.lyric_line_indexes
      )
    };
  });
  o.forEach((a, u) => {
    fn(a, u) && (a.continuity_state.entry = o[u - 1].continuity_state.exit);
  });
  const s = ve(o);
  return o.forEach((a, u) => {
    a.shot_image_mode = s[u].mode;
  }), {
    ...t,
    version: zt,
    workflow: e,
    production_plan: ee(
      t.production_plan,
      t.work_type
    ),
    target_duration: pn(o),
    target_shot_count: o.length,
    lyrics_lrc: t.work_type === "mv" ? String(t.lyrics_lrc || "") : "",
    narrator_voice: t.narrator_voice.trim(),
    aspect_ratio: wn(t.aspect_ratio),
    references: n,
    materials: t.materials.map((a) => ({
      ...a,
      voice: a.type === "character" ? a.voice.trim() : "",
      reference_keys: q(a.reference_keys).filter(
        (u) => r.has(u)
      )
    })),
    shots: o
  };
}
function yn(t) {
  const e = y(t) ? t : {};
  return {
    entry: k(e.entry).trim(),
    exit: k(e.exit).trim()
  };
}
function Ms(t, e) {
  const n = /* @__PURE__ */ new Map();
  return t.shots.forEach((r, i) => {
    i > 0 && n.set(r.id, t.shots[i - 1].id);
  }), {
    ...e,
    shots: e.shots.map((r, i) => {
      const o = i > 0 ? e.shots[i - 1].id : "", s = i === 0 || n.get(r.id) !== o;
      return {
        ...r,
        transition: s ? "" : r.transition,
        transition_type: s ? "none" : r.transition_type,
        transition_duration_ms: s ? 0 : r.transition_duration_ms,
        match_previous: !s && !r.continue_previous ? r.match_previous : !1,
        continue_previous: !s && !!r.continue_previous,
        continuity_anchor: !s && r.continue_previous ? r.continuity_anchor : ""
      };
    })
  };
}
function Ns(t) {
  return t.workflow.status === "confirmed";
}
function ee(t, e) {
  const n = y(t) ? t : {}, r = k(n.output_target).toLowerCase(), i = {
    output_target: xi.includes(
      r
    ) ? r : rt.output_target,
    voice_mode: Dt(
      n.voice_mode,
      rt.voice_mode
    ),
    subtitle_mode: Dt(
      n.subtitle_mode,
      rt.subtitle_mode
    ),
    lip_sync_mode: Dt(
      n.lip_sync_mode,
      rt.lip_sync_mode
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
function Is(t, e) {
  return {
    ...ee(
      t.production_plan,
      t.work_type
    ),
    output_target: "final_video",
    lip_sync_mode: t.work_type !== "mv" && e && t.shots.some(bn) ? "auto" : "off"
  };
}
function Cs(t) {
  return t.production_plan.output_target !== "storyboard_only";
}
function hn(t) {
  return ["shot_videos", "final_video"].includes(
    t.production_plan.output_target
  );
}
function Os(t) {
  return t.production_plan.output_target === "final_video";
}
function gn(t) {
  return t.work_type === "mv";
}
function Ci(t) {
  return !gn(t) && hn(t) && t.production_plan.voice_mode === "auto" && Oi(t) > 0;
}
function Rs(t) {
  return !gn(t) && hn(t) && t.production_plan.subtitle_mode === "auto" && Ri(t) > 0;
}
function Ds(t) {
  return Ci(t) && t.production_plan.lip_sync_mode === "auto" && t.shots.some(bn);
}
function Oi(t) {
  return t.shots.reduce(
    (e, n) => e + n.speech.filter(Gi).length,
    0
  );
}
function Ri(t) {
  return t.shots.reduce(
    (e, n) => e + Di(n).length,
    0
  );
}
function Di(t) {
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
function Ts(t) {
  return t.kind === "narration" ? "旁白" : t.speaker_mode === "visible" ? "出镜对白" : "画外音";
}
function _n(t) {
  return t.kind === "dialogue" && t.speaker_mode === "visible" && !!t.text.trim();
}
function bn(t) {
  return t.speech.some(_n);
}
function Es(t) {
  return new Set(
    t.speech.filter(_n).map((e) => e.character_id?.trim()).filter((e) => !!e)
  );
}
function Sn(t) {
  return `${t.title.trim() || "分镜脚本"} · ${t.shots.length} 个镜头`;
}
function Ps(t) {
  return t.summary.trim() || An("", t.shots);
}
function Ls(t, e) {
  return { ...t, style_prompt: e };
}
function wn(t) {
  const e = k(t);
  return ki.includes(e) ? e : Ai;
}
function kn(t) {
  const e = k(t);
  return Si.includes(e) ? e : "none";
}
function v(t, e, n) {
  if (t == null || n > 10)
    return null;
  if (typeof t == "string") {
    for (const s of Q(t)) {
      const a = v(s, e, n + 1);
      if (a)
        return a;
    }
    return null;
  }
  if (typeof t != "object" || e.has(t))
    return null;
  if (e.add(t), Array.isArray(t)) {
    for (const s of t) {
      const a = v(s, e, n + 1);
      if (a)
        return a;
    }
    return null;
  }
  const r = t, i = Ti(r);
  if (i)
    return i;
  const o = Bi(r);
  if (o) {
    const s = v(o, e, n + 1);
    if (s)
      return s;
  }
  for (const s of Mi) {
    const a = r[s];
    if (a == null || a === t)
      continue;
    const u = v(a, e, n + 1);
    if (u)
      return u;
  }
  return null;
}
function Ti(t) {
  const e = k(t.visual_mode).toLowerCase(), n = Pi(t.work_type);
  let r;
  try {
    r = At(t.min_shot_duration);
  } catch {
    return null;
  }
  if (k(t.type).toLowerCase() !== "storyboard" || T(t.version) !== zt || typeof t.title != "string" || typeof t.narrator_voice != "string" || typeof t.style_prompt != "string" || !zi(e) || !n || !Array.isArray(t.references) || !Array.isArray(t.materials) || !Array.isArray(t.shots))
    return null;
  const i = Li(t.storyline);
  if (!i)
    return null;
  const o = qt(t.references);
  if (o.length !== t.references.length)
    return null;
  const s = t.materials.map(xn);
  if (s.some((A) => !A))
    return null;
  const a = s, u = /* @__PURE__ */ new Set();
  for (const A of a) {
    if (u.has(A.id))
      return null;
    u.add(A.id);
  }
  const p = /* @__PURE__ */ new Set(), f = t.shots.map(
    (A, C) => Mn(A, C, u)
  );
  if (f.some((A) => !A))
    return null;
  const d = f;
  for (const [A, C] of d.entries()) {
    if (p.has(C.id) || fn(C, A) && C.continuity_state.entry !== d[A - 1].continuity_state.exit)
      return null;
    p.add(C.id);
  }
  const m = T(t.target_duration), l = T(t.target_shot_count);
  if (m == null || !Number.isInteger(m) || m < ln || l == null || !Number.isInteger(l) || l < 1 || l > bi)
    return null;
  const b = Ei(t, n);
  if (b === null)
    return null;
  const S = In(t.workflow), h = An(
    k(t.summary),
    d
  ), x = {
    ...t,
    type: "storyboard",
    version: zt,
    work_type: n,
    workflow: S,
    production_plan: ee(
      t.production_plan,
      n
    ),
    title: $i(t.title, h, d),
    summary: h,
    target_duration: m,
    target_shot_count: l,
    min_shot_duration: r,
    ...b,
    lyrics_lrc: n === "mv" ? k(t.lyrics_lrc) : "",
    narrator_voice: t.narrator_voice.trim(),
    storyline: i,
    style_prompt: t.style_prompt,
    visual_mode: e,
    aspect_ratio: wn(t.aspect_ratio),
    references: o,
    materials: a,
    shots: d
  };
  return Ii(x);
}
function Ei(t, e) {
  if ([
    t.storyboard_range_start_ms,
    t.storyboard_range_end_ms,
    t.storyboard_soundtrack_duration_ms,
    t.timeline_duration_ms
  ].every((a) => a == null || a === ""))
    return {};
  const r = nt(t.storyboard_range_start_ms), i = nt(t.storyboard_range_end_ms), o = nt(
    t.storyboard_soundtrack_duration_ms
  ), s = nt(t.timeline_duration_ms);
  return e !== "mv" || r == null || i == null || o == null || s == null || ![r, i, o, s].every(
    Number.isInteger
  ) || r < 0 || i <= r || i > o || s !== i - r ? null : {
    storyboard_range_start_ms: r,
    storyboard_range_end_ms: i,
    storyboard_soundtrack_duration_ms: o,
    timeline_duration_ms: s
  };
}
function Pi(t) {
  const e = k(t).toLowerCase();
  return e ? Tr(e) ? e : null : "short";
}
function Li(t) {
  if (!y(t))
    return null;
  const e = k(t.setup), n = k(t.development), r = k(t.payoff);
  return { setup: e, development: n, payoff: r };
}
function An(t, e) {
  const n = t.trim();
  if (n)
    return n;
  const r = e.map((i) => i.description.trim()).filter(Boolean);
  return r.length > 0 ? r.join("；") : "暂无内容简介";
}
function $i(t, e, n) {
  const r = t.trim();
  if (r && !pe.has(r))
    return r;
  const i = [e, n[0]?.beat, n[0]?.description].map((s) => String(s || "").trim()).find((s) => s && !pe.has(s));
  if (!i)
    return "分镜脚本";
  const o = i.split(/[\r\n。！？!?；;]/, 1)[0].trim();
  return Array.from(o).slice(0, 24).join("") || "分镜脚本";
}
function zi(t) {
  return wi.includes(t);
}
function xn(t) {
  if (!y(t))
    return null;
  const e = k(t.type).toLowerCase();
  return !Fi(e) || typeof t.id != "string" || !t.id.trim() || typeof t.name != "string" || typeof t.prompt != "string" || typeof t.voice != "string" || !Array.isArray(t.reference_keys) ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    name: t.name.trim().replace(/^[@#]+/, ""),
    prompt: t.prompt.trim(),
    voice: e === "character" ? t.voice.trim() : "",
    reference_keys: q(t.reference_keys.map(k))
  };
}
function Mn(t, e, n) {
  if (!y(t) || typeof t.id != "string" || !t.id.trim() || typeof t.beat != "string" || !t.beat.trim() || typeof t.transition != "string" || typeof t.transition_type != "string" || typeof t.match_previous != "boolean" || typeof t.description != "string" || t.spatial_layout != null && typeof t.spatial_layout != "string" || t.start_framing != null && typeof t.start_framing != "string" || t.end_framing != null && typeof t.end_framing != "string" || typeof t.camera_instruction != "string" || typeof t.video_prompt != "string" || typeof t.continue_previous != "boolean" || typeof t.continuity_anchor != "string" || !y(t.continuity_state) || !Array.isArray(t.material_ids) || !Array.isArray(t.reference_keys) || !Array.isArray(t.speech) || !Array.isArray(t.captions))
    return null;
  const r = T(t.duration);
  if (r == null || !Ni(r))
    return null;
  const i = t.material_ids.map(k);
  if (i.some((S) => !S || !n.has(S)) || new Set(i).size !== i.length)
    return null;
  const o = t.speech.map(Ui);
  if (o.some((S) => !S))
    return null;
  const s = t.captions.map(ji);
  if (s.some(
    (S) => !S || S.end_time > r
  ))
    return null;
  const a = e > 0 && t.continue_previous;
  if (e === 0 && (t.match_previous || t.continue_previous) || t.match_previous && t.continue_previous)
    return null;
  const u = e > 0 && !a && t.match_previous, p = U({
    shot_image_mode: t.shot_image_mode,
    match_previous: u,
    continue_previous: a
  }).mode, f = t.transition.trim();
  if (e > 0 && !f)
    return null;
  const d = t.continuity_anchor.trim();
  if (a && !d)
    return null;
  const m = yn(
    t.continuity_state
  );
  if (!m.entry || !m.exit)
    return null;
  const l = kn(
    t.transition_type
  ), b = T(t.transition_duration_ms);
  return l !== t.transition_type || b == null || !Number.isInteger(b) || b < 0 || b > 5e3 || e === 0 && (l !== "none" || b !== 0) || e > 0 && l === "none" && b !== 0 || e > 0 && l !== "none" && b < 100 ? null : {
    ...t,
    id: t.id.trim(),
    order: e + 1,
    duration: r,
    beat: t.beat.trim(),
    transition: e > 0 ? f : "",
    transition_type: e > 0 ? l : "none",
    transition_duration_ms: e > 0 && l !== "none" ? b : 0,
    description: t.description,
    spatial_layout: k(t.spatial_layout),
    start_framing: k(t.start_framing),
    end_framing: k(t.end_framing),
    camera_instruction: t.camera_instruction,
    video_prompt: t.video_prompt,
    material_ids: i,
    reference_keys: q(t.reference_keys.map(k)),
    shot_image_mode: p,
    match_previous: u,
    continue_previous: a,
    continuity_anchor: a ? d : "",
    continuity_state: m,
    lyric_line_indexes: Nn(
      t.lyric_line_indexes
    ),
    speech: o,
    captions: s
  };
}
function Nn(t) {
  return Array.isArray(t) ? [
    ...new Set(
      t.map(Number).filter((e) => Number.isInteger(e) && e > 0)
    )
  ].sort((e, n) => e - n) : [];
}
function Ui(t) {
  if (!y(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string" || typeof t.subtitle_enabled != "boolean" || typeof t.subtitle_text != "string")
    return null;
  const e = k(t.kind).toLowerCase(), n = T(t.start_time);
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
  const r = k(t.speaker_mode).toLowerCase();
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
function ji(t) {
  if (!y(t) || typeof t.id != "string" || !t.id.trim() || typeof t.text != "string")
    return null;
  const e = k(t.type).toLowerCase(), n = T(t.start_time), r = T(t.end_time);
  return !Vi(e) || n == null || r == null || n < 0 || r <= n ? null : {
    ...t,
    id: t.id.trim(),
    type: e,
    text: t.text,
    start_time: n,
    end_time: r
  };
}
function In(t) {
  const e = y(t) ? t : {}, n = k(e.status).toLowerCase() === "confirmed" ? "confirmed" : "draft";
  return {
    status: n,
    confirmed_at: n === "confirmed" ? k(e.confirmed_at) : ""
  };
}
function Dt(t, e) {
  const n = k(t).toLowerCase();
  return n === "auto" || n === "off" ? n : e;
}
function Bi(t) {
  const e = Xe(t);
  if (e)
    return e;
  if (!y(t))
    return "";
  const n = t.type === "doc" ? t : y(t.rich) && t.rich.type === "doc" ? t.rich : null;
  return n ? Cn(n).trim() : "";
}
function Cn(t) {
  if (!y(t))
    return "";
  if (t.type === "text")
    return k(t.text);
  if (t.type === "hardBreak")
    return `
`;
  if (!Array.isArray(t.content))
    return "";
  const e = t.type === "doc" || t.type === "paragraph" || t.type === "codeBlock" ? `
` : "";
  return t.content.map(Cn).join(e);
}
function Fi(t) {
  return t === "character" || t === "scene" || t === "prop";
}
function Vi(t) {
  return t === "caption" || t === "title" || t === "highlight";
}
function Gi(t) {
  return t.text.trim().length > 0;
}
function q(t) {
  return [...new Set(t.map((e) => e.trim()).filter(Boolean))];
}
function T(t) {
  const e = typeof t == "number" ? t : Number.NaN;
  return Number.isFinite(e) ? e : null;
}
await window.DeverFront?.ensureCompat?.(["@/page/nodes/show/tooltip"]);
const Ut = window.DeverFront?.sdk?.getCompatModule("@/page/nodes/show/tooltip");
if (!Ut || Object.keys(Ut).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/page/nodes/show/tooltip");
const vi = Ut.HoverTip, Hi = 12e3;
function ye({
  label: t,
  side: e = "top",
  sideOffset: n = 7,
  className: r = "",
  children: i
}) {
  return /* @__PURE__ */ c(
    vi,
    {
      content: t,
      side: e,
      sideOffset: n,
      layerZIndex: Hi,
      className: `max-w-80 whitespace-normal break-words ${r}`.trim(),
      children: i
    }
  );
}
const On = {
  image: "images",
  audio: "audios",
  video: "videos",
  file: "files"
};
function $s(t, e) {
  const n = On[t], r = n ? ne(e, t) : [];
  if (n && r.length > 0)
    return { [n]: r };
  const i = Wt(e);
  if (!i)
    return e;
  const o = kt(i);
  return o && (t === "text" || Ze(o.plainText)) ? { text: o.markdown } : { rich: i };
}
function Yi(t, e) {
  return ne(t, e)[0] || "";
}
function ne(t, e) {
  return Ki(t, e).map((n) => n.url);
}
function Ki(t, e) {
  return Wi(e) ? ti(t, e) : [];
}
function zs(t, e) {
  if (!On[e])
    return 0;
  const n = ne(t, e).length;
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
function Wi(t) {
  return t === "image" || t === "video" || t === "audio" || t === "file";
}
function he(t, e = 0) {
  if (e > 8 || t == null) return "";
  if (typeof t == "string") return Rn(t) ? "" : t.trim();
  if (Array.isArray(t))
    return t.map((r) => he(r, e + 1)).filter(Boolean)[0] || "";
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
    const i = he(n[r], e + 1);
    if (i) return i;
  }
  return "";
}
function Us(t) {
  const e = t?.source?.prompt;
  return typeof e == "string" ? e.trim() : "";
}
function js(t) {
  const e = Yi(t, "file"), n = dt(t) || Jn(e), r = n.match(/\.([a-z0-9]{1,10})$/i)?.[1] || "";
  return { url: e, name: n, extension: r };
}
function dt(t, e = 0) {
  if (t == null || e > 8) return "";
  if (typeof t == "string") {
    const r = t.trim();
    return Rn(r) ? "" : r;
  }
  if (Array.isArray(t)) {
    for (const r of t) {
      const i = dt(r, e + 1);
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
    const i = dt(n[r], e + 1);
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
    const i = dt(n[r], e + 1);
    if (i) return i;
  }
  return "";
}
function Rn(t) {
  return /^(https?:\/\/|\/|data:|blob:)/.test(t.trim());
}
const Ji = [
  "title",
  "text",
  "reasoning",
  "progress",
  "error",
  "json"
], qi = /* @__PURE__ */ new Set([
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
]), Xi = /* @__PURE__ */ new Set([
  "agentabilityplaceholder",
  "agenttaskplaceholder",
  "horizontalrule"
]);
function Zi({
  items: t,
  mediaCount: e,
  previewMediaURL: n,
  outputMediaURLs: r = []
}) {
  if (t.length > 1 || e > 1)
    return !0;
  const i = e === 1 && X(n) !== "" && r.length === 1 && X(r[0]) === X(n);
  return t.some(
    (o) => Qi(o, i)
  );
}
function Qi(t, e) {
  return jt(t) ? Ji.some((n) => ft(t[n])) ? !0 : ft(t.rich) ? !e || lt(t.rich, /* @__PURE__ */ new Set(), 0) : !1 : ft(t);
}
function lt(t, e, n) {
  if (t == null || t === "")
    return !1;
  if (n > 32)
    return !0;
  if (typeof t == "string") {
    const i = t.trim();
    if (!i)
      return !1;
    try {
      return lt(
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
      (i) => lt(i, e, n + 1)
    );
  if (!jt(t) || e.has(t))
    return !0;
  e.add(t);
  const r = to(t.type);
  if (r === "text")
    return X(t.text) !== "";
  if (qi.has(r)) {
    const i = jt(t.attrs) ? t.attrs : void 0;
    return ft(i?.caption);
  }
  return Xi.has(r) ? !0 : Array.isArray(t.content) ? t.content.some(
    (i) => lt(i, e, n + 1)
  ) : !1;
}
function ft(t) {
  return t == null ? !1 : typeof t == "string" ? t.trim() !== "" : Array.isArray(t) ? t.length > 0 : typeof t == "object" ? Object.keys(t).length > 0 : !0;
}
function jt(t) {
  return t != null && typeof t == "object" && !Array.isArray(t);
}
function to(t) {
  return X(t).toLowerCase().replace(/[\s_-]+/g, "");
}
function X(t) {
  return typeof t == "string" ? t.trim() : "";
}
function Bs(t, e) {
  if (no(t, e))
    return !1;
  const n = Qe(t), r = It(t), i = Dn(e);
  return Zi({
    items: r,
    mediaCount: n,
    previewMediaURL: i?.url,
    outputMediaURLs: i ? tn(t, i.kind).map(
      (o) => o.url
    ) : []
  });
}
function eo(t, e) {
  if (!e)
    return null;
  const n = tn(t, e);
  return n.length > 1 ? { kind: e, items: n } : null;
}
function Fs(t) {
  return Dn(t)?.kind;
}
function Dn(t) {
  if (t?.videoUrl)
    return { kind: "video", url: t.videoUrl };
  if (t?.imageUrl)
    return { kind: "image", url: t.imageUrl };
  if (t?.audioUrl)
    return { kind: "audio", url: t.audioUrl };
}
function no(t, e) {
  const n = Bt(t, /* @__PURE__ */ new Set(), 0);
  return !n || !e ? !1 : [
    e.imageUrl,
    e.videoUrl,
    e.audioUrl,
    e.fileUrl
  ].some((r) => String(r || "").trim() === n);
}
function Bt(t, e, n) {
  if (t == null || n > 12)
    return "";
  if (typeof t == "string")
    return t.trim();
  if (Array.isArray(t))
    return t.length === 1 ? Bt(t[0], e, n + 1) : "";
  if (typeof t != "object" || e.has(t))
    return "";
  e.add(t);
  const i = Object.entries(t).filter(
    ([o, s]) => !["type", "kind", "format", "version"].includes(o) && Mt(s)
  ).map(([, o]) => o);
  return i.length === 1 ? Bt(i[0], e, n + 1) : "";
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const Ft = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!Ft || Object.keys(Ft).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const ge = Ft, _e = ge.ContentView || ge.EnergonContentView;
function ro({
  output: t,
  fallback: e = "",
  streaming: n = !1,
  emptyText: r = "暂无内容",
  className: i,
  markdownClassName: o,
  richClassName: s,
  mediaLayout: a = "default"
}) {
  const u = Tn(t, e);
  return _e ? /* @__PURE__ */ c(mt, { className: i, children: /* @__PURE__ */ c(
    _e,
    {
      output: u,
      streaming: n,
      emptyText: r,
      markdownClassName: o,
      richClassName: s,
      mediaLayout: a
    }
  ) }) : e ? /* @__PURE__ */ c("div", { className: i, children: e }) : null;
}
function Tn(t, e = "") {
  return Mt(t) ? t : e ? { text: e } : t;
}
function mt({
  className: t,
  children: e
}) {
  const n = (r) => {
    io(r.target) && r.stopPropagation();
  };
  return /* @__PURE__ */ c(
    "div",
    {
      className: t,
      onPointerDown: n,
      onClick: n,
      children: e
    }
  );
}
function io(t) {
  return t instanceof Element && !!t.closest(
    "a, button, input, textarea, select, audio, video, [role='button']"
  );
}
function En(t, e) {
  const n = Ur(e, t), r = Math.max(1, Math.ceil(t / n.capacity)), [i, o] = O(0), s = Br(i, r);
  return {
    shape: n,
    pageCount: r,
    pageIndex: s,
    pageOffset: s * n.capacity,
    setPageIndex: o
  };
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/dropdown-menu", "@/components/energon/content-view"]);
const j = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dropdown-menu");
if (!j || Object.keys(j).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dropdown-menu");
const oo = j.DropdownMenu, so = j.DropdownMenuContent, ao = j.DropdownMenuItem, co = j.DropdownMenuTrigger, Vt = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!Vt || Object.keys(Vt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const uo = Vt.EnergonAudioPlayer, lo = {
  image: "图片",
  video: "视频",
  audio: "音频"
}, fo = {
  image: "张",
  video: "个",
  audio: "个"
};
function Pn({
  layout: t,
  countLabel: e,
  pageIndex: n,
  pageCount: r,
  disabled: i = !1,
  leading: o,
  actions: s,
  onLayoutChange: a,
  onPageChange: u
}) {
  const p = Zt(t), f = je(p);
  return /* @__PURE__ */ _("header", { className: "ws-media-grid-toolbar", children: [
    /* @__PURE__ */ _("div", { className: "ws-media-grid-toolbar-main", children: [
      o,
      /* @__PURE__ */ _(oo, { modal: !1, children: [
        /* @__PURE__ */ c(co, { asChild: !0, children: /* @__PURE__ */ _(
          "button",
          {
            type: "button",
            className: "ws-media-grid-layout-trigger nodrag nopan",
            disabled: i || !a,
            "aria-label": "选择每页宫格布局",
            onClick: (d) => d.stopPropagation(),
            children: [
              /* @__PURE__ */ c(ir, { size: 14 }),
              f.label,
              /* @__PURE__ */ c(Me, { size: 12 })
            ]
          }
        ) }),
        /* @__PURE__ */ c(
          so,
          {
            align: "start",
            className: "ws-media-grid-layout-menu",
            onClick: (d) => d.stopPropagation(),
            children: ht.map((d) => /* @__PURE__ */ _(
              ao,
              {
                className: "ws-media-grid-layout-item",
                onSelect: () => {
                  u(0), a?.(d.value);
                },
                children: [
                  /* @__PURE__ */ c("span", { children: d.label }),
                  /* @__PURE__ */ c("small", { children: d.value === "auto" ? "按结果排版" : `每页 ${d.capacity} 格` }),
                  d.value === p ? /* @__PURE__ */ c(Ne, { size: 13 }) : null
                ]
              },
              d.value
            ))
          }
        )
      ] }),
      /* @__PURE__ */ c("span", { className: "ws-media-grid-count", children: e }),
      r > 1 ? /* @__PURE__ */ _("div", { className: "ws-media-grid-page-controls", "aria-label": "宫格分页", children: [
        /* @__PURE__ */ c(
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
            children: /* @__PURE__ */ c(or, { size: 14 })
          }
        ),
        /* @__PURE__ */ _("span", { children: [
          n + 1,
          "/",
          r
        ] }),
        /* @__PURE__ */ c(
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
            children: /* @__PURE__ */ c(sr, { size: 14 })
          }
        )
      ] }) : null
    ] }),
    s ? /* @__PURE__ */ c("div", { className: "ws-media-grid-toolbar-actions", children: s }) : null
  ] });
}
function mo({
  kind: t,
  items: e,
  label: n,
  compact: r = !1
}) {
  const [i, o] = O("auto"), s = En(e.length, i), a = r ? jr(e.length) : s.shape, u = r ? 0 : s.pageOffset, p = e.slice(u, u + a.capacity), f = Array.from(
    { length: a.capacity },
    (l, b) => p[b]
  ), d = lo[t], m = fo[t];
  return /* @__PURE__ */ _(
    "section",
    {
      className: `ws-media-grid-view is-${t}${r ? " is-compact" : ""}`,
      children: [
        r ? /* @__PURE__ */ c(
          "span",
          {
            className: "ws-media-grid-compact-count",
            "aria-label": `共 ${e.length} ${m}`,
            children: e.length > a.capacity ? `共${e.length}${m}` : `${e.length}${m}`
          }
        ) : /* @__PURE__ */ c(
          Pn,
          {
            layout: i,
            countLabel: `${e.length} ${m}`,
            pageIndex: s.pageIndex,
            pageCount: s.pageCount,
            onLayoutChange: o,
            onPageChange: s.setPageIndex
          }
        ),
        /* @__PURE__ */ c("div", { className: "ws-media-grid-body nowheel", children: /* @__PURE__ */ c(
          "div",
          {
            className: "ws-media-grid-list",
            style: {
              gridTemplateColumns: `repeat(${a.columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${a.rows}, minmax(0, 1fr))`
            },
            children: f.map((l, b) => {
              const S = u + b, h = `${n || d} ${S + 1}`;
              return l ? /* @__PURE__ */ c(
                "figure",
                {
                  className: t === "audio" ? "is-audio" : void 0,
                  "aria-label": t === "audio" ? h : void 0,
                  children: /* @__PURE__ */ c(po, { kind: t, item: l, label: h })
                },
                `${l.url}-${S}`
              ) : /* @__PURE__ */ c("figure", { className: "is-empty" }, `empty-${S}`);
            })
          }
        ) })
      ]
    }
  );
}
function po({
  kind: t,
  item: e,
  label: n
}) {
  const { url: r } = e;
  return t === "image" ? /* @__PURE__ */ c(
    "img",
    {
      src: r,
      alt: n,
      loading: "lazy",
      decoding: "async",
      draggable: !1
    }
  ) : t === "video" ? /* @__PURE__ */ c(
    yr,
    {
      src: r,
      poster: e.thumbnail,
      draggable: !1,
      ariaLabel: n,
      objectFit: "cover"
    },
    r
  ) : /* @__PURE__ */ _(
    "div",
    {
      className: `ws-media-grid-audio-card${e.thumbnail ? " has-cover" : ""}`,
      children: [
        e.thumbnail ? /* @__PURE__ */ c("img", { src: e.thumbnail, alt: "", loading: "lazy", decoding: "async" }) : null,
        /* @__PURE__ */ c(
          uo,
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
const Vs = 10040;
function yo({
  ariaLabel: t,
  header: e,
  children: n,
  onRequestClose: r,
  layer: i = "default"
}) {
  const o = /* @__PURE__ */ c(
    "div",
    {
      className: `wb-detail-backdrop ${i === "nested" ? "is-nested" : ""}`.trim(),
      "data-slot": "dialog-layer",
      role: "presentation",
      onMouseDown: () => {
        r();
      },
      children: /* @__PURE__ */ _(
        "section",
        {
          className: "wb-detail-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": t,
          onMouseDown: (s) => s.stopPropagation(),
          children: [
            e,
            n
          ]
        }
      )
    }
  );
  return typeof document > "u" ? null : fr(o, document.body);
}
function ho({
  icon: t,
  title: e,
  subtitle: n,
  versionSelect: r,
  state: i,
  updatedAt: o,
  actions: s,
  downloadUrl: a,
  onClose: u
}) {
  return /* @__PURE__ */ _("header", { className: "wb-detail-head", children: [
    /* @__PURE__ */ _("div", { className: "wb-detail-heading", children: [
      /* @__PURE__ */ c("span", { className: "wb-detail-kind-icon", "aria-hidden": "true", children: t }),
      /* @__PURE__ */ _("div", { children: [
        /* @__PURE__ */ c("strong", { children: e || "详情" }),
        n ? /* @__PURE__ */ c("span", { children: n }) : null
      ] })
    ] }),
    /* @__PURE__ */ _("div", { className: "wb-detail-meta", children: [
      r,
      i,
      o ? /* @__PURE__ */ c("time", { children: o }) : null
    ] }),
    /* @__PURE__ */ _("div", { className: "wb-detail-actions", children: [
      s,
      a ? /* @__PURE__ */ c(ye, { label: "下载内容", children: /* @__PURE__ */ c(
        qn,
        {
          url: a,
          name: e,
          className: "wb-detail-icon-button"
        }
      ) }) : null,
      /* @__PURE__ */ c(ye, { label: "关闭", children: /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "wb-detail-icon-button",
          onClick: u,
          "aria-label": "关闭详情",
          children: /* @__PURE__ */ c(ar, { size: 18 })
        }
      ) })
    ] })
  ] });
}
function Gs({
  options: t,
  currentVersionId: e,
  selectedVersionId: n,
  total: r,
  hasMore: i,
  loading: o,
  loadingMore: s,
  error: a,
  disabled: u = !1,
  onSelect: p,
  onLoadMore: f,
  onRetry: d
}) {
  const [m, l] = O(!1), b = xe(null), S = t.find((h) => h.id === n) || t.find((h) => h.id === e);
  return pt(() => {
    if (!m) return;
    const h = (x) => {
      b.current?.contains(x.target) || l(!1);
    };
    return document.addEventListener("mousedown", h), () => document.removeEventListener("mousedown", h);
  }, [m]), !n && !o ? null : /* @__PURE__ */ _("div", { className: "wb-detail-version-select", ref: b, children: [
    /* @__PURE__ */ _(
      "button",
      {
        type: "button",
        className: "wb-detail-version-trigger",
        "aria-haspopup": "listbox",
        "aria-expanded": m,
        disabled: u || o && t.length === 0,
        onClick: () => l((h) => !h),
        children: [
          o && t.length === 0 ? /* @__PURE__ */ c(H, { size: 12, className: "wb-detail-spin" }) : null,
          /* @__PURE__ */ c("span", { children: Se(S?.version) }),
          r > 0 ? /* @__PURE__ */ _("small", { children: [
            r,
            " 个版本"
          ] }) : null,
          /* @__PURE__ */ c(Me, { size: 13 })
        ]
      }
    ),
    m ? /* @__PURE__ */ c("div", { className: "wb-detail-version-menu", role: "listbox", children: /* @__PURE__ */ _(
      "div",
      {
        className: "wb-detail-version-options",
        onScroll: (h) => {
          const x = h.currentTarget;
          i && !s && x.scrollHeight - x.scrollTop - x.clientHeight < 36 && f();
        },
        children: [
          t.length > 0 ? t.map((h) => {
            const x = h.id === n, A = h.id === e;
            return /* @__PURE__ */ _(
              "button",
              {
                type: "button",
                role: "option",
                "aria-selected": x,
                className: x ? "is-selected" : "",
                onClick: () => {
                  l(!1), p(h.value);
                },
                children: [
                  /* @__PURE__ */ _("span", { children: [
                    /* @__PURE__ */ c("strong", { children: Se(h.version) }),
                    A ? /* @__PURE__ */ c("small", { children: "当前" }) : null
                  ] }),
                  /* @__PURE__ */ c("time", { children: go(h.updatedAt) }),
                  x ? /* @__PURE__ */ c(Ne, { size: 13 }) : /* @__PURE__ */ c("i", { "aria-hidden": "true" })
                ]
              },
              h.id
            );
          }) : a ? /* @__PURE__ */ c(be, { error: a, onRetry: d }) : /* @__PURE__ */ _("div", { className: "wb-detail-version-message", children: [
            o ? /* @__PURE__ */ c(H, { size: 14, className: "wb-detail-spin" }) : null,
            /* @__PURE__ */ c("span", { children: o ? "正在读取版本" : "暂无版本" })
          ] }),
          a && t.length > 0 ? /* @__PURE__ */ c(be, { error: a, onRetry: d }) : null,
          s ? /* @__PURE__ */ _("div", { className: "wb-detail-version-loading", children: [
            /* @__PURE__ */ c(H, { size: 13, className: "wb-detail-spin" }),
            "正在加载更多"
          ] }) : null
        ]
      }
    ) }) : null
  ] });
}
function be({
  error: t,
  onRetry: e
}) {
  return /* @__PURE__ */ _("div", { className: "wb-detail-version-message is-error", children: [
    /* @__PURE__ */ c("span", { children: t }),
    /* @__PURE__ */ _("button", { type: "button", onClick: e, children: [
      /* @__PURE__ */ c(cr, { size: 12 }),
      "重试"
    ] })
  ] });
}
function Se(t) {
  const e = Number(t || 0);
  return e > 0 ? `第${e}版` : "版本";
}
function go(t) {
  const e = String(t || "").trim();
  return e ? e.replace("T", " ").replace(/\.\d+(Z)?$/, "").replace(/Z$/, "") : "";
}
function _o({
  items: t,
  initialItemID: e,
  onClose: n
}) {
  const r = we(t, e), [i, o] = O(r), s = t.map((p) => `${String(p.id)}:${p.url}`).join(`
`);
  pt(() => {
    o(we(t, e));
  }, [e, s]), pt(() => {
    const p = (f) => {
      f.key === "Escape" && n();
    };
    return document.addEventListener("keydown", p), () => document.removeEventListener("keydown", p);
  }, [n]);
  const a = Math.min(
    Math.max(0, i),
    Math.max(0, t.length - 1)
  ), u = t[a];
  return u ? /* @__PURE__ */ c(
    yo,
    {
      ariaLabel: "图片预览",
      layer: "nested",
      onRequestClose: n,
      header: /* @__PURE__ */ c(
        ho,
        {
          icon: /* @__PURE__ */ c(ur, { size: 16 }),
          title: u.name || "图片预览",
          subtitle: `图片 ${a + 1}/${t.length}`,
          downloadUrl: u.url,
          onClose: n
        }
      ),
      children: /* @__PURE__ */ c("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ c(
        Xn,
        {
          kind: "image",
          items: t,
          activeIndex: a,
          onSelect: o
        }
      ) })
    }
  ) : null;
}
function we(t, e) {
  const n = t.findIndex((r) => String(r.id) === String(e));
  return n >= 0 ? n : 0;
}
function Ln({
  grid: t,
  variant: e = "compact",
  readonly: n = !0,
  renderFrameAction: r,
  onFrameChange: i,
  onFrameImport: o,
  onEmptyFrameImport: s,
  capacity: a,
  showHeader: u = !0,
  showCaptions: p = !0,
  columns: f,
  rows: d,
  frameOffset: m = 0,
  previewFrames: l
}) {
  const [b, S] = O(
    null
  ), h = Qn(
    () => (l || t.frames).filter((g) => !!g.image).map((g) => ({
      id: g.id || g.order,
      name: g.title || `画面 ${g.order}`,
      url: g.image,
      thumbnail: g.image
    })),
    [t.frames, l]
  ), x = Math.max(
    t.frames.length,
    Math.trunc(Number(a) || 0)
  ), A = Array.from(
    { length: x },
    (g, E) => t.frames[E]
  ), C = {
    ...f ? { gridTemplateColumns: `repeat(${f}, minmax(0, 1fr))` } : {},
    ...d ? { gridTemplateRows: `repeat(${d}, minmax(0, 1fr))` } : {}
  };
  return /* @__PURE__ */ _("section", { className: `ws-storyboard-grid-output is-${e}`, children: [
    u ? /* @__PURE__ */ _("header", { children: [
      /* @__PURE__ */ c("strong", { children: t.title }),
      t.summary ? /* @__PURE__ */ c("p", { children: t.summary }) : null
    ] }) : null,
    /* @__PURE__ */ c(
      "div",
      {
        className: "ws-storyboard-grid-output-list",
        "data-count": A.length,
        style: C,
        children: A.map((g, E) => {
          const I = m + E;
          return g ? /* @__PURE__ */ _("figure", { className: g.image ? "" : "is-empty", children: [
            g.image ? /* @__PURE__ */ c(
              bo,
              {
                frame: g,
                onPreview: () => S(g.id || g.order)
              },
              `${g.id}:${g.image}`
            ) : o ? /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "ws-storyboard-grid-frame-empty nodrag nopan",
                title: "导入图片",
                "aria-label": `向第 ${g.order} 格导入图片`,
                onClick: (M) => {
                  M.preventDefault(), M.stopPropagation(), o(g, I);
                },
                children: /* @__PURE__ */ c(Y, { size: 18 })
              }
            ) : /* @__PURE__ */ c("div", { className: "ws-storyboard-grid-output-error", children: g.error || "暂无图片" }),
            g.image && o ? /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "ws-storyboard-grid-frame-import nodrag nopan",
                title: "替换图片",
                "aria-label": `替换第 ${g.order} 格图片`,
                onClick: (M) => {
                  M.preventDefault(), M.stopPropagation(), o(g, I);
                },
                children: /* @__PURE__ */ c(Y, { size: 14 })
              }
            ) : null,
            p ? /* @__PURE__ */ _("figcaption", { children: [
              /* @__PURE__ */ c("span", { children: String(g.order).padStart(2, "0") }),
              e === "detail" && !n && i ? /* @__PURE__ */ c(
                "input",
                {
                  value: g.title,
                  "aria-label": `第 ${g.order} 格标题`,
                  onChange: (M) => i(I, { title: M.target.value })
                }
              ) : /* @__PURE__ */ c("strong", { children: g.title })
            ] }) : null,
            e === "detail" ? /* @__PURE__ */ _("div", { className: "ws-storyboard-grid-output-details", children: [
              n || !i ? /* @__PURE__ */ c("p", { children: g.description || "暂无画面说明" }) : /* @__PURE__ */ c(
                "textarea",
                {
                  value: g.description,
                  rows: 3,
                  "aria-label": `第 ${g.order} 格说明`,
                  placeholder: "画面说明",
                  onChange: (M) => i(I, {
                    description: M.target.value
                  })
                }
              ),
              r ? /* @__PURE__ */ c("div", { className: "ws-storyboard-grid-output-actions", children: r(g, I) }) : null
            ] }) : null
          ] }, g.id) : /* @__PURE__ */ c("figure", { className: "is-empty", children: s ? /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "ws-storyboard-grid-frame-empty nodrag nopan",
              title: "导入图片",
              "aria-label": `向第 ${I + 1} 格导入图片`,
              onClick: (M) => {
                M.preventDefault(), M.stopPropagation(), s(I);
              },
              children: /* @__PURE__ */ c(Y, { size: 18 })
            }
          ) : null }, `empty-${I}`);
        })
      }
    ),
    b != null && h.length > 0 ? /* @__PURE__ */ c(
      _o,
      {
        items: h,
        initialItemID: b,
        onClose: () => S(null)
      }
    ) : null
  ] });
}
function bo({
  frame: t,
  onPreview: e
}) {
  const [n, r] = O(!1);
  return n ? /* @__PURE__ */ c("div", { className: "ws-storyboard-grid-output-error", children: t.error || "图片加载失败" }) : /* @__PURE__ */ c(
    "button",
    {
      type: "button",
      className: "ws-storyboard-grid-image nodrag nopan",
      title: "预览图片",
      "aria-label": `预览第 ${t.order} 格图片`,
      onClick: (i) => {
        i.preventDefault(), i.stopPropagation(), e();
      },
      children: /* @__PURE__ */ c(
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
function vs({
  grid: t,
  aspectRatio: e,
  running: n = !1,
  onImport: r,
  onFrameImport: i,
  onSlotImport: o,
  onEdit: s,
  layout: a = "auto",
  onLayoutChange: u
}) {
  const p = Zt(a), f = t?.frames.length || 0, d = En(f, p), m = t ? {
    ...t,
    frames: t.frames.slice(
      d.pageOffset,
      d.pageOffset + d.shape.capacity
    )
  } : null, l = t?.frames.filter((S) => S.image).length || 0, b = f > 0 && l !== f ? `${l}/${f} 张` : `${f} 张`;
  return /* @__PURE__ */ _(
    "section",
    {
      className: `ws-storyboard-grid-canvas ${n ? "is-running" : ""}`,
      children: [
        /* @__PURE__ */ c(
          Pn,
          {
            layout: p,
            countLabel: b,
            pageIndex: d.pageIndex,
            pageCount: d.pageCount,
            disabled: n || !u,
            leading: /* @__PURE__ */ _("span", { children: [
              "比例 ",
              e || "自动"
            ] }),
            actions: r || t && s ? /* @__PURE__ */ _(Zn, { children: [
              r ? /* @__PURE__ */ _(
                "button",
                {
                  type: "button",
                  className: "nodrag nopan",
                  disabled: n,
                  onClick: (S) => {
                    S.stopPropagation(), r();
                  },
                  children: [
                    /* @__PURE__ */ c(Y, { size: 14 }),
                    /* @__PURE__ */ c("span", { children: t ? "批量导入" : "导入图片" })
                  ]
                }
              ) : null,
              t && s ? /* @__PURE__ */ _(
                "button",
                {
                  type: "button",
                  className: "nodrag nopan",
                  disabled: n,
                  onClick: (S) => {
                    S.stopPropagation(), s();
                  },
                  children: [
                    /* @__PURE__ */ c(dr, { size: 14 }),
                    /* @__PURE__ */ c("span", { children: "编辑" })
                  ]
                }
              ) : null
            ] }) : void 0,
            onLayoutChange: u,
            onPageChange: d.setPageIndex
          }
        ),
        /* @__PURE__ */ c("div", { className: "ws-storyboard-grid-canvas-body nowheel", children: m ? /* @__PURE__ */ c(
          Ln,
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
        ) : /* @__PURE__ */ c(
          "div",
          {
            className: "ws-storyboard-grid-placeholder",
            "aria-busy": n,
            style: {
              gridTemplateColumns: `repeat(${d.shape.columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${d.shape.rows}, minmax(0, 1fr))`
            },
            children: Array.from({ length: d.shape.capacity }, (S, h) => /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "nodrag nopan",
                disabled: n || !o,
                title: "导入图片",
                "aria-label": `向宫格导入图片，第 ${h + 1} 格`,
                onClick: (x) => {
                  x.stopPropagation(), o?.(h);
                },
                children: /* @__PURE__ */ c(Y, { size: 18 })
              },
              h
            ))
          }
        ) })
      ]
    }
  );
}
const So = tr(
  () => import("./space-storyboard-view-BjtySfOj.js").then((t) => ({
    default: t.StoryboardView
  }))
);
function Hs({
  output: t,
  fallback: e = "",
  streaming: n = !1,
  emptyText: r = "暂无内容",
  className: i,
  markdownClassName: o,
  richClassName: s,
  mediaLayout: a = "default",
  mediaGridKind: u,
  compactMediaGrid: p = !1,
  storyboardEditable: f = !1,
  storyboardDisabled: d = !1,
  onStoryboardSave: m
}) {
  const l = Tn(t, e), b = mn(l), S = xt(l);
  if (S)
    return /* @__PURE__ */ c(mt, { className: i, children: /* @__PURE__ */ c(Ln, { grid: S }) });
  if (b)
    return /* @__PURE__ */ c(mt, { className: i, children: /* @__PURE__ */ c(er, { fallback: /* @__PURE__ */ c("div", { className: "min-h-24", "aria-busy": "true" }), children: /* @__PURE__ */ c(
      So,
      {
        storyboard: b,
        editable: f,
        disabled: d,
        onSave: m
      }
    ) }) });
  const h = eo(l, u);
  return h ? /* @__PURE__ */ c(
    mt,
    {
      className: [i, "ws-media-grid-content"].filter(Boolean).join(" "),
      children: /* @__PURE__ */ c(
        mo,
        {
          kind: h.kind,
          items: h.items,
          label: e,
          compact: p
        }
      )
    }
  ) : /* @__PURE__ */ c(
    ro,
    {
      output: l,
      fallback: e,
      streaming: n,
      emptyText: r,
      className: i,
      markdownClassName: o,
      richClassName: s,
      mediaLayout: a
    }
  );
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const Gt = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!Gt || Object.keys(Gt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const wo = Gt.EnergonAudioPlayer;
function Ys({
  src: t,
  prompt: e = "",
  detailed: n = !1,
  autoPlay: r = !1
}) {
  const i = /* @__PURE__ */ c(
    "div",
    {
      className: [
        "wb-asset-audio-preview",
        n ? "is-detail" : ""
      ].filter(Boolean).join(" "),
      children: /* @__PURE__ */ c(
        wo,
        {
          src: t,
          detailed: n,
          autoPlay: r,
          className: "h-full min-h-0 border-0 bg-transparent p-0 shadow-none"
        }
      )
    }
  );
  return n ? /* @__PURE__ */ _("div", { className: "wb-asset-audio-detail", children: [
    i,
    e ? /* @__PURE__ */ _("section", { className: "wb-asset-audio-prompt", children: [
      /* @__PURE__ */ _("header", { children: [
        /* @__PURE__ */ c(lr, { "aria-hidden": "true" }),
        /* @__PURE__ */ c("strong", { children: "语音文本" })
      ] }),
      /* @__PURE__ */ c("p", { children: e })
    ] }) : null
  ] }) : i;
}
function Ks(t, e, n) {
  const r = Ao(t, e), i = n || t.kind, o = xt(r);
  if (o)
    return {
      mode: "storyboard_grid",
      value: o,
      format: "json",
      summary: zn(o),
      downloadUrl: ""
    };
  const s = mn(r);
  if (s)
    return {
      mode: "storyboard",
      value: s,
      format: "json",
      summary: Sn(s),
      downloadUrl: ""
    };
  const a = jn(r);
  if (a) {
    if (i === "text") {
      const l = kt(a);
      return it(l?.markdown || tt(a));
    }
    const m = Ro(r) ? null : kt(a);
    return m && Ze(m.plainText) ? it(m.markdown) : ke(a);
  }
  const u = Ht(r);
  if (u)
    return {
      mode: "file",
      value: u,
      format: "json",
      summary: u.description || u.name || "文件内容",
      downloadUrl: u.url
    };
  const p = Co(r);
  if (p)
    return it(p);
  const f = xo(r);
  if (f)
    return ke(f);
  const d = Yt(r) || t.description || "";
  return it(d);
}
function Ws(t, e, n = {}) {
  const r = n.includeNodeResult === !1 ? e?.content : fi(
    e?.content,
    t.asset?.version?.content,
    t.resultOutput,
    Bn(t, "result", "output")
  ), i = R(r);
  if (xt(i))
    return;
  const o = Xe(i);
  for (const a of [i, R(o)])
    if (ui(a))
      return ko(a);
  const s = Io(t.kind, i);
  if (s)
    return s;
}
function ko(t) {
  const n = It(t).map((r) => {
    if (!y(r) || r.json === void 0)
      return r;
    const i = { ...r };
    return delete i.json, i;
  });
  return n.length === 1 ? n[0] : n;
}
function Ao(t, e) {
  return kr(
    e?.content,
    t.asset?.version?.content,
    t.resultOutput,
    Bn(t, "result", "output"),
    t.description
  );
}
function $n(t) {
  if (t.mode === "storyboard" || t.mode === "storyboard_grid")
    return t.value;
  if (t.mode === "file")
    return No(t.value);
  const e = String(t.value || "");
  return t.format === "markdown" ? { format: "markdown", text: e } : K(R(e)) || Oo(e);
}
function Js(t) {
  return Re($n(t));
}
function qs(t, e) {
  const n = { ...t, value: e };
  if (n.mode === "storyboard")
    n.summary = Sn(e);
  else if (n.mode === "storyboard_grid")
    n.summary = zn(e);
  else if (n.mode === "file") {
    const r = e;
    n.summary = r.description || r.name || "文件内容", n.downloadUrl = r.url;
  } else
    n.summary = re(tt($n(n)));
  return n;
}
function zn(t) {
  return N(
    t.summary,
    `${t.title || "宫格图片"} · ${t.frames.length} 张`
  );
}
function ke(t) {
  const e = tt(t);
  return {
    mode: "rich",
    value: Re(t),
    format: "json",
    summary: re(e),
    downloadUrl: Un(t)
  };
}
function it(t) {
  return {
    mode: "rich",
    value: t,
    format: "markdown",
    summary: re(t),
    downloadUrl: ""
  };
}
function xo(t) {
  if (typeof t == "string" && R(t) === t)
    return null;
  const e = It(t), n = [];
  return vt(
    e,
    n,
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    0
  ), n.length === 0 ? null : K({ type: "doc", content: n });
}
function vt(t, e, n, r, i, o) {
  if (t == null || o > 12)
    return;
  const s = R(t);
  if (typeof s == "string") {
    Ae(e, s, r);
    return;
  }
  if (Array.isArray(s)) {
    s.forEach(
      (u) => vt(
        u,
        e,
        n,
        r,
        i,
        o + 1
      )
    );
    return;
  }
  if (!y(s) || n.has(s))
    return;
  n.add(s);
  const a = jn(s);
  if (a) {
    for (const u of a.content || [])
      e.push(u);
    return;
  }
  Ae(
    e,
    N(s.title, s.text),
    r
  ), Mo(s, e, i);
  for (const u of [
    "rich",
    "content",
    "output",
    "result",
    "data",
    "body",
    "value"
  ])
    s[u] !== void 0 && vt(
      s[u],
      e,
      n,
      r,
      i,
      o + 1
    );
}
function Mo(t, e, n) {
  const r = [
    { kind: "image", values: [t.image, t.image_url, t.imageUrl, t.images] },
    { kind: "video", values: [t.video, t.video_url, t.videoUrl, t.videos] },
    { kind: "audio", values: [t.audio, t.audio_url, t.audioUrl, t.audios] }
  ];
  for (const i of r)
    for (const o of i.values)
      for (const s of Z(o)) {
        const a = `${i.kind}:${s}`;
        n.has(a) || (n.add(a), e.push({
          type: Do(i.kind),
          attrs: { src: s }
        }));
      }
}
function Ae(t, e, n) {
  const r = String(e || "").trim();
  !r || Vn(r) || ie(r) || n.has(r) || (n.add(r), t.push({
    type: "paragraph",
    content: [{ type: "text", text: r }]
  }));
}
function Z(t) {
  return Array.isArray(t) ? t.flatMap(Z) : typeof t == "string" ? Vn(t.trim()) ? [t.trim()] : [] : y(t) ? [
    t.url,
    t.src,
    t.path,
    t.download_url,
    t.downloadUrl
  ].flatMap(Z) : [];
}
function Ht(t) {
  const e = R(t);
  if (Array.isArray(e)) {
    for (const r of e) {
      const i = Ht(r);
      if (i)
        return i;
    }
    return null;
  }
  if (!y(e))
    return null;
  const n = To(
    e.file,
    e.file_url,
    e.fileUrl,
    e.files
  );
  if (n)
    return {
      url: n,
      name: N(e.name, e.filename, e.title) || Fn(n),
      description: N(
        e.description,
        e.text,
        e.summary
      )
    };
  for (const r of ["content", "output", "result", "data", "body", "value"])
    if (e[r] !== void 0) {
      const i = Ht(e[r]);
      if (i)
        return i;
    }
  return null;
}
function No(t) {
  return {
    type: "file",
    file_url: t.url,
    name: t.name || Fn(t.url),
    description: t.description.trim()
  };
}
function Io(t, e) {
  if (t !== "image" && t !== "video" && t !== "audio")
    return;
  const n = Z(e);
  if (n.length !== 0)
    return {
      [`${t}s`]: n
    };
}
function Yt(t) {
  const e = R(t);
  if (typeof e == "string")
    return ie(e) ? "" : e;
  if (Array.isArray(e))
    return e.map(Yt).filter(Boolean).join(`

`);
  if (!y(e))
    return "";
  const n = N(
    e.text,
    e.summary,
    e.description
  );
  if (n)
    return n;
  for (const r of ["content", "output", "result", "data", "body", "value"])
    if (e[r] !== void 0) {
      const i = Yt(e[r]);
      if (i)
        return i;
    }
  return "";
}
function Co(t) {
  const e = R(t);
  return typeof e == "string" ? ie(e) ? "" : e : y(e) && String(e.format || "").trim().toLowerCase() === "markdown" ? N(e.text, e.markdown) : "";
}
function Oo(t) {
  const e = t.split(/\n{2,}/).map((n) => n.trim());
  return {
    type: "doc",
    content: (e.length ? e : [""]).map((n) => ({
      type: "paragraph",
      content: n ? [{ type: "text", text: n }] : []
    }))
  };
}
function Un(t) {
  if (!t || typeof t != "object")
    return "";
  if (["editorMediaImage", "editorMediaVideo", "editorMediaAudio"].includes(
    String(t.type || "")
  ))
    return String(t.attrs?.src || "").trim();
  for (const e of Array.isArray(t.content) ? t.content : []) {
    const n = Un(e);
    if (n)
      return n;
  }
  return "";
}
function jn(t) {
  const e = R(t);
  if (!y(e))
    return null;
  if (String(e.type || "") === "doc")
    return K(e);
  const n = Object.keys(e).filter((r) => r !== "format");
  return n.length === 1 && n[0] === "rich" ? K(e.rich) : String(e.format || "").trim().toLowerCase() === "rich_json" ? K(e.rich ?? e.content) : null;
}
function Ro(t) {
  const e = R(t);
  return y(e) && String(e.format || "").trim().toLowerCase() === "rich_json";
}
function Do(t) {
  return {
    image: "editorMediaImage",
    video: "editorMediaVideo",
    audio: "editorMediaAudio"
  }[t];
}
function To(...t) {
  for (const e of t) {
    const n = Z(e)[0];
    if (n)
      return n;
  }
  return "";
}
function Bn(t, ...e) {
  let n = t;
  for (const r of e) {
    if (!y(n))
      return;
    n = n[r];
  }
  return n;
}
function Fn(t) {
  const n = (t.split(/[?#]/)[0] || "").split("/").pop() || "";
  try {
    return decodeURIComponent(n) || "文件";
  } catch {
    return n || "文件";
  }
}
function re(t) {
  const e = String(t || "").replace(/\s+/g, " ").trim();
  return e.length > 120 ? `${e.slice(0, 120)}…` : e || "暂无内容";
}
function Vn(t) {
  return /^(https?:\/\/|\/|data:)/i.test(t);
}
function ie(t) {
  const e = t.trim();
  return e.startsWith("{") && e.endsWith("}") || e.startsWith("[") && e.endsWith("]");
}
export {
  Es as $,
  Ys as A,
  ye as B,
  Hs as C,
  ho as D,
  He as E,
  vo as F,
  Ho as G,
  us as H,
  ds as I,
  Go as J,
  $e as K,
  Rr as L,
  ze as M,
  vr as N,
  rs as O,
  Vr as P,
  U as Q,
  ks as R,
  hs as S,
  Ps as T,
  wi as U,
  ys as V,
  ki as W,
  bi as X,
  Ii as Y,
  Ms as Z,
  ws as _,
  Ts as a,
  xt as a$,
  fn as a0,
  ln as a1,
  ns as a2,
  Gr as a3,
  Si as a4,
  ps as a5,
  As as a6,
  xs as a7,
  Ss as a8,
  Ni as a9,
  Qo as aA,
  cs as aB,
  ve as aC,
  _n as aD,
  os as aE,
  gn as aF,
  k as aG,
  Be as aH,
  ts as aI,
  Os as aJ,
  es as aK,
  st as aL,
  Bs as aM,
  Fs as aN,
  yr as aO,
  ae as aP,
  fi as aQ,
  K as aR,
  Vo as aS,
  xr as aT,
  R as aU,
  Bo as aV,
  ci as aW,
  hr as aX,
  Oe as aY,
  Xo as aZ,
  Fr as a_,
  Ls as aa,
  Uo as ab,
  jo as ac,
  kr as ad,
  Zt as ae,
  ss as af,
  qt as ag,
  y as ah,
  Ve as ai,
  Tr as aj,
  Wo as ak,
  Fo as al,
  nt as am,
  Ye as an,
  is as ao,
  Ge as ap,
  as as aq,
  gs as ar,
  Xe as as,
  Wt as at,
  N as au,
  Cs as av,
  hn as aw,
  Ci as ax,
  Rs as ay,
  Ds as az,
  Di as b,
  Re as b0,
  vs as b1,
  ui as b2,
  eo as b3,
  li as b4,
  Ki as b5,
  pn as b6,
  Is as b7,
  Ri as b8,
  js as b9,
  $s as ba,
  he as bb,
  ms as bc,
  ro as bd,
  zs as be,
  Yo as bf,
  tt as bg,
  Vs as bh,
  Us as bi,
  Ko as bj,
  Pr as bk,
  $r as bl,
  Lr as bm,
  qo as bn,
  ne as bo,
  bn as c,
  Zo as d,
  _s as e,
  Oi as f,
  Ln as g,
  tn as h,
  Ns as i,
  fs as j,
  ls as k,
  Jo as l,
  Yi as m,
  qs as n,
  go as o,
  mn as p,
  Gs as q,
  Ks as r,
  bs as s,
  Ws as t,
  di as u,
  $n as v,
  Js as w,
  yo as x,
  Mt as y,
  At as z
};
