import { c as _e, j as n, a as s, F as oe } from "./createLucideIcon-Gw0gLVQ5.js";
import { C as ln, c as se, E as _t, g as dn, a as j, u as L, b as H, h as un } from "./runtime-entry-CkPHMDB1.js";
import { c as He } from "./react-dom-C2oimP4o.js";
import { L as be } from "./loader-circle-3ZsHTZm7.js";
import { S as pn } from "./sparkles-nyM36U54.js";
import { C as wt, A as it } from "./copy-Cai3ZDxm.js";
import { U as hn, B as ve } from "./user-round-RPwSJfiU.js";
import { C as ce } from "./check-_lGX5Mgn.js";
import { P as St } from "./pencil-WDd5tOSC.js";
import { P as ye } from "./plus-rAwvnIn1.js";
import { T as Ce } from "./trash-2-Cga0ORNu.js";
import { X as We } from "./x-CDJG94MJ.js";
import { m as fn } from "./confirm-dialog-BTqZnhxN.js";
import { b as Y, g as mn, S as Q, h as gn, i as bn, j as Nt, k as Ct, m as kt, o as It, p as Rt, q as vn, t as yn, v as _n, w as wn, x as Sn, M as J, y as $t, z as xt, C as Tt, D as Nn, E as Cn, F as kn, G as at, H as In, I as Rn, J as st, K as $n, L as Ye, N as xn, O as Tn, P as Dn, Q as Mn, R as ot, T as On, U as ct, V as zn } from "./upload-asset-api-JzPGB3fW.js";
import { L as Dt } from "./link-2-DDiWK3Mt.js";
import { C as Pn } from "./circle-alert-CvRrJNY4.js";
const En = [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
], lt = _e("arrow-up", En);
const Bn = [
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
  ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
  ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
], dt = _e("grip-vertical", Bn);
const Ln = [
  [
    "path",
    {
      d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
      key: "18887p"
    }
  ],
  ["path", { d: "M7 11h10", key: "1twpyw" }],
  ["path", { d: "M7 15h6", key: "d9of3u" }],
  ["path", { d: "M7 7h8", key: "af5zfr" }]
], Mt = _e("message-square-text", Ln);
const An = [
  ["path", { d: "M13 21h8", key: "1jsn5i" }],
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
], Fn = _e("pen-line", An);
const Un = [
  ["circle", { cx: "6", cy: "6", r: "3", key: "1lh9wr" }],
  ["path", { d: "M8.12 8.12 12 12", key: "1alkpv" }],
  ["path", { d: "M20 4 8.12 15.88", key: "xgtan2" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["path", { d: "M14.8 14.8 20 20", key: "ptml3r" }]
], Vn = _e("scissors", Un);
function Xe(e, t) {
  const i = String(e || ""), r = qn(t);
  if (!i || r.length === 0)
    return {
      version: 1,
      parts: i ? [{ type: "text", text: i }] : []
    };
  const a = [];
  let l = 0;
  for (; l < i.length; ) {
    const u = Hn(i, l, r);
    if (!u) {
      ke(a, i.slice(l));
      break;
    }
    u.index > l && ke(a, i.slice(l, u.index)), a.push({
      type: "reference",
      ref_type: u.target.refType,
      ref_id: u.target.refId,
      label: G(u.target.label),
      usage: u.target.usage,
      ref_trigger: u.target.trigger || "@",
      ref_version_id: u.target.versionId,
      ref_origin: u.target.origin,
      ref_origin_id: u.target.originID
    }), l = u.index + u.target.mention.length;
  }
  return { version: 1, parts: a };
}
function Ot(e, t) {
  return Xe(
    e,
    Wn(t)
  );
}
function ni(e, t) {
  const i = Pt(
    t,
    Ne
  ), r = Xe(e, i), a = new Set(
    zt(r).map(
      Ne
    )
  ), l = i.filter(
    (p) => !a.has(Ne(p))
  );
  if (!l.length)
    return r;
  const u = [];
  for (let p = 0; p < l.length; p += 1)
    Xn(
      u,
      l[p],
      p === l.length - 1 ? r.parts[0] : void 0
    );
  return { version: 1, parts: [...u, ...r.parts] };
}
function Yn(e) {
  return !!e?.parts.some((t) => t.type === "reference");
}
function jn(e, t, i) {
  if (!t || !e.includes("@") && !e.includes("#"))
    return t;
  const r = Xe(e, [
    ...zt(t),
    ...i
  ]);
  return Yn(r) ? r : t;
}
function zt(e) {
  return e ? e.parts.filter((t) => t.type === "reference").map(
    (t) => ({
      refType: t.ref_type,
      refId: t.ref_id,
      label: G(t.label),
      usage: t.usage,
      trigger: t.ref_trigger === "#" ? "#" : "@",
      versionId: t.ref_version_id,
      origin: t.ref_origin,
      originID: t.ref_origin_id
    })
  ) : [];
}
function Kn(e) {
  return e ? e.parts.map(
    (t) => t.type === "text" ? t.text : `${t.ref_trigger === "#" ? "#" : "@"}${G(t.label)}`
  ).join("") : "";
}
function ri(e, t, i) {
  const r = Pt(
    i.filter(
      (y) => y.origin === "edge" && !!y.originID
    ),
    (y) => String(y.originID || "")
  ), a = new Map(
    r.map((y) => [String(y.originID), y])
  ), l = t?.version === 1 ? t.parts : e ? [{ type: "text", text: e }] : [], u = [], p = /* @__PURE__ */ new Set();
  let v = !1;
  for (const y of l) {
    if (y.type === "reference" && y.ref_origin === "edge" && y.ref_origin_id) {
      const C = a.get(y.ref_origin_id);
      if (!C) {
        v = !0;
        continue;
      }
      je(u, C), p.add(y.ref_origin_id), v = !1;
      continue;
    }
    if (y.type === "text") {
      let C = y.text;
      if (v && /^\s/.test(C)) {
        const k = u[u.length - 1];
        (!k || k.type === "text" && /\s$/.test(k.text)) && (C = C.slice(1));
      }
      ke(u, C), v = !1;
      continue;
    }
    u.push({ ...y }), v = !1;
  }
  const h = r.filter(
    (y) => !p.has(String(y.originID))
  );
  if (h.length > 0) {
    const y = [];
    h.forEach((C, k) => {
      je(y, C), Bt(
        y,
        k === h.length - 1 ? u[0] : void 0
      );
    }), u.unshift(...y);
  }
  const g = { version: 1, parts: u };
  return {
    value: Kn(g),
    content: g
  };
}
function G(e) {
  return e.trim().replace(/^[@#]+/, "").trim();
}
function qn(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e) {
    if (i.refId <= 0)
      continue;
    const r = i.trigger || "@", a = G(i.label);
    if (!a)
      continue;
    const l = `${r}${a}`;
    t.has(l) || t.set(l, { ...i, mention: l });
  }
  return [...t.values()].sort(
    (i, r) => r.mention.length - i.mention.length
  );
}
function Hn(e, t, i) {
  let r;
  for (const a of i) {
    const l = e.indexOf(a.mention, t);
    l < 0 || (!r || l < r.index || l === r.index && a.mention.length > r.target.mention.length) && (r = { index: l, target: a });
  }
  return r;
}
function ke(e, t) {
  if (!t)
    return;
  const i = e[e.length - 1];
  if (i?.type === "text") {
    i.text += t;
    return;
  }
  e.push({ type: "text", text: t });
}
function Pt(e, t = Et) {
  const i = [], r = /* @__PURE__ */ new Set();
  for (const a of e) {
    if (a.refId <= 0 || !G(a.label))
      continue;
    const l = t(a);
    r.has(l) || (r.add(l), i.push(a));
  }
  return i;
}
function Wn(e) {
  const t = /* @__PURE__ */ new Map();
  for (const i of e) {
    const r = G(i.label);
    if (i.refId <= 0 || !r)
      continue;
    const a = `${i.trigger || "@"}${r}`, l = Ne(i), u = t.get(a);
    if (!u) {
      t.set(a, {
        target: i,
        targetKey: l,
        ambiguous: !1
      });
      continue;
    }
    u.targetKey !== l && (u.ambiguous = !0);
  }
  return [...t.values()].filter((i) => !i.ambiguous).map((i) => i.target);
}
function Ne(e) {
  return `${Et(e)}:${e.usage || ""}`;
}
function Et(e) {
  return e.originID ? `${e.refType}:${e.refId}:${e.origin || ""}:${e.originID}` : `${e.refType}:${e.refId}`;
}
function je(e, t) {
  e.push({
    type: "reference",
    ref_type: t.refType,
    ref_id: t.refId,
    label: G(t.label),
    usage: t.usage,
    ref_trigger: t.trigger || "@",
    ref_version_id: t.versionId,
    ref_origin: t.origin,
    ref_origin_id: t.originID
  });
}
function Xn(e, t, i) {
  je(e, t), Bt(e, i);
}
function Bt(e, t) {
  t?.type === "text" && /^\s/.test(t.text) || ke(e, " ");
}
const Lt = dn(
  "@/components/reference-composer"
), ut = Lt.ReferenceEditor, pt = Lt.ReferenceContentView, At = ln(void 0);
function ii({
  value: e,
  content: t,
  items: i,
  placeholder: r,
  disabled: a,
  autoFocus: l,
  className: u,
  layerZIndex: p,
  usageOptions: v = [],
  pickerRequest: h,
  onReferenceDelete: g,
  onReferenceUsageChange: y,
  onChange: C,
  onSubmit: k,
  assetReferenceProvider: I
}) {
  const o = Ge(i);
  return /* @__PURE__ */ n(
    Ft,
    {
      value: e,
      content: t,
      adapter: o,
      placeholder: r,
      disabled: a,
      autoFocus: l,
      className: u,
      layerZIndex: p,
      usageOptions: v,
      pickerRequest: h,
      onReferenceDelete: g,
      onReferenceUsageChange: y,
      onChange: C,
      onSubmit: k,
      assetReferenceProvider: I
    }
  );
}
function Ft({
  value: e,
  content: t,
  adapter: i,
  placeholder: r,
  disabled: a,
  autoFocus: l,
  className: u,
  layerZIndex: p,
  usageOptions: v = [],
  pickerRequest: h,
  onReferenceDelete: g,
  onReferenceUsageChange: y,
  onChange: C,
  onSubmit: k,
  assetReferenceProvider: I
}) {
  const o = _t(
    At
  ), R = I || o, w = t || Ot(e, i.options), M = v.map(
    (S) => [
      S.key,
      S.label,
      S.maxFiles || 0,
      ...S.acceptedKinds || []
    ].join(":")
  ).join("|");
  return ut ? /* @__PURE__ */ n(
    ut,
    {
      value: e,
      content: w,
      references: i.options,
      placeholder: r,
      disabled: a,
      autoFocus: l,
      className: u,
      layerZIndex: p,
      pickerScopes: ["current"],
      pickerSearchPlaceholder: "搜索当前画布的内容或素材",
      loadReferences: i.loadReferences,
      loadPreview: i.loadPreview,
      providers: R ? [R] : void 0,
      usageOptions: v,
      pickerRequest: h,
      onReferenceDelete: g,
      onReferenceUsageChange: y,
      onChange: C,
      onSubmit: k
    },
    M
  ) : /* @__PURE__ */ n(
    "textarea",
    {
      className: u,
      value: e,
      disabled: a,
      placeholder: r,
      onChange: (S) => C(S.target.value),
      onKeyDown: (S) => {
        k && (S.metaKey || S.ctrlKey) && S.key === "Enter" && (S.preventDefault(), k());
      }
    }
  );
}
function Gn({
  value: e,
  content: t,
  adapter: i,
  placeholder: r = "",
  className: a = ""
}) {
  const l = _t(
    At
  ), u = t ? Jn(t, i.options) : Ot(e, i.options);
  return !pt || !u?.parts.length ? /* @__PURE__ */ n("span", { className: a, children: e || r }) : /* @__PURE__ */ n("span", { className: `ws-canvas-reference-text ${a}`.trim(), children: /* @__PURE__ */ n(
    pt,
    {
      content: u,
      fallback: e || r,
      references: i.options,
      loadPreview: (p) => p.refType === "asset" && l?.loadPreview ? l.loadPreview(p) : i.loadPreview(p)
    }
  ) });
}
function Jn(e, t) {
  const i = new Map(
    t.map((r) => [
      Ie(r.refType, r.refId),
      r.label
    ])
  );
  return {
    ...e,
    parts: e.parts.map(
      (r) => r.type === "reference" ? {
        ...r,
        label: G(
          i.get(Ie(r.ref_type, r.ref_id)) || r.label
        )
      } : r
    )
  };
}
function Ge(e) {
  return se(() => {
    const t = Qn(e), i = /* @__PURE__ */ new Map(), r = t.flatMap((a) => {
      const l = Number(a.refId || 0), u = Number(a.versionID || 0);
      if (l <= 0 || u <= 0)
        return [];
      const p = Zn(a, l);
      return i.set(
        Ie(p.refType, p.refId),
        a
      ), [p];
    });
    return {
      options: r,
      loadReferences: async (a) => ({
        items: a.scope === "current" ? rr(r, a.query) : []
      }),
      loadPreview: async (a) => er(
        i.get(
          Ie(a.refType, a.refId)
        ),
        a
      )
    };
  }, [e]);
}
function Qn(e) {
  const t = [], i = /* @__PURE__ */ new Set();
  for (const r of e) {
    const a = Re(r.title);
    if (!a)
      continue;
    const l = `${r.source}:${r.id}`;
    i.has(l) || (i.add(l), t.push({ ...r, title: a }));
  }
  return t;
}
function Zn(e, t) {
  return {
    key: `canvas:${e.source}:${e.id}`,
    refType: "asset",
    refId: t,
    versionID: Number(e.versionID || 0) || void 0,
    label: Re(e.title),
    description: Ke(e),
    preview: {
      text: Ke(e),
      kind: e.kind,
      url: nr(e)
    }
  };
}
function er(e, t) {
  if (!e)
    return {
      refType: t.refType,
      refId: t.refId,
      title: t.label,
      text: "引用内容已不可用",
      media: []
    };
  const i = tr(e);
  return {
    refType: t.refType,
    refId: t.refId,
    title: Re(e.title),
    text: Ke(e),
    media: i,
    content: i.length > 0 ? void 0 : e.output
  };
}
function Ie(e, t) {
  return `${e}:${t}`;
}
function tr(e) {
  return [
    { kind: "image", url: e.preview.imageUrl },
    { kind: "video", url: e.preview.videoUrl },
    { kind: "audio", url: e.preview.audioUrl },
    { kind: "file", url: e.preview.fileUrl }
  ].filter((i) => i.url).map((i) => ({
    ...i,
    label: Re(e.title)
  }));
}
function nr(e) {
  return e.preview.imageUrl || e.preview.videoUrl || e.preview.audioUrl || e.preview.fileUrl || "";
}
function Ke(e) {
  const t = String(e.preview.text || "").trim();
  return !t || t === e.title ? e.kind === "text" ? "画布文本内容" : "画布生成素材" : t.length > 160 ? `${t.slice(0, 160)}...` : t;
}
function rr(e, t) {
  const i = t.trim().toLowerCase();
  return i ? e.filter(
    (r) => [r.label, r.description, r.preview?.kind].some(
      (a) => String(a || "").toLowerCase().includes(i)
    )
  ) : e;
}
function Re(e) {
  return String(e || "").trim().replace(/^@+/, "");
}
function ir(e, t, i, r, a) {
  if (!t || !i || t === i)
    return e;
  const l = e.findIndex((h) => a(h) === t);
  if (l < 0)
    return e;
  const u = [...e], [p] = u.splice(l, 1), v = u.findIndex((h) => a(h) === i);
  return v < 0 ? e : (u.splice(v + (r === "after" ? 1 : 0), 0, p), u);
}
function ht(e, t, i) {
  if (!t.length)
    return e;
  const r = new Map(e.map((u) => [i(u), u])), a = [];
  for (const u of t)
    r.has(u) && a.push(r.get(u));
  const l = new Set(a.map(i));
  return [
    ...a,
    ...e.filter((u) => !l.has(i(u)))
  ];
}
function Be(e, t) {
  return e.length === t.length && e.every((i, r) => i === t[r]);
}
function ar({
  itemId: e,
  index: t,
  durationLabel: i,
  className: r,
  dragClassName: a,
  selected: l = !1,
  readonly: u = !1,
  wholeCardDraggable: p = !1,
  dragging: v = !1,
  dropPlacement: h,
  ariaLabel: g,
  headerActions: y,
  children: C,
  onSelect: k,
  onDragStart: I,
  onDragOver: o,
  onDrop: R,
  onDragEnd: w
}) {
  const M = j(!1);
  function S($) {
    const B = $.target;
    if (p && B instanceof HTMLElement && B.closest("button, a, input, textarea, select")) {
      $.preventDefault();
      return;
    }
    M.current = !0, $.dataTransfer.effectAllowed = "move", $.dataTransfer.setData("text/plain", e), p && $.dataTransfer.setDragImage($.currentTarget, 28, 18), I();
  }
  function O() {
    w(), window.setTimeout(() => {
      M.current = !1;
    }, 0);
  }
  return /* @__PURE__ */ s(
    "article",
    {
      className: [
        "ws-sequence-card",
        r,
        l ? "is-selected" : "",
        p && !u ? "is-drag-enabled" : "",
        v ? "is-dragging" : "",
        h ? `is-drop-${h}` : ""
      ].filter(Boolean).join(" "),
      "data-sequence-item-id": e,
      "aria-label": g,
      draggable: !u && p,
      onClick: () => {
        M.current || k();
      },
      onDragStart: !u && p ? S : void 0,
      onDragOver: u ? void 0 : ($) => {
        $.preventDefault(), $.dataTransfer.dropEffect = "move", o($);
      },
      onDrop: u ? void 0 : ($) => {
        $.preventDefault(), R();
      },
      onDragEnd: !u && p ? O : void 0,
      children: [
        /* @__PURE__ */ s("header", { children: [
          p ? /* @__PURE__ */ n(Y, { label: u ? void 0 : "拖动卡片排序", children: /* @__PURE__ */ n("span", { className: a, "aria-hidden": "true", children: /* @__PURE__ */ n(dt, { size: 13 }) }) }) : /* @__PURE__ */ n(Y, { label: u ? void 0 : "拖动排序", children: /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: a,
              draggable: !u,
              disabled: u,
              "aria-label": `拖动${g}排序`,
              onClick: ($) => $.stopPropagation(),
              onDragStart: S,
              onDragEnd: O,
              children: /* @__PURE__ */ n(dt, { size: 13 })
            }
          ) }),
          /* @__PURE__ */ n("strong", { children: String(t + 1).padStart(2, "0") }),
          /* @__PURE__ */ n("span", { children: i }),
          y || /* @__PURE__ */ n("i", { "aria-hidden": "true" })
        ] }),
        C
      ]
    }
  );
}
function sr({
  shot: e,
  index: t,
  storyboard: i,
  selected: r = !1,
  editable: a = !1,
  dragging: l = !1,
  dropPlacement: u,
  onOpen: p,
  onDuplicate: v,
  onRemove: h,
  onDragStart: g,
  onDragOver: y,
  onDrop: C,
  onDragEnd: k
}) {
  const I = e.speech.filter((o) => o.text.trim()).length;
  return /* @__PURE__ */ s(
    ar,
    {
      itemId: e.id,
      index: t,
      durationLabel: `${e.duration}秒`,
      className: "ws-storyboard-card",
      dragClassName: "ws-storyboard-card-drag",
      selected: r,
      readonly: !a,
      wholeCardDraggable: !0,
      dragging: l,
      dropPlacement: u,
      ariaLabel: `镜头 ${t + 1}`,
      onSelect: p,
      onDragStart: g || Ae,
      onDragOver: y || cr,
      onDrop: C || Ae,
      onDragEnd: k || Ae,
      headerActions: /* @__PURE__ */ n("span", { className: "ws-storyboard-card-count", children: I ? `${I} 条语音` : "无语音" }),
      children: [
        /* @__PURE__ */ n(
          or,
          {
            shot: e,
            storyboard: i
          }
        ),
        /* @__PURE__ */ s("footer", { children: [
          /* @__PURE__ */ n(Y, { label: a ? "编辑镜头" : "查看镜头", children: /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": a ? "编辑镜头" : "查看镜头",
              onClick: Le(p),
              children: /* @__PURE__ */ n(Fn, { size: 13 })
            }
          ) }),
          a && v ? /* @__PURE__ */ n(Y, { label: "复制镜头", children: /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "复制镜头",
              onClick: Le(v),
              children: /* @__PURE__ */ n(wt, { size: 13 })
            }
          ) }) : null,
          a && h ? /* @__PURE__ */ n(Y, { label: "删除镜头", children: /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "is-danger",
              "aria-label": "删除镜头",
              onClick: Le(h),
              children: /* @__PURE__ */ n(Ce, { size: 13 })
            }
          ) }) : null
        ] })
      ]
    }
  );
}
function ai({
  shot: e,
  index: t,
  storyboard: i,
  onOpen: r
}) {
  return /* @__PURE__ */ s(
    "button",
    {
      type: "button",
      className: "ws-storyboard-compact-card nodrag nopan",
      disabled: !r,
      onMouseDown: (a) => a.stopPropagation(),
      onClick: (a) => {
        a.preventDefault(), a.stopPropagation(), r?.();
      },
      children: [
        /* @__PURE__ */ s("span", { className: "ws-storyboard-compact-head", children: [
          /* @__PURE__ */ n("strong", { children: String(t + 1).padStart(2, "0") }),
          /* @__PURE__ */ s("span", { children: [
            e.duration,
            "秒"
          ] }),
          /* @__PURE__ */ n(
            Vt,
            {
              continues: e.continue_previous,
              matches: e.match_previous
            }
          )
        ] }),
        /* @__PURE__ */ n("span", { className: "ws-storyboard-compact-description", children: e.beat || e.description || `镜头 ${t + 1}` }),
        /* @__PURE__ */ n("span", { className: "ws-storyboard-compact-materials", children: /* @__PURE__ */ n(Ut, { shot: e, storyboard: i }) })
      ]
    }
  );
}
function or({ shot: e, storyboard: t }) {
  const i = e.speech.filter((v) => v.text.trim()), r = i[0], a = new Map(
    t.materials.filter((v) => v.type === "character").map((v) => [v.id, v.name])
  ), l = [...new Set(i.map(gn))], u = bn(e).length, p = Nt(e);
  return /* @__PURE__ */ s(oe, { children: [
    /* @__PURE__ */ s("div", { className: "ws-storyboard-card-preview", children: [
      /* @__PURE__ */ n("span", { children: /* @__PURE__ */ n(
        Vt,
        {
          continues: e.continue_previous,
          matches: e.match_previous
        }
      ) }),
      /* @__PURE__ */ n("strong", { children: e.beat || `镜头 ${e.order} 的叙事变化` }),
      /* @__PURE__ */ n("p", { children: e.description || "等待补充镜头内容" })
    ] }),
    /* @__PURE__ */ s("div", { className: "ws-storyboard-card-body", children: [
      /* @__PURE__ */ s("div", { className: "ws-storyboard-card-tags", children: [
        /* @__PURE__ */ n(Ut, { shot: e, storyboard: t }),
        l.map((v) => /* @__PURE__ */ n("span", { children: v }, v)),
        u ? /* @__PURE__ */ s("span", { children: [
          u,
          " 条字幕"
        ] }) : null,
        p ? /* @__PURE__ */ n("span", { className: "is-lip-sync", children: "可选口型" }) : null
      ] }),
      /* @__PURE__ */ n("p", { className: "ws-storyboard-card-camera", children: e.camera_instruction || "未设置镜头语言" }),
      r ? /* @__PURE__ */ s("p", { className: "ws-storyboard-card-speech", children: [
        r.kind === "dialogue" ? /* @__PURE__ */ n(hn, { size: 12 }) : /* @__PURE__ */ n(ve, { size: 12 }),
        /* @__PURE__ */ n("strong", { children: r.kind === "dialogue" ? a.get(r.character_id || "") || "待选角色" : "旁白" }),
        /* @__PURE__ */ n("span", { children: r.text })
      ] }) : /* @__PURE__ */ s("p", { className: "ws-storyboard-card-speech is-empty", children: [
        /* @__PURE__ */ n(Mt, { size: 12 }),
        /* @__PURE__ */ n("span", { children: "当前镜头没有对白或旁白" })
      ] })
    ] })
  ] });
}
function Ut({
  shot: e,
  storyboard: t
}) {
  const i = /* @__PURE__ */ new Map();
  for (const r of mn(t, e))
    i.set(r.type, (i.get(r.type) || 0) + 1);
  return i.size ? /* @__PURE__ */ n(oe, { children: ["character", "scene", "prop"].map(
    (r) => i.get(r) ? /* @__PURE__ */ s("span", { children: [
      Q[r],
      " ",
      i.get(r)
    ] }, r) : null
  ) }) : /* @__PURE__ */ n("span", { className: "is-empty", children: "无关联素材" });
}
function Vt({
  continues: e,
  matches: t
}) {
  const i = e || t;
  return /* @__PURE__ */ s(
    "span",
    {
      className: `ws-storyboard-continuity ${i ? "is-linked" : "is-cut"}`,
      children: [
        i ? /* @__PURE__ */ n(Dt, { size: 11 }) : /* @__PURE__ */ n(Vn, { size: 11 }),
        e ? "延续上镜" : t ? "匹配上镜" : "切镜"
      ]
    }
  );
}
function Le(e) {
  return (t) => {
    t.stopPropagation(), e();
  };
}
function Ae() {
}
function cr(e) {
}
function lr({
  material: e,
  creating: t = !1,
  readonly: i,
  usage: r,
  existingNames: a = [],
  portalContainer: l,
  onSave: u,
  onRemove: p,
  onClose: v
}) {
  const [h, g] = L(e.name), [y, C] = L(e.prompt), [k, I] = L(e.voice), [o, R] = L(!1), w = h.trim().replace(/^[@#]+/, ""), M = y.trim(), S = a.some(
    (P) => P.trim().toLocaleLowerCase() === w.toLocaleLowerCase()
  ), O = (r?.shotIds.length || 0) + (r?.speechIds.length || 0), $ = !t && !i && !!p && O === 0, B = Q[e.type];
  H(() => {
    function P(c) {
      c.key === "Escape" && (c.preventDefault(), v());
    }
    return window.addEventListener("keydown", P), () => window.removeEventListener("keydown", P);
  }, [v]);
  const A = /* @__PURE__ */ n(
    "div",
    {
      className: "ws-storyboard-shot-backdrop ws-storyboard-material-backdrop",
      onMouseDown: v,
      children: /* @__PURE__ */ s(
        "section",
        {
          className: "ws-storyboard-shot-dialog ws-storyboard-material-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": `${t ? "新增" : i ? "查看" : "编辑"}${B}素材 ${e.name}`,
          onMouseDown: (P) => P.stopPropagation(),
          children: [
            /* @__PURE__ */ s("header", { children: [
              /* @__PURE__ */ s("div", { children: [
                /* @__PURE__ */ n("strong", { children: t ? `新增${B}` : e.name || B }),
                /* @__PURE__ */ s("span", { children: [
                  B,
                  "素材",
                  i ? " · 当前版本只读" : t ? " · 保存后加入当前分镜草稿" : " · 修改会保存到当前分镜草稿"
                ] })
              ] }),
              /* @__PURE__ */ n(Y, { label: "关闭", children: /* @__PURE__ */ n("button", { type: "button", "aria-label": "关闭", onClick: v, children: /* @__PURE__ */ n(We, { size: 18 }) }) })
            ] }),
            /* @__PURE__ */ s("div", { className: "ws-storyboard-material-form nowheel", children: [
              /* @__PURE__ */ s("label", { children: [
                /* @__PURE__ */ n("span", { children: "素材名称" }),
                /* @__PURE__ */ n(
                  "input",
                  {
                    value: h,
                    readOnly: i,
                    autoFocus: !i,
                    placeholder: `例如：${e.type === "character" ? "主角" : e.type === "scene" ? "咖啡馆" : "红色雨伞"}`,
                    onChange: (P) => g(P.target.value)
                  }
                ),
                S ? /* @__PURE__ */ n("small", { className: "ws-storyboard-form-error", children: "素材名称不能重复，否则画布引用无法准确定位。" }) : null
              ] }),
              /* @__PURE__ */ s("label", { children: [
                /* @__PURE__ */ n("span", { children: "生成提示词" }),
                /* @__PURE__ */ n(
                  "textarea",
                  {
                    value: y,
                    readOnly: i,
                    placeholder: `描述${w || B}的外观、结构、材质与风格`,
                    onChange: (P) => C(P.target.value)
                  }
                )
              ] }),
              e.type === "character" ? /* @__PURE__ */ s("label", { children: [
                /* @__PURE__ */ n("span", { children: "配音音色参数值" }),
                /* @__PURE__ */ n(
                  "input",
                  {
                    value: k,
                    readOnly: i,
                    placeholder: "留空使用语音能力默认音色",
                    onChange: (P) => I(P.target.value)
                  }
                ),
                /* @__PURE__ */ n("small", { children: "填写语音能力实际接受的音色值，不绑定具体供应商。" })
              ] }) : null,
              !t && O > 0 ? /* @__PURE__ */ s("div", { className: "ws-storyboard-material-usage", role: "note", children: [
                /* @__PURE__ */ n("strong", { children: "当前素材正在使用" }),
                /* @__PURE__ */ s("span", { children: [
                  r?.shotIds.length || 0,
                  " 个镜头",
                  r?.speechIds.length ? ` · ${r.speechIds.length} 条对白` : "",
                  "。请先在对应镜头中取消关联或更换对白角色，再删除素材。"
                ] })
              ] }) : null,
              /* @__PURE__ */ n("p", { children: "保存分镜版本后，未被手动覆盖的对应素材节点会同步更新；已经生成的后续内容需要重新执行。" })
            ] }),
            /* @__PURE__ */ s("footer", { children: [
              /* @__PURE__ */ n("div", { children: !i && !t && p ? /* @__PURE__ */ n(
                Y,
                {
                  label: O > 0 ? "该素材仍被镜头或对白引用" : o ? "再次点击确认删除" : "删除素材",
                  children: /* @__PURE__ */ s(
                    "button",
                    {
                      type: "button",
                      className: "is-danger",
                      disabled: !$,
                      onClick: () => {
                        if (!o) {
                          R(!0);
                          return;
                        }
                        p(e.id);
                      },
                      children: [
                        /* @__PURE__ */ n(Ce, { size: 14 }),
                        o ? "确认删除" : "删除素材"
                      ]
                    }
                  )
                }
              ) : null }),
              /* @__PURE__ */ s("div", { children: [
                /* @__PURE__ */ n("button", { type: "button", onClick: v, children: i ? "关闭" : "取消" }),
                i ? null : /* @__PURE__ */ s(
                  "button",
                  {
                    type: "button",
                    className: "is-primary",
                    disabled: !w || !M || S,
                    onClick: () => u({
                      ...e,
                      name: w,
                      prompt: M,
                      voice: e.type === "character" ? k.trim() : ""
                    }),
                    children: [
                      /* @__PURE__ */ n(ce, { size: 14 }),
                      t ? "添加素材" : "确认修改"
                    ]
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
  return typeof document > "u" ? null : He(A, l || document.body);
}
const dr = [
  {
    value: "shot_images",
    title: "生成参考图",
    description: "生成素材设定和镜头参考图，之后可在画布中自行连接视频节点。"
  },
  {
    value: "shot_videos",
    title: "生成镜头视频",
    description: "生成各个镜头及所选附加内容，不创建最终视频合成。"
  },
  {
    value: "final_video",
    title: "生成完整成片",
    description: "创建完整镜头制作流程和视频合成，继续完成整条成片。"
  }
];
function ur({
  storyboard: e,
  submitting: t,
  portalContainer: i,
  onClose: r,
  onConfirm: a
}) {
  const [l, u] = L(
    () => fr(e.production_plan)
  ), p = Ct(e), v = kt(e), h = e.shots.some(
    Nt
  ), g = se(
    () => ({ ...e, production_plan: l }),
    [l, e]
  ), y = se(
    () => hr(g),
    [g]
  ), C = It(
    g
  );
  H(() => {
    const o = (R) => {
      R.key === "Escape" && !t && r();
    };
    return window.addEventListener("keydown", o), () => window.removeEventListener("keydown", o);
  }, [r, t]);
  const k = (o, R) => {
    u((w) => ({
      ...w,
      [o]: R ? "auto" : "off"
    }));
  }, I = async () => {
    await a(
      pr(l, {
        speech: p > 0,
        subtitles: v > 0,
        visibleDialogue: h
      })
    ) && r();
  };
  return He(
    /* @__PURE__ */ n(
      "div",
      {
        className: "ws-storyboard-shot-backdrop ws-storyboard-confirm-backdrop",
        onMouseDown: () => {
          t || r();
        },
        children: /* @__PURE__ */ s(
          "section",
          {
            className: "ws-storyboard-shot-dialog ws-storyboard-confirm-dialog",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "确认分镜制作方案",
            onMouseDown: (o) => o.stopPropagation(),
            children: [
              /* @__PURE__ */ s("header", { children: [
                /* @__PURE__ */ s("div", { children: [
                  /* @__PURE__ */ n("strong", { children: "确认分镜并创建制作区" }),
                  /* @__PURE__ */ n("span", { children: "确认后脚本进入只读状态，需要修改时可创建修订稿。" })
                ] }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    "aria-label": "关闭",
                    disabled: t,
                    onClick: r,
                    children: /* @__PURE__ */ n(We, { size: 18 })
                  }
                )
              ] }),
              /* @__PURE__ */ s("div", { className: "ws-storyboard-confirm-body nowheel", children: [
                /* @__PURE__ */ s("div", { className: "ws-storyboard-confirm-summary", children: [
                  /* @__PURE__ */ n("strong", { children: e.title.trim() || "分镜脚本" }),
                  /* @__PURE__ */ s("span", { children: [
                    e.shots.length,
                    " 个镜头"
                  ] }),
                  /* @__PURE__ */ s("span", { children: [
                    Rt(e),
                    " 秒"
                  ] }),
                  /* @__PURE__ */ s("span", { children: [
                    p,
                    " 条语音"
                  ] })
                ] }),
                /* @__PURE__ */ s("fieldset", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ n("legend", { children: "产出目标" }),
                  /* @__PURE__ */ n("div", { className: "ws-storyboard-output-options", children: dr.map((o) => /* @__PURE__ */ s(
                    "label",
                    {
                      className: l.output_target === o.value ? "is-selected" : "",
                      children: [
                        /* @__PURE__ */ n(
                          "input",
                          {
                            type: "radio",
                            name: "storyboard-output-target",
                            value: o.value,
                            checked: l.output_target === o.value,
                            disabled: t,
                            onChange: () => u((R) => ({
                              ...R,
                              output_target: o.value
                            }))
                          }
                        ),
                        /* @__PURE__ */ s("span", { children: [
                          /* @__PURE__ */ n("strong", { children: o.title }),
                          /* @__PURE__ */ n("small", { children: o.description })
                        ] }),
                        l.output_target === o.value ? /* @__PURE__ */ n(ce, { size: 16, "aria-hidden": "true" }) : null
                      ]
                    },
                    o.value
                  )) })
                ] }),
                C ? /* @__PURE__ */ s("fieldset", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ n("legend", { children: "附加内容" }),
                  /* @__PURE__ */ n(
                    Fe,
                    {
                      title: "配音",
                      description: p > 0 ? `按脚本中的 ${p} 条对白或旁白创建配音。` : "当前脚本没有对白或旁白。",
                      checked: p > 0 && l.voice_mode === "auto",
                      disabled: t || p === 0,
                      onChange: (o) => k("voice_mode", o)
                    }
                  ),
                  /* @__PURE__ */ n(
                    Fe,
                    {
                      title: "字幕",
                      description: v > 0 ? `按脚本中的 ${v} 条字幕内容创建字幕组。` : "当前脚本没有可用字幕内容。",
                      checked: v > 0 && l.subtitle_mode === "auto",
                      disabled: t || v === 0,
                      onChange: (o) => k("subtitle_mode", o)
                    }
                  ),
                  /* @__PURE__ */ n(
                    Fe,
                    {
                      title: "口型同步",
                      description: h ? "仅对出镜对白创建口型同步，默认关闭。" : "当前脚本没有需要同步口型的出镜对白。",
                      checked: h && l.voice_mode === "auto" && l.lip_sync_mode === "auto",
                      disabled: t || !h || l.voice_mode !== "auto",
                      onChange: (o) => k("lip_sync_mode", o)
                    }
                  )
                ] }) : null,
                /* @__PURE__ */ s("section", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ s("div", { className: "ws-storyboard-confirm-section-title", children: [
                    /* @__PURE__ */ n("strong", { children: "制作流程" }),
                    /* @__PURE__ */ n("span", { children: "镜头参考图由分镜连续性自动判断，无需手动选择。" })
                  ] }),
                  /* @__PURE__ */ n("div", { className: "ws-storyboard-production-flow", children: y.map((o, R) => /* @__PURE__ */ s("span", { children: [
                    R > 0 ? /* @__PURE__ */ n("i", { "aria-hidden": "true", children: "/" }) : null,
                    o
                  ] }, o)) })
                ] })
              ] }),
              /* @__PURE__ */ s("footer", { children: [
                /* @__PURE__ */ n("button", { type: "button", disabled: t, onClick: r, children: "返回修改" }),
                /* @__PURE__ */ s(
                  "button",
                  {
                    type: "button",
                    className: "is-primary",
                    disabled: t,
                    onClick: () => {
                      I();
                    },
                    children: [
                      t ? /* @__PURE__ */ n(be, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ n(ce, { size: 15 }),
                      t ? "确认中" : "确认并创建"
                    ]
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    i || document.body
  );
}
function Fe({
  title: e,
  description: t,
  checked: i,
  disabled: r,
  onChange: a
}) {
  return /* @__PURE__ */ s("label", { className: `ws-storyboard-production-switch${r ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ s("span", { children: [
      /* @__PURE__ */ n("strong", { children: e }),
      /* @__PURE__ */ n("small", { children: t })
    ] }),
    /* @__PURE__ */ n(
      "input",
      {
        type: "checkbox",
        checked: i,
        disabled: r,
        onChange: (l) => a(l.target.checked)
      }
    ),
    /* @__PURE__ */ n("i", { "aria-hidden": "true" })
  ] });
}
function pr(e, t) {
  if (!["shot_videos", "final_video"].includes(e.output_target))
    return {
      ...e,
      voice_mode: "off",
      subtitle_mode: "off",
      lip_sync_mode: "off"
    };
  const i = t.speech && e.voice_mode === "auto" ? "auto" : "off";
  return {
    ...e,
    voice_mode: i,
    subtitle_mode: t.subtitles && e.subtitle_mode === "auto" ? "auto" : "off",
    lip_sync_mode: t.visibleDialogue && i === "auto" && e.lip_sync_mode === "auto" ? "auto" : "off"
  };
}
function hr(e) {
  if (e.production_plan.output_target === "storyboard_only")
    return ["确认分镜"];
  const t = [
    ...e.materials.length ? ["素材设定"] : [],
    "镜头参考图"
  ];
  return It(e) && t.push("镜头视频"), yn(e) && t.push("配音"), _n(e) && t.push("字幕"), wn(e) && t.push("口型同步"), Sn(e) && t.push("视频合成"), t;
}
function fr(e) {
  const t = vn(e);
  return t.output_target === "storyboard_only" ? { ...t, output_target: "shot_images" } : t;
}
function mr(e) {
  const t = [], i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), u = new Map(
    e.references.map((o) => [o.key, o])
  ), p = /* @__PURE__ */ new Set();
  e.title.trim() || t.push(K("title", "分镜标题不能为空")), e.summary.trim() || t.push(K("summary", "请补充整个脚本的内容简介")), e.storyline.setup.trim() || t.push(K("storyline:setup", "请补充故事起点")), e.storyline.development.trim() || t.push(K("storyline:development", "请补充核心推进")), e.storyline.payoff.trim() || t.push(K("storyline:payoff", "请补充结果落点")), e.style_prompt.trim() || t.push(K("style", "请设置整部作品的统一视觉风格")), (!Number.isInteger(e.target_shot_count) || e.target_shot_count < 1 || e.target_shot_count > J) && t.push(
    K(
      "target_shot_count",
      `目标镜头数必须是 1 到 ${J} 的整数`
    )
  ), e.target_shot_count !== e.shots.length && t.push(K("target_shot_count", "目标镜头数与实际镜头数不一致"));
  const v = e.shots.reduce(
    (o, R) => o + R.duration,
    0
  );
  !Number.isInteger(e.target_duration) || e.target_duration < 4 ? t.push(K("target_duration", "目标总时长必须是不小于 4 秒的整数")) : e.target_duration !== v && t.push(K("target_duration", "目标总时长与镜头时长之和不一致"));
  for (const o of e.materials) {
    const R = o.name.trim(), w = R.toLocaleLowerCase();
    o.id.trim() ? i.has(o.id) && t.push(X(o, `素材标识“${o.id}”重复`)) : t.push(X(o, "缺少稳定标识")), R ? r.has(w) && t.push(X(o, `素材名称“${R}”重复`)) : t.push(X(o, "名称不能为空")), o.prompt.trim() || t.push(X(o, "生成提示词不能为空")), o.type !== "character" && o.voice.trim() && t.push(X(o, "只有角色可以配置音色"));
    for (const M of o.reference_keys) {
      const S = u.get(M);
      S ? S.purpose !== o.type ? t.push(X(o, `参考素材“${S.label}”的用途不匹配`)) : p.add(M) : t.push(X(o, `引用了不存在的参考素材“${M}”`));
    }
    r.add(w), i.set(o.id, o);
  }
  if (!e.shots.length)
    return t.push(K("shots", "分镜至少需要一个镜头")), t;
  let h = /* @__PURE__ */ new Set(), g = !1, y = 0;
  const C = /* @__PURE__ */ new Set(), k = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
  e.shots.forEach((o, R) => {
    const w = R + 1;
    (!o.id.trim() || C.has(o.id)) && t.push(T(o, w, "镜头标识缺失或重复")), C.add(o.id), $t(o.duration) || t.push(
      T(o, w, "时长必须是不小于 4 秒的整数")
    ), o.beat.trim() ? mt(k, o.beat, o, w, "本镜变化", t) : t.push(T(o, w, "请填写本镜变化")), R === 0 && o.transition.trim() ? t.push(T(o, w, "第一镜不能填写上镜承接关系")) : R > 0 && !o.transition.trim() && t.push(T(o, w, "请说明与上一镜头的承接关系")), o.description.trim() ? mt(
      I,
      o.description,
      o,
      w,
      "镜头描述",
      t
    ) : t.push(T(o, w, "镜头描述不能为空")), o.video_prompt.trim() || t.push(T(o, w, "视频提示词不能为空"));
    for (const O of o.reference_keys) {
      const $ = u.get(O);
      $ ? $.purpose !== "shot" ? t.push(
        T(o, w, `参考素材“${$.label}”的用途不匹配`)
      ) : p.add(O) : t.push(
        T(o, w, `引用了不存在的参考素材“${O}”`)
      );
    }
    const M = /* @__PURE__ */ new Set();
    for (const O of o.material_ids)
      i.has(O) ? M.has(O) && t.push(
        T(o, w, `重复引用素材“${O}”`)
      ) : t.push(
        T(o, w, `引用了不存在的素材“${O}”`)
      ), M.add(O);
    R === 0 && o.continue_previous && t.push(T(o, w, "第一个镜头不能承接上一镜头")), R === 0 && o.match_previous && t.push(T(o, w, "第一个镜头不能匹配上一镜头")), o.match_previous && o.continue_previous && t.push(T(o, w, "不能同时匹配上一镜画面和延续上一镜视频")), xt.includes(o.transition_type) || t.push(T(o, w, "结构化转场类型无效")), R === 0 && (o.transition_type !== "none" || o.transition_duration_ms !== 0) ? t.push(T(o, w, "第一镜不能配置转场效果")) : o.transition_type === "none" && o.transition_duration_ms !== 0 ? t.push(T(o, w, "硬切的转场时长必须为 0")) : o.transition_type !== "none" && (o.transition_duration_ms < 100 || o.transition_duration_ms > 5e3) && t.push(T(o, w, "转场时长必须是 100 到 5000 毫秒")), o.continue_previous ? (y += 1, o.continuity_anchor.trim() || t.push(T(o, w, "请填写连续性锚点")), y >= 3 && t.push(
      T(o, w, "连续镜头链最多包含 3 个镜头")
    ), _r(h, M) || t.push(
      T(
        o,
        w,
        "连续镜头不能新增、移除或更换角色、场景或道具"
      )
    )) : y = 0;
    const S = gr(
      o,
      w,
      i,
      M,
      a,
      t
    );
    o.continue_previous && (g || S) && t.push(
      T(o, w, "出镜对白不能跨越连续镜头边界")
    ), vr(o, w, l, t), h = M, g = S;
  });
  for (const o of e.references)
    o.purpose !== "visual_style" && o.purpose !== "motion_style" && !p.has(o.key) && t.push(
      K(
        `reference:${o.key}`,
        `参考素材“${o.label}”尚未关联到具体目标`
      )
    );
  return t;
}
function gr(e, t, i, r, a, l) {
  for (const p of e.speech) {
    if ((!p.id.trim() || a.has(p.id)) && l.push(T(e, t, "语音标识缺失或重复")), a.add(p.id), p.text.trim() || l.push(T(e, t, "对白或旁白文本不能为空")), (p.start_time < 0 || p.start_time >= e.duration) && l.push(T(e, t, "语音开始时间超出镜头范围")), p.kind !== "dialogue")
      continue;
    const v = p.character_id || "";
    i.get(v)?.type !== "character" ? l.push(T(e, t, "对白没有选择有效角色")) : r.has(v) || l.push(T(e, t, "对白角色未关联到当前镜头"));
  }
  const u = Tt(e);
  return u.size > 1 && l.push(T(e, t, "最多只能有一个出镜说话角色")), br(e, t, l), u.size > 0;
}
function br(e, t, i) {
  const r = e.speech.filter((a) => a.text.trim()).map((a) => ({
    speech: a,
    start: a.start_time,
    end: a.start_time + Math.max(0.6, yr(a) / 3.5)
  })).sort((a, l) => a.start - l.start);
  for (let a = 0; a < r.length; a += 1) {
    const l = r[a];
    l.end > e.duration + 0.01 && i.push(
      ft(
        `shot:${e.id}:speech:${l.speech.id}:duration`,
        `镜头 ${t} 的语音按正常语速可能无法在镜头内说完`,
        e.id
      )
    );
    const u = r[a + 1];
    u && l.end > u.start + 0.01 && i.push(
      ft(
        `shot:${e.id}:speech:${l.speech.id}:overlap`,
        `镜头 ${t} 的相邻语音按正常语速可能重叠`,
        e.id
      )
    );
  }
}
function vr(e, t, i, r) {
  for (const a of e.captions)
    (!a.id.trim() || i.has(a.id)) && r.push(T(e, t, "字幕标识缺失或重复")), i.add(a.id), a.text.trim() || r.push(T(e, t, "字幕文案不能为空")), (a.start_time < 0 || a.end_time <= a.start_time || a.end_time > e.duration) && r.push(T(e, t, "字幕时间范围超出镜头"));
}
function yr(e) {
  return [...e.text.replace(/\s+/g, "")].length;
}
function _r(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const i of e)
    if (!t.has(i))
      return !1;
  return !0;
}
function K(e, t) {
  return { id: e, message: t, severity: "error" };
}
function X(e, t) {
  return {
    id: `material:${e.id}:${t}`,
    message: `${e.name || "未命名素材"}：${t}`,
    severity: "error",
    materialId: e.id
  };
}
function T(e, t, i) {
  return {
    id: `shot:${e.id}:${i}`,
    message: `镜头 ${t}：${i}`,
    severity: "error",
    shotId: e.id
  };
}
function wr(e, t, i) {
  return { id: e, message: t, severity: "warning", shotId: i };
}
function ft(e, t, i) {
  return { id: e, message: t, severity: "error", shotId: i };
}
function mt(e, t, i, r, a, l) {
  const u = t.replace(/\s+/g, "").toLocaleLowerCase(), p = e.get(u);
  p ? l.push(
    wr(
      `shot:${i.id}:${a}:duplicate`,
      `镜头 ${r} 的${a}与镜头 ${p} 重复，建议审查是否有新的叙事作用`,
      i.id
    )
  ) : e.set(u, r);
}
function Sr({
  issues: e,
  onOpen: t
}) {
  const i = e.filter((l) => l.severity === "error"), r = e.filter((l) => l.severity === "warning"), a = [...i, ...r].slice(0, 5);
  return /* @__PURE__ */ s(
    "section",
    {
      className: `ws-storyboard-validation ${i.length ? "is-error" : "is-warning"}`,
      "aria-label": "分镜预检",
      children: [
        /* @__PURE__ */ s("header", { children: [
          /* @__PURE__ */ n(Pn, { size: 14 }),
          /* @__PURE__ */ n("strong", { children: i.length ? `${i.length} 项需要处理` : `${r.length} 项建议检查` }),
          e.length > a.length ? /* @__PURE__ */ s("span", { children: [
            "另有 ",
            e.length - a.length,
            " 项"
          ] }) : null
        ] }),
        /* @__PURE__ */ n("div", { children: a.map((l, u) => {
          const p = !!(l.materialId || l.shotId);
          return /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              disabled: !p,
              onClick: () => p && t(l),
              children: /* @__PURE__ */ n("span", { children: l.message })
            },
            `${l.id}:${u}`
          );
        }) })
      ]
    }
  );
}
function Nr({
  storyboard: e,
  referenceItems: t,
  editable: i,
  disabled: r,
  onChange: a
}) {
  const l = Ge(t);
  if (e.references.length === 0)
    return null;
  const u = (p, v, h = !1) => {
    let g = h ? Yt(e, p) : e;
    if (g = {
      ...g,
      references: g.references.map(
        (y) => y.key === p ? { ...y, ...v } : y
      )
    }, h) {
      const y = g.references.find((k) => k.key === p), C = y ? gt(g, y) : [];
      C.length === 1 && (g = bt(g, p, C[0].value));
    }
    a(g);
  };
  return /* @__PURE__ */ s("section", { className: "ws-storyboard-references", "aria-label": "参考素材", children: [
    /* @__PURE__ */ s("header", { children: [
      /* @__PURE__ */ n(Dt, { size: 14 }),
      /* @__PURE__ */ n("strong", { children: "参考素材" }),
      /* @__PURE__ */ s("span", { children: [
        e.references.length,
        " 项"
      ] })
    ] }),
    /* @__PURE__ */ n("div", { className: "ws-storyboard-reference-list", children: e.references.map((p) => {
      const v = gt(
        e,
        p
      ), h = kr(e, p.key);
      return /* @__PURE__ */ s("div", { className: "ws-storyboard-reference-row", children: [
        /* @__PURE__ */ n(
          Gn,
          {
            className: "ws-storyboard-reference-asset",
            value: `@${p.label}`,
            content: Cr(p),
            adapter: l
          }
        ),
        i ? /* @__PURE__ */ s(oe, { children: [
          /* @__PURE__ */ n(
            "select",
            {
              className: "nodrag nopan",
              value: p.purpose,
              disabled: r,
              "aria-label": `${p.label}的参考用途`,
              onChange: (g) => u(
                p.key,
                {
                  purpose: g.target.value
                },
                !0
              ),
              children: Nn(p.kind).map(
                (g) => /* @__PURE__ */ n("option", { value: g.value, children: g.label }, g.value)
              )
            }
          ),
          vt(p.purpose) ? /* @__PURE__ */ s(
            "select",
            {
              className: "nodrag nopan",
              value: h,
              disabled: r,
              "aria-label": `${p.label}的关联目标`,
              onChange: (g) => a(
                bt(
                  e,
                  p.key,
                  g.target.value
                )
              ),
              children: [
                /* @__PURE__ */ n("option", { value: "", children: "选择关联目标" }),
                v.map((g) => /* @__PURE__ */ n("option", { value: g.value, children: g.label }, g.value))
              ]
            }
          ) : /* @__PURE__ */ n("span", { className: "ws-storyboard-reference-global", children: "全局应用" }),
          /* @__PURE__ */ n(
            "input",
            {
              className: "nodrag nopan",
              value: p.instruction,
              disabled: r,
              "aria-label": `${p.label}的补充说明`,
              placeholder: "补充说明（可选）",
              onChange: (g) => u(p.key, {
                instruction: g.target.value
              })
            }
          )
        ] }) : /* @__PURE__ */ s(oe, { children: [
          /* @__PURE__ */ n("span", { className: "ws-storyboard-reference-purpose", children: Cn[p.purpose] }),
          /* @__PURE__ */ n("span", { className: "ws-storyboard-reference-target", children: Ir(e, h) || (vt(p.purpose) ? "未关联" : "全局应用") }),
          p.instruction ? /* @__PURE__ */ n("span", { className: "ws-storyboard-reference-instruction", children: p.instruction }) : null
        ] })
      ] }, p.key);
    }) })
  ] });
}
function Cr(e) {
  return {
    version: 1,
    parts: [
      {
        type: "reference",
        ref_type: "asset",
        ref_id: e.asset_id,
        label: e.label,
        ref_trigger: "@",
        ref_version_id: e.version_id
      }
    ]
  };
}
function gt(e, t) {
  return jt(t.purpose) ? e.materials.filter((i) => i.type === t.purpose).map((i) => ({
    value: `material:${i.id}`,
    label: i.name
  })) : t.purpose === "shot" ? e.shots.map((i, r) => ({
    value: `shot:${i.id}`,
    label: `镜头 ${i.order || r + 1}`
  })) : [];
}
function kr(e, t) {
  const i = e.materials.find(
    (a) => a.reference_keys.includes(t)
  );
  if (i)
    return `material:${i.id}`;
  const r = e.shots.find(
    (a) => a.reference_keys.includes(t)
  );
  return r ? `shot:${r.id}` : "";
}
function Ir(e, t) {
  const [i, r] = t.split(":", 2);
  if (i === "material")
    return e.materials.find((a) => a.id === r)?.name || "";
  if (i === "shot") {
    const a = e.shots.findIndex((l) => l.id === r);
    return a >= 0 ? `镜头 ${e.shots[a].order || a + 1}` : "";
  }
  return "";
}
function bt(e, t, i) {
  const r = Yt(e, t);
  if (!i)
    return r;
  const [a, l] = i.split(":", 2);
  return a === "material" ? {
    ...r,
    materials: r.materials.map(
      (u) => u.id === l ? {
        ...u,
        reference_keys: [...u.reference_keys, t]
      } : u
    )
  } : a === "shot" ? {
    ...r,
    shots: r.shots.map(
      (u) => u.id === l ? { ...u, reference_keys: [...u.reference_keys, t] } : u
    )
  } : r;
}
function Yt(e, t) {
  return {
    ...e,
    materials: e.materials.map((i) => ({
      ...i,
      reference_keys: i.reference_keys.filter(
        (r) => r !== t
      )
    })),
    shots: e.shots.map((i) => ({
      ...i,
      reference_keys: i.reference_keys.filter((r) => r !== t)
    }))
  };
}
function jt(e) {
  return e === "character" || e === "scene" || e === "prop";
}
function vt(e) {
  return jt(e) || e === "shot";
}
const Rr = fn.ConfirmDialog, $r = [], xr = [
  {
    key: "setup",
    label: "起点",
    placeholder: "人物、产品或事件开始时处于什么具体状态"
  },
  {
    key: "development",
    label: "推进",
    placeholder: "什么触发了变化，核心动作如何推进"
  },
  {
    key: "payoff",
    label: "落点",
    placeholder: "最终发生了什么可见结果"
  }
];
function Tr({
  storyboard: e,
  layout: t = "stacked",
  editable: i = !1,
  disabled: r = !1,
  onSave: a,
  onChange: l,
  onConfirm: u,
  onReview: p,
  onCreateRevision: v,
  workflowAction: h = "",
  saveStatus: g,
  showSaveStatus: y = !0,
  showMetrics: C = !0,
  referenceItems: k = $r,
  focus: I
}) {
  const o = se(
    () => JSON.stringify(e),
    [e]
  ), [R, w] = L(e), [M, S] = L("saved"), [O, $] = L(""), [B, A] = L(""), [P, c] = L(null), [b, m] = L(!1), [D, F] = L(!1), [E, Z] = L(""), [le, $e] = L(""), [xe, Te] = L([]), [Ht, Wt] = L(
    "before"
  ), de = j(null), De = de.current?.closest(".wb-detail-backdrop, .ws-page") || null, Me = j(""), ee = j([]), Je = j(/* @__PURE__ */ new Map()), te = j(/* @__PURE__ */ new Map()), Oe = j(e), we = j(!1), ue = j(0), Qe = j(o), q = j(null), Ze = j(Promise.resolve()), pe = j(!0), he = !!l, _ = he ? e : R, fe = kn(_), z = i && !r && !fe && !h && !!(l || a), et = z && !he && !!a, tt = Ge(k), ne = _.shots.find((d) => d.id === O), ze = _.materials.find(
    (d) => d.id === B
  ), re = ze || P, Xt = re ? at(_, re.id) : void 0, Gt = se(
    () => ht(_.shots, xe, (d) => d.id),
    [_.shots, xe]
  ), Pe = se(
    () => mr(_),
    [_]
  ), Jt = Pe.some(
    (d) => d.severity === "error"
  );
  H(() => (pe.current = !0, () => {
    pe.current = !1, q.current && window.clearTimeout(q.current);
  }), []), H(
    () => () => {
      for (const d of te.current.values())
        d.cancel();
      te.current.clear();
    },
    []
  ), un(() => {
    const d = Je.current, f = de.current;
    if (!f || d.size === 0)
      return;
    const N = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    f.querySelectorAll(
      ".ws-storyboard-card[data-sequence-item-id]"
    ).forEach((x) => {
      if (x.classList.contains("is-dragging"))
        return;
      const V = x.dataset.sequenceItemId || "", W = d.get(V);
      if (!W || N)
        return;
      const Ee = x.getBoundingClientRect(), me = W.left - Ee.left, ie = W.top - Ee.top;
      if (Math.abs(me) < 1 && Math.abs(ie) < 1)
        return;
      te.current.get(V)?.cancel();
      const ge = x.animate(
        [
          { transform: `translate3d(${me}px, ${ie}px, 0)` },
          { transform: "translate3d(0, 0, 0)" }
        ],
        {
          duration: 190,
          easing: "cubic-bezier(0.2, 0.75, 0.25, 1)"
        }
      );
      te.current.set(V, ge), ge.onfinish = () => {
        te.current.get(V) === ge && te.current.delete(V);
      };
    }), d.clear();
  }, [xe]), H(() => {
    Qe.current !== o && (Qe.current = o, !we.current && (Oe.current = e, w(e), S("saved")));
  }, [o, e]), H(() => {
    O && !ne && $("");
  }, [ne, O]), H(() => {
    B && !ze && A("");
  }, [ze, B]), H(() => {
    if (!I)
      return;
    if (I.materialId && _.materials.some((f) => f.id === I.materialId)) {
      c(null), $(""), A(I.materialId);
      return;
    }
    if (I.shotId && _.shots.some((f) => f.id === I.shotId)) {
      c(null), A(""), $(I.shotId);
      return;
    }
    const d = window.requestAnimationFrame(() => {
      const f = I.materialType ? `[data-storyboard-material-type="${I.materialType}"]` : I.section === "materials" ? ".ws-storyboard-material-settings" : ".ws-storyboard-grid";
      de.current?.querySelector(f)?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(d);
  }, [
    I?.materialId,
    I?.materialType,
    I?.section,
    I?.shotId
  ]), H(() => {
    if (!et || !we.current || !a)
      return;
    q.current && window.clearTimeout(q.current);
    const d = _, f = ue.current;
    return q.current = window.setTimeout(() => {
      q.current = null, Ze.current = Ze.current.catch(() => {
      }).then(async () => {
        pe.current && f === ue.current && S("saving");
        try {
          if (await a(d), !pe.current || f !== ue.current)
            return;
          we.current = !1, S("saved");
        } catch {
          if (!pe.current || f !== ue.current)
            return;
          S("error");
        }
      });
    }, 800), () => {
      q.current && (window.clearTimeout(q.current), q.current = null);
    };
  }, [et, _, a]);
  const U = (d) => {
    if (!z)
      return;
    const f = he ? e : Oe.current, N = d(f), x = Or(
      xn(Tn(f, N)),
      tt.options
    );
    if (Oe.current = x, he) {
      l?.(x);
      return;
    }
    we.current = !0, ue.current += 1, w(x), S("typing");
  }, nt = () => {
    const d = de.current;
    if (!d)
      return;
    const f = /* @__PURE__ */ new Map();
    d.querySelectorAll(
      ".ws-storyboard-card[data-sequence-item-id]"
    ).forEach((N) => {
      const x = N.dataset.sequenceItemId || "";
      x && f.set(x, N.getBoundingClientRect());
    }), Je.current = f;
  }, Qt = (d) => {
    const f = _.shots.map((N) => N.id);
    Me.current = d, ee.current = f, Z(d), $e(""), Te(f);
  }, Zt = (d, f) => {
    const N = Me.current, x = ee.current;
    if (!N || !d || N === d || !x.length || !x.includes(N) || !x.includes(d))
      return;
    const V = f.currentTarget.getBoundingClientRect(), W = f.currentTarget.parentElement?.getBoundingClientRect(), me = !!(W && V.width * 1.5 < W.width) ? f.clientX < V.left + V.width / 2 ? "before" : "after" : f.clientY < V.top + V.height / 2 ? "before" : "after", ie = ir(
      x,
      N,
      d,
      me,
      (ge) => ge
    );
    $e(d), Wt(me), !Be(x, ie) && (nt(), ee.current = ie, Te(ie));
  }, rt = () => {
    const d = ee.current, f = _.shots.map((N) => N.id);
    d.length > 0 && !Be(d, f) && nt(), Me.current = "", ee.current = [], Z(""), $e(""), Te([]);
  }, en = () => {
    const d = ee.current;
    d.length > 0 && U((f) => {
      const N = ht(f.shots, d, (x) => x.id);
      return Be(
        f.shots.map((x) => x.id),
        N.map((x) => x.id)
      ) ? f : { ...f, shots: N };
    }), rt();
  }, tn = (d) => {
    U(
      (f) => Se(
        f,
        f.shots.map((N) => N.id === d.id ? d : N)
      )
    ), $("");
  }, nn = (d) => {
    U((f) => {
      const N = f.materials.some((x) => x.id === d.id);
      return {
        ...f,
        materials: N ? f.materials.map(
          (x) => x.id === d.id ? d : x
        ) : [...f.materials, d]
      };
    }), A(""), c(null);
  }, rn = (d) => {
    A(""), c(Dn(_.materials, d));
  }, an = (d) => {
    const f = at(_, d);
    f.shotIds.length || f.speechIds.length || (U((N) => ({
      ...N,
      materials: N.materials.filter((x) => x.id !== d)
    })), A(""), c(null));
  }, sn = (d) => {
    U((f) => f.shots.length <= 1 ? f : Se(
      f,
      f.shots.filter((N) => N.id !== d)
    ));
  }, on = (d) => {
    U((f) => {
      if (f.shots.length >= J)
        return f;
      const N = Ar(f.shots, d), x = f.shots.findIndex((W) => W.id === d.id), V = [...f.shots];
      return V.splice(x + 1, 0, N), Se(f, V);
    });
  }, cn = () => {
    U((d) => d.shots.length >= J ? d : Se(d, [
      ...d.shots,
      Kt(d.shots)
    ]));
  };
  return /* @__PURE__ */ s(
    "section",
    {
      ref: de,
      className: `ws-storyboard is-${t} ${z ? "is-editable" : "is-readonly"}`,
      "aria-label": "分镜脚本",
      children: [
        /* @__PURE__ */ s("div", { className: "ws-storyboard-layout", children: [
          /* @__PURE__ */ s("aside", { className: "ws-storyboard-sidebar", "aria-label": "脚本基本信息", children: [
            /* @__PURE__ */ s("section", { className: "ws-storyboard-overview", children: [
              /* @__PURE__ */ s("header", { children: [
                /* @__PURE__ */ n(ve, { size: 14 }),
                /* @__PURE__ */ n("strong", { children: "内容简介" })
              ] }),
              z ? /* @__PURE__ */ n(
                "textarea",
                {
                  className: "nodrag nopan nowheel",
                  value: _.summary,
                  rows: 3,
                  placeholder: "概括故事背景、核心事件和结局走向",
                  disabled: r,
                  onChange: (d) => U((f) => ({
                    ...f,
                    summary: d.target.value
                  }))
                }
              ) : /* @__PURE__ */ n("p", { children: In(_) })
            ] }),
            /* @__PURE__ */ s("section", { className: "ws-storyboard-storyline", children: [
              /* @__PURE__ */ s("header", { children: [
                /* @__PURE__ */ n(ve, { size: 14 }),
                /* @__PURE__ */ n("strong", { children: "叙事主线" })
              ] }),
              /* @__PURE__ */ n("div", { children: xr.map((d) => /* @__PURE__ */ s("label", { children: [
                /* @__PURE__ */ n("strong", { children: d.label }),
                z ? /* @__PURE__ */ n(
                  "textarea",
                  {
                    className: "nodrag nopan nowheel",
                    value: _.storyline[d.key],
                    rows: 2,
                    placeholder: d.placeholder,
                    disabled: r,
                    onChange: (f) => U((N) => ({
                      ...N,
                      storyline: {
                        ...N.storyline,
                        [d.key]: f.target.value
                      }
                    }))
                  }
                ) : /* @__PURE__ */ n("p", { children: _.storyline[d.key] })
              ] }, d.key)) })
            ] }),
            /* @__PURE__ */ n(
              Nr,
              {
                storyboard: _,
                referenceItems: k,
                editable: z,
                disabled: r,
                onChange: (d) => U(() => d)
              }
            ),
            /* @__PURE__ */ s("section", { className: "ws-storyboard-basic-settings", children: [
              /* @__PURE__ */ n("header", { children: /* @__PURE__ */ n("strong", { children: "基础设置" }) }),
              /* @__PURE__ */ s("div", { className: "ws-storyboard-global-settings", children: [
                /* @__PURE__ */ s("label", { children: [
                  /* @__PURE__ */ n("strong", { children: /* @__PURE__ */ n(Y, { label: "写实影像包含真人、摄影和超写实；非写实影像包含动画、插画、漫画、卡通 3D、水墨等", children: /* @__PURE__ */ n("span", { children: "画面类型" }) }) }),
                  z ? /* @__PURE__ */ n(
                    "select",
                    {
                      className: "nodrag nopan",
                      value: _.visual_mode,
                      disabled: r,
                      onChange: (d) => U((f) => ({
                        ...f,
                        visual_mode: d.target.value
                      })),
                      children: Rn.map((d) => /* @__PURE__ */ n("option", { value: d, children: st[d] }, d))
                    }
                  ) : /* @__PURE__ */ n("span", { children: st[_.visual_mode] })
                ] }),
                /* @__PURE__ */ s("label", { children: [
                  /* @__PURE__ */ n("strong", { children: "画幅" }),
                  z ? /* @__PURE__ */ n(
                    "select",
                    {
                      className: "nodrag nopan",
                      value: _.aspect_ratio,
                      disabled: r,
                      onChange: (d) => U((f) => ({
                        ...f,
                        aspect_ratio: d.target.value
                      })),
                      children: $n.map((d) => /* @__PURE__ */ n("option", { value: d, children: d }, d))
                    }
                  ) : /* @__PURE__ */ n("span", { children: _.aspect_ratio })
                ] }),
                /* @__PURE__ */ s("label", { children: [
                  /* @__PURE__ */ n("strong", { children: "目标时长" }),
                  z ? /* @__PURE__ */ n(
                    "input",
                    {
                      className: "nodrag nopan",
                      type: "number",
                      min: Ye,
                      step: 1,
                      value: _.target_duration,
                      disabled: r,
                      onChange: (d) => U((f) => ({
                        ...f,
                        target_duration: qe(
                          d,
                          f.target_duration,
                          Ye
                        )
                      }))
                    }
                  ) : /* @__PURE__ */ s("span", { children: [
                    _.target_duration,
                    " 秒"
                  ] })
                ] }),
                /* @__PURE__ */ s("label", { children: [
                  /* @__PURE__ */ n("strong", { children: "目标镜头" }),
                  z ? /* @__PURE__ */ n(
                    "input",
                    {
                      className: "nodrag nopan",
                      type: "number",
                      min: 1,
                      max: J,
                      step: 1,
                      value: _.target_shot_count,
                      disabled: r,
                      onChange: (d) => U((f) => ({
                        ...f,
                        target_shot_count: Math.min(
                          J,
                          qe(
                            d,
                            f.target_shot_count,
                            1
                          )
                        )
                      }))
                    }
                  ) : /* @__PURE__ */ s("span", { children: [
                    _.target_shot_count,
                    " 个"
                  ] })
                ] }),
                /* @__PURE__ */ s("label", { className: "ws-storyboard-setting-wide", children: [
                  /* @__PURE__ */ n("strong", { children: "旁白音色" }),
                  z ? /* @__PURE__ */ n(
                    "input",
                    {
                      className: "nodrag nopan",
                      value: _.narrator_voice,
                      placeholder: "能力默认",
                      disabled: r,
                      onChange: (d) => U((f) => ({
                        ...f,
                        narrator_voice: d.target.value
                      }))
                    }
                  ) : /* @__PURE__ */ n("span", { children: _.narrator_voice || "能力默认" })
                ] }),
                /* @__PURE__ */ s("div", { className: "ws-storyboard-style", children: [
                  /* @__PURE__ */ n("strong", { children: "统一视觉风格" }),
                  z ? /* @__PURE__ */ n(
                    "input",
                    {
                      className: "nodrag nopan",
                      value: _.style_prompt,
                      placeholder: "整部作品保持一致的画面风格",
                      disabled: r,
                      onChange: (d) => U(
                        (f) => zn(f, d.target.value)
                      )
                    }
                  ) : /* @__PURE__ */ n(Y, { label: _.style_prompt, children: /* @__PURE__ */ n("span", { children: _.style_prompt || "未设置统一视觉风格" }) })
                ] })
              ] })
            ] }),
            _.materials.length || z ? /* @__PURE__ */ n(
              Dr,
              {
                materials: _.materials,
                editable: z,
                onOpen: A,
                onCreate: rn
              }
            ) : null
          ] }),
          /* @__PURE__ */ s("main", { className: "ws-storyboard-main", children: [
            /* @__PURE__ */ n("header", { className: "ws-storyboard-toolbar", children: /* @__PURE__ */ s("div", { className: "ws-storyboard-toolbar-end", children: [
              C || z && y ? /* @__PURE__ */ s("div", { className: "ws-storyboard-toolbar-meta", children: [
                C ? /* @__PURE__ */ s("span", { children: [
                  _.shots.length,
                  " 个镜头 ·",
                  " ",
                  Rt(_),
                  " 秒 ·",
                  " ",
                  Ct(_),
                  " 条语音 ·",
                  " ",
                  kt(_),
                  " 条字幕"
                ] }) : null,
                z && y ? /* @__PURE__ */ n(
                  Er,
                  {
                    status: he ? g || "saved" : M
                  }
                ) : null
              ] }) : null,
              z ? /* @__PURE__ */ s(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command nodrag nopan",
                  disabled: r || _.shots.length >= J,
                  onClick: cn,
                  children: [
                    /* @__PURE__ */ n(ye, { size: 13 }),
                    /* @__PURE__ */ n("span", { children: "添加镜头" })
                  ]
                }
              ) : null,
              fe && v ? /* @__PURE__ */ s(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command",
                  disabled: r || !!h,
                  onClick: () => {
                    v();
                  },
                  children: [
                    h === "revising" ? /* @__PURE__ */ n(be, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ n(wt, { size: 13 }),
                    h === "revising" ? "创建中" : "创建修订稿"
                  ]
                }
              ) : !fe && z ? /* @__PURE__ */ s(oe, { children: [
                p ? /* @__PURE__ */ s(
                  "button",
                  {
                    type: "button",
                    className: "ws-storyboard-command",
                    disabled: r || !!h,
                    onClick: () => F(!0),
                    children: [
                      h === "reviewing" ? /* @__PURE__ */ n(be, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ n(pn, { size: 13 }),
                      h === "reviewing" ? "审查中" : "AI 审查并优化"
                    ]
                  }
                ) : null,
                u ? /* @__PURE__ */ s(
                  "button",
                  {
                    type: "button",
                    className: "ws-storyboard-command is-primary",
                    disabled: r || !!h || Jt,
                    onClick: () => m(!0),
                    children: [
                      h === "confirming" ? /* @__PURE__ */ n(be, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ n(ce, { size: 13 }),
                      h === "confirming" ? "确认中" : "确认脚本"
                    ]
                  }
                ) : null
              ] }) : null
            ] }) }),
            z && Pe.length ? /* @__PURE__ */ n(
              Sr,
              {
                issues: Pe,
                onOpen: (d) => {
                  if (d.materialId) {
                    $(""), c(null), A(d.materialId);
                    return;
                  }
                  d.shotId && (A(""), c(null), $(d.shotId));
                }
              }
            ) : null,
            /* @__PURE__ */ n("div", { className: "ws-storyboard-grid nowheel", children: _.shots.length ? Gt.map((d, f) => /* @__PURE__ */ n(
              sr,
              {
                shot: d,
                index: f,
                storyboard: _,
                selected: O === d.id,
                editable: z,
                dragging: E === d.id,
                dropPlacement: le === d.id && E !== d.id ? Ht : void 0,
                onOpen: () => $(d.id),
                onDuplicate: () => on(d),
                onRemove: () => sn(d.id),
                onDragStart: () => Qt(d.id),
                onDragOver: (N) => Zt(d.id, N),
                onDrop: en,
                onDragEnd: rt
              },
              d.id
            )) : /* @__PURE__ */ s("div", { className: "ws-storyboard-empty", children: [
              /* @__PURE__ */ n(ve, { size: 26 }),
              /* @__PURE__ */ n("strong", { children: "暂无镜头" }),
              /* @__PURE__ */ n("span", { children: "添加第一个镜头后开始编排脚本" })
            ] }) })
          ] })
        ] }),
        b && u && !fe ? /* @__PURE__ */ n(
          ur,
          {
            storyboard: _,
            submitting: h === "confirming",
            portalContainer: De,
            onClose: () => m(!1),
            onConfirm: (d) => u(_, d)
          }
        ) : null,
        /* @__PURE__ */ n(
          Rr,
          {
            open: D && !!p && !fe,
            onOpenChange: (d) => {
              h || F(d);
            },
            title: "AI 审查并优化分镜",
            desc: "将基于当前内容重新生成一份优化后的完整分镜。开始后会关闭详情页，可在画布节点查看生成进度。",
            confirmText: "开始优化",
            handleConfirm: () => {
              F(!1), p?.(_);
            },
            isLoading: h === "reviewing"
          }
        ),
        ne ? /* @__PURE__ */ n(
          Mr,
          {
            shot: ne,
            index: _.shots.findIndex((d) => d.id === ne.id),
            materials: _.materials,
            readonly: !z,
            referenceAdapter: tt,
            portalContainer: De,
            onEditMaterial: A,
            onSave: tn,
            onClose: () => $("")
          },
          ne.id
        ) : null,
        re ? /* @__PURE__ */ n(
          lr,
          {
            material: re,
            creating: !!P,
            readonly: !z,
            usage: Xt,
            existingNames: _.materials.filter((d) => d.id !== re.id).map((d) => d.name),
            portalContainer: De,
            onSave: nn,
            onRemove: an,
            onClose: () => {
              A(""), c(null);
            }
          },
          `${P ? "create" : "edit"}:${re.id}`
        ) : null
      ]
    }
  );
}
function Dr({
  materials: e,
  editable: t,
  onOpen: i,
  onCreate: r
}) {
  return /* @__PURE__ */ s("section", { className: "ws-storyboard-material-settings", "aria-label": "素材设定", children: [
    /* @__PURE__ */ s("header", { children: [
      /* @__PURE__ */ n("strong", { children: "素材设定" }),
      t ? /* @__PURE__ */ n("div", { className: "ws-storyboard-material-add-actions", children: ["character", "scene", "prop"].map((a) => /* @__PURE__ */ s(
        "button",
        {
          type: "button",
          className: "nodrag nopan",
          onClick: () => r(a),
          children: [
            /* @__PURE__ */ n(ye, { size: 11 }),
            Q[a]
          ]
        },
        a
      )) }) : null
    ] }),
    /* @__PURE__ */ s("div", { className: "ws-storyboard-material-setting-list", children: [
      ["character", "scene", "prop"].map((a) => {
        const l = e.filter(
          (u) => u.type === a
        );
        return l.length ? /* @__PURE__ */ s(
          "div",
          {
            className: "ws-storyboard-material-setting-group",
            "data-storyboard-material-type": a,
            children: [
              /* @__PURE__ */ n("span", { children: Q[a] }),
              l.map((u) => /* @__PURE__ */ n(
                Y,
                {
                  label: `${t ? "编辑" : "查看"}${Q[a]}提示词：${u.name}`,
                  children: /* @__PURE__ */ s(
                    "button",
                    {
                      type: "button",
                      className: "nodrag nopan",
                      onClick: () => i(u.id),
                      children: [
                        /* @__PURE__ */ n("span", { children: u.name }),
                        t ? /* @__PURE__ */ n(St, { size: 11 }) : null
                      ]
                    }
                  )
                },
                u.id
              ))
            ]
          },
          a
        ) : null;
      }),
      e.length ? null : /* @__PURE__ */ n("span", { className: "ws-storyboard-material-setting-empty", children: "暂无角色、场景或道具" })
    ] })
  ] });
}
function Mr({
  shot: e,
  index: t,
  materials: i,
  readonly: r,
  referenceAdapter: a,
  portalContainer: l,
  onEditMaterial: u,
  onSave: p,
  onClose: v
}) {
  const [h, g] = L(() => qt(e)), y = i.filter(
    (c) => c.type === "character"
  ), C = new Set(
    h.speech.filter((c) => c.kind === "dialogue").map((c) => c.character_id || "").filter(Boolean)
  ), k = Tt(h), I = h.speech.some(
    (c) => c.start_time < 0 || c.start_time >= h.duration
  ), o = t > 0 && (h.continue_previous && !h.continuity_anchor.trim() || h.continue_previous && h.match_previous), R = !h.beat.trim() || t > 0 && !h.transition.trim(), w = h.captions.some(
    (c) => !c.text.trim() || c.start_time < 0 || c.end_time <= c.start_time || c.end_time > h.duration
  ), M = (c, b, m) => {
    g((D) => ({
      ...D,
      ...Pr(D, c, b, m)
    }));
  }, S = (c, b) => {
    g((m) => {
      const D = m.speech.map(
        (E) => E.id === c ? Br(E, b) : E
      ), F = D.filter((E) => E.kind === "dialogue").map((E) => E.character_id || "").filter(Boolean);
      return {
        ...m,
        material_ids: [.../* @__PURE__ */ new Set([...m.material_ids, ...F])],
        speech: D
      };
    });
  }, O = (c) => {
    g((b) => b.material_ids.includes(c) ? C.has(c) ? b : {
      ...b,
      material_ids: b.material_ids.filter((m) => m !== c)
    } : {
      ...b,
      material_ids: [...b.material_ids, c]
    });
  }, $ = (c, b) => {
    g((m) => {
      const D = m.speech.findIndex(
        (le) => le.id === c
      ), F = D + b;
      if (D < 0 || F < 0 || F >= m.speech.length)
        return m;
      const E = [...m.speech], [Z] = E.splice(D, 1);
      return E.splice(F, 0, Z), { ...m, speech: E };
    });
  }, B = (c, b) => {
    g((m) => ({
      ...m,
      captions: m.captions.map(
        (D) => D.id === c ? { ...D, ...b } : D
      )
    }));
  }, A = (c, b) => {
    g((m) => {
      const D = m.captions.findIndex(
        (le) => le.id === c
      ), F = D + b;
      if (D < 0 || F < 0 || F >= m.captions.length)
        return m;
      const E = [...m.captions], [Z] = E.splice(D, 1);
      return E.splice(F, 0, Z), { ...m, captions: E };
    });
  }, P = /* @__PURE__ */ n("div", { className: "ws-storyboard-shot-backdrop", onMouseDown: v, children: /* @__PURE__ */ s(
    "section",
    {
      className: "ws-storyboard-shot-dialog",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `${r ? "查看" : "编辑"}镜头 ${t + 1}`,
      onMouseDown: (c) => c.stopPropagation(),
      children: [
        /* @__PURE__ */ s("header", { children: [
          /* @__PURE__ */ s("div", { children: [
            /* @__PURE__ */ s("strong", { children: [
              r ? "查看镜头" : "编辑镜头",
              " ",
              String(t + 1).padStart(2, "0")
            ] }),
            /* @__PURE__ */ n("span", { children: r ? "当前分镜已经确认" : "修改会保存到当前分镜草稿" })
          ] }),
          /* @__PURE__ */ n(Y, { label: "关闭", children: /* @__PURE__ */ n("button", { type: "button", "aria-label": "关闭", onClick: v, children: /* @__PURE__ */ n(We, { size: 18 }) }) })
        ] }),
        /* @__PURE__ */ s("div", { className: "ws-storyboard-shot-form nowheel", children: [
          /* @__PURE__ */ s("section", { className: "ws-storyboard-shot-section", children: [
            /* @__PURE__ */ s("div", { className: "ws-storyboard-shot-section-head", children: [
              /* @__PURE__ */ n("strong", { children: "镜头内容" }),
              /* @__PURE__ */ s("div", { children: [
                /* @__PURE__ */ s("label", { className: "ws-storyboard-continuity-input", children: [
                  /* @__PURE__ */ n(
                    "input",
                    {
                      type: "checkbox",
                      checked: t > 0 && h.match_previous,
                      disabled: r || t === 0,
                      onChange: (c) => g((b) => ({
                        ...b,
                        match_previous: t > 0 && c.target.checked,
                        continue_previous: c.target.checked ? !1 : b.continue_previous,
                        continuity_anchor: c.target.checked ? "" : b.continuity_anchor
                      }))
                    }
                  ),
                  "匹配上一镜画面"
                ] }),
                /* @__PURE__ */ s("label", { className: "ws-storyboard-continuity-input", children: [
                  /* @__PURE__ */ n(
                    "input",
                    {
                      type: "checkbox",
                      checked: t > 0 && h.continue_previous,
                      disabled: r || t === 0,
                      onChange: (c) => g((b) => ({
                        ...b,
                        match_previous: c.target.checked ? !1 : b.match_previous,
                        continue_previous: t > 0 && c.target.checked,
                        continuity_anchor: t > 0 && c.target.checked ? b.continuity_anchor : ""
                      }))
                    }
                  ),
                  "承接上一镜头"
                ] }),
                /* @__PURE__ */ s("label", { children: [
                  "时长",
                  /* @__PURE__ */ n(
                    "input",
                    {
                      type: "number",
                      min: Ye,
                      step: 1,
                      value: h.duration,
                      disabled: r,
                      onChange: (c) => g((b) => ({
                        ...b,
                        duration: Lr(
                          c,
                          b.duration
                        )
                      }))
                    }
                  ),
                  "秒"
                ] })
              ] })
            ] }),
            t > 0 && h.continue_previous ? /* @__PURE__ */ s("label", { className: "ws-storyboard-continuity-anchor", children: [
              /* @__PURE__ */ n("span", { children: "连续性锚点" }),
              /* @__PURE__ */ n(
                "textarea",
                {
                  value: h.continuity_anchor,
                  readOnly: r,
                  placeholder: "写明上一镜头结束时需要延续的主体位置、姿态、动作方向、道具状态和光线",
                  onChange: (c) => g((b) => ({
                    ...b,
                    continuity_anchor: c.target.value
                  }))
                }
              )
            ] }) : null,
            o ? /* @__PURE__ */ n("p", { className: "ws-storyboard-form-error", children: "画面匹配和视频延续不能同时启用；延续上一镜头时必须填写连续性锚点。" }) : null,
            /* @__PURE__ */ s(
              "div",
              {
                className: `ws-storyboard-shot-field-row ${t === 0 ? "is-single" : ""}`,
                children: [
                  /* @__PURE__ */ n(
                    yt,
                    {
                      label: "本镜变化",
                      value: h.beat,
                      placeholder: "本镜头带来的一项新信息、动作结果或关系变化",
                      readonly: r,
                      onChange: (c) => g((b) => ({ ...b, beat: c }))
                    }
                  ),
                  t > 0 ? /* @__PURE__ */ n(
                    yt,
                    {
                      label: "与上镜关系",
                      value: h.transition,
                      placeholder: "上一镜头的什么结果触发本镜，或通过什么明确方式转场",
                      readonly: r,
                      onChange: (c) => g((b) => ({
                        ...b,
                        transition: c
                      }))
                    }
                  ) : null
                ]
              }
            ),
            t > 0 ? /* @__PURE__ */ s("div", { className: "ws-storyboard-shot-field-row", children: [
              /* @__PURE__ */ s("label", { children: [
                /* @__PURE__ */ n("span", { children: "剪辑转场" }),
                /* @__PURE__ */ n(
                  "select",
                  {
                    value: h.transition_type,
                    disabled: r,
                    onChange: (c) => g((b) => {
                      const m = c.target.value;
                      return {
                        ...b,
                        transition_type: m,
                        transition_duration_ms: m === "none" ? 0 : Math.max(500, b.transition_duration_ms)
                      };
                    }),
                    children: xt.map((c) => /* @__PURE__ */ n("option", { value: c, children: Mn[c] }, c))
                  }
                )
              ] }),
              h.transition_type !== "none" ? /* @__PURE__ */ s("label", { children: [
                /* @__PURE__ */ n("span", { children: "转场时长" }),
                /* @__PURE__ */ n(
                  "input",
                  {
                    type: "number",
                    min: 100,
                    max: 5e3,
                    step: 100,
                    value: h.transition_duration_ms,
                    disabled: r,
                    onChange: (c) => g((b) => ({
                      ...b,
                      transition_duration_ms: Math.min(
                        5e3,
                        qe(
                          c,
                          b.transition_duration_ms,
                          100
                        )
                      )
                    }))
                  }
                )
              ] }) : null
            ] }) : null,
            R ? /* @__PURE__ */ n("p", { className: "ws-storyboard-form-error", children: "请填写本镜变化；除第一镜外，还需要说明与上一镜头的承接关系。" }) : null,
            /* @__PURE__ */ n("div", { className: "ws-storyboard-shot-field-row is-single", children: /* @__PURE__ */ n(
              Ue,
              {
                label: "镜头描述",
                value: h.description,
                content: h.reference_contents?.description,
                placeholder: "描述开场状态、核心内容或动作，以及结束状态",
                readonly: r,
                referenceAdapter: a,
                onChange: (c, b) => M("description", c, b)
              }
            ) }),
            /* @__PURE__ */ s("div", { className: "ws-storyboard-shot-field-row", children: [
              /* @__PURE__ */ n(
                Ue,
                {
                  label: "镜头语言",
                  value: h.camera_instruction,
                  content: h.reference_contents?.camera_instruction,
                  placeholder: "景别、机位和运动方式",
                  readonly: r,
                  referenceAdapter: a,
                  onChange: (c, b) => M("camera_instruction", c, b)
                }
              ),
              /* @__PURE__ */ n(
                Ue,
                {
                  label: "视频提示词",
                  value: h.video_prompt,
                  content: h.reference_contents?.video_prompt,
                  placeholder: "完整描述动作、运镜、光线与风格",
                  readonly: r,
                  referenceAdapter: a,
                  onChange: (c, b) => M("video_prompt", c, b)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ s("section", { className: "ws-storyboard-shot-section", children: [
            /* @__PURE__ */ n("div", { className: "ws-storyboard-shot-section-head", children: /* @__PURE__ */ s("div", { children: [
              /* @__PURE__ */ n("strong", { children: "关联素材" }),
              /* @__PURE__ */ s("span", { children: [
                h.material_ids.length,
                " 个素材"
              ] })
            ] }) }),
            i.length ? /* @__PURE__ */ n("div", { className: "ws-storyboard-material-groups", children: ["character", "scene", "prop"].map((c) => {
              const b = i.filter(
                (m) => m.type === c
              );
              return b.length ? /* @__PURE__ */ s("fieldset", { children: [
                /* @__PURE__ */ n("legend", { children: Q[c] }),
                /* @__PURE__ */ n("div", { children: b.map((m) => {
                  const D = h.material_ids.includes(
                    m.id
                  ), F = C.has(m.id);
                  return /* @__PURE__ */ s(
                    "div",
                    {
                      className: "ws-storyboard-material-option",
                      children: [
                        /* @__PURE__ */ n(
                          Y,
                          {
                            label: D && F ? "该角色已用于对白，不能取消关联" : D ? "取消关联" : "关联素材",
                            children: /* @__PURE__ */ s("label", { children: [
                              /* @__PURE__ */ n(
                                "input",
                                {
                                  type: "checkbox",
                                  checked: D,
                                  disabled: r || D && F,
                                  onChange: () => O(m.id)
                                }
                              ),
                              /* @__PURE__ */ s("span", { className: "sr-only", children: [
                                "关联 ",
                                m.name
                              ] })
                            ] })
                          }
                        ),
                        /* @__PURE__ */ n(
                          Y,
                          {
                            label: `${r ? "查看" : "编辑"}${Q[c]}提示词：${m.name}`,
                            children: /* @__PURE__ */ s(
                              "button",
                              {
                                type: "button",
                                onClick: () => u(m.id),
                                children: [
                                  /* @__PURE__ */ n("span", { children: m.name }),
                                  r ? null : /* @__PURE__ */ n(St, { size: 11 })
                                ]
                              }
                            )
                          }
                        )
                      ]
                    },
                    m.id
                  );
                }) })
              ] }, c) : null;
            }) }) : /* @__PURE__ */ n("div", { className: "ws-storyboard-material-empty", children: "当前脚本没有角色、场景或道具素材" })
          ] }),
          /* @__PURE__ */ s("section", { className: "ws-storyboard-shot-section", children: [
            /* @__PURE__ */ s("div", { className: "ws-storyboard-shot-section-head", children: [
              /* @__PURE__ */ s("div", { children: [
                /* @__PURE__ */ n("strong", { children: "角色配音与旁白" }),
                /* @__PURE__ */ s("span", { children: [
                  h.speech.length,
                  " 条语音"
                ] })
              ] }),
              r ? null : /* @__PURE__ */ s("div", { children: [
                /* @__PURE__ */ s(
                  "button",
                  {
                    type: "button",
                    onClick: () => g((c) => ({
                      ...c,
                      speech: [
                        ...c.speech,
                        ot(c, "dialogue")
                      ]
                    })),
                    children: [
                      /* @__PURE__ */ n(ye, { size: 13 }),
                      "添加对白"
                    ]
                  }
                ),
                /* @__PURE__ */ s(
                  "button",
                  {
                    type: "button",
                    onClick: () => g((c) => ({
                      ...c,
                      speech: [
                        ...c.speech,
                        ot(c, "narration")
                      ]
                    })),
                    children: [
                      /* @__PURE__ */ n(ye, { size: 13 }),
                      "添加旁白"
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ n("div", { className: "ws-storyboard-speech-list", children: h.speech.length ? h.speech.map((c, b) => /* @__PURE__ */ s("div", { className: "ws-storyboard-speech-row", children: [
              /* @__PURE__ */ s("div", { className: "ws-storyboard-speech-row-head", children: [
                /* @__PURE__ */ s("strong", { children: [
                  "语音 ",
                  b + 1
                ] }),
                r ? null : /* @__PURE__ */ s("div", { children: [
                  /* @__PURE__ */ n(
                    ae,
                    {
                      label: "上移语音",
                      disabled: b === 0,
                      onClick: () => $(c.id, -1),
                      children: /* @__PURE__ */ n(lt, { size: 13 })
                    }
                  ),
                  /* @__PURE__ */ n(
                    ae,
                    {
                      label: "下移语音",
                      disabled: b === h.speech.length - 1,
                      onClick: () => $(c.id, 1),
                      children: /* @__PURE__ */ n(it, { size: 13 })
                    }
                  ),
                  /* @__PURE__ */ n(
                    ae,
                    {
                      label: "删除语音",
                      danger: !0,
                      onClick: () => g((m) => ({
                        ...m,
                        speech: m.speech.filter(
                          (D) => D.id !== c.id
                        )
                      })),
                      children: /* @__PURE__ */ n(Ce, { size: 13 })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ s("div", { className: "ws-storyboard-speech-fields", children: [
                /* @__PURE__ */ s("label", { children: [
                  "类型",
                  /* @__PURE__ */ s(
                    "select",
                    {
                      value: c.kind,
                      disabled: r,
                      onChange: (m) => S(c.id, {
                        kind: m.target.value
                      }),
                      children: [
                        /* @__PURE__ */ n("option", { value: "dialogue", children: "角色对白" }),
                        /* @__PURE__ */ n("option", { value: "narration", children: "旁白" })
                      ]
                    }
                  )
                ] }),
                c.kind === "dialogue" ? /* @__PURE__ */ s(oe, { children: [
                  /* @__PURE__ */ s("label", { children: [
                    "角色",
                    /* @__PURE__ */ s(
                      "select",
                      {
                        value: c.character_id || "",
                        disabled: r,
                        onChange: (m) => S(c.id, {
                          character_id: m.target.value
                        }),
                        children: [
                          /* @__PURE__ */ n("option", { value: "", children: "请选择角色" }),
                          y.map((m) => /* @__PURE__ */ n("option", { value: m.id, children: m.name }, m.id))
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ s("label", { children: [
                    "说话方式",
                    /* @__PURE__ */ s(
                      "select",
                      {
                        value: c.speaker_mode || "offscreen",
                        disabled: r,
                        onChange: (m) => S(c.id, {
                          speaker_mode: m.target.value === "visible" ? "visible" : "offscreen"
                        }),
                        children: [
                          /* @__PURE__ */ n("option", { value: "visible", children: "出镜对白" }),
                          /* @__PURE__ */ n("option", { value: "offscreen", children: "画外音" })
                        ]
                      }
                    )
                  ] })
                ] }) : null,
                /* @__PURE__ */ s("label", { children: [
                  "开始时间",
                  /* @__PURE__ */ s("span", { className: "ws-storyboard-time-input", children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: "number",
                        min: 0,
                        max: Math.max(0, h.duration - 0.01),
                        step: 0.1,
                        value: c.start_time,
                        disabled: r,
                        onChange: (m) => S(c.id, {
                          start_time: Ve(m)
                        })
                      }
                    ),
                    "秒"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ s("label", { className: "ws-storyboard-speech-text", children: [
                "文本",
                /* @__PURE__ */ n(
                  "textarea",
                  {
                    value: c.text,
                    readOnly: r,
                    placeholder: c.kind === "narration" ? "输入旁白" : "输入对白",
                    onChange: (m) => S(c.id, { text: m.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ s("div", { className: "ws-storyboard-speech-subtitle", children: [
                /* @__PURE__ */ s("label", { children: [
                  /* @__PURE__ */ n(
                    "input",
                    {
                      type: "checkbox",
                      checked: c.subtitle_enabled,
                      disabled: r,
                      onChange: (m) => S(c.id, {
                        subtitle_enabled: m.target.checked
                      })
                    }
                  ),
                  "加入字幕"
                ] }),
                c.subtitle_enabled ? /* @__PURE__ */ n(
                  "input",
                  {
                    value: c.subtitle_text,
                    readOnly: r,
                    placeholder: "可选：填写精简字幕；留空使用原文",
                    onChange: (m) => S(c.id, {
                      subtitle_text: m.target.value
                    })
                  }
                ) : null
              ] })
            ] }, c.id)) : /* @__PURE__ */ s("div", { className: "ws-storyboard-speech-empty", children: [
              /* @__PURE__ */ n(Mt, { size: 24 }),
              /* @__PURE__ */ n("span", { children: "当前镜头没有对白或旁白" })
            ] }) }),
            k.size > 1 ? /* @__PURE__ */ n("p", { className: "ws-storyboard-form-error", children: "一个镜头最多只能有一个出镜说话角色，请拆分镜头或改为画外音。" }) : null,
            I ? /* @__PURE__ */ n("p", { className: "ws-storyboard-form-error", children: "语音开始时间必须小于当前镜头时长。" }) : null
          ] }),
          /* @__PURE__ */ s("section", { className: "ws-storyboard-shot-section", children: [
            /* @__PURE__ */ s("div", { className: "ws-storyboard-shot-section-head", children: [
              /* @__PURE__ */ s("div", { children: [
                /* @__PURE__ */ n("strong", { children: "附加字幕文案" }),
                /* @__PURE__ */ s("span", { children: [
                  h.captions.length,
                  " 条文案"
                ] })
              ] }),
              r ? null : /* @__PURE__ */ s(
                "button",
                {
                  type: "button",
                  onClick: () => g((c) => ({
                    ...c,
                    captions: [
                      ...c.captions,
                      On(c)
                    ]
                  })),
                  children: [
                    /* @__PURE__ */ n(ye, { size: 13 }),
                    "添加文案"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ n("div", { className: "ws-storyboard-speech-list", children: h.captions.length ? h.captions.map((c, b) => /* @__PURE__ */ s("div", { className: "ws-storyboard-speech-row", children: [
              /* @__PURE__ */ s("div", { className: "ws-storyboard-speech-row-head", children: [
                /* @__PURE__ */ s("strong", { children: [
                  "文案 ",
                  b + 1
                ] }),
                r ? null : /* @__PURE__ */ s("div", { children: [
                  /* @__PURE__ */ n(
                    ae,
                    {
                      label: "上移文案",
                      disabled: b === 0,
                      onClick: () => A(c.id, -1),
                      children: /* @__PURE__ */ n(lt, { size: 13 })
                    }
                  ),
                  /* @__PURE__ */ n(
                    ae,
                    {
                      label: "下移文案",
                      disabled: b === h.captions.length - 1,
                      onClick: () => A(c.id, 1),
                      children: /* @__PURE__ */ n(it, { size: 13 })
                    }
                  ),
                  /* @__PURE__ */ n(
                    ae,
                    {
                      label: "删除文案",
                      danger: !0,
                      onClick: () => g((m) => ({
                        ...m,
                        captions: m.captions.filter(
                          (D) => D.id !== c.id
                        )
                      })),
                      children: /* @__PURE__ */ n(Ce, { size: 13 })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ s("div", { className: "ws-storyboard-speech-fields", children: [
                /* @__PURE__ */ s("label", { children: [
                  "类型",
                  /* @__PURE__ */ s(
                    "select",
                    {
                      value: c.type,
                      disabled: r,
                      onChange: (m) => B(c.id, {
                        type: m.target.value
                      }),
                      children: [
                        /* @__PURE__ */ n("option", { value: "caption", children: "说明" }),
                        /* @__PURE__ */ n("option", { value: "title", children: "标题" }),
                        /* @__PURE__ */ n("option", { value: "highlight", children: "重点" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ s("label", { children: [
                  "开始时间",
                  /* @__PURE__ */ s("span", { className: "ws-storyboard-time-input", children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: "number",
                        min: 0,
                        max: h.duration,
                        step: 0.1,
                        value: c.start_time,
                        disabled: r,
                        onChange: (m) => B(c.id, {
                          start_time: Ve(m)
                        })
                      }
                    ),
                    "秒"
                  ] })
                ] }),
                /* @__PURE__ */ s("label", { children: [
                  "结束时间",
                  /* @__PURE__ */ s("span", { className: "ws-storyboard-time-input", children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: "number",
                        min: 0.1,
                        max: h.duration,
                        step: 0.1,
                        value: c.end_time,
                        disabled: r,
                        onChange: (m) => B(c.id, {
                          end_time: Ve(m)
                        })
                      }
                    ),
                    "秒"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ s("label", { className: "ws-storyboard-speech-text", children: [
                "文本",
                /* @__PURE__ */ n(
                  "textarea",
                  {
                    value: c.text,
                    readOnly: r,
                    placeholder: "输入不对应语音的标题、说明或重点文字",
                    onChange: (m) => B(c.id, {
                      text: m.target.value
                    })
                  }
                )
              ] })
            ] }, c.id)) : /* @__PURE__ */ s("div", { className: "ws-storyboard-speech-empty", children: [
              /* @__PURE__ */ n(ve, { size: 24 }),
              /* @__PURE__ */ n("span", { children: "当前镜头没有附加字幕文案" })
            ] }) }),
            w ? /* @__PURE__ */ n("p", { className: "ws-storyboard-form-error", children: "字幕文案必须填写文本，并设置在镜头时长内的有效起止时间。" }) : null
          ] })
        ] }),
        /* @__PURE__ */ s("footer", { children: [
          /* @__PURE__ */ n("button", { type: "button", onClick: v, children: r ? "关闭" : "取消" }),
          r ? null : /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              className: "is-primary",
              disabled: k.size > 1 || I || R || o || w,
              onClick: () => p(h),
              children: [
                /* @__PURE__ */ n(ce, { size: 14 }),
                "确认修改"
              ]
            }
          )
        ] })
      ]
    }
  ) });
  return typeof document > "u" ? null : He(P, l || document.body);
}
function Ue({
  label: e,
  value: t,
  content: i,
  placeholder: r,
  readonly: a,
  referenceAdapter: l,
  onChange: u
}) {
  return /* @__PURE__ */ s("label", { className: "ws-storyboard-shot-field", children: [
    /* @__PURE__ */ n("span", { children: e }),
    /* @__PURE__ */ n(
      Ft,
      {
        className: "ws-storyboard-reference-editor nodrag nopan nowheel",
        value: t,
        content: i,
        adapter: l,
        placeholder: r,
        disabled: a,
        layerZIndex: 2700,
        onChange: u
      }
    )
  ] });
}
function yt({
  label: e,
  value: t,
  placeholder: i,
  readonly: r,
  onChange: a
}) {
  return /* @__PURE__ */ s("label", { className: "ws-storyboard-shot-field", children: [
    /* @__PURE__ */ n("span", { children: e }),
    /* @__PURE__ */ n(
      "textarea",
      {
        className: "nodrag nopan nowheel ws-storyboard-plain-field",
        value: t,
        rows: 3,
        placeholder: i,
        readOnly: r,
        onChange: (l) => a(l.target.value)
      }
    )
  ] });
}
function Or(e, t) {
  return {
    ...e,
    shots: e.shots.map((i) => {
      const r = { ...i.reference_contents || {} };
      for (const a of zr) {
        const l = jn(
          i[a],
          r[a],
          t
        );
        l ? r[a] = l : delete r[a];
      }
      return { ...i, reference_contents: r };
    })
  };
}
const zr = [
  "description",
  "camera_instruction",
  "video_prompt"
];
function Pr(e, t, i, r) {
  const a = { ...e.reference_contents || {} };
  return r ? a[t] = r : delete a[t], {
    [t]: i,
    reference_contents: a
  };
}
function ae({
  label: e,
  disabled: t,
  danger: i = !1,
  onClick: r,
  children: a
}) {
  return /* @__PURE__ */ n(Y, { label: e, children: /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: `ws-storyboard-icon-button nodrag nopan ${i ? "is-danger" : ""}`,
      "aria-label": e,
      disabled: t,
      onClick: r,
      children: a
    }
  ) });
}
function Er({ status: e }) {
  return /* @__PURE__ */ s("span", { className: `ws-storyboard-save-state is-${e}`, children: [
    e === "saving" ? /* @__PURE__ */ n(be, { size: 12, className: "ws-spin" }) : e === "saved" ? /* @__PURE__ */ n(ce, { size: 12 }) : null,
    e === "typing" ? "编辑中" : e === "saving" ? "保存中" : e === "error" ? "保存失败" : "已保存"
  ] });
}
function Br(e, t) {
  const i = { ...e, ...t };
  return i.kind === "dialogue" ? (i.character_id ||= "", i.speaker_mode ||= "offscreen") : (delete i.character_id, delete i.speaker_mode), i.subtitle_enabled = !!i.subtitle_enabled, i.subtitle_text ||= "", i;
}
function Lr(e, t) {
  const i = Number(e.target.value);
  return $t(i) ? i : t;
}
function qe(e, t, i) {
  const r = Number(e.target.value);
  return Number.isInteger(r) && r >= i ? r : t;
}
function Ve(e) {
  const t = Number.parseFloat(e.target.value);
  return Number.isFinite(t) && t >= 0 ? t : 0;
}
function Kt(e) {
  const t = new Set(e.map((a) => a.id));
  let i = e.length, r = ct(i);
  for (; t.has(r.id); )
    i += 1, r = ct(i);
  return r;
}
function Se(e, t) {
  return {
    ...e,
    shots: t,
    target_shot_count: t.length,
    target_duration: t.reduce((i, r) => i + r.duration, 0)
  };
}
function Ar(e, t) {
  const i = Kt(e);
  return {
    ...qt(t),
    id: i.id,
    order: i.order,
    speech: t.speech.map((r, a) => ({
      ...r,
      id: `${i.id}-speech-${a + 1}`
    })),
    captions: t.captions.map((r, a) => ({
      ...r,
      id: `${i.id}-caption-${a + 1}`
    }))
  };
}
function qt(e) {
  return {
    ...e,
    material_ids: [...e.material_ids],
    speech: e.speech.map((t) => ({ ...t })),
    captions: e.captions.map((t) => ({ ...t })),
    reference_contents: { ...e.reference_contents || {} }
  };
}
const si = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StoryboardView: Tr
}, Symbol.toStringTag, { value: "Module" }));
export {
  lt as A,
  ii as C,
  Vn as S,
  Kn as a,
  Yn as b,
  ni as c,
  zt as d,
  ai as e,
  Tr as f,
  ar as g,
  At as h,
  si as i,
  ir as m,
  G as n,
  ht as o,
  ri as r,
  Be as s
};
