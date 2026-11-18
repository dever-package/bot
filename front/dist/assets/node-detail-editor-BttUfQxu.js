import { j as t, a as f } from "./space-storyboard-material-ECvLpyk_.js";
import { S as u, a as _, d as B } from "./file-kind-Cq3pESGF.js";
import { b as F } from "./vendor-icons-BZHLe0mm.js";
import { C } from "./space-content-view-DfYKFqXc.js";
import { e as L, l as P, m as j, n as O, B as U } from "./asset-audio-preview-Cezm24us.js";
import { M as z, R as Y } from "./media-inspector-gallery-BR6rzcOx.js";
import { d as h, a as b } from "./space-assistant-layout-Drz4je9C.js";
import { p as $, n as m } from "./writing-reference-Bgk4pNta.js";
import { C as p } from "./node-detail-header-Cn59agL3.js";
import { S as q, a as S, b as H, c as J } from "./space-storyboard-workspace-D4am3NFT.js";
const Q = b(
  () => import("./space-storyboard-view-DSDW_IK3.js")
), W = h(
  Q,
  (e) => e.StoryboardView
), X = W.Component, Z = b(
  () => import("./node-detail-storyboard-grid-BTpwDOfS.js").then((e) => e.n)
), K = h(
  Z,
  (e) => e.NodeDetailStoryboardGrid
), ee = K.Component, te = b(
  () => import("./asset-text-content-editor-CdwCCnqA.js").then((e) => e.c)
), ae = h(
  te,
  (e) => e.AssetTextContentEditor
), oe = ae.Component;
function be({
  content: e,
  assetKind: o,
  mediaOutput: r,
  mediaKind: a,
  mediaPrompt: l,
  readonly: i,
  referenceItems: d,
  canvasNodes: w,
  canvasEdges: x,
  storyboardSourceNodeId: N,
  storyboardFocus: y,
  storyboardInitialSectionId: M,
  storyboardWorkspace: n,
  storyboardWorkflowAction: T,
  storyboardWorkTypes: D,
  storyboardReferencePurposes: E,
  referenceProvider: A,
  onConfirmStoryboard: I,
  onCreateStoryboardRevision: k,
  onGenerateStoryboardShot: R,
  onChange: c
}) {
  if (r !== void 0 && (a === "image" || a === "video"))
    return /* @__PURE__ */ t(g, { kind: a, output: r });
  if (r !== void 0 && a === "audio")
    return /* @__PURE__ */ t(
      g,
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
  if (e.mode === "setting")
    return /* @__PURE__ */ t(
      q,
      {
        groups: n?.groups || [],
        mediaAspect: $(e.value)?.aspect_ratio,
        renderNode: n?.renderNode || (() => null),
        variant: "detail"
      }
    );
  if (e.mode === "storyboard_grid")
    return /* @__PURE__ */ t(u, { fallback: /* @__PURE__ */ t(p, { label: "正在加载分镜宫格" }), children: /* @__PURE__ */ t(
      ee,
      {
        grid: e.value,
        readonly: i,
        referenceProvider: A,
        onChange: (s) => c(m(e, s))
      }
    ) });
  if (e.mode === "storyboard") {
    const s = e.value, v = /* @__PURE__ */ t("div", { className: "ws-node-detail-storyboard", children: /* @__PURE__ */ t(u, { fallback: /* @__PURE__ */ t(p, { label: "正在加载分镜内容" }), children: /* @__PURE__ */ t(J, { workspace: n, children: (G) => /* @__PURE__ */ t(
      X,
      {
        storyboard: s,
        editable: !i,
        referenceItems: d,
        canvasNodes: w,
        canvasEdges: x,
        storyboardSourceNodeId: N,
        workTypeSpecs: D,
        purposeSpecs: E,
        focus: y,
        workspaceSlots: G,
        workflowAction: T,
        onConfirm: I,
        onCreateRevision: k,
        onGenerateShot: R,
        onChange: (V) => c(m(e, V)),
        showSaveStatus: !1
      }
    ) }) }) });
    return n ? /* @__PURE__ */ t(
      re,
      {
        initialSectionId: M,
        storyboardWorkspace: n,
        scriptMeta: `${s.shots.length} 个镜头`,
        mediaAspect: s.aspect_ratio,
        scriptContent: v
      }
    ) : v;
  }
  return e.mode === "file" ? /* @__PURE__ */ t(
    ie,
    {
      content: e,
      readonly: i,
      onChange: c
    }
  ) : /* @__PURE__ */ t(u, { fallback: /* @__PURE__ */ t(p, { label: "正在加载内容编辑器" }), children: /* @__PURE__ */ t("div", { className: "ws-node-detail-editor", children: /* @__PURE__ */ t(
    oe,
    {
      kind: o === "richtext" ? "richtext" : "text",
      value: String(e.value || ""),
      contentFormat: e.format,
      readonly: i,
      onChange: (s) => c(m(e, s))
    }
  ) }) });
}
function re({
  initialSectionId: e,
  storyboardWorkspace: o,
  scriptMeta: r,
  mediaAspect: a,
  scriptContent: l
}) {
  const [i, d] = _(
    e || S
  );
  return B(() => {
    d(e || S);
  }, [e]), /* @__PURE__ */ t(
    H,
    {
      variant: "detail",
      activeSectionId: i,
      groups: o.groups,
      settingSource: o.settingSource,
      scriptMeta: r,
      mediaAspect: a,
      scriptContent: l,
      renderNode: o.renderNode,
      onActiveSectionChange: d
    }
  );
}
function g({
  kind: e,
  output: o,
  prompt: r
}) {
  return L(o, e).length === 0 ? /* @__PURE__ */ t(
    C,
    {
      className: "ws-node-detail-media",
      output: o,
      emptyText: "暂无媒体内容",
      mediaLayout: "chat"
    }
  ) : /* @__PURE__ */ t(u, { fallback: /* @__PURE__ */ t(p, { label: "正在加载媒体预览" }), children: /* @__PURE__ */ t(
    z,
    {
      kind: e,
      mediaItems: O(o, e),
      downloadable: !0,
      className: "ws-node-detail-media-gallery",
      supplementalText: e === "audio" ? j(o) || (r ? { label: "语音文本", text: r } : null) : null,
      attachmentUrls: P(o, "file").map(
        (l) => l.url
      )
    }
  ) });
}
function ie({
  content: e,
  readonly: o,
  onChange: r
}) {
  const a = e.value, l = (i) => {
    r(m(e, { ...a, ...i }));
  };
  return /* @__PURE__ */ f("div", { className: "ws-node-detail-file-editor", children: [
    /* @__PURE__ */ f("div", { className: "ws-node-detail-file-block", children: [
      /* @__PURE__ */ t("span", { "aria-hidden": "true", children: /* @__PURE__ */ t(F, { size: 24 }) }),
      /* @__PURE__ */ f("div", { children: [
        o ? /* @__PURE__ */ t("strong", { children: a.name || "文件" }) : /* @__PURE__ */ t(
          "input",
          {
            value: a.name,
            "aria-label": "文件名称",
            placeholder: "文件名称",
            onChange: (i) => l({ name: i.target.value })
          }
        ),
        /* @__PURE__ */ t("small", { children: a.url })
      ] }),
      /* @__PURE__ */ t(U, { label: "下载文件", children: /* @__PURE__ */ t(
        Y,
        {
          url: a.url,
          name: a.name,
          label: "下载文件"
        }
      ) })
    ] }),
    o ? /* @__PURE__ */ t("p", { children: a.description || "暂无文件说明" }) : /* @__PURE__ */ t(
      "textarea",
      {
        value: a.description,
        rows: 8,
        placeholder: "补充文件说明",
        onChange: (i) => l({ description: i.target.value })
      }
    )
  ] });
}
export {
  be as NodeDetailEditor
};
