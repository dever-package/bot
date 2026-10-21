import { j as m } from "./react-HSzdbxZ7.js";
import { u as c, a as h, d as f, e as p } from "./file-kind-D6bMOzYN.js";
import { R as j } from "./index-N7o1xyNA.js";
import { a as r } from "./preloadable-CT3tMmBD.js";
const x = {
  html: r(
    () => import("./index-D0TUFlxp.js").then((t) => t.b).then((t) => [t.html()])
  ),
  json: r(
    () => import("./index-D0TUFlxp.js").then((t) => t.c).then((t) => [t.json()])
  ),
  css: r(
    () => import("./index-D0TUFlxp.js").then((t) => t.i).then((t) => [t.css()])
  ),
  javascript: r(
    () => import("./index-D0TUFlxp.js").then((t) => t.a).then((t) => [
      t.javascript()
    ])
  ),
  "javascript-jsx": r(
    () => import("./index-D0TUFlxp.js").then((t) => t.a).then((t) => [
      t.javascript({ jsx: !0 })
    ])
  ),
  sql: r(
    () => import("./index-D0TUFlxp.js").then((t) => t.d).then((t) => [t.sql()])
  ),
  xml: r(
    () => import("./index-D0TUFlxp.js").then((t) => t.e).then((t) => [t.xml()])
  ),
  yaml: r(
    () => import("./index-D0TUFlxp.js").then((t) => t.f).then((t) => [t.yaml()])
  )
};
function y({
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
    let s = !0;
    return a ? (x[a].load().then(
      (u) => {
        s && i(u);
      },
      () => {
        s && i([]);
      }
    ), () => {
      s = !1;
    }) : (i([]), () => {
      s = !1;
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
  y as KnowledgeCodeEditor
};
