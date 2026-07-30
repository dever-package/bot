const t = window.React, g = t.Children, p = t.Component, f = t.Fragment, h = t.Profiler, w = t.PureComponent, b = t.StrictMode, S = t.Suspense, C = t.cloneElement, D = t.createContext, k = t.createElement, R = t.createRef, T = t.forwardRef, y = t.isValidElement, l = t.lazy, P = t.memo, F = t.startTransition, q = t.use, v = t.useCallback, E = t.useContext, M = t.useDebugValue, I = t.useDeferredValue, H = t.useEffect, x = t.useId, j = t.useImperativeHandle, A = t.useInsertionEffect, L = t.useLayoutEffect, z = t.useMemo, N = t.useOptimistic, V = t.useReducer, O = t.useRef, W = t.useState, B = t.useSyncExternalStore, K = t.useTransition, _ = t.version, U = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Children: g,
  Component: p,
  Fragment: f,
  Profiler: h,
  PureComponent: w,
  StrictMode: b,
  Suspense: S,
  cloneElement: C,
  createContext: D,
  createElement: k,
  createRef: R,
  default: t,
  forwardRef: T,
  isValidElement: y,
  lazy: l,
  memo: P,
  startTransition: F,
  use: q,
  useCallback: v,
  useContext: E,
  useDebugValue: M,
  useDeferredValue: I,
  useEffect: H,
  useId: x,
  useImperativeHandle: j,
  useInsertionEffect: A,
  useLayoutEffect: L,
  useMemo: z,
  useOptimistic: N,
  useReducer: V,
  useRef: O,
  useState: W,
  useSyncExternalStore: B,
  useTransition: K,
  version: _
}, Symbol.toStringTag, { value: "Module" }));
function G(e) {
  return window.DeverFront?.sdk?.defineFrontPlugin?.(e) || e;
}
function n(e) {
  const i = window.DeverFront?.sdk;
  if (i?.lazyNode)
    return i.lazyNode(e);
  let r = null;
  const u = () => (r || (r = e().catch((m) => {
    throw r = null, m;
  })), r), c = l(u);
  return c.preload = u, c;
}
function o(e) {
  return d().getCompatModule(e);
}
function X(...e) {
  return d().useNavigate(...e);
}
const Y = o("@/components/ui/button").Button;
o("@/components/ui/card").Card;
const Z = o("@/components/ui/input").Input;
o("@/components/ui/switch").Switch;
const s = o("@/components/ui/table");
s.Table;
s.TableBody;
s.TableCell;
s.TableFooter;
s.TableHead;
s.TableHeader;
s.TableRow;
s.TableCaption;
o("@/page/nodes/form/date").FormDate;
const a = o("@/components/ui/dialog"), $ = a.Dialog, ee = a.DialogContent, te = a.DialogDescription, oe = a.DialogFooter, ne = a.DialogHeader, se = a.DialogTitle, ae = o(
  "@/components/layout/site-logo"
).SiteLogo, re = o(
  "@/config/app-config"
).getSiteConfig, ie = o(
  "@/lib/auth-redirect"
).resolvePostLoginTarget;
o("@/lib/request").joinFrontApi;
const ue = o("@/lib/request").joinSiteApi, ce = o("@/lib/request").buildRuntimeRequestHeaders, le = o("@/lib/request").loadMainInfo, de = o("@/lib/request").request, me = o("@/lib/request").requestRaw, ge = o("@/lib/request").resetFrontRuntimeCache, pe = o("@/stores/auth-store").useAuthStore, fe = o(
  "@/context/theme-provider"
).useTheme;
function d() {
  const e = window.DeverFront?.sdk;
  if (!e)
    throw new Error("Dever front plugin SDK is not ready");
  return e;
}
const J = {
  name: "bot",
  nodes: {
    "show-agent": n(
      () => import("./agent-CsJr-oF9.js").then((e) => ({
        default: e.ShowAgent
      }))
    ),
    "show-agent-chat": n(
      () => import("./agent-chat-BDGfUytj.js").then((e) => e.a).then((e) => ({
        default: e.ShowAgentChat
      }))
    ),
    "show-skill-creator": n(
      () => import("./skill-creator-GYLZW8OS.js").then((e) => ({
        default: e.ShowSkillCreator
      }))
    ),
    "show-skill-test": n(
      () => import("./skill-test-wBFgO1do.js").then((e) => ({
        default: e.ShowSkillTest
      }))
    ),
    "show-team-workspace": n(
      () => import("./team-workspace-v0xAHtro.js").then((e) => ({
        default: e.ShowTeamWorkspace
      }))
    ),
    "show-stream-request": n(
      () => import("./stream-request-B_lm303h.js").then((e) => e.s).then((e) => ({
        default: e.ShowStreamRequest
      }))
    ),
    "show-knowledge-file-manager": n(
      () => import("./knowledge-file-manager-KnQUnWgI.js").then((e) => ({
        default: e.ShowKnowledgeFileManager
      }))
    ),
    "bot-body-work-login-page": n(
      () => import("./login-page-BkX3m3Nm.js").then((e) => ({
        default: e.WorkLoginPage
      }))
    ),
    "bot-body-content-page": n(
      () => import("./standalone-content-page-BUngIgv8.js").then(
        (e) => ({
          default: e.StandaloneContentPage
        })
      )
    ),
    "bot-body-work-home-shell": n(
      () => import("./home-shell-BrUTJHpe.js").then((e) => e.h).then((e) => ({
        default: e.WorkHomeShell
      }))
    ),
    "bot-body-work-project-page": n(
      () => import("./project-page-Cm8RgrC3.js").then((e) => ({
        default: e.WorkProjectPage
      }))
    ),
    "bot-body-work-space-page": n(
      () => import("./space-page-usUyQMFT.js").then((e) => ({
        default: e.WorkSpacePage
      }))
    )
  }
}, Q = G(J);
window.DeverFront?.registerPlugin(Q);
export {
  l as A,
  Y as B,
  D as C,
  $ as D,
  E,
  j as F,
  f as G,
  U as H,
  Z as I,
  P as J,
  A as K,
  me as L,
  I as M,
  g as N,
  C as O,
  y as P,
  t as R,
  ae as S,
  O as a,
  H as b,
  z as c,
  pe as d,
  v as e,
  ce as f,
  o as g,
  L as h,
  fe as i,
  ue as j,
  k,
  x as l,
  X as m,
  ge as n,
  le as o,
  ie as p,
  re as q,
  de as r,
  T as s,
  ee as t,
  W as u,
  ne as v,
  se as w,
  te as x,
  oe as y,
  S as z
};
