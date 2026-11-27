import { a as u, j as o } from "./preloadable-CbkzeflN.js";
import { X as s } from "./vendor-icons-B1zF1_4n.js";
function f({
  message: t,
  onDismiss: e,
  floating: r = !1
}) {
  return t ? /* @__PURE__ */ u(
    "div",
    {
      className: `ws-operation-error nodrag nowheel${r ? " is-floating" : ""}`,
      role: "alert",
      onPointerDown: (n) => n.stopPropagation(),
      children: [
        /* @__PURE__ */ o("span", { children: t }),
        /* @__PURE__ */ o("button", { type: "button", "aria-label": "关闭错误提示", onClick: e, children: /* @__PURE__ */ o(s, { size: 14 }) })
      ]
    }
  ) : null;
}
await window.DeverFront?.ensureCompat?.(["@/stores/auth-store"]);
const i = window.DeverFront?.sdk?.getCompatModule("@/stores/auth-store");
if (!i || Object.keys(i).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/stores/auth-store");
const a = i.useAuthStore;
function h() {
  const t = a((e) => e.auth?.user);
  return c(t);
}
function c(t) {
  if (!t || typeof t != "object" || Array.isArray(t))
    return "";
  const e = t, r = Number(e.id || 0);
  if (Number.isFinite(r) && r > 0)
    return `user:${r}`;
  const n = String(e.account || "").trim();
  return n ? `account:${n}` : "";
}
function g(t, e) {
  if (!Object.prototype.hasOwnProperty.call(t, e))
    return t;
  const r = { ...t };
  return delete r[e], r;
}
function l(t) {
  return t?.status === "running" || t?.status === "waiting";
}
function v(t) {
  return l(t) ? {} : {
    statusText: void 0,
    executionPhase: void 0,
    queuePosition: void 0,
    reconnecting: void 0,
    generatedCount: void 0,
    targetCount: void 0
  };
}
export {
  f as S,
  v as c,
  l as i,
  g as o,
  h as u
};
