import { a as s, j as e, F as oe } from "./preloadable-Bomi5PEU.js";
import { b as Ce, aD as hn, as as bn, a_ as fn, a$ as wn, a3 as yn, Q as je, k as gn, O as Ae, L as _, p as be, h as vn, o as Se, X as Nn, b0 as kn, A as Cn, at as An, V as Be, R as Sn, U as Dn, b1 as Tn, G as Ln, d as In } from "./vendor-icons-B3DKX3la.js";
import { d as ie, a as b, b as U, u as J, e as Ue } from "./_commonjsHelpers-61wyk6v6.js";
import { t as Z } from "./index-2TBwAJWu.js";
import { aI as $n, B as T, aJ as _e, aK as qe, ad as fe, aL as Je, aM as Ge, aN as xn, d as En, A as Re, aO as Mn, aP as He, aQ as On, aR as Rn, au as Fn, m as Vn, C as zn, aS as Pn, D as Kn, n as jn, o as Bn, aT as Un, r as _n, aU as qn, aV as Jn, aW as Gn, aX as Hn, aY as Xe, aZ as Xn, a_ as Wn, a$ as Zn, b0 as Qn, b1 as Yn, ak as et, u as nt } from "./upload-asset-api-MyhTP8sK.js";
import { V as tt, M as Fe } from "./media-inspector-gallery-ho9rlZcO.js";
import { d as at } from "./file-kind-UfTAlHnR.js";
import { k as E, q as st } from "./site-config-C63CM9jT.js";
import { u as rt } from "./project-dialogs-BNviIblA.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./asset-page-BIgzXX90.css", import.meta.url).href]);
function Ve({
  content: n,
  summary: t,
  compact: a = !1
}) {
  const r = $n(n), c = r.name || t || "文件", d = r.extension ? r.extension.toUpperCase() : "FILE", u = r.extension ? `${r.extension.toUpperCase()} 文件` : "文件";
  return a ? /* @__PURE__ */ s("div", { className: "wb-asset-file-card-preview", children: [
    /* @__PURE__ */ e("strong", { children: d }),
    /* @__PURE__ */ e(T, { label: c, children: /* @__PURE__ */ e("p", { children: c }) }),
    /* @__PURE__ */ e("span", { children: "文件" })
  ] }) : /* @__PURE__ */ s("section", { className: "wb-asset-file-preview", children: [
    /* @__PURE__ */ e("span", { className: "wb-asset-file-icon", children: /* @__PURE__ */ e(Ce, { "aria-hidden": "true" }) }),
    /* @__PURE__ */ s("div", { className: "wb-asset-file-copy", children: [
      /* @__PURE__ */ e(T, { label: c, children: /* @__PURE__ */ e("strong", { children: c }) }),
      /* @__PURE__ */ e("span", { children: u })
    ] }),
    r.url ? /* @__PURE__ */ s("a", { href: r.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ e(hn, { "aria-hidden": "true" }),
      /* @__PURE__ */ e("span", { children: "打开文件" })
    ] }) : /* @__PURE__ */ e("span", { className: "wb-asset-file-unavailable", children: "文件暂不可用" })
  ] });
}
function ye({
  kind: n,
  src: t,
  poster: a
}) {
  const r = ie(null), [c, d] = b(""), [u, p] = b(""), [g, k] = b(""), v = c === t, h = u === t, l = g === t;
  U(() => {
    const S = r.current;
    if (!t || !S || typeof IntersectionObserver > "u") {
      d(t);
      return;
    }
    const A = new IntersectionObserver(
      (L) => {
        L.some(($) => $.isIntersecting) && (d(t), A.disconnect());
      },
      { rootMargin: "320px 0px" }
    );
    return A.observe(S), () => A.disconnect();
  }, [t]);
  function y() {
    p(t), k("");
  }
  function m() {
    p(""), k(t);
  }
  return /* @__PURE__ */ s(
    "div",
    {
      ref: r,
      className: [
        "wb-asset-lazy-cover",
        `is-${n}`,
        h ? "is-loaded" : "is-pending",
        l ? "is-failed" : ""
      ].filter(Boolean).join(" "),
      children: [
        v && !l ? n === "image" ? /* @__PURE__ */ e(
          "img",
          {
            src: t,
            alt: "",
            loading: "lazy",
            decoding: "async",
            onLoad: y,
            onError: m
          }
        ) : /* @__PURE__ */ e(
          tt,
          {
            src: t,
            poster: a,
            ariaHidden: !0,
            onLoad: y,
            onError: m
          }
        ) : null,
        l ? /* @__PURE__ */ e("span", { children: "封面加载失败" }) : null
      ]
    }
  );
}
function it({
  kind: n,
  content: t,
  summary: a
}) {
  const r = _e(n, t), c = a || qe(t) || fe(n), d = Je(r, "storyboard") ? { text: c } : r;
  return /* @__PURE__ */ e("div", { className: `wb-asset-card-text-preview is-${n}`, children: /* @__PURE__ */ e(
    Ge,
    {
      output: d,
      fallback: c,
      emptyText: c,
      className: "wb-asset-card-text-content",
      markdownClassName: "wb-asset-card-prose",
      richClassName: "wb-asset-card-prose"
    }
  ) });
}
function De({
  kind: n,
  content: t,
  summary: a,
  prompt: r,
  compact: c = !1
}) {
  const d = xn(t, n), u = d.map((g) => g.url), p = u[0] || "";
  if (!c) {
    const g = n === "audio" ? En(t) : null;
    if ((n === "image" || n === "video") && u.length > 0)
      return /* @__PURE__ */ e(
        Fe,
        {
          kind: n,
          mediaItems: d,
          downloadable: !0,
          className: "wb-asset-media-gallery"
        }
      );
    if (n === "audio")
      return d.length > 0 && (d.length > 1 || d[0]?.thumbnail) ? /* @__PURE__ */ e(
        Fe,
        {
          kind: "audio",
          mediaItems: d,
          downloadable: !0,
          className: "wb-asset-media-gallery",
          supplementalText: g
        }
      ) : /* @__PURE__ */ e(Re, { src: p, prompt: r, detailed: !0 });
    if (n === "file")
      return /* @__PURE__ */ e(Ve, { content: t, summary: a });
    const k = _e(n, t);
    return /* @__PURE__ */ e(
      Ge,
      {
        output: k,
        fallback: a || "",
        emptyText: "该版本暂无可预览内容",
        className: "wb-asset-preview-content",
        markdownClassName: "wb-asset-detail-prose",
        richClassName: "wb-asset-detail-prose",
        mediaLayout: "detail"
      }
    );
  }
  return n === "image" && p ? /* @__PURE__ */ e(ye, { kind: "image", src: p }) : n === "video" && p ? /* @__PURE__ */ e(
    ye,
    {
      kind: "video",
      src: p,
      poster: d[0]?.thumbnail
    }
  ) : n === "audio" ? d[0]?.thumbnail ? /* @__PURE__ */ e(ye, { kind: "image", src: d[0].thumbnail }) : /* @__PURE__ */ e(Re, { src: p }) : n === "file" ? /* @__PURE__ */ e(Ve, { content: t, summary: a, compact: !0 }) : n === "text" || n === "richtext" ? /* @__PURE__ */ e(it, { kind: n, content: t, summary: a }) : /* @__PURE__ */ e("div", { className: "wb-asset-card-fallback", children: /* @__PURE__ */ e("p", { children: a || qe(t) || fe(n) }) });
}
function Te({ kind: n }) {
  switch (n) {
    case "collection":
      return /* @__PURE__ */ e(je, { "aria-hidden": "true" });
    case "image":
      return /* @__PURE__ */ e(yn, { "aria-hidden": "true" });
    case "audio":
      return /* @__PURE__ */ e(wn, { "aria-hidden": "true" });
    case "video":
      return /* @__PURE__ */ e(fn, { "aria-hidden": "true" });
    case "file":
      return /* @__PURE__ */ e(bn, { "aria-hidden": "true" });
    default:
      return /* @__PURE__ */ e(Ce, { "aria-hidden": "true" });
  }
}
function ot({
  asset: n,
  sourceLabels: t,
  view: a = "assets",
  selectable: r = !1,
  selected: c = !1,
  used: d = !1,
  busy: u = !1,
  onOpen: p,
  onRename: g,
  onDelete: k,
  onRestore: v,
  onSelect: h
}) {
  const l = a === "trash", y = n.kind === "collection", m = y ? 0 : Mn(n.version?.content, n.kind), S = r && !y && !!h, A = S && (u || d), L = S ? d ? `${n.name}已使用` : c ? `取消选择${n.name}` : `选择${n.name}` : `${y ? "打开集合" : "查看"}${n.name}`, $ = y ? /* @__PURE__ */ e(lt, { asset: n }) : /* @__PURE__ */ e(
    De,
    {
      kind: n.kind,
      content: n.version?.content,
      summary: n.summary,
      compact: !0
    }
  );
  function V() {
    if (S) {
      A || h?.(n);
      return;
    }
    p(n);
  }
  return /* @__PURE__ */ s(
    "article",
    {
      className: `wb-asset-card ${y ? "is-collection" : ""} ${c ? "is-selected" : ""} ${d ? "is-used" : ""} ${l ? "is-trash" : ""}`.trim(),
      children: [
        /* @__PURE__ */ s("div", { className: "wb-asset-card-main", children: [
          /* @__PURE__ */ s("div", { className: "wb-asset-card-preview", children: [
            $,
            m > 1 ? /* @__PURE__ */ s("span", { className: "wb-asset-media-count", children: [
              m,
              " 项"
            ] }) : null,
            n.kind !== "audio" ? /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                className: "wb-asset-card-preview-open",
                disabled: A,
                onClick: V,
                "aria-label": L
              }
            ) : null
          ] }),
          /* @__PURE__ */ e(T, { label: n.name, children: /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              className: "wb-asset-card-copy",
              disabled: A,
              onClick: V,
              children: [
                /* @__PURE__ */ e("strong", { children: n.name }),
                /* @__PURE__ */ e("span", { children: y ? `集合 · ${n.collectionCount} 项素材` : `${He(n.sourceType, t)} · ${fe(n.kind)}` })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ e("span", { className: "wb-asset-card-kind-icon", children: /* @__PURE__ */ e(Te, { kind: n.kind }) }),
        /* @__PURE__ */ s("div", { className: "wb-asset-card-actions", children: [
          S && !l ? /* @__PURE__ */ e(T, { label: "查看详情", children: /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              disabled: u,
              onClick: (q) => {
                q.stopPropagation(), p(n);
              },
              children: [
                /* @__PURE__ */ e(gn, { "aria-hidden": "true" }),
                /* @__PURE__ */ e("span", { className: "sr-only", children: "查看详情" })
              ]
            }
          ) }) : null,
          l ? null : /* @__PURE__ */ e(T, { label: "修改标题", children: /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              disabled: u,
              onClick: () => g(n),
              children: [
                /* @__PURE__ */ e(Ae, { "aria-hidden": "true" }),
                /* @__PURE__ */ e("span", { className: "sr-only", children: "修改标题" })
              ]
            }
          ) }),
          l && v ? /* @__PURE__ */ e(T, { label: "恢复资产", children: /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              className: "is-restore",
              disabled: u,
              onClick: () => v(n),
              children: [
                u ? /* @__PURE__ */ e(_, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ e(be, { "aria-hidden": "true" }),
                /* @__PURE__ */ e("span", { className: "sr-only", children: "恢复资产" })
              ]
            }
          ) }) : k ? /* @__PURE__ */ e(T, { label: "移入回收站", children: /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              className: "is-danger",
              disabled: u,
              onClick: () => k(n),
              children: [
                u ? /* @__PURE__ */ e(_, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ e(vn, { "aria-hidden": "true" }),
                /* @__PURE__ */ e("span", { className: "sr-only", children: "移入回收站" })
              ]
            }
          ) }) : null,
          !y && !l && r && h ? /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              className: `is-primary ${c ? "is-selected" : ""} ${d ? "is-used" : ""}`.trim(),
              disabled: u || d,
              onClick: V,
              children: [
                /* @__PURE__ */ e(Se, { "aria-hidden": "true" }),
                d ? "已使用" : c ? "已选" : "使用"
              ]
            }
          ) : null
        ] })
      ]
    }
  );
}
function lt({ asset: n }) {
  const t = n.collectionPreviews.slice(0, 4);
  return t.length === 0 ? /* @__PURE__ */ s("div", { className: "wb-asset-collection-empty", children: [
    /* @__PURE__ */ e(Te, { kind: "collection" }),
    /* @__PURE__ */ e("span", { children: n.collectionCount > 0 ? `${n.collectionCount} 项素材` : "空集合" })
  ] }) : /* @__PURE__ */ s("div", { className: `wb-asset-collection-preview has-${t.length}`, children: [
    t.map((a) => /* @__PURE__ */ e("div", { children: /* @__PURE__ */ e(De, { kind: a.kind, content: a.content, compact: !0 }) }, a.id)),
    /* @__PURE__ */ s("span", { children: [
      n.collectionCount,
      " 项"
    ] })
  ] });
}
function We({
  teamID: n,
  asset: t,
  onClose: a,
  onRenamed: r
}) {
  const [c, d] = b(""), [u, p] = b(!1), [g, k] = b("");
  U(() => {
    t && (d(t.name), p(!1), k(""));
  }, [t]), U(() => {
    if (!t) return;
    const h = (l) => {
      l.key === "Escape" && (l.preventDefault(), l.stopImmediatePropagation(), u || a());
    };
    return window.addEventListener("keydown", h, !0), () => window.removeEventListener("keydown", h, !0);
  }, [t, a, u]);
  async function v(h) {
    h.preventDefault();
    const l = c.trim();
    if (!(!t || !l || u)) {
      p(!0), k("");
      try {
        const y = await On({
          teamID: n,
          assetID: t.id,
          name: l
        });
        r(y), a();
      } catch (y) {
        k(E(y, "修改资产标题失败"));
      } finally {
        p(!1);
      }
    }
  }
  return !t || typeof document > "u" ? null : at(
    /* @__PURE__ */ e(
      "div",
      {
        className: "wb-asset-rename-backdrop",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "修改资产标题",
        onMouseDown: (h) => {
          h.target === h.currentTarget && !u && a();
        },
        children: /* @__PURE__ */ s("form", { className: "wb-asset-rename-dialog", onSubmit: v, children: [
          /* @__PURE__ */ s("header", { children: [
            /* @__PURE__ */ s("div", { children: [
              /* @__PURE__ */ e("span", { className: "wb-asset-rename-icon", children: /* @__PURE__ */ e(Ae, { "aria-hidden": "true" }) }),
              /* @__PURE__ */ s("div", { children: [
                /* @__PURE__ */ e("h2", { children: "修改资产标题" }),
                /* @__PURE__ */ e("p", { children: "只修改资产库中的显示名称。" })
              ] })
            ] }),
            /* @__PURE__ */ e(T, { label: "关闭", children: /* @__PURE__ */ e("button", { type: "button", disabled: u, onClick: a, children: /* @__PURE__ */ e(Nn, { "aria-hidden": "true" }) }) })
          ] }),
          /* @__PURE__ */ s("label", { children: [
            /* @__PURE__ */ e("span", { children: "资产标题" }),
            /* @__PURE__ */ e(
              "input",
              {
                autoFocus: !0,
                value: c,
                maxLength: 128,
                disabled: u,
                placeholder: "请输入资产标题",
                onChange: (h) => d(h.target.value)
              }
            )
          ] }),
          g ? /* @__PURE__ */ e("p", { className: "wb-asset-rename-error", children: g }) : null,
          /* @__PURE__ */ s("footer", { children: [
            /* @__PURE__ */ e("button", { type: "button", disabled: u, onClick: a, children: "取消" }),
            /* @__PURE__ */ s(
              "button",
              {
                type: "submit",
                className: "is-primary",
                disabled: u || !c.trim(),
                children: [
                  u ? /* @__PURE__ */ e(_, { className: "is-spinning" }) : null,
                  u ? "保存中" : "保存"
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
function Ze() {
  const n = st().site.homeMenu;
  return J(
    () => ({
      project: n.works.name,
      tool: n.function.name,
      dialogue: n.dialogue.name,
      fallback: n.assets.name
    }),
    [
      n.assets.name,
      n.dialogue.name,
      n.function.name,
      n.works.name
    ]
  );
}
function ct({
  teamID: n,
  assetID: t,
  selectable: a = !1,
  onClose: r,
  onSelect: c,
  onContinue: d,
  canContinue: u,
  onAssetChanged: p,
  layer: g = "default"
}) {
  const k = Ze(), [v, h] = b(null), [l, y] = b(
    null
  ), [m, S] = b(!0), [A, L] = b(0), [$, V] = b(!1), [q, z] = b(!1), [G, M] = b(""), [O, Y] = b(""), R = Ue(async () => {
    S(!0), M(""), Y("");
    try {
      const o = ze(await Rn(n, t));
      h(o), y(o.asset.version);
    } catch (o) {
      M(E(o, "加载资产详情失败"));
    } finally {
      S(!1);
    }
  }, [t, n]);
  U(() => {
    R();
  }, [R]), U(() => {
    const o = (w) => {
      w.key !== "Escape" || q || (w.preventDefault(), w.stopImmediatePropagation(), r());
    };
    return window.addEventListener("keydown", o, !0), () => window.removeEventListener("keydown", o, !0);
  }, [r, q]);
  async function F(o) {
    if (!(A || o.id === l?.id)) {
      if (o.id === v?.asset.versionID && v.asset.version) {
        M(""), y(v.asset.version);
        return;
      }
      L(o.id), M("");
      try {
        y(
          await Jn({ teamID: n, assetID: t, versionID: o.id })
        );
      } catch (w) {
        M(E(w, "加载资产版本失败"));
      } finally {
        L(0);
      }
    }
  }
  async function P() {
    if (!v || !v.hasMore || A) return;
    const o = Math.floor(v.versions.length / 20) + 1;
    L(-1), Y("");
    try {
      const w = await Gn({
        teamID: n,
        assetID: t,
        page: o,
        pageSize: 20
      });
      h(
        (K) => K && {
          ...K,
          versions: Qe([...K.versions, ...w.items]),
          versionTotal: w.total,
          hasMore: w.hasMore
        }
      );
    } catch (w) {
      Y(E(w, "加载资产版本失败"));
    } finally {
      L(0);
    }
  }
  async function I() {
    if (!(!v || !l || $)) {
      V(!0), M("");
      try {
        const o = await qn({
          teamID: n,
          assetID: t,
          versionID: l.id
        }), w = ze({ ...v, asset: o });
        h(w), y(o.version), p?.(o);
      } catch (o) {
        M(E(o, "设置当前版本失败"));
      } finally {
        V(!1);
      }
    }
  }
  const f = v?.asset, C = f?.status === "deleted", H = !!(f && l && f.versionID === l.id), le = J(
    () => Fn(l?.content),
    [l?.content]
  ), ce = J(
    () => Je(l?.content, "storyboard"),
    [l?.content]
  );
  return /* @__PURE__ */ s(
    _n,
    {
      ariaLabel: `${f?.name || "资产"}详情`,
      onRequestClose: r,
      layer: g,
      header: /* @__PURE__ */ e(
        Kn,
        {
          icon: f ? /* @__PURE__ */ e(Te, { kind: f.kind }) : /* @__PURE__ */ e(Ce, { size: 16 }),
          title: f?.name || "资产详情",
          subtitle: f ? `${mt(f, k)} · ${fe(f.kind)} · ${Un(f.role)}` : "",
          versionSelect: v && f && l ? /* @__PURE__ */ e(
            Bn,
            {
              options: v.versions.map((o) => ({
                id: o.id,
                version: o.version,
                updatedAt: o.updatedAt || o.createdAt,
                value: o
              })),
              currentVersionId: f.versionID,
              selectedVersionId: l.id,
              total: v.versionTotal,
              hasMore: v.hasMore,
              loading: A > 0,
              loadingMore: A === -1,
              error: O,
              disabled: $,
              onSelect: (o) => {
                F(o);
              },
              onLoadMore: () => {
                P();
              },
              onRetry: () => {
                P();
              }
            }
          ) : void 0,
          state: C ? /* @__PURE__ */ e("span", { className: "wb-detail-state", children: "回收站" }) : A > 0 ? /* @__PURE__ */ s("span", { className: "wb-detail-state is-saving", children: [
            /* @__PURE__ */ e(_, { size: 12, className: "wb-detail-spin" }),
            "读取中"
          ] }) : /* @__PURE__ */ e("span", { className: "wb-detail-state", children: "只读预览" }),
          updatedAt: jn(
            l?.updatedAt || l?.createdAt
          ),
          actions: f && l && !C ? /* @__PURE__ */ s(oe, { children: [
            /* @__PURE__ */ s(
              "button",
              {
                type: "button",
                className: "wb-detail-command",
                onClick: () => z(!0),
                children: [
                  /* @__PURE__ */ e(Ae, { size: 13 }),
                  /* @__PURE__ */ e("span", { children: "修改标题" })
                ]
              }
            ),
            H ? /* @__PURE__ */ e(
              ut,
              {
                asset: f,
                selectable: a,
                onSelect: c,
                onContinue: d,
                canContinue: u
              }
            ) : /* @__PURE__ */ e(
              dt,
              {
                currentVersion: f.version,
                loading: !!A,
                saving: $,
                onReturn: (o) => {
                  F(o);
                },
                onMakeCurrent: () => {
                  I();
                }
              }
            )
          ] }) : void 0,
          onClose: r
        }
      ),
      children: [
        /* @__PURE__ */ e("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ e("div", { className: "wb-detail-scroll", children: m ? /* @__PURE__ */ s("div", { className: "wb-detail-content-state", children: [
          /* @__PURE__ */ e(_, { size: 18, className: "wb-detail-spin" }),
          /* @__PURE__ */ e("span", { children: "正在读取资产" })
        ] }) : !f || !l ? /* @__PURE__ */ s("div", { className: "wb-detail-content-state is-error", children: [
          /* @__PURE__ */ e("span", { children: G || "资产不存在" }),
          /* @__PURE__ */ s("button", { type: "button", onClick: () => {
            R();
          }, children: [
            /* @__PURE__ */ e(be, { size: 13 }),
            "重试"
          ] })
        ] }) : /* @__PURE__ */ s("div", { className: `wb-detail-readonly-content is-${f.kind}`, children: [
          G ? /* @__PURE__ */ e("p", { className: "wb-detail-error-banner", children: G }) : null,
          le ? /* @__PURE__ */ e(Vn, { grid: le, variant: "detail" }) : ce ? /* @__PURE__ */ e(
            zn,
            {
              output: l.content,
              fallback: l.summary || f.summary,
              emptyText: "该版本暂无可预览内容",
              className: "wb-asset-preview-content",
              markdownClassName: "wb-asset-detail-prose",
              richClassName: "wb-asset-detail-prose",
              mediaLayout: "detail"
            }
          ) : /* @__PURE__ */ e(
            De,
            {
              kind: f.kind,
              content: l.content,
              summary: l.summary || f.summary,
              prompt: Pn(l)
            },
            l.id
          )
        ] }) }) }),
        /* @__PURE__ */ e(
          We,
          {
            teamID: n,
            asset: q && f || null,
            onClose: () => z(!1),
            onRenamed: (o) => {
              h(
                (w) => w && { ...w, asset: o }
              ), p?.(o);
            }
          }
        )
      ]
    }
  );
}
function dt({
  currentVersion: n,
  loading: t,
  saving: a,
  onReturn: r,
  onMakeCurrent: c
}) {
  const d = t || a;
  return /* @__PURE__ */ s(oe, { children: [
    n ? /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        disabled: d,
        onClick: () => r(n),
        children: [
          /* @__PURE__ */ e(be, { size: 13 }),
          /* @__PURE__ */ e("span", { children: "返回当前版本" })
        ]
      }
    ) : null,
    /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: "wb-detail-command is-primary",
        disabled: d,
        onClick: c,
        children: [
          a ? /* @__PURE__ */ e(_, { size: 13, className: "wb-detail-spin" }) : /* @__PURE__ */ e(Se, { size: 13 }),
          /* @__PURE__ */ e("span", { children: a ? "设置中" : "设为当前版本" })
        ]
      }
    )
  ] });
}
function ut({
  asset: n,
  selectable: t,
  onSelect: a,
  onContinue: r,
  canContinue: c
}) {
  return /* @__PURE__ */ s(oe, { children: [
    r && pt(n) && (c?.(n) ?? !0) ? /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        onClick: () => r(n),
        children: [
          n.sourceType === "dialogue" ? /* @__PURE__ */ e(kn, { size: 14 }) : /* @__PURE__ */ e(be, { size: 14 }),
          /* @__PURE__ */ e("span", { children: n.sourceType === "dialogue" ? "继续对话" : "重新生成" })
        ]
      }
    ) : null,
    t && a ? /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: "wb-detail-command is-primary",
        onClick: () => a(n),
        children: [
          /* @__PURE__ */ e(Se, { size: 14 }),
          /* @__PURE__ */ e("span", { children: "使用" })
        ]
      }
    ) : null
  ] });
}
function ze(n) {
  const t = Qe(
    n.asset.version ? [n.asset.version, ...n.versions] : n.versions
  );
  return {
    ...n,
    versions: t,
    versionTotal: Math.max(n.versionTotal, t.length)
  };
}
function Qe(n) {
  return Array.from(
    new Map(n.map((t) => [t.id, t])).values()
  );
}
function mt(n, t) {
  const a = He(n.sourceType, t);
  return n.sourceName && n.sourceName !== a ? `${a} / ${n.sourceName}` : a;
}
function pt(n) {
  return n.role === "material" && (n.sourceType === "tool" || n.sourceType === "dialogue");
}
const ht = [
  { key: "", label: "全部" },
  ...Xn
], Pe = [
  { key: "", label: "全部" },
  ...Xe
];
function bt({
  filters: n,
  options: t,
  scopeProjectID: a = 0,
  sourceLabels: r = {},
  allowedKinds: c = [],
  view: d,
  collectionName: u,
  onCollectionBack: p,
  onChange: g,
  onViewChange: k
}) {
  const v = [
    { key: "", label: "全部" },
    ...Hn.map((m) => ({
      ...m,
      label: r[m.key] || m.label
    }))
  ], h = t.assetCates.length > 0, l = c.length > 0 ? Pe.filter(
    (m) => m.key && c.includes(m.key)
  ) : Pe;
  function y(m) {
    const S = m === "project" ? a : 0;
    g({
      ...n,
      sourceType: m,
      sourceID: S,
      projectID: S,
      assetCateID: 0,
      nodeKey: "",
      role: ""
    });
  }
  return /* @__PURE__ */ s("div", { className: "wb-asset-filters", children: [
    u && p ? /* @__PURE__ */ e(pe, { label: "集合", children: /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: "wb-asset-collection-back",
        onClick: p,
        children: [
          /* @__PURE__ */ e(Cn, { "aria-hidden": "true" }),
          /* @__PURE__ */ e(je, { "aria-hidden": "true" }),
          /* @__PURE__ */ e("span", { children: u })
        ]
      }
    ) }) : /* @__PURE__ */ s(pe, { label: "来源", children: [
      /* @__PURE__ */ e(
        ge,
        {
          options: v,
          value: n.sourceType,
          onChange: y
        }
      ),
      n.sourceType === "project" ? /* @__PURE__ */ s(oe, { children: [
        a > 0 ? null : /* @__PURE__ */ e(
          he,
          {
            label: r.project || "创作",
            value: n.projectID,
            options: t.projects,
            onChange: (m) => g({
              ...n,
              projectID: m,
              sourceID: m,
              assetCateID: 0,
              nodeKey: ""
            })
          }
        ),
        h ? /* @__PURE__ */ e(
          he,
          {
            label: "资产分类",
            value: n.assetCateID,
            options: t.assetCates,
            onChange: (m) => g({ ...n, assetCateID: m, nodeKey: "" })
          }
        ) : null
      ] }) : null,
      n.sourceType === "tool" ? /* @__PURE__ */ e(
        he,
        {
          label: r.tool || "工具",
          value: n.sourceID,
          options: t.tools,
          onChange: (m) => g({ ...n, sourceID: m })
        }
      ) : null,
      n.sourceType === "dialogue" ? /* @__PURE__ */ e(
        he,
        {
          label: "角色",
          value: n.sourceID,
          options: t.dialogues,
          onChange: (m) => g({ ...n, sourceID: m })
        }
      ) : null
    ] }),
    !u && n.sourceType === "project" && h ? /* @__PURE__ */ e(pe, { label: "资产", children: /* @__PURE__ */ e(
      ge,
      {
        options: ht,
        value: n.role,
        onChange: (m) => g({ ...n, role: m })
      }
    ) }) : null,
    /* @__PURE__ */ e(
      pe,
      {
        label: "类型",
        trailing: /* @__PURE__ */ e(ft, { view: d, onChange: k }),
        children: /* @__PURE__ */ e(
          ge,
          {
            options: l,
            value: n.kind,
            onChange: (m) => g({ ...n, kind: m })
          }
        )
      }
    )
  ] });
}
function pe({
  label: n,
  children: t,
  trailing: a
}) {
  return /* @__PURE__ */ s("div", { className: "wb-asset-filter-row", children: [
    /* @__PURE__ */ e("strong", { children: n }),
    /* @__PURE__ */ s("div", { className: "wb-asset-filter-controls", children: [
      t,
      a
    ] })
  ] });
}
function ft({
  view: n,
  onChange: t
}) {
  return /* @__PURE__ */ s("div", { className: "wb-asset-view-switch", role: "tablist", "aria-label": "资产视图", children: [
    /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": n === "assets",
        className: n === "assets" ? "is-active" : "",
        onClick: () => t("assets"),
        children: [
          /* @__PURE__ */ e(An, { "aria-hidden": "true" }),
          /* @__PURE__ */ e("span", { children: "资产" })
        ]
      }
    ),
    /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": n === "trash",
        className: n === "trash" ? "is-active" : "",
        onClick: () => t("trash"),
        children: [
          /* @__PURE__ */ e(Be, { "aria-hidden": "true" }),
          /* @__PURE__ */ e("span", { children: "回收站" })
        ]
      }
    )
  ] });
}
function ge({
  options: n,
  value: t,
  onChange: a
}) {
  return /* @__PURE__ */ e("div", { className: "wb-asset-segments", children: n.map((r) => /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      className: t === r.key ? "is-active" : "",
      onClick: () => a(r.key),
      children: r.label
    },
    r.key || "all"
  )) });
}
function he({
  label: n,
  value: t,
  options: a,
  onChange: r
}) {
  return /* @__PURE__ */ s("label", { className: "wb-asset-select", children: [
    /* @__PURE__ */ e("span", { className: "sr-only", children: n }),
    /* @__PURE__ */ s(
      "select",
      {
        value: t || "",
        onChange: (c) => r(Number(c.target.value)),
        children: [
          /* @__PURE__ */ s("option", { value: "", children: [
            "全部",
            n
          ] }),
          a.map((c) => /* @__PURE__ */ e("option", { value: c.id, children: c.name }, c.id))
        ]
      }
    )
  ] });
}
const Ne = {
  sourceType: "",
  sourceID: 0,
  projectID: 0,
  assetCateID: 0,
  nodeKey: "",
  role: "",
  kind: ""
};
await window.DeverFront?.ensureCompat?.(["@/components/confirm-dialog"]);
const ke = window.DeverFront?.sdk?.getCompatModule("@/components/confirm-dialog");
if (!ke || Object.keys(ke).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/confirm-dialog");
const wt = ke.ConfirmDialog, Ke = {
  projects: [],
  tools: [],
  dialogues: [],
  assetCates: []
}, Q = {
  items: [],
  page: 1,
  pageSize: 24,
  total: 0,
  hasMore: !1
}, yt = 10040;
function gt({
  teamID: n,
  scopeProjectID: t = 0,
  initialFilters: a,
  selectable: r = !1,
  excludeCollections: c = !1,
  selectedAssetIDs: d,
  usedAssetIDs: u,
  allowedKinds: p,
  onSelect: g,
  onContinue: k,
  canContinue: v,
  onAssetChanged: h,
  onAssetRemoved: l,
  onLocalUpload: y,
  uploadAccept: m,
  headerAction: S,
  reloadSignal: A = 0,
  catalogOptions: L,
  contentMode: $ = "preview",
  detailLayer: V = "default",
  className: q = ""
}) {
  const z = rt(), G = Ze(), M = JSON.stringify(p || []), O = J(
    () => Nt(p),
    [M]
  ), Y = JSON.stringify({ initialFilters: a, normalizedAllowedKinds: O }), R = J(
    () => vt(a, O),
    [Y]
  ), [F, P] = b(R), [I, f] = b(
    null
  ), [C, H] = b("assets"), [le, ce] = b(Ke), [o, w] = b(Q), [K, x] = b(0), [Ye, de] = b(null), [X, ee] = b(null), [W, ne] = b(0), [te, Le] = b(!0), [ue, we] = b(!1), [en, Ie] = b(!0), [$e, j] = b(""), [nn, tn] = b(0), B = ie(0), xe = ie(null), ae = ie(R), se = ie("assets"), Ee = JSON.stringify(d || []), an = J(
    () => new Set(JSON.parse(Ee)),
    [Ee]
  ), Me = JSON.stringify(u || []), sn = J(
    () => new Set(JSON.parse(Me)),
    [Me]
  );
  U(() => {
    B.current += 1, P(R), ae.current = R, f(null), H("assets"), se.current = "assets", ce(Ke), w(Q), x(0), de(null), ee(null), ne(0), we(!1), j("");
  }, [z, R, t, n]), U(() => {
    let i = !0;
    return Ie(!0), Wn(n, L, z).then((N) => {
      i && ce(N);
    }).catch((N) => {
      i && j(E(N, "加载资产筛选项失败"));
    }).finally(() => {
      i && Ie(!1);
    }), () => {
      i = !1;
    };
  }, [L, z, n]);
  const me = Ue(
    async (i) => {
      const N = ++B.current;
      Le(!0), j("");
      try {
        const D = await Zn({
          teamID: n,
          scopeProjectID: t,
          filters: F,
          view: C,
          contentMode: $,
          page: i,
          pageSize: 24,
          collectionID: I?.id,
          excludeCollections: c,
          requestScopeKey: z
        });
        N === B.current && w(D);
      } catch (D) {
        N === B.current && j(E(D, "加载资产失败"));
      } finally {
        N === B.current && Le(!1);
      }
    },
    [
      I?.id,
      $,
      c,
      F,
      z,
      t,
      n,
      C
    ]
  );
  U(() => {
    me(1);
  }, [me, A, nn]);
  function rn(i) {
    P(i), I || (ae.current = i), w((N) => ({ ...N, page: 1 }));
  }
  function re() {
    tn((i) => i + 1);
  }
  function on(i) {
    if (i.kind !== "collection") {
      x(i.id);
      return;
    }
    ae.current = F, se.current = C, f(i), P({
      ...Ne,
      kind: F.kind === "collection" ? O.length === 1 ? O[0] : "" : F.kind
    }), w(Q), x(0), j("");
  }
  function ln() {
    B.current += 1, f(null), P(ae.current), H(se.current), w(Q), x(0), j("");
  }
  function cn(i) {
    i === C || W || (B.current += 1, H(i), I || (se.current = i), w(Q), x(0), de(null), ee(null), j(""));
  }
  async function dn() {
    if (!X || W) return;
    const i = X.id;
    ne(i);
    try {
      await Yn({ teamID: n, assetID: i }), ee(null), K === i && x(0), l?.(i), Z.success("资产已移入回收站"), re();
    } catch (N) {
      Z.error(E(N, "删除资产失败"));
    } finally {
      ne(0);
    }
  }
  async function un(i) {
    if (!W) {
      ne(i.id);
      try {
        const N = await Qn({ teamID: n, assetID: i.id });
        h?.(N), Z.success("资产已恢复"), re();
      } catch (N) {
        Z.error(E(N, "恢复资产失败"));
      } finally {
        ne(0);
      }
    }
  }
  async function mn(i) {
    const N = Array.from(i.target.files || []);
    if (i.target.value = "", !(!y || N.length === 0 || ue)) {
      we(!0);
      try {
        const D = await y(N);
        if (D.length === 0)
          throw new Error("上传完成，但没有生成可用资产");
        D.forEach((pn) => h?.(pn));
        const Oe = {
          ...Ne,
          sourceType: "upload",
          kind: O.length === 1 ? O[0] : ""
        };
        B.current += 1, f(null), H("assets"), se.current = "assets", P(Oe), ae.current = Oe, w(Q), x(0), j(""), Z.success(`已上传 ${D.length} 项资产`);
      } catch (D) {
        Z.error(E(D, "上传资产失败"));
      } finally {
        we(!1);
      }
    }
  }
  return /* @__PURE__ */ s("section", { className: `wb-asset-browser ${q}`.trim(), children: [
    /* @__PURE__ */ s("header", { className: "wb-asset-browser-head", children: [
      /* @__PURE__ */ e(
        bt,
        {
          filters: F,
          options: le,
          scopeProjectID: t,
          sourceLabels: G,
          allowedKinds: O,
          view: C,
          collectionName: I?.name,
          onCollectionBack: I ? ln : void 0,
          onChange: rn,
          onViewChange: cn
        }
      ),
      /* @__PURE__ */ s("div", { className: "wb-asset-browser-actions", children: [
        /* @__PURE__ */ e("span", { children: te ? "正在加载" : `${o.total} 项` }),
        /* @__PURE__ */ e(T, { label: "刷新资产", children: /* @__PURE__ */ s("button", { type: "button", onClick: re, children: [
          /* @__PURE__ */ e(Sn, { className: te ? "is-spinning" : "" }),
          /* @__PURE__ */ e("span", { className: "sr-only", children: "刷新资产" })
        ] }) }),
        !I && y ? /* @__PURE__ */ s(oe, { children: [
          /* @__PURE__ */ e(T, { label: "本地上传", children: /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              className: "wb-asset-local-upload",
              disabled: ue,
              onClick: () => xe.current?.click(),
              children: [
                ue ? /* @__PURE__ */ e(_, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ e(Dn, { "aria-hidden": "true" }),
                /* @__PURE__ */ e("span", { children: ue ? "上传中" : "本地上传" })
              ]
            }
          ) }),
          /* @__PURE__ */ e(
            "input",
            {
              ref: xe,
              type: "file",
              hidden: !0,
              multiple: !0,
              accept: m,
              onChange: mn
            }
          )
        ] }) : null,
        I ? null : S
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "wb-asset-browser-body", children: te && o.items.length === 0 ? /* @__PURE__ */ e(ve, { icon: /* @__PURE__ */ e(_, { className: "is-spinning" }) }) : $e ? /* @__PURE__ */ e(ve, { text: $e, error: !0 }) : o.items.length === 0 ? /* @__PURE__ */ e(
      ve,
      {
        icon: C === "trash" ? /* @__PURE__ */ e(Be, {}) : /* @__PURE__ */ e(Tn, {}),
        text: en ? "正在读取资产配置" : C === "trash" ? "回收站为空" : I ? "集合内暂无符合条件的资产" : "暂无符合条件的资产"
      }
    ) : /* @__PURE__ */ e("div", { className: "wb-asset-grid", children: o.items.map((i) => /* @__PURE__ */ e(
      ot,
      {
        asset: i,
        sourceLabels: G,
        view: C,
        selectable: i.kind !== "collection" && r && C === "assets",
        selected: C === "assets" && an.has(i.id),
        used: C === "assets" && sn.has(i.id),
        busy: W === i.id,
        onOpen: on,
        onRename: de,
        onDelete: C === "assets" ? ee : void 0,
        onRestore: C === "trash" ? un : void 0,
        onSelect: g
      },
      i.id
    )) }) }),
    o.total > o.pageSize ? /* @__PURE__ */ s("footer", { className: "wb-asset-pagination", children: [
      /* @__PURE__ */ e(T, { label: "上一页", children: /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          disabled: o.page <= 1 || te,
          onClick: () => {
            me(o.page - 1);
          },
          children: /* @__PURE__ */ e(Ln, {})
        }
      ) }),
      /* @__PURE__ */ s("span", { children: [
        o.page,
        " / ",
        Math.max(1, Math.ceil(o.total / o.pageSize))
      ] }),
      /* @__PURE__ */ e(T, { label: "下一页", children: /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          disabled: !o.hasMore || te,
          onClick: () => {
            me(o.page + 1);
          },
          children: /* @__PURE__ */ e(In, {})
        }
      ) })
    ] }) : null,
    K ? /* @__PURE__ */ e(
      ct,
      {
        teamID: n,
        assetID: K,
        selectable: r && C === "assets",
        layer: V,
        onClose: () => x(0),
        onSelect: g ? (i) => {
          x(0), g(i);
        } : void 0,
        onContinue: k ? (i) => {
          x(0), k(i);
        } : void 0,
        canContinue: v,
        onAssetChanged: (i) => {
          re(), h?.(i);
        }
      }
    ) : null,
    /* @__PURE__ */ e(
      We,
      {
        teamID: n,
        asset: Ye,
        onClose: () => de(null),
        onRenamed: (i) => {
          w((N) => ({
            ...N,
            items: N.items.map(
              (D) => D.id === i.id ? i : D
            )
          })), h?.(i), re();
        }
      }
    ),
    /* @__PURE__ */ e(
      wt,
      {
        open: !!X,
        layerZIndex: yt,
        onOpenChange: (i) => {
          !i && !W && ee(null);
        },
        title: "移入回收站？",
        desc: X?.kind === "collection" ? `“${X.name}”及集合内素材将移入回收站，你可以稍后恢复。` : `“${X?.name || "该资产"}”将从资产列表移除，你可以稍后在回收站中恢复。`,
        confirmText: "移入回收站",
        destructive: !0,
        isLoading: !!W,
        handleConfirm: () => {
          dn();
        }
      }
    )
  ] });
}
function ve({
  icon: n,
  text: t = "",
  error: a = !1
}) {
  return /* @__PURE__ */ s("div", { className: `wb-asset-state ${a ? "is-error" : ""}`.trim(), children: [
    n,
    t ? /* @__PURE__ */ e("p", { children: t }) : null
  ] });
}
function vt(n, t) {
  const a = { ...Ne, ...n || {} };
  return t.length > 0 && !t.includes(a.kind) && (a.kind = t[0]), a.projectID && (a.sourceType = "project", a.sourceID = a.projectID), a.sourceType !== "project" && (a.projectID = 0, a.assetCateID = 0, a.nodeKey = "", a.role = ""), a;
}
function Nt(n) {
  const t = Xe.filter(
    (r) => r.key !== "collection"
  ), a = t.map((r) => r.key).filter((r) => n?.includes(r));
  return a.length === t.length ? [] : a;
}
function kt({
  teamID: n,
  onContinue: t,
  canContinue: a,
  catalogOptions: r
}) {
  async function c(d) {
    return (await et({ teamID: n, files: d })).map(({ asset: p }) => nt(p)).filter((p) => p.id > 0);
  }
  return /* @__PURE__ */ e(
    gt,
    {
      teamID: n,
      onLocalUpload: c,
      onContinue: t,
      canContinue: a,
      catalogOptions: r
    }
  );
}
const Et = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkbenchAssetPage: kt
}, Symbol.toStringTag, { value: "Module" }));
export {
  gt as A,
  ct as a,
  Te as b,
  Et as c
};
