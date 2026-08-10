import { a as e, j as s, F as ve } from "./_commonjsHelpers-CTFd9u1x.js";
import { w as Ge, z as He, L as ue, d as Qe, T as Ye, c as Ze, A as en, D as nn, ay as tn, G as Ie, R as sn, a5 as Te, ar as an, o as rn, p as ln, X as on } from "./vendor-icons-Cc7Kl3It.js";
import { d as se, l as m, u as ce, o as de, b as cn } from "./react-C7Xtl8sB.js";
import { c as dn } from "./preloadable-PCKj9Z7v.js";
import { a6 as un, k as Me, B as j, C as hn, t as pn, v as Re, a7 as fn, a8 as je, a9 as mn, aa as bn, ab as gn, ac as yn, ad as wn, J as vn, H as kn } from "./storyboard-grid-view-CJXm84yJ.js";
import { j as te } from "./site-config-BVY1isir.js";
import { m as Nn } from "./confirm-dialog-D2pOx0vH.js";
import { t as ee } from "./index-BxqXLJC9.js";
import { u as An, A as Cn, a as Sn } from "./asset-detail-dialog-w-UaqteB.js";
import { u as Dn } from "./auth-scope-DtEYh2HY.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./asset-page-BIgzXX90.css", import.meta.url).href]);
function $n({
  asset: n,
  sourceLabels: a,
  view: r = "assets",
  selectable: d = !1,
  selected: p = !1,
  used: A = !1,
  busy: b = !1,
  onOpen: C,
  onRename: v,
  onDelete: k,
  onRestore: B,
  onSelect: N
}) {
  const M = r === "trash", w = n.kind === "collection", l = w ? 0 : un(n.version?.content, n.kind), D = d && !w && !!N, $ = D && (b || A), X = D ? A ? `${n.name}已使用` : p ? `取消选择${n.name}` : `选择${n.name}` : `${w ? "打开集合" : "查看"}${n.name}`, W = w ? /* @__PURE__ */ e(On, { asset: n }) : /* @__PURE__ */ e(
    Me,
    {
      kind: n.kind,
      content: n.version?.content,
      summary: n.summary,
      compact: !0
    }
  );
  function K() {
    if (D) {
      $ || N?.(n);
      return;
    }
    C(n);
  }
  return /* @__PURE__ */ s(
    "article",
    {
      className: `wb-asset-card ${w ? "is-collection" : ""} ${p ? "is-selected" : ""} ${A ? "is-used" : ""} ${M ? "is-trash" : ""}`.trim(),
      children: [
        /* @__PURE__ */ s("div", { className: "wb-asset-card-main", children: [
          /* @__PURE__ */ s("div", { className: "wb-asset-card-preview", children: [
            W,
            l > 1 ? /* @__PURE__ */ s("span", { className: "wb-asset-media-count", children: [
              l,
              " 项"
            ] }) : null,
            n.kind !== "audio" ? /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                className: "wb-asset-card-preview-open",
                disabled: $,
                onClick: K,
                "aria-label": X
              }
            ) : null
          ] }),
          /* @__PURE__ */ e(j, { label: n.name, children: /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              className: "wb-asset-card-copy",
              disabled: $,
              onClick: K,
              children: [
                /* @__PURE__ */ e("strong", { children: n.name }),
                /* @__PURE__ */ e("span", { children: w ? `集合 · ${n.collectionCount} 项素材` : `${hn(n.sourceType, a)} · ${pn(n.kind)}` })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ e("span", { className: "wb-asset-card-kind-icon", children: /* @__PURE__ */ e(Re, { kind: n.kind }) }),
        /* @__PURE__ */ s("div", { className: "wb-asset-card-actions", children: [
          D && !M ? /* @__PURE__ */ e(j, { label: "查看详情", children: /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              disabled: b,
              onClick: (H) => {
                H.stopPropagation(), C(n);
              },
              children: [
                /* @__PURE__ */ e(Ge, { "aria-hidden": "true" }),
                /* @__PURE__ */ e("span", { className: "sr-only", children: "查看详情" })
              ]
            }
          ) }) : null,
          M ? null : /* @__PURE__ */ e(j, { label: "修改标题", children: /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              disabled: b,
              onClick: () => v(n),
              children: [
                /* @__PURE__ */ e(He, { "aria-hidden": "true" }),
                /* @__PURE__ */ e("span", { className: "sr-only", children: "修改标题" })
              ]
            }
          ) }),
          M && B ? /* @__PURE__ */ e(j, { label: "恢复资产", children: /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              className: "is-restore",
              disabled: b,
              onClick: () => B(n),
              children: [
                b ? /* @__PURE__ */ e(ue, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ e(Qe, { "aria-hidden": "true" }),
                /* @__PURE__ */ e("span", { className: "sr-only", children: "恢复资产" })
              ]
            }
          ) }) : k ? /* @__PURE__ */ e(j, { label: "移入回收站", children: /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              className: "is-danger",
              disabled: b,
              onClick: () => k(n),
              children: [
                b ? /* @__PURE__ */ e(ue, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ e(Ye, { "aria-hidden": "true" }),
                /* @__PURE__ */ e("span", { className: "sr-only", children: "移入回收站" })
              ]
            }
          ) }) : null,
          !w && !M && d && N ? /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              className: `is-primary ${p ? "is-selected" : ""} ${A ? "is-used" : ""}`.trim(),
              disabled: b || A,
              onClick: K,
              children: [
                /* @__PURE__ */ e(Ze, { "aria-hidden": "true" }),
                A ? "已使用" : p ? "已选" : "使用"
              ]
            }
          ) : null
        ] })
      ]
    }
  );
}
function On({ asset: n }) {
  const a = n.collectionPreviews.slice(0, 4);
  return a.length === 0 ? /* @__PURE__ */ s("div", { className: "wb-asset-collection-empty", children: [
    /* @__PURE__ */ e(Re, { kind: "collection" }),
    /* @__PURE__ */ e("span", { children: n.collectionCount > 0 ? `${n.collectionCount} 项素材` : "空集合" })
  ] }) : /* @__PURE__ */ s("div", { className: `wb-asset-collection-preview has-${a.length}`, children: [
    a.map((r) => /* @__PURE__ */ e("div", { children: /* @__PURE__ */ e(Me, { kind: r.kind, content: r.content, compact: !0 }) }, r.id)),
    /* @__PURE__ */ s("span", { children: [
      n.collectionCount,
      " 项"
    ] })
  ] });
}
const Fn = [
  { key: "", label: "全部" },
  ...mn
], $e = [
  { key: "", label: "全部" },
  ...je
];
function In({
  filters: n,
  options: a,
  scopeProjectID: r = 0,
  sourceLabels: d = {},
  allowedKinds: p = [],
  view: A,
  collectionName: b,
  onCollectionBack: C,
  onChange: v,
  onViewChange: k
}) {
  const B = [
    { key: "", label: "全部" },
    ...fn.map((l) => ({
      ...l,
      label: d[l.key] || l.label
    }))
  ], N = a.assetCates.length > 0, M = p.length > 0 ? $e.filter(
    (l) => l.key && p.includes(l.key)
  ) : $e;
  function w(l) {
    const D = l === "project" ? r : 0;
    v({
      ...n,
      sourceType: l,
      sourceID: D,
      projectID: D,
      assetCateID: 0,
      nodeKey: "",
      role: ""
    });
  }
  return /* @__PURE__ */ s("div", { className: "wb-asset-filters", children: [
    b && C ? /* @__PURE__ */ e(pe, { label: "集合", children: /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: "wb-asset-collection-back",
        onClick: C,
        children: [
          /* @__PURE__ */ e(en, { "aria-hidden": "true" }),
          /* @__PURE__ */ e(nn, { "aria-hidden": "true" }),
          /* @__PURE__ */ e("span", { children: b })
        ]
      }
    ) }) : /* @__PURE__ */ s(pe, { label: "来源", children: [
      /* @__PURE__ */ e(
        ge,
        {
          options: B,
          value: n.sourceType,
          onChange: w
        }
      ),
      n.sourceType === "project" ? /* @__PURE__ */ s(ve, { children: [
        r > 0 ? null : /* @__PURE__ */ e(
          fe,
          {
            label: d.project || "创作",
            value: n.projectID,
            options: a.projects,
            onChange: (l) => v({
              ...n,
              projectID: l,
              sourceID: l,
              assetCateID: 0,
              nodeKey: ""
            })
          }
        ),
        N ? /* @__PURE__ */ e(
          fe,
          {
            label: "资产分类",
            value: n.assetCateID,
            options: a.assetCates,
            onChange: (l) => v({ ...n, assetCateID: l, nodeKey: "" })
          }
        ) : null
      ] }) : null,
      n.sourceType === "tool" ? /* @__PURE__ */ e(
        fe,
        {
          label: d.tool || "工具",
          value: n.sourceID,
          options: a.tools,
          onChange: (l) => v({ ...n, sourceID: l })
        }
      ) : null,
      n.sourceType === "dialogue" ? /* @__PURE__ */ e(
        fe,
        {
          label: "角色",
          value: n.sourceID,
          options: a.dialogues,
          onChange: (l) => v({ ...n, sourceID: l })
        }
      ) : null
    ] }),
    !b && n.sourceType === "project" && N ? /* @__PURE__ */ e(pe, { label: "资产", children: /* @__PURE__ */ e(
      ge,
      {
        options: Fn,
        value: n.role,
        onChange: (l) => v({ ...n, role: l })
      }
    ) }) : null,
    /* @__PURE__ */ e(
      pe,
      {
        label: "类型",
        trailing: /* @__PURE__ */ e(Tn, { view: A, onChange: k }),
        children: /* @__PURE__ */ e(
          ge,
          {
            options: M,
            value: n.kind,
            onChange: (l) => v({ ...n, kind: l })
          }
        )
      }
    )
  ] });
}
function pe({
  label: n,
  children: a,
  trailing: r
}) {
  return /* @__PURE__ */ s("div", { className: "wb-asset-filter-row", children: [
    /* @__PURE__ */ e("strong", { children: n }),
    /* @__PURE__ */ s("div", { className: "wb-asset-filter-controls", children: [
      a,
      r
    ] })
  ] });
}
function Tn({
  view: n,
  onChange: a
}) {
  return /* @__PURE__ */ s("div", { className: "wb-asset-view-switch", role: "tablist", "aria-label": "资产视图", children: [
    /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": n === "assets",
        className: n === "assets" ? "is-active" : "",
        onClick: () => a("assets"),
        children: [
          /* @__PURE__ */ e(tn, { "aria-hidden": "true" }),
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
        onClick: () => a("trash"),
        children: [
          /* @__PURE__ */ e(Ie, { "aria-hidden": "true" }),
          /* @__PURE__ */ e("span", { children: "回收站" })
        ]
      }
    )
  ] });
}
function ge({
  options: n,
  value: a,
  onChange: r
}) {
  return /* @__PURE__ */ e("div", { className: "wb-asset-segments", children: n.map((d) => /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      className: a === d.key ? "is-active" : "",
      onClick: () => r(d.key),
      children: d.label
    },
    d.key || "all"
  )) });
}
function fe({
  label: n,
  value: a,
  options: r,
  onChange: d
}) {
  return /* @__PURE__ */ s("label", { className: "wb-asset-select", children: [
    /* @__PURE__ */ e("span", { className: "sr-only", children: n }),
    /* @__PURE__ */ s(
      "select",
      {
        value: a || "",
        onChange: (p) => d(Number(p.target.value)),
        children: [
          /* @__PURE__ */ s("option", { value: "", children: [
            "全部",
            n
          ] }),
          r.map((p) => /* @__PURE__ */ e("option", { value: p.id, children: p.name }, p.id))
        ]
      }
    )
  ] });
}
const we = {
  sourceType: "",
  sourceID: 0,
  projectID: 0,
  assetCateID: 0,
  nodeKey: "",
  role: "",
  kind: ""
}, Mn = Nn.ConfirmDialog, Oe = {
  projects: [],
  tools: [],
  dialogues: [],
  assetCates: []
}, ne = {
  items: [],
  page: 1,
  pageSize: 24,
  total: 0,
  hasMore: !1
};
function Ee({
  teamID: n,
  scopeProjectID: a = 0,
  initialFilters: r,
  selectable: d = !1,
  excludeCollections: p = !1,
  selectedAssetIDs: A,
  usedAssetIDs: b,
  allowedKinds: C,
  onSelect: v,
  onContinue: k,
  canContinue: B,
  onAssetChanged: N,
  onAssetRemoved: M,
  onLocalUpload: w,
  uploadAccept: l,
  headerAction: D,
  reloadSignal: $ = 0,
  catalogOptions: X,
  contentMode: W = "preview",
  detailLayer: K = "default",
  className: H = ""
}) {
  const L = Dn(), O = An(), x = JSON.stringify(C || []), z = se(
    () => jn(C),
    [x]
  ), P = JSON.stringify({ initialFilters: r, normalizedAllowedKinds: z }), G = se(
    () => Rn(r, z),
    [P]
  ), [J, _] = m(G), [g, S] = m(
    null
  ), [y, Q] = m("assets"), [me, ae] = m(Oe), [u, E] = m(ne), [re, F] = m(0), [be, i] = m(null), [o, c] = m(null), [f, I] = m(0), [R, Y] = m(!0), [q, Z] = m(!1), [Ke, ke] = m(!0), [Ne, V] = m(""), [Le, ze] = m(0), U = ce(0), Ae = ce(null), ie = ce(G), le = ce("assets"), Ce = JSON.stringify(A || []), Pe = se(
    () => new Set(JSON.parse(Ce)),
    [Ce]
  ), Se = JSON.stringify(b || []), Je = se(
    () => new Set(JSON.parse(Se)),
    [Se]
  );
  de(() => {
    U.current += 1, _(G), ie.current = G, S(null), Q("assets"), le.current = "assets", ae(Oe), E(ne), F(0), i(null), c(null), I(0), Z(!1), V("");
  }, [L, G, a, n]), de(() => {
    let t = !0;
    return ke(!0), bn(n, X, L).then((h) => {
      t && ae(h);
    }).catch((h) => {
      t && V(te(h, "加载资产筛选项失败"));
    }).finally(() => {
      t && ke(!1);
    }), () => {
      t = !1;
    };
  }, [X, L, n]);
  const he = cn(
    async (t) => {
      const h = ++U.current;
      Y(!0), V("");
      try {
        const T = await gn({
          teamID: n,
          scopeProjectID: a,
          filters: J,
          view: y,
          contentMode: W,
          page: t,
          pageSize: 24,
          collectionID: g?.id,
          excludeCollections: p,
          requestScopeKey: L
        });
        h === U.current && E(T);
      } catch (T) {
        h === U.current && V(te(T, "加载资产失败"));
      } finally {
        h === U.current && Y(!1);
      }
    },
    [
      g?.id,
      W,
      p,
      J,
      L,
      a,
      n,
      y
    ]
  );
  de(() => {
    he(1);
  }, [he, $, Le]);
  function Be(t) {
    _(t), g || (ie.current = t), E((h) => ({ ...h, page: 1 }));
  }
  function oe() {
    ze((t) => t + 1);
  }
  function xe(t) {
    if (t.kind !== "collection") {
      F(t.id);
      return;
    }
    ie.current = J, le.current = y, S(t), _({
      ...we,
      kind: J.kind === "collection" ? z.length === 1 ? z[0] : "" : J.kind
    }), E(ne), F(0), V("");
  }
  function _e() {
    U.current += 1, S(null), _(ie.current), Q(le.current), E(ne), F(0), V("");
  }
  function qe(t) {
    t === y || f || (U.current += 1, Q(t), g || (le.current = t), E(ne), F(0), i(null), c(null), V(""));
  }
  async function Ve() {
    if (!o || f) return;
    const t = o.id;
    I(t);
    try {
      await wn({ teamID: n, assetID: t }), c(null), re === t && F(0), M?.(t), ee.success("资产已移入回收站"), oe();
    } catch (h) {
      ee.error(te(h, "删除资产失败"));
    } finally {
      I(0);
    }
  }
  async function Ue(t) {
    if (!f) {
      I(t.id);
      try {
        const h = await yn({ teamID: n, assetID: t.id });
        N?.(h), ee.success("资产已恢复"), oe();
      } catch (h) {
        ee.error(te(h, "恢复资产失败"));
      } finally {
        I(0);
      }
    }
  }
  async function Xe(t) {
    const h = Array.from(t.target.files || []);
    if (t.target.value = "", !(!w || h.length === 0 || q)) {
      Z(!0);
      try {
        const T = await w(h);
        if (T.length === 0)
          throw new Error("上传完成，但没有生成可用资产");
        T.forEach((We) => N?.(We));
        const De = {
          ...we,
          sourceType: "upload",
          kind: z.length === 1 ? z[0] : ""
        };
        U.current += 1, S(null), Q("assets"), le.current = "assets", _(De), ie.current = De, E(ne), F(0), V(""), ee.success(`已上传 ${T.length} 项资产`);
      } catch (T) {
        ee.error(te(T, "上传资产失败"));
      } finally {
        Z(!1);
      }
    }
  }
  return /* @__PURE__ */ s("section", { className: `wb-asset-browser ${H}`.trim(), children: [
    /* @__PURE__ */ s("header", { className: "wb-asset-browser-head", children: [
      /* @__PURE__ */ e(
        In,
        {
          filters: J,
          options: me,
          scopeProjectID: a,
          sourceLabels: O,
          allowedKinds: z,
          view: y,
          collectionName: g?.name,
          onCollectionBack: g ? _e : void 0,
          onChange: Be,
          onViewChange: qe
        }
      ),
      /* @__PURE__ */ s("div", { className: "wb-asset-browser-actions", children: [
        /* @__PURE__ */ e("span", { children: R ? "正在加载" : `${u.total} 项` }),
        /* @__PURE__ */ e(j, { label: "刷新资产", children: /* @__PURE__ */ s("button", { type: "button", onClick: oe, children: [
          /* @__PURE__ */ e(sn, { className: R ? "is-spinning" : "" }),
          /* @__PURE__ */ e("span", { className: "sr-only", children: "刷新资产" })
        ] }) }),
        !g && w ? /* @__PURE__ */ s(ve, { children: [
          /* @__PURE__ */ e(j, { label: "本地上传", children: /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              className: "wb-asset-local-upload",
              disabled: q,
              onClick: () => Ae.current?.click(),
              children: [
                q ? /* @__PURE__ */ e(ue, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ e(Te, { "aria-hidden": "true" }),
                /* @__PURE__ */ e("span", { children: q ? "上传中" : "本地上传" })
              ]
            }
          ) }),
          /* @__PURE__ */ e(
            "input",
            {
              ref: Ae,
              type: "file",
              hidden: !0,
              multiple: !0,
              accept: l,
              onChange: Xe
            }
          )
        ] }) : null,
        g ? null : D
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "wb-asset-browser-body", children: R && u.items.length === 0 ? /* @__PURE__ */ e(ye, { icon: /* @__PURE__ */ e(ue, { className: "is-spinning" }) }) : Ne ? /* @__PURE__ */ e(ye, { text: Ne, error: !0 }) : u.items.length === 0 ? /* @__PURE__ */ e(
      ye,
      {
        icon: y === "trash" ? /* @__PURE__ */ e(Ie, {}) : /* @__PURE__ */ e(an, {}),
        text: Ke ? "正在读取资产配置" : y === "trash" ? "回收站为空" : g ? "集合内暂无符合条件的资产" : "暂无符合条件的资产"
      }
    ) : /* @__PURE__ */ e("div", { className: "wb-asset-grid", children: u.items.map((t) => /* @__PURE__ */ e(
      $n,
      {
        asset: t,
        sourceLabels: O,
        view: y,
        selectable: t.kind !== "collection" && d && y === "assets",
        selected: y === "assets" && Pe.has(t.id),
        used: y === "assets" && Je.has(t.id),
        busy: f === t.id,
        onOpen: xe,
        onRename: i,
        onDelete: y === "assets" ? c : void 0,
        onRestore: y === "trash" ? Ue : void 0,
        onSelect: v
      },
      t.id
    )) }) }),
    u.total > u.pageSize ? /* @__PURE__ */ s("footer", { className: "wb-asset-pagination", children: [
      /* @__PURE__ */ e(j, { label: "上一页", children: /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          disabled: u.page <= 1 || R,
          onClick: () => {
            he(u.page - 1);
          },
          children: /* @__PURE__ */ e(rn, {})
        }
      ) }),
      /* @__PURE__ */ s("span", { children: [
        u.page,
        " / ",
        Math.max(1, Math.ceil(u.total / u.pageSize))
      ] }),
      /* @__PURE__ */ e(j, { label: "下一页", children: /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          disabled: !u.hasMore || R,
          onClick: () => {
            he(u.page + 1);
          },
          children: /* @__PURE__ */ e(ln, {})
        }
      ) })
    ] }) : null,
    re ? /* @__PURE__ */ e(
      Cn,
      {
        teamID: n,
        assetID: re,
        selectable: d && y === "assets",
        layer: K,
        onClose: () => F(0),
        onSelect: v ? (t) => {
          F(0), v(t);
        } : void 0,
        onContinue: k ? (t) => {
          F(0), k(t);
        } : void 0,
        canContinue: B,
        onAssetChanged: (t) => {
          oe(), N?.(t);
        }
      }
    ) : null,
    /* @__PURE__ */ e(
      Sn,
      {
        teamID: n,
        asset: be,
        onClose: () => i(null),
        onRenamed: (t) => {
          E((h) => ({
            ...h,
            items: h.items.map(
              (T) => T.id === t.id ? t : T
            )
          })), N?.(t), oe();
        }
      }
    ),
    /* @__PURE__ */ e(
      Mn,
      {
        open: !!o,
        onOpenChange: (t) => {
          !t && !f && c(null);
        },
        title: "移入回收站？",
        desc: o?.kind === "collection" ? `“${o.name}”及集合内素材将移入回收站，你可以稍后恢复。` : `“${o?.name || "该资产"}”将从资产列表移除，你可以稍后在回收站中恢复。`,
        confirmText: "移入回收站",
        destructive: !0,
        isLoading: !!f,
        handleConfirm: () => {
          Ve();
        }
      }
    )
  ] });
}
function ye({
  icon: n,
  text: a = "",
  error: r = !1
}) {
  return /* @__PURE__ */ s("div", { className: `wb-asset-state ${r ? "is-error" : ""}`.trim(), children: [
    n,
    a ? /* @__PURE__ */ e("p", { children: a }) : null
  ] });
}
function Rn(n, a) {
  const r = { ...we, ...n || {} };
  return a.length > 0 && !a.includes(r.kind) && (r.kind = a[0]), r.projectID && (r.sourceType = "project", r.sourceID = r.projectID), r.sourceType !== "project" && (r.projectID = 0, r.assetCateID = 0, r.nodeKey = "", r.role = ""), r;
}
function jn(n) {
  const a = je.filter(
    (d) => d.key !== "collection"
  ), r = a.map((d) => d.key).filter((d) => n?.includes(d));
  return r.length === a.length ? [] : r;
}
function En({
  open: n,
  teamID: a,
  scopeProjectID: r = 0,
  title: d = "选择资产",
  description: p = "使用资产当前版本",
  initialFilters: A,
  allowedKinds: b,
  initialSelectedAssetIDs: C = [],
  usedAssetIDs: v = [],
  multiple: k = !1,
  maxSelection: B = 1,
  confirmSelection: N = !1,
  contentMode: M = "preview",
  validateAsset: w,
  uploadAccept: l,
  onUpload: D,
  onClose: $,
  onConfirm: X
}) {
  const W = JSON.stringify(C), K = se(
    () => Fe(JSON.parse(W)),
    [W]
  ), H = JSON.stringify(A || {}), L = se(
    () => JSON.parse(H),
    [H]
  ), [O, x] = m(
    K
  ), [z, P] = m(/* @__PURE__ */ new Map()), [G, J] = m(
    L
  ), [_, g] = m(""), [S, y] = m(!1), [Q, me] = m(0), ae = ce(null), u = k ? Math.max(1, B) : 1;
  de(() => {
    n && (x(K.slice(0, u)), P(/* @__PURE__ */ new Map()), J(L), g(""), y(!1));
  }, [
    L,
    K,
    n,
    u,
    r,
    a
  ]), de(() => {
    if (!n) return;
    const i = (o) => {
      o.key === "Escape" && !S && $();
    };
    return window.addEventListener("keydown", i), () => window.removeEventListener("keydown", i);
  }, [$, n, S]);
  async function E(i) {
    const o = Array.from(i.target.files || []);
    if (i.target.value = "", !D || o.length === 0 || S) return;
    const c = k ? Math.max(u - O.length, 0) : 1;
    if (c <= 0) {
      g(`最多选择 ${u} 项资产。`);
      return;
    }
    y(!0), g("");
    const f = [], I = [];
    try {
      for (const R of o.slice(0, c))
        try {
          const Y = await D([R]);
          for (const q of Y) {
            const Z = w?.(q) || "";
            Z ? I.push(`${R.name}：${Z}`) : q.id > 0 && f.push(q);
          }
        } catch (Y) {
          I.push(`${R.name}：${te(Y, "上传失败")}`);
        }
      f.length > 0 && (re(f), J({
        sourceType: "upload",
        kind: b?.length === 1 ? b[0] : ""
      }), me((R) => R + 1)), g(I.join("；"));
    } finally {
      y(!1);
    }
  }
  function re(i) {
    const o = Array.from(
      new Map(i.map((c) => [c.id, c])).values()
    );
    P((c) => {
      const f = new Map(c);
      return o.forEach((I) => f.set(I.id, I)), f;
    }), x(
      (c) => k ? Fe([
        ...c,
        ...o.map((f) => f.id)
      ]).slice(0, u) : o[0] ? [o[0].id] : c
    );
  }
  function F(i) {
    if (N && k && O.includes(i.id)) {
      x((c) => c.filter((f) => f !== i.id)), P((c) => {
        const f = new Map(c);
        return f.delete(i.id), f;
      }), g("");
      return;
    }
    const o = w?.(i) || "";
    if (o) {
      g(o);
      return;
    }
    if (g(""), !N) {
      X([i], [i.id]), $();
      return;
    }
    if (!k) {
      x([i.id]), P(/* @__PURE__ */ new Map([[i.id, i]]));
      return;
    }
    if (O.length >= u) {
      g(`最多选择 ${u} 项资产。`);
      return;
    }
    x((c) => [...c, i.id]), P((c) => new Map(c).set(i.id, i));
  }
  function be() {
    const i = O.map((o) => z.get(o)).filter((o) => !!o);
    X(i, O), $();
  }
  return !n || typeof document > "u" ? null : dn(
    /* @__PURE__ */ e(
      "div",
      {
        className: "wb-asset-reference-backdrop",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": d,
        onMouseDown: (i) => {
          i.target === i.currentTarget && !S && $();
        },
        children: /* @__PURE__ */ s("div", { className: "wb-asset-reference-dialog", children: [
          /* @__PURE__ */ s("header", { children: [
            /* @__PURE__ */ s("div", { children: [
              /* @__PURE__ */ e("h2", { children: d }),
              /* @__PURE__ */ e("p", { children: p })
            ] }),
            /* @__PURE__ */ e(j, { label: "关闭", children: /* @__PURE__ */ s("button", { type: "button", disabled: S, onClick: $, children: [
              /* @__PURE__ */ e(on, { "aria-hidden": "true" }),
              /* @__PURE__ */ e("span", { className: "sr-only", children: "关闭" })
            ] }) })
          ] }),
          _ ? /* @__PURE__ */ e("p", { className: "wb-asset-picker-message", children: _ }) : null,
          /* @__PURE__ */ e(
            Ee,
            {
              teamID: a,
              scopeProjectID: r,
              initialFilters: G,
              allowedKinds: b,
              contentMode: M,
              detailLayer: "nested",
              selectable: !0,
              selectedAssetIDs: O,
              usedAssetIDs: v,
              reloadSignal: Q,
              onAssetChanged: (i) => {
                O.includes(i.id) && P(
                  (o) => new Map(o).set(i.id, i)
                );
              },
              onAssetRemoved: (i) => {
                x(
                  (o) => o.filter((c) => c !== i)
                ), P((o) => {
                  const c = new Map(o);
                  return c.delete(i), c;
                });
              },
              headerAction: D ? /* @__PURE__ */ s(ve, { children: [
                /* @__PURE__ */ e(j, { label: "本地上传", children: /* @__PURE__ */ s(
                  "button",
                  {
                    type: "button",
                    className: "wb-asset-local-upload",
                    disabled: S,
                    onClick: () => ae.current?.click(),
                    children: [
                      S ? /* @__PURE__ */ e(ue, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ e(Te, { "aria-hidden": "true" }),
                      /* @__PURE__ */ e("span", { children: S ? "上传中" : "本地上传" })
                    ]
                  }
                ) }),
                /* @__PURE__ */ e(
                  "input",
                  {
                    ref: ae,
                    type: "file",
                    hidden: !0,
                    multiple: k,
                    accept: l,
                    onChange: E
                  }
                )
              ] }) : void 0,
              onSelect: F
            }
          ),
          N ? /* @__PURE__ */ s("footer", { className: "wb-asset-picker-footer", children: [
            /* @__PURE__ */ s("span", { children: [
              "已选 ",
              O.length,
              k ? ` / ${u}` : "",
              " 项"
            ] }),
            /* @__PURE__ */ s("div", { children: [
              /* @__PURE__ */ e("button", { type: "button", onClick: $, children: "取消" }),
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  className: "is-primary",
                  disabled: S || O.length === 0,
                  onClick: be,
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
function Fe(n) {
  return Array.from(
    new Set(n.map(Number).filter((a) => Number.isFinite(a) && a > 0))
  );
}
const Xn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AssetPickerDialog: En
}, Symbol.toStringTag, { value: "Module" }));
function Kn({
  teamID: n,
  onContinue: a,
  canContinue: r,
  catalogOptions: d
}) {
  async function p(A) {
    return (await vn({ teamID: n, files: A })).map(({ asset: C }) => kn(C)).filter((C) => C.id > 0);
  }
  return /* @__PURE__ */ e(
    Ee,
    {
      teamID: n,
      onLocalUpload: p,
      onContinue: a,
      canContinue: r,
      catalogOptions: d
    }
  );
}
const Wn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkbenchAssetPage: Kn
}, Symbol.toStringTag, { value: "Module" }));
export {
  Ee as A,
  En as a,
  Xn as b,
  Wn as c
};
