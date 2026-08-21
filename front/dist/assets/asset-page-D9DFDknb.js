import { a as s, j as e, F as oe } from "./preloadable-Bomi5PEU.js";
import { b as Ce, aD as fn, as as wn, a_ as yn, a$ as vn, a3 as gn, Q as Be, k as Nn, O as Ae, L as _, p as be, h as kn, o as Se, X as Cn, b0 as An, A as Sn, at as Dn, V as Ue, U as Tn, R as Ln, b1 as $n, G as xn, d as In } from "./vendor-icons-B3DKX3la.js";
import { d as ie, a as m, b as U, u as J, e as _e } from "./_commonjsHelpers-61wyk6v6.js";
import { t as Q } from "./index-2TBwAJWu.js";
import { aI as En, B as T, aJ as qe, aK as Je, ad as fe, aL as Ge, aM as He, aN as Mn, d as On, A as Fe, aO as Rn, aP as We, aQ as Fn, aR as Vn, au as Pn, m as zn, C as Kn, aS as jn, D as Bn, n as Un, o as _n, aT as qn, r as Jn, aU as Gn, aV as Hn, aW as Wn, aX as Zn, aY as Ze, aZ as Qn, a_ as Xn, a$ as Yn, b0 as et, b1 as nt, ak as tt, u as at } from "./upload-asset-api-CJCwVOwh.js";
import { V as st, M as Ve } from "./media-inspector-gallery-ho9rlZcO.js";
import { d as rt } from "./file-kind-UfTAlHnR.js";
import { k as E, q as it } from "./site-config-C63CM9jT.js";
import { u as ot } from "./project-dialogs-BNviIblA.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./asset-page-vJcpdGc2.css", import.meta.url).href]);
function Pe({
  content: n,
  summary: t,
  compact: a = !1
}) {
  const r = En(n), o = r.name || t || "文件", d = r.extension ? r.extension.toUpperCase() : "FILE", u = r.extension ? `${r.extension.toUpperCase()} 文件` : "文件";
  return a ? /* @__PURE__ */ s("div", { className: "wb-asset-file-card-preview", children: [
    /* @__PURE__ */ e("strong", { children: d }),
    /* @__PURE__ */ e(T, { label: o, children: /* @__PURE__ */ e("p", { children: o }) }),
    /* @__PURE__ */ e("span", { children: "文件" })
  ] }) : /* @__PURE__ */ s("section", { className: "wb-asset-file-preview", children: [
    /* @__PURE__ */ e("span", { className: "wb-asset-file-icon", children: /* @__PURE__ */ e(Ce, { "aria-hidden": "true" }) }),
    /* @__PURE__ */ s("div", { className: "wb-asset-file-copy", children: [
      /* @__PURE__ */ e(T, { label: o, children: /* @__PURE__ */ e("strong", { children: o }) }),
      /* @__PURE__ */ e("span", { children: u })
    ] }),
    r.url ? /* @__PURE__ */ s("a", { href: r.url, target: "_blank", rel: "noreferrer", children: [
      /* @__PURE__ */ e(fn, { "aria-hidden": "true" }),
      /* @__PURE__ */ e("span", { children: "打开文件" })
    ] }) : /* @__PURE__ */ e("span", { className: "wb-asset-file-unavailable", children: "文件暂不可用" })
  ] });
}
function ye({
  kind: n,
  src: t,
  poster: a
}) {
  const r = ie(null), [o, d] = m(""), [u, w] = m(""), [h, k] = m(""), g = o === t, b = u === t, c = h === t;
  U(() => {
    const S = r.current;
    if (!t || !S || typeof IntersectionObserver > "u") {
      d(t);
      return;
    }
    const A = new IntersectionObserver(
      (L) => {
        L.some((x) => x.isIntersecting) && (d(t), A.disconnect());
      },
      { rootMargin: "320px 0px" }
    );
    return A.observe(S), () => A.disconnect();
  }, [t]);
  function v() {
    w(t), k("");
  }
  function p() {
    w(""), k(t);
  }
  return /* @__PURE__ */ s(
    "div",
    {
      ref: r,
      className: [
        "wb-asset-lazy-cover",
        `is-${n}`,
        b ? "is-loaded" : "is-pending",
        c ? "is-failed" : ""
      ].filter(Boolean).join(" "),
      children: [
        g && !c ? n === "image" ? /* @__PURE__ */ e(
          "img",
          {
            src: t,
            alt: "",
            loading: "lazy",
            decoding: "async",
            onLoad: v,
            onError: p
          }
        ) : /* @__PURE__ */ e(
          st,
          {
            src: t,
            poster: a,
            ariaHidden: !0,
            onLoad: v,
            onError: p
          }
        ) : null,
        c ? /* @__PURE__ */ e("span", { children: "封面加载失败" }) : null
      ]
    }
  );
}
function lt({
  kind: n,
  content: t,
  summary: a
}) {
  const r = qe(n, t), o = a || Je(t) || fe(n), d = Ge(r, "storyboard") ? { text: o } : r;
  return /* @__PURE__ */ e("div", { className: `wb-asset-card-text-preview is-${n}`, children: /* @__PURE__ */ e(
    He,
    {
      output: d,
      fallback: o,
      emptyText: o,
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
  compact: o = !1
}) {
  const d = Mn(t, n), u = d.map((h) => h.url), w = u[0] || "";
  if (!o) {
    const h = n === "audio" ? On(t) : null;
    if ((n === "image" || n === "video") && u.length > 0)
      return /* @__PURE__ */ e(
        Ve,
        {
          kind: n,
          mediaItems: d,
          downloadable: !0,
          className: "wb-asset-media-gallery"
        }
      );
    if (n === "audio")
      return d.length > 0 && (d.length > 1 || d[0]?.thumbnail) ? /* @__PURE__ */ e(
        Ve,
        {
          kind: "audio",
          mediaItems: d,
          downloadable: !0,
          className: "wb-asset-media-gallery",
          supplementalText: h
        }
      ) : /* @__PURE__ */ e(Fe, { src: w, prompt: r, detailed: !0 });
    if (n === "file")
      return /* @__PURE__ */ e(Pe, { content: t, summary: a });
    const k = qe(n, t);
    return /* @__PURE__ */ e(
      He,
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
  return n === "image" && w ? /* @__PURE__ */ e(ye, { kind: "image", src: w }) : n === "video" && w ? /* @__PURE__ */ e(
    ye,
    {
      kind: "video",
      src: w,
      poster: d[0]?.thumbnail
    }
  ) : n === "audio" ? d[0]?.thumbnail ? /* @__PURE__ */ e(ye, { kind: "image", src: d[0].thumbnail }) : /* @__PURE__ */ e(Fe, { src: w }) : n === "file" ? /* @__PURE__ */ e(Pe, { content: t, summary: a, compact: !0 }) : n === "text" || n === "richtext" ? /* @__PURE__ */ e(lt, { kind: n, content: t, summary: a }) : /* @__PURE__ */ e("div", { className: "wb-asset-card-fallback", children: /* @__PURE__ */ e("p", { children: a || Je(t) || fe(n) }) });
}
function Te({ kind: n }) {
  switch (n) {
    case "collection":
      return /* @__PURE__ */ e(Be, { "aria-hidden": "true" });
    case "image":
      return /* @__PURE__ */ e(gn, { "aria-hidden": "true" });
    case "audio":
      return /* @__PURE__ */ e(vn, { "aria-hidden": "true" });
    case "video":
      return /* @__PURE__ */ e(yn, { "aria-hidden": "true" });
    case "file":
      return /* @__PURE__ */ e(wn, { "aria-hidden": "true" });
    default:
      return /* @__PURE__ */ e(Ce, { "aria-hidden": "true" });
  }
}
function ct({
  asset: n,
  sourceLabels: t,
  view: a = "assets",
  selectable: r = !1,
  selected: o = !1,
  used: d = !1,
  busy: u = !1,
  onOpen: w,
  onRename: h,
  onDelete: k,
  onRestore: g,
  onSelect: b
}) {
  const c = a === "trash", v = n.kind === "collection", p = v ? 0 : Rn(n.version?.content, n.kind), S = r && !v && !!b, A = S && (u || d), L = S ? d ? `${n.name}已使用` : o ? `取消选择${n.name}` : `选择${n.name}` : `${v ? "打开集合" : "查看"}${n.name}`, x = v ? /* @__PURE__ */ e(dt, { asset: n }) : /* @__PURE__ */ e(
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
      A || b?.(n);
      return;
    }
    w(n);
  }
  return /* @__PURE__ */ s(
    "article",
    {
      className: `wb-asset-card ${v ? "is-collection" : ""} ${o ? "is-selected" : ""} ${d ? "is-used" : ""} ${c ? "is-trash" : ""}`.trim(),
      children: [
        /* @__PURE__ */ s("div", { className: "wb-asset-card-main", children: [
          /* @__PURE__ */ s("div", { className: "wb-asset-card-preview", children: [
            x,
            p > 1 ? /* @__PURE__ */ s("span", { className: "wb-asset-media-count", children: [
              p,
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
                /* @__PURE__ */ e("span", { children: v ? `集合 · ${n.collectionCount} 项素材` : `${We(n.sourceType, t)} · ${fe(n.kind)}` })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ e("span", { className: "wb-asset-card-kind-icon", children: /* @__PURE__ */ e(Te, { kind: n.kind }) }),
        /* @__PURE__ */ s("div", { className: "wb-asset-card-actions", children: [
          S && !c ? /* @__PURE__ */ e(T, { label: "查看详情", children: /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              disabled: u,
              onClick: (q) => {
                q.stopPropagation(), w(n);
              },
              children: [
                /* @__PURE__ */ e(Nn, { "aria-hidden": "true" }),
                /* @__PURE__ */ e("span", { className: "sr-only", children: "查看详情" })
              ]
            }
          ) }) : null,
          c ? null : /* @__PURE__ */ e(T, { label: "修改标题", children: /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              disabled: u,
              onClick: () => h(n),
              children: [
                /* @__PURE__ */ e(Ae, { "aria-hidden": "true" }),
                /* @__PURE__ */ e("span", { className: "sr-only", children: "修改标题" })
              ]
            }
          ) }),
          c && g ? /* @__PURE__ */ e(T, { label: "恢复资产", children: /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              className: "is-restore",
              disabled: u,
              onClick: () => g(n),
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
                u ? /* @__PURE__ */ e(_, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ e(kn, { "aria-hidden": "true" }),
                /* @__PURE__ */ e("span", { className: "sr-only", children: "移入回收站" })
              ]
            }
          ) }) : null,
          !v && !c && r && b ? /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              className: `is-primary ${o ? "is-selected" : ""} ${d ? "is-used" : ""}`.trim(),
              disabled: u || d,
              onClick: V,
              children: [
                /* @__PURE__ */ e(Se, { "aria-hidden": "true" }),
                d ? "已使用" : o ? "已选" : "使用"
              ]
            }
          ) : null
        ] })
      ]
    }
  );
}
function dt({ asset: n }) {
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
function Qe({
  teamID: n,
  asset: t,
  onClose: a,
  onRenamed: r
}) {
  const [o, d] = m(""), [u, w] = m(!1), [h, k] = m("");
  U(() => {
    t && (d(t.name), w(!1), k(""));
  }, [t]), U(() => {
    if (!t) return;
    const b = (c) => {
      c.key === "Escape" && (c.preventDefault(), c.stopImmediatePropagation(), u || a());
    };
    return window.addEventListener("keydown", b, !0), () => window.removeEventListener("keydown", b, !0);
  }, [t, a, u]);
  async function g(b) {
    b.preventDefault();
    const c = o.trim();
    if (!(!t || !c || u)) {
      w(!0), k("");
      try {
        const v = await Fn({
          teamID: n,
          assetID: t.id,
          name: c
        });
        r(v), a();
      } catch (v) {
        k(E(v, "修改资产标题失败"));
      } finally {
        w(!1);
      }
    }
  }
  return !t || typeof document > "u" ? null : rt(
    /* @__PURE__ */ e(
      "div",
      {
        className: "wb-asset-rename-backdrop",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "修改资产标题",
        onMouseDown: (b) => {
          b.target === b.currentTarget && !u && a();
        },
        children: /* @__PURE__ */ s("form", { className: "wb-asset-rename-dialog", onSubmit: g, children: [
          /* @__PURE__ */ s("header", { children: [
            /* @__PURE__ */ s("div", { children: [
              /* @__PURE__ */ e("span", { className: "wb-asset-rename-icon", children: /* @__PURE__ */ e(Ae, { "aria-hidden": "true" }) }),
              /* @__PURE__ */ s("div", { children: [
                /* @__PURE__ */ e("h2", { children: "修改资产标题" }),
                /* @__PURE__ */ e("p", { children: "只修改资产库中的显示名称。" })
              ] })
            ] }),
            /* @__PURE__ */ e(T, { label: "关闭", children: /* @__PURE__ */ e("button", { type: "button", disabled: u, onClick: a, children: /* @__PURE__ */ e(Cn, { "aria-hidden": "true" }) }) })
          ] }),
          /* @__PURE__ */ s("label", { children: [
            /* @__PURE__ */ e("span", { children: "资产标题" }),
            /* @__PURE__ */ e(
              "input",
              {
                autoFocus: !0,
                value: o,
                maxLength: 128,
                disabled: u,
                placeholder: "请输入资产标题",
                onChange: (b) => d(b.target.value)
              }
            )
          ] }),
          h ? /* @__PURE__ */ e("p", { className: "wb-asset-rename-error", children: h }) : null,
          /* @__PURE__ */ s("footer", { children: [
            /* @__PURE__ */ e("button", { type: "button", disabled: u, onClick: a, children: "取消" }),
            /* @__PURE__ */ s(
              "button",
              {
                type: "submit",
                className: "is-primary",
                disabled: u || !o.trim(),
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
function Xe() {
  const n = it().site.homeMenu;
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
function ut({
  teamID: n,
  assetID: t,
  selectable: a = !1,
  onClose: r,
  onSelect: o,
  onContinue: d,
  canContinue: u,
  onAssetChanged: w,
  layer: h = "default"
}) {
  const k = Xe(), [g, b] = m(null), [c, v] = m(
    null
  ), [p, S] = m(!0), [A, L] = m(0), [x, V] = m(!1), [q, P] = m(!1), [G, M] = m(""), [O, Y] = m(""), R = _e(async () => {
    S(!0), M(""), Y("");
    try {
      const l = ze(await Vn(n, t));
      b(l), v(l.asset.version);
    } catch (l) {
      M(E(l, "加载资产详情失败"));
    } finally {
      S(!1);
    }
  }, [t, n]);
  U(() => {
    R();
  }, [R]), U(() => {
    const l = (y) => {
      y.key !== "Escape" || q || (y.preventDefault(), y.stopImmediatePropagation(), r());
    };
    return window.addEventListener("keydown", l, !0), () => window.removeEventListener("keydown", l, !0);
  }, [r, q]);
  async function F(l) {
    if (!(A || l.id === c?.id)) {
      if (l.id === g?.asset.versionID && g.asset.version) {
        M(""), v(g.asset.version);
        return;
      }
      L(l.id), M("");
      try {
        v(
          await Hn({ teamID: n, assetID: t, versionID: l.id })
        );
      } catch (y) {
        M(E(y, "加载资产版本失败"));
      } finally {
        L(0);
      }
    }
  }
  async function z() {
    if (!g || !g.hasMore || A) return;
    const l = Math.floor(g.versions.length / 20) + 1;
    L(-1), Y("");
    try {
      const y = await Wn({
        teamID: n,
        assetID: t,
        page: l,
        pageSize: 20
      });
      b(
        (K) => K && {
          ...K,
          versions: Ye([...K.versions, ...y.items]),
          versionTotal: y.total,
          hasMore: y.hasMore
        }
      );
    } catch (y) {
      Y(E(y, "加载资产版本失败"));
    } finally {
      L(0);
    }
  }
  async function $() {
    if (!(!g || !c || x)) {
      V(!0), M("");
      try {
        const l = await Gn({
          teamID: n,
          assetID: t,
          versionID: c.id
        }), y = ze({ ...g, asset: l });
        b(y), v(l.version), w?.(l);
      } catch (l) {
        M(E(l, "设置当前版本失败"));
      } finally {
        V(!1);
      }
    }
  }
  const f = g?.asset, C = f?.status === "deleted", H = !!(f && c && f.versionID === c.id), le = J(
    () => Pn(c?.content),
    [c?.content]
  ), ce = J(
    () => Ge(c?.content, "storyboard"),
    [c?.content]
  );
  return /* @__PURE__ */ s(
    Jn,
    {
      ariaLabel: `${f?.name || "资产"}详情`,
      onRequestClose: r,
      layer: h,
      header: /* @__PURE__ */ e(
        Bn,
        {
          icon: f ? /* @__PURE__ */ e(Te, { kind: f.kind }) : /* @__PURE__ */ e(Ce, { size: 16 }),
          title: f?.name || "资产详情",
          subtitle: f ? `${ht(f, k)} · ${fe(f.kind)} · ${qn(f.role)}` : "",
          versionSelect: g && f && c ? /* @__PURE__ */ e(
            _n,
            {
              options: g.versions.map((l) => ({
                id: l.id,
                version: l.version,
                updatedAt: l.updatedAt || l.createdAt,
                value: l
              })),
              currentVersionId: f.versionID,
              selectedVersionId: c.id,
              total: g.versionTotal,
              hasMore: g.hasMore,
              loading: A > 0,
              loadingMore: A === -1,
              error: O,
              disabled: x,
              onSelect: (l) => {
                F(l);
              },
              onLoadMore: () => {
                z();
              },
              onRetry: () => {
                z();
              }
            }
          ) : void 0,
          state: C ? /* @__PURE__ */ e("span", { className: "wb-detail-state", children: "回收站" }) : A > 0 ? /* @__PURE__ */ s("span", { className: "wb-detail-state is-saving", children: [
            /* @__PURE__ */ e(_, { size: 12, className: "wb-detail-spin" }),
            "读取中"
          ] }) : /* @__PURE__ */ e("span", { className: "wb-detail-state", children: "只读预览" }),
          updatedAt: Un(
            c?.updatedAt || c?.createdAt
          ),
          actions: f && c && !C ? /* @__PURE__ */ s(oe, { children: [
            /* @__PURE__ */ s(
              "button",
              {
                type: "button",
                className: "wb-detail-command",
                onClick: () => P(!0),
                children: [
                  /* @__PURE__ */ e(Ae, { size: 13 }),
                  /* @__PURE__ */ e("span", { children: "修改标题" })
                ]
              }
            ),
            H ? /* @__PURE__ */ e(
              mt,
              {
                asset: f,
                selectable: a,
                onSelect: o,
                onContinue: d,
                canContinue: u
              }
            ) : /* @__PURE__ */ e(
              pt,
              {
                currentVersion: f.version,
                loading: !!A,
                saving: x,
                onReturn: (l) => {
                  F(l);
                },
                onMakeCurrent: () => {
                  $();
                }
              }
            )
          ] }) : void 0,
          onClose: r
        }
      ),
      children: [
        /* @__PURE__ */ e("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ e("div", { className: "wb-detail-scroll", children: p ? /* @__PURE__ */ s("div", { className: "wb-detail-content-state", children: [
          /* @__PURE__ */ e(_, { size: 18, className: "wb-detail-spin" }),
          /* @__PURE__ */ e("span", { children: "正在读取资产" })
        ] }) : !f || !c ? /* @__PURE__ */ s("div", { className: "wb-detail-content-state is-error", children: [
          /* @__PURE__ */ e("span", { children: G || "资产不存在" }),
          /* @__PURE__ */ s("button", { type: "button", onClick: () => {
            R();
          }, children: [
            /* @__PURE__ */ e(be, { size: 13 }),
            "重试"
          ] })
        ] }) : /* @__PURE__ */ s("div", { className: `wb-detail-readonly-content is-${f.kind}`, children: [
          G ? /* @__PURE__ */ e("p", { className: "wb-detail-error-banner", children: G }) : null,
          le ? /* @__PURE__ */ e(zn, { grid: le, variant: "detail" }) : ce ? /* @__PURE__ */ e(
            Kn,
            {
              output: c.content,
              fallback: c.summary || f.summary,
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
              content: c.content,
              summary: c.summary || f.summary,
              prompt: jn(c)
            },
            c.id
          )
        ] }) }) }),
        /* @__PURE__ */ e(
          Qe,
          {
            teamID: n,
            asset: q && f || null,
            onClose: () => P(!1),
            onRenamed: (l) => {
              b(
                (y) => y && { ...y, asset: l }
              ), w?.(l);
            }
          }
        )
      ]
    }
  );
}
function pt({
  currentVersion: n,
  loading: t,
  saving: a,
  onReturn: r,
  onMakeCurrent: o
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
        onClick: o,
        children: [
          a ? /* @__PURE__ */ e(_, { size: 13, className: "wb-detail-spin" }) : /* @__PURE__ */ e(Se, { size: 13 }),
          /* @__PURE__ */ e("span", { children: a ? "设置中" : "设为当前版本" })
        ]
      }
    )
  ] });
}
function mt({
  asset: n,
  selectable: t,
  onSelect: a,
  onContinue: r,
  canContinue: o
}) {
  return /* @__PURE__ */ s(oe, { children: [
    r && bt(n) && (o?.(n) ?? !0) ? /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        onClick: () => r(n),
        children: [
          n.sourceType === "dialogue" ? /* @__PURE__ */ e(An, { size: 14 }) : /* @__PURE__ */ e(be, { size: 14 }),
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
  const t = Ye(
    n.asset.version ? [n.asset.version, ...n.versions] : n.versions
  );
  return {
    ...n,
    versions: t,
    versionTotal: Math.max(n.versionTotal, t.length)
  };
}
function Ye(n) {
  return Array.from(
    new Map(n.map((t) => [t.id, t])).values()
  );
}
function ht(n, t) {
  const a = We(n.sourceType, t);
  return n.sourceName && n.sourceName !== a ? `${a} / ${n.sourceName}` : a;
}
function bt(n) {
  return n.role === "material" && (n.sourceType === "tool" || n.sourceType === "dialogue");
}
const ft = [
  { key: "", label: "全部" },
  ...Qn
], Ke = [
  { key: "", label: "全部" },
  ...Ze
];
function wt({
  filters: n,
  options: t,
  scopeProjectID: a = 0,
  sourceLabels: r = {},
  allowedKinds: o = [],
  view: d,
  collectionName: u,
  onCollectionBack: w,
  onChange: h,
  onViewChange: k
}) {
  const g = [
    { key: "", label: "全部" },
    ...Zn.map((p) => ({
      ...p,
      label: r[p.key] || p.label
    }))
  ], b = t.assetCates.length > 0, c = o.length > 0 ? Ke.filter(
    (p) => p.key && o.includes(p.key)
  ) : Ke;
  function v(p) {
    const S = p === "project" ? a : 0;
    h({
      ...n,
      sourceType: p,
      sourceID: S,
      projectID: S,
      assetCateID: 0,
      nodeKey: "",
      role: ""
    });
  }
  return /* @__PURE__ */ s("div", { className: "wb-asset-filters", children: [
    u && w ? /* @__PURE__ */ e(me, { label: "集合", children: /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: "wb-asset-collection-back",
        onClick: w,
        children: [
          /* @__PURE__ */ e(Sn, { "aria-hidden": "true" }),
          /* @__PURE__ */ e(Be, { "aria-hidden": "true" }),
          /* @__PURE__ */ e("span", { children: u })
        ]
      }
    ) }) : /* @__PURE__ */ s(me, { label: "来源", children: [
      /* @__PURE__ */ e(
        ve,
        {
          options: g,
          value: n.sourceType,
          onChange: v
        }
      ),
      n.sourceType === "project" ? /* @__PURE__ */ s(oe, { children: [
        a > 0 ? null : /* @__PURE__ */ e(
          he,
          {
            label: r.project || "创作",
            value: n.projectID,
            options: t.projects,
            onChange: (p) => h({
              ...n,
              projectID: p,
              sourceID: p,
              assetCateID: 0,
              nodeKey: ""
            })
          }
        ),
        b ? /* @__PURE__ */ e(
          he,
          {
            label: "资产分类",
            value: n.assetCateID,
            options: t.assetCates,
            onChange: (p) => h({ ...n, assetCateID: p, nodeKey: "" })
          }
        ) : null
      ] }) : null,
      n.sourceType === "tool" ? /* @__PURE__ */ e(
        he,
        {
          label: r.tool || "工具",
          value: n.sourceID,
          options: t.tools,
          onChange: (p) => h({ ...n, sourceID: p })
        }
      ) : null,
      n.sourceType === "dialogue" ? /* @__PURE__ */ e(
        he,
        {
          label: "角色",
          value: n.sourceID,
          options: t.dialogues,
          onChange: (p) => h({ ...n, sourceID: p })
        }
      ) : null
    ] }),
    !u && n.sourceType === "project" && b ? /* @__PURE__ */ e(me, { label: "资产", children: /* @__PURE__ */ e(
      ve,
      {
        options: ft,
        value: n.role,
        onChange: (p) => h({ ...n, role: p })
      }
    ) }) : null,
    /* @__PURE__ */ e(
      me,
      {
        label: "类型",
        trailing: /* @__PURE__ */ e(yt, { view: d, onChange: k }),
        children: /* @__PURE__ */ e(
          ve,
          {
            options: c,
            value: n.kind,
            onChange: (p) => h({ ...n, kind: p })
          }
        )
      }
    )
  ] });
}
function me({
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
function yt({
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
          /* @__PURE__ */ e(Dn, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ e(Ue, { "aria-hidden": "true" }),
          /* @__PURE__ */ e("span", { children: "回收站" })
        ]
      }
    )
  ] });
}
function ve({
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
        onChange: (o) => r(Number(o.target.value)),
        children: [
          /* @__PURE__ */ s("option", { value: "", children: [
            "全部",
            n
          ] }),
          a.map((o) => /* @__PURE__ */ e("option", { value: o.id, children: o.name }, o.id))
        ]
      }
    )
  ] });
}
function vt({
  uploading: n,
  progress: t,
  onClick: a
}) {
  const r = gt(n, t), o = n && t && (t.phase !== "preparing" || t.percent > 0) ? t.percent : null;
  return /* @__PURE__ */ e(T, { label: r, children: /* @__PURE__ */ s(
    "button",
    {
      type: "button",
      className: "wb-asset-local-upload",
      disabled: n,
      "aria-busy": n,
      onClick: a,
      children: [
        n ? /* @__PURE__ */ e(_, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ e(Tn, { "aria-hidden": "true" }),
        /* @__PURE__ */ e("span", { children: r }),
        n ? /* @__PURE__ */ e(
          "span",
          {
            className: `wb-asset-upload-progress${o == null ? " is-indeterminate" : ""}`,
            role: "progressbar",
            "aria-label": "上传进度",
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            "aria-valuenow": o ?? void 0,
            "aria-valuetext": o == null ? "正在准备上传" : `${o}%`,
            children: /* @__PURE__ */ e("span", { style: { width: `${o ?? 40}%` } })
          }
        ) : null
      ]
    }
  ) });
}
function gt(n, t) {
  return n ? t ? t.phase === "preparing" ? t.percent > 0 ? `上传中 ${t.percent}%` : "上传中" : t.phase === "saving" ? "处理中" : `上传中 ${t.percent}%` : "上传中" : "本地上传";
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
const Nt = ke.ConfirmDialog, je = {
  projects: [],
  tools: [],
  dialogues: [],
  assetCates: []
}, X = {
  items: [],
  page: 1,
  pageSize: 24,
  total: 0,
  hasMore: !1
}, kt = 10040;
function Ct({
  teamID: n,
  scopeProjectID: t = 0,
  initialFilters: a,
  selectable: r = !1,
  excludeCollections: o = !1,
  selectedAssetIDs: d,
  usedAssetIDs: u,
  allowedKinds: w,
  onSelect: h,
  onContinue: k,
  canContinue: g,
  onAssetChanged: b,
  onAssetRemoved: c,
  onLocalUpload: v,
  uploadAccept: p,
  headerAction: S,
  reloadSignal: A = 0,
  catalogOptions: L,
  contentMode: x = "preview",
  detailLayer: V = "default",
  className: q = ""
}) {
  const P = ot(), G = Xe(), M = JSON.stringify(w || []), O = J(
    () => St(w),
    [M]
  ), Y = JSON.stringify({ initialFilters: a, normalizedAllowedKinds: O }), R = J(
    () => At(a, O),
    [Y]
  ), [F, z] = m(R), [$, f] = m(
    null
  ), [C, H] = m("assets"), [le, ce] = m(je), [l, y] = m(X), [K, I] = m(0), [en, de] = m(null), [W, ee] = m(null), [Z, ne] = m(0), [te, Le] = m(!0), [$e, we] = m(!1), [nn, ue] = m(null), [tn, xe] = m(!0), [Ie, j] = m(""), [an, sn] = m(0), B = ie(0), Ee = ie(null), ae = ie(R), se = ie("assets"), Me = JSON.stringify(d || []), rn = J(
    () => new Set(JSON.parse(Me)),
    [Me]
  ), Oe = JSON.stringify(u || []), on = J(
    () => new Set(JSON.parse(Oe)),
    [Oe]
  );
  U(() => {
    B.current += 1, z(R), ae.current = R, f(null), H("assets"), se.current = "assets", ce(je), y(X), I(0), de(null), ee(null), ne(0), we(!1), ue(null), j("");
  }, [P, R, t, n]), U(() => {
    let i = !0;
    return xe(!0), Xn(n, L, P).then((N) => {
      i && ce(N);
    }).catch((N) => {
      i && j(E(N, "加载资产筛选项失败"));
    }).finally(() => {
      i && xe(!1);
    }), () => {
      i = !1;
    };
  }, [L, P, n]);
  const pe = _e(
    async (i) => {
      const N = ++B.current;
      Le(!0), j("");
      try {
        const D = await Yn({
          teamID: n,
          scopeProjectID: t,
          filters: F,
          view: C,
          contentMode: x,
          page: i,
          pageSize: 24,
          collectionID: $?.id,
          excludeCollections: o,
          requestScopeKey: P
        });
        N === B.current && y(D);
      } catch (D) {
        N === B.current && j(E(D, "加载资产失败"));
      } finally {
        N === B.current && Le(!1);
      }
    },
    [
      $?.id,
      x,
      o,
      F,
      P,
      t,
      n,
      C
    ]
  );
  U(() => {
    pe(1);
  }, [pe, A, an]);
  function ln(i) {
    z(i), $ || (ae.current = i), y((N) => ({ ...N, page: 1 }));
  }
  function re() {
    sn((i) => i + 1);
  }
  function cn(i) {
    if (i.kind !== "collection") {
      I(i.id);
      return;
    }
    ae.current = F, se.current = C, f(i), z({
      ...Ne,
      kind: F.kind === "collection" ? O.length === 1 ? O[0] : "" : F.kind
    }), y(X), I(0), j("");
  }
  function dn() {
    B.current += 1, f(null), z(ae.current), H(se.current), y(X), I(0), j("");
  }
  function un(i) {
    i === C || Z || (B.current += 1, H(i), $ || (se.current = i), y(X), I(0), de(null), ee(null), j(""));
  }
  async function pn() {
    if (!W || Z) return;
    const i = W.id;
    ne(i);
    try {
      await nt({ teamID: n, assetID: i }), ee(null), K === i && I(0), c?.(i), Q.success("资产已移入回收站"), re();
    } catch (N) {
      Q.error(E(N, "删除资产失败"));
    } finally {
      ne(0);
    }
  }
  async function mn(i) {
    if (!Z) {
      ne(i.id);
      try {
        const N = await et({ teamID: n, assetID: i.id });
        b?.(N), Q.success("资产已恢复"), re();
      } catch (N) {
        Q.error(E(N, "恢复资产失败"));
      } finally {
        ne(0);
      }
    }
  }
  async function hn(i) {
    const N = Array.from(i.target.files || []);
    if (i.target.value = "", !(!v || N.length === 0 || $e)) {
      we(!0), ue(null);
      try {
        const D = await v(N, {
          onProgress: ue
        });
        if (D.length === 0)
          throw new Error("上传完成，但没有生成可用资产");
        D.forEach((bn) => b?.(bn));
        const Re = {
          ...Ne,
          sourceType: "upload",
          kind: O.length === 1 ? O[0] : ""
        };
        B.current += 1, f(null), H("assets"), se.current = "assets", z(Re), ae.current = Re, y(X), I(0), j(""), Q.success(`已上传 ${D.length} 项资产`);
      } catch (D) {
        Q.error(E(D, "上传资产失败"));
      } finally {
        we(!1), ue(null);
      }
    }
  }
  return /* @__PURE__ */ s("section", { className: `wb-asset-browser ${q}`.trim(), children: [
    /* @__PURE__ */ s("header", { className: "wb-asset-browser-head", children: [
      /* @__PURE__ */ e(
        wt,
        {
          filters: F,
          options: le,
          scopeProjectID: t,
          sourceLabels: G,
          allowedKinds: O,
          view: C,
          collectionName: $?.name,
          onCollectionBack: $ ? dn : void 0,
          onChange: ln,
          onViewChange: un
        }
      ),
      /* @__PURE__ */ s("div", { className: "wb-asset-browser-actions", children: [
        /* @__PURE__ */ e("span", { children: te ? "正在加载" : `${l.total} 项` }),
        /* @__PURE__ */ e(T, { label: "刷新资产", children: /* @__PURE__ */ s("button", { type: "button", onClick: re, children: [
          /* @__PURE__ */ e(Ln, { className: te ? "is-spinning" : "" }),
          /* @__PURE__ */ e("span", { className: "sr-only", children: "刷新资产" })
        ] }) }),
        !$ && v ? /* @__PURE__ */ s(oe, { children: [
          /* @__PURE__ */ e(
            vt,
            {
              uploading: $e,
              progress: nn,
              onClick: () => Ee.current?.click()
            }
          ),
          /* @__PURE__ */ e(
            "input",
            {
              ref: Ee,
              type: "file",
              hidden: !0,
              multiple: !0,
              accept: p,
              onChange: hn
            }
          )
        ] }) : null,
        $ ? null : S
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "wb-asset-browser-body", children: te && l.items.length === 0 ? /* @__PURE__ */ e(ge, { icon: /* @__PURE__ */ e(_, { className: "is-spinning" }) }) : Ie ? /* @__PURE__ */ e(ge, { text: Ie, error: !0 }) : l.items.length === 0 ? /* @__PURE__ */ e(
      ge,
      {
        icon: C === "trash" ? /* @__PURE__ */ e(Ue, {}) : /* @__PURE__ */ e($n, {}),
        text: tn ? "正在读取资产配置" : C === "trash" ? "回收站为空" : $ ? "集合内暂无符合条件的资产" : "暂无符合条件的资产"
      }
    ) : /* @__PURE__ */ e("div", { className: "wb-asset-grid", children: l.items.map((i) => /* @__PURE__ */ e(
      ct,
      {
        asset: i,
        sourceLabels: G,
        view: C,
        selectable: i.kind !== "collection" && r && C === "assets",
        selected: C === "assets" && rn.has(i.id),
        used: C === "assets" && on.has(i.id),
        busy: Z === i.id,
        onOpen: cn,
        onRename: de,
        onDelete: C === "assets" ? ee : void 0,
        onRestore: C === "trash" ? mn : void 0,
        onSelect: h
      },
      i.id
    )) }) }),
    l.total > l.pageSize ? /* @__PURE__ */ s("footer", { className: "wb-asset-pagination", children: [
      /* @__PURE__ */ e(T, { label: "上一页", children: /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          disabled: l.page <= 1 || te,
          onClick: () => {
            pe(l.page - 1);
          },
          children: /* @__PURE__ */ e(xn, {})
        }
      ) }),
      /* @__PURE__ */ s("span", { children: [
        l.page,
        " / ",
        Math.max(1, Math.ceil(l.total / l.pageSize))
      ] }),
      /* @__PURE__ */ e(T, { label: "下一页", children: /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          disabled: !l.hasMore || te,
          onClick: () => {
            pe(l.page + 1);
          },
          children: /* @__PURE__ */ e(In, {})
        }
      ) })
    ] }) : null,
    K ? /* @__PURE__ */ e(
      ut,
      {
        teamID: n,
        assetID: K,
        selectable: r && C === "assets",
        layer: V,
        onClose: () => I(0),
        onSelect: h ? (i) => {
          I(0), h(i);
        } : void 0,
        onContinue: k ? (i) => {
          I(0), k(i);
        } : void 0,
        canContinue: g,
        onAssetChanged: (i) => {
          re(), b?.(i);
        }
      }
    ) : null,
    /* @__PURE__ */ e(
      Qe,
      {
        teamID: n,
        asset: en,
        onClose: () => de(null),
        onRenamed: (i) => {
          y((N) => ({
            ...N,
            items: N.items.map(
              (D) => D.id === i.id ? i : D
            )
          })), b?.(i), re();
        }
      }
    ),
    /* @__PURE__ */ e(
      Nt,
      {
        open: !!W,
        layerZIndex: kt,
        onOpenChange: (i) => {
          !i && !Z && ee(null);
        },
        title: "移入回收站？",
        desc: W?.kind === "collection" ? `“${W.name}”及集合内素材将移入回收站，你可以稍后恢复。` : `“${W?.name || "该资产"}”将从资产列表移除，你可以稍后在回收站中恢复。`,
        confirmText: "移入回收站",
        destructive: !0,
        isLoading: !!Z,
        handleConfirm: () => {
          pn();
        }
      }
    )
  ] });
}
function ge({
  icon: n,
  text: t = "",
  error: a = !1
}) {
  return /* @__PURE__ */ s("div", { className: `wb-asset-state ${a ? "is-error" : ""}`.trim(), children: [
    n,
    t ? /* @__PURE__ */ e("p", { children: t }) : null
  ] });
}
function At(n, t) {
  const a = { ...Ne, ...n || {} };
  return t.length > 0 && !t.includes(a.kind) && (a.kind = t[0]), a.projectID && (a.sourceType = "project", a.sourceID = a.projectID), a.sourceType !== "project" && (a.projectID = 0, a.assetCateID = 0, a.nodeKey = "", a.role = ""), a;
}
function St(n) {
  const t = Ze.filter(
    (r) => r.key !== "collection"
  ), a = t.map((r) => r.key).filter((r) => n?.includes(r));
  return a.length === t.length ? [] : a;
}
function Dt({
  teamID: n,
  onContinue: t,
  canContinue: a,
  catalogOptions: r
}) {
  async function o(d, u) {
    return (await tt({
      teamID: n,
      files: d,
      onProgress: u?.onProgress
    })).map(({ asset: h }) => at(h)).filter((h) => h.id > 0);
  }
  return /* @__PURE__ */ e(
    Ct,
    {
      teamID: n,
      onLocalUpload: o,
      onContinue: t,
      canContinue: a,
      catalogOptions: r
    }
  );
}
const Ft = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkbenchAssetPage: Dt
}, Symbol.toStringTag, { value: "Module" }));
export {
  Ct as A,
  ut as a,
  Te as b,
  vt as c,
  Ft as d
};
