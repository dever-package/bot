import { j as m, c as s } from "./preloadable-CbkzeflN.js";
import { u as c, a as h, d as f, e as p } from "./file-kind-X0KKJPkQ.js";
import { R as j } from "./index-B0lKF6U7.js";
const x = {
  html: s(
    () => import("./index-kRRyYrxO.js").then((t) => t.b).then((t) => [t.html()])
  ),
  json: s(
    () => import("./index-kRRyYrxO.js").then((t) => t.c).then((t) => [t.json()])
  ),
  css: s(
    () => import("./index-kRRyYrxO.js").then((t) => t.i).then((t) => [t.css()])
  ),
  javascript: s(
    () => import("./index-kRRyYrxO.js").then((t) => t.a).then((t) => [
      t.javascript()
    ])
  ),
  "javascript-jsx": s(
    () => import("./index-kRRyYrxO.js").then((t) => t.a).then((t) => [
      t.javascript({ jsx: !0 })
    ])
  ),
  sql: s(
    () => import("./index-kRRyYrxO.js").then((t) => t.d).then((t) => [t.sql()])
  ),
  xml: s(
    () => import("./index-kRRyYrxO.js").then((t) => t.e).then((t) => [t.xml()])
  ),
  yaml: s(
    () => import("./index-kRRyYrxO.js").then((t) => t.f).then((t) => [t.yaml()])
  )
};
function b({
  file: t,
  content: n,
  kind: e,
  onChange: o
}) {
  const a = c(
    () => d(t.name, e),
    [t.name, e]
  ), [l, i] = h([]);
  return f(() => {
    let r = !0;
    return a ? (x[a].load().then(
      (u) => {
        r && i(u);
      },
      () => {
        r && i([]);
      }
    ), () => {
      r = !1;
    }) : (i([]), () => {
      r = !1;
    });
  }, [a]), /* @__PURE__ */ m(
    j,
    {
      value: n,
      height: "100%",
      basicSetup: {
        autocompletion: !0,
        bracketMatching: !0,
        foldGutter: !0,
        highlightActiveLine: !0,
        highlightSelectionMatches: !0,
        lineNumbers: !0
      },
      extensions: l,
      className: "knowledge-code-editor",
      onChange: o
    }
  );
}
function d(t, n) {
  const e = p(t);
  if (n === "html")
    return "html";
  if (e === "json")
    return "json";
  if (e === "css" || e === "scss" || e === "less")
    return "css";
  if (e === "js" || e === "jsx" || e === "ts" || e === "tsx" || e === "vue")
    return e === "jsx" || e === "tsx" ? "javascript-jsx" : "javascript";
  if (e === "sql")
    return "sql";
  if (e === "xml")
    return "xml";
  if (e === "yaml" || e === "yml")
    return "yaml";
}
export {
  b as KnowledgeCodeEditor
};
