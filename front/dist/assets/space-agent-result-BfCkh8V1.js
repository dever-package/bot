import { a as f, j as a } from "./createLucideIcon-fWv1XcFy.js";
import { i as h, e as w, b as x } from "./runtime-entry-ClkZDmNs.js";
import { b as S, A as I, a as O, c as R, d as j, e as N, t as B } from "./interaction-view-vfqHePvj.js";
import { a as P } from "./interaction-Cyugb7TD.js";
import { C as k } from "./space-content-view-TucLzffi.js";
import { r as H } from "./space-page-jOKilSym.js";
function z({
  output: r,
  runtime: s,
  fallback: y,
  running: n,
  onContinue: o
}) {
  const m = h(() => H(r), [r]), t = !!(s && (s.text || s.activities.length > 0 || s.document || s.interaction || s.suggestions.length > 0 || Object.keys(s.output).length > 0)) && s ? s : m, c = t.document ? P(t.document) : t.text || (!n || m.started ? y : ""), i = h(
    () => S(c, t.activities),
    [t.activities, c]
  ), u = w(!1), [C, d] = x(!1), [b, g] = x(0), l = t.document?.id === b ? t.document : void 0, p = !!(n || C || !o), A = async (e) => {
    if (!(!o || p || u.current)) {
      u.current = !0, d(!0);
      try {
        await o(e);
      } finally {
        u.current = !1, d(!1);
      }
    }
  }, D = (e) => {
    A(B(e.prompt));
  };
  return /* @__PURE__ */ f("div", { className: "ws-canvas-agent-result", children: [
    i.map(
      (e, v) => e.type === "text" ? /* @__PURE__ */ a(
        k,
        {
          output: { text: e.text },
          fallback: e.text,
          streaming: !!(n && s?.started && v === i.length - 1),
          className: "ws-canvas-content-view ws-canvas-agent-text"
        },
        `text-${v}`
      ) : /* @__PURE__ */ a(
        I,
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
          /* @__PURE__ */ a("span", {}),
          /* @__PURE__ */ a("span", {}),
          /* @__PURE__ */ a("span", {})
        ]
      }
    ) : null,
    /* @__PURE__ */ a(
      O,
      {
        output: t.output,
        excludeOutputs: t.activities.map((e) => e.output),
        excludeText: c
      }
    ),
    t.document ? /* @__PURE__ */ a(
      R,
      {
        document: t.document,
        onOpen: (e) => g(e.id)
      }
    ) : null,
    /* @__PURE__ */ a(
      j,
      {
        suggestions: t.suggestions,
        disabled: p,
        onSelect: D
      }
    ),
    l ? /* @__PURE__ */ a(
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
export {
  z as CanvasAgentResultContent
};
