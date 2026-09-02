import { j as z } from "./runtime-entry-9YhLBCWA.js";
import { d as l, a as V, b as s } from "./_commonjsHelpers-C76sftkf.js";
import { V as S, l as M } from "./ant-fyh62A3x.js";
import { i as $, a as q } from "./preloadable-BSZIYdQl.js";
const O = [
  "bold",
  "italic",
  "strike",
  "inline-code",
  "headings",
  "|",
  "list",
  "ordered-list",
  "check",
  "quote",
  "undo",
  "redo",
  "|",
  "link",
  "code",
  "table",
  "upload"
], U = 860, A = "vditorLuteScript", C = "vditorIconScript";
let y = null;
const W = {
  bold: "加粗",
  italic: "斜体",
  strike: "删除线",
  "inline-code": "行内代码",
  headings: "标题",
  list: "无序列表",
  "ordered-list": "有序列表",
  check: "任务列表",
  quote: "引用",
  undo: "撤销",
  redo: "重做",
  link: "链接",
  code: "代码块",
  table: "表格",
  upload: "上传附件"
};
function _() {
  return typeof document > "u" ? Promise.resolve() : (J(), K());
}
function te({
  active: e,
  value: n,
  linkBaseURL: r,
  onChange: d,
  onUploadAttachments: m,
  onAttachmentError: p,
  onStatusChange: u
}) {
  const h = l(null), o = l(null), c = l(!1), v = l(n), E = l(r), F = l(d), k = l(m), b = l(p), [N, L] = V(!1), [T, D] = V(!1), [x, j] = V(!1);
  s(() => {
    F.current = d;
  }, [d]), s(() => {
    k.current = m;
  }, [m]), s(() => {
    b.current = p;
  }, [p]), s(() => {
    E.current = r;
    const t = o.current;
    t && (I(t, r), c.current && t.getValue() === v.current && t.setValue(v.current, !0));
  }, [r]), s(() => {
    v.current = n;
    const t = o.current;
    t && t.getValue() !== n && (I(t, E.current), t.setValue(n, !0));
  }, [n]), s(() => {
    e || o.current?.blur();
  }, [e]), s(() => {
    const t = h.current;
    if (!t)
      return;
    let g = !1, i = null;
    return c.current = !1, j(!1), (async () => {
      try {
        await _();
      } catch {
      }
      g || (i = new S(t, {
        value: v.current,
        mode: "ir",
        height: "100%",
        width: "100%",
        lang: "zh_CN",
        i18n: window.VditorI18n,
        _lutePath: M,
        icon: "ant",
        cache: { enable: !1 },
        resize: { enable: !1 },
        toolbar: Q(),
        toolbarConfig: {
          hide: !1,
          pin: !0
        },
        preview: {
          delay: 200,
          maxWidth: U,
          markdown: {
            toc: !0,
            footnotes: !0,
            codeBlockPreview: !0,
            mathBlockPreview: !1,
            sanitize: !0,
            linkBase: E.current
          },
          hljs: {
            enable: !1,
            lineNumber: !1
          },
          render: {
            media: {
              enable: !0
            }
          }
        },
        upload: {
          multiple: !0,
          handler: async (f) => (await P({
            files: f,
            editor: i,
            onUploadAttachments: k.current,
            onUploadingChange: D,
            onError: b.current
          }), null)
        },
        input: (f) => {
          v.current = f, F.current(f);
        },
        after: () => {
          if (i) {
            if (g) {
              i.destroy();
              return;
            }
            c.current = !0, o.current = i, I(i, E.current), j(!0);
          }
        }
      }));
    })(), () => {
      g = !0, o.current === i && (o.current = null), c.current && i?.destroy(), c.current = !1;
    };
  }, []), s(() => {
    const t = h.current;
    if (!t)
      return;
    const g = (a) => {
      const w = G(a.clipboardData);
      w.length && (a.preventDefault(), P({
        files: w,
        editor: o.current,
        onUploadAttachments: k.current,
        onUploadingChange: D,
        onError: b.current
      }));
    }, i = (a) => {
      H(a) && (a.preventDefault(), L(!0));
    }, R = (a) => {
      t.contains(a.relatedTarget) || L(!1);
    }, f = (a) => {
      const w = Array.from(a.dataTransfer?.files || []);
      if (!w.length) {
        L(!1);
        return;
      }
      a.preventDefault(), L(!1), P({
        files: w,
        editor: o.current,
        onUploadAttachments: k.current,
        onUploadingChange: D,
        onError: b.current
      });
    };
    return t.addEventListener("paste", g, !0), t.addEventListener("dragover", i, !0), t.addEventListener("dragleave", R, !0), t.addEventListener("drop", f, !0), () => {
      t.removeEventListener("paste", g, !0), t.removeEventListener("dragover", i, !0), t.removeEventListener("dragleave", R, !0), t.removeEventListener("drop", f, !0);
    };
  }, []);
  const B = T ? "正在上传附件" : !x && !T ? "编辑器加载中" : "";
  return s(() => {
    u(e && B ? { label: B } : null);
  }, [e, u, B]), s(() => () => u(null), [u]), /* @__PURE__ */ z(
    "div",
    {
      className: `knowledge-markdown-editor${e ? " is-active" : ""}${N ? " is-dragging" : ""}`,
      "aria-hidden": !e,
      children: /* @__PURE__ */ z("div", { ref: h, className: "knowledge-vditor-editor" })
    }
  );
}
function I(e, n) {
  const r = e?.vditor.options.preview?.markdown;
  r && (r.linkBase = n), e?.vditor.lute?.SetLinkBase(n);
}
async function P({
  files: e,
  editor: n,
  onUploadAttachments: r,
  onUploadingChange: d,
  onError: m
}) {
  if (!n) {
    m?.(new Error("编辑器正在初始化，请稍后再试"));
    return;
  }
  d(!0);
  try {
    const u = (await r(e)).map((o) => {
      const c = $(o.name) ? "image" : "file";
      return q(o.name, c);
    }).filter(Boolean);
    if (!u.length)
      return;
    const h = `${u.join(`
`)}
`;
    n?.insertMD(h), n?.focus();
  } catch (p) {
    m?.(p);
  } finally {
    d(!1);
  }
}
function G(e) {
  if (!e)
    return [];
  const n = Array.from(e.files || []);
  return n.length ? n : Array.from(e.items || []).filter((r) => r.kind === "file").map((r) => r.getAsFile()).filter((r) => !!r);
}
function H(e) {
  return Array.from(e.dataTransfer?.types || []).includes("Files");
}
function J() {
  if (document.getElementById(C))
    return;
  const e = document.createElement("script");
  e.id = C, e.type = "application/javascript", document.head.appendChild(e);
}
function K() {
  return document.getElementById(A) ? Promise.resolve() : y || (y = new Promise((e, n) => {
    const r = document.createElement("script");
    r.src = M, r.async = !0, r.onload = () => {
      document.getElementById(A) ? r.remove() : r.id = A, e();
    }, r.onerror = () => {
      r.remove(), y = null, n(new Error("Vditor Lute 加载失败"));
    }, document.head.appendChild(r);
  }), y);
}
function Q() {
  return O.map((e) => e === "|" ? e : {
    name: e,
    tip: W[e] || e,
    tipPosition: "s"
  });
}
export {
  te as MarkdownLiveEditor,
  _ as preloadMarkdownLiveEditorRuntime
};
