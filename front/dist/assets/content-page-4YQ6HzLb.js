import { a as i, j as t } from "./createLucideIcon-fWv1XcFy.js";
import { B as y } from "./body-rich-text-BQ-XRjCl.js";
import { R as h, l as b } from "./content-api-CuR5pbI7.js";
import { b as l, e as p, d as x, c as B } from "./runtime-entry-ClkZDmNs.js";
function R({
  article: e,
  onOutlineChange: r,
  showTitle: o = !0
}) {
  return /* @__PURE__ */ i("article", { className: "body-content-article", children: [
    o ? /* @__PURE__ */ t("header", { className: "body-content-article-header", children: /* @__PURE__ */ t("h1", { children: e.title }) }) : null,
    /* @__PURE__ */ t(
      y,
      {
        value: e.content,
        className: "body-content-rich",
        outline: { minLevel: 2, maxLevel: 3, idPrefix: "article-section" },
        onOutlineChange: r,
        fallback: /* @__PURE__ */ t("p", { className: "body-content-empty-copy", children: "这篇文章暂时没有正文。" })
      }
    )
  ] });
}
function w({
  message: e,
  onRetry: r
}) {
  return /* @__PURE__ */ i("div", { className: "body-content-state", role: "alert", children: [
    /* @__PURE__ */ t("p", { children: e }),
    /* @__PURE__ */ i("button", { type: "button", onClick: r, children: [
      /* @__PURE__ */ t(h, { size: 15 }),
      /* @__PURE__ */ t("span", { children: "重试" })
    ] })
  ] });
}
function A(e) {
  const [r, o] = l(null), [f, u] = l(!0), [m, d] = l(""), n = p(0), a = x(async () => {
    const s = ++n.current;
    u(!0), d("");
    try {
      const c = await b(e);
      s === n.current && o(c);
    } catch (c) {
      s === n.current && (o(null), d(
        c instanceof Error ? c.message : "加载文章失败"
      ));
    } finally {
      s === n.current && u(!1);
    }
  }, [e]);
  return B(() => (a(), () => {
    n.current += 1;
  }), [a]), { article: r, loading: f, error: m, reload: a };
}
export {
  w as B,
  R as a,
  A as u
};
