import { a as d, j as e } from "./createLucideIcon-CEtb6KSk.js";
import { u as P, a as E, b as x } from "./runtime-entry-CIrzyMsA.js";
import { C as L } from "./circle-check-DjAs7CDF.js";
import { L as F } from "./loader-circle-QnfinZ3F.js";
import { F as G } from "./folder-tree-DXj3CroT.js";
import { P as K } from "./pencil-tXNtQW8N.js";
import { P as V } from "./play-cbWwOmIe.js";
import { b as o } from "./upload-asset-api-DAbIOMVJ.js";
function M({
  node: a,
  memberCount: z,
  runnableCount: r,
  completedCount: h,
  failedCount: w,
  staleCount: n,
  status: i,
  frameRunning: u = !1,
  selected: T,
  managed: m = !1,
  onRename: N,
  onEditStructure: b,
  onRun: $,
  runBlockedReason: c = "",
  children: k
}) {
  const [l, f] = P(!1), [D, p] = P(a.title), g = E(null), t = i === "running" || i === "waiting", v = t ? "分组正在执行" : u ? "制作区正在执行" : c || (r === 0 ? "分组内暂无可运行节点" : n > 0 ? `重新生成 ${n} 个已变更节点` : "运行分组"), j = !$ || r === 0 || t || u || !!c;
  x(() => {
    l || p(a.title);
  }, [l, a.title]), x(() => {
    l && (g.current?.focus(), g.current?.select());
  }, [l]);
  const y = () => {
    const s = D.trim() || "未命名分组";
    f(!1), p(s), s !== a.title && N?.(s);
  };
  return /* @__PURE__ */ d(
    "div",
    {
      className: `ws-node-group-wrap ${T ? "is-selected" : ""} ${t ? "is-running" : ""} ${i === "error" ? "is-error" : ""} ${m ? "is-managed" : ""}`,
      children: [
        /* @__PURE__ */ d("header", { className: "ws-node-group-header", children: [
          /* @__PURE__ */ e("span", { className: "ws-node-group-icon", "aria-hidden": "true", children: /* @__PURE__ */ e(G, { size: 15 }) }),
          l ? /* @__PURE__ */ e(
            "input",
            {
              ref: g,
              className: "ws-node-group-title-input nodrag nowheel",
              value: D,
              maxLength: 64,
              "aria-label": "分组名称",
              onChange: (s) => p(s.target.value),
              onBlur: y,
              onKeyDown: (s) => {
                s.key === "Enter" ? (s.preventDefault(), y()) : s.key === "Escape" && (s.preventDefault(), p(a.title), f(!1));
              }
            }
          ) : /* @__PURE__ */ e(
            o,
            {
              label: m ? "名称由分镜脚本管理" : "双击重命名",
              children: /* @__PURE__ */ e(
                "strong",
                {
                  className: "ws-node-group-title",
                  onDoubleClick: (s) => {
                    s.preventDefault(), s.stopPropagation(), !(m || !N) && f(!0);
                  },
                  children: a.title || "未命名分组"
                }
              )
            }
          ),
          /* @__PURE__ */ e("span", { className: "ws-node-group-count", children: t ? `${h}/${r}` : `${z} 个节点` }),
          i === "waiting" ? /* @__PURE__ */ e("span", { className: "ws-node-group-status", children: "等待反馈" }) : i === "error" ? /* @__PURE__ */ e("span", { className: "ws-node-group-status", children: w > 0 ? `失败 ${w}` : "运行失败" }) : c ? /* @__PURE__ */ e(o, { label: c, children: /* @__PURE__ */ e("span", { className: "ws-node-group-status", children: "等待前置" }) }) : u ? /* @__PURE__ */ e("span", { className: "ws-node-group-status", children: "等待调度" }) : n > 0 ? /* @__PURE__ */ e(o, { label: "上游素材或提示词已变化；当前结果仍可使用，重新运行可更新", children: /* @__PURE__ */ d("span", { className: "ws-node-group-status is-stale", children: [
            "可更新 ",
            n
          ] }) }) : r > 0 && h === r ? /* @__PURE__ */ d("span", { className: "ws-node-group-status is-complete", children: [
            /* @__PURE__ */ e(L, { size: 12 }),
            "已完成"
          ] }) : null,
          b ? /* @__PURE__ */ e(o, { label: "编辑分镜结构", children: /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              className: "ws-node-group-edit nodrag nopan",
              onClick: (s) => {
                s.preventDefault(), s.stopPropagation(), b();
              },
              "aria-label": "编辑分镜结构",
              children: /* @__PURE__ */ e(K, { size: 13 })
            }
          ) }) : null,
          /* @__PURE__ */ e(o, { label: v, children: /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              className: "ws-node-group-run nodrag nopan",
              disabled: j,
              onClick: (s) => {
                s.preventDefault(), s.stopPropagation(), $?.();
              },
              "aria-label": "运行分组",
              children: t ? /* @__PURE__ */ e(F, { size: 14, className: "ws-spin" }) : /* @__PURE__ */ e(V, { size: 14 })
            }
          ) })
        ] }),
        /* @__PURE__ */ e("div", { className: "ws-node-group-surface", "aria-hidden": "true" }),
        k
      ]
    }
  );
}
export {
  M as CanvasGroupNodeView
};
