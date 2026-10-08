import { a as s, j as o } from "./react-CDpwMNlY.js";
import { a as g } from "./file-kind-DFeonxO2.js";
import { C as S, n as v, r as C, H as k, I as b, J as D, j as P, K as z } from "./vendor-icons-Cz5zFzlk.js";
import { p as $, i as R, e as I, f as y } from "./node-detail-content-DEcv8fc7.js";
import { S as M } from "./space-storyboard-shot-card-DP3WELdX.js";
import { S as h, a as A } from "./space-storyboard-workspace-UCyQkU7R.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-node-sbAK-nZY.css", import.meta.url).href]);
function K({
  output: r,
  status: n,
  generatedShotCount: e = 0,
  targetShotCount: l = 0,
  workspace: t,
  onOpenDetail: d,
  onConfirm: p
}) {
  const [u, w] = g(
    h
  );
  if (n === "running")
    return /* @__PURE__ */ s("div", { className: "ws-storyboard-node-state is-running", "aria-live": "polite", children: [
      /* @__PURE__ */ s("div", { className: "ws-storyboard-node-skeleton", "aria-hidden": "true", children: [
        /* @__PURE__ */ o("span", {}),
        /* @__PURE__ */ o("span", {}),
        /* @__PURE__ */ o("span", {})
      ] }),
      /* @__PURE__ */ o("strong", { children: x(e, l) })
    ] });
  if (n === "error")
    return /* @__PURE__ */ o(
      c,
      {
        icon: /* @__PURE__ */ o(b, { size: 28 }),
        title: "分镜生成失败",
        description: "请检查输入后重新生成",
        tone: "error"
      }
    );
  if (n === "empty")
    return /* @__PURE__ */ o(
      c,
      {
        icon: /* @__PURE__ */ o(D, { size: 28 }),
        title: "分镜等待生成",
        description: "运行后展示镜头卡片，详情中可以编辑"
      }
    );
  const i = $(r);
  if (!i)
    return /* @__PURE__ */ o(
      c,
      {
        icon: /* @__PURE__ */ o(b, { size: 28 }),
        title: "分镜格式异常",
        description: "打开详情查看原始结果或重新生成",
        tone: "error",
        onOpenDetail: d
      }
    );
  const m = R(i);
  return /* @__PURE__ */ s("section", { className: "ws-storyboard-node is-complete", children: [
    /* @__PURE__ */ s("header", { className: "ws-storyboard-node-summary", children: [
      /* @__PURE__ */ s("div", { className: "ws-storyboard-node-summary-copy", children: [
        /* @__PURE__ */ s("div", { children: [
          /* @__PURE__ */ o("strong", { children: i.title || "分镜脚本" }),
          /* @__PURE__ */ s("span", { className: "ws-storyboard-node-complete", children: [
            /* @__PURE__ */ o(S, { size: 14 }),
            m ? "已确认" : "草稿"
          ] })
        ] }),
        /* @__PURE__ */ s("span", { children: [
          i.shots.length,
          " 个镜头 ·",
          " ",
          I(i),
          " 秒",
          y(i) > 0 ? ` · ${y(i)} 条语音` : "",
          t?.running ? ` · ${t.executionStatus}${t.currentNodeTitle ? ` · ${t.currentNodeTitle}` : ""}` : ""
        ] })
      ] }),
      /* @__PURE__ */ s("div", { className: "ws-storyboard-node-summary-actions", children: [
        t ? /* @__PURE__ */ o(B, { data: t }) : null,
        d ? /* @__PURE__ */ o(
          f,
          {
            onOpenDetail: () => d(u)
          }
        ) : null,
        !m && p ? /* @__PURE__ */ s(
          "button",
          {
            type: "button",
            className: "ws-storyboard-detail-button is-primary nodrag nopan",
            onMouseDown: (a) => a.stopPropagation(),
            onClick: (a) => {
              a.preventDefault(), a.stopPropagation(), p();
            },
            children: [
              /* @__PURE__ */ o(v, { size: 13 }),
              /* @__PURE__ */ o("span", { children: "确认脚本" })
            ]
          }
        ) : null
      ] })
    ] }),
    /* @__PURE__ */ o(
      A,
      {
        activeSectionId: u,
        groups: t?.groups || [],
        scriptMeta: `${i.shots.length} 个镜头`,
        scriptContent: /* @__PURE__ */ o("div", { className: "ws-storyboard-node-body nowheel", children: /* @__PURE__ */ o("div", { className: "ws-storyboard-node-cards", children: i.shots.map((a, N) => /* @__PURE__ */ o(
          M,
          {
            shot: a,
            index: N,
            storyboard: i,
            onOpen: d ? () => d(h, {
              section: "shots",
              shotId: a.id
            }) : void 0
          },
          a.id
        )) }) }),
        renderNode: t?.renderNode || T,
        onActiveSectionChange: w
      }
    )
  ] });
}
function B({
  data: r
}) {
  if (r.running)
    return /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: "ws-storyboard-workspace-run is-stop nodrag nopan",
        "aria-label": "停止制作区执行",
        title: "停止制作区执行",
        disabled: r.stopping || !r.onStop,
        onMouseDown: (e) => e.stopPropagation(),
        onClick: (e) => {
          e.preventDefault(), e.stopPropagation(), r.onStop?.();
        },
        children: [
          r.stopping ? /* @__PURE__ */ o(C, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ o(k, { size: 12, fill: "currentColor" }),
          /* @__PURE__ */ o("span", { children: r.stopping ? "停止中" : "停止" })
        ]
      }
    );
  const n = r.workNodeCount > 0 && r.completedCount >= r.workNodeCount;
  return /* @__PURE__ */ s(
    "button",
    {
      type: "button",
      className: "ws-storyboard-workspace-run nodrag nopan",
      "aria-label": r.runBlockedReason || "执行制作区",
      disabled: !!r.runBlockedReason,
      title: r.runBlockedReason || void 0,
      onMouseDown: (e) => e.stopPropagation(),
      onClick: (e) => {
        e.preventDefault(), e.stopPropagation(), r.onRun();
      },
      children: [
        /* @__PURE__ */ o(P, { size: 13, fill: "currentColor" }),
        /* @__PURE__ */ o("span", { children: n ? "重新制作" : "开始制作" })
      ]
    }
  );
}
function T() {
  return null;
}
function x(r, n) {
  return r > 0 && n > 0 ? `正在生成第 ${r} / ${n} 个分镜` : r > 0 ? `正在生成第 ${r} 个分镜` : n > 0 ? `分镜规划完成，共 ${n} 个分镜` : "正在规划分镜";
}
function c({
  icon: r,
  title: n,
  description: e,
  tone: l = "default",
  onOpenDetail: t
}) {
  return /* @__PURE__ */ s(
    "div",
    {
      className: `ws-storyboard-node-state is-${l}`,
      role: l === "error" ? "alert" : void 0,
      children: [
        /* @__PURE__ */ o("span", { className: "ws-storyboard-node-state-icon", children: r }),
        /* @__PURE__ */ o("strong", { children: n }),
        /* @__PURE__ */ o("span", { children: e }),
        t ? /* @__PURE__ */ o(f, { label: "打开详情", onOpenDetail: t }) : null
      ]
    }
  );
}
function f({
  label: r = "打开完整分镜",
  onOpenDetail: n
}) {
  return /* @__PURE__ */ s(
    "button",
    {
      type: "button",
      className: "ws-storyboard-detail-button nodrag nopan",
      onMouseDown: (e) => e.stopPropagation(),
      onClick: (e) => {
        e.preventDefault(), e.stopPropagation(), n();
      },
      children: [
        /* @__PURE__ */ o(z, { size: 13 }),
        /* @__PURE__ */ o("span", { children: r })
      ]
    }
  );
}
export {
  K as StoryboardNodeContent
};
