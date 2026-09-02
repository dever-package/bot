import { a as h, j as a } from "./runtime-entry-9YhLBCWA.js";
import { u as C, d as I, a as w } from "./_commonjsHelpers-C76sftkf.js";
import { b as S, A as O, a as j, c as M, d as P, e as R, t as k } from "./interaction-view-CYRC42H9.js";
import { a as N } from "./interaction-BSPeVZBK.js";
import { C as _ } from "./upload-asset-api-BHoUDUjk.js";
import { r as B } from "./space-page-CQN519oX.js";
function q({
  output: d,
  runtime: n,
  fallback: x,
  running: s,
  onContinue: o
}) {
  const m = C(() => B(d), [d]), t = !!(n && (n.text || n.activities.length > 0 || n.document || n.interaction || n.suggestions.length > 0 || Object.keys(n.output).length > 0)) && n ? n : m, c = t.document ? N(t.document) : t.text || (!s || m.started ? x : ""), i = C(
    () => S(c, t.activities),
    [t.activities, c]
  ), u = I(!1), [y, p] = w(!1), [A, g] = w(0), l = t.document?.id === A ? t.document : void 0, v = !!(s || y || !o), D = async (e) => {
    if (!(!o || v || u.current)) {
      u.current = !0, p(!0);
      try {
        await o(e);
      } finally {
        u.current = !1, p(!1);
      }
    }
  }, b = (e) => {
    D(k(e.prompt));
  };
  return /* @__PURE__ */ h("div", { className: "ws-canvas-agent-result", children: [
    i.map(
      (e, f) => e.type === "text" ? /* @__PURE__ */ a(
        _,
        {
          output: { text: e.text },
          fallback: e.text,
          streaming: !!(s && n?.started && f === i.length - 1),
          className: "ws-canvas-content-view ws-canvas-agent-text"
        },
        `text-${f}`
      ) : /* @__PURE__ */ a(
        O,
        {
          activity: e.activity
        },
        `activity-${e.activity.id}`
      )
    ),
    i.length === 0 && s && !t.document ? /* @__PURE__ */ h(
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
      j,
      {
        output: t.output,
        excludeOutputs: t.activities.map((e) => e.output),
        excludeText: c
      }
    ),
    t.document ? /* @__PURE__ */ a(
      M,
      {
        document: t.document,
        onOpen: (e) => g(e.id)
      }
    ) : null,
    /* @__PURE__ */ a(
      P,
      {
        suggestions: t.suggestions,
        disabled: v,
        onSelect: b
      }
    ),
    l ? /* @__PURE__ */ a(
      R,
      {
        open: !0,
        document: l,
        messageID: l.messageID,
        onClose: () => g(0)
      }
    ) : null
  ] });
}
await window.DeverFront?.ensureCompat?.(["@/components/agent/interaction-panel"]);
const r = window.DeverFront?.sdk?.getCompatModule("@/components/agent/interaction-panel");
if (!r || Object.keys(r).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/interaction-panel");
const z = r.AgentInteractionPanel;
export {
  z as AgentInteractionPanel,
  q as CanvasAgentResultContent
};
