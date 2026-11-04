import { a as S, j as n, F as vt } from "./preloadable-BrN58FXf.js";
import { i as Yr, S as jt } from "./space-node-runtime-CxMQ_W2k.js";
import { u as k, h as Y, a as V, b as oe, d as G, F as Gr } from "./file-kind-BSFhe2vU.js";
import { C as wt, b as Hr, aG as Jr, r as yr, ar as br, c as xt, L as hr, as as Zr, X as Qr, aD as Kt, h as Xr, O as en, T as tn, z as rn } from "./vendor-icons-UGaOWWu-.js";
import { i as je, j as qt, n as Wt, k as Yt, f as Gt, l as nn } from "./space-optional-components-C8EUHVoE.js";
import { e as Ht, f as on } from "./writing-run-labels--5SZkRES.js";
import { i as Ke, f as At, g as vr, h as kt, j as sn, k as Rt, l as an, r as Be, n as cn, p as ln, q as un, t as _t, P as wr, u as et, v as Sr, w as $t, x as pt, y as Mr, S as dn, z as It, A as Jt, B as Ir, C as dt, D as Zt, E as Je, F as Ze, G as mn, H as pn, a as fn, I as Ct, J as gn, K as yn, L as bn, M as Qt, N as hn, O as vn } from "./space-ordered-list-OcbtLT72.js";
import { a as yt } from "./node-detail-header-CD6P0SMz.js";
import { a as Dt, P as wn } from "./power-icon-C4gLuaR6.js";
import { b as Sn } from "./space-reference-editor-EC2fOPLJ.js";
import { j as Mn, B as Ut, P as Qe, Q as Xt, R as In, T as Cn, U as Nn, V as Pn, W as ft } from "./asset-preview-D6nljO8_.js";
import { n as kn } from "./asset-upload-progress-DM4y2leV.js";
import { u as Rn } from "./asset-reference-provider-DkAAvSU_.js";
import { g as _n } from "./space-reference-content-K_sxMShu.js";
import { b as Dn, r as er, i as En } from "./space-loading-FH4pJ97O.js";
import { b as Tn } from "./space-upload-Ht87QNBN.js";
import { b as On } from "./writing-document-YwPtpDvk.js";
function tr(e) {
  return Dn(
    e?.service_name,
    e?.name,
    "来源"
  );
}
const xn = 240, An = [], $n = [], Un = {}, Vn = {};
function rr({
  value: e,
  placeholder: r,
  running: t = !1,
  disabled: s = !1,
  textInputEnabled: f = !0,
  showMediaParamButtons: i = !1,
  mediaParamPower: u,
  submitDisabled: g = !1,
  submitDisabledReason: d = "",
  sourceOptions: c = [],
  selectedSourceId: m = 0,
  params: I = [],
  primaryParam: y,
  paramValues: v = {},
  paramBindings: C = Un,
  paramBindingSources: h = Vn,
  storyboardLyricsBindingSource: J,
  assetLibrary: M = { current: [] },
  referenceContent: U,
  assetReference: P,
  connectedMediaReferences: se = An,
  mediaUsageOptions: be = $n,
  referenceUsageOptions: me,
  referenceUsageField: R = "usage",
  multiImagePlan: q,
  multiImageMode: K,
  toolbarContent: he,
  onConnectedMediaEdgeRemove: H,
  onChange: ve,
  onParamChange: pe,
  onParamBindingConnectionRemove: fe,
  onStoryboardLyricsConnectionRemove: ke,
  onSourceChange: Re,
  onMultiImageModeChange: St,
  onLocalUpload: ie,
  onSubmit: tt
}) {
  const ce = k(
    () => I.filter(Ke),
    [I]
  ), qe = y ? C[y.key] : void 0, rt = qe ? h[qe.sourceNodeId] : void 0, Z = Y(
    (p) => {
      const w = zn(p);
      M.current = [
        ...M.current.filter(
          (F) => F.refType !== p.refType || Number(F.refId || 0) !== p.refId
        ),
        w
      ];
    },
    [M]
  ), nt = Y(
    async (p, w) => {
      if (!ie)
        throw new Error("当前节点未配置本地上传");
      const F = Kn(ce, w);
      if (!F)
        throw new Error("当前能力没有与所选素材类型匹配的上传参数");
      const B = (await ie(p, F, {
        onProgress: w.onProgress
      })).map((X) => kn(X.asset)).filter((X) => X.id > 0);
      if (B.length === 0)
        throw new Error("上传成功，但没有生成可用资产");
      return B;
    },
    [ie, ce]
  ), we = Rn({
    notificationMode: "inline",
    teamID: Number(P?.teamID || 0),
    scopeProjectID: Number(P?.projectID || 0),
    initialFilters: P?.projectID ? {
      sourceType: "project",
      projectID: P.projectID,
      assetCateID: Number(P.assetCateID || 0)
    } : void 0,
    onSelect: Z,
    onUpload: ie ? nt : void 0
  }), [te, E] = V(""), [_e, De] = V(), Se = oe(0), Ve = Y((p) => {
    E(""), Se.current += 1, De({
      id: Se.current,
      trigger: "@",
      preferredUsage: p.key,
      acceptedKinds: At(p)
    });
  }, []), Le = Y(
    (p) => {
      De(
        (w) => w?.id === p ? void 0 : w
      );
    },
    []
  ), We = k(
    () => I.filter(
      (p) => Ke(p) || !!p.group || vr(p) || kt(p, I)
    ),
    [I]
  ), le = k(
    () => sn(We),
    [We]
  ), W = k(
    () => c.find(
      (p) => p.target_id === m || p.id === m
    ),
    [m, c]
  ), Ee = m > 0 && !W, Te = q?.active && K === "shared_reference" ? q.frameUsages : [], ze = We.some(
    Rt
  ), Oe = /* @__PURE__ */ n(
    Ln,
    {
      plan: q,
      openKey: te,
      disabled: s || t,
      onToggle: E,
      onChange: St
    }
  ), Me = M.current, x = k(() => {
    if (Ee || s)
      return { value: e, content: U };
    const p = _n(
      e,
      U,
      an(se, Me)
    );
    return {
      ...p,
      content: Be(
        U,
        p.content,
        Me,
        be,
        se,
        K
      ).content
    };
  }, [
    se,
    s,
    be,
    K,
    U,
    Me,
    Ee,
    e
  ]), Ie = k(
    () => be.map((p) => ({
      key: p.key,
      label: p.label,
      acceptedKinds: p.acceptedKinds,
      maxFiles: p.maxFiles
    })),
    [be]
  ), O = k(
    () => me || Ie,
    [me, Ie]
  ), Ce = k(
    () => qn(x.content),
    [x.content]
  ), Ye = k(
    () => nr(e, U),
    [U, e]
  ), xe = k(
    () => nr(
      x.value,
      x.content
    ),
    [x.content, x.value]
  ), ue = oe({
    value: x.value,
    content: x.content
  }), Ne = oe(!1), N = oe(null), Ge = oe(ve), Fe = oe(tt);
  Ge.current = ve, Fe.current = tt;
  const Ae = Y(() => {
    N.current !== null && (window.clearTimeout(N.current), N.current = null);
  }, []), _ = Y(() => {
    if (Ae(), !Ne.current)
      return;
    Ne.current = !1;
    const p = ue.current;
    Ge.current(p.value, p.content);
  }, [Ae]), D = Y(
    (p, w, F = !1) => {
      const L = ue.current.content;
      ue.current = {
        value: p,
        content: w
      }, Ne.current = !0;
      const B = je(L) !== je(w);
      if (F || B) {
        _();
        return;
      }
      Ae(), N.current = window.setTimeout(
        _,
        xn
      );
    },
    [Ae, _]
  ), $e = Y((p, w, F) => {
    const L = ue.current;
    if (!L.content) return "请先添加参考图片";
    const B = cn(L.content, Me, se), X = B.find(
      (j) => j.ref_type === p.ref_type && j.ref_id === p.ref_id && Number(j.ref_version_id || 0) === Number(p.ref_version_id || 0)
    );
    if (!X) return "引用图片已变化，请重新选择";
    try {
      const j = ln(
        L.content,
        B,
        w,
        F ? { part: X, media: F, label: p.label } : void 0
      );
      D(L.value, j, !0);
    } catch (j) {
      return j instanceof Error ? j.message : String(j);
    }
  }, [se, Me, D]), Q = Y(() => {
    const p = ue.current;
    return _(), Fe.current(p.value, p.content);
  }, [_]);
  return G(() => {
    Ne.current || (ue.current = {
      value: x.value,
      content: x.content
    });
  }, [
    xe,
    x.content,
    x.value
  ]), G(
    () => () => {
      _();
    },
    [_]
  ), G(() => {
    (s || t) && E("");
  }, [s, t]), G(() => {
    Ee || s || Ye !== xe && (Ne.current || D(
      x.value,
      x.content,
      !0
    ));
  }, [
    Ye,
    s,
    xe,
    x.content,
    x.value,
    Ee,
    D
  ]), /* @__PURE__ */ S(
    "div",
    {
      className: `ws-prompt-composer nowheel ${t ? "is-running" : ""}`,
      children: [
        /* @__PURE__ */ n("div", { className: "ws-prompt-main", children: /* @__PURE__ */ S("div", { className: "ws-prompt-editor-shell", children: [
          y && qe ? /* @__PURE__ */ n(
            bt,
            {
              label: yt(y),
              source: rt,
              compact: !0,
              disabled: s || t,
              onRemove: () => fe?.(y.key)
            }
          ) : null,
          J ? /* @__PURE__ */ n(
            bt,
            {
              label: "歌词",
              source: J,
              compact: !0,
              disabled: s || t,
              onRemove: () => ke?.()
            }
          ) : null,
          /* @__PURE__ */ n(
            Sn,
            {
              className: "ws-prompt-reference-editor nodrag nopan",
              value: x.value,
              content: x.content,
              disabled: s || t,
              textEditable: f,
              placeholder: r,
              items: Me,
              usageOptions: Te.length > 0 ? [] : O,
              usageField: R,
              mediaUsageOptions: Ie,
              mediaSelectionMaxFiles: q?.active && K === "per_image" ? 0 : void 0,
              mediaSelectionUsages: Te.length ? Te : void 0,
              onReferenceMediaUsageSelect: $e,
              autoAssignUsage: R !== "purpose",
              pickerRequest: _e,
              onPickerRequestConsumed: Le,
              assetReferenceProvider: P?.teamID ? we : void 0,
              onReferenceDelete: (p) => {
                p.ref_origin === "edge" && p.ref_origin_id && H?.(p.ref_origin_id);
              },
              onChange: D,
              onBlur: _,
              onSubmit: !t && !g ? () => {
                Q();
              } : void 0
            }
          )
        ] }) }),
        /* @__PURE__ */ S("div", { className: "ws-prompt-toolbar", children: [
          /* @__PURE__ */ S("div", { className: "ws-prompt-tools", children: [
            c.length > 0 || m > 0 ? /* @__PURE__ */ n(
              Ue,
              {
                id: "source",
                openKey: te,
                label: Ee ? "来源不可用，请重新选择" : tr(W),
                icon: /* @__PURE__ */ n(Hr, { size: 15 }),
                disabled: s || t,
                onToggle: E,
                children: /* @__PURE__ */ S("div", { className: "ws-prompt-menu-list", children: [
                  c.length === 0 ? /* @__PURE__ */ n("span", { className: "ws-prompt-menu-item", role: "status", children: "暂无可用来源" }) : null,
                  c.map((p) => {
                    const w = p.target_id || p.id, F = w === m;
                    return /* @__PURE__ */ S(
                      "button",
                      {
                        type: "button",
                        className: `ws-prompt-menu-item ${F ? "is-active" : ""}`,
                        disabled: s || t,
                        onClick: () => {
                          Re?.(w), E("");
                        },
                        children: [
                          /* @__PURE__ */ n("span", { children: tr(p) }),
                          F ? /* @__PURE__ */ n(wt, { size: 14 }) : null
                        ]
                      },
                      w
                    );
                  })
                ] })
              }
            ) : null,
            he?.({ openKey: te, onToggle: E }),
            ze ? null : Oe,
            !i && ce.length > 0 ? /* @__PURE__ */ n(
              Ue,
              {
                id: "attachments",
                openKey: te,
                label: "添加素材",
                icon: /* @__PURE__ */ n(Jr, { size: 17 }),
                iconOnly: !0,
                variant: "attachments",
                disabled: s || t,
                onToggle: E,
                children: /* @__PURE__ */ n("div", { className: "ws-prompt-menu-list is-attachments", role: "menu", children: ce.map((p) => /* @__PURE__ */ S(
                  "button",
                  {
                    type: "button",
                    className: "ws-prompt-menu-item",
                    role: "menuitem",
                    onClick: () => Ve(p),
                    children: [
                      /* @__PURE__ */ n("span", { className: "ws-prompt-menu-kind-icon", children: /* @__PURE__ */ n(Mn, { kind: Yn(p) }) }),
                      /* @__PURE__ */ n("span", { children: Vt(p) })
                    ]
                  },
                  p.key
                )) })
              }
            ) : null,
            le.map((p) => {
              if ("group" in p)
                return /* @__PURE__ */ n(
                  Bn,
                  {
                    group: p.group,
                    params: p.params,
                    values: v,
                    bindings: C,
                    bindingSources: h,
                    mediaCounts: Ce,
                    mediaPower: u,
                    openKey: te,
                    disabled: s || t,
                    onToggle: E,
                    onChange: (B, X) => pe?.(B.key, X),
                    onMediaPick: Ve,
                    onBindingRemove: fe
                  },
                  p.key
                );
              const w = p.param, F = C[w.key], L = Ke(w) ? i ? /* @__PURE__ */ n(
                Cr,
                {
                  param: w,
                  power: u,
                  selectedCount: Ce.get(w.key) || 0,
                  disabled: s || t,
                  onClick: () => Ve(w)
                }
              ) : null : /* @__PURE__ */ n(
                Fn,
                {
                  param: w,
                  value: v[w.key],
                  binding: F,
                  bindingSource: F ? h[F.sourceNodeId] : void 0,
                  openKey: te,
                  disabled: s || t,
                  onToggle: E,
                  onChange: (B) => pe?.(w.key, B),
                  onBindingRemove: fe
                }
              );
              return /* @__PURE__ */ S(Gr, { children: [
                L,
                Rt(w) ? Oe : null
              ] }, w.key);
            })
          ] }),
          /* @__PURE__ */ n("div", { className: "ws-prompt-submit-group", children: /* @__PURE__ */ n(Ut, { label: d || void 0, children: /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "ws-prompt-submit",
              disabled: s || t || g,
              onClick: () => {
                Q();
              },
              "aria-label": d || "发送",
              children: t ? /* @__PURE__ */ n(yr, { size: 17, className: "ws-spin" }) : /* @__PURE__ */ n(br, { size: 18 })
            }
          ) }) })
        ] })
      ]
    }
  );
}
function Ln({
  plan: e,
  openKey: r,
  disabled: t,
  onToggle: s,
  onChange: f
}) {
  if (!e?.active || !e.mode || !e.frameUsages.length && e.imageCount <= 1 && !e.structured)
    return null;
  const u = e.options.filter((m) => m.enabled).find(
    (m) => m.value === e.mode
  ), g = e.mode === "shared_reference" && e.frameUsages.length > 0 && e.imageCount === 1 ? "首帧生成" : u?.label || (e.mode === "per_image" ? "每图一条视频" : "多图共同参考"), d = e.mode === "per_image" ? e.imageCount : 1, c = `${g} · 共${d}条`;
  return e.options.length <= 1 ? /* @__PURE__ */ n("span", { className: "ws-prompt-tool-wrap", children: /* @__PURE__ */ S("span", { className: "ws-prompt-tool is-static", "aria-label": c, children: [
    /* @__PURE__ */ n(Kt, { size: 15 }),
    /* @__PURE__ */ n("span", { children: c })
  ] }) }) : /* @__PURE__ */ n(
    Ue,
    {
      id: "multi-image-mode",
      openKey: r,
      label: c,
      icon: /* @__PURE__ */ n(Kt, { size: 15 }),
      disabled: t,
      onToggle: s,
      children: /* @__PURE__ */ n("div", { className: "ws-prompt-menu-list", children: e.options.map((m) => {
        const I = m.value === e.mode, y = m.value === "per_image" ? e.imageCount : 1;
        return /* @__PURE__ */ S(
          "button",
          {
            type: "button",
            className: `ws-prompt-menu-item ${I ? "is-active" : ""}`,
            disabled: t || !m.enabled,
            title: m.reason,
            onClick: () => {
              f?.(m.value), s("");
            },
            children: [
              /* @__PURE__ */ n("span", { children: `${m.label} · 共${y}条` }),
              I ? /* @__PURE__ */ n(wt, { size: 14 }) : null
            ]
          },
          m.value
        );
      }) })
    }
  );
}
function Cr({
  param: e,
  power: r,
  selectedCount: t,
  disabled: s,
  onClick: f
}) {
  const i = t > 0;
  return /* @__PURE__ */ n(Ut, { label: Wn(e, t), children: /* @__PURE__ */ S(
    "button",
    {
      type: "button",
      className: `ws-prompt-tool is-media-param ${i ? "is-selected" : ""}`,
      disabled: s,
      "aria-pressed": i,
      onClick: f,
      children: [
        /* @__PURE__ */ n(wn, { power: r, size: 15 }),
        /* @__PURE__ */ n("span", { children: Vt(e) }),
        e.type === "files" && i ? /* @__PURE__ */ n("small", { className: "ws-prompt-media-count", children: t }) : null
      ]
    }
  ) });
}
function zn(e) {
  const r = String(e.preview?.kind || "file"), t = String(e.preview?.url || "");
  return {
    id: `${e.refType}:${e.refId}`,
    title: e.label,
    kind: r,
    source: e.refType,
    refType: e.refType,
    refId: e.refId,
    versionID: e.versionID,
    output: e.output,
    asset: e.asset,
    preview: {
      text: e.description || "",
      imageUrl: r === "image" ? t : "",
      videoUrl: r === "video" ? t : "",
      audioUrl: r === "audio" ? t : "",
      fileUrl: r === "file" ? t : ""
    }
  };
}
function Fn({
  param: e,
  value: r,
  binding: t,
  bindingSource: s,
  openKey: f,
  disabled: i,
  onToggle: u,
  onChange: g,
  onBindingRemove: d
}) {
  const [c, m] = V(!1), [I, y] = V(
    null
  ), v = _t(e.preview_type);
  if (G(() => {
    (i || v === "none") && m(!1);
  }, [i, v]), (e.type === "option" || e.type === "select") && v !== "none") {
    const C = Et(e, r);
    return /* @__PURE__ */ S(vt, { children: [
      /* @__PURE__ */ n("span", { className: "ws-prompt-tool-wrap", children: /* @__PURE__ */ S(
        "button",
        {
          type: "button",
          className: "ws-prompt-tool",
          disabled: i,
          "aria-label": C,
          onClick: (h) => {
            u(""), y(
              h.currentTarget.closest(
                ".ws-storyboard-workspace-editor-anchor"
              )
            ), m(!0);
          },
          children: [
            /* @__PURE__ */ n(Dt, { name: e.icon, size: 15 }),
            /* @__PURE__ */ n("span", { children: C }),
            /* @__PURE__ */ n(xt, { size: 14 })
          ]
        }
      ) }),
      /* @__PURE__ */ n(
        wr,
        {
          open: c,
          portalContainer: I,
          layerZIndex: I ? 1100 : void 0,
          title: e.name || e.key,
          previewType: v,
          options: e.options || [],
          value: r,
          disabled: i,
          onOpenChange: m,
          onConfirm: (h) => g(et(e, h))
        }
      )
    ] });
  }
  return /* @__PURE__ */ n(
    Ue,
    {
      id: e.key,
      openKey: f,
      label: t ? `${yt(e)} · 已连接` : Et(e, r),
      icon: t ? /* @__PURE__ */ n(hr, { size: 15 }) : /* @__PURE__ */ n(Dt, { name: e.icon, size: 15 }),
      filled: !!t,
      disabled: i,
      onToggle: u,
      children: t ? /* @__PURE__ */ n(
        bt,
        {
          label: yt(e),
          source: s,
          disabled: i,
          onRemove: () => d?.(e.key)
        }
      ) : /* @__PURE__ */ n(
        Nr,
        {
          param: e,
          value: r,
          onChange: g,
          onClose: () => u("")
        }
      )
    }
  );
}
function Bn({
  group: e,
  params: r,
  values: t,
  bindings: s,
  bindingSources: f,
  mediaCounts: i,
  mediaPower: u,
  openKey: g,
  disabled: d,
  onToggle: c,
  onChange: m,
  onMediaPick: I,
  onBindingRemove: y
}) {
  const [v, C] = V(null);
  return G(() => {
    d && C(null);
  }, [d]), /* @__PURE__ */ S(vt, { children: [
    /* @__PURE__ */ n(
      Ue,
      {
        id: `param-group:${e.id}`,
        openKey: g,
        label: e.name,
        icon: /* @__PURE__ */ n(Dt, { name: e.icon, size: 15 }),
        variant: "group",
        disabled: d,
        onToggle: c,
        children: /* @__PURE__ */ n("div", { className: "ws-prompt-param-group", children: r.map((h) => {
          const J = s[h.key], M = h.type === "option" && _t(h.preview_type) !== "none";
          return /* @__PURE__ */ S("div", { className: "ws-prompt-param-group-field", children: [
            /* @__PURE__ */ S("label", { children: [
              h.name,
              h.required ? /* @__PURE__ */ n("span", { className: "ws-prompt-param-required", children: " *" }) : null
            ] }),
            J ? /* @__PURE__ */ n(
              bt,
              {
                label: yt(h),
                source: f[J.sourceNodeId],
                disabled: d,
                onRemove: () => y?.(h.key)
              }
            ) : Ke(h) ? /* @__PURE__ */ n(
              Cr,
              {
                param: h,
                power: u,
                selectedCount: i.get(h.key) || 0,
                disabled: d,
                onClick: () => I(h)
              }
            ) : M ? /* @__PURE__ */ S(
              "button",
              {
                type: "button",
                className: "ws-prompt-group-option",
                disabled: d,
                onClick: (U) => {
                  C({
                    param: h,
                    container: U.currentTarget.closest(
                      ".ws-storyboard-workspace-editor-anchor"
                    )
                  }), c("");
                },
                children: [
                  /* @__PURE__ */ n("span", { children: Et(h, t[h.key]) }),
                  /* @__PURE__ */ n(xt, { size: 14 })
                ]
              }
            ) : /* @__PURE__ */ n(
              Nr,
              {
                param: h,
                value: t[h.key],
                inline: !0,
                onChange: (U) => m(h, U),
                onClose: () => {
                }
              }
            )
          ] }, h.key);
        }) })
      }
    ),
    v ? /* @__PURE__ */ n(
      wr,
      {
        open: !0,
        portalContainer: v.container,
        layerZIndex: v.container ? 1100 : void 0,
        title: v.param.name,
        previewType: _t(
          v.param.preview_type
        ),
        options: v.param.options || [],
        value: t[v.param.key],
        disabled: d,
        onOpenChange: (h) => {
          h || C(null);
        },
        onConfirm: (h) => m(
          v.param,
          et(v.param, h)
        )
      }
    ) : null
  ] });
}
function bt({
  label: e,
  source: r,
  compact: t = !1,
  disabled: s,
  onRemove: f
}) {
  const i = String(r?.title || "上游节点").trim(), u = String(r?.text || "").trim();
  return /* @__PURE__ */ S("div", { className: `ws-param-binding-preview ${t ? "is-compact" : ""}`, children: [
    /* @__PURE__ */ S("div", { className: "ws-param-binding-preview-heading", children: [
      /* @__PURE__ */ n(hr, { size: 15, "aria-hidden": "true" }),
      /* @__PURE__ */ S("span", { children: [
        /* @__PURE__ */ n("strong", { children: e }),
        /* @__PURE__ */ S("small", { title: i, children: [
          "来自 ",
          i
        ] })
      ] }),
      /* @__PURE__ */ n(Ut, { label: "删除连接", children: /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "ws-param-binding-remove",
          disabled: s,
          "aria-label": "删除连接",
          onClick: f,
          children: /* @__PURE__ */ n(Xr, { size: 14 })
        }
      ) })
    ] }),
    /* @__PURE__ */ n(
      "p",
      {
        className: u ? "" : "is-empty",
        title: u || void 0,
        children: u || "等待上游生成"
      }
    )
  ] });
}
function Ue({
  id: e,
  openKey: r,
  label: t,
  icon: s,
  iconOnly: f = !1,
  variant: i = "default",
  filled: u = !1,
  disabled: g,
  children: d,
  onToggle: c
}) {
  const m = !g && r === e, I = i === "attachments" ? "is-attachments" : i === "group" ? "is-parameter-group" : "", y = oe(null), v = oe(null), C = Y(() => {
    v.current != null && (window.clearTimeout(v.current), v.current = null);
  }, []), h = Y(() => {
    C(), v.current = window.setTimeout(() => {
      v.current = null, c("");
    }, 240);
  }, [C, c]);
  return G(() => (m || C(), C), [C, m]), G(() => {
    if (!m || i !== "group") return;
    const J = (U) => {
      U.target instanceof Node && !y.current?.contains(U.target) && c("");
    }, M = (U) => {
      U.key === "Escape" && c("");
    };
    return document.addEventListener("pointerdown", J), document.addEventListener("keydown", M), () => {
      document.removeEventListener("pointerdown", J), document.removeEventListener("keydown", M);
    };
  }, [c, m, i]), /* @__PURE__ */ S(
    "span",
    {
      ref: y,
      className: `ws-prompt-tool-wrap ${I} ${m ? "is-open" : ""}`,
      onMouseEnter: () => {
        C(), !g && i !== "group" && c(e);
      },
      onMouseLeave: () => {
        m && i !== "group" && h();
      },
      children: [
        /* @__PURE__ */ S(
          "button",
          {
            type: "button",
            className: `ws-prompt-tool ${f ? "is-icon-only" : ""} ${m ? "is-open" : ""} ${u ? "is-filled" : ""}`,
            disabled: g,
            "aria-label": t,
            "aria-expanded": m,
            "aria-haspopup": i === "attachments" ? "menu" : void 0,
            onClick: () => {
              g || (C(), c(m ? "" : e));
            },
            children: [
              s,
              f ? null : /* @__PURE__ */ n("span", { children: t }),
              f ? null : /* @__PURE__ */ n(xt, { size: 14 })
            ]
          }
        ),
        m ? /* @__PURE__ */ n(
          "div",
          {
            className: `ws-prompt-popover ${I}`,
            onMouseEnter: C,
            children: d
          }
        ) : null
      ]
    }
  );
}
function jn({
  param: e,
  value: r,
  onChange: t
}) {
  const s = Pr(r), f = e.options || [], i = !!e.max_items && s.length >= e.max_items, u = (d) => {
    const c = $t(f, d);
    return c?.name || c?.value || d;
  }, g = (d, c) => {
    const m = [...s];
    [m[d], m[d + c]] = [m[d + c], m[d]], t(m);
  };
  return /* @__PURE__ */ S("div", { className: "ws-prompt-multi-select", onPointerDown: (d) => d.stopPropagation(), children: [
    /* @__PURE__ */ n(
      dn,
      {
        multiple: !0,
        clearable: !1,
        value: s,
        options: f.filter((d) => !i || Mr(d, s, f)).map((d) => ({ id: pt(d), value: d.name || d.value })),
        placeholder: "选择选项，可多选",
        className: "border-0 bg-muted/30 shadow-none",
        onChange: (d) => t(et(e, d))
      }
    ),
    s.length > 0 ? /* @__PURE__ */ n("div", { className: "ws-prompt-selected-list", children: s.map((d, c) => /* @__PURE__ */ S("div", { className: "ws-prompt-selected-item", children: [
      /* @__PURE__ */ n("span", { className: "ws-prompt-selected-order", children: c + 1 }),
      /* @__PURE__ */ n("span", { className: "ws-prompt-selected-name", children: u(d) }),
      /* @__PURE__ */ n("button", { type: "button", "aria-label": `前移${u(d)}`, disabled: c === 0, onClick: () => g(c, -1), children: /* @__PURE__ */ n(br, { size: 12 }) }),
      /* @__PURE__ */ n("button", { type: "button", "aria-label": `后移${u(d)}`, disabled: c === s.length - 1, onClick: () => g(c, 1), children: /* @__PURE__ */ n(Zr, { size: 12 }) }),
      /* @__PURE__ */ n("button", { type: "button", "aria-label": `移除${u(d)}`, onClick: () => t(s.filter((m) => m !== d)), children: /* @__PURE__ */ n(Qr, { size: 12 }) })
    ] }, d)) }) : null,
    /* @__PURE__ */ S("small", { className: "ws-prompt-selection-count", children: [
      "已选 ",
      s.length,
      e.max_items ? ` / ${e.max_items}` : "",
      " 项",
      i ? " · 可先移除再添加" : ""
    ] })
  ] });
}
function Nr({
  param: e,
  value: r,
  onChange: t,
  onClose: s,
  inline: f = !1
}) {
  if (e.type === "option" || e.type === "select") {
    const i = e.options || [];
    if (f) {
      const u = $t(i, r);
      return /* @__PURE__ */ S(
        "select",
        {
          className: "ws-prompt-param-input",
          "aria-label": e.name,
          value: u ? pt(u) : "",
          onChange: (g) => t(et(e, g.target.value)),
          children: [
            u ? null : /* @__PURE__ */ S("option", { value: "", children: [
              "请选择",
              e.name
            ] }),
            i.map((g) => /* @__PURE__ */ n("option", { value: pt(g), children: g.name || g.value }, g.id))
          ]
        }
      );
    }
    return /* @__PURE__ */ n("div", { className: "ws-prompt-menu-list", children: i.map((u) => {
      const g = Mr(
        u,
        [String(r ?? "")],
        i
      );
      return /* @__PURE__ */ S(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${g ? "is-active" : ""}`,
          onClick: () => {
            t(
              et(
                e,
                pt(u)
              )
            ), s();
          },
          children: [
            /* @__PURE__ */ n("span", { children: u.name || u.value }),
            g ? /* @__PURE__ */ n(wt, { size: 14 }) : null
          ]
        },
        u.id || u.value
      );
    }) });
  }
  if (e.type === "multi_option")
    return /* @__PURE__ */ n(jn, { param: e, value: r, onChange: t });
  if (e.type === "description")
    return /* @__PURE__ */ n("p", { className: "ws-prompt-param-description", children: String(r || e.default_value || "") });
  if (e.type === "switch") {
    const i = Sr(r);
    return /* @__PURE__ */ S(
      "button",
      {
        type: "button",
        className: `ws-prompt-switch ${i ? "is-on" : ""}`,
        onClick: () => t(!i),
        children: [
          /* @__PURE__ */ n("span", { children: e.name }),
          /* @__PURE__ */ n("i", {})
        ]
      }
    );
  }
  return e.type === "prompt" || e.type === "textarea" ? /* @__PURE__ */ n(
    "textarea",
    {
      className: "ws-prompt-param-textarea",
      "aria-label": e.name,
      value: Tt(r),
      placeholder: e.name,
      onChange: (i) => t(i.target.value)
    }
  ) : /* @__PURE__ */ n(
    "input",
    {
      className: "ws-prompt-param-input",
      "aria-label": e.name,
      type: e.value_type === "number" ? "number" : "text",
      value: Tt(r),
      placeholder: e.name,
      onChange: (i) => t(
        e.value_type === "number" ? Number(i.target.value) : i.target.value
      )
    }
  );
}
function Et(e, r) {
  if (e.type === "switch")
    return `${e.name}: ${Sr(r) ? "开" : "关"}`;
  if (e.type === "multi_option") {
    const s = Pr(r).length;
    return s > 0 ? `${e.name} ${s}` : e.name;
  }
  if (e.type === "option" || e.type === "select")
    return $t(e.options || [], r)?.name || e.name;
  const t = Tt(r);
  return t ? `${e.name}: ${t}` : e.name;
}
function Kn(e, r) {
  const t = String(r.preferredUsage || "").trim();
  if (t) {
    const f = e.find((i) => i.key === t);
    if (f)
      return f;
  }
  const s = new Set(r.acceptedKinds || []);
  if (s.size > 0) {
    const f = e.find(
      (i) => At(i).some((u) => s.has(u))
    );
    if (f)
      return f;
  }
  return e.length === 1 ? e[0] : void 0;
}
function nr(e, r) {
  return JSON.stringify([String(e || ""), r?.parts || []]);
}
function qn(e) {
  const r = /* @__PURE__ */ new Map();
  for (const t of e?.parts || []) {
    if (t.type !== "reference" || t.ref_media_excluded)
      continue;
    if (t.ref_media_items?.some((f) => f.usage)) {
      for (const f of t.ref_media_items) {
        const i = f.usage || t.usage;
        i && r.set(i, (r.get(i) || 0) + 1);
      }
      continue;
    }
    if (!t.usage) continue;
    const s = un(
      t,
      Number(t.ref_media_count || 0)
    );
    r.set(t.usage, (r.get(t.usage) || 0) + s);
  }
  return r;
}
function Wn(e, r) {
  const t = Vt(e);
  if (e.type !== "files")
    return r > 0 ? `${t}：已选择素材` : `选择${t}素材`;
  const s = Math.max(0, Number(e.max_files || 0));
  return r <= 0 ? s > 0 ? `选择${t}素材，最多 ${s} 个` : `选择${t}素材` : s > 0 ? `${t}：已选择 ${r} 个，最多 ${s} 个` : `${t}：已选择 ${r} 个`;
}
function Vt(e) {
  return String(e.name || e.key || "").trim() || "文件";
}
function Yn(e) {
  const r = At(e);
  return r.length === 1 ? r[0] : "file";
}
function Tt(e) {
  return e == null ? "" : Array.isArray(e) ? e.join("、") : String(e);
}
function Pr(e) {
  if (Array.isArray(e))
    return e.map((r) => String(r)).filter(Boolean);
  if (typeof e == "string") {
    const r = Gn(e);
    return Array.isArray(r) ? r.map((t) => String(t)).filter(Boolean) : e ? [e] : [];
  }
  return e ? [String(e)] : [];
}
function Gn(e) {
  if (!e)
    return e;
  try {
    return JSON.parse(e);
  } catch {
    return e;
  }
}
function kr({
  id: e,
  label: r,
  ariaLabel: t,
  icon: s,
  value: f,
  options: i,
  disabled: u = !1,
  openKey: g,
  onToggle: d,
  onChange: c
}) {
  return i.length === 0 ? null : /* @__PURE__ */ n(
    Ue,
    {
      id: e,
      openKey: g,
      label: r,
      icon: s,
      disabled: u,
      onToggle: d,
      children: /* @__PURE__ */ n("div", { className: "ws-prompt-menu-list", role: "menu", "aria-label": t, children: i.map((m) => /* @__PURE__ */ S(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${m.key === f ? "is-active" : ""}`,
          disabled: u,
          role: "menuitemradio",
          "aria-checked": m.key === f,
          onClick: () => {
            c(m.key), d("");
          },
          children: [
            /* @__PURE__ */ n("span", { children: m.label }),
            m.key === f ? /* @__PURE__ */ n(wt, { size: 14 }) : null
          ]
        },
        m.key
      )) })
    }
  );
}
function Hn({
  value: e,
  options: r,
  disabled: t = !1,
  openKey: s,
  onToggle: f,
  onChange: i
}) {
  const u = r.find((g) => g.key === e);
  return r.length === 0 ? null : /* @__PURE__ */ n(
    kr,
    {
      id: "storyboard-work-type",
      ariaLabel: "作品类型",
      label: u?.name || e,
      icon: /* @__PURE__ */ n(en, { size: 15 }),
      value: e,
      options: r.map((g) => ({
        key: g.key,
        label: g.name
      })),
      disabled: t,
      openKey: s,
      onToggle: f,
      onChange: i
    }
  );
}
function Jn({
  value: e,
  options: r,
  disabled: t = !1,
  openKey: s,
  onToggle: f,
  onChange: i
}) {
  const u = r.find((g) => g.seconds === e);
  return /* @__PURE__ */ n(
    kr,
    {
      id: "storyboard-min-shot-duration",
      ariaLabel: "单镜最短时长",
      label: `单镜最短 ${u?.name || `${e}秒`}`,
      icon: /* @__PURE__ */ n(tn, { size: 15 }),
      value: e,
      options: r.map((g) => ({
        key: g.seconds,
        label: g.name
      })),
      disabled: t,
      openKey: s,
      onToggle: f,
      onChange: i
    }
  );
}
const de = 1e3, ht = 60, Zn = [
  "meta",
  "metadata",
  "attrs",
  "audio",
  "audios",
  "video",
  "videos",
  "media_files",
  "mediaFiles",
  "output",
  "result",
  "data",
  "content",
  "body",
  "value",
  "asset",
  "version",
  "versions"
];
function gt(e) {
  const r = Math.max(
    0,
    Math.floor(Number(e || 0) / de)
  );
  return {
    minutes: Math.floor(r / ht),
    seconds: r % ht
  };
}
function Qn(e, r) {
  const t = e.find(
    (g) => String(g.purpose || "") === "soundtrack"
  ), s = mt(t?.asset_id), f = mt(t?.version_id), i = r.filter(
    (g) => mt(g.refId) === s
  ), u = i.find(
    (g) => !f || mt(g.versionID) === f
  ) || i[0];
  return {
    durationMs: or(u?.output) || or(u?.asset),
    audioUrl: String(u?.preview?.audioUrl || "").trim()
  };
}
function or(e) {
  return Ot(e, 0, /* @__PURE__ */ new Set());
}
function sr(e, r, t) {
  const s = Nt(t);
  if (s < de)
    return;
  const f = Math.min(
    Nt(e),
    s - de
  ), i = Math.min(
    s,
    Math.max(
      f + de,
      r == null ? s : Nt(r)
    )
  );
  return {
    startMs: f,
    endMs: i,
    soundtrackDurationMs: s
  };
}
function Xn(e) {
  return {
    start: {
      minMs: 0,
      maxMs: e.endMs - de
    },
    end: {
      minMs: e.startMs + de,
      maxMs: e.soundtrackDurationMs
    }
  };
}
function ar({
  minutes: e,
  seconds: r
}) {
  return (Math.max(0, Math.floor(e)) * ht + Math.min(ht - 1, Math.max(0, Math.floor(r)))) * de;
}
function ir(e) {
  const { minutes: r, seconds: t } = gt(e);
  return `${String(r).padStart(2, "0")}:${String(t).padStart(2, "0")}`;
}
function Ot(e, r, t) {
  if (e == null || r > 6)
    return 0;
  if (Array.isArray(e)) {
    for (const i of e) {
      const u = Ot(i, r + 1, t);
      if (u > 0)
        return u;
    }
    return 0;
  }
  if (typeof e != "object" || t.has(e))
    return 0;
  t.add(e);
  const s = e;
  for (const i of ["duration_ms", "durationMs"]) {
    const u = cr(s[i], 1);
    if (u > 0)
      return u;
  }
  const f = cr(s.duration, de);
  if (f > 0)
    return f;
  for (const i of Zn) {
    const u = Ot(
      s[i],
      r + 1,
      t
    );
    if (u > 0)
      return u;
  }
  return 0;
}
function cr(e, r) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? Math.round(t * r) : 0;
}
function Nt(e) {
  const r = Number(e);
  return Number.isFinite(r) && r > 0 ? Math.floor(r / de) * de : 0;
}
function mt(e) {
  const r = Number(e);
  return Number.isInteger(r) && r > 0 ? r : 0;
}
const Pt = 1e3;
function eo({
  startMs: e,
  endMs: r,
  soundtrackDurationMs: t,
  soundtrackUrl: s,
  disabled: f = !1,
  openKey: i,
  onToggle: u,
  onChange: g
}) {
  const d = to(
    t,
    s
  ), c = k(
    () => sr(
      e,
      r,
      d.durationMs
    ),
    [r, d.durationMs, e]
  ), m = c, I = m ? Xn(m) : void 0, y = !!(c && c.startMs === 0 && c.endMs === c.soundtrackDurationMs), v = c ? y ? "全曲" : `${ir(c.startMs)}–${ir(c.endMs)}` : "制作范围";
  function C(h, J) {
    const M = sr(
      h,
      J,
      d.durationMs
    );
    M && g(M.startMs, M.endMs);
  }
  return /* @__PURE__ */ n(
    Ue,
    {
      id: "storyboard-time-range",
      openKey: i,
      label: v,
      icon: /* @__PURE__ */ n(rn, { size: 15 }),
      filled: !!(c && !y),
      disabled: f,
      onToggle: u,
      children: /* @__PURE__ */ n("div", { className: "ws-storyboard-range-form", children: m && I ? /* @__PURE__ */ S(vt, { children: [
        /* @__PURE__ */ n(
          lr,
          {
            label: "开始位置",
            ariaLabelPrefix: "开始位置",
            valueMs: m.startMs,
            minMs: I.start.minMs,
            maxMs: I.start.maxMs,
            disabled: f,
            onChange: (h) => C(h, m.endMs)
          }
        ),
        /* @__PURE__ */ n(
          lr,
          {
            label: "结束位置",
            ariaLabelPrefix: "结束位置",
            valueMs: m.endMs,
            minMs: I.end.minMs,
            maxMs: I.end.maxMs,
            disabled: f,
            onChange: (h) => C(m.startMs, h)
          }
        )
      ] }) : /* @__PURE__ */ n("p", { className: "ws-storyboard-range-status", children: d.loading ? "正在读取音轨时长..." : "无法读取音轨时长" }) })
    }
  );
}
function lr({
  label: e,
  ariaLabelPrefix: r,
  valueMs: t,
  minMs: s,
  maxMs: f,
  disabled: i,
  onChange: u
}) {
  const g = gt(t), d = gt(s), c = gt(f), m = dr(d.minutes, c.minutes), I = ur(g.minutes, d, c), y = dr(I.minimum, I.maximum);
  return /* @__PURE__ */ S("div", { className: "ws-storyboard-range-field", children: [
    /* @__PURE__ */ n("span", { children: e }),
    /* @__PURE__ */ S("div", { className: "ws-storyboard-range-time", children: [
      /* @__PURE__ */ n(
        "select",
        {
          value: g.minutes,
          disabled: i,
          "aria-label": `${r}分钟`,
          onChange: (v) => {
            const C = Number(v.target.value), h = ur(
              C,
              d,
              c
            );
            u(
              ar({
                minutes: C,
                seconds: ro(
                  g.seconds,
                  h.minimum,
                  h.maximum
                )
              })
            );
          },
          children: m.map((v) => /* @__PURE__ */ S("option", { value: v, children: [
            v,
            "分"
          ] }, v))
        }
      ),
      /* @__PURE__ */ n(
        "select",
        {
          value: g.seconds,
          disabled: i,
          "aria-label": `${r}秒数`,
          onChange: (v) => u(
            ar({
              ...g,
              seconds: Number(v.target.value)
            })
          ),
          children: y.map((v) => /* @__PURE__ */ S("option", { value: v, children: [
            String(v).padStart(2, "0"),
            "秒"
          ] }, v))
        }
      )
    ] })
  ] });
}
function to(e, r) {
  const t = mr(e), s = String(r || "").trim(), [f, i] = V({
    audioUrl: "",
    durationMs: 0,
    failed: !1
  });
  G(() => {
    if (t || !s)
      return;
    const d = document.createElement("audio");
    let c = !0;
    const m = (v) => {
      if (!c)
        return;
      const C = mr(v);
      i({ audioUrl: s, durationMs: C, failed: !C });
    }, I = () => m(d.duration * 1e3), y = () => m(0);
    return d.preload = "metadata", d.addEventListener("loadedmetadata", I), d.addEventListener("error", y), d.src = s, d.load(), () => {
      c = !1, d.removeEventListener("loadedmetadata", I), d.removeEventListener("error", y), d.removeAttribute("src"), d.load();
    };
  }, [s, t]);
  const u = f.audioUrl === s ? f : void 0, g = t || u?.durationMs || 0;
  return {
    durationMs: g,
    loading: !g && !!s && !u?.failed
  };
}
function ur(e, r, t) {
  return {
    minimum: e === r.minutes ? r.seconds : 0,
    maximum: e === t.minutes ? t.seconds : 59
  };
}
function dr(e, r) {
  return Array.from(
    { length: Math.max(0, r - e + 1) },
    (t, s) => e + s
  );
}
function ro(e, r, t) {
  return Math.min(t, Math.max(r, e));
}
function mr(e) {
  const r = Number(e);
  return Number.isFinite(r) && r >= Pt ? Math.floor(r / Pt) * Pt : 0;
}
const pr = { zIndex: 999 }, ye = { save: "immediate" }, no = [], oo = {
  id: 0,
  name: "上传",
  key: "files",
  type: "files",
  usage: 2,
  max_files: 6
}, so = [oo];
function Xe(e) {
  return En(e?.source_rule);
}
function ao(e) {
  return e && ["option", "select", "multi_option", "switch"].includes(e.type) ? ye : void 0;
}
function fr(e, r, t, s) {
  const f = e.storyboardItem, i = new Set(f?.dependencyNodeIds || []);
  if (f?.itemType !== "shot" || !f.continuityAnchor || i.size !== 1)
    return { content: r, items: t };
  const u = t.filter(
    (c) => c.source === "current" && i.has(String(c.id || ""))
  ), g = new Set(
    u.map((c) => Number(c.refId || 0)).filter((c) => c > 0)
  );
  if (g.size === 0)
    return { content: r, items: t };
  const d = bn(s);
  return {
    content: r && {
      ...r,
      parts: r.parts.map(
        (c) => c.type === "reference" && c.ref_type === "asset" && g.has(Number(c.ref_id || 0)) ? { ...c, usage: d } : c
      )
    },
    items: t.map(
      (c) => u.includes(c) ? { ...c, kind: "image" } : c
    )
  };
}
function gr(e, r, t, s) {
  if (!s || !r || Ir(r, e.selectedTargetId || 0))
    return {
      content: e.promptContent,
      references: e.storyboardReferences || []
    };
  const f = e.storyboardWorkType || "short";
  return ft(
    e.promptContent,
    e.storyboardReferences,
    t,
    e.prompt || "",
    f,
    r.storyboard_reference_purposes
  );
}
function ko({ node: e }) {
  const [r, t] = V(""), {
    projectId: s,
    canvasId: f,
    runningNode: i,
    onNodeDraftChange: u,
    onAssetCreated: g,
    onClearFeedbackRecords: d,
    onRunBackendNode: c,
    onTextParamConnectionRemove: m,
    requestConfirm: I
  } = e, [y, v] = V(null), C = e.composerDraft, h = e.storyboardItem?.generatedPrompt, J = y?.params.find(It)?.key, M = k(
    () => qt(
      Ht(
        Wt(C),
        h,
        J
      )
    ),
    [J, h, C]
  ), U = k(
    () => Yt(M),
    [M]
  ), P = oe(M), se = oe(""), [be, me] = V(M.prompt || ""), [R, q] = V(M.promptContent), [K, he] = V(M.storyboardReferences || []), [H, ve] = V(M.storyboardWorkType || "short"), [pe, fe] = V(M.storyboardLyricsSourceNodeId || ""), [ke, Re] = V(
    () => Qe(M.minShotDuration)
  ), [St, ie] = V(
    M.storyboardRangeStartMs || 0
  ), [tt, ce] = V(M.storyboardRangeEndMs), [qe, rt] = V(!1), [Z, nt] = V(!1), [we, te] = V(
    M.selectedTargetId || 0
  ), [E, _e] = V(
    M.paramValues || {}
  ), [De, Se] = V(M.multiImageMode), Ve = oe(y), Le = e.inputContext, We = e.runBlockedReason;
  G(() => {
    const o = se.current;
    o && o !== U || (se.current = "", P.current = M);
  }, [M, U]), G(() => {
    Ve.current = y;
  }, [y]);
  const le = qe || Yr(i) || e.type === "power" && er(e.power, e.kind, e.outputType).viewMode === "writing" && On(e, e.resultOutput)?.document.status === "running", W = e.type, Ee = e.id, Te = e.flow?.id || 0, ze = e.type === "power" && e.power?.id || 0, Oe = e.type === "power" && e.power?.key || "", Me = e.type === "agent" ? Number(e.role?.agent_id || 0) : 0, x = e.space, Ie = e.canvasReferenceItems, O = e.connectedMediaReferences, Ce = e.onConnectedMediaUsagesChange, Ye = e.onConnectedMediaEdgeRemove, xe = e.catalogCache, ue = Number(
    x?.release?.id || x?.project.release_id || 0
  ), Ne = Number(e.assetCateId || 0), N = k(
    () => on(
      Le,
      Ie.filter((o) => o.id !== e.id)
    ),
    [Ie, Le, e.id]
  ), Ge = k(
    () => Qn(
      K,
      N.current
    ),
    [N, K]
  ), Fe = oe(N);
  G(() => {
    Fe.current = N;
  }, [N]);
  const Ae = k(() => {
    const o = /* @__PURE__ */ new Map();
    for (const a of Le?.sources || [])
      o.set(a.nodeId, {
        title: a.title || "上游节点",
        text: a.preview.text || (typeof a.output == "string" ? a.output : "")
      });
    const l = new Set(
      Object.values(M.paramBindings || {}).map(
        (a) => a.sourceNodeId
      )
    );
    pe && l.add(pe);
    for (const a of l) {
      if (o.has(a))
        continue;
      const b = Ie.find(
        (T) => T.id === a
      );
      o.set(a, {
        title: b?.title || "上游节点",
        text: b?.preview.text || ""
      });
    }
    return Object.fromEntries(o);
  }, [
    Ie,
    Le,
    M.paramBindings,
    pe
  ]), _ = e.type === "power" && er(e.power, e.kind, e.outputType)?.viewMode === "storyboard";
  G(() => {
    if (W === "power" && (ze || Oe)) {
      const o = P.current.selectedTargetId || 0;
      let l = !1;
      return nt(!0), xe.loadPowerForm(
        {
          projectId: s,
          releaseId: ue,
          flowId: Te,
          powerId: ze,
          powerKey: Oe,
          targetId: o
        },
        () => Gt({
          projectId: s,
          flowId: Te,
          powerId: ze,
          powerKey: Oe,
          targetId: o
        })
      ).then((a) => {
        if (l)
          return;
        const b = Ht(
          P.current,
          h,
          a.params.find(It)?.key
        ), T = gr(
          b,
          a,
          Fe.current.current,
          _
        );
        v(a), te(
          Xe(a) && (a.selected_target_id || o) || 0
        ), _e(
          Jt(a, b)
        ), me(b.prompt || ""), q(T.content), he(T.references), ve(b.storyboardWorkType || "short"), fe(
          b.storyboardLyricsSourceNodeId || ""
        ), Re(
          Qe(b.minShotDuration)
        ), ie(b.storyboardRangeStartMs || 0), ce(b.storyboardRangeEndMs), Se(b.multiImageMode);
      }).catch((a) => {
        l || t(
          a instanceof Error ? a.message : "加载能力参数失败"
        );
      }).finally(() => {
        l || nt(!1);
      }), () => {
        l = !0;
      };
    }
    if (v(null), W === "agent") {
      const o = P.current;
      _e(o.paramValues || {}), me(o.prompt || ""), q(o.promptContent), he(o.storyboardReferences || []), ve(o.storyboardWorkType || "short"), fe(""), Re(Xt), ie(0), ce(void 0), Se(void 0), te(0);
      return;
    }
    _e({}), te(0), me(""), q(void 0), he([]), ve("short"), fe(""), Re(Xt), ie(0), ce(void 0), Se(void 0);
  }, [
    xe,
    h,
    _,
    s,
    ue,
    Te,
    Me,
    Ee,
    W,
    ze,
    Oe
  ]);
  const D = y?.params || no, $e = Ir(
    y,
    we
  ), Q = k(
    () => $e ? E : dt(
      D,
      E,
      O.map((o) => o.source)
    ),
    [O, E, D, $e]
  ), p = k(
    () => Zt({
      node: e,
      content: R,
      items: N.current,
      connections: O,
      params: D,
      values: Q,
      requestedMode: De
    }),
    [
      N,
      O,
      Q,
      e,
      D,
      R,
      De
    ]
  ), w = p.active ? p.mode : void 0, L = !!se.current && se.current !== U ? P.current.multiImageMode || De || w : M.multiImageMode || w, B = k(
    () => Je(D, Q),
    [Q, D]
  ), X = k(
    () => Ze(B),
    [B]
  ), j = k(
    () => W === "power" ? mn(
      X,
      w
    ) : [],
    [X, w, W]
  ), Lt = k(() => {
    const o = new Set(
      X.map((a) => a.key)
    ), l = new Set(
      j.map((a) => a.key)
    );
    return B.filter(
      (a) => pn(a, D) && (!Ke(a) || !o.has(a.key) || l.has(a.key))
    );
  }, [
    X,
    B,
    j,
    D
  ]), Mt = k(
    () => fr(
      e,
      R,
      N.current,
      j
    ),
    [N, j, e, R]
  ), Rr = k(
    () => _ ? In(
      H,
      y?.storyboard_reference_purposes || []
    ) : [],
    [_, y, H]
  ), ot = W === "power" && ["image", "video"].includes(fn(e) || ""), _r = k(
    () => W === "power" && !Z ? Ct(
      O,
      Mt.content,
      Mt.items,
      j,
      {},
      ot,
      w
    ) : "",
    [
      O,
      j,
      Mt,
      Z,
      ot,
      W,
      w
    ]
  ), Dr = k(
    () => _ && !Z ? y ? Cn(
      K,
      H,
      y.storyboard_work_types,
      y.storyboard_reference_purposes
    ) : "分镜作品类型与参考用途配置加载失败，请重新打开节点后重试" : "",
    [
      _,
      y,
      Z,
      K,
      H
    ]
  ), He = e.storyboardItem?.itemType === "shot" ? e.storyboardItem.requiredDurationValues : void 0, st = k(
    () => Nn(
      y?.sources || [],
      He
    ),
    [y?.sources, He]
  ), Er = k(() => {
    if (!He?.length || Z || !y)
      return "";
    const o = Pn(
      He
    );
    return st.length === 0 ? o : Xe(y) && we > 0 && !st.some(
      (l) => l.target_id === we || l.id === we
    ) ? `当前所选模型不满足时长要求；${o}` : "";
  }, [
    st,
    y,
    Z,
    He,
    we
  ]), at = We || ($e ? "原来源已不可用，请重新选择来源" : "") || p.error || _r || Dr || Er, ae = k(
    () => B.find(It) || null,
    [B]
  ), Tr = k(
    () => Lt.filter(
      (o) => o.key !== ae?.key && (Ke(o) || vr(o) || kt(o, D))
    ),
    [Lt, D, ae?.key]
  ), re = ae ? String(Q[ae.key] ?? "") : be, Or = String(
    y?.power?.description || e.power?.description || ""
  ).trim() || (ae ? "在此处为该能力输入生成提示词..." : "当前能力无需填写提示词"), it = Xe(y), ne = y ? it ? we : 0 : M.selectedTargetId || 0;
  G(() => {
    if (W !== "power" && W !== "agent")
      return;
    const o = P.current, l = Ve.current, a = gr(
      o,
      l,
      Fe.current.current,
      _
    );
    me(o.prompt || ""), q(a.content), he(a.references), ve(o.storyboardWorkType || "short"), fe(
      o.storyboardLyricsSourceNodeId || ""
    ), Re(
      Qe(o.minShotDuration)
    ), ie(o.storyboardRangeStartMs || 0), ce(o.storyboardRangeEndMs), Se(o.multiImageMode), te(
      W === "power" && (!l || Xe(l)) && (o.selectedTargetId || l?.selected_target_id) || 0
    ), _e(
      W === "power" && l ? Jt(l, o) : o.paramValues || {}
    );
  }, [_, U, W]);
  const Pe = Y(
    (o, l) => {
      const a = Object.prototype.hasOwnProperty.call(
        o,
        "promptContent"
      ) ? o.promptContent : R, b = Wt({
        ...P.current,
        ...o,
        promptContent: a,
        ..._ ? {} : {
          storyboardReferences: [],
          storyboardWorkType: void 0,
          storyboardLyricsSourceNodeId: void 0,
          minShotDuration: void 0,
          storyboardRangeStartMs: void 0,
          storyboardRangeEndMs: void 0
        }
      });
      p.active && b.multiImageMode && (b.mediaSelections = gn(
        b.mediaSelections,
        yn(
          D,
          b.paramValues || {},
          b.multiImageMode
        ),
        b.promptContent,
        N.current,
        O
      )), P.current = b;
      const T = Yt(
        qt(b)
      );
      return se.current = T === U ? "" : T, Se(b.multiImageMode), u(e.id, b, l), b;
    },
    [
      _,
      U,
      e.id,
      u,
      R,
      p.active,
      D,
      N,
      O
    ]
  ), ct = Y(
    (o, l) => {
      o && I({
        title: "删除文本连接",
        description: l,
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => m(o, e.id)
      });
    },
    [e.id, m, I]
  ), xr = Y(
    (o) => {
      const l = P.current.paramBindings?.[o]?.sourceNodeId || "";
      ct(
        l,
        "删除后，上游文本将不再传入这个参数。"
      );
    },
    [ct]
  ), Ar = Y(() => {
    ct(
      String(P.current.storyboardLyricsSourceNodeId || "").trim(),
      "删除后，上游文本将不再作为 MV 歌词传入。"
    );
  }, [ct]), ge = Y(
    (o, l, a) => (_e(o), Pe({ ...l, paramValues: o }, a)),
    [Pe]
  );
  G(() => {
    $e || Q === E || ge(Q, {
      prompt: re,
      promptContent: R,
      selectedTargetId: ne,
      multiImageMode: L
    });
  }, [
    ne,
    Q,
    E,
    re,
    R,
    ge,
    L,
    $e
  ]);
  function $r(o, l) {
    const a = je(R) !== je(l), b = a ? Be(
      R,
      l,
      N.current,
      j,
      O,
      w
    ) : { content: l, assignments: {} }, T = b.content;
    Object.keys(b.assignments).length > 0 && Ce?.(b.assignments), me(o);
    const A = _ && a ? ft(
      T,
      K,
      N.current,
      o,
      H,
      y?.storyboard_reference_purposes || []
    ) : {
      content: T,
      references: K
    };
    q(A.content), he(A.references);
    const $ = P.current.paramValues || E, z = ae ? { ...$, [ae.key]: o } : $;
    ge(
      z,
      {
        prompt: o,
        promptContent: A.content,
        selectedTargetId: ne,
        storyboardReferences: A.references,
        storyboardWorkType: _ ? H : void 0,
        minShotDuration: _ ? ke : void 0,
        multiImageMode: L
      },
      a ? ye : void 0
    );
  }
  function Ur(o) {
    const l = ft(
      R,
      K,
      N.current,
      re,
      o,
      y?.storyboard_reference_purposes || []
    ), a = o === "mv" ? pe : "";
    ve(o), fe(a), q(l.content), he(l.references), Pe(
      {
        prompt: re,
        promptContent: l.content,
        paramValues: E,
        selectedTargetId: ne,
        storyboardReferences: l.references,
        storyboardWorkType: o,
        storyboardLyricsSourceNodeId: a || void 0,
        minShotDuration: ke,
        multiImageMode: L
      },
      ye
    );
  }
  function Vr(o) {
    const l = Qe(o);
    Re(l), Pe(
      {
        prompt: re,
        promptContent: R,
        paramValues: E,
        selectedTargetId: ne,
        storyboardReferences: K,
        storyboardWorkType: H,
        minShotDuration: l,
        multiImageMode: L
      },
      ye
    );
  }
  function Lr(o, l) {
    ie(o), ce(l), Pe(
      {
        prompt: re,
        promptContent: R,
        paramValues: E,
        selectedTargetId: ne,
        storyboardReferences: K,
        storyboardWorkType: H,
        storyboardRangeStartMs: o,
        storyboardRangeEndMs: l,
        minShotDuration: ke,
        multiImageMode: L
      },
      ye
    );
  }
  function zr(o, l) {
    const a = hn(D, {
      ...P.current.paramValues || E,
      [o]: l
    }, o), b = D.find(($) => $.key === o), T = ao(b), A = w;
    if (b && Rt(b) && A) {
      const $ = Qt({
        content: P.current.promptContent || R,
        items: N.current,
        connections: O,
        params: D,
        previousValues: P.current.paramValues || E,
        nextValues: a,
        previousMode: A,
        nextMode: A,
        selections: P.current.mediaSelections
      }), z = Be(
        R,
        $.content,
        N.current,
        Ze(Je(D, a)),
        O,
        A
      );
      Object.keys(z.assignments).length && Ce?.(z.assignments), t(""), q(z.content), ge(
        a,
        {
          prompt: re,
          promptContent: z.content,
          selectedTargetId: ne,
          multiImageMode: A,
          mediaSelections: $.selections
        },
        T
      );
      return;
    }
    if (b && kt(b, D)) {
      const $ = Ze(
        Je(D, a)
      ), z = Be(
        R,
        R,
        N.current,
        $,
        O,
        A
      );
      Object.keys(z.assignments).length > 0 && Ce?.(z.assignments), q(z.content), ge(
        a,
        {
          prompt: re,
          promptContent: z.content,
          selectedTargetId: ne,
          multiImageMode: L
        },
        T
      );
      return;
    }
    ge(
      a,
      {
        prompt: re,
        promptContent: R,
        selectedTargetId: ne,
        multiImageMode: L
      },
      T
    );
  }
  function Fr(o) {
    const l = p.options.find(
      (ee) => ee.value === o
    );
    if (!p.active || !l?.enabled) {
      t(l?.reason || "当前能力不支持该多图生成方式");
      return;
    }
    const a = P.current.paramValues || E, b = dt(
      D,
      a,
      O.map((ee) => ee.source)
    ), T = Ze(
      Je(D, b)
    ), A = Qt({
      content: P.current.promptContent || R,
      items: N.current,
      connections: O,
      params: D,
      previousValues: a,
      nextValues: b,
      previousMode: w || L || "per_image",
      nextMode: o,
      selections: P.current.mediaSelections
    }), $ = Be(
      R,
      A.content,
      N.current,
      T,
      O,
      o
    ), z = Ct(
      O,
      $.content,
      N.current,
      T,
      $.assignments,
      ot,
      o
    );
    t(z), Object.keys($.assignments).length > 0 && Ce?.($.assignments), q($.content), ge(
      b,
      {
        prompt: re,
        promptContent: $.content,
        selectedTargetId: ne,
        storyboardReferences: K,
        multiImageMode: o,
        mediaSelections: A.selections
      },
      ye
    );
  }
  function Br(o, l) {
    const a = je(R) !== je(l);
    me(o), q(l), Pe(
      {
        prompt: o,
        promptContent: l,
        paramValues: P.current.paramValues || E,
        selectedTargetId: 0
      },
      a ? ye : void 0
    );
  }
  function jr(o, l) {
    const a = {
      ...P.current.paramValues || E,
      [o]: l
    };
    ge(
      a,
      {
        prompt: be,
        selectedTargetId: 0
      },
      ye
    );
  }
  async function zt(o, l, a) {
    const b = await Tn({
      projectID: s,
      canvasID: f,
      teamID: Number(x?.project.team_id || 0),
      files: o,
      ruleID: l.upload_rule_id,
      onProgress: a?.onProgress
    });
    for (const T of b) {
      const A = nn(T.asset);
      A.id && g?.(A);
    }
    return b;
  }
  async function Kr(o) {
    if (!(le || !it) && !(e.type !== "power" || !e.power))
      try {
        const l = await xe.loadPowerForm(
          {
            projectId: s,
            releaseId: ue,
            flowId: e.flow?.id || 0,
            powerId: e.power.id,
            powerKey: e.power.key,
            targetId: o
          },
          () => Gt({
            projectId: s,
            flowId: e.flow?.id || 0,
            powerId: e.power?.id || 0,
            powerKey: e.power?.key || "",
            targetId: o
          })
        ), a = l.params || [], b = vn(
          a,
          P.current.paramValues || E,
          y?.params || []
        ), T = dt(
          a,
          b,
          O.map((Wr) => Wr.source)
        ), A = Zt({
          node: e,
          content: R,
          items: N.current,
          connections: O,
          params: a,
          values: T,
          requestedMode: De || w
        }), $ = A.active ? A.mode : void 0;
        if (A.error) {
          t(`无法切换能力来源：${A.error}`);
          return;
        }
        const z = Ze(
          Je(a, T)
        ), ee = Be(
          R,
          R,
          N.current,
          z,
          O,
          $
        ), lt = fr(
          e,
          ee.content,
          N.current,
          z
        ), ut = Ct(
          O,
          lt.content,
          lt.items,
          z,
          ee.assignments,
          ot,
          $
        );
        if (ut) {
          t(`无法切换能力来源：${ut}`);
          return;
        }
        Object.keys(ee.assignments).length > 0 && Ce?.(ee.assignments), v(l);
        const Bt = Xe(l) ? l.selected_target_id || o : 0;
        te(Bt), q(ee.content), ge(
          T,
          {
            prompt: re,
            promptContent: ee.content,
            selectedTargetId: Bt,
            multiImageMode: $
          },
          ye
        );
      } catch (l) {
        t(
          l instanceof Error ? l.message : "加载能力参数失败"
        );
      }
  }
  const qr = async (o, l) => {
    d([e.id]), rt(!0);
    try {
      if (e.type === "power" && e.power) {
        const a = P.current, b = Object.prototype.hasOwnProperty.call(
          a,
          "promptContent"
        ) ? a.promptContent : l, T = a.storyboardWorkType || H, A = Qe(
          a.minShotDuration ?? ke
        ), $ = _ ? ft(
          b,
          a.storyboardReferences || K,
          N.current,
          o,
          T,
          y?.storyboard_reference_purposes || []
        ) : {
          content: b,
          references: a.storyboardReferences || []
        }, z = w, ee = {
          ...dt(
            D,
            a.paramValues || Q,
            O.map((ut) => ut.source)
          )
        };
        ae && (ee[ae.key] = o);
        const lt = Pe({
          ...a,
          prompt: o,
          promptContent: $.content,
          paramValues: ee,
          selectedTargetId: ne,
          storyboardReferences: $.references,
          storyboardWorkType: _ ? T : void 0,
          minShotDuration: _ ? A : void 0,
          multiImageMode: z
        });
        await c({
          ...e,
          composerDraft: lt
        });
        return;
      }
      if (e.type === "agent" && e.role) {
        const a = P.current, b = Pe({
          ...a,
          prompt: o,
          promptContent: Object.prototype.hasOwnProperty.call(
            a,
            "promptContent"
          ) ? a.promptContent : l,
          paramValues: a.paramValues || E,
          selectedTargetId: 0
        });
        await c({
          ...e,
          composerDraft: b
        });
        return;
      }
      throw new Error("当前节点缺少可运行配置");
    } catch (a) {
      t(a instanceof Error ? a.message : "执行出错");
    } finally {
      rt(!1);
    }
  }, Ft = async (o, l) => {
    if (!le) {
      if (at) {
        t(at);
        return;
      }
      await qr(o, l);
    }
  };
  return e.type === "power" ? /* @__PURE__ */ S(
    "div",
    {
      className: "ws-node-bottom-settings is-composer nodrag nowheel",
      onClick: (o) => o.stopPropagation(),
      style: pr,
      children: [
        /* @__PURE__ */ n(
          jt,
          {
            message: r,
            onDismiss: () => t("")
          }
        ),
        Z && !le && !y ? /* @__PURE__ */ S("div", { className: "ws-prompt-loading", children: [
          /* @__PURE__ */ n(yr, { size: 16, className: "ws-spin" }),
          /* @__PURE__ */ n("span", { children: "正在加载能力参数..." })
        ] }) : /* @__PURE__ */ n(
          rr,
          {
            value: re,
            referenceContent: R,
            placeholder: Or,
            running: le,
            textInputEnabled: !!ae,
            showMediaParamButtons: !0,
            mediaParamPower: y?.power || e.power,
            sourceOptions: it ? st : [],
            selectedSourceId: ne,
            params: Tr,
            primaryParam: ae || void 0,
            paramValues: Q,
            paramBindings: M.paramBindings,
            paramBindingSources: Ae,
            storyboardLyricsBindingSource: _ && H === "mv" && pe ? Ae[pe] || {
              title: "上游节点"
            } : void 0,
            assetLibrary: N,
            assetReference: {
              teamID: Number(x?.project.team_id || 0),
              projectID: s,
              assetCateID: Ne
            },
            connectedMediaReferences: O,
            mediaUsageOptions: j,
            referenceUsageOptions: _ ? Rr : void 0,
            referenceUsageField: _ ? "purpose" : "usage",
            multiImagePlan: p,
            multiImageMode: w,
            toolbarContent: _ ? ({ openKey: o, onToggle: l }) => /* @__PURE__ */ S(vt, { children: [
              /* @__PURE__ */ n(
                Hn,
                {
                  value: H,
                  options: y?.storyboard_work_types || [],
                  disabled: Z || le,
                  openKey: o,
                  onToggle: l,
                  onChange: Ur
                }
              ),
              /* @__PURE__ */ n(
                Jn,
                {
                  value: ke,
                  options: y?.storyboard_min_shot_durations || [],
                  disabled: Z || le,
                  openKey: o,
                  onToggle: l,
                  onChange: Vr
                }
              ),
              H === "mv" && K.some(
                (a) => a.purpose === "soundtrack"
              ) ? /* @__PURE__ */ n(
                eo,
                {
                  startMs: St,
                  endMs: tt,
                  soundtrackDurationMs: Ge.durationMs,
                  soundtrackUrl: Ge.audioUrl,
                  disabled: Z || le,
                  openKey: o,
                  onToggle: l,
                  onChange: Lr
                }
              ) : null
            ] }) : void 0,
            onConnectedMediaEdgeRemove: Ye,
            disabled: Z || !y,
            submitDisabled: !!at,
            submitDisabledReason: at,
            onChange: $r,
            onParamChange: zr,
            onParamBindingConnectionRemove: xr,
            onStoryboardLyricsConnectionRemove: Ar,
            onMultiImageModeChange: Fr,
            onSourceChange: it ? (o) => {
              Kr(o);
            } : void 0,
            onLocalUpload: zt,
            onSubmit: Ft
          }
        )
      ]
    }
  ) : /* @__PURE__ */ S(
    "div",
    {
      className: "ws-node-bottom-settings is-composer nodrag nowheel",
      onClick: (o) => o.stopPropagation(),
      style: pr,
      children: [
        /* @__PURE__ */ n(
          jt,
          {
            message: r,
            onDismiss: () => t("")
          }
        ),
        /* @__PURE__ */ n(
          rr,
          {
            value: be,
            referenceContent: R,
            placeholder: "向智能体发送任务指令...",
            running: le,
            params: so,
            paramValues: E,
            assetLibrary: N,
            assetReference: {
              teamID: Number(x?.project.team_id || 0),
              projectID: s,
              assetCateID: Ne
            },
            connectedMediaReferences: O,
            onConnectedMediaEdgeRemove: Ye,
            onChange: Br,
            onParamChange: jr,
            onLocalUpload: zt,
            onSubmit: Ft
          }
        )
      ]
    }
  );
}
export {
  ko as CanvasNodeSettings
};
