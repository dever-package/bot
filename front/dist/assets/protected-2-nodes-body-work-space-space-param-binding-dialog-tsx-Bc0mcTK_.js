import { j as e, a as n } from "./preloadable-CnUP9jgB.js";
import { b as y, d as v } from "./file-kind-Cq3pESGF.js";
import { t as D, X as N, u as z, v as E, n as h, M as I } from "./vendor-icons-B8sieP24.js";
import { c as L } from "./space-assistant-layout-B9KyeCM0.js";
import { B as x, D as _ } from "./asset-audio-preview-CsYcyVm8.js";
import { a as C } from "./space-story-setting-reference-CenSO-Ot.js";
function O({
  sourceTitle: m,
  targetTitle: f,
  params: u,
  selectedParamKey: b,
  media: i = !1,
  overDetail: g = !1,
  lyricsAvailable: t = !1,
  lyricsSelected: o = !1,
  editing: l = !1,
  onSelect: w,
  onSelectLyrics: k,
  onClose: s
}) {
  const d = y(null);
  v(() => {
    function a(r) {
      r.key === "Escape" && (r.preventDefault(), s());
    }
    return window.addEventListener("keydown", a), d.current?.focus(), () => window.removeEventListener("keydown", a);
  }, [s]);
  const p = /* @__PURE__ */ e("div", { className: "ws-param-binding-backdrop", onMouseDown: s, children: /* @__PURE__ */ n(
    "section",
    {
      className: "ws-param-binding-dialog",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "ws-param-binding-title",
      onMouseDown: (a) => a.stopPropagation(),
      children: [
        /* @__PURE__ */ n("header", { children: [
          /* @__PURE__ */ n("div", { children: [
            /* @__PURE__ */ e("h3", { id: "ws-param-binding-title", children: i ? "选择素材用途" : t ? "选择文本用途" : l ? "调整参数连接" : "传给哪个参数" }),
            /* @__PURE__ */ n("p", { children: [
              /* @__PURE__ */ e("span", { children: m || "上游节点" }),
              /* @__PURE__ */ e(D, { size: 13, "aria-hidden": "true" }),
              /* @__PURE__ */ e("span", { children: f || "下游能力" })
            ] })
          ] }),
          /* @__PURE__ */ e(x, { label: l ? "关闭" : "取消连接", children: /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              "aria-label": l ? "关闭" : "取消连接",
              onClick: s,
              children: /* @__PURE__ */ e(N, { size: 17 })
            }
          ) })
        ] }),
        /* @__PURE__ */ n(
          "div",
          {
            className: "ws-param-binding-options",
            "aria-label": i ? "素材用途" : t ? "文本用途" : "目标参数",
            children: [
              u.map((a, r) => {
                const c = b === a.key;
                return /* @__PURE__ */ n(
                  "button",
                  {
                    ref: r === 0 ? d : void 0,
                    type: "button",
                    className: c ? "is-selected" : "",
                    "aria-pressed": c,
                    onClick: () => w(a.key),
                    children: [
                      i ? /* @__PURE__ */ e(z, { size: 17, "aria-hidden": "true" }) : /* @__PURE__ */ e(E, { size: 17, "aria-hidden": "true" }),
                      /* @__PURE__ */ e("span", { children: /* @__PURE__ */ e("strong", { children: i ? a.name : C(a) }) }),
                      c ? /* @__PURE__ */ e(h, { className: "ws-param-binding-check", size: 16 }) : null
                    ]
                  },
                  a.key
                );
              }),
              t ? /* @__PURE__ */ n(
                "button",
                {
                  ref: u.length === 0 ? d : void 0,
                  type: "button",
                  className: o ? "is-selected" : "",
                  "aria-pressed": o,
                  onClick: k,
                  children: [
                    /* @__PURE__ */ e(I, { size: 17, "aria-hidden": "true" }),
                    /* @__PURE__ */ e("span", { children: /* @__PURE__ */ e("strong", { children: "歌词" }) }),
                    o ? /* @__PURE__ */ e(h, { className: "ws-param-binding-check", size: 16 }) : null
                  ]
                }
              ) : null
            ]
          }
        )
      ]
    }
  ) });
  return g ? L(
    /* @__PURE__ */ e("div", { className: "wb-detail-backdrop is-dialog-layer", "data-slot": "dialog-layer", style: { zIndex: _ }, children: p }),
    document.body
  ) : p;
}
export {
  O as CanvasParamBindingDialog
};
