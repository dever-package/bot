import { c as U, j as a, a as i, F as x } from "./createLucideIcon-fWv1XcFy.js";
import { L as N } from "./vanilla-BSPxkY5-.js";
import { C as I } from "./check-B_RB4H2g.js";
import { F as Y } from "./file-text-GWInsYzS.js";
import { P as K } from "./pencil-DsS_UhAq.js";
import { R as P } from "./rotate-ccw-BOBeflIt.js";
import { b as p, c as C, i as T, d as Z, S as ee, l as ae } from "./runtime-entry-ClkZDmNs.js";
import { g as te, r as ne, l as se, p as re, h as ie, S as oe, A as le, i as ce, D as de, j as ue, k as me, n as pe, o as he, q as be, t as fe, u as ye, v as we, w as ve, x as ge } from "./storyboard-grid-view-BldHSQpc.js";
import { X as ke } from "./in-flight-request-CXY2yBH9.js";
import { c as Ne, k, l as Ae } from "./site-config-DrnclGFw.js";
const Me = [
  [
    "path",
    {
      d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
      key: "18887p"
    }
  ],
  ["path", { d: "M12 11h.01", key: "z322tv" }],
  ["path", { d: "M16 11h.01", key: "xkw8gn" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }]
], Le = U("message-square-more", Me);
function Ce({
  teamID: e,
  asset: s,
  onClose: o,
  onRenamed: m
}) {
  const [h, f] = p(""), [u, w] = p(!1), [A, g] = p("");
  C(() => {
    s && (f(s.name), w(!1), g(""));
  }, [s]), C(() => {
    if (!s) return;
    const d = (n) => {
      n.key === "Escape" && (n.preventDefault(), n.stopImmediatePropagation(), u || o());
    };
    return window.addEventListener("keydown", d, !0), () => window.removeEventListener("keydown", d, !0);
  }, [s, o, u]);
  async function c(d) {
    d.preventDefault();
    const n = h.trim();
    if (!(!s || !n || u)) {
      w(!0), g("");
      try {
        const b = await ne({
          teamID: e,
          assetID: s.id,
          name: n
        });
        m(b), o();
      } catch (b) {
        g(k(b, "修改资产标题失败"));
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
            /* @__PURE__ */ a(te, { label: "关闭", children: /* @__PURE__ */ a("button", { type: "button", disabled: u, onClick: o, children: /* @__PURE__ */ a(ke, { "aria-hidden": "true" }) }) })
          ] }),
          /* @__PURE__ */ i("label", { children: [
            /* @__PURE__ */ a("span", { children: "资产标题" }),
            /* @__PURE__ */ a(
              "input",
              {
                autoFocus: !0,
                value: h,
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
                disabled: u || !h.trim(),
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
function Ve() {
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
const Ee = ae(
  () => import("./space-content-view-TucLzffi.js").then((e) => e.W).then((e) => ({
    default: e.CanvasNodeContentView
  }))
);
function Ie({
  teamID: e,
  assetID: s,
  selectable: o = !1,
  onClose: m,
  onSelect: h,
  onContinue: f,
  canContinue: u,
  onAssetChanged: w,
  layer: A = "default"
}) {
  const g = Ve(), [c, d] = p(null), [n, b] = p(
    null
  ), [W, R] = p(!0), [v, M] = p(0), [V, $] = p(!1), [E, j] = p(!1), [D, y] = p(""), [_, S] = p(""), z = Z(async () => {
    R(!0), y(""), S("");
    try {
      const t = H(await se(e, s));
      d(t), b(t.asset.version);
    } catch (t) {
      y(k(t, "加载资产详情失败"));
    } finally {
      R(!1);
    }
  }, [s, e]);
  C(() => {
    z();
  }, [z]), C(() => {
    const t = (l) => {
      l.key !== "Escape" || E || (l.preventDefault(), l.stopImmediatePropagation(), m());
    };
    return window.addEventListener("keydown", t, !0), () => window.removeEventListener("keydown", t, !0);
  }, [m, E]);
  async function q(t) {
    if (!(v || t.id === n?.id)) {
      if (t.id === c?.asset.versionID && c.asset.version) {
        y(""), b(c.asset.version);
        return;
      }
      M(t.id), y("");
      try {
        b(
          await we({ teamID: e, assetID: s, versionID: t.id })
        );
      } catch (l) {
        y(k(l, "加载资产版本失败"));
      } finally {
        M(0);
      }
    }
  }
  async function F() {
    if (!c || !c.hasMore || v) return;
    const t = Math.floor(c.versions.length / 20) + 1;
    M(-1), S("");
    try {
      const l = await ve({
        teamID: e,
        assetID: s,
        page: t,
        pageSize: 20
      });
      d(
        (L) => L && {
          ...L,
          versions: O([...L.versions, ...l.items]),
          versionTotal: l.total,
          hasMore: l.hasMore
        }
      );
    } catch (l) {
      S(k(l, "加载资产版本失败"));
    } finally {
      M(0);
    }
  }
  async function X() {
    if (!(!c || !n || V)) {
      $(!0), y("");
      try {
        const t = await ye({
          teamID: e,
          assetID: s,
          versionID: n.id
        }), l = H({ ...c, asset: t });
        d(l), b(t.version), w?.(t);
      } catch (t) {
        y(k(t, "设置当前版本失败"));
      } finally {
        $(!1);
      }
    }
  }
  const r = c?.asset, B = r?.status === "deleted", J = !!(r && n && r.versionID === n.id), G = T(
    () => re(n?.content),
    [n?.content]
  ), Q = T(
    () => ie(n?.content, "storyboard"),
    [n?.content]
  );
  return /* @__PURE__ */ i(
    fe,
    {
      ariaLabel: `${r?.name || "资产"}详情`,
      onRequestClose: m,
      layer: A,
      header: /* @__PURE__ */ a(
        de,
        {
          icon: r ? /* @__PURE__ */ a(be, { kind: r.kind }) : /* @__PURE__ */ a(Y, { size: 16 }),
          title: r?.name || "资产详情",
          subtitle: r ? `${ze(r, g)} · ${pe(r.kind)} · ${he(r.role)}` : "",
          versionSelect: c && r && n ? /* @__PURE__ */ a(
            me,
            {
              options: c.versions.map((t) => ({
                id: t.id,
                version: t.version,
                updatedAt: t.updatedAt || t.createdAt,
                value: t
              })),
              currentVersionId: r.versionID,
              selectedVersionId: n.id,
              total: c.versionTotal,
              hasMore: c.hasMore,
              loading: v > 0,
              loadingMore: v === -1,
              error: _,
              disabled: V,
              onSelect: (t) => {
                q(t);
              },
              onLoadMore: () => {
                F();
              },
              onRetry: () => {
                F();
              }
            }
          ) : void 0,
          state: B ? /* @__PURE__ */ a("span", { className: "wb-detail-state", children: "回收站" }) : v > 0 ? /* @__PURE__ */ i("span", { className: "wb-detail-state is-saving", children: [
            /* @__PURE__ */ a(N, { size: 12, className: "wb-detail-spin" }),
            "读取中"
          ] }) : /* @__PURE__ */ a("span", { className: "wb-detail-state", children: "只读预览" }),
          updatedAt: ue(
            n?.updatedAt || n?.createdAt
          ),
          actions: r && n && !B ? /* @__PURE__ */ i(x, { children: [
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
            J ? /* @__PURE__ */ a(
              Se,
              {
                asset: r,
                selectable: o,
                onSelect: h,
                onContinue: f,
                canContinue: u
              }
            ) : /* @__PURE__ */ a(
              De,
              {
                currentVersion: r.version,
                loading: !!v,
                saving: V,
                onReturn: (t) => {
                  q(t);
                },
                onMakeCurrent: () => {
                  X();
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
        ] }) : !r || !n ? /* @__PURE__ */ i("div", { className: "wb-detail-content-state is-error", children: [
          /* @__PURE__ */ a("span", { children: D || "资产不存在" }),
          /* @__PURE__ */ i("button", { type: "button", onClick: () => {
            z();
          }, children: [
            /* @__PURE__ */ a(P, { size: 13 }),
            "重试"
          ] })
        ] }) : /* @__PURE__ */ i("div", { className: `wb-detail-readonly-content is-${r.kind}`, children: [
          D ? /* @__PURE__ */ a("p", { className: "wb-detail-error-banner", children: D }) : null,
          G ? /* @__PURE__ */ a(oe, { grid: G, variant: "detail" }) : Q ? /* @__PURE__ */ a(
            ee,
            {
              fallback: /* @__PURE__ */ i("div", { className: "wb-detail-content-state", "aria-busy": "true", children: [
                /* @__PURE__ */ a(N, { size: 18, className: "wb-detail-spin" }),
                /* @__PURE__ */ a("span", { children: "正在准备分镜预览" })
              ] }),
              children: /* @__PURE__ */ a(
                Ee,
                {
                  output: n.content,
                  fallback: n.summary || r.summary,
                  emptyText: "该版本暂无可预览内容",
                  className: "wb-asset-preview-content",
                  markdownClassName: "wb-asset-detail-prose",
                  richClassName: "wb-asset-detail-prose",
                  mediaLayout: "detail"
                }
              )
            }
          ) : /* @__PURE__ */ a(
            le,
            {
              kind: r.kind,
              content: n.content,
              summary: n.summary || r.summary,
              prompt: ce(n)
            },
            n.id
          )
        ] }) }) }),
        /* @__PURE__ */ a(
          Ce,
          {
            teamID: e,
            asset: E && r || null,
            onClose: () => j(!1),
            onRenamed: (t) => {
              d(
                (l) => l && { ...l, asset: t }
              ), w?.(t);
            }
          }
        )
      ]
    }
  );
}
function De({
  currentVersion: e,
  loading: s,
  saving: o,
  onReturn: m,
  onMakeCurrent: h
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
        onClick: h,
        children: [
          o ? /* @__PURE__ */ a(N, { size: 13, className: "wb-detail-spin" }) : /* @__PURE__ */ a(I, { size: 13 }),
          /* @__PURE__ */ a("span", { children: o ? "设置中" : "设为当前版本" })
        ]
      }
    )
  ] });
}
function Se({
  asset: e,
  selectable: s,
  onSelect: o,
  onContinue: m,
  canContinue: h
}) {
  return /* @__PURE__ */ i(x, { children: [
    m && Te(e) && (h?.(e) ?? !0) ? /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: "wb-detail-command",
        onClick: () => m(e),
        children: [
          e.sourceType === "dialogue" ? /* @__PURE__ */ a(Le, { size: 14 }) : /* @__PURE__ */ a(P, { size: 14 }),
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
          /* @__PURE__ */ a(I, { size: 14 }),
          /* @__PURE__ */ a("span", { children: "使用" })
        ]
      }
    ) : null
  ] });
}
function H(e) {
  const s = O(
    e.asset.version ? [e.asset.version, ...e.versions] : e.versions
  );
  return {
    ...e,
    versions: s,
    versionTotal: Math.max(e.versionTotal, s.length)
  };
}
function O(e) {
  return Array.from(
    new Map(e.map((s) => [s.id, s])).values()
  );
}
function ze(e, s) {
  const o = ge(e.sourceType, s);
  return e.sourceName && e.sourceName !== o ? `${o} / ${e.sourceName}` : o;
}
function Te(e) {
  return e.role === "material" && (e.sourceType === "tool" || e.sourceType === "dialogue");
}
export {
  Ie as A,
  Ce as a,
  Ve as u
};
