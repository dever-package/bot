import { j as e, a as r, F as Ae } from "./createLucideIcon-fWv1XcFy.js";
import { L as re } from "./vanilla-BSPxkY5-.js";
import { u as We, A as Ge } from "./auth-scope-Bzy5p9cd.js";
import { A as Se } from "./archive-restore-D9JOj_bb.js";
import { F as He, C as Qe } from "./folder-open-ypoXJW1v.js";
import { C as Xe } from "./chevron-right-DDWuhzEV.js";
import { R as Ye } from "./content-api-CuR5pbI7.js";
import { U as Ze } from "./upload-BAn1zipX.js";
import { m as en } from "./confirm-dialog-vkWX0nGl.js";
import { i as ne, b as p, e as te, c as ce, d as nn } from "./runtime-entry-ClkZDmNs.js";
import { t as K } from "./index-Cf7idtTi.js";
import { ah as tn, A as De, g as A, x as sn, n as an, q as Te, ai as rn, aj as Ie, ak as ln, al as on, am as cn, an as dn, ao as un, T as pn, y as hn } from "./storyboard-grid-view-BldHSQpc.js";
import { C as mn } from "./check-B_RB4H2g.js";
import { E as bn } from "./eye-D9RIhpvx.js";
import { P as fn } from "./pencil-DsS_UhAq.js";
import { R as yn } from "./rotate-ccw-BOBeflIt.js";
import { T as gn } from "./trash-2-C2PWG3er.js";
import { u as vn, A as kn, a as wn } from "./asset-detail-dialog-CWms8tOx.js";
import { A as Cn } from "./arrow-left-8fGzp-c8.js";
import { I as Nn } from "./images-2x5j-SXQ.js";
import { k as W } from "./site-config-DrnclGFw.js";
function An({
  asset: n,
  sourceLabels: s,
  view: a = "assets",
  selectable: i = !1,
  selected: c = !1,
  used: f = !1,
  busy: d = !1,
  onOpen: y,
  onRename: h,
  onDelete: I,
  onRestore: O,
  onSelect: v
}) {
  const w = a === "trash", m = n.kind === "collection", l = m ? 0 : tn(n.version?.content, n.kind), C = i && !m && !!v, L = C && (d || f), G = C ? f ? `${n.name}已使用` : c ? `取消选择${n.name}` : `选择${n.name}` : `${m ? "打开集合" : "查看"}${n.name}`, H = m ? /* @__PURE__ */ e(Sn, { asset: n }) : /* @__PURE__ */ e(
    De,
    {
      kind: n.kind,
      content: n.version?.content,
      summary: n.summary,
      compact: !0
    }
  );
  function P() {
    if (C) {
      L || v?.(n);
      return;
    }
    y(n);
  }
  return /* @__PURE__ */ r(
    "article",
    {
      className: `wb-asset-card ${m ? "is-collection" : ""} ${c ? "is-selected" : ""} ${f ? "is-used" : ""} ${w ? "is-trash" : ""}`.trim(),
      children: [
        /* @__PURE__ */ r("div", { className: "wb-asset-card-main", children: [
          /* @__PURE__ */ r("div", { className: "wb-asset-card-preview", children: [
            H,
            l > 1 ? /* @__PURE__ */ r("span", { className: "wb-asset-media-count", children: [
              l,
              " 项"
            ] }) : null,
            n.kind !== "audio" ? /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                className: "wb-asset-card-preview-open",
                disabled: L,
                onClick: P,
                "aria-label": G
              }
            ) : null
          ] }),
          /* @__PURE__ */ e(A, { label: n.name, children: /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "wb-asset-card-copy",
              disabled: L,
              onClick: P,
              children: [
                /* @__PURE__ */ e("strong", { children: n.name }),
                /* @__PURE__ */ e("span", { children: m ? `集合 · ${n.collectionCount} 项素材` : `${sn(n.sourceType, s)} · ${an(n.kind)}` })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ e("span", { className: "wb-asset-card-kind-icon", children: /* @__PURE__ */ e(Te, { kind: n.kind }) }),
        /* @__PURE__ */ r("div", { className: "wb-asset-card-actions", children: [
          C && !w ? /* @__PURE__ */ e(A, { label: "查看详情", children: /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              disabled: d,
              onClick: (le) => {
                le.stopPropagation(), y(n);
              },
              children: [
                /* @__PURE__ */ e(bn, { "aria-hidden": "true" }),
                /* @__PURE__ */ e("span", { className: "sr-only", children: "查看详情" })
              ]
            }
          ) }) : null,
          w ? null : /* @__PURE__ */ e(A, { label: "修改标题", children: /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              disabled: d,
              onClick: () => h(n),
              children: [
                /* @__PURE__ */ e(fn, { "aria-hidden": "true" }),
                /* @__PURE__ */ e("span", { className: "sr-only", children: "修改标题" })
              ]
            }
          ) }),
          w && O ? /* @__PURE__ */ e(A, { label: "恢复资产", children: /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "is-restore",
              disabled: d,
              onClick: () => O(n),
              children: [
                d ? /* @__PURE__ */ e(re, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ e(yn, { "aria-hidden": "true" }),
                /* @__PURE__ */ e("span", { className: "sr-only", children: "恢复资产" })
              ]
            }
          ) }) : I ? /* @__PURE__ */ e(A, { label: "移入回收站", children: /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "is-danger",
              disabled: d,
              onClick: () => I(n),
              children: [
                d ? /* @__PURE__ */ e(re, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ e(gn, { "aria-hidden": "true" }),
                /* @__PURE__ */ e("span", { className: "sr-only", children: "移入回收站" })
              ]
            }
          ) }) : null,
          !m && !w && i && v ? /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: `is-primary ${c ? "is-selected" : ""} ${f ? "is-used" : ""}`.trim(),
              disabled: d || f,
              onClick: P,
              children: [
                /* @__PURE__ */ e(mn, { "aria-hidden": "true" }),
                f ? "已使用" : c ? "已选" : "使用"
              ]
            }
          ) : null
        ] })
      ]
    }
  );
}
function Sn({ asset: n }) {
  const s = n.collectionPreviews.slice(0, 4);
  return s.length === 0 ? /* @__PURE__ */ r("div", { className: "wb-asset-collection-empty", children: [
    /* @__PURE__ */ e(Te, { kind: "collection" }),
    /* @__PURE__ */ e("span", { children: n.collectionCount > 0 ? `${n.collectionCount} 项素材` : "空集合" })
  ] }) : /* @__PURE__ */ r("div", { className: `wb-asset-collection-preview has-${s.length}`, children: [
    s.map((a) => /* @__PURE__ */ e("div", { children: /* @__PURE__ */ e(De, { kind: a.kind, content: a.content, compact: !0 }) }, a.id)),
    /* @__PURE__ */ r("span", { children: [
      n.collectionCount,
      " 项"
    ] })
  ] });
}
const Dn = [
  { key: "", label: "全部" },
  ...ln
], Ce = [
  { key: "", label: "全部" },
  ...Ie
];
function Tn({
  filters: n,
  options: s,
  scopeProjectID: a = 0,
  sourceLabels: i = {},
  allowedKinds: c = [],
  view: f,
  collectionName: d,
  onCollectionBack: y,
  onChange: h,
  onViewChange: I
}) {
  const O = [
    { key: "", label: "全部" },
    ...rn.map((l) => ({
      ...l,
      label: i[l.key] || l.label
    }))
  ], v = s.assetCates.length > 0, w = c.length > 0 ? Ce.filter(
    (l) => l.key && c.includes(l.key)
  ) : Ce;
  function m(l) {
    const C = l === "project" ? a : 0;
    h({
      ...n,
      sourceType: l,
      sourceID: C,
      projectID: C,
      assetCateID: 0,
      nodeKey: "",
      role: ""
    });
  }
  return /* @__PURE__ */ r("div", { className: "wb-asset-filters", children: [
    d && y ? /* @__PURE__ */ e(se, { label: "集合", children: /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "wb-asset-collection-back",
        onClick: y,
        children: [
          /* @__PURE__ */ e(Cn, { "aria-hidden": "true" }),
          /* @__PURE__ */ e(He, { "aria-hidden": "true" }),
          /* @__PURE__ */ e("span", { children: d })
        ]
      }
    ) }) : /* @__PURE__ */ r(se, { label: "来源", children: [
      /* @__PURE__ */ e(
        de,
        {
          options: O,
          value: n.sourceType,
          onChange: m
        }
      ),
      n.sourceType === "project" ? /* @__PURE__ */ r(Ae, { children: [
        a > 0 ? null : /* @__PURE__ */ e(
          ae,
          {
            label: i.project || "创作",
            value: n.projectID,
            options: s.projects,
            onChange: (l) => h({
              ...n,
              projectID: l,
              sourceID: l,
              assetCateID: 0,
              nodeKey: ""
            })
          }
        ),
        v ? /* @__PURE__ */ e(
          ae,
          {
            label: "资产分类",
            value: n.assetCateID,
            options: s.assetCates,
            onChange: (l) => h({ ...n, assetCateID: l, nodeKey: "" })
          }
        ) : null
      ] }) : null,
      n.sourceType === "tool" ? /* @__PURE__ */ e(
        ae,
        {
          label: i.tool || "工具",
          value: n.sourceID,
          options: s.tools,
          onChange: (l) => h({ ...n, sourceID: l })
        }
      ) : null,
      n.sourceType === "dialogue" ? /* @__PURE__ */ e(
        ae,
        {
          label: "角色",
          value: n.sourceID,
          options: s.dialogues,
          onChange: (l) => h({ ...n, sourceID: l })
        }
      ) : null
    ] }),
    !d && n.sourceType === "project" && v ? /* @__PURE__ */ e(se, { label: "资产", children: /* @__PURE__ */ e(
      de,
      {
        options: Dn,
        value: n.role,
        onChange: (l) => h({ ...n, role: l })
      }
    ) }) : null,
    /* @__PURE__ */ e(
      se,
      {
        label: "类型",
        trailing: /* @__PURE__ */ e(In, { view: f, onChange: I }),
        children: /* @__PURE__ */ e(
          de,
          {
            options: w,
            value: n.kind,
            onChange: (l) => h({ ...n, kind: l })
          }
        )
      }
    )
  ] });
}
function se({
  label: n,
  children: s,
  trailing: a
}) {
  return /* @__PURE__ */ r("div", { className: "wb-asset-filter-row", children: [
    /* @__PURE__ */ e("strong", { children: n }),
    /* @__PURE__ */ r("div", { className: "wb-asset-filter-controls", children: [
      s,
      a
    ] })
  ] });
}
function In({
  view: n,
  onChange: s
}) {
  return /* @__PURE__ */ r("div", { className: "wb-asset-view-switch", role: "tablist", "aria-label": "资产视图", children: [
    /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": n === "assets",
        className: n === "assets" ? "is-active" : "",
        onClick: () => s("assets"),
        children: [
          /* @__PURE__ */ e(Nn, { "aria-hidden": "true" }),
          /* @__PURE__ */ e("span", { children: "资产" })
        ]
      }
    ),
    /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": n === "trash",
        className: n === "trash" ? "is-active" : "",
        onClick: () => s("trash"),
        children: [
          /* @__PURE__ */ e(Se, { "aria-hidden": "true" }),
          /* @__PURE__ */ e("span", { children: "回收站" })
        ]
      }
    )
  ] });
}
function de({
  options: n,
  value: s,
  onChange: a
}) {
  return /* @__PURE__ */ e("div", { className: "wb-asset-segments", children: n.map((i) => /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      className: s === i.key ? "is-active" : "",
      onClick: () => a(i.key),
      children: i.label
    },
    i.key || "all"
  )) });
}
function ae({
  label: n,
  value: s,
  options: a,
  onChange: i
}) {
  return /* @__PURE__ */ r("label", { className: "wb-asset-select", children: [
    /* @__PURE__ */ e("span", { className: "sr-only", children: n }),
    /* @__PURE__ */ r(
      "select",
      {
        value: s || "",
        onChange: (c) => i(Number(c.target.value)),
        children: [
          /* @__PURE__ */ r("option", { value: "", children: [
            "全部",
            n
          ] }),
          a.map((c) => /* @__PURE__ */ e("option", { value: c.id, children: c.name }, c.id))
        ]
      }
    )
  ] });
}
const pe = {
  sourceType: "",
  sourceID: 0,
  projectID: 0,
  assetCateID: 0,
  nodeKey: "",
  role: "",
  kind: ""
}, $n = en.ConfirmDialog, Ne = {
  projects: [],
  tools: [],
  dialogues: [],
  assetCates: []
}, E = {
  items: [],
  page: 1,
  pageSize: 24,
  total: 0,
  hasMore: !1
};
function $e({
  teamID: n,
  scopeProjectID: s = 0,
  initialFilters: a,
  selectable: i = !1,
  excludeCollections: c = !1,
  selectedAssetIDs: f,
  usedAssetIDs: d,
  allowedKinds: y,
  onSelect: h,
  onContinue: I,
  canContinue: O,
  onAssetChanged: v,
  onAssetRemoved: w,
  onLocalUpload: m,
  uploadAccept: l,
  headerAction: C,
  reloadSignal: L = 0,
  catalogOptions: G,
  contentMode: H = "preview",
  detailLayer: P = "default",
  className: le = ""
}) {
  const z = We(), he = vn(), Oe = JSON.stringify(y || []), $ = ne(
    () => Rn(y),
    [Oe]
  ), Re = JSON.stringify({ initialFilters: a, normalizedAllowedKinds: $ }), M = ne(
    () => On(a, $),
    [Re]
  ), [R, _] = p(M), [N, Q] = p(
    null
  ), [u, X] = p("assets"), [je, me] = p(Ne), [b, S] = p(E), [ie, k] = p(0), [Fe, Y] = p(null), [j, B] = p(null), [F, J] = p(0), [q, be] = p(!0), [Z, oe] = p(!1), [Ke, fe] = p(!0), [ye, D] = p(""), [Ee, Le] = p(0), T = te(0), ge = te(null), x = te(M), V = te("assets"), ve = JSON.stringify(f || []), Pe = ne(
    () => new Set(JSON.parse(ve)),
    [ve]
  ), ke = JSON.stringify(d || []), ze = ne(
    () => new Set(JSON.parse(ke)),
    [ke]
  );
  ce(() => {
    T.current += 1, _(M), x.current = M, Q(null), X("assets"), V.current = "assets", me(Ne), S(E), k(0), Y(null), B(null), J(0), oe(!1), D("");
  }, [z, M, s, n]), ce(() => {
    let t = !0;
    return fe(!0), on(n, G, z).then((o) => {
      t && me(o);
    }).catch((o) => {
      t && D(W(o, "加载资产筛选项失败"));
    }).finally(() => {
      t && fe(!1);
    }), () => {
      t = !1;
    };
  }, [G, z, n]);
  const ee = nn(
    async (t) => {
      const o = ++T.current;
      be(!0), D("");
      try {
        const g = await cn({
          teamID: n,
          scopeProjectID: s,
          filters: R,
          view: u,
          contentMode: H,
          page: t,
          pageSize: 24,
          collectionID: N?.id,
          excludeCollections: c,
          requestScopeKey: z
        });
        o === T.current && S(g);
      } catch (g) {
        o === T.current && D(W(g, "加载资产失败"));
      } finally {
        o === T.current && be(!1);
      }
    },
    [
      N?.id,
      H,
      c,
      R,
      z,
      s,
      n,
      u
    ]
  );
  ce(() => {
    ee(1);
  }, [ee, L, Ee]);
  function Me(t) {
    _(t), N || (x.current = t), S((o) => ({ ...o, page: 1 }));
  }
  function U() {
    Le((t) => t + 1);
  }
  function _e(t) {
    if (t.kind !== "collection") {
      k(t.id);
      return;
    }
    x.current = R, V.current = u, Q(t), _({
      ...pe,
      kind: R.kind === "collection" ? $.length === 1 ? $[0] : "" : R.kind
    }), S(E), k(0), D("");
  }
  function Be() {
    T.current += 1, Q(null), _(x.current), X(V.current), S(E), k(0), D("");
  }
  function Je(t) {
    t === u || F || (T.current += 1, X(t), N || (V.current = t), S(E), k(0), Y(null), B(null), D(""));
  }
  async function qe() {
    if (!j || F) return;
    const t = j.id;
    J(t);
    try {
      await un({ teamID: n, assetID: t }), B(null), ie === t && k(0), w?.(t), K.success("资产已移入回收站"), U();
    } catch (o) {
      K.error(W(o, "删除资产失败"));
    } finally {
      J(0);
    }
  }
  async function xe(t) {
    if (!F) {
      J(t.id);
      try {
        const o = await dn({ teamID: n, assetID: t.id });
        v?.(o), K.success("资产已恢复"), U();
      } catch (o) {
        K.error(W(o, "恢复资产失败"));
      } finally {
        J(0);
      }
    }
  }
  async function Ve(t) {
    const o = Array.from(t.target.files || []);
    if (t.target.value = "", !(!m || o.length === 0 || Z)) {
      oe(!0);
      try {
        const g = await m(o);
        if (g.length === 0)
          throw new Error("上传完成，但没有生成可用资产");
        g.forEach((Ue) => v?.(Ue));
        const we = {
          ...pe,
          sourceType: "upload",
          kind: $.length === 1 ? $[0] : ""
        };
        T.current += 1, Q(null), X("assets"), V.current = "assets", _(we), x.current = we, S(E), k(0), D(""), K.success(`已上传 ${g.length} 项资产`);
      } catch (g) {
        K.error(W(g, "上传资产失败"));
      } finally {
        oe(!1);
      }
    }
  }
  return /* @__PURE__ */ r("section", { className: `wb-asset-browser ${le}`.trim(), children: [
    /* @__PURE__ */ r("header", { className: "wb-asset-browser-head", children: [
      /* @__PURE__ */ e(
        Tn,
        {
          filters: R,
          options: je,
          scopeProjectID: s,
          sourceLabels: he,
          allowedKinds: $,
          view: u,
          collectionName: N?.name,
          onCollectionBack: N ? Be : void 0,
          onChange: Me,
          onViewChange: Je
        }
      ),
      /* @__PURE__ */ r("div", { className: "wb-asset-browser-actions", children: [
        /* @__PURE__ */ e("span", { children: q ? "正在加载" : `${b.total} 项` }),
        /* @__PURE__ */ e(A, { label: "刷新资产", children: /* @__PURE__ */ r("button", { type: "button", onClick: U, children: [
          /* @__PURE__ */ e(Ye, { className: q ? "is-spinning" : "" }),
          /* @__PURE__ */ e("span", { className: "sr-only", children: "刷新资产" })
        ] }) }),
        !N && m ? /* @__PURE__ */ r(Ae, { children: [
          /* @__PURE__ */ e(A, { label: "本地上传", children: /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "wb-asset-local-upload",
              disabled: Z,
              onClick: () => ge.current?.click(),
              children: [
                Z ? /* @__PURE__ */ e(re, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ e(Ze, { "aria-hidden": "true" }),
                /* @__PURE__ */ e("span", { children: Z ? "上传中" : "本地上传" })
              ]
            }
          ) }),
          /* @__PURE__ */ e(
            "input",
            {
              ref: ge,
              type: "file",
              hidden: !0,
              multiple: !0,
              accept: l,
              onChange: Ve
            }
          )
        ] }) : null,
        N ? null : C
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "wb-asset-browser-body", children: q && b.items.length === 0 ? /* @__PURE__ */ e(ue, { icon: /* @__PURE__ */ e(re, { className: "is-spinning" }) }) : ye ? /* @__PURE__ */ e(ue, { text: ye, error: !0 }) : b.items.length === 0 ? /* @__PURE__ */ e(
      ue,
      {
        icon: u === "trash" ? /* @__PURE__ */ e(Se, {}) : /* @__PURE__ */ e(Ge, {}),
        text: Ke ? "正在读取资产配置" : u === "trash" ? "回收站为空" : N ? "集合内暂无符合条件的资产" : "暂无符合条件的资产"
      }
    ) : /* @__PURE__ */ e("div", { className: "wb-asset-grid", children: b.items.map((t) => /* @__PURE__ */ e(
      An,
      {
        asset: t,
        sourceLabels: he,
        view: u,
        selectable: t.kind !== "collection" && i && u === "assets",
        selected: u === "assets" && Pe.has(t.id),
        used: u === "assets" && ze.has(t.id),
        busy: F === t.id,
        onOpen: _e,
        onRename: Y,
        onDelete: u === "assets" ? B : void 0,
        onRestore: u === "trash" ? xe : void 0,
        onSelect: h
      },
      t.id
    )) }) }),
    b.total > b.pageSize ? /* @__PURE__ */ r("footer", { className: "wb-asset-pagination", children: [
      /* @__PURE__ */ e(A, { label: "上一页", children: /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          disabled: b.page <= 1 || q,
          onClick: () => {
            ee(b.page - 1);
          },
          children: /* @__PURE__ */ e(Qe, {})
        }
      ) }),
      /* @__PURE__ */ r("span", { children: [
        b.page,
        " / ",
        Math.max(1, Math.ceil(b.total / b.pageSize))
      ] }),
      /* @__PURE__ */ e(A, { label: "下一页", children: /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          disabled: !b.hasMore || q,
          onClick: () => {
            ee(b.page + 1);
          },
          children: /* @__PURE__ */ e(Xe, {})
        }
      ) })
    ] }) : null,
    ie ? /* @__PURE__ */ e(
      kn,
      {
        teamID: n,
        assetID: ie,
        selectable: i && u === "assets",
        layer: P,
        onClose: () => k(0),
        onSelect: h ? (t) => {
          k(0), h(t);
        } : void 0,
        onContinue: I ? (t) => {
          k(0), I(t);
        } : void 0,
        canContinue: O,
        onAssetChanged: (t) => {
          U(), v?.(t);
        }
      }
    ) : null,
    /* @__PURE__ */ e(
      wn,
      {
        teamID: n,
        asset: Fe,
        onClose: () => Y(null),
        onRenamed: (t) => {
          S((o) => ({
            ...o,
            items: o.items.map(
              (g) => g.id === t.id ? t : g
            )
          })), v?.(t), U();
        }
      }
    ),
    /* @__PURE__ */ e(
      $n,
      {
        open: !!j,
        onOpenChange: (t) => {
          !t && !F && B(null);
        },
        title: "移入回收站？",
        desc: j?.kind === "collection" ? `“${j.name}”及集合内素材将移入回收站，你可以稍后恢复。` : `“${j?.name || "该资产"}”将从资产列表移除，你可以稍后在回收站中恢复。`,
        confirmText: "移入回收站",
        destructive: !0,
        isLoading: !!F,
        handleConfirm: () => {
          qe();
        }
      }
    )
  ] });
}
function ue({
  icon: n,
  text: s = "",
  error: a = !1
}) {
  return /* @__PURE__ */ r("div", { className: `wb-asset-state ${a ? "is-error" : ""}`.trim(), children: [
    n,
    s ? /* @__PURE__ */ e("p", { children: s }) : null
  ] });
}
function On(n, s) {
  const a = { ...pe, ...n || {} };
  return s.length > 0 && !s.includes(a.kind) && (a.kind = s[0]), a.projectID && (a.sourceType = "project", a.sourceID = a.projectID), a.sourceType !== "project" && (a.projectID = 0, a.assetCateID = 0, a.nodeKey = "", a.role = ""), a;
}
function Rn(n) {
  const s = Ie.filter(
    (i) => i.key !== "collection"
  ), a = s.map((i) => i.key).filter((i) => n?.includes(i));
  return a.length === s.length ? [] : a;
}
const et = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AssetBrowser: $e
}, Symbol.toStringTag, { value: "Module" }));
function jn({
  teamID: n,
  onContinue: s,
  canContinue: a,
  catalogOptions: i
}) {
  async function c(f) {
    return (await pn({ teamID: n, files: f })).map(({ asset: y }) => hn(y)).filter((y) => y.id > 0);
  }
  return /* @__PURE__ */ e(
    $e,
    {
      teamID: n,
      onLocalUpload: c,
      onContinue: s,
      canContinue: a,
      catalogOptions: i
    }
  );
}
const nt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkbenchAssetPage: jn
}, Symbol.toStringTag, { value: "Module" }));
export {
  $e as A,
  et as a,
  nt as b
};
