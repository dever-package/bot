import { a as i, j as l } from "./createLucideIcon-CEtb6KSk.js";
import { d, b as p, e as u, S as c } from "./upload-asset-api-DAbIOMVJ.js";
function m({
  references: n,
  disabled: t = !1,
  onChange: e
}) {
  if (n.length === 0)
    return null;
  const r = (a, s) => {
    e(
      n.map(
        (o) => o.key === a ? { ...o, ...s } : o
      )
    );
  };
  return /* @__PURE__ */ i("section", { className: "ws-storyboard-input-references", "aria-label": "脚本参考素材", children: [
    /* @__PURE__ */ i("header", { children: [
      /* @__PURE__ */ l("strong", { children: "参考素材" }),
      /* @__PURE__ */ l("span", { children: "为每个素材指定用途，生成后仍可在脚本详情中调整。" })
    ] }),
    /* @__PURE__ */ l("div", { className: "ws-storyboard-input-reference-list", children: n.map((a) => /* @__PURE__ */ i("div", { className: "ws-storyboard-input-reference", children: [
      /* @__PURE__ */ l("span", { className: "ws-storyboard-input-reference-kind", children: /* @__PURE__ */ l(d, { kind: a.kind }) }),
      /* @__PURE__ */ l(p, { label: a.label, children: /* @__PURE__ */ l("span", { className: "ws-storyboard-input-reference-name", children: a.label }) }),
      /* @__PURE__ */ l(
        "select",
        {
          className: "nodrag nopan",
          value: a.purpose,
          disabled: t,
          "aria-label": `${a.label}的参考用途`,
          onChange: (s) => r(a.key, {
            purpose: s.target.value
          }),
          children: u(a.kind).map((s) => /* @__PURE__ */ l("option", { value: s.value, children: s.label }, s.value))
        }
      ),
      /* @__PURE__ */ l(
        "input",
        {
          className: "nodrag nopan",
          value: a.instruction,
          disabled: t,
          "aria-label": `${a.label}的补充说明`,
          placeholder: `${c[a.purpose]}说明（可选）`,
          onChange: (s) => r(a.key, {
            instruction: s.target.value
          })
        }
      )
    ] }, a.key)) })
  ] });
}
export {
  m as StoryboardInputReferenceEditor
};
