import { j as n, a as c, F as pe } from "./react-HSzdbxZ7.js";
import { X as me } from "./vendor-icons-fVDtJt66.js";
import { u as W, a as y, b as X, d as G } from "./file-kind-D6bMOzYN.js";
import { c as ge } from "./preloadable-CT3tMmBD.js";
import { B as ye, i as he } from "./asset-preview-DGKZUP9q.js";
import { r as be } from "./site-config-kAiWSd_3.js";
import { A as we, a as Me } from "./asset-browser-DgQYKyXg.js";
import { c as Ae } from "./asset-upload-progress-BIgxpzPg.js";
import { a as w } from "./text-content-save-actions-BS73syOd.js";
function Be({
  open: d,
  teamID: h,
  scopeProjectID: K = 0,
  title: P = "选择资产",
  description: Q = "使用资产当前版本",
  initialFilters: V,
  allowedKinds: k,
  initialSelectedAssetIDs: R = [],
  initialSelectedAssetKeys: T = [],
  usedAssetIDs: Y = [],
  usedAssetKeys: Z = [],
  includeOfficial: _ = !0,
  multiple: u = !1,
  maxSelection: C = 1,
  confirmSelection: v = !1,
  contentMode: ee = "preview",
  notificationMode: te,
  validateAsset: q,
  uploadAccept: se,
  onUpload: S,
  onClose: f,
  onConfirm: O
}) {
  const re = JSON.stringify({
    initialSelectedAssetIDs: R,
    initialSelectedAssetKeys: T
  }), $ = W(
    () => H([
      ...T,
      ...R.map((t) => `asset:${t}`)
    ]),
    [re]
  ), U = JSON.stringify(V || {}), x = W(
    () => JSON.parse(U),
    [U]
  ), [i, b] = y(
    $
  ), [ne, p] = y(/* @__PURE__ */ new Map()), [ae, j] = y(
    x
  ), [J, o] = y(""), [m, F] = y(!1), [ie, A] = y(null), [oe, le] = y(0), z = X(null), I = X(null), l = u ? Math.max(1, C) : 1;
  G(() => {
    d && (b($.slice(0, l)), p(/* @__PURE__ */ new Map()), j(x), o(""), F(!1), A(null));
  }, [
    x,
    $,
    d,
    l,
    K,
    h
  ]), G(() => {
    if (!d) return;
    const t = (e) => {
      e.key !== "Escape" || !he(I.current) || (e.preventDefault(), e.stopImmediatePropagation(), m || f());
    };
    return window.addEventListener("keydown", t, !0), () => window.removeEventListener("keydown", t, !0);
  }, [f, d, m]);
  async function ce(t) {
    const e = Array.from(t.target.files || []);
    if (t.target.value = "", !S || e.length === 0 || m) return;
    const s = u ? Math.max(l - i.length, 0) : 1;
    if (s <= 0) {
      o(`最多选择 ${l} 项素材。`);
      return;
    }
    const r = e.slice(0, s), a = Ae(
      r,
      A
    );
    F(!0), A(null), o("");
    const N = [], E = [];
    try {
      for (const [M, L] of r.entries()) {
        a.start(M);
        try {
          const B = await S([L], {
            onProgress: (g) => a.report(
              M,
              g.loaded,
              g.total,
              g.phase
            )
          });
          for (const g of B) {
            const D = q?.(g) || "";
            D ? E.push(`${L.name}：${D}`) : g.id > 0 && N.push(g);
          }
        } catch (B) {
          E.push(`${L.name}：${be(B, "上传失败")}`);
        } finally {
          a.complete(M);
        }
      }
      N.length > 0 && (de(N), j({
        sourceType: "upload",
        kind: k?.length === 1 ? k[0] : ""
      }), le((M) => M + 1)), o(E.join("；"));
    } finally {
      F(!1), A(null);
    }
  }
  function de(t) {
    const e = Array.from(
      new Map(t.map((s) => [w(s), s])).values()
    );
    p((s) => {
      const r = new Map(s);
      return e.forEach((a) => r.set(w(a), a)), r;
    }), b(
      (s) => u ? H([
        ...s,
        ...e.map(w)
      ]).slice(0, l) : e[0] ? [w(e[0])] : s
    );
  }
  function ue(t) {
    const e = w(t);
    if (v && u && i.includes(e)) {
      b(
        (r) => r.filter((a) => a !== e)
      ), p((r) => {
        const a = new Map(r);
        return a.delete(e), a;
      }), o("");
      return;
    }
    const s = q?.(t) || "";
    if (s) {
      o(s);
      return;
    }
    if (o(""), !v) {
      O([t], [e]), f();
      return;
    }
    if (!u) {
      b([e]), p(/* @__PURE__ */ new Map([[e, t]]));
      return;
    }
    if (i.length >= l) {
      o(`最多选择 ${l} 项素材。`);
      return;
    }
    b((r) => [...r, e]), p((r) => new Map(r).set(e, t));
  }
  function fe() {
    const t = i.map((e) => ne.get(e)).filter((e) => !!e);
    O(t, i), f();
  }
  return !d || typeof document > "u" ? null : ge(
    /* @__PURE__ */ n(
      "div",
      {
        ref: I,
        className: "wb-asset-reference-backdrop",
        "data-slot": "dialog-layer",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": P,
        onMouseDown: (t) => {
          t.target === t.currentTarget && !m && f();
        },
        children: /* @__PURE__ */ c("div", { className: "wb-asset-reference-dialog", children: [
          /* @__PURE__ */ c("header", { children: [
            /* @__PURE__ */ c("div", { children: [
              /* @__PURE__ */ n("h2", { children: P }),
              /* @__PURE__ */ n("p", { children: Q })
            ] }),
            /* @__PURE__ */ n(ye, { label: "关闭", children: /* @__PURE__ */ c("button", { type: "button", disabled: m, onClick: f, children: [
              /* @__PURE__ */ n(me, { "aria-hidden": "true" }),
              /* @__PURE__ */ n("span", { className: "sr-only", children: "关闭" })
            ] }) })
          ] }),
          J ? /* @__PURE__ */ n("p", { className: "wb-asset-picker-message", children: J }) : null,
          /* @__PURE__ */ n(
            we,
            {
              teamID: h,
              scopeProjectID: K,
              initialFilters: ae,
              allowedKinds: k,
              contentMode: ee,
              notificationMode: te,
              detailLayer: "nested",
              selectable: !0,
              selectedAssetKeys: i,
              usedAssetIDs: Y,
              usedAssetKeys: Z,
              includeOfficial: _,
              reloadSignal: oe,
              onAssetChanged: (t) => {
                const e = w(t);
                i.includes(e) && p(
                  (s) => new Map(s).set(e, t)
                );
              },
              onAssetRemoved: (t) => {
                const e = `asset:${t}`;
                b(
                  (s) => s.filter((r) => r !== e)
                ), p((s) => {
                  const r = new Map(s);
                  return r.delete(e), r;
                });
              },
              headerAction: S ? /* @__PURE__ */ c(pe, { children: [
                /* @__PURE__ */ n(
                  Me,
                  {
                    uploading: m,
                    progress: ie,
                    onClick: () => z.current?.click()
                  }
                ),
                /* @__PURE__ */ n(
                  "input",
                  {
                    ref: z,
                    type: "file",
                    hidden: !0,
                    multiple: u,
                    accept: se,
                    onChange: ce
                  }
                )
              ] }) : void 0,
              onSelect: ue
            }
          ),
          v ? /* @__PURE__ */ c("footer", { className: "wb-asset-picker-footer", children: [
            /* @__PURE__ */ c("span", { children: [
              "已选 ",
              i.length,
              u ? ` / ${l}` : "",
              " 项"
            ] }),
            /* @__PURE__ */ c("div", { children: [
              /* @__PURE__ */ n("button", { type: "button", onClick: f, children: "取消" }),
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "is-primary",
                  disabled: m || i.length === 0,
                  onClick: fe,
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
function H(d) {
  return Array.from(
    new Set(
      d.map((h) => String(h || "").trim()).filter((h) => /^(asset|material):[1-9]\d*$/.test(h))
    )
  );
}
export {
  Be as AssetPickerDialog
};
