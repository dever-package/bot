import { j as r, a as m } from "./react-HSzdbxZ7.js";
import { S as h, a as C, d as R, u as P } from "./file-kind-D6bMOzYN.js";
import { b as V, ae as j } from "./vendor-icons-fVDtJt66.js";
import { o as M, C as E, e as B, q as L, B as O, A as z, S as U } from "./asset-preview-DGKZUP9q.js";
import { M as $, R as W } from "./media-inspector-gallery-D2I16r7j.js";
import { d as D, a as N } from "./preloadable-CT3tMmBD.js";
import { g as y } from "./space-ordered-list-CMPTqlTO.js";
import { o as S, S as q } from "./writing-run-labels-3Ti7hIo6.js";
import { S as x, a as Y } from "./space-storyboard-workspace-DOlz4o_g.js";
const H = N(
  () => import("./space-storyboard-view-BEiH6oY7.js")
), J = D(
  H,
  (e) => e.StoryboardView
), Q = J.Component, X = N(
  () => Promise.resolve().then(() => le)
), Z = D(
  X,
  (e) => e.NodeDetailStoryboardGrid
), K = Z.Component, ee = N(
  () => import("./asset-text-content-editor-AII5IOWa.js").then((e) => e.c)
), re = D(
  ee,
  (e) => e.AssetTextContentEditor
), te = re.Component;
function ye({
  content: e,
  assetKind: t,
  mediaOutput: a,
  mediaKind: o,
  mediaPrompt: d,
  readonly: i,
  referenceItems: c,
  canvasNodes: u,
  storyboardSourceNodeId: g,
  storyboardFocus: f,
  storyboardInitialSectionId: w,
  storyboardWorkspace: s,
  storyboardWorkflowAction: n,
  storyboardWorkTypes: p,
  storyboardReferencePurposes: I,
  referenceProvider: k,
  onConfirmStoryboard: _,
  onCreateStoryboardRevision: A,
  onGenerateStoryboardShot: F,
  onChange: b
}) {
  if (a !== void 0 && (o === "image" || o === "video"))
    return /* @__PURE__ */ r(T, { kind: o, output: a });
  if (a !== void 0 && o === "audio") {
    const l = M(a, "audio");
    if (l.length > 0 && (l.length > 1 || l[0]?.thumbnail))
      return /* @__PURE__ */ r(T, { kind: "audio", output: a });
    const v = l[0]?.url || "";
    return /* @__PURE__ */ r("div", { className: "wb-detail-readonly-content is-audio", children: /* @__PURE__ */ r(z, { src: v, prompt: d, detailed: !0 }) });
  }
  if (a !== void 0)
    return /* @__PURE__ */ r(
      E,
      {
        className: "ws-node-detail-media",
        output: a,
        emptyText: "暂无媒体内容",
        mediaLayout: "chat"
      }
    );
  if (e.mode === "storyboard_grid")
    return /* @__PURE__ */ r(h, { fallback: /* @__PURE__ */ r(S, { label: "正在加载分镜宫格" }), children: /* @__PURE__ */ r(
      K,
      {
        grid: e.value,
        readonly: i,
        referenceProvider: k,
        onChange: (l) => b(y(e, l))
      }
    ) });
  if (e.mode === "storyboard") {
    const l = e.value, v = /* @__PURE__ */ r("div", { className: "ws-node-detail-storyboard", children: /* @__PURE__ */ r(h, { fallback: /* @__PURE__ */ r(S, { label: "正在加载分镜内容" }), children: /* @__PURE__ */ r(
      Q,
      {
        storyboard: l,
        editable: !i,
        referenceItems: c,
        canvasNodes: u,
        storyboardSourceNodeId: g,
        workTypeSpecs: p,
        purposeSpecs: I,
        focus: f,
        workflowAction: n,
        onConfirm: _,
        onCreateRevision: A,
        onGenerateShot: F,
        onChange: (G) => b(y(e, G)),
        showSaveStatus: !1
      }
    ) }) });
    return s ? /* @__PURE__ */ r(
      ae,
      {
        initialSectionId: w,
        storyboardWorkspace: s,
        scriptMeta: `${l.shots.length} 个镜头`,
        scriptContent: v
      }
    ) : v;
  }
  return e.mode === "file" ? /* @__PURE__ */ r(
    oe,
    {
      content: e,
      readonly: i,
      onChange: b
    }
  ) : /* @__PURE__ */ r(h, { fallback: /* @__PURE__ */ r(S, { label: "正在加载内容编辑器" }), children: /* @__PURE__ */ r("div", { className: "ws-node-detail-editor", children: /* @__PURE__ */ r(
    te,
    {
      kind: t === "richtext" ? "richtext" : "text",
      value: String(e.value || ""),
      contentFormat: e.format,
      readonly: i,
      onChange: (l) => b(y(e, l))
    }
  ) }) });
}
function ae({
  initialSectionId: e,
  storyboardWorkspace: t,
  scriptMeta: a,
  scriptContent: o
}) {
  const [d, i] = C(
    e || x
  );
  return R(() => {
    i(e || x);
  }, [e]), /* @__PURE__ */ r(
    Y,
    {
      variant: "detail",
      activeSectionId: d,
      groups: t.groups,
      scriptMeta: a,
      scriptContent: o,
      renderNode: t.renderNode,
      onActiveSectionChange: i
    }
  );
}
function T({
  kind: e,
  output: t
}) {
  return B(t, e).length === 0 ? /* @__PURE__ */ r(
    E,
    {
      className: "ws-node-detail-media",
      output: t,
      emptyText: "暂无媒体内容",
      mediaLayout: "chat"
    }
  ) : /* @__PURE__ */ r(h, { fallback: /* @__PURE__ */ r(S, { label: "正在加载媒体预览" }), children: /* @__PURE__ */ r(
    $,
    {
      kind: e,
      mediaItems: M(t, e),
      downloadable: !0,
      className: "ws-node-detail-media-gallery",
      supplementalText: e === "audio" ? L(t) : null
    }
  ) });
}
function oe({
  content: e,
  readonly: t,
  onChange: a
}) {
  const o = e.value, d = (i) => {
    a(y(e, { ...o, ...i }));
  };
  return /* @__PURE__ */ m("div", { className: "ws-node-detail-file-editor", children: [
    /* @__PURE__ */ m("div", { className: "ws-node-detail-file-block", children: [
      /* @__PURE__ */ r("span", { "aria-hidden": "true", children: /* @__PURE__ */ r(V, { size: 24 }) }),
      /* @__PURE__ */ m("div", { children: [
        t ? /* @__PURE__ */ r("strong", { children: o.name || "文件" }) : /* @__PURE__ */ r(
          "input",
          {
            value: o.name,
            "aria-label": "文件名称",
            placeholder: "文件名称",
            onChange: (i) => d({ name: i.target.value })
          }
        ),
        /* @__PURE__ */ r("small", { children: o.url })
      ] }),
      /* @__PURE__ */ r(O, { label: "下载文件", children: /* @__PURE__ */ r(
        W,
        {
          url: o.url,
          name: o.name,
          label: "下载文件"
        }
      ) })
    ] }),
    t ? /* @__PURE__ */ r("p", { children: o.description || "暂无文件说明" }) : /* @__PURE__ */ r(
      "textarea",
      {
        value: o.description,
        rows: 8,
        placeholder: "补充文件说明",
        onChange: (i) => d({ description: i.target.value })
      }
    )
  ] });
}
function ie({
  grid: e,
  readonly: t,
  referenceProvider: a,
  onChange: o
}) {
  const [d, i] = C(""), [c, u] = C(null), g = P(
    () => se(e),
    [e]
  );
  function f(s, n) {
    o({
      ...e,
      frames: e.frames.map(
        (p, I) => I === s ? { ...p, ...n } : p
      )
    });
  }
  async function w(s) {
    if (!(c === null || s.refType !== "asset"))
      try {
        const n = await ne(a, s);
        if (!n) {
          i("所选资产当前版本没有可用图片");
          return;
        }
        f(c, {
          image: n,
          assetID: s.refId,
          assetVersionID: Number(s.versionID || 0),
          status: "success",
          error: ""
        }), u(null);
      } catch (n) {
        i(
          n instanceof Error ? n.message : "读取图片资产失败"
        );
      }
  }
  return /* @__PURE__ */ m("div", { className: "ws-node-detail-storyboard-grid", children: [
    /* @__PURE__ */ r(
      q,
      {
        message: d,
        onDismiss: () => i("")
      }
    ),
    /* @__PURE__ */ r(
      U,
      {
        grid: e,
        variant: "detail",
        readonly: t,
        onFrameChange: f,
        renderFrameAction: !t && a?.renderPicker ? (s, n) => /* @__PURE__ */ m(
          "button",
          {
            type: "button",
            className: "ws-storyboard-grid-output-replace",
            onClick: () => u(n),
            children: [
              /* @__PURE__ */ r(j, { size: 14 }),
              /* @__PURE__ */ r("span", { children: s.image ? "替换图片" : "导入图片" })
            ]
          }
        ) : void 0
      }
    ),
    a?.renderPicker?.({
      open: c !== null,
      acceptedKinds: ["image"],
      maxSelection: 1,
      selectedReferences: g,
      onSelect: (s) => {
        w(s);
      },
      onClose: () => u(null)
    })
  ] });
}
function se(e) {
  return e.frames.flatMap(
    (t) => t.assetID > 0 ? [
      {
        type: "reference",
        ref_type: "asset",
        ref_id: t.assetID,
        ref_version_id: t.assetVersionID || void 0,
        label: t.title
      }
    ] : []
  );
}
async function ne(e, t) {
  const a = t.preview?.sourceUrl || t.preview?.url;
  return a || e?.loadPreview && (await e.loadPreview({
    refType: t.refType,
    refId: t.refId,
    label: t.label,
    trigger: t.trigger,
    versionId: t.versionID
  })).media.find((d) => d.kind === "image")?.url || "";
}
const le = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  NodeDetailStoryboardGrid: ie
}, Symbol.toStringTag, { value: "Module" }));
export {
  ye as NodeDetailEditor
};
