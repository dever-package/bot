import { j as g } from "./react-D9GkiX5b.js";
import { u as b, S as x } from "./file-kind-D6bMOzYN.js";
import { d as O, a as P } from "./preloadable-CT3tMmBD.js";
import { l as R, b as T, a as $ } from "./text-content-save-actions-CJZJZrHM.js";
import { a as N, b as C, c as L, f as _, d as I, e as J } from "./asset-preview-qznc7rjG.js";
const { Component: D } = O(
  P(() => import("./protected-5-nodes-body-work-asset-asset-picker-dialog-tsx-qdPTyxzK.js")),
  (e) => e.AssetPickerDialog
);
function Y({
  teamID: e,
  scopeProjectID: n = 0,
  initialFilters: i,
  allowedKinds: t,
  notificationMode: o,
  onSelect: a,
  onUpload: d
}) {
  const c = JSON.stringify(i || {}), p = JSON.stringify(t || []), y = b(
    () => JSON.parse(c),
    [c]
  ), v = b(
    () => JSON.parse(p),
    [p]
  );
  return b(
    () => ({
      trigger: "@",
      referenceTypes: ["asset", "material"],
      loadPreview: async (s) => {
        const l = s.refType === "material" ? await R(e, s.refId) : (await T(e, s.refId)).asset, f = h(l);
        return {
          refType: s.refType,
          refId: l.id,
          title: l.name,
          text: l.summary,
          media: f,
          content: f.length > 0 ? void 0 : N(l.kind, l.version?.content)
        };
      },
      renderPicker: (s) => /* @__PURE__ */ g(
        z,
        {
          ...s,
          teamID: e,
          scopeProjectID: n,
          initialFilters: y,
          allowedKinds: v,
          notificationMode: o,
          onReferenceSelect: a,
          onUpload: d
        }
      )
    }),
    [
      o,
      a,
      d,
      n,
      y,
      v,
      e
    ]
  );
}
function z({
  open: e,
  teamID: n,
  scopeProjectID: i,
  initialFilters: t,
  allowedKinds: o,
  notificationMode: a,
  acceptedKinds: d,
  preferredUsage: c,
  maxSelection: p = 1,
  selectedReferences: y = [],
  onReferenceSelect: v,
  onUpload: s,
  onSelect: l,
  onSelectMany: f,
  onClose: M
}) {
  if (!e)
    return null;
  const w = j(d), K = B(
    o || [],
    w
  ), k = Math.max(1, Number(p || 1)), S = Array.from(
    new Set(
      y.flatMap(
        (r) => (r.ref_type === "asset" || r.ref_type === "material") && Number(r.ref_id || 0) > 0 ? [`${r.ref_type}:${Number(r.ref_id)}`] : []
      )
    )
  ), A = new Set(S);
  return /* @__PURE__ */ g(x, { fallback: /* @__PURE__ */ g("span", { role: "status", children: "正在加载素材…" }), children: /* @__PURE__ */ g(
    D,
    {
      open: !0,
      teamID: n,
      scopeProjectID: i,
      title: "选择素材",
      description: `从个人资产或团队${L("official")}中选择`,
      initialFilters: t,
      allowedKinds: K,
      notificationMode: a,
      multiple: k > 1,
      maxSelection: k,
      confirmSelection: !0,
      contentMode: "full",
      usedAssetKeys: S,
      validateAsset: (r) => A.has($(r)) ? "该素材已使用" : r.kind === "text" || r.kind === "richtext" || h(r).length > 0 ? "" : "该素材没有可用文件，无法使用。",
      uploadAccept: C(K),
      onUpload: s ? (r, u) => s(r, {
        preferredUsage: c,
        acceptedKinds: K,
        onProgress: u?.onProgress
      }) : void 0,
      onClose: M,
      onConfirm: (r) => {
        const u = r.map(
          (m) => F(m, c)
        );
        for (const m of u)
          v?.(m);
        if (f) {
          f(u);
          return;
        }
        for (const m of u)
          l(m);
      }
    }
  ) });
}
function F(e, n = "") {
  const i = h(e), t = e.libraryType === "material" ? "material" : "asset";
  return {
    key: t === "material" ? `material:${e.id}` : `asset:${e.id}:${e.versionID}`,
    refType: t,
    refId: e.id,
    versionID: t === "asset" ? e.versionID : void 0,
    trigger: "@",
    usage: n,
    label: e.name,
    description: e.summary,
    preview: {
      text: e.summary,
      kind: i[0]?.kind || e.kind,
      url: i[0]?.url
    },
    output: e.version?.content,
    asset: e,
    mediaCount: i.length
  };
}
function j(e) {
  const n = /* @__PURE__ */ new Set([
    "collection",
    "text",
    "image",
    "audio",
    "video",
    "richtext",
    "file"
  ]);
  return Array.from(
    new Set(
      (e || []).flatMap((i) => {
        const t = String(i || "").trim();
        return n.has(t) ? [t] : [];
      })
    )
  );
}
function B(e, n) {
  if (e.length === 0)
    return n;
  if (n.length === 0)
    return e;
  const i = new Set(n);
  return e.filter((t) => i.has(t));
}
const E = /* @__PURE__ */ new Set([
  "image",
  "video",
  "audio",
  "file"
]);
function h(e) {
  const n = e.version?.content, i = G(n, e.kind), t = i.length > 0 ? i : E.has(e.kind) ? _(n, e.kind).map((o) => ({
    kind: e.kind,
    url: o
  })) : [];
  return t.map((o, a) => ({
    refType: e.libraryType === "material" ? "material" : "asset",
    refId: e.id,
    kind: o.kind,
    label: t.length > 1 ? `${e.name} · ${a + 1}` : e.name,
    url: o.url,
    index: a + 1
  }));
}
function G(e, n) {
  const i = I(e), t = H(n);
  return (t && i.includes(t) ? [t] : i).flatMap(
    (a) => J(e, a).map((d) => ({ kind: a, url: d }))
  );
}
function H(e) {
  return e === "image" || e === "video" || e === "audio" ? e : "";
}
export {
  Y as u
};
