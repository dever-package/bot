import { j as r, F as h } from "./createLucideIcon-Gw0gLVQ5.js";
import { g as o } from "./runtime-entry-CkPHMDB1.js";
const i = o("@/components/rich-text-view").RichTextView, n = o("@/lib/rich-text-html").richTextToHtml;
function l({
  value: t,
  className: e,
  fallback: c,
  outline: s,
  onOutlineChange: a
}) {
  return !m(t) || !i ? /* @__PURE__ */ r(h, { children: c }) : /* @__PURE__ */ r(
    i,
    {
      value: t,
      className: e,
      outline: s,
      onOutlineChange: a
    }
  );
}
function m(t) {
  const e = String(t || "").trim();
  if (!e)
    return !1;
  if (!n)
    return !0;
  try {
    return !!n(e, { wrapper: !1 }).trim();
  } catch {
    return !1;
  }
}
export {
  l as B,
  m as h
};
