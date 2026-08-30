import { a as r, j as e, F as L } from "./preloadable-Bomi5PEU.js";
import { h as T, a, d as R, b as W } from "./_commonjsHelpers-61wyk6v6.js";
import { r as X, n as $, e as G, s as H, X as P } from "./vendor-icons-DwjYEojZ.js";
import { A as q } from "./clipboard-BLzb9wLn.js";
import { a as B } from "./asset-page-B8_TS_uu.js";
await window.DeverFront?.ensureCompat?.(["@/components/confirm-dialog", "@/components/ui/input"]);
const w = window.DeverFront?.sdk?.getCompatModule("@/components/confirm-dialog");
if (!w || Object.keys(w).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/confirm-dialog");
const J = w.ConfirmDialog, y = window.DeverFront?.sdk?.getCompatModule("@/components/ui/input");
if (!y || Object.keys(y).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/input");
const K = y.Input, D = 128;
function te({
  teamID: t,
  resetKey: c,
  defaultName: l,
  save: S,
  confirmDescription: j,
  onSaved: z,
  appearance: C = "message",
  disabled: p = !1,
  disabledLabel: E = "当前内容暂时不能保存",
  className: I = ""
}) {
  const N = T(), [F, m] = a(!1), [s, h] = a(!1), [o, k] = a(0), [O, b] = a(!1), [g, v] = a(
    () => f(l)
  ), [u, i] = a(""), x = R(l);
  x.current = l, W(() => {
    m(!1), h(!1), k(0), b(!1), v(f(x.current)), i("");
  }, [c]);
  const A = p ? E : u || (o ? "查看已保存资产" : "保存到资产");
  function _(n) {
    if (n.preventDefault(), n.stopPropagation(), !(p || s)) {
      if (o) {
        b(!0);
        return;
      }
      v(f(x.current)), i(""), m(!0);
    }
  }
  async function M() {
    const n = f(g);
    if (!n) {
      i("请输入资产标题");
      return;
    }
    h(!0), i("");
    try {
      const d = await S(n);
      k(d), m(!1), z?.(d);
    } catch (d) {
      i(
        d instanceof Error ? d.message : "保存资产失败"
      );
    } finally {
      h(!1);
    }
  }
  return /* @__PURE__ */ r(L, { children: [
    /* @__PURE__ */ e(q, { label: A, children: /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: `${Q(C)} ${I}`.trim(),
        disabled: p || s,
        "aria-label": A,
        onClick: _,
        children: [
          s ? /* @__PURE__ */ e(X, { className: "animate-spin" }) : o ? /* @__PURE__ */ e($, {}) : /* @__PURE__ */ e(G, {}),
          C === "toolbar" ? /* @__PURE__ */ e("span", { children: s ? "保存中" : o ? "已保存" : "保存资产" }) : null
        ]
      }
    ) }),
    /* @__PURE__ */ e(
      J,
      {
        open: F,
        onOpenChange: (n) => {
          s || m(n);
        },
        title: "保存到资产",
        desc: j,
        confirmText: "保存",
        disabled: !g.trim(),
        handleConfirm: () => {
          M();
        },
        isLoading: s,
        children: /* @__PURE__ */ r("div", { className: "space-y-2", children: [
          /* @__PURE__ */ e(
            "label",
            {
              htmlFor: N,
              className: "text-sm font-medium text-foreground",
              children: "资产标题"
            }
          ),
          /* @__PURE__ */ e(
            K,
            {
              id: N,
              value: g,
              maxLength: D,
              placeholder: "请输入资产标题",
              autoFocus: !0,
              onChange: (n) => {
                v(n.target.value), u && i("");
              }
            }
          ),
          u ? /* @__PURE__ */ e("p", { className: "m-0 text-sm text-red-600", children: u }) : null
        ] })
      }
    ),
    O && o ? /* @__PURE__ */ e(
      B,
      {
        teamID: t,
        assetID: o,
        onClose: () => b(!1)
      }
    ) : null
  ] });
}
function f(t) {
  return String(t || "").trim().slice(0, D);
}
function Q(t) {
  return t === "toolbar" ? "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-[var(--body-work-line)] bg-[var(--body-work-surface-raised)] px-2.5 text-xs font-medium text-[var(--body-work-text)] transition-colors hover:bg-[var(--body-work-active)] disabled:cursor-not-allowed disabled:bg-[var(--body-work-active)] disabled:text-[var(--body-work-muted)] disabled:opacity-100 [&>svg]:size-3.5" : t === "media" ? "inline-flex size-8 items-center justify-center rounded-md border border-white/70 bg-white/95 text-[#365447] shadow-sm transition hover:bg-white disabled:opacity-60 [&>svg]:size-4" : t === "inspector" ? "inline-flex size-9 items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-60 [&>svg]:size-4" : "agent-chat-message-action";
}
function ne({
  icon: t,
  title: c
}) {
  return /* @__PURE__ */ e("div", { className: "flex h-full min-h-[280px] items-center justify-center bg-white px-6 text-center", children: /* @__PURE__ */ r("div", { children: [
    /* @__PURE__ */ e(t, { className: "mx-auto mb-3 size-6 text-[#8b9691]" }),
    /* @__PURE__ */ e("p", { className: "m-0 text-sm font-medium text-[#4f5a55]", children: c })
  ] }) });
}
function re({
  asset: t,
  action: c,
  onCancel: l
}) {
  return /* @__PURE__ */ r("div", { className: "flex min-h-10 shrink-0 items-center justify-between gap-3 border-b border-[#dce5e0] bg-[#f0f5f2] px-4 py-2 text-xs text-[#365447] md:px-6", children: [
    /* @__PURE__ */ r("span", { className: "flex min-w-0 items-center gap-2", children: [
      /* @__PURE__ */ e(H, { className: "size-3.5 shrink-0", "aria-hidden": "true" }),
      /* @__PURE__ */ r("span", { className: "min-w-0 truncate", children: [
        c,
        "“",
        t.name,
        "”，保存后将新增版本"
      ] })
    ] }),
    /* @__PURE__ */ e(
      "button",
      {
        type: "button",
        className: "inline-flex size-7 shrink-0 items-center justify-center rounded-md border-0 bg-transparent text-[#5d6c64] hover:bg-[#dfe9e4]",
        title: "取消继续编辑",
        "aria-label": "取消继续编辑",
        onClick: l,
        children: /* @__PURE__ */ e(P, { className: "size-3.5" })
      }
    )
  ] });
}
export {
  re as A,
  te as S,
  ne as W
};
