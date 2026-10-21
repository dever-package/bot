import { j as t, a, F as $e } from "./react-HSzdbxZ7.js";
import { k as Xt, q as Ye, r as P, s as ve, h as Zt, n as Fe, X as yt, b as gt, aC as Yt, aD as vt, y as wt, C as Qt, A as en, _ as tn, aE as nn, $ as kt, U as rn, R as an, aF as sn, J as on, d as ln } from "./vendor-icons-fVDtJt66.js";
import { a as v, d as K, u as ie, b as Y, h as Q } from "./file-kind-D6bMOzYN.js";
import { t as Ct } from "./index-1cEYKsdQ.js";
import { r as cn, s as dn, u as un, b as mn, T as pn, c as hn, d as fn, e as bn, l as yn, n as gn, f as Je, o as Nt, g as vn, h as wn, a as kn, j as Cn, m as Nn } from "./text-content-save-actions-BS73syOd.js";
import { x as In, y as Ve, B, c as Re, z as xe, E as Oe, F as Dn, G as Tn, S as An, C as $n, H as Sn, r as It, t as Dt, u as En, I as Mn, v as Tt, n as Ln, J as Rn, K as At, L as xn, M as _n, D as zn } from "./asset-preview-DGKZUP9q.js";
import { c as $t } from "./preloadable-CT3tMmBD.js";
import { r as q, q as Fn, s as Qe, a as _e, c as J, h as Ie, d as He, b as St } from "./site-config-kAiWSd_3.js";
import { r as Vn, a as dt, s as On, A as qn, b as jn } from "./asset-text-content-editor-AII5IOWa.js";
import { u as Kn } from "./asset-upload-progress-BIgxpzPg.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./asset-browser-IRdO6GDK.css", import.meta.url).href]);
function Pn({
  asset: e,
  sourceLabels: n,
  view: r = "assets",
  selectable: s = !1,
  selected: d = !1,
  used: u = !1,
  busy: c = !1,
  readOnly: f = !1,
  onOpen: g,
  onRename: o,
  onDelete: y,
  onRestore: m,
  onSelect: b
}) {
  const h = r === "trash", w = e.kind === "collection", M = w ? 0 : In(e.version?.content, e.kind), x = s && !w && !!b, S = x && (c || u), F = x ? u ? `${e.name}已使用` : d ? `取消选择${e.name}` : `选择${e.name}` : `${w ? "打开集合" : "查看"}${e.name}`, l = w ? /* @__PURE__ */ t(Un, { asset: e }) : /* @__PURE__ */ t(
    Ve,
    {
      kind: e.kind,
      content: e.version?.content,
      summary: e.summary,
      compact: !0
    }
  );
  function A() {
    if (x) {
      S || b?.(e);
      return;
    }
    g(e);
  }
  return /* @__PURE__ */ a(
    "article",
    {
      className: `wb-asset-card ${w ? "is-collection" : ""} ${e.libraryType === "material" ? "is-official" : ""} ${d ? "is-selected" : ""} ${u ? "is-used" : ""} ${h ? "is-trash" : ""}`.trim(),
      children: [
        /* @__PURE__ */ a("div", { className: "wb-asset-card-main", children: [
          /* @__PURE__ */ a("div", { className: "wb-asset-card-preview", children: [
            l,
            M > 1 ? /* @__PURE__ */ a("span", { className: "wb-asset-media-count", children: [
              M,
              " 项"
            ] }) : null,
            e.kind !== "audio" ? /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: "wb-asset-card-preview-open",
                disabled: S,
                onClick: A,
                "aria-label": F
              }
            ) : null
          ] }),
          /* @__PURE__ */ t(B, { label: e.name, children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "wb-asset-card-copy",
              disabled: S,
              onClick: A,
              children: [
                /* @__PURE__ */ t("strong", { children: e.name }),
                /* @__PURE__ */ t("span", { children: w ? `集合 · ${e.collectionCount} 项素材` : e.libraryType === "material" ? `${e.materialCateName || Re("official", n)} · ${xe(e.kind)}` : `${Re(e.sourceType, n)} · ${xe(e.kind)}` })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ t("span", { className: "wb-asset-card-kind-icon", children: /* @__PURE__ */ t(Oe, { kind: e.kind }) }),
        /* @__PURE__ */ a("div", { className: "wb-asset-card-actions", children: [
          x && !h ? /* @__PURE__ */ t(B, { label: "查看详情", children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              disabled: c,
              onClick: (V) => {
                V.stopPropagation(), g(e);
              },
              children: [
                /* @__PURE__ */ t(Xt, { "aria-hidden": "true" }),
                /* @__PURE__ */ t("span", { className: "sr-only", children: "查看详情" })
              ]
            }
          ) }) : null,
          !h && !f && o ? /* @__PURE__ */ t(B, { label: "修改标题", children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              disabled: c,
              onClick: () => o(e),
              children: [
                /* @__PURE__ */ t(Ye, { "aria-hidden": "true" }),
                /* @__PURE__ */ t("span", { className: "sr-only", children: "修改标题" })
              ]
            }
          ) }) : null,
          h && m ? /* @__PURE__ */ t(B, { label: "恢复资产", children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "is-restore",
              disabled: c,
              onClick: () => m(e),
              children: [
                c ? /* @__PURE__ */ t(P, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ t(ve, { "aria-hidden": "true" }),
                /* @__PURE__ */ t("span", { className: "sr-only", children: "恢复资产" })
              ]
            }
          ) }) : !f && y ? /* @__PURE__ */ t(B, { label: "移入回收站", children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "is-danger",
              disabled: c,
              onClick: () => y(e),
              children: [
                c ? /* @__PURE__ */ t(P, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ t(Zt, { "aria-hidden": "true" }),
                /* @__PURE__ */ t("span", { className: "sr-only", children: "移入回收站" })
              ]
            }
          ) }) : null,
          !w && !h && s && b ? /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: `is-primary ${d ? "is-selected" : ""} ${u ? "is-used" : ""}`.trim(),
              disabled: c || u,
              onClick: A,
              children: [
                /* @__PURE__ */ t(Fe, { "aria-hidden": "true" }),
                u ? "已使用" : d ? "已选" : "使用"
              ]
            }
          ) : null
        ] })
      ]
    }
  );
}
function Un({ asset: e }) {
  const n = e.collectionPreviews.slice(0, 4);
  return n.length === 0 ? /* @__PURE__ */ a("div", { className: "wb-asset-collection-empty", children: [
    /* @__PURE__ */ t(Oe, { kind: "collection" }),
    /* @__PURE__ */ t("span", { children: e.collectionCount > 0 ? `${e.collectionCount} 项素材` : "空集合" })
  ] }) : /* @__PURE__ */ a("div", { className: `wb-asset-collection-preview has-${n.length}`, children: [
    n.map((r) => /* @__PURE__ */ t("div", { children: /* @__PURE__ */ t(Ve, { kind: r.kind, content: r.content, compact: !0 }) }, r.id)),
    /* @__PURE__ */ a("span", { children: [
      e.collectionCount,
      " 项"
    ] })
  ] });
}
function Et({
  teamID: e,
  asset: n,
  onClose: r,
  onRenamed: s
}) {
  const [d, u] = v(""), [c, f] = v(!1), [g, o] = v("");
  K(() => {
    n && (u(n.name), f(!1), o(""));
  }, [n]), K(() => {
    if (!n) return;
    const m = (b) => {
      b.key === "Escape" && (b.preventDefault(), b.stopImmediatePropagation(), c || r());
    };
    return window.addEventListener("keydown", m, !0), () => window.removeEventListener("keydown", m, !0);
  }, [n, r, c]);
  async function y(m) {
    m.preventDefault();
    const b = d.trim();
    if (!(!n || !b || c)) {
      f(!0), o("");
      try {
        const h = await cn({
          teamID: e,
          assetID: n.id,
          name: b
        });
        s(h), r();
      } catch (h) {
        o(q(h, "修改资产标题失败"));
      } finally {
        f(!1);
      }
    }
  }
  return !n || typeof document > "u" ? null : $t(
    /* @__PURE__ */ t(
      "div",
      {
        className: "wb-asset-form-backdrop",
        "data-slot": "dialog-layer",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "修改资产标题",
        onMouseDown: (m) => {
          m.target === m.currentTarget && !c && r();
        },
        children: /* @__PURE__ */ a("form", { className: "wb-asset-form-dialog", onSubmit: y, children: [
          /* @__PURE__ */ a("header", { children: [
            /* @__PURE__ */ a("div", { children: [
              /* @__PURE__ */ t("span", { className: "wb-asset-form-icon", children: /* @__PURE__ */ t(Ye, { "aria-hidden": "true" }) }),
              /* @__PURE__ */ a("div", { children: [
                /* @__PURE__ */ t("h2", { children: "修改资产标题" }),
                /* @__PURE__ */ t("p", { children: "只修改资产库中的显示名称。" })
              ] })
            ] }),
            /* @__PURE__ */ t(B, { label: "关闭", children: /* @__PURE__ */ t("button", { type: "button", disabled: c, onClick: r, children: /* @__PURE__ */ t(yt, { "aria-hidden": "true" }) }) })
          ] }),
          /* @__PURE__ */ a("label", { children: [
            /* @__PURE__ */ t("span", { children: "资产标题" }),
            /* @__PURE__ */ t(
              "input",
              {
                autoFocus: !0,
                value: d,
                maxLength: 128,
                disabled: c,
                placeholder: "请输入资产标题",
                onChange: (m) => u(m.target.value)
              }
            )
          ] }),
          g ? /* @__PURE__ */ t("p", { className: "wb-asset-form-error", children: g }) : null,
          /* @__PURE__ */ a("footer", { children: [
            /* @__PURE__ */ t("button", { type: "button", disabled: c, onClick: r, children: "取消" }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "submit",
                className: "is-primary",
                disabled: c || !d.trim(),
                children: [
                  c ? /* @__PURE__ */ t(P, { className: "is-spinning" }) : null,
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
function Mt() {
  const e = Fn().site.homeMenu;
  return ie(
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
function Wn() {
  return Mt().labels;
}
function Bn({
  teamID: e,
  asset: n,
  enabled: r,
  onSaved: s,
  onError: d
}) {
  const u = n?.version || null, c = ie(
    () => Vn(
      n?.kind === "richtext" ? "richtext" : "text",
      u?.content
    ),
    [n?.kind, u?.content]
  ), f = Y(null), g = Q(
    async (b, h) => {
      if (!r || !n?.id || !u?.id)
        throw new Error("当前资产正文不可编辑");
      const w = dt(b), M = h === "create_version" ? Gn(f, u, w) : "", x = await dn({
        teamID: e,
        assetID: n.id,
        expectedVersionID: u.id,
        expectedUpdatedAt: u.updatedAt || u.createdAt,
        requestID: M,
        saveMode: h,
        content: On(b)
      });
      f.current = null, s(x, h);
    },
    [n, r, s, e, u]
  ), o = un({
    value: c,
    resetKey: `${n?.id || 0}:${u?.id || 0}:${u?.updatedAt || u?.createdAt || ""}`,
    fingerprint: dt,
    save: (b) => g(b, "overwrite_current"),
    onError: d,
    autoSave: !1
  }), { flushWith: y } = o, m = Q(
    () => y((b) => g(b, "create_version")),
    [y, g]
  );
  return {
    ...o,
    saveAsNewVersion: m
  };
}
function Gn(e, n, r) {
  if (e.current?.versionID === n.id && e.current.fingerprint === r)
    return e.current.requestID;
  const s = typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`, d = `manual-edit-${n.id}-${s}`.slice(0, 64);
  return e.current = { versionID: n.id, fingerprint: r, requestID: d }, d;
}
function Jn({
  teamID: e,
  assetID: n,
  selectable: r = !1,
  onClose: s,
  onSelect: d,
  onContinue: u,
  canContinue: c,
  onAssetChanged: f,
  notificationMode: g = "toast",
  layer: o = "default"
}) {
  const y = Wn(), [m, b] = v(null), [h, w] = v(
    null
  ), [M, x] = v(!0), [S, F] = v(0), [l, A] = v(!1), [V, ee] = v(!1), [H, N] = v(""), [j, $] = v(""), E = Q(async () => {
    x(!0), N(""), $("");
    try {
      const p = ut(await mn(e, n));
      b(p), w(p.asset.version);
    } catch (p) {
      N(q(p, "加载资产详情失败"));
    } finally {
      x(!1);
    }
  }, [n, e]);
  K(() => {
    E();
  }, [E]);
  async function te(p) {
    if (!(S || p.id === h?.id) && be()) {
      if (p.id === m?.asset.versionID && m.asset.version) {
        N(""), w(m.asset.version);
        return;
      }
      F(p.id), N("");
      try {
        w(
          await fn({ teamID: e, assetID: n, versionID: p.id })
        );
      } catch (T) {
        N(q(T, "加载资产版本失败"));
      } finally {
        F(0);
      }
    }
  }
  async function fe() {
    if (!m || !m.hasMore || S) return;
    const p = Math.floor(m.versions.length / 20) + 1;
    F(-1), $("");
    try {
      const T = await bn({
        teamID: e,
        assetID: n,
        page: p,
        pageSize: 20
      });
      b(
        (I) => I && {
          ...I,
          versions: Xe([...I.versions, ...T.items]),
          versionTotal: T.total,
          hasMore: T.hasMore
        }
      );
    } catch (T) {
      $(q(T, "加载资产版本失败"));
    } finally {
      F(0);
    }
  }
  async function U() {
    if (!(!m || !h || l)) {
      A(!0), N("");
      try {
        const p = await hn({
          teamID: e,
          assetID: n,
          versionID: h.id
        }), T = ut({ ...m, asset: p });
        b(T), w(p.version), f?.(p);
      } catch (p) {
        N(q(p, "设置当前版本失败"));
      } finally {
        A(!1);
      }
    }
  }
  const C = m?.asset, ne = C?.status === "deleted", z = !!(C && h && C.versionID === h.id), G = ie(
    () => Dn(h?.content),
    [h?.content]
  ), O = ie(
    () => Tn(h?.content, "storyboard"),
    [h?.content]
  ), W = !!(C && h && z && !ne && (C.kind === "text" || C.kind === "richtext") && !G && !O), R = Q(
    (p, T) => {
      N(""), b((I) => {
        if (!I) return I;
        const le = p.version, ye = !!(le && I.versions.some((ce) => ce.id === le.id)), X = Xe(
          le ? [le, ...I.versions] : I.versions
        );
        return {
          ...I,
          asset: p,
          versions: X,
          versionTotal: Math.max(
            X.length,
            I.versionTotal + (le && !ye ? 1 : 0)
          )
        };
      }), w(p.version), f?.(p), g === "toast" && Ct.success(
        T === "create_version" ? "已保存为新版本" : "正文已保存"
      );
    },
    [g, f]
  ), D = Bn({
    teamID: e,
    asset: C,
    enabled: W,
    onSaved: R,
    onError: (p) => N(q(p, "保存资产正文失败"))
  }), oe = D.reset, we = D.hasPendingChanges, be = Q(() => !W || !we ? !0 : window.confirm("当前正文尚未保存，确定放弃修改吗？") ? (oe(), N(""), !0) : !1, [W, we, oe]), _ = Q(() => {
    V || !be() || s();
  }, [be, s, V]);
  return /* @__PURE__ */ a(
    Tt,
    {
      ariaLabel: `${C?.name || "资产"}详情`,
      onRequestClose: _,
      layer: o,
      header: /* @__PURE__ */ t(
        It,
        {
          icon: C ? /* @__PURE__ */ t(Oe, { kind: C.kind }) : /* @__PURE__ */ t(gt, { size: 16 }),
          title: C?.name || "资产详情",
          subtitle: C ? `${Yn(C, y)} · ${xe(C.kind)} · ${Mn(C.role)}` : "",
          versionSelect: m && C && h ? /* @__PURE__ */ t(
            En,
            {
              options: m.versions.map((p) => ({
                id: p.id,
                version: p.version,
                updatedAt: p.updatedAt || p.createdAt,
                value: p
              })),
              currentVersionId: C.versionID,
              selectedVersionId: h.id,
              total: m.versionTotal,
              hasMore: m.hasMore,
              loading: S > 0,
              loadingMore: S === -1,
              error: j,
              disabled: l || D.status === "saving",
              onSelect: (p) => {
                te(p);
              },
              onLoadMore: () => {
                fe();
              },
              onRetry: () => {
                fe();
              }
            }
          ) : void 0,
          state: ne ? /* @__PURE__ */ t("span", { className: "wb-detail-state", children: "回收站" }) : S > 0 ? /* @__PURE__ */ a("span", { className: "wb-detail-state is-saving", children: [
            /* @__PURE__ */ t(P, { size: 12, className: "wb-detail-spin" }),
            "读取中"
          ] }) : W ? D.status === "error" ? /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "wb-detail-state is-error",
              onClick: () => {
                D.retry();
              },
              children: [
                /* @__PURE__ */ t(ve, { size: 12 }),
                "保存失败"
              ]
            }
          ) : /* @__PURE__ */ a("span", { className: `wb-detail-state is-${D.status}`, children: [
            D.status === "saving" ? /* @__PURE__ */ t(P, { size: 12, className: "wb-detail-spin" }) : null,
            Zn(D.status)
          ] }) : /* @__PURE__ */ t("span", { className: "wb-detail-state", children: "只读预览" }),
          updatedAt: Dt(
            h?.updatedAt || h?.createdAt
          ),
          actions: C && h && !ne ? /* @__PURE__ */ a($e, { children: [
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "wb-detail-command",
                onClick: () => ee(!0),
                children: [
                  /* @__PURE__ */ t(Ye, { size: 13 }),
                  /* @__PURE__ */ t("span", { children: "修改标题" })
                ]
              }
            ),
            W ? /* @__PURE__ */ t(
              pn,
              {
                status: D.status,
                hasPendingChanges: D.hasPendingChanges,
                onReset: () => {
                  D.reset(), N("");
                },
                onSaveAsNewVersion: () => {
                  D.saveAsNewVersion();
                },
                onSave: () => {
                  D.flush();
                }
              }
            ) : null,
            z ? /* @__PURE__ */ t(
              Xn,
              {
                asset: C,
                selectable: r,
                onSelect: d,
                onContinue: u,
                canContinue: c
              }
            ) : /* @__PURE__ */ t(
              Hn,
              {
                currentVersion: C.version,
                loading: !!S,
                saving: l,
                onReturn: (p) => {
                  te(p);
                },
                onMakeCurrent: () => {
                  U();
                }
              }
            )
          ] }) : void 0,
          onClose: _
        }
      ),
      children: [
        /* @__PURE__ */ t("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ t("div", { className: "wb-detail-scroll", children: M ? /* @__PURE__ */ a("div", { className: "wb-detail-content-state", children: [
          /* @__PURE__ */ t(P, { size: 18, className: "wb-detail-spin" }),
          /* @__PURE__ */ t("span", { children: "正在读取资产" })
        ] }) : !C || !h ? /* @__PURE__ */ a("div", { className: "wb-detail-content-state is-error", children: [
          /* @__PURE__ */ t("span", { children: H || "资产不存在" }),
          /* @__PURE__ */ a("button", { type: "button", onClick: () => {
            E();
          }, children: [
            /* @__PURE__ */ t(ve, { size: 13 }),
            "重试"
          ] })
        ] }) : W ? /* @__PURE__ */ a("div", { className: `wb-detail-editable-content is-${C.kind}`, children: [
          H ? /* @__PURE__ */ t("p", { className: "wb-detail-error-banner", children: H }) : null,
          /* @__PURE__ */ t(
            qn,
            {
              kind: D.draft.kind,
              value: D.draft.value,
              contentFormat: D.draft.contentFormat,
              onChange: (p) => D.setDraft(
                (T) => jn(T, p)
              )
            }
          )
        ] }) : /* @__PURE__ */ a("div", { className: `wb-detail-readonly-content is-${C.kind}`, children: [
          H ? /* @__PURE__ */ t("p", { className: "wb-detail-error-banner", children: H }) : null,
          G ? /* @__PURE__ */ t(An, { grid: G, variant: "detail" }) : O ? /* @__PURE__ */ t(
            $n,
            {
              output: h.content,
              fallback: h.summary || C.summary,
              emptyText: "该版本暂无可预览内容",
              className: "wb-asset-preview-content",
              markdownClassName: "wb-asset-detail-prose",
              richClassName: "wb-asset-detail-prose",
              mediaLayout: "detail"
            }
          ) : /* @__PURE__ */ t(
            Ve,
            {
              kind: C.kind,
              content: h.content,
              summary: h.summary || C.summary,
              prompt: Sn(h)
            },
            h.id
          )
        ] }) }) }),
        /* @__PURE__ */ t(
          Et,
          {
            teamID: e,
            asset: V && C || null,
            onClose: () => ee(!1),
            onRenamed: (p) => {
              b(
                (T) => T && { ...T, asset: p }
              ), f?.(p);
            }
          }
        )
      ]
    }
  );
}
function Hn({
  currentVersion: e,
  loading: n,
  saving: r,
  onReturn: s,
  onMakeCurrent: d
}) {
  const u = n || r;
  return /* @__PURE__ */ a($e, { children: [
    e ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        disabled: u,
        onClick: () => s(e),
        children: [
          /* @__PURE__ */ t(ve, { size: 13 }),
          /* @__PURE__ */ t("span", { children: "返回当前版本" })
        ]
      }
    ) : null,
    /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "wb-detail-command is-primary",
        disabled: u,
        onClick: d,
        children: [
          r ? /* @__PURE__ */ t(P, { size: 13, className: "wb-detail-spin" }) : /* @__PURE__ */ t(Fe, { size: 13 }),
          /* @__PURE__ */ t("span", { children: r ? "设置中" : "设为当前版本" })
        ]
      }
    )
  ] });
}
function Xn({
  asset: e,
  selectable: n,
  onSelect: r,
  onContinue: s,
  canContinue: d
}) {
  return /* @__PURE__ */ a($e, { children: [
    s && Qn(e) && (d?.(e) ?? !0) ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        onClick: () => s(e),
        children: [
          e.sourceType === "dialogue" ? /* @__PURE__ */ t(Yt, { size: 14 }) : /* @__PURE__ */ t(ve, { size: 14 }),
          /* @__PURE__ */ t("span", { children: e.sourceType === "dialogue" ? "继续对话" : "重新生成" })
        ]
      }
    ) : null,
    n && r ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "wb-detail-command is-primary",
        onClick: () => r(e),
        children: [
          /* @__PURE__ */ t(Fe, { size: 14 }),
          /* @__PURE__ */ t("span", { children: "使用" })
        ]
      }
    ) : null
  ] });
}
function ut(e) {
  const n = Xe(
    e.asset.version ? [e.asset.version, ...e.versions] : e.versions
  );
  return {
    ...e,
    versions: n,
    versionTotal: Math.max(e.versionTotal, n.length)
  };
}
function Xe(e) {
  const n = /* @__PURE__ */ new Set();
  return e.filter((r) => n.has(r.id) ? !1 : (n.add(r.id), !0));
}
function Zn(e) {
  return e === "dirty" ? "未保存" : e === "saving" ? "保存中" : e === "error" ? "保存失败" : "已保存";
}
function Yn(e, n) {
  const r = Re(e.sourceType, n);
  return e.sourceName && e.sourceName !== r ? `${r} / ${e.sourceName}` : r;
}
function Qn(e) {
  return e.role === "material" && (e.sourceType === "tool" || e.sourceType === "dialogue");
}
function er({
  teamID: e,
  material: n,
  selectable: r = !1,
  layer: s = "default",
  onClose: d,
  onSelect: u
}) {
  const [c, f] = v(n), [g, o] = v(!0), [y, m] = v(""), b = Q(async () => {
    o(!0), m("");
    try {
      f(await yn(e, n.id));
    } catch (w) {
      m(q(w, "加载官方素材详情失败"));
    } finally {
      o(!1);
    }
  }, [n.id, e]);
  K(() => {
    b();
  }, [b]);
  const h = Ln(c.version?.content, c.kind);
  return /* @__PURE__ */ t(
    Tt,
    {
      ariaLabel: `${c.name}详情`,
      onRequestClose: d,
      layer: s,
      header: /* @__PURE__ */ t(
        It,
        {
          icon: c ? /* @__PURE__ */ t(Oe, { kind: c.kind }) : /* @__PURE__ */ t(gt, { size: 16 }),
          title: c.name || "官方素材详情",
          subtitle: `${Re("official")} · ${xe(c.kind)}${c.materialCateName ? ` · ${c.materialCateName}` : ""}`,
          state: /* @__PURE__ */ t("span", { className: "wb-detail-state", children: "官方只读" }),
          updatedAt: Dt(c.createdAt),
          downloadUrl: h || void 0,
          actions: r && u && !g && !y ? /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "wb-detail-command is-primary",
              onClick: () => u(c),
              children: [
                /* @__PURE__ */ t(Fe, { size: 14 }),
                /* @__PURE__ */ t("span", { children: "使用" })
              ]
            }
          ) : void 0,
          onClose: d
        }
      ),
      children: /* @__PURE__ */ t("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ t("div", { className: "wb-detail-scroll", children: g ? /* @__PURE__ */ a("div", { className: "wb-detail-content-state", children: [
        /* @__PURE__ */ t(P, { size: 18, className: "wb-detail-spin" }),
        /* @__PURE__ */ t("span", { children: "正在读取官方素材" })
      ] }) : y ? /* @__PURE__ */ a("div", { className: "wb-detail-content-state is-error", children: [
        /* @__PURE__ */ t("span", { children: y }),
        /* @__PURE__ */ a("button", { type: "button", onClick: () => {
          b();
        }, children: [
          /* @__PURE__ */ t(ve, { size: 13 }),
          "重试"
        ] })
      ] }) : /* @__PURE__ */ t("div", { className: `wb-detail-readonly-content is-${c.kind}`, children: /* @__PURE__ */ t(
        Ve,
        {
          kind: c.kind,
          content: c.version?.content,
          summary: c.summary
        }
      ) }) }) })
    }
  );
}
const tr = "shemic:web-content-import";
function he(e) {
  return !!(e && (e.status === "pending" || e.status === "discovering" || e.status === "running"));
}
function nr(e, n) {
  return `${tr}:${e}:${n}`;
}
function rr(e) {
  if (typeof window > "u") return 0;
  try {
    const n = Number(window.localStorage.getItem(e) || 0);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}
function We(e, n) {
  if (!(typeof window > "u" || n <= 0))
    try {
      window.localStorage.setItem(e, String(n));
    } catch {
    }
}
function Be(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.removeItem(e);
    } catch {
    }
}
function ar() {
  return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : `import-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
function sr({
  disabled: e,
  task: n,
  onClick: r
}) {
  const s = he(n), d = s ? Math.min(100, Math.max(0, n.progress)) : 0, u = s ? `导入 ${d}%` : "导入";
  return /* @__PURE__ */ t(
    B,
    {
      label: s ? n.stageMessage || "正在导入" : "导入网络内容",
      children: /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "wb-asset-import-button",
          disabled: e,
          "aria-busy": s,
          onClick: r,
          children: [
            s ? /* @__PURE__ */ t(P, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ t(vt, { "aria-hidden": "true" }),
            /* @__PURE__ */ t("span", { children: u }),
            s ? /* @__PURE__ */ t(
              "span",
              {
                className: "wb-asset-upload-progress",
                role: "progressbar",
                "aria-label": "网络内容导入进度",
                "aria-valuemin": 0,
                "aria-valuemax": 100,
                "aria-valuenow": d,
                children: /* @__PURE__ */ t("span", { style: { width: `${d}%` } })
              }
            ) : null
          ]
        }
      )
    }
  );
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const ze = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!ze || Object.keys(ze).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const et = ze.joinSiteApi, tt = ze.request;
async function ir(e) {
  const n = await tt(
    et("workbench/web_content_import"),
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
  return nt(
    Qe(n, "创建网页内容导入任务失败")
  );
}
async function mt(e) {
  const n = await tt(
    et("workbench/web_content_import_task"),
    "get",
    {
      team_id: e.teamID,
      project_id: e.projectID || void 0,
      canvas_id: e.canvasID || void 0,
      task_id: e.taskID
    },
    { reportError: !1 }
  );
  return nt(
    Qe(n, "加载网页内容导入任务失败")
  );
}
async function pt(e) {
  const n = await tt(
    et("workbench/web_content_import_tasks"),
    "get",
    {
      team_id: e.teamID,
      project_id: e.projectID || void 0,
      canvas_id: e.canvasID || void 0
    },
    { reportError: !1 }
  ), r = Qe(n, "加载网页内容导入任务失败");
  return _e(r.items).map(nt).filter((s) => s.id > 0);
}
function nt(e) {
  const n = St(e), r = _e(n.assets).map(gn).filter((s) => s.id > 0);
  return {
    id: He(n.id),
    canvasID: He(n.canvas_id),
    source: J(n.source),
    status: cr(n.status),
    stageMessage: J(n.stage_message),
    progress: Math.min(100, Ie(n.progress)),
    itemTotal: Ie(n.item_total),
    successCount: Ie(n.success_count),
    skippedCount: Ie(n.skipped_count),
    failedCount: Ie(n.failed_count),
    errorMessage: J(n.error_message),
    assets: r,
    warnings: lr(n.warnings),
    items: _e(n.items).map(or).filter((s) => s.id > 0)
  };
}
function or(e) {
  const n = St(e);
  return {
    id: He(n.id),
    platform: J(n.platform),
    sourceURL: J(n.source_url),
    title: J(n.title),
    status: J(n.status),
    stageMessage: J(n.stage_message),
    errorMessage: J(n.error_message)
  };
}
function lr(e) {
  return _e(e).map(J).filter(Boolean);
}
function cr(e) {
  const n = J(e);
  switch (n) {
    case "discovering":
    case "running":
    case "success":
    case "partial":
    case "failed":
      return n;
    default:
      return "pending";
  }
}
function dr({
  open: e,
  teamID: n,
  projectID: r,
  canvasID: s,
  onClose: d,
  onImported: u,
  onTaskChange: c
}) {
  const [f, g] = v(""), [o, y] = v(null), [m, b] = v(!1), [h, w] = v(""), M = Y(e), x = Y(d), S = Y(u), F = Y(/* @__PURE__ */ new Set()), l = Y(null), A = `${nr(n, r)}:${s}`, V = he(o) && o?.id || 0;
  K(() => {
    M.current = e, x.current = d, S.current = u;
  }, [d, u, e]), K(() => {
    c?.(o);
  }, [c, o]), K(() => {
    let N = !1;
    F.current.clear(), y(null), g(""), w(""), b(!1), l.current = null;
    async function j() {
      try {
        const $ = rr(A);
        let E = null;
        if ($ > 0)
          try {
            E = await mt({
              teamID: n,
              projectID: r,
              canvasID: s,
              taskID: $
            });
          } catch {
            Be(A);
          }
        if (E || (E = (await pt({
          teamID: n,
          projectID: r,
          canvasID: s
        }))[0] || null), N || !E) return;
        g(E.source), y(E), We(A, E.id);
      } catch {
      }
    }
    return j(), () => {
      N = !0;
    };
  }, [s, r, A, n]), K(() => {
    if (V <= 0) return;
    let N = !1, j = 0;
    async function $() {
      try {
        const E = await mt({
          teamID: n,
          projectID: r,
          canvasID: s,
          taskID: V
        });
        if (N || (y(E), w(""), !he(E))) return;
        j = window.setTimeout($, 1200);
      } catch (E) {
        if (N) return;
        M.current && w(q(E, "刷新导入进度失败")), j = window.setTimeout($, 2500);
      }
    }
    return j = window.setTimeout($, 700), () => {
      N = !0, window.clearTimeout(j);
    };
  }, [V, s, r, n]), K(() => {
    if (!(!o || he(o))) {
      if (Be(A), o.status === "failed") {
        w(o.errorMessage || "网页内容导入失败");
        return;
      }
      if (!F.current.has(o.id)) {
        if (o.assets.length === 0) {
          w(o.errorMessage || "导入完成，但没有生成可用素材");
          return;
        }
        F.current.add(o.id), l.current = null, S.current(o.assets, o.warnings, o), y(null), g(""), M.current && x.current();
      }
    }
  }, [A, o]);
  const ee = Q(async () => {
    const N = f.trim();
    if (!N || m || he(o)) return;
    b(!0), w("");
    const j = l.current?.source === N ? l.current : { source: N, requestID: ar() };
    l.current = j;
    try {
      const $ = await ir({
        teamID: n,
        projectID: r,
        canvasID: s,
        requestID: j.requestID,
        source: N
      });
      l.current = null, y($), We(A, $.id);
    } catch ($) {
      try {
        const te = (await pt({
          teamID: n,
          projectID: r,
          canvasID: s
        })).find((fe) => fe.source === N);
        if (te) {
          l.current = null, y(te), We(A, te.id);
          return;
        }
      } catch {
      }
      w(q($, "创建网页内容导入任务失败"));
    } finally {
      b(!1);
    }
  }, [s, r, f, A, m, o, n]), H = Q(() => {
    he(o) || (Be(A), l.current = null, y(null), w(""));
  }, [A, o]);
  return {
    source: f,
    setSource: g,
    task: o,
    submitting: m,
    active: he(o),
    error: h,
    submit: ee,
    reset: H
  };
}
function ur({
  open: e,
  teamID: n,
  projectID: r = 0,
  canvasID: s = 0,
  platforms: d,
  maxItems: u,
  onClose: c,
  onImported: f,
  onTaskChange: g
}) {
  const o = dr({
    open: e,
    teamID: n,
    projectID: r,
    canvasID: s,
    onClose: c,
    onImported: f,
    onTaskChange: g
  });
  K(() => {
    if (!e) return;
    const m = (b) => {
      b.key === "Escape" && (b.preventDefault(), b.stopImmediatePropagation(), c());
    };
    return window.addEventListener("keydown", m, !0), () => window.removeEventListener("keydown", m, !0);
  }, [c, e]);
  function y(m) {
    m.preventDefault(), o.submit();
  }
  return !e || typeof document > "u" ? null : $t(
    /* @__PURE__ */ t(
      "div",
      {
        className: "wb-asset-form-backdrop",
        "data-slot": "dialog-layer",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "导入网络内容",
        onMouseDown: (m) => {
          m.target === m.currentTarget && c();
        },
        children: /* @__PURE__ */ a(
          "form",
          {
            className: "wb-asset-form-dialog wb-asset-import-dialog",
            onSubmit: y,
            children: [
              /* @__PURE__ */ a("header", { children: [
                /* @__PURE__ */ a("div", { children: [
                  /* @__PURE__ */ t("span", { className: "wb-asset-form-icon", children: /* @__PURE__ */ t(vt, { "aria-hidden": "true" }) }),
                  /* @__PURE__ */ a("div", { children: [
                    /* @__PURE__ */ t("h2", { children: "导入网络内容" }),
                    /* @__PURE__ */ a("p", { children: [
                      "支持：",
                      d.map((m) => m.name).join("、") || "已配置的平台"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ t(B, { label: "关闭", children: /* @__PURE__ */ a("button", { type: "button", onClick: c, children: [
                  /* @__PURE__ */ t(yt, { "aria-hidden": "true" }),
                  /* @__PURE__ */ t("span", { className: "sr-only", children: "关闭" })
                ] }) })
              ] }),
              o.task ? /* @__PURE__ */ t(
                mr,
                {
                  task: o.task,
                  active: o.active,
                  platforms: d
                }
              ) : /* @__PURE__ */ a("label", { children: [
                /* @__PURE__ */ t("span", { children: "链接或分享内容" }),
                /* @__PURE__ */ t(
                  "textarea",
                  {
                    autoFocus: !0,
                    value: o.source,
                    maxLength: 8192,
                    disabled: o.submitting,
                    placeholder: "粘贴内容链接或分享文本，可一次粘贴多条",
                    onChange: (m) => o.setSource(m.target.value)
                  }
                ),
                /* @__PURE__ */ a("small", { className: "wb-asset-import-help", children: [
                  "自动识别对应平台，一次最多 ",
                  u,
                  " 条，可混合粘贴"
                ] })
              ] }),
              o.error ? /* @__PURE__ */ a("p", { className: "wb-asset-form-error wb-asset-import-error", children: [
                /* @__PURE__ */ t(wt, { "aria-hidden": "true" }),
                /* @__PURE__ */ t("span", { children: o.error })
              ] }) : null,
              /* @__PURE__ */ a("footer", { children: [
                /* @__PURE__ */ t("button", { type: "button", onClick: c, children: "关闭" }),
                o.task?.status === "failed" ? /* @__PURE__ */ t(
                  "button",
                  {
                    type: "button",
                    className: "is-primary",
                    onClick: o.reset,
                    children: "重新导入"
                  }
                ) : o.active ? null : /* @__PURE__ */ a(
                  "button",
                  {
                    type: "submit",
                    className: "is-primary",
                    disabled: o.submitting || !o.source.trim(),
                    children: [
                      o.submitting ? /* @__PURE__ */ t(P, { className: "is-spinning" }) : null,
                      o.submitting ? "提交中" : "导入"
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
function mr({
  task: e,
  active: n,
  platforms: r
}) {
  const s = Math.min(100, Math.max(0, e.progress)), d = new Map(
    r.map((f) => [f.key, f.name])
  ), u = e.successCount + e.skippedCount, c = e.failedCount ? `已导入 ${u} 项，${e.failedCount} 项失败` : n ? e.stageMessage || "正在导入" : `已导入 ${u} 项`;
  return /* @__PURE__ */ a("section", { className: "wb-asset-import-status", "aria-live": "polite", children: [
    /* @__PURE__ */ a("div", { className: "wb-asset-import-status-head", children: [
      n ? /* @__PURE__ */ t(P, { className: "is-spinning", "aria-hidden": "true" }) : e.status === "failed" ? /* @__PURE__ */ t(wt, { "aria-hidden": "true" }) : /* @__PURE__ */ t(Qt, { "aria-hidden": "true" }),
      /* @__PURE__ */ a("div", { children: [
        /* @__PURE__ */ t("strong", { children: c }),
        /* @__PURE__ */ a("span", { children: [
          "共 ",
          e.itemTotal,
          " 条内容"
        ] })
      ] }),
      /* @__PURE__ */ a("b", { children: [
        s,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ t(
      "div",
      {
        className: "wb-asset-import-progress",
        role: "progressbar",
        "aria-label": "网页内容导入进度",
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": s,
        children: /* @__PURE__ */ t("span", { style: { width: `${s}%` } })
      }
    ),
    /* @__PURE__ */ t("div", { className: "wb-asset-import-items", children: e.items.map((f, g) => /* @__PURE__ */ a(
      "div",
      {
        className: f.status === "failed" ? "is-failed" : "",
        children: [
          /* @__PURE__ */ t("b", { children: d.get(f.platform) || f.platform }),
          /* @__PURE__ */ t("span", { title: f.sourceURL, children: f.title || f.sourceURL || `第 ${g + 1} 条内容` }),
          /* @__PURE__ */ t("em", { title: ht(f), children: ht(f) })
        ]
      },
      f.id || `${f.platform}-${g}`
    )) })
  ] });
}
function ht(e) {
  return e.status === "failed" ? e.errorMessage || "导入失败" : e.status === "success" ? "已导入" : e.status === "skipped" ? "已存在" : e.stageMessage || "等待导入";
}
const pr = [
  { key: "", label: "全部" },
  ...xn
], ft = [
  { key: "", label: "全部" },
  ...At
];
function hr({
  filters: e,
  options: n,
  scopeProjectID: r = 0,
  sourceLabels: s = {},
  sourceVisibility: d = {},
  allowedKinds: u = [],
  includeOfficial: c = !0,
  view: f,
  collectionName: g,
  onCollectionBack: o,
  onChange: y,
  onViewChange: m
}) {
  const b = [
    { key: "", label: "全部" },
    ...Rn.filter(
      (l) => d[l.key] !== !1 && (l.key !== "official" || c && n.materialLibrary.enabled && !!Je(n.materialLibrary, u))
    ).map((l) => ({
      ...l,
      label: s[l.key] || l.label
    }))
  ], h = n.assetCates.length > 0, w = r || e.projectID, M = n.canvases.filter(
    (l) => (!w || l.projectID === w) && (!e.assetCateID || l.assetCateID === e.assetCateID)
  ), x = e.sourceType === "official" ? n.materialLibrary.kinds.filter(
    (l) => u.length === 0 || u.includes(l.assetKind)
  ).map((l) => ({ key: l.assetKind, label: l.name })) : u.length > 0 ? ft.filter(
    (l) => l.key && u.includes(l.key)
  ) : ft, S = Nt(
    n.materialLibrary,
    e.kind
  );
  function F(l) {
    const A = l === "project" ? r : 0, V = l === "official" ? Je(n.materialLibrary, u) : "", ee = l === "official" ? V : e.sourceType === "official" ? u.length === 1 ? u[0] : "" : e.kind;
    y({
      ...e,
      sourceType: l,
      sourceID: A,
      projectID: A,
      assetCateID: 0,
      canvasID: l === "project" ? e.canvasID : 0,
      materialCateID: 0,
      nodeKey: "",
      role: "",
      kind: ee
    });
  }
  return /* @__PURE__ */ a("div", { className: "wb-asset-filters", children: [
    g && o ? /* @__PURE__ */ t(De, { label: "集合", children: /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "wb-asset-collection-back",
        onClick: o,
        children: [
          /* @__PURE__ */ t(en, { "aria-hidden": "true" }),
          /* @__PURE__ */ t(tn, { "aria-hidden": "true" }),
          /* @__PURE__ */ t("span", { children: g })
        ]
      }
    ) }) : /* @__PURE__ */ a(De, { label: "来源", children: [
      /* @__PURE__ */ t(
        Le,
        {
          options: b,
          value: e.sourceType,
          onChange: F
        }
      ),
      e.sourceType === "project" ? /* @__PURE__ */ a($e, { children: [
        r > 0 ? null : /* @__PURE__ */ t(
          Te,
          {
            label: s.project || "创作",
            value: e.projectID,
            options: n.projects,
            onChange: (l) => y({
              ...e,
              projectID: l,
              sourceID: l,
              canvasID: 0,
              assetCateID: 0,
              nodeKey: ""
            })
          }
        ),
        h ? /* @__PURE__ */ t(
          Te,
          {
            label: "资产分类",
            value: e.assetCateID,
            options: n.assetCates,
            onChange: (l) => y({
              ...e,
              assetCateID: l,
              canvasID: 0,
              nodeKey: ""
            })
          }
        ) : null
      ] }) : null,
      e.sourceType === "project" && w > 0 && M.length > 1 ? /* @__PURE__ */ t(
        Te,
        {
          label: "画布",
          value: e.canvasID,
          options: M,
          onChange: (l) => y({ ...e, canvasID: l })
        }
      ) : null,
      e.sourceType === "tool" ? /* @__PURE__ */ t(
        Te,
        {
          label: s.tool || "工具",
          value: e.sourceID,
          options: n.tools,
          onChange: (l) => y({ ...e, sourceID: l })
        }
      ) : null,
      e.sourceType === "dialogue" ? /* @__PURE__ */ t(
        Te,
        {
          label: "角色",
          value: e.sourceID,
          options: n.dialogues,
          onChange: (l) => y({ ...e, sourceID: l })
        }
      ) : null
    ] }),
    !g && e.sourceType === "project" && h ? /* @__PURE__ */ t(De, { label: "资产", children: /* @__PURE__ */ t(
      Le,
      {
        options: pr,
        value: e.role,
        onChange: (l) => y({ ...e, role: l })
      }
    ) }) : null,
    /* @__PURE__ */ t(
      De,
      {
        label: "类型",
        trailing: e.sourceType === "official" ? void 0 : /* @__PURE__ */ t(fr, { view: f, onChange: m }),
        children: /* @__PURE__ */ t(
          Le,
          {
            options: x,
            value: e.kind,
            onChange: (l) => y({
              ...e,
              kind: l,
              materialCateID: e.sourceType === "official" ? 0 : e.materialCateID
            })
          }
        )
      }
    ),
    e.sourceType === "official" && S.length > 0 ? /* @__PURE__ */ t(De, { label: "分类", children: /* @__PURE__ */ t(
      Le,
      {
        options: [
          { key: 0, label: "全部" },
          ...S.map((l) => ({
            key: l.id,
            label: l.name
          }))
        ],
        value: e.materialCateID,
        onChange: (l) => y({ ...e, materialCateID: l })
      }
    ) }) : null
  ] });
}
function De({
  label: e,
  children: n,
  trailing: r
}) {
  return /* @__PURE__ */ a("div", { className: "wb-asset-filter-row", children: [
    /* @__PURE__ */ t("strong", { children: e }),
    /* @__PURE__ */ a("div", { className: "wb-asset-filter-controls", children: [
      n,
      r
    ] })
  ] });
}
function fr({
  view: e,
  onChange: n
}) {
  return /* @__PURE__ */ a("div", { className: "wb-asset-view-switch", role: "tablist", "aria-label": "资产视图", children: [
    /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": e === "assets",
        className: e === "assets" ? "is-active" : "",
        onClick: () => n("assets"),
        children: [
          /* @__PURE__ */ t(nn, { "aria-hidden": "true" }),
          /* @__PURE__ */ t("span", { children: "资产" })
        ]
      }
    ),
    /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": e === "trash",
        className: e === "trash" ? "is-active" : "",
        onClick: () => n("trash"),
        children: [
          /* @__PURE__ */ t(kt, { "aria-hidden": "true" }),
          /* @__PURE__ */ t("span", { children: "回收站" })
        ]
      }
    )
  ] });
}
function Le({
  options: e,
  value: n,
  onChange: r
}) {
  return /* @__PURE__ */ t("div", { className: "wb-asset-segments", children: e.map((s) => /* @__PURE__ */ t(
    "button",
    {
      type: "button",
      className: n === s.key ? "is-active" : "",
      onClick: () => r(s.key),
      children: s.label
    },
    s.key || "all"
  )) });
}
function Te({
  label: e,
  value: n,
  options: r,
  onChange: s
}) {
  return /* @__PURE__ */ a("label", { className: "wb-asset-select", children: [
    /* @__PURE__ */ t("span", { className: "sr-only", children: e }),
    /* @__PURE__ */ a(
      "select",
      {
        value: n || "",
        onChange: (d) => s(Number(d.target.value)),
        children: [
          /* @__PURE__ */ a("option", { value: "", children: [
            "全部",
            e
          ] }),
          r.map((d) => /* @__PURE__ */ t("option", { value: d.id, children: d.name }, d.id))
        ]
      }
    )
  ] });
}
function br({
  uploading: e,
  progress: n,
  onClick: r
}) {
  const s = yr(e, n), d = e && n && (n.phase !== "preparing" || n.percent > 0) ? n.percent : null;
  return /* @__PURE__ */ t(B, { label: s, children: /* @__PURE__ */ a(
    "button",
    {
      type: "button",
      className: "wb-asset-local-upload",
      disabled: e,
      "aria-busy": e,
      onClick: r,
      children: [
        e ? /* @__PURE__ */ t(P, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ t(rn, { "aria-hidden": "true" }),
        /* @__PURE__ */ t("span", { children: s }),
        e ? /* @__PURE__ */ t(
          "span",
          {
            className: `wb-asset-upload-progress${d == null ? " is-indeterminate" : ""}`,
            role: "progressbar",
            "aria-label": "上传进度",
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            "aria-valuenow": d ?? void 0,
            "aria-valuetext": d == null ? "正在准备上传" : `${d}%`,
            children: /* @__PURE__ */ t("span", { style: { width: `${d ?? 40}%` } })
          }
        ) : null
      ]
    }
  ) });
}
function yr(e, n) {
  return e ? n ? n.phase === "preparing" ? n.percent > 0 ? `上传中 ${n.percent}%` : "上传中" : n.phase === "saving" ? "处理中" : `上传中 ${n.percent}%` : "上传中" : "上传";
}
const Ae = {
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
const Ze = window.DeverFront?.sdk?.getCompatModule("@/components/confirm-dialog");
if (!Ze || Object.keys(Ze).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/confirm-dialog");
const gr = Ze.ConfirmDialog, bt = {
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
}, pe = {
  items: [],
  page: 1,
  pageSize: 24,
  total: 0,
  hasMore: !1
};
function Lr({
  teamID: e,
  scopeProjectID: n = 0,
  scopeCanvasID: r = 0,
  initialFilters: s,
  selectable: d = !1,
  excludeCollections: u = !1,
  selectedAssetIDs: c,
  selectedAssetKeys: f,
  usedAssetIDs: g,
  usedAssetKeys: o,
  includeOfficial: y = !0,
  allowedKinds: m,
  onSelect: b,
  onContinue: h,
  canContinue: w,
  onAssetChanged: M,
  onAssetRemoved: x,
  onLocalUpload: S,
  uploadAccept: F,
  headerAction: l,
  reloadSignal: A = 0,
  catalogOptions: V,
  contentMode: ee = "preview",
  notificationMode: H = "toast",
  detailLayer: N = "default",
  className: j = ""
}) {
  const $ = Kn(), { labels: E, visibility: te } = Mt(), fe = JSON.stringify(m || []), U = ie(
    () => wr(m),
    [fe]
  ), C = JSON.stringify({ initialFilters: s, normalizedAllowedKinds: U }), ne = ie(
    () => vr(s, U),
    [C]
  ), [z, G] = v(ne), [O, W] = v(
    null
  ), [R, D] = v("assets"), [oe, we] = v(bt), be = _n(
    oe.webContentImportEnabled,
    U
  ), [_, p] = v(pe), [T, I] = v(null), [le, ye] = v(null), [X, ce] = v(null), [ge, ke] = v(0), [Ce, rt] = v(!0), [qe, je] = v(!1), [Lt, Se] = v(null), [Rt, Ke] = v(!1), [xt, at] = v(
    null
  ), [_t, st] = v(!0), [it, re] = v(""), [ot, Z] = v(""), [zt, Ft] = v(0), ae = Y(0), lt = Y(null), de = Y(ne), ue = Y("assets"), Vt = JSON.stringify({
    selectedAssetIDs: c,
    selectedAssetKeys: f
  }), Ot = ie(
    () => /* @__PURE__ */ new Set([
      ...f || [],
      ...(c || []).map((i) => `asset:${i}`)
    ]),
    [Vt]
  ), qt = JSON.stringify({ usedAssetIDs: g, usedAssetKeys: o }), jt = ie(
    () => /* @__PURE__ */ new Set([
      ...o || [],
      ...(g || []).map((i) => `asset:${i}`)
    ]),
    [qt]
  );
  K(() => {
    ae.current += 1, G(ne), de.current = ne, W(null), D("assets"), ue.current = "assets", we(bt), p(pe), I(null), ye(null), ce(null), ke(0), je(!1), Se(null), Ke(!1), at(null), re(""), Z("");
  }, [$, ne, n, e]), K(() => {
    let i = !0;
    return st(!0), vn(e, V, $).then((k) => {
      i && (we(k), G((L) => {
        const me = kr(
          L,
          k,
          U,
          y
        );
        return O || (de.current = me), me;
      }));
    }).catch((k) => {
      i && re(q(k, "加载资产筛选项失败"));
    }).finally(() => {
      i && st(!1);
    }), () => {
      i = !1;
    };
  }, [
    V,
    y,
    U,
    $,
    e
  ]);
  const Ee = Q(
    async (i) => {
      const k = ++ae.current;
      rt(!0), re("");
      try {
        const L = await wn({
          teamID: e,
          scopeProjectID: n,
          filters: z,
          view: R,
          contentMode: ee,
          page: i,
          pageSize: 24,
          collectionID: O?.id,
          excludeCollections: u,
          requestScopeKey: $
        });
        k === ae.current && p(L);
      } catch (L) {
        k === ae.current && re(q(L, "加载资产失败"));
      } finally {
        k === ae.current && rt(!1);
      }
    },
    [
      O?.id,
      ee,
      u,
      z,
      $,
      n,
      e,
      R
    ]
  );
  K(() => {
    Ee(1);
  }, [Ee, A, zt]);
  function Kt(i) {
    Z(""), i.sourceType === "official" && R !== "assets" && (D("assets"), ue.current = "assets"), G(i), O || (de.current = i), p((k) => ({ ...k, page: 1 }));
  }
  function Ne() {
    Z(""), Ft((i) => i + 1);
  }
  function Pt(i) {
    if (i.kind !== "collection") {
      I(i);
      return;
    }
    de.current = z, ue.current = R, W(i), G({
      ...Ae,
      kind: z.kind === "collection" ? U.length === 1 ? U[0] : "" : z.kind
    }), p(pe), I(null), re(""), Z("");
  }
  function Ut() {
    ae.current += 1, W(null), G(de.current), D(ue.current), p(pe), I(null), re(""), Z("");
  }
  function Wt(i) {
    i === R || ge || (ae.current += 1, D(i), O || (ue.current = i), p(pe), I(null), ye(null), ce(null), re(""), Z(""));
  }
  function se(i, k) {
    if (H === "toast") {
      Ct[i](k);
      return;
    }
    Z(i === "success" ? "" : k);
  }
  async function Bt() {
    if (!X || ge) return;
    const i = X.id;
    Z(""), ke(i);
    try {
      await Nn({ teamID: e, assetID: i }), ce(null), T?.libraryType === "asset" && T.id === i && I(null), x?.(i), se("success", "资产已移入回收站"), Ne();
    } catch (k) {
      se("error", q(k, "删除资产失败"));
    } finally {
      ke(0);
    }
  }
  async function Gt(i) {
    if (!ge) {
      Z(""), ke(i.id);
      try {
        const k = await Cn({ teamID: e, assetID: i.id });
        M?.(k), se("success", "资产已恢复"), Ne();
      } catch (k) {
        se("error", q(k, "恢复资产失败"));
      } finally {
        ke(0);
      }
    }
  }
  async function Jt(i) {
    const k = Array.from(i.target.files || []);
    if (i.target.value = "", !(!S || k.length === 0 || qe)) {
      Z(""), je(!0), Se(null);
      try {
        const L = await S(k, {
          onProgress: Se
        });
        if (L.length === 0)
          throw new Error("上传完成，但没有生成可用资产");
        L.forEach((Me) => M?.(Me));
        const me = {
          ...Ae,
          sourceType: "upload",
          canvasID: z.canvasID || r,
          kind: U.length === 1 ? U[0] : ""
        };
        ae.current += 1, W(null), D("assets"), ue.current = "assets", G(me), de.current = me, p(pe), I(null), re(""), se("success", `已上传 ${L.length} 项资产`);
      } catch (L) {
        se("error", q(L, "上传资产失败"));
      } finally {
        je(!1), Se(null);
      }
    }
  }
  function Ht(i, k, L) {
    i.forEach((Ue) => M?.(Ue));
    const me = new Set(i.map((Ue) => Ue.kind)), Me = {
      ...Ae,
      sourceType: "import",
      canvasID: z.canvasID || r,
      kind: me.size === 1 && i[0]?.kind || ""
    };
    ae.current += 1, W(null), D("assets"), ue.current = "assets", G(Me), de.current = Me, p(pe), I(null), re("");
    const Pe = L.successCount + L.skippedCount;
    if (L.failedCount > 0) {
      se(
        "warning",
        `已导入 ${Pe} 项，${L.failedCount} 项失败`
      );
      return;
    }
    if (k.length > 0) {
      se(
        "warning",
        `已导入 ${Pe} 项，部分媒体保留原地址`
      );
      return;
    }
    se("success", `已导入 ${Pe} 项内容`);
  }
  const ct = ot ? /* @__PURE__ */ t("p", { className: "wb-asset-picker-message", role: "alert", children: ot }) : null;
  return /* @__PURE__ */ a("section", { className: `wb-asset-browser ${j}`.trim(), children: [
    /* @__PURE__ */ a("header", { className: "wb-asset-browser-head", children: [
      /* @__PURE__ */ t(
        hr,
        {
          filters: z,
          options: oe,
          scopeProjectID: n,
          sourceLabels: E,
          sourceVisibility: te,
          allowedKinds: U,
          includeOfficial: y,
          view: R,
          collectionName: O?.name,
          onCollectionBack: O ? Ut : void 0,
          onChange: Kt,
          onViewChange: Wt
        }
      ),
      /* @__PURE__ */ a("div", { className: "wb-asset-browser-actions", children: [
        /* @__PURE__ */ t("span", { children: Ce ? "正在加载" : `${_.total} 项` }),
        /* @__PURE__ */ t(
          B,
          {
            label: z.sourceType === "official" ? "刷新官方素材" : "刷新资产",
            children: /* @__PURE__ */ a("button", { type: "button", onClick: Ne, children: [
              /* @__PURE__ */ t(an, { className: Ce ? "is-spinning" : "" }),
              /* @__PURE__ */ t("span", { className: "sr-only", children: z.sourceType === "official" ? "刷新官方素材" : "刷新资产" })
            ] })
          }
        ),
        !O && S ? /* @__PURE__ */ a($e, { children: [
          /* @__PURE__ */ t(
            br,
            {
              uploading: qe,
              progress: Lt,
              onClick: () => lt.current?.click()
            }
          ),
          /* @__PURE__ */ t(
            "input",
            {
              ref: lt,
              type: "file",
              hidden: !0,
              multiple: !0,
              accept: F,
              onChange: Jt
            }
          )
        ] }) : null,
        O ? null : l,
        !O && be ? /* @__PURE__ */ t(
          sr,
          {
            disabled: qe,
            task: xt,
            onClick: () => Ke(!0)
          }
        ) : null
      ] })
    ] }),
    X ? null : ct,
    /* @__PURE__ */ t("div", { className: "wb-asset-browser-body", children: Ce && _.items.length === 0 ? /* @__PURE__ */ t(Ge, { icon: /* @__PURE__ */ t(P, { className: "is-spinning" }) }) : it ? /* @__PURE__ */ t(Ge, { text: it, error: !0 }) : _.items.length === 0 ? /* @__PURE__ */ t(
      Ge,
      {
        icon: R === "trash" ? /* @__PURE__ */ t(kt, {}) : /* @__PURE__ */ t(sn, {}),
        text: _t ? "正在读取资产配置" : R === "trash" ? "回收站为空" : O ? "集合内暂无符合条件的资产" : z.sourceType === "official" ? "当前分类暂无官方素材" : "暂无符合条件的资产"
      }
    ) : /* @__PURE__ */ t("div", { className: "wb-asset-grid", children: _.items.map((i) => {
      const k = kn(i);
      return /* @__PURE__ */ t(
        Pn,
        {
          asset: i,
          sourceLabels: E,
          view: R,
          selectable: i.kind !== "collection" && d && R === "assets",
          selected: R === "assets" && Ot.has(k),
          used: R === "assets" && jt.has(k),
          busy: ge === i.id,
          readOnly: i.libraryType === "material",
          onOpen: Pt,
          onRename: ye,
          onDelete: R === "assets" ? ce : void 0,
          onRestore: R === "trash" ? Gt : void 0,
          onSelect: b
        },
        k
      );
    }) }) }),
    _.total > _.pageSize ? /* @__PURE__ */ a("footer", { className: "wb-asset-pagination", children: [
      /* @__PURE__ */ t(B, { label: "上一页", children: /* @__PURE__ */ t(
        "button",
        {
          type: "button",
          disabled: _.page <= 1 || Ce,
          onClick: () => {
            Ee(_.page - 1);
          },
          children: /* @__PURE__ */ t(on, {})
        }
      ) }),
      /* @__PURE__ */ a("span", { children: [
        _.page,
        " / ",
        Math.max(1, Math.ceil(_.total / _.pageSize))
      ] }),
      /* @__PURE__ */ t(B, { label: "下一页", children: /* @__PURE__ */ t(
        "button",
        {
          type: "button",
          disabled: !_.hasMore || Ce,
          onClick: () => {
            Ee(_.page + 1);
          },
          children: /* @__PURE__ */ t(ln, {})
        }
      ) })
    ] }) : null,
    T?.libraryType === "asset" ? /* @__PURE__ */ t(
      Jn,
      {
        teamID: e,
        assetID: T.id,
        selectable: d && R === "assets",
        notificationMode: H,
        layer: N,
        onClose: () => I(null),
        onSelect: b ? (i) => {
          I(null), b(i);
        } : void 0,
        onContinue: h ? (i) => {
          I(null), h(i);
        } : void 0,
        canContinue: w,
        onAssetChanged: (i) => {
          Ne(), M?.(i);
        }
      }
    ) : null,
    T?.libraryType === "material" ? /* @__PURE__ */ t(
      er,
      {
        teamID: e,
        material: T,
        selectable: d && R === "assets",
        layer: N,
        onClose: () => I(null),
        onSelect: b ? (i) => {
          I(null), b(i);
        } : void 0
      }
    ) : null,
    /* @__PURE__ */ t(
      Et,
      {
        teamID: e,
        asset: le,
        onClose: () => ye(null),
        onRenamed: (i) => {
          p((k) => ({
            ...k,
            items: k.items.map(
              (L) => L.id === i.id ? i : L
            )
          })), M?.(i), Ne();
        }
      }
    ),
    be ? /* @__PURE__ */ t(
      ur,
      {
        open: Rt,
        teamID: e,
        projectID: n,
        canvasID: z.canvasID || r,
        platforms: oe.webContentImportPlatforms,
        maxItems: oe.webContentImportMaxItems,
        onClose: () => Ke(!1),
        onImported: Ht,
        onTaskChange: at
      }
    ) : null,
    /* @__PURE__ */ t(
      gr,
      {
        open: !!X,
        layerZIndex: zn,
        onOpenChange: (i) => {
          !i && !ge && ce(null);
        },
        title: "移入回收站？",
        desc: X?.kind === "collection" ? `“${X.name}”及集合内素材将移入回收站，你可以稍后恢复。` : `“${X?.name || "该资产"}”将从资产列表移除，你可以稍后在回收站中恢复。`,
        confirmText: "移入回收站",
        destructive: !0,
        isLoading: !!ge,
        handleConfirm: () => {
          Bt();
        },
        children: ct
      }
    )
  ] });
}
function Ge({
  icon: e,
  text: n = "",
  error: r = !1
}) {
  return /* @__PURE__ */ a("div", { className: `wb-asset-state ${r ? "is-error" : ""}`.trim(), children: [
    e,
    n ? /* @__PURE__ */ t("p", { children: n }) : null
  ] });
}
function vr(e, n) {
  const r = { ...Ae, ...e || {} };
  return n.length > 0 && !n.includes(r.kind) && (r.kind = n[0]), r.projectID && (r.sourceType = "project", r.sourceID = r.projectID), r.sourceType !== "project" && (r.projectID = 0, r.assetCateID = 0, r.nodeKey = "", r.role = ""), r;
}
function wr(e) {
  const n = At.filter(
    (s) => s.key !== "collection"
  ), r = n.map((s) => s.key).filter((s) => e?.includes(s));
  return r.length === n.length ? [] : r;
}
function kr(e, n, r, s) {
  if (e.sourceType !== "official") return e;
  const d = Je(
    n.materialLibrary,
    r
  );
  if (!s || !n.materialLibrary.enabled || !d)
    return {
      ...Ae,
      kind: r.length === 1 ? r[0] : ""
    };
  const u = new Set(
    n.materialLibrary.kinds.map((g) => g.assetKind)
  ), c = e.kind && u.has(e.kind) && (r.length === 0 || r.includes(e.kind)) ? e.kind : d, f = new Set(
    Nt(n.materialLibrary, c).map(
      (g) => g.id
    )
  );
  return {
    ...e,
    kind: c,
    materialCateID: f.has(e.materialCateID) ? e.materialCateID : 0
  };
}
export {
  Lr as A,
  br as a,
  Jn as b
};
