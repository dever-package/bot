import { a as o, j as p } from "./_commonjsHelpers-CTFd9u1x.js";
import { S as n } from "./react-C7Xtl8sB.js";
import { F as I } from "./vendor-icons-Cc7Kl3It.js";
import { C as f, n as b } from "./node-detail-content-DhUE_leQ.js";
import { c as v, A as T, a as E, b as G, B as V } from "./storyboard-grid-view-CJXm84yJ.js";
import { R as L } from "./media-inspector-gallery-nBFOIame.js";
import { a as u, b as m } from "./preloadable-PCKj9Z7v.js";
import { C as c } from "./space-entry-BCsJ6Zds.js";
const A = m(
  () => import("./space-storyboard-view-CugNizUh.js")
), B = u(
  A,
  (e) => e.StoryboardView
), F = B.Component, j = m(
  () => import("./media-inspector-gallery-nBFOIame.js").then((e) => e.b)
), P = u(
  j,
  (e) => e.MediaInspector
), U = P.Component, W = m(
  () => import("./node-detail-storyboard-grid-Cwlx2Bai.js").then((e) => e.n)
), z = u(
  W,
  (e) => e.NodeDetailStoryboardGrid
), _ = z.Component, q = m(
  () => import("./node-detail-rich-editor-BKZxAaWl.js")
), H = u(
  q,
  (e) => e.NodeDetailRichEditor
), J = H.Component;
function ae({
  content: e,
  mediaOutput: a,
  mediaKind: i,
  mediaPrompt: r,
  readonly: l,
  referenceItems: d,
  canvasNodes: w,
  storyboardSourceNodeId: y,
  storyboardFocus: C,
  storyboardWorkflowAction: N,
  storyboardWorkTypes: S,
  storyboardReferencePurposes: g,
  referenceProvider: D,
  onConfirmStoryboard: M,
  onCreateStoryboardRevision: x,
  onGenerateStoryboardShot: R,
  onChange: s
}) {
  if (a !== void 0 && (i === "image" || i === "video"))
    return /* @__PURE__ */ o(h, { kind: i, output: a });
  if (a !== void 0 && i === "audio") {
    const t = v(a, "audio");
    if (t.length > 0 && (t.length > 1 || t[0]?.thumbnail))
      return /* @__PURE__ */ o(h, { kind: "audio", output: a });
    const k = t[0]?.url || "";
    return /* @__PURE__ */ o("div", { className: "wb-detail-readonly-content is-audio", children: /* @__PURE__ */ o(T, { src: k, prompt: r, detailed: !0 }) });
  }
  return a !== void 0 ? /* @__PURE__ */ o(
    f,
    {
      className: "ws-node-detail-media",
      output: a,
      emptyText: "暂无媒体内容",
      mediaLayout: "chat"
    }
  ) : e.mode === "storyboard_grid" ? /* @__PURE__ */ o(n, { fallback: /* @__PURE__ */ o(c, { label: "正在加载分镜宫格" }), children: /* @__PURE__ */ o(
    _,
    {
      grid: e.value,
      readonly: l,
      referenceProvider: D,
      onChange: (t) => s(b(e, t))
    }
  ) }) : e.mode === "storyboard" ? /* @__PURE__ */ o("div", { className: "ws-node-detail-storyboard", children: /* @__PURE__ */ o(n, { fallback: /* @__PURE__ */ o(c, { label: "正在加载分镜内容" }), children: /* @__PURE__ */ o(
    F,
    {
      storyboard: e.value,
      layout: "split",
      editable: !l,
      referenceItems: d,
      canvasNodes: w,
      storyboardSourceNodeId: y,
      workTypeSpecs: S,
      purposeSpecs: g,
      focus: C,
      workflowAction: N,
      onConfirm: M,
      onCreateRevision: x,
      onGenerateShot: R,
      onChange: (t) => s(b(e, t)),
      showSaveStatus: !1
    }
  ) }) }) : e.mode === "file" ? /* @__PURE__ */ o(
    Q,
    {
      content: e,
      readonly: l,
      onChange: s
    }
  ) : /* @__PURE__ */ o(n, { fallback: /* @__PURE__ */ o(c, { label: "正在加载内容编辑器" }), children: /* @__PURE__ */ o(
    J,
    {
      content: e,
      readonly: l,
      onChange: s
    }
  ) });
}
function h({
  kind: e,
  output: a
}) {
  return E(a, e).length === 0 ? /* @__PURE__ */ o(
    f,
    {
      className: "ws-node-detail-media",
      output: a,
      emptyText: "暂无媒体内容",
      mediaLayout: "chat"
    }
  ) : /* @__PURE__ */ o(n, { fallback: /* @__PURE__ */ o(c, { label: "正在加载媒体预览" }), children: /* @__PURE__ */ o(
    U,
    {
      kind: e,
      mediaItems: v(a, e),
      downloadable: !0,
      className: "ws-node-detail-media-gallery",
      supplementalText: e === "audio" ? G(a) : null
    }
  ) });
}
function Q({
  content: e,
  readonly: a,
  onChange: i
}) {
  const r = e.value, l = (d) => {
    i(b(e, { ...r, ...d }));
  };
  return /* @__PURE__ */ p("div", { className: "ws-node-detail-file-editor", children: [
    /* @__PURE__ */ p("div", { className: "ws-node-detail-file-block", children: [
      /* @__PURE__ */ o("span", { "aria-hidden": "true", children: /* @__PURE__ */ o(I, { size: 24 }) }),
      /* @__PURE__ */ p("div", { children: [
        a ? /* @__PURE__ */ o("strong", { children: r.name || "文件" }) : /* @__PURE__ */ o(
          "input",
          {
            value: r.name,
            "aria-label": "文件名称",
            placeholder: "文件名称",
            onChange: (d) => l({ name: d.target.value })
          }
        ),
        /* @__PURE__ */ o("small", { children: r.url })
      ] }),
      /* @__PURE__ */ o(V, { label: "下载文件", children: /* @__PURE__ */ o(
        L,
        {
          url: r.url,
          name: r.name,
          label: "下载文件"
        }
      ) })
    ] }),
    a ? /* @__PURE__ */ o("p", { children: r.description || "暂无文件说明" }) : /* @__PURE__ */ o(
      "textarea",
      {
        value: r.description,
        rows: 8,
        placeholder: "补充文件说明",
        onChange: (d) => l({ description: d.target.value })
      }
    )
  ] });
}
export {
  ae as NodeDetailEditor
};
