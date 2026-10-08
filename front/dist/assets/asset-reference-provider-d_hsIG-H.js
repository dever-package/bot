import { a as o, j as n, F as Ie, c as Nn } from "./react-CDpwMNlY.js";
import { e as K, a as w, b as H, u as se, l as Sn, h as te } from "./file-kind-DFeonxO2.js";
import { r as Tn, s as An, l as Ft, b as In, c as xn, d as $n, e as Ot, n as Dn, f as Ye, o as _t, g as Mn, h as Rn, a as ye, j as En, m as Ln } from "./asset-api-nw012__Q.js";
import { b9 as Fn, B as ne, ba as at, bb as zt, ak as xe, bc as Pt, bd as Kt, b5 as On, k as _n, A as kt, be as zn, bf as Le, aR as Ke, b0 as st, bg as Vt, aU as it, as as Pn, ah as jt, bh as Ut, a$ as Kn, g as Vn, C as jn, bi as Un, D as qt, o as Bt, q as qn, bj as Bn, x as Wt, m as Wn, bk as Jn, bl as Jt, bm as Hn, bn as Gn, l as Zn, bo as Xn, u as Yn, j as Qn } from "./node-detail-content-DEcv8fc7.js";
import { b as Ve, aH as er, aE as tr, bc as nr, bd as rr, a9 as ar, a1 as Ht, k as sr, q as ot, r as ie, s as Ae, h as ir, n as je, X as ct, w as or, e as cr, be as lr, bf as Gt, I as Zt, C as ur, A as dr, aF as mr, a2 as Xt, U as fr, R as pr, b8 as hr, Y as br, d as yr } from "./vendor-icons-Cz5zFzlk.js";
import { a as lt } from "./preloadable-B6OSmL0f.js";
import { k as re, t as wr, s as ut, a as ze, r as le, h as De, c as Qe, d as Yt } from "./site-config-cvPYHSmK.js";
import { t as ue } from "./index-CVhTq79S.js";
import { V as gr, M as Ct } from "./media-inspector-gallery-Ci5KbK6m.js";
import { u as vr } from "./project-dialogs-B9JRVYmP.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./asset-reference-provider-DSfTbQOo.css", import.meta.url).href]);
function Nt({
  content: e,
  summary: t,
  compact: r = !1
}) {
  const a = Fn(e), s = a.name || t || "文件", i = a.extension ? a.extension.toUpperCase() : "FILE", l = a.extension ? `${a.extension.toUpperCase()} 文件` : "文件";
  return r ? /* @__PURE__ */ o("div", { className: "wb-asset-file-card-preview", children: [
    /* @__PURE__ */ n("strong", { children: i }),
    /* @__PURE__ */ n(ne, { label: s, children: /* @__PURE__ */ n("p", { children: s }) }),
    /* @__PURE__ */ n("span", { children: "文件" })
  ] }) : /* @__PURE__ */ o("section", { className: "wb-asset-file-preview", children: [
    /* @__PURE__ */ n("span", { className: "wb-asset-file-icon", children: /* @__PURE__ */ n(Ve, { "aria-hidden": "true" }) }),
    /* @__PURE__ */ o("div", { className: "wb-asset-file-copy", children: [
      /* @__PURE__ */ n(ne, { label: s, children: /* @__PURE__ */ n("strong", { children: s }) }),
      /* @__PURE__ */ n("span", { children: l })
    ] }),
    a.url ? /* @__PURE__ */ o("a", { href: a.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ n(er, { "aria-hidden": "true" }),
      /* @__PURE__ */ n("span", { children: "打开文件" })
    ] }) : /* @__PURE__ */ n("span", { className: "wb-asset-file-unavailable", children: "文件暂不可用" })
  ] });
}
function He({
  kind: e,
  src: t,
  poster: r
}) {
  const a = K(null), [s, i] = w(""), [l, f] = w(""), [y, d] = w(""), m = s === t, p = l === t, u = y === t;
  H(() => {
    const S = a.current;
    if (!t || !S || typeof IntersectionObserver > "u") {
      i(t);
      return;
    }
    const x = new IntersectionObserver(
      (L) => {
        L.some((F) => F.isIntersecting) && (i(t), x.disconnect());
      },
      { rootMargin: "320px 0px" }
    );
    return x.observe(S), () => x.disconnect();
  }, [t]);
  function k() {
    f(t), d("");
  }
  function g() {
    f(""), d(t);
  }
  return /* @__PURE__ */ o(
    "div",
    {
      ref: a,
      className: [
        "wb-asset-lazy-cover",
        `is-${e}`,
        p ? "is-loaded" : "is-pending",
        u ? "is-failed" : ""
      ].filter(Boolean).join(" "),
      children: [
        m && !u ? e === "image" ? /* @__PURE__ */ n(
          "img",
          {
            src: t,
            alt: "",
            loading: "lazy",
            decoding: "async",
            onLoad: k,
            onError: g
          }
        ) : /* @__PURE__ */ n(
          gr,
          {
            src: t,
            poster: r,
            ariaHidden: !0,
            onLoad: k,
            onError: g
          }
        ) : null,
        u ? /* @__PURE__ */ n("span", { children: "封面加载失败" }) : null
      ]
    }
  );
}
function kr({
  kind: e,
  content: t,
  summary: r
}) {
  const a = at(e, t), s = r || zt(t) || xe(e), i = Pt(a, "storyboard") ? { text: s } : a;
  return /* @__PURE__ */ n("div", { className: `wb-asset-card-text-preview is-${e}`, children: /* @__PURE__ */ n(
    Kt,
    {
      output: i,
      fallback: s,
      emptyText: s,
      className: "wb-asset-card-text-content",
      markdownClassName: "wb-asset-card-prose",
      richClassName: "wb-asset-card-prose"
    }
  ) });
}
function Ue({
  kind: e,
  content: t,
  summary: r,
  prompt: a,
  compact: s = !1
}) {
  const i = On(t, e), l = i.map((y) => y.url), f = l[0] || "";
  if (!s) {
    const y = e === "audio" ? _n(t) : null;
    if ((e === "image" || e === "video") && l.length > 0)
      return /* @__PURE__ */ n(
        Ct,
        {
          kind: e,
          mediaItems: i,
          downloadable: !0,
          className: "wb-asset-media-gallery"
        }
      );
    if (e === "audio")
      return i.length > 0 && (i.length > 1 || i[0]?.thumbnail) ? /* @__PURE__ */ n(
        Ct,
        {
          kind: "audio",
          mediaItems: i,
          downloadable: !0,
          className: "wb-asset-media-gallery",
          supplementalText: y
        }
      ) : /* @__PURE__ */ n(kt, { src: f, prompt: a, detailed: !0 });
    if (e === "file")
      return /* @__PURE__ */ n(Nt, { content: t, summary: r });
    const d = at(e, t);
    return /* @__PURE__ */ n(
      Kt,
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
  return e === "image" && f ? /* @__PURE__ */ n(He, { kind: "image", src: f }) : e === "video" && f ? /* @__PURE__ */ n(
    He,
    {
      kind: "video",
      src: f,
      poster: i[0]?.thumbnail
    }
  ) : e === "audio" ? i[0]?.thumbnail ? /* @__PURE__ */ n(He, { kind: "image", src: i[0].thumbnail }) : /* @__PURE__ */ n(kt, { src: f }) : e === "file" ? /* @__PURE__ */ n(Nt, { content: t, summary: r, compact: !0 }) : e === "text" || e === "richtext" ? /* @__PURE__ */ n(kr, { kind: e, content: t, summary: r }) : /* @__PURE__ */ n("div", { className: "wb-asset-card-fallback", children: /* @__PURE__ */ n("p", { children: r || zt(t) || xe(e) }) });
}
function qe({ kind: e }) {
  switch (e) {
    case "collection":
      return /* @__PURE__ */ n(Ht, { "aria-hidden": "true" });
    case "image":
      return /* @__PURE__ */ n(ar, { "aria-hidden": "true" });
    case "audio":
      return /* @__PURE__ */ n(rr, { "aria-hidden": "true" });
    case "video":
      return /* @__PURE__ */ n(nr, { "aria-hidden": "true" });
    case "file":
      return /* @__PURE__ */ n(tr, { "aria-hidden": "true" });
    default:
      return /* @__PURE__ */ n(Ve, { "aria-hidden": "true" });
  }
}
function Cr({
  asset: e,
  sourceLabels: t,
  view: r = "assets",
  selectable: a = !1,
  selected: s = !1,
  used: i = !1,
  busy: l = !1,
  readOnly: f = !1,
  onOpen: y,
  onRename: d,
  onDelete: m,
  onRestore: p,
  onSelect: u
}) {
  const k = r === "trash", g = e.kind === "collection", S = g ? 0 : zn(e.version?.content, e.kind), x = a && !g && !!u, L = x && (l || i), F = x ? i ? `${e.name}已使用` : s ? `取消选择${e.name}` : `选择${e.name}` : `${g ? "打开集合" : "查看"}${e.name}`, c = g ? /* @__PURE__ */ n(Nr, { asset: e }) : /* @__PURE__ */ n(
    Ue,
    {
      kind: e.kind,
      content: e.version?.content,
      summary: e.summary,
      compact: !0
    }
  );
  function v() {
    if (x) {
      L || u?.(e);
      return;
    }
    y(e);
  }
  return /* @__PURE__ */ o(
    "article",
    {
      className: `wb-asset-card ${g ? "is-collection" : ""} ${e.libraryType === "material" ? "is-official" : ""} ${s ? "is-selected" : ""} ${i ? "is-used" : ""} ${k ? "is-trash" : ""}`.trim(),
      children: [
        /* @__PURE__ */ o("div", { className: "wb-asset-card-main", children: [
          /* @__PURE__ */ o("div", { className: "wb-asset-card-preview", children: [
            c,
            S > 1 ? /* @__PURE__ */ o("span", { className: "wb-asset-media-count", children: [
              S,
              " 项"
            ] }) : null,
            e.kind !== "audio" ? /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "wb-asset-card-preview-open",
                disabled: L,
                onClick: v,
                "aria-label": F
              }
            ) : null
          ] }),
          /* @__PURE__ */ n(ne, { label: e.name, children: /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              className: "wb-asset-card-copy",
              disabled: L,
              onClick: v,
              children: [
                /* @__PURE__ */ n("strong", { children: e.name }),
                /* @__PURE__ */ n("span", { children: g ? `集合 · ${e.collectionCount} 项素材` : e.libraryType === "material" ? `${e.materialCateName || Le("official", t)} · ${xe(e.kind)}` : `${Le(e.sourceType, t)} · ${xe(e.kind)}` })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ n("span", { className: "wb-asset-card-kind-icon", children: /* @__PURE__ */ n(qe, { kind: e.kind }) }),
        /* @__PURE__ */ o("div", { className: "wb-asset-card-actions", children: [
          x && !k ? /* @__PURE__ */ n(ne, { label: "查看详情", children: /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              disabled: l,
              onClick: (z) => {
                z.stopPropagation(), y(e);
              },
              children: [
                /* @__PURE__ */ n(sr, { "aria-hidden": "true" }),
                /* @__PURE__ */ n("span", { className: "sr-only", children: "查看详情" })
              ]
            }
          ) }) : null,
          !k && !f && d ? /* @__PURE__ */ n(ne, { label: "修改标题", children: /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              disabled: l,
              onClick: () => d(e),
              children: [
                /* @__PURE__ */ n(ot, { "aria-hidden": "true" }),
                /* @__PURE__ */ n("span", { className: "sr-only", children: "修改标题" })
              ]
            }
          ) }) : null,
          k && p ? /* @__PURE__ */ n(ne, { label: "恢复资产", children: /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              className: "is-restore",
              disabled: l,
              onClick: () => p(e),
              children: [
                l ? /* @__PURE__ */ n(ie, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ n(Ae, { "aria-hidden": "true" }),
                /* @__PURE__ */ n("span", { className: "sr-only", children: "恢复资产" })
              ]
            }
          ) }) : !f && m ? /* @__PURE__ */ n(ne, { label: "移入回收站", children: /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              className: "is-danger",
              disabled: l,
              onClick: () => m(e),
              children: [
                l ? /* @__PURE__ */ n(ie, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ n(ir, { "aria-hidden": "true" }),
                /* @__PURE__ */ n("span", { className: "sr-only", children: "移入回收站" })
              ]
            }
          ) }) : null,
          !g && !k && a && u ? /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              className: `is-primary ${s ? "is-selected" : ""} ${i ? "is-used" : ""}`.trim(),
              disabled: l || i,
              onClick: v,
              children: [
                /* @__PURE__ */ n(je, { "aria-hidden": "true" }),
                i ? "已使用" : s ? "已选" : "使用"
              ]
            }
          ) : null
        ] })
      ]
    }
  );
}
function Nr({ asset: e }) {
  const t = e.collectionPreviews.slice(0, 4);
  return t.length === 0 ? /* @__PURE__ */ o("div", { className: "wb-asset-collection-empty", children: [
    /* @__PURE__ */ n(qe, { kind: "collection" }),
    /* @__PURE__ */ n("span", { children: e.collectionCount > 0 ? `${e.collectionCount} 项素材` : "空集合" })
  ] }) : /* @__PURE__ */ o("div", { className: `wb-asset-collection-preview has-${t.length}`, children: [
    t.map((r) => /* @__PURE__ */ n("div", { children: /* @__PURE__ */ n(Ue, { kind: r.kind, content: r.content, compact: !0 }) }, r.id)),
    /* @__PURE__ */ o("span", { children: [
      e.collectionCount,
      " 项"
    ] })
  ] });
}
function Qt({
  teamID: e,
  asset: t,
  onClose: r,
  onRenamed: a
}) {
  const [s, i] = w(""), [l, f] = w(!1), [y, d] = w("");
  H(() => {
    t && (i(t.name), f(!1), d(""));
  }, [t]), H(() => {
    if (!t) return;
    const p = (u) => {
      u.key === "Escape" && (u.preventDefault(), u.stopImmediatePropagation(), l || r());
    };
    return window.addEventListener("keydown", p, !0), () => window.removeEventListener("keydown", p, !0);
  }, [t, r, l]);
  async function m(p) {
    p.preventDefault();
    const u = s.trim();
    if (!(!t || !u || l)) {
      f(!0), d("");
      try {
        const k = await Tn({
          teamID: e,
          assetID: t.id,
          name: u
        });
        a(k), r();
      } catch (k) {
        d(re(k, "修改资产标题失败"));
      } finally {
        f(!1);
      }
    }
  }
  return !t || typeof document > "u" ? null : lt(
    /* @__PURE__ */ n(
      "div",
      {
        className: "wb-asset-form-backdrop",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "修改资产标题",
        onMouseDown: (p) => {
          p.target === p.currentTarget && !l && r();
        },
        children: /* @__PURE__ */ o("form", { className: "wb-asset-form-dialog", onSubmit: m, children: [
          /* @__PURE__ */ o("header", { children: [
            /* @__PURE__ */ o("div", { children: [
              /* @__PURE__ */ n("span", { className: "wb-asset-form-icon", children: /* @__PURE__ */ n(ot, { "aria-hidden": "true" }) }),
              /* @__PURE__ */ o("div", { children: [
                /* @__PURE__ */ n("h2", { children: "修改资产标题" }),
                /* @__PURE__ */ n("p", { children: "只修改资产库中的显示名称。" })
              ] })
            ] }),
            /* @__PURE__ */ n(ne, { label: "关闭", children: /* @__PURE__ */ n("button", { type: "button", disabled: l, onClick: r, children: /* @__PURE__ */ n(ct, { "aria-hidden": "true" }) }) })
          ] }),
          /* @__PURE__ */ o("label", { children: [
            /* @__PURE__ */ n("span", { children: "资产标题" }),
            /* @__PURE__ */ n(
              "input",
              {
                autoFocus: !0,
                value: s,
                maxLength: 128,
                disabled: l,
                placeholder: "请输入资产标题",
                onChange: (p) => i(p.target.value)
              }
            )
          ] }),
          y ? /* @__PURE__ */ n("p", { className: "wb-asset-form-error", children: y }) : null,
          /* @__PURE__ */ o("footer", { children: [
            /* @__PURE__ */ n("button", { type: "button", disabled: l, onClick: r, children: "取消" }),
            /* @__PURE__ */ o(
              "button",
              {
                type: "submit",
                className: "is-primary",
                disabled: l || !s.trim(),
                children: [
                  l ? /* @__PURE__ */ n(ie, { className: "is-spinning" }) : null,
                  l ? "保存中" : "保存"
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
function en() {
  const e = wr().site.homeMenu;
  return se(
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
function Sr() {
  return en().labels;
}
function Tr(e, t) {
  if (e === "text")
    return {
      kind: e,
      contentFormat: "markdown",
      value: xr(t)
    };
  const r = Ke(t);
  return r ? {
    kind: e,
    contentFormat: "json",
    value: st(mt(r))
  } : {
    kind: e,
    contentFormat: "markdown",
    value: nn(t) || Vt(t)
  };
}
function Ar(e, t) {
  return { ...e, value: t };
}
function Ir(e) {
  if (e.kind !== "richtext" || e.contentFormat !== "json")
    return e.value;
  const t = Ke(it(e.value));
  return t ? st(
    dt(mt(t))
  ) : e.value;
}
function tn(e) {
  return e.contentFormat === "markdown" ? { format: "markdown", text: e.value } : Ke(it(e.value)) || {
    type: "doc",
    content: []
  };
}
function St(e) {
  const t = tn(e);
  if (e.kind !== "richtext" || e.contentFormat !== "json")
    return At(t);
  const r = Ke(t);
  return At(
    r ? rn(dt(r)) : t
  );
}
function xr(e) {
  return nn(e) || Pn(e) || Vt(e);
}
function nn(e) {
  const t = it(e);
  return jt(t) ? String(t.format || "").trim().toLowerCase() !== "markdown" ? "" : String(t.text || t.markdown || "") : typeof t == "string" ? t : "";
}
function dt(e) {
  const t = { ...e };
  return e.content && (t.content = e.content.map(dt)), (e.type === "editorMediaImage" || e.type === "editorMediaVideo") && !String(e.attrs?.maxWidth || "").trim() && (t.attrs = { ...e.attrs || {}, maxWidth: "100%" }), t;
}
function mt(e) {
  const t = { ...e };
  if (!e.content) return t;
  const r = e.type === "doc" ? e.content.filter((a) => !$r(a)) : e.content;
  if (t.content = r.map(mt), e.type === "paragraph")
    for (; t.content.at(-1)?.type === "hardBreak"; )
      t.content.pop();
  return t;
}
function $r(e) {
  return e.type === "paragraph" && !!e.content?.length && e.content?.every(
    (t) => t.type === "hardBreak" || t.type === "text" && !String(t.text || "").trim()
  );
}
function rn(e) {
  const t = { type: e.type }, r = Tt(e.attrs);
  return r && (t.attrs = r), e.content && (t.content = e.content.map(rn)), e.marks && (t.marks = e.marks.map((a) => {
    const s = Tt(a.attrs);
    return s ? { ...a, attrs: s } : { type: a.type };
  })), e.text != null && (t.text = e.text), t;
}
function Tt(e) {
  if (!e) return;
  const t = Object.entries(e).filter(
    ([, r]) => r != null && r !== ""
  );
  return t.length > 0 ? Object.fromEntries(t) : void 0;
}
function At(e) {
  return st(et(e));
}
function et(e) {
  return Array.isArray(e) ? e.map(et) : jt(e) ? Object.fromEntries(
    Object.keys(e).sort().map((t) => [t, et(e[t])])
  ) : e;
}
await window.DeverFront?.ensureCompat?.(["@/components/rich-text-editor"]);
const tt = window.DeverFront?.sdk?.getCompatModule("@/components/rich-text-editor");
if (!tt || Object.keys(tt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/rich-text-editor");
const { RichTextEditor: It } = tt;
function Dr({
  kind: e,
  value: t,
  contentFormat: r,
  readonly: a = !1,
  onChange: s
}) {
  const i = se(
    () => Ir({ kind: e, value: t, contentFormat: r }),
    [r, e, t]
  );
  return e === "text" || !It ? /* @__PURE__ */ n(
    Mr,
    {
      value: t,
      readonly: a,
      onChange: s
    }
  ) : /* @__PURE__ */ n(
    It,
    {
      value: i,
      onChange: s,
      contentFormat: r,
      placeholder: "编辑内容",
      disabled: a,
      minHeight: 0,
      maxHeight: 2400,
      controlClassName: "wb-asset-rich-content-editor",
      floatingLayerZIndex: Ut
    }
  );
}
function Mr({
  value: e,
  readonly: t,
  onChange: r
}) {
  const a = K(null);
  return Sn(() => {
    const s = () => {
      const i = a.current;
      i && (i.style.height = "auto", i.style.height = `${i.scrollHeight}px`);
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
function Rr({
  value: e,
  resetKey: t,
  fingerprint: r,
  save: a,
  onError: s,
  autoSave: i = !0,
  debounceMs: l = 1200
}) {
  const [f, y] = w(e), [d, m] = w("saved"), p = K(e), u = K(e), k = K(r), g = K(a), S = K(s), x = K(i), L = K(r(e)), F = K(0), c = K(0), v = K(null), z = K(null), Z = K(async () => !1), q = K(null), O = K(!1), C = K(!0), N = te(() => {
    v.current !== null && (window.clearTimeout(v.current), v.current = null);
  }, []), R = te(
    async ($, W = !1, V) => {
      N();
      const E = c.current;
      for (; C.current && E === c.current; ) {
        if (z.current && (!await z.current || E !== c.current))
          return !1;
        if (!W && $ !== void 0 && $ !== F.current)
          return !0;
        const oe = u.current, ce = k.current(oe);
        if (ce === L.current)
          return O.current = !1, C.current && m("saved"), !0;
        const Q = F.current;
        C.current && m("saving");
        const B = V || g.current, b = B(oe).then(() => {
          if (!C.current || E !== c.current)
            return !1;
          L.current = ce, O.current = !1, q.current = null;
          const A = k.current(u.current);
          return m(
            A === ce ? "saved" : "dirty"
          ), !0;
        }).catch((A) => (C.current && E === c.current && (N(), O.current = !0, q.current = B, m("error"), S.current?.(A)), !1));
        z.current = b;
        const M = await b;
        if (z.current === b && (z.current = null), !M) return !1;
        if (!W && Q !== F.current && v.current === null && !O.current) {
          const A = F.current;
          v.current = window.setTimeout(() => {
            v.current = null, Z.current(A);
          }, l);
        }
        if (!W || Q === F.current)
          return !0;
      }
      return !1;
    },
    [N, l]
  ), G = te(
    ($) => {
      N(), !(!x.current || O.current) && (v.current = window.setTimeout(() => {
        v.current = null, R($);
      }, l));
    },
    [N, l, R]
  ), Y = te(
    ($) => {
      const W = typeof $ == "function" ? $(u.current) : $, V = k.current(W);
      if (u.current = W, y(W), F.current += 1, V === L.current) {
        N(), O.current = !1, m("saved");
        return;
      }
      if (O.current) {
        m("error");
        return;
      }
      m("dirty"), G(F.current);
    },
    [N, G]
  ), T = te(() => {
    const $ = p.current;
    c.current += 1, F.current = 0, u.current = $, L.current = k.current($), O.current = !1, q.current = null, z.current = null, N(), y($), m("saved");
  }, [N]), ae = te(() => R(void 0, !0), [R]), j = te(
    ($) => R(void 0, !0, $),
    [R]
  ), J = te(async () => (O.current = !1, R(void 0, !0, q.current || g.current)), [R]);
  return H(() => {
    p.current = e, k.current = r, g.current = a, S.current = s, x.current = i, Z.current = R;
  }, [i, r, s, R, a, e]), H(() => T(), [T, t]), H(() => (C.current = !0, () => {
    C.current = !1, c.current += 1, N();
  }), [N]), {
    draft: f,
    status: d,
    setDraft: Y,
    reset: T,
    flush: ae,
    flushWith: j,
    retry: J,
    hasPendingChanges: d !== "saved"
  };
}
function Er({
  teamID: e,
  asset: t,
  enabled: r,
  onSaved: a,
  onError: s
}) {
  const i = t?.version || null, l = se(
    () => Tr(
      t?.kind === "richtext" ? "richtext" : "text",
      i?.content
    ),
    [t?.kind, i?.content]
  ), f = K(null), y = te(
    async (u, k) => {
      if (!r || !t?.id || !i?.id)
        throw new Error("当前资产正文不可编辑");
      const g = St(u), S = k === "create_version" ? Lr(f, i, g) : "", x = await An({
        teamID: e,
        assetID: t.id,
        expectedVersionID: i.id,
        expectedUpdatedAt: i.updatedAt || i.createdAt,
        requestID: S,
        saveMode: k,
        content: tn(u)
      });
      f.current = null, a(x, k);
    },
    [t, r, a, e, i]
  ), d = Rr({
    value: l,
    resetKey: `${t?.id || 0}:${i?.id || 0}:${i?.updatedAt || i?.createdAt || ""}`,
    fingerprint: St,
    save: (u) => y(u, "overwrite_current"),
    onError: s,
    autoSave: !1
  }), { flushWith: m } = d, p = te(
    () => m((u) => y(u, "create_version")),
    [m, y]
  );
  return {
    ...d,
    saveAsNewVersion: p
  };
}
function Lr(e, t, r) {
  if (e.current?.versionID === t.id && e.current.fingerprint === r)
    return e.current.requestID;
  const a = typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`, s = `manual-edit-${t.id}-${a}`.slice(0, 64);
  return e.current = { versionID: t.id, fingerprint: r, requestID: s }, s;
}
function Fr({
  status: e,
  hasPendingChanges: t,
  onReset: r,
  onSaveAsNewVersion: a,
  onSave: s
}) {
  const i = e === "saving", l = i || !t;
  return /* @__PURE__ */ o(Ie, { children: [
    /* @__PURE__ */ o(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        disabled: l,
        onClick: r,
        children: [
          /* @__PURE__ */ n(Ae, { size: 13 }),
          /* @__PURE__ */ n("span", { children: "取消修改" })
        ]
      }
    ),
    /* @__PURE__ */ o(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        disabled: l,
        onClick: a,
        children: [
          /* @__PURE__ */ n(or, { size: 13 }),
          /* @__PURE__ */ n("span", { children: "保存为新版本" })
        ]
      }
    ),
    /* @__PURE__ */ o(
      "button",
      {
        type: "button",
        className: "wb-detail-command is-primary",
        disabled: l,
        onClick: s,
        children: [
          i ? /* @__PURE__ */ n(ie, { size: 13, className: "wb-detail-spin" }) : /* @__PURE__ */ n(cr, { size: 13 }),
          /* @__PURE__ */ n("span", { children: i ? "保存中" : "保存" })
        ]
      }
    )
  ] });
}
function Or({
  teamID: e,
  assetID: t,
  selectable: r = !1,
  onClose: a,
  onSelect: s,
  onContinue: i,
  canContinue: l,
  onAssetChanged: f,
  layer: y = "default"
}) {
  const d = Sr(), [m, p] = w(null), [u, k] = w(
    null
  ), [g, S] = w(!0), [x, L] = w(0), [F, c] = w(!1), [v, z] = w(!1), [Z, q] = w(""), [O, C] = w(""), N = te(async () => {
    S(!0), q(""), C("");
    try {
      const b = xt(await Ft(e, t));
      p(b), k(b.asset.version);
    } catch (b) {
      q(re(b, "加载资产详情失败"));
    } finally {
      S(!1);
    }
  }, [t, e]);
  H(() => {
    N();
  }, [N]);
  async function R(b) {
    if (!(x || b.id === u?.id) && Q()) {
      if (b.id === m?.asset.versionID && m.asset.version) {
        q(""), k(m.asset.version);
        return;
      }
      L(b.id), q("");
      try {
        k(
          await xn({ teamID: e, assetID: t, versionID: b.id })
        );
      } catch (M) {
        q(re(M, "加载资产版本失败"));
      } finally {
        L(0);
      }
    }
  }
  async function G() {
    if (!m || !m.hasMore || x) return;
    const b = Math.floor(m.versions.length / 20) + 1;
    L(-1), C("");
    try {
      const M = await $n({
        teamID: e,
        assetID: t,
        page: b,
        pageSize: 20
      });
      p(
        (A) => A && {
          ...A,
          versions: nt([...A.versions, ...M.items]),
          versionTotal: M.total,
          hasMore: M.hasMore
        }
      );
    } catch (M) {
      C(re(M, "加载资产版本失败"));
    } finally {
      L(0);
    }
  }
  async function Y() {
    if (!(!m || !u || F)) {
      c(!0), q("");
      try {
        const b = await In({
          teamID: e,
          assetID: t,
          versionID: u.id
        }), M = xt({ ...m, asset: b });
        p(M), k(b.version), f?.(b);
      } catch (b) {
        q(re(b, "设置当前版本失败"));
      } finally {
        c(!1);
      }
    }
  }
  const T = m?.asset, ae = T?.status === "deleted", j = !!(T && u && T.versionID === u.id), J = se(
    () => Kn(u?.content),
    [u?.content]
  ), $ = se(
    () => Pt(u?.content, "storyboard"),
    [u?.content]
  ), W = !!(T && u && j && !ae && (T.kind === "text" || T.kind === "richtext") && !J && !$), V = te(
    (b, M) => {
      q(""), p((A) => {
        if (!A) return A;
        const D = b.version, I = !!(D && A.versions.some((U) => U.id === D.id)), _ = nt(
          D ? [D, ...A.versions] : A.versions
        );
        return {
          ...A,
          asset: b,
          versions: _,
          versionTotal: Math.max(
            _.length,
            A.versionTotal + (D && !I ? 1 : 0)
          )
        };
      }), k(b.version), f?.(b), ue.success(
        M === "create_version" ? "已保存为新版本" : "正文已保存"
      );
    },
    [f]
  ), E = Er({
    teamID: e,
    asset: T,
    enabled: W,
    onSaved: V,
    onError: (b) => q(re(b, "保存资产正文失败"))
  }), oe = E.reset, ce = E.hasPendingChanges, Q = te(() => !W || !ce ? !0 : window.confirm("当前正文尚未保存，确定放弃修改吗？") ? (oe(), q(""), !0) : !1, [W, ce, oe]), B = te(() => {
    v || !Q() || a();
  }, [Q, a, v]);
  return H(() => {
    const b = (M) => {
      M.key !== "Escape" || v || (M.preventDefault(), M.stopImmediatePropagation(), B());
    };
    return window.addEventListener("keydown", b, !0), () => window.removeEventListener("keydown", b, !0);
  }, [v, B]), /* @__PURE__ */ o(
    Wt,
    {
      ariaLabel: `${T?.name || "资产"}详情`,
      onRequestClose: B,
      layer: y,
      header: /* @__PURE__ */ n(
        qt,
        {
          icon: T ? /* @__PURE__ */ n(qe, { kind: T.kind }) : /* @__PURE__ */ n(Ve, { size: 16 }),
          title: T?.name || "资产详情",
          subtitle: T ? `${Kr(T, d)} · ${xe(T.kind)} · ${Bn(T.role)}` : "",
          versionSelect: m && T && u ? /* @__PURE__ */ n(
            qn,
            {
              options: m.versions.map((b) => ({
                id: b.id,
                version: b.version,
                updatedAt: b.updatedAt || b.createdAt,
                value: b
              })),
              currentVersionId: T.versionID,
              selectedVersionId: u.id,
              total: m.versionTotal,
              hasMore: m.hasMore,
              loading: x > 0,
              loadingMore: x === -1,
              error: O,
              disabled: F || E.status === "saving",
              onSelect: (b) => {
                R(b);
              },
              onLoadMore: () => {
                G();
              },
              onRetry: () => {
                G();
              }
            }
          ) : void 0,
          state: ae ? /* @__PURE__ */ n("span", { className: "wb-detail-state", children: "回收站" }) : x > 0 ? /* @__PURE__ */ o("span", { className: "wb-detail-state is-saving", children: [
            /* @__PURE__ */ n(ie, { size: 12, className: "wb-detail-spin" }),
            "读取中"
          ] }) : W ? E.status === "error" ? /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              className: "wb-detail-state is-error",
              onClick: () => {
                E.retry();
              },
              children: [
                /* @__PURE__ */ n(Ae, { size: 12 }),
                "保存失败"
              ]
            }
          ) : /* @__PURE__ */ o("span", { className: `wb-detail-state is-${E.status}`, children: [
            E.status === "saving" ? /* @__PURE__ */ n(ie, { size: 12, className: "wb-detail-spin" }) : null,
            Pr(E.status)
          ] }) : /* @__PURE__ */ n("span", { className: "wb-detail-state", children: "只读预览" }),
          updatedAt: Bt(
            u?.updatedAt || u?.createdAt
          ),
          actions: T && u && !ae ? /* @__PURE__ */ o(Ie, { children: [
            /* @__PURE__ */ o(
              "button",
              {
                type: "button",
                className: "wb-detail-command",
                onClick: () => z(!0),
                children: [
                  /* @__PURE__ */ n(ot, { size: 13 }),
                  /* @__PURE__ */ n("span", { children: "修改标题" })
                ]
              }
            ),
            W ? /* @__PURE__ */ n(
              Fr,
              {
                status: E.status,
                hasPendingChanges: E.hasPendingChanges,
                onReset: () => {
                  E.reset(), q("");
                },
                onSaveAsNewVersion: () => {
                  E.saveAsNewVersion();
                },
                onSave: () => {
                  E.flush();
                }
              }
            ) : null,
            j ? /* @__PURE__ */ n(
              zr,
              {
                asset: T,
                selectable: r,
                onSelect: s,
                onContinue: i,
                canContinue: l
              }
            ) : /* @__PURE__ */ n(
              _r,
              {
                currentVersion: T.version,
                loading: !!x,
                saving: F,
                onReturn: (b) => {
                  R(b);
                },
                onMakeCurrent: () => {
                  Y();
                }
              }
            )
          ] }) : void 0,
          onClose: B
        }
      ),
      children: [
        /* @__PURE__ */ n("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ n("div", { className: "wb-detail-scroll", children: g ? /* @__PURE__ */ o("div", { className: "wb-detail-content-state", children: [
          /* @__PURE__ */ n(ie, { size: 18, className: "wb-detail-spin" }),
          /* @__PURE__ */ n("span", { children: "正在读取资产" })
        ] }) : !T || !u ? /* @__PURE__ */ o("div", { className: "wb-detail-content-state is-error", children: [
          /* @__PURE__ */ n("span", { children: Z || "资产不存在" }),
          /* @__PURE__ */ o("button", { type: "button", onClick: () => {
            N();
          }, children: [
            /* @__PURE__ */ n(Ae, { size: 13 }),
            "重试"
          ] })
        ] }) : W ? /* @__PURE__ */ o("div", { className: `wb-detail-editable-content is-${T.kind}`, children: [
          Z ? /* @__PURE__ */ n("p", { className: "wb-detail-error-banner", children: Z }) : null,
          /* @__PURE__ */ n(
            Dr,
            {
              kind: E.draft.kind,
              value: E.draft.value,
              contentFormat: E.draft.contentFormat,
              onChange: (b) => E.setDraft(
                (M) => Ar(M, b)
              )
            }
          )
        ] }) : /* @__PURE__ */ o("div", { className: `wb-detail-readonly-content is-${T.kind}`, children: [
          Z ? /* @__PURE__ */ n("p", { className: "wb-detail-error-banner", children: Z }) : null,
          J ? /* @__PURE__ */ n(Vn, { grid: J, variant: "detail" }) : $ ? /* @__PURE__ */ n(
            jn,
            {
              output: u.content,
              fallback: u.summary || T.summary,
              emptyText: "该版本暂无可预览内容",
              className: "wb-asset-preview-content",
              markdownClassName: "wb-asset-detail-prose",
              richClassName: "wb-asset-detail-prose",
              mediaLayout: "detail"
            }
          ) : /* @__PURE__ */ n(
            Ue,
            {
              kind: T.kind,
              content: u.content,
              summary: u.summary || T.summary,
              prompt: Un(u)
            },
            u.id
          )
        ] }) }) }),
        /* @__PURE__ */ n(
          Qt,
          {
            teamID: e,
            asset: v && T || null,
            onClose: () => z(!1),
            onRenamed: (b) => {
              p(
                (M) => M && { ...M, asset: b }
              ), f?.(b);
            }
          }
        )
      ]
    }
  );
}
function _r({
  currentVersion: e,
  loading: t,
  saving: r,
  onReturn: a,
  onMakeCurrent: s
}) {
  const i = t || r;
  return /* @__PURE__ */ o(Ie, { children: [
    e ? /* @__PURE__ */ o(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        disabled: i,
        onClick: () => a(e),
        children: [
          /* @__PURE__ */ n(Ae, { size: 13 }),
          /* @__PURE__ */ n("span", { children: "返回当前版本" })
        ]
      }
    ) : null,
    /* @__PURE__ */ o(
      "button",
      {
        type: "button",
        className: "wb-detail-command is-primary",
        disabled: i,
        onClick: s,
        children: [
          r ? /* @__PURE__ */ n(ie, { size: 13, className: "wb-detail-spin" }) : /* @__PURE__ */ n(je, { size: 13 }),
          /* @__PURE__ */ n("span", { children: r ? "设置中" : "设为当前版本" })
        ]
      }
    )
  ] });
}
function zr({
  asset: e,
  selectable: t,
  onSelect: r,
  onContinue: a,
  canContinue: s
}) {
  return /* @__PURE__ */ o(Ie, { children: [
    a && Vr(e) && (s?.(e) ?? !0) ? /* @__PURE__ */ o(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        onClick: () => a(e),
        children: [
          e.sourceType === "dialogue" ? /* @__PURE__ */ n(lr, { size: 14 }) : /* @__PURE__ */ n(Ae, { size: 14 }),
          /* @__PURE__ */ n("span", { children: e.sourceType === "dialogue" ? "继续对话" : "重新生成" })
        ]
      }
    ) : null,
    t && r ? /* @__PURE__ */ o(
      "button",
      {
        type: "button",
        className: "wb-detail-command is-primary",
        onClick: () => r(e),
        children: [
          /* @__PURE__ */ n(je, { size: 14 }),
          /* @__PURE__ */ n("span", { children: "使用" })
        ]
      }
    ) : null
  ] });
}
function xt(e) {
  const t = nt(
    e.asset.version ? [e.asset.version, ...e.versions] : e.versions
  );
  return {
    ...e,
    versions: t,
    versionTotal: Math.max(e.versionTotal, t.length)
  };
}
function nt(e) {
  const t = /* @__PURE__ */ new Set();
  return e.filter((r) => t.has(r.id) ? !1 : (t.add(r.id), !0));
}
function Pr(e) {
  return e === "dirty" ? "未保存" : e === "saving" ? "保存中" : e === "error" ? "保存失败" : "已保存";
}
function Kr(e, t) {
  const r = Le(e.sourceType, t);
  return e.sourceName && e.sourceName !== r ? `${r} / ${e.sourceName}` : r;
}
function Vr(e) {
  return e.role === "material" && (e.sourceType === "tool" || e.sourceType === "dialogue");
}
function jr({
  teamID: e,
  material: t,
  selectable: r = !1,
  layer: a = "default",
  onClose: s,
  onSelect: i
}) {
  const [l, f] = w(t), [y, d] = w(!0), [m, p] = w(""), u = te(async () => {
    d(!0), p("");
    try {
      f(await Ot(e, t.id));
    } catch (g) {
      p(re(g, "加载官方素材详情失败"));
    } finally {
      d(!1);
    }
  }, [t.id, e]);
  H(() => {
    u();
  }, [u]), H(() => {
    const g = (S) => {
      S.key === "Escape" && (S.preventDefault(), S.stopImmediatePropagation(), s());
    };
    return window.addEventListener("keydown", g, !0), () => window.removeEventListener("keydown", g, !0);
  }, [s]);
  const k = Wn(l.version?.content, l.kind);
  return /* @__PURE__ */ n(
    Wt,
    {
      ariaLabel: `${l.name}详情`,
      onRequestClose: s,
      layer: a,
      header: /* @__PURE__ */ n(
        qt,
        {
          icon: l ? /* @__PURE__ */ n(qe, { kind: l.kind }) : /* @__PURE__ */ n(Ve, { size: 16 }),
          title: l.name || "官方素材详情",
          subtitle: `${Le("official")} · ${xe(l.kind)}${l.materialCateName ? ` · ${l.materialCateName}` : ""}`,
          state: /* @__PURE__ */ n("span", { className: "wb-detail-state", children: "官方只读" }),
          updatedAt: Bt(l.createdAt),
          downloadUrl: k || void 0,
          actions: r && i && !y && !m ? /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              className: "wb-detail-command is-primary",
              onClick: () => i(l),
              children: [
                /* @__PURE__ */ n(je, { size: 14 }),
                /* @__PURE__ */ n("span", { children: "使用" })
              ]
            }
          ) : void 0,
          onClose: s
        }
      ),
      children: /* @__PURE__ */ n("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ n("div", { className: "wb-detail-scroll", children: y ? /* @__PURE__ */ o("div", { className: "wb-detail-content-state", children: [
        /* @__PURE__ */ n(ie, { size: 18, className: "wb-detail-spin" }),
        /* @__PURE__ */ n("span", { children: "正在读取官方素材" })
      ] }) : m ? /* @__PURE__ */ o("div", { className: "wb-detail-content-state is-error", children: [
        /* @__PURE__ */ n("span", { children: m }),
        /* @__PURE__ */ o("button", { type: "button", onClick: () => {
          u();
        }, children: [
          /* @__PURE__ */ n(Ae, { size: 13 }),
          "重试"
        ] })
      ] }) : /* @__PURE__ */ n("div", { className: `wb-detail-readonly-content is-${l.kind}`, children: /* @__PURE__ */ n(
        Ue,
        {
          kind: l.kind,
          content: l.version?.content,
          summary: l.summary
        }
      ) }) }) })
    }
  );
}
const Ur = "shemic:web-content-import";
function Te(e) {
  return !!(e && (e.status === "pending" || e.status === "discovering" || e.status === "running"));
}
function qr(e, t) {
  return `${Ur}:${e}:${t}`;
}
function Br(e) {
  if (typeof window > "u") return 0;
  try {
    const t = Number(window.localStorage.getItem(e) || 0);
    return Number.isFinite(t) && t > 0 ? t : 0;
  } catch {
    return 0;
  }
}
function Ge(e, t) {
  if (!(typeof window > "u" || t <= 0))
    try {
      window.localStorage.setItem(e, String(t));
    } catch {
    }
}
function Ze(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.removeItem(e);
    } catch {
    }
}
function Wr() {
  return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : `import-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
function Jr({
  disabled: e,
  task: t,
  onClick: r
}) {
  const a = Te(t), s = a ? Math.min(100, Math.max(0, t.progress)) : 0, i = a ? `导入 ${s}%` : "导入";
  return /* @__PURE__ */ n(
    ne,
    {
      label: a ? t.stageMessage || "正在导入" : "导入网络内容",
      children: /* @__PURE__ */ o(
        "button",
        {
          type: "button",
          className: "wb-asset-import-button",
          disabled: e,
          "aria-busy": a,
          onClick: r,
          children: [
            a ? /* @__PURE__ */ n(ie, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ n(Gt, { "aria-hidden": "true" }),
            /* @__PURE__ */ n("span", { children: i }),
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
const Pe = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!Pe || Object.keys(Pe).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const ft = Pe.joinSiteApi, pt = Pe.request;
async function Hr(e) {
  const t = await pt(
    ft("workbench/web_content_import"),
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
  return ht(
    ut(t, "创建网页内容导入任务失败")
  );
}
async function $t(e) {
  const t = await pt(
    ft("workbench/web_content_import_task"),
    "get",
    {
      team_id: e.teamID,
      project_id: e.projectID || void 0,
      canvas_id: e.canvasID || void 0,
      task_id: e.taskID
    },
    { reportError: !1 }
  );
  return ht(
    ut(t, "加载网页内容导入任务失败")
  );
}
async function Dt(e) {
  const t = await pt(
    ft("workbench/web_content_import_tasks"),
    "get",
    {
      team_id: e.teamID,
      project_id: e.projectID || void 0,
      canvas_id: e.canvasID || void 0
    },
    { reportError: !1 }
  ), r = ut(t, "加载网页内容导入任务失败");
  return ze(r.items).map(ht).filter((a) => a.id > 0);
}
function ht(e) {
  const t = Yt(e), r = ze(t.assets).map(Dn).filter((a) => a.id > 0);
  return {
    id: Qe(t.id),
    canvasID: Qe(t.canvas_id),
    source: le(t.source),
    status: Xr(t.status),
    stageMessage: le(t.stage_message),
    progress: Math.min(100, De(t.progress)),
    itemTotal: De(t.item_total),
    successCount: De(t.success_count),
    skippedCount: De(t.skipped_count),
    failedCount: De(t.failed_count),
    errorMessage: le(t.error_message),
    assets: r,
    warnings: Zr(t.warnings),
    items: ze(t.items).map(Gr).filter((a) => a.id > 0)
  };
}
function Gr(e) {
  const t = Yt(e);
  return {
    id: Qe(t.id),
    platform: le(t.platform),
    sourceURL: le(t.source_url),
    title: le(t.title),
    status: le(t.status),
    stageMessage: le(t.stage_message),
    errorMessage: le(t.error_message)
  };
}
function Zr(e) {
  return ze(e).map(le).filter(Boolean);
}
function Xr(e) {
  const t = le(e);
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
function Yr({
  open: e,
  teamID: t,
  projectID: r,
  canvasID: a,
  onClose: s,
  onImported: i,
  onTaskChange: l
}) {
  const [f, y] = w(""), [d, m] = w(null), [p, u] = w(!1), [k, g] = w(""), S = K(e), x = K(s), L = K(i), F = K(/* @__PURE__ */ new Set()), c = K(null), v = `${qr(t, r)}:${a}`, z = Te(d) && d?.id || 0;
  H(() => {
    S.current = e, x.current = s, L.current = i;
  }, [s, i, e]), H(() => {
    l?.(d);
  }, [l, d]), H(() => {
    let O = !1;
    F.current.clear(), m(null), y(""), g(""), u(!1), c.current = null;
    async function C() {
      try {
        const N = Br(v);
        let R = null;
        if (N > 0)
          try {
            R = await $t({
              teamID: t,
              projectID: r,
              canvasID: a,
              taskID: N
            });
          } catch {
            Ze(v);
          }
        if (R || (R = (await Dt({
          teamID: t,
          projectID: r,
          canvasID: a
        }))[0] || null), O || !R) return;
        y(R.source), m(R), Ge(v, R.id);
      } catch {
      }
    }
    return C(), () => {
      O = !0;
    };
  }, [a, r, v, t]), H(() => {
    if (z <= 0) return;
    let O = !1, C = 0;
    async function N() {
      try {
        const R = await $t({
          teamID: t,
          projectID: r,
          canvasID: a,
          taskID: z
        });
        if (O || (m(R), g(""), !Te(R))) return;
        C = window.setTimeout(N, 1200);
      } catch (R) {
        if (O) return;
        S.current && g(re(R, "刷新导入进度失败")), C = window.setTimeout(N, 2500);
      }
    }
    return C = window.setTimeout(N, 700), () => {
      O = !0, window.clearTimeout(C);
    };
  }, [z, a, r, t]), H(() => {
    if (!(!d || Te(d))) {
      if (Ze(v), d.status === "failed") {
        g(d.errorMessage || "网页内容导入失败");
        return;
      }
      if (!F.current.has(d.id)) {
        if (d.assets.length === 0) {
          g(d.errorMessage || "导入完成，但没有生成可用素材");
          return;
        }
        F.current.add(d.id), c.current = null, L.current(d.assets, d.warnings, d), m(null), y(""), S.current && x.current();
      }
    }
  }, [v, d]);
  const Z = te(async () => {
    const O = f.trim();
    if (!O || p || Te(d)) return;
    u(!0), g("");
    const C = c.current?.source === O ? c.current : { source: O, requestID: Wr() };
    c.current = C;
    try {
      const N = await Hr({
        teamID: t,
        projectID: r,
        canvasID: a,
        requestID: C.requestID,
        source: O
      });
      c.current = null, m(N), Ge(v, N.id);
    } catch (N) {
      try {
        const G = (await Dt({
          teamID: t,
          projectID: r,
          canvasID: a
        })).find((Y) => Y.source === O);
        if (G) {
          c.current = null, m(G), Ge(v, G.id);
          return;
        }
      } catch {
      }
      g(re(N, "创建网页内容导入任务失败"));
    } finally {
      u(!1);
    }
  }, [a, r, f, v, p, d, t]), q = te(() => {
    Te(d) || (Ze(v), c.current = null, m(null), g(""));
  }, [v, d]);
  return {
    source: f,
    setSource: y,
    task: d,
    submitting: p,
    active: Te(d),
    error: k,
    submit: Z,
    reset: q
  };
}
function Qr({
  open: e,
  teamID: t,
  projectID: r = 0,
  canvasID: a = 0,
  platforms: s,
  maxItems: i,
  onClose: l,
  onImported: f,
  onTaskChange: y
}) {
  const d = Yr({
    open: e,
    teamID: t,
    projectID: r,
    canvasID: a,
    onClose: l,
    onImported: f,
    onTaskChange: y
  });
  H(() => {
    if (!e) return;
    const p = (u) => {
      u.key === "Escape" && (u.preventDefault(), u.stopImmediatePropagation(), l());
    };
    return window.addEventListener("keydown", p, !0), () => window.removeEventListener("keydown", p, !0);
  }, [l, e]);
  function m(p) {
    p.preventDefault(), d.submit();
  }
  return !e || typeof document > "u" ? null : lt(
    /* @__PURE__ */ n(
      "div",
      {
        className: "wb-asset-form-backdrop",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "导入网络内容",
        onMouseDown: (p) => {
          p.target === p.currentTarget && l();
        },
        children: /* @__PURE__ */ o(
          "form",
          {
            className: "wb-asset-form-dialog wb-asset-import-dialog",
            onSubmit: m,
            children: [
              /* @__PURE__ */ o("header", { children: [
                /* @__PURE__ */ o("div", { children: [
                  /* @__PURE__ */ n("span", { className: "wb-asset-form-icon", children: /* @__PURE__ */ n(Gt, { "aria-hidden": "true" }) }),
                  /* @__PURE__ */ o("div", { children: [
                    /* @__PURE__ */ n("h2", { children: "导入网络内容" }),
                    /* @__PURE__ */ o("p", { children: [
                      "支持：",
                      s.map((p) => p.name).join("、") || "已配置的平台"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ n(ne, { label: "关闭", children: /* @__PURE__ */ o("button", { type: "button", onClick: l, children: [
                  /* @__PURE__ */ n(ct, { "aria-hidden": "true" }),
                  /* @__PURE__ */ n("span", { className: "sr-only", children: "关闭" })
                ] }) })
              ] }),
              d.task ? /* @__PURE__ */ n(
                ea,
                {
                  task: d.task,
                  active: d.active,
                  platforms: s
                }
              ) : /* @__PURE__ */ o("label", { children: [
                /* @__PURE__ */ n("span", { children: "链接或分享内容" }),
                /* @__PURE__ */ n(
                  "textarea",
                  {
                    autoFocus: !0,
                    value: d.source,
                    maxLength: 8192,
                    disabled: d.submitting,
                    placeholder: "粘贴内容链接或分享文本，可一次粘贴多条",
                    onChange: (p) => d.setSource(p.target.value)
                  }
                ),
                /* @__PURE__ */ o("small", { className: "wb-asset-import-help", children: [
                  "自动识别对应平台，一次最多 ",
                  i,
                  " 条，可混合粘贴"
                ] })
              ] }),
              d.error ? /* @__PURE__ */ o("p", { className: "wb-asset-form-error wb-asset-import-error", children: [
                /* @__PURE__ */ n(Zt, { "aria-hidden": "true" }),
                /* @__PURE__ */ n("span", { children: d.error })
              ] }) : null,
              /* @__PURE__ */ o("footer", { children: [
                /* @__PURE__ */ n("button", { type: "button", onClick: l, children: "关闭" }),
                d.task?.status === "failed" ? /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "is-primary",
                    onClick: d.reset,
                    children: "重新导入"
                  }
                ) : d.active ? null : /* @__PURE__ */ o(
                  "button",
                  {
                    type: "submit",
                    className: "is-primary",
                    disabled: d.submitting || !d.source.trim(),
                    children: [
                      d.submitting ? /* @__PURE__ */ n(ie, { className: "is-spinning" }) : null,
                      d.submitting ? "提交中" : "导入"
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
function ea({
  task: e,
  active: t,
  platforms: r
}) {
  const a = Math.min(100, Math.max(0, e.progress)), s = new Map(
    r.map((f) => [f.key, f.name])
  ), i = e.successCount + e.skippedCount, l = e.failedCount ? `已导入 ${i} 项，${e.failedCount} 项失败` : t ? e.stageMessage || "正在导入" : `已导入 ${i} 项`;
  return /* @__PURE__ */ o("section", { className: "wb-asset-import-status", "aria-live": "polite", children: [
    /* @__PURE__ */ o("div", { className: "wb-asset-import-status-head", children: [
      t ? /* @__PURE__ */ n(ie, { className: "is-spinning", "aria-hidden": "true" }) : e.status === "failed" ? /* @__PURE__ */ n(Zt, { "aria-hidden": "true" }) : /* @__PURE__ */ n(ur, { "aria-hidden": "true" }),
      /* @__PURE__ */ o("div", { children: [
        /* @__PURE__ */ n("strong", { children: l }),
        /* @__PURE__ */ o("span", { children: [
          "共 ",
          e.itemTotal,
          " 条内容"
        ] })
      ] }),
      /* @__PURE__ */ o("b", { children: [
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
    /* @__PURE__ */ n("div", { className: "wb-asset-import-items", children: e.items.map((f, y) => /* @__PURE__ */ o(
      "div",
      {
        className: f.status === "failed" ? "is-failed" : "",
        children: [
          /* @__PURE__ */ n("b", { children: s.get(f.platform) || f.platform }),
          /* @__PURE__ */ n("span", { title: f.sourceURL, children: f.title || f.sourceURL || `第 ${y + 1} 条内容` }),
          /* @__PURE__ */ n("em", { title: Mt(f), children: Mt(f) })
        ]
      },
      f.id || `${f.platform}-${y}`
    )) })
  ] });
}
function Mt(e) {
  return e.status === "failed" ? e.errorMessage || "导入失败" : e.status === "success" ? "已导入" : e.status === "skipped" ? "已存在" : e.stageMessage || "等待导入";
}
const ta = [
  { key: "", label: "全部" },
  ...Hn
], Rt = [
  { key: "", label: "全部" },
  ...Jt
];
function na({
  filters: e,
  options: t,
  scopeProjectID: r = 0,
  sourceLabels: a = {},
  sourceVisibility: s = {},
  allowedKinds: i = [],
  includeOfficial: l = !0,
  view: f,
  collectionName: y,
  onCollectionBack: d,
  onChange: m,
  onViewChange: p
}) {
  const u = [
    { key: "", label: "全部" },
    ...Jn.filter(
      (c) => s[c.key] !== !1 && (c.key !== "official" || l && t.materialLibrary.enabled && !!Ye(t.materialLibrary, i))
    ).map((c) => ({
      ...c,
      label: a[c.key] || c.label
    }))
  ], k = t.assetCates.length > 0, g = r || e.projectID, S = t.canvases.filter(
    (c) => (!g || c.projectID === g) && (!e.assetCateID || c.assetCateID === e.assetCateID)
  ), x = e.sourceType === "official" ? t.materialLibrary.kinds.filter(
    (c) => i.length === 0 || i.includes(c.assetKind)
  ).map((c) => ({ key: c.assetKind, label: c.name })) : i.length > 0 ? Rt.filter(
    (c) => c.key && i.includes(c.key)
  ) : Rt, L = _t(
    t.materialLibrary,
    e.kind
  );
  function F(c) {
    const v = c === "project" ? r : 0, z = c === "official" ? Ye(t.materialLibrary, i) : "", Z = c === "official" ? z : e.sourceType === "official" ? i.length === 1 ? i[0] : "" : e.kind;
    m({
      ...e,
      sourceType: c,
      sourceID: v,
      projectID: v,
      assetCateID: 0,
      canvasID: c === "project" ? e.canvasID : 0,
      materialCateID: 0,
      nodeKey: "",
      role: "",
      kind: Z
    });
  }
  return /* @__PURE__ */ o("div", { className: "wb-asset-filters", children: [
    y && d ? /* @__PURE__ */ n(Me, { label: "集合", children: /* @__PURE__ */ o(
      "button",
      {
        type: "button",
        className: "wb-asset-collection-back",
        onClick: d,
        children: [
          /* @__PURE__ */ n(dr, { "aria-hidden": "true" }),
          /* @__PURE__ */ n(Ht, { "aria-hidden": "true" }),
          /* @__PURE__ */ n("span", { children: y })
        ]
      }
    ) }) : /* @__PURE__ */ o(Me, { label: "来源", children: [
      /* @__PURE__ */ n(
        _e,
        {
          options: u,
          value: e.sourceType,
          onChange: F
        }
      ),
      e.sourceType === "project" ? /* @__PURE__ */ o(Ie, { children: [
        r > 0 ? null : /* @__PURE__ */ n(
          Re,
          {
            label: a.project || "创作",
            value: e.projectID,
            options: t.projects,
            onChange: (c) => m({
              ...e,
              projectID: c,
              sourceID: c,
              canvasID: 0,
              assetCateID: 0,
              nodeKey: ""
            })
          }
        ),
        k ? /* @__PURE__ */ n(
          Re,
          {
            label: "资产分类",
            value: e.assetCateID,
            options: t.assetCates,
            onChange: (c) => m({
              ...e,
              assetCateID: c,
              canvasID: 0,
              nodeKey: ""
            })
          }
        ) : null
      ] }) : null,
      e.sourceType === "project" && g > 0 && S.length > 1 ? /* @__PURE__ */ n(
        Re,
        {
          label: "画布",
          value: e.canvasID,
          options: S,
          onChange: (c) => m({ ...e, canvasID: c })
        }
      ) : null,
      e.sourceType === "tool" ? /* @__PURE__ */ n(
        Re,
        {
          label: a.tool || "工具",
          value: e.sourceID,
          options: t.tools,
          onChange: (c) => m({ ...e, sourceID: c })
        }
      ) : null,
      e.sourceType === "dialogue" ? /* @__PURE__ */ n(
        Re,
        {
          label: "角色",
          value: e.sourceID,
          options: t.dialogues,
          onChange: (c) => m({ ...e, sourceID: c })
        }
      ) : null
    ] }),
    !y && e.sourceType === "project" && k ? /* @__PURE__ */ n(Me, { label: "资产", children: /* @__PURE__ */ n(
      _e,
      {
        options: ta,
        value: e.role,
        onChange: (c) => m({ ...e, role: c })
      }
    ) }) : null,
    /* @__PURE__ */ n(
      Me,
      {
        label: "类型",
        trailing: e.sourceType === "official" ? void 0 : /* @__PURE__ */ n(ra, { view: f, onChange: p }),
        children: /* @__PURE__ */ n(
          _e,
          {
            options: x,
            value: e.kind,
            onChange: (c) => m({
              ...e,
              kind: c,
              materialCateID: e.sourceType === "official" ? 0 : e.materialCateID
            })
          }
        )
      }
    ),
    e.sourceType === "official" && L.length > 0 ? /* @__PURE__ */ n(Me, { label: "分类", children: /* @__PURE__ */ n(
      _e,
      {
        options: [
          { key: 0, label: "全部" },
          ...L.map((c) => ({
            key: c.id,
            label: c.name
          }))
        ],
        value: e.materialCateID,
        onChange: (c) => m({ ...e, materialCateID: c })
      }
    ) }) : null
  ] });
}
function Me({
  label: e,
  children: t,
  trailing: r
}) {
  return /* @__PURE__ */ o("div", { className: "wb-asset-filter-row", children: [
    /* @__PURE__ */ n("strong", { children: e }),
    /* @__PURE__ */ o("div", { className: "wb-asset-filter-controls", children: [
      t,
      r
    ] })
  ] });
}
function ra({
  view: e,
  onChange: t
}) {
  return /* @__PURE__ */ o("div", { className: "wb-asset-view-switch", role: "tablist", "aria-label": "资产视图", children: [
    /* @__PURE__ */ o(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": e === "assets",
        className: e === "assets" ? "is-active" : "",
        onClick: () => t("assets"),
        children: [
          /* @__PURE__ */ n(mr, { "aria-hidden": "true" }),
          /* @__PURE__ */ n("span", { children: "资产" })
        ]
      }
    ),
    /* @__PURE__ */ o(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": e === "trash",
        className: e === "trash" ? "is-active" : "",
        onClick: () => t("trash"),
        children: [
          /* @__PURE__ */ n(Xt, { "aria-hidden": "true" }),
          /* @__PURE__ */ n("span", { children: "回收站" })
        ]
      }
    )
  ] });
}
function _e({
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
function Re({
  label: e,
  value: t,
  options: r,
  onChange: a
}) {
  return /* @__PURE__ */ o("label", { className: "wb-asset-select", children: [
    /* @__PURE__ */ n("span", { className: "sr-only", children: e }),
    /* @__PURE__ */ o(
      "select",
      {
        value: t || "",
        onChange: (s) => a(Number(s.target.value)),
        children: [
          /* @__PURE__ */ o("option", { value: "", children: [
            "全部",
            e
          ] }),
          r.map((s) => /* @__PURE__ */ n("option", { value: s.id, children: s.name }, s.id))
        ]
      }
    )
  ] });
}
function an({
  uploading: e,
  progress: t,
  onClick: r
}) {
  const a = aa(e, t), s = e && t && (t.phase !== "preparing" || t.percent > 0) ? t.percent : null;
  return /* @__PURE__ */ n(ne, { label: a, children: /* @__PURE__ */ o(
    "button",
    {
      type: "button",
      className: "wb-asset-local-upload",
      disabled: e,
      "aria-busy": e,
      onClick: r,
      children: [
        e ? /* @__PURE__ */ n(ie, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ n(fr, { "aria-hidden": "true" }),
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
function aa(e, t) {
  return e ? t ? t.phase === "preparing" ? t.percent > 0 ? `上传中 ${t.percent}%` : "上传中" : t.phase === "saving" ? "处理中" : `上传中 ${t.percent}%` : "上传中" : "上传";
}
const Ee = {
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
const rt = window.DeverFront?.sdk?.getCompatModule("@/components/confirm-dialog");
if (!rt || Object.keys(rt).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/confirm-dialog");
const sa = rt.ConfirmDialog, Et = {
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
}, Se = {
  items: [],
  page: 1,
  pageSize: 24,
  total: 0,
  hasMore: !1
};
function ia({
  teamID: e,
  scopeProjectID: t = 0,
  scopeCanvasID: r = 0,
  initialFilters: a,
  selectable: s = !1,
  excludeCollections: i = !1,
  selectedAssetIDs: l,
  selectedAssetKeys: f,
  usedAssetIDs: y,
  usedAssetKeys: d,
  includeOfficial: m = !0,
  allowedKinds: p,
  onSelect: u,
  onContinue: k,
  canContinue: g,
  onAssetChanged: S,
  onAssetRemoved: x,
  onLocalUpload: L,
  uploadAccept: F,
  headerAction: c,
  reloadSignal: v = 0,
  catalogOptions: z,
  contentMode: Z = "preview",
  detailLayer: q = "default",
  className: O = ""
}) {
  const C = vr(), { labels: N, visibility: R } = en(), G = JSON.stringify(p || []), Y = se(
    () => ca(p),
    [G]
  ), T = JSON.stringify({ initialFilters: a, normalizedAllowedKinds: Y }), ae = se(
    () => oa(a, Y),
    [T]
  ), [j, J] = w(ae), [$, W] = w(
    null
  ), [V, E] = w("assets"), [oe, ce] = w(Et), Q = Gn(
    oe.webContentImportEnabled,
    Y
  ), [B, b] = w(Se), [M, A] = w(null), [D, I] = w(null), [_, U] = w(null), [ee, de] = w(0), [me, be] = w(!0), [we, ge] = w(!1), [fe, ve] = w(null), [sn, Be] = w(!1), [on, yt] = w(
    null
  ), [cn, wt] = w(!0), [gt, pe] = w(""), [ln, un] = w(0), he = K(0), vt = K(null), ke = K(ae), Ce = K("assets"), dn = JSON.stringify({
    selectedAssetIDs: l,
    selectedAssetKeys: f
  }), mn = se(
    () => /* @__PURE__ */ new Set([
      ...f || [],
      ...(l || []).map((h) => `asset:${h}`)
    ]),
    [dn]
  ), fn = JSON.stringify({ usedAssetIDs: y, usedAssetKeys: d }), pn = se(
    () => /* @__PURE__ */ new Set([
      ...d || [],
      ...(y || []).map((h) => `asset:${h}`)
    ]),
    [fn]
  );
  H(() => {
    he.current += 1, J(ae), ke.current = ae, W(null), E("assets"), Ce.current = "assets", ce(Et), b(Se), A(null), I(null), U(null), de(0), ge(!1), ve(null), Be(!1), yt(null), pe("");
  }, [C, ae, t, e]), H(() => {
    let h = !0;
    return wt(!0), Mn(e, z, C).then((P) => {
      h && (ce(P), J((X) => {
        const Ne = la(
          X,
          P,
          Y,
          m
        );
        return $ || (ke.current = Ne), Ne;
      }));
    }).catch((P) => {
      h && pe(re(P, "加载资产筛选项失败"));
    }).finally(() => {
      h && wt(!1);
    }), () => {
      h = !1;
    };
  }, [
    z,
    m,
    Y,
    C,
    e
  ]);
  const Fe = te(
    async (h) => {
      const P = ++he.current;
      be(!0), pe("");
      try {
        const X = await Rn({
          teamID: e,
          scopeProjectID: t,
          filters: j,
          view: V,
          contentMode: Z,
          page: h,
          pageSize: 24,
          collectionID: $?.id,
          excludeCollections: i,
          requestScopeKey: C
        });
        P === he.current && b(X);
      } catch (X) {
        P === he.current && pe(re(X, "加载资产失败"));
      } finally {
        P === he.current && be(!1);
      }
    },
    [
      $?.id,
      Z,
      i,
      j,
      C,
      t,
      e,
      V
    ]
  );
  H(() => {
    Fe(1);
  }, [Fe, v, ln]);
  function hn(h) {
    h.sourceType === "official" && V !== "assets" && (E("assets"), Ce.current = "assets"), J(h), $ || (ke.current = h), b((P) => ({ ...P, page: 1 }));
  }
  function $e() {
    un((h) => h + 1);
  }
  function bn(h) {
    if (h.kind !== "collection") {
      A(h);
      return;
    }
    ke.current = j, Ce.current = V, W(h), J({
      ...Ee,
      kind: j.kind === "collection" ? Y.length === 1 ? Y[0] : "" : j.kind
    }), b(Se), A(null), pe("");
  }
  function yn() {
    he.current += 1, W(null), J(ke.current), E(Ce.current), b(Se), A(null), pe("");
  }
  function wn(h) {
    h === V || ee || (he.current += 1, E(h), $ || (Ce.current = h), b(Se), A(null), I(null), U(null), pe(""));
  }
  async function gn() {
    if (!_ || ee) return;
    const h = _.id;
    de(h);
    try {
      await Ln({ teamID: e, assetID: h }), U(null), M?.libraryType === "asset" && M.id === h && A(null), x?.(h), ue.success("资产已移入回收站"), $e();
    } catch (P) {
      ue.error(re(P, "删除资产失败"));
    } finally {
      de(0);
    }
  }
  async function vn(h) {
    if (!ee) {
      de(h.id);
      try {
        const P = await En({ teamID: e, assetID: h.id });
        S?.(P), ue.success("资产已恢复"), $e();
      } catch (P) {
        ue.error(re(P, "恢复资产失败"));
      } finally {
        de(0);
      }
    }
  }
  async function kn(h) {
    const P = Array.from(h.target.files || []);
    if (h.target.value = "", !(!L || P.length === 0 || we)) {
      ge(!0), ve(null);
      try {
        const X = await L(P, {
          onProgress: ve
        });
        if (X.length === 0)
          throw new Error("上传完成，但没有生成可用资产");
        X.forEach((Oe) => S?.(Oe));
        const Ne = {
          ...Ee,
          sourceType: "upload",
          canvasID: j.canvasID || r,
          kind: Y.length === 1 ? Y[0] : ""
        };
        he.current += 1, W(null), E("assets"), Ce.current = "assets", J(Ne), ke.current = Ne, b(Se), A(null), pe(""), ue.success(`已上传 ${X.length} 项资产`);
      } catch (X) {
        ue.error(re(X, "上传资产失败"));
      } finally {
        ge(!1), ve(null);
      }
    }
  }
  function Cn(h, P, X) {
    h.forEach((Je) => S?.(Je));
    const Ne = new Set(h.map((Je) => Je.kind)), Oe = {
      ...Ee,
      sourceType: "import",
      canvasID: j.canvasID || r,
      kind: Ne.size === 1 && h[0]?.kind || ""
    };
    he.current += 1, W(null), E("assets"), Ce.current = "assets", J(Oe), ke.current = Oe, b(Se), A(null), pe("");
    const We = X.successCount + X.skippedCount;
    if (X.failedCount > 0) {
      ue.warning(`已导入 ${We} 项，${X.failedCount} 项失败`);
      return;
    }
    if (P.length > 0) {
      ue.warning(`已导入 ${We} 项，部分媒体保留原地址`);
      return;
    }
    ue.success(`已导入 ${We} 项内容`);
  }
  return /* @__PURE__ */ o("section", { className: `wb-asset-browser ${O}`.trim(), children: [
    /* @__PURE__ */ o("header", { className: "wb-asset-browser-head", children: [
      /* @__PURE__ */ n(
        na,
        {
          filters: j,
          options: oe,
          scopeProjectID: t,
          sourceLabels: N,
          sourceVisibility: R,
          allowedKinds: Y,
          includeOfficial: m,
          view: V,
          collectionName: $?.name,
          onCollectionBack: $ ? yn : void 0,
          onChange: hn,
          onViewChange: wn
        }
      ),
      /* @__PURE__ */ o("div", { className: "wb-asset-browser-actions", children: [
        /* @__PURE__ */ n("span", { children: me ? "正在加载" : `${B.total} 项` }),
        /* @__PURE__ */ n(
          ne,
          {
            label: j.sourceType === "official" ? "刷新官方素材" : "刷新资产",
            children: /* @__PURE__ */ o("button", { type: "button", onClick: $e, children: [
              /* @__PURE__ */ n(pr, { className: me ? "is-spinning" : "" }),
              /* @__PURE__ */ n("span", { className: "sr-only", children: j.sourceType === "official" ? "刷新官方素材" : "刷新资产" })
            ] })
          }
        ),
        !$ && L ? /* @__PURE__ */ o(Ie, { children: [
          /* @__PURE__ */ n(
            an,
            {
              uploading: we,
              progress: fe,
              onClick: () => vt.current?.click()
            }
          ),
          /* @__PURE__ */ n(
            "input",
            {
              ref: vt,
              type: "file",
              hidden: !0,
              multiple: !0,
              accept: F,
              onChange: kn
            }
          )
        ] }) : null,
        $ ? null : c,
        !$ && Q ? /* @__PURE__ */ n(
          Jr,
          {
            disabled: we,
            task: on,
            onClick: () => Be(!0)
          }
        ) : null
      ] })
    ] }),
    /* @__PURE__ */ n("div", { className: "wb-asset-browser-body", children: me && B.items.length === 0 ? /* @__PURE__ */ n(Xe, { icon: /* @__PURE__ */ n(ie, { className: "is-spinning" }) }) : gt ? /* @__PURE__ */ n(Xe, { text: gt, error: !0 }) : B.items.length === 0 ? /* @__PURE__ */ n(
      Xe,
      {
        icon: V === "trash" ? /* @__PURE__ */ n(Xt, {}) : /* @__PURE__ */ n(hr, {}),
        text: cn ? "正在读取资产配置" : V === "trash" ? "回收站为空" : $ ? "集合内暂无符合条件的资产" : j.sourceType === "official" ? "当前分类暂无官方素材" : "暂无符合条件的资产"
      }
    ) : /* @__PURE__ */ n("div", { className: "wb-asset-grid", children: B.items.map((h) => {
      const P = ye(h);
      return /* @__PURE__ */ n(
        Cr,
        {
          asset: h,
          sourceLabels: N,
          view: V,
          selectable: h.kind !== "collection" && s && V === "assets",
          selected: V === "assets" && mn.has(P),
          used: V === "assets" && pn.has(P),
          busy: ee === h.id,
          readOnly: h.libraryType === "material",
          onOpen: bn,
          onRename: I,
          onDelete: V === "assets" ? U : void 0,
          onRestore: V === "trash" ? vn : void 0,
          onSelect: u
        },
        P
      );
    }) }) }),
    B.total > B.pageSize ? /* @__PURE__ */ o("footer", { className: "wb-asset-pagination", children: [
      /* @__PURE__ */ n(ne, { label: "上一页", children: /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: B.page <= 1 || me,
          onClick: () => {
            Fe(B.page - 1);
          },
          children: /* @__PURE__ */ n(br, {})
        }
      ) }),
      /* @__PURE__ */ o("span", { children: [
        B.page,
        " / ",
        Math.max(1, Math.ceil(B.total / B.pageSize))
      ] }),
      /* @__PURE__ */ n(ne, { label: "下一页", children: /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: !B.hasMore || me,
          onClick: () => {
            Fe(B.page + 1);
          },
          children: /* @__PURE__ */ n(yr, {})
        }
      ) })
    ] }) : null,
    M?.libraryType === "asset" ? /* @__PURE__ */ n(
      Or,
      {
        teamID: e,
        assetID: M.id,
        selectable: s && V === "assets",
        layer: q,
        onClose: () => A(null),
        onSelect: u ? (h) => {
          A(null), u(h);
        } : void 0,
        onContinue: k ? (h) => {
          A(null), k(h);
        } : void 0,
        canContinue: g,
        onAssetChanged: (h) => {
          $e(), S?.(h);
        }
      }
    ) : null,
    M?.libraryType === "material" ? /* @__PURE__ */ n(
      jr,
      {
        teamID: e,
        material: M,
        selectable: s && V === "assets",
        layer: q,
        onClose: () => A(null),
        onSelect: u ? (h) => {
          A(null), u(h);
        } : void 0
      }
    ) : null,
    /* @__PURE__ */ n(
      Qt,
      {
        teamID: e,
        asset: D,
        onClose: () => I(null),
        onRenamed: (h) => {
          b((P) => ({
            ...P,
            items: P.items.map(
              (X) => X.id === h.id ? h : X
            )
          })), S?.(h), $e();
        }
      }
    ),
    Q ? /* @__PURE__ */ n(
      Qr,
      {
        open: sn,
        teamID: e,
        projectID: t,
        canvasID: j.canvasID || r,
        platforms: oe.webContentImportPlatforms,
        maxItems: oe.webContentImportMaxItems,
        onClose: () => Be(!1),
        onImported: Cn,
        onTaskChange: yt
      }
    ) : null,
    /* @__PURE__ */ n(
      sa,
      {
        open: !!_,
        layerZIndex: Ut,
        onOpenChange: (h) => {
          !h && !ee && U(null);
        },
        title: "移入回收站？",
        desc: _?.kind === "collection" ? `“${_.name}”及集合内素材将移入回收站，你可以稍后恢复。` : `“${_?.name || "该资产"}”将从资产列表移除，你可以稍后在回收站中恢复。`,
        confirmText: "移入回收站",
        destructive: !0,
        isLoading: !!ee,
        handleConfirm: () => {
          gn();
        }
      }
    )
  ] });
}
function Xe({
  icon: e,
  text: t = "",
  error: r = !1
}) {
  return /* @__PURE__ */ o("div", { className: `wb-asset-state ${r ? "is-error" : ""}`.trim(), children: [
    e,
    t ? /* @__PURE__ */ n("p", { children: t }) : null
  ] });
}
function oa(e, t) {
  const r = { ...Ee, ...e || {} };
  return t.length > 0 && !t.includes(r.kind) && (r.kind = t[0]), r.projectID && (r.sourceType = "project", r.sourceID = r.projectID), r.sourceType !== "project" && (r.projectID = 0, r.assetCateID = 0, r.nodeKey = "", r.role = ""), r;
}
function ca(e) {
  const t = Jt.filter(
    (a) => a.key !== "collection"
  ), r = t.map((a) => a.key).filter((a) => e?.includes(a));
  return r.length === t.length ? [] : r;
}
function la(e, t, r, a) {
  if (e.sourceType !== "official") return e;
  const s = Ye(
    t.materialLibrary,
    r
  );
  if (!a || !t.materialLibrary.enabled || !s)
    return {
      ...Ee,
      kind: r.length === 1 ? r[0] : ""
    };
  const i = new Set(
    t.materialLibrary.kinds.map((y) => y.assetKind)
  ), l = e.kind && i.has(e.kind) && (r.length === 0 || r.includes(e.kind)) ? e.kind : s, f = new Set(
    _t(t.materialLibrary, l).map(
      (y) => y.id
    )
  );
  return {
    ...e,
    kind: l,
    materialCateID: f.has(e.materialCateID) ? e.materialCateID : 0
  };
}
function ua({
  open: e,
  teamID: t,
  scopeProjectID: r = 0,
  title: a = "选择资产",
  description: s = "使用资产当前版本",
  initialFilters: i,
  allowedKinds: l,
  initialSelectedAssetIDs: f = [],
  initialSelectedAssetKeys: y = [],
  usedAssetIDs: d = [],
  usedAssetKeys: m = [],
  includeOfficial: p = !0,
  multiple: u = !1,
  maxSelection: k = 1,
  confirmSelection: g = !1,
  contentMode: S = "preview",
  validateAsset: x,
  uploadAccept: L,
  onUpload: F,
  onClose: c,
  onConfirm: v
}) {
  const z = JSON.stringify({
    initialSelectedAssetIDs: f,
    initialSelectedAssetKeys: y
  }), Z = se(
    () => Lt([
      ...y,
      ...f.map((D) => `asset:${D}`)
    ]),
    [z]
  ), q = JSON.stringify(i || {}), O = se(
    () => JSON.parse(q),
    [q]
  ), [C, N] = w(
    Z
  ), [R, G] = w(/* @__PURE__ */ new Map()), [Y, T] = w(
    O
  ), [ae, j] = w(""), [J, $] = w(!1), [W, V] = w(null), [E, oe] = w(0), ce = K(null), Q = u ? Math.max(1, k) : 1;
  H(() => {
    e && (N(Z.slice(0, Q)), G(/* @__PURE__ */ new Map()), T(O), j(""), $(!1), V(null));
  }, [
    O,
    Z,
    e,
    Q,
    r,
    t
  ]), H(() => {
    if (!e) return;
    const D = (I) => {
      I.key === "Escape" && !J && c();
    };
    return window.addEventListener("keydown", D), () => window.removeEventListener("keydown", D);
  }, [c, e, J]);
  async function B(D) {
    const I = Array.from(D.target.files || []);
    if (D.target.value = "", !F || I.length === 0 || J) return;
    const _ = u ? Math.max(Q - C.length, 0) : 1;
    if (_ <= 0) {
      j(`最多选择 ${Q} 项素材。`);
      return;
    }
    const U = I.slice(0, _), ee = Nn(
      U,
      V
    );
    $(!0), V(null), j("");
    const de = [], me = [];
    try {
      for (const [be, we] of U.entries()) {
        ee.start(be);
        try {
          const ge = await F([we], {
            onProgress: (fe) => ee.report(
              be,
              fe.loaded,
              fe.total,
              fe.phase
            )
          });
          for (const fe of ge) {
            const ve = x?.(fe) || "";
            ve ? me.push(`${we.name}：${ve}`) : fe.id > 0 && de.push(fe);
          }
        } catch (ge) {
          me.push(`${we.name}：${re(ge, "上传失败")}`);
        } finally {
          ee.complete(be);
        }
      }
      de.length > 0 && (b(de), T({
        sourceType: "upload",
        kind: l?.length === 1 ? l[0] : ""
      }), oe((be) => be + 1)), j(me.join("；"));
    } finally {
      $(!1), V(null);
    }
  }
  function b(D) {
    const I = Array.from(
      new Map(D.map((_) => [ye(_), _])).values()
    );
    G((_) => {
      const U = new Map(_);
      return I.forEach((ee) => U.set(ye(ee), ee)), U;
    }), N(
      (_) => u ? Lt([
        ..._,
        ...I.map(ye)
      ]).slice(0, Q) : I[0] ? [ye(I[0])] : _
    );
  }
  function M(D) {
    const I = ye(D);
    if (g && u && C.includes(I)) {
      N(
        (U) => U.filter((ee) => ee !== I)
      ), G((U) => {
        const ee = new Map(U);
        return ee.delete(I), ee;
      }), j("");
      return;
    }
    const _ = x?.(D) || "";
    if (_) {
      j(_);
      return;
    }
    if (j(""), !g) {
      v([D], [I]), c();
      return;
    }
    if (!u) {
      N([I]), G(/* @__PURE__ */ new Map([[I, D]]));
      return;
    }
    if (C.length >= Q) {
      j(`最多选择 ${Q} 项素材。`);
      return;
    }
    N((U) => [...U, I]), G((U) => new Map(U).set(I, D));
  }
  function A() {
    const D = C.map((I) => R.get(I)).filter((I) => !!I);
    v(D, C), c();
  }
  return !e || typeof document > "u" ? null : lt(
    /* @__PURE__ */ n(
      "div",
      {
        className: "wb-asset-reference-backdrop",
        "data-slot": "dialog-layer",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": a,
        onMouseDown: (D) => {
          D.target === D.currentTarget && !J && c();
        },
        children: /* @__PURE__ */ o("div", { className: "wb-asset-reference-dialog", children: [
          /* @__PURE__ */ o("header", { children: [
            /* @__PURE__ */ o("div", { children: [
              /* @__PURE__ */ n("h2", { children: a }),
              /* @__PURE__ */ n("p", { children: s })
            ] }),
            /* @__PURE__ */ n(ne, { label: "关闭", children: /* @__PURE__ */ o("button", { type: "button", disabled: J, onClick: c, children: [
              /* @__PURE__ */ n(ct, { "aria-hidden": "true" }),
              /* @__PURE__ */ n("span", { className: "sr-only", children: "关闭" })
            ] }) })
          ] }),
          ae ? /* @__PURE__ */ n("p", { className: "wb-asset-picker-message", children: ae }) : null,
          /* @__PURE__ */ n(
            ia,
            {
              teamID: t,
              scopeProjectID: r,
              initialFilters: Y,
              allowedKinds: l,
              contentMode: S,
              detailLayer: "nested",
              selectable: !0,
              selectedAssetKeys: C,
              usedAssetIDs: d,
              usedAssetKeys: m,
              includeOfficial: p,
              reloadSignal: E,
              onAssetChanged: (D) => {
                const I = ye(D);
                C.includes(I) && G(
                  (_) => new Map(_).set(I, D)
                );
              },
              onAssetRemoved: (D) => {
                const I = `asset:${D}`;
                N(
                  (_) => _.filter((U) => U !== I)
                ), G((_) => {
                  const U = new Map(_);
                  return U.delete(I), U;
                });
              },
              headerAction: F ? /* @__PURE__ */ o(Ie, { children: [
                /* @__PURE__ */ n(
                  an,
                  {
                    uploading: J,
                    progress: W,
                    onClick: () => ce.current?.click()
                  }
                ),
                /* @__PURE__ */ n(
                  "input",
                  {
                    ref: ce,
                    type: "file",
                    hidden: !0,
                    multiple: u,
                    accept: L,
                    onChange: B
                  }
                )
              ] }) : void 0,
              onSelect: M
            }
          ),
          g ? /* @__PURE__ */ o("footer", { className: "wb-asset-picker-footer", children: [
            /* @__PURE__ */ o("span", { children: [
              "已选 ",
              C.length,
              u ? ` / ${Q}` : "",
              " 项"
            ] }),
            /* @__PURE__ */ o("div", { children: [
              /* @__PURE__ */ n("button", { type: "button", onClick: c, children: "取消" }),
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "is-primary",
                  disabled: J || C.length === 0,
                  onClick: A,
                  children: "确认使用"
                }
              )
            ] })
          ] }) : null
        ] })
      }
    ),
    document.body
  );
}
function Lt(e) {
  return Array.from(
    new Set(
      e.map((t) => String(t || "").trim()).filter((t) => /^(asset|material):[1-9]\d*$/.test(t))
    )
  );
}
function xa({
  teamID: e,
  scopeProjectID: t = 0,
  initialFilters: r,
  allowedKinds: a,
  onSelect: s,
  onUpload: i
}) {
  const l = JSON.stringify(r || {}), f = JSON.stringify(a || []), y = se(
    () => JSON.parse(l),
    [l]
  ), d = se(
    () => JSON.parse(f),
    [f]
  );
  return se(
    () => ({
      trigger: "@",
      referenceTypes: ["asset", "material"],
      loadPreview: async (m) => {
        const p = m.refType === "material" ? await Ot(e, m.refId) : (await Ft(e, m.refId)).asset, u = bt(p);
        return {
          refType: m.refType,
          refId: p.id,
          title: p.name,
          text: p.summary,
          media: u,
          content: u.length > 0 ? void 0 : at(p.kind, p.version?.content)
        };
      },
      renderPicker: (m) => /* @__PURE__ */ n(
        da,
        {
          ...m,
          teamID: e,
          scopeProjectID: t,
          initialFilters: y,
          allowedKinds: d,
          onReferenceSelect: s,
          onUpload: i
        }
      )
    }),
    [s, i, t, y, d, e]
  );
}
function da({
  open: e,
  teamID: t,
  scopeProjectID: r,
  initialFilters: a,
  allowedKinds: s,
  acceptedKinds: i,
  preferredUsage: l,
  maxSelection: f = 1,
  selectedReferences: y = [],
  onReferenceSelect: d,
  onUpload: m,
  onSelect: p,
  onSelectMany: u,
  onClose: k
}) {
  if (!e)
    return null;
  const g = fa(i), S = pa(
    s || [],
    g
  ), x = Math.max(1, Number(f || 1)), L = Array.from(
    new Set(
      y.flatMap(
        (c) => (c.ref_type === "asset" || c.ref_type === "material") && Number(c.ref_id || 0) > 0 ? [`${c.ref_type}:${Number(c.ref_id)}`] : []
      )
    )
  ), F = new Set(L);
  return /* @__PURE__ */ n(
    ua,
    {
      open: !0,
      teamID: t,
      scopeProjectID: r,
      title: "选择素材",
      description: `从个人资产或团队${Le("official")}中选择`,
      initialFilters: a,
      allowedKinds: S,
      multiple: x > 1,
      maxSelection: x,
      confirmSelection: !0,
      contentMode: "full",
      usedAssetKeys: L,
      validateAsset: (c) => F.has(ye(c)) ? "该素材已使用" : c.kind === "text" || c.kind === "richtext" || bt(c).length > 0 ? "" : "该素材没有可用文件，无法使用。",
      uploadAccept: Zn(S),
      onUpload: m ? (c, v) => m(c, {
        preferredUsage: l,
        acceptedKinds: S,
        onProgress: v?.onProgress
      }) : void 0,
      onClose: k,
      onConfirm: (c) => {
        const v = c.map(
          (z) => ma(z, l)
        );
        for (const z of v)
          d?.(z);
        if (u) {
          u(v);
          return;
        }
        for (const z of v)
          p(z);
      }
    }
  );
}
function ma(e, t = "") {
  const r = bt(e), a = e.libraryType === "material" ? "material" : "asset";
  return {
    key: a === "material" ? `material:${e.id}` : `asset:${e.id}:${e.versionID}`,
    refType: a,
    refId: e.id,
    versionID: a === "asset" ? e.versionID : void 0,
    trigger: "@",
    usage: t,
    label: e.name,
    description: e.summary,
    preview: {
      text: e.summary,
      kind: r[0]?.kind || e.kind,
      url: r[0]?.url
    },
    output: e.version?.content,
    asset: e,
    mediaCount: r.length
  };
}
function fa(e) {
  const t = /* @__PURE__ */ new Set([
    "collection",
    "text",
    "image",
    "audio",
    "video",
    "richtext",
    "file"
  ]);
  return Array.from(
    new Set(
      (e || []).flatMap((r) => {
        const a = String(r || "").trim();
        return t.has(a) ? [a] : [];
      })
    )
  );
}
function pa(e, t) {
  if (e.length === 0)
    return t;
  if (t.length === 0)
    return e;
  const r = new Set(t);
  return e.filter((a) => r.has(a));
}
const ha = /* @__PURE__ */ new Set([
  "image",
  "video",
  "audio",
  "file"
]);
function bt(e) {
  const t = e.version?.content, r = ba(t, e.kind), a = r.length > 0 ? r : ha.has(e.kind) ? Xn(t, e.kind).map((s) => ({
    kind: e.kind,
    url: s
  })) : [];
  return a.map((s, i) => ({
    refType: e.libraryType === "material" ? "material" : "asset",
    refId: e.id,
    kind: s.kind,
    label: a.length > 1 ? `${e.name} · ${i + 1}` : e.name,
    url: s.url,
    index: i + 1
  }));
}
function ba(e, t) {
  const r = Yn(e), a = ya(t);
  return (a && r.includes(a) ? [a] : r).flatMap(
    (i) => Qn(e, i).map((l) => ({ kind: i, url: l }))
  );
}
function ya(e) {
  return e === "image" || e === "video" || e === "audio" ? e : "";
}
export {
  ia as A,
  Fr as T,
  Or as a,
  ua as b,
  Dr as c,
  Rr as d,
  qe as e,
  xa as u
};
