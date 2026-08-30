import { j as e, a } from "./preloadable-Bomi5PEU.js";
import { d as w, b as g } from "./_commonjsHelpers-61wyk6v6.js";
import { t as k, X as v, u as y, n as u, M as N } from "./vendor-icons-DwjYEojZ.js";
import { c as z } from "./space-page-Dnizy28C.js";
import { B as x } from "./upload-asset-api-DDv34zo1.js";
function C({
  sourceTitle: p,
  targetTitle: h,
  params: c,
  selectedParamKey: m,
  lyricsAvailable: s = !1,
  lyricsSelected: t = !1,
  editing: o = !1,
  onSelect: f,
  onSelectLyrics: b,
  onClose: i
}) {
  const d = w(null);
  return g(() => {
    function n(r) {
      r.key === "Escape" && (r.preventDefault(), i());
    }
    return window.addEventListener("keydown", n), d.current?.focus(), () => window.removeEventListener("keydown", n);
  }, [i]), /* @__PURE__ */ e("div", { className: "ws-param-binding-backdrop", onMouseDown: i, children: /* @__PURE__ */ a(
    "section",
    {
      className: "ws-param-binding-dialog",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "ws-param-binding-title",
      onMouseDown: (n) => n.stopPropagation(),
      children: [
        /* @__PURE__ */ a("header", { children: [
          /* @__PURE__ */ a("div", { children: [
            /* @__PURE__ */ e("h3", { id: "ws-param-binding-title", children: s ? "选择文本用途" : o ? "调整参数连接" : "传给哪个参数" }),
            /* @__PURE__ */ a("p", { children: [
              /* @__PURE__ */ e("span", { children: p || "上游节点" }),
              /* @__PURE__ */ e(k, { size: 13, "aria-hidden": "true" }),
              /* @__PURE__ */ e("span", { children: h || "下游能力" })
            ] })
          ] }),
          /* @__PURE__ */ e(x, { label: o ? "关闭" : "取消连接", children: /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              "aria-label": o ? "关闭" : "取消连接",
              onClick: i,
              children: /* @__PURE__ */ e(v, { size: 17 })
            }
          ) })
        ] }),
        /* @__PURE__ */ a(
          "div",
          {
            className: "ws-param-binding-options",
            "aria-label": s ? "文本用途" : "目标参数",
            children: [
              c.map((n, r) => {
                const l = m === n.key;
                return /* @__PURE__ */ a(
                  "button",
                  {
                    ref: r === 0 ? d : void 0,
                    type: "button",
                    className: l ? "is-selected" : "",
                    "aria-pressed": l,
                    onClick: () => f(n.key),
                    children: [
                      /* @__PURE__ */ e(y, { size: 17, "aria-hidden": "true" }),
                      /* @__PURE__ */ e("span", { children: /* @__PURE__ */ e("strong", { children: z(n) }) }),
                      l ? /* @__PURE__ */ e(u, { className: "ws-param-binding-check", size: 16 }) : null
                    ]
                  },
                  n.key
                );
              }),
              s ? /* @__PURE__ */ a(
                "button",
                {
                  ref: c.length === 0 ? d : void 0,
                  type: "button",
                  className: t ? "is-selected" : "",
                  "aria-pressed": t,
                  onClick: b,
                  children: [
                    /* @__PURE__ */ e(N, { size: 17, "aria-hidden": "true" }),
                    /* @__PURE__ */ e("span", { children: /* @__PURE__ */ e("strong", { children: "歌词" }) }),
                    t ? /* @__PURE__ */ e(u, { className: "ws-param-binding-check", size: 16 }) : null
                  ]
                }
              ) : null
            ]
          }
        )
      ]
    }
  ) });
}
export {
  C as CanvasParamBindingDialog
};
