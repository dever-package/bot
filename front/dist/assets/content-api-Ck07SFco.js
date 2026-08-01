import { r as a, j as c } from "./runtime-entry-CIrzyMsA.js";
import { i as d } from "./api-response-C-VXY2RJ.js";
import { c as u } from "./in-flight-request-vHkSgDHd.js";
import { n as f, i as p } from "./site-config-BtBYhKpy.js";
const y = u(), g = u();
function B() {
  return y("content", async () => {
    const t = await a(c("content/list"), "get");
    return A(l(t, "加载内容列表失败"));
  });
}
function S(t) {
  return g(
    String(t),
    () => w("content/public", t)
  );
}
async function w(t, n) {
  if (n <= 0)
    throw new Error("文章不存在");
  const r = await a(c(t), "get", { id: n }), m = l(r, "加载文章失败"), o = b(m.article);
  if (!o.id || !o.title)
    throw new Error("文章内容为空");
  return o;
}
function A(t) {
  const n = e(t);
  return {
    items: R(n.items).map(f).filter(p)
  };
}
function b(t) {
  const n = e(t);
  return {
    id: s(n.id),
    categoryID: s(n.category_id),
    title: i(n.title),
    content: i(n.content)
  };
}
function l(t, n) {
  const r = e(t);
  if (!d(r))
    throw new Error(i(r.message || r.msg) || n);
  return e(r.data);
}
function R(t) {
  return Array.isArray(t) ? t : [];
}
function e(t) {
  return t && typeof t == "object" && !Array.isArray(t) ? t : {};
}
function s(t) {
  const n = Number(t || 0);
  return Number.isFinite(n) && n > 0 ? n : 0;
}
function i(t) {
  return t == null ? "" : String(t).trim();
}
export {
  B as a,
  S as l
};
