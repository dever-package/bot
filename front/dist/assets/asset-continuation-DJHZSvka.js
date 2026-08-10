import { j as r, a as e, F } from "./_commonjsHelpers-CTFd9u1x.js";
import { r as T, l as o, u as R, o as _ } from "./react-C7Xtl8sB.js";
import { L as $, c as M, S as W, d as X, X as G } from "./vendor-icons-Cc7Kl3It.js";
import { m as H } from "./confirm-dialog-D2pOx0vH.js";
import { m as P } from "./input-DLnnH2-7.js";
import { A as q } from "./clipboard-B77WuM2Y.js";
import { A as B } from "./asset-detail-dialog-w-UaqteB.js";
const J = H.ConfirmDialog, K = P.Input, C = 128;
function re({
  teamID: t,
  resetKey: l,
  defaultName: c,
  save: k,
  confirmDescription: S,
  onSaved: D,
  appearance: y = "message",
  disabled: b = !1,
  disabledLabel: z = "当前内容暂时不能保存",
  className: I = ""
}) {
  const N = T(), [j, d] = o(!1), [n, h] = o(!1), [a, w] = o(0), [E, p] = o(!1), [g, x] = o(
    () => u(c)
  ), [f, i] = o(""), v = R(c);
  v.current = c, _(() => {
    d(!1), h(!1), w(0), p(!1), x(u(v.current)), i("");
  }, [l]);
  const A = b ? z : f || (a ? "查看已保存资产" : "保存到资产");
  function L(s) {
    if (s.preventDefault(), s.stopPropagation(), !(b || n)) {
      if (a) {
        p(!0);
        return;
      }
      x(u(v.current)), i(""), d(!0);
    }
  }
  async function O() {
    const s = u(g);
    if (!s) {
      i("请输入资产标题");
      return;
    }
    h(!0), i("");
    try {
      const m = await k(s);
      w(m), d(!1), D?.(m);
    } catch (m) {
      i(
        m instanceof Error ? m.message : "保存资产失败"
      );
    } finally {
      h(!1);
    }
  }
  return /* @__PURE__ */ r(F, { children: [
    /* @__PURE__ */ e(q, { label: A, children: /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: `${Q(y)} ${I}`.trim(),
        disabled: b || n,
        "aria-label": A,
        onClick: L,
        children: [
          n ? /* @__PURE__ */ e($, { className: "animate-spin" }) : a ? /* @__PURE__ */ e(M, {}) : /* @__PURE__ */ e(W, {}),
          y === "toolbar" ? /* @__PURE__ */ e("span", { children: n ? "保存中" : a ? "已保存" : "保存资产" }) : null
        ]
      }
    ) }),
    /* @__PURE__ */ e(
      J,
      {
        open: j,
        onOpenChange: (s) => {
          n || d(s);
        },
        title: "保存到资产",
        desc: S,
        confirmText: "保存",
        disabled: !g.trim(),
        handleConfirm: () => {
          O();
        },
        isLoading: n,
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
              maxLength: C,
              placeholder: "请输入资产标题",
              autoFocus: !0,
              onChange: (s) => {
                x(s.target.value), f && i("");
              }
            }
          ),
          f ? /* @__PURE__ */ e("p", { className: "m-0 text-sm text-red-600", children: f }) : null
        ] })
      }
    ),
    E && a ? /* @__PURE__ */ e(
      B,
      {
        teamID: t,
        assetID: a,
        onClose: () => p(!1)
      }
    ) : null
  ] });
}
function u(t) {
  return String(t || "").trim().slice(0, C);
}
function Q(t) {
  return t === "toolbar" ? "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-[var(--body-work-line)] bg-[var(--body-work-surface-raised)] px-2.5 text-xs font-medium text-[var(--body-work-text)] transition-colors hover:bg-[var(--body-work-active)] disabled:cursor-not-allowed disabled:bg-[var(--body-work-active)] disabled:text-[var(--body-work-muted)] disabled:opacity-100 [&>svg]:size-3.5" : t === "media" ? "inline-flex size-8 items-center justify-center rounded-md border border-white/70 bg-white/95 text-[#365447] shadow-sm transition hover:bg-white disabled:opacity-60 [&>svg]:size-4" : t === "inspector" ? "inline-flex size-9 items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-60 [&>svg]:size-4" : "agent-chat-message-action";
}
function ne({
  icon: t,
  title: l
}) {
  return /* @__PURE__ */ e("div", { className: "flex h-full min-h-[280px] items-center justify-center bg-white px-6 text-center", children: /* @__PURE__ */ r("div", { children: [
    /* @__PURE__ */ e(t, { className: "mx-auto mb-3 size-6 text-[#8b9691]" }),
    /* @__PURE__ */ e("p", { className: "m-0 text-sm font-medium text-[#4f5a55]", children: l })
  ] }) });
}
function ae({
  asset: t,
  action: l,
  onCancel: c
}) {
  return /* @__PURE__ */ r("div", { className: "flex min-h-10 shrink-0 items-center justify-between gap-3 border-b border-[#dce5e0] bg-[#f0f5f2] px-4 py-2 text-xs text-[#365447] md:px-6", children: [
    /* @__PURE__ */ r("span", { className: "flex min-w-0 items-center gap-2", children: [
      /* @__PURE__ */ e(X, { className: "size-3.5 shrink-0", "aria-hidden": "true" }),
      /* @__PURE__ */ r("span", { className: "min-w-0 truncate", children: [
        l,
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
        onClick: c,
        children: /* @__PURE__ */ e(G, { className: "size-3.5" })
      }
    )
  ] });
}
export {
  ae as A,
  re as S,
  ne as W
};
