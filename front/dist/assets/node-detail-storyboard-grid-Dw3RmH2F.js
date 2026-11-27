import { p as I, a as f, u as g } from "./file-kind-X0KKJPkQ.js";
import { a as p, j as n } from "./preloadable-CbkzeflN.js";
import { S as w } from "./space-node-runtime-CTTiHQ3e.js";
import { a6 as S } from "./vendor-icons-B1zF1_4n.js";
import { S as D } from "./space-content-view-BelgOwBR.js";
const k = I(void 0);
function x({
  grid: r,
  readonly: e,
  referenceProvider: s,
  onChange: d
}) {
  const [i, o] = f(""), [c, l] = f(null), v = g(
    () => _(r),
    [r]
  );
  function u(t, a) {
    d({
      ...r,
      frames: r.frames.map(
        (m, b) => b === t ? { ...m, ...a } : m
      )
    });
  }
  async function y(t) {
    if (!(c === null || t.refType !== "asset"))
      try {
        const a = await C(s, t);
        if (!a) {
          o("所选资产当前版本没有可用图片");
          return;
        }
        u(c, {
          image: a,
          assetID: t.refId,
          assetVersionID: Number(t.versionID || 0),
          status: "success",
          error: ""
        }), l(null);
      } catch (a) {
        o(
          a instanceof Error ? a.message : "读取图片资产失败"
        );
      }
  }
  return /* @__PURE__ */ p("div", { className: "ws-node-detail-storyboard-grid", children: [
    /* @__PURE__ */ n(
      w,
      {
        message: i,
        onDismiss: () => o("")
      }
    ),
    /* @__PURE__ */ n(
      D,
      {
        grid: r,
        variant: "detail",
        readonly: e,
        onFrameChange: u,
        renderFrameAction: !e && s?.renderPicker ? (t, a) => /* @__PURE__ */ p(
          "button",
          {
            type: "button",
            className: "ws-storyboard-grid-output-replace",
            onClick: () => l(a),
            children: [
              /* @__PURE__ */ n(S, { size: 14 }),
              /* @__PURE__ */ n("span", { children: t.image ? "替换图片" : "导入图片" })
            ]
          }
        ) : void 0
      }
    ),
    s?.renderPicker?.({
      open: c !== null,
      acceptedKinds: ["image"],
      maxSelection: 1,
      selectedReferences: v,
      onSelect: (t) => {
        y(t);
      },
      onClose: () => l(null)
    })
  ] });
}
function _(r) {
  return r.frames.flatMap(
    (e) => e.assetID > 0 ? [
      {
        type: "reference",
        ref_type: "asset",
        ref_id: e.assetID,
        ref_version_id: e.assetVersionID || void 0,
        label: e.title
      }
    ] : []
  );
}
async function C(r, e) {
  const s = e.preview?.sourceUrl || e.preview?.url;
  return s || r?.loadPreview && (await r.loadPreview({
    refType: e.refType,
    refId: e.refId,
    label: e.label,
    trigger: e.trigger,
    versionId: e.versionID
  })).media.find((i) => i.kind === "image")?.url || "";
}
const E = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  NodeDetailStoryboardGrid: x
}, Symbol.toStringTag, { value: "Module" }));
export {
  k as C,
  E as n
};
