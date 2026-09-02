import { j as m } from "./runtime-entry-9YhLBCWA.js";
import { u as c, a as h, b as f } from "./_commonjsHelpers-C76sftkf.js";
import { R as p } from "./index-zC0Q_K8f.js";
import { f as j, c as r } from "./preloadable-BSZIYdQl.js";
const x = {
  html: r(
    () => import("./index-DAw99DMc.js").then((t) => t.b).then((t) => [t.html()])
  ),
  json: r(
    () => import("./index-DAw99DMc.js").then((t) => t.c).then((t) => [t.json()])
  ),
  css: r(
    () => import("./index-DAw99DMc.js").then((t) => t.i).then((t) => [t.css()])
  ),
  javascript: r(
    () => import("./index-DAw99DMc.js").then((t) => t.a).then((t) => [
      t.javascript()
    ])
  ),
  "javascript-jsx": r(
    () => import("./index-DAw99DMc.js").then((t) => t.a).then((t) => [
      t.javascript({ jsx: !0 })
    ])
  ),
  sql: r(
    () => import("./index-DAw99DMc.js").then((t) => t.d).then((t) => [t.sql()])
  ),
  xml: r(
    () => import("./index-DAw99DMc.js").then((t) => t.e).then((t) => [t.xml()])
  ),
  yaml: r(
    () => import("./index-DAw99DMc.js").then((t) => t.f).then((t) => [t.yaml()])
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
    p,
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
  const e = j(t);
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
