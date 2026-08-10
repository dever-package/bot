import { a as o } from "./_commonjsHelpers-CTFd9u1x.js";
import { n as d } from "./node-detail-content-DhUE_leQ.js";
await window.DeverFront?.ensureCompat?.(["@/components/rich-text-editor"]);
const r = window.DeverFront?.sdk?.getCompatModule("@/components/rich-text-editor");
if (!r || Object.keys(r).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/rich-text-editor");
const { RichTextEditor: l } = r;
function m({
  content: e,
  readonly: i,
  onChange: a
}) {
  const n = String(e.value || "");
  return /* @__PURE__ */ o("div", { className: "ws-node-detail-editor", children: l ? /* @__PURE__ */ o(
    l,
    {
      value: n,
      onChange: (t) => a(d(e, t)),
      contentFormat: e.format,
      placeholder: "编辑内容",
      disabled: i,
      minHeight: 0,
      maxHeight: 2400,
      controlClassName: "ws-node-detail-rich-editor"
    }
  ) : /* @__PURE__ */ o(
    "textarea",
    {
      className: "ws-node-detail-fallback-editor",
      readOnly: i,
      value: n,
      onChange: (t) => a(d(e, t.target.value)),
      placeholder: "编辑内容"
    }
  ) });
}
export {
  m as NodeDetailRichEditor
};
