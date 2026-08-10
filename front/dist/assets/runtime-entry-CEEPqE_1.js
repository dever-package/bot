import { p as i } from "./react-C7Xtl8sB.js";
function h(e) {
  return window.DeverFront?.sdk?.defineFrontPlugin?.(e) || e;
}
function t(e) {
  const n = window.DeverFront?.sdk;
  if (n?.lazyNode)
    return n.lazyNode(e);
  let o = null;
  const r = () => (o || (o = e().catch((l) => {
    throw o = null, l;
  })), o), a = i(r);
  return a.preload = r, a;
}
function p(...e) {
  return s().useNavigate(...e);
}
function s() {
  const e = window.DeverFront?.sdk;
  if (!e)
    throw new Error("Dever front plugin SDK is not ready");
  return e;
}
const d = {
  name: "bot",
  nodes: {
    "show-agent": t(
      () => import("./agent-JX5s2kUq.js").then((e) => ({
        default: e.ShowAgent
      }))
    ),
    "show-agent-chat": t(
      () => import("./agent-chat-HKNFc9CT.js").then((e) => e.a).then((e) => ({
        default: e.ShowAgentChat
      }))
    ),
    "show-skill-creator": t(
      () => import("./skill-creator-euOTwr9-.js").then((e) => ({
        default: e.ShowSkillCreator
      }))
    ),
    "show-skill-test": t(
      () => import("./skill-test-CbxTAw6q.js").then((e) => ({
        default: e.ShowSkillTest
      }))
    ),
    "show-team-workspace": t(
      () => import("./team-workspace-DCk3iX05.js").then((e) => ({
        default: e.ShowTeamWorkspace
      }))
    ),
    "show-stream-request": t(
      () => import("./stream-request-CXgkvWCY.js").then((e) => e.s).then((e) => ({
        default: e.ShowStreamRequest
      }))
    ),
    "show-knowledge-file-manager": t(
      () => import("./knowledge-file-manager-tU6GKWgR.js").then((e) => e.k).then((e) => ({
        default: e.ShowKnowledgeFileManager
      }))
    ),
    "bot-body-work-login-page": t(
      () => import("./login-page-DrmjEtLD.js").then((e) => ({
        default: e.WorkLoginPage
      }))
    ),
    "bot-body-content-page": t(
      () => import("./standalone-content-page-52snODZ2.js").then(
        (e) => ({
          default: e.StandaloneContentPage
        })
      )
    ),
    "bot-body-work-home-shell": t(
      () => import("./home-shell-CgpDp6ol.js").then((e) => e.h).then((e) => ({
        default: e.WorkHomeShell
      }))
    ),
    "bot-body-work-space-page": t(
      () => import("./space-entry-BCsJ6Zds.js").then((e) => e.s).then((e) => ({
        default: e.WorkSpaceEntry
      }))
    )
  }
}, u = h(d);
window.DeverFront?.registerPlugin(u);
export {
  p as u
};
