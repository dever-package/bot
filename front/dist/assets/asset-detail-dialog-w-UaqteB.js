import { a, j as i, F as x } from "./_commonjsHelpers-CTFd9u1x.js";
import { z as K, X as Y, L as N, d as P, F as Z, H as _, c as O } from "./vendor-icons-Cc7Kl3It.js";
import { l as p, o as E, d as T, b as ee, S as ae, p as ne } from "./react-C7Xtl8sB.js";
import { B as te, r as se, l as re, p as ie, j as oe, S as le, k as ce, n as de, D as ue, o as me, q as pe, t as be, u as he, v as fe, w as ye, x as we, y as ve, z as ge, C as ke } from "./storyboard-grid-view-CJXm84yJ.js";
import { c as Ne } from "./preloadable-PCKj9Z7v.js";
import { j as k, l as Ae } from "./site-config-BVY1isir.js";
function Le({
  teamID: e,
  asset: s,
  onClose: o,
  onRenamed: m
}) {
  const [b, f] = p(""), [u, w] = p(!1), [A, g] = p("");
  E(() => {
    s && (f(s.name), w(!1), g(""));
  }, [s]), E(() => {
    if (!s) return;
    const d = (t) => {
      t.key === "Escape" && (t.preventDefault(), t.stopImmediatePropagation(), u || o());
    };
    return window.addEventListener("keydown", d, !0), () => window.removeEventListener("keydown", d, !0);
  }, [s, o, u]);
  async function c(d) {
    d.preventDefault();
    const t = b.trim();
    if (!(!s || !t || u)) {
      w(!0), g("");
      try {
        const h = await se({
          teamID: e,
          assetID: s.id,
          name: t
        });
        m(h), o();
      } catch (h) {
        g(k(h, "修改资产标题失败"));
      } finally {
        w(!1);
      }
    }
  }
  return !s || typeof document > "u" ? null : Ne(
    /* @__PURE__ */ a(
      "div",
      {
        className: "wb-asset-rename-backdrop",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "修改资产标题",
        onMouseDown: (d) => {
          d.target === d.currentTarget && !u && o();
        },
        children: /* @__PURE__ */ i("form", { className: "wb-asset-rename-dialog", onSubmit: c, children: [
          /* @__PURE__ */ i("header", { children: [
            /* @__PURE__ */ i("div", { children: [
              /* @__PURE__ */ a("span", { className: "wb-asset-rename-icon", children: /* @__PURE__ */ a(K, { "aria-hidden": "true" }) }),
              /* @__PURE__ */ i("div", { children: [
                /* @__PURE__ */ a("h2", { children: "修改资产标题" }),
                /* @__PURE__ */ a("p", { children: "只修改资产库中的显示名称。" })
              ] })
            ] }),
            /* @__PURE__ */ a(te, { label: "关闭", children: /* @__PURE__ */ a("button", { type: "button", disabled: u, onClick: o, children: /* @__PURE__ */ a(Y, { "aria-hidden": "true" }) }) })
          ] }),
          /* @__PURE__ */ i("label", { children: [
            /* @__PURE__ */ a("span", { children: "资产标题" }),
            /* @__PURE__ */ a(
              "input",
              {
                autoFocus: !0,
                value: b,
                maxLength: 128,
                disabled: u,
                placeholder: "请输入资产标题",
                onChange: (d) => f(d.target.value)
              }
            )
          ] }),
          A ? /* @__PURE__ */ a("p", { className: "wb-asset-rename-error", children: A }) : null,
          /* @__PURE__ */ i("footer", { children: [
            /* @__PURE__ */ a("button", { type: "button", disabled: u, onClick: o, children: "取消" }),
            /* @__PURE__ */ i(
              "button",
              {
                type: "submit",
                className: "is-primary",
                disabled: u || !b.trim(),
                children: [
                  u ? /* @__PURE__ */ a(N, { className: "is-spinning" }) : null,
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
function Ce() {
  const e = Ae().site.homeMenu;
  return T(
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
const Ee = ne(
  () => import("./node-detail-content-DhUE_leQ.js").then((e) => e.a4).then((e) => ({
    default: e.CanvasNodeContentView
  }))
);
function je({
  teamID: e,
  assetID: s,
  selectable: o = !1,
  onClose: m,
  onSelect: b,
  onContinue: f,
  canContinue: u,
  onAssetChanged: w,
  layer: A = "default"
}) {
  const g = Ce(), [c, d] = p(null), [t, h] = p(
    null
  ), [W, R] = p(!0), [v, L] = p(0), [M, $] = p(!1), [V, j] = p(!1), [D, y] = p(""), [X, S] = p(""), z = ee(async () => {
    R(!0), y(""), S("");
    try {
      const n = H(await re(e, s));
      d(n), h(n.asset.version);
    } catch (n) {
      y(k(n, "加载资产详情失败"));
    } finally {
      R(!1);
    }
  }, [s, e]);
  E(() => {
    z();
  }, [z]), E(() => {
    const n = (l) => {
      l.key !== "Escape" || V || (l.preventDefault(), l.stopImmediatePropagation(), m());
    };
    return window.addEventListener("keydown", n, !0), () => window.removeEventListener("keydown", n, !0);
  }, [m, V]);
  async function F(n) {
    if (!(v || n.id === t?.id)) {
      if (n.id === c?.asset.versionID && c.asset.version) {
        y(""), h(c.asset.version);
        return;
      }
      L(n.id), y("");
      try {
        h(
          await ve({ teamID: e, assetID: s, versionID: n.id })
        );
      } catch (l) {
        y(k(l, "加载资产版本失败"));
      } finally {
        L(0);
      }
    }
  }
  async function q() {
    if (!c || !c.hasMore || v) return;
    const n = Math.floor(c.versions.length / 20) + 1;
    L(-1), S("");
    try {
      const l = await ge({
        teamID: e,
        assetID: s,
        page: n,
        pageSize: 20
      });
      d(
        (C) => C && {
          ...C,
          versions: I([...C.versions, ...l.items]),
          versionTotal: l.total,
          hasMore: l.hasMore
        }
      );
    } catch (l) {
      S(k(l, "加载资产版本失败"));
    } finally {
      L(0);
    }
  }
  async function J() {
    if (!(!c || !t || M)) {
      $(!0), y("");
      try {
        const n = await we({
          teamID: e,
          assetID: s,
          versionID: t.id
        }), l = H({ ...c, asset: n });
        d(l), h(n.version), w?.(n);
      } catch (n) {
        y(k(n, "设置当前版本失败"));
      } finally {
        $(!1);
      }
    }
  }
  const r = c?.asset, B = r?.status === "deleted", Q = !!(r && t && r.versionID === t.id), G = T(
    () => ie(t?.content),
    [t?.content]
  ), U = T(
    () => oe(t?.content, "storyboard"),
    [t?.content]
  );
  return /* @__PURE__ */ i(
    ye,
    {
      ariaLabel: `${r?.name || "资产"}详情`,
      onRequestClose: m,
      layer: A,
      header: /* @__PURE__ */ a(
        ue,
        {
          icon: r ? /* @__PURE__ */ a(fe, { kind: r.kind }) : /* @__PURE__ */ a(Z, { size: 16 }),
          title: r?.name || "资产详情",
          subtitle: r ? `${De(r, g)} · ${be(r.kind)} · ${he(r.role)}` : "",
          versionSelect: c && r && t ? /* @__PURE__ */ a(
            pe,
            {
              options: c.versions.map((n) => ({
                id: n.id,
                version: n.version,
                updatedAt: n.updatedAt || n.createdAt,
                value: n
              })),
              currentVersionId: r.versionID,
              selectedVersionId: t.id,
              total: c.versionTotal,
              hasMore: c.hasMore,
              loading: v > 0,
              loadingMore: v === -1,
              error: X,
              disabled: M,
              onSelect: (n) => {
                F(n);
              },
              onLoadMore: () => {
                q();
              },
              onRetry: () => {
                q();
              }
            }
          ) : void 0,
          state: B ? /* @__PURE__ */ a("span", { className: "wb-detail-state", children: "回收站" }) : v > 0 ? /* @__PURE__ */ i("span", { className: "wb-detail-state is-saving", children: [
            /* @__PURE__ */ a(N, { size: 12, className: "wb-detail-spin" }),
            "读取中"
          ] }) : /* @__PURE__ */ a("span", { className: "wb-detail-state", children: "只读预览" }),
          updatedAt: me(
            t?.updatedAt || t?.createdAt
          ),
          actions: r && t && !B ? /* @__PURE__ */ i(x, { children: [
            /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                className: "wb-detail-command",
                onClick: () => j(!0),
                children: [
                  /* @__PURE__ */ a(K, { size: 13 }),
                  /* @__PURE__ */ a("span", { children: "修改标题" })
                ]
              }
            ),
            Q ? /* @__PURE__ */ a(
              Ve,
              {
                asset: r,
                selectable: o,
                onSelect: b,
                onContinue: f,
                canContinue: u
              }
            ) : /* @__PURE__ */ a(
              Me,
              {
                currentVersion: r.version,
                loading: !!v,
                saving: M,
                onReturn: (n) => {
                  F(n);
                },
                onMakeCurrent: () => {
                  J();
                }
              }
            )
          ] }) : void 0,
          onClose: m
        }
      ),
      children: [
        /* @__PURE__ */ a("main", { className: "wb-detail-workspace", children: /* @__PURE__ */ a("div", { className: "wb-detail-scroll", children: W ? /* @__PURE__ */ i("div", { className: "wb-detail-content-state", children: [
          /* @__PURE__ */ a(N, { size: 18, className: "wb-detail-spin" }),
          /* @__PURE__ */ a("span", { children: "正在读取资产" })
        ] }) : !r || !t ? /* @__PURE__ */ i("div", { className: "wb-detail-content-state is-error", children: [
          /* @__PURE__ */ a("span", { children: D || "资产不存在" }),
          /* @__PURE__ */ i("button", { type: "button", onClick: () => {
            z();
          }, children: [
            /* @__PURE__ */ a(P, { size: 13 }),
            "重试"
          ] })
        ] }) : /* @__PURE__ */ i("div", { className: `wb-detail-readonly-content is-${r.kind}`, children: [
          D ? /* @__PURE__ */ a("p", { className: "wb-detail-error-banner", children: D }) : null,
          G ? /* @__PURE__ */ a(le, { grid: G, variant: "detail" }) : U ? /* @__PURE__ */ a(
            ae,
            {
              fallback: /* @__PURE__ */ i("div", { className: "wb-detail-content-state", "aria-busy": "true", children: [
                /* @__PURE__ */ a(N, { size: 18, className: "wb-detail-spin" }),
                /* @__PURE__ */ a("span", { children: "正在准备分镜预览" })
              ] }),
              children: /* @__PURE__ */ a(
                Ee,
                {
                  output: t.content,
                  fallback: t.summary || r.summary,
                  emptyText: "该版本暂无可预览内容",
                  className: "wb-asset-preview-content",
                  markdownClassName: "wb-asset-detail-prose",
                  richClassName: "wb-asset-detail-prose",
                  mediaLayout: "detail"
                }
              )
            }
          ) : /* @__PURE__ */ a(
            ce,
            {
              kind: r.kind,
              content: t.content,
              summary: t.summary || r.summary,
              prompt: de(t)
            },
            t.id
          )
        ] }) }) }),
        /* @__PURE__ */ a(
          Le,
          {
            teamID: e,
            asset: V && r || null,
            onClose: () => j(!1),
            onRenamed: (n) => {
              d(
                (l) => l && { ...l, asset: n }
              ), w?.(n);
            }
          }
        )
      ]
    }
  );
}
function Me({
  currentVersion: e,
  loading: s,
  saving: o,
  onReturn: m,
  onMakeCurrent: b
}) {
  const f = s || o;
  return /* @__PURE__ */ i(x, { children: [
    e ? /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        disabled: f,
        onClick: () => m(e),
        children: [
          /* @__PURE__ */ a(P, { size: 13 }),
          /* @__PURE__ */ a("span", { children: "返回当前版本" })
        ]
      }
    ) : null,
    /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: "wb-detail-command is-primary",
        disabled: f,
        onClick: b,
        children: [
          o ? /* @__PURE__ */ a(N, { size: 13, className: "wb-detail-spin" }) : /* @__PURE__ */ a(O, { size: 13 }),
          /* @__PURE__ */ a("span", { children: o ? "设置中" : "设为当前版本" })
        ]
      }
    )
  ] });
}
function Ve({
  asset: e,
  selectable: s,
  onSelect: o,
  onContinue: m,
  canContinue: b
}) {
  return /* @__PURE__ */ i(x, { children: [
    m && Se(e) && (b?.(e) ?? !0) ? /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        onClick: () => m(e),
        children: [
          e.sourceType === "dialogue" ? /* @__PURE__ */ a(_, { size: 14 }) : /* @__PURE__ */ a(P, { size: 14 }),
          /* @__PURE__ */ a("span", { children: e.sourceType === "dialogue" ? "继续对话" : "重新生成" })
        ]
      }
    ) : null,
    s && o ? /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: "wb-detail-command is-primary",
        onClick: () => o(e),
        children: [
          /* @__PURE__ */ a(O, { size: 14 }),
          /* @__PURE__ */ a("span", { children: "使用" })
        ]
      }
    ) : null
  ] });
}
function H(e) {
  const s = I(
    e.asset.version ? [e.asset.version, ...e.versions] : e.versions
  );
  return {
    ...e,
    versions: s,
    versionTotal: Math.max(e.versionTotal, s.length)
  };
}
function I(e) {
  return Array.from(
    new Map(e.map((s) => [s.id, s])).values()
  );
}
function De(e, s) {
  const o = ke(e.sourceType, s);
  return e.sourceName && e.sourceName !== o ? `${o} / ${e.sourceName}` : o;
}
function Se(e) {
  return e.role === "material" && (e.sourceType === "tool" || e.sourceType === "dialogue");
}
export {
  je as A,
  Le as a,
  Ce as u
};
