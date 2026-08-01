import { a as f, j as s } from "./createLucideIcon-CEtb6KSk.js";
import { c as h, a as w, u as x } from "./runtime-entry-CIrzyMsA.js";
import { b as S, A as I, a as O, c as R, d as j, e as N, t as B } from "./interaction-view-De7PDInr.js";
import { a as P } from "./interaction-d6W_Ir2J.js";
import { C as k } from "./upload-asset-api-DAbIOMVJ.js";
import { r as H } from "./space-page-BBWff1fq.js";
function z({
  output: r,
  runtime: a,
  fallback: y,
  running: n,
  onContinue: o
}) {
  const m = h(() => H(r), [r]), t = !!(a && (a.text || a.activities.length > 0 || a.document || a.interaction || a.suggestions.length > 0 || Object.keys(a.output).length > 0)) && a ? a : m, c = t.document ? P(t.document) : t.text || (!n || m.started ? y : ""), i = h(
    () => S(c, t.activities),
    [t.activities, c]
  ), u = w(!1), [C, d] = x(!1), [A, g] = x(0), l = t.document?.id === A ? t.document : void 0, p = !!(n || C || !o), D = async (e) => {
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
          /* @__PURE__ */ s("span", {}),
          /* @__PURE__ */ s("span", {}),
          /* @__PURE__ */ s("span", {})
        ]
      }
    ) : null,
    /* @__PURE__ */ s(
      O,
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
export {
  z as CanvasAgentResultContent
};
