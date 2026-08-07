const t = window.React, g = t.Children, f = t.Component, p = t.Fragment, h = t.Profiler, w = t.PureComponent, b = t.StrictMode, S = t.Suspense, C = t.cloneElement, D = t.createContext, k = t.createElement, R = t.createRef, T = t.forwardRef, y = t.isValidElement, c = t.lazy, E = t.memo, F = t.startTransition, q = t.use, v = t.useCallback, P = t.useContext, M = t.useDebugValue, I = t.useDeferredValue, H = t.useEffect, x = t.useId, A = t.useImperativeHandle, L = t.useInsertionEffect, z = t.useLayoutEffect, j = t.useMemo, N = t.useOptimistic, V = t.useReducer, O = t.useRef, B = t.useState, K = t.useSyncExternalStore, W = t.useTransition, _ = t.version, U = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Children: g,
  Component: f,
  Fragment: p,
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
  lazy: c,
  memo: E,
  startTransition: F,
  use: q,
  useCallback: v,
  useContext: P,
  useDebugValue: M,
  useDeferredValue: I,
  useEffect: H,
  useId: x,
  useImperativeHandle: A,
  useInsertionEffect: L,
  useLayoutEffect: z,
  useMemo: j,
  useOptimistic: N,
  useReducer: V,
  useRef: O,
  useState: B,
  useSyncExternalStore: K,
  useTransition: W,
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
  })), r), l = c(u);
  return l.preload = u, l;
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
const ue = o("@/lib/request").joinSiteApi, le = o("@/lib/request").buildRuntimeRequestHeaders, ce = o("@/lib/request").loadMainInfo, de = o("@/lib/request").request, me = o("@/lib/request").requestRaw, ge = o("@/lib/request").resetFrontRuntimeCache, fe = o("@/stores/auth-store").useAuthStore, pe = o(
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
      () => import("./agent-B8xNHgc-.js").then((e) => ({
        default: e.ShowAgent
      }))
    ),
    "show-agent-chat": n(
      () => import("./agent-chat-DweKq2HJ.js").then((e) => e.a).then((e) => ({
        default: e.ShowAgentChat
      }))
    ),
    "show-skill-creator": n(
      () => import("./skill-creator-Cvdejdn2.js").then((e) => ({
        default: e.ShowSkillCreator
      }))
    ),
    "show-skill-test": n(
      () => import("./skill-test-Gr_U8ls6.js").then((e) => ({
        default: e.ShowSkillTest
      }))
    ),
    "show-team-workspace": n(
      () => import("./team-workspace-Cb6waD-_.js").then((e) => ({
        default: e.ShowTeamWorkspace
      }))
    ),
    "show-stream-request": n(
      () => import("./stream-request-HZQ_bZ-N.js").then((e) => e.s).then((e) => ({
        default: e.ShowStreamRequest
      }))
    ),
    "show-knowledge-file-manager": n(
      () => import("./knowledge-file-manager-D3rbgGVt.js").then((e) => e.k).then((e) => ({
        default: e.ShowKnowledgeFileManager
      }))
    ),
    "bot-body-work-login-page": n(
      () => import("./login-page-zmK67qSL.js").then((e) => ({
        default: e.WorkLoginPage
      }))
    ),
    "bot-body-content-page": n(
      () => import("./standalone-content-page--Dl0o3Ql.js").then(
        (e) => ({
          default: e.StandaloneContentPage
        })
      )
    ),
    "bot-body-work-home-shell": n(
      () => import("./home-shell-B1yhTnnn.js").then((e) => e.h).then((e) => ({
        default: e.WorkHomeShell
      }))
    ),
    "bot-body-work-space-page": n(
      () => import("./space-entry-DvXW-3-r.js").then((e) => e.s).then((e) => ({
        default: e.WorkSpaceEntry
      }))
    )
  }
}, Q = G(J);
window.DeverFront?.registerPlugin(Q);
export {
  ie as A,
  Y as B,
  me as C,
  $ as D,
  le as E,
  A as F,
  p as G,
  U as H,
  Z as I,
  E as J,
  L as K,
  I as L,
  g as M,
  C as N,
  y as O,
  re as P,
  t as R,
  S,
  pe as a,
  B as b,
  H as c,
  v as d,
  O as e,
  T as f,
  o as g,
  k as h,
  j as i,
  x as j,
  P as k,
  c as l,
  D as m,
  ue as n,
  z as o,
  ae as p,
  ee as q,
  de as r,
  ne as s,
  se as t,
  fe as u,
  te as v,
  oe as w,
  X as x,
  ge as y,
  ce as z
};
