import { a as l, j as t } from "./react-CDpwMNlY.js";
import { B as h } from "./body-filing-jzLc17_-.js";
import { R as y } from "./vendor-icons-Cz5zFzlk.js";
import { a as i, e as p, h as w, b } from "./file-kind-DFeonxO2.js";
import { l as v } from "./content-api-BwqltAzr.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./content-page-DhnBKsmL.css", import.meta.url).href]);
function L({
  article: e,
  onOutlineChange: r,
  showTitle: o = !0
}) {
  return /* @__PURE__ */ l("article", { className: "body-content-article", children: [
    o ? /* @__PURE__ */ t("header", { className: "body-content-article-header", children: /* @__PURE__ */ t("h1", { children: e.title }) }) : null,
    /* @__PURE__ */ t(
      h,
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
function N({
  message: e,
  onRetry: r
}) {
  return /* @__PURE__ */ l("div", { className: "body-content-state", role: "alert", children: [
    /* @__PURE__ */ t("p", { children: e }),
    /* @__PURE__ */ l("button", { type: "button", onClick: r, children: [
      /* @__PURE__ */ t(y, { size: 15 }),
      /* @__PURE__ */ t("span", { children: "重试" })
    ] })
  ] });
}
function g(e) {
  const [r, o] = i(null), [f, u] = i(!0), [m, d] = i(""), n = p(0), c = w(async () => {
    const a = ++n.current;
    u(!0), d("");
    try {
      const s = await v(e);
      a === n.current && o(s);
    } catch (s) {
      a === n.current && (o(null), d(
        s instanceof Error ? s.message : "加载文章失败"
      ));
    } finally {
      a === n.current && u(!1);
    }
  }, [e]);
  return b(() => (c(), () => {
    n.current += 1;
  }), [c]), { article: r, loading: f, error: m, reload: c };
}
export {
  N as B,
  L as a,
  g as u
};
