import { a as p, j as r, F as Se } from "./createLucideIcon-fWv1XcFy.js";
import { i as ze, d as k, b as j, e as ie, c as I, g as Ie } from "./runtime-entry-ClkZDmNs.js";
import { C as R } from "./circle-check-DEleXseO.js";
import { L as Re } from "./vanilla-BSPxkY5-.js";
import { A as xe } from "./arrow-up-gCOxsuD7.js";
import { C as ce } from "./chevron-down-e5qsfp_F.js";
import { F as Ae } from "./file-text-GWInsYzS.js";
import { I as ee } from "./images-2x5j-SXQ.js";
import { y as _e, q as De, P as Me, g as le } from "./storyboard-grid-view-BldHSQpc.js";
import { i as T, b as q, d as Te, e as Oe, r as je, f as Ke, s as Ue, g as K, p as ae, h as qe, j as O, k as te } from "./space-storyboard-shot-card-DVUe0KAE.js";
import { P as Ee, a as re } from "./power-icon-B4F9A-tn.js";
import { C as Fe } from "./space-reference-editor-CmgVWTz3.js";
import { u as Be } from "./asset-reference-provider-5wXqToZ6.js";
function ne(e) {
  return e?.service_name?.trim() || e?.name?.trim() || "来源";
}
const E = Ie(
  "@/components/agent/stream-request-params"
), Ve = E.PowerParamOptionDialog, Je = E.normalizeParamPreviewType, Le = E.isPowerParamConditionController || (() => !1);
function ht({
  value: e,
  placeholder: s,
  running: t = !1,
  disabled: o = !1,
  textInputEnabled: i = !0,
  showMediaParamButtons: c = !1,
  mediaParamPower: l,
  submitDisabled: d = !1,
  submitDisabledReason: a = "",
  sourceOptions: u = [],
  selectedSourceId: v = 0,
  params: f = [],
  paramValues: w = {},
  assetLibrary: N = { current: [] },
  referenceContent: x,
  assetReference: g,
  connectedMediaReferences: B = [],
  mediaUsageOptions: V = [],
  multiImagePlan: b,
  multiImageMode: me,
  onConnectedMediaEdgeRemove: pe,
  onChange: A,
  onParamChange: de,
  onSourceChange: fe,
  onMultiImageModeChange: we,
  onLocalUpload: C,
  onSubmit: J
}) {
  const $ = ze(
    () => f.filter(T),
    [f]
  ), he = k(
    (n) => {
      const m = Ge(n);
      N.current = [
        ...N.current.filter(
          (P) => Number(P.refId || 0) !== n.refId
        ),
        m
      ];
    },
    [N]
  ), ve = k(
    async (n, m) => {
      if (!C)
        throw new Error("当前节点未配置本地上传");
      const P = Xe($, m);
      if (!P)
        throw new Error("当前能力没有与所选素材类型匹配的上传参数");
      const Z = (await C(n, P)).map((M) => _e(M.asset)).filter((M) => M.id > 0);
      if (Z.length === 0)
        throw new Error("上传成功，但没有生成可用资产");
      return Z;
    },
    [C, $]
  ), ye = Be({
    teamID: Number(g?.teamID || 0),
    scopeProjectID: Number(g?.projectID || 0),
    initialFilters: g?.projectID ? {
      sourceType: "project",
      projectID: g.projectID,
      assetCateID: Number(g.assetCateID || 0)
    } : void 0,
    onSelect: he,
    onUpload: C ? ve : void 0
  }), [S, y] = j(""), [be, L] = j(), W = ie(0), G = k((n) => {
    y(""), W.current += 1, L({
      id: W.current,
      trigger: "@",
      preferredUsage: n.key,
      acceptedKinds: q(n)
    });
  }, []), Pe = k(
    (n) => {
      L(
        (m) => m?.id === n ? void 0 : m
      );
    },
    []
  ), Ne = f.filter(
    (n) => T(n) || Te(n) || Le(n, f)
  ), ge = u.find(
    (n) => n.target_id === v || n.id === v
  ), H = (b?.options || []).filter(
    (n) => n.enabled
  ), _ = b?.mode ? `${b.mode === "per_image" ? "逐图生成" : "共同参考"} · ${b.imageCount} 张` : "", D = N.current, ke = Oe(
    B,
    D
  ), Q = je(
    e,
    x,
    ke
  ), h = {
    ...Q,
    content: Ke(
      x,
      Q.content,
      D,
      V,
      B,
      me
    ).content
  }, Ce = V.map((n) => ({
    key: n.key,
    label: n.label,
    acceptedKinds: n.acceptedKinds,
    maxFiles: n.maxFiles
  })), $e = Ye(h.content), X = oe(
    e,
    x
  ), Y = oe(
    h.value,
    h.content
  );
  return I(() => {
    (o || t) && y("");
  }, [o, t]), I(() => {
    X !== Y && A(h.value, h.content);
  }, [
    X,
    A,
    Y,
    h.content,
    h.value
  ]), /* @__PURE__ */ p(
    "div",
    {
      className: `ws-prompt-composer nowheel ${t ? "is-running" : ""}`,
      children: [
        /* @__PURE__ */ r("div", { className: "ws-prompt-main", children: /* @__PURE__ */ r("div", { className: "ws-prompt-editor-shell", children: /* @__PURE__ */ r(
          Fe,
          {
            className: "ws-prompt-reference-editor nodrag nopan",
            value: h.value,
            content: h.content,
            disabled: o || t,
            textEditable: i,
            placeholder: s,
            items: D,
            usageOptions: Ce,
            pickerRequest: be,
            onPickerRequestConsumed: Pe,
            assetReferenceProvider: g?.teamID ? ye : void 0,
            onReferenceDelete: (n) => {
              n.ref_origin === "edge" && n.ref_origin_id && pe?.(n.ref_origin_id);
            },
            onChange: A,
            onSubmit: !t && !d ? J : void 0
          }
        ) }) }),
        /* @__PURE__ */ p("div", { className: "ws-prompt-toolbar", children: [
          /* @__PURE__ */ p("div", { className: "ws-prompt-tools", children: [
            u.length > 0 ? /* @__PURE__ */ r(
              z,
              {
                id: "source",
                openKey: S,
                label: ne(ge),
                icon: /* @__PURE__ */ r(Ae, { size: 15 }),
                disabled: o || t,
                onToggle: y,
                children: /* @__PURE__ */ r("div", { className: "ws-prompt-menu-list", children: u.map((n) => {
                  const m = n.target_id || n.id, P = m === v;
                  return /* @__PURE__ */ p(
                    "button",
                    {
                      type: "button",
                      className: `ws-prompt-menu-item ${P ? "is-active" : ""}`,
                      disabled: o || t,
                      onClick: () => {
                        fe?.(m), y("");
                      },
                      children: [
                        /* @__PURE__ */ r("span", { children: ne(n) }),
                        P ? /* @__PURE__ */ r(R, { size: 14 }) : null
                      ]
                    },
                    m
                  );
                }) })
              }
            ) : null,
            b?.active && b.mode ? H.length > 1 ? /* @__PURE__ */ r(
              z,
              {
                id: "multi-image-mode",
                openKey: S,
                label: _,
                icon: /* @__PURE__ */ r(ee, { size: 15 }),
                disabled: o || t,
                onToggle: y,
                children: /* @__PURE__ */ r("div", { className: "ws-prompt-menu-list", children: H.map((n) => {
                  const m = n.value === b.mode;
                  return /* @__PURE__ */ p(
                    "button",
                    {
                      type: "button",
                      className: `ws-prompt-menu-item ${m ? "is-active" : ""}`,
                      disabled: o || t,
                      onClick: () => {
                        we?.(n.value), y("");
                      },
                      children: [
                        /* @__PURE__ */ r("span", { children: n.label }),
                        m ? /* @__PURE__ */ r(R, { size: 14 }) : null
                      ]
                    },
                    n.value
                  );
                }) })
              }
            ) : /* @__PURE__ */ r("span", { className: "ws-prompt-tool-wrap", children: /* @__PURE__ */ p(
              "span",
              {
                className: "ws-prompt-tool is-static",
                "aria-label": _,
                children: [
                  /* @__PURE__ */ r(ee, { size: 15 }),
                  /* @__PURE__ */ r("span", { children: _ })
                ]
              }
            ) }) : null,
            !c && $.length > 0 ? /* @__PURE__ */ r(
              z,
              {
                id: "attachments",
                openKey: S,
                label: "添加素材",
                icon: /* @__PURE__ */ r(Me, { size: 17 }),
                iconOnly: !0,
                variant: "attachments",
                disabled: o || t,
                onToggle: y,
                children: /* @__PURE__ */ r("div", { className: "ws-prompt-menu-list is-attachments", role: "menu", children: $.map((n) => /* @__PURE__ */ p(
                  "button",
                  {
                    type: "button",
                    className: "ws-prompt-menu-item",
                    role: "menuitem",
                    onClick: () => G(n),
                    children: [
                      /* @__PURE__ */ r("span", { className: "ws-prompt-menu-kind-icon", children: /* @__PURE__ */ r(De, { kind: et(n) }) }),
                      /* @__PURE__ */ r("span", { children: F(n) })
                    ]
                  },
                  n.key
                )) })
              }
            ) : null,
            Ne.map((n) => T(n) ? c ? /* @__PURE__ */ r(
              We,
              {
                param: n,
                power: l,
                selectedCount: $e.get(n.key) || 0,
                disabled: o || t,
                onClick: () => G(n)
              },
              n.key
            ) : null : /* @__PURE__ */ r(
              He,
              {
                param: n,
                value: w[n.key],
                openKey: S,
                disabled: o || t,
                onToggle: y,
                onChange: (m) => de?.(n.key, m)
              },
              n.key
            ))
          ] }),
          /* @__PURE__ */ r("div", { className: "ws-prompt-submit-group", children: /* @__PURE__ */ r(le, { label: a || void 0, children: /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "ws-prompt-submit",
              disabled: o || t || d,
              onClick: J,
              "aria-label": a || "发送",
              children: t ? /* @__PURE__ */ r(Re, { size: 17, className: "ws-spin" }) : /* @__PURE__ */ r(xe, { size: 18 })
            }
          ) }) })
        ] })
      ]
    }
  );
}
function We({
  param: e,
  power: s,
  selectedCount: t,
  disabled: o,
  onClick: i
}) {
  const c = t > 0;
  return /* @__PURE__ */ r(le, { label: Ze(e, t), children: /* @__PURE__ */ p(
    "button",
    {
      type: "button",
      className: `ws-prompt-tool is-media-param ${c ? "is-selected" : ""}`,
      disabled: o,
      "aria-pressed": c,
      onClick: i,
      children: [
        /* @__PURE__ */ r(Ee, { power: s, size: 15 }),
        /* @__PURE__ */ r("span", { children: F(e) }),
        e.type === "files" && c ? /* @__PURE__ */ r("small", { className: "ws-prompt-media-count", children: t }) : null
      ]
    }
  ) });
}
function Ge(e) {
  const s = String(e.preview?.kind || "file"), t = String(e.preview?.url || "");
  return {
    id: `asset:${e.refId}`,
    title: e.label,
    kind: s,
    source: "asset",
    refType: "asset",
    refId: e.refId,
    versionID: e.versionID,
    output: e.output,
    asset: e.asset,
    preview: {
      text: e.description || "",
      imageUrl: s === "image" ? t : "",
      videoUrl: s === "video" ? t : "",
      audioUrl: s === "audio" ? t : "",
      fileUrl: s === "file" ? t : ""
    }
  };
}
function He({
  param: e,
  value: s,
  openKey: t,
  disabled: o,
  onToggle: i,
  onChange: c
}) {
  const [l, d] = j(!1), a = Je(e.preview_type);
  if (I(() => {
    (o || a === "none") && d(!1);
  }, [o, a]), (e.type === "option" || e.type === "select") && a !== "none") {
    const u = se(e, s);
    return /* @__PURE__ */ p(Se, { children: [
      /* @__PURE__ */ r("span", { className: "ws-prompt-tool-wrap", children: /* @__PURE__ */ p(
        "button",
        {
          type: "button",
          className: "ws-prompt-tool",
          disabled: o,
          "aria-label": u,
          onClick: () => {
            i(""), d(!0);
          },
          children: [
            /* @__PURE__ */ r(re, { name: e.icon, size: 15 }),
            /* @__PURE__ */ r("span", { children: u }),
            /* @__PURE__ */ r(ce, { size: 14 })
          ]
        }
      ) }),
      /* @__PURE__ */ r(
        Ve,
        {
          open: l,
          title: e.name || e.key,
          previewType: a,
          options: e.options || [],
          value: s,
          disabled: o,
          onOpenChange: d,
          onConfirm: (v) => c(K(e, v))
        }
      )
    ] });
  }
  return /* @__PURE__ */ r(
    z,
    {
      id: e.key,
      openKey: t,
      label: se(e, s),
      icon: /* @__PURE__ */ r(re, { name: e.icon, size: 15 }),
      disabled: o,
      onToggle: i,
      children: /* @__PURE__ */ r(
        Qe,
        {
          param: e,
          value: s,
          onChange: c,
          onClose: () => i("")
        }
      )
    }
  );
}
function z({
  id: e,
  openKey: s,
  label: t,
  icon: o,
  iconOnly: i = !1,
  variant: c = "default",
  disabled: l,
  children: d,
  onToggle: a
}) {
  const u = !l && s === e, v = c === "attachments" ? "is-attachments" : "", f = ie(null), w = k(() => {
    f.current != null && (window.clearTimeout(f.current), f.current = null);
  }, []), N = k(() => {
    w(), f.current = window.setTimeout(() => {
      f.current = null, a("");
    }, 240);
  }, [w, a]);
  return I(() => (u || w(), w), [w, u]), /* @__PURE__ */ p(
    "span",
    {
      className: `ws-prompt-tool-wrap ${v} ${u ? "is-open" : ""}`,
      onMouseEnter: () => {
        w(), l || a(e);
      },
      onMouseLeave: () => {
        u && N();
      },
      children: [
        /* @__PURE__ */ p(
          "button",
          {
            type: "button",
            className: `ws-prompt-tool ${i ? "is-icon-only" : ""} ${u ? "is-open" : ""}`,
            disabled: l,
            "aria-label": t,
            "aria-expanded": c === "attachments" ? u : void 0,
            "aria-haspopup": c === "attachments" ? "menu" : void 0,
            onClick: () => {
              l || (w(), a(u ? "" : e));
            },
            children: [
              o,
              i ? null : /* @__PURE__ */ r("span", { children: t }),
              i ? null : /* @__PURE__ */ r(ce, { size: 14 })
            ]
          }
        ),
        u ? /* @__PURE__ */ r(
          "div",
          {
            className: `ws-prompt-popover ${v}`,
            onMouseEnter: w,
            children: d
          }
        ) : null
      ]
    }
  );
}
function Qe({
  param: e,
  value: s,
  onChange: t,
  onClose: o
}) {
  if (e.type === "option" || e.type === "select") {
    const i = e.options || [];
    return /* @__PURE__ */ r("div", { className: "ws-prompt-menu-list", children: i.map((c) => {
      const l = O(
        c,
        [String(s ?? "")],
        i
      );
      return /* @__PURE__ */ p(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${l ? "is-active" : ""}`,
          onClick: () => {
            t(
              K(
                e,
                te(c)
              )
            ), o();
          },
          children: [
            /* @__PURE__ */ r("span", { children: c.name || c.value }),
            l ? /* @__PURE__ */ r(R, { size: 14 }) : null
          ]
        },
        c.id || c.value
      );
    }) });
  }
  if (e.type === "multi_option") {
    const i = ue(s), c = e.options || [];
    return /* @__PURE__ */ r("div", { className: "ws-prompt-menu-list", children: c.map((l) => {
      const d = O(l, i, c);
      return /* @__PURE__ */ p(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${d ? "is-active" : ""}`,
          onClick: () => {
            let a = [...i];
            d ? a = a.filter(
              (u) => !O(l, [u], c)
            ) : a.push(te(l)), t(K(e, a));
          },
          children: [
            /* @__PURE__ */ r("span", { children: l.name || l.value }),
            d ? /* @__PURE__ */ r(R, { size: 14 }) : null
          ]
        },
        l.id || l.value
      );
    }) });
  }
  if (e.type === "switch") {
    const i = ae(s);
    return /* @__PURE__ */ p(
      "button",
      {
        type: "button",
        className: `ws-prompt-switch ${i ? "is-on" : ""}`,
        onClick: () => t(!i),
        children: [
          /* @__PURE__ */ r("span", { children: e.name }),
          /* @__PURE__ */ r("i", {})
        ]
      }
    );
  }
  return e.type === "prompt" || e.type === "textarea" ? /* @__PURE__ */ r(
    "textarea",
    {
      className: "ws-prompt-param-textarea",
      value: U(s),
      placeholder: e.name,
      onChange: (i) => t(i.target.value)
    }
  ) : /* @__PURE__ */ r(
    "input",
    {
      className: "ws-prompt-param-input",
      type: e.value_type === "number" ? "number" : "text",
      value: U(s),
      placeholder: e.name,
      onChange: (i) => t(
        e.value_type === "number" ? Number(i.target.value) : i.target.value
      )
    }
  );
}
function se(e, s) {
  if (e.type === "switch")
    return `${e.name}: ${ae(s) ? "开" : "关"}`;
  if (e.type === "multi_option") {
    const o = ue(s).length;
    return o > 0 ? `${e.name} ${o}` : e.name;
  }
  if (e.type === "option" || e.type === "select")
    return qe(e.options || [], s)?.name || e.name;
  const t = U(s);
  return t ? `${e.name}: ${t}` : e.name;
}
function Xe(e, s) {
  const t = String(s.preferredUsage || "").trim();
  if (t) {
    const i = e.find((c) => c.key === t);
    if (i)
      return i;
  }
  const o = new Set(s.acceptedKinds || []);
  if (o.size > 0) {
    const i = e.find(
      (c) => q(c).some((l) => o.has(l))
    );
    if (i)
      return i;
  }
  return e.length === 1 ? e[0] : void 0;
}
function oe(e, s) {
  return JSON.stringify([String(e || ""), s?.parts || []]);
}
function Ye(e) {
  const s = /* @__PURE__ */ new Map();
  for (const t of e?.parts || []) {
    if (t.type !== "reference" || !t.usage)
      continue;
    const o = Ue(
      t,
      Number(t.ref_media_count || 0)
    );
    s.set(t.usage, (s.get(t.usage) || 0) + o);
  }
  return s;
}
function Ze(e, s) {
  const t = F(e);
  if (e.type !== "files")
    return s > 0 ? `${t}：已选择素材` : `选择${t}素材`;
  const o = Math.max(0, Number(e.max_files || 0));
  return s <= 0 ? o > 0 ? `选择${t}素材，最多 ${o} 个` : `选择${t}素材` : o > 0 ? `${t}：已选择 ${s} 个，最多 ${o} 个` : `${t}：已选择 ${s} 个`;
}
function F(e) {
  return String(e.name || e.key || "").trim() || "文件";
}
function et(e) {
  const s = q(e);
  return s.length === 1 ? s[0] : "file";
}
function U(e) {
  return e == null ? "" : Array.isArray(e) ? e.join("、") : String(e);
}
function ue(e) {
  if (Array.isArray(e))
    return e.map((s) => String(s)).filter(Boolean);
  if (typeof e == "string") {
    const s = tt(e);
    return Array.isArray(s) ? s.map((t) => String(t)).filter(Boolean) : e ? [e] : [];
  }
  return e ? [String(e)] : [];
}
function tt(e) {
  if (!e)
    return e;
  try {
    return JSON.parse(e);
  } catch {
    return e;
  }
}
export {
  ht as PromptComposer
};
