import { j as o, a as p } from "./react-CDpwMNlY.js";
import { S as c, a as j, b as G } from "./file-kind-DFeonxO2.js";
import { b as P } from "./vendor-icons-Cz5zFzlk.js";
import { h as g, C as w, n as m, j as V, k as B, B as L, A as F } from "./node-detail-content-DEcv8fc7.js";
import { M as $, R as z } from "./media-inspector-gallery-Ci5KbK6m.js";
import { d as h, c as f } from "./preloadable-B6OSmL0f.js";
import { g as u } from "./space-page-B7eY-TDj.js";
import { S as v, a as O } from "./space-storyboard-workspace-UCyQkU7R.js";
import { c as U } from "./asset-reference-provider-d_hsIG-H.js";
const W = f(
  () => import("./space-storyboard-view-BjtySfOj.js")
), Y = h(
  W,
  (e) => e.StoryboardView
), q = Y.Component, H = f(
  () => import("./node-detail-storyboard-grid-CH2K8EO1.js").then((e) => e.n)
), J = h(
  H,
  (e) => e.NodeDetailStoryboardGrid
), Q = J.Component, X = f(
  () => Promise.resolve().then(() => ae)
), Z = h(
  X,
  (e) => e.NodeDetailRichEditor
), K = Z.Component;
function pe({
  content: e,
  assetKind: r,
  mediaOutput: i,
  mediaKind: t,
  mediaPrompt: d,
  readonly: a,
  referenceItems: y,
  canvasNodes: N,
  storyboardSourceNodeId: C,
  storyboardFocus: D,
  storyboardInitialSectionId: x,
  storyboardWorkspace: b,
  storyboardWorkflowAction: R,
  storyboardWorkTypes: E,
  storyboardReferencePurposes: M,
  referenceProvider: T,
  onConfirmStoryboard: k,
  onCreateStoryboardRevision: A,
  onGenerateStoryboardShot: I,
  onChange: n
}) {
  if (i !== void 0 && (t === "image" || t === "video"))
    return /* @__PURE__ */ o(S, { kind: t, output: i });
  if (i !== void 0 && t === "audio") {
    const l = g(i, "audio");
    if (l.length > 0 && (l.length > 1 || l[0]?.thumbnail))
      return /* @__PURE__ */ o(S, { kind: "audio", output: i });
    const s = l[0]?.url || "";
    return /* @__PURE__ */ o("div", { className: "wb-detail-readonly-content is-audio", children: /* @__PURE__ */ o(F, { src: s, prompt: d, detailed: !0 }) });
  }
  if (i !== void 0)
    return /* @__PURE__ */ o(
      w,
      {
        className: "ws-node-detail-media",
        output: i,
        emptyText: "暂无媒体内容",
        mediaLayout: "chat"
      }
    );
  if (e.mode === "storyboard_grid")
    return /* @__PURE__ */ o(c, { fallback: /* @__PURE__ */ o(u, { label: "正在加载分镜宫格" }), children: /* @__PURE__ */ o(
      Q,
      {
        grid: e.value,
        readonly: a,
        referenceProvider: T,
        onChange: (l) => n(m(e, l))
      }
    ) });
  if (e.mode === "storyboard") {
    const l = e.value, s = /* @__PURE__ */ o("div", { className: "ws-node-detail-storyboard", children: /* @__PURE__ */ o(c, { fallback: /* @__PURE__ */ o(u, { label: "正在加载分镜内容" }), children: /* @__PURE__ */ o(
      q,
      {
        storyboard: l,
        layout: "split",
        editable: !a,
        referenceItems: y,
        canvasNodes: N,
        storyboardSourceNodeId: C,
        workTypeSpecs: E,
        purposeSpecs: M,
        focus: D,
        workflowAction: R,
        onConfirm: k,
        onCreateRevision: A,
        onGenerateShot: I,
        onChange: (_) => n(m(e, _)),
        showSaveStatus: !1
      }
    ) }) });
    return b ? /* @__PURE__ */ o(
      ee,
      {
        initialSectionId: x,
        storyboardWorkspace: b,
        scriptMeta: `${l.shots.length} 个镜头`,
        scriptContent: s
      }
    ) : s;
  }
  return e.mode === "file" ? /* @__PURE__ */ o(
    oe,
    {
      content: e,
      readonly: a,
      onChange: n
    }
  ) : /* @__PURE__ */ o(c, { fallback: /* @__PURE__ */ o(u, { label: "正在加载内容编辑器" }), children: /* @__PURE__ */ o(
    K,
    {
      content: e,
      kind: r === "richtext" ? "richtext" : "text",
      readonly: a,
      onChange: n
    }
  ) });
}
function ee({
  initialSectionId: e,
  storyboardWorkspace: r,
  scriptMeta: i,
  scriptContent: t
}) {
  const [d, a] = j(
    e || v
  );
  return G(() => {
    a(e || v);
  }, [e]), /* @__PURE__ */ o(
    O,
    {
      variant: "detail",
      activeSectionId: d,
      groups: r.groups,
      scriptMeta: i,
      scriptContent: t,
      renderNode: r.renderNode,
      onActiveSectionChange: a
    }
  );
}
function S({
  kind: e,
  output: r
}) {
  return V(r, e).length === 0 ? /* @__PURE__ */ o(
    w,
    {
      className: "ws-node-detail-media",
      output: r,
      emptyText: "暂无媒体内容",
      mediaLayout: "chat"
    }
  ) : /* @__PURE__ */ o(c, { fallback: /* @__PURE__ */ o(u, { label: "正在加载媒体预览" }), children: /* @__PURE__ */ o(
    $,
    {
      kind: e,
      mediaItems: g(r, e),
      downloadable: !0,
      className: "ws-node-detail-media-gallery",
      supplementalText: e === "audio" ? B(r) : null
    }
  ) });
}
function oe({
  content: e,
  readonly: r,
  onChange: i
}) {
  const t = e.value, d = (a) => {
    i(m(e, { ...t, ...a }));
  };
  return /* @__PURE__ */ p("div", { className: "ws-node-detail-file-editor", children: [
    /* @__PURE__ */ p("div", { className: "ws-node-detail-file-block", children: [
      /* @__PURE__ */ o("span", { "aria-hidden": "true", children: /* @__PURE__ */ o(P, { size: 24 }) }),
      /* @__PURE__ */ p("div", { children: [
        r ? /* @__PURE__ */ o("strong", { children: t.name || "文件" }) : /* @__PURE__ */ o(
          "input",
          {
            value: t.name,
            "aria-label": "文件名称",
            placeholder: "文件名称",
            onChange: (a) => d({ name: a.target.value })
          }
        ),
        /* @__PURE__ */ o("small", { children: t.url })
      ] }),
      /* @__PURE__ */ o(L, { label: "下载文件", children: /* @__PURE__ */ o(
        z,
        {
          url: t.url,
          name: t.name,
          label: "下载文件"
        }
      ) })
    ] }),
    r ? /* @__PURE__ */ o("p", { children: t.description || "暂无文件说明" }) : /* @__PURE__ */ o(
      "textarea",
      {
        value: t.description,
        rows: 8,
        placeholder: "补充文件说明",
        onChange: (a) => d({ description: a.target.value })
      }
    )
  ] });
}
function te({
  content: e,
  kind: r,
  readonly: i,
  onChange: t
}) {
  const d = String(e.value || "");
  return /* @__PURE__ */ o("div", { className: "ws-node-detail-editor", children: /* @__PURE__ */ o(
    U,
    {
      kind: r,
      value: d,
      contentFormat: e.format,
      readonly: i,
      onChange: (a) => t(m(e, a))
    }
  ) });
}
const ae = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  NodeDetailRichEditor: te
}, Symbol.toStringTag, { value: "Module" }));
export {
  pe as NodeDetailEditor
};
