import { a as s, j as e, F } from "./createLucideIcon-Gw0gLVQ5.js";
import { l as R, u as o, a as T, b as _ } from "./runtime-entry-CkPHMDB1.js";
import { L as $ } from "./loader-circle-3ZsHTZm7.js";
import { C as M } from "./check-_lGX5Mgn.js";
import { S as W } from "./save-C3QU3I8o.js";
import { m as X } from "./confirm-dialog-BTqZnhxN.js";
import { m as G } from "./input-CELCGXqo.js";
import { A as H } from "./clipboard-B5e8l_LF.js";
import { e as P } from "./upload-asset-api-JzPGB3fW.js";
import { R as q } from "./rotate-ccw-CYQko_-D.js";
import { X as B } from "./x-CDJG94MJ.js";
const J = X.ConfirmDialog, K = G.Input, A = 128;
function oe({
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
  const N = R(), [j, d] = o(!1), [n, p] = o(!1), [a, w] = o(0), [E, h] = o(!1), [g, x] = o(
    () => u(c)
  ), [f, i] = o(""), v = T(c);
  v.current = c, _(() => {
    d(!1), p(!1), w(0), h(!1), x(u(v.current)), i("");
  }, [l]);
  const C = b ? z : f || (a ? "查看已保存资产" : "保存到资产");
  function L(r) {
    if (r.preventDefault(), r.stopPropagation(), !(b || n)) {
      if (a) {
        h(!0);
        return;
      }
      x(u(v.current)), i(""), d(!0);
    }
  }
  async function O() {
    const r = u(g);
    if (!r) {
      i("请输入资产标题");
      return;
    }
    p(!0), i("");
    try {
      const m = await k(r);
      w(m), d(!1), D?.(m);
    } catch (m) {
      i(
        m instanceof Error ? m.message : "保存资产失败"
      );
    } finally {
      p(!1);
    }
  }
  return /* @__PURE__ */ s(F, { children: [
    /* @__PURE__ */ e(H, { label: C, children: /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: `${Q(y)} ${I}`.trim(),
        disabled: b || n,
        "aria-label": C,
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
        onOpenChange: (r) => {
          n || d(r);
        },
        title: "保存到资产",
        desc: S,
        confirmText: "保存",
        disabled: !g.trim(),
        handleConfirm: () => {
          O();
        },
        isLoading: n,
        children: /* @__PURE__ */ s("div", { className: "space-y-2", children: [
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
              maxLength: A,
              placeholder: "请输入资产标题",
              autoFocus: !0,
              onChange: (r) => {
                x(r.target.value), f && i("");
              }
            }
          ),
          f ? /* @__PURE__ */ e("p", { className: "m-0 text-sm text-red-600", children: f }) : null
        ] })
      }
    ),
    E && a ? /* @__PURE__ */ e(
      P,
      {
        teamID: t,
        assetID: a,
        onClose: () => h(!1)
      }
    ) : null
  ] });
}
function u(t) {
  return String(t || "").trim().slice(0, A);
}
function Q(t) {
  return t === "toolbar" ? "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-[var(--body-work-line)] bg-[var(--body-work-surface-raised)] px-2.5 text-xs font-medium text-[var(--body-work-text)] transition-colors hover:bg-[var(--body-work-active)] disabled:cursor-not-allowed disabled:bg-[var(--body-work-active)] disabled:text-[var(--body-work-muted)] disabled:opacity-100 [&>svg]:size-3.5" : t === "media" ? "inline-flex size-8 items-center justify-center rounded-md border border-white/70 bg-white/95 text-[#365447] shadow-sm transition hover:bg-white disabled:opacity-60 [&>svg]:size-4" : t === "inspector" ? "inline-flex size-9 items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-60 [&>svg]:size-4" : "agent-chat-message-action";
}
function le({
  icon: t,
  title: l
}) {
  return /* @__PURE__ */ e("div", { className: "flex h-full min-h-[280px] items-center justify-center bg-white px-6 text-center", children: /* @__PURE__ */ s("div", { children: [
    /* @__PURE__ */ e(t, { className: "mx-auto mb-3 size-6 text-[#8b9691]" }),
    /* @__PURE__ */ e("p", { className: "m-0 text-sm font-medium text-[#4f5a55]", children: l })
  ] }) });
}
function ce({
  asset: t,
  action: l,
  onCancel: c
}) {
  return /* @__PURE__ */ s("div", { className: "flex min-h-10 shrink-0 items-center justify-between gap-3 border-b border-[#dce5e0] bg-[#f0f5f2] px-4 py-2 text-xs text-[#365447] md:px-6", children: [
    /* @__PURE__ */ s("span", { className: "flex min-w-0 items-center gap-2", children: [
      /* @__PURE__ */ e(q, { className: "size-3.5 shrink-0", "aria-hidden": "true" }),
      /* @__PURE__ */ s("span", { className: "min-w-0 truncate", children: [
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
        children: /* @__PURE__ */ e(B, { className: "size-3.5" })
      }
    )
  ] });
}
export {
  ce as A,
  oe as S,
  le as W
};
