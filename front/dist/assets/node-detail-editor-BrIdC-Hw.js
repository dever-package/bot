import { j as e, a as m } from "./runtime-entry-9YhLBCWA.js";
import { S as s } from "./_commonjsHelpers-C76sftkf.js";
import { b as G } from "./vendor-icons-DgDZMD4Q.js";
import { l as b, C as v, m as V, n as j, B as A, A as L } from "./upload-asset-api-BHoUDUjk.js";
import { M as P, R as _ } from "./media-inspector-gallery-DkVtDPR_.js";
import { h as p, c as h } from "./preloadable-BSZIYdQl.js";
import { n as u } from "./node-detail-content-BQaiWeOq.js";
import { C as c } from "./space-page-CQN519oX.js";
import { b as B } from "./asset-page-APee_q5x.js";
const F = h(
  () => import("./space-storyboard-view-BhstEW9O.js")
), I = p(
  F,
  (o) => o.StoryboardView
), z = I.Component, U = h(
  () => import("./node-detail-storyboard-grid-szPdw2Me.js").then((o) => o.n)
), W = p(
  U,
  (o) => o.NodeDetailStoryboardGrid
), $ = W.Component, q = h(
  () => Promise.resolve().then(() => Y)
), H = p(
  q,
  (o) => o.NodeDetailRichEditor
), J = H.Component;
function le({
  content: o,
  assetKind: i,
  mediaOutput: t,
  mediaKind: a,
  mediaPrompt: d,
  readonly: r,
  referenceItems: w,
  canvasNodes: y,
  lipSyncAvailable: g,
  storyboardSourceNodeId: N,
  storyboardFocus: S,
  storyboardWorkflowAction: C,
  storyboardWorkTypes: x,
  storyboardReferencePurposes: D,
  referenceProvider: M,
  onConfirmStoryboard: R,
  onCreateStoryboardRevision: E,
  onGenerateStoryboardShot: T,
  onChange: n
}) {
  if (t !== void 0 && (a === "image" || a === "video"))
    return /* @__PURE__ */ e(f, { kind: a, output: t });
  if (t !== void 0 && a === "audio") {
    const l = b(t, "audio");
    if (l.length > 0 && (l.length > 1 || l[0]?.thumbnail))
      return /* @__PURE__ */ e(f, { kind: "audio", output: t });
    const k = l[0]?.url || "";
    return /* @__PURE__ */ e("div", { className: "wb-detail-readonly-content is-audio", children: /* @__PURE__ */ e(L, { src: k, prompt: d, detailed: !0 }) });
  }
  return t !== void 0 ? /* @__PURE__ */ e(
    v,
    {
      className: "ws-node-detail-media",
      output: t,
      emptyText: "暂无媒体内容",
      mediaLayout: "chat"
    }
  ) : o.mode === "storyboard_grid" ? /* @__PURE__ */ e(s, { fallback: /* @__PURE__ */ e(c, { label: "正在加载分镜宫格" }), children: /* @__PURE__ */ e(
    $,
    {
      grid: o.value,
      readonly: r,
      referenceProvider: M,
      onChange: (l) => n(u(o, l))
    }
  ) }) : o.mode === "storyboard" ? /* @__PURE__ */ e("div", { className: "ws-node-detail-storyboard", children: /* @__PURE__ */ e(s, { fallback: /* @__PURE__ */ e(c, { label: "正在加载分镜内容" }), children: /* @__PURE__ */ e(
    z,
    {
      storyboard: o.value,
      layout: "split",
      editable: !r,
      referenceItems: w,
      canvasNodes: y,
      lipSyncAvailable: g,
      storyboardSourceNodeId: N,
      workTypeSpecs: x,
      purposeSpecs: D,
      focus: S,
      workflowAction: C,
      onConfirm: R,
      onCreateRevision: E,
      onGenerateShot: T,
      onChange: (l) => n(u(o, l)),
      showSaveStatus: !1
    }
  ) }) }) : o.mode === "file" ? /* @__PURE__ */ e(
    Q,
    {
      content: o,
      readonly: r,
      onChange: n
    }
  ) : /* @__PURE__ */ e(s, { fallback: /* @__PURE__ */ e(c, { label: "正在加载内容编辑器" }), children: /* @__PURE__ */ e(
    J,
    {
      content: o,
      kind: i === "richtext" ? "richtext" : "text",
      readonly: r,
      onChange: n
    }
  ) });
}
function f({
  kind: o,
  output: i
}) {
  return V(i, o).length === 0 ? /* @__PURE__ */ e(
    v,
    {
      className: "ws-node-detail-media",
      output: i,
      emptyText: "暂无媒体内容",
      mediaLayout: "chat"
    }
  ) : /* @__PURE__ */ e(s, { fallback: /* @__PURE__ */ e(c, { label: "正在加载媒体预览" }), children: /* @__PURE__ */ e(
    P,
    {
      kind: o,
      mediaItems: b(i, o),
      downloadable: !0,
      className: "ws-node-detail-media-gallery",
      supplementalText: o === "audio" ? j(i) : null
    }
  ) });
}
function Q({
  content: o,
  readonly: i,
  onChange: t
}) {
  const a = o.value, d = (r) => {
    t(u(o, { ...a, ...r }));
  };
  return /* @__PURE__ */ m("div", { className: "ws-node-detail-file-editor", children: [
    /* @__PURE__ */ m("div", { className: "ws-node-detail-file-block", children: [
      /* @__PURE__ */ e("span", { "aria-hidden": "true", children: /* @__PURE__ */ e(G, { size: 24 }) }),
      /* @__PURE__ */ m("div", { children: [
        i ? /* @__PURE__ */ e("strong", { children: a.name || "文件" }) : /* @__PURE__ */ e(
          "input",
          {
            value: a.name,
            "aria-label": "文件名称",
            placeholder: "文件名称",
            onChange: (r) => d({ name: r.target.value })
          }
        ),
        /* @__PURE__ */ e("small", { children: a.url })
      ] }),
      /* @__PURE__ */ e(A, { label: "下载文件", children: /* @__PURE__ */ e(
        _,
        {
          url: a.url,
          name: a.name,
          label: "下载文件"
        }
      ) })
    ] }),
    i ? /* @__PURE__ */ e("p", { children: a.description || "暂无文件说明" }) : /* @__PURE__ */ e(
      "textarea",
      {
        value: a.description,
        rows: 8,
        placeholder: "补充文件说明",
        onChange: (r) => d({ description: r.target.value })
      }
    )
  ] });
}
function X({
  content: o,
  kind: i,
  readonly: t,
  onChange: a
}) {
  const d = String(o.value || "");
  return /* @__PURE__ */ e("div", { className: "ws-node-detail-editor", children: /* @__PURE__ */ e(
    B,
    {
      kind: i,
      value: d,
      contentFormat: o.format,
      readonly: t,
      onChange: (r) => a(u(o, r))
    }
  ) });
}
const Y = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  NodeDetailRichEditor: X
}, Symbol.toStringTag, { value: "Module" }));
export {
  le as NodeDetailEditor
};
