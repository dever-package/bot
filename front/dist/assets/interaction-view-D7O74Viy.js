import { n as et } from "./power-icon-Dfs_ppQs.js";
import { b as Te, i as tt, r as nt } from "./preloadable-B6OSmL0f.js";
import { r as P, b as xe, a as rt, n as ze, c as ot, d as Oe, i as be, e as st, f as it, g as at, h as lt } from "./runtime-Gq7KG82o.js";
import { j as o, a as d, F as Ee } from "./react-CDpwMNlY.js";
import { ay as ct, P as ut, K as dt, r as z, D as mt, X as Re, b as B, a7 as ft, a8 as ve, a9 as ye, as as gt, az as pt, I as V, Q as ht, C as Fe, a5 as wt, aA as xt, aB as bt, aC as vt, aD as yt, n as _t, w as Ct, av as kt, d as Nt, t as At } from "./vendor-icons-Cz5zFzlk.js";
import { o as Pe, n as Be, a as I, h as D, b as M, q as Dt, e as A, l as It } from "./file-kind-DFeonxO2.js";
import { A as O, a as Mt, c as St } from "./clipboard-DxihPGEw.js";
import { a as $t } from "./media-inspector-gallery-Ci5KbK6m.js";
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const Y = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!Y || Object.keys(Y).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Tt = Y.resolveAssetUrl, je = Pe({
  messageID: 0
});
function zt({
  messageID: e,
  render: t,
  children: n
}) {
  return /* @__PURE__ */ o(je.Provider, { value: { messageID: e, render: t }, children: n });
}
function Ot() {
  return Be(je);
}
function Et(e, t, n) {
  return {
    ...e,
    context: {
      source: "agent-chat",
      messageID: t,
      artifacts: n
    }
  };
}
function Rt(e) {
  if (!e || typeof e != "object" || Array.isArray(e))
    return null;
  const t = e;
  return t.source !== "agent-chat" || !Number(t.messageID) || !Array.isArray(t.artifacts) ? null : {
    source: "agent-chat",
    messageID: Number(t.messageID),
    artifacts: t.artifacts
  };
}
function Ke(e, t, n, r = 0) {
  const s = e.filter(
    (l) => l.kind === t && l.status === "ready" && l.url
  ), i = X(n);
  return s.find(
    (l) => X(l.url) === i || X(l.previewUrl) === i
  ) || s[r] || null;
}
function X(e) {
  return Tt(String(e || "").trim());
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/button", "@/lib/utils"]);
const ee = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!ee || Object.keys(ee).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const Ft = ee.Button, te = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!te || Object.keys(te).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const Pt = te.cn, Le = Pe(
  null
);
function gr() {
  const [e, t] = I(
    null
  ), [n, r] = I(0), s = D((h) => {
    const f = h.items.findIndex(
      (w) => String(w.id) === String(h.initialItemId)
    );
    t(h), r(f >= 0 ? f : 0);
  }, []), i = D(() => {
    t(null), r(0);
  }, []), a = D((h) => {
    r(h);
  }, []), l = D(
    (h) => {
      const f = e?.items.length || 0;
      f <= 1 || r((w) => (w + h + f) % f);
    },
    [e?.items.length]
  ), m = e?.items[n];
  return {
    request: e,
    activeIndex: n,
    activeItem: m,
    open: !!(e && m),
    openPreview: s,
    closePreview: i,
    selectIndex: a,
    move: l
  };
}
function pr({
  controller: e,
  children: t
}) {
  return /* @__PURE__ */ o(Le.Provider, { value: e.openPreview, children: t });
}
function Bt() {
  return Be(Le) || void 0;
}
function hr({
  controller: e,
  renderArtifactActions: t
}) {
  const { request: n, activeIndex: r, activeItem: s, closePreview: i, move: a, selectIndex: l } = e, [m, h] = I(1), [f, w] = I(!1), [c, b] = I("");
  M(() => {
    h(1), b("");
  }, [s?.id]), M(() => {
    if (!n)
      return;
    const p = (k) => {
      if (k.key === "Escape") {
        k.preventDefault(), k.stopImmediatePropagation(), i();
        return;
      }
      qt(k.target) || (k.key === "ArrowLeft" && (k.preventDefault(), a(-1)), k.key === "ArrowRight" && (k.preventDefault(), a(1)));
    };
    return window.addEventListener("keydown", p, !0), () => window.removeEventListener("keydown", p, !0);
  }, [i, a, n]);
  const y = D(async () => {
    if (!(!n || !s || f)) {
      w(!0), b("");
      try {
        await n.download(s.id);
      } catch (p) {
        b(p instanceof Error ? p.message : "下载素材失败");
      } finally {
        w(!1);
      }
    }
  }, [s, f, n]);
  if (!n || !s)
    return null;
  const v = n.items.length > 1, g = Lt(n.kind), u = n.kind === "audio" || n.kind === "file", _ = Rt(n.context), S = _ ? Ke(
    _.artifacts,
    n.kind,
    s.url,
    r
  ) : null, L = /* @__PURE__ */ d(
    "aside",
    {
      className: Pt(
        "flex min-h-0 min-w-0 flex-col bg-background",
        u ? "relative max-h-[min(80dvh,480px)] w-full max-w-2xl overflow-hidden rounded-lg border shadow-xl" : "absolute inset-0 z-30 md:static md:z-auto md:flex-1 md:border-l"
      ),
      role: u ? "dialog" : void 0,
      "aria-modal": u ? "true" : void 0,
      "aria-label": `${g}预览`,
      children: [
        /* @__PURE__ */ d("header", { className: "flex h-14 shrink-0 items-center gap-3 border-b px-3 md:px-4", children: [
          /* @__PURE__ */ d("div", { className: "flex min-w-0 flex-1 items-center gap-2", children: [
            /* @__PURE__ */ o(jt, { kind: n.kind, className: "size-4 shrink-0" }),
            /* @__PURE__ */ d("span", { className: "shrink-0 text-sm font-semibold text-foreground", children: [
              g,
              v ? ` ${r + 1}/${n.items.length}` : ""
            ] }),
            n.kind === "audio" || n.kind === "file" ? /* @__PURE__ */ o("span", { className: "truncate text-xs text-muted-foreground", children: s.name }) : null
          ] }),
          /* @__PURE__ */ d("div", { className: "flex shrink-0 items-center gap-1", children: [
            S && _ && t ? t({
              messageID: _.messageID,
              artifact: S,
              placement: "preview"
            }) : null,
            n.kind === "image" ? /* @__PURE__ */ d(Ee, { children: [
              /* @__PURE__ */ o(
                F,
                {
                  label: "缩小",
                  disabled: m <= 0.5,
                  onClick: () => h((p) => Ce(p - 0.25)),
                  children: /* @__PURE__ */ o(ct, {})
                }
              ),
              /* @__PURE__ */ d("span", { className: "hidden w-11 text-center text-xs tabular-nums text-muted-foreground sm:inline", children: [
                Math.round(m * 100),
                "%"
              ] }),
              /* @__PURE__ */ o(
                F,
                {
                  label: "放大",
                  disabled: m >= 3,
                  onClick: () => h((p) => Ce(p + 0.25)),
                  children: /* @__PURE__ */ o(ut, {})
                }
              ),
              /* @__PURE__ */ o(F, { label: "适应窗口", onClick: () => h(1), children: /* @__PURE__ */ o(dt, {}) })
            ] }) : null,
            /* @__PURE__ */ o(
              F,
              {
                label: "下载",
                disabled: f,
                onClick: () => {
                  y();
                },
                children: f ? /* @__PURE__ */ o(z, { className: "animate-spin" }) : /* @__PURE__ */ o(mt, {})
              }
            ),
            /* @__PURE__ */ o(F, { label: "关闭预览", onClick: i, children: /* @__PURE__ */ o(Re, {}) })
          ] })
        ] }),
        /* @__PURE__ */ o(
          $t,
          {
            kind: n.kind,
            items: n.items,
            activeIndex: r,
            zoom: m,
            compact: u,
            className: u ? "flex-none" : "flex-1",
            onSelect: l
          }
        ),
        c ? /* @__PURE__ */ o(
          "div",
          {
            role: "alert",
            className: "absolute bottom-4 left-1/2 max-w-[80%] -translate-x-1/2 rounded-md bg-destructive px-3 py-2 text-xs text-white shadow-lg",
            children: c
          }
        ) : null
      ]
    }
  );
  return u ? /* @__PURE__ */ o(
    "div",
    {
      className: "absolute inset-0 z-30 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-[1px]",
      role: "presentation",
      onPointerDown: (p) => {
        p.target === p.currentTarget && i();
      },
      children: L
    }
  ) : L;
}
function F({
  label: e,
  children: t,
  disabled: n,
  onClick: r
}) {
  return /* @__PURE__ */ o(O, { label: e, children: /* @__PURE__ */ o(
    Ft,
    {
      type: "button",
      size: "icon",
      variant: "ghost",
      className: "size-9",
      "aria-label": e,
      disabled: n,
      onClick: r,
      children: /* @__PURE__ */ o("span", { className: "[&>svg]:size-4", children: t })
    }
  ) });
}
function jt({
  kind: e,
  className: t
}) {
  const n = Kt[e];
  return /* @__PURE__ */ o(n, { className: t });
}
const Kt = {
  image: ye,
  video: ve,
  audio: ft,
  file: B
};
function Lt(e) {
  return e === "image" ? "图片" : e === "video" ? "视频" : e === "audio" ? "音频" : "文件";
}
function Ce(e) {
  return Math.min(3, Math.max(0.5, e));
}
function qt(e) {
  return e instanceof HTMLElement && !!e.closest("button, input, textarea, select, video, audio");
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view", "@/lib/utils"]);
const H = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!H || Object.keys(H).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const Ht = H.EnergonContentView, Ut = H.normalizeEnergonOutput, ne = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!ne || Object.keys(ne).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const qe = ne.cn, He = [
  "rich",
  "images",
  "videos",
  "audios",
  "files"
];
function Vt({
  output: e,
  excludeOutputs: t = [],
  excludeText: n = "",
  className: r
}) {
  const s = Bt(), i = Ot(), a = Ve(e, {
    excludedKeys: Jt(t),
    excludeText: n
  }), l = new Set(
    t.flatMap(
      (c) => P(c).map((b) => b.id)
    )
  ), m = P(e).filter(
    (c) => c.status === "generating" && !l.has(c.id)
  ), h = P(e).filter(
    (c) => c.status === "ready" && !l.has(c.id)
  ), f = i.render ? (c) => {
    const b = Ke(
      h,
      c.kind,
      c.item.url,
      c.index
    );
    return b && i.messageID > 0 ? i.render?.({
      messageID: i.messageID,
      artifact: b,
      placement: "inline"
    }) : null;
  } : void 0, w = s ? (c) => s(
    Et(
      c,
      i.messageID,
      h
    )
  ) : void 0;
  return a.length === 0 && m.length === 0 ? null : /* @__PURE__ */ d(
    "div",
    {
      className: qe(
        "agent-chat-message-output mt-4 min-w-0 max-w-full",
        r
      ),
      children: [
        m.length > 0 ? /* @__PURE__ */ o(Gt, { artifacts: m }) : null,
        a.length > 0 ? /* @__PURE__ */ o(
          Ht,
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
function Gt({
  artifacts: e
}) {
  return /* @__PURE__ */ o("div", { className: "agent-chat-media-grid", role: "status", "aria-label": "素材生成中", children: e.map((t) => {
    const n = Wt(t.kind), r = t.kind === "image" || t.kind === "video";
    return /* @__PURE__ */ d(
      "div",
      {
        className: qe(
          "agent-chat-media-placeholder relative flex overflow-hidden rounded-lg border bg-muted/30",
          r ? "items-center justify-center" : "h-24 items-center px-5"
        ),
        style: r ? { aspectRatio: t.kind === "video" ? "16 / 9" : "4 / 3" } : void 0,
        children: [
          /* @__PURE__ */ o(n, { className: "agent-chat-media-placeholder-icon relative size-7 text-muted-foreground/35" }),
          /* @__PURE__ */ o(z, { className: "agent-chat-media-spinner absolute right-3 top-3 z-[2] size-4 text-muted-foreground/55" })
        ]
      },
      t.id
    );
  }) });
}
function Wt(e) {
  return e === "image" ? ye : e === "video" ? ve : e === "audio" ? gt : B;
}
function Zt(e) {
  return Ue(e).length > 0;
}
function Ue(e) {
  return Ve(e, {
    excludedKeys: /* @__PURE__ */ new Set(),
    excludeText: ""
  });
}
function Ve(e, t) {
  return Ge(e).map((n) => Xt(n, t)).filter((n) => !!n);
}
function Ge(e) {
  const t = Ut(e), n = xe(e);
  return Object.keys(n).length > 0 ? [...t, n] : t;
}
function Xt(e, t) {
  const n = {};
  for (const r of He) {
    if (t.excludedKeys.has(r))
      continue;
    const s = Qt(e[r], r, t.excludeText);
    re(s) && (n[r] = s);
  }
  return Object.keys(n).length === 0 ? null : (re(e.title) && (n.title = e.title), e.meta && (n.meta = e.meta), n);
}
function Jt(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    for (const r of Ge(n))
      for (const s of He)
        re(r[s]) && t.add(s);
  return t;
}
function Qt(e, t, n) {
  return t === "rich" || !n || !Array.isArray(e) ? e : e.filter(
    (r) => typeof r != "string" || !n.includes(r)
  );
}
function re(e) {
  return e == null || e === "" ? !1 : !Array.isArray(e) || e.length > 0;
}
function wr(e) {
  const t = e.activities || [], n = e.document ? rt(e.document) : e.text;
  return We(n, t).map(
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
function We(e, t) {
  const n = Ne(e, t);
  if (t.length === 0)
    return n ? [{ type: "text", text: n }] : [];
  const r = [];
  let s = 0;
  for (const i of t) {
    const a = Ne(
      i.anchorText,
      t
    ), l = en(n, a, s);
    ke(r, n.slice(s, l)), r.push({ type: "activity", activity: i }), s = l;
  }
  return ke(r, n.slice(s)), r;
}
function Yt(e, t) {
  const n = [];
  let r = !1;
  for (const s of We(e, t)) {
    if (s.type === "text") {
      n.push(s.text);
      continue;
    }
    const i = xe(s.activity.output), a = Ue(
      Object.keys(i).length > 0 ? i : s.activity.output
    );
    a.length !== 0 && (r = !0, n.push(...a));
  }
  return r ? n : [];
}
function ke(e, t) {
  t && e.push({ type: "text", text: t });
}
function en(e, t, n) {
  if (!t)
    return n;
  if (e.startsWith(t))
    return Math.max(n, t.length);
  const r = e.indexOf(t, n);
  return r < 0 ? n : r + t.length;
}
function Ne(e, t) {
  let n = String(e || "").replace(/\r\n/g, `
`);
  for (const r of tn(t)) {
    const s = nn(r);
    n = n.replace(
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
  return n.replace(/\n{3,}/g, `

`).trim();
}
function tn(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    for (const r of ["images", "videos", "audios", "files"]) {
      const s = n.output[r];
      for (const i of Array.isArray(s) ? s : [s])
        typeof i == "string" && i.trim() && t.add(i.trim());
    }
  return t;
}
function nn(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/lib/runtime-stream-output", "@/components/agent/stream-request-params"]);
const oe = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!oe || Object.keys(oe).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const j = oe.requestRaw, se = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!se || Object.keys(se).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const C = se.isPlainRecord, U = window.DeverFront?.sdk?.getCompatModule("@/components/agent/stream-request-params");
if (!U || Object.keys(U).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/stream-request-params");
const rn = U.isPromptParam, Ze = U.normalizePowerParamConfig, on = Te(), sn = Te();
async function xr(e, t) {
  const n = await K(
    j(e, "get", { agent_key: t }),
    "读取智能体输入参数失败"
  );
  return Ze(n.params).params.filter(
    (r) => !rn(r)
  );
}
async function br(e, t) {
  const n = `${e}:${t}`;
  return on(n, async () => {
    const r = await K(
      j(e, "get", { agent_key: t }),
      "读取智能体执行配置失败"
    );
    return an(r);
  });
}
function an(e) {
  const t = mn(e.model_sources), n = Number(e.model_source_rule || 1), r = fn(e.tools);
  return {
    modelSourceRule: n,
    modelSources: t,
    selectedModelTargetID: tt(n) && (N(e.selected_model_target_id) || t[0]?.id) || 0,
    toolsEnabled: r.length > 0,
    tools: r,
    categories: gn(e.power_cates),
    readiness: pn(e.readiness)
  };
}
async function vr(e, t) {
  const n = `${e}:${t.agentKey}:${t.powerID}:${t.sourceTargetID}`;
  return sn(n, async () => {
    const r = await K(
      j(e, "get", {
        agent_key: t.agentKey,
        power_id: t.powerID,
        source_target_id: t.sourceTargetID || void 0
      }),
      "读取工具参数失败"
    );
    return Ze(r);
  });
}
async function yr(e, t) {
  const n = await K(
    j(e, "get", { document_id: t }),
    "读取图文内容失败"
  ), r = Oe(n);
  if (!r)
    throw new Error("图文内容无效");
  return r;
}
async function ln(e, t) {
  const n = await R(
    t.create ? e.newSession : e.session,
    {
      session_id: t.sessionID || void 0,
      agent_key: t.agentKey,
      context_key: t.contextKey,
      title: t.title || "新会话",
      limit: t.limit || 10,
      last_message_id: t.lastMessageID || void 0
    }
  );
  return {
    session: G(n.session),
    messages: un(n.messages)
  };
}
async function cn(e, t) {
  const n = await R(e.sessions, {
    agent_key: t.agentKey,
    context_key: t.contextKey,
    limit: t.limit || 20,
    last_session_id: t.lastSessionID || void 0,
    status: "active"
  }), s = (Array.isArray(n.sessions) ? n.sessions : []).map(G).filter((l) => !!l), i = t.limit || 20, a = n.has_more == null ? s.length >= i : !!n.has_more;
  return { sessions: s, hasMore: a };
}
async function _r(e, t) {
  const n = await R(e.session, {
    session_id: t.sessionID,
    agent_key: t.agentKey,
    context_key: t.contextKey,
    session_only: !0
  });
  return G(n.session);
}
async function Cr(e, t, n) {
  const r = await R(e.renameSession, {
    session_id: t,
    title: n
  }), s = G(r.session);
  if (!s)
    throw new Error("更新会话标题失败");
  return s;
}
async function kr(e, t) {
  await R(e.archiveSession, { session_id: t });
}
async function Nr(e, t, n) {
  const r = await R(e, {
    session_id: t.sessionID,
    agent_key: t.agentKey,
    ref_type: n.refType,
    ref_id: n.refId,
    label: n.label
  }), s = x(r.ref_type), i = Number(r.ref_id || 0);
  if (!_e(s) || !i)
    throw new Error("引用内容无效");
  const a = r.text == null ? "" : String(r.text), l = ze(r.output), m = Yt(
    a,
    ot(l)
  );
  return {
    refType: s,
    refId: i,
    title: x(r.title) || n.label,
    text: a,
    media: wn(r.media),
    content: m.length > 0 ? m : void 0
  };
}
async function R(e, t) {
  return K(j(e, "post", t), "会话请求失败");
}
async function K(e, t) {
  const n = await e;
  if (!C(n))
    throw new Error(t);
  const r = Number(n.code || 0), s = Number(n.status || 0);
  if (r !== 0 || s === 2)
    throw new Error(x(n.message || n.msg) || t);
  return C(n.data) ? n.data : {};
}
function G(e) {
  if (!C(e))
    return null;
  const t = Number(e.id || 0);
  return !Number.isFinite(t) || t <= 0 ? null : {
    id: t,
    title: x(e.title) || "新会话",
    titleSource: x(e.title_source),
    running: !!e.running
  };
}
function un(e) {
  return (Array.isArray(e) ? e : []).map((n) => {
    if (!C(n))
      return null;
    const r = x(n.role) === "user" ? "user" : "assistant";
    return {
      id: Number(n.id || 0),
      role: r,
      kind: x(n.kind) || "chat",
      text: x(n.text),
      content: dn(n.content),
      output: ze(n.output),
      requestID: x(n.request_id),
      status: Number(n.status || 1),
      createdAt: x(n.created_at),
      document: Oe(n.document)
    };
  }).filter((n) => !!n);
}
function dn(e) {
  if (!C(e) || Number(e.version) !== 1)
    return;
  const n = (Array.isArray(e.parts) ? e.parts : []).map((s) => {
    if (!C(s))
      return null;
    if (s.type === "text")
      return { type: "text", text: String(s.text || "") };
    const i = Number(s.ref_id || 0), a = x(s.ref_type);
    return s.type !== "reference" || !i || !_e(a) ? null : {
      type: "reference",
      ref_type: a,
      ref_id: i,
      label: x(s.label) || `${a} ${i}`,
      usage: x(s.usage) || void 0
    };
  }).filter((s) => !!s), r = hn(
    e.interaction_response
  );
  return {
    version: 1,
    parts: n,
    params: C(e.params) ? e.params : void 0,
    execution: C(e.execution) ? e.execution : void 0,
    interaction_response: r
  };
}
function mn(e) {
  return (Array.isArray(e) ? e : []).map((t) => {
    if (!C(t)) return null;
    const n = N(t.target_id || t.id);
    return n ? {
      id: n,
      name: nt(
        t.service_name,
        t.name,
        `来源 ${n}`
      )
    } : null;
  }).filter((t) => !!t);
}
function fn(e) {
  return (Array.isArray(e) ? e : []).map((t) => {
    if (!C(t)) return null;
    const n = N(t.power_id || t.id);
    return n ? {
      id: n,
      powerID: n,
      cateID: N(t.cate_id),
      name: x(t.name) || "未命名工具",
      key: x(t.key),
      icon: x(t.icon),
      kind: x(t.kind),
      outputType: x(t.output_type)
    } : null;
  }).filter((t) => !!t);
}
function gn(e) {
  return (Array.isArray(e) ? e : []).map(et).filter((t) => t.id > 0);
}
function pn(e) {
  const t = C(e) ? e : {}, n = (Array.isArray(t.warnings) ? t.warnings : []).map(x).filter((r, s, i) => r && i.indexOf(r) === s);
  return {
    powerCount: N(t.power_count),
    skillCount: N(t.skill_count),
    knowledgeBaseCount: N(t.knowledge_base_count),
    warnings: n
  };
}
function hn(e) {
  if (!C(e))
    return;
  const t = x(e.interaction_id);
  if (t)
    return {
      interaction_id: t,
      data: C(e.data) ? e.data : {}
    };
}
function wn(e) {
  return (Array.isArray(e) ? e : []).map((n) => {
    if (!C(n))
      return null;
    const r = x(n.url);
    if (!r)
      return null;
    const s = x(n.ref_type);
    return {
      refType: _e(s) ? s : void 0,
      refId: N(n.ref_id) || void 0,
      artifactId: N(n.artifact_id) || void 0,
      fileId: N(n.file_id) || void 0,
      seriesId: N(n.series_id) || void 0,
      kind: xn(n.kind),
      name: x(n.name) || void 0,
      label: x(n.label || n.name) || "素材",
      url: r
    };
  }).filter((n) => !!n);
}
function xn(e) {
  const t = x(e).toLowerCase();
  return ["image", "video", "audio"].includes(t) ? t : "file";
}
function _e(e) {
  return [
    "message",
    "artifact",
    "upload_file",
    "session",
    "asset",
    "material"
  ].includes(e);
}
function N(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t > 0 ? Math.floor(t) : 0;
}
function x(e) {
  return e == null ? "" : String(e).trim();
}
function bn(e) {
  return !!(e?.interaction_response || e?.parts.some((t) => t.type === "reference"));
}
function Ar(e) {
  return !!(e.text.trim() || bn(e.content));
}
function vn(e) {
  return {
    text: e,
    content: {
      version: 1,
      parts: [{ type: "text", text: e }]
    }
  };
}
function Dr(e, t, n) {
  const r = vn(t);
  return r.content.interaction_response = {
    interaction_id: e,
    data: n
  }, r;
}
async function Ir(e, t) {
  if (t.scope === "history" && !t.parent) {
    const s = await cn(e.api, {
      agentKey: e.agentKey,
      contextKey: e.contextKey,
      limit: 20,
      lastSessionID: De(t.cursor)
    }), i = s.sessions.filter(
      (a) => a.id !== e.sessionID
    );
    return {
      items: Ae(
        i.map((a) => ({
          key: `session:${a.id}`,
          refType: "session",
          refId: a.id,
          label: a.title,
          description: "查看此会话的消息和素材",
          selectable: !1,
          hasChildren: !0
        })),
        t.query
      ),
      nextCursor: s.sessions.length > 0 ? String(s.sessions[s.sessions.length - 1]?.id || "") : void 0
    };
  }
  const n = t.scope === "history" ? t.parent?.refId || 0 : e.sessionID;
  if (!n)
    return { items: [] };
  const r = await ln(e.api, {
    agentKey: e.agentKey,
    contextKey: e.contextKey,
    sessionID: n,
    limit: 20,
    lastMessageID: De(t.cursor)
  });
  return {
    items: Ae(
      yn([...r.messages].reverse()),
      t.query
    ),
    nextCursor: r.messages.length > 0 ? String(r.messages[0]?.id || "") : void 0
  };
}
function yn(e) {
  return e.map(
    (t) => ({
      key: `message:${t.id}`,
      refType: "message",
      refId: t.id,
      label: Cn(t),
      description: t.role === "user" ? "用户消息" : "智能体回复",
      messageRole: t.role,
      preview: {
        text: t.text,
        kind: "message"
      },
      materials: _n(t)
    })
  );
}
function _n(e) {
  const t = {
    image: 0,
    video: 0,
    audio: 0,
    file: 0
  };
  return P(e.output).filter(
    (n) => n.status === "ready" && !!(n.url || n.previewUrl)
  ).map((n) => {
    t[n.kind] = (t[n.kind] || 0) + 1;
    const r = n.displayNo || t[n.kind] || 1;
    return {
      key: `artifact:${n.id}`,
      refType: "artifact",
      refId: n.id,
      label: `${kn(n.kind)}${r}`,
      preview: {
        text: n.name || n.label,
        kind: n.kind,
        url: n.previewUrl || n.url,
        sourceUrl: n.url
      }
    };
  });
}
function Cn(e) {
  const t = e.text.replace(/\s+/g, " ").trim();
  return t ? Array.from(t).slice(0, 48).join("") : e.role === "user" ? "用户消息" : "生成结果";
}
function Ae(e, t) {
  const n = J(t);
  return n ? e.filter((r) => J(
    `${r.label} ${r.description || ""}`
  ).includes(n) || (r.materials || []).some(
    (i) => J(
      `${i.label} ${i.preview?.text || ""} ${i.preview?.kind || ""}`
    ).includes(n)
  )) : e;
}
function J(e) {
  return e.trim().toLowerCase().replace(/(图|视频|音频|文件)\s+(\d+)/g, "$1$2");
}
function kn(e) {
  return e === "image" ? "图" : e === "video" ? "视频" : e === "audio" ? "音频" : "文件";
}
function De(e) {
  const t = Number(e || 0);
  return Number.isFinite(t) && t > 0 ? Math.floor(t) : 0;
}
await window.DeverFront?.ensureCompat?.(["@/components/energon/content-view", "@/lib/utils"]);
const ie = window.DeverFront?.sdk?.getCompatModule("@/components/energon/content-view");
if (!ie || Object.keys(ie).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/energon/content-view");
const Nn = ie.EnergonContentView, ae = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!ae || Object.keys(ae).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const Xe = ae.cn, An = Dt(function({
  text: t,
  streaming: n = !1,
  error: r = !1,
  className: s
}) {
  return t ? /* @__PURE__ */ o(
    Nn,
    {
      output: { text: Dn(t) },
      streaming: n,
      markdownClassName: Mn,
      className: Xe(
        "agent-chat-markdown",
        r && "[&_*]:text-destructive",
        s
      )
    }
  ) : null;
});
function Dn(e) {
  return String(e || "").replace(/\r\n/g, `
`).replace(
    /([。！？!?：:；;])([ \t\u00a0\u3000]*)(#{1,6})(?!#)([ \t\u00a0\u3000]+)(?=\S)/g,
    `$1

$3 `
  ).replace(
    /(^|\n)([ \t\u00a0\u3000]{0,3})(#{1,6})(?!#)([ \t\u00a0\u3000]*)(?=\S)/g,
    In
  );
}
function In(e, t, n, r, s) {
  return r.length === 1 && s.length === 0 ? e : `${t}${n}${r} `;
}
const Mn = Xe(
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
await window.DeverFront?.ensureCompat?.(["@/lib/utils", "@/lib/runtime-stream-output", "@/lib/stream"]);
const le = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!le || Object.keys(le).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const $ = le.cn, ce = window.DeverFront?.sdk?.getCompatModule("@/lib/runtime-stream-output");
if (!ce || Object.keys(ce).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/runtime-stream-output");
const ue = ce.isPlainRecord, de = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!de || Object.keys(de).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const E = de.streamValueText, Sn = /* @__PURE__ */ new Set(["image", "video", "audio", "file"]), $n = /* @__PURE__ */ new Set(["knowledge", "skill"]), Tn = {
  running: z,
  succeeded: Fe,
  failed: V
};
function zn({
  activity: e
}) {
  if (!e)
    return null;
  const t = ue(e.output.task) ? e.output.task : null;
  if (t)
    return /* @__PURE__ */ o(En, { task: t });
  const n = ue(e.output.operation) ? e.output.operation : null;
  if (n)
    return /* @__PURE__ */ o(On, { operation: n });
  const r = P(e.output), s = xe(e.output);
  if (Object.keys(s).length > 0 || Zt(e.output)) {
    const a = e.aspectRatio || (e.kind === "video" ? "16 / 9" : "4 / 3");
    return /* @__PURE__ */ o(
      "div",
      {
        className: "agent-chat-media-result",
        "data-kind": e.kind,
        style: {
          "--agent-chat-media-aspect-ratio": a
        },
        children: /* @__PURE__ */ o(
          Vt,
          {
            output: e.output,
            className: "agent-chat-activity-output"
          }
        )
      }
    );
  }
  return /* @__PURE__ */ o(Pn, { activity: e, artifactCount: r.length });
}
function On({
  operation: e
}) {
  const t = E(e.title) || Rn(E(e.kind)), n = E(e.goal), r = ue(e.summary) ? e.summary : null, s = r ? [
    ["新增节点", r.added_nodes],
    ["更新节点", r.updated_nodes],
    ["删除节点", r.removed_nodes],
    ["新增连线", r.added_edges],
    ["更新连线", r.updated_edges],
    ["删除连线", r.removed_edges]
  ].filter(([, i]) => Number(i || 0) > 0) : [];
  return /* @__PURE__ */ o("div", { className: "mt-4 max-w-2xl rounded-lg border bg-muted/15 px-4 py-3.5", children: /* @__PURE__ */ d("div", { className: "flex min-w-0 items-start gap-3", children: [
    /* @__PURE__ */ o("span", { className: "flex size-8 shrink-0 items-center justify-center rounded-md bg-foreground/5 text-foreground", children: /* @__PURE__ */ o(wt, { className: "size-4" }) }),
    /* @__PURE__ */ d("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ o("div", { className: "text-sm font-medium text-foreground", children: t }),
      n ? /* @__PURE__ */ o("p", { className: "mt-1 break-words text-xs leading-5 text-muted-foreground", children: n }) : null,
      s.length > 0 ? /* @__PURE__ */ o("div", { className: "mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground", children: s.map(([i, a]) => /* @__PURE__ */ d("span", { children: [
        String(i),
        " ",
        Number(a)
      ] }, String(i))) }) : null
    ] }),
    /* @__PURE__ */ o("span", { className: "shrink-0 text-xs text-muted-foreground", children: "操作预览" })
  ] }) });
}
function En({ task: e }) {
  const t = E(e.status).toLowerCase() || "running", n = t === "running" || t === "pending", r = t === "fail" || t === "failed" || t === "error", i = n ? z : r ? V : t === "canceled" || t === "cancelled" ? ht : Fe, a = Number(e.run_id || 0), l = E(e.request_id);
  return /* @__PURE__ */ o(
    "div",
    {
      className: $(
        "mt-4 max-w-2xl rounded-lg border bg-muted/15 px-4 py-3.5",
        r && "border-destructive/30 bg-destructive/5"
      ),
      children: /* @__PURE__ */ d("div", { className: "flex min-w-0 items-start gap-3", children: [
        /* @__PURE__ */ o("span", { className: "flex size-8 shrink-0 items-center justify-center rounded-md bg-foreground/5 text-foreground", children: /* @__PURE__ */ o(pt, { className: "size-4" }) }),
        /* @__PURE__ */ d("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ o("div", { className: "truncate text-sm font-medium text-foreground", children: E(e.title) || "项目任务" }),
          a || l ? /* @__PURE__ */ o("div", { className: "mt-1 truncate text-xs text-muted-foreground", children: a ? `运行 #${a}` : l }) : null
        ] }),
        /* @__PURE__ */ d(
          "span",
          {
            className: $(
              "inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground",
              r && "text-destructive"
            ),
            children: [
              /* @__PURE__ */ o(i, { className: $("size-3.5", n && "animate-spin") }),
              Fn(t)
            ]
          }
        )
      ] })
    }
  );
}
function Rn(e) {
  switch (e) {
    case "canvas_patch":
      return "修改画布";
    case "canvas_run":
      return "运行画布";
    case "team_flow":
      return "启动团队流程";
    case "run_stop":
      return "停止项目任务";
    default:
      return "确认操作";
  }
}
function Fn(e) {
  return e === "success" || e === "succeeded" ? "已完成" : e === "fail" || e === "failed" || e === "error" ? "失败" : e === "canceled" || e === "cancelled" ? "已取消" : e === "waiting" ? "等待中" : "运行中";
}
function Pn({
  activity: e,
  artifactCount: t
}) {
  const n = Bn(e.kind), r = Sn.has(e.kind), s = e.status === "failed";
  if ($n.has(e.kind))
    return /* @__PURE__ */ o("div", { className: "mt-2 max-w-2xl py-1 text-muted-foreground", children: /* @__PURE__ */ o(Ie, { activity: e }) });
  if (s || !r)
    return /* @__PURE__ */ o(
      "div",
      {
        className: $(
          "mt-4 max-w-2xl rounded-lg border bg-muted/20 px-3.5 py-3",
          s && "border-destructive/30 bg-destructive/5"
        ),
        children: /* @__PURE__ */ o(Ie, { activity: e })
      }
    );
  const i = Math.min(8, Math.max(1, t || e.count)), a = e.kind === "image" || e.kind === "video", l = e.aspectRatio || (e.kind === "video" ? "16 / 9" : "4 / 3");
  return /* @__PURE__ */ o(
    "div",
    {
      role: "status",
      "aria-label": e.text || e.title,
      className: "agent-chat-media-grid mt-4",
      "data-count": i,
      children: Array.from({ length: i }, (m, h) => /* @__PURE__ */ d(
        "div",
        {
          className: $(
            "agent-chat-media-placeholder relative flex overflow-hidden rounded-lg border bg-muted/30",
            e.kind === "audio" || e.kind === "file" ? "h-24 items-center justify-start px-5" : "items-center justify-center"
          ),
          style: a ? { aspectRatio: l } : void 0,
          children: [
            /* @__PURE__ */ o(n, { className: "agent-chat-media-placeholder-icon relative size-7 text-muted-foreground/35" }),
            /* @__PURE__ */ o(z, { className: "agent-chat-media-spinner absolute right-3 top-3 z-[2] size-4 text-muted-foreground/55" }),
            e.progress != null ? /* @__PURE__ */ o(
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
function Ie({ activity: e }) {
  const t = Tn[e.status], n = e.status === "failed", r = e.error || e.text || e.title;
  return /* @__PURE__ */ d(
    "div",
    {
      className: $(
        "flex min-w-0 items-center gap-2 text-sm text-muted-foreground",
        n && "text-destructive"
      ),
      children: [
        /* @__PURE__ */ o(
          t,
          {
            className: $(
              "size-4 shrink-0",
              e.status === "running" && "animate-spin"
            )
          }
        ),
        /* @__PURE__ */ o("span", { className: "min-w-0 flex-1 truncate", children: r }),
        e.progress != null && e.status === "running" ? /* @__PURE__ */ d("span", { className: "shrink-0 tabular-nums", children: [
          e.progress,
          "%"
        ] }) : null
      ]
    }
  );
}
function Bn(e) {
  switch (e) {
    case "image":
      return ye;
    case "video":
      return ve;
    case "audio":
      return vt;
    case "file":
      return B;
    case "knowledge":
      return bt;
    default:
      return xt;
  }
}
const Je = "[data-agent-document-heading='true']";
function jn(e, t) {
  return t && Array.from(
    e.querySelectorAll(
      Je
    )
  ).find((n) => n.id === t) || null;
}
await window.DeverFront?.ensureCompat?.(["@/lib/utils"]);
const me = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!me || Object.keys(me).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const Me = me.cn;
function Kn({
  documentID: e,
  enabled: t,
  contentRef: n,
  scrollRef: r
}) {
  const [s, i] = I([]), [a, l] = I(""), m = s.map((f) => f.id).join(`
`);
  M(() => {
    if (!t)
      return;
    const f = n.current;
    if (!f)
      return;
    let w = 0;
    const c = () => {
      window.cancelAnimationFrame(w), w = window.requestAnimationFrame(() => {
        const y = Ln(f, e);
        i(
          (v) => qn(v, y) ? v : y
        ), l(
          (v) => y.some((g) => g.id === v) ? v : y[0]?.id || ""
        );
      });
    };
    c();
    const b = new MutationObserver(c);
    return b.observe(f, {
      childList: !0,
      characterData: !0,
      subtree: !0
    }), () => {
      b.disconnect(), window.cancelAnimationFrame(w);
    };
  }, [n, e, t]), M(() => {
    if (!t || !m)
      return;
    const f = r.current, w = n.current;
    if (!f || !w)
      return;
    const c = /* @__PURE__ */ new Map(), b = new IntersectionObserver(
      (v) => {
        for (const u of v)
          u.isIntersecting ? c.set(u.target.id, u.boundingClientRect.top) : c.delete(u.target.id);
        const g = Array.from(c.entries()).sort(
          (u, _) => u[1] - _[1]
        )[0];
        g && l(g[0]);
      },
      {
        root: f,
        rootMargin: "-24px 0px -68% 0px",
        threshold: [0, 1]
      }
    ), y = new Set(m.split(`
`));
    for (const v of w.querySelectorAll(
      Je
    ))
      y.has(v.id) && b.observe(v);
    return () => b.disconnect();
  }, [n, t, m, r]);
  const h = D(
    (f) => {
      const w = r.current, c = n.current, b = c ? jn(c, f) : null;
      if (!w || !b)
        return;
      const y = w.getBoundingClientRect().top, v = b.getBoundingClientRect().top, g = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      w.scrollTo({
        top: w.scrollTop + v - y - 24,
        behavior: g ? "auto" : "smooth"
      }), l(f);
    },
    [n, r]
  );
  return { items: s, activeID: a, selectItem: h };
}
function Se({
  items: e,
  activeID: t,
  className: n,
  onSelect: r
}) {
  if (e.length === 0)
    return null;
  const s = Math.min(...e.map((i) => i.level));
  return /* @__PURE__ */ o("nav", { "aria-label": "文档目录", className: Me("py-1", n), children: e.map((i) => {
    const a = i.id === t;
    return /* @__PURE__ */ o(
      "button",
      {
        type: "button",
        className: Me(
          "block w-full border-l-2 py-1.5 pr-3 text-left text-sm leading-5 transition-colors",
          a ? "border-foreground font-medium text-foreground" : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
        ),
        style: {
          paddingLeft: 12 + Math.min(i.level - s, 2) * 12
        },
        title: i.title,
        "aria-current": a ? "location" : void 0,
        onClick: () => r(i.id),
        children: /* @__PURE__ */ o("span", { className: "line-clamp-2", children: i.title })
      },
      i.id
    );
  }) });
}
function Ln(e, t) {
  const n = /* @__PURE__ */ new Map();
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
    const l = n.get(a) || 0;
    n.set(a, l + 1);
    const m = `agent-document-${t}-block-${a}-heading-${l}`;
    return r.id = m, r.dataset.agentDocumentHeading = "true", [
      {
        id: m,
        level: Number(r.tagName.slice(1)) || 2,
        title: s
      }
    ];
  });
}
function qn(e, t) {
  return e.length === t.length && e.every(
    (n, r) => n.id === t[r]?.id && n.level === t[r]?.level && n.title === t[r]?.title
  );
}
const Hn = 64;
function Un({
  documentID: e,
  contentVersion: t,
  enabled: n,
  pending: r
}) {
  const s = A(null), i = A(null), a = A(null), l = A(""), m = A(!1), h = A(0), [f, w] = I(!0), c = D(() => {
    const g = i.current;
    if (!g)
      return !0;
    const u = g.scrollHeight - g.scrollTop - g.clientHeight <= Hn;
    return w(
      (_) => _ === u ? _ : u
    ), u;
  }, []), b = D((g = "auto") => {
    const u = i.current;
    u && (m.current = !0, u.scrollTo({ top: u.scrollHeight, behavior: g }), h.current = u.scrollTop, w(!0));
  }, []), y = D(() => {
    a.current != null && window.cancelAnimationFrame(a.current), a.current = window.requestAnimationFrame(() => {
      if (a.current = null, m.current) {
        b();
        return;
      }
      c();
    });
  }, [b, c]);
  M(() => {
    const g = n ? String(e) : "";
    if (!g) {
      l.current = "", m.current = !1;
      return;
    }
    if (l.current === g) {
      r && c() && (m.current = !0);
      return;
    }
    l.current = g, m.current = r;
    const u = i.current;
    u && !r && (u.scrollTop = 0), h.current = u?.scrollTop || 0, y();
  }, [e, n, r, y, c]), It(() => {
    n && y();
  }, [t, n, y]), M(() => {
    if (!n)
      return;
    const g = s.current;
    if (!g)
      return;
    const u = new ResizeObserver(y);
    return u.observe(g), y(), () => u.disconnect();
  }, [e, n, y]), M(
    () => () => {
      a.current != null && window.cancelAnimationFrame(a.current);
    },
    []
  );
  const v = D(() => {
    const g = i.current;
    if (!g)
      return;
    const u = g.scrollTop < h.current - 1, _ = c();
    u ? m.current = !1 : _ && (m.current = !0), h.current = g.scrollTop;
  }, [c]);
  return {
    atBottom: f,
    contentRef: s,
    handleScroll: v,
    scrollRef: i,
    scrollToBottom: b
  };
}
function Vn({
  document: e,
  running: t,
  error: n
}) {
  const r = t && e.status === "writing" && e.blocks.length > 0;
  return /* @__PURE__ */ d("div", { className: "agent-chat-document min-w-0", children: [
    e.title ? /* @__PURE__ */ o("h1", { className: "mb-5 text-xl font-semibold leading-tight", children: e.title }) : null,
    e.blocks.map(
      (s) => s.type === "media" ? /* @__PURE__ */ o(Wn, { block: s }, s.id) : /* @__PURE__ */ o(
        Gn,
        {
          block: s,
          title: e.title,
          error: n
        },
        s.id
      )
    ),
    e.blocks.length === 0 && t ? /* @__PURE__ */ o(Xn, {}) : null,
    e.blocks.length === 0 && e.status === "failed" ? /* @__PURE__ */ o(Jn, { message: Qn(e) }) : null,
    r ? /* @__PURE__ */ o($e, {}) : null,
    !t && be(e) ? /* @__PURE__ */ o($e, {}) : null
  ] });
}
function Gn({
  block: e,
  title: t,
  error: n
}) {
  const r = st(e.text, t);
  return r ? /* @__PURE__ */ o("div", { "data-agent-document-block-id": e.id, children: /* @__PURE__ */ o(
    An,
    {
      text: r,
      error: n,
      className: "agent-chat-document-text"
    }
  ) }) : null;
}
function Wn({ block: e }) {
  return e.status === "failed" ? /* @__PURE__ */ d("div", { className: "my-4 flex items-center gap-2 text-sm text-destructive", children: [
    /* @__PURE__ */ o(V, { className: "size-4 shrink-0" }),
    /* @__PURE__ */ d("span", { children: [
      fe(e.mediaKind),
      "生成失败"
    ] })
  ] }) : /* @__PURE__ */ o(zn, { activity: Zn(e) });
}
function Zn(e) {
  const t = Number(e.meta.progress), n = it(e);
  return {
    id: `document-block-${e.id}`,
    title: `${fe(e.mediaKind)}生成`,
    kind: e.mediaKind,
    status: n ? "succeeded" : "running",
    text: typeof e.meta.progress_text == "string" ? e.meta.progress_text : `${fe(e.mediaKind)}生成中`,
    error: "",
    progress: Number.isFinite(t) ? Math.max(0, Math.min(100, Math.round(t))) : null,
    count: Math.max(1, e.artifacts.length),
    aspectRatio: at(
      e.meta,
      e.artifacts.map((r) => r.meta)
    ) || (e.mediaKind === "video" ? "16 / 9" : "4 / 3"),
    anchorText: "",
    output: { artifacts: e.artifacts }
  };
}
function fe(e) {
  return e === "image" ? "图片" : e === "video" ? "视频" : e === "audio" ? "音频" : "文件";
}
function Xn() {
  return /* @__PURE__ */ o(
    "div",
    {
      role: "status",
      "aria-label": "正在组织图文内容",
      className: "agent-chat-waiting-indicator",
      children: [0, 1, 2].map((e) => /* @__PURE__ */ o(
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
function Jn({ message: e }) {
  return /* @__PURE__ */ d("div", { className: "flex items-center gap-2 text-sm text-destructive", children: [
    /* @__PURE__ */ o(V, { className: "size-4 shrink-0" }),
    /* @__PURE__ */ o("span", { children: e })
  ] });
}
function Qn(e) {
  const t = e.meta.error;
  return typeof t == "string" && t.trim() ? t.trim() : "文档生成失败，请重新生成。";
}
function $e() {
  return /* @__PURE__ */ o(
    "div",
    {
      role: "status",
      "aria-label": "正在继续生成图文内容",
      className: "agent-chat-next-step-indicator",
      children: /* @__PURE__ */ o("span", { className: "agent-chat-pulse-dot" })
    }
  );
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/button", "@/components/ui/sheet", "@/lib/utils"]);
const ge = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!ge || Object.keys(ge).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const q = ge.Button, T = window.DeverFront?.sdk?.getCompatModule("@/components/ui/sheet");
if (!T || Object.keys(T).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/sheet");
const Yn = T.Sheet, er = T.SheetContent, tr = T.SheetDescription, nr = T.SheetHeader, rr = T.SheetTitle, pe = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!pe || Object.keys(pe).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const Q = pe.cn;
function Mr({
  document: e,
  onOpen: t
}) {
  const n = be(e);
  return /* @__PURE__ */ d(
    "button",
    {
      type: "button",
      className: "mt-3 flex items-center gap-3 rounded-md border bg-background px-3 py-2.5 text-left transition-colors hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      style: { width: "min(100%, 28rem)" },
      "aria-label": `打开文档：${e.title || "生成的文档"}`,
      onClick: () => t(e),
      children: [
        /* @__PURE__ */ o("span", { className: "flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/70 text-muted-foreground", children: /* @__PURE__ */ o(B, { className: "size-4" }) }),
        /* @__PURE__ */ d("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ o("span", { className: "block truncate text-sm font-medium text-foreground", children: e.title || "生成的文档" }),
          /* @__PURE__ */ o("span", { className: "mt-0.5 block text-xs text-muted-foreground", children: n ? "正在生成" : Qe(e.status) })
        ] }),
        n ? /* @__PURE__ */ o(z, { className: "size-4 shrink-0 animate-spin text-muted-foreground" }) : /* @__PURE__ */ o(Nt, { className: "size-4 shrink-0 text-muted-foreground" })
      ]
    }
  );
}
function Sr({
  open: e,
  portalContainer: t,
  document: n,
  messageID: r,
  renderArtifactActions: s,
  renderDocumentActions: i,
  onClose: a
}) {
  const [l, m] = I(!1), [h, f] = I(!1), w = A(!1), c = A(null), b = A(null), y = A(null), v = n.status === "failed", g = be(n), u = Un({
    documentID: n.id,
    contentVersion: or(n),
    enabled: e,
    pending: g
  }), _ = Kn({
    documentID: n.id,
    enabled: e,
    contentRef: u.contentRef,
    scrollRef: u.scrollRef
  }), S = _.items.length >= 2;
  M(() => {
    f(!1);
  }, [n.id, e]), M(() => {
    if (!h)
      return;
    const p = (W) => {
      const Z = W.target;
      !(Z instanceof Node) || b.current?.contains(Z) || y.current?.contains(Z) || f(!1);
    }, k = (W) => {
      W.key === "Escape" && f(!1);
    };
    return window.document.addEventListener(
      "pointerdown",
      p,
      !0
    ), window.document.addEventListener("keydown", k), () => {
      window.document.removeEventListener(
        "pointerdown",
        p,
        !0
      ), window.document.removeEventListener("keydown", k);
    };
  }, [h]), M(
    () => () => {
      c.current != null && window.clearTimeout(c.current);
    },
    []
  );
  const L = async () => {
    const p = lt(n);
    if (p.trim()) {
      w.current = !0;
      try {
        await St(p);
      } catch {
        return;
      } finally {
        w.current = !1;
      }
      m(!0), c.current != null && window.clearTimeout(c.current), c.current = window.setTimeout(() => {
        m(!1), c.current = null;
      }, 1800);
    }
  };
  return /* @__PURE__ */ o(
    Yn,
    {
      open: e,
      modal: !1,
      onOpenChange: (p) => {
        p || a();
      },
      children: /* @__PURE__ */ d(
        er,
        {
          container: t,
          side: "right",
          showCloseButton: !1,
          showOverlay: !1,
          "data-assistant-layer": "true",
          layerZIndex: Mt,
          onOpenAutoFocus: (p) => {
            p.preventDefault(), u.scrollRef.current?.focus({ preventScroll: !0 });
          },
          onFocusOutside: (p) => {
            w.current && p.preventDefault();
          },
          onInteractOutside: (p) => {
            w.current && p.preventDefault();
          },
          className: "flex w-[94vw] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-none md:w-[72vw] xl:w-[64vw] 2xl:w-[1120px]",
          children: [
            /* @__PURE__ */ d(nr, { className: "flex h-14 shrink-0 flex-row items-center gap-3 border-b px-5 py-0 text-start", children: [
              /* @__PURE__ */ o(B, { className: "size-4 shrink-0 text-muted-foreground" }),
              /* @__PURE__ */ d("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ o(rr, { className: "truncate text-sm", children: n.title || "生成的文档" }),
                /* @__PURE__ */ d(
                  tr,
                  {
                    className: Q(
                      "mt-0.5 flex items-center gap-1.5 text-xs",
                      v ? "text-destructive" : "text-muted-foreground"
                    ),
                    children: [
                      g && !v ? /* @__PURE__ */ o(z, { className: "size-3 animate-spin" }) : null,
                      /* @__PURE__ */ o("span", { children: v ? "生成失败" : g ? n.status === "writing" ? "正文生成中" : "素材生成中" : Qe(n.status) })
                    ]
                  }
                )
              ] }),
              S ? /* @__PURE__ */ o(O, { label: "查看文档目录", children: /* @__PURE__ */ d(
                q,
                {
                  ref: b,
                  type: "button",
                  size: "sm",
                  variant: "ghost",
                  className: "h-8 shrink-0 gap-1.5 px-2 xl:hidden",
                  "aria-label": "查看文档目录",
                  "aria-haspopup": "dialog",
                  "aria-expanded": h,
                  onClick: () => f((p) => !p),
                  children: [
                    /* @__PURE__ */ o(yt, { className: "size-4" }),
                    /* @__PURE__ */ o("span", { className: "hidden sm:inline", children: "目录" })
                  ]
                }
              ) }) : null,
              i?.({
                messageID: r,
                document: n,
                running: g,
                error: v
              }),
              /* @__PURE__ */ o(O, { label: l ? "已复制" : "复制文档", children: /* @__PURE__ */ o(
                q,
                {
                  type: "button",
                  size: "icon",
                  variant: "ghost",
                  className: "size-8 shrink-0",
                  "aria-label": l ? "文档已复制" : "复制文档",
                  disabled: !n.blocks.length,
                  onClick: () => {
                    L();
                  },
                  children: l ? /* @__PURE__ */ o(_t, { className: "size-4" }) : /* @__PURE__ */ o(Ct, { className: "size-4" })
                }
              ) }),
              /* @__PURE__ */ o(O, { label: "关闭文档", children: /* @__PURE__ */ o(
                q,
                {
                  type: "button",
                  size: "icon",
                  variant: "ghost",
                  className: "size-8 shrink-0",
                  "aria-label": "关闭文档",
                  onClick: a,
                  children: /* @__PURE__ */ o(Re, { className: "size-4" })
                }
              ) })
            ] }),
            S && h ? /* @__PURE__ */ d(
              "div",
              {
                ref: y,
                role: "dialog",
                "aria-label": "文档目录",
                "data-assistant-layer": "true",
                className: "absolute right-4 top-14 z-50 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md xl:hidden",
                style: { width: "min(20rem, calc(100% - 2rem))" },
                children: [
                  /* @__PURE__ */ o("div", { className: "border-b px-4 py-3 text-sm font-medium", children: "目录" }),
                  /* @__PURE__ */ o("div", { className: "max-h-[60vh] overflow-y-auto px-2 py-2 overscroll-contain", children: /* @__PURE__ */ o(
                    Se,
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
            /* @__PURE__ */ d(
              "div",
              {
                className: Q(
                  "min-h-0 flex-1",
                  S && "xl:grid xl:grid-cols-[13rem_minmax(0,1fr)]"
                ),
                children: [
                  /* @__PURE__ */ o(
                    "aside",
                    {
                      className: Q(
                        "hidden min-h-0 flex-col border-r bg-muted/10",
                        S && "xl:flex"
                      ),
                      children: S ? /* @__PURE__ */ d(Ee, { children: [
                        /* @__PURE__ */ o("div", { className: "shrink-0 px-5 pb-2 pt-8 text-xs font-medium text-muted-foreground", children: "目录" }),
                        /* @__PURE__ */ o("div", { className: "min-h-0 flex-1 overflow-y-auto px-3 pb-6 overscroll-contain", children: /* @__PURE__ */ o(
                          Se,
                          {
                            items: _.items,
                            activeID: _.activeID,
                            onSelect: _.selectItem
                          }
                        ) })
                      ] }) : null
                    }
                  ),
                  /* @__PURE__ */ d("div", { className: "relative h-full min-h-0", children: [
                    /* @__PURE__ */ o(
                      "div",
                      {
                        ref: u.scrollRef,
                        tabIndex: -1,
                        className: "h-full min-h-0 overflow-y-auto overscroll-contain focus:outline-none",
                        style: { scrollbarGutter: "stable" },
                        onScroll: u.handleScroll,
                        children: /* @__PURE__ */ o(
                          "div",
                          {
                            ref: u.contentRef,
                            className: "mx-auto w-full max-w-3xl px-6 py-8 md:px-9 md:py-10",
                            children: /* @__PURE__ */ o(
                              zt,
                              {
                                messageID: r,
                                render: s,
                                children: /* @__PURE__ */ o(
                                  Vn,
                                  {
                                    document: n,
                                    running: g,
                                    error: v
                                  }
                                )
                              }
                            )
                          }
                        )
                      }
                    ),
                    u.atBottom ? null : /* @__PURE__ */ o(O, { label: "回到底部", children: /* @__PURE__ */ o(
                      q,
                      {
                        type: "button",
                        size: "icon",
                        variant: "outline",
                        className: "absolute bottom-4 right-4 z-10 size-9 rounded-full bg-background shadow-sm",
                        "aria-label": "回到底部",
                        onClick: () => u.scrollToBottom("smooth"),
                        children: /* @__PURE__ */ o(kt, { className: "size-4" })
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
function or(e) {
  const t = e.blocks.map((n) => {
    const r = n.artifacts.map(
      (s) => `${s.id}:${s.status}:${s.url}:${s.previewUrl}`
    ).join(",");
    return [
      n.id,
      n.status,
      n.text.length,
      n.text.slice(-64),
      String(n.meta.stream_revision || ""),
      r
    ].join(":");
  });
  return [e.status, e.pendingJobCount, ...t].join("|");
}
function Qe(e) {
  return e === "failed" ? "生成失败" : e === "partial_failed" ? "部分素材生成失败" : e === "ready" ? "已生成" : e === "generating" ? "素材生成中" : "正文生成中";
}
await window.DeverFront?.ensureCompat?.(["@/components/agent/interaction-panel", "@/lib/utils"]);
const he = window.DeverFront?.sdk?.getCompatModule("@/components/agent/interaction-panel");
if (!he || Object.keys(he).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/agent/interaction-panel");
const sr = he.AgentInteractionPanel, we = window.DeverFront?.sdk?.getCompatModule("@/lib/utils");
if (!we || Object.keys(we).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/utils");
const Ye = we.cn;
function $r({
  interaction: e,
  response: t,
  disabled: n,
  onSubmit: r
}) {
  return /* @__PURE__ */ d(
    "div",
    {
      "data-presentation": e.presentation || "form",
      className: Ye(
        "agent-chat-interaction mt-5",
        e.presentation === "stepper" ? "w-full" : "max-w-2xl"
      ),
      children: [
        t ? null : /* @__PURE__ */ d(
          "div",
          {
            role: "status",
            "aria-live": "polite",
            className: "mb-3 flex items-center gap-2 text-sm text-muted-foreground",
            children: [
              /* @__PURE__ */ o("span", { className: "agent-chat-pulse-dot" }),
              /* @__PURE__ */ o("span", { children: "等待补充信息" })
            ]
          }
        ),
        /* @__PURE__ */ o(
          sr,
          {
            interaction: e,
            disabled: n,
            readonly: !!t,
            initialData: t?.data,
            onSubmit: r
          }
        )
      ]
    }
  );
}
function Tr({
  suggestions: e,
  disabled: t,
  onSelect: n
}) {
  return e.length === 0 ? null : /* @__PURE__ */ o("div", { className: "agent-chat-suggestions mt-5 flex flex-wrap gap-2", children: e.map((r) => /* @__PURE__ */ o(O, { label: r.prompt, children: /* @__PURE__ */ d(
    "button",
    {
      type: "button",
      disabled: t,
      className: Ye(
        "group inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-lg border bg-background px-3 py-2 text-left text-sm leading-5 text-foreground shadow-sm transition-colors",
        "hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-50"
      ),
      onClick: () => n(r),
      children: [
        /* @__PURE__ */ o("span", { className: "truncate", children: r.label }),
        /* @__PURE__ */ o(At, { className: "size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" })
      ]
    }
  ) }, r.prompt)) });
}
export {
  zn as A,
  pr as B,
  Vt as a,
  We as b,
  Mr as c,
  Tr as d,
  Sr as e,
  wr as f,
  bn as g,
  Ar as h,
  _r as i,
  Ir as j,
  Nr as k,
  yr as l,
  ln as m,
  cn as n,
  kr as o,
  xr as p,
  zt as q,
  Cr as r,
  An as s,
  vn as t,
  $r as u,
  Dr as v,
  br as w,
  vr as x,
  gr as y,
  hr as z
};
