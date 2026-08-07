import { j as l } from "./createLucideIcon-fWv1XcFy.js";
import { i as b, S as A, l as M } from "./runtime-entry-ClkZDmNs.js";
import { c as R } from "./site-config-DrnclGFw.js";
import { l as O, a as I, b as P, f as N, c as D, d as z } from "./storyboard-grid-view-BldHSQpc.js";
const J = M(
  () => import("./stream-request-HZQ_bZ-N.js").then((e) => e.b).then((e) => ({
    default: e.AssetPickerDialog
  }))
);
function Q({
  teamID: e,
  scopeProjectID: t = 0,
  initialFilters: n,
  allowedKinds: i,
  onSelect: r,
  onUpload: o
}) {
  const d = JSON.stringify(n || {}), p = JSON.stringify(i || []), m = b(
    () => JSON.parse(d),
    [d]
  ), g = b(
    () => JSON.parse(p),
    [p]
  );
  return b(
    () => ({
      trigger: "@",
      referenceTypes: ["asset"],
      loadPreview: async (c) => {
        const a = await O(e, c.refId), u = h(a.asset);
        return {
          refType: "asset",
          refId: a.asset.id,
          title: a.asset.name,
          text: a.asset.summary,
          media: u,
          content: u.length > 0 ? void 0 : I(
            a.asset.kind,
            a.asset.version?.content
          )
        };
      },
      renderPicker: (c) => /* @__PURE__ */ l(
        L,
        {
          ...c,
          teamID: e,
          scopeProjectID: t,
          initialFilters: m,
          allowedKinds: g,
          onReferenceSelect: r,
          onUpload: o
        }
      )
    }),
    [r, o, t, m, g, e]
  );
}
function L({
  open: e,
  teamID: t,
  scopeProjectID: n,
  initialFilters: i,
  allowedKinds: r,
  acceptedKinds: o,
  preferredUsage: d,
  maxSelection: p = 1,
  selectedReferences: m = [],
  onReferenceSelect: g,
  onUpload: c,
  onSelect: a,
  onSelectMany: u,
  onClose: S
}) {
  if (!e)
    return null;
  const w = C(o), v = _(
    r || [],
    w
  ), k = Math.max(1, Number(p || 1)), x = Array.from(
    new Set(
      m.flatMap(
        (s) => s.ref_type === "asset" && Number(s.ref_id || 0) > 0 ? [Number(s.ref_id)] : []
      )
    )
  ), K = new Set(x);
  return /* @__PURE__ */ l(A, { fallback: /* @__PURE__ */ l(T, {}), children: /* @__PURE__ */ l(
    J,
    {
      open: !0,
      teamID: t,
      scopeProjectID: n,
      title: "选择资产",
      description: "插入资产当前版本",
      initialFilters: i,
      allowedKinds: v,
      multiple: k > 1,
      maxSelection: k,
      confirmSelection: !0,
      contentMode: "full",
      usedAssetIDs: x,
      validateAsset: (s) => K.has(s.id) ? "该素材已使用" : h(s).length > 0 ? "" : "该资产当前版本没有可用文件，无法用于此参数。",
      uploadAccept: P(v),
      onUpload: c ? (s) => c(s, {
        preferredUsage: d,
        acceptedKinds: v
      }) : void 0,
      onClose: S,
      onConfirm: (s) => {
        const y = s.map(
          (f) => $(f, d)
        );
        for (const f of y)
          g?.(f);
        if (u) {
          u(y);
          return;
        }
        for (const f of y)
          a(f);
      }
    }
  ) });
}
function T() {
  return typeof document > "u" ? null : R(
    /* @__PURE__ */ l(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        "aria-busy": "true",
        style: {
          position: "fixed",
          inset: 0,
          zIndex: 1200,
          display: "grid",
          placeItems: "center",
          background: "rgba(15, 23, 42, 0.38)"
        },
        children: /* @__PURE__ */ l(
          "div",
          {
            style: {
              border: "1px solid rgba(148, 163, 184, 0.32)",
              borderRadius: 6,
              background: "var(--body-work-surface-raised, #ffffff)",
              color: "var(--body-work-text, #111827)",
              padding: "14px 18px",
              boxShadow: "0 14px 36px rgba(15, 23, 42, 0.18)"
            },
            children: "正在加载资产选择器"
          }
        )
      }
    ),
    document.body
  );
}
function $(e, t = "") {
  const n = h(e);
  return {
    key: `asset:${e.id}:${e.versionID}`,
    refType: "asset",
    refId: e.id,
    versionID: e.versionID,
    trigger: "@",
    usage: t,
    label: e.name,
    description: e.summary,
    preview: {
      text: e.summary,
      kind: n[0]?.kind || e.kind,
      url: n[0]?.url
    },
    output: e.version?.content,
    asset: e,
    mediaCount: n.length
  };
}
function C(e) {
  const t = /* @__PURE__ */ new Set([
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
      (e || []).flatMap((n) => {
        const i = String(n || "").trim();
        return t.has(i) ? [i] : [];
      })
    )
  );
}
function _(e, t) {
  if (e.length === 0)
    return t;
  if (t.length === 0)
    return e;
  const n = new Set(t);
  return e.filter((i) => n.has(i));
}
const F = /* @__PURE__ */ new Set([
  "image",
  "video",
  "audio",
  "file"
]);
function h(e) {
  const t = e.version?.content, n = j(t, e.kind), i = n.length > 0 ? n : F.has(e.kind) ? N(t, e.kind).map((r) => ({
    kind: e.kind,
    url: r
  })) : [];
  return i.map((r, o) => ({
    refType: "asset",
    refId: e.id,
    kind: r.kind,
    label: i.length > 1 ? `${e.name} · ${o + 1}` : e.name,
    url: r.url,
    index: o + 1
  }));
}
function j(e, t) {
  const n = D(e), i = q(t);
  return (i && n.includes(i) ? [i] : n).flatMap(
    (o) => z(e, o).map((d) => ({ kind: o, url: d }))
  );
}
function q(e) {
  return e === "image" || e === "video" || e === "audio" ? e : "";
}
export {
  Q as u
};
