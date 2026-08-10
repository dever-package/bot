import { c as s, m as r } from "./in-flight-request-DlB1DJg0.js";
import { s as a, a as p, n as f, i as R, b as c, r as o, c as i } from "./site-config-BVY1isir.js";
const l = r.joinSiteApi, u = r.request, g = s(), w = s();
function C() {
  return g("content", async () => {
    const t = await u(l("content/list"), "get");
    return q(a(t, "加载内容列表失败"));
  });
}
function B(t) {
  return w(
    String(t),
    () => y("content/public", t)
  );
}
async function y(t, e) {
  if (e <= 0)
    throw new Error("文章不存在");
  const d = await u(l(t), "get", { id: e }), m = a(d, "加载文章失败"), n = v(m.article);
  if (!n.id || !n.title)
    throw new Error("文章内容为空");
  return n;
}
function q(t) {
  const e = c(t);
  return {
    items: p(e.items).map(f).filter(R)
  };
}
function v(t) {
  const e = c(t);
  return {
    id: i(e.id),
    categoryID: i(e.category_id),
    title: o(e.title),
    content: o(e.content)
  };
}
export {
  C as a,
  B as l
};
