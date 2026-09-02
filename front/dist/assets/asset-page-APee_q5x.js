import { a as i, j as n, F as ge } from "./runtime-entry-9YhLBCWA.js";
import { b as Fe, aH as yn, aE as vn, b4 as gn, b5 as kn, a9 as Cn, a1 as xt, k as Nn, q as tt, r as X, s as be, h as Tn, n as _e, X as At, z as In, e as Dn, b6 as Sn, b7 as $t, v as Et, C as xn, A as An, aF as $n, a2 as Rt, U as En, R as Rn, b8 as Ln, Y as Mn, d as Fn } from "./vendor-icons-DgDZMD4Q.js";
import { d as L, a as y, b as B, u as ce, g as _n, e as U } from "./_commonjsHelpers-C76sftkf.js";
import { t as ne } from "./index-GiccNT9P.js";
import { b7 as zn, B as J, b8 as Lt, b9 as Mt, aq as ve, ba as Ft, bb as _t, bc as On, n as Pn, A as ht, bd as jn, be as Re, bf as Vn, aU as ze, b3 as nt, bg as zt, aX as rt, ay as qn, an as Ot, bh as Pt, bi as Bn, bj as Un, b2 as Kn, k as Wn, C as Hn, bk as Jn, D as jt, o as Vt, q as Gn, bl as Xn, t as qt, bm as Zn, bn as Yn, bo as Qn, bp as er, bq as tr, v as Bt, br as nr, bs as Ge, bt as Ut, bu as Kt, bv as rr, bw as ar, bx as sr, by as ir, bz as or, bA as cr, bB as lr, aB as ur } from "./upload-asset-api-BHoUDUjk.js";
import { V as dr, M as bt } from "./media-inspector-gallery-DkVtDPR_.js";
import { d as Wt } from "./preloadable-BSZIYdQl.js";
import { k as G, q as mr, s as at, a as Le, r as ee, h as Te, d as Xe, c as Ht } from "./site-config-CnYw1vhW.js";
import { u as pr } from "./project-dialogs-mYJg07yc.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./asset-page-DSfTbQOo.css", import.meta.url).href]);
function wt({
  content: e,
  summary: t,
  compact: r = !1
}) {
  const a = zn(e), s = a.name || t || "文件", o = a.extension ? a.extension.toUpperCase() : "FILE", c = a.extension ? `${a.extension.toUpperCase()} 文件` : "文件";
  return r ? /* @__PURE__ */ i("div", { className: "wb-asset-file-card-preview", children: [
    /* @__PURE__ */ n("strong", { children: o }),
    /* @__PURE__ */ n(J, { label: s, children: /* @__PURE__ */ n("p", { children: s }) }),
    /* @__PURE__ */ n("span", { children: "文件" })
  ] }) : /* @__PURE__ */ i("section", { className: "wb-asset-file-preview", children: [
    /* @__PURE__ */ n("span", { className: "wb-asset-file-icon", children: /* @__PURE__ */ n(Fe, { "aria-hidden": "true" }) }),
    /* @__PURE__ */ i("div", { className: "wb-asset-file-copy", children: [
      /* @__PURE__ */ n(J, { label: s, children: /* @__PURE__ */ n("strong", { children: s }) }),
      /* @__PURE__ */ n("span", { children: c })
    ] }),
    a.url ? /* @__PURE__ */ i("a", { href: a.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ n(yn, { "aria-hidden": "true" }),
      /* @__PURE__ */ n("span", { children: "打开文件" })
    ] }) : /* @__PURE__ */ n("span", { className: "wb-asset-file-unavailable", children: "文件暂不可用" })
  ] });
}
function Ke({
  kind: e,
  src: t,
  poster: r
}) {
  const a = L(null), [s, o] = y(""), [c, f] = y(""), [w, u] = y(""), m = s === t, b = c === t, l = w === t;
  B(() => {
    const T = a.current;
    if (!t || !T || typeof IntersectionObserver > "u") {
      o(t);
      return;
    }
    const E = new IntersectionObserver(
      (F) => {
        F.some((_) => _.isIntersecting) && (o(t), E.disconnect());
      },
      { rootMargin: "320px 0px" }
    );
    return E.observe(T), () => E.disconnect();
  }, [t]);
  function v() {
    f(t), u("");
  }
  function g() {
    f(""), u(t);
  }
  return /* @__PURE__ */ i(
    "div",
    {
      ref: a,
      className: [
        "wb-asset-lazy-cover",
        `is-${e}`,
        b ? "is-loaded" : "is-pending",
        l ? "is-failed" : ""
      ].filter(Boolean).join(" "),
      children: [
        m && !l ? e === "image" ? /* @__PURE__ */ n(
          "img",
          {
            src: t,
            alt: "",
            loading: "lazy",
            decoding: "async",
            onLoad: v,
            onError: g
          }
        ) : /* @__PURE__ */ n(
          dr,
          {
            src: t,
            poster: r,
            ariaHidden: !0,
            onLoad: v,
            onError: g
          }
        ) : null,
        l ? /* @__PURE__ */ n("span", { children: "封面加载失败" }) : null
      ]
    }
  );
}
function fr({
  kind: e,
  content: t,
  summary: r
}) {
  const a = Lt(e, t), s = r || Mt(t) || ve(e), o = Ft(a, "storyboard") ? { text: s } : a;
  return /* @__PURE__ */ n("div", { className: `wb-asset-card-text-preview is-${e}`, children: /* @__PURE__ */ n(
    _t,
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
function Oe({
  kind: e,
  content: t,
  summary: r,
  prompt: a,
  compact: s = !1
}) {
  const o = On(t, e), c = o.map((w) => w.url), f = c[0] || "";
  if (!s) {
    const w = e === "audio" ? Pn(t) : null;
    if ((e === "image" || e === "video") && c.length > 0)
      return /* @__PURE__ */ n(
        bt,
        {
          kind: e,
          mediaItems: o,
          downloadable: !0,
          className: "wb-asset-media-gallery"
        }
      );
    if (e === "audio")
      return o.length > 0 && (o.length > 1 || o[0]?.thumbnail) ? /* @__PURE__ */ n(
        bt,
        {
          kind: "audio",
          mediaItems: o,
          downloadable: !0,
          className: "wb-asset-media-gallery",
          supplementalText: w
        }
      ) : /* @__PURE__ */ n(ht, { src: f, prompt: a, detailed: !0 });
    if (e === "file")
      return /* @__PURE__ */ n(wt, { content: t, summary: r });
    const u = Lt(e, t);
    return /* @__PURE__ */ n(
      _t,
      {
        output: u,
        fallback: r || "",
        emptyText: "该版本暂无可预览内容",
        className: "wb-asset-preview-content",
        markdownClassName: "wb-asset-detail-prose",
        richClassName: "wb-asset-detail-prose",
        mediaLayout: "detail"
      }
    );
  }
  return e === "image" && f ? /* @__PURE__ */ n(Ke, { kind: "image", src: f }) : e === "video" && f ? /* @__PURE__ */ n(
    Ke,
    {
      kind: "video",
      src: f,
      poster: o[0]?.thumbnail
    }
  ) : e === "audio" ? o[0]?.thumbnail ? /* @__PURE__ */ n(Ke, { kind: "image", src: o[0].thumbnail }) : /* @__PURE__ */ n(ht, { src: f }) : e === "file" ? /* @__PURE__ */ n(wt, { content: t, summary: r, compact: !0 }) : e === "text" || e === "richtext" ? /* @__PURE__ */ n(fr, { kind: e, content: t, summary: r }) : /* @__PURE__ */ n("div", { className: "wb-asset-card-fallback", children: /* @__PURE__ */ n("p", { children: r || Mt(t) || ve(e) }) });
}
function Pe({ kind: e }) {
  switch (e) {
    case "collection":
      return /* @__PURE__ */ n(xt, { "aria-hidden": "true" });
    case "image":
      return /* @__PURE__ */ n(Cn, { "aria-hidden": "true" });
    case "audio":
      return /* @__PURE__ */ n(kn, { "aria-hidden": "true" });
    case "video":
      return /* @__PURE__ */ n(gn, { "aria-hidden": "true" });
    case "file":
      return /* @__PURE__ */ n(vn, { "aria-hidden": "true" });
    default:
      return /* @__PURE__ */ n(Fe, { "aria-hidden": "true" });
  }
}
function hr({
  asset: e,
  sourceLabels: t,
  view: r = "assets",
  selectable: a = !1,
  selected: s = !1,
  used: o = !1,
  busy: c = !1,
  readOnly: f = !1,
  onOpen: w,
  onRename: u,
  onDelete: m,
  onRestore: b,
  onSelect: l
}) {
  const v = r === "trash", g = e.kind === "collection", T = g ? 0 : jn(e.version?.content, e.kind), E = a && !g && !!l, F = E && (c || o), _ = E ? o ? `${e.name}已使用` : s ? `取消选择${e.name}` : `选择${e.name}` : `${g ? "打开集合" : "查看"}${e.name}`, d = g ? /* @__PURE__ */ n(br, { asset: e }) : /* @__PURE__ */ n(
    Oe,
    {
      kind: e.kind,
      content: e.version?.content,
      summary: e.summary,
      compact: !0
    }
  );
  function k() {
    if (E) {
      F || l?.(e);
      return;
    }
    w(e);
  }
  return /* @__PURE__ */ i(
    "article",
    {
      className: `wb-asset-card ${g ? "is-collection" : ""} ${e.libraryType === "material" ? "is-official" : ""} ${s ? "is-selected" : ""} ${o ? "is-used" : ""} ${v ? "is-trash" : ""}`.trim(),
      children: [
        /* @__PURE__ */ i("div", { className: "wb-asset-card-main", children: [
          /* @__PURE__ */ i("div", { className: "wb-asset-card-preview", children: [
            d,
            T > 1 ? /* @__PURE__ */ i("span", { className: "wb-asset-media-count", children: [
              T,
              " 项"
            ] }) : null,
            e.kind !== "audio" ? /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "wb-asset-card-preview-open",
                disabled: F,
                onClick: k,
                "aria-label": _
              }
            ) : null
          ] }),
          /* @__PURE__ */ n(J, { label: e.name, children: /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "wb-asset-card-copy",
              disabled: F,
              onClick: k,
              children: [
                /* @__PURE__ */ n("strong", { children: e.name }),
                /* @__PURE__ */ n("span", { children: g ? `集合 · ${e.collectionCount} 项素材` : e.libraryType === "material" ? `${e.materialCateName || Re("official", t)} · ${ve(e.kind)}` : `${Re(e.sourceType, t)} · ${ve(e.kind)}` })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ n("span", { className: "wb-asset-card-kind-icon", children: /* @__PURE__ */ n(Pe, { kind: e.kind }) }),
        /* @__PURE__ */ i("div", { className: "wb-asset-card-actions", children: [
          E && !v ? /* @__PURE__ */ n(J, { label: "查看详情", children: /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              disabled: c,
              onClick: (j) => {
                j.stopPropagation(), w(e);
              },
              children: [
                /* @__PURE__ */ n(Nn, { "aria-hidden": "true" }),
                /* @__PURE__ */ n("span", { className: "sr-only", children: "查看详情" })
              ]
            }
          ) }) : null,
          !v && !f && u ? /* @__PURE__ */ n(J, { label: "修改标题", children: /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              disabled: c,
              onClick: () => u(e),
              children: [
                /* @__PURE__ */ n(tt, { "aria-hidden": "true" }),
                /* @__PURE__ */ n("span", { className: "sr-only", children: "修改标题" })
              ]
            }
          ) }) : null,
          v && b ? /* @__PURE__ */ n(J, { label: "恢复资产", children: /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "is-restore",
              disabled: c,
              onClick: () => b(e),
              children: [
                c ? /* @__PURE__ */ n(X, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ n(be, { "aria-hidden": "true" }),
                /* @__PURE__ */ n("span", { className: "sr-only", children: "恢复资产" })
              ]
            }
          ) }) : !f && m ? /* @__PURE__ */ n(J, { label: "移入回收站", children: /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "is-danger",
              disabled: c,
              onClick: () => m(e),
              children: [
                c ? /* @__PURE__ */ n(X, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ n(Tn, { "aria-hidden": "true" }),
                /* @__PURE__ */ n("span", { className: "sr-only", children: "移入回收站" })
              ]
            }
          ) }) : null,
          !g && !v && a && l ? /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: `is-primary ${s ? "is-selected" : ""} ${o ? "is-used" : ""}`.trim(),
              disabled: c || o,
              onClick: k,
              children: [
                /* @__PURE__ */ n(_e, { "aria-hidden": "true" }),
                o ? "已使用" : s ? "已选" : "使用"
              ]
            }
          ) : null
        ] })
      ]
    }
  );
}
function br({ asset: e }) {
  const t = e.collectionPreviews.slice(0, 4);
  return t.length === 0 ? /* @__PURE__ */ i("div", { className: "wb-asset-collection-empty", children: [
    /* @__PURE__ */ n(Pe, { kind: "collection" }),
    /* @__PURE__ */ n("span", { children: e.collectionCount > 0 ? `${e.collectionCount} 项素材` : "空集合" })
  ] }) : /* @__PURE__ */ i("div", { className: `wb-asset-collection-preview has-${t.length}`, children: [
    t.map((r) => /* @__PURE__ */ n("div", { children: /* @__PURE__ */ n(Oe, { kind: r.kind, content: r.content, compact: !0 }) }, r.id)),
    /* @__PURE__ */ i("span", { children: [
      e.collectionCount,
      " 项"
    ] })
  ] });
}
function Jt({
  teamID: e,
  asset: t,
  onClose: r,
  onRenamed: a
}) {
  const [s, o] = y(""), [c, f] = y(!1), [w, u] = y("");
  B(() => {
    t && (o(t.name), f(!1), u(""));
  }, [t]), B(() => {
    if (!t) return;
    const b = (l) => {
      l.key === "Escape" && (l.preventDefault(), l.stopImmediatePropagation(), c || r());
    };
    return window.addEventListener("keydown", b, !0), () => window.removeEventListener("keydown", b, !0);
  }, [t, r, c]);
  async function m(b) {
    b.preventDefault();
    const l = s.trim();
    if (!(!t || !l || c)) {
      f(!0), u("");
      try {
        const v = await Vn({
          teamID: e,
          assetID: t.id,
          name: l
        });
        a(v), r();
      } catch (v) {
        u(G(v, "修改资产标题失败"));
      } finally {
        f(!1);
      }
    }
  }
  return !t || typeof document > "u" ? null : Wt(
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
        children: /* @__PURE__ */ i("form", { className: "wb-asset-form-dialog", onSubmit: m, children: [
          /* @__PURE__ */ i("header", { children: [
            /* @__PURE__ */ i("div", { children: [
              /* @__PURE__ */ n("span", { className: "wb-asset-form-icon", children: /* @__PURE__ */ n(tt, { "aria-hidden": "true" }) }),
              /* @__PURE__ */ i("div", { children: [
                /* @__PURE__ */ n("h2", { children: "修改资产标题" }),
                /* @__PURE__ */ n("p", { children: "只修改资产库中的显示名称。" })
              ] })
            ] }),
            /* @__PURE__ */ n(J, { label: "关闭", children: /* @__PURE__ */ n("button", { type: "button", disabled: c, onClick: r, children: /* @__PURE__ */ n(At, { "aria-hidden": "true" }) }) })
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
function Gt() {
  const e = mr().site.homeMenu;
  return ce(
    () => ({
      labels: {
        project: e.works.name,
        tool: e.function.name,
        dialogue: e.dialogue.name,
        fallback: e.assets.name
      },
      visibility: {
        project: e.works.enabled,
        tool: e.function.enabled,
        dialogue: e.dialogue.enabled
      }
    }),
    [
      e.assets.name,
      e.dialogue.enabled,
      e.dialogue.name,
      e.function.enabled,
      e.function.name,
      e.works.enabled,
      e.works.name
    ]
  );
}
function wr() {
  return Gt().labels;
}
function yr(e, t) {
  if (e === "text")
    return {
      kind: e,
      contentFormat: "markdown",
      value: kr(t)
    };
  const r = ze(t);
  return r ? {
    kind: e,
    contentFormat: "json",
    value: nt(it(r))
  } : {
    kind: e,
    contentFormat: "markdown",
    value: Zt(t) || zt(t)
  };
}
function vr(e, t) {
  return { ...e, value: t };
}
function gr(e) {
  if (e.kind !== "richtext" || e.contentFormat !== "json")
    return e.value;
  const t = ze(rt(e.value));
  return t ? nt(
    st(it(t))
  ) : e.value;
}
function Xt(e) {
  return e.contentFormat === "markdown" ? { format: "markdown", text: e.value } : ze(rt(e.value)) || {
    type: "doc",
    content: []
  };
}
function yt(e) {
  const t = Xt(e);
  if (e.kind !== "richtext" || e.contentFormat !== "json")
    return gt(t);
  const r = ze(t);
  return gt(
    r ? Yt(st(r)) : t
  );
}
function kr(e) {
  return Zt(e) || qn(e) || zt(e);
}
function Zt(e) {
  const t = rt(e);
  return Ot(t) ? String(t.format || "").trim().toLowerCase() !== "markdown" ? "" : String(t.text || t.markdown || "") : typeof t == "string" ? t : "";
}
function st(e) {
  const t = { ...e };
  return e.content && (t.content = e.content.map(st)), (e.type === "editorMediaImage" || e.type === "editorMediaVideo") && !String(e.attrs?.maxWidth || "").trim() && (t.attrs = { ...e.attrs || {}, maxWidth: "100%" }), t;
}
function it(e) {
  const t = { ...e };
  if (!e.content) return t;
  const r = e.type === "doc" ? e.content.filter((a) => !Cr(a)) : e.content;
  if (t.content = r.map(it), e.type === "paragraph")
    for (; t.content.at(-1)?.type === "hardBreak"; )
      t.content.pop();
  return t;
}
function Cr(e) {
  return e.type === "paragraph" && !!e.content?.length && e.content?.every(
    (t) => t.type === "hardBreak" || t.type === "text" && !String(t.text || "").trim()
  );
}
function Yt(e) {
  const t = { type: e.type }, r = vt(e.attrs);
  return r && (t.attrs = r), e.content && (t.content = e.content.map(Yt)), e.marks && (t.marks = e.marks.map((a) => {
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
function gt(e) {
  return nt(Ze(e));
}
function Ze(e) {
  return Array.isArray(e) ? e.map(Ze) : Ot(e) ? Object.fromEntries(
    Object.keys(e).sort().map((t) => [t, Ze(e[t])])
  ) : e;
}
await window.DeverFront?.ensureCompat?.(["@/components/rich-text-editor"]);
const Ye = window.DeverFront?.sdk?.getCompatModule("@/components/rich-text-editor");
if (!Ye || Object.keys(Ye).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/rich-text-editor");
const { RichTextEditor: kt } = Ye;
function Nr({
  kind: e,
  value: t,
  contentFormat: r,
  readonly: a = !1,
  onChange: s
}) {
  const o = ce(
    () => gr({ kind: e, value: t, contentFormat: r }),
    [r, e, t]
  );
  return e === "text" || !kt ? /* @__PURE__ */ n(
    Tr,
    {
      value: t,
      readonly: a,
      onChange: s
    }
  ) : /* @__PURE__ */ n(
    kt,
    {
      value: o,
      onChange: s,
      contentFormat: r,
      placeholder: "编辑内容",
      disabled: a,
      minHeight: 0,
      maxHeight: 2400,
      controlClassName: "wb-asset-rich-content-editor",
      floatingLayerZIndex: Pt
    }
  );
}
function Tr({
  value: e,
  readonly: t,
  onChange: r
}) {
  const a = L(null);
  return _n(() => {
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
function Ir({
  value: e,
  resetKey: t,
  fingerprint: r,
  save: a,
  onError: s,
  autoSave: o = !0,
  debounceMs: c = 1200
}) {
  const [f, w] = y(e), [u, m] = y("saved"), b = L(e), l = L(e), v = L(r), g = L(a), T = L(s), E = L(o), F = L(r(e)), _ = L(0), d = L(0), k = L(null), j = L(null), H = L(async () => !1), O = L(null), M = L(!1), R = L(!0), I = U(() => {
    k.current !== null && (window.clearTimeout(k.current), k.current = null);
  }, []), S = U(
    async (x, V = !1, z) => {
      I();
      const A = d.current;
      for (; R.current && A === d.current; ) {
        if (j.current && (!await j.current || A !== d.current))
          return !1;
        if (!V && x !== void 0 && x !== _.current)
          return !0;
        const te = l.current, re = v.current(te);
        if (re === F.current)
          return M.current = !1, R.current && m("saved"), !0;
        const ae = _.current;
        R.current && m("saving");
        const P = z || g.current, h = P(te).then(() => {
          if (!R.current || A !== d.current)
            return !1;
          F.current = re, M.current = !1, O.current = null;
          const N = v.current(l.current);
          return m(
            N === re ? "saved" : "dirty"
          ), !0;
        }).catch((N) => (R.current && A === d.current && (I(), M.current = !0, O.current = P, m("error"), T.current?.(N)), !1));
        j.current = h;
        const D = await h;
        if (j.current === h && (j.current = null), !D) return !1;
        if (!V && ae !== _.current && k.current === null && !M.current) {
          const N = _.current;
          k.current = window.setTimeout(() => {
            k.current = null, H.current(N);
          }, c);
        }
        if (!V || ae === _.current)
          return !0;
      }
      return !1;
    },
    [I, c]
  ), Y = U(
    (x) => {
      I(), !(!E.current || M.current) && (k.current = window.setTimeout(() => {
        k.current = null, S(x);
      }, c));
    },
    [I, c, S]
  ), W = U(
    (x) => {
      const V = typeof x == "function" ? x(l.current) : x, z = v.current(V);
      if (l.current = V, w(V), _.current += 1, z === F.current) {
        I(), M.current = !1, m("saved");
        return;
      }
      if (M.current) {
        m("error");
        return;
      }
      m("dirty"), Y(_.current);
    },
    [I, Y]
  ), C = U(() => {
    const x = b.current;
    d.current += 1, _.current = 0, l.current = x, F.current = v.current(x), M.current = !1, O.current = null, j.current = null, I(), w(x), m("saved");
  }, [I]), Q = U(() => S(void 0, !0), [S]), K = U(
    (x) => S(void 0, !0, x),
    [S]
  ), Z = U(async () => (M.current = !1, S(void 0, !0, O.current || g.current)), [S]);
  return B(() => {
    b.current = e, v.current = r, g.current = a, T.current = s, E.current = o, H.current = S;
  }, [o, r, s, S, a, e]), B(() => C(), [C, t]), B(() => (R.current = !0, () => {
    R.current = !1, d.current += 1, I();
  }), [I]), {
    draft: f,
    status: u,
    setDraft: W,
    reset: C,
    flush: Q,
    flushWith: K,
    retry: Z,
    hasPendingChanges: u !== "saved"
  };
}
function Dr({
  teamID: e,
  asset: t,
  enabled: r,
  onSaved: a,
  onError: s
}) {
  const o = t?.version || null, c = ce(
    () => yr(
      t?.kind === "richtext" ? "richtext" : "text",
      o?.content
    ),
    [t?.kind, o?.content]
  ), f = L(null), w = U(
    async (l, v) => {
      if (!r || !t?.id || !o?.id)
        throw new Error("当前资产正文不可编辑");
      const g = yt(l), T = v === "create_version" ? Sr(f, o, g) : "", E = await Bn({
        teamID: e,
        assetID: t.id,
        expectedVersionID: o.id,
        expectedUpdatedAt: o.updatedAt || o.createdAt,
        requestID: T,
        saveMode: v,
        content: Xt(l)
      });
      f.current = null, a(E, v);
    },
    [t, r, a, e, o]
  ), u = Ir({
    value: c,
    resetKey: `${t?.id || 0}:${o?.id || 0}:${o?.updatedAt || o?.createdAt || ""}`,
    fingerprint: yt,
    save: (l) => w(l, "overwrite_current"),
    onError: s,
    autoSave: !1
  }), { flushWith: m } = u, b = U(
    () => m((l) => w(l, "create_version")),
    [m, w]
  );
  return {
    ...u,
    saveAsNewVersion: b
  };
}
function Sr(e, t, r) {
  if (e.current?.versionID === t.id && e.current.fingerprint === r)
    return e.current.requestID;
  const a = typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`, s = `manual-edit-${t.id}-${a}`.slice(0, 64);
  return e.current = { versionID: t.id, fingerprint: r, requestID: s }, s;
}
function xr({
  status: e,
  hasPendingChanges: t,
  onReset: r,
  onSaveAsNewVersion: a,
  onSave: s
}) {
  const o = e === "saving", c = o || !t;
  return /* @__PURE__ */ i(ge, { children: [
    /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        disabled: c,
        onClick: r,
        children: [
          /* @__PURE__ */ n(be, { size: 13 }),
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
          /* @__PURE__ */ n(In, { size: 13 }),
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
          o ? /* @__PURE__ */ n(X, { size: 13, className: "wb-detail-spin" }) : /* @__PURE__ */ n(Dn, { size: 13 }),
          /* @__PURE__ */ n("span", { children: o ? "保存中" : "保存" })
        ]
      }
    )
  ] });
}
function Ar({
  teamID: e,
  assetID: t,
  selectable: r = !1,
  onClose: a,
  onSelect: s,
  onContinue: o,
  canContinue: c,
  onAssetChanged: f,
  layer: w = "default"
}) {
  const u = wr(), [m, b] = y(null), [l, v] = y(
    null
  ), [g, T] = y(!0), [E, F] = y(0), [_, d] = y(!1), [k, j] = y(!1), [H, O] = y(""), [M, R] = y(""), I = U(async () => {
    T(!0), O(""), R("");
    try {
      const h = Ct(await Un(e, t));
      b(h), v(h.asset.version);
    } catch (h) {
      O(G(h, "加载资产详情失败"));
    } finally {
      T(!1);
    }
  }, [t, e]);
  B(() => {
    I();
  }, [I]);
  async function S(h) {
    if (!(E || h.id === l?.id) && ae()) {
      if (h.id === m?.asset.versionID && m.asset.version) {
        O(""), v(m.asset.version);
        return;
      }
      F(h.id), O("");
      try {
        v(
          await Yn({ teamID: e, assetID: t, versionID: h.id })
        );
      } catch (D) {
        O(G(D, "加载资产版本失败"));
      } finally {
        F(0);
      }
    }
  }
  async function Y() {
    if (!m || !m.hasMore || E) return;
    const h = Math.floor(m.versions.length / 20) + 1;
    F(-1), R("");
    try {
      const D = await Qn({
        teamID: e,
        assetID: t,
        page: h,
        pageSize: 20
      });
      b(
        (N) => N && {
          ...N,
          versions: Qe([...N.versions, ...D.items]),
          versionTotal: D.total,
          hasMore: D.hasMore
        }
      );
    } catch (D) {
      R(G(D, "加载资产版本失败"));
    } finally {
      F(0);
    }
  }
  async function W() {
    if (!(!m || !l || _)) {
      d(!0), O("");
      try {
        const h = await Zn({
          teamID: e,
          assetID: t,
          versionID: l.id
        }), D = Ct({ ...m, asset: h });
        b(D), v(h.version), f?.(h);
      } catch (h) {
        O(G(h, "设置当前版本失败"));
      } finally {
        d(!1);
      }
    }
  }
  const C = m?.asset, Q = C?.status === "deleted", K = !!(C && l && C.versionID === l.id), Z = ce(
    () => Kn(l?.content),
    [l?.content]
  ), x = ce(
    () => Ft(l?.content, "storyboard"),
    [l?.content]
  ), V = !!(C && l && K && !Q && (C.kind === "text" || C.kind === "richtext") && !Z && !x), z = U(
    (h, D) => {
      O(""), b((N) => {
        if (!N) return N;
        const le = h.version, we = !!(le && N.versions.some((ue) => ue.id === le.id)), se = Qe(
          le ? [le, ...N.versions] : N.versions
        );
        return {
          ...N,
          asset: h,
          versions: se,
          versionTotal: Math.max(
            se.length,
            N.versionTotal + (le && !we ? 1 : 0)
          )
        };
      }), v(h.version), f?.(h), ne.success(
        D === "create_version" ? "已保存为新版本" : "正文已保存"
      );
    },
    [f]
  ), A = Dr({
    teamID: e,
    asset: C,
    enabled: V,
    onSaved: z,
    onError: (h) => O(G(h, "保存资产正文失败"))
  }), te = A.reset, re = A.hasPendingChanges, ae = U(() => !V || !re ? !0 : window.confirm("当前正文尚未保存，确定放弃修改吗？") ? (te(), O(""), !0) : !1, [V, re, te]), P = U(() => {
    k || !ae() || a();
  }, [ae, a, k]);
  return B(() => {
    const h = (D) => {
      D.key !== "Escape" || k || (D.preventDefault(), D.stopImmediatePropagation(), P());
    };
    return window.addEventListener("keydown", h, !0), () => window.removeEventListener("keydown", h, !0);
  }, [k, P]), /* @__PURE__ */ i(
    qt,
    {
      ariaLabel: `${C?.name || "资产"}详情`,
      onRequestClose: P,
      layer: w,
      header: /* @__PURE__ */ n(
        jt,
        {
          icon: C ? /* @__PURE__ */ n(Pe, { kind: C.kind }) : /* @__PURE__ */ n(Fe, { size: 16 }),
          title: C?.name || "资产详情",
          subtitle: C ? `${Lr(C, u)} · ${ve(C.kind)} · ${Xn(C.role)}` : "",
          versionSelect: m && C && l ? /* @__PURE__ */ n(
            Gn,
            {
              options: m.versions.map((h) => ({
                id: h.id,
                version: h.version,
                updatedAt: h.updatedAt || h.createdAt,
                value: h
              })),
              currentVersionId: C.versionID,
              selectedVersionId: l.id,
              total: m.versionTotal,
              hasMore: m.hasMore,
              loading: E > 0,
              loadingMore: E === -1,
              error: M,
              disabled: _ || A.status === "saving",
              onSelect: (h) => {
                S(h);
              },
              onLoadMore: () => {
                Y();
              },
              onRetry: () => {
                Y();
              }
            }
          ) : void 0,
          state: Q ? /* @__PURE__ */ n("span", { className: "wb-detail-state", children: "回收站" }) : E > 0 ? /* @__PURE__ */ i("span", { className: "wb-detail-state is-saving", children: [
            /* @__PURE__ */ n(X, { size: 12, className: "wb-detail-spin" }),
            "读取中"
          ] }) : V ? A.status === "error" ? /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "wb-detail-state is-error",
              onClick: () => {
                A.retry();
              },
              children: [
                /* @__PURE__ */ n(be, { size: 12 }),
                "保存失败"
              ]
            }
          ) : /* @__PURE__ */ i("span", { className: `wb-detail-state is-${A.status}`, children: [
            A.status === "saving" ? /* @__PURE__ */ n(X, { size: 12, className: "wb-detail-spin" }) : null,
            Rr(A.status)
          ] }) : /* @__PURE__ */ n("span", { className: "wb-detail-state", children: "只读预览" }),
          updatedAt: Vt(
            l?.updatedAt || l?.createdAt
          ),
          actions: C && l && !Q ? /* @__PURE__ */ i(ge, { children: [
            /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                className: "wb-detail-command",
                onClick: () => j(!0),
                children: [
                  /* @__PURE__ */ n(tt, { size: 13 }),
                  /* @__PURE__ */ n("span", { children: "修改标题" })
                ]
              }
            ),
            V ? /* @__PURE__ */ n(
              xr,
              {
                status: A.status,
                hasPendingChanges: A.hasPendingChanges,
                onReset: () => {
                  A.reset(), O("");
                },
                onSaveAsNewVersion: () => {
                  A.saveAsNewVersion();
                },
                onSave: () => {
                  A.flush();
                }
              }
            ) : null,
            K ? /* @__PURE__ */ n(
              Er,
              {
                asset: C,
                selectable: r,
                onSelect: s,
                onContinue: o,
                canContinue: c
              }
            ) : /* @__PURE__ */ n(
              $r,
              {
                currentVersion: C.version,
                loading: !!E,
                saving: _,
                onReturn: (h) => {
                  S(h);
                },
                onMakeCurrent: () => {
                  W();
                }
              }
            )
          ] }) : void 0,
          onClose: P
        }
      ),
      children: [
        /* @__PURE__ */ n("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ n("div", { className: "wb-detail-scroll", children: g ? /* @__PURE__ */ i("div", { className: "wb-detail-content-state", children: [
          /* @__PURE__ */ n(X, { size: 18, className: "wb-detail-spin" }),
          /* @__PURE__ */ n("span", { children: "正在读取资产" })
        ] }) : !C || !l ? /* @__PURE__ */ i("div", { className: "wb-detail-content-state is-error", children: [
          /* @__PURE__ */ n("span", { children: H || "资产不存在" }),
          /* @__PURE__ */ i("button", { type: "button", onClick: () => {
            I();
          }, children: [
            /* @__PURE__ */ n(be, { size: 13 }),
            "重试"
          ] })
        ] }) : V ? /* @__PURE__ */ i("div", { className: `wb-detail-editable-content is-${C.kind}`, children: [
          H ? /* @__PURE__ */ n("p", { className: "wb-detail-error-banner", children: H }) : null,
          /* @__PURE__ */ n(
            Nr,
            {
              kind: A.draft.kind,
              value: A.draft.value,
              contentFormat: A.draft.contentFormat,
              onChange: (h) => A.setDraft(
                (D) => vr(D, h)
              )
            }
          )
        ] }) : /* @__PURE__ */ i("div", { className: `wb-detail-readonly-content is-${C.kind}`, children: [
          H ? /* @__PURE__ */ n("p", { className: "wb-detail-error-banner", children: H }) : null,
          Z ? /* @__PURE__ */ n(Wn, { grid: Z, variant: "detail" }) : x ? /* @__PURE__ */ n(
            Hn,
            {
              output: l.content,
              fallback: l.summary || C.summary,
              emptyText: "该版本暂无可预览内容",
              className: "wb-asset-preview-content",
              markdownClassName: "wb-asset-detail-prose",
              richClassName: "wb-asset-detail-prose",
              mediaLayout: "detail"
            }
          ) : /* @__PURE__ */ n(
            Oe,
            {
              kind: C.kind,
              content: l.content,
              summary: l.summary || C.summary,
              prompt: Jn(l)
            },
            l.id
          )
        ] }) }) }),
        /* @__PURE__ */ n(
          Jt,
          {
            teamID: e,
            asset: k && C || null,
            onClose: () => j(!1),
            onRenamed: (h) => {
              b(
                (D) => D && { ...D, asset: h }
              ), f?.(h);
            }
          }
        )
      ]
    }
  );
}
function $r({
  currentVersion: e,
  loading: t,
  saving: r,
  onReturn: a,
  onMakeCurrent: s
}) {
  const o = t || r;
  return /* @__PURE__ */ i(ge, { children: [
    e ? /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        disabled: o,
        onClick: () => a(e),
        children: [
          /* @__PURE__ */ n(be, { size: 13 }),
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
          r ? /* @__PURE__ */ n(X, { size: 13, className: "wb-detail-spin" }) : /* @__PURE__ */ n(_e, { size: 13 }),
          /* @__PURE__ */ n("span", { children: r ? "设置中" : "设为当前版本" })
        ]
      }
    )
  ] });
}
function Er({
  asset: e,
  selectable: t,
  onSelect: r,
  onContinue: a,
  canContinue: s
}) {
  return /* @__PURE__ */ i(ge, { children: [
    a && Mr(e) && (s?.(e) ?? !0) ? /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        onClick: () => a(e),
        children: [
          e.sourceType === "dialogue" ? /* @__PURE__ */ n(Sn, { size: 14 }) : /* @__PURE__ */ n(be, { size: 14 }),
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
          /* @__PURE__ */ n(_e, { size: 14 }),
          /* @__PURE__ */ n("span", { children: "使用" })
        ]
      }
    ) : null
  ] });
}
function Ct(e) {
  const t = Qe(
    e.asset.version ? [e.asset.version, ...e.versions] : e.versions
  );
  return {
    ...e,
    versions: t,
    versionTotal: Math.max(e.versionTotal, t.length)
  };
}
function Qe(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((r) => t.has(r.id) ? !1 : (t.add(r.id), !0));
}
function Rr(e) {
  return e === "dirty" ? "未保存" : e === "saving" ? "保存中" : e === "error" ? "保存失败" : "已保存";
}
function Lr(e, t) {
  const r = Re(e.sourceType, t);
  return e.sourceName && e.sourceName !== r ? `${r} / ${e.sourceName}` : r;
}
function Mr(e) {
  return e.role === "material" && (e.sourceType === "tool" || e.sourceType === "dialogue");
}
function Fr({
  teamID: e,
  material: t,
  selectable: r = !1,
  layer: a = "default",
  onClose: s,
  onSelect: o
}) {
  const [c, f] = y(t), [w, u] = y(!0), [m, b] = y(""), l = U(async () => {
    u(!0), b("");
    try {
      f(await er(e, t.id));
    } catch (g) {
      b(G(g, "加载官方素材详情失败"));
    } finally {
      u(!1);
    }
  }, [t.id, e]);
  B(() => {
    l();
  }, [l]), B(() => {
    const g = (T) => {
      T.key === "Escape" && (T.preventDefault(), T.stopImmediatePropagation(), s());
    };
    return window.addEventListener("keydown", g, !0), () => window.removeEventListener("keydown", g, !0);
  }, [s]);
  const v = tr(c.version?.content, c.kind);
  return /* @__PURE__ */ n(
    qt,
    {
      ariaLabel: `${c.name}详情`,
      onRequestClose: s,
      layer: a,
      header: /* @__PURE__ */ n(
        jt,
        {
          icon: c ? /* @__PURE__ */ n(Pe, { kind: c.kind }) : /* @__PURE__ */ n(Fe, { size: 16 }),
          title: c.name || "官方素材详情",
          subtitle: `${Re("official")} · ${ve(c.kind)}${c.materialCateName ? ` · ${c.materialCateName}` : ""}`,
          state: /* @__PURE__ */ n("span", { className: "wb-detail-state", children: "官方只读" }),
          updatedAt: Vt(c.createdAt),
          downloadUrl: v || void 0,
          actions: r && o && !w && !m ? /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "wb-detail-command is-primary",
              onClick: () => o(c),
              children: [
                /* @__PURE__ */ n(_e, { size: 14 }),
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
      ] }) : m ? /* @__PURE__ */ i("div", { className: "wb-detail-content-state is-error", children: [
        /* @__PURE__ */ n("span", { children: m }),
        /* @__PURE__ */ i("button", { type: "button", onClick: () => {
          l();
        }, children: [
          /* @__PURE__ */ n(be, { size: 13 }),
          "重试"
        ] })
      ] }) : /* @__PURE__ */ n("div", { className: `wb-detail-readonly-content is-${c.kind}`, children: /* @__PURE__ */ n(
        Oe,
        {
          kind: c.kind,
          content: c.version?.content,
          summary: c.summary
        }
      ) }) }) })
    }
  );
}
const _r = "shemic:web-content-import";
function he(e) {
  return !!(e && (e.status === "pending" || e.status === "discovering" || e.status === "running"));
}
function zr(e, t) {
  return `${_r}:${e}:${t}`;
}
function Or(e) {
  if (typeof window > "u") return 0;
  try {
    const t = Number(window.localStorage.getItem(e) || 0);
    return Number.isFinite(t) && t > 0 ? t : 0;
  } catch {
    return 0;
  }
}
function We(e, t) {
  if (!(typeof window > "u" || t <= 0))
    try {
      window.localStorage.setItem(e, String(t));
    } catch {
    }
}
function He(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.removeItem(e);
    } catch {
    }
}
function Pr() {
  return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : `import-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
function jr({
  disabled: e,
  task: t,
  onClick: r
}) {
  const a = he(t), s = a ? Math.min(100, Math.max(0, t.progress)) : 0, o = a ? `导入 ${s}%` : "导入";
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
            a ? /* @__PURE__ */ n(X, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ n($t, { "aria-hidden": "true" }),
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
const Me = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!Me || Object.keys(Me).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const ot = Me.joinSiteApi, ct = Me.request;
async function Vr(e) {
  const t = await ct(
    ot("workbench/web_content_import"),
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
  return lt(
    at(t, "创建网页内容导入任务失败")
  );
}
async function Nt(e) {
  const t = await ct(
    ot("workbench/web_content_import_task"),
    "get",
    {
      team_id: e.teamID,
      project_id: e.projectID || void 0,
      canvas_id: e.canvasID || void 0,
      task_id: e.taskID
    },
    { reportError: !1 }
  );
  return lt(
    at(t, "加载网页内容导入任务失败")
  );
}
async function Tt(e) {
  const t = await ct(
    ot("workbench/web_content_import_tasks"),
    "get",
    {
      team_id: e.teamID,
      project_id: e.projectID || void 0,
      canvas_id: e.canvasID || void 0
    },
    { reportError: !1 }
  ), r = at(t, "加载网页内容导入任务失败");
  return Le(r.items).map(lt).filter((a) => a.id > 0);
}
function lt(e) {
  const t = Ht(e), r = Le(t.assets).map(Bt).filter((a) => a.id > 0);
  return {
    id: Xe(t.id),
    canvasID: Xe(t.canvas_id),
    source: ee(t.source),
    status: Ur(t.status),
    stageMessage: ee(t.stage_message),
    progress: Math.min(100, Te(t.progress)),
    itemTotal: Te(t.item_total),
    successCount: Te(t.success_count),
    skippedCount: Te(t.skipped_count),
    failedCount: Te(t.failed_count),
    errorMessage: ee(t.error_message),
    assets: r,
    warnings: Br(t.warnings),
    items: Le(t.items).map(qr).filter((a) => a.id > 0)
  };
}
function qr(e) {
  const t = Ht(e);
  return {
    id: Xe(t.id),
    platform: ee(t.platform),
    sourceURL: ee(t.source_url),
    title: ee(t.title),
    status: ee(t.status),
    stageMessage: ee(t.stage_message),
    errorMessage: ee(t.error_message)
  };
}
function Br(e) {
  return Le(e).map(ee).filter(Boolean);
}
function Ur(e) {
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
function Kr({
  open: e,
  teamID: t,
  projectID: r,
  canvasID: a,
  onClose: s,
  onImported: o,
  onTaskChange: c
}) {
  const [f, w] = y(""), [u, m] = y(null), [b, l] = y(!1), [v, g] = y(""), T = L(e), E = L(s), F = L(o), _ = L(/* @__PURE__ */ new Set()), d = L(null), k = `${zr(t, r)}:${a}`, j = he(u) && u?.id || 0;
  B(() => {
    T.current = e, E.current = s, F.current = o;
  }, [s, o, e]), B(() => {
    c?.(u);
  }, [c, u]), B(() => {
    let M = !1;
    _.current.clear(), m(null), w(""), g(""), l(!1), d.current = null;
    async function R() {
      try {
        const I = Or(k);
        let S = null;
        if (I > 0)
          try {
            S = await Nt({
              teamID: t,
              projectID: r,
              canvasID: a,
              taskID: I
            });
          } catch {
            He(k);
          }
        if (S || (S = (await Tt({
          teamID: t,
          projectID: r,
          canvasID: a
        }))[0] || null), M || !S) return;
        w(S.source), m(S), We(k, S.id);
      } catch {
      }
    }
    return R(), () => {
      M = !0;
    };
  }, [a, r, k, t]), B(() => {
    if (j <= 0) return;
    let M = !1, R = 0;
    async function I() {
      try {
        const S = await Nt({
          teamID: t,
          projectID: r,
          canvasID: a,
          taskID: j
        });
        if (M || (m(S), g(""), !he(S))) return;
        R = window.setTimeout(I, 1200);
      } catch (S) {
        if (M) return;
        T.current && g(G(S, "刷新导入进度失败")), R = window.setTimeout(I, 2500);
      }
    }
    return R = window.setTimeout(I, 700), () => {
      M = !0, window.clearTimeout(R);
    };
  }, [j, a, r, t]), B(() => {
    if (!(!u || he(u))) {
      if (He(k), u.status === "failed") {
        g(u.errorMessage || "网页内容导入失败");
        return;
      }
      if (!_.current.has(u.id)) {
        if (u.assets.length === 0) {
          g(u.errorMessage || "导入完成，但没有生成可用素材");
          return;
        }
        _.current.add(u.id), d.current = null, F.current(u.assets, u.warnings, u), m(null), w(""), T.current && E.current();
      }
    }
  }, [k, u]);
  const H = U(async () => {
    const M = f.trim();
    if (!M || b || he(u)) return;
    l(!0), g("");
    const R = d.current?.source === M ? d.current : { source: M, requestID: Pr() };
    d.current = R;
    try {
      const I = await Vr({
        teamID: t,
        projectID: r,
        canvasID: a,
        requestID: R.requestID,
        source: M
      });
      d.current = null, m(I), We(k, I.id);
    } catch (I) {
      try {
        const Y = (await Tt({
          teamID: t,
          projectID: r,
          canvasID: a
        })).find((W) => W.source === M);
        if (Y) {
          d.current = null, m(Y), We(k, Y.id);
          return;
        }
      } catch {
      }
      g(G(I, "创建网页内容导入任务失败"));
    } finally {
      l(!1);
    }
  }, [a, r, f, k, b, u, t]), O = U(() => {
    he(u) || (He(k), d.current = null, m(null), g(""));
  }, [k, u]);
  return {
    source: f,
    setSource: w,
    task: u,
    submitting: b,
    active: he(u),
    error: v,
    submit: H,
    reset: O
  };
}
function Wr({
  open: e,
  teamID: t,
  projectID: r = 0,
  canvasID: a = 0,
  platforms: s,
  maxItems: o,
  onClose: c,
  onImported: f,
  onTaskChange: w
}) {
  const u = Kr({
    open: e,
    teamID: t,
    projectID: r,
    canvasID: a,
    onClose: c,
    onImported: f,
    onTaskChange: w
  });
  B(() => {
    if (!e) return;
    const b = (l) => {
      l.key === "Escape" && (l.preventDefault(), l.stopImmediatePropagation(), c());
    };
    return window.addEventListener("keydown", b, !0), () => window.removeEventListener("keydown", b, !0);
  }, [c, e]);
  function m(b) {
    b.preventDefault(), u.submit();
  }
  return !e || typeof document > "u" ? null : Wt(
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
            onSubmit: m,
            children: [
              /* @__PURE__ */ i("header", { children: [
                /* @__PURE__ */ i("div", { children: [
                  /* @__PURE__ */ n("span", { className: "wb-asset-form-icon", children: /* @__PURE__ */ n($t, { "aria-hidden": "true" }) }),
                  /* @__PURE__ */ i("div", { children: [
                    /* @__PURE__ */ n("h2", { children: "导入网络内容" }),
                    /* @__PURE__ */ i("p", { children: [
                      "支持：",
                      s.map((b) => b.name).join("、") || "已配置的平台"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ n(J, { label: "关闭", children: /* @__PURE__ */ i("button", { type: "button", onClick: c, children: [
                  /* @__PURE__ */ n(At, { "aria-hidden": "true" }),
                  /* @__PURE__ */ n("span", { className: "sr-only", children: "关闭" })
                ] }) })
              ] }),
              u.task ? /* @__PURE__ */ n(
                Hr,
                {
                  task: u.task,
                  active: u.active,
                  platforms: s
                }
              ) : /* @__PURE__ */ i("label", { children: [
                /* @__PURE__ */ n("span", { children: "链接或分享内容" }),
                /* @__PURE__ */ n(
                  "textarea",
                  {
                    autoFocus: !0,
                    value: u.source,
                    maxLength: 8192,
                    disabled: u.submitting,
                    placeholder: "粘贴内容链接或分享文本，可一次粘贴多条",
                    onChange: (b) => u.setSource(b.target.value)
                  }
                ),
                /* @__PURE__ */ i("small", { className: "wb-asset-import-help", children: [
                  "自动识别对应平台，一次最多 ",
                  o,
                  " 条，可混合粘贴"
                ] })
              ] }),
              u.error ? /* @__PURE__ */ i("p", { className: "wb-asset-form-error wb-asset-import-error", children: [
                /* @__PURE__ */ n(Et, { "aria-hidden": "true" }),
                /* @__PURE__ */ n("span", { children: u.error })
              ] }) : null,
              /* @__PURE__ */ i("footer", { children: [
                /* @__PURE__ */ n("button", { type: "button", onClick: c, children: "关闭" }),
                u.task?.status === "failed" ? /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "is-primary",
                    onClick: u.reset,
                    children: "重新导入"
                  }
                ) : u.active ? null : /* @__PURE__ */ i(
                  "button",
                  {
                    type: "submit",
                    className: "is-primary",
                    disabled: u.submitting || !u.source.trim(),
                    children: [
                      u.submitting ? /* @__PURE__ */ n(X, { className: "is-spinning" }) : null,
                      u.submitting ? "提交中" : "导入"
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
function Hr({
  task: e,
  active: t,
  platforms: r
}) {
  const a = Math.min(100, Math.max(0, e.progress)), s = new Map(
    r.map((f) => [f.key, f.name])
  ), o = e.successCount + e.skippedCount, c = e.failedCount ? `已导入 ${o} 项，${e.failedCount} 项失败` : t ? e.stageMessage || "正在导入" : `已导入 ${o} 项`;
  return /* @__PURE__ */ i("section", { className: "wb-asset-import-status", "aria-live": "polite", children: [
    /* @__PURE__ */ i("div", { className: "wb-asset-import-status-head", children: [
      t ? /* @__PURE__ */ n(X, { className: "is-spinning", "aria-hidden": "true" }) : e.status === "failed" ? /* @__PURE__ */ n(Et, { "aria-hidden": "true" }) : /* @__PURE__ */ n(xn, { "aria-hidden": "true" }),
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
    /* @__PURE__ */ n("div", { className: "wb-asset-import-items", children: e.items.map((f, w) => /* @__PURE__ */ i(
      "div",
      {
        className: f.status === "failed" ? "is-failed" : "",
        children: [
          /* @__PURE__ */ n("b", { children: s.get(f.platform) || f.platform }),
          /* @__PURE__ */ n("span", { title: f.sourceURL, children: f.title || f.sourceURL || `第 ${w + 1} 条内容` }),
          /* @__PURE__ */ n("em", { title: It(f), children: It(f) })
        ]
      },
      f.id || `${f.platform}-${w}`
    )) })
  ] });
}
function It(e) {
  return e.status === "failed" ? e.errorMessage || "导入失败" : e.status === "success" ? "已导入" : e.status === "skipped" ? "已存在" : e.stageMessage || "等待导入";
}
const Jr = [
  { key: "", label: "全部" },
  ...rr
], Dt = [
  { key: "", label: "全部" },
  ...Ut
];
function Gr({
  filters: e,
  options: t,
  scopeProjectID: r = 0,
  sourceLabels: a = {},
  sourceVisibility: s = {},
  allowedKinds: o = [],
  includeOfficial: c = !0,
  view: f,
  collectionName: w,
  onCollectionBack: u,
  onChange: m,
  onViewChange: b
}) {
  const l = [
    { key: "", label: "全部" },
    ...nr.filter(
      (d) => s[d.key] !== !1 && (d.key !== "official" || c && t.materialLibrary.enabled && !!Ge(t.materialLibrary, o))
    ).map((d) => ({
      ...d,
      label: a[d.key] || d.label
    }))
  ], v = t.assetCates.length > 0, g = r || e.projectID, T = t.canvases.filter(
    (d) => (!g || d.projectID === g) && (!e.assetCateID || d.assetCateID === e.assetCateID)
  ), E = e.sourceType === "official" ? t.materialLibrary.kinds.filter(
    (d) => o.length === 0 || o.includes(d.assetKind)
  ).map((d) => ({ key: d.assetKind, label: d.name })) : o.length > 0 ? Dt.filter(
    (d) => d.key && o.includes(d.key)
  ) : Dt, F = Kt(
    t.materialLibrary,
    e.kind
  );
  function _(d) {
    const k = d === "project" ? r : 0, j = d === "official" ? Ge(t.materialLibrary, o) : "", H = d === "official" ? j : e.sourceType === "official" ? o.length === 1 ? o[0] : "" : e.kind;
    m({
      ...e,
      sourceType: d,
      sourceID: k,
      projectID: k,
      assetCateID: 0,
      canvasID: d === "project" ? e.canvasID : 0,
      materialCateID: 0,
      nodeKey: "",
      role: "",
      kind: H
    });
  }
  return /* @__PURE__ */ i("div", { className: "wb-asset-filters", children: [
    w && u ? /* @__PURE__ */ n(Ie, { label: "集合", children: /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: "wb-asset-collection-back",
        onClick: u,
        children: [
          /* @__PURE__ */ n(An, { "aria-hidden": "true" }),
          /* @__PURE__ */ n(xt, { "aria-hidden": "true" }),
          /* @__PURE__ */ n("span", { children: w })
        ]
      }
    ) }) : /* @__PURE__ */ i(Ie, { label: "来源", children: [
      /* @__PURE__ */ n(
        Ee,
        {
          options: l,
          value: e.sourceType,
          onChange: _
        }
      ),
      e.sourceType === "project" ? /* @__PURE__ */ i(ge, { children: [
        r > 0 ? null : /* @__PURE__ */ n(
          De,
          {
            label: a.project || "创作",
            value: e.projectID,
            options: t.projects,
            onChange: (d) => m({
              ...e,
              projectID: d,
              sourceID: d,
              canvasID: 0,
              assetCateID: 0,
              nodeKey: ""
            })
          }
        ),
        v ? /* @__PURE__ */ n(
          De,
          {
            label: "资产分类",
            value: e.assetCateID,
            options: t.assetCates,
            onChange: (d) => m({
              ...e,
              assetCateID: d,
              canvasID: 0,
              nodeKey: ""
            })
          }
        ) : null
      ] }) : null,
      e.sourceType === "project" && g > 0 && T.length > 1 ? /* @__PURE__ */ n(
        De,
        {
          label: "画布",
          value: e.canvasID,
          options: T,
          onChange: (d) => m({ ...e, canvasID: d })
        }
      ) : null,
      e.sourceType === "tool" ? /* @__PURE__ */ n(
        De,
        {
          label: a.tool || "工具",
          value: e.sourceID,
          options: t.tools,
          onChange: (d) => m({ ...e, sourceID: d })
        }
      ) : null,
      e.sourceType === "dialogue" ? /* @__PURE__ */ n(
        De,
        {
          label: "角色",
          value: e.sourceID,
          options: t.dialogues,
          onChange: (d) => m({ ...e, sourceID: d })
        }
      ) : null
    ] }),
    !w && e.sourceType === "project" && v ? /* @__PURE__ */ n(Ie, { label: "资产", children: /* @__PURE__ */ n(
      Ee,
      {
        options: Jr,
        value: e.role,
        onChange: (d) => m({ ...e, role: d })
      }
    ) }) : null,
    /* @__PURE__ */ n(
      Ie,
      {
        label: "类型",
        trailing: e.sourceType === "official" ? void 0 : /* @__PURE__ */ n(Xr, { view: f, onChange: b }),
        children: /* @__PURE__ */ n(
          Ee,
          {
            options: E,
            value: e.kind,
            onChange: (d) => m({
              ...e,
              kind: d,
              materialCateID: e.sourceType === "official" ? 0 : e.materialCateID
            })
          }
        )
      }
    ),
    e.sourceType === "official" && F.length > 0 ? /* @__PURE__ */ n(Ie, { label: "分类", children: /* @__PURE__ */ n(
      Ee,
      {
        options: [
          { key: 0, label: "全部" },
          ...F.map((d) => ({
            key: d.id,
            label: d.name
          }))
        ],
        value: e.materialCateID,
        onChange: (d) => m({ ...e, materialCateID: d })
      }
    ) }) : null
  ] });
}
function Ie({
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
function Xr({
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
          /* @__PURE__ */ n($n, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ n(Rt, { "aria-hidden": "true" }),
          /* @__PURE__ */ n("span", { children: "回收站" })
        ]
      }
    )
  ] });
}
function Ee({
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
function De({
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
function Zr({
  uploading: e,
  progress: t,
  onClick: r
}) {
  const a = Yr(e, t), s = e && t && (t.phase !== "preparing" || t.percent > 0) ? t.percent : null;
  return /* @__PURE__ */ n(J, { label: a, children: /* @__PURE__ */ i(
    "button",
    {
      type: "button",
      className: "wb-asset-local-upload",
      disabled: e,
      "aria-busy": e,
      onClick: r,
      children: [
        e ? /* @__PURE__ */ n(X, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ n(En, { "aria-hidden": "true" }),
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
function Yr(e, t) {
  return e ? t ? t.phase === "preparing" ? t.percent > 0 ? `上传中 ${t.percent}%` : "上传中" : t.phase === "saving" ? "处理中" : `上传中 ${t.percent}%` : "上传中" : "上传";
}
const Se = {
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
const et = window.DeverFront?.sdk?.getCompatModule("@/components/confirm-dialog");
if (!et || Object.keys(et).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/confirm-dialog");
const Qr = et.ConfirmDialog, St = {
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
}, fe = {
  items: [],
  page: 1,
  pageSize: 24,
  total: 0,
  hasMore: !1
};
function ea({
  teamID: e,
  scopeProjectID: t = 0,
  scopeCanvasID: r = 0,
  initialFilters: a,
  selectable: s = !1,
  excludeCollections: o = !1,
  selectedAssetIDs: c,
  selectedAssetKeys: f,
  usedAssetIDs: w,
  usedAssetKeys: u,
  includeOfficial: m = !0,
  allowedKinds: b,
  onSelect: l,
  onContinue: v,
  canContinue: g,
  onAssetChanged: T,
  onAssetRemoved: E,
  onLocalUpload: F,
  uploadAccept: _,
  headerAction: d,
  reloadSignal: k = 0,
  catalogOptions: j,
  contentMode: H = "preview",
  detailLayer: O = "default",
  className: M = ""
}) {
  const R = pr(), { labels: I, visibility: S } = Gt(), Y = JSON.stringify(b || []), W = ce(
    () => na(b),
    [Y]
  ), C = JSON.stringify({ initialFilters: a, normalizedAllowedKinds: W }), Q = ce(
    () => ta(a, W),
    [C]
  ), [K, Z] = y(Q), [x, V] = y(
    null
  ), [z, A] = y("assets"), [te, re] = y(St), ae = ar(
    te.webContentImportEnabled,
    W
  ), [P, h] = y(fe), [D, N] = y(null), [le, we] = y(null), [se, ue] = y(null), [ye, ke] = y(0), [Ce, ut] = y(!0), [je, Ve] = y(!1), [Qt, xe] = y(null), [en, qe] = y(!1), [tn, dt] = y(
    null
  ), [nn, mt] = y(!0), [pt, ie] = y(""), [rn, an] = y(0), oe = L(0), ft = L(null), de = L(Q), me = L("assets"), sn = JSON.stringify({
    selectedAssetIDs: c,
    selectedAssetKeys: f
  }), on = ce(
    () => /* @__PURE__ */ new Set([
      ...f || [],
      ...(c || []).map((p) => `asset:${p}`)
    ]),
    [sn]
  ), cn = JSON.stringify({ usedAssetIDs: w, usedAssetKeys: u }), ln = ce(
    () => /* @__PURE__ */ new Set([
      ...u || [],
      ...(w || []).map((p) => `asset:${p}`)
    ]),
    [cn]
  );
  B(() => {
    oe.current += 1, Z(Q), de.current = Q, V(null), A("assets"), me.current = "assets", re(St), h(fe), N(null), we(null), ue(null), ke(0), Ve(!1), xe(null), qe(!1), dt(null), ie("");
  }, [R, Q, t, e]), B(() => {
    let p = !0;
    return mt(!0), sr(e, j, R).then(($) => {
      p && (re($), Z((q) => {
        const pe = ra(
          q,
          $,
          W,
          m
        );
        return x || (de.current = pe), pe;
      }));
    }).catch(($) => {
      p && ie(G($, "加载资产筛选项失败"));
    }).finally(() => {
      p && mt(!1);
    }), () => {
      p = !1;
    };
  }, [
    j,
    m,
    W,
    R,
    e
  ]);
  const Ae = U(
    async (p) => {
      const $ = ++oe.current;
      ut(!0), ie("");
      try {
        const q = await ir({
          teamID: e,
          scopeProjectID: t,
          filters: K,
          view: z,
          contentMode: H,
          page: p,
          pageSize: 24,
          collectionID: x?.id,
          excludeCollections: o,
          requestScopeKey: R
        });
        $ === oe.current && h(q);
      } catch (q) {
        $ === oe.current && ie(G(q, "加载资产失败"));
      } finally {
        $ === oe.current && ut(!1);
      }
    },
    [
      x?.id,
      H,
      o,
      K,
      R,
      t,
      e,
      z
    ]
  );
  B(() => {
    Ae(1);
  }, [Ae, k, rn]);
  function un(p) {
    p.sourceType === "official" && z !== "assets" && (A("assets"), me.current = "assets"), Z(p), x || (de.current = p), h(($) => ({ ...$, page: 1 }));
  }
  function Ne() {
    an((p) => p + 1);
  }
  function dn(p) {
    if (p.kind !== "collection") {
      N(p);
      return;
    }
    de.current = K, me.current = z, V(p), Z({
      ...Se,
      kind: K.kind === "collection" ? W.length === 1 ? W[0] : "" : K.kind
    }), h(fe), N(null), ie("");
  }
  function mn() {
    oe.current += 1, V(null), Z(de.current), A(me.current), h(fe), N(null), ie("");
  }
  function pn(p) {
    p === z || ye || (oe.current += 1, A(p), x || (me.current = p), h(fe), N(null), we(null), ue(null), ie(""));
  }
  async function fn() {
    if (!se || ye) return;
    const p = se.id;
    ke(p);
    try {
      await lr({ teamID: e, assetID: p }), ue(null), D?.libraryType === "asset" && D.id === p && N(null), E?.(p), ne.success("资产已移入回收站"), Ne();
    } catch ($) {
      ne.error(G($, "删除资产失败"));
    } finally {
      ke(0);
    }
  }
  async function hn(p) {
    if (!ye) {
      ke(p.id);
      try {
        const $ = await cr({ teamID: e, assetID: p.id });
        T?.($), ne.success("资产已恢复"), Ne();
      } catch ($) {
        ne.error(G($, "恢复资产失败"));
      } finally {
        ke(0);
      }
    }
  }
  async function bn(p) {
    const $ = Array.from(p.target.files || []);
    if (p.target.value = "", !(!F || $.length === 0 || je)) {
      Ve(!0), xe(null);
      try {
        const q = await F($, {
          onProgress: xe
        });
        if (q.length === 0)
          throw new Error("上传完成，但没有生成可用资产");
        q.forEach(($e) => T?.($e));
        const pe = {
          ...Se,
          sourceType: "upload",
          canvasID: K.canvasID || r,
          kind: W.length === 1 ? W[0] : ""
        };
        oe.current += 1, V(null), A("assets"), me.current = "assets", Z(pe), de.current = pe, h(fe), N(null), ie(""), ne.success(`已上传 ${q.length} 项资产`);
      } catch (q) {
        ne.error(G(q, "上传资产失败"));
      } finally {
        Ve(!1), xe(null);
      }
    }
  }
  function wn(p, $, q) {
    p.forEach((Ue) => T?.(Ue));
    const pe = new Set(p.map((Ue) => Ue.kind)), $e = {
      ...Se,
      sourceType: "import",
      canvasID: K.canvasID || r,
      kind: pe.size === 1 && p[0]?.kind || ""
    };
    oe.current += 1, V(null), A("assets"), me.current = "assets", Z($e), de.current = $e, h(fe), N(null), ie("");
    const Be = q.successCount + q.skippedCount;
    if (q.failedCount > 0) {
      ne.warning(`已导入 ${Be} 项，${q.failedCount} 项失败`);
      return;
    }
    if ($.length > 0) {
      ne.warning(`已导入 ${Be} 项，部分媒体保留原地址`);
      return;
    }
    ne.success(`已导入 ${Be} 项内容`);
  }
  return /* @__PURE__ */ i("section", { className: `wb-asset-browser ${M}`.trim(), children: [
    /* @__PURE__ */ i("header", { className: "wb-asset-browser-head", children: [
      /* @__PURE__ */ n(
        Gr,
        {
          filters: K,
          options: te,
          scopeProjectID: t,
          sourceLabels: I,
          sourceVisibility: S,
          allowedKinds: W,
          includeOfficial: m,
          view: z,
          collectionName: x?.name,
          onCollectionBack: x ? mn : void 0,
          onChange: un,
          onViewChange: pn
        }
      ),
      /* @__PURE__ */ i("div", { className: "wb-asset-browser-actions", children: [
        /* @__PURE__ */ n("span", { children: Ce ? "正在加载" : `${P.total} 项` }),
        /* @__PURE__ */ n(
          J,
          {
            label: K.sourceType === "official" ? "刷新官方素材" : "刷新资产",
            children: /* @__PURE__ */ i("button", { type: "button", onClick: Ne, children: [
              /* @__PURE__ */ n(Rn, { className: Ce ? "is-spinning" : "" }),
              /* @__PURE__ */ n("span", { className: "sr-only", children: K.sourceType === "official" ? "刷新官方素材" : "刷新资产" })
            ] })
          }
        ),
        !x && F ? /* @__PURE__ */ i(ge, { children: [
          /* @__PURE__ */ n(
            Zr,
            {
              uploading: je,
              progress: Qt,
              onClick: () => ft.current?.click()
            }
          ),
          /* @__PURE__ */ n(
            "input",
            {
              ref: ft,
              type: "file",
              hidden: !0,
              multiple: !0,
              accept: _,
              onChange: bn
            }
          )
        ] }) : null,
        x ? null : d,
        !x && ae ? /* @__PURE__ */ n(
          jr,
          {
            disabled: je,
            task: tn,
            onClick: () => qe(!0)
          }
        ) : null
      ] })
    ] }),
    /* @__PURE__ */ n("div", { className: "wb-asset-browser-body", children: Ce && P.items.length === 0 ? /* @__PURE__ */ n(Je, { icon: /* @__PURE__ */ n(X, { className: "is-spinning" }) }) : pt ? /* @__PURE__ */ n(Je, { text: pt, error: !0 }) : P.items.length === 0 ? /* @__PURE__ */ n(
      Je,
      {
        icon: z === "trash" ? /* @__PURE__ */ n(Rt, {}) : /* @__PURE__ */ n(Ln, {}),
        text: nn ? "正在读取资产配置" : z === "trash" ? "回收站为空" : x ? "集合内暂无符合条件的资产" : K.sourceType === "official" ? "当前分类暂无官方素材" : "暂无符合条件的资产"
      }
    ) : /* @__PURE__ */ n("div", { className: "wb-asset-grid", children: P.items.map((p) => {
      const $ = or(p);
      return /* @__PURE__ */ n(
        hr,
        {
          asset: p,
          sourceLabels: I,
          view: z,
          selectable: p.kind !== "collection" && s && z === "assets",
          selected: z === "assets" && on.has($),
          used: z === "assets" && ln.has($),
          busy: ye === p.id,
          readOnly: p.libraryType === "material",
          onOpen: dn,
          onRename: we,
          onDelete: z === "assets" ? ue : void 0,
          onRestore: z === "trash" ? hn : void 0,
          onSelect: l
        },
        $
      );
    }) }) }),
    P.total > P.pageSize ? /* @__PURE__ */ i("footer", { className: "wb-asset-pagination", children: [
      /* @__PURE__ */ n(J, { label: "上一页", children: /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: P.page <= 1 || Ce,
          onClick: () => {
            Ae(P.page - 1);
          },
          children: /* @__PURE__ */ n(Mn, {})
        }
      ) }),
      /* @__PURE__ */ i("span", { children: [
        P.page,
        " / ",
        Math.max(1, Math.ceil(P.total / P.pageSize))
      ] }),
      /* @__PURE__ */ n(J, { label: "下一页", children: /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: !P.hasMore || Ce,
          onClick: () => {
            Ae(P.page + 1);
          },
          children: /* @__PURE__ */ n(Fn, {})
        }
      ) })
    ] }) : null,
    D?.libraryType === "asset" ? /* @__PURE__ */ n(
      Ar,
      {
        teamID: e,
        assetID: D.id,
        selectable: s && z === "assets",
        layer: O,
        onClose: () => N(null),
        onSelect: l ? (p) => {
          N(null), l(p);
        } : void 0,
        onContinue: v ? (p) => {
          N(null), v(p);
        } : void 0,
        canContinue: g,
        onAssetChanged: (p) => {
          Ne(), T?.(p);
        }
      }
    ) : null,
    D?.libraryType === "material" ? /* @__PURE__ */ n(
      Fr,
      {
        teamID: e,
        material: D,
        selectable: s && z === "assets",
        layer: O,
        onClose: () => N(null),
        onSelect: l ? (p) => {
          N(null), l(p);
        } : void 0
      }
    ) : null,
    /* @__PURE__ */ n(
      Jt,
      {
        teamID: e,
        asset: le,
        onClose: () => we(null),
        onRenamed: (p) => {
          h(($) => ({
            ...$,
            items: $.items.map(
              (q) => q.id === p.id ? p : q
            )
          })), T?.(p), Ne();
        }
      }
    ),
    ae ? /* @__PURE__ */ n(
      Wr,
      {
        open: en,
        teamID: e,
        projectID: t,
        canvasID: K.canvasID || r,
        platforms: te.webContentImportPlatforms,
        maxItems: te.webContentImportMaxItems,
        onClose: () => qe(!1),
        onImported: wn,
        onTaskChange: dt
      }
    ) : null,
    /* @__PURE__ */ n(
      Qr,
      {
        open: !!se,
        layerZIndex: Pt,
        onOpenChange: (p) => {
          !p && !ye && ue(null);
        },
        title: "移入回收站？",
        desc: se?.kind === "collection" ? `“${se.name}”及集合内素材将移入回收站，你可以稍后恢复。` : `“${se?.name || "该资产"}”将从资产列表移除，你可以稍后在回收站中恢复。`,
        confirmText: "移入回收站",
        destructive: !0,
        isLoading: !!ye,
        handleConfirm: () => {
          fn();
        }
      }
    )
  ] });
}
function Je({
  icon: e,
  text: t = "",
  error: r = !1
}) {
  return /* @__PURE__ */ i("div", { className: `wb-asset-state ${r ? "is-error" : ""}`.trim(), children: [
    e,
    t ? /* @__PURE__ */ n("p", { children: t }) : null
  ] });
}
function ta(e, t) {
  const r = { ...Se, ...e || {} };
  return t.length > 0 && !t.includes(r.kind) && (r.kind = t[0]), r.projectID && (r.sourceType = "project", r.sourceID = r.projectID), r.sourceType !== "project" && (r.projectID = 0, r.assetCateID = 0, r.nodeKey = "", r.role = ""), r;
}
function na(e) {
  const t = Ut.filter(
    (a) => a.key !== "collection"
  ), r = t.map((a) => a.key).filter((a) => e?.includes(a));
  return r.length === t.length ? [] : r;
}
function ra(e, t, r, a) {
  if (e.sourceType !== "official") return e;
  const s = Ge(
    t.materialLibrary,
    r
  );
  if (!a || !t.materialLibrary.enabled || !s)
    return {
      ...Se,
      kind: r.length === 1 ? r[0] : ""
    };
  const o = new Set(
    t.materialLibrary.kinds.map((w) => w.assetKind)
  ), c = e.kind && o.has(e.kind) && (r.length === 0 || r.includes(e.kind)) ? e.kind : s, f = new Set(
    Kt(t.materialLibrary, c).map(
      (w) => w.id
    )
  );
  return {
    ...e,
    kind: c,
    materialCateID: f.has(e.materialCateID) ? e.materialCateID : 0
  };
}
function aa({
  teamID: e,
  onContinue: t,
  canContinue: r,
  catalogOptions: a
}) {
  async function s(o, c) {
    return (await ur({
      teamID: e,
      files: o,
      onProgress: c?.onProgress
    })).map(({ asset: w }) => Bt(w)).filter((w) => w.id > 0);
  }
  return /* @__PURE__ */ n(
    ea,
    {
      teamID: e,
      onLocalUpload: s,
      onContinue: t,
      canContinue: r,
      catalogOptions: a
    }
  );
}
const fa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkbenchAssetPage: aa
}, Symbol.toStringTag, { value: "Module" }));
export {
  ea as A,
  xr as T,
  Ar as a,
  Nr as b,
  Pe as c,
  Zr as d,
  fa as e,
  Ir as u
};
