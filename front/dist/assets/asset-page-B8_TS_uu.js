import { a as i, j as n, F as ye } from "./preloadable-Bomi5PEU.js";
import { b as Me, aH as wn, aE as vn, b4 as yn, b5 as gn, a9 as kn, a1 as St, k as Cn, q as et, r as X, s as we, h as Nn, n as Fe, X as xt, z as Tn, e as In, b6 as Dn, b7 as At, v as $t, C as Sn, A as xn, aF as An, a2 as Et, U as $n, R as En, b8 as Rn, Y as Ln, d as Mn } from "./vendor-icons-DwjYEojZ.js";
import { d as R, a as v, b as B, u as ie, g as Fn, e as K } from "./_commonjsHelpers-61wyk6v6.js";
import { t as ne } from "./index-BqbNvFGg.js";
import { b7 as _n, B as J, b8 as Rt, b9 as Lt, aq as ve, ba as Mt, bb as Ft, bc as zn, n as On, A as ft, bd as Pn, be as Ee, bf as jn, aU as _e, b3 as tt, bg as _t, aX as nt, ay as Vn, an as zt, bh as Ot, bi as qn, bj as Bn, b2 as Un, k as Kn, C as Wn, bk as Hn, D as Pt, o as jt, q as Jn, bl as Gn, t as Vt, bm as Xn, bn as Zn, bo as Yn, bp as Qn, bq as er, v as qt, br as tr, bs as Je, bt as Bt, bu as Ut, bv as nr, bw as rr, bx as ar, by as sr, bz as ir, bA as or, bB as cr, aB as lr } from "./upload-asset-api-DDv34zo1.js";
import { V as ur, M as ht } from "./media-inspector-gallery-B4td799W.js";
import { b as Kt } from "./file-kind-CYMG3EzQ.js";
import { k as G, q as dr, s as rt, a as Re, r as ee, h as Ne, d as Ge, c as Wt } from "./site-config-C63CM9jT.js";
import { u as mr } from "./project-dialogs-2EFX0RdT.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./asset-page-DSfTbQOo.css", import.meta.url).href]);
function bt({
  content: e,
  summary: t,
  compact: r = !1
}) {
  const a = _n(e), s = a.name || t || "文件", o = a.extension ? a.extension.toUpperCase() : "FILE", c = a.extension ? `${a.extension.toUpperCase()} 文件` : "文件";
  return r ? /* @__PURE__ */ i("div", { className: "wb-asset-file-card-preview", children: [
    /* @__PURE__ */ n("strong", { children: o }),
    /* @__PURE__ */ n(J, { label: s, children: /* @__PURE__ */ n("p", { children: s }) }),
    /* @__PURE__ */ n("span", { children: "文件" })
  ] }) : /* @__PURE__ */ i("section", { className: "wb-asset-file-preview", children: [
    /* @__PURE__ */ n("span", { className: "wb-asset-file-icon", children: /* @__PURE__ */ n(Me, { "aria-hidden": "true" }) }),
    /* @__PURE__ */ i("div", { className: "wb-asset-file-copy", children: [
      /* @__PURE__ */ n(J, { label: s, children: /* @__PURE__ */ n("strong", { children: s }) }),
      /* @__PURE__ */ n("span", { children: c })
    ] }),
    a.url ? /* @__PURE__ */ i("a", { href: a.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ n(wn, { "aria-hidden": "true" }),
      /* @__PURE__ */ n("span", { children: "打开文件" })
    ] }) : /* @__PURE__ */ n("span", { className: "wb-asset-file-unavailable", children: "文件暂不可用" })
  ] });
}
function Ue({
  kind: e,
  src: t,
  poster: r
}) {
  const a = R(null), [s, o] = v(""), [c, p] = v(""), [w, l] = v(""), h = s === t, b = c === t, u = w === t;
  B(() => {
    const D = a.current;
    if (!t || !D || typeof IntersectionObserver > "u") {
      o(t);
      return;
    }
    const x = new IntersectionObserver(
      (F) => {
        F.some((d) => d.isIntersecting) && (o(t), x.disconnect());
      },
      { rootMargin: "320px 0px" }
    );
    return x.observe(D), () => x.disconnect();
  }, [t]);
  function y() {
    p(t), l("");
  }
  function g() {
    p(""), l(t);
  }
  return /* @__PURE__ */ i(
    "div",
    {
      ref: a,
      className: [
        "wb-asset-lazy-cover",
        `is-${e}`,
        b ? "is-loaded" : "is-pending",
        u ? "is-failed" : ""
      ].filter(Boolean).join(" "),
      children: [
        h && !u ? e === "image" ? /* @__PURE__ */ n(
          "img",
          {
            src: t,
            alt: "",
            loading: "lazy",
            decoding: "async",
            onLoad: y,
            onError: g
          }
        ) : /* @__PURE__ */ n(
          ur,
          {
            src: t,
            poster: r,
            ariaHidden: !0,
            onLoad: y,
            onError: g
          }
        ) : null,
        u ? /* @__PURE__ */ n("span", { children: "封面加载失败" }) : null
      ]
    }
  );
}
function pr({
  kind: e,
  content: t,
  summary: r
}) {
  const a = Rt(e, t), s = r || Lt(t) || ve(e), o = Mt(a, "storyboard") ? { text: s } : a;
  return /* @__PURE__ */ n("div", { className: `wb-asset-card-text-preview is-${e}`, children: /* @__PURE__ */ n(
    Ft,
    {
      output: o,
      fallback: s,
      emptyText: s,
      className: "wb-asset-card-text-content",
      markdownClassName: "wb-asset-card-prose",
      richClassName: "wb-asset-card-prose"
    }
  ) });
}
function ze({
  kind: e,
  content: t,
  summary: r,
  prompt: a,
  compact: s = !1
}) {
  const o = zn(t, e), c = o.map((w) => w.url), p = c[0] || "";
  if (!s) {
    const w = e === "audio" ? On(t) : null;
    if ((e === "image" || e === "video") && c.length > 0)
      return /* @__PURE__ */ n(
        ht,
        {
          kind: e,
          mediaItems: o,
          downloadable: !0,
          className: "wb-asset-media-gallery"
        }
      );
    if (e === "audio")
      return o.length > 0 && (o.length > 1 || o[0]?.thumbnail) ? /* @__PURE__ */ n(
        ht,
        {
          kind: "audio",
          mediaItems: o,
          downloadable: !0,
          className: "wb-asset-media-gallery",
          supplementalText: w
        }
      ) : /* @__PURE__ */ n(ft, { src: p, prompt: a, detailed: !0 });
    if (e === "file")
      return /* @__PURE__ */ n(bt, { content: t, summary: r });
    const l = Rt(e, t);
    return /* @__PURE__ */ n(
      Ft,
      {
        output: l,
        fallback: r || "",
        emptyText: "该版本暂无可预览内容",
        className: "wb-asset-preview-content",
        markdownClassName: "wb-asset-detail-prose",
        richClassName: "wb-asset-detail-prose",
        mediaLayout: "detail"
      }
    );
  }
  return e === "image" && p ? /* @__PURE__ */ n(Ue, { kind: "image", src: p }) : e === "video" && p ? /* @__PURE__ */ n(
    Ue,
    {
      kind: "video",
      src: p,
      poster: o[0]?.thumbnail
    }
  ) : e === "audio" ? o[0]?.thumbnail ? /* @__PURE__ */ n(Ue, { kind: "image", src: o[0].thumbnail }) : /* @__PURE__ */ n(ft, { src: p }) : e === "file" ? /* @__PURE__ */ n(bt, { content: t, summary: r, compact: !0 }) : e === "text" || e === "richtext" ? /* @__PURE__ */ n(pr, { kind: e, content: t, summary: r }) : /* @__PURE__ */ n("div", { className: "wb-asset-card-fallback", children: /* @__PURE__ */ n("p", { children: r || Lt(t) || ve(e) }) });
}
function Oe({ kind: e }) {
  switch (e) {
    case "collection":
      return /* @__PURE__ */ n(St, { "aria-hidden": "true" });
    case "image":
      return /* @__PURE__ */ n(kn, { "aria-hidden": "true" });
    case "audio":
      return /* @__PURE__ */ n(gn, { "aria-hidden": "true" });
    case "video":
      return /* @__PURE__ */ n(yn, { "aria-hidden": "true" });
    case "file":
      return /* @__PURE__ */ n(vn, { "aria-hidden": "true" });
    default:
      return /* @__PURE__ */ n(Me, { "aria-hidden": "true" });
  }
}
function fr({
  asset: e,
  sourceLabels: t,
  view: r = "assets",
  selectable: a = !1,
  selected: s = !1,
  used: o = !1,
  busy: c = !1,
  readOnly: p = !1,
  onOpen: w,
  onRename: l,
  onDelete: h,
  onRestore: b,
  onSelect: u
}) {
  const y = r === "trash", g = e.kind === "collection", D = g ? 0 : Pn(e.version?.content, e.kind), x = a && !g && !!u, F = x && (c || o), d = x ? o ? `${e.name}已使用` : s ? `取消选择${e.name}` : `选择${e.name}` : `${g ? "打开集合" : "查看"}${e.name}`, L = g ? /* @__PURE__ */ n(hr, { asset: e }) : /* @__PURE__ */ n(
    ze,
    {
      kind: e.kind,
      content: e.version?.content,
      summary: e.summary,
      compact: !0
    }
  );
  function N() {
    if (x) {
      F || u?.(e);
      return;
    }
    w(e);
  }
  return /* @__PURE__ */ i(
    "article",
    {
      className: `wb-asset-card ${g ? "is-collection" : ""} ${e.libraryType === "material" ? "is-official" : ""} ${s ? "is-selected" : ""} ${o ? "is-used" : ""} ${y ? "is-trash" : ""}`.trim(),
      children: [
        /* @__PURE__ */ i("div", { className: "wb-asset-card-main", children: [
          /* @__PURE__ */ i("div", { className: "wb-asset-card-preview", children: [
            L,
            D > 1 ? /* @__PURE__ */ i("span", { className: "wb-asset-media-count", children: [
              D,
              " 项"
            ] }) : null,
            e.kind !== "audio" ? /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "wb-asset-card-preview-open",
                disabled: F,
                onClick: N,
                "aria-label": d
              }
            ) : null
          ] }),
          /* @__PURE__ */ n(J, { label: e.name, children: /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "wb-asset-card-copy",
              disabled: F,
              onClick: N,
              children: [
                /* @__PURE__ */ n("strong", { children: e.name }),
                /* @__PURE__ */ n("span", { children: g ? `集合 · ${e.collectionCount} 项素材` : e.libraryType === "material" ? `${e.materialCateName || Ee("official", t)} · ${ve(e.kind)}` : `${Ee(e.sourceType, t)} · ${ve(e.kind)}` })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ n("span", { className: "wb-asset-card-kind-icon", children: /* @__PURE__ */ n(Oe, { kind: e.kind }) }),
        /* @__PURE__ */ i("div", { className: "wb-asset-card-actions", children: [
          x && !y ? /* @__PURE__ */ n(J, { label: "查看详情", children: /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              disabled: c,
              onClick: (j) => {
                j.stopPropagation(), w(e);
              },
              children: [
                /* @__PURE__ */ n(Cn, { "aria-hidden": "true" }),
                /* @__PURE__ */ n("span", { className: "sr-only", children: "查看详情" })
              ]
            }
          ) }) : null,
          !y && !p && l ? /* @__PURE__ */ n(J, { label: "修改标题", children: /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              disabled: c,
              onClick: () => l(e),
              children: [
                /* @__PURE__ */ n(et, { "aria-hidden": "true" }),
                /* @__PURE__ */ n("span", { className: "sr-only", children: "修改标题" })
              ]
            }
          ) }) : null,
          y && b ? /* @__PURE__ */ n(J, { label: "恢复资产", children: /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "is-restore",
              disabled: c,
              onClick: () => b(e),
              children: [
                c ? /* @__PURE__ */ n(X, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ n(we, { "aria-hidden": "true" }),
                /* @__PURE__ */ n("span", { className: "sr-only", children: "恢复资产" })
              ]
            }
          ) }) : !p && h ? /* @__PURE__ */ n(J, { label: "移入回收站", children: /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "is-danger",
              disabled: c,
              onClick: () => h(e),
              children: [
                c ? /* @__PURE__ */ n(X, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ n(Nn, { "aria-hidden": "true" }),
                /* @__PURE__ */ n("span", { className: "sr-only", children: "移入回收站" })
              ]
            }
          ) }) : null,
          !g && !y && a && u ? /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: `is-primary ${s ? "is-selected" : ""} ${o ? "is-used" : ""}`.trim(),
              disabled: c || o,
              onClick: N,
              children: [
                /* @__PURE__ */ n(Fe, { "aria-hidden": "true" }),
                o ? "已使用" : s ? "已选" : "使用"
              ]
            }
          ) : null
        ] })
      ]
    }
  );
}
function hr({ asset: e }) {
  const t = e.collectionPreviews.slice(0, 4);
  return t.length === 0 ? /* @__PURE__ */ i("div", { className: "wb-asset-collection-empty", children: [
    /* @__PURE__ */ n(Oe, { kind: "collection" }),
    /* @__PURE__ */ n("span", { children: e.collectionCount > 0 ? `${e.collectionCount} 项素材` : "空集合" })
  ] }) : /* @__PURE__ */ i("div", { className: `wb-asset-collection-preview has-${t.length}`, children: [
    t.map((r) => /* @__PURE__ */ n("div", { children: /* @__PURE__ */ n(ze, { kind: r.kind, content: r.content, compact: !0 }) }, r.id)),
    /* @__PURE__ */ i("span", { children: [
      e.collectionCount,
      " 项"
    ] })
  ] });
}
function Ht({
  teamID: e,
  asset: t,
  onClose: r,
  onRenamed: a
}) {
  const [s, o] = v(""), [c, p] = v(!1), [w, l] = v("");
  B(() => {
    t && (o(t.name), p(!1), l(""));
  }, [t]), B(() => {
    if (!t) return;
    const b = (u) => {
      u.key === "Escape" && (u.preventDefault(), u.stopImmediatePropagation(), c || r());
    };
    return window.addEventListener("keydown", b, !0), () => window.removeEventListener("keydown", b, !0);
  }, [t, r, c]);
  async function h(b) {
    b.preventDefault();
    const u = s.trim();
    if (!(!t || !u || c)) {
      p(!0), l("");
      try {
        const y = await jn({
          teamID: e,
          assetID: t.id,
          name: u
        });
        a(y), r();
      } catch (y) {
        l(G(y, "修改资产标题失败"));
      } finally {
        p(!1);
      }
    }
  }
  return !t || typeof document > "u" ? null : Kt(
    /* @__PURE__ */ n(
      "div",
      {
        className: "wb-asset-form-backdrop",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "修改资产标题",
        onMouseDown: (b) => {
          b.target === b.currentTarget && !c && r();
        },
        children: /* @__PURE__ */ i("form", { className: "wb-asset-form-dialog", onSubmit: h, children: [
          /* @__PURE__ */ i("header", { children: [
            /* @__PURE__ */ i("div", { children: [
              /* @__PURE__ */ n("span", { className: "wb-asset-form-icon", children: /* @__PURE__ */ n(et, { "aria-hidden": "true" }) }),
              /* @__PURE__ */ i("div", { children: [
                /* @__PURE__ */ n("h2", { children: "修改资产标题" }),
                /* @__PURE__ */ n("p", { children: "只修改资产库中的显示名称。" })
              ] })
            ] }),
            /* @__PURE__ */ n(J, { label: "关闭", children: /* @__PURE__ */ n("button", { type: "button", disabled: c, onClick: r, children: /* @__PURE__ */ n(xt, { "aria-hidden": "true" }) }) })
          ] }),
          /* @__PURE__ */ i("label", { children: [
            /* @__PURE__ */ n("span", { children: "资产标题" }),
            /* @__PURE__ */ n(
              "input",
              {
                autoFocus: !0,
                value: s,
                maxLength: 128,
                disabled: c,
                placeholder: "请输入资产标题",
                onChange: (b) => o(b.target.value)
              }
            )
          ] }),
          w ? /* @__PURE__ */ n("p", { className: "wb-asset-form-error", children: w }) : null,
          /* @__PURE__ */ i("footer", { children: [
            /* @__PURE__ */ n("button", { type: "button", disabled: c, onClick: r, children: "取消" }),
            /* @__PURE__ */ i(
              "button",
              {
                type: "submit",
                className: "is-primary",
                disabled: c || !s.trim(),
                children: [
                  c ? /* @__PURE__ */ n(X, { className: "is-spinning" }) : null,
                  c ? "保存中" : "保存"
                ]
              }
            )
          ] })
        ] })
      }
    ),
    document.body
  );
}
function Jt() {
  const e = dr().site.homeMenu;
  return ie(
    () => ({
      project: e.works.name,
      tool: e.function.name,
      dialogue: e.dialogue.name,
      fallback: e.assets.name
    }),
    [
      e.assets.name,
      e.dialogue.name,
      e.function.name,
      e.works.name
    ]
  );
}
function br(e, t) {
  if (e === "text")
    return {
      kind: e,
      contentFormat: "markdown",
      value: yr(t)
    };
  const r = _e(t);
  return r ? {
    kind: e,
    contentFormat: "json",
    value: tt(st(r))
  } : {
    kind: e,
    contentFormat: "markdown",
    value: Xt(t) || _t(t)
  };
}
function wr(e, t) {
  return { ...e, value: t };
}
function vr(e) {
  if (e.kind !== "richtext" || e.contentFormat !== "json")
    return e.value;
  const t = _e(nt(e.value));
  return t ? tt(
    at(st(t))
  ) : e.value;
}
function Gt(e) {
  return e.contentFormat === "markdown" ? { format: "markdown", text: e.value } : _e(nt(e.value)) || {
    type: "doc",
    content: []
  };
}
function wt(e) {
  const t = Gt(e);
  if (e.kind !== "richtext" || e.contentFormat !== "json")
    return yt(t);
  const r = _e(t);
  return yt(
    r ? Zt(at(r)) : t
  );
}
function yr(e) {
  return Xt(e) || Vn(e) || _t(e);
}
function Xt(e) {
  const t = nt(e);
  return zt(t) ? String(t.format || "").trim().toLowerCase() !== "markdown" ? "" : String(t.text || t.markdown || "") : typeof t == "string" ? t : "";
}
function at(e) {
  const t = { ...e };
  return e.content && (t.content = e.content.map(at)), (e.type === "editorMediaImage" || e.type === "editorMediaVideo") && !String(e.attrs?.maxWidth || "").trim() && (t.attrs = { ...e.attrs || {}, maxWidth: "100%" }), t;
}
function st(e) {
  const t = { ...e };
  if (!e.content) return t;
  const r = e.type === "doc" ? e.content.filter((a) => !gr(a)) : e.content;
  if (t.content = r.map(st), e.type === "paragraph")
    for (; t.content.at(-1)?.type === "hardBreak"; )
      t.content.pop();
  return t;
}
function gr(e) {
  return e.type === "paragraph" && !!e.content?.length && e.content?.every(
    (t) => t.type === "hardBreak" || t.type === "text" && !String(t.text || "").trim()
  );
}
function Zt(e) {
  const t = { type: e.type }, r = vt(e.attrs);
  return r && (t.attrs = r), e.content && (t.content = e.content.map(Zt)), e.marks && (t.marks = e.marks.map((a) => {
    const s = vt(a.attrs);
    return s ? { ...a, attrs: s } : { type: a.type };
  })), e.text != null && (t.text = e.text), t;
}
function vt(e) {
  if (!e) return;
  const t = Object.entries(e).filter(
    ([, r]) => r != null && r !== ""
  );
  return t.length > 0 ? Object.fromEntries(t) : void 0;
}
function yt(e) {
  return tt(Xe(e));
}
function Xe(e) {
  return Array.isArray(e) ? e.map(Xe) : zt(e) ? Object.fromEntries(
    Object.keys(e).sort().map((t) => [t, Xe(e[t])])
  ) : e;
}
await window.DeverFront?.ensureCompat?.(["@/components/rich-text-editor"]);
const Ze = window.DeverFront?.sdk?.getCompatModule("@/components/rich-text-editor");
if (!Ze || Object.keys(Ze).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/rich-text-editor");
const { RichTextEditor: gt } = Ze;
function kr({
  kind: e,
  value: t,
  contentFormat: r,
  readonly: a = !1,
  onChange: s
}) {
  const o = ie(
    () => vr({ kind: e, value: t, contentFormat: r }),
    [r, e, t]
  );
  return e === "text" || !gt ? /* @__PURE__ */ n(
    Cr,
    {
      value: t,
      readonly: a,
      onChange: s
    }
  ) : /* @__PURE__ */ n(
    gt,
    {
      value: o,
      onChange: s,
      contentFormat: r,
      placeholder: "编辑内容",
      disabled: a,
      minHeight: 0,
      maxHeight: 2400,
      controlClassName: "wb-asset-rich-content-editor",
      floatingLayerZIndex: Ot
    }
  );
}
function Cr({
  value: e,
  readonly: t,
  onChange: r
}) {
  const a = R(null);
  return Fn(() => {
    const s = () => {
      const o = a.current;
      o && (o.style.height = "auto", o.style.height = `${o.scrollHeight}px`);
    };
    return s(), window.addEventListener("resize", s), () => window.removeEventListener("resize", s);
  }, [e]), /* @__PURE__ */ n(
    "textarea",
    {
      ref: a,
      className: "wb-asset-plain-content-editor",
      readOnly: t,
      value: e,
      onChange: (s) => r(s.target.value),
      placeholder: "编辑内容"
    }
  );
}
function Nr({
  value: e,
  resetKey: t,
  fingerprint: r,
  save: a,
  onError: s,
  autoSave: o = !0,
  debounceMs: c = 1200
}) {
  const [p, w] = v(e), [l, h] = v("saved"), b = R(e), u = R(e), y = R(r), g = R(a), D = R(s), x = R(o), F = R(r(e)), d = R(0), L = R(0), N = R(null), j = R(null), Z = R(async () => !1), z = R(null), M = R(!1), $ = R(!0), I = K(() => {
    N.current !== null && (window.clearTimeout(N.current), N.current = null);
  }, []), S = K(
    async (_, T = !1, Q) => {
      I();
      const E = L.current;
      for (; $.current && E === L.current; ) {
        if (j.current && (!await j.current || E !== L.current))
          return !1;
        if (!T && _ !== void 0 && _ !== d.current)
          return !0;
        const oe = u.current, re = y.current(oe);
        if (re === F.current)
          return M.current = !1, $.current && h("saved"), !0;
        const V = d.current;
        $.current && h("saving");
        const H = Q || g.current, f = H(oe).then(() => {
          if (!$.current || E !== L.current)
            return !1;
          F.current = re, M.current = !1, z.current = null;
          const P = y.current(u.current);
          return h(
            P === re ? "saved" : "dirty"
          ), !0;
        }).catch((P) => ($.current && E === L.current && (I(), M.current = !0, z.current = H, h("error"), D.current?.(P)), !1));
        j.current = f;
        const C = await f;
        if (j.current === f && (j.current = null), !C) return !1;
        if (!T && V !== d.current && N.current === null && !M.current) {
          const P = d.current;
          N.current = window.setTimeout(() => {
            N.current = null, Z.current(P);
          }, c);
        }
        if (!T || V === d.current)
          return !0;
      }
      return !1;
    },
    [I, c]
  ), O = K(
    (_) => {
      I(), !(!x.current || M.current) && (N.current = window.setTimeout(() => {
        N.current = null, S(_);
      }, c));
    },
    [I, c, S]
  ), de = K(
    (_) => {
      const T = typeof _ == "function" ? _(u.current) : _, Q = y.current(T);
      if (u.current = T, w(T), d.current += 1, Q === F.current) {
        I(), M.current = !1, h("saved");
        return;
      }
      if (M.current) {
        h("error");
        return;
      }
      h("dirty"), O(d.current);
    },
    [I, O]
  ), k = K(() => {
    const _ = b.current;
    L.current += 1, d.current = 0, u.current = _, F.current = y.current(_), M.current = !1, z.current = null, j.current = null, I(), w(_), h("saved");
  }, [I]), U = K(() => S(void 0, !0), [S]), Y = K(
    (_) => S(void 0, !0, _),
    [S]
  ), W = K(async () => (M.current = !1, S(void 0, !0, z.current || g.current)), [S]);
  return B(() => {
    b.current = e, y.current = r, g.current = a, D.current = s, x.current = o, Z.current = S;
  }, [o, r, s, S, a, e]), B(() => k(), [k, t]), B(() => ($.current = !0, () => {
    $.current = !1, L.current += 1, I();
  }), [I]), {
    draft: p,
    status: l,
    setDraft: de,
    reset: k,
    flush: U,
    flushWith: Y,
    retry: W,
    hasPendingChanges: l !== "saved"
  };
}
function Tr({
  teamID: e,
  asset: t,
  enabled: r,
  onSaved: a,
  onError: s
}) {
  const o = t?.version || null, c = ie(
    () => br(
      t?.kind === "richtext" ? "richtext" : "text",
      o?.content
    ),
    [t?.kind, o?.content]
  ), p = R(null), w = K(
    async (u, y) => {
      if (!r || !t?.id || !o?.id)
        throw new Error("当前资产正文不可编辑");
      const g = wt(u), D = y === "create_version" ? Ir(p, o, g) : "", x = await qn({
        teamID: e,
        assetID: t.id,
        expectedVersionID: o.id,
        expectedUpdatedAt: o.updatedAt || o.createdAt,
        requestID: D,
        saveMode: y,
        content: Gt(u)
      });
      p.current = null, a(x, y);
    },
    [t, r, a, e, o]
  ), l = Nr({
    value: c,
    resetKey: `${t?.id || 0}:${o?.id || 0}:${o?.updatedAt || o?.createdAt || ""}`,
    fingerprint: wt,
    save: (u) => w(u, "overwrite_current"),
    onError: s,
    autoSave: !1
  }), { flushWith: h } = l, b = K(
    () => h((u) => w(u, "create_version")),
    [h, w]
  );
  return {
    ...l,
    saveAsNewVersion: b
  };
}
function Ir(e, t, r) {
  if (e.current?.versionID === t.id && e.current.fingerprint === r)
    return e.current.requestID;
  const a = typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`, s = `manual-edit-${t.id}-${a}`.slice(0, 64);
  return e.current = { versionID: t.id, fingerprint: r, requestID: s }, s;
}
function Dr({
  status: e,
  hasPendingChanges: t,
  onReset: r,
  onSaveAsNewVersion: a,
  onSave: s
}) {
  const o = e === "saving", c = o || !t;
  return /* @__PURE__ */ i(ye, { children: [
    /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        disabled: c,
        onClick: r,
        children: [
          /* @__PURE__ */ n(we, { size: 13 }),
          /* @__PURE__ */ n("span", { children: "取消修改" })
        ]
      }
    ),
    /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        disabled: c,
        onClick: a,
        children: [
          /* @__PURE__ */ n(Tn, { size: 13 }),
          /* @__PURE__ */ n("span", { children: "保存为新版本" })
        ]
      }
    ),
    /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: "wb-detail-command is-primary",
        disabled: c,
        onClick: s,
        children: [
          o ? /* @__PURE__ */ n(X, { size: 13, className: "wb-detail-spin" }) : /* @__PURE__ */ n(In, { size: 13 }),
          /* @__PURE__ */ n("span", { children: o ? "保存中" : "保存" })
        ]
      }
    )
  ] });
}
function Sr({
  teamID: e,
  assetID: t,
  selectable: r = !1,
  onClose: a,
  onSelect: s,
  onContinue: o,
  canContinue: c,
  onAssetChanged: p,
  layer: w = "default"
}) {
  const l = Jt(), [h, b] = v(null), [u, y] = v(
    null
  ), [g, D] = v(!0), [x, F] = v(0), [d, L] = v(!1), [N, j] = v(!1), [Z, z] = v(""), [M, $] = v(""), I = K(async () => {
    D(!0), z(""), $("");
    try {
      const f = kt(await Bn(e, t));
      b(f), y(f.asset.version);
    } catch (f) {
      z(G(f, "加载资产详情失败"));
    } finally {
      D(!1);
    }
  }, [t, e]);
  B(() => {
    I();
  }, [I]);
  async function S(f) {
    if (!(x || f.id === u?.id) && V()) {
      if (f.id === h?.asset.versionID && h.asset.version) {
        z(""), y(h.asset.version);
        return;
      }
      F(f.id), z("");
      try {
        y(
          await Zn({ teamID: e, assetID: t, versionID: f.id })
        );
      } catch (C) {
        z(G(C, "加载资产版本失败"));
      } finally {
        F(0);
      }
    }
  }
  async function O() {
    if (!h || !h.hasMore || x) return;
    const f = Math.floor(h.versions.length / 20) + 1;
    F(-1), $("");
    try {
      const C = await Yn({
        teamID: e,
        assetID: t,
        page: f,
        pageSize: 20
      });
      b(
        (P) => P && {
          ...P,
          versions: Ye([...P.versions, ...C.items]),
          versionTotal: C.total,
          hasMore: C.hasMore
        }
      );
    } catch (C) {
      $(G(C, "加载资产版本失败"));
    } finally {
      F(0);
    }
  }
  async function de() {
    if (!(!h || !u || d)) {
      L(!0), z("");
      try {
        const f = await Xn({
          teamID: e,
          assetID: t,
          versionID: u.id
        }), C = kt({ ...h, asset: f });
        b(C), y(f.version), p?.(f);
      } catch (f) {
        z(G(f, "设置当前版本失败"));
      } finally {
        L(!1);
      }
    }
  }
  const k = h?.asset, U = k?.status === "deleted", Y = !!(k && u && k.versionID === u.id), W = ie(
    () => Un(u?.content),
    [u?.content]
  ), _ = ie(
    () => Mt(u?.content, "storyboard"),
    [u?.content]
  ), T = !!(k && u && Y && !U && (k.kind === "text" || k.kind === "richtext") && !W && !_), Q = K(
    (f, C) => {
      z(""), b((P) => {
        if (!P) return P;
        const te = f.version, ce = !!(te && P.versions.some((ue) => ue.id === te.id)), le = Ye(
          te ? [te, ...P.versions] : P.versions
        );
        return {
          ...P,
          asset: f,
          versions: le,
          versionTotal: Math.max(
            le.length,
            P.versionTotal + (te && !ce ? 1 : 0)
          )
        };
      }), y(f.version), p?.(f), ne.success(
        C === "create_version" ? "已保存为新版本" : "正文已保存"
      );
    },
    [p]
  ), E = Tr({
    teamID: e,
    asset: k,
    enabled: T,
    onSaved: Q,
    onError: (f) => z(G(f, "保存资产正文失败"))
  }), oe = E.reset, re = E.hasPendingChanges, V = K(() => !T || !re ? !0 : window.confirm("当前正文尚未保存，确定放弃修改吗？") ? (oe(), z(""), !0) : !1, [T, re, oe]), H = K(() => {
    N || !V() || a();
  }, [V, a, N]);
  return B(() => {
    const f = (C) => {
      C.key !== "Escape" || N || (C.preventDefault(), C.stopImmediatePropagation(), H());
    };
    return window.addEventListener("keydown", f, !0), () => window.removeEventListener("keydown", f, !0);
  }, [N, H]), /* @__PURE__ */ i(
    Vt,
    {
      ariaLabel: `${k?.name || "资产"}详情`,
      onRequestClose: H,
      layer: w,
      header: /* @__PURE__ */ n(
        Pt,
        {
          icon: k ? /* @__PURE__ */ n(Oe, { kind: k.kind }) : /* @__PURE__ */ n(Me, { size: 16 }),
          title: k?.name || "资产详情",
          subtitle: k ? `${Er(k, l)} · ${ve(k.kind)} · ${Gn(k.role)}` : "",
          versionSelect: h && k && u ? /* @__PURE__ */ n(
            Jn,
            {
              options: h.versions.map((f) => ({
                id: f.id,
                version: f.version,
                updatedAt: f.updatedAt || f.createdAt,
                value: f
              })),
              currentVersionId: k.versionID,
              selectedVersionId: u.id,
              total: h.versionTotal,
              hasMore: h.hasMore,
              loading: x > 0,
              loadingMore: x === -1,
              error: M,
              disabled: d || E.status === "saving",
              onSelect: (f) => {
                S(f);
              },
              onLoadMore: () => {
                O();
              },
              onRetry: () => {
                O();
              }
            }
          ) : void 0,
          state: U ? /* @__PURE__ */ n("span", { className: "wb-detail-state", children: "回收站" }) : x > 0 ? /* @__PURE__ */ i("span", { className: "wb-detail-state is-saving", children: [
            /* @__PURE__ */ n(X, { size: 12, className: "wb-detail-spin" }),
            "读取中"
          ] }) : T ? E.status === "error" ? /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "wb-detail-state is-error",
              onClick: () => {
                E.retry();
              },
              children: [
                /* @__PURE__ */ n(we, { size: 12 }),
                "保存失败"
              ]
            }
          ) : /* @__PURE__ */ i("span", { className: `wb-detail-state is-${E.status}`, children: [
            E.status === "saving" ? /* @__PURE__ */ n(X, { size: 12, className: "wb-detail-spin" }) : null,
            $r(E.status)
          ] }) : /* @__PURE__ */ n("span", { className: "wb-detail-state", children: "只读预览" }),
          updatedAt: jt(
            u?.updatedAt || u?.createdAt
          ),
          actions: k && u && !U ? /* @__PURE__ */ i(ye, { children: [
            /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                className: "wb-detail-command",
                onClick: () => j(!0),
                children: [
                  /* @__PURE__ */ n(et, { size: 13 }),
                  /* @__PURE__ */ n("span", { children: "修改标题" })
                ]
              }
            ),
            T ? /* @__PURE__ */ n(
              Dr,
              {
                status: E.status,
                hasPendingChanges: E.hasPendingChanges,
                onReset: () => {
                  E.reset(), z("");
                },
                onSaveAsNewVersion: () => {
                  E.saveAsNewVersion();
                },
                onSave: () => {
                  E.flush();
                }
              }
            ) : null,
            Y ? /* @__PURE__ */ n(
              Ar,
              {
                asset: k,
                selectable: r,
                onSelect: s,
                onContinue: o,
                canContinue: c
              }
            ) : /* @__PURE__ */ n(
              xr,
              {
                currentVersion: k.version,
                loading: !!x,
                saving: d,
                onReturn: (f) => {
                  S(f);
                },
                onMakeCurrent: () => {
                  de();
                }
              }
            )
          ] }) : void 0,
          onClose: H
        }
      ),
      children: [
        /* @__PURE__ */ n("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ n("div", { className: "wb-detail-scroll", children: g ? /* @__PURE__ */ i("div", { className: "wb-detail-content-state", children: [
          /* @__PURE__ */ n(X, { size: 18, className: "wb-detail-spin" }),
          /* @__PURE__ */ n("span", { children: "正在读取资产" })
        ] }) : !k || !u ? /* @__PURE__ */ i("div", { className: "wb-detail-content-state is-error", children: [
          /* @__PURE__ */ n("span", { children: Z || "资产不存在" }),
          /* @__PURE__ */ i("button", { type: "button", onClick: () => {
            I();
          }, children: [
            /* @__PURE__ */ n(we, { size: 13 }),
            "重试"
          ] })
        ] }) : T ? /* @__PURE__ */ i("div", { className: `wb-detail-editable-content is-${k.kind}`, children: [
          Z ? /* @__PURE__ */ n("p", { className: "wb-detail-error-banner", children: Z }) : null,
          /* @__PURE__ */ n(
            kr,
            {
              kind: E.draft.kind,
              value: E.draft.value,
              contentFormat: E.draft.contentFormat,
              onChange: (f) => E.setDraft(
                (C) => wr(C, f)
              )
            }
          )
        ] }) : /* @__PURE__ */ i("div", { className: `wb-detail-readonly-content is-${k.kind}`, children: [
          Z ? /* @__PURE__ */ n("p", { className: "wb-detail-error-banner", children: Z }) : null,
          W ? /* @__PURE__ */ n(Kn, { grid: W, variant: "detail" }) : _ ? /* @__PURE__ */ n(
            Wn,
            {
              output: u.content,
              fallback: u.summary || k.summary,
              emptyText: "该版本暂无可预览内容",
              className: "wb-asset-preview-content",
              markdownClassName: "wb-asset-detail-prose",
              richClassName: "wb-asset-detail-prose",
              mediaLayout: "detail"
            }
          ) : /* @__PURE__ */ n(
            ze,
            {
              kind: k.kind,
              content: u.content,
              summary: u.summary || k.summary,
              prompt: Hn(u)
            },
            u.id
          )
        ] }) }) }),
        /* @__PURE__ */ n(
          Ht,
          {
            teamID: e,
            asset: N && k || null,
            onClose: () => j(!1),
            onRenamed: (f) => {
              b(
                (C) => C && { ...C, asset: f }
              ), p?.(f);
            }
          }
        )
      ]
    }
  );
}
function xr({
  currentVersion: e,
  loading: t,
  saving: r,
  onReturn: a,
  onMakeCurrent: s
}) {
  const o = t || r;
  return /* @__PURE__ */ i(ye, { children: [
    e ? /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        disabled: o,
        onClick: () => a(e),
        children: [
          /* @__PURE__ */ n(we, { size: 13 }),
          /* @__PURE__ */ n("span", { children: "返回当前版本" })
        ]
      }
    ) : null,
    /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: "wb-detail-command is-primary",
        disabled: o,
        onClick: s,
        children: [
          r ? /* @__PURE__ */ n(X, { size: 13, className: "wb-detail-spin" }) : /* @__PURE__ */ n(Fe, { size: 13 }),
          /* @__PURE__ */ n("span", { children: r ? "设置中" : "设为当前版本" })
        ]
      }
    )
  ] });
}
function Ar({
  asset: e,
  selectable: t,
  onSelect: r,
  onContinue: a,
  canContinue: s
}) {
  return /* @__PURE__ */ i(ye, { children: [
    a && Rr(e) && (s?.(e) ?? !0) ? /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        onClick: () => a(e),
        children: [
          e.sourceType === "dialogue" ? /* @__PURE__ */ n(Dn, { size: 14 }) : /* @__PURE__ */ n(we, { size: 14 }),
          /* @__PURE__ */ n("span", { children: e.sourceType === "dialogue" ? "继续对话" : "重新生成" })
        ]
      }
    ) : null,
    t && r ? /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: "wb-detail-command is-primary",
        onClick: () => r(e),
        children: [
          /* @__PURE__ */ n(Fe, { size: 14 }),
          /* @__PURE__ */ n("span", { children: "使用" })
        ]
      }
    ) : null
  ] });
}
function kt(e) {
  const t = Ye(
    e.asset.version ? [e.asset.version, ...e.versions] : e.versions
  );
  return {
    ...e,
    versions: t,
    versionTotal: Math.max(e.versionTotal, t.length)
  };
}
function Ye(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((r) => t.has(r.id) ? !1 : (t.add(r.id), !0));
}
function $r(e) {
  return e === "dirty" ? "未保存" : e === "saving" ? "保存中" : e === "error" ? "保存失败" : "已保存";
}
function Er(e, t) {
  const r = Ee(e.sourceType, t);
  return e.sourceName && e.sourceName !== r ? `${r} / ${e.sourceName}` : r;
}
function Rr(e) {
  return e.role === "material" && (e.sourceType === "tool" || e.sourceType === "dialogue");
}
function Lr({
  teamID: e,
  material: t,
  selectable: r = !1,
  layer: a = "default",
  onClose: s,
  onSelect: o
}) {
  const [c, p] = v(t), [w, l] = v(!0), [h, b] = v(""), u = K(async () => {
    l(!0), b("");
    try {
      p(await Qn(e, t.id));
    } catch (g) {
      b(G(g, "加载官方素材详情失败"));
    } finally {
      l(!1);
    }
  }, [t.id, e]);
  B(() => {
    u();
  }, [u]), B(() => {
    const g = (D) => {
      D.key === "Escape" && (D.preventDefault(), D.stopImmediatePropagation(), s());
    };
    return window.addEventListener("keydown", g, !0), () => window.removeEventListener("keydown", g, !0);
  }, [s]);
  const y = er(c.version?.content, c.kind);
  return /* @__PURE__ */ n(
    Vt,
    {
      ariaLabel: `${c.name}详情`,
      onRequestClose: s,
      layer: a,
      header: /* @__PURE__ */ n(
        Pt,
        {
          icon: c ? /* @__PURE__ */ n(Oe, { kind: c.kind }) : /* @__PURE__ */ n(Me, { size: 16 }),
          title: c.name || "官方素材详情",
          subtitle: `${Ee("official")} · ${ve(c.kind)}${c.materialCateName ? ` · ${c.materialCateName}` : ""}`,
          state: /* @__PURE__ */ n("span", { className: "wb-detail-state", children: "官方只读" }),
          updatedAt: jt(c.createdAt),
          downloadUrl: y || void 0,
          actions: r && o && !w && !h ? /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "wb-detail-command is-primary",
              onClick: () => o(c),
              children: [
                /* @__PURE__ */ n(Fe, { size: 14 }),
                /* @__PURE__ */ n("span", { children: "使用" })
              ]
            }
          ) : void 0,
          onClose: s
        }
      ),
      children: /* @__PURE__ */ n("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ n("div", { className: "wb-detail-scroll", children: w ? /* @__PURE__ */ i("div", { className: "wb-detail-content-state", children: [
        /* @__PURE__ */ n(X, { size: 18, className: "wb-detail-spin" }),
        /* @__PURE__ */ n("span", { children: "正在读取官方素材" })
      ] }) : h ? /* @__PURE__ */ i("div", { className: "wb-detail-content-state is-error", children: [
        /* @__PURE__ */ n("span", { children: h }),
        /* @__PURE__ */ i("button", { type: "button", onClick: () => {
          u();
        }, children: [
          /* @__PURE__ */ n(we, { size: 13 }),
          "重试"
        ] })
      ] }) : /* @__PURE__ */ n("div", { className: `wb-detail-readonly-content is-${c.kind}`, children: /* @__PURE__ */ n(
        ze,
        {
          kind: c.kind,
          content: c.version?.content,
          summary: c.summary
        }
      ) }) }) })
    }
  );
}
const Mr = "shemic:web-content-import";
function be(e) {
  return !!(e && (e.status === "pending" || e.status === "discovering" || e.status === "running"));
}
function Fr(e, t) {
  return `${Mr}:${e}:${t}`;
}
function _r(e) {
  if (typeof window > "u") return 0;
  try {
    const t = Number(window.localStorage.getItem(e) || 0);
    return Number.isFinite(t) && t > 0 ? t : 0;
  } catch {
    return 0;
  }
}
function Ke(e, t) {
  if (!(typeof window > "u" || t <= 0))
    try {
      window.localStorage.setItem(e, String(t));
    } catch {
    }
}
function We(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.removeItem(e);
    } catch {
    }
}
function zr() {
  return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : `import-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
function Or({
  disabled: e,
  task: t,
  onClick: r
}) {
  const a = be(t), s = a ? Math.min(100, Math.max(0, t.progress)) : 0, o = a ? `导入 ${s}%` : "导入";
  return /* @__PURE__ */ n(
    J,
    {
      label: a ? t.stageMessage || "正在导入" : "导入网络内容",
      children: /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          className: "wb-asset-import-button",
          disabled: e,
          "aria-busy": a,
          onClick: r,
          children: [
            a ? /* @__PURE__ */ n(X, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ n(At, { "aria-hidden": "true" }),
            /* @__PURE__ */ n("span", { children: o }),
            a ? /* @__PURE__ */ n(
              "span",
              {
                className: "wb-asset-upload-progress",
                role: "progressbar",
                "aria-label": "网络内容导入进度",
                "aria-valuemin": 0,
                "aria-valuemax": 100,
                "aria-valuenow": s,
                children: /* @__PURE__ */ n("span", { style: { width: `${s}%` } })
              }
            ) : null
          ]
        }
      )
    }
  );
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const Le = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!Le || Object.keys(Le).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const it = Le.joinSiteApi, ot = Le.request;
async function Pr(e) {
  const t = await ot(
    it("workbench/web_content_import"),
    "post",
    {
      team_id: e.teamID,
      project_id: e.projectID || void 0,
      canvas_id: e.canvasID || void 0,
      request_id: e.requestID,
      source: e.source
    },
    { reportError: !1 }
  );
  return ct(
    rt(t, "创建网页内容导入任务失败")
  );
}
async function Ct(e) {
  const t = await ot(
    it("workbench/web_content_import_task"),
    "get",
    {
      team_id: e.teamID,
      project_id: e.projectID || void 0,
      canvas_id: e.canvasID || void 0,
      task_id: e.taskID
    },
    { reportError: !1 }
  );
  return ct(
    rt(t, "加载网页内容导入任务失败")
  );
}
async function Nt(e) {
  const t = await ot(
    it("workbench/web_content_import_tasks"),
    "get",
    {
      team_id: e.teamID,
      project_id: e.projectID || void 0,
      canvas_id: e.canvasID || void 0
    },
    { reportError: !1 }
  ), r = rt(t, "加载网页内容导入任务失败");
  return Re(r.items).map(ct).filter((a) => a.id > 0);
}
function ct(e) {
  const t = Wt(e), r = Re(t.assets).map(qt).filter((a) => a.id > 0);
  return {
    id: Ge(t.id),
    canvasID: Ge(t.canvas_id),
    source: ee(t.source),
    status: qr(t.status),
    stageMessage: ee(t.stage_message),
    progress: Math.min(100, Ne(t.progress)),
    itemTotal: Ne(t.item_total),
    successCount: Ne(t.success_count),
    skippedCount: Ne(t.skipped_count),
    failedCount: Ne(t.failed_count),
    errorMessage: ee(t.error_message),
    assets: r,
    warnings: Vr(t.warnings),
    items: Re(t.items).map(jr).filter((a) => a.id > 0)
  };
}
function jr(e) {
  const t = Wt(e);
  return {
    id: Ge(t.id),
    platform: ee(t.platform),
    sourceURL: ee(t.source_url),
    title: ee(t.title),
    status: ee(t.status),
    stageMessage: ee(t.stage_message),
    errorMessage: ee(t.error_message)
  };
}
function Vr(e) {
  return Re(e).map(ee).filter(Boolean);
}
function qr(e) {
  const t = ee(e);
  switch (t) {
    case "discovering":
    case "running":
    case "success":
    case "partial":
    case "failed":
      return t;
    default:
      return "pending";
  }
}
function Br({
  open: e,
  teamID: t,
  projectID: r,
  canvasID: a,
  onClose: s,
  onImported: o,
  onTaskChange: c
}) {
  const [p, w] = v(""), [l, h] = v(null), [b, u] = v(!1), [y, g] = v(""), D = R(e), x = R(s), F = R(o), d = R(/* @__PURE__ */ new Set()), L = R(null), N = `${Fr(t, r)}:${a}`, j = be(l) && l?.id || 0;
  B(() => {
    D.current = e, x.current = s, F.current = o;
  }, [s, o, e]), B(() => {
    c?.(l);
  }, [c, l]), B(() => {
    let M = !1;
    d.current.clear(), h(null), w(""), g(""), u(!1), L.current = null;
    async function $() {
      try {
        const I = _r(N);
        let S = null;
        if (I > 0)
          try {
            S = await Ct({
              teamID: t,
              projectID: r,
              canvasID: a,
              taskID: I
            });
          } catch {
            We(N);
          }
        if (S || (S = (await Nt({
          teamID: t,
          projectID: r,
          canvasID: a
        }))[0] || null), M || !S) return;
        w(S.source), h(S), Ke(N, S.id);
      } catch {
      }
    }
    return $(), () => {
      M = !0;
    };
  }, [a, r, N, t]), B(() => {
    if (j <= 0) return;
    let M = !1, $ = 0;
    async function I() {
      try {
        const S = await Ct({
          teamID: t,
          projectID: r,
          canvasID: a,
          taskID: j
        });
        if (M || (h(S), g(""), !be(S))) return;
        $ = window.setTimeout(I, 1200);
      } catch (S) {
        if (M) return;
        D.current && g(G(S, "刷新导入进度失败")), $ = window.setTimeout(I, 2500);
      }
    }
    return $ = window.setTimeout(I, 700), () => {
      M = !0, window.clearTimeout($);
    };
  }, [j, a, r, t]), B(() => {
    if (!(!l || be(l))) {
      if (We(N), l.status === "failed") {
        g(l.errorMessage || "网页内容导入失败");
        return;
      }
      if (!d.current.has(l.id)) {
        if (l.assets.length === 0) {
          g(l.errorMessage || "导入完成，但没有生成可用素材");
          return;
        }
        d.current.add(l.id), L.current = null, F.current(l.assets, l.warnings, l), h(null), w(""), D.current && x.current();
      }
    }
  }, [N, l]);
  const Z = K(async () => {
    const M = p.trim();
    if (!M || b || be(l)) return;
    u(!0), g("");
    const $ = L.current?.source === M ? L.current : { source: M, requestID: zr() };
    L.current = $;
    try {
      const I = await Pr({
        teamID: t,
        projectID: r,
        canvasID: a,
        requestID: $.requestID,
        source: M
      });
      L.current = null, h(I), Ke(N, I.id);
    } catch (I) {
      try {
        const O = (await Nt({
          teamID: t,
          projectID: r,
          canvasID: a
        })).find((de) => de.source === M);
        if (O) {
          L.current = null, h(O), Ke(N, O.id);
          return;
        }
      } catch {
      }
      g(G(I, "创建网页内容导入任务失败"));
    } finally {
      u(!1);
    }
  }, [a, r, p, N, b, l, t]), z = K(() => {
    be(l) || (We(N), L.current = null, h(null), g(""));
  }, [N, l]);
  return {
    source: p,
    setSource: w,
    task: l,
    submitting: b,
    active: be(l),
    error: y,
    submit: Z,
    reset: z
  };
}
function Ur({
  open: e,
  teamID: t,
  projectID: r = 0,
  canvasID: a = 0,
  platforms: s,
  maxItems: o,
  onClose: c,
  onImported: p,
  onTaskChange: w
}) {
  const l = Br({
    open: e,
    teamID: t,
    projectID: r,
    canvasID: a,
    onClose: c,
    onImported: p,
    onTaskChange: w
  });
  B(() => {
    if (!e) return;
    const b = (u) => {
      u.key === "Escape" && (u.preventDefault(), u.stopImmediatePropagation(), c());
    };
    return window.addEventListener("keydown", b, !0), () => window.removeEventListener("keydown", b, !0);
  }, [c, e]);
  function h(b) {
    b.preventDefault(), l.submit();
  }
  return !e || typeof document > "u" ? null : Kt(
    /* @__PURE__ */ n(
      "div",
      {
        className: "wb-asset-form-backdrop",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "导入网络内容",
        onMouseDown: (b) => {
          b.target === b.currentTarget && c();
        },
        children: /* @__PURE__ */ i(
          "form",
          {
            className: "wb-asset-form-dialog wb-asset-import-dialog",
            onSubmit: h,
            children: [
              /* @__PURE__ */ i("header", { children: [
                /* @__PURE__ */ i("div", { children: [
                  /* @__PURE__ */ n("span", { className: "wb-asset-form-icon", children: /* @__PURE__ */ n(At, { "aria-hidden": "true" }) }),
                  /* @__PURE__ */ i("div", { children: [
                    /* @__PURE__ */ n("h2", { children: "导入网络内容" }),
                    /* @__PURE__ */ i("p", { children: [
                      "支持：",
                      s.map((b) => b.name).join("、") || "已配置的平台"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ n(J, { label: "关闭", children: /* @__PURE__ */ i("button", { type: "button", onClick: c, children: [
                  /* @__PURE__ */ n(xt, { "aria-hidden": "true" }),
                  /* @__PURE__ */ n("span", { className: "sr-only", children: "关闭" })
                ] }) })
              ] }),
              l.task ? /* @__PURE__ */ n(
                Kr,
                {
                  task: l.task,
                  active: l.active,
                  platforms: s
                }
              ) : /* @__PURE__ */ i("label", { children: [
                /* @__PURE__ */ n("span", { children: "链接或分享内容" }),
                /* @__PURE__ */ n(
                  "textarea",
                  {
                    autoFocus: !0,
                    value: l.source,
                    maxLength: 8192,
                    disabled: l.submitting,
                    placeholder: "粘贴内容链接或分享文本，可一次粘贴多条",
                    onChange: (b) => l.setSource(b.target.value)
                  }
                ),
                /* @__PURE__ */ i("small", { className: "wb-asset-import-help", children: [
                  "自动识别对应平台，一次最多 ",
                  o,
                  " 条，可混合粘贴"
                ] })
              ] }),
              l.error ? /* @__PURE__ */ i("p", { className: "wb-asset-form-error wb-asset-import-error", children: [
                /* @__PURE__ */ n($t, { "aria-hidden": "true" }),
                /* @__PURE__ */ n("span", { children: l.error })
              ] }) : null,
              /* @__PURE__ */ i("footer", { children: [
                /* @__PURE__ */ n("button", { type: "button", onClick: c, children: "关闭" }),
                l.task?.status === "failed" ? /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "is-primary",
                    onClick: l.reset,
                    children: "重新导入"
                  }
                ) : l.active ? null : /* @__PURE__ */ i(
                  "button",
                  {
                    type: "submit",
                    className: "is-primary",
                    disabled: l.submitting || !l.source.trim(),
                    children: [
                      l.submitting ? /* @__PURE__ */ n(X, { className: "is-spinning" }) : null,
                      l.submitting ? "提交中" : "导入"
                    ]
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    document.body
  );
}
function Kr({
  task: e,
  active: t,
  platforms: r
}) {
  const a = Math.min(100, Math.max(0, e.progress)), s = new Map(
    r.map((p) => [p.key, p.name])
  ), o = e.successCount + e.skippedCount, c = e.failedCount ? `已导入 ${o} 项，${e.failedCount} 项失败` : t ? e.stageMessage || "正在导入" : `已导入 ${o} 项`;
  return /* @__PURE__ */ i("section", { className: "wb-asset-import-status", "aria-live": "polite", children: [
    /* @__PURE__ */ i("div", { className: "wb-asset-import-status-head", children: [
      t ? /* @__PURE__ */ n(X, { className: "is-spinning", "aria-hidden": "true" }) : e.status === "failed" ? /* @__PURE__ */ n($t, { "aria-hidden": "true" }) : /* @__PURE__ */ n(Sn, { "aria-hidden": "true" }),
      /* @__PURE__ */ i("div", { children: [
        /* @__PURE__ */ n("strong", { children: c }),
        /* @__PURE__ */ i("span", { children: [
          "共 ",
          e.itemTotal,
          " 条内容"
        ] })
      ] }),
      /* @__PURE__ */ i("b", { children: [
        a,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ n(
      "div",
      {
        className: "wb-asset-import-progress",
        role: "progressbar",
        "aria-label": "网页内容导入进度",
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": a,
        children: /* @__PURE__ */ n("span", { style: { width: `${a}%` } })
      }
    ),
    /* @__PURE__ */ n("div", { className: "wb-asset-import-items", children: e.items.map((p, w) => /* @__PURE__ */ i(
      "div",
      {
        className: p.status === "failed" ? "is-failed" : "",
        children: [
          /* @__PURE__ */ n("b", { children: s.get(p.platform) || p.platform }),
          /* @__PURE__ */ n("span", { title: p.sourceURL, children: p.title || p.sourceURL || `第 ${w + 1} 条内容` }),
          /* @__PURE__ */ n("em", { title: Tt(p), children: Tt(p) })
        ]
      },
      p.id || `${p.platform}-${w}`
    )) })
  ] });
}
function Tt(e) {
  return e.status === "failed" ? e.errorMessage || "导入失败" : e.status === "success" ? "已导入" : e.status === "skipped" ? "已存在" : e.stageMessage || "等待导入";
}
const Wr = [
  { key: "", label: "全部" },
  ...nr
], It = [
  { key: "", label: "全部" },
  ...Bt
];
function Hr({
  filters: e,
  options: t,
  scopeProjectID: r = 0,
  sourceLabels: a = {},
  allowedKinds: s = [],
  includeOfficial: o = !0,
  view: c,
  collectionName: p,
  onCollectionBack: w,
  onChange: l,
  onViewChange: h
}) {
  const b = [
    { key: "", label: "全部" },
    ...tr.filter(
      (d) => d.key !== "official" || o && t.materialLibrary.enabled && !!Je(t.materialLibrary, s)
    ).map((d) => ({
      ...d,
      label: a[d.key] || d.label
    }))
  ], u = t.assetCates.length > 0, y = r || e.projectID, g = t.canvases.filter(
    (d) => (!y || d.projectID === y) && (!e.assetCateID || d.assetCateID === e.assetCateID)
  ), D = e.sourceType === "official" ? t.materialLibrary.kinds.filter(
    (d) => s.length === 0 || s.includes(d.assetKind)
  ).map((d) => ({ key: d.assetKind, label: d.name })) : s.length > 0 ? It.filter(
    (d) => d.key && s.includes(d.key)
  ) : It, x = Ut(
    t.materialLibrary,
    e.kind
  );
  function F(d) {
    const L = d === "project" ? r : 0, N = d === "official" ? Je(t.materialLibrary, s) : "", j = d === "official" ? N : e.sourceType === "official" ? s.length === 1 ? s[0] : "" : e.kind;
    l({
      ...e,
      sourceType: d,
      sourceID: L,
      projectID: L,
      assetCateID: 0,
      canvasID: d === "project" ? e.canvasID : 0,
      materialCateID: 0,
      nodeKey: "",
      role: "",
      kind: j
    });
  }
  return /* @__PURE__ */ i("div", { className: "wb-asset-filters", children: [
    p && w ? /* @__PURE__ */ n(Te, { label: "集合", children: /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: "wb-asset-collection-back",
        onClick: w,
        children: [
          /* @__PURE__ */ n(xn, { "aria-hidden": "true" }),
          /* @__PURE__ */ n(St, { "aria-hidden": "true" }),
          /* @__PURE__ */ n("span", { children: p })
        ]
      }
    ) }) : /* @__PURE__ */ i(Te, { label: "来源", children: [
      /* @__PURE__ */ n(
        $e,
        {
          options: b,
          value: e.sourceType,
          onChange: F
        }
      ),
      e.sourceType === "project" ? /* @__PURE__ */ i(ye, { children: [
        r > 0 ? null : /* @__PURE__ */ n(
          Ie,
          {
            label: a.project || "创作",
            value: e.projectID,
            options: t.projects,
            onChange: (d) => l({
              ...e,
              projectID: d,
              sourceID: d,
              canvasID: 0,
              assetCateID: 0,
              nodeKey: ""
            })
          }
        ),
        u ? /* @__PURE__ */ n(
          Ie,
          {
            label: "资产分类",
            value: e.assetCateID,
            options: t.assetCates,
            onChange: (d) => l({
              ...e,
              assetCateID: d,
              canvasID: 0,
              nodeKey: ""
            })
          }
        ) : null
      ] }) : null,
      e.sourceType === "project" && y > 0 && g.length > 1 ? /* @__PURE__ */ n(
        Ie,
        {
          label: "画布",
          value: e.canvasID,
          options: g,
          onChange: (d) => l({ ...e, canvasID: d })
        }
      ) : null,
      e.sourceType === "tool" ? /* @__PURE__ */ n(
        Ie,
        {
          label: a.tool || "工具",
          value: e.sourceID,
          options: t.tools,
          onChange: (d) => l({ ...e, sourceID: d })
        }
      ) : null,
      e.sourceType === "dialogue" ? /* @__PURE__ */ n(
        Ie,
        {
          label: "角色",
          value: e.sourceID,
          options: t.dialogues,
          onChange: (d) => l({ ...e, sourceID: d })
        }
      ) : null
    ] }),
    !p && e.sourceType === "project" && u ? /* @__PURE__ */ n(Te, { label: "资产", children: /* @__PURE__ */ n(
      $e,
      {
        options: Wr,
        value: e.role,
        onChange: (d) => l({ ...e, role: d })
      }
    ) }) : null,
    /* @__PURE__ */ n(
      Te,
      {
        label: "类型",
        trailing: e.sourceType === "official" ? void 0 : /* @__PURE__ */ n(Jr, { view: c, onChange: h }),
        children: /* @__PURE__ */ n(
          $e,
          {
            options: D,
            value: e.kind,
            onChange: (d) => l({
              ...e,
              kind: d,
              materialCateID: e.sourceType === "official" ? 0 : e.materialCateID
            })
          }
        )
      }
    ),
    e.sourceType === "official" && x.length > 0 ? /* @__PURE__ */ n(Te, { label: "分类", children: /* @__PURE__ */ n(
      $e,
      {
        options: [
          { key: 0, label: "全部" },
          ...x.map((d) => ({
            key: d.id,
            label: d.name
          }))
        ],
        value: e.materialCateID,
        onChange: (d) => l({ ...e, materialCateID: d })
      }
    ) }) : null
  ] });
}
function Te({
  label: e,
  children: t,
  trailing: r
}) {
  return /* @__PURE__ */ i("div", { className: "wb-asset-filter-row", children: [
    /* @__PURE__ */ n("strong", { children: e }),
    /* @__PURE__ */ i("div", { className: "wb-asset-filter-controls", children: [
      t,
      r
    ] })
  ] });
}
function Jr({
  view: e,
  onChange: t
}) {
  return /* @__PURE__ */ i("div", { className: "wb-asset-view-switch", role: "tablist", "aria-label": "资产视图", children: [
    /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": e === "assets",
        className: e === "assets" ? "is-active" : "",
        onClick: () => t("assets"),
        children: [
          /* @__PURE__ */ n(An, { "aria-hidden": "true" }),
          /* @__PURE__ */ n("span", { children: "资产" })
        ]
      }
    ),
    /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": e === "trash",
        className: e === "trash" ? "is-active" : "",
        onClick: () => t("trash"),
        children: [
          /* @__PURE__ */ n(Et, { "aria-hidden": "true" }),
          /* @__PURE__ */ n("span", { children: "回收站" })
        ]
      }
    )
  ] });
}
function $e({
  options: e,
  value: t,
  onChange: r
}) {
  return /* @__PURE__ */ n("div", { className: "wb-asset-segments", children: e.map((a) => /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: t === a.key ? "is-active" : "",
      onClick: () => r(a.key),
      children: a.label
    },
    a.key || "all"
  )) });
}
function Ie({
  label: e,
  value: t,
  options: r,
  onChange: a
}) {
  return /* @__PURE__ */ i("label", { className: "wb-asset-select", children: [
    /* @__PURE__ */ n("span", { className: "sr-only", children: e }),
    /* @__PURE__ */ i(
      "select",
      {
        value: t || "",
        onChange: (s) => a(Number(s.target.value)),
        children: [
          /* @__PURE__ */ i("option", { value: "", children: [
            "全部",
            e
          ] }),
          r.map((s) => /* @__PURE__ */ n("option", { value: s.id, children: s.name }, s.id))
        ]
      }
    )
  ] });
}
function Gr({
  uploading: e,
  progress: t,
  onClick: r
}) {
  const a = Xr(e, t), s = e && t && (t.phase !== "preparing" || t.percent > 0) ? t.percent : null;
  return /* @__PURE__ */ n(J, { label: a, children: /* @__PURE__ */ i(
    "button",
    {
      type: "button",
      className: "wb-asset-local-upload",
      disabled: e,
      "aria-busy": e,
      onClick: r,
      children: [
        e ? /* @__PURE__ */ n(X, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ n($n, { "aria-hidden": "true" }),
        /* @__PURE__ */ n("span", { children: a }),
        e ? /* @__PURE__ */ n(
          "span",
          {
            className: `wb-asset-upload-progress${s == null ? " is-indeterminate" : ""}`,
            role: "progressbar",
            "aria-label": "上传进度",
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            "aria-valuenow": s ?? void 0,
            "aria-valuetext": s == null ? "正在准备上传" : `${s}%`,
            children: /* @__PURE__ */ n("span", { style: { width: `${s ?? 40}%` } })
          }
        ) : null
      ]
    }
  ) });
}
function Xr(e, t) {
  return e ? t ? t.phase === "preparing" ? t.percent > 0 ? `上传中 ${t.percent}%` : "上传中" : t.phase === "saving" ? "处理中" : `上传中 ${t.percent}%` : "上传中" : "上传";
}
const De = {
  sourceType: "",
  sourceID: 0,
  projectID: 0,
  canvasID: 0,
  assetCateID: 0,
  materialCateID: 0,
  nodeKey: "",
  role: "",
  kind: ""
};
await window.DeverFront?.ensureCompat?.(["@/components/confirm-dialog"]);
const Qe = window.DeverFront?.sdk?.getCompatModule("@/components/confirm-dialog");
if (!Qe || Object.keys(Qe).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/confirm-dialog");
const Zr = Qe.ConfirmDialog, Dt = {
  projects: [],
  canvases: [],
  tools: [],
  dialogues: [],
  assetCates: [],
  webContentImportEnabled: !1,
  webContentImportPlatforms: [],
  webContentImportMaxItems: 1,
  materialLibrary: {
    enabled: !1,
    pack: { id: 0, name: "", description: "" },
    kinds: [],
    categories: []
  }
}, he = {
  items: [],
  page: 1,
  pageSize: 24,
  total: 0,
  hasMore: !1
};
function Yr({
  teamID: e,
  scopeProjectID: t = 0,
  scopeCanvasID: r = 0,
  initialFilters: a,
  selectable: s = !1,
  excludeCollections: o = !1,
  selectedAssetIDs: c,
  selectedAssetKeys: p,
  usedAssetIDs: w,
  usedAssetKeys: l,
  includeOfficial: h = !0,
  allowedKinds: b,
  onSelect: u,
  onContinue: y,
  canContinue: g,
  onAssetChanged: D,
  onAssetRemoved: x,
  onLocalUpload: F,
  uploadAccept: d,
  headerAction: L,
  reloadSignal: N = 0,
  catalogOptions: j,
  contentMode: Z = "preview",
  detailLayer: z = "default",
  className: M = ""
}) {
  const $ = mr(), I = Jt(), S = JSON.stringify(b || []), O = ie(
    () => ea(b),
    [S]
  ), de = JSON.stringify({ initialFilters: a, normalizedAllowedKinds: O }), k = ie(
    () => Qr(a, O),
    [de]
  ), [U, Y] = v(k), [W, _] = v(
    null
  ), [T, Q] = v("assets"), [E, oe] = v(Dt), re = rr(
    E.webContentImportEnabled,
    O
  ), [V, H] = v(he), [f, C] = v(null), [P, te] = v(null), [ce, le] = v(null), [ue, ge] = v(0), [ke, lt] = v(!0), [Pe, je] = v(!1), [Yt, Se] = v(null), [Qt, Ve] = v(!1), [en, ut] = v(
    null
  ), [tn, dt] = v(!0), [mt, ae] = v(""), [nn, rn] = v(0), se = R(0), pt = R(null), me = R(k), pe = R("assets"), an = JSON.stringify({
    selectedAssetIDs: c,
    selectedAssetKeys: p
  }), sn = ie(
    () => /* @__PURE__ */ new Set([
      ...p || [],
      ...(c || []).map((m) => `asset:${m}`)
    ]),
    [an]
  ), on = JSON.stringify({ usedAssetIDs: w, usedAssetKeys: l }), cn = ie(
    () => /* @__PURE__ */ new Set([
      ...l || [],
      ...(w || []).map((m) => `asset:${m}`)
    ]),
    [on]
  );
  B(() => {
    se.current += 1, Y(k), me.current = k, _(null), Q("assets"), pe.current = "assets", oe(Dt), H(he), C(null), te(null), le(null), ge(0), je(!1), Se(null), Ve(!1), ut(null), ae("");
  }, [$, k, t, e]), B(() => {
    let m = !0;
    return dt(!0), ar(e, j, $).then((A) => {
      m && (oe(A), Y((q) => {
        const fe = ta(
          q,
          A,
          O,
          h
        );
        return W || (me.current = fe), fe;
      }));
    }).catch((A) => {
      m && ae(G(A, "加载资产筛选项失败"));
    }).finally(() => {
      m && dt(!1);
    }), () => {
      m = !1;
    };
  }, [
    j,
    h,
    O,
    $,
    e
  ]);
  const xe = K(
    async (m) => {
      const A = ++se.current;
      lt(!0), ae("");
      try {
        const q = await sr({
          teamID: e,
          scopeProjectID: t,
          filters: U,
          view: T,
          contentMode: Z,
          page: m,
          pageSize: 24,
          collectionID: W?.id,
          excludeCollections: o,
          requestScopeKey: $
        });
        A === se.current && H(q);
      } catch (q) {
        A === se.current && ae(G(q, "加载资产失败"));
      } finally {
        A === se.current && lt(!1);
      }
    },
    [
      W?.id,
      Z,
      o,
      U,
      $,
      t,
      e,
      T
    ]
  );
  B(() => {
    xe(1);
  }, [xe, N, nn]);
  function ln(m) {
    m.sourceType === "official" && T !== "assets" && (Q("assets"), pe.current = "assets"), Y(m), W || (me.current = m), H((A) => ({ ...A, page: 1 }));
  }
  function Ce() {
    rn((m) => m + 1);
  }
  function un(m) {
    if (m.kind !== "collection") {
      C(m);
      return;
    }
    me.current = U, pe.current = T, _(m), Y({
      ...De,
      kind: U.kind === "collection" ? O.length === 1 ? O[0] : "" : U.kind
    }), H(he), C(null), ae("");
  }
  function dn() {
    se.current += 1, _(null), Y(me.current), Q(pe.current), H(he), C(null), ae("");
  }
  function mn(m) {
    m === T || ue || (se.current += 1, Q(m), W || (pe.current = m), H(he), C(null), te(null), le(null), ae(""));
  }
  async function pn() {
    if (!ce || ue) return;
    const m = ce.id;
    ge(m);
    try {
      await cr({ teamID: e, assetID: m }), le(null), f?.libraryType === "asset" && f.id === m && C(null), x?.(m), ne.success("资产已移入回收站"), Ce();
    } catch (A) {
      ne.error(G(A, "删除资产失败"));
    } finally {
      ge(0);
    }
  }
  async function fn(m) {
    if (!ue) {
      ge(m.id);
      try {
        const A = await or({ teamID: e, assetID: m.id });
        D?.(A), ne.success("资产已恢复"), Ce();
      } catch (A) {
        ne.error(G(A, "恢复资产失败"));
      } finally {
        ge(0);
      }
    }
  }
  async function hn(m) {
    const A = Array.from(m.target.files || []);
    if (m.target.value = "", !(!F || A.length === 0 || Pe)) {
      je(!0), Se(null);
      try {
        const q = await F(A, {
          onProgress: Se
        });
        if (q.length === 0)
          throw new Error("上传完成，但没有生成可用资产");
        q.forEach((Ae) => D?.(Ae));
        const fe = {
          ...De,
          sourceType: "upload",
          canvasID: U.canvasID || r,
          kind: O.length === 1 ? O[0] : ""
        };
        se.current += 1, _(null), Q("assets"), pe.current = "assets", Y(fe), me.current = fe, H(he), C(null), ae(""), ne.success(`已上传 ${q.length} 项资产`);
      } catch (q) {
        ne.error(G(q, "上传资产失败"));
      } finally {
        je(!1), Se(null);
      }
    }
  }
  function bn(m, A, q) {
    m.forEach((Be) => D?.(Be));
    const fe = new Set(m.map((Be) => Be.kind)), Ae = {
      ...De,
      sourceType: "import",
      canvasID: U.canvasID || r,
      kind: fe.size === 1 && m[0]?.kind || ""
    };
    se.current += 1, _(null), Q("assets"), pe.current = "assets", Y(Ae), me.current = Ae, H(he), C(null), ae("");
    const qe = q.successCount + q.skippedCount;
    if (q.failedCount > 0) {
      ne.warning(`已导入 ${qe} 项，${q.failedCount} 项失败`);
      return;
    }
    if (A.length > 0) {
      ne.warning(`已导入 ${qe} 项，部分媒体保留原地址`);
      return;
    }
    ne.success(`已导入 ${qe} 项内容`);
  }
  return /* @__PURE__ */ i("section", { className: `wb-asset-browser ${M}`.trim(), children: [
    /* @__PURE__ */ i("header", { className: "wb-asset-browser-head", children: [
      /* @__PURE__ */ n(
        Hr,
        {
          filters: U,
          options: E,
          scopeProjectID: t,
          sourceLabels: I,
          allowedKinds: O,
          includeOfficial: h,
          view: T,
          collectionName: W?.name,
          onCollectionBack: W ? dn : void 0,
          onChange: ln,
          onViewChange: mn
        }
      ),
      /* @__PURE__ */ i("div", { className: "wb-asset-browser-actions", children: [
        /* @__PURE__ */ n("span", { children: ke ? "正在加载" : `${V.total} 项` }),
        /* @__PURE__ */ n(
          J,
          {
            label: U.sourceType === "official" ? "刷新官方素材" : "刷新资产",
            children: /* @__PURE__ */ i("button", { type: "button", onClick: Ce, children: [
              /* @__PURE__ */ n(En, { className: ke ? "is-spinning" : "" }),
              /* @__PURE__ */ n("span", { className: "sr-only", children: U.sourceType === "official" ? "刷新官方素材" : "刷新资产" })
            ] })
          }
        ),
        !W && F ? /* @__PURE__ */ i(ye, { children: [
          /* @__PURE__ */ n(
            Gr,
            {
              uploading: Pe,
              progress: Yt,
              onClick: () => pt.current?.click()
            }
          ),
          /* @__PURE__ */ n(
            "input",
            {
              ref: pt,
              type: "file",
              hidden: !0,
              multiple: !0,
              accept: d,
              onChange: hn
            }
          )
        ] }) : null,
        W ? null : L,
        !W && re ? /* @__PURE__ */ n(
          Or,
          {
            disabled: Pe,
            task: en,
            onClick: () => Ve(!0)
          }
        ) : null
      ] })
    ] }),
    /* @__PURE__ */ n("div", { className: "wb-asset-browser-body", children: ke && V.items.length === 0 ? /* @__PURE__ */ n(He, { icon: /* @__PURE__ */ n(X, { className: "is-spinning" }) }) : mt ? /* @__PURE__ */ n(He, { text: mt, error: !0 }) : V.items.length === 0 ? /* @__PURE__ */ n(
      He,
      {
        icon: T === "trash" ? /* @__PURE__ */ n(Et, {}) : /* @__PURE__ */ n(Rn, {}),
        text: tn ? "正在读取资产配置" : T === "trash" ? "回收站为空" : W ? "集合内暂无符合条件的资产" : U.sourceType === "official" ? "当前分类暂无官方素材" : "暂无符合条件的资产"
      }
    ) : /* @__PURE__ */ n("div", { className: "wb-asset-grid", children: V.items.map((m) => {
      const A = ir(m);
      return /* @__PURE__ */ n(
        fr,
        {
          asset: m,
          sourceLabels: I,
          view: T,
          selectable: m.kind !== "collection" && s && T === "assets",
          selected: T === "assets" && sn.has(A),
          used: T === "assets" && cn.has(A),
          busy: ue === m.id,
          readOnly: m.libraryType === "material",
          onOpen: un,
          onRename: te,
          onDelete: T === "assets" ? le : void 0,
          onRestore: T === "trash" ? fn : void 0,
          onSelect: u
        },
        A
      );
    }) }) }),
    V.total > V.pageSize ? /* @__PURE__ */ i("footer", { className: "wb-asset-pagination", children: [
      /* @__PURE__ */ n(J, { label: "上一页", children: /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: V.page <= 1 || ke,
          onClick: () => {
            xe(V.page - 1);
          },
          children: /* @__PURE__ */ n(Ln, {})
        }
      ) }),
      /* @__PURE__ */ i("span", { children: [
        V.page,
        " / ",
        Math.max(1, Math.ceil(V.total / V.pageSize))
      ] }),
      /* @__PURE__ */ n(J, { label: "下一页", children: /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: !V.hasMore || ke,
          onClick: () => {
            xe(V.page + 1);
          },
          children: /* @__PURE__ */ n(Mn, {})
        }
      ) })
    ] }) : null,
    f?.libraryType === "asset" ? /* @__PURE__ */ n(
      Sr,
      {
        teamID: e,
        assetID: f.id,
        selectable: s && T === "assets",
        layer: z,
        onClose: () => C(null),
        onSelect: u ? (m) => {
          C(null), u(m);
        } : void 0,
        onContinue: y ? (m) => {
          C(null), y(m);
        } : void 0,
        canContinue: g,
        onAssetChanged: (m) => {
          Ce(), D?.(m);
        }
      }
    ) : null,
    f?.libraryType === "material" ? /* @__PURE__ */ n(
      Lr,
      {
        teamID: e,
        material: f,
        selectable: s && T === "assets",
        layer: z,
        onClose: () => C(null),
        onSelect: u ? (m) => {
          C(null), u(m);
        } : void 0
      }
    ) : null,
    /* @__PURE__ */ n(
      Ht,
      {
        teamID: e,
        asset: P,
        onClose: () => te(null),
        onRenamed: (m) => {
          H((A) => ({
            ...A,
            items: A.items.map(
              (q) => q.id === m.id ? m : q
            )
          })), D?.(m), Ce();
        }
      }
    ),
    re ? /* @__PURE__ */ n(
      Ur,
      {
        open: Qt,
        teamID: e,
        projectID: t,
        canvasID: U.canvasID || r,
        platforms: E.webContentImportPlatforms,
        maxItems: E.webContentImportMaxItems,
        onClose: () => Ve(!1),
        onImported: bn,
        onTaskChange: ut
      }
    ) : null,
    /* @__PURE__ */ n(
      Zr,
      {
        open: !!ce,
        layerZIndex: Ot,
        onOpenChange: (m) => {
          !m && !ue && le(null);
        },
        title: "移入回收站？",
        desc: ce?.kind === "collection" ? `“${ce.name}”及集合内素材将移入回收站，你可以稍后恢复。` : `“${ce?.name || "该资产"}”将从资产列表移除，你可以稍后在回收站中恢复。`,
        confirmText: "移入回收站",
        destructive: !0,
        isLoading: !!ue,
        handleConfirm: () => {
          pn();
        }
      }
    )
  ] });
}
function He({
  icon: e,
  text: t = "",
  error: r = !1
}) {
  return /* @__PURE__ */ i("div", { className: `wb-asset-state ${r ? "is-error" : ""}`.trim(), children: [
    e,
    t ? /* @__PURE__ */ n("p", { children: t }) : null
  ] });
}
function Qr(e, t) {
  const r = { ...De, ...e || {} };
  return t.length > 0 && !t.includes(r.kind) && (r.kind = t[0]), r.projectID && (r.sourceType = "project", r.sourceID = r.projectID), r.sourceType !== "project" && (r.projectID = 0, r.assetCateID = 0, r.nodeKey = "", r.role = ""), r;
}
function ea(e) {
  const t = Bt.filter(
    (a) => a.key !== "collection"
  ), r = t.map((a) => a.key).filter((a) => e?.includes(a));
  return r.length === t.length ? [] : r;
}
function ta(e, t, r, a) {
  if (e.sourceType !== "official") return e;
  const s = Je(
    t.materialLibrary,
    r
  );
  if (!a || !t.materialLibrary.enabled || !s)
    return {
      ...De,
      kind: r.length === 1 ? r[0] : ""
    };
  const o = new Set(
    t.materialLibrary.kinds.map((w) => w.assetKind)
  ), c = e.kind && o.has(e.kind) && (r.length === 0 || r.includes(e.kind)) ? e.kind : s, p = new Set(
    Ut(t.materialLibrary, c).map(
      (w) => w.id
    )
  );
  return {
    ...e,
    kind: c,
    materialCateID: p.has(e.materialCateID) ? e.materialCateID : 0
  };
}
function na({
  teamID: e,
  onContinue: t,
  canContinue: r,
  catalogOptions: a
}) {
  async function s(o, c) {
    return (await lr({
      teamID: e,
      files: o,
      onProgress: c?.onProgress
    })).map(({ asset: w }) => qt(w)).filter((w) => w.id > 0);
  }
  return /* @__PURE__ */ n(
    Yr,
    {
      teamID: e,
      onLocalUpload: s,
      onContinue: t,
      canContinue: r,
      catalogOptions: a
    }
  );
}
const ma = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkbenchAssetPage: na
}, Symbol.toStringTag, { value: "Module" }));
export {
  Yr as A,
  Dr as T,
  Sr as a,
  kr as b,
  Oe as c,
  Gr as d,
  ma as e,
  Nr as u
};
