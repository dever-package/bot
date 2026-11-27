import { j as a, b as N, a as p, c as R } from "./preloadable-CbkzeflN.js";
import { S as h, a as j, d as k } from "./file-kind-X0KKJPkQ.js";
import { b as L } from "./vendor-icons-B1zF1_4n.js";
import { C as x, p as F } from "./space-content-view-BelgOwBR.js";
import { A as P } from "./asset-text-content-editor-COkSNUSQ.js";
import { a as U, g as Y, h as z, j as q } from "./asset-audio-preview-DlcU6JQ0.js";
import { M as H, R as J } from "./media-inspector-gallery-B_v3I6YB.js";
import { B as Q } from "./asset-preview-B63J-8X6.js";
import { n as u, C as S } from "./node-detail-header-YT4Fy3hu.js";
import { S as X, a as Z, b as w, c as $ } from "./space-storyboard-workspace-D7SRlGZK.js";
const W = R(
  () => import("./space-storyboard-view-BVU1aEPb.js")
), K = N(
  W,
  (e) => e.StoryboardView
), ee = K.Component, ae = R(
  () => import("./node-detail-storyboard-grid-Dw3RmH2F.js").then((e) => e.n)
), te = N(
  ae,
  (e) => e.NodeDetailStoryboardGrid
), re = te.Component;
function he({
  content: e,
  assetKind: r,
  mediaOutput: i,
  mediaKind: t,
  mediaPrompt: l,
  readonly: o,
  referenceItems: f,
  canvasNodes: v,
  canvasEdges: c,
  storyboardSourceNodeId: T,
  storyboardFocus: b,
  storyboardInitialSectionId: D,
  storyboardWorkspace: s,
  storyboardWorkflowAction: I,
  storyboardWorkTypes: M,
  storyboardReferencePurposes: y,
  referenceProvider: A,
  onConfirmStoryboard: G,
  onCreateStoryboardRevision: _,
  onGenerateStoryboardShot: E,
  onSaveStoryboardShotEdit: g,
  storyboardPromptVersion: V,
  onChange: m
}) {
  if (i !== void 0 && (t === "image" || t === "video"))
    return /* @__PURE__ */ a(C, { kind: t, output: i });
  if (i !== void 0 && t === "audio")
    return /* @__PURE__ */ a(
      C,
      {
        kind: "audio",
        output: i,
        prompt: l
      }
    );
  if (i !== void 0)
    return /* @__PURE__ */ a(
      x,
      {
        className: "ws-node-detail-media",
        output: i,
        emptyText: "暂无媒体内容",
        mediaLayout: "chat"
      }
    );
  if (e.mode === "setting")
    return /* @__PURE__ */ a(
      X,
      {
        groups: s?.groups || [],
        onReferenceResult: o ? void 0 : s?.onReferenceResult,
        settings: { materials: F(e.value)?.materials },
        renderNode: s?.renderNode || (() => null),
        variant: "detail"
      }
    );
  if (e.mode === "storyboard_grid")
    return /* @__PURE__ */ a(h, { fallback: /* @__PURE__ */ a(S, { label: "正在加载分镜宫格" }), children: /* @__PURE__ */ a(
      re,
      {
        grid: e.value,
        readonly: o,
        referenceProvider: A,
        onChange: (n) => m(u(e, n))
      }
    ) });
  if (e.mode === "storyboard") {
    const n = e.value;
    return /* @__PURE__ */ a(h, { fallback: /* @__PURE__ */ a(S, { label: "正在加载分镜内容" }), children: /* @__PURE__ */ a(
      ee,
      {
        storyboard: n,
        editable: !o,
        referenceItems: f,
        canvasNodes: v,
        canvasEdges: c,
        storyboardSourceNodeId: T,
        workTypeSpecs: M,
        purposeSpecs: y,
        focus: b,
        workflowAction: I,
        onConfirm: G,
        onCreateRevision: _,
        onGenerateShot: E,
        onSaveShotEdit: g && ((d) => g(u(e, d))),
        promptVersion: V,
        productionGroups: s?.groups,
        onChange: (d) => m(u(e, d)),
        showSaveStatus: !1,
        renderWorkspace: (d, B, O) => /* @__PURE__ */ a(
          oe,
          {
            initialSectionId: b?.section === "materials" ? Z : D,
            storyboardWorkspace: s,
            onReferenceResult: o ? void 0 : s?.onReferenceResult,
            mediaAspect: n.aspect_ratio,
            settings: B,
            scriptContent: d,
            overviewContent: O
          }
        )
      }
    ) });
  }
  return e.mode === "file" ? /* @__PURE__ */ a(
    ie,
    {
      content: e,
      readonly: o,
      onChange: m
    }
  ) : /* @__PURE__ */ a("div", { className: "ws-node-detail-editor", children: /* @__PURE__ */ a(
    P,
    {
      kind: r === "richtext" ? "richtext" : "text",
      value: String(e.value || ""),
      contentFormat: e.format,
      readonly: o,
      onChange: (n) => m(u(e, n))
    }
  ) });
}
function oe({
  initialSectionId: e,
  storyboardWorkspace: r,
  onReferenceResult: i,
  mediaAspect: t,
  settings: l,
  scriptContent: o,
  overviewContent: f
}) {
  const [v, c] = j(
    e || w
  );
  return k(() => {
    c(e || w);
  }, [e]), /* @__PURE__ */ a(
    $,
    {
      variant: "detail",
      activeSectionId: v,
      groups: r?.groups || [],
      settingSource: r?.settingSource,
      onReferenceResult: i,
      settings: l,
      mediaAspect: t,
      scriptContent: /* @__PURE__ */ p("div", { className: "ws-node-detail-storyboard", children: [
        o,
        /* @__PURE__ */ a("aside", { className: "ws-node-detail-storyboard-overview", "aria-label": "内容简介", children: f })
      ] }),
      renderNode: r?.renderNode || (() => null),
      onActiveSectionChange: c
    }
  );
}
function C({
  kind: e,
  output: r,
  prompt: i
}) {
  return U(r, e).length === 0 ? /* @__PURE__ */ a(
    x,
    {
      className: "ws-node-detail-media",
      output: r,
      emptyText: "暂无媒体内容",
      mediaLayout: "chat"
    }
  ) : /* @__PURE__ */ a(h, { fallback: /* @__PURE__ */ a(S, { label: "正在加载媒体预览" }), children: /* @__PURE__ */ a(
    H,
    {
      kind: e,
      mediaItems: q(r, e),
      downloadable: !0,
      className: "ws-node-detail-media-gallery",
      supplementalText: e === "audio" ? z(r) || (i ? { label: "语音文本", text: i } : null) : null,
      attachmentUrls: Y(r, "file").map(
        (l) => l.url
      )
    }
  ) });
}
function ie({
  content: e,
  readonly: r,
  onChange: i
}) {
  const t = e.value, l = (o) => {
    i(u(e, { ...t, ...o }));
  };
  return /* @__PURE__ */ p("div", { className: "ws-node-detail-file-editor", children: [
    /* @__PURE__ */ p("div", { className: "ws-node-detail-file-block", children: [
      /* @__PURE__ */ a("span", { "aria-hidden": "true", children: /* @__PURE__ */ a(L, { size: 24 }) }),
      /* @__PURE__ */ p("div", { children: [
        r ? /* @__PURE__ */ a("strong", { children: t.name || "文件" }) : /* @__PURE__ */ a(
          "input",
          {
            value: t.name,
            "aria-label": "文件名称",
            placeholder: "文件名称",
            onChange: (o) => l({ name: o.target.value })
          }
        ),
        /* @__PURE__ */ a("small", { children: t.url })
      ] }),
      /* @__PURE__ */ a(Q, { label: "下载文件", children: /* @__PURE__ */ a(
        J,
        {
          url: t.url,
          name: t.name,
          label: "下载文件"
        }
      ) })
    ] }),
    r ? /* @__PURE__ */ a("p", { children: t.description || "暂无文件说明" }) : /* @__PURE__ */ a(
      "textarea",
      {
        value: t.description,
        rows: 8,
        placeholder: "补充文件说明",
        onChange: (o) => l({ description: o.target.value })
      }
    )
  ] });
}
export {
  he as NodeDetailEditor
};
