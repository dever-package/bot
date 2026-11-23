import { j as t, b, a as p, c as g } from "./preloadable-B6QZqbLd.js";
import { S as f, a as O, d as j } from "./file-kind-Cq3pESGF.js";
import { b as L } from "./vendor-icons-IZIW7U43.js";
import { C as R, p as F } from "./space-content-view-BZ7HjOCd.js";
import { d as P, j as U, k as Y, l as z, B as q } from "./asset-audio-preview-CWf3Wq_n.js";
import { M as H, R as J } from "./media-inspector-gallery-B1Jisuon.js";
import { n as c, C as h } from "./node-detail-header-DivpGPu9.js";
import { S as Q, a as X, b as N, c as Z } from "./space-storyboard-workspace-kBS_Eipq.js";
const $ = g(
  () => import("./space-storyboard-view-DxUCKIRv.js")
), W = b(
  $,
  (e) => e.StoryboardView
), K = W.Component, ee = g(
  () => import("./node-detail-storyboard-grid-NFxghCLU.js").then((e) => e.n)
), te = b(
  ee,
  (e) => e.NodeDetailStoryboardGrid
), ae = te.Component, re = g(
  () => import("./asset-text-content-editor-BbBivzxn.js").then((e) => e.c)
), oe = b(
  re,
  (e) => e.AssetTextContentEditor
), ie = oe.Component;
function ve({
  content: e,
  assetKind: r,
  mediaOutput: i,
  mediaKind: a,
  mediaPrompt: l,
  readonly: o,
  referenceItems: v,
  canvasNodes: S,
  canvasEdges: u,
  storyboardSourceNodeId: T,
  storyboardFocus: C,
  storyboardInitialSectionId: D,
  storyboardWorkspace: s,
  storyboardWorkflowAction: I,
  storyboardWorkTypes: M,
  storyboardReferencePurposes: E,
  referenceProvider: y,
  onConfirmStoryboard: A,
  onCreateStoryboardRevision: G,
  onGenerateStoryboardShot: _,
  onSaveStoryboardShotEdit: w,
  storyboardPromptVersion: V,
  onChange: m
}) {
  if (i !== void 0 && (a === "image" || a === "video"))
    return /* @__PURE__ */ t(x, { kind: a, output: i });
  if (i !== void 0 && a === "audio")
    return /* @__PURE__ */ t(
      x,
      {
        kind: "audio",
        output: i,
        prompt: l
      }
    );
  if (i !== void 0)
    return /* @__PURE__ */ t(
      R,
      {
        className: "ws-node-detail-media",
        output: i,
        emptyText: "暂无媒体内容",
        mediaLayout: "chat"
      }
    );
  if (e.mode === "setting")
    return /* @__PURE__ */ t(
      Q,
      {
        groups: s?.groups || [],
        onReferenceResult: o ? void 0 : s?.onReferenceResult,
        settings: { materials: F(e.value)?.materials },
        renderNode: s?.renderNode || (() => null),
        variant: "detail"
      }
    );
  if (e.mode === "storyboard_grid")
    return /* @__PURE__ */ t(f, { fallback: /* @__PURE__ */ t(h, { label: "正在加载分镜宫格" }), children: /* @__PURE__ */ t(
      ae,
      {
        grid: e.value,
        readonly: o,
        referenceProvider: y,
        onChange: (n) => m(c(e, n))
      }
    ) });
  if (e.mode === "storyboard") {
    const n = e.value;
    return /* @__PURE__ */ t(f, { fallback: /* @__PURE__ */ t(h, { label: "正在加载分镜内容" }), children: /* @__PURE__ */ t(
      K,
      {
        storyboard: n,
        editable: !o,
        referenceItems: v,
        canvasNodes: S,
        canvasEdges: u,
        storyboardSourceNodeId: T,
        workTypeSpecs: M,
        purposeSpecs: E,
        focus: C,
        workflowAction: I,
        onConfirm: A,
        onCreateRevision: G,
        onGenerateShot: _,
        onSaveShotEdit: w && ((d) => w(c(e, d))),
        promptVersion: V,
        productionGroups: s?.groups,
        onChange: (d) => m(c(e, d)),
        showSaveStatus: !1,
        renderWorkspace: (d, k, B) => /* @__PURE__ */ t(
          le,
          {
            initialSectionId: C?.section === "materials" ? X : D,
            storyboardWorkspace: s,
            onReferenceResult: o ? void 0 : s?.onReferenceResult,
            mediaAspect: n.aspect_ratio,
            settings: k,
            scriptContent: d,
            overviewContent: B
          }
        )
      }
    ) });
  }
  return e.mode === "file" ? /* @__PURE__ */ t(
    se,
    {
      content: e,
      readonly: o,
      onChange: m
    }
  ) : /* @__PURE__ */ t(f, { fallback: /* @__PURE__ */ t(h, { label: "正在加载内容编辑器" }), children: /* @__PURE__ */ t("div", { className: "ws-node-detail-editor", children: /* @__PURE__ */ t(
    ie,
    {
      kind: r === "richtext" ? "richtext" : "text",
      value: String(e.value || ""),
      contentFormat: e.format,
      readonly: o,
      onChange: (n) => m(c(e, n))
    }
  ) }) });
}
function le({
  initialSectionId: e,
  storyboardWorkspace: r,
  onReferenceResult: i,
  mediaAspect: a,
  settings: l,
  scriptContent: o,
  overviewContent: v
}) {
  const [S, u] = O(
    e || N
  );
  return j(() => {
    u(e || N);
  }, [e]), /* @__PURE__ */ t(
    Z,
    {
      variant: "detail",
      activeSectionId: S,
      groups: r?.groups || [],
      settingSource: r?.settingSource,
      onReferenceResult: i,
      settings: l,
      mediaAspect: a,
      scriptContent: /* @__PURE__ */ p("div", { className: "ws-node-detail-storyboard", children: [
        o,
        /* @__PURE__ */ t("aside", { className: "ws-node-detail-storyboard-overview", "aria-label": "内容简介", children: v })
      ] }),
      renderNode: r?.renderNode || (() => null),
      onActiveSectionChange: u
    }
  );
}
function x({
  kind: e,
  output: r,
  prompt: i
}) {
  return P(r, e).length === 0 ? /* @__PURE__ */ t(
    R,
    {
      className: "ws-node-detail-media",
      output: r,
      emptyText: "暂无媒体内容",
      mediaLayout: "chat"
    }
  ) : /* @__PURE__ */ t(f, { fallback: /* @__PURE__ */ t(h, { label: "正在加载媒体预览" }), children: /* @__PURE__ */ t(
    H,
    {
      kind: e,
      mediaItems: z(r, e),
      downloadable: !0,
      className: "ws-node-detail-media-gallery",
      supplementalText: e === "audio" ? Y(r) || (i ? { label: "语音文本", text: i } : null) : null,
      attachmentUrls: U(r, "file").map(
        (l) => l.url
      )
    }
  ) });
}
function se({
  content: e,
  readonly: r,
  onChange: i
}) {
  const a = e.value, l = (o) => {
    i(c(e, { ...a, ...o }));
  };
  return /* @__PURE__ */ p("div", { className: "ws-node-detail-file-editor", children: [
    /* @__PURE__ */ p("div", { className: "ws-node-detail-file-block", children: [
      /* @__PURE__ */ t("span", { "aria-hidden": "true", children: /* @__PURE__ */ t(L, { size: 24 }) }),
      /* @__PURE__ */ p("div", { children: [
        r ? /* @__PURE__ */ t("strong", { children: a.name || "文件" }) : /* @__PURE__ */ t(
          "input",
          {
            value: a.name,
            "aria-label": "文件名称",
            placeholder: "文件名称",
            onChange: (o) => l({ name: o.target.value })
          }
        ),
        /* @__PURE__ */ t("small", { children: a.url })
      ] }),
      /* @__PURE__ */ t(q, { label: "下载文件", children: /* @__PURE__ */ t(
        J,
        {
          url: a.url,
          name: a.name,
          label: "下载文件"
        }
      ) })
    ] }),
    r ? /* @__PURE__ */ t("p", { children: a.description || "暂无文件说明" }) : /* @__PURE__ */ t(
      "textarea",
      {
        value: a.description,
        rows: 8,
        placeholder: "补充文件说明",
        onChange: (o) => l({ description: o.target.value })
      }
    )
  ] });
}
export {
  ve as NodeDetailEditor
};
