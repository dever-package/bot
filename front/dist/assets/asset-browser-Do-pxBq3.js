import { j as t, a, F as Se } from "./preloadable-B6QZqbLd.js";
import { k as Qt, q as Ye, r as U, s as ve, h as Yt, n as Fe, X as gt, b as vt, aB as en, aC as wt, x as kt, C as tn, A as nn, Q as rn, aD as an, V as Ct, U as sn, R as on, aE as ln, I as cn, d as dn } from "./vendor-icons-IZIW7U43.js";
import { a as v, d as P, u as ie, b as Y, h as ee } from "./file-kind-Cq3pESGF.js";
import { t as Nt } from "./index-sa-WXoG6.js";
import { r as un, s as mn, u as pn, b as hn, T as fn, c as bn, d as yn, e as gn, l as vn, n as wn, f as Je, o as It, g as kn, h as Cn, a as Nn, j as In, m as Dn } from "./text-content-save-actions-BnQTlGfX.js";
import { F as Tn, G as Ve, H as Oe, I as An, q as $n } from "./asset-preview-CF7Cok8_.js";
import { B as H, b as xe, v as $e, t as Sn, w as En, m as Dt, o as Tt, q as Ln, x as Mn, n as At, y as Rn, z as $t, A as xn, C as _n, D as zn } from "./asset-audio-preview-CWf3Wq_n.js";
import { c as St } from "./space-assistant-layout-B9KyeCM0.js";
import { r as q, t as Fn, s as et, a as _e, d as X, j as Ie, e as Xe, b as Et } from "./asset-upload-progress-BKzeQB8G.js";
import { S as Vn, C as On } from "./space-content-view-BZ7HjOCd.js";
import { r as qn, a as ut, s as jn, A as Kn, b as Pn } from "./asset-text-content-editor-BbBivzxn.js";
import { u as Un } from "./space-node-runtime-DoeIrVE7.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./asset-browser-Dzwwfu75.css", import.meta.url).href]);
function Bn({
  asset: e,
  collectionMemberLabel: n = "素材",
  sourceLabels: r,
  view: s = "assets",
  selectable: d = !1,
  selected: u = !1,
  used: c = !1,
  busy: p = !1,
  readOnly: g = !1,
  onOpen: l,
  onRename: y,
  onDelete: m,
  onRestore: b,
  onSelect: f
}) {
  const k = s === "trash", D = e.kind === "collection", V = `${e.collectionCount} 项${n}`, L = D ? 0 : Tn(e.version?.content, e.kind), _ = d && !D && !!f, i = _ && (p || c), $ = _ ? c ? `${e.name}已使用` : u ? `取消选择${e.name}` : `选择${e.name}` : `${D ? "打开集合" : "查看"}${e.name}`, O = D ? /* @__PURE__ */ t(Wn, { asset: e, countLabel: V }) : /* @__PURE__ */ t(
    Ve,
    {
      kind: e.kind,
      content: e.version?.content,
      summary: e.summary,
      compact: !0
    }
  );
  function j() {
    if (_) {
      i || f?.(e);
      return;
    }
    l(e);
  }
  return /* @__PURE__ */ a(
    "article",
    {
      className: `wb-asset-card ${D ? "is-collection" : ""} ${e.libraryType === "material" ? "is-official" : ""} ${u ? "is-selected" : ""} ${c ? "is-used" : ""} ${k ? "is-trash" : ""}`.trim(),
      children: [
        /* @__PURE__ */ a("div", { className: "wb-asset-card-main", children: [
          /* @__PURE__ */ a("div", { className: "wb-asset-card-preview", children: [
            O,
            L > 1 ? /* @__PURE__ */ a("span", { className: "wb-asset-media-count", children: [
              L,
              " 项"
            ] }) : null,
            e.kind !== "audio" ? /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: "wb-asset-card-preview-open",
                disabled: i,
                onClick: j,
                "aria-label": $
              }
            ) : null
          ] }),
          /* @__PURE__ */ t(H, { label: e.name, children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "wb-asset-card-copy",
              disabled: i,
              onClick: j,
              children: [
                /* @__PURE__ */ t("strong", { children: e.name }),
                /* @__PURE__ */ t("span", { children: D ? `集合 · ${V}` : e.libraryType === "material" ? `${e.materialCateName || xe("official", r)} · ${$e(e.kind)}` : `${xe(e.sourceType, r)} · ${$e(e.kind)}` })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ t("span", { className: "wb-asset-card-kind-icon", children: /* @__PURE__ */ t(Oe, { kind: e.kind }) }),
        /* @__PURE__ */ a("div", { className: "wb-asset-card-actions", children: [
          _ && !k ? /* @__PURE__ */ t(H, { label: "查看详情", children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              disabled: p,
              onClick: (B) => {
                B.stopPropagation(), l(e);
              },
              children: [
                /* @__PURE__ */ t(Qt, { "aria-hidden": "true" }),
                /* @__PURE__ */ t("span", { className: "sr-only", children: "查看详情" })
              ]
            }
          ) }) : null,
          !k && !g && y ? /* @__PURE__ */ t(H, { label: "修改标题", children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              disabled: p,
              onClick: () => y(e),
              children: [
                /* @__PURE__ */ t(Ye, { "aria-hidden": "true" }),
                /* @__PURE__ */ t("span", { className: "sr-only", children: "修改标题" })
              ]
            }
          ) }) : null,
          k && b ? /* @__PURE__ */ t(H, { label: "恢复资产", children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "is-restore",
              disabled: p,
              onClick: () => b(e),
              children: [
                p ? /* @__PURE__ */ t(U, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ t(ve, { "aria-hidden": "true" }),
                /* @__PURE__ */ t("span", { className: "sr-only", children: "恢复资产" })
              ]
            }
          ) }) : !g && m ? /* @__PURE__ */ t(H, { label: "移入回收站", children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "is-danger",
              disabled: p,
              onClick: () => m(e),
              children: [
                p ? /* @__PURE__ */ t(U, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ t(Yt, { "aria-hidden": "true" }),
                /* @__PURE__ */ t("span", { className: "sr-only", children: "移入回收站" })
              ]
            }
          ) }) : null,
          !D && !k && d && f ? /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: `is-primary ${u ? "is-selected" : ""} ${c ? "is-used" : ""}`.trim(),
              disabled: p || c,
              onClick: j,
              children: [
                /* @__PURE__ */ t(Fe, { "aria-hidden": "true" }),
                c ? "已使用" : u ? "已选" : "使用"
              ]
            }
          ) : null
        ] })
      ]
    }
  );
}
function Wn({
  asset: e,
  countLabel: n
}) {
  const r = e.collectionPreviews.slice(0, 4);
  return r.length === 0 ? /* @__PURE__ */ a("div", { className: "wb-asset-collection-empty", children: [
    /* @__PURE__ */ t(Oe, { kind: "collection" }),
    /* @__PURE__ */ t("span", { children: e.collectionCount > 0 ? n : "空集合" })
  ] }) : /* @__PURE__ */ a("div", { className: `wb-asset-collection-preview has-${r.length}`, children: [
    r.map((s) => /* @__PURE__ */ t("div", { children: /* @__PURE__ */ t(Ve, { kind: s.kind, content: s.content, compact: !0 }) }, s.id)),
    /* @__PURE__ */ t("span", { children: n })
  ] });
}
function Lt({
  teamID: e,
  asset: n,
  onClose: r,
  onRenamed: s
}) {
  const [d, u] = v(""), [c, p] = v(!1), [g, l] = v("");
  P(() => {
    n && (u(n.name), p(!1), l(""));
  }, [n]), P(() => {
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
      p(!0), l("");
      try {
        const f = await un({
          teamID: e,
          assetID: n.id,
          name: b
        });
        s(f), r();
      } catch (f) {
        l(q(f, "修改资产标题失败"));
      } finally {
        p(!1);
      }
    }
  }
  return !n || typeof document > "u" ? null : St(
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
            /* @__PURE__ */ t(H, { label: "关闭", children: /* @__PURE__ */ t("button", { type: "button", disabled: c, onClick: r, children: /* @__PURE__ */ t(gt, { "aria-hidden": "true" }) }) })
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
                  c ? /* @__PURE__ */ t(U, { className: "is-spinning" }) : null,
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
function Gn() {
  return Mt().labels;
}
function Hn({
  teamID: e,
  asset: n,
  enabled: r,
  onSaved: s,
  onError: d
}) {
  const u = n?.version || null, c = ie(
    () => qn(
      n?.kind === "richtext" ? "richtext" : "text",
      u?.content
    ),
    [n?.kind, u?.content]
  ), p = Y(null), g = ee(
    async (b, f) => {
      if (!r || !n?.id || !u?.id)
        throw new Error("当前资产正文不可编辑");
      const k = ut(b), D = f === "create_version" ? Jn(p, u, k) : "", V = await mn({
        teamID: e,
        assetID: n.id,
        expectedVersionID: u.id,
        expectedUpdatedAt: u.updatedAt || u.createdAt,
        requestID: D,
        saveMode: f,
        content: jn(b)
      });
      p.current = null, s(V, f);
    },
    [n, r, s, e, u]
  ), l = pn({
    value: c,
    resetKey: `${n?.id || 0}:${u?.id || 0}:${u?.updatedAt || u?.createdAt || ""}`,
    fingerprint: ut,
    save: (b) => g(b, "overwrite_current"),
    onError: d,
    autoSave: !1
  }), { flushWith: y } = l, m = ee(
    () => y((b) => g(b, "create_version")),
    [y, g]
  );
  return {
    ...l,
    saveAsNewVersion: m
  };
}
function Jn(e, n, r) {
  if (e.current?.versionID === n.id && e.current.fingerprint === r)
    return e.current.requestID;
  const s = typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`, d = `manual-edit-${n.id}-${s}`.slice(0, 64);
  return e.current = { versionID: n.id, fingerprint: r, requestID: d }, d;
}
function Xn({
  teamID: e,
  assetID: n,
  selectable: r = !1,
  onClose: s,
  onSelect: d,
  onContinue: u,
  canContinue: c,
  onAssetChanged: p,
  notificationMode: g = "toast",
  layer: l = "default"
}) {
  const y = Gn(), [m, b] = v(null), [f, k] = v(
    null
  ), [D, V] = v(!0), [L, _] = v(0), [i, $] = v(!1), [O, j] = v(!1), [B, N] = v(""), [K, S] = v(""), E = ee(async () => {
    V(!0), N(""), S("");
    try {
      const h = mt(await hn(e, n));
      b(h), k(h.asset.version);
    } catch (h) {
      N(q(h, "加载资产详情失败"));
    } finally {
      V(!1);
    }
  }, [n, e]);
  P(() => {
    E();
  }, [E]);
  async function te(h) {
    if (!(L || h.id === f?.id) && be()) {
      if (h.id === m?.asset.versionID && m.asset.version) {
        N(""), k(m.asset.version);
        return;
      }
      _(h.id), N("");
      try {
        k(
          await yn({ teamID: e, assetID: n, versionID: h.id })
        );
      } catch (A) {
        N(q(A, "加载资产版本失败"));
      } finally {
        _(0);
      }
    }
  }
  async function fe() {
    if (!m || !m.hasMore || L) return;
    const h = Math.floor(m.versions.length / 20) + 1;
    _(-1), S("");
    try {
      const A = await gn({
        teamID: e,
        assetID: n,
        page: h,
        pageSize: 20
      });
      b(
        (I) => I && {
          ...I,
          versions: Ze([...I.versions, ...A.items]),
          versionTotal: A.total,
          hasMore: A.hasMore
        }
      );
    } catch (A) {
      S(q(A, "加载资产版本失败"));
    } finally {
      _(0);
    }
  }
  async function W() {
    if (!(!m || !f || i)) {
      $(!0), N("");
      try {
        const h = await bn({
          teamID: e,
          assetID: n,
          versionID: f.id
        }), A = mt({ ...m, asset: h });
        b(A), k(h.version), p?.(h);
      } catch (h) {
        N(q(h, "设置当前版本失败"));
      } finally {
        $(!1);
      }
    }
  }
  const C = m?.asset, ne = C?.status === "deleted", R = !!(C && f && C.versionID === f.id), J = ie(
    () => Sn(f?.content),
    [f?.content]
  ), F = ie(
    () => En(f?.content, "storyboard"),
    [f?.content]
  ), G = !!(C && f && R && !ne && (C.kind === "text" || C.kind === "richtext") && !J && !F), x = ee(
    (h, A) => {
      N(""), b((I) => {
        if (!I) return I;
        const le = h.version, ye = !!(le && I.versions.some((ce) => ce.id === le.id)), Z = Ze(
          le ? [le, ...I.versions] : I.versions
        );
        return {
          ...I,
          asset: h,
          versions: Z,
          versionTotal: Math.max(
            Z.length,
            I.versionTotal + (le && !ye ? 1 : 0)
          )
        };
      }), k(h.version), p?.(h), g === "toast" && Nt.success(
        A === "create_version" ? "已保存为新版本" : "正文已保存"
      );
    },
    [g, p]
  ), T = Hn({
    teamID: e,
    asset: C,
    enabled: G,
    onSaved: x,
    onError: (h) => N(q(h, "保存资产正文失败"))
  }), oe = T.reset, we = T.hasPendingChanges, be = ee(() => !G || !we ? !0 : window.confirm("当前正文尚未保存，确定放弃修改吗？") ? (oe(), N(""), !0) : !1, [G, we, oe]), z = ee(() => {
    O || !be() || s();
  }, [be, s, O]);
  return /* @__PURE__ */ a(
    At,
    {
      ariaLabel: `${C?.name || "资产"}详情`,
      onRequestClose: z,
      layer: l,
      header: /* @__PURE__ */ t(
        Dt,
        {
          icon: C ? /* @__PURE__ */ t(Oe, { kind: C.kind }) : /* @__PURE__ */ t(vt, { size: 16 }),
          title: C?.name || "资产详情",
          subtitle: C ? `${er(C, y)} · ${$e(C.kind)} · ${Mn(C.role)}` : "",
          versionSelect: m && C && f ? /* @__PURE__ */ t(
            Ln,
            {
              options: m.versions.map((h) => ({
                id: h.id,
                version: h.version,
                updatedAt: h.updatedAt || h.createdAt,
                value: h
              })),
              currentVersionId: C.versionID,
              selectedVersionId: f.id,
              total: m.versionTotal,
              hasMore: m.hasMore,
              loading: L > 0,
              loadingMore: L === -1,
              error: K,
              disabled: i || T.status === "saving",
              onSelect: (h) => {
                te(h);
              },
              onLoadMore: () => {
                fe();
              },
              onRetry: () => {
                fe();
              }
            }
          ) : void 0,
          state: ne ? /* @__PURE__ */ t("span", { className: "wb-detail-state", children: "回收站" }) : L > 0 ? /* @__PURE__ */ a("span", { className: "wb-detail-state is-saving", children: [
            /* @__PURE__ */ t(U, { size: 12, className: "wb-detail-spin" }),
            "读取中"
          ] }) : G ? T.status === "error" ? /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "wb-detail-state is-error",
              onClick: () => {
                T.retry();
              },
              children: [
                /* @__PURE__ */ t(ve, { size: 12 }),
                "保存失败"
              ]
            }
          ) : /* @__PURE__ */ a("span", { className: `wb-detail-state is-${T.status}`, children: [
            T.status === "saving" ? /* @__PURE__ */ t(U, { size: 12, className: "wb-detail-spin" }) : null,
            Yn(T.status)
          ] }) : /* @__PURE__ */ t("span", { className: "wb-detail-state", children: "只读预览" }),
          updatedAt: Tt(
            f?.updatedAt || f?.createdAt
          ),
          actions: C && f && !ne ? /* @__PURE__ */ a(Se, { children: [
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "wb-detail-command",
                onClick: () => j(!0),
                children: [
                  /* @__PURE__ */ t(Ye, { size: 13 }),
                  /* @__PURE__ */ t("span", { children: "修改标题" })
                ]
              }
            ),
            G ? /* @__PURE__ */ t(
              fn,
              {
                status: T.status,
                hasPendingChanges: T.hasPendingChanges,
                onReset: () => {
                  T.reset(), N("");
                },
                onSaveAsNewVersion: () => {
                  T.saveAsNewVersion();
                },
                onSave: () => {
                  T.flush();
                }
              }
            ) : null,
            R ? /* @__PURE__ */ t(
              Qn,
              {
                asset: C,
                selectable: r,
                onSelect: d,
                onContinue: u,
                canContinue: c
              }
            ) : /* @__PURE__ */ t(
              Zn,
              {
                currentVersion: C.version,
                loading: !!L,
                saving: i,
                onReturn: (h) => {
                  te(h);
                },
                onMakeCurrent: () => {
                  W();
                }
              }
            )
          ] }) : void 0,
          onClose: z
        }
      ),
      children: [
        /* @__PURE__ */ t("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ t("div", { className: "wb-detail-scroll", children: D ? /* @__PURE__ */ a("div", { className: "wb-detail-content-state", children: [
          /* @__PURE__ */ t(U, { size: 18, className: "wb-detail-spin" }),
          /* @__PURE__ */ t("span", { children: "正在读取资产" })
        ] }) : !C || !f ? /* @__PURE__ */ a("div", { className: "wb-detail-content-state is-error", children: [
          /* @__PURE__ */ t("span", { children: B || "资产不存在" }),
          /* @__PURE__ */ a("button", { type: "button", onClick: () => {
            E();
          }, children: [
            /* @__PURE__ */ t(ve, { size: 13 }),
            "重试"
          ] })
        ] }) : G ? /* @__PURE__ */ a("div", { className: `wb-detail-editable-content is-${C.kind}`, children: [
          B ? /* @__PURE__ */ t("p", { className: "wb-detail-error-banner", children: B }) : null,
          /* @__PURE__ */ t(
            Kn,
            {
              kind: T.draft.kind,
              value: T.draft.value,
              contentFormat: T.draft.contentFormat,
              onChange: (h) => T.setDraft(
                (A) => Pn(A, h)
              )
            }
          )
        ] }) : /* @__PURE__ */ a("div", { className: `wb-detail-readonly-content is-${C.kind}`, children: [
          B ? /* @__PURE__ */ t("p", { className: "wb-detail-error-banner", children: B }) : null,
          J ? /* @__PURE__ */ t(Vn, { grid: J, variant: "detail" }) : F ? /* @__PURE__ */ t(
            On,
            {
              output: f.content,
              fallback: f.summary || C.summary,
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
              content: f.content,
              summary: f.summary || C.summary,
              prompt: An(f)
            },
            f.id
          )
        ] }) }) }),
        /* @__PURE__ */ t(
          Lt,
          {
            teamID: e,
            asset: O && C || null,
            onClose: () => j(!1),
            onRenamed: (h) => {
              b(
                (A) => A && { ...A, asset: h }
              ), p?.(h);
            }
          }
        )
      ]
    }
  );
}
function Zn({
  currentVersion: e,
  loading: n,
  saving: r,
  onReturn: s,
  onMakeCurrent: d
}) {
  const u = n || r;
  return /* @__PURE__ */ a(Se, { children: [
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
          r ? /* @__PURE__ */ t(U, { size: 13, className: "wb-detail-spin" }) : /* @__PURE__ */ t(Fe, { size: 13 }),
          /* @__PURE__ */ t("span", { children: r ? "设置中" : "设为当前版本" })
        ]
      }
    )
  ] });
}
function Qn({
  asset: e,
  selectable: n,
  onSelect: r,
  onContinue: s,
  canContinue: d
}) {
  return /* @__PURE__ */ a(Se, { children: [
    s && tr(e) && (d?.(e) ?? !0) ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        onClick: () => s(e),
        children: [
          e.sourceType === "dialogue" ? /* @__PURE__ */ t(en, { size: 14 }) : /* @__PURE__ */ t(ve, { size: 14 }),
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
function mt(e) {
  const n = Ze(
    e.asset.version ? [e.asset.version, ...e.versions] : e.versions
  );
  return {
    ...e,
    versions: n,
    versionTotal: Math.max(e.versionTotal, n.length)
  };
}
function Ze(e) {
  const n = /* @__PURE__ */ new Set();
  return e.filter((r) => n.has(r.id) ? !1 : (n.add(r.id), !0));
}
function Yn(e) {
  return e === "dirty" ? "未保存" : e === "saving" ? "保存中" : e === "error" ? "保存失败" : "已保存";
}
function er(e, n) {
  const r = xe(e.sourceType, n);
  return e.sourceName && e.sourceName !== r ? `${r} / ${e.sourceName}` : r;
}
function tr(e) {
  return e.role === "material" && (e.sourceType === "tool" || e.sourceType === "dialogue");
}
function nr({
  teamID: e,
  material: n,
  selectable: r = !1,
  layer: s = "default",
  onClose: d,
  onSelect: u
}) {
  const [c, p] = v(n), [g, l] = v(!0), [y, m] = v(""), b = ee(async () => {
    l(!0), m("");
    try {
      p(await vn(e, n.id));
    } catch (k) {
      m(q(k, "加载官方素材详情失败"));
    } finally {
      l(!1);
    }
  }, [n.id, e]);
  P(() => {
    b();
  }, [b]);
  const f = $n(c.version?.content, c.kind);
  return /* @__PURE__ */ t(
    At,
    {
      ariaLabel: `${c.name}详情`,
      onRequestClose: d,
      layer: s,
      header: /* @__PURE__ */ t(
        Dt,
        {
          icon: c ? /* @__PURE__ */ t(Oe, { kind: c.kind }) : /* @__PURE__ */ t(vt, { size: 16 }),
          title: c.name || "官方素材详情",
          subtitle: `${xe("official")} · ${$e(c.kind)}${c.materialCateName ? ` · ${c.materialCateName}` : ""}`,
          state: /* @__PURE__ */ t("span", { className: "wb-detail-state", children: "官方只读" }),
          updatedAt: Tt(c.createdAt),
          downloadUrl: f || void 0,
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
        /* @__PURE__ */ t(U, { size: 18, className: "wb-detail-spin" }),
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
const rr = "shemic:web-content-import";
function he(e) {
  return !!(e && (e.status === "pending" || e.status === "discovering" || e.status === "running"));
}
function ar(e, n) {
  return `${rr}:${e}:${n}`;
}
function sr(e) {
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
function Ge(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.removeItem(e);
    } catch {
    }
}
function ir() {
  return typeof globalThis.crypto?.randomUUID == "function" ? globalThis.crypto.randomUUID() : `import-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
function or({
  disabled: e,
  task: n,
  onClick: r
}) {
  const s = he(n), d = s ? Math.min(100, Math.max(0, n.progress)) : 0, u = s ? `导入 ${d}%` : "导入";
  return /* @__PURE__ */ t(
    H,
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
            s ? /* @__PURE__ */ t(U, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ t(wt, { "aria-hidden": "true" }),
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
const tt = ze.joinSiteApi, nt = ze.request;
async function lr(e) {
  const n = await nt(
    tt("workbench/web_content_import"),
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
  return rt(
    et(n, "创建网页内容导入任务失败")
  );
}
async function pt(e) {
  const n = await nt(
    tt("workbench/web_content_import_task"),
    "get",
    {
      team_id: e.teamID,
      project_id: e.projectID || void 0,
      canvas_id: e.canvasID || void 0,
      task_id: e.taskID
    },
    { reportError: !1 }
  );
  return rt(
    et(n, "加载网页内容导入任务失败")
  );
}
async function ht(e) {
  const n = await nt(
    tt("workbench/web_content_import_tasks"),
    "get",
    {
      team_id: e.teamID,
      project_id: e.projectID || void 0,
      canvas_id: e.canvasID || void 0
    },
    { reportError: !1 }
  ), r = et(n, "加载网页内容导入任务失败");
  return _e(r.items).map(rt).filter((s) => s.id > 0);
}
function rt(e) {
  const n = Et(e), r = _e(n.assets).map(wn).filter((s) => s.id > 0);
  return {
    id: Xe(n.id),
    canvasID: Xe(n.canvas_id),
    source: X(n.source),
    status: ur(n.status),
    stageMessage: X(n.stage_message),
    progress: Math.min(100, Ie(n.progress)),
    itemTotal: Ie(n.item_total),
    successCount: Ie(n.success_count),
    skippedCount: Ie(n.skipped_count),
    failedCount: Ie(n.failed_count),
    errorMessage: X(n.error_message),
    assets: r,
    warnings: dr(n.warnings),
    items: _e(n.items).map(cr).filter((s) => s.id > 0)
  };
}
function cr(e) {
  const n = Et(e);
  return {
    id: Xe(n.id),
    platform: X(n.platform),
    sourceURL: X(n.source_url),
    title: X(n.title),
    status: X(n.status),
    stageMessage: X(n.stage_message),
    errorMessage: X(n.error_message)
  };
}
function dr(e) {
  return _e(e).map(X).filter(Boolean);
}
function ur(e) {
  const n = X(e);
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
function mr({
  open: e,
  teamID: n,
  projectID: r,
  canvasID: s,
  onClose: d,
  onImported: u,
  onTaskChange: c
}) {
  const [p, g] = v(""), [l, y] = v(null), [m, b] = v(!1), [f, k] = v(""), D = Y(e), V = Y(d), L = Y(u), _ = Y(/* @__PURE__ */ new Set()), i = Y(null), $ = `${ar(n, r)}:${s}`, O = he(l) && l?.id || 0;
  P(() => {
    D.current = e, V.current = d, L.current = u;
  }, [d, u, e]), P(() => {
    c?.(l);
  }, [c, l]), P(() => {
    let N = !1;
    _.current.clear(), y(null), g(""), k(""), b(!1), i.current = null;
    async function K() {
      try {
        const S = sr($);
        let E = null;
        if (S > 0)
          try {
            E = await pt({
              teamID: n,
              projectID: r,
              canvasID: s,
              taskID: S
            });
          } catch {
            Ge($);
          }
        if (E || (E = (await ht({
          teamID: n,
          projectID: r,
          canvasID: s
        }))[0] || null), N || !E) return;
        g(E.source), y(E), We($, E.id);
      } catch {
      }
    }
    return K(), () => {
      N = !0;
    };
  }, [s, r, $, n]), P(() => {
    if (O <= 0) return;
    let N = !1, K = 0;
    async function S() {
      try {
        const E = await pt({
          teamID: n,
          projectID: r,
          canvasID: s,
          taskID: O
        });
        if (N || (y(E), k(""), !he(E))) return;
        K = window.setTimeout(S, 1200);
      } catch (E) {
        if (N) return;
        D.current && k(q(E, "刷新导入进度失败")), K = window.setTimeout(S, 2500);
      }
    }
    return K = window.setTimeout(S, 700), () => {
      N = !0, window.clearTimeout(K);
    };
  }, [O, s, r, n]), P(() => {
    if (!(!l || he(l))) {
      if (Ge($), l.status === "failed") {
        k(l.errorMessage || "网页内容导入失败");
        return;
      }
      if (!_.current.has(l.id)) {
        if (l.assets.length === 0) {
          k(l.errorMessage || "导入完成，但没有生成可用素材");
          return;
        }
        _.current.add(l.id), i.current = null, L.current(l.assets, l.warnings, l), y(null), g(""), D.current && V.current();
      }
    }
  }, [$, l]);
  const j = ee(async () => {
    const N = p.trim();
    if (!N || m || he(l)) return;
    b(!0), k("");
    const K = i.current?.source === N ? i.current : { source: N, requestID: ir() };
    i.current = K;
    try {
      const S = await lr({
        teamID: n,
        projectID: r,
        canvasID: s,
        requestID: K.requestID,
        source: N
      });
      i.current = null, y(S), We($, S.id);
    } catch (S) {
      try {
        const te = (await ht({
          teamID: n,
          projectID: r,
          canvasID: s
        })).find((fe) => fe.source === N);
        if (te) {
          i.current = null, y(te), We($, te.id);
          return;
        }
      } catch {
      }
      k(q(S, "创建网页内容导入任务失败"));
    } finally {
      b(!1);
    }
  }, [s, r, p, $, m, l, n]), B = ee(() => {
    he(l) || (Ge($), i.current = null, y(null), k(""));
  }, [$, l]);
  return {
    source: p,
    setSource: g,
    task: l,
    submitting: m,
    active: he(l),
    error: f,
    submit: j,
    reset: B
  };
}
function pr({
  open: e,
  teamID: n,
  projectID: r = 0,
  canvasID: s = 0,
  platforms: d,
  maxItems: u,
  onClose: c,
  onImported: p,
  onTaskChange: g
}) {
  const l = mr({
    open: e,
    teamID: n,
    projectID: r,
    canvasID: s,
    onClose: c,
    onImported: p,
    onTaskChange: g
  });
  P(() => {
    if (!e) return;
    const m = (b) => {
      b.key === "Escape" && (b.preventDefault(), b.stopImmediatePropagation(), c());
    };
    return window.addEventListener("keydown", m, !0), () => window.removeEventListener("keydown", m, !0);
  }, [c, e]);
  function y(m) {
    m.preventDefault(), l.submit();
  }
  return !e || typeof document > "u" ? null : St(
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
                  /* @__PURE__ */ t("span", { className: "wb-asset-form-icon", children: /* @__PURE__ */ t(wt, { "aria-hidden": "true" }) }),
                  /* @__PURE__ */ a("div", { children: [
                    /* @__PURE__ */ t("h2", { children: "导入网络内容" }),
                    /* @__PURE__ */ a("p", { children: [
                      "支持：",
                      d.map((m) => m.name).join("、") || "已配置的平台"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ t(H, { label: "关闭", children: /* @__PURE__ */ a("button", { type: "button", onClick: c, children: [
                  /* @__PURE__ */ t(gt, { "aria-hidden": "true" }),
                  /* @__PURE__ */ t("span", { className: "sr-only", children: "关闭" })
                ] }) })
              ] }),
              l.task ? /* @__PURE__ */ t(
                hr,
                {
                  task: l.task,
                  active: l.active,
                  platforms: d
                }
              ) : /* @__PURE__ */ a("label", { children: [
                /* @__PURE__ */ t("span", { children: "链接或分享内容" }),
                /* @__PURE__ */ t(
                  "textarea",
                  {
                    autoFocus: !0,
                    value: l.source,
                    maxLength: 8192,
                    disabled: l.submitting,
                    placeholder: "粘贴内容链接或分享文本，可一次粘贴多条",
                    onChange: (m) => l.setSource(m.target.value)
                  }
                ),
                /* @__PURE__ */ a("small", { className: "wb-asset-import-help", children: [
                  "自动识别对应平台，一次最多 ",
                  u,
                  " 条，可混合粘贴"
                ] })
              ] }),
              l.error ? /* @__PURE__ */ a("p", { className: "wb-asset-form-error wb-asset-import-error", children: [
                /* @__PURE__ */ t(kt, { "aria-hidden": "true" }),
                /* @__PURE__ */ t("span", { children: l.error })
              ] }) : null,
              /* @__PURE__ */ a("footer", { children: [
                /* @__PURE__ */ t("button", { type: "button", onClick: c, children: "关闭" }),
                l.task?.status === "failed" ? /* @__PURE__ */ t(
                  "button",
                  {
                    type: "button",
                    className: "is-primary",
                    onClick: l.reset,
                    children: "重新导入"
                  }
                ) : l.active ? null : /* @__PURE__ */ a(
                  "button",
                  {
                    type: "submit",
                    className: "is-primary",
                    disabled: l.submitting || !l.source.trim(),
                    children: [
                      l.submitting ? /* @__PURE__ */ t(U, { className: "is-spinning" }) : null,
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
function hr({
  task: e,
  active: n,
  platforms: r
}) {
  const s = Math.min(100, Math.max(0, e.progress)), d = new Map(
    r.map((p) => [p.key, p.name])
  ), u = e.successCount + e.skippedCount, c = e.failedCount ? `已导入 ${u} 项，${e.failedCount} 项失败` : n ? e.stageMessage || "正在导入" : `已导入 ${u} 项`;
  return /* @__PURE__ */ a("section", { className: "wb-asset-import-status", "aria-live": "polite", children: [
    /* @__PURE__ */ a("div", { className: "wb-asset-import-status-head", children: [
      n ? /* @__PURE__ */ t(U, { className: "is-spinning", "aria-hidden": "true" }) : e.status === "failed" ? /* @__PURE__ */ t(kt, { "aria-hidden": "true" }) : /* @__PURE__ */ t(tn, { "aria-hidden": "true" }),
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
    /* @__PURE__ */ t("div", { className: "wb-asset-import-items", children: e.items.map((p, g) => /* @__PURE__ */ a(
      "div",
      {
        className: p.status === "failed" ? "is-failed" : "",
        children: [
          /* @__PURE__ */ t("b", { children: d.get(p.platform) || p.platform }),
          /* @__PURE__ */ t("span", { title: p.sourceURL, children: p.title || p.sourceURL || `第 ${g + 1} 条内容` }),
          /* @__PURE__ */ t("em", { title: ft(p), children: ft(p) })
        ]
      },
      p.id || `${p.platform}-${g}`
    )) })
  ] });
}
function ft(e) {
  return e.status === "failed" ? e.errorMessage || "导入失败" : e.status === "success" ? "已导入" : e.status === "skipped" ? "已存在" : e.stageMessage || "等待导入";
}
const fr = [
  { key: "", label: "全部" },
  ...xn
], bt = [
  { key: "", label: "全部" },
  ...$t
];
function br({
  filters: e,
  options: n,
  scopeProjectID: r = 0,
  sourceLabels: s = {},
  sourceVisibility: d = {},
  allowedKinds: u = [],
  includeOfficial: c = !0,
  view: p,
  collectionName: g,
  onCollectionBack: l,
  onChange: y,
  onViewChange: m
}) {
  const b = [
    { key: "", label: "全部" },
    ...Rn.filter(
      (i) => d[i.key] !== !1 && (i.key !== "official" || c && n.materialLibrary.enabled && !!Je(n.materialLibrary, u))
    ).map((i) => ({
      ...i,
      label: s[i.key] || i.label
    }))
  ], f = n.assetCates.length > 0, k = r || e.projectID, D = n.canvases.filter(
    (i) => (!k || i.projectID === k) && (!e.assetCateID || i.assetCateID === e.assetCateID)
  ), V = e.sourceType === "official" ? n.materialLibrary.kinds.filter(
    (i) => u.length === 0 || u.includes(i.assetKind)
  ).map((i) => ({ key: i.assetKind, label: i.name })) : u.length > 0 ? bt.filter(
    (i) => i.key && u.includes(i.key)
  ) : bt, L = It(
    n.materialLibrary,
    e.kind
  );
  function _(i) {
    const $ = i === "project" ? r : 0, O = i === "official" ? Je(n.materialLibrary, u) : "", j = i === "official" ? O : e.sourceType === "official" ? u.length === 1 ? u[0] : "" : e.kind;
    y({
      ...e,
      sourceType: i,
      sourceID: $,
      projectID: $,
      assetCateID: 0,
      canvasID: i === "project" ? e.canvasID : 0,
      materialCateID: 0,
      nodeKey: "",
      role: "",
      kind: j
    });
  }
  return /* @__PURE__ */ a("div", { className: "wb-asset-filters", children: [
    g && l ? /* @__PURE__ */ t(De, { label: "集合", children: /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "wb-asset-collection-back",
        onClick: l,
        children: [
          /* @__PURE__ */ t(nn, { "aria-hidden": "true" }),
          /* @__PURE__ */ t(rn, { "aria-hidden": "true" }),
          /* @__PURE__ */ t("span", { children: g })
        ]
      }
    ) }) : /* @__PURE__ */ a(De, { label: "来源", children: [
      /* @__PURE__ */ t(
        Re,
        {
          options: b,
          value: e.sourceType,
          onChange: _
        }
      ),
      e.sourceType === "project" ? /* @__PURE__ */ a(Se, { children: [
        r > 0 ? null : /* @__PURE__ */ t(
          Te,
          {
            label: s.project || "创作",
            value: e.projectID,
            options: n.projects,
            onChange: (i) => y({
              ...e,
              projectID: i,
              sourceID: i,
              canvasID: 0,
              assetCateID: 0,
              nodeKey: ""
            })
          }
        ),
        f ? /* @__PURE__ */ t(
          Te,
          {
            label: "资产分类",
            value: e.assetCateID,
            options: n.assetCates,
            onChange: (i) => y({
              ...e,
              assetCateID: i,
              canvasID: 0,
              nodeKey: ""
            })
          }
        ) : null
      ] }) : null,
      e.sourceType === "project" && k > 0 && D.length > 1 ? /* @__PURE__ */ t(
        Te,
        {
          label: "画布",
          value: e.canvasID,
          options: D,
          onChange: (i) => y({ ...e, canvasID: i })
        }
      ) : null,
      e.sourceType === "tool" ? /* @__PURE__ */ t(
        Te,
        {
          label: s.tool || "工具",
          value: e.sourceID,
          options: n.tools,
          onChange: (i) => y({ ...e, sourceID: i })
        }
      ) : null,
      e.sourceType === "dialogue" ? /* @__PURE__ */ t(
        Te,
        {
          label: "角色",
          value: e.sourceID,
          options: n.dialogues,
          onChange: (i) => y({ ...e, sourceID: i })
        }
      ) : null
    ] }),
    !g && e.sourceType === "project" && f ? /* @__PURE__ */ t(De, { label: "资产", children: /* @__PURE__ */ t(
      Re,
      {
        options: fr,
        value: e.role,
        onChange: (i) => y({ ...e, role: i })
      }
    ) }) : null,
    /* @__PURE__ */ t(
      De,
      {
        label: "类型",
        trailing: e.sourceType === "official" ? void 0 : /* @__PURE__ */ t(yr, { view: p, onChange: m }),
        children: /* @__PURE__ */ t(
          Re,
          {
            options: V,
            value: e.kind,
            onChange: (i) => y({
              ...e,
              kind: i,
              materialCateID: e.sourceType === "official" ? 0 : e.materialCateID
            })
          }
        )
      }
    ),
    e.sourceType === "official" && L.length > 0 ? /* @__PURE__ */ t(De, { label: "分类", children: /* @__PURE__ */ t(
      Re,
      {
        options: [
          { key: 0, label: "全部" },
          ...L.map((i) => ({
            key: i.id,
            label: i.name
          }))
        ],
        value: e.materialCateID,
        onChange: (i) => y({ ...e, materialCateID: i })
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
function yr({
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
          /* @__PURE__ */ t(an, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ t(Ct, { "aria-hidden": "true" }),
          /* @__PURE__ */ t("span", { children: "回收站" })
        ]
      }
    )
  ] });
}
function Re({
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
function gr({
  uploading: e,
  progress: n,
  onClick: r
}) {
  const s = vr(e, n), d = e && n && (n.phase !== "preparing" || n.percent > 0) ? n.percent : null;
  return /* @__PURE__ */ t(H, { label: s, children: /* @__PURE__ */ a(
    "button",
    {
      type: "button",
      className: "wb-asset-local-upload",
      disabled: e,
      "aria-busy": e,
      onClick: r,
      children: [
        e ? /* @__PURE__ */ t(U, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ t(sn, { "aria-hidden": "true" }),
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
function vr(e, n) {
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
const Qe = window.DeverFront?.sdk?.getCompatModule("@/components/confirm-dialog");
if (!Qe || Object.keys(Qe).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/confirm-dialog");
const wr = Qe.ConfirmDialog, yt = {
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
function zr({
  teamID: e,
  scopeProjectID: n = 0,
  scopeCanvasID: r = 0,
  initialFilters: s,
  selectable: d = !1,
  excludeCollections: u = !1,
  selectedAssetIDs: c,
  selectedAssetKeys: p,
  usedAssetIDs: g,
  usedAssetKeys: l,
  includeOfficial: y = !0,
  allowedKinds: m,
  onSelect: b,
  onContinue: f,
  canContinue: k,
  onAssetChanged: D,
  onAssetRemoved: V,
  onLocalUpload: L,
  uploadAccept: _,
  headerAction: i,
  reloadSignal: $ = 0,
  catalogOptions: O,
  contentMode: j = "preview",
  notificationMode: B = "toast",
  detailLayer: N = "default",
  className: K = ""
}) {
  const S = Un(), { labels: E, visibility: te } = Mt(), fe = JSON.stringify(m || []), W = ie(
    () => Cr(m),
    [fe]
  ), C = JSON.stringify({ initialFilters: s, normalizedAllowedKinds: W }), ne = ie(
    () => kr(s, W),
    [C]
  ), [R, J] = v(ne), [F, G] = v(
    null
  ), [x, T] = v("assets"), [oe, we] = v(yt), be = _n(
    oe.webContentImportEnabled,
    W
  ), [z, h] = v(pe), [A, I] = v(null), [le, ye] = v(null), [Z, ce] = v(null), [ge, ke] = v(0), [Ce, at] = v(!0), [qe, je] = v(!1), [Rt, Ee] = v(null), [xt, Ke] = v(!1), [_t, st] = v(
    null
  ), [zt, it] = v(!0), [ot, re] = v(""), [lt, Q] = v(""), [Ft, Vt] = v(0), ae = Y(0), ct = Y(null), de = Y(ne), ue = Y("assets"), Ot = JSON.stringify({
    selectedAssetIDs: c,
    selectedAssetKeys: p
  }), qt = ie(
    () => /* @__PURE__ */ new Set([
      ...p || [],
      ...(c || []).map((o) => `asset:${o}`)
    ]),
    [Ot]
  ), jt = JSON.stringify({ usedAssetIDs: g, usedAssetKeys: l }), Kt = ie(
    () => /* @__PURE__ */ new Set([
      ...l || [],
      ...(g || []).map((o) => `asset:${o}`)
    ]),
    [jt]
  );
  P(() => {
    ae.current += 1, J(ne), de.current = ne, G(null), T("assets"), ue.current = "assets", we(yt), h(pe), I(null), ye(null), ce(null), ke(0), je(!1), Ee(null), Ke(!1), st(null), re(""), Q("");
  }, [S, ne, n, e]), P(() => {
    let o = !0;
    return it(!0), kn(e, O, S).then((w) => {
      o && (we(w), J((M) => {
        const me = Nr(
          M,
          w,
          W,
          y
        );
        return F || (de.current = me), me;
      }));
    }).catch((w) => {
      o && re(q(w, "加载资产筛选项失败"));
    }).finally(() => {
      o && it(!1);
    }), () => {
      o = !1;
    };
  }, [
    O,
    y,
    W,
    S,
    e
  ]);
  const Le = ee(
    async (o) => {
      const w = ++ae.current;
      at(!0), re("");
      try {
        const M = await Cn({
          teamID: e,
          scopeProjectID: n,
          filters: R,
          view: x,
          contentMode: j,
          page: o,
          pageSize: 24,
          collectionID: F?.id,
          excludeCollections: u,
          requestScopeKey: S
        });
        w === ae.current && h(M);
      } catch (M) {
        w === ae.current && re(q(M, "加载资产失败"));
      } finally {
        w === ae.current && at(!1);
      }
    },
    [
      F?.id,
      j,
      u,
      R,
      S,
      n,
      e,
      x
    ]
  );
  P(() => {
    Le(1);
  }, [Le, $, Ft]);
  function Pt(o) {
    Q(""), o.sourceType === "official" && x !== "assets" && (T("assets"), ue.current = "assets"), J(o), F || (de.current = o), h((w) => ({ ...w, page: 1 }));
  }
  function Ne() {
    Q(""), Vt((o) => o + 1);
  }
  function Ut(o) {
    if (o.kind !== "collection") {
      I(o);
      return;
    }
    de.current = R, ue.current = x, G(o), J({
      ...Ae,
      kind: R.kind === "collection" ? W.length === 1 ? W[0] : "" : R.kind
    }), h(pe), I(null), re(""), Q("");
  }
  function Bt() {
    ae.current += 1, G(null), J(de.current), T(ue.current), h(pe), I(null), re(""), Q("");
  }
  function Wt(o) {
    o === x || ge || (ae.current += 1, T(o), F || (ue.current = o), h(pe), I(null), ye(null), ce(null), re(""), Q(""));
  }
  function se(o, w) {
    if (B === "toast") {
      Nt[o](w);
      return;
    }
    Q(o === "success" ? "" : w);
  }
  async function Gt() {
    if (!Z || ge) return;
    const o = Z.id;
    Q(""), ke(o);
    try {
      await Dn({ teamID: e, assetID: o }), ce(null), A?.libraryType === "asset" && A.id === o && I(null), V?.(o), se("success", "资产已移入回收站"), Ne();
    } catch (w) {
      se("error", q(w, "删除资产失败"));
    } finally {
      ke(0);
    }
  }
  async function Ht(o) {
    if (!ge) {
      Q(""), ke(o.id);
      try {
        const w = await In({ teamID: e, assetID: o.id });
        D?.(w), se("success", "资产已恢复"), Ne();
      } catch (w) {
        se("error", q(w, "恢复资产失败"));
      } finally {
        ke(0);
      }
    }
  }
  async function Jt(o) {
    const w = Array.from(o.target.files || []);
    if (o.target.value = "", !(!L || w.length === 0 || qe)) {
      Q(""), je(!0), Ee(null);
      try {
        const M = await L(w, {
          onProgress: Ee
        });
        if (M.length === 0)
          throw new Error("上传完成，但没有生成可用资产");
        M.forEach((Me) => D?.(Me));
        const me = {
          ...Ae,
          sourceType: "upload",
          canvasID: R.canvasID || r,
          kind: W.length === 1 ? W[0] : ""
        };
        ae.current += 1, G(null), T("assets"), ue.current = "assets", J(me), de.current = me, h(pe), I(null), re(""), se("success", `已上传 ${M.length} 项资产`);
      } catch (M) {
        se("error", q(M, "上传资产失败"));
      } finally {
        je(!1), Ee(null);
      }
    }
  }
  function Xt(o, w, M) {
    o.forEach((Be) => D?.(Be));
    const me = new Set(o.map((Be) => Be.kind)), Me = {
      ...Ae,
      sourceType: "import",
      canvasID: R.canvasID || r,
      kind: me.size === 1 && o[0]?.kind || ""
    };
    ae.current += 1, G(null), T("assets"), ue.current = "assets", J(Me), de.current = Me, h(pe), I(null), re("");
    const Ue = M.successCount + M.skippedCount;
    if (M.failedCount > 0) {
      se(
        "warning",
        `已导入 ${Ue} 项，${M.failedCount} 项失败`
      );
      return;
    }
    if (w.length > 0) {
      se(
        "warning",
        `已导入 ${Ue} 项，部分媒体保留原地址`
      );
      return;
    }
    se("success", `已导入 ${Ue} 项内容`);
  }
  const dt = lt ? /* @__PURE__ */ t("p", { className: "wb-asset-picker-message", role: "alert", children: lt }) : null, Pe = R.kind && R.kind !== "collection" ? $e(R.kind) : "", Zt = (F || u) && Pe ? Pe : "结果";
  return /* @__PURE__ */ a("section", { className: `wb-asset-browser ${K}`.trim(), children: [
    /* @__PURE__ */ a("header", { className: "wb-asset-browser-head", children: [
      /* @__PURE__ */ t(
        br,
        {
          filters: R,
          options: oe,
          scopeProjectID: n,
          sourceLabels: E,
          sourceVisibility: te,
          allowedKinds: W,
          includeOfficial: y,
          view: x,
          collectionName: F?.name,
          onCollectionBack: F ? Bt : void 0,
          onChange: Pt,
          onViewChange: Wt
        }
      ),
      /* @__PURE__ */ a("div", { className: "wb-asset-browser-actions", children: [
        /* @__PURE__ */ t("span", { children: Ce ? "正在加载" : `${z.total} 项${Zt}` }),
        /* @__PURE__ */ t(
          H,
          {
            label: R.sourceType === "official" ? "刷新官方素材" : "刷新资产",
            children: /* @__PURE__ */ a("button", { type: "button", onClick: Ne, children: [
              /* @__PURE__ */ t(on, { className: Ce ? "is-spinning" : "" }),
              /* @__PURE__ */ t("span", { className: "sr-only", children: R.sourceType === "official" ? "刷新官方素材" : "刷新资产" })
            ] })
          }
        ),
        !F && L ? /* @__PURE__ */ a(Se, { children: [
          /* @__PURE__ */ t(
            gr,
            {
              uploading: qe,
              progress: Rt,
              onClick: () => ct.current?.click()
            }
          ),
          /* @__PURE__ */ t(
            "input",
            {
              ref: ct,
              type: "file",
              hidden: !0,
              multiple: !0,
              accept: _,
              onChange: Jt
            }
          )
        ] }) : null,
        F ? null : i,
        !F && be ? /* @__PURE__ */ t(
          or,
          {
            disabled: qe,
            task: _t,
            onClick: () => Ke(!0)
          }
        ) : null
      ] })
    ] }),
    Z ? null : dt,
    /* @__PURE__ */ t("div", { className: "wb-asset-browser-body", children: Ce && z.items.length === 0 ? /* @__PURE__ */ t(He, { icon: /* @__PURE__ */ t(U, { className: "is-spinning" }) }) : ot ? /* @__PURE__ */ t(He, { text: ot, error: !0 }) : z.items.length === 0 ? /* @__PURE__ */ t(
      He,
      {
        icon: x === "trash" ? /* @__PURE__ */ t(Ct, {}) : /* @__PURE__ */ t(ln, {}),
        text: zt ? "正在读取资产配置" : x === "trash" ? "回收站为空" : F ? "集合内暂无符合条件的资产" : R.sourceType === "official" ? "当前分类暂无官方素材" : "暂无符合条件的资产"
      }
    ) : /* @__PURE__ */ t("div", { className: "wb-asset-grid", children: z.items.map((o) => {
      const w = Nn(o);
      return /* @__PURE__ */ t(
        Bn,
        {
          asset: o,
          collectionMemberLabel: Pe || "素材",
          sourceLabels: E,
          view: x,
          selectable: o.kind !== "collection" && d && x === "assets",
          selected: x === "assets" && qt.has(w),
          used: x === "assets" && Kt.has(w),
          busy: ge === o.id,
          readOnly: o.libraryType === "material",
          onOpen: Ut,
          onRename: ye,
          onDelete: x === "assets" ? ce : void 0,
          onRestore: x === "trash" ? Ht : void 0,
          onSelect: b
        },
        w
      );
    }) }) }),
    z.total > z.pageSize ? /* @__PURE__ */ a("footer", { className: "wb-asset-pagination", children: [
      /* @__PURE__ */ t(H, { label: "上一页", children: /* @__PURE__ */ t(
        "button",
        {
          type: "button",
          disabled: z.page <= 1 || Ce,
          onClick: () => {
            Le(z.page - 1);
          },
          children: /* @__PURE__ */ t(cn, {})
        }
      ) }),
      /* @__PURE__ */ a("span", { children: [
        z.page,
        " / ",
        Math.max(1, Math.ceil(z.total / z.pageSize))
      ] }),
      /* @__PURE__ */ t(H, { label: "下一页", children: /* @__PURE__ */ t(
        "button",
        {
          type: "button",
          disabled: !z.hasMore || Ce,
          onClick: () => {
            Le(z.page + 1);
          },
          children: /* @__PURE__ */ t(dn, {})
        }
      ) })
    ] }) : null,
    A?.libraryType === "asset" ? /* @__PURE__ */ t(
      Xn,
      {
        teamID: e,
        assetID: A.id,
        selectable: d && x === "assets",
        notificationMode: B,
        layer: N,
        onClose: () => I(null),
        onSelect: b ? (o) => {
          I(null), b(o);
        } : void 0,
        onContinue: f ? (o) => {
          I(null), f(o);
        } : void 0,
        canContinue: k,
        onAssetChanged: (o) => {
          Ne(), D?.(o);
        }
      }
    ) : null,
    A?.libraryType === "material" ? /* @__PURE__ */ t(
      nr,
      {
        teamID: e,
        material: A,
        selectable: d && x === "assets",
        layer: N,
        onClose: () => I(null),
        onSelect: b ? (o) => {
          I(null), b(o);
        } : void 0
      }
    ) : null,
    /* @__PURE__ */ t(
      Lt,
      {
        teamID: e,
        asset: le,
        onClose: () => ye(null),
        onRenamed: (o) => {
          h((w) => ({
            ...w,
            items: w.items.map(
              (M) => M.id === o.id ? o : M
            )
          })), D?.(o), Ne();
        }
      }
    ),
    be ? /* @__PURE__ */ t(
      pr,
      {
        open: xt,
        teamID: e,
        projectID: n,
        canvasID: R.canvasID || r,
        platforms: oe.webContentImportPlatforms,
        maxItems: oe.webContentImportMaxItems,
        onClose: () => Ke(!1),
        onImported: Xt,
        onTaskChange: st
      }
    ) : null,
    /* @__PURE__ */ t(
      wr,
      {
        open: !!Z,
        layerZIndex: zn,
        onOpenChange: (o) => {
          !o && !ge && ce(null);
        },
        title: "移入回收站？",
        desc: Z?.kind === "collection" ? `“${Z.name}”及集合内素材将移入回收站，你可以稍后恢复。` : `“${Z?.name || "该资产"}”将从资产列表移除，你可以稍后在回收站中恢复。`,
        confirmText: "移入回收站",
        destructive: !0,
        isLoading: !!ge,
        handleConfirm: () => {
          Gt();
        },
        children: dt
      }
    )
  ] });
}
function He({
  icon: e,
  text: n = "",
  error: r = !1
}) {
  return /* @__PURE__ */ a("div", { className: `wb-asset-state ${r ? "is-error" : ""}`.trim(), children: [
    e,
    n ? /* @__PURE__ */ t("p", { children: n }) : null
  ] });
}
function kr(e, n) {
  const r = { ...Ae, ...e || {} };
  return n.length > 0 && !n.includes(r.kind) && (r.kind = n[0]), r.projectID && (r.sourceType = "project", r.sourceID = r.projectID), r.sourceType !== "project" && (r.projectID = 0, r.assetCateID = 0, r.nodeKey = "", r.role = ""), r;
}
function Cr(e) {
  const n = $t.filter(
    (s) => s.key !== "collection"
  ), r = n.map((s) => s.key).filter((s) => e?.includes(s));
  return r.length === n.length ? [] : r;
}
function Nr(e, n, r, s) {
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
  ), c = e.kind && u.has(e.kind) && (r.length === 0 || r.includes(e.kind)) ? e.kind : d, p = new Set(
    It(n.materialLibrary, c).map(
      (g) => g.id
    )
  );
  return {
    ...e,
    kind: c,
    materialCateID: p.has(e.materialCateID) ? e.materialCateID : 0
  };
}
export {
  zr as A,
  gr as a,
  Xn as b
};
