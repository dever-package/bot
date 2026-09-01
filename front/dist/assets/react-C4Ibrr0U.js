import { l as m, R as l } from "./_commonjsHelpers-61wyk6v6.js";
function p(t) {
  return window.DeverFront?.sdk?.defineFrontPlugin?.(t) || t;
}
function n(t) {
  const e = window.DeverFront?.sdk;
  if (e?.lazyNode)
    return e.lazyNode(t);
  let o = null;
  const r = () => (o || (o = t().catch((u) => {
    throw o = null, u;
  })), o), a = m(r);
  return a.preload = r, a;
}
function I(...t) {
  return k().useNavigate(...t);
}
function k() {
  const t = window.DeverFront?.sdk;
  if (!t)
    throw new Error("Dever front plugin SDK is not ready");
  return t;
}
const h = () => import("./agent-nodes-Bxjd3qvX.js"), y = {
  name: "bot",
  nodes: {
    "show-agent": n(
      () => h().then((t) => ({
        default: t.ShowAgent
      }))
    ),
    "show-agent-chat": n(
      () => import("./protected-7-nodes-show-agent-chat-tsx-viAzZ73E.js").then((t) => ({
        default: t.ShowAgentChat
      }))
    ),
    "show-skill-creator": n(
      () => h().then((t) => ({
        default: t.ShowSkillCreator
      }))
    ),
    "show-skill-test": n(
      () => import("./skill-test-z2BKFELt.js").then((t) => ({
        default: t.ShowSkillTest
      }))
    ),
    "show-team-workspace": n(
      () => import("./team-workspace-G7bvOJyS.js").then((t) => ({
        default: t.ShowTeamWorkspace
      }))
    ),
    "show-stream-request": n(
      () => import("./show-stream-request-DU_YrcIz.js").then((t) => ({
        default: t.ShowStreamRequest
      }))
    ),
    "show-knowledge-file-manager": n(
      () => import("./protected-6-nodes-show-knowledge-file-manager-tsx-Bbt6-0rZ.js").then((t) => ({
        default: t.ShowKnowledgeFileManager
      }))
    ),
    "bot-body-work-login-page": n(
      () => import("./login-page-Dg_TAxr_.js").then((t) => ({
        default: t.WorkLoginPage
      }))
    ),
    "bot-body-content-page": n(
      () => import("./standalone-content-page-D3b_US5X.js").then(
        (t) => ({
          default: t.StandaloneContentPage
        })
      )
    ),
    "bot-body-work-home-shell": n(
      () => import("./home-shell-WkuNhjHb.js").then((t) => t.h).then((t) => ({
        default: t.WorkHomeShell
      }))
    ),
    "bot-body-work-space-page": n(
      () => import("./space-entry-BUYocsJZ.js").then((t) => ({
        default: t.WorkSpaceEntry
      }))
    )
  }
}, v = p(y);
window.DeverFront?.registerPlugin(v);
const g = (t) => {
  let e;
  const o = /* @__PURE__ */ new Set(), r = (s, d) => {
    const i = typeof s == "function" ? s(e) : s;
    if (!Object.is(i, e)) {
      const S = e;
      e = d ?? (typeof i != "object" || i === null) ? i : Object.assign({}, e, i), o.forEach((b) => b(e, S));
    }
  }, a = () => e, c = { setState: r, getState: a, getInitialState: () => f, subscribe: (s) => (o.add(s), () => o.delete(s)) }, f = e = t(r, a, c);
  return c;
}, D = ((t) => t ? g(t) : g), F = (t) => t;
function P(t, e = F) {
  const o = l.useSyncExternalStore(
    t.subscribe,
    l.useCallback(() => e(t.getState()), [t, e]),
    l.useCallback(() => e(t.getInitialState()), [t, e])
  );
  return l.useDebugValue(o), o;
}
const w = (t) => {
  const e = D(t), o = (r) => P(e, r);
  return Object.assign(o, e), o;
}, j = ((t) => t ? w(t) : w);
export {
  I as a,
  j as b,
  D as c,
  P as u
};
