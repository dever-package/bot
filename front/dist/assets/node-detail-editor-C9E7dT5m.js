import { j as t, e as p, a as u, c as f } from "./preloadable-BrN58FXf.js";
import { S as d, a as G, d as V } from "./file-kind-BSFhe2vU.js";
import { b as B } from "./vendor-icons-UGaOWWu-.js";
import { C } from "./text-content-save-actions-DF1L6Tn3.js";
import { a as F, e as L, b as _, d as j } from "./content-view-0gIO2Kkv.js";
import { M as P, R as U } from "./media-inspector-gallery-CQ7C4itZ.js";
import { B as W } from "./asset-preview-D6nljO8_.js";
import { n as c } from "./space-reference-content-K_sxMShu.js";
import { C as m } from "./space-loading-FH4pJ97O.js";
import { S as v, a as z } from "./space-storyboard-workspace-CvBV-_tS.js";
const O = f(
  () => import("./space-storyboard-view-D4elHahc.js")
), Y = p(
  O,
  (e) => e.StoryboardView
), $ = Y.Component, q = f(
  () => import("./node-detail-storyboard-grid-DgcSbIw2.js").then((e) => e.n)
), H = p(
  q,
  (e) => e.NodeDetailStoryboardGrid
), J = H.Component, Q = f(
  () => import("./asset-text-content-editor-DHhQX3TO.js").then((e) => e.c)
), X = p(
  Q,
  (e) => e.AssetTextContentEditor
), Z = X.Component;
function me({
  content: e,
  assetKind: a,
  mediaOutput: r,
  mediaKind: o,
  mediaPrompt: l,
  readonly: i,
  referenceItems: w,
  canvasNodes: x,
  storyboardSourceNodeId: y,
  storyboardFocus: g,
  storyboardInitialSectionId: N,
  storyboardWorkspace: h,
  storyboardWorkflowAction: M,
  storyboardWorkTypes: T,
  storyboardReferencePurposes: D,
  referenceProvider: E,
  onConfirmStoryboard: k,
  onCreateStoryboardRevision: I,
  onGenerateStoryboardShot: R,
  onChange: n
}) {
  if (r !== void 0 && (o === "image" || o === "video"))
    return /* @__PURE__ */ t(S, { kind: o, output: r });
  if (r !== void 0 && o === "audio")
    return /* @__PURE__ */ t(
      S,
      {
        kind: "audio",
        output: r,
        prompt: l
      }
    );
  if (r !== void 0)
    return /* @__PURE__ */ t(
      C,
      {
        className: "ws-node-detail-media",
        output: r,
        emptyText: "暂无媒体内容",
        mediaLayout: "chat"
      }
    );
  if (e.mode === "storyboard_grid")
    return /* @__PURE__ */ t(d, { fallback: /* @__PURE__ */ t(m, { label: "正在加载分镜宫格" }), children: /* @__PURE__ */ t(
      J,
      {
        grid: e.value,
        readonly: i,
        referenceProvider: E,
        onChange: (s) => n(c(e, s))
      }
    ) });
  if (e.mode === "storyboard") {
    const s = e.value, b = /* @__PURE__ */ t("div", { className: "ws-node-detail-storyboard", children: /* @__PURE__ */ t(d, { fallback: /* @__PURE__ */ t(m, { label: "正在加载分镜内容" }), children: /* @__PURE__ */ t(
      $,
      {
        storyboard: s,
        editable: !i,
        referenceItems: w,
        canvasNodes: x,
        storyboardSourceNodeId: y,
        workTypeSpecs: T,
        purposeSpecs: D,
        focus: g,
        workflowAction: M,
        onConfirm: k,
        onCreateRevision: I,
        onGenerateShot: R,
        onChange: (A) => n(c(e, A)),
        showSaveStatus: !1
      }
    ) }) });
    return h ? /* @__PURE__ */ t(
      K,
      {
        initialSectionId: N,
        storyboardWorkspace: h,
        scriptMeta: `${s.shots.length} 个镜头`,
        scriptContent: b
      }
    ) : b;
  }
  return e.mode === "file" ? /* @__PURE__ */ t(
    ee,
    {
      content: e,
      readonly: i,
      onChange: n
    }
  ) : /* @__PURE__ */ t(d, { fallback: /* @__PURE__ */ t(m, { label: "正在加载内容编辑器" }), children: /* @__PURE__ */ t("div", { className: "ws-node-detail-editor", children: /* @__PURE__ */ t(
    Z,
    {
      kind: a === "richtext" ? "richtext" : "text",
      value: String(e.value || ""),
      contentFormat: e.format,
      readonly: i,
      onChange: (s) => n(c(e, s))
    }
  ) }) });
}
function K({
  initialSectionId: e,
  storyboardWorkspace: a,
  scriptMeta: r,
  scriptContent: o
}) {
  const [l, i] = G(
    e || v
  );
  return V(() => {
    i(e || v);
  }, [e]), /* @__PURE__ */ t(
    z,
    {
      variant: "detail",
      activeSectionId: l,
      groups: a.groups,
      scriptMeta: r,
      scriptContent: o,
      renderNode: a.renderNode,
      onActiveSectionChange: i
    }
  );
}
function S({
  kind: e,
  output: a,
  prompt: r
}) {
  return F(a, e).length === 0 ? /* @__PURE__ */ t(
    C,
    {
      className: "ws-node-detail-media",
      output: a,
      emptyText: "暂无媒体内容",
      mediaLayout: "chat"
    }
  ) : /* @__PURE__ */ t(d, { fallback: /* @__PURE__ */ t(m, { label: "正在加载媒体预览" }), children: /* @__PURE__ */ t(
    P,
    {
      kind: e,
      mediaItems: j(a, e),
      downloadable: !0,
      className: "ws-node-detail-media-gallery",
      supplementalText: e === "audio" ? _(a) || (r ? { label: "语音文本", text: r } : null) : null,
      attachmentUrls: L(a, "file").map(
        (l) => l.url
      )
    }
  ) });
}
function ee({
  content: e,
  readonly: a,
  onChange: r
}) {
  const o = e.value, l = (i) => {
    r(c(e, { ...o, ...i }));
  };
  return /* @__PURE__ */ u("div", { className: "ws-node-detail-file-editor", children: [
    /* @__PURE__ */ u("div", { className: "ws-node-detail-file-block", children: [
      /* @__PURE__ */ t("span", { "aria-hidden": "true", children: /* @__PURE__ */ t(B, { size: 24 }) }),
      /* @__PURE__ */ u("div", { children: [
        a ? /* @__PURE__ */ t("strong", { children: o.name || "文件" }) : /* @__PURE__ */ t(
          "input",
          {
            value: o.name,
            "aria-label": "文件名称",
            placeholder: "文件名称",
            onChange: (i) => l({ name: i.target.value })
          }
        ),
        /* @__PURE__ */ t("small", { children: o.url })
      ] }),
      /* @__PURE__ */ t(W, { label: "下载文件", children: /* @__PURE__ */ t(
        U,
        {
          url: o.url,
          name: o.name,
          label: "下载文件"
        }
      ) })
    ] }),
    a ? /* @__PURE__ */ t("p", { children: o.description || "暂无文件说明" }) : /* @__PURE__ */ t(
      "textarea",
      {
        value: o.description,
        rows: 8,
        placeholder: "补充文件说明",
        onChange: (i) => l({ description: i.target.value })
      }
    )
  ] });
}
export {
  me as NodeDetailEditor
};
