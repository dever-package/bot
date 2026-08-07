import { c as p } from "./createLucideIcon-fWv1XcFy.js";
import { r as i, n as r } from "./runtime-entry-ClkZDmNs.js";
import { s as a, d as f, n as m, i as y, e as c, r as n, f as s } from "./site-config-DrnclGFw.js";
import { c as l } from "./in-flight-request-CXY2yBH9.js";
const R = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
], A = p("refresh-cw", R), h = l(), v = l();
function B() {
  return h("content", async () => {
    const t = await i(r("content/list"), "get");
    return g(a(t, "加载内容列表失败"));
  });
}
function M(t) {
  return v(
    String(t),
    () => w("content/public", t)
  );
}
async function w(t, e) {
  if (e <= 0)
    throw new Error("文章不存在");
  const u = await i(r(t), "get", { id: e }), d = a(u, "加载文章失败"), o = k(d.article);
  if (!o.id || !o.title)
    throw new Error("文章内容为空");
  return o;
}
function g(t) {
  const e = c(t);
  return {
    items: f(e.items).map(m).filter(y)
  };
}
function k(t) {
  const e = c(t);
  return {
    id: s(e.id),
    categoryID: s(e.category_id),
    title: n(e.title),
    content: n(e.content)
  };
}
export {
  A as R,
  B as a,
  M as l
};
