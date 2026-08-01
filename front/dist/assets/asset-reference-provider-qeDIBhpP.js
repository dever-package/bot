import { j as s, a as g, F as se } from "./createLucideIcon-CEtb6KSk.js";
import { c as J, u as R, a as ae, b as U } from "./runtime-entry-CIrzyMsA.js";
import { b as W, A as oe, l as ce, h as le, j as de, k as G } from "./upload-asset-api-DAbIOMVJ.js";
import { L as ue } from "./loader-circle-QnfinZ3F.js";
import { U as fe } from "./upload-I0iT6F7Q.js";
import { X as me } from "./x-D8YQA7_X.js";
import { c as pe } from "./react-dom-C2oimP4o.js";
function H({
  open: e,
  teamID: n,
  scopeProjectID: c = 0,
  title: u = "选择资产",
  description: k = "使用资产当前版本",
  initialFilters: A,
  allowedKinds: m,
  initialSelectedAssetIDs: S = [],
  usedAssetIDs: M = [],
  multiple: l = !1,
  maxSelection: y = 1,
  confirmSelection: d = !1,
  contentMode: N = "preview",
  validateAsset: P,
  uploadAccept: I,
  onUpload: x,
  onClose: f,
  onConfirm: E
}) {
  const a = JSON.stringify(S), K = J(
    () => X(JSON.parse(a)),
    [a]
  ), T = JSON.stringify(A || {}), L = J(
    () => JSON.parse(T),
    [T]
  ), [p, O] = R(
    K
  ), [V, v] = R(/* @__PURE__ */ new Map()), [Y, z] = R(
    L
  ), [B, b] = R(""), [h, _] = R(!1), [Z, ee] = R(0), q = ae(null), w = l ? Math.max(1, y) : 1;
  U(() => {
    e && (O(K.slice(0, w)), v(/* @__PURE__ */ new Map()), z(L), b(""), _(!1));
  }, [
    L,
    K,
    e,
    w,
    c,
    n
  ]), U(() => {
    if (!e) return;
    const t = (r) => {
      r.key === "Escape" && !h && f();
    };
    return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t);
  }, [f, e, h]);
  async function te(t) {
    const r = Array.from(t.target.files || []);
    if (t.target.value = "", !x || r.length === 0 || h) return;
    const i = l ? Math.max(w - p.length, 0) : 1;
    if (i <= 0) {
      b(`最多选择 ${w} 项资产。`);
      return;
    }
    _(!0), b("");
    const o = [], F = [];
    try {
      for (const $ of r.slice(0, i))
        try {
          const D = await x([$]);
          for (const j of D) {
            const C = P?.(j) || "";
            C ? F.push(`${$.name}：${C}`) : j.id > 0 && o.push(j);
          }
        } catch (D) {
          F.push(`${$.name}：${he(D, "上传失败")}`);
        }
      o.length > 0 && (ne(o), z({
        sourceType: "upload",
        kind: m?.length === 1 ? m[0] : ""
      }), ee(($) => $ + 1)), b(F.join("；"));
    } finally {
      _(!1);
    }
  }
  function ne(t) {
    const r = Array.from(
      new Map(t.map((i) => [i.id, i])).values()
    );
    v((i) => {
      const o = new Map(i);
      return r.forEach((F) => o.set(F.id, F)), o;
    }), O(
      (i) => l ? X([
        ...i,
        ...r.map((o) => o.id)
      ]).slice(0, w) : r[0] ? [r[0].id] : i
    );
  }
  function ie(t) {
    if (d && l && p.includes(t.id)) {
      O((i) => i.filter((o) => o !== t.id)), v((i) => {
        const o = new Map(i);
        return o.delete(t.id), o;
      }), b("");
      return;
    }
    const r = P?.(t) || "";
    if (r) {
      b(r);
      return;
    }
    if (b(""), !d) {
      E([t], [t.id]), f();
      return;
    }
    if (!l) {
      O([t.id]), v(/* @__PURE__ */ new Map([[t.id, t]]));
      return;
    }
    if (p.length >= w) {
      b(`最多选择 ${w} 项资产。`);
      return;
    }
    O((i) => [...i, t.id]), v((i) => new Map(i).set(t.id, t));
  }
  function re() {
    const t = p.map((r) => V.get(r)).filter((r) => !!r);
    E(t, p), f();
  }
  return !e || typeof document > "u" ? null : pe(
    /* @__PURE__ */ s(
      "div",
      {
        className: "wb-asset-reference-backdrop",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": u,
        onMouseDown: (t) => {
          t.target === t.currentTarget && !h && f();
        },
        children: /* @__PURE__ */ g("div", { className: "wb-asset-reference-dialog", children: [
          /* @__PURE__ */ g("header", { children: [
            /* @__PURE__ */ g("div", { children: [
              /* @__PURE__ */ s("h2", { children: u }),
              /* @__PURE__ */ s("p", { children: k })
            ] }),
            /* @__PURE__ */ s(W, { label: "关闭", children: /* @__PURE__ */ g("button", { type: "button", disabled: h, onClick: f, children: [
              /* @__PURE__ */ s(me, { "aria-hidden": "true" }),
              /* @__PURE__ */ s("span", { className: "sr-only", children: "关闭" })
            ] }) })
          ] }),
          B ? /* @__PURE__ */ s("p", { className: "wb-asset-picker-message", children: B }) : null,
          /* @__PURE__ */ s(
            oe,
            {
              teamID: n,
              scopeProjectID: c,
              initialFilters: Y,
              allowedKinds: m,
              contentMode: N,
              selectable: !0,
              excludeCollections: !0,
              selectedAssetIDs: p,
              usedAssetIDs: M,
              reloadSignal: Z,
              onAssetChanged: (t) => {
                p.includes(t.id) && v(
                  (r) => new Map(r).set(t.id, t)
                );
              },
              onAssetRemoved: (t) => {
                O(
                  (r) => r.filter((i) => i !== t)
                ), v((r) => {
                  const i = new Map(r);
                  return i.delete(t), i;
                });
              },
              headerAction: x ? /* @__PURE__ */ g(se, { children: [
                /* @__PURE__ */ s(W, { label: "本地上传", children: /* @__PURE__ */ g(
                  "button",
                  {
                    type: "button",
                    className: "wb-asset-local-upload",
                    disabled: h,
                    onClick: () => q.current?.click(),
                    children: [
                      h ? /* @__PURE__ */ s(ue, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ s(fe, { "aria-hidden": "true" }),
                      /* @__PURE__ */ s("span", { children: h ? "上传中" : "本地上传" })
                    ]
                  }
                ) }),
                /* @__PURE__ */ s(
                  "input",
                  {
                    ref: q,
                    type: "file",
                    hidden: !0,
                    multiple: l,
                    accept: I,
                    onChange: te
                  }
                )
              ] }) : void 0,
              onSelect: ie
            }
          ),
          d ? /* @__PURE__ */ g("footer", { className: "wb-asset-picker-footer", children: [
            /* @__PURE__ */ g("span", { children: [
              "已选 ",
              p.length,
              l ? ` / ${w}` : "",
              " 项"
            ] }),
            /* @__PURE__ */ g("div", { children: [
              /* @__PURE__ */ s("button", { type: "button", onClick: f, children: "取消" }),
              /* @__PURE__ */ s(
                "button",
                {
                  type: "button",
                  className: "is-primary",
                  disabled: h || p.length === 0,
                  onClick: re,
                  children: "确认使用"
                }
              )
            ] })
          ] }) : null
        ] })
      }
    ),
    document.body
  );
}
function X(e) {
  return Array.from(
    new Set(e.map(Number).filter((n) => Number.isFinite(n) && n > 0))
  );
}
function he(e, n) {
  return e instanceof Error ? e.message : n;
}
const Fe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AssetPickerDialog: H
}, Symbol.toStringTag, { value: "Module" }));
function Re({
  teamID: e,
  scopeProjectID: n = 0,
  initialFilters: c,
  allowedKinds: u,
  onSelect: k,
  onUpload: A
}) {
  const m = JSON.stringify(c || {}), S = JSON.stringify(u || []), M = J(
    () => JSON.parse(m),
    [m]
  ), l = J(
    () => JSON.parse(S),
    [S]
  );
  return J(
    () => ({
      trigger: "@",
      referenceTypes: ["asset"],
      loadPreview: async (y) => {
        const d = await ce(e, y.refId), N = Q(d.asset);
        return {
          refType: "asset",
          refId: d.asset.id,
          title: d.asset.name,
          text: d.asset.summary,
          media: N,
          content: N.length > 0 ? void 0 : le(
            d.asset.kind,
            d.asset.version?.content
          )
        };
      },
      renderPicker: (y) => /* @__PURE__ */ s(
        ge,
        {
          ...y,
          teamID: e,
          scopeProjectID: n,
          initialFilters: M,
          allowedKinds: l,
          onReferenceSelect: k,
          onUpload: A
        }
      )
    }),
    [k, A, n, M, l, e]
  );
}
function ge({
  open: e,
  teamID: n,
  scopeProjectID: c,
  initialFilters: u,
  allowedKinds: k,
  acceptedKinds: A,
  preferredUsage: m,
  maxSelection: S = 1,
  selectedReferences: M = [],
  onReferenceSelect: l,
  onUpload: y,
  onSelect: d,
  onClose: N
}) {
  const P = be(A), I = we(
    k || [],
    P
  ), x = Math.max(1, Number(S || 1)), f = Array.from(
    new Set(
      M.flatMap(
        (a) => a.ref_type === "asset" && Number(a.ref_id || 0) > 0 ? [Number(a.ref_id)] : []
      )
    )
  ), E = new Set(f);
  return /* @__PURE__ */ s(
    H,
    {
      open: e,
      teamID: n,
      scopeProjectID: c,
      title: "选择资产",
      description: "插入资产当前版本",
      initialFilters: u,
      allowedKinds: I,
      multiple: x > 1,
      maxSelection: x,
      confirmSelection: !0,
      usedAssetIDs: f,
      validateAsset: (a) => E.has(a.id) ? "该素材已使用" : G(a.version?.content, a.kind) ? "" : "该资产当前版本没有可用文件，无法用于此参数。",
      uploadAccept: de(I),
      onUpload: y ? (a) => y(a, {
        preferredUsage: m,
        acceptedKinds: I
      }) : void 0,
      onClose: N,
      onConfirm: (a) => {
        for (const K of a) {
          const T = ye(K, m);
          l?.(T), d(T);
        }
      }
    }
  );
}
function ye(e, n = "") {
  const c = Q(e);
  return {
    key: `asset:${e.id}:${e.versionID}`,
    refType: "asset",
    refId: e.id,
    versionID: e.versionID,
    trigger: "@",
    usage: n,
    label: e.name,
    description: e.summary,
    preview: {
      text: e.summary,
      kind: e.kind,
      url: c[0]?.url
    }
  };
}
function be(e) {
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
      (e || []).flatMap((c) => {
        const u = String(c || "").trim();
        return n.has(u) ? [u] : [];
      })
    )
  );
}
function we(e, n) {
  if (e.length === 0)
    return n;
  if (n.length === 0)
    return e;
  const c = new Set(n);
  return e.filter((u) => c.has(u));
}
const ve = /* @__PURE__ */ new Set([
  "image",
  "video",
  "audio",
  "file"
]);
function Q(e) {
  if (!ve.has(e.kind))
    return [];
  const n = G(e.version?.content, e.kind);
  return n ? [
    {
      refType: "asset",
      refId: e.id,
      kind: e.kind,
      label: e.name,
      url: n
    }
  ] : [];
}
export {
  H as A,
  Fe as a,
  Re as u
};
