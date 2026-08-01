import { j as a, a as w, F as tr } from "./createLucideIcon-CEtb6KSk.js";
import { c as be, u as v, b as Re, g as Er, a as g, d as C } from "./runtime-entry-CIrzyMsA.js";
import { L as Le } from "./loader-circle-QnfinZ3F.js";
import { A as Pr } from "./arrow-left-Dav-TMCY.js";
import { C as Ur } from "./copy-B2Ci6O8V.js";
import { H as _r } from "./history-DOFgCRvO.js";
import { p as Fr, a4 as ur, a5 as Or, a6 as zr, a7 as $r, a8 as H, a9 as qr, aa as Hr, ab as lr, ac as dr, ad as Wr, ae as Br, C as fr, af as Jr, b as mr, r as jr, ag as qe, ah as Gr, ai as Kr, aj as Qr, ak as pr, D as nr, al as Xr, i as Yr, am as Zr } from "./upload-asset-api-DAbIOMVJ.js";
import { t as N } from "./index-DqjOvQjw.js";
import { u as et, m as Me, b as pe, f as or, s as rt, d as tt, e as nt, g as ot, h as st, i as it } from "./space-page-BBWff1fq.js";
import { D as at, I as ct } from "./image-BBD2HfB8.js";
import { F as yr } from "./file-text-CclNuHuN.js";
import { StoryboardView as ut } from "./space-storyboard-view-BkbX9PeY.js";
import { M as lt } from "./media-inspector-gallery-DCSH8Khp.js";
import { B as dt } from "./bot-D9d02PZG.js";
import { E as ft } from "./eye-EJzwoxVH.js";
import { M as mt, V as pt } from "./space-video-compose-view-DmkdHGLn.js";
import { V as yt } from "./video-BAp8-tqb.js";
import { W as ht } from "./workflow-Cs2Tatpf.js";
import { P as vt } from "./space-power-icon-DPR3KYFq.js";
import { C as gt } from "./circle-alert-QPWZCk4j.js";
import { u as wt } from "./asset-reference-provider-qeDIBhpP.js";
import { c as bt, b as Ct, d as Rt } from "./space-DNu08Ce2.js";
function kt(e, r) {
  const n = Nt(e, r), t = Fr(n);
  if (t)
    return {
      mode: "storyboard",
      value: t,
      format: "json",
      summary: ur(t),
      downloadUrl: ""
    };
  const i = vr(n);
  if (i) {
    const m = Et(n) ? null : Or(i);
    return m && (e.kind === "text" || zr(m.plainText)) ? ze(m.markdown) : sr(i);
  }
  const c = We(n);
  if (c)
    return {
      mode: "file",
      value: c,
      format: "json",
      summary: c.description || c.name || "文件内容",
      downloadUrl: c.url
    };
  const u = Tt(n);
  if (u)
    return ze(u);
  const l = At(n);
  if (l)
    return sr(l);
  const y = Be(n) || e.description || "";
  return ze(y);
}
function St(e, r, n = {}) {
  const t = n.includeNodeResult === !1 ? r?.content : $r(
    r?.content,
    e.asset?.version?.content,
    e.resultOutput,
    gr(e, "result", "output")
  ), i = H(t), c = qr(i);
  for (const l of [i, H(c)])
    if (Hr(l))
      return Dt(l);
  const u = Mt(e.kind, i);
  if (u)
    return u;
}
function Dt(e) {
  const r = dr?.(e), t = (Array.isArray(r) ? r : [e]).map((i) => {
    if (!Q(i) || i.json === void 0)
      return i;
    const c = { ...i };
    return delete c.json, c;
  });
  return t.length === 1 ? t[0] : t;
}
function Nt(e, r) {
  return _t(
    r?.content,
    e.asset?.version?.content,
    e.resultOutput,
    gr(e, "result", "output"),
    e.description
  );
}
function Je(e) {
  if (e.mode === "storyboard")
    return e.value;
  if (e.mode === "file")
    return It(e.value);
  const r = String(e.value || "");
  return e.format === "markdown" ? { format: "markdown", text: r } : Ce(H(r)) || Lt(r);
}
function Vt(e) {
  return Cr(Je(e));
}
function Te(e, r) {
  const n = { ...e, value: r };
  if (n.mode === "storyboard")
    n.summary = ur(r);
  else if (n.mode === "file") {
    const t = r;
    n.summary = t.description || t.name || "文件内容", n.downloadUrl = t.url;
  } else
    n.summary = je(lr(Je(n)));
  return n;
}
function sr(e) {
  const r = lr(e);
  return {
    mode: "rich",
    value: Cr(e),
    format: "json",
    summary: je(r),
    downloadUrl: hr(e)
  };
}
function ze(e) {
  return {
    mode: "rich",
    value: e,
    format: "markdown",
    summary: je(e),
    downloadUrl: ""
  };
}
function At(e) {
  if (typeof e == "string" && H(e) === e)
    return null;
  const r = dr?.(e) ?? e, n = [];
  return He(
    r,
    n,
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    /* @__PURE__ */ new Set(),
    0
  ), n.length === 0 ? null : Ce({ type: "doc", content: n });
}
function He(e, r, n, t, i, c) {
  if (e == null || c > 12)
    return;
  const u = H(e);
  if (typeof u == "string") {
    ir(r, u, t);
    return;
  }
  if (Array.isArray(u)) {
    u.forEach(
      (y) => He(
        y,
        r,
        n,
        t,
        i,
        c + 1
      )
    );
    return;
  }
  if (!Q(u) || n.has(u))
    return;
  n.add(u);
  const l = vr(u);
  if (l) {
    for (const y of l.content || [])
      r.push(y);
    return;
  }
  ir(r, Se(u.title, u.text), t), xt(u, r, i);
  for (const y of [
    "rich",
    "content",
    "output",
    "result",
    "data",
    "body",
    "value"
  ])
    u[y] !== void 0 && He(
      u[y],
      r,
      n,
      t,
      i,
      c + 1
    );
}
function xt(e, r, n) {
  const t = [
    { kind: "image", values: [e.image, e.image_url, e.imageUrl, e.images] },
    { kind: "video", values: [e.video, e.video_url, e.videoUrl, e.videos] },
    { kind: "audio", values: [e.audio, e.audio_url, e.audioUrl, e.audios] }
  ];
  for (const i of t)
    for (const c of i.values)
      for (const u of ke(c)) {
        const l = `${i.kind}:${u}`;
        n.has(l) || (n.add(l), r.push({
          type: Pt(i.kind),
          attrs: { src: u }
        }));
      }
}
function ir(e, r, n) {
  const t = String(r || "").trim();
  !t || br(t) || Ge(t) || n.has(t) || (n.add(t), e.push({
    type: "paragraph",
    content: [{ type: "text", text: t }]
  }));
}
function ke(e) {
  return Array.isArray(e) ? e.flatMap(ke) : typeof e == "string" ? br(e.trim()) ? [e.trim()] : [] : Q(e) ? [
    e.url,
    e.src,
    e.path,
    e.download_url,
    e.downloadUrl
  ].flatMap(ke) : [];
}
function We(e) {
  const r = H(e);
  if (Array.isArray(r)) {
    for (const t of r) {
      const i = We(t);
      if (i)
        return i;
    }
    return null;
  }
  if (!Q(r))
    return null;
  const n = Ut(
    r.file,
    r.file_url,
    r.fileUrl,
    r.files
  );
  if (n)
    return {
      url: n,
      name: Se(r.name, r.filename, r.title) || wr(n),
      description: Se(r.description, r.text, r.summary)
    };
  for (const t of ["content", "output", "result", "data", "body", "value"])
    if (r[t] !== void 0) {
      const i = We(r[t]);
      if (i)
        return i;
    }
  return null;
}
function It(e) {
  return {
    type: "file",
    file_url: e.url,
    name: e.name || wr(e.url),
    description: e.description.trim()
  };
}
function Mt(e, r) {
  if (e !== "image" && e !== "video" && e !== "audio")
    return;
  const n = ke(r);
  if (n.length !== 0)
    return {
      [`${e}s`]: n
    };
}
function Be(e) {
  const r = H(e);
  if (typeof r == "string")
    return Ge(r) ? "" : r;
  if (Array.isArray(r))
    return r.map(Be).filter(Boolean).join(`

`);
  if (!Q(r))
    return "";
  const n = Se(r.text, r.summary, r.description);
  if (n)
    return n;
  for (const t of ["content", "output", "result", "data", "body", "value"])
    if (r[t] !== void 0) {
      const i = Be(r[t]);
      if (i)
        return i;
    }
  return "";
}
function Tt(e) {
  const r = H(e);
  return typeof r == "string" ? Ge(r) ? "" : r : Q(r) && String(r.format || "").trim().toLowerCase() === "markdown" ? Se(r.text, r.markdown) : "";
}
function Lt(e) {
  const r = e.split(/\n{2,}/).map((n) => n.trim());
  return {
    type: "doc",
    content: (r.length ? r : [""]).map((n) => ({
      type: "paragraph",
      content: n ? [{ type: "text", text: n }] : []
    }))
  };
}
function hr(e) {
  if (!e || typeof e != "object")
    return "";
  if (["editorMediaImage", "editorMediaVideo", "editorMediaAudio"].includes(
    String(e.type || "")
  ))
    return String(e.attrs?.src || "").trim();
  for (const r of Array.isArray(e.content) ? e.content : []) {
    const n = hr(r);
    if (n)
      return n;
  }
  return "";
}
function Ce(e) {
  try {
    return Wr(e);
  } catch {
    return null;
  }
}
function vr(e) {
  const r = H(e);
  if (!Q(r))
    return null;
  if (String(r.type || "") === "doc")
    return Ce(r);
  const n = Object.keys(r).filter((t) => t !== "format");
  return n.length === 1 && n[0] === "rich" ? Ce(r.rich) : String(r.format || "").trim().toLowerCase() === "rich_json" ? Ce(r.rich ?? r.content) : null;
}
function Et(e) {
  const r = H(e);
  return Q(r) && String(r.format || "").trim().toLowerCase() === "rich_json";
}
function Pt(e) {
  return {
    image: "editorMediaImage",
    video: "editorMediaVideo",
    audio: "editorMediaAudio"
  }[e];
}
function Ut(...e) {
  for (const r of e) {
    const n = ke(r)[0];
    if (n)
      return n;
  }
  return "";
}
function Se(...e) {
  for (const r of e)
    if (typeof r == "string" && r.trim())
      return r.trim();
  return "";
}
function _t(...e) {
  return e.find((r) => r != null);
}
function gr(e, ...r) {
  let n = e;
  for (const t of r) {
    if (!Q(n))
      return;
    n = n[t];
  }
  return n;
}
function wr(e) {
  const n = (e.split(/[?#]/)[0] || "").split("/").pop() || "";
  try {
    return decodeURIComponent(n) || "文件";
  } catch {
    return n || "文件";
  }
}
function je(e) {
  const r = String(e || "").replace(/\s+/g, " ").trim();
  return r.length > 120 ? `${r.slice(0, 120)}…` : r || "暂无内容";
}
function br(e) {
  return /^(https?:\/\/|\/|data:)/i.test(e);
}
function Ge(e) {
  const r = e.trim();
  return r.startsWith("{") && r.endsWith("}") || r.startsWith("[") && r.endsWith("]");
}
function Q(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function Cr(e) {
  try {
    return JSON.stringify(e);
  } catch {
    return "";
  }
}
const { RichTextEditor: ar } = Er("@/components/rich-text-editor");
function Ft({
  content: e,
  mediaOutput: r,
  mediaKind: n,
  mediaPrompt: t,
  readonly: i,
  referenceItems: c,
  storyboardFocus: u,
  storyboardWorkflowAction: l,
  onConfirmStoryboard: y,
  onReviewStoryboard: m,
  onCreateStoryboardRevision: _,
  onChange: d
}) {
  if (r !== void 0 && (n === "image" || n === "video"))
    return /* @__PURE__ */ a(Ot, { kind: n, output: r });
  if (r !== void 0 && n === "audio")
    return /* @__PURE__ */ a("div", { className: "wb-detail-readonly-content is-audio", children: /* @__PURE__ */ a(Br, { kind: "audio", content: r, prompt: t }) });
  if (r !== void 0)
    return /* @__PURE__ */ a(
      fr,
      {
        className: "ws-node-detail-media",
        output: r,
        emptyText: "暂无媒体内容",
        mediaLayout: "chat"
      }
    );
  if (e.mode === "storyboard")
    return /* @__PURE__ */ a("div", { className: "ws-node-detail-storyboard", children: /* @__PURE__ */ a(
      ut,
      {
        storyboard: e.value,
        layout: "split",
        editable: !i,
        referenceItems: c,
        focus: u,
        workflowAction: l,
        onConfirm: y,
        onReview: m,
        onCreateRevision: _,
        onChange: (F) => d(Te(e, F)),
        showSaveStatus: !1
      }
    ) });
  if (e.mode === "file")
    return /* @__PURE__ */ a(
      $t,
      {
        content: e,
        readonly: i,
        onChange: d
      }
    );
  const M = String(e.value || "");
  return /* @__PURE__ */ a("div", { className: "ws-node-detail-editor", children: ar ? /* @__PURE__ */ a(
    ar,
    {
      value: M,
      onChange: (F) => d(Te(e, F)),
      contentFormat: e.format,
      placeholder: "编辑内容",
      disabled: i,
      minHeight: 0,
      maxHeight: 2400,
      controlClassName: "ws-node-detail-rich-editor"
    }
  ) : /* @__PURE__ */ a(
    "textarea",
    {
      className: "ws-node-detail-fallback-editor",
      readOnly: i,
      value: M,
      onChange: (F) => d(Te(e, F.target.value)),
      placeholder: "编辑内容"
    }
  ) });
}
function Ot({
  kind: e,
  output: r
}) {
  const n = be(
    () => Jr(r, e),
    [e, r]
  ), t = be(
    () => n.map((l, y) => ({
      id: l,
      name: zt(l, e, y),
      url: l
    })),
    [e, n]
  ), [i, c] = v(0), u = n.join(`
`);
  return Re(() => {
    c(0);
  }, [u]), t.length === 0 ? /* @__PURE__ */ a(
    fr,
    {
      className: "ws-node-detail-media",
      output: r,
      emptyText: "暂无媒体内容",
      mediaLayout: "chat"
    }
  ) : /* @__PURE__ */ a(
    lt,
    {
      kind: e,
      items: t,
      activeIndex: Math.min(i, t.length - 1),
      className: "ws-node-detail-media-gallery",
      onSelect: c
    }
  );
}
function zt(e, r, n) {
  const t = e.split(/[?#]/, 1)[0], i = t.slice(t.lastIndexOf("/") + 1);
  if (i)
    try {
      return decodeURIComponent(i);
    } catch {
      return i;
    }
  return `${r === "image" ? "图片" : "视频"} ${n + 1}`;
}
function $t({
  content: e,
  readonly: r,
  onChange: n
}) {
  const t = e.value, i = (c) => {
    n(Te(e, { ...t, ...c }));
  };
  return /* @__PURE__ */ w("div", { className: "ws-node-detail-file-editor", children: [
    /* @__PURE__ */ w("div", { className: "ws-node-detail-file-block", children: [
      /* @__PURE__ */ a("span", { "aria-hidden": "true", children: /* @__PURE__ */ a(yr, { size: 24 }) }),
      /* @__PURE__ */ w("div", { children: [
        r ? /* @__PURE__ */ a("strong", { children: t.name || "文件" }) : /* @__PURE__ */ a(
          "input",
          {
            value: t.name,
            "aria-label": "文件名称",
            placeholder: "文件名称",
            onChange: (c) => i({ name: c.target.value })
          }
        ),
        /* @__PURE__ */ a("small", { children: t.url })
      ] }),
      /* @__PURE__ */ a(mr, { label: "下载文件", children: /* @__PURE__ */ a("a", { href: t.url, download: !0, "aria-label": "下载文件", children: /* @__PURE__ */ a(at, { size: 17 }) }) })
    ] }),
    r ? /* @__PURE__ */ a("p", { children: t.description || "暂无文件说明" }) : /* @__PURE__ */ a(
      "textarea",
      {
        value: t.description,
        rows: 8,
        placeholder: "补充文件说明",
        onChange: (c) => i({ description: c.target.value })
      }
    )
  ] });
}
function qt({
  node: e,
  contentLabel: r,
  versionSelect: n,
  updatedAt: t,
  status: i,
  readonly: c,
  downloadUrl: u,
  onRetry: l,
  onClose: y
}) {
  const m = e.type === "power" ? jr(e.power, e.kind, e.outputType) : null, _ = m && m.outputName !== r ? `${m.outputName} · ${r}` : m?.outputName || r;
  return /* @__PURE__ */ a(
    Gr,
    {
      icon: /* @__PURE__ */ a(Wt, { node: e }),
      title: e.title || "节点详情",
      subtitle: _,
      versionSelect: n,
      state: c ? /* @__PURE__ */ a("span", { className: "wb-detail-state", children: "只读预览" }) : i === "error" ? /* @__PURE__ */ a(mr, { label: "重试保存", children: /* @__PURE__ */ w(
        "button",
        {
          type: "button",
          className: "wb-detail-state is-error",
          onClick: l,
          children: [
            /* @__PURE__ */ a(qe, { size: 12 }),
            "保存失败"
          ]
        }
      ) }) : /* @__PURE__ */ w("span", { className: `wb-detail-state is-${i}`, children: [
        i === "saving" ? /* @__PURE__ */ a(Le, { size: 12, className: "wb-detail-spin" }) : null,
        Ht(i)
      ] }),
      updatedAt: t,
      downloadUrl: u,
      onClose: y
    }
  );
}
function Ht(e) {
  return e === "dirty" ? "未保存" : e === "saving" ? "保存中" : "已保存";
}
function Wt({ node: e }) {
  if (e.type === "power")
    return /* @__PURE__ */ a(
      vt,
      {
        power: e.power,
        kind: e.kind,
        outputType: e.outputType,
        size: 16
      }
    );
  const r = Bt(e);
  return /* @__PURE__ */ a(r, { size: 16 });
}
function Bt(e) {
  return e.type === "agent" ? dt : e.type === "flow" ? ht : e.type === "function" ? ft : e.kind === "image" ? ct : e.kind === "video" ? yt : e.kind === "audio" ? mt : yr;
}
function Jt({
  value: e,
  resetKey: r,
  fingerprint: n,
  save: t,
  onError: i,
  debounceMs: c = 1200
}) {
  const [u, l] = v(e), [y, m] = v("saved"), _ = g(e), d = g(e), M = g(n), F = g(t), ye = g(i), ee = g(n(e)), T = g(0), S = g(0), V = g(null), W = g(null), B = g(async () => !1), L = g(!1), A = g(!0);
  _.current = e, M.current = n, F.current = t, ye.current = i;
  const x = C(() => {
    V.current !== null && (window.clearTimeout(V.current), V.current = null);
  }, []), O = C(
    async (R, z = !1) => {
      x();
      const X = S.current;
      for (; A.current && X === S.current; ) {
        if (W.current && (!await W.current || X !== S.current))
          return !1;
        if (!z && R !== void 0 && R !== T.current)
          return !0;
        const ue = d.current, E = M.current(ue);
        if (E === ee.current)
          return L.current = !1, A.current && m("saved"), !0;
        const J = T.current;
        A.current && m("saving");
        const le = F.current(ue).then(() => {
          if (!A.current || X !== S.current)
            return !1;
          ee.current = E, L.current = !1;
          const $ = M.current(d.current);
          return m(
            $ === E ? "saved" : "dirty"
          ), !0;
        }).catch(($) => (A.current && X === S.current && (x(), L.current = !0, m("error"), ye.current?.($)), !1));
        W.current = le;
        const j = await le;
        if (W.current === le && (W.current = null), !j)
          return !1;
        if (!z && J !== T.current && V.current === null && !L.current) {
          const $ = T.current;
          V.current = window.setTimeout(() => {
            V.current = null, B.current($);
          }, c);
        }
        if (!z || J === T.current)
          return !0;
      }
      return !1;
    },
    [x, c]
  );
  B.current = O;
  const ce = C(
    (R) => {
      x(), !L.current && (V.current = window.setTimeout(() => {
        V.current = null, O(R);
      }, c));
    },
    [x, c, O]
  ), De = C(
    (R) => {
      const z = typeof R == "function" ? R(d.current) : R, X = M.current(z);
      if (d.current = z, l(z), T.current += 1, X === ee.current) {
        x(), L.current = !1, m("saved");
        return;
      }
      if (L.current) {
        m("error");
        return;
      }
      m("dirty"), ce(T.current);
    },
    [x, ce]
  ), Ne = C(async () => O(void 0, !0), [O]), he = C(async () => (L.current = !1, O(void 0, !0)), [O]);
  return Re(() => {
    const R = _.current;
    S.current += 1, T.current = 0, d.current = R, ee.current = M.current(R), L.current = !1, W.current = null, x(), l(R), m("saved");
  }, [x, r]), Re(() => (A.current = !0, () => {
    A.current = !1, S.current += 1, x();
  }), [x]), {
    draft: u,
    status: y,
    setDraft: De,
    flush: Ne,
    retry: he,
    hasPendingChanges: y !== "saved"
  };
}
function jt({
  versions: e,
  currentVersionId: r,
  selectedVersionId: n,
  total: t,
  hasMore: i,
  loading: c,
  loadingMore: u,
  error: l,
  onSelect: y,
  onLoadMore: m,
  onRetry: _
}) {
  return /* @__PURE__ */ a(
    Qr,
    {
      options: e.map((d) => ({
        id: Number(d.id || 0),
        version: Number(d.version || 0),
        updatedAt: String(d.updated_at || d.created_at || ""),
        value: d
      })),
      currentVersionId: r,
      selectedVersionId: n,
      total: t,
      hasMore: i,
      loading: c,
      loadingMore: u,
      error: l,
      onSelect: y,
      onLoadMore: m,
      onRetry: _
    }
  );
}
function Gt(e) {
  return Kr(e);
}
function Kt({
  projectId: e,
  node: r
}) {
  const n = String(r.runError || "").trim(), { error: t, loading: i } = et(e, r);
  return n ? /* @__PURE__ */ w("div", { className: "wb-detail-error-banner is-run-error", role: "alert", children: [
    /* @__PURE__ */ a(gt, { size: 17 }),
    /* @__PURE__ */ w("div", { children: [
      /* @__PURE__ */ a("strong", { children: "最近一次运行失败" }),
      /* @__PURE__ */ a("p", { children: t || n }),
      i ? /* @__PURE__ */ w("small", { children: [
        /* @__PURE__ */ a(Le, { size: 12, className: "wb-detail-spin" }),
        "正在读取完整原因"
      ] }) : null
    ] })
  ] }) : null;
}
function Cn({
  projectId: e,
  teamId: r,
  assetCateId: n,
  node: t,
  canvasReferenceItems: i,
  storyboardFocus: c,
  onNodeDraftChange: u,
  onRunNode: l,
  onAssetUpdated: y,
  onClose: m
}) {
  const _ = wt({
    teamID: r,
    scopeProjectID: e,
    initialFilters: {
      sourceType: "project",
      projectID: e,
      assetCateID: n
    }
  }), d = Number(t.asset?.id || 0), M = pr(
    t.power,
    t.kind,
    t.outputType
  ), [F, ye] = v(
    () => t.composerDraft?.videoComposition || nr()
  ), [ee, T] = v(!1), [S, V] = v(t.asset), [W, B] = v(
    () => $e(t.asset)
  ), [L, A] = v(W.length), [x, O] = v(1), [ce, De] = v(!1), [Ne, he] = v(d > 0), [R, z] = v(!1), [X, ue] = v(""), [E, J] = v(
    () => U(t.asset)
  ), [le, j] = v(
    null
  ), [$, Ee] = v(!1), [Pe, re] = v(""), [te, Ke] = v(!1), [q, ne] = v(""), [Qe, Xe] = v(!1), [Ue, _e] = v(!1), [Rr, de] = v(0), I = g(S), D = g(E), ve = g(y), fe = g(t), me = g(0), oe = g(0), ge = g(null), we = g(null), Fe = g(!1);
  I.current = S, D.current = E, ve.current = y, fe.current = t;
  const Ve = C(
    (s) => {
      const o = Me(
        { ...s.asset, versions: s.versions },
        I.current || fe.current.asset
      ), f = o.version, h = pe(
        f ? [f] : [],
        s.versions
      ), b = U(o);
      I.current = o, D.current = b, V(o), B(h), A(Math.max(s.versionTotal, h.length)), O(1), De(s.hasMore), J(b), j(null), re(""), de((p) => p + 1), ve.current?.(o);
    },
    []
  ), Ae = C((s) => {
    const o = Me(
      s,
      I.current || fe.current.asset
    ), f = U(o);
    I.current = o, D.current = f, V(o), J(f), B((h) => {
      const b = pe(
        o.version ? [o.version] : [],
        h
      );
      return A((p) => Math.max(p, b.length)), b;
    }), j(null), re(""), de((h) => h + 1), ve.current?.(o);
  }, []), se = C(async () => {
    if (!d) {
      he(!1), ue("");
      return;
    }
    const s = me.current + 1;
    me.current = s, he(!0), ue("");
    try {
      const o = await or({ projectId: e, assetId: d });
      if (s !== me.current)
        return;
      Ve(o);
    } catch (o) {
      if (s !== me.current)
        return;
      ue(K(o, "读取版本记录失败"));
    } finally {
      s === me.current && he(!1);
    }
  }, [Ve, d, e]);
  Re(() => {
    I.current = t.asset, V(t.asset), B($e(t.asset)), A($e(t.asset).length);
    const s = U(t.asset);
    return D.current = s, J(s), j(null), re(""), ne(""), we.current = null, de((o) => o + 1), ye(
      t.composerDraft?.videoComposition || nr()
    ), se(), () => {
      me.current += 1, oe.current += 1;
    };
  }, [se, t.id]);
  const P = U(S), ie = !E || E === P, Y = ie ? S?.version : le, kr = be(
    () => kt(t, Y),
    [Y, t]
  ), xe = be(
    () => St(t, Y, {
      includeNodeResult: ie
    }),
    [Y, ie, t]
  ), Ye = be(() => {
    const s = Xr(xe);
    return s.length === 1 ? s[0] : void 0;
  }, [xe]), Sr = typeof Y?.source?.prompt == "string" ? Y.source.prompt.trim() : String(t.composerDraft?.prompt || "").trim(), Dr = C(
    async (s) => {
      const o = I.current, f = o?.version, h = U(o);
      if (!o?.id || !f?.id || D.current !== h)
        throw new Error("当前内容不可编辑");
      const b = await rt({
        projectId: e,
        assetId: o.id,
        versionId: f.id,
        content: Je(s)
      }), p = Me(
        b,
        o
      );
      p.version && (p.version = {
        ...p.version,
        summary: s.summary
      });
      const ae = U(p);
      I.current = p, D.current = ae, V(p), J(ae), B(
        (G) => pe(
          G,
          p.version ? [p.version] : []
        )
      ), ae && ae !== h && A((G) => G + 1), ve.current?.(p);
    },
    [e]
  ), k = Jt({
    value: kr,
    resetKey: `${t.id}:${E}:${Rr}`,
    fingerprint: Vt,
    save: Dr,
    onError: (s) => N.error(K(s, "保存失败"))
  }), Nr = C(
    async (s, o) => {
      if (q || !await k.flush())
        return !1;
      const h = I.current, b = U(h);
      if (!h?.id || !b)
        return N.error("当前分镜尚未保存，不能确认"), !1;
      ne("confirming");
      try {
        const p = await tt({
          projectId: e,
          assetId: h.id,
          versionId: b,
          productionPlan: o
        });
        return Ae(p), N.success("分镜已确认，制作组将按当前版本同步"), !0;
      } catch (p) {
        return N.error(K(p, "确认分镜失败")), !1;
      } finally {
        ne("");
      }
    },
    [Ae, k.flush, e, q]
  ), Ze = C(async () => {
    if (q)
      return;
    const s = I.current, o = D.current;
    if (!s?.id || !o) {
      N.error("当前分镜版本不可用");
      return;
    }
    ne("revising");
    try {
      const f = we.current?.versionId === o ? we.current : {
        versionId: o,
        requestId: cr("revision", o)
      };
      we.current = f;
      const h = await nt({
        projectId: e,
        assetId: s.id,
        versionId: o,
        requestId: f.requestId,
        nodeKey: t.id
      });
      Ae(h), we.current = null, N.success("已创建新的分镜修订稿"), se();
    } catch (f) {
      N.error(K(f, "创建分镜修订稿失败"));
    } finally {
      ne("");
    }
  }, [
    Ae,
    se,
    t.id,
    e,
    q
  ]), Vr = C(
    async (s) => {
      if (q || !l || !await k.flush())
        return;
      const f = Xt(s), h = bt(
        fe.current.composerDraft?.promptContent
      );
      ne("reviewing");
      try {
        const b = l({
          ...fe.current,
          composerDraft: {
            ...fe.current.composerDraft || {},
            prompt: f,
            promptContent: h.length ? Ct(f, h) : void 0
          }
        });
        N.info("已开始 AI 审查，正在重新生成分镜"), m(), b.then(() => {
          N.success("AI 审查完成，可重新打开分镜确认结果");
        }).catch((p) => {
          N.error(K(p, "AI 审查分镜失败"));
        });
      } catch (b) {
        ne(""), N.error(K(b, "AI 审查分镜失败"));
      }
    },
    [k.flush, m, l, q]
  ), Ar = C(async () => {
    D.current === P && !await k.flush() || await se();
  }, [P, k.flush, se]), Oe = C(
    async (s) => {
      if (!d || !s || s === P)
        return;
      const o = oe.current + 1;
      oe.current = o, Ee(!0), re(""), j(null);
      try {
        const f = await ot({
          projectId: e,
          assetId: d,
          versionId: s
        });
        if (o !== oe.current || D.current !== s)
          return;
        j(f), de((h) => h + 1);
      } catch (f) {
        if (o !== oe.current)
          return;
        re(K(f, "读取历史版本失败"));
      } finally {
        o === oe.current && Ee(!1);
      }
    },
    [d, P, e]
  ), er = C(
    async (s) => {
      if (te)
        return;
      const o = Number(s.id || 0);
      if (!(!o || o === D.current) && !(D.current === P && !await k.flush())) {
        if (D.current = o, ge.current = null, J(o), o === P) {
          oe.current += 1, j(null), re(""), Ee(!1), de((f) => f + 1);
          return;
        }
        await Oe(o);
      }
    },
    [P, k.flush, Oe, te]
  ), xr = C(async () => {
    if (!(!d || !ce || R)) {
      z(!0);
      try {
        const s = await st({
          projectId: e,
          assetId: d,
          page: x + 1
        });
        B((o) => pe(o, s.items)), O(s.page), A(s.total), De(s.hasMore);
      } catch (s) {
        N.error(K(s, "加载更多版本失败"));
      } finally {
        z(!1);
      }
    }
  }, [d, ce, e, R, x]), Ir = C(async () => {
    const s = I.current, o = D.current;
    if (!(te || !s?.id || !o || o === U(s))) {
      Ke(!0);
      try {
        const f = ge.current?.versionId === o ? ge.current : {
          versionId: o,
          requestId: cr("restore", o)
        };
        ge.current = f;
        const h = await it({
          projectId: e,
          assetId: s.id,
          versionId: o,
          requestId: f.requestId,
          nodeKey: t.id
        }), b = Me(
          h,
          s
        );
        I.current = b, V(b), ve.current?.(b);
        try {
          const p = await or({
            projectId: e,
            assetId: s.id
          });
          Ve(p);
        } catch {
          const p = b.version;
          B(
            (G) => pe(p ? [p] : [], G)
          ), A((G) => G + 1);
          const ae = U(b);
          D.current = ae, J(ae), j(null), re(""), de((G) => G + 1);
        }
        ge.current = null, N.success("已切换到所选版本");
      } catch (f) {
        N.error(K(f, "切换版本失败"));
      } finally {
        Ke(!1);
      }
    }
  }, [Ve, t.id, e, te]), Ie = C(async () => {
    if (Fe.current)
      return;
    Fe.current = !0, Xe(!0);
    let s = !0;
    const o = I.current;
    if (k.hasPendingChanges && o?.id && o?.version?.id && D.current === U(o) && (s = await k.flush()), !s) {
      Fe.current = !1, Xe(!1), _e(!0);
      return;
    }
    m();
  }, [k.flush, k.hasPendingChanges, m]);
  Re(() => {
    const s = (o) => {
      if (o.key === "Escape") {
        if (o.preventDefault(), Ue) {
          _e(!1);
          return;
        }
        Ie();
      }
    };
    return window.addEventListener("keydown", s), () => window.removeEventListener("keydown", s);
  }, [Ie, Ue]);
  const Z = k.draft, Mr = Z.mode === "storyboard" && Yr(Z.value), rr = !ie || !M && (!S?.id || !S?.version?.id) || Mr, Tr = rr || Qe || d > 0 && Ne, Lr = !ie && ($ || Pe);
  return /* @__PURE__ */ w(
    Zr,
    {
      ariaLabel: `${t.title || "节点"}详情`,
      onRequestClose: Ie,
      header: /* @__PURE__ */ a(
        qt,
        {
          node: t,
          contentLabel: Qt(Z, t, Ye),
          versionSelect: d ? /* @__PURE__ */ a(
            jt,
            {
              versions: W,
              currentVersionId: P,
              selectedVersionId: E || P,
              total: L,
              hasMore: ce,
              loading: Ne,
              loadingMore: R,
              error: X,
              onSelect: (s) => {
                er(s);
              },
              onLoadMore: () => {
                xr();
              },
              onRetry: () => {
                Ar();
              }
            }
          ) : void 0,
          updatedAt: Gt(
            Y?.updated_at || Y?.created_at
          ),
          status: k.status,
          readonly: rr,
          downloadUrl: Z.downloadUrl,
          onRetry: () => {
            k.retry();
          },
          onClose: () => {
            Ie();
          }
        }
      ),
      children: [
        /* @__PURE__ */ w("main", { className: "wb-detail-workspace", children: [
          ie ? null : /* @__PURE__ */ w("div", { className: "wb-detail-history-bar", children: [
            /* @__PURE__ */ w("span", { children: [
              /* @__PURE__ */ a(_r, { size: 14 }),
              "正在查看第 ",
              le?.version || "-",
              " 版"
            ] }),
            /* @__PURE__ */ w("div", { children: [
              /* @__PURE__ */ w(
                "button",
                {
                  type: "button",
                  className: "wb-detail-command",
                  onClick: () => {
                    er(
                      S?.version || { id: P }
                    );
                  },
                  children: [
                    /* @__PURE__ */ a(Pr, { size: 13 }),
                    "返回当前版本"
                  ]
                }
              ),
              /* @__PURE__ */ w(
                "button",
                {
                  type: "button",
                  className: "wb-detail-command is-primary",
                  disabled: te || !!q || $ || !!Pe,
                  onClick: () => Z.mode === "storyboard" ? void Ze() : void Ir(),
                  children: [
                    te || q === "revising" ? /* @__PURE__ */ a(Le, { size: 13, className: "wb-detail-spin" }) : Z.mode === "storyboard" ? /* @__PURE__ */ a(Ur, { size: 13 }) : /* @__PURE__ */ a(qe, { size: 13 }),
                    Z.mode === "storyboard" ? q === "revising" ? "创建中" : "基于此版本创建修订稿" : te ? "切换中" : "切换到此版本"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ w("div", { className: "wb-detail-scroll", children: [
            /* @__PURE__ */ a(Kt, { projectId: e, node: t }),
            Lr ? /* @__PURE__ */ a("div", { className: "wb-detail-content-state", children: $ ? /* @__PURE__ */ w(tr, { children: [
              /* @__PURE__ */ a(Le, { size: 18, className: "wb-detail-spin" }),
              /* @__PURE__ */ a("span", { children: "正在读取历史内容" })
            ] }) : /* @__PURE__ */ w(tr, { children: [
              /* @__PURE__ */ a("span", { children: Pe }),
              /* @__PURE__ */ w(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    Oe(E);
                  },
                  children: [
                    /* @__PURE__ */ a(qe, { size: 13 }),
                    "重试"
                  ]
                }
              )
            ] }) }) : /* @__PURE__ */ a(
              Rt.Provider,
              {
                value: _,
                children: M ? /* @__PURE__ */ a(
                  pt,
                  {
                    composition: F,
                    referenceItems: i || [],
                    readonly: !ie || Qe || ee,
                    running: ee,
                    fullScreen: !0,
                    finalOutput: xe,
                    onChange: (s) => {
                      ye(s), u?.({
                        ...t.composerDraft || {},
                        videoComposition: s
                      });
                    },
                    onRun: l ? (s) => {
                      T(!0), l({
                        ...t,
                        composerDraft: {
                          ...t.composerDraft || {},
                          videoComposition: s
                        }
                      }).then(() => d ? se() : void 0).catch(
                        (o) => N.error(
                          o instanceof Error ? o.message : "视频合成失败"
                        )
                      ).finally(() => T(!1));
                    } : void 0
                  }
                ) : /* @__PURE__ */ a(
                  Ft,
                  {
                    content: Z,
                    mediaOutput: xe,
                    mediaKind: Ye,
                    mediaPrompt: Sr,
                    readonly: Tr,
                    referenceItems: i,
                    storyboardFocus: c,
                    storyboardWorkflowAction: q,
                    onConfirmStoryboard: Nr,
                    onReviewStoryboard: Vr,
                    onCreateStoryboardRevision: Ze,
                    onChange: k.setDraft
                  }
                )
              }
            )
          ] })
        ] }),
        Ue ? /* @__PURE__ */ a("div", { className: "ws-node-detail-discard-backdrop", children: /* @__PURE__ */ w(
          "div",
          {
            className: "ws-node-detail-discard-dialog",
            role: "alertdialog",
            "aria-modal": "true",
            "aria-label": "未保存内容",
            children: [
              /* @__PURE__ */ a("strong", { children: "当前修改尚未保存" }),
              /* @__PURE__ */ a("p", { children: "保存请求失败。可以继续编辑并重试，或放弃本次修改。" }),
              /* @__PURE__ */ w("div", { children: [
                /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    onClick: () => _e(!1),
                    children: "继续编辑"
                  }
                ),
                /* @__PURE__ */ a("button", { type: "button", className: "is-danger", onClick: m, children: "放弃修改" })
              ] })
            ]
          }
        ) }) : null
      ]
    }
  );
}
function $e(e) {
  return pe(
    e?.version ? [e.version] : [],
    e?.versions || []
  );
}
function U(e) {
  return Number(e?.version_id || e?.version?.id || 0);
}
function Qt(e, r, n) {
  return e.mode === "storyboard" ? "分镜脚本" : pr(r.power, r.kind, r.outputType) ? "视频合成" : n === "image" ? "图片内容" : n === "video" ? "视频内容" : n === "audio" ? "音频内容" : e.mode === "file" ? "文件" : r.kind === "image" || r.kind === "richtext" ? "图文内容" : r.kind === "video" ? "视频内容" : r.kind === "audio" ? "音频内容" : e.format === "markdown" ? "Markdown" : "富文本";
}
function Xt(e) {
  return [
    "请审查并优化下面这份现有分镜脚本，直接通过 submit_output 返回完整的新分镜，不要输出解释。",
    "必须保持用户已经确定的标题、目标总时长、目标镜头数、画幅、画面类型、参考素材用途和明确剧情约束。",
    "必须保留所有仍代表同一实体的 material、shot、speech、caption 稳定 ID，并原样保留 narrator_voice 与每个角色的 voice。",
    "重点修复：镜头因果不连贯、重复 beat、动作过多或不可生成、人物道具凭空出现、错误的 match_previous/continue_previous、转场滥用、对白越界或重叠。",
    "普通新镜头不要引用上一镜；只有需要匹配上一镜结束画面时使用 match_previous，只有同一动作从上一段真实尾帧继续时使用 continue_previous，二者互斥。",
    "确认 target_shot_count 等于 shots 数量，target_duration 等于全部 duration 之和，镜头不超过 50 个。",
    `当前分镜 JSON：${JSON.stringify(e)}`
  ].join(`
`);
}
function cr(e, r) {
  const n = typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${e}-${r}-${n}`.slice(0, 64);
}
function K(e, r) {
  return e instanceof Error && e.message ? e.message : r;
}
export {
  Cn as NodeDetailDialog
};
