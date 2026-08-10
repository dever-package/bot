import { m as pe } from "./in-flight-request-DlB1DJg0.js";
import { a as Ee } from "./stream-Y1y6FALE.js";
import { r as O, b as J, a as Pe, n as ge, c as Le, d as xe, i as X, e as Ke, f as Fe, g as je, h as He } from "./interaction-CdOaiJOA.js";
import { a as i, j as p, F as be } from "./_commonjsHelpers-CTFd9u1x.js";
import { aB as qe, x as Ue, M as Ve, L as z, I as Ge, X as ye, F as B, J as We, V as Y, N as Q, au as Ze, aC as Je, aD as Xe, aE as Ye, b as Qe, C as ee, aF as et, c as tt, g as nt, ax as rt, p as st, aG as it } from "./vendor-icons-Cc7Kl3It.js";
import { h as ve, j as we, l as I, b as C, o as M, m as _e, u as A, n as ot } from "./react-C7Xtl8sB.js";
import { m as ke } from "./button-CpfaQlDK.js";
import { m as E } from "./sheet-CM50TMuv.js";
import { m as S } from "./utils-B_fxI2dk.js";
import { A as T, a as at, c as lt } from "./clipboard-B77WuM2Y.js";
import { m as te } from "./content-view-DKqPlRti.js";
import { M as ct } from "./media-inspector-gallery-nBFOIame.js";
import { M as ut, r as dt } from "./vendor-assistant-BFRzuzys.js";
import { m as mt } from "./interaction-panel-Cd_uLE-L.js";
const ft = pe.resolveAssetUrl, Ne = ve({
  messageID: 0
});
function ht({
  messageID: e,
  render: n,
  children: t
}) {
  return /* @__PURE__ */ i(Ne.Provider, { value: { messageID: e, render: n }, children: t });
}
function pt() {
  return we(Ne);
}
function gt(e, n, t) {
  return {
    ...e,
    context: {
      source: "agent-chat",
      messageID: n,
      artifacts: t
    }
  };
}
function xt(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return null;
  const n = e;
  return n.source !== "agent-chat" || !Number(n.messageID) || !Array.isArray(n.artifacts) ? null : {
    source: "agent-chat",
    messageID: Number(n.messageID),
    artifacts: n.artifacts
  };
}
function Ae(e, n, t, r = 0) {
  const s = e.filter(
    (c) => c.kind === n && c.status === "ready" && c.url
  ), o = U(t);
  return s.find(
    (c) => U(c.url) === o || U(c.previewUrl) === o
  ) || s[r] || null;
}
function U(e) {
  return ft(String(e || "").trim());
}
const bt = ke.Button, yt = S.cn, Ce = ve(
  null
);
function jn() {
  const [e, n] = I(
    null
  ), [t, r] = I(0), s = C((g) => {
    const f = g.items.findIndex(
      (b) => String(b.id) === String(g.initialItemId)
    );
    n(g), r(f >= 0 ? f : 0);
  }, []), o = C(() => {
    n(null), r(0);
  }, []), a = C((g) => {
    r(g);
  }, []), c = C(
    (g) => {
      const f = e?.items.length || 0;
      f <= 1 || r((b) => (b + g + f) % f);
    },
    [e?.items.length]
  ), m = e?.items[t];
  return {
    request: e,
    activeIndex: t,
    activeItem: m,
    open: !!(e && m),
    openPreview: s,
    closePreview: o,
    selectIndex: a,
    move: c
  };
}
function Hn({
  controller: e,
  children: n
}) {
  return /* @__PURE__ */ i(Ce.Provider, { value: e.openPreview, children: n });
}
function vt() {
  return we(Ce) || void 0;
}
function qn({
  controller: e,
  renderArtifactActions: n
}) {
  const { request: t, activeIndex: r, activeItem: s, closePreview: o, move: a, selectIndex: c } = e, [m, g] = I(1), [f, b] = I(!1), [l, y] = I("");
  M(() => {
    g(1), y("");
  }, [s?.id]), M(() => {
    if (!t)
      return;
    const h = (N) => {
      if (N.key === "Escape") {
        N.preventDefault(), N.stopImmediatePropagation(), o();
        return;
      }
      Nt(N.target) || (N.key === "ArrowLeft" && (N.preventDefault(), a(-1)), N.key === "ArrowRight" && (N.preventDefault(), a(1)));
    };
    return window.addEventListener("keydown", h, !0), () => window.removeEventListener("keydown", h, !0);
  }, [o, a, t]);
  const w = C(async () => {
    if (!(!t || !s || f)) {
      b(!0), y("");
      try {
        await t.download(s.id);
      } catch (h) {
        y(h instanceof Error ? h.message : "下载素材失败");
      } finally {
        b(!1);
      }
    }
  }, [s, f, t]);
  if (!t || !s)
    return null;
  const v = t.items.length > 1, u = kt(t.kind), d = t.kind === "audio" || t.kind === "file", _ = xt(t.context), D = _ ? Ae(
    _.artifacts,
    t.kind,
    s.url,
    r
  ) : null, P = /* @__PURE__ */ p(
    "aside",
    {
      className: yt(
        "flex min-h-0 min-w-0 flex-col bg-background",
        d ? "relative max-h-[min(80dvh,480px)] w-full max-w-2xl overflow-hidden rounded-lg border shadow-xl" : "absolute inset-0 z-30 md:static md:z-auto md:flex-1 md:border-l"
      ),
      role: d ? "dialog" : void 0,
      "aria-modal": d ? "true" : void 0,
      "aria-label": `${u}预览`,
      children: [
        /* @__PURE__ */ p("header", { className: "flex h-14 shrink-0 items-center gap-3 border-b px-3 md:px-4", children: [
          /* @__PURE__ */ p("div", { className: "flex min-w-0 flex-1 items-center gap-2", children: [
            /* @__PURE__ */ i(wt, { kind: t.kind, className: "size-4 shrink-0" }),
            /* @__PURE__ */ p("span", { className: "shrink-0 text-sm font-semibold text-foreground", children: [
              u,
              v ? ` ${r + 1}/${t.items.length}` : ""
            ] }),
            t.kind === "audio" || t.kind === "file" ? /* @__PURE__ */ i("span", { className: "truncate text-xs text-muted-foreground", children: s.name }) : null
          ] }),
          /* @__PURE__ */ p("div", { className: "flex shrink-0 items-center gap-1", children: [
            D && _ && n ? n({
              messageID: _.messageID,
              artifact: D,
              placement: "preview"
            }) : null,
            t.kind === "image" ? /* @__PURE__ */ p(be, { children: [
              /* @__PURE__ */ i(
                $,
                {
                  label: "缩小",
                  disabled: m <= 0.5,
                  onClick: () => g((h) => oe(h - 0.25)),
                  children: /* @__PURE__ */ i(qe, {})
                }
              ),
              /* @__PURE__ */ p("span", { className: "hidden w-11 text-center text-xs tabular-nums text-muted-foreground sm:inline", children: [
                Math.round(m * 100),
                "%"
              ] }),
              /* @__PURE__ */ i(
                $,
                {
                  label: "放大",
                  disabled: m >= 3,
                  onClick: () => g((h) => oe(h + 0.25)),
                  children: /* @__PURE__ */ i(Ue, {})
                }
              ),
              /* @__PURE__ */ i($, { label: "适应窗口", onClick: () => g(1), children: /* @__PURE__ */ i(Ve, {}) })
            ] }) : null,
            /* @__PURE__ */ i(
              $,
              {
                label: "下载",
                disabled: f,
                onClick: () => {
                  w();
                },
                children: f ? /* @__PURE__ */ i(z, { className: "animate-spin" }) : /* @__PURE__ */ i(Ge, {})
              }
            ),
            /* @__PURE__ */ i($, { label: "关闭预览", onClick: o, children: /* @__PURE__ */ i(ye, {}) })
          ] })
        ] }),
        /* @__PURE__ */ i(
          ct,
          {
            kind: t.kind,
            items: t.items,
            activeIndex: r,
            zoom: m,
            compact: d,
            className: d ? "flex-none" : "flex-1",
            onSelect: c
          }
        ),
        l ? /* @__PURE__ */ i(
          "div",
          {
            role: "alert",
            className: "absolute bottom-4 left-1/2 max-w-[80%] -translate-x-1/2 rounded-md bg-destructive px-3 py-2 text-xs text-white shadow-lg",
            children: l
          }
        ) : null
      ]
    }
  );
  return d ? /* @__PURE__ */ i(
    "div",
    {
      className: "absolute inset-0 z-30 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-[1px]",
      role: "presentation",
      onPointerDown: (h) => {
        h.target === h.currentTarget && o();
      },
      children: P
    }
  ) : P;
}
function $({
  label: e,
  children: n,
  disabled: t,
  onClick: r
}) {
  return /* @__PURE__ */ i(T, { label: e, children: /* @__PURE__ */ i(
    bt,
    {
      type: "button",
      size: "icon",
      variant: "ghost",
      className: "size-9",
      "aria-label": e,
      disabled: t,
      onClick: r,
      children: /* @__PURE__ */ i("span", { className: "[&>svg]:size-4", children: n })
    }
  ) });
}
function wt({
  kind: e,
  className: n
}) {
  const t = _t[e];
  return /* @__PURE__ */ i(t, { className: n });
}
const _t = {
  image: Q,
  video: Y,
  audio: We,
  file: B
};
function kt(e) {
  return e === "image" ? "图片" : e === "video" ? "视频" : e === "audio" ? "音频" : "文件";
}
function oe(e) {
  return Math.min(3, Math.max(0.5, e));
}
function Nt(e) {
  return e instanceof HTMLElement && !!e.closest("button, input, textarea, select, video, audio");
}
const At = te.EnergonContentView, Ct = te.normalizeEnergonOutput, Ie = S.cn, Me = [
  "rich",
  "images",
  "videos",
  "audios",
  "files"
];
function It({
  output: e,
  excludeOutputs: n = [],
  excludeText: t = "",
  className: r
}) {
  const s = vt(), o = pt(), a = Se(e, {
    excludedKeys: zt(n),
    excludeText: t
  }), c = new Set(
    n.flatMap(
      (l) => O(l).map((y) => y.id)
    )
  ), m = O(e).filter(
    (l) => l.status === "generating" && !c.has(l.id)
  ), g = O(e).filter(
    (l) => l.status === "ready" && !c.has(l.id)
  ), f = o.render ? (l) => {
    const y = Ae(
      g,
      l.kind,
      l.item.url,
      l.index
    );
    return y && o.messageID > 0 ? o.render?.({
      messageID: o.messageID,
      artifact: y,
      placement: "inline"
    }) : null;
  } : void 0, b = s ? (l) => s(
    gt(
      l,
      o.messageID,
      g
    )
  ) : void 0;
  return a.length === 0 && m.length === 0 ? null : /* @__PURE__ */ p(
    "div",
    {
      className: Ie(
        "agent-chat-message-output mt-4 min-w-0 max-w-full",
        r
      ),
      children: [
        m.length > 0 ? /* @__PURE__ */ i(Mt, { artifacts: m }) : null,
        a.length > 0 ? /* @__PURE__ */ i(
          At,
          {
            output: a,
            mediaLayout: "chat",
            onMediaPreview: b,
            renderMediaActions: f
          }
        ) : null
      ]
    }
  );
}
function Mt({
  artifacts: e
}) {
  return /* @__PURE__ */ i("div", { className: "agent-chat-media-grid", role: "status", "aria-label": "素材生成中", children: e.map((n) => {
    const t = Dt(n.kind), r = n.kind === "image" || n.kind === "video";
    return /* @__PURE__ */ p(
      "div",
      {
        className: Ie(
          "agent-chat-media-placeholder relative flex overflow-hidden rounded-lg border bg-muted/30",
          r ? "items-center justify-center" : "h-24 items-center px-5"
        ),
        style: r ? { aspectRatio: n.kind === "video" ? "16 / 9" : "4 / 3" } : void 0,
        children: [
          /* @__PURE__ */ i(t, { className: "agent-chat-media-placeholder-icon relative size-7 text-muted-foreground/35" }),
          /* @__PURE__ */ i(z, { className: "agent-chat-media-spinner absolute right-3 top-3 z-[2] size-4 text-muted-foreground/55" })
        ]
      },
      n.id
    );
  }) });
}
function Dt(e) {
  return e === "image" ? Q : e === "video" ? Y : e === "audio" ? Ze : B;
}
function St(e) {
  return De(e).length > 0;
}
function De(e) {
  return Se(e, {
    excludedKeys: /* @__PURE__ */ new Set(),
    excludeText: ""
  });
}
function Se(e, n) {
  return Te(e).map((t) => Tt(t, n)).filter((t) => !!t);
}
function Te(e) {
  const n = Ct(e), t = J(e);
  return Object.keys(t).length > 0 ? [...n, t] : n;
}
function Tt(e, n) {
  const t = {};
  for (const r of Me) {
    if (n.excludedKeys.has(r))
      continue;
    const s = Rt(e[r], r, n.excludeText);
    W(s) && (t[r] = s);
  }
  return Object.keys(t).length === 0 ? null : (W(e.title) && (t.title = e.title), e.meta && (t.meta = e.meta), t);
}
function zt(e) {
  const n = /* @__PURE__ */ new Set();
  for (const t of e)
    for (const r of Te(t))
      for (const s of Me)
        W(r[s]) && n.add(s);
  return n;
}
function Rt(e, n, t) {
  return n === "rich" || !t || !Array.isArray(e) ? e : e.filter(
    (r) => typeof r != "string" || !t.includes(r)
  );
}
function W(e) {
  return e == null || e === "" ? !1 : !Array.isArray(e) || e.length > 0;
}
function Un(e) {
  const n = e.activities || [], t = e.document ? Pe(e.document) : e.text;
  return ze(t, n).map(
    (r) => r.type === "text" ? { type: "text", text: r.text } : {
      type: "tool-call",
      toolCallId: r.activity.id,
      toolName: r.activity.title,
      args: {},
      argsText: "{}",
      result: r.activity.output,
      isError: r.activity.status === "failed"
    }
  );
}
function ze(e, n) {
  const t = le(e, n);
  if (n.length === 0)
    return t ? [{ type: "text", text: t }] : [];
  const r = [];
  let s = 0;
  for (const o of n) {
    const a = le(
      o.anchorText,
      n
    ), c = Ot(t, a, s);
    ae(r, t.slice(s, c)), r.push({ type: "activity", activity: o }), s = c;
  }
  return ae(r, t.slice(s)), r;
}
function $t(e, n) {
  const t = [];
  let r = !1;
  for (const s of ze(e, n)) {
    if (s.type === "text") {
      t.push(s.text);
      continue;
    }
    const o = J(s.activity.output), a = De(
      Object.keys(o).length > 0 ? o : s.activity.output
    );
    a.length !== 0 && (r = !0, t.push(...a));
  }
  return r ? t : [];
}
function ae(e, n) {
  n && e.push({ type: "text", text: n });
}
function Ot(e, n, t) {
  if (!n)
    return t;
  if (e.startsWith(n))
    return Math.max(t, n.length);
  const r = e.indexOf(n, t);
  return r < 0 ? t : r + n.length;
}
function le(e, n) {
  let t = String(e || "").replace(/\r\n/g, `
`);
  for (const r of Bt(n)) {
    const s = Et(r);
    t = t.replace(
      new RegExp(
        `!\\[[^\\]]*\\]\\(\\s*<?${s}>?(?:\\s+["'][^"']*["'])?\\s*\\)`,
        "g"
      ),
      ""
    ).replace(
      new RegExp(
        `\\[[^\\]]*\\]\\(\\s*<?${s}>?(?:\\s+["'][^"']*["'])?\\s*\\)`,
        "g"
      ),
      ""
    );
  }
  return t.replace(/\n{3,}/g, `

`).trim();
}
function Bt(e) {
  const n = /* @__PURE__ */ new Set();
  for (const t of e)
    for (const r of ["images", "videos", "audios", "files"]) {
      const s = t.output[r];
      for (const o of Array.isArray(s) ? s : [s])
        typeof o == "string" && o.trim() && n.add(o.trim());
    }
  return n;
}
function Et(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const ne = pe.requestRaw, k = Ee.isPlainRecord;
async function Vn(e, n) {
  const t = await re(
    ne(e, "get", { agent_key: n }),
    "读取智能体输入参数失败"
  );
  return jt(t.params);
}
async function Gn(e, n) {
  const t = await re(
    ne(e, "get", { document_id: n }),
    "读取图文内容失败"
  ), r = xe(t);
  if (!r)
    throw new Error("图文内容无效");
  return r;
}
async function Pt(e, n) {
  const t = await R(
    n.create ? e.newSession : e.session,
    {
      session_id: n.sessionID || void 0,
      agent_key: n.agentKey,
      context_key: n.contextKey,
      title: n.title || "新会话",
      limit: n.limit || 10,
      last_message_id: n.lastMessageID || void 0
    }
  );
  return {
    session: j(t.session),
    messages: Kt(t.messages)
  };
}
async function Lt(e, n) {
  const t = await R(e.sessions, {
    agent_key: n.agentKey,
    context_key: n.contextKey,
    limit: n.limit || 20,
    last_session_id: n.lastSessionID || void 0,
    status: "active"
  }), s = (Array.isArray(t.sessions) ? t.sessions : []).map(j).filter((c) => !!c), o = n.limit || 20, a = t.has_more == null ? s.length >= o : !!t.has_more;
  return { sessions: s, hasMore: a };
}
async function Wn(e, n) {
  const t = await R(e.session, {
    session_id: n.sessionID,
    agent_key: n.agentKey,
    context_key: n.contextKey,
    session_only: !0
  });
  return j(t.session);
}
async function Zn(e, n, t) {
  const r = await R(e.renameSession, {
    session_id: n,
    title: t
  }), s = j(r.session);
  if (!s)
    throw new Error("更新会话标题失败");
  return s;
}
async function Jn(e, n) {
  await R(e.archiveSession, { session_id: n });
}
async function Xn(e, n, t) {
  const r = await R(e, {
    session_id: n.sessionID,
    agent_key: n.agentKey,
    ref_type: t.refType,
    ref_id: t.refId,
    label: t.label
  }), s = x(r.ref_type), o = Number(r.ref_id || 0);
  if (!se(s) || !o)
    throw new Error("引用内容无效");
  const a = r.text == null ? "" : String(r.text), c = ge(r.output), m = $t(
    a,
    Le(c)
  );
  return {
    refType: s,
    refId: o,
    title: x(r.title) || t.label,
    text: a,
    media: qt(r.media),
    content: m.length > 0 ? m : void 0
  };
}
async function R(e, n) {
  return re(ne(e, "post", n), "会话请求失败");
}
async function re(e, n) {
  const t = await e;
  if (!k(t))
    throw new Error(n);
  const r = Number(t.code || 0), s = Number(t.status || 0);
  if (r !== 0 || s === 2)
    throw new Error(x(t.message || t.msg) || n);
  return k(t.data) ? t.data : {};
}
function j(e) {
  if (!k(e))
    return null;
  const n = Number(e.id || 0);
  return !Number.isFinite(n) || n <= 0 ? null : {
    id: n,
    title: x(e.title) || "新会话",
    titleSource: x(e.title_source),
    running: !!e.running
  };
}
function Kt(e) {
  return (Array.isArray(e) ? e : []).map((t) => {
    if (!k(t))
      return null;
    const r = x(t.role) === "user" ? "user" : "assistant";
    return {
      id: Number(t.id || 0),
      role: r,
      kind: x(t.kind) || "chat",
      text: x(t.text),
      content: Ft(t.content),
      output: ge(t.output),
      requestID: x(t.request_id),
      status: Number(t.status || 1),
      createdAt: x(t.created_at),
      document: xe(t.document)
    };
  }).filter((t) => !!t);
}
function Ft(e) {
  if (!k(e) || Number(e.version) !== 1)
    return;
  const t = (Array.isArray(e.parts) ? e.parts : []).map((s) => {
    if (!k(s))
      return null;
    if (s.type === "text")
      return { type: "text", text: String(s.text || "") };
    const o = Number(s.ref_id || 0), a = x(s.ref_type);
    return s.type !== "reference" || !o || !se(a) ? null : {
      type: "reference",
      ref_type: a,
      ref_id: o,
      label: x(s.label) || `${a} ${o}`,
      usage: x(s.usage) || void 0
    };
  }).filter((s) => !!s), r = Ht(
    e.interaction_response
  );
  return {
    version: 1,
    parts: t,
    params: k(e.params) ? e.params : void 0,
    interaction_response: r
  };
}
function jt(e) {
  return Array.isArray(e) ? e.map((n) => {
    if (!k(n))
      return null;
    const t = Number(n.id || 0), r = x(n.key), s = x(n.type).toLowerCase();
    if (!t || !r || s === "prompt")
      return null;
    const o = Array.isArray(n.options) ? n.options.map((a) => k(a) ? {
      id: Number(a.id || 0) || x(a.id),
      name: x(a.name) || void 0,
      value: x(a.value || a.name),
      native_value: x(a.native_value) || void 0,
      sort: Number(a.sort || 0)
    } : null).filter(
      (a) => !!a
    ) : [];
    return {
      id: t,
      power_param_id: Number(n.power_param_id || 0) || void 0,
      name: x(n.name || n.key),
      key: r,
      icon: x(n.icon) || void 0,
      type: s || "input",
      usage: Number(n.usage || 1),
      value_type: x(n.value_type) || "string",
      default_value: x(n.default_value) || void 0,
      required: !!n.required,
      upload_rule_id: Number(n.upload_rule_id || 0) || void 0,
      max_files: Number(n.max_files || 0) || void 0,
      sort: Number(n.sort || 0),
      options: o
    };
  }).filter((n) => !!n) : [];
}
function Ht(e) {
  if (!k(e))
    return;
  const n = x(e.interaction_id);
  if (n)
    return {
      interaction_id: n,
      data: k(e.data) ? e.data : {}
    };
}
function qt(e) {
  return (Array.isArray(e) ? e : []).map((t) => {
    if (!k(t))
      return null;
    const r = x(t.url);
    if (!r)
      return null;
    const s = x(t.ref_type);
    return {
      refType: se(s) ? s : void 0,
      refId: L(t.ref_id) || void 0,
      artifactId: L(t.artifact_id) || void 0,
      fileId: L(t.file_id) || void 0,
      seriesId: L(t.series_id) || void 0,
      kind: Ut(t.kind),
      name: x(t.name) || void 0,
      label: x(t.label || t.name) || "素材",
      url: r
    };
  }).filter((t) => !!t);
}
function Ut(e) {
  const n = x(e).toLowerCase();
  return ["image", "video", "audio"].includes(n) ? n : "file";
}
function se(e) {
  return ["message", "artifact", "upload_file", "session"].includes(e);
}
function L(e) {
  const n = Number(e || 0);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}
function x(e) {
  return e == null ? "" : String(e).trim();
}
function Vt(e) {
  return {
    text: e,
    content: {
      version: 1,
      parts: [{ type: "text", text: e }]
    }
  };
}
function Yn(e, n, t) {
  const r = Vt(n);
  return r.content.interaction_response = {
    interaction_id: e,
    data: t
  }, r;
}
async function Qn(e, n) {
  if (n.scope === "history" && !n.parent) {
    const s = await Lt(e.api, {
      agentKey: e.agentKey,
      contextKey: e.contextKey,
      limit: 20,
      lastSessionID: ue(n.cursor)
    }), o = s.sessions.filter(
      (a) => a.id !== e.sessionID
    );
    return {
      items: ce(
        o.map((a) => ({
          key: `session:${a.id}`,
          refType: "session",
          refId: a.id,
          label: a.title,
          description: "查看此会话的消息和素材",
          selectable: !1,
          hasChildren: !0
        })),
        n.query
      ),
      nextCursor: s.sessions.length > 0 ? String(s.sessions[s.sessions.length - 1]?.id || "") : void 0
    };
  }
  const t = n.scope === "history" ? n.parent?.refId || 0 : e.sessionID;
  if (!t)
    return { items: [] };
  const r = await Pt(e.api, {
    agentKey: e.agentKey,
    contextKey: e.contextKey,
    sessionID: t,
    limit: 20,
    lastMessageID: ue(n.cursor)
  });
  return {
    items: ce(
      Gt([...r.messages].reverse()),
      n.query
    ),
    nextCursor: r.messages.length > 0 ? String(r.messages[0]?.id || "") : void 0
  };
}
function Gt(e) {
  return e.map(
    (n) => ({
      key: `message:${n.id}`,
      refType: "message",
      refId: n.id,
      label: Zt(n),
      description: n.role === "user" ? "用户消息" : "智能体回复",
      messageRole: n.role,
      preview: {
        text: n.text,
        kind: "message"
      },
      materials: Wt(n)
    })
  );
}
function Wt(e) {
  const n = {
    image: 0,
    video: 0,
    audio: 0,
    file: 0
  };
  return O(e.output).filter(
    (t) => t.status === "ready" && !!(t.url || t.previewUrl)
  ).map((t) => {
    n[t.kind] = (n[t.kind] || 0) + 1;
    const r = t.displayNo || n[t.kind] || 1;
    return {
      key: `artifact:${t.id}`,
      refType: "artifact",
      refId: t.id,
      label: `${Jt(t.kind)}${r}`,
      preview: {
        text: t.name || t.label,
        kind: t.kind,
        url: t.previewUrl || t.url,
        sourceUrl: t.url
      }
    };
  });
}
function Zt(e) {
  const n = e.text.replace(/\s+/g, " ").trim();
  return n ? Array.from(n).slice(0, 48).join("") : e.role === "user" ? "用户消息" : "生成结果";
}
function ce(e, n) {
  const t = V(n);
  return t ? e.filter((r) => V(
    `${r.label} ${r.description || ""}`
  ).includes(t) || (r.materials || []).some(
    (o) => V(
      `${o.label} ${o.preview?.text || ""} ${o.preview?.kind || ""}`
    ).includes(t)
  )) : e;
}
function V(e) {
  return e.trim().toLowerCase().replace(/(图|视频|音频|文件)\s+(\d+)/g, "$1$2");
}
function Jt(e) {
  return e === "image" ? "图" : e === "video" ? "视频" : e === "audio" ? "音频" : "文件";
}
function ue(e) {
  const n = Number(e || 0);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}
const Xt = te.EnergonContentView, ie = S.cn, Yt = {
  a({ children: e, node: n, ...t }) {
    return /* @__PURE__ */ i("a", { ...t, target: "_blank", rel: "noreferrer", children: e });
  }
}, Qt = [dt], en = _e(function({
  text: n,
  streaming: t = !1,
  error: r = !1,
  className: s
}) {
  return n ? /* @__PURE__ */ i(
    Xt,
    {
      output: { text: Re(n) },
      streaming: t,
      markdownClassName: $e,
      className: ie(
        "agent-chat-markdown",
        r && "[&_*]:text-destructive",
        s
      )
    }
  ) : null;
});
function Re(e) {
  return String(e || "").replace(/\r\n/g, `
`).replace(
    /([。！？!?：:；;])([ \t\u00a0\u3000]*)(#{1,6})(?!#)([ \t\u00a0\u3000]+)(?=\S)/g,
    `$1

$3 `
  ).replace(
    /(^|\n)([ \t\u00a0\u3000]{0,3})(#{1,6})(?!#)([ \t\u00a0\u3000]*)(?=\S)/g,
    tn
  );
}
function tn(e, n, t, r, s) {
  return r.length === 1 && s.length === 0 ? e : `${n}${t}${r} `;
}
const er = _e(function({
  error: n
}) {
  return /* @__PURE__ */ i(
    ut,
    {
      skipHtml: !0,
      defer: !0,
      smooth: {
        drainMs: 180,
        maxCharIntervalMs: 18,
        maxCharsPerFrame: 28,
        minCommitMs: 16
      },
      remarkPlugins: Qt,
      components: Yt,
      preprocess: Re,
      className: ie(
        $e,
        "agent-chat-markdown",
        n && "text-destructive"
      )
    }
  );
}), $e = ie(
  "min-w-0 text-base leading-7 text-foreground",
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
  "[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground",
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.85em]",
  "[&_h1]:mb-3 [&_h1]:mt-4 [&_h1]:text-2xl [&_h1]:font-semibold",
  "[&_h2]:mb-2.5 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold",
  "[&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold",
  "[&_h4]:mb-1.5 [&_h4]:mt-3 [&_h4]:text-base [&_h4]:font-semibold",
  "[&_h5]:mb-1.5 [&_h5]:mt-3 [&_h5]:text-base [&_h5]:font-medium",
  "[&_h6]:mb-1.5 [&_h6]:mt-3 [&_h6]:text-sm [&_h6]:font-medium [&_h6]:text-muted-foreground",
  "[&_hr]:my-4 [&_hr]:border-border",
  "[&_img]:my-4 [&_img]:block [&_img]:max-w-full [&_img]:rounded-lg",
  "[&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6",
  "[&_p]:my-2 [&_pre]:my-3 [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:bg-muted/60",
  "[&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_strong]:font-semibold [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse",
  "[&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1",
  "[&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left",
  "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6"
), F = S.cn, nn = /* @__PURE__ */ new Set(["image", "video", "audio", "file"]), rn = /* @__PURE__ */ new Set(["knowledge", "skill"]);
function sn({
  activity: e
}) {
  if (!e)
    return null;
  const n = O(e.output), t = J(e.output);
  if (Object.keys(t).length > 0 || St(e.output)) {
    const s = e.aspectRatio || (e.kind === "video" ? "16 / 9" : "4 / 3");
    return /* @__PURE__ */ i(
      "div",
      {
        className: "agent-chat-media-result",
        "data-kind": e.kind,
        style: {
          "--agent-chat-media-aspect-ratio": s
        },
        children: /* @__PURE__ */ i(
          It,
          {
            output: e.output,
            className: "agent-chat-activity-output"
          }
        )
      }
    );
  }
  return /* @__PURE__ */ i(on, { activity: e, artifactCount: n.length });
}
function on({
  activity: e,
  artifactCount: n
}) {
  const t = an(e.kind), r = nn.has(e.kind), s = e.status === "failed";
  if (rn.has(e.kind))
    return /* @__PURE__ */ i("div", { className: "mt-2 max-w-2xl py-1 text-muted-foreground", children: /* @__PURE__ */ i(de, { activity: e }) });
  if (s || !r)
    return /* @__PURE__ */ i(
      "div",
      {
        className: F(
          "mt-4 max-w-2xl rounded-lg border bg-muted/20 px-3.5 py-3",
          s && "border-destructive/30 bg-destructive/5"
        ),
        children: /* @__PURE__ */ i(de, { activity: e })
      }
    );
  const o = Math.min(8, Math.max(1, n || e.count)), a = e.kind === "image" || e.kind === "video", c = e.aspectRatio || (e.kind === "video" ? "16 / 9" : "4 / 3");
  return /* @__PURE__ */ i(
    "div",
    {
      role: "status",
      "aria-label": e.text || e.title,
      className: "agent-chat-media-grid mt-4",
      "data-count": o,
      children: Array.from({ length: o }, (m, g) => /* @__PURE__ */ p(
        "div",
        {
          className: F(
            "agent-chat-media-placeholder relative flex overflow-hidden rounded-lg border bg-muted/30",
            e.kind === "audio" || e.kind === "file" ? "h-24 items-center justify-start px-5" : "items-center justify-center"
          ),
          style: a ? { aspectRatio: c } : void 0,
          children: [
            /* @__PURE__ */ i(t, { className: "agent-chat-media-placeholder-icon relative size-7 text-muted-foreground/35" }),
            /* @__PURE__ */ i(z, { className: "agent-chat-media-spinner absolute right-3 top-3 z-[2] size-4 text-muted-foreground/55" }),
            e.progress != null ? /* @__PURE__ */ i(
              "span",
              {
                className: "absolute bottom-0 left-0 z-[2] h-1 bg-foreground/15 transition-[width] duration-300",
                style: { width: `${e.progress}%` }
              }
            ) : null
          ]
        },
        `${e.id}-${g}`
      ))
    }
  );
}
function de({ activity: e }) {
  const n = ln(e.status), t = e.status === "failed", r = e.error || e.text || e.title;
  return /* @__PURE__ */ p(
    "div",
    {
      className: F(
        "flex min-w-0 items-center gap-2 text-sm text-muted-foreground",
        t && "text-destructive"
      ),
      children: [
        /* @__PURE__ */ i(
          n,
          {
            className: F(
              "size-4 shrink-0",
              e.status === "running" && "animate-spin"
            )
          }
        ),
        /* @__PURE__ */ i("span", { className: "min-w-0 flex-1 truncate", children: r }),
        e.progress != null && e.status === "running" ? /* @__PURE__ */ p("span", { className: "shrink-0 tabular-nums", children: [
          e.progress,
          "%"
        ] }) : null
      ]
    }
  );
}
function an(e) {
  switch (e) {
    case "image":
      return Q;
    case "video":
      return Y;
    case "audio":
      return Ye;
    case "file":
      return B;
    case "knowledge":
      return Xe;
    default:
      return Je;
  }
}
function ln(e) {
  return e === "succeeded" ? Qe : e === "failed" ? ee : z;
}
const me = S.cn;
function cn({
  documentID: e,
  enabled: n,
  contentRef: t,
  scrollRef: r
}) {
  const [s, o] = I([]), [a, c] = I(""), m = s.map((f) => f.id).join(`
`);
  M(() => {
    if (!n)
      return;
    const f = t.current;
    if (!f)
      return;
    let b = 0;
    const l = () => {
      window.cancelAnimationFrame(b), b = window.requestAnimationFrame(() => {
        const w = un(f, e);
        o(
          (v) => dn(v, w) ? v : w
        ), c(
          (v) => w.some((u) => u.id === v) ? v : w[0]?.id || ""
        );
      });
    };
    l();
    const y = new MutationObserver(l);
    return y.observe(f, {
      childList: !0,
      characterData: !0,
      subtree: !0
    }), () => {
      y.disconnect(), window.cancelAnimationFrame(b);
    };
  }, [t, e, n]), M(() => {
    if (!n || !m)
      return;
    const f = r.current, b = t.current;
    if (!f || !b)
      return;
    const l = /* @__PURE__ */ new Map(), y = new IntersectionObserver(
      (w) => {
        for (const u of w)
          u.isIntersecting ? l.set(u.target.id, u.boundingClientRect.top) : l.delete(u.target.id);
        const v = Array.from(l.entries()).sort(
          (u, d) => u[1] - d[1]
        )[0];
        v && c(v[0]);
      },
      {
        root: f,
        rootMargin: "-24px 0px -68% 0px",
        threshold: [0, 1]
      }
    );
    for (const w of m.split(`
`)) {
      const v = document.getElementById(w);
      v && b.contains(v) && y.observe(v);
    }
    return () => y.disconnect();
  }, [t, n, m, r]);
  const g = C(
    (f) => {
      const b = r.current, l = t.current, y = document.getElementById(f);
      if (!b || !l || !y || !l.contains(y))
        return;
      const w = b.getBoundingClientRect().top, v = y.getBoundingClientRect().top, u = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      b.scrollTo({
        top: b.scrollTop + v - w - 24,
        behavior: u ? "auto" : "smooth"
      }), c(f);
    },
    [t, r]
  );
  return { items: s, activeID: a, selectItem: g };
}
function fe({
  items: e,
  activeID: n,
  className: t,
  onSelect: r
}) {
  if (e.length === 0)
    return null;
  const s = Math.min(...e.map((o) => o.level));
  return /* @__PURE__ */ i("nav", { "aria-label": "文档目录", className: me("py-1", t), children: e.map((o) => {
    const a = o.id === n;
    return /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        className: me(
          "block w-full border-l-2 py-1.5 pr-3 text-left text-sm leading-5 transition-colors",
          a ? "border-foreground font-medium text-foreground" : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
        ),
        style: {
          paddingLeft: 12 + Math.min(o.level - s, 2) * 12
        },
        title: o.title,
        "aria-current": a ? "location" : void 0,
        onClick: () => r(o.id),
        children: /* @__PURE__ */ i("span", { className: "line-clamp-2", children: o.title })
      },
      o.id
    );
  }) });
}
function un(e, n) {
  const t = /* @__PURE__ */ new Map();
  return Array.from(
    e.querySelectorAll(
      "[data-agent-document-block-id] h1, [data-agent-document-block-id] h2, [data-agent-document-block-id] h3, [data-agent-document-block-id] h4"
    )
  ).flatMap((r) => {
    const s = String(r.textContent || "").replace(/\s+/g, " ").trim(), a = r.closest(
      "[data-agent-document-block-id]"
    )?.dataset.agentDocumentBlockId || "";
    if (!s || !a)
      return [];
    const c = t.get(a) || 0;
    t.set(a, c + 1);
    const m = `agent-document-${n}-block-${a}-heading-${c}`;
    return r.id = m, r.dataset.agentDocumentHeading = "true", [
      {
        id: m,
        level: Number(r.tagName.slice(1)) || 2,
        title: s
      }
    ];
  });
}
function dn(e, n) {
  return e.length === n.length && e.every(
    (t, r) => t.id === n[r]?.id && t.level === n[r]?.level && t.title === n[r]?.title
  );
}
const mn = 64;
function fn({
  documentID: e,
  contentVersion: n,
  enabled: t,
  pending: r
}) {
  const s = A(null), o = A(null), a = A(null), c = A(""), m = A(!1), g = A(0), [f, b] = I(!0), l = C(() => {
    const u = o.current;
    if (!u)
      return !0;
    const d = u.scrollHeight - u.scrollTop - u.clientHeight <= mn;
    return b(
      (_) => _ === d ? _ : d
    ), d;
  }, []), y = C((u = "auto") => {
    const d = o.current;
    d && (m.current = !0, d.scrollTo({ top: d.scrollHeight, behavior: u }), g.current = d.scrollTop, b(!0));
  }, []), w = C(() => {
    a.current != null && window.cancelAnimationFrame(a.current), a.current = window.requestAnimationFrame(() => {
      if (a.current = null, m.current) {
        y();
        return;
      }
      l();
    });
  }, [y, l]);
  M(() => {
    const u = t ? String(e) : "";
    if (!u) {
      c.current = "", m.current = !1;
      return;
    }
    if (c.current === u) {
      r && l() && (m.current = !0);
      return;
    }
    c.current = u, m.current = r;
    const d = o.current;
    d && !r && (d.scrollTop = 0), g.current = d?.scrollTop || 0, w();
  }, [e, t, r, w, l]), ot(() => {
    t && w();
  }, [n, t, w]), M(() => {
    if (!t)
      return;
    const u = s.current;
    if (!u)
      return;
    const d = new ResizeObserver(w);
    return d.observe(u), w(), () => d.disconnect();
  }, [e, t, w]), M(
    () => () => {
      a.current != null && window.cancelAnimationFrame(a.current);
    },
    []
  );
  const v = C(() => {
    const u = o.current;
    if (!u)
      return;
    const d = u.scrollTop < g.current - 1, _ = l();
    d ? m.current = !1 : _ && (m.current = !0), g.current = u.scrollTop;
  }, [l]);
  return {
    atBottom: f,
    contentRef: s,
    handleScroll: v,
    scrollRef: o,
    scrollToBottom: y
  };
}
function hn({
  document: e,
  running: n,
  error: t
}) {
  const r = n && e.status === "writing" && e.blocks.length > 0;
  return /* @__PURE__ */ p("div", { className: "agent-chat-document min-w-0", children: [
    e.title ? /* @__PURE__ */ i("h1", { className: "mb-5 text-xl font-semibold leading-tight", children: e.title }) : null,
    e.blocks.map(
      (s) => s.type === "media" ? /* @__PURE__ */ i(gn, { block: s }, s.id) : /* @__PURE__ */ i(
        pn,
        {
          block: s,
          title: e.title,
          error: t
        },
        s.id
      )
    ),
    e.blocks.length === 0 && n ? /* @__PURE__ */ i(bn, {}) : null,
    e.blocks.length === 0 && e.status === "failed" ? /* @__PURE__ */ i(yn, { message: vn(e) }) : null,
    r ? /* @__PURE__ */ i(he, {}) : null,
    !n && X(e) ? /* @__PURE__ */ i(he, {}) : null
  ] });
}
function pn({
  block: e,
  title: n,
  error: t
}) {
  const r = Ke(e.text, n);
  return r ? /* @__PURE__ */ i("div", { "data-agent-document-block-id": e.id, children: /* @__PURE__ */ i(
    en,
    {
      text: r,
      error: t,
      className: "agent-chat-document-text"
    }
  ) }) : null;
}
function gn({ block: e }) {
  return e.status === "failed" ? /* @__PURE__ */ p("div", { className: "my-4 flex items-center gap-2 text-sm text-destructive", children: [
    /* @__PURE__ */ i(ee, { className: "size-4 shrink-0" }),
    /* @__PURE__ */ p("span", { children: [
      Z(e.mediaKind),
      "生成失败"
    ] })
  ] }) : /* @__PURE__ */ i(sn, { activity: xn(e) });
}
function xn(e) {
  const n = Number(e.meta.progress), t = Fe(e);
  return {
    id: `document-block-${e.id}`,
    title: `${Z(e.mediaKind)}生成`,
    kind: e.mediaKind,
    status: t ? "succeeded" : "running",
    text: typeof e.meta.progress_text == "string" ? e.meta.progress_text : `${Z(e.mediaKind)}生成中`,
    error: "",
    progress: Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : null,
    count: Math.max(1, e.artifacts.length),
    aspectRatio: je(
      e.meta,
      e.artifacts.map((r) => r.meta)
    ) || (e.mediaKind === "video" ? "16 / 9" : "4 / 3"),
    anchorText: "",
    output: { artifacts: e.artifacts }
  };
}
function Z(e) {
  return e === "image" ? "图片" : e === "video" ? "视频" : e === "audio" ? "音频" : "文件";
}
function bn() {
  return /* @__PURE__ */ i(
    "div",
    {
      role: "status",
      "aria-label": "正在组织图文内容",
      className: "agent-chat-waiting-indicator",
      children: [0, 1, 2].map((e) => /* @__PURE__ */ i(
        "span",
        {
          className: "agent-chat-waiting-dot",
          style: { animationDelay: `${e * 140}ms` }
        },
        e
      ))
    }
  );
}
function yn({ message: e }) {
  return /* @__PURE__ */ p("div", { className: "flex items-center gap-2 text-sm text-destructive", children: [
    /* @__PURE__ */ i(ee, { className: "size-4 shrink-0" }),
    /* @__PURE__ */ i("span", { children: e })
  ] });
}
function vn(e) {
  const n = e.meta.error;
  return typeof n == "string" && n.trim() ? n.trim() : "文档生成失败，请重新生成。";
}
function he() {
  return /* @__PURE__ */ i(
    "div",
    {
      role: "status",
      "aria-label": "正在继续生成图文内容",
      className: "agent-chat-next-step-indicator",
      children: /* @__PURE__ */ i("span", { className: "agent-chat-pulse-dot" })
    }
  );
}
const K = ke.Button, wn = E.Sheet, _n = E.SheetContent, kn = E.SheetDescription, Nn = E.SheetHeader, An = E.SheetTitle, G = S.cn;
function tr({
  document: e,
  onOpen: n
}) {
  const t = X(e);
  return /* @__PURE__ */ p(
    "button",
    {
      type: "button",
      className: "mt-3 flex items-center gap-3 rounded-md border bg-background px-3 py-2.5 text-left transition-colors hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      style: { width: "min(100%, 28rem)" },
      "aria-label": `打开文档：${e.title || "生成的文档"}`,
      onClick: () => n(e),
      children: [
        /* @__PURE__ */ i("span", { className: "flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/70 text-muted-foreground", children: /* @__PURE__ */ i(B, { className: "size-4" }) }),
        /* @__PURE__ */ p("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ i("span", { className: "block truncate text-sm font-medium text-foreground", children: e.title || "生成的文档" }),
          /* @__PURE__ */ i("span", { className: "mt-0.5 block text-xs text-muted-foreground", children: t ? "正在生成" : Oe(e.status) })
        ] }),
        t ? /* @__PURE__ */ i(z, { className: "size-4 shrink-0 animate-spin text-muted-foreground" }) : /* @__PURE__ */ i(st, { className: "size-4 shrink-0 text-muted-foreground" })
      ]
    }
  );
}
function nr({
  open: e,
  portalContainer: n,
  document: t,
  messageID: r,
  renderArtifactActions: s,
  renderDocumentActions: o,
  onClose: a
}) {
  const [c, m] = I(!1), [g, f] = I(!1), b = A(!1), l = A(null), y = A(null), w = A(null), v = t.status === "failed", u = X(t), d = fn({
    documentID: t.id,
    contentVersion: Cn(t),
    enabled: e,
    pending: u
  }), _ = cn({
    documentID: t.id,
    enabled: e,
    contentRef: d.contentRef,
    scrollRef: d.scrollRef
  }), D = _.items.length >= 2;
  M(() => {
    f(!1);
  }, [t.id, e]), M(() => {
    if (!g)
      return;
    const h = (H) => {
      const q = H.target;
      !(q instanceof Node) || y.current?.contains(q) || w.current?.contains(q) || f(!1);
    }, N = (H) => {
      H.key === "Escape" && f(!1);
    };
    return window.document.addEventListener(
      "pointerdown",
      h,
      !0
    ), window.document.addEventListener("keydown", N), () => {
      window.document.removeEventListener(
        "pointerdown",
        h,
        !0
      ), window.document.removeEventListener("keydown", N);
    };
  }, [g]), M(
    () => () => {
      l.current != null && window.clearTimeout(l.current);
    },
    []
  );
  const P = async () => {
    const h = He(t);
    if (h.trim()) {
      b.current = !0;
      try {
        await lt(h);
      } catch {
        return;
      } finally {
        b.current = !1;
      }
      m(!0), l.current != null && window.clearTimeout(l.current), l.current = window.setTimeout(() => {
        m(!1), l.current = null;
      }, 1800);
    }
  };
  return /* @__PURE__ */ i(
    wn,
    {
      open: e,
      modal: !1,
      onOpenChange: (h) => {
        h || a();
      },
      children: /* @__PURE__ */ p(
        _n,
        {
          container: n,
          side: "right",
          showCloseButton: !1,
          showOverlay: !1,
          "data-assistant-layer": "true",
          layerZIndex: at,
          onOpenAutoFocus: (h) => {
            h.preventDefault(), d.scrollRef.current?.focus({ preventScroll: !0 });
          },
          onFocusOutside: (h) => {
            b.current && h.preventDefault();
          },
          onInteractOutside: (h) => {
            b.current && h.preventDefault();
          },
          className: "flex w-[94vw] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-none md:w-[72vw] xl:w-[64vw] 2xl:w-[1120px]",
          children: [
            /* @__PURE__ */ p(Nn, { className: "flex h-14 shrink-0 flex-row items-center gap-3 border-b px-5 py-0 text-start", children: [
              /* @__PURE__ */ i(B, { className: "size-4 shrink-0 text-muted-foreground" }),
              /* @__PURE__ */ p("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ i(An, { className: "truncate text-sm", children: t.title || "生成的文档" }),
                /* @__PURE__ */ p(
                  kn,
                  {
                    className: G(
                      "mt-0.5 flex items-center gap-1.5 text-xs",
                      v ? "text-destructive" : "text-muted-foreground"
                    ),
                    children: [
                      u && !v ? /* @__PURE__ */ i(z, { className: "size-3 animate-spin" }) : null,
                      /* @__PURE__ */ i("span", { children: v ? "生成失败" : u ? t.status === "writing" ? "正文生成中" : "素材生成中" : Oe(t.status) })
                    ]
                  }
                )
              ] }),
              D ? /* @__PURE__ */ i(T, { label: "查看文档目录", children: /* @__PURE__ */ p(
                K,
                {
                  ref: y,
                  type: "button",
                  size: "sm",
                  variant: "ghost",
                  className: "h-8 shrink-0 gap-1.5 px-2 xl:hidden",
                  "aria-label": "查看文档目录",
                  "aria-haspopup": "dialog",
                  "aria-expanded": g,
                  onClick: () => f((h) => !h),
                  children: [
                    /* @__PURE__ */ i(et, { className: "size-4" }),
                    /* @__PURE__ */ i("span", { className: "hidden sm:inline", children: "目录" })
                  ]
                }
              ) }) : null,
              o?.({
                messageID: r,
                document: t,
                running: u,
                error: v
              }),
              /* @__PURE__ */ i(T, { label: c ? "已复制" : "复制文档", children: /* @__PURE__ */ i(
                K,
                {
                  type: "button",
                  size: "icon",
                  variant: "ghost",
                  className: "size-8 shrink-0",
                  "aria-label": c ? "文档已复制" : "复制文档",
                  disabled: !t.blocks.length,
                  onClick: () => {
                    P();
                  },
                  children: c ? /* @__PURE__ */ i(tt, { className: "size-4" }) : /* @__PURE__ */ i(nt, { className: "size-4" })
                }
              ) }),
              /* @__PURE__ */ i(T, { label: "关闭文档", children: /* @__PURE__ */ i(
                K,
                {
                  type: "button",
                  size: "icon",
                  variant: "ghost",
                  className: "size-8 shrink-0",
                  "aria-label": "关闭文档",
                  onClick: a,
                  children: /* @__PURE__ */ i(ye, { className: "size-4" })
                }
              ) })
            ] }),
            D && g ? /* @__PURE__ */ p(
              "div",
              {
                ref: w,
                role: "dialog",
                "aria-label": "文档目录",
                "data-assistant-layer": "true",
                className: "absolute right-4 top-14 z-50 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md xl:hidden",
                style: { width: "min(20rem, calc(100% - 2rem))" },
                children: [
                  /* @__PURE__ */ i("div", { className: "border-b px-4 py-3 text-sm font-medium", children: "目录" }),
                  /* @__PURE__ */ i("div", { className: "max-h-[60vh] overflow-y-auto px-2 py-2 overscroll-contain", children: /* @__PURE__ */ i(
                    fe,
                    {
                      items: _.items,
                      activeID: _.activeID,
                      onSelect: (h) => {
                        _.selectItem(h), f(!1);
                      }
                    }
                  ) })
                ]
              }
            ) : null,
            /* @__PURE__ */ p(
              "div",
              {
                className: G(
                  "min-h-0 flex-1",
                  D && "xl:grid xl:grid-cols-[13rem_minmax(0,1fr)]"
                ),
                children: [
                  /* @__PURE__ */ i(
                    "aside",
                    {
                      className: G(
                        "hidden min-h-0 flex-col border-r bg-muted/10",
                        D && "xl:flex"
                      ),
                      children: D ? /* @__PURE__ */ p(be, { children: [
                        /* @__PURE__ */ i("div", { className: "shrink-0 px-5 pb-2 pt-8 text-xs font-medium text-muted-foreground", children: "目录" }),
                        /* @__PURE__ */ i("div", { className: "min-h-0 flex-1 overflow-y-auto px-3 pb-6 overscroll-contain", children: /* @__PURE__ */ i(
                          fe,
                          {
                            items: _.items,
                            activeID: _.activeID,
                            onSelect: _.selectItem
                          }
                        ) })
                      ] }) : null
                    }
                  ),
                  /* @__PURE__ */ p("div", { className: "relative h-full min-h-0", children: [
                    /* @__PURE__ */ i(
                      "div",
                      {
                        ref: d.scrollRef,
                        tabIndex: -1,
                        className: "h-full min-h-0 overflow-y-auto overscroll-contain focus:outline-none",
                        style: { scrollbarGutter: "stable" },
                        onScroll: d.handleScroll,
                        children: /* @__PURE__ */ i(
                          "div",
                          {
                            ref: d.contentRef,
                            className: "mx-auto w-full max-w-3xl px-6 py-8 md:px-9 md:py-10",
                            children: /* @__PURE__ */ i(
                              ht,
                              {
                                messageID: r,
                                render: s,
                                children: /* @__PURE__ */ i(
                                  hn,
                                  {
                                    document: t,
                                    running: u,
                                    error: v
                                  }
                                )
                              }
                            )
                          }
                        )
                      }
                    ),
                    d.atBottom ? null : /* @__PURE__ */ i(T, { label: "回到底部", children: /* @__PURE__ */ i(
                      K,
                      {
                        type: "button",
                        size: "icon",
                        variant: "outline",
                        className: "absolute bottom-4 right-4 z-10 size-9 rounded-full bg-background shadow-sm",
                        "aria-label": "回到底部",
                        onClick: () => d.scrollToBottom("smooth"),
                        children: /* @__PURE__ */ i(rt, { className: "size-4" })
                      }
                    ) })
                  ] })
                ]
              }
            )
          ]
        }
      )
    }
  );
}
function Cn(e) {
  const n = e.blocks.map((t) => {
    const r = t.artifacts.map(
      (s) => `${s.id}:${s.status}:${s.url}:${s.previewUrl}`
    ).join(",");
    return [
      t.id,
      t.status,
      t.text.length,
      t.text.slice(-64),
      String(t.meta.stream_revision || ""),
      r
    ].join(":");
  });
  return [e.status, e.pendingJobCount, ...n].join("|");
}
function Oe(e) {
  return e === "failed" ? "生成失败" : e === "partial_failed" ? "部分素材生成失败" : e === "ready" ? "已生成" : e === "generating" ? "素材生成中" : "正文生成中";
}
const In = mt.AgentInteractionPanel, Be = S.cn;
function rr({
  interaction: e,
  response: n,
  disabled: t,
  onSubmit: r
}) {
  return /* @__PURE__ */ p(
    "div",
    {
      "data-presentation": e.presentation || "form",
      className: Be(
        "agent-chat-interaction mt-5",
        e.presentation === "stepper" ? "w-full" : "max-w-2xl"
      ),
      children: [
        n ? null : /* @__PURE__ */ p(
          "div",
          {
            role: "status",
            "aria-live": "polite",
            className: "mb-3 flex items-center gap-2 text-sm text-muted-foreground",
            children: [
              /* @__PURE__ */ i("span", { className: "agent-chat-pulse-dot" }),
              /* @__PURE__ */ i("span", { children: "等待补充信息" })
            ]
          }
        ),
        /* @__PURE__ */ i(
          In,
          {
            interaction: e,
            disabled: t,
            readonly: !!n,
            initialData: n?.data,
            onSubmit: r
          }
        )
      ]
    }
  );
}
function sr({
  suggestions: e,
  disabled: n,
  onSelect: t
}) {
  return e.length === 0 ? null : /* @__PURE__ */ i("div", { className: "agent-chat-suggestions mt-5 flex flex-wrap gap-2", children: e.map((r) => /* @__PURE__ */ i(T, { label: r.prompt, children: /* @__PURE__ */ p(
    "button",
    {
      type: "button",
      disabled: n,
      className: Be(
        "group inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-lg border bg-background px-3 py-2 text-left text-sm leading-5 text-foreground shadow-sm transition-colors",
        "hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-50"
      ),
      onClick: () => t(r),
      children: [
        /* @__PURE__ */ i("span", { className: "truncate", children: r.label }),
        /* @__PURE__ */ i(it, { className: "size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" })
      ]
    }
  ) }, r.prompt)) });
}
export {
  sn as A,
  er as S,
  It as a,
  ze as b,
  tr as c,
  sr as d,
  nr as e,
  Un as f,
  Wn as g,
  Qn as h,
  Xn as i,
  Pt as j,
  Lt as k,
  Gn as l,
  Jn as m,
  Vn as n,
  ht as o,
  en as p,
  rr as q,
  Zn as r,
  Yn as s,
  Vt as t,
  jn as u,
  qn as v,
  Hn as w
};
