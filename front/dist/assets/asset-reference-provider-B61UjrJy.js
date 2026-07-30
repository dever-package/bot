import { j as s, a as y, F as re } from "./createLucideIcon-Gw0gLVQ5.js";
import { c as T, u as O, a as se, b as U } from "./runtime-entry-CkPHMDB1.js";
import { b as W, A as ae, l as oe, c as ce, d as le, f as G } from "./upload-asset-api-JzPGB3fW.js";
import { L as de } from "./loader-circle-3ZsHTZm7.js";
import { U as ue } from "./upload-A6t_uL3M.js";
import { X as fe } from "./x-CDJG94MJ.js";
import { c as me } from "./react-dom-C2oimP4o.js";
function pe({
  open: e,
  teamID: n,
  scopeProjectID: c = 0,
  title: u = "选择资产",
  description: A = "使用资产当前版本",
  initialFilters: k,
  allowedKinds: m,
  initialSelectedAssetIDs: S = [],
  usedAssetIDs: M = [],
  multiple: l = !1,
  maxSelection: g = 1,
  confirmSelection: d = !1,
  contentMode: N = "preview",
  validateAsset: E,
  uploadAccept: I,
  onUpload: x,
  onClose: f,
  onConfirm: L
}) {
  const a = JSON.stringify(S), K = T(
    () => X(JSON.parse(a)),
    [a]
  ), $ = JSON.stringify(k || {}), P = T(
    () => JSON.parse($),
    [$]
  ), [p, F] = O(
    K
  ), [Q, v] = O(/* @__PURE__ */ new Map()), [V, _] = O(
    P
  ), [j, w] = O(""), [h, D] = O(!1), [Y, Z] = O(0), q = se(null), b = l ? Math.max(1, g) : 1;
  U(() => {
    e && (F(K.slice(0, b)), v(/* @__PURE__ */ new Map()), _(P), w(""), D(!1));
  }, [
    P,
    K,
    e,
    b,
    c,
    n
  ]), U(() => {
    if (!e) return;
    const t = (r) => {
      r.key === "Escape" && !h && f();
    };
    return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t);
  }, [f, e, h]);
  async function ee(t) {
    const r = Array.from(t.target.files || []);
    if (t.target.value = "", !x || r.length === 0 || h) return;
    const i = l ? Math.max(b - p.length, 0) : 1;
    if (i <= 0) {
      w(`最多选择 ${b} 项资产。`);
      return;
    }
    D(!0), w("");
    const o = [], R = [];
    try {
      for (const J of r.slice(0, i))
        try {
          const z = await x([J]);
          for (const B of z) {
            const C = E?.(B) || "";
            C ? R.push(`${J.name}：${C}`) : B.id > 0 && o.push(B);
          }
        } catch (z) {
          R.push(`${J.name}：${he(z, "上传失败")}`);
        }
      o.length > 0 && (te(o), _({
        sourceType: "upload",
        kind: m?.length === 1 ? m[0] : ""
      }), Z((J) => J + 1)), w(R.join("；"));
    } finally {
      D(!1);
    }
  }
  function te(t) {
    const r = Array.from(
      new Map(t.map((i) => [i.id, i])).values()
    );
    v((i) => {
      const o = new Map(i);
      return r.forEach((R) => o.set(R.id, R)), o;
    }), F(
      (i) => l ? X([
        ...i,
        ...r.map((o) => o.id)
      ]).slice(0, b) : r[0] ? [r[0].id] : i
    );
  }
  function ne(t) {
    if (d && l && p.includes(t.id)) {
      F((i) => i.filter((o) => o !== t.id)), v((i) => {
        const o = new Map(i);
        return o.delete(t.id), o;
      }), w("");
      return;
    }
    const r = E?.(t) || "";
    if (r) {
      w(r);
      return;
    }
    if (w(""), !d) {
      L([t], [t.id]), f();
      return;
    }
    if (!l) {
      F([t.id]), v(/* @__PURE__ */ new Map([[t.id, t]]));
      return;
    }
    if (p.length >= b) {
      w(`最多选择 ${b} 项资产。`);
      return;
    }
    F((i) => [...i, t.id]), v((i) => new Map(i).set(t.id, t));
  }
  function ie() {
    const t = p.map((r) => Q.get(r)).filter((r) => !!r);
    L(t, p), f();
  }
  return !e || typeof document > "u" ? null : me(
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
        children: /* @__PURE__ */ y("div", { className: "wb-asset-reference-dialog", children: [
          /* @__PURE__ */ y("header", { children: [
            /* @__PURE__ */ y("div", { children: [
              /* @__PURE__ */ s("h2", { children: u }),
              /* @__PURE__ */ s("p", { children: A })
            ] }),
            /* @__PURE__ */ s(W, { label: "关闭", children: /* @__PURE__ */ y("button", { type: "button", disabled: h, onClick: f, children: [
              /* @__PURE__ */ s(fe, { "aria-hidden": "true" }),
              /* @__PURE__ */ s("span", { className: "sr-only", children: "关闭" })
            ] }) })
          ] }),
          j ? /* @__PURE__ */ s("p", { className: "wb-asset-picker-message", children: j }) : null,
          /* @__PURE__ */ s(
            ae,
            {
              teamID: n,
              scopeProjectID: c,
              initialFilters: V,
              allowedKinds: m,
              contentMode: N,
              selectable: !0,
              excludeCollections: !0,
              selectedAssetIDs: p,
              usedAssetIDs: M,
              reloadSignal: Y,
              onAssetChanged: (t) => {
                p.includes(t.id) && v(
                  (r) => new Map(r).set(t.id, t)
                );
              },
              onAssetRemoved: (t) => {
                F(
                  (r) => r.filter((i) => i !== t)
                ), v((r) => {
                  const i = new Map(r);
                  return i.delete(t), i;
                });
              },
              headerAction: x ? /* @__PURE__ */ y(re, { children: [
                /* @__PURE__ */ s(W, { label: "本地上传", children: /* @__PURE__ */ y(
                  "button",
                  {
                    type: "button",
                    className: "wb-asset-local-upload",
                    disabled: h,
                    onClick: () => q.current?.click(),
                    children: [
                      h ? /* @__PURE__ */ s(de, { className: "is-spinning", "aria-hidden": "true" }) : /* @__PURE__ */ s(ue, { "aria-hidden": "true" }),
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
                    onChange: ee
                  }
                )
              ] }) : void 0,
              onSelect: ne
            }
          ),
          d ? /* @__PURE__ */ y("footer", { className: "wb-asset-picker-footer", children: [
            /* @__PURE__ */ y("span", { children: [
              "已选 ",
              p.length,
              l ? ` / ${b}` : "",
              " 项"
            ] }),
            /* @__PURE__ */ y("div", { children: [
              /* @__PURE__ */ s("button", { type: "button", onClick: f, children: "取消" }),
              /* @__PURE__ */ s(
                "button",
                {
                  type: "button",
                  className: "is-primary",
                  disabled: h || p.length === 0,
                  onClick: ie,
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
function Re({
  teamID: e,
  scopeProjectID: n = 0,
  initialFilters: c,
  allowedKinds: u,
  onSelect: A,
  onUpload: k
}) {
  const m = JSON.stringify(c || {}), S = JSON.stringify(u || []), M = T(
    () => JSON.parse(m),
    [m]
  ), l = T(
    () => JSON.parse(S),
    [S]
  );
  return T(
    () => ({
      trigger: "@",
      referenceTypes: ["asset"],
      loadPreview: async (g) => {
        const d = await oe(e, g.refId), N = H(d.asset);
        return {
          refType: "asset",
          refId: d.asset.id,
          title: d.asset.name,
          text: d.asset.summary,
          media: N,
          content: N.length > 0 ? void 0 : ce(
            d.asset.kind,
            d.asset.version?.content
          )
        };
      },
      renderPicker: (g) => /* @__PURE__ */ s(
        ye,
        {
          ...g,
          teamID: e,
          scopeProjectID: n,
          initialFilters: M,
          allowedKinds: l,
          onReferenceSelect: A,
          onUpload: k
        }
      )
    }),
    [A, k, n, M, l, e]
  );
}
function ye({
  open: e,
  teamID: n,
  scopeProjectID: c,
  initialFilters: u,
  allowedKinds: A,
  acceptedKinds: k,
  preferredUsage: m,
  maxSelection: S = 1,
  selectedReferences: M = [],
  onReferenceSelect: l,
  onUpload: g,
  onSelect: d,
  onClose: N
}) {
  const E = we(k), I = be(
    A || [],
    E
  ), x = Math.max(1, Number(S || 1)), f = Array.from(
    new Set(
      M.flatMap(
        (a) => a.ref_type === "asset" && Number(a.ref_id || 0) > 0 ? [Number(a.ref_id)] : []
      )
    )
  ), L = new Set(f);
  return /* @__PURE__ */ s(
    pe,
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
      validateAsset: (a) => L.has(a.id) ? "该素材已使用" : G(a.version?.content, a.kind) ? "" : "该资产当前版本没有可用文件，无法用于此参数。",
      uploadAccept: le(I),
      onUpload: g ? (a) => g(a, {
        preferredUsage: m,
        acceptedKinds: I
      }) : void 0,
      onClose: N,
      onConfirm: (a) => {
        for (const K of a) {
          const $ = ge(K, m);
          l?.($), d($);
        }
      }
    }
  );
}
function ge(e, n = "") {
  const c = H(e);
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
function we(e) {
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
function be(e, n) {
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
function H(e) {
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
  pe as A,
  Re as u
};
