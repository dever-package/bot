import { j as e, b as p, a as u, c as b } from "./preloadable-Bomi5PEU.js";
import { S as n } from "./_commonjsHelpers-61wyk6v6.js";
import { b as T } from "./vendor-icons-B3DKX3la.js";
import { c as f, A as E, C as v, b as G, d as V, B as L } from "./upload-asset-api-MyhTP8sK.js";
import { M as A, R as B } from "./media-inspector-gallery-ho9rlZcO.js";
import { n as m } from "./node-detail-content-CGnopeKL.js";
import { C as c } from "./space-page-BwCaFG6o.js";
const I = b(
  () => import("./space-storyboard-view-Bh_FCY7Y.js")
), j = p(
  I,
  (o) => o.StoryboardView
), F = j.Component, P = b(
  () => import("./node-detail-storyboard-grid-Dj6kOUmq.js").then((o) => o.n)
), U = p(
  P,
  (o) => o.NodeDetailStoryboardGrid
), W = U.Component, z = b(
  () => import("./node-detail-rich-editor-3YH3eG2I.js")
), _ = p(
  z,
  (o) => o.NodeDetailRichEditor
), q = _.Component;
function O({
  content: o,
  mediaOutput: a,
  mediaKind: i,
  mediaPrompt: r,
  readonly: l,
  referenceItems: d,
  canvasNodes: w,
  storyboardSourceNodeId: y,
  storyboardFocus: N,
  storyboardWorkflowAction: C,
  storyboardWorkTypes: S,
  storyboardReferencePurposes: g,
  referenceProvider: D,
  onConfirmStoryboard: M,
  onCreateStoryboardRevision: x,
  onGenerateStoryboardShot: R,
  onChange: s
}) {
  if (a !== void 0 && (i === "image" || i === "video"))
    return /* @__PURE__ */ e(h, { kind: i, output: a });
  if (a !== void 0 && i === "audio") {
    const t = f(a, "audio");
    if (t.length > 0 && (t.length > 1 || t[0]?.thumbnail))
      return /* @__PURE__ */ e(h, { kind: "audio", output: a });
    const k = t[0]?.url || "";
    return /* @__PURE__ */ e("div", { className: "wb-detail-readonly-content is-audio", children: /* @__PURE__ */ e(E, { src: k, prompt: r, detailed: !0 }) });
  }
  return a !== void 0 ? /* @__PURE__ */ e(
    v,
    {
      className: "ws-node-detail-media",
      output: a,
      emptyText: "暂无媒体内容",
      mediaLayout: "chat"
    }
  ) : o.mode === "storyboard_grid" ? /* @__PURE__ */ e(n, { fallback: /* @__PURE__ */ e(c, { label: "正在加载分镜宫格" }), children: /* @__PURE__ */ e(
    W,
    {
      grid: o.value,
      readonly: l,
      referenceProvider: D,
      onChange: (t) => s(m(o, t))
    }
  ) }) : o.mode === "storyboard" ? /* @__PURE__ */ e("div", { className: "ws-node-detail-storyboard", children: /* @__PURE__ */ e(n, { fallback: /* @__PURE__ */ e(c, { label: "正在加载分镜内容" }), children: /* @__PURE__ */ e(
    F,
    {
      storyboard: o.value,
      layout: "split",
      editable: !l,
      referenceItems: d,
      canvasNodes: w,
      storyboardSourceNodeId: y,
      workTypeSpecs: S,
      purposeSpecs: g,
      focus: N,
      workflowAction: C,
      onConfirm: M,
      onCreateRevision: x,
      onGenerateShot: R,
      onChange: (t) => s(m(o, t)),
      showSaveStatus: !1
    }
  ) }) }) : o.mode === "file" ? /* @__PURE__ */ e(
    H,
    {
      content: o,
      readonly: l,
      onChange: s
    }
  ) : /* @__PURE__ */ e(n, { fallback: /* @__PURE__ */ e(c, { label: "正在加载内容编辑器" }), children: /* @__PURE__ */ e(
    q,
    {
      content: o,
      readonly: l,
      onChange: s
    }
  ) });
}
function h({
  kind: o,
  output: a
}) {
  return G(a, o).length === 0 ? /* @__PURE__ */ e(
    v,
    {
      className: "ws-node-detail-media",
      output: a,
      emptyText: "暂无媒体内容",
      mediaLayout: "chat"
    }
  ) : /* @__PURE__ */ e(n, { fallback: /* @__PURE__ */ e(c, { label: "正在加载媒体预览" }), children: /* @__PURE__ */ e(
    A,
    {
      kind: o,
      mediaItems: f(a, o),
      downloadable: !0,
      className: "ws-node-detail-media-gallery",
      supplementalText: o === "audio" ? V(a) : null
    }
  ) });
}
function H({
  content: o,
  readonly: a,
  onChange: i
}) {
  const r = o.value, l = (d) => {
    i(m(o, { ...r, ...d }));
  };
  return /* @__PURE__ */ u("div", { className: "ws-node-detail-file-editor", children: [
    /* @__PURE__ */ u("div", { className: "ws-node-detail-file-block", children: [
      /* @__PURE__ */ e("span", { "aria-hidden": "true", children: /* @__PURE__ */ e(T, { size: 24 }) }),
      /* @__PURE__ */ u("div", { children: [
        a ? /* @__PURE__ */ e("strong", { children: r.name || "文件" }) : /* @__PURE__ */ e(
          "input",
          {
            value: r.name,
            "aria-label": "文件名称",
            placeholder: "文件名称",
            onChange: (d) => l({ name: d.target.value })
          }
        ),
        /* @__PURE__ */ e("small", { children: r.url })
      ] }),
      /* @__PURE__ */ e(L, { label: "下载文件", children: /* @__PURE__ */ e(
        B,
        {
          url: r.url,
          name: r.name,
          label: "下载文件"
        }
      ) })
    ] }),
    a ? /* @__PURE__ */ e("p", { children: r.description || "暂无文件说明" }) : /* @__PURE__ */ e(
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
  O as NodeDetailEditor
};
