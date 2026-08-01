import { a as s, j as r } from "./createLucideIcon-CEtb6KSk.js";
import { C as c } from "./circle-alert-QPWZCk4j.js";
import { C as u } from "./circle-check-DjAs7CDF.js";
import { C as y } from "./space-power-icon-DPR3KYFq.js";
import { M as f } from "./interaction-d6W_Ir2J.js";
import { p as w, i as N, f as g, g as m } from "./upload-asset-api-DAbIOMVJ.js";
import { S as C } from "./space-storyboard-shot-card-CdcCQX_F.js";
function $({
  output: n,
  status: t,
  started: e = !1,
  generatedShotCount: i = 0,
  onOpenDetail: a
}) {
  if (t === "running")
    return /* @__PURE__ */ s("div", { className: "ws-storyboard-node-state is-running", "aria-live": "polite", children: [
      /* @__PURE__ */ s("div", { className: "ws-storyboard-node-skeleton", "aria-hidden": "true", children: [
        /* @__PURE__ */ r("span", {}),
        /* @__PURE__ */ r("span", {}),
        /* @__PURE__ */ r("span", {})
      ] }),
      /* @__PURE__ */ r("strong", { children: e ? i > 0 ? `分镜正在生成，已生成 ${i} 个分镜` : "分镜正在生成" : "分镜等待生成" })
    ] });
  if (t === "error")
    return /* @__PURE__ */ r(
      d,
      {
        icon: /* @__PURE__ */ r(c, { size: 28 }),
        title: "分镜生成失败",
        description: "请检查输入后重新生成",
        tone: "error"
      }
    );
  if (t === "empty")
    return /* @__PURE__ */ r(
      d,
      {
        icon: /* @__PURE__ */ r(y, { size: 28 }),
        title: "分镜等待生成",
        description: "运行后展示镜头卡片，详情中可以编辑"
      }
    );
  const o = w(n);
  if (!o)
    return /* @__PURE__ */ r(
      d,
      {
        icon: /* @__PURE__ */ r(c, { size: 28 }),
        title: "分镜格式异常",
        description: "打开详情查看原始结果或重新生成",
        tone: "error",
        onOpenDetail: a
      }
    );
  const h = N(o);
  return /* @__PURE__ */ s("section", { className: "ws-storyboard-node is-complete", children: [
    /* @__PURE__ */ s("header", { className: "ws-storyboard-node-summary", children: [
      /* @__PURE__ */ s("div", { children: [
        /* @__PURE__ */ r("strong", { children: o.title || "分镜脚本" }),
        /* @__PURE__ */ s("span", { className: "ws-storyboard-node-complete", children: [
          /* @__PURE__ */ r(u, { size: 14 }),
          h ? "已确认" : "草稿"
        ] })
      ] }),
      /* @__PURE__ */ s("span", { children: [
        o.shots.length,
        " 个镜头 ·",
        " ",
        g(o),
        " 秒",
        m(o) > 0 ? ` · ${m(o)} 条语音` : ""
      ] })
    ] }),
    /* @__PURE__ */ s("div", { className: "ws-storyboard-node-body nowheel", children: [
      /* @__PURE__ */ r("div", { className: "ws-storyboard-node-cards", children: o.shots.slice(0, 4).map((l, b) => /* @__PURE__ */ r(
        C,
        {
          shot: l,
          index: b,
          storyboard: o,
          onOpen: a
        },
        l.id
      )) }),
      o.shots.length > 4 ? /* @__PURE__ */ s("span", { className: "ws-storyboard-node-more", children: [
        "还有 ",
        o.shots.length - 4,
        " 个镜头"
      ] }) : null
    ] }),
    a ? /* @__PURE__ */ r("footer", { className: "ws-storyboard-node-actions", children: /* @__PURE__ */ r(p, { onOpenDetail: a }) }) : null
  ] });
}
function d({
  icon: n,
  title: t,
  description: e,
  tone: i = "default",
  onOpenDetail: a
}) {
  return /* @__PURE__ */ s(
    "div",
    {
      className: `ws-storyboard-node-state is-${i}`,
      role: i === "error" ? "alert" : void 0,
      children: [
        /* @__PURE__ */ r("span", { className: "ws-storyboard-node-state-icon", children: n }),
        /* @__PURE__ */ r("strong", { children: t }),
        /* @__PURE__ */ r("span", { children: e }),
        a ? /* @__PURE__ */ r(p, { label: "打开详情", onOpenDetail: a }) : null
      ]
    }
  );
}
function p({
  label: n = "打开完整分镜",
  onOpenDetail: t
}) {
  return /* @__PURE__ */ s(
    "button",
    {
      type: "button",
      className: "ws-storyboard-detail-button nodrag nopan",
      onMouseDown: (e) => e.stopPropagation(),
      onClick: (e) => {
        e.preventDefault(), e.stopPropagation(), t();
      },
      children: [
        /* @__PURE__ */ r(f, { size: 13 }),
        /* @__PURE__ */ r("span", { children: n })
      ]
    }
  );
}
export {
  $ as StoryboardNodeContent
};
