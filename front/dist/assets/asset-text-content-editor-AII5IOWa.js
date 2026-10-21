import { j as p } from "./react-HSzdbxZ7.js";
import { u as O, b as E, l as m } from "./file-kind-D6bMOzYN.js";
import { s as l, g as h, h as T, p as w, j as k, k as j, D as _ } from "./asset-preview-DGKZUP9q.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./asset-text-content-editor-CszGnZai.css", import.meta.url).href]);
function B(t, e) {
  if (t === "text")
    return {
      kind: t,
      contentFormat: "markdown",
      value: A(e)
    };
  const n = l(e);
  return n ? {
    kind: t,
    contentFormat: "json",
    value: h(y(n))
  } : {
    kind: t,
    contentFormat: "markdown",
    value: C(e) || T(e)
  };
}
function H(t, e) {
  return { ...t, value: e };
}
function F(t) {
  if (t.kind !== "richtext" || t.contentFormat !== "json")
    return t.value;
  const e = l(w(t.value));
  return e ? h(
    g(y(e))
  ) : t.value;
}
function L(t) {
  return t.contentFormat === "markdown" ? { format: "markdown", text: t.value } : l(w(t.value)) || {
    type: "doc",
    content: []
  };
}
function V(t) {
  const e = L(t);
  if (t.kind !== "richtext" || t.contentFormat !== "json")
    return S(e);
  const n = l(e);
  return S(
    n ? D(g(n)) : e
  );
}
function A(t) {
  return C(t) || k(t) || T(t);
}
function C(t) {
  const e = w(t);
  return j(e) ? String(e.format || "").trim().toLowerCase() !== "markdown" ? "" : String(e.text || e.markdown || "") : typeof e == "string" ? e : "";
}
function g(t) {
  const e = { ...t };
  return t.content && (e.content = t.content.map(g)), (t.type === "editorMediaImage" || t.type === "editorMediaVideo") && !String(t.attrs?.maxWidth || "").trim() && (e.attrs = { ...t.attrs || {}, maxWidth: "100%" }), e;
}
function y(t) {
  const e = { ...t };
  if (!t.content) return e;
  const n = t.type === "doc" ? t.content.filter((o) => !M(o)) : t.content;
  if (e.content = n.map(y), t.type === "paragraph")
    for (; e.content.at(-1)?.type === "hardBreak"; )
      e.content.pop();
  return e;
}
function M(t) {
  return t.type === "paragraph" && !!t.content?.length && t.content?.every(
    (e) => e.type === "hardBreak" || e.type === "text" && !String(e.text || "").trim()
  );
}
function D(t) {
  const e = { type: t.type }, n = b(t.attrs);
  return n && (e.attrs = n), t.content && (e.content = t.content.map(D)), t.marks && (e.marks = t.marks.map((o) => {
    const s = b(o.attrs);
    return s ? { ...o, attrs: s } : { type: o.type };
  })), t.text != null && (e.text = t.text), e;
}
function b(t) {
  if (!t) return;
  const e = Object.entries(t).filter(
    ([, n]) => n != null && n !== ""
  );
  return e.length > 0 ? Object.fromEntries(e) : void 0;
}
function S(t) {
  return h(x(t));
}
function x(t) {
  return Array.isArray(t) ? t.map(x) : j(t) ? Object.fromEntries(
    Object.keys(t).sort().map((e) => [e, x(t[e])])
  ) : t;
}
await window.DeverFront?.ensureCompat?.(["@/components/rich-text-editor"]);
const d = window.DeverFront?.sdk?.getCompatModule("@/components/rich-text-editor");
if (!d || Object.keys(d).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/rich-text-editor");
const { RichTextEditor: v } = d;
function I({
  kind: t,
  value: e,
  contentFormat: n,
  readonly: o = !1,
  onChange: s,
  onTextSelectionChange: u,
  selectionActionsRef: c
}) {
  const r = O(
    () => F({ kind: t, value: e, contentFormat: n }),
    [n, t, e]
  );
  return t === "text" || !v ? /* @__PURE__ */ p(
    z,
    {
      value: e,
      readonly: o,
      onChange: s,
      onTextSelectionChange: u,
      selectionActionsRef: c
    }
  ) : /* @__PURE__ */ p(
    v,
    {
      value: r,
      onChange: s,
      onTextSelectionChange: u,
      selectionActionsRef: c,
      contentFormat: n,
      placeholder: "编辑内容",
      disabled: o,
      minHeight: 0,
      maxHeight: 2400,
      controlClassName: "wb-asset-rich-content-editor",
      floatingLayerZIndex: _
    }
  );
}
function z({
  value: t,
  readonly: e,
  onChange: n,
  onTextSelectionChange: o,
  selectionActionsRef: s
}) {
  const u = E(null), c = E({ value: t, readonly: e, onChange: n, onTextSelectionChange: o });
  return m(() => {
    c.current = { value: t, readonly: e, onChange: n, onTextSelectionChange: o };
  }, [t, e, n, o]), m(() => {
    if (s)
      return s.current = {
        replaceSelection(r, a) {
          const i = c.current;
          return i.readonly || i.value !== r.content || r.from < 0 || r.to > i.value.length || r.from >= r.to || i.value.slice(r.from, r.to) !== r.text ? !1 : (i.onChange(
            i.value.slice(0, r.from) + a + i.value.slice(r.to)
          ), i.onTextSelectionChange?.(null), !0);
        },
        clearSelection() {
          const r = u.current;
          r && r.setSelectionRange(r.selectionEnd, r.selectionEnd), c.current.onTextSelectionChange?.(null);
        }
      }, () => {
        s.current = null;
      };
  }, [s]), m(() => {
    c.current.onTextSelectionChange?.(null);
  }, [t]), m(() => {
    const r = () => {
      const a = u.current;
      a && (a.style.height = "auto", a.style.height = `${a.scrollHeight}px`);
    };
    return r(), window.addEventListener("resize", r), () => window.removeEventListener("resize", r);
  }, [t]), /* @__PURE__ */ p(
    "textarea",
    {
      ref: u,
      className: "wb-asset-plain-content-editor",
      readOnly: e,
      value: t,
      onChange: (r) => n(r.target.value),
      onSelect: (r) => {
        const a = r.currentTarget;
        if (document.activeElement !== a) return;
        const i = a.selectionStart, f = a.selectionEnd;
        o?.(
          i < f ? { from: i, to: f, text: t.slice(i, f), content: t } : null
        );
      },
      placeholder: "编辑内容"
    }
  );
}
const J = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AssetTextContentEditor: I
}, Symbol.toStringTag, { value: "Module" }));
export {
  I as A,
  V as a,
  H as b,
  J as c,
  B as r,
  L as s
};
