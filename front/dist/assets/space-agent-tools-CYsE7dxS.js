import { m as w } from "./interaction-panel-Cd_uLE-L.js";
import { j as f, a as s } from "./_commonjsHelpers-CTFd9u1x.js";
import { d as h, u as I, l as x } from "./react-C7Xtl8sB.js";
import { b as S, A as O, a as P, c as R, d as j, e as N, t as B } from "./interaction-view-yUCy8jJQ.js";
import { a as M } from "./interaction-CdOaiJOA.js";
import { C as k } from "./node-detail-content-DhUE_leQ.js";
import { r as H } from "./space-page-D3VBae11.js";
function F({
  output: r,
  runtime: a,
  fallback: C,
  running: n,
  onContinue: o
}) {
  const m = h(() => H(r), [r]), t = !!(a && (a.text || a.activities.length > 0 || a.document || a.interaction || a.suggestions.length > 0 || Object.keys(a.output).length > 0)) && a ? a : m, c = t.document ? M(t.document) : t.text || (!n || m.started ? C : ""), i = h(
    () => S(c, t.activities),
    [t.activities, c]
  ), u = I(!1), [y, d] = x(!1), [A, g] = x(0), l = t.document?.id === A ? t.document : void 0, p = !!(n || y || !o), D = async (e) => {
    if (!(!o || p || u.current)) {
      u.current = !0, d(!0);
      try {
        await o(e);
      } finally {
        u.current = !1, d(!1);
      }
    }
  }, b = (e) => {
    D(B(e.prompt));
  };
  return /* @__PURE__ */ f("div", { className: "ws-canvas-agent-result", children: [
    i.map(
      (e, v) => e.type === "text" ? /* @__PURE__ */ s(
        k,
        {
          output: { text: e.text },
          fallback: e.text,
          streaming: !!(n && a?.started && v === i.length - 1),
          className: "ws-canvas-content-view ws-canvas-agent-text"
        },
        `text-${v}`
      ) : /* @__PURE__ */ s(
        O,
        {
          activity: e.activity
        },
        `activity-${e.activity.id}`
      )
    ),
    i.length === 0 && n && !t.document ? /* @__PURE__ */ f(
      "div",
      {
        className: "ws-canvas-agent-waiting",
        role: "status",
        "aria-label": "智能体正在生成",
        children: [
          /* @__PURE__ */ s("span", {}),
          /* @__PURE__ */ s("span", {}),
          /* @__PURE__ */ s("span", {})
        ]
      }
    ) : null,
    /* @__PURE__ */ s(
      P,
      {
        output: t.output,
        excludeOutputs: t.activities.map((e) => e.output),
        excludeText: c
      }
    ),
    t.document ? /* @__PURE__ */ s(
      R,
      {
        document: t.document,
        onOpen: (e) => g(e.id)
      }
    ) : null,
    /* @__PURE__ */ s(
      j,
      {
        suggestions: t.suggestions,
        disabled: p,
        onSelect: b
      }
    ),
    l ? /* @__PURE__ */ s(
      N,
      {
        open: !0,
        document: l,
        messageID: l.messageID,
        onClose: () => g(0)
      }
    ) : null
  ] });
}
const G = w.AgentInteractionPanel;
export {
  G as AgentInteractionPanel,
  F as CanvasAgentResultContent
};
