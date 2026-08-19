import { a as e, j as r } from "./preloadable-Bomi5PEU.js";
import { m as c, n as y, C as b, M as w } from "./vendor-icons-B3DKX3la.js";
import { p as f, i as N, s as g, a as p } from "./upload-asset-api-MyhTP8sK.js";
import { S as v } from "./space-storyboard-shot-card-8VmZWQEk.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-node-DWnlA_XL.css", import.meta.url).href]);
function x({
  output: a,
  status: n,
  started: s = !1,
  generatedShotCount: i = 0,
  onOpenDetail: t
}) {
  if (n === "running")
    return /* @__PURE__ */ e("div", { className: "ws-storyboard-node-state is-running", "aria-live": "polite", children: [
      /* @__PURE__ */ e("div", { className: "ws-storyboard-node-skeleton", "aria-hidden": "true", children: [
        /* @__PURE__ */ r("span", {}),
        /* @__PURE__ */ r("span", {}),
        /* @__PURE__ */ r("span", {})
      ] }),
      /* @__PURE__ */ r("strong", { children: s ? i > 0 ? `分镜正在生成，已生成 ${i} 个分镜` : "分镜正在生成" : "分镜等待生成" })
    ] });
  if (n === "error")
    return /* @__PURE__ */ r(
      d,
      {
        icon: /* @__PURE__ */ r(c, { size: 28 }),
        title: "分镜生成失败",
        description: "请检查输入后重新生成",
        tone: "error"
      }
    );
  if (n === "empty")
    return /* @__PURE__ */ r(
      d,
      {
        icon: /* @__PURE__ */ r(y, { size: 28 }),
        title: "分镜等待生成",
        description: "运行后展示镜头卡片，详情中可以编辑"
      }
    );
  const o = f(a);
  if (!o)
    return /* @__PURE__ */ r(
      d,
      {
        icon: /* @__PURE__ */ r(c, { size: 28 }),
        title: "分镜格式异常",
        description: "打开详情查看原始结果或重新生成",
        tone: "error",
        onOpenDetail: t
      }
    );
  const h = N(o);
  return /* @__PURE__ */ e("section", { className: "ws-storyboard-node is-complete", children: [
    /* @__PURE__ */ e("header", { className: "ws-storyboard-node-summary", children: [
      /* @__PURE__ */ e("div", { children: [
        /* @__PURE__ */ r("strong", { children: o.title || "分镜脚本" }),
        /* @__PURE__ */ e("span", { className: "ws-storyboard-node-complete", children: [
          /* @__PURE__ */ r(b, { size: 14 }),
          h ? "已确认" : "草稿"
        ] })
      ] }),
      /* @__PURE__ */ e("span", { children: [
        o.shots.length,
        " 个镜头 ·",
        " ",
        g(o),
        " 秒",
        p(o) > 0 ? ` · ${p(o)} 条语音` : ""
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "ws-storyboard-node-body nowheel", children: [
      /* @__PURE__ */ r("div", { className: "ws-storyboard-node-cards", children: o.shots.slice(0, 4).map((l, u) => /* @__PURE__ */ r(
        v,
        {
          shot: l,
          index: u,
          storyboard: o,
          onOpen: t
        },
        l.id
      )) }),
      o.shots.length > 4 ? /* @__PURE__ */ e("span", { className: "ws-storyboard-node-more", children: [
        "还有 ",
        o.shots.length - 4,
        " 个镜头"
      ] }) : null
    ] }),
    t ? /* @__PURE__ */ r("footer", { className: "ws-storyboard-node-actions", children: /* @__PURE__ */ r(m, { onOpenDetail: t }) }) : null
  ] });
}
function d({
  icon: a,
  title: n,
  description: s,
  tone: i = "default",
  onOpenDetail: t
}) {
  return /* @__PURE__ */ e(
    "div",
    {
      className: `ws-storyboard-node-state is-${i}`,
      role: i === "error" ? "alert" : void 0,
      children: [
        /* @__PURE__ */ r("span", { className: "ws-storyboard-node-state-icon", children: a }),
        /* @__PURE__ */ r("strong", { children: n }),
        /* @__PURE__ */ r("span", { children: s }),
        t ? /* @__PURE__ */ r(m, { label: "打开详情", onOpenDetail: t }) : null
      ]
    }
  );
}
function m({
  label: a = "打开完整分镜",
  onOpenDetail: n
}) {
  return /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      className: "ws-storyboard-detail-button nodrag nopan",
      onMouseDown: (s) => s.stopPropagation(),
      onClick: (s) => {
        s.preventDefault(), s.stopPropagation(), n();
      },
      children: [
        /* @__PURE__ */ r(w, { size: 13 }),
        /* @__PURE__ */ r("span", { children: a })
      ]
    }
  );
}
export {
  x as StoryboardNodeContent
};
