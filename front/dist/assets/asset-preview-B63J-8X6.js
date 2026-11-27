import { j as i, a as u } from "./preloadable-CbkzeflN.js";
import { r as T, c as se, n as ce, X as le, af as ue, b as Z, aI as de, aF as fe, bc as me, bd as pe, a8 as he, Q as be } from "./vendor-icons-B1zF1_4n.js";
import { b as E, d as _, a as C } from "./file-kind-X0KKJPkQ.js";
import { c as we } from "./space-assistant-layout-B9KyeCM0.js";
import { r as ye, R as ge, V as xe, M as z } from "./media-inspector-gallery-B_v3I6YB.js";
import { aF as G, i as h, g as Ne, aG as ve, aH as Ce, K as Ae, O as ke, h as Le, al as De } from "./asset-audio-preview-DlcU6JQ0.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./asset-preview-DrQ4NEW7.css", import.meta.url).href]);
const Se = {
  audio: "editorMediaAudio",
  image: "editorMediaImage",
  mediaAudio: "editorMediaAudio",
  mediaImage: "editorMediaImage",
  mediaVideo: "editorMediaVideo",
  video: "editorMediaVideo"
}, X = [
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
function nt(e) {
  const t = Y(e);
  return t.length > 120 ? `${t.slice(0, 120)}...` : t;
}
function Y(e) {
  return A(e).replace(/\s+/g, " ").trim();
}
function Me(e) {
  if (typeof e != "string")
    return "";
  const t = e.trim();
  if (!Fe(t))
    return "";
  const r = t.search(/"rich"\s*:/), n = r >= 0 ? t.slice(r) : t, o = [], a = /"text"\s*:\s*"((?:\\.|[^"\\])*)"/g;
  let s = null;
  for (; (s = a.exec(n)) !== null; ) {
    const c = Ie(s[1]).trim();
    c && o.push(c);
  }
  return o.join(" ").replace(/\s+/g, " ").trim();
}
function j(e) {
  const t = x(e, /* @__PURE__ */ new Set());
  return B(t) ? t : null;
}
function rt(e) {
  try {
    return Y(e);
  } catch {
    return "";
  }
}
function it(e) {
  try {
    return j(e);
  } catch {
    return null;
  }
}
function A(e) {
  if (typeof e == "string") {
    const n = e.trim();
    if (G(n)) {
      const o = te(n);
      if (o !== void 0)
        return A(o).trim();
    }
    return Me(n) || e;
  }
  if (Array.isArray(e))
    return e.map(A).filter(Boolean).join(" ");
  if (!h(e))
    return "";
  const t = j(e);
  if (t)
    return ee(t);
  const r = [
    typeof e.text == "string" ? e.text : "",
    typeof e.markdown == "string" ? e.markdown : ""
  ];
  for (const n of X)
    e[n] != null && r.push(A(e[n]));
  return r.filter(Boolean).join(" ");
}
function x(e, t) {
  if (typeof e == "string") {
    const n = e.trim();
    if (!G(n))
      return null;
    const o = te(n);
    return o === void 0 ? null : x(o, t);
  }
  if (Array.isArray(e)) {
    const n = H({ type: "doc", content: e });
    if (B(n))
      return n;
    for (const o of e) {
      const a = x(o, t);
      if (a)
        return a;
    }
    return null;
  }
  if (!h(e) || t.has(e))
    return null;
  t.add(e);
  const r = H(e);
  if (r)
    return r;
  if (String(e.format || "").toLowerCase() === "rich_json" && e.rich != null) {
    const n = x(e.rich, t);
    if (n)
      return n;
  }
  for (const n of X) {
    if (e[n] == null)
      continue;
    const o = x(e[n], t);
    if (o)
      return o;
  }
  return null;
}
function H(e) {
  return !h(e) || q(e.type) !== "doc" ? null : {
    type: "doc",
    attrs: h(e.attrs) ? e.attrs : void 0,
    content: Q(e.content)
  };
}
function Q(e) {
  return Array.isArray(e) ? e.map(Te).filter((t) => !!t) : [];
}
function Te(e) {
  if (!h(e))
    return null;
  const t = q(e.type) || Re(e);
  if (!t)
    return null;
  const r = { type: t }, n = h(e.attrs) ? { ...e.attrs } : {};
  if (t === "heading" && L(n.level) <= 0) {
    const s = L(e.level);
    s > 0 && (n.level = s);
  }
  Object.keys(n).length > 0 && (r.attrs = n);
  const o = Oe(e.marks);
  if (o.length > 0 && (r.marks = o), t === "text") {
    const s = y(e.text);
    return s ? (r.text = s, r) : null;
  }
  const a = Q(e.content);
  return a.length > 0 && (r.content = a), r;
}
function Re(e) {
  if (typeof e.text == "string")
    return "text";
  const t = h(e.attrs) ? e.attrs : {};
  return L(t.level) > 0 || L(e.level) > 0 ? "heading" : "";
}
function Oe(e) {
  return Array.isArray(e) ? e.map((t) => {
    if (!h(t))
      return null;
    const r = y(t.type);
    return r ? {
      type: r,
      attrs: h(t.attrs) ? t.attrs : void 0
    } : null;
  }).filter(
    (t) => !!t
  ) : [];
}
function q(e) {
  const t = y(e);
  return Se[t] || t;
}
function ee(e) {
  return e ? e.type === "text" ? e.text || "" : e.type === "editorMediaImage" || e.type === "editorMediaVideo" || e.type === "editorMediaAudio" ? y(e.attrs?.alt || e.attrs?.title || e.attrs?.src) : (e.content || []).map(ee).filter(Boolean).join(" ") : "";
}
function B(e) {
  return e ? e.type === "text" ? !!y(e.text) : e.type === "editorMediaImage" || e.type === "editorMediaVideo" || e.type === "editorMediaAudio" ? !!y(e.attrs?.src) : (e.content || []).some(B) : !1;
}
function te(e) {
  try {
    return JSON.parse(e);
  } catch {
    return;
  }
}
function Fe(e) {
  return e.includes("rich_json") || e.includes('"rich"') || e.includes("agent_run_id") || e.includes("node_run_id");
}
function Ie(e) {
  try {
    return JSON.parse(`"${e}"`);
  } catch {
    return e.replace(/\\"/g, '"').replace(/\\n/g, `
`).replace(/\\t/g, "	").replace(/\\\\/g, "\\");
  }
}
function L(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) ? t : 0;
}
function y(e) {
  return e == null ? "" : String(e).trim();
}
const Ee = "素材库", _e = [
  { key: "project", label: "创作" },
  { key: "tool", label: "工具" },
  { key: "dialogue", label: "对话" },
  { key: "upload", label: "上传" },
  { key: "import", label: "导入" },
  { key: "official", label: Ee }
], je = [
  { key: "work", label: "作品" },
  { key: "material", label: "素材" }
], Be = [
  { key: "collection", label: "集合" },
  { key: "text", label: "文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "richtext", label: "富文本" },
  { key: "file", label: "文件" }
];
function ot(e, t = {}) {
  const r = t.fallback || "资产", n = V(_e, e, r);
  return t[e] || n;
}
function at(e) {
  return V(je, e, "素材");
}
function ne(e) {
  return V(Be, e, "资产");
}
function st(e) {
  if (e.length === 0 || e.some((n) => ["text", "richtext", "file"].includes(n)))
    return;
  const t = {
    image: "image/*",
    audio: "audio/*",
    video: "video/*"
  }, r = e.map((n) => t[n]).filter((n) => !!n);
  return r.length > 0 ? Array.from(new Set(r)).join(",") : void 0;
}
function ct(e, t) {
  return e && (t.length === 0 || t.some((r) => ["richtext", "video"].includes(r)));
}
function lt(e) {
  return e.id <= 0 ? !1 : e.libraryType === "material" ? e.version?.content != null : e.versionID > 0;
}
function V(e, t, r) {
  return e.find((n) => n.key === t)?.label || r;
}
const re = {
  image: "images",
  audio: "audios",
  video: "videos",
  file: "files"
};
function ie(e, t) {
  const r = re[e], n = r ? P(t, e) : [];
  if (r && n.length > 0)
    return { [r]: n };
  const o = j(t);
  if (!o)
    return t;
  const a = ve(o);
  return a && (e === "text" || Ce(a.plainText)) ? { text: a.markdown } : { rich: o };
}
function Ve(e, t) {
  return P(e, t)[0] || "";
}
function P(e, t) {
  return O(e, t).map((r) => r.url);
}
function O(e, t) {
  return Pe(t) ? Ne(e, t) : [];
}
function ut(e, t) {
  if (!re[t])
    return 0;
  const r = P(e, t).length;
  if (!e || typeof e != "object" || Array.isArray(e))
    return r;
  const n = Number(
    e.media_count || 0
  );
  return Math.max(
    r,
    Number.isFinite(n) ? Math.trunc(n) : 0
  );
}
function Pe(e) {
  return e === "image" || e === "video" || e === "audio" || e === "file";
}
function D(e, t = 0) {
  if (t > 8 || e == null) return "";
  if (typeof e == "string") return oe(e) ? "" : e.trim();
  if (Array.isArray(e))
    return e.map((n) => D(n, t + 1)).filter(Boolean)[0] || "";
  if (typeof e != "object") return "";
  const r = e;
  for (const n of [
    "summary",
    "title",
    "text",
    "caption",
    "content",
    "output",
    "result"
  ]) {
    const o = D(r[n], t + 1);
    if (o) return o;
  }
  return "";
}
function dt(e) {
  const t = e?.source?.prompt;
  return typeof t == "string" ? t.trim() : "";
}
function ze(e) {
  const t = Ve(e, "file"), r = k(e) || ye(t), n = r.match(/\.([a-z0-9]{1,10})$/i)?.[1] || "";
  return { url: t, name: r, extension: n };
}
function k(e, t = 0) {
  if (e == null || t > 8) return "";
  if (typeof e == "string") {
    const n = e.trim();
    return oe(n) ? "" : n;
  }
  if (Array.isArray(e)) {
    for (const n of e) {
      const o = k(n, t + 1);
      if (o) return o;
    }
    return "";
  }
  if (typeof e != "object") return "";
  const r = e;
  for (const n of [
    "name",
    "file_name",
    "fileName",
    "filename",
    "label",
    "title"
  ]) {
    const o = k(r[n], t + 1);
    if (o) return o;
  }
  for (const n of [
    "file",
    "files",
    "attrs",
    "data",
    "content",
    "output",
    "result"
  ]) {
    const o = k(r[n], t + 1);
    if (o) return o;
  }
  return "";
}
function oe(e) {
  return /^(https?:\/\/|\/|data:|blob:)/.test(e.trim());
}
await window.DeverFront?.ensureCompat?.(["@/page/nodes/show/tooltip"]);
const F = window.DeverFront?.sdk?.getCompatModule("@/page/nodes/show/tooltip");
if (!F || Object.keys(F).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/page/nodes/show/tooltip");
const He = F.HoverTip, Ue = 12e3;
function S({
  label: e,
  side: t = "top",
  sideOffset: r = 7,
  className: n = "",
  children: o
}) {
  return /* @__PURE__ */ i(
    He,
    {
      content: e,
      side: t,
      sideOffset: r,
      layerZIndex: Ue,
      className: `max-w-80 whitespace-normal break-words ${n}`.trim(),
      children: o
    }
  );
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view"]);
const I = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!I || Object.keys(I).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const U = I, $ = U.ContentView || U.EnergonContentView;
function ae({
  output: e,
  fallback: t = "",
  streaming: r = !1,
  emptyText: n = "暂无内容",
  className: o,
  markdownClassName: a,
  richClassName: s,
  mediaLayout: c = "default"
}) {
  const f = $e(e, t);
  return $ ? /* @__PURE__ */ i(Ke, { className: o, children: /* @__PURE__ */ i(
    $,
    {
      output: f,
      streaming: r,
      emptyText: n,
      markdownClassName: a,
      richClassName: s,
      mediaLayout: c
    }
  ) }) : t ? /* @__PURE__ */ i("div", { className: o, children: t }) : null;
}
function $e(e, t = "") {
  return Ae(e) ? e : t ? { text: t } : e;
}
function Ke({
  className: e,
  children: t
}) {
  const r = (n) => {
    Je(n.target) && n.stopPropagation();
  };
  return /* @__PURE__ */ i(
    "div",
    {
      className: e,
      onPointerDown: r,
      onClick: r,
      children: t
    }
  );
}
function Je(e) {
  return e instanceof Element && !!e.closest(
    "a, button, input, textarea, select, audio, video, [role='button']"
  );
}
function We(e) {
  if (!e) return !1;
  const t = document.querySelectorAll('[data-slot="dialog-layer"]');
  return t.item(t.length - 1)?.contains(e) || !1;
}
const ft = 10040;
function mt({
  ariaLabel: e,
  header: t,
  children: r,
  onRequestClose: n,
  onEscape: o,
  layer: a = "default",
  className: s
}) {
  const c = E(null);
  _(() => {
    const d = (p) => {
      p.key !== "Escape" || p.defaultPrevented || !We(c.current) || (p.preventDefault(), p.stopImmediatePropagation(), (o || n)());
    };
    return window.addEventListener("keydown", d), () => window.removeEventListener("keydown", d);
  }, [o, n]);
  const f = /* @__PURE__ */ i(
    "div",
    {
      ref: c,
      className: ["wb-detail-backdrop", a === "nested" && "is-nested", s].filter(Boolean).join(" "),
      "data-slot": "dialog-layer",
      role: "presentation",
      onMouseDown: (d) => {
        d.stopPropagation(), d.target === d.currentTarget && n();
      },
      children: /* @__PURE__ */ u(
        "section",
        {
          className: "wb-detail-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": e,
          onMouseDown: (d) => d.stopPropagation(),
          children: [
            t,
            r
          ]
        }
      )
    }
  );
  return typeof document > "u" ? null : we(f, document.body);
}
function pt({
  icon: e,
  title: t,
  subtitle: r,
  titleStatus: n,
  versionSelect: o,
  state: a,
  updatedAt: s,
  actions: c,
  downloadUrl: f,
  onClose: d
}) {
  return /* @__PURE__ */ u("header", { className: "wb-detail-head", children: [
    /* @__PURE__ */ u("div", { className: "wb-detail-heading", children: [
      /* @__PURE__ */ i("span", { className: "wb-detail-kind-icon", "aria-hidden": "true", children: e }),
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ i("strong", { children: t || "详情" }),
        r ? /* @__PURE__ */ i("span", { children: r }) : null
      ] })
    ] }),
    n && /* @__PURE__ */ i("div", { className: "wb-detail-title-status", children: n }),
    /* @__PURE__ */ u("div", { className: "wb-detail-meta", children: [
      o,
      a,
      s ? /* @__PURE__ */ i("time", { children: s }) : null
    ] }),
    /* @__PURE__ */ u("div", { className: "wb-detail-actions", children: [
      c,
      f ? /* @__PURE__ */ i(S, { label: "下载内容", children: /* @__PURE__ */ i(
        ge,
        {
          url: f,
          name: t,
          className: "wb-detail-icon-button"
        }
      ) }) : null,
      /* @__PURE__ */ i(S, { label: "关闭", children: /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          className: "wb-detail-icon-button",
          onClick: d,
          "aria-label": "关闭详情",
          children: /* @__PURE__ */ i(le, { size: 18 })
        }
      ) })
    ] })
  ] });
}
function ht({
  options: e,
  currentVersionId: t,
  selectedVersionId: r,
  total: n,
  hasMore: o,
  loading: a,
  loadingMore: s,
  error: c,
  disabled: f = !1,
  onSelect: d,
  onLoadMore: p,
  onRetry: N
}) {
  const [b, w] = C(!1), g = E(null), v = e.find((l) => l.id === r) || e.find((l) => l.id === t);
  return _(() => {
    if (!b) return;
    const l = (m) => {
      g.current?.contains(m.target) || w(!1);
    };
    return document.addEventListener("mousedown", l), () => document.removeEventListener("mousedown", l);
  }, [b]), !r && !a ? null : /* @__PURE__ */ u("div", { className: "wb-detail-version-select", ref: g, children: [
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "wb-detail-version-trigger",
        "aria-haspopup": "listbox",
        "aria-expanded": b,
        disabled: f || a && e.length === 0,
        onClick: () => w((l) => !l),
        children: [
          a && e.length === 0 ? /* @__PURE__ */ i(T, { size: 12, className: "wb-detail-spin" }) : null,
          /* @__PURE__ */ i("span", { children: J(v?.version) }),
          n > 0 ? /* @__PURE__ */ u("small", { children: [
            n,
            " 个版本"
          ] }) : null,
          /* @__PURE__ */ i(se, { size: 13 })
        ]
      }
    ),
    b ? /* @__PURE__ */ i("div", { className: "wb-detail-version-menu", role: "listbox", children: /* @__PURE__ */ u(
      "div",
      {
        className: "wb-detail-version-options",
        onScroll: (l) => {
          const m = l.currentTarget;
          o && !s && m.scrollHeight - m.scrollTop - m.clientHeight < 36 && p();
        },
        children: [
          e.length > 0 ? e.map((l) => {
            const m = l.id === r, M = l.id === t;
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                role: "option",
                "aria-selected": m,
                className: m ? "is-selected" : "",
                onClick: () => {
                  w(!1), d(l.value);
                },
                children: [
                  /* @__PURE__ */ u("span", { children: [
                    /* @__PURE__ */ i("strong", { children: J(l.version) }),
                    M ? /* @__PURE__ */ i("small", { children: "当前" }) : null
                  ] }),
                  /* @__PURE__ */ i("time", { children: Ze(l.updatedAt) }),
                  m ? /* @__PURE__ */ i(ce, { size: 13 }) : /* @__PURE__ */ i("i", { "aria-hidden": "true" })
                ]
              },
              l.id
            );
          }) : c ? /* @__PURE__ */ i(K, { error: c, onRetry: N }) : /* @__PURE__ */ u("div", { className: "wb-detail-version-message", children: [
            a ? /* @__PURE__ */ i(T, { size: 14, className: "wb-detail-spin" }) : null,
            /* @__PURE__ */ i("span", { children: a ? "正在读取版本" : "暂无版本" })
          ] }),
          c && e.length > 0 ? /* @__PURE__ */ i(K, { error: c, onRetry: N }) : null,
          s ? /* @__PURE__ */ u("div", { className: "wb-detail-version-loading", children: [
            /* @__PURE__ */ i(T, { size: 13, className: "wb-detail-spin" }),
            "正在加载更多"
          ] }) : null
        ]
      }
    ) }) : null
  ] });
}
function K({
  error: e,
  onRetry: t
}) {
  return /* @__PURE__ */ u("div", { className: "wb-detail-version-message is-error", children: [
    /* @__PURE__ */ i("span", { children: e }),
    /* @__PURE__ */ u("button", { type: "button", onClick: t, children: [
      /* @__PURE__ */ i(ue, { size: 12 }),
      "重试"
    ] })
  ] });
}
function J(e) {
  const t = Number(e || 0);
  return t > 0 ? `第${t}版` : "版本";
}
function Ze(e) {
  const t = String(e || "").trim();
  return t ? t.replace("T", " ").replace(/\.\d+(Z)?$/, "").replace(/Z$/, "") : "";
}
function W({
  content: e,
  summary: t,
  compact: r = !1
}) {
  const n = ze(e), o = n.name || t || "文件", a = n.extension ? n.extension.toUpperCase() : "FILE", s = n.extension ? `${n.extension.toUpperCase()} 文件` : "文件";
  return r ? /* @__PURE__ */ u("div", { className: "wb-asset-file-card-preview", children: [
    /* @__PURE__ */ i("strong", { children: a }),
    /* @__PURE__ */ i(S, { label: o, children: /* @__PURE__ */ i("p", { children: o }) }),
    /* @__PURE__ */ i("span", { children: "文件" })
  ] }) : /* @__PURE__ */ u("section", { className: "wb-asset-file-preview", children: [
    /* @__PURE__ */ i("span", { className: "wb-asset-file-icon", children: /* @__PURE__ */ i(Z, { "aria-hidden": "true" }) }),
    /* @__PURE__ */ u("div", { className: "wb-asset-file-copy", children: [
      /* @__PURE__ */ i(S, { label: o, children: /* @__PURE__ */ i("strong", { children: o }) }),
      /* @__PURE__ */ i("span", { children: s })
    ] }),
    n.url ? /* @__PURE__ */ u("a", { href: n.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ i(de, { "aria-hidden": "true" }),
      /* @__PURE__ */ i("span", { children: "打开文件" })
    ] }) : /* @__PURE__ */ i("span", { className: "wb-asset-file-unavailable", children: "文件暂不可用" })
  ] });
}
function R({
  kind: e,
  src: t,
  poster: r
}) {
  const n = E(null), [o, a] = C(""), [s, c] = C(""), [f, d] = C(""), p = o === t, N = s === t, b = f === t;
  _(() => {
    const v = n.current;
    if (!t || !v || typeof IntersectionObserver > "u") {
      a(t);
      return;
    }
    const l = new IntersectionObserver(
      (m) => {
        m.some((M) => M.isIntersecting) && (a(t), l.disconnect());
      },
      { rootMargin: "320px 0px" }
    );
    return l.observe(v), () => l.disconnect();
  }, [t]);
  function w() {
    c(t), d("");
  }
  function g() {
    c(""), d(t);
  }
  return /* @__PURE__ */ u(
    "div",
    {
      ref: n,
      className: [
        "wb-asset-lazy-cover",
        `is-${e}`,
        N ? "is-loaded" : "is-pending",
        b ? "is-failed" : ""
      ].filter(Boolean).join(" "),
      children: [
        p && (e === "video" || !b) ? e === "image" ? /* @__PURE__ */ i(
          "img",
          {
            src: t,
            alt: "",
            loading: "lazy",
            decoding: "async",
            onLoad: w,
            onError: g
          }
        ) : /* @__PURE__ */ i(
          xe,
          {
            src: t,
            poster: r,
            style: { position: "absolute", inset: 0 },
            ariaHidden: !0,
            onLoad: w,
            onError: g
          }
        ) : null,
        b ? /* @__PURE__ */ i("span", { children: "封面加载失败" }) : null
      ]
    }
  );
}
function Ge({
  kind: e,
  content: t,
  summary: r
}) {
  const n = ie(e, t), o = r || D(t) || ne(e), a = ke(n, "storyboard") ? { text: o } : n;
  return /* @__PURE__ */ i("div", { className: `wb-asset-card-text-preview is-${e}`, children: /* @__PURE__ */ i(
    ae,
    {
      output: a,
      fallback: o,
      emptyText: o,
      className: "wb-asset-card-text-content",
      markdownClassName: "wb-asset-card-prose",
      richClassName: "wb-asset-card-prose"
    }
  ) });
}
function bt({
  kind: e,
  content: t,
  summary: r,
  prompt: n,
  compact: o = !1
}) {
  const a = O(t, e), s = a.map((f) => f.url), c = s[0] || "";
  if (!o) {
    const f = e === "audio" ? Le(t) : null;
    if ((e === "image" || e === "video") && s.length > 0)
      return /* @__PURE__ */ i(
        z,
        {
          kind: e,
          mediaItems: a,
          downloadable: !0,
          className: "wb-asset-media-gallery"
        }
      );
    if (e === "audio")
      return /* @__PURE__ */ i(
        z,
        {
          kind: "audio",
          mediaItems: a,
          downloadable: !0,
          className: "wb-asset-media-gallery",
          supplementalText: f || (n ? { label: "语音文本", text: n } : null),
          attachmentUrls: O(t, "file").map(
            (p) => p.url
          )
        }
      );
    if (e === "file")
      return /* @__PURE__ */ i(W, { content: t, summary: r });
    const d = ie(e, t);
    return /* @__PURE__ */ i(
      ae,
      {
        output: d,
        fallback: r || "",
        emptyText: "该版本暂无可预览内容",
        className: "wb-asset-preview-content",
        markdownClassName: "wb-asset-detail-prose",
        richClassName: "wb-asset-detail-prose",
        mediaLayout: "detail"
      }
    );
  }
  return e === "image" && c ? /* @__PURE__ */ i(R, { kind: "image", src: c }) : e === "video" && c ? /* @__PURE__ */ i(
    R,
    {
      kind: "video",
      src: c,
      poster: a[0]?.thumbnail
    }
  ) : e === "audio" ? a[0]?.thumbnail ? /* @__PURE__ */ i(R, { kind: "image", src: a[0].thumbnail }) : /* @__PURE__ */ i(De, { src: c }) : e === "file" ? /* @__PURE__ */ i(W, { content: t, summary: r, compact: !0 }) : e === "text" || e === "richtext" ? /* @__PURE__ */ i(Ge, { kind: e, content: t, summary: r }) : /* @__PURE__ */ i("div", { className: "wb-asset-card-fallback", children: /* @__PURE__ */ i("p", { children: r || D(t) || ne(e) }) });
}
function wt({ kind: e }) {
  switch (e) {
    case "collection":
      return /* @__PURE__ */ i(be, { "aria-hidden": "true" });
    case "image":
      return /* @__PURE__ */ i(he, { "aria-hidden": "true" });
    case "audio":
      return /* @__PURE__ */ i(pe, { "aria-hidden": "true" });
    case "video":
      return /* @__PURE__ */ i(me, { "aria-hidden": "true" });
    case "file":
      return /* @__PURE__ */ i(fe, { "aria-hidden": "true" });
    default:
      return /* @__PURE__ */ i(Z, { "aria-hidden": "true" });
  }
}
export {
  bt as A,
  S as B,
  nt as C,
  ft as D,
  $e as E,
  Ke as F,
  j as G,
  ie as a,
  st as b,
  ot as c,
  Y as d,
  Ve as e,
  P as f,
  pt as g,
  mt as h,
  We as i,
  Ze as j,
  ht as k,
  O as l,
  ut as m,
  ne as n,
  wt as o,
  dt as p,
  at as q,
  _e as r,
  it as s,
  Be as t,
  je as u,
  ct as v,
  ae as w,
  Me as x,
  rt as y,
  lt as z
};
