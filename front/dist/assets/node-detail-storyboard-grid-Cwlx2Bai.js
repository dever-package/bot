import { h as y, l as b, d as I } from "./react-C7Xtl8sB.js";
import { j as u, a as o } from "./_commonjsHelpers-CTFd9u1x.js";
import { Q as g } from "./vendor-icons-Cc7Kl3It.js";
import { t as f } from "./index-BxqXLJC9.js";
import { S as w } from "./storyboard-grid-view-CJXm84yJ.js";
const P = y(void 0);
function D({
  grid: r,
  readonly: e,
  referenceProvider: s,
  onChange: c
}) {
  const [n, i] = b(null), m = I(
    () => S(r),
    [r]
  );
  function l(t, a) {
    c({
      ...r,
      frames: r.frames.map(
        (d, v) => v === t ? { ...d, ...a } : d
      )
    });
  }
  async function p(t) {
    if (!(n === null || t.refType !== "asset"))
      try {
        const a = await x(s, t);
        if (!a) {
          f.error("所选资产当前版本没有可用图片");
          return;
        }
        l(n, {
          image: a,
          assetID: t.refId,
          assetVersionID: Number(t.versionID || 0),
          status: "success",
          error: ""
        }), i(null);
      } catch (a) {
        f.error(a instanceof Error ? a.message : "读取图片资产失败");
      }
  }
  return /* @__PURE__ */ u("div", { className: "ws-node-detail-storyboard-grid", children: [
    /* @__PURE__ */ o(
      w,
      {
        grid: r,
        variant: "detail",
        readonly: e,
        onFrameChange: l,
        renderFrameAction: !e && s?.renderPicker ? (t, a) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            className: "ws-storyboard-grid-output-replace",
            onClick: () => i(a),
            children: [
              /* @__PURE__ */ o(g, { size: 14 }),
              /* @__PURE__ */ o("span", { children: t.image ? "替换图片" : "导入图片" })
            ]
          }
        ) : void 0
      }
    ),
    s?.renderPicker?.({
      open: n !== null,
      acceptedKinds: ["image"],
      maxSelection: 1,
      selectedReferences: m,
      onSelect: (t) => {
        p(t);
      },
      onClose: () => i(null)
    })
  ] });
}
function S(r) {
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
async function x(r, e) {
  const s = e.preview?.sourceUrl || e.preview?.url;
  return s || r?.loadPreview && (await r.loadPreview({
    refType: e.refType,
    refId: e.refId,
    label: e.label,
    trigger: e.trigger,
    versionId: e.versionID
  })).media.find((n) => n.kind === "image")?.url || "";
}
const k = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  NodeDetailStoryboardGrid: D
}, Symbol.toStringTag, { value: "Module" }));
export {
  P as C,
  k as n
};
