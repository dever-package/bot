import { s, a as w, n as m, i as f, b as a, c as i, d as r } from "./site-config-D0c23URW.js";
import { a as c } from "./space-loading-FH4pJ97O.js";
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const n = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!n || Object.keys(n).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const l = n.joinSiteApi, u = n.request, g = c(), v = c();
function h() {
  return g("content", async () => {
    const t = await u(l("content/list"), "get");
    return b(s(t, "加载内容列表失败"));
  });
}
function A(t) {
  return v(
    String(t),
    () => R("content/public", t)
  );
}
async function R(t, e) {
  if (e <= 0)
    throw new Error("文章不存在");
  const d = await u(l(t), "get", { id: e }), p = s(d, "加载文章失败"), o = q(p.article);
  if (!o.id || !o.title)
    throw new Error("文章内容为空");
  return o;
}
function b(t) {
  const e = a(t);
  return {
    items: w(e.items).map(m).filter(f)
  };
}
function q(t) {
  const e = a(t);
  return {
    id: r(e.id),
    categoryID: r(e.category_id),
    title: i(e.title),
    content: i(e.content)
  };
}
export {
  h as a,
  A as l
};
