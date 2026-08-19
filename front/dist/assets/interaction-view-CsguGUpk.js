import { n as Ze } from "./power-icon-HeeWAKmZ.js";
import { b as Ie } from "./file-kind-UfTAlHnR.js";
import { j as s, a as g, F as Me, i as Ge, r as Xe } from "./preloadable-Bomi5PEU.js";
import { r as R, b as fe, a as Je, n as Se, c as Ye, d as $e, i as pe, e as Qe, f as et, g as tt, h as nt } from "./interaction-C1CfPuZM.js";
import { av as rt, P as ot, M as st, L as z, D as it, X as Oe, b as F, a1 as at, a2 as ge, a3 as he, an as lt, aw as ct, ax as ut, ay as dt, C as mt, m as we, az as ft, o as pt, r as gt, aq as ht, d as wt, aA as xt } from "./vendor-icons-B3DKX3la.js";
import { j as ze, i as Te, a as D, e as N, b as I, m as bt, d as A, g as vt } from "./_commonjsHelpers-61wyk6v6.js";
import { A as O, a as yt, c as _t } from "./clipboard-BLzb9wLn.js";
import { a as kt } from "./media-inspector-gallery-ho9rlZcO.js";
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const J = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!J || Object.keys(J).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Ct = J.resolveAssetUrl, Ee = ze({
  messageID: 0
});
function At({
  messageID: e,
  render: n,
  children: t
}) {
  return /* @__PURE__ */ s(Ee.Provider, { value: { messageID: e, render: n }, children: t });
}
function Nt() {
  return Te(Ee);
}
function Dt(e, n, t) {
  return {
    ...e,
    context: {
      source: "agent-chat",
      messageID: n,
      artifacts: t
    }
  };
}
function It(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return null;
  const n = e;
  return n.source !== "agent-chat" || !Number(n.messageID) || !Array.isArray(n.artifacts) ? null : {
    source: "agent-chat",
    messageID: Number(n.messageID),
    artifacts: n.artifacts
  };
}
function Re(e, n, t, r = 0) {
  const o = e.filter(
    (c) => c.kind === n && c.status === "ready" && c.url
  ), i = Z(t);
  return o.find(
    (c) => Z(c.url) === i || Z(c.previewUrl) === i
  ) || o[r] || null;
}
function Z(e) {
  return Ct(String(e || "").trim());
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/button", "@/lib/utils"]);
const Y = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!Y || Object.keys(Y).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const Mt = Y.Button, Q = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!Q || Object.keys(Q).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const St = Q.cn, Fe = ze(
  null
);
function Qn() {
  const [e, n] = D(
    null
  ), [t, r] = D(0), o = N((h) => {
    const f = h.items.findIndex(
      (w) => String(w.id) === String(h.initialItemId)
    );
    n(h), r(f >= 0 ? f : 0);
  }, []), i = N(() => {
    n(null), r(0);
  }, []), a = N((h) => {
    r(h);
  }, []), c = N(
    (h) => {
      const f = e?.items.length || 0;
      f <= 1 || r((w) => (w + h + f) % f);
    },
    [e?.items.length]
  ), m = e?.items[t];
  return {
    request: e,
    activeIndex: t,
    activeItem: m,
    open: !!(e && m),
    openPreview: o,
    closePreview: i,
    selectIndex: a,
    move: c
  };
}
function er({
  controller: e,
  children: n
}) {
  return /* @__PURE__ */ s(Fe.Provider, { value: e.openPreview, children: n });
}
function $t() {
  return Te(Fe) || void 0;
}
function tr({
  controller: e,
  renderArtifactActions: n
}) {
  const { request: t, activeIndex: r, activeItem: o, closePreview: i, move: a, selectIndex: c } = e, [m, h] = D(1), [f, w] = D(!1), [l, x] = D("");
  I(() => {
    h(1), x("");
  }, [o?.id]), I(() => {
    if (!t)
      return;
    const p = (C) => {
      if (C.key === "Escape") {
        C.preventDefault(), C.stopImmediatePropagation(), i();
        return;
      }
      Et(C.target) || (C.key === "ArrowLeft" && (C.preventDefault(), a(-1)), C.key === "ArrowRight" && (C.preventDefault(), a(1)));
    };
    return window.addEventListener("keydown", p, !0), () => window.removeEventListener("keydown", p, !0);
  }, [i, a, t]);
  const y = N(async () => {
    if (!(!t || !o || f)) {
      w(!0), x("");
      try {
        await t.download(o.id);
      } catch (p) {
        x(p instanceof Error ? p.message : "下载素材失败");
      } finally {
        w(!1);
      }
    }
  }, [o, f, t]);
  if (!t || !o)
    return null;
  const b = t.items.length > 1, u = Tt(t.kind), d = t.kind === "audio" || t.kind === "file", _ = It(t.context), M = _ ? Re(
    _.artifacts,
    t.kind,
    o.url,
    r
  ) : null, K = /* @__PURE__ */ g(
    "aside",
    {
      className: St(
        "flex min-h-0 min-w-0 flex-col bg-background",
        d ? "relative max-h-[min(80dvh,480px)] w-full max-w-2xl overflow-hidden rounded-lg border shadow-xl" : "absolute inset-0 z-30 md:static md:z-auto md:flex-1 md:border-l"
      ),
      role: d ? "dialog" : void 0,
      "aria-modal": d ? "true" : void 0,
      "aria-label": `${u}预览`,
      children: [
        /* @__PURE__ */ g("header", { className: "flex h-14 shrink-0 items-center gap-3 border-b px-3 md:px-4", children: [
          /* @__PURE__ */ g("div", { className: "flex min-w-0 flex-1 items-center gap-2", children: [
            /* @__PURE__ */ s(Ot, { kind: t.kind, className: "size-4 shrink-0" }),
            /* @__PURE__ */ g("span", { className: "shrink-0 text-sm font-semibold text-foreground", children: [
              u,
              b ? ` ${r + 1}/${t.items.length}` : ""
            ] }),
            t.kind === "audio" || t.kind === "file" ? /* @__PURE__ */ s("span", { className: "truncate text-xs text-muted-foreground", children: o.name }) : null
          ] }),
          /* @__PURE__ */ g("div", { className: "flex shrink-0 items-center gap-1", children: [
            M && _ && n ? n({
              messageID: _.messageID,
              artifact: M,
              placement: "preview"
            }) : null,
            t.kind === "image" ? /* @__PURE__ */ g(Me, { children: [
              /* @__PURE__ */ s(
                E,
                {
                  label: "缩小",
                  disabled: m <= 0.5,
                  onClick: () => h((p) => be(p - 0.25)),
                  children: /* @__PURE__ */ s(rt, {})
                }
              ),
              /* @__PURE__ */ g("span", { className: "hidden w-11 text-center text-xs tabular-nums text-muted-foreground sm:inline", children: [
                Math.round(m * 100),
                "%"
              ] }),
              /* @__PURE__ */ s(
                E,
                {
                  label: "放大",
                  disabled: m >= 3,
                  onClick: () => h((p) => be(p + 0.25)),
                  children: /* @__PURE__ */ s(ot, {})
                }
              ),
              /* @__PURE__ */ s(E, { label: "适应窗口", onClick: () => h(1), children: /* @__PURE__ */ s(st, {}) })
            ] }) : null,
            /* @__PURE__ */ s(
              E,
              {
                label: "下载",
                disabled: f,
                onClick: () => {
                  y();
                },
                children: f ? /* @__PURE__ */ s(z, { className: "animate-spin" }) : /* @__PURE__ */ s(it, {})
              }
            ),
            /* @__PURE__ */ s(E, { label: "关闭预览", onClick: i, children: /* @__PURE__ */ s(Oe, {}) })
          ] })
        ] }),
        /* @__PURE__ */ s(
          kt,
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
        l ? /* @__PURE__ */ s(
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
  return d ? /* @__PURE__ */ s(
    "div",
    {
      className: "absolute inset-0 z-30 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-[1px]",
      role: "presentation",
      onPointerDown: (p) => {
        p.target === p.currentTarget && i();
      },
      children: K
    }
  ) : K;
}
function E({
  label: e,
  children: n,
  disabled: t,
  onClick: r
}) {
  return /* @__PURE__ */ s(O, { label: e, children: /* @__PURE__ */ s(
    Mt,
    {
      type: "button",
      size: "icon",
      variant: "ghost",
      className: "size-9",
      "aria-label": e,
      disabled: t,
      onClick: r,
      children: /* @__PURE__ */ s("span", { className: "[&>svg]:size-4", children: n })
    }
  ) });
}
function Ot({
  kind: e,
  className: n
}) {
  const t = zt[e];
  return /* @__PURE__ */ s(t, { className: n });
}
const zt = {
  image: he,
  video: ge,
  audio: at,
  file: F
};
function Tt(e) {
  return e === "image" ? "图片" : e === "video" ? "视频" : e === "audio" ? "音频" : "文件";
}
function be(e) {
  return Math.min(3, Math.max(0.5, e));
}
function Et(e) {
  return e instanceof HTMLElement && !!e.closest("button, input, textarea, select, video, audio");
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view", "@/lib/utils"]);
const L = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!L || Object.keys(L).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const Rt = L.EnergonContentView, Ft = L.normalizeEnergonOutput, ee = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!ee || Object.keys(ee).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const Pe = ee.cn, Be = [
  "rich",
  "images",
  "videos",
  "audios",
  "files"
];
function Pt({
  output: e,
  excludeOutputs: n = [],
  excludeText: t = "",
  className: r
}) {
  const o = $t(), i = Nt(), a = je(e, {
    excludedKeys: qt(n),
    excludeText: t
  }), c = new Set(
    n.flatMap(
      (l) => R(l).map((x) => x.id)
    )
  ), m = R(e).filter(
    (l) => l.status === "generating" && !c.has(l.id)
  ), h = R(e).filter(
    (l) => l.status === "ready" && !c.has(l.id)
  ), f = i.render ? (l) => {
    const x = Re(
      h,
      l.kind,
      l.item.url,
      l.index
    );
    return x && i.messageID > 0 ? i.render?.({
      messageID: i.messageID,
      artifact: x,
      placement: "inline"
    }) : null;
  } : void 0, w = o ? (l) => o(
    Dt(
      l,
      i.messageID,
      h
    )
  ) : void 0;
  return a.length === 0 && m.length === 0 ? null : /* @__PURE__ */ g(
    "div",
    {
      className: Pe(
        "agent-chat-message-output mt-4 min-w-0 max-w-full",
        r
      ),
      children: [
        m.length > 0 ? /* @__PURE__ */ s(Bt, { artifacts: m }) : null,
        a.length > 0 ? /* @__PURE__ */ s(
          Rt,
          {
            output: a,
            mediaLayout: "chat",
            onMediaPreview: w,
            renderMediaActions: f
          }
        ) : null
      ]
    }
  );
}
function Bt({
  artifacts: e
}) {
  return /* @__PURE__ */ s("div", { className: "agent-chat-media-grid", role: "status", "aria-label": "素材生成中", children: e.map((n) => {
    const t = Kt(n.kind), r = n.kind === "image" || n.kind === "video";
    return /* @__PURE__ */ g(
      "div",
      {
        className: Pe(
          "agent-chat-media-placeholder relative flex overflow-hidden rounded-lg border bg-muted/30",
          r ? "items-center justify-center" : "h-24 items-center px-5"
        ),
        style: r ? { aspectRatio: n.kind === "video" ? "16 / 9" : "4 / 3" } : void 0,
        children: [
          /* @__PURE__ */ s(t, { className: "agent-chat-media-placeholder-icon relative size-7 text-muted-foreground/35" }),
          /* @__PURE__ */ s(z, { className: "agent-chat-media-spinner absolute right-3 top-3 z-[2] size-4 text-muted-foreground/55" })
        ]
      },
      n.id
    );
  }) });
}
function Kt(e) {
  return e === "image" ? he : e === "video" ? ge : e === "audio" ? lt : F;
}
function jt(e) {
  return Ke(e).length > 0;
}
function Ke(e) {
  return je(e, {
    excludedKeys: /* @__PURE__ */ new Set(),
    excludeText: ""
  });
}
function je(e, n) {
  return Le(e).map((t) => Lt(t, n)).filter((t) => !!t);
}
function Le(e) {
  const n = Ft(e), t = fe(e);
  return Object.keys(t).length > 0 ? [...n, t] : n;
}
function Lt(e, n) {
  const t = {};
  for (const r of Be) {
    if (n.excludedKeys.has(r))
      continue;
    const o = Ht(e[r], r, n.excludeText);
    te(o) && (t[r] = o);
  }
  return Object.keys(t).length === 0 ? null : (te(e.title) && (t.title = e.title), e.meta && (t.meta = e.meta), t);
}
function qt(e) {
  const n = /* @__PURE__ */ new Set();
  for (const t of e)
    for (const r of Le(t))
      for (const o of Be)
        te(r[o]) && n.add(o);
  return n;
}
function Ht(e, n, t) {
  return n === "rich" || !t || !Array.isArray(e) ? e : e.filter(
    (r) => typeof r != "string" || !t.includes(r)
  );
}
function te(e) {
  return e == null || e === "" ? !1 : !Array.isArray(e) || e.length > 0;
}
function nr(e) {
  const n = e.activities || [], t = e.document ? Je(e.document) : e.text;
  return qe(t, n).map(
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
function qe(e, n) {
  const t = ye(e, n);
  if (n.length === 0)
    return t ? [{ type: "text", text: t }] : [];
  const r = [];
  let o = 0;
  for (const i of n) {
    const a = ye(
      i.anchorText,
      n
    ), c = Vt(t, a, o);
    ve(r, t.slice(o, c)), r.push({ type: "activity", activity: i }), o = c;
  }
  return ve(r, t.slice(o)), r;
}
function Ut(e, n) {
  const t = [];
  let r = !1;
  for (const o of qe(e, n)) {
    if (o.type === "text") {
      t.push(o.text);
      continue;
    }
    const i = fe(o.activity.output), a = Ke(
      Object.keys(i).length > 0 ? i : o.activity.output
    );
    a.length !== 0 && (r = !0, t.push(...a));
  }
  return r ? t : [];
}
function ve(e, n) {
  n && e.push({ type: "text", text: n });
}
function Vt(e, n, t) {
  if (!n)
    return t;
  if (e.startsWith(n))
    return Math.max(t, n.length);
  const r = e.indexOf(n, t);
  return r < 0 ? t : r + n.length;
}
function ye(e, n) {
  let t = String(e || "").replace(/\r\n/g, `
`);
  for (const r of Wt(n)) {
    const o = Zt(r);
    t = t.replace(
      new RegExp(
        `!\\[[^\\]]*\\]\\(\\s*<?${o}>?(?:\\s+["'][^"']*["'])?\\s*\\)`,
        "g"
      ),
      ""
    ).replace(
      new RegExp(
        `\\[[^\\]]*\\]\\(\\s*<?${o}>?(?:\\s+["'][^"']*["'])?\\s*\\)`,
        "g"
      ),
      ""
    );
  }
  return t.replace(/\n{3,}/g, `

`).trim();
}
function Wt(e) {
  const n = /* @__PURE__ */ new Set();
  for (const t of e)
    for (const r of ["images", "videos", "audios", "files"]) {
      const o = t.output[r];
      for (const i of Array.isArray(o) ? o : [o])
        typeof i == "string" && i.trim() && n.add(i.trim());
    }
  return n;
}
function Zt(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/lib/runtime-stream-output", "@/components/agent/stream-request-params"]);
const ne = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!ne || Object.keys(ne).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const P = ne.requestRaw, re = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!re || Object.keys(re).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const k = re.isPlainRecord, q = window.DeverFront?.sdk?.getCompatModule("@/components/agent/stream-request-params");
if (!q || Object.keys(q).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
const Gt = q.isPromptParam, He = q.normalizePowerParamConfig, Xt = Ie(), Jt = Ie();
async function rr(e, n) {
  const t = await B(
    P(e, "get", { agent_key: n }),
    "读取智能体输入参数失败"
  );
  return He(t.params).params.filter(
    (r) => !Gt(r)
  );
}
async function or(e, n) {
  const t = `${e}:${n}`;
  return Xt(t, async () => {
    const r = await B(
      P(e, "get", { agent_key: n }),
      "读取智能体执行配置失败"
    ), o = nn(r.model_sources), i = Number(r.model_source_rule || 1);
    return {
      modelSourceRule: i,
      modelSources: o,
      selectedModelTargetID: Ge(i) && (S(r.selected_model_target_id) || o[0]?.id) || 0,
      toolsEnabled: !0,
      tools: rn(r.tools),
      categories: on(r.power_cates)
    };
  });
}
async function sr(e, n) {
  const t = `${e}:${n.agentKey}:${n.powerID}:${n.sourceTargetID}`;
  return Jt(t, async () => {
    const r = await B(
      P(e, "get", {
        agent_key: n.agentKey,
        power_id: n.powerID,
        source_target_id: n.sourceTargetID || void 0
      }),
      "读取工具参数失败"
    );
    return He(r);
  });
}
async function ir(e, n) {
  const t = await B(
    P(e, "get", { document_id: n }),
    "读取图文内容失败"
  ), r = $e(t);
  if (!r)
    throw new Error("图文内容无效");
  return r;
}
async function Yt(e, n) {
  const t = await T(
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
    session: U(t.session),
    messages: en(t.messages)
  };
}
async function Qt(e, n) {
  const t = await T(e.sessions, {
    agent_key: n.agentKey,
    context_key: n.contextKey,
    limit: n.limit || 20,
    last_session_id: n.lastSessionID || void 0,
    status: "active"
  }), o = (Array.isArray(t.sessions) ? t.sessions : []).map(U).filter((c) => !!c), i = n.limit || 20, a = t.has_more == null ? o.length >= i : !!t.has_more;
  return { sessions: o, hasMore: a };
}
async function ar(e, n) {
  const t = await T(e.session, {
    session_id: n.sessionID,
    agent_key: n.agentKey,
    context_key: n.contextKey,
    session_only: !0
  });
  return U(t.session);
}
async function lr(e, n, t) {
  const r = await T(e.renameSession, {
    session_id: n,
    title: t
  }), o = U(r.session);
  if (!o)
    throw new Error("更新会话标题失败");
  return o;
}
async function cr(e, n) {
  await T(e.archiveSession, { session_id: n });
}
async function ur(e, n, t) {
  const r = await T(e, {
    session_id: n.sessionID,
    agent_key: n.agentKey,
    ref_type: t.refType,
    ref_id: t.refId,
    label: t.label
  }), o = v(r.ref_type), i = Number(r.ref_id || 0);
  if (!xe(o) || !i)
    throw new Error("引用内容无效");
  const a = r.text == null ? "" : String(r.text), c = Se(r.output), m = Ut(
    a,
    Ye(c)
  );
  return {
    refType: o,
    refId: i,
    title: v(r.title) || t.label,
    text: a,
    media: an(r.media),
    content: m.length > 0 ? m : void 0
  };
}
async function T(e, n) {
  return B(P(e, "post", n), "会话请求失败");
}
async function B(e, n) {
  const t = await e;
  if (!k(t))
    throw new Error(n);
  const r = Number(t.code || 0), o = Number(t.status || 0);
  if (r !== 0 || o === 2)
    throw new Error(v(t.message || t.msg) || n);
  return k(t.data) ? t.data : {};
}
function U(e) {
  if (!k(e))
    return null;
  const n = Number(e.id || 0);
  return !Number.isFinite(n) || n <= 0 ? null : {
    id: n,
    title: v(e.title) || "新会话",
    titleSource: v(e.title_source),
    running: !!e.running
  };
}
function en(e) {
  return (Array.isArray(e) ? e : []).map((t) => {
    if (!k(t))
      return null;
    const r = v(t.role) === "user" ? "user" : "assistant";
    return {
      id: Number(t.id || 0),
      role: r,
      kind: v(t.kind) || "chat",
      text: v(t.text),
      content: tn(t.content),
      output: Se(t.output),
      requestID: v(t.request_id),
      status: Number(t.status || 1),
      createdAt: v(t.created_at),
      document: $e(t.document)
    };
  }).filter((t) => !!t);
}
function tn(e) {
  if (!k(e) || Number(e.version) !== 1)
    return;
  const t = (Array.isArray(e.parts) ? e.parts : []).map((o) => {
    if (!k(o))
      return null;
    if (o.type === "text")
      return { type: "text", text: String(o.text || "") };
    const i = Number(o.ref_id || 0), a = v(o.ref_type);
    return o.type !== "reference" || !i || !xe(a) ? null : {
      type: "reference",
      ref_type: a,
      ref_id: i,
      label: v(o.label) || `${a} ${i}`,
      usage: v(o.usage) || void 0
    };
  }).filter((o) => !!o), r = sn(
    e.interaction_response
  );
  return {
    version: 1,
    parts: t,
    params: k(e.params) ? e.params : void 0,
    execution: k(e.execution) ? e.execution : void 0,
    interaction_response: r
  };
}
function nn(e) {
  return (Array.isArray(e) ? e : []).map((n) => {
    if (!k(n)) return null;
    const t = S(n.target_id || n.id);
    return t ? {
      id: t,
      name: Xe(
        n.service_name,
        n.name,
        `来源 ${t}`
      )
    } : null;
  }).filter((n) => !!n);
}
function rn(e) {
  return (Array.isArray(e) ? e : []).map((n) => {
    if (!k(n)) return null;
    const t = S(n.power_id || n.id);
    return t ? {
      id: t,
      powerID: t,
      cateID: S(n.cate_id),
      name: v(n.name) || "未命名工具",
      key: v(n.key),
      icon: v(n.icon),
      kind: v(n.kind),
      outputType: v(n.output_type)
    } : null;
  }).filter((n) => !!n);
}
function on(e) {
  return (Array.isArray(e) ? e : []).map(Ze).filter((n) => n.id > 0);
}
function sn(e) {
  if (!k(e))
    return;
  const n = v(e.interaction_id);
  if (n)
    return {
      interaction_id: n,
      data: k(e.data) ? e.data : {}
    };
}
function an(e) {
  return (Array.isArray(e) ? e : []).map((t) => {
    if (!k(t))
      return null;
    const r = v(t.url);
    if (!r)
      return null;
    const o = v(t.ref_type);
    return {
      refType: xe(o) ? o : void 0,
      refId: S(t.ref_id) || void 0,
      artifactId: S(t.artifact_id) || void 0,
      fileId: S(t.file_id) || void 0,
      seriesId: S(t.series_id) || void 0,
      kind: ln(t.kind),
      name: v(t.name) || void 0,
      label: v(t.label || t.name) || "素材",
      url: r
    };
  }).filter((t) => !!t);
}
function ln(e) {
  const n = v(e).toLowerCase();
  return ["image", "video", "audio"].includes(n) ? n : "file";
}
function xe(e) {
  return ["message", "artifact", "upload_file", "session", "asset"].includes(
    e
  );
}
function S(e) {
  const n = Number(e || 0);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}
function v(e) {
  return e == null ? "" : String(e).trim();
}
function cn(e) {
  return !!(e?.interaction_response || e?.parts.some((n) => n.type === "reference"));
}
function dr(e) {
  return !!(e.text.trim() || cn(e.content));
}
function un(e) {
  return {
    text: e,
    content: {
      version: 1,
      parts: [{ type: "text", text: e }]
    }
  };
}
function mr(e, n, t) {
  const r = un(n);
  return r.content.interaction_response = {
    interaction_id: e,
    data: t
  }, r;
}
async function fr(e, n) {
  if (n.scope === "history" && !n.parent) {
    const o = await Qt(e.api, {
      agentKey: e.agentKey,
      contextKey: e.contextKey,
      limit: 20,
      lastSessionID: ke(n.cursor)
    }), i = o.sessions.filter(
      (a) => a.id !== e.sessionID
    );
    return {
      items: _e(
        i.map((a) => ({
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
      nextCursor: o.sessions.length > 0 ? String(o.sessions[o.sessions.length - 1]?.id || "") : void 0
    };
  }
  const t = n.scope === "history" ? n.parent?.refId || 0 : e.sessionID;
  if (!t)
    return { items: [] };
  const r = await Yt(e.api, {
    agentKey: e.agentKey,
    contextKey: e.contextKey,
    sessionID: t,
    limit: 20,
    lastMessageID: ke(n.cursor)
  });
  return {
    items: _e(
      dn([...r.messages].reverse()),
      n.query
    ),
    nextCursor: r.messages.length > 0 ? String(r.messages[0]?.id || "") : void 0
  };
}
function dn(e) {
  return e.map(
    (n) => ({
      key: `message:${n.id}`,
      refType: "message",
      refId: n.id,
      label: fn(n),
      description: n.role === "user" ? "用户消息" : "智能体回复",
      messageRole: n.role,
      preview: {
        text: n.text,
        kind: "message"
      },
      materials: mn(n)
    })
  );
}
function mn(e) {
  const n = {
    image: 0,
    video: 0,
    audio: 0,
    file: 0
  };
  return R(e.output).filter(
    (t) => t.status === "ready" && !!(t.url || t.previewUrl)
  ).map((t) => {
    n[t.kind] = (n[t.kind] || 0) + 1;
    const r = t.displayNo || n[t.kind] || 1;
    return {
      key: `artifact:${t.id}`,
      refType: "artifact",
      refId: t.id,
      label: `${pn(t.kind)}${r}`,
      preview: {
        text: t.name || t.label,
        kind: t.kind,
        url: t.previewUrl || t.url,
        sourceUrl: t.url
      }
    };
  });
}
function fn(e) {
  const n = e.text.replace(/\s+/g, " ").trim();
  return n ? Array.from(n).slice(0, 48).join("") : e.role === "user" ? "用户消息" : "生成结果";
}
function _e(e, n) {
  const t = G(n);
  return t ? e.filter((r) => G(
    `${r.label} ${r.description || ""}`
  ).includes(t) || (r.materials || []).some(
    (i) => G(
      `${i.label} ${i.preview?.text || ""} ${i.preview?.kind || ""}`
    ).includes(t)
  )) : e;
}
function G(e) {
  return e.trim().toLowerCase().replace(/(图|视频|音频|文件)\s+(\d+)/g, "$1$2");
}
function pn(e) {
  return e === "image" ? "图" : e === "video" ? "视频" : e === "audio" ? "音频" : "文件";
}
function ke(e) {
  const n = Number(e || 0);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view", "@/lib/utils"]);
const oe = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!oe || Object.keys(oe).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const gn = oe.EnergonContentView, se = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!se || Object.keys(se).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const Ue = se.cn, hn = bt(function({
  text: n,
  streaming: t = !1,
  error: r = !1,
  className: o
}) {
  return n ? /* @__PURE__ */ s(
    gn,
    {
      output: { text: wn(n) },
      streaming: t,
      markdownClassName: bn,
      className: Ue(
        "agent-chat-markdown",
        r && "[&_*]:text-destructive",
        o
      )
    }
  ) : null;
});
function wn(e) {
  return String(e || "").replace(/\r\n/g, `
`).replace(
    /([。！？!?：:；;])([ \t\u00a0\u3000]*)(#{1,6})(?!#)([ \t\u00a0\u3000]+)(?=\S)/g,
    `$1

$3 `
  ).replace(
    /(^|\n)([ \t\u00a0\u3000]{0,3})(#{1,6})(?!#)([ \t\u00a0\u3000]*)(?=\S)/g,
    xn
  );
}
function xn(e, n, t, r, o) {
  return r.length === 1 && o.length === 0 ? e : `${n}${t}${r} `;
}
const bn = Ue(
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
);
await window.DeverFront?.ensureCompat?.(["@/lib/utils"]);
const ie = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!ie || Object.keys(ie).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const H = ie.cn, vn = /* @__PURE__ */ new Set(["image", "video", "audio", "file"]), yn = /* @__PURE__ */ new Set(["knowledge", "skill"]);
function _n({
  activity: e
}) {
  if (!e)
    return null;
  const n = R(e.output), t = fe(e.output);
  if (Object.keys(t).length > 0 || jt(e.output)) {
    const o = e.aspectRatio || (e.kind === "video" ? "16 / 9" : "4 / 3");
    return /* @__PURE__ */ s(
      "div",
      {
        className: "agent-chat-media-result",
        "data-kind": e.kind,
        style: {
          "--agent-chat-media-aspect-ratio": o
        },
        children: /* @__PURE__ */ s(
          Pt,
          {
            output: e.output,
            className: "agent-chat-activity-output"
          }
        )
      }
    );
  }
  return /* @__PURE__ */ s(kn, { activity: e, artifactCount: n.length });
}
function kn({
  activity: e,
  artifactCount: n
}) {
  const t = Cn(e.kind), r = vn.has(e.kind), o = e.status === "failed";
  if (yn.has(e.kind))
    return /* @__PURE__ */ s("div", { className: "mt-2 max-w-2xl py-1 text-muted-foreground", children: /* @__PURE__ */ s(Ce, { activity: e }) });
  if (o || !r)
    return /* @__PURE__ */ s(
      "div",
      {
        className: H(
          "mt-4 max-w-2xl rounded-lg border bg-muted/20 px-3.5 py-3",
          o && "border-destructive/30 bg-destructive/5"
        ),
        children: /* @__PURE__ */ s(Ce, { activity: e })
      }
    );
  const i = Math.min(8, Math.max(1, n || e.count)), a = e.kind === "image" || e.kind === "video", c = e.aspectRatio || (e.kind === "video" ? "16 / 9" : "4 / 3");
  return /* @__PURE__ */ s(
    "div",
    {
      role: "status",
      "aria-label": e.text || e.title,
      className: "agent-chat-media-grid mt-4",
      "data-count": i,
      children: Array.from({ length: i }, (m, h) => /* @__PURE__ */ g(
        "div",
        {
          className: H(
            "agent-chat-media-placeholder relative flex overflow-hidden rounded-lg border bg-muted/30",
            e.kind === "audio" || e.kind === "file" ? "h-24 items-center justify-start px-5" : "items-center justify-center"
          ),
          style: a ? { aspectRatio: c } : void 0,
          children: [
            /* @__PURE__ */ s(t, { className: "agent-chat-media-placeholder-icon relative size-7 text-muted-foreground/35" }),
            /* @__PURE__ */ s(z, { className: "agent-chat-media-spinner absolute right-3 top-3 z-[2] size-4 text-muted-foreground/55" }),
            e.progress != null ? /* @__PURE__ */ s(
              "span",
              {
                className: "absolute bottom-0 left-0 z-[2] h-1 bg-foreground/15 transition-[width] duration-300",
                style: { width: `${e.progress}%` }
              }
            ) : null
          ]
        },
        `${e.id}-${h}`
      ))
    }
  );
}
function Ce({ activity: e }) {
  const n = An(e.status), t = e.status === "failed", r = e.error || e.text || e.title;
  return /* @__PURE__ */ g(
    "div",
    {
      className: H(
        "flex min-w-0 items-center gap-2 text-sm text-muted-foreground",
        t && "text-destructive"
      ),
      children: [
        /* @__PURE__ */ s(
          n,
          {
            className: H(
              "size-4 shrink-0",
              e.status === "running" && "animate-spin"
            )
          }
        ),
        /* @__PURE__ */ s("span", { className: "min-w-0 flex-1 truncate", children: r }),
        e.progress != null && e.status === "running" ? /* @__PURE__ */ g("span", { className: "shrink-0 tabular-nums", children: [
          e.progress,
          "%"
        ] }) : null
      ]
    }
  );
}
function Cn(e) {
  switch (e) {
    case "image":
      return he;
    case "video":
      return ge;
    case "audio":
      return dt;
    case "file":
      return F;
    case "knowledge":
      return ut;
    default:
      return ct;
  }
}
function An(e) {
  return e === "succeeded" ? mt : e === "failed" ? we : z;
}
await window.DeverFront?.ensureCompat?.(["@/lib/utils"]);
const ae = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!ae || Object.keys(ae).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const Ae = ae.cn;
function Nn({
  documentID: e,
  enabled: n,
  contentRef: t,
  scrollRef: r
}) {
  const [o, i] = D([]), [a, c] = D(""), m = o.map((f) => f.id).join(`
`);
  I(() => {
    if (!n)
      return;
    const f = t.current;
    if (!f)
      return;
    let w = 0;
    const l = () => {
      window.cancelAnimationFrame(w), w = window.requestAnimationFrame(() => {
        const y = Dn(f, e);
        i(
          (b) => In(b, y) ? b : y
        ), c(
          (b) => y.some((u) => u.id === b) ? b : y[0]?.id || ""
        );
      });
    };
    l();
    const x = new MutationObserver(l);
    return x.observe(f, {
      childList: !0,
      characterData: !0,
      subtree: !0
    }), () => {
      x.disconnect(), window.cancelAnimationFrame(w);
    };
  }, [t, e, n]), I(() => {
    if (!n || !m)
      return;
    const f = r.current, w = t.current;
    if (!f || !w)
      return;
    const l = /* @__PURE__ */ new Map(), x = new IntersectionObserver(
      (y) => {
        for (const u of y)
          u.isIntersecting ? l.set(u.target.id, u.boundingClientRect.top) : l.delete(u.target.id);
        const b = Array.from(l.entries()).sort(
          (u, d) => u[1] - d[1]
        )[0];
        b && c(b[0]);
      },
      {
        root: f,
        rootMargin: "-24px 0px -68% 0px",
        threshold: [0, 1]
      }
    );
    for (const y of m.split(`
`)) {
      const b = document.getElementById(y);
      b && w.contains(b) && x.observe(b);
    }
    return () => x.disconnect();
  }, [t, n, m, r]);
  const h = N(
    (f) => {
      const w = r.current, l = t.current, x = document.getElementById(f);
      if (!w || !l || !x || !l.contains(x))
        return;
      const y = w.getBoundingClientRect().top, b = x.getBoundingClientRect().top, u = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      w.scrollTo({
        top: w.scrollTop + b - y - 24,
        behavior: u ? "auto" : "smooth"
      }), c(f);
    },
    [t, r]
  );
  return { items: o, activeID: a, selectItem: h };
}
function Ne({
  items: e,
  activeID: n,
  className: t,
  onSelect: r
}) {
  if (e.length === 0)
    return null;
  const o = Math.min(...e.map((i) => i.level));
  return /* @__PURE__ */ s("nav", { "aria-label": "文档目录", className: Ae("py-1", t), children: e.map((i) => {
    const a = i.id === n;
    return /* @__PURE__ */ s(
      "button",
      {
        type: "button",
        className: Ae(
          "block w-full border-l-2 py-1.5 pr-3 text-left text-sm leading-5 transition-colors",
          a ? "border-foreground font-medium text-foreground" : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
        ),
        style: {
          paddingLeft: 12 + Math.min(i.level - o, 2) * 12
        },
        title: i.title,
        "aria-current": a ? "location" : void 0,
        onClick: () => r(i.id),
        children: /* @__PURE__ */ s("span", { className: "line-clamp-2", children: i.title })
      },
      i.id
    );
  }) });
}
function Dn(e, n) {
  const t = /* @__PURE__ */ new Map();
  return Array.from(
    e.querySelectorAll(
      "[data-agent-document-block-id] h1, [data-agent-document-block-id] h2, [data-agent-document-block-id] h3, [data-agent-document-block-id] h4"
    )
  ).flatMap((r) => {
    const o = String(r.textContent || "").replace(/\s+/g, " ").trim(), a = r.closest(
      "[data-agent-document-block-id]"
    )?.dataset.agentDocumentBlockId || "";
    if (!o || !a)
      return [];
    const c = t.get(a) || 0;
    t.set(a, c + 1);
    const m = `agent-document-${n}-block-${a}-heading-${c}`;
    return r.id = m, r.dataset.agentDocumentHeading = "true", [
      {
        id: m,
        level: Number(r.tagName.slice(1)) || 2,
        title: o
      }
    ];
  });
}
function In(e, n) {
  return e.length === n.length && e.every(
    (t, r) => t.id === n[r]?.id && t.level === n[r]?.level && t.title === n[r]?.title
  );
}
const Mn = 64;
function Sn({
  documentID: e,
  contentVersion: n,
  enabled: t,
  pending: r
}) {
  const o = A(null), i = A(null), a = A(null), c = A(""), m = A(!1), h = A(0), [f, w] = D(!0), l = N(() => {
    const u = i.current;
    if (!u)
      return !0;
    const d = u.scrollHeight - u.scrollTop - u.clientHeight <= Mn;
    return w(
      (_) => _ === d ? _ : d
    ), d;
  }, []), x = N((u = "auto") => {
    const d = i.current;
    d && (m.current = !0, d.scrollTo({ top: d.scrollHeight, behavior: u }), h.current = d.scrollTop, w(!0));
  }, []), y = N(() => {
    a.current != null && window.cancelAnimationFrame(a.current), a.current = window.requestAnimationFrame(() => {
      if (a.current = null, m.current) {
        x();
        return;
      }
      l();
    });
  }, [x, l]);
  I(() => {
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
    const d = i.current;
    d && !r && (d.scrollTop = 0), h.current = d?.scrollTop || 0, y();
  }, [e, t, r, y, l]), vt(() => {
    t && y();
  }, [n, t, y]), I(() => {
    if (!t)
      return;
    const u = o.current;
    if (!u)
      return;
    const d = new ResizeObserver(y);
    return d.observe(u), y(), () => d.disconnect();
  }, [e, t, y]), I(
    () => () => {
      a.current != null && window.cancelAnimationFrame(a.current);
    },
    []
  );
  const b = N(() => {
    const u = i.current;
    if (!u)
      return;
    const d = u.scrollTop < h.current - 1, _ = l();
    d ? m.current = !1 : _ && (m.current = !0), h.current = u.scrollTop;
  }, [l]);
  return {
    atBottom: f,
    contentRef: o,
    handleScroll: b,
    scrollRef: i,
    scrollToBottom: x
  };
}
function $n({
  document: e,
  running: n,
  error: t
}) {
  const r = n && e.status === "writing" && e.blocks.length > 0;
  return /* @__PURE__ */ g("div", { className: "agent-chat-document min-w-0", children: [
    e.title ? /* @__PURE__ */ s("h1", { className: "mb-5 text-xl font-semibold leading-tight", children: e.title }) : null,
    e.blocks.map(
      (o) => o.type === "media" ? /* @__PURE__ */ s(zn, { block: o }, o.id) : /* @__PURE__ */ s(
        On,
        {
          block: o,
          title: e.title,
          error: t
        },
        o.id
      )
    ),
    e.blocks.length === 0 && n ? /* @__PURE__ */ s(En, {}) : null,
    e.blocks.length === 0 && e.status === "failed" ? /* @__PURE__ */ s(Rn, { message: Fn(e) }) : null,
    r ? /* @__PURE__ */ s(De, {}) : null,
    !n && pe(e) ? /* @__PURE__ */ s(De, {}) : null
  ] });
}
function On({
  block: e,
  title: n,
  error: t
}) {
  const r = Qe(e.text, n);
  return r ? /* @__PURE__ */ s("div", { "data-agent-document-block-id": e.id, children: /* @__PURE__ */ s(
    hn,
    {
      text: r,
      error: t,
      className: "agent-chat-document-text"
    }
  ) }) : null;
}
function zn({ block: e }) {
  return e.status === "failed" ? /* @__PURE__ */ g("div", { className: "my-4 flex items-center gap-2 text-sm text-destructive", children: [
    /* @__PURE__ */ s(we, { className: "size-4 shrink-0" }),
    /* @__PURE__ */ g("span", { children: [
      le(e.mediaKind),
      "生成失败"
    ] })
  ] }) : /* @__PURE__ */ s(_n, { activity: Tn(e) });
}
function Tn(e) {
  const n = Number(e.meta.progress), t = et(e);
  return {
    id: `document-block-${e.id}`,
    title: `${le(e.mediaKind)}生成`,
    kind: e.mediaKind,
    status: t ? "succeeded" : "running",
    text: typeof e.meta.progress_text == "string" ? e.meta.progress_text : `${le(e.mediaKind)}生成中`,
    error: "",
    progress: Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : null,
    count: Math.max(1, e.artifacts.length),
    aspectRatio: tt(
      e.meta,
      e.artifacts.map((r) => r.meta)
    ) || (e.mediaKind === "video" ? "16 / 9" : "4 / 3"),
    anchorText: "",
    output: { artifacts: e.artifacts }
  };
}
function le(e) {
  return e === "image" ? "图片" : e === "video" ? "视频" : e === "audio" ? "音频" : "文件";
}
function En() {
  return /* @__PURE__ */ s(
    "div",
    {
      role: "status",
      "aria-label": "正在组织图文内容",
      className: "agent-chat-waiting-indicator",
      children: [0, 1, 2].map((e) => /* @__PURE__ */ s(
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
function Rn({ message: e }) {
  return /* @__PURE__ */ g("div", { className: "flex items-center gap-2 text-sm text-destructive", children: [
    /* @__PURE__ */ s(we, { className: "size-4 shrink-0" }),
    /* @__PURE__ */ s("span", { children: e })
  ] });
}
function Fn(e) {
  const n = e.meta.error;
  return typeof n == "string" && n.trim() ? n.trim() : "文档生成失败，请重新生成。";
}
function De() {
  return /* @__PURE__ */ s(
    "div",
    {
      role: "status",
      "aria-label": "正在继续生成图文内容",
      className: "agent-chat-next-step-indicator",
      children: /* @__PURE__ */ s("span", { className: "agent-chat-pulse-dot" })
    }
  );
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/button", "@/components/ui/sheet", "@/lib/utils"]);
const ce = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!ce || Object.keys(ce).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const j = ce.Button, $ = window.DeverFront?.sdk?.getCompatModule("@/components/ui/sheet");
if (!$ || Object.keys($).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/sheet");
const Pn = $.Sheet, Bn = $.SheetContent, Kn = $.SheetDescription, jn = $.SheetHeader, Ln = $.SheetTitle, ue = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!ue || Object.keys(ue).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const X = ue.cn;
function pr({
  document: e,
  onOpen: n
}) {
  const t = pe(e);
  return /* @__PURE__ */ g(
    "button",
    {
      type: "button",
      className: "mt-3 flex items-center gap-3 rounded-md border bg-background px-3 py-2.5 text-left transition-colors hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      style: { width: "min(100%, 28rem)" },
      "aria-label": `打开文档：${e.title || "生成的文档"}`,
      onClick: () => n(e),
      children: [
        /* @__PURE__ */ s("span", { className: "flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/70 text-muted-foreground", children: /* @__PURE__ */ s(F, { className: "size-4" }) }),
        /* @__PURE__ */ g("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ s("span", { className: "block truncate text-sm font-medium text-foreground", children: e.title || "生成的文档" }),
          /* @__PURE__ */ s("span", { className: "mt-0.5 block text-xs text-muted-foreground", children: t ? "正在生成" : Ve(e.status) })
        ] }),
        t ? /* @__PURE__ */ s(z, { className: "size-4 shrink-0 animate-spin text-muted-foreground" }) : /* @__PURE__ */ s(wt, { className: "size-4 shrink-0 text-muted-foreground" })
      ]
    }
  );
}
function gr({
  open: e,
  portalContainer: n,
  document: t,
  messageID: r,
  renderArtifactActions: o,
  renderDocumentActions: i,
  onClose: a
}) {
  const [c, m] = D(!1), [h, f] = D(!1), w = A(!1), l = A(null), x = A(null), y = A(null), b = t.status === "failed", u = pe(t), d = Sn({
    documentID: t.id,
    contentVersion: qn(t),
    enabled: e,
    pending: u
  }), _ = Nn({
    documentID: t.id,
    enabled: e,
    contentRef: d.contentRef,
    scrollRef: d.scrollRef
  }), M = _.items.length >= 2;
  I(() => {
    f(!1);
  }, [t.id, e]), I(() => {
    if (!h)
      return;
    const p = (V) => {
      const W = V.target;
      !(W instanceof Node) || x.current?.contains(W) || y.current?.contains(W) || f(!1);
    }, C = (V) => {
      V.key === "Escape" && f(!1);
    };
    return window.document.addEventListener(
      "pointerdown",
      p,
      !0
    ), window.document.addEventListener("keydown", C), () => {
      window.document.removeEventListener(
        "pointerdown",
        p,
        !0
      ), window.document.removeEventListener("keydown", C);
    };
  }, [h]), I(
    () => () => {
      l.current != null && window.clearTimeout(l.current);
    },
    []
  );
  const K = async () => {
    const p = nt(t);
    if (p.trim()) {
      w.current = !0;
      try {
        await _t(p);
      } catch {
        return;
      } finally {
        w.current = !1;
      }
      m(!0), l.current != null && window.clearTimeout(l.current), l.current = window.setTimeout(() => {
        m(!1), l.current = null;
      }, 1800);
    }
  };
  return /* @__PURE__ */ s(
    Pn,
    {
      open: e,
      modal: !1,
      onOpenChange: (p) => {
        p || a();
      },
      children: /* @__PURE__ */ g(
        Bn,
        {
          container: n,
          side: "right",
          showCloseButton: !1,
          showOverlay: !1,
          "data-assistant-layer": "true",
          layerZIndex: yt,
          onOpenAutoFocus: (p) => {
            p.preventDefault(), d.scrollRef.current?.focus({ preventScroll: !0 });
          },
          onFocusOutside: (p) => {
            w.current && p.preventDefault();
          },
          onInteractOutside: (p) => {
            w.current && p.preventDefault();
          },
          className: "flex w-[94vw] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-none md:w-[72vw] xl:w-[64vw] 2xl:w-[1120px]",
          children: [
            /* @__PURE__ */ g(jn, { className: "flex h-14 shrink-0 flex-row items-center gap-3 border-b px-5 py-0 text-start", children: [
              /* @__PURE__ */ s(F, { className: "size-4 shrink-0 text-muted-foreground" }),
              /* @__PURE__ */ g("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ s(Ln, { className: "truncate text-sm", children: t.title || "生成的文档" }),
                /* @__PURE__ */ g(
                  Kn,
                  {
                    className: X(
                      "mt-0.5 flex items-center gap-1.5 text-xs",
                      b ? "text-destructive" : "text-muted-foreground"
                    ),
                    children: [
                      u && !b ? /* @__PURE__ */ s(z, { className: "size-3 animate-spin" }) : null,
                      /* @__PURE__ */ s("span", { children: b ? "生成失败" : u ? t.status === "writing" ? "正文生成中" : "素材生成中" : Ve(t.status) })
                    ]
                  }
                )
              ] }),
              M ? /* @__PURE__ */ s(O, { label: "查看文档目录", children: /* @__PURE__ */ g(
                j,
                {
                  ref: x,
                  type: "button",
                  size: "sm",
                  variant: "ghost",
                  className: "h-8 shrink-0 gap-1.5 px-2 xl:hidden",
                  "aria-label": "查看文档目录",
                  "aria-haspopup": "dialog",
                  "aria-expanded": h,
                  onClick: () => f((p) => !p),
                  children: [
                    /* @__PURE__ */ s(ft, { className: "size-4" }),
                    /* @__PURE__ */ s("span", { className: "hidden sm:inline", children: "目录" })
                  ]
                }
              ) }) : null,
              i?.({
                messageID: r,
                document: t,
                running: u,
                error: b
              }),
              /* @__PURE__ */ s(O, { label: c ? "已复制" : "复制文档", children: /* @__PURE__ */ s(
                j,
                {
                  type: "button",
                  size: "icon",
                  variant: "ghost",
                  className: "size-8 shrink-0",
                  "aria-label": c ? "文档已复制" : "复制文档",
                  disabled: !t.blocks.length,
                  onClick: () => {
                    K();
                  },
                  children: c ? /* @__PURE__ */ s(pt, { className: "size-4" }) : /* @__PURE__ */ s(gt, { className: "size-4" })
                }
              ) }),
              /* @__PURE__ */ s(O, { label: "关闭文档", children: /* @__PURE__ */ s(
                j,
                {
                  type: "button",
                  size: "icon",
                  variant: "ghost",
                  className: "size-8 shrink-0",
                  "aria-label": "关闭文档",
                  onClick: a,
                  children: /* @__PURE__ */ s(Oe, { className: "size-4" })
                }
              ) })
            ] }),
            M && h ? /* @__PURE__ */ g(
              "div",
              {
                ref: y,
                role: "dialog",
                "aria-label": "文档目录",
                "data-assistant-layer": "true",
                className: "absolute right-4 top-14 z-50 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md xl:hidden",
                style: { width: "min(20rem, calc(100% - 2rem))" },
                children: [
                  /* @__PURE__ */ s("div", { className: "border-b px-4 py-3 text-sm font-medium", children: "目录" }),
                  /* @__PURE__ */ s("div", { className: "max-h-[60vh] overflow-y-auto px-2 py-2 overscroll-contain", children: /* @__PURE__ */ s(
                    Ne,
                    {
                      items: _.items,
                      activeID: _.activeID,
                      onSelect: (p) => {
                        _.selectItem(p), f(!1);
                      }
                    }
                  ) })
                ]
              }
            ) : null,
            /* @__PURE__ */ g(
              "div",
              {
                className: X(
                  "min-h-0 flex-1",
                  M && "xl:grid xl:grid-cols-[13rem_minmax(0,1fr)]"
                ),
                children: [
                  /* @__PURE__ */ s(
                    "aside",
                    {
                      className: X(
                        "hidden min-h-0 flex-col border-r bg-muted/10",
                        M && "xl:flex"
                      ),
                      children: M ? /* @__PURE__ */ g(Me, { children: [
                        /* @__PURE__ */ s("div", { className: "shrink-0 px-5 pb-2 pt-8 text-xs font-medium text-muted-foreground", children: "目录" }),
                        /* @__PURE__ */ s("div", { className: "min-h-0 flex-1 overflow-y-auto px-3 pb-6 overscroll-contain", children: /* @__PURE__ */ s(
                          Ne,
                          {
                            items: _.items,
                            activeID: _.activeID,
                            onSelect: _.selectItem
                          }
                        ) })
                      ] }) : null
                    }
                  ),
                  /* @__PURE__ */ g("div", { className: "relative h-full min-h-0", children: [
                    /* @__PURE__ */ s(
                      "div",
                      {
                        ref: d.scrollRef,
                        tabIndex: -1,
                        className: "h-full min-h-0 overflow-y-auto overscroll-contain focus:outline-none",
                        style: { scrollbarGutter: "stable" },
                        onScroll: d.handleScroll,
                        children: /* @__PURE__ */ s(
                          "div",
                          {
                            ref: d.contentRef,
                            className: "mx-auto w-full max-w-3xl px-6 py-8 md:px-9 md:py-10",
                            children: /* @__PURE__ */ s(
                              At,
                              {
                                messageID: r,
                                render: o,
                                children: /* @__PURE__ */ s(
                                  $n,
                                  {
                                    document: t,
                                    running: u,
                                    error: b
                                  }
                                )
                              }
                            )
                          }
                        )
                      }
                    ),
                    d.atBottom ? null : /* @__PURE__ */ s(O, { label: "回到底部", children: /* @__PURE__ */ s(
                      j,
                      {
                        type: "button",
                        size: "icon",
                        variant: "outline",
                        className: "absolute bottom-4 right-4 z-10 size-9 rounded-full bg-background shadow-sm",
                        "aria-label": "回到底部",
                        onClick: () => d.scrollToBottom("smooth"),
                        children: /* @__PURE__ */ s(ht, { className: "size-4" })
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
function qn(e) {
  const n = e.blocks.map((t) => {
    const r = t.artifacts.map(
      (o) => `${o.id}:${o.status}:${o.url}:${o.previewUrl}`
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
function Ve(e) {
  return e === "failed" ? "生成失败" : e === "partial_failed" ? "部分素材生成失败" : e === "ready" ? "已生成" : e === "generating" ? "素材生成中" : "正文生成中";
}
await window.DeverFront?.ensureCompat?.(["@/components/agent/interaction-panel", "@/lib/utils"]);
const de = window.DeverFront?.sdk?.getCompatModule("@/components/agent/interaction-panel");
if (!de || Object.keys(de).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/interaction-panel");
const Hn = de.AgentInteractionPanel, me = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!me || Object.keys(me).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const We = me.cn;
function hr({
  interaction: e,
  response: n,
  disabled: t,
  onSubmit: r
}) {
  return /* @__PURE__ */ g(
    "div",
    {
      "data-presentation": e.presentation || "form",
      className: We(
        "agent-chat-interaction mt-5",
        e.presentation === "stepper" ? "w-full" : "max-w-2xl"
      ),
      children: [
        n ? null : /* @__PURE__ */ g(
          "div",
          {
            role: "status",
            "aria-live": "polite",
            className: "mb-3 flex items-center gap-2 text-sm text-muted-foreground",
            children: [
              /* @__PURE__ */ s("span", { className: "agent-chat-pulse-dot" }),
              /* @__PURE__ */ s("span", { children: "等待补充信息" })
            ]
          }
        ),
        /* @__PURE__ */ s(
          Hn,
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
function wr({
  suggestions: e,
  disabled: n,
  onSelect: t
}) {
  return e.length === 0 ? null : /* @__PURE__ */ s("div", { className: "agent-chat-suggestions mt-5 flex flex-wrap gap-2", children: e.map((r) => /* @__PURE__ */ s(O, { label: r.prompt, children: /* @__PURE__ */ g(
    "button",
    {
      type: "button",
      disabled: n,
      className: We(
        "group inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-lg border bg-background px-3 py-2 text-left text-sm leading-5 text-foreground shadow-sm transition-colors",
        "hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-50"
      ),
      onClick: () => t(r),
      children: [
        /* @__PURE__ */ s("span", { className: "truncate", children: r.label }),
        /* @__PURE__ */ s(xt, { className: "size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" })
      ]
    }
  ) }, r.prompt)) });
}
export {
  _n as A,
  er as B,
  Pt as a,
  qe as b,
  pr as c,
  wr as d,
  gr as e,
  nr as f,
  cn as g,
  dr as h,
  ar as i,
  fr as j,
  ur as k,
  ir as l,
  Yt as m,
  Qt as n,
  cr as o,
  rr as p,
  At as q,
  lr as r,
  hn as s,
  un as t,
  hr as u,
  mr as v,
  or as w,
  sr as x,
  Qn as y,
  tr as z
};
