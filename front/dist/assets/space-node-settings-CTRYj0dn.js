import { a as v, j as n, F as vt } from "./preloadable-R-5sHdlM.js";
import { i as Gr, S as Kt } from "./space-node-runtime-mQKAQcW3.js";
import { u as P, h as K, a as U, b as oe, d as H, F as Hr } from "./file-kind-Cq3pESGF.js";
import { C as wt, b as Jr, aF as Zr, r as br, aG as hr, c as At, L as vr, aA as Qr, X as Xr, aD as qt, h as en, a5 as tn, T as rn, y as nn } from "./vendor-icons-IZIW7U43.js";
import { u as on, v as Ke, x as Wt, y as Yt, z as Gt, l as sn, m as Ht, A as an } from "./writing-reference-DlogpT9K.js";
import { h as Jt, i as cn } from "./node-detail-header-_ds1F0v7.js";
import { i as qe, e as $t, f as wr, g as Rt, h as ln, j as _t, k as un, r as je, l as dn, s as mn, m as pn, n as Dt, P as Sr, o as et, p as Mr, q as Ut, t as pt, u as Ir, S as fn, v as Ct, w as Zt, x as Cr, y as dt, z as Qt, A as Je, B as Ze, C as gn, D as yn, a as bn, E as Nt, F as hn, G as vn, H as wn, I as Xt, J as Sn, K as Mn } from "./space-media-references-_pbyPR9I.js";
import { a as yt } from "./space-story-setting-reference-B-1GhfJK.js";
import { a as Et, P as In } from "./power-icon-DnoEnQhv.js";
import { a as Cn } from "./space-reference-editor-IHy_u0OI.js";
import { H as Nn, J as Qe, K as er, L as Pn, N as kn, O as Rn, P as _n, Q as ft } from "./asset-preview-DpK5-z_L.js";
import { n as Dn } from "./text-content-save-actions-BEz7xJXA.js";
import { u as En } from "./asset-reference-provider-DmRAo8Yt.js";
import { B as Vt } from "./asset-audio-preview-Du5K0btg.js";
import { d as Tn, r as tr, i as On } from "./space-assistant-layout-B9KyeCM0.js";
import { b as xn } from "./space-upload-B-1PIF2y.js";
function rr(e) {
  return Tn(
    e?.service_name,
    e?.name,
    "来源"
  );
}
const An = 240, $n = [], Un = [], Vn = {}, Ln = {};
function nr({
  value: e,
  placeholder: t,
  running: r = !1,
  disabled: s = !1,
  textInputEnabled: l = !0,
  showMediaParamButtons: c = !1,
  mediaParamPower: f,
  submitDisabled: g = !1,
  submitDisabledReason: d = "",
  sourceOptions: y = [],
  selectedSourceId: a = 0,
  params: I = [],
  primaryParam: T,
  paramValues: m = {},
  paramBindings: M = Vn,
  paramBindingSources: h = Ln,
  storyboardLyricsBindingSource: q,
  assetLibrary: B = { current: [] },
  referenceContent: w,
  assetReference: Q,
  connectedMediaReferences: k = $n,
  mediaUsageOptions: le = Un,
  referenceUsageOptions: Ve,
  referenceUsageField: fe = "usage",
  multiImagePlan: C,
  multiImageMode: j,
  toolbarContent: J,
  onConnectedMediaEdgeRemove: Se,
  onChange: W,
  onParamChange: Me,
  onParamBindingConnectionRemove: ue,
  onStoryboardLyricsConnectionRemove: Ee,
  onSourceChange: Te,
  onMultiImageModeChange: Oe,
  onLocalUpload: Le,
  onSubmit: Ie
}) {
  const ze = P(
    () => I.filter(qe),
    [I]
  ), ge = T ? M[T.key] : void 0, St = ge ? h[ge.sourceNodeId] : void 0, tt = K(
    (p) => {
      const S = Fn(p);
      B.current = [
        ...B.current.filter(
          (N) => N.refType !== p.refType || Number(N.refId || 0) !== p.refId
        ),
        S
      ];
    },
    [B]
  ), X = K(
    async (p, S) => {
      if (!Le)
        throw new Error("当前节点未配置本地上传");
      const N = qn(ze, S);
      if (!N)
        throw new Error("当前能力没有与所选素材类型匹配的上传参数");
      const $ = (await Le(p, N, {
        onProgress: S.onProgress
      })).map((G) => Dn(G.asset)).filter((G) => G.id > 0);
      if ($.length === 0)
        throw new Error("上传成功，但没有生成可用资产");
      return $;
    },
    [Le, ze]
  ), rt = En({
    notificationMode: "inline",
    teamID: Number(Q?.teamID || 0),
    scopeProjectID: Number(Q?.projectID || 0),
    initialFilters: Q?.projectID ? {
      sourceType: "project",
      projectID: Q.projectID,
      assetCateID: Number(Q.assetCateID || 0)
    } : void 0,
    onSelect: tt,
    onUpload: Le ? X : void 0
  }), [ee, Y] = U(""), [L, Ce] = U(), xe = oe(0), ye = K((p) => {
    Y(""), xe.current += 1, Ce({
      id: xe.current,
      trigger: "@",
      preferredUsage: p.key,
      acceptedKinds: $t(p)
    });
  }, []), nt = K(
    (p) => {
      Ce(
        (S) => S?.id === p ? void 0 : S
      );
    },
    []
  ), Ne = P(
    () => I.filter(
      (p) => qe(p) || !!p.group || wr(p) || Rt(p, I)
    ),
    [I]
  ), Mt = P(
    () => ln(Ne),
    [Ne]
  ), se = P(
    () => y.find(
      (p) => p.target_id === a || p.id === a
    ),
    [a, y]
  ), z = a > 0 && !se, We = C?.active && j === "shared_reference" ? C.frameUsages : [], Ye = Ne.some(
    _t
  ), Ae = /* @__PURE__ */ n(
    zn,
    {
      plan: C,
      openKey: ee,
      disabled: s || r,
      onToggle: Y,
      onChange: Oe
    }
  ), ae = B.current, V = P(() => {
    if (z || s)
      return { value: e, content: w };
    const p = on(
      e,
      w,
      un(k, ae)
    );
    return {
      ...p,
      content: je(
        w,
        p.content,
        ae,
        le,
        k,
        j
      ).content
    };
  }, [
    k,
    s,
    le,
    j,
    w,
    ae,
    z,
    e
  ]), be = P(
    () => le.map((p) => ({
      key: p.key,
      label: p.label,
      acceptedKinds: p.acceptedKinds,
      maxFiles: p.maxFiles
    })),
    [le]
  ), Fe = P(
    () => Ve || be,
    [Ve, be]
  ), _ = P(
    () => Wn(V.content),
    [V.content]
  ), Pe = P(
    () => or(e, w),
    [w, e]
  ), Be = P(
    () => or(
      V.value,
      V.content
    ),
    [V.content, V.value]
  ), de = oe({
    value: V.value,
    content: V.content
  }), he = oe(!1), $e = oe(null), R = oe(W), Ge = oe(Ie);
  R.current = W, Ge.current = Ie;
  const ke = K(() => {
    $e.current !== null && (window.clearTimeout($e.current), $e.current = null);
  }, []), ie = K(() => {
    if (ke(), !he.current)
      return;
    he.current = !1;
    const p = de.current;
    R.current(p.value, p.content);
  }, [ke]), D = K(
    (p, S, N = !1) => {
      const me = de.current.content;
      de.current = {
        value: p,
        content: S
      }, he.current = !0;
      const $ = Ke(me) !== Ke(S);
      if (N || $) {
        ie();
        return;
      }
      ke(), $e.current = window.setTimeout(
        ie,
        An
      );
    },
    [ke, ie]
  ), O = K((p, S, N) => {
    const me = de.current;
    if (!me.content) return "请先添加参考图片";
    const $ = dn(me.content, ae, k), G = $.find(
      (Z) => Z.ref_type === p.ref_type && Z.ref_id === p.ref_id && Number(Z.ref_version_id || 0) === Number(p.ref_version_id || 0)
    );
    if (!G) return "引用图片已变化，请重新选择";
    try {
      const Z = mn(
        me.content,
        $,
        S,
        N ? { part: G, media: N, label: p.label } : void 0
      );
      D(me.value, Z, !0);
    } catch (Z) {
      return Z instanceof Error ? Z.message : String(Z);
    }
  }, [k, ae, D]), Re = K(() => {
    const p = de.current;
    return ie(), Ge.current(p.value, p.content);
  }, [ie]);
  return H(() => {
    he.current || (de.current = {
      value: V.value,
      content: V.content
    });
  }, [
    Be,
    V.content,
    V.value
  ]), H(
    () => () => {
      ie();
    },
    [ie]
  ), H(() => {
    (s || r) && Y("");
  }, [s, r]), H(() => {
    z || s || Pe !== Be && (he.current || D(
      V.value,
      V.content,
      !0
    ));
  }, [
    Pe,
    s,
    Be,
    V.content,
    V.value,
    z,
    D
  ]), /* @__PURE__ */ v(
    "div",
    {
      className: `ws-prompt-composer nowheel ${r ? "is-running" : ""}`,
      children: [
        /* @__PURE__ */ n("div", { className: "ws-prompt-main", children: /* @__PURE__ */ v("div", { className: "ws-prompt-editor-shell", children: [
          T && ge ? /* @__PURE__ */ n(
            bt,
            {
              label: yt(T),
              source: St,
              compact: !0,
              disabled: s || r,
              onRemove: () => ue?.(T.key)
            }
          ) : null,
          q ? /* @__PURE__ */ n(
            bt,
            {
              label: "歌词",
              source: q,
              compact: !0,
              disabled: s || r,
              onRemove: () => Ee?.()
            }
          ) : null,
          /* @__PURE__ */ n(
            Cn,
            {
              className: "ws-prompt-reference-editor nodrag nopan",
              value: V.value,
              content: V.content,
              disabled: s || r,
              textEditable: l,
              placeholder: t,
              items: ae,
              usageOptions: We.length > 0 ? [] : Fe,
              usageField: fe,
              mediaUsageOptions: be,
              mediaSelectionMaxFiles: C?.active && j === "per_image" ? 0 : void 0,
              mediaSelectionUsages: We.length ? We : void 0,
              onReferenceMediaUsageSelect: O,
              autoAssignUsage: fe !== "purpose",
              pickerRequest: L,
              onPickerRequestConsumed: nt,
              assetReferenceProvider: Q?.teamID ? rt : void 0,
              onReferenceDelete: (p) => {
                p.ref_origin === "edge" && p.ref_origin_id && Se?.(p.ref_origin_id);
              },
              onChange: D,
              onBlur: ie,
              onSubmit: !r && !g ? () => {
                Re();
              } : void 0
            }
          )
        ] }) }),
        /* @__PURE__ */ v("div", { className: "ws-prompt-toolbar", children: [
          /* @__PURE__ */ v("div", { className: "ws-prompt-tools", children: [
            y.length > 0 || a > 0 ? /* @__PURE__ */ n(
              Ue,
              {
                id: "source",
                openKey: ee,
                label: z ? "来源不可用，请重新选择" : rr(se),
                icon: /* @__PURE__ */ n(Jr, { size: 15 }),
                disabled: s || r,
                onToggle: Y,
                children: /* @__PURE__ */ v("div", { className: "ws-prompt-menu-list", children: [
                  y.length === 0 ? /* @__PURE__ */ n("span", { className: "ws-prompt-menu-item", role: "status", children: "暂无可用来源" }) : null,
                  y.map((p) => {
                    const S = p.target_id || p.id, N = S === a;
                    return /* @__PURE__ */ v(
                      "button",
                      {
                        type: "button",
                        className: `ws-prompt-menu-item ${N ? "is-active" : ""}`,
                        disabled: s || r,
                        onClick: () => {
                          Te?.(S), Y("");
                        },
                        children: [
                          /* @__PURE__ */ n("span", { children: rr(p) }),
                          N ? /* @__PURE__ */ n(wt, { size: 14 }) : null
                        ]
                      },
                      S
                    );
                  })
                ] })
              }
            ) : null,
            J?.({ openKey: ee, onToggle: Y }),
            Ye ? null : Ae,
            !c && ze.length > 0 ? /* @__PURE__ */ n(
              Ue,
              {
                id: "attachments",
                openKey: ee,
                label: "添加素材",
                icon: /* @__PURE__ */ n(Zr, { size: 17 }),
                iconOnly: !0,
                variant: "attachments",
                disabled: s || r,
                onToggle: Y,
                children: /* @__PURE__ */ n("div", { className: "ws-prompt-menu-list is-attachments", role: "menu", children: ze.map((p) => /* @__PURE__ */ v(
                  "button",
                  {
                    type: "button",
                    className: "ws-prompt-menu-item",
                    role: "menuitem",
                    onClick: () => ye(p),
                    children: [
                      /* @__PURE__ */ n("span", { className: "ws-prompt-menu-kind-icon", children: /* @__PURE__ */ n(Nn, { kind: Gn(p) }) }),
                      /* @__PURE__ */ n("span", { children: Lt(p) })
                    ]
                  },
                  p.key
                )) })
              }
            ) : null,
            Mt.map((p) => {
              if ("group" in p)
                return /* @__PURE__ */ n(
                  jn,
                  {
                    group: p.group,
                    params: p.params,
                    values: m,
                    bindings: M,
                    bindingSources: h,
                    mediaCounts: _,
                    mediaPower: f,
                    openKey: ee,
                    disabled: s || r,
                    onToggle: Y,
                    onChange: ($, G) => Me?.($.key, G),
                    onMediaPick: ye,
                    onBindingRemove: ue
                  },
                  p.key
                );
              const S = p.param, N = M[S.key], me = qe(S) ? c ? /* @__PURE__ */ n(
                Nr,
                {
                  param: S,
                  power: f,
                  selectedCount: _.get(S.key) || 0,
                  disabled: s || r,
                  onClick: () => ye(S)
                }
              ) : null : /* @__PURE__ */ n(
                Bn,
                {
                  param: S,
                  value: m[S.key],
                  binding: N,
                  bindingSource: N ? h[N.sourceNodeId] : void 0,
                  openKey: ee,
                  disabled: s || r,
                  onToggle: Y,
                  onChange: ($) => Me?.(S.key, $),
                  onBindingRemove: ue
                }
              );
              return /* @__PURE__ */ v(Hr, { children: [
                me,
                _t(S) ? Ae : null
              ] }, S.key);
            })
          ] }),
          /* @__PURE__ */ n("div", { className: "ws-prompt-submit-group", children: /* @__PURE__ */ n(Vt, { label: d || void 0, children: /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "ws-prompt-submit",
              disabled: s || r || g,
              onClick: () => {
                Re();
              },
              "aria-label": d || "发送",
              children: r ? /* @__PURE__ */ n(br, { size: 17, className: "ws-spin" }) : /* @__PURE__ */ n(hr, { size: 18 })
            }
          ) }) })
        ] })
      ]
    }
  );
}
function zn({
  plan: e,
  openKey: t,
  disabled: r,
  onToggle: s,
  onChange: l
}) {
  if (!e?.active || !e.mode || !e.frameUsages.length && e.imageCount <= 1 && !e.structured)
    return null;
  const f = e.options.filter((a) => a.enabled).find(
    (a) => a.value === e.mode
  ), g = e.mode === "shared_reference" && e.frameUsages.length > 0 && e.imageCount === 1 ? "首帧生成" : f?.label || (e.mode === "per_image" ? "每图一条视频" : "多图共同参考"), d = e.mode === "per_image" ? e.imageCount : 1, y = `${g} · 共${d}条`;
  return e.options.length <= 1 ? /* @__PURE__ */ n("span", { className: "ws-prompt-tool-wrap", children: /* @__PURE__ */ v("span", { className: "ws-prompt-tool is-static", "aria-label": y, children: [
    /* @__PURE__ */ n(qt, { size: 15 }),
    /* @__PURE__ */ n("span", { children: y })
  ] }) }) : /* @__PURE__ */ n(
    Ue,
    {
      id: "multi-image-mode",
      openKey: t,
      label: y,
      icon: /* @__PURE__ */ n(qt, { size: 15 }),
      disabled: r,
      onToggle: s,
      children: /* @__PURE__ */ n("div", { className: "ws-prompt-menu-list", children: e.options.map((a) => {
        const I = a.value === e.mode, T = a.value === "per_image" ? e.imageCount : 1;
        return /* @__PURE__ */ v(
          "button",
          {
            type: "button",
            className: `ws-prompt-menu-item ${I ? "is-active" : ""}`,
            disabled: r || !a.enabled,
            title: a.reason,
            onClick: () => {
              l?.(a.value), s("");
            },
            children: [
              /* @__PURE__ */ n("span", { children: `${a.label} · 共${T}条` }),
              I ? /* @__PURE__ */ n(wt, { size: 14 }) : null
            ]
          },
          a.value
        );
      }) })
    }
  );
}
function Nr({
  param: e,
  power: t,
  selectedCount: r,
  disabled: s,
  onClick: l
}) {
  const c = r > 0;
  return /* @__PURE__ */ n(Vt, { label: Yn(e, r), children: /* @__PURE__ */ v(
    "button",
    {
      type: "button",
      className: `ws-prompt-tool is-media-param ${c ? "is-selected" : ""}`,
      disabled: s,
      "aria-pressed": c,
      onClick: l,
      children: [
        /* @__PURE__ */ n(In, { power: t, size: 15 }),
        /* @__PURE__ */ n("span", { children: Lt(e) }),
        e.type === "files" && c ? /* @__PURE__ */ n("small", { className: "ws-prompt-media-count", children: r }) : null
      ]
    }
  ) });
}
function Fn(e) {
  const t = String(e.preview?.kind || "file"), r = String(e.preview?.url || "");
  return {
    id: `${e.refType}:${e.refId}`,
    title: e.label,
    kind: t,
    source: e.refType,
    refType: e.refType,
    refId: e.refId,
    versionID: e.versionID,
    output: e.output,
    asset: e.asset,
    preview: {
      text: e.description || "",
      imageUrl: t === "image" ? r : "",
      videoUrl: t === "video" ? r : "",
      audioUrl: t === "audio" ? r : "",
      fileUrl: t === "file" ? r : ""
    }
  };
}
function Bn({
  param: e,
  value: t,
  binding: r,
  bindingSource: s,
  openKey: l,
  disabled: c,
  onToggle: f,
  onChange: g,
  onBindingRemove: d
}) {
  const [y, a] = U(!1), [I, T] = U(
    null
  ), m = Dt(e.preview_type);
  if (H(() => {
    (c || m === "none") && a(!1);
  }, [c, m]), (e.type === "option" || e.type === "select") && m !== "none") {
    const M = Tt(e, t);
    return /* @__PURE__ */ v(vt, { children: [
      /* @__PURE__ */ n("span", { className: "ws-prompt-tool-wrap", children: /* @__PURE__ */ v(
        "button",
        {
          type: "button",
          className: "ws-prompt-tool",
          disabled: c,
          "aria-label": M,
          onClick: (h) => {
            f(""), T(
              h.currentTarget.closest(
                ".ws-storyboard-workspace-editor-anchor"
              )
            ), a(!0);
          },
          children: [
            /* @__PURE__ */ n(Et, { name: e.icon, size: 15 }),
            /* @__PURE__ */ n("span", { children: M }),
            /* @__PURE__ */ n(At, { size: 14 })
          ]
        }
      ) }),
      /* @__PURE__ */ n(
        Sr,
        {
          open: y,
          portalContainer: I,
          layerZIndex: I ? 1100 : void 0,
          title: e.name || e.key,
          previewType: m,
          options: e.options || [],
          value: t,
          disabled: c,
          onOpenChange: a,
          onConfirm: (h) => g(et(e, h))
        }
      )
    ] });
  }
  return /* @__PURE__ */ n(
    Ue,
    {
      id: e.key,
      openKey: l,
      label: r ? `${yt(e)} · 已连接` : Tt(e, t),
      icon: r ? /* @__PURE__ */ n(vr, { size: 15 }) : /* @__PURE__ */ n(Et, { name: e.icon, size: 15 }),
      filled: !!r,
      disabled: c,
      onToggle: f,
      children: r ? /* @__PURE__ */ n(
        bt,
        {
          label: yt(e),
          source: s,
          disabled: c,
          onRemove: () => d?.(e.key)
        }
      ) : /* @__PURE__ */ n(
        Pr,
        {
          param: e,
          value: t,
          onChange: g,
          onClose: () => f("")
        }
      )
    }
  );
}
function jn({
  group: e,
  params: t,
  values: r,
  bindings: s,
  bindingSources: l,
  mediaCounts: c,
  mediaPower: f,
  openKey: g,
  disabled: d,
  onToggle: y,
  onChange: a,
  onMediaPick: I,
  onBindingRemove: T
}) {
  const [m, M] = U(null);
  return H(() => {
    d && M(null);
  }, [d]), /* @__PURE__ */ v(vt, { children: [
    /* @__PURE__ */ n(
      Ue,
      {
        id: `param-group:${e.id}`,
        openKey: g,
        label: e.name,
        icon: /* @__PURE__ */ n(Et, { name: e.icon, size: 15 }),
        variant: "group",
        disabled: d,
        onToggle: y,
        children: /* @__PURE__ */ n("div", { className: "ws-prompt-param-group", children: t.map((h) => {
          const q = s[h.key], B = h.type === "option" && Dt(h.preview_type) !== "none";
          return /* @__PURE__ */ v("div", { className: "ws-prompt-param-group-field", children: [
            /* @__PURE__ */ v("label", { children: [
              h.name,
              h.required ? /* @__PURE__ */ n("span", { className: "ws-prompt-param-required", children: " *" }) : null
            ] }),
            q ? /* @__PURE__ */ n(
              bt,
              {
                label: yt(h),
                source: l[q.sourceNodeId],
                disabled: d,
                onRemove: () => T?.(h.key)
              }
            ) : qe(h) ? /* @__PURE__ */ n(
              Nr,
              {
                param: h,
                power: f,
                selectedCount: c.get(h.key) || 0,
                disabled: d,
                onClick: () => I(h)
              }
            ) : B ? /* @__PURE__ */ v(
              "button",
              {
                type: "button",
                className: "ws-prompt-group-option",
                disabled: d,
                onClick: (w) => {
                  M({
                    param: h,
                    container: w.currentTarget.closest(
                      ".ws-storyboard-workspace-editor-anchor"
                    )
                  }), y("");
                },
                children: [
                  /* @__PURE__ */ n("span", { children: Tt(h, r[h.key]) }),
                  /* @__PURE__ */ n(At, { size: 14 })
                ]
              }
            ) : /* @__PURE__ */ n(
              Pr,
              {
                param: h,
                value: r[h.key],
                inline: !0,
                onChange: (w) => a(h, w),
                onClose: () => {
                }
              }
            )
          ] }, h.key);
        }) })
      }
    ),
    m ? /* @__PURE__ */ n(
      Sr,
      {
        open: !0,
        portalContainer: m.container,
        layerZIndex: m.container ? 1100 : void 0,
        title: m.param.name,
        previewType: Dt(
          m.param.preview_type
        ),
        options: m.param.options || [],
        value: r[m.param.key],
        disabled: d,
        onOpenChange: (h) => {
          h || M(null);
        },
        onConfirm: (h) => a(
          m.param,
          et(m.param, h)
        )
      }
    ) : null
  ] });
}
function bt({
  label: e,
  source: t,
  compact: r = !1,
  disabled: s,
  onRemove: l
}) {
  const c = String(t?.title || "上游节点").trim(), f = String(t?.text || "").trim();
  return /* @__PURE__ */ v("div", { className: `ws-param-binding-preview ${r ? "is-compact" : ""}`, children: [
    /* @__PURE__ */ v("div", { className: "ws-param-binding-preview-heading", children: [
      /* @__PURE__ */ n(vr, { size: 15, "aria-hidden": "true" }),
      /* @__PURE__ */ v("span", { children: [
        /* @__PURE__ */ n("strong", { children: e }),
        /* @__PURE__ */ v("small", { title: c, children: [
          "来自 ",
          c
        ] })
      ] }),
      /* @__PURE__ */ n(Vt, { label: "删除连接", children: /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "ws-param-binding-remove",
          disabled: s,
          "aria-label": "删除连接",
          onClick: l,
          children: /* @__PURE__ */ n(en, { size: 14 })
        }
      ) })
    ] }),
    /* @__PURE__ */ n(
      "p",
      {
        className: f ? "" : "is-empty",
        title: f || void 0,
        children: f || "等待上游生成"
      }
    )
  ] });
}
function Ue({
  id: e,
  openKey: t,
  label: r,
  icon: s,
  iconOnly: l = !1,
  variant: c = "default",
  filled: f = !1,
  disabled: g,
  children: d,
  onToggle: y
}) {
  const a = !g && t === e, I = c === "attachments" ? "is-attachments" : c === "group" ? "is-parameter-group" : "", T = oe(null), m = oe(null), M = K(() => {
    m.current != null && (window.clearTimeout(m.current), m.current = null);
  }, []), h = K(() => {
    M(), m.current = window.setTimeout(() => {
      m.current = null, y("");
    }, 240);
  }, [M, y]);
  return H(() => (a || M(), M), [M, a]), H(() => {
    if (!a || c !== "group") return;
    const q = (w) => {
      w.target instanceof Node && !T.current?.contains(w.target) && y("");
    }, B = (w) => {
      w.key === "Escape" && y("");
    };
    return document.addEventListener("pointerdown", q), document.addEventListener("keydown", B), () => {
      document.removeEventListener("pointerdown", q), document.removeEventListener("keydown", B);
    };
  }, [y, a, c]), /* @__PURE__ */ v(
    "span",
    {
      ref: T,
      className: `ws-prompt-tool-wrap ${I} ${a ? "is-open" : ""}`,
      onMouseEnter: () => {
        M(), !g && c !== "group" && y(e);
      },
      onMouseLeave: () => {
        a && c !== "group" && h();
      },
      children: [
        /* @__PURE__ */ v(
          "button",
          {
            type: "button",
            className: `ws-prompt-tool ${l ? "is-icon-only" : ""} ${a ? "is-open" : ""} ${f ? "is-filled" : ""}`,
            disabled: g,
            "aria-label": r,
            "aria-expanded": a,
            "aria-haspopup": c === "attachments" ? "menu" : void 0,
            onClick: () => {
              g || (M(), y(a ? "" : e));
            },
            children: [
              s,
              l ? null : /* @__PURE__ */ n("span", { children: r }),
              l ? null : /* @__PURE__ */ n(At, { size: 14 })
            ]
          }
        ),
        a ? /* @__PURE__ */ n(
          "div",
          {
            className: `ws-prompt-popover ${I}`,
            onMouseEnter: M,
            children: d
          }
        ) : null
      ]
    }
  );
}
function Kn({
  param: e,
  value: t,
  onChange: r
}) {
  const s = kr(t), l = e.options || [], c = !!e.max_items && s.length >= e.max_items, f = (d) => {
    const y = Ut(l, d);
    return y?.name || y?.value || d;
  }, g = (d, y) => {
    const a = [...s];
    [a[d], a[d + y]] = [a[d + y], a[d]], r(a);
  };
  return /* @__PURE__ */ v("div", { className: "ws-prompt-multi-select", onPointerDown: (d) => d.stopPropagation(), children: [
    /* @__PURE__ */ n(
      fn,
      {
        multiple: !0,
        clearable: !1,
        value: s,
        options: l.filter((d) => !c || Ir(d, s, l)).map((d) => ({ id: pt(d), value: d.name || d.value })),
        placeholder: "选择选项，可多选",
        className: "border-0 bg-muted/30 shadow-none",
        onChange: (d) => r(et(e, d))
      }
    ),
    s.length > 0 ? /* @__PURE__ */ n("div", { className: "ws-prompt-selected-list", children: s.map((d, y) => /* @__PURE__ */ v("div", { className: "ws-prompt-selected-item", children: [
      /* @__PURE__ */ n("span", { className: "ws-prompt-selected-order", children: y + 1 }),
      /* @__PURE__ */ n("span", { className: "ws-prompt-selected-name", children: f(d) }),
      /* @__PURE__ */ n("button", { type: "button", "aria-label": `前移${f(d)}`, disabled: y === 0, onClick: () => g(y, -1), children: /* @__PURE__ */ n(hr, { size: 12 }) }),
      /* @__PURE__ */ n("button", { type: "button", "aria-label": `后移${f(d)}`, disabled: y === s.length - 1, onClick: () => g(y, 1), children: /* @__PURE__ */ n(Qr, { size: 12 }) }),
      /* @__PURE__ */ n("button", { type: "button", "aria-label": `移除${f(d)}`, onClick: () => r(s.filter((a) => a !== d)), children: /* @__PURE__ */ n(Xr, { size: 12 }) })
    ] }, d)) }) : null,
    /* @__PURE__ */ v("small", { className: "ws-prompt-selection-count", children: [
      "已选 ",
      s.length,
      e.max_items ? ` / ${e.max_items}` : "",
      " 项",
      c ? " · 可先移除再添加" : ""
    ] })
  ] });
}
function Pr({
  param: e,
  value: t,
  onChange: r,
  onClose: s,
  inline: l = !1
}) {
  if (e.type === "option" || e.type === "select") {
    const c = e.options || [];
    if (l) {
      const f = Ut(c, t);
      return /* @__PURE__ */ v(
        "select",
        {
          className: "ws-prompt-param-input",
          "aria-label": e.name,
          value: f ? pt(f) : "",
          onChange: (g) => r(et(e, g.target.value)),
          children: [
            f ? null : /* @__PURE__ */ v("option", { value: "", children: [
              "请选择",
              e.name
            ] }),
            c.map((g) => /* @__PURE__ */ n("option", { value: pt(g), children: g.name || g.value }, g.id))
          ]
        }
      );
    }
    return /* @__PURE__ */ n("div", { className: "ws-prompt-menu-list", children: c.map((f) => {
      const g = Ir(
        f,
        [String(t ?? "")],
        c
      );
      return /* @__PURE__ */ v(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${g ? "is-active" : ""}`,
          onClick: () => {
            r(
              et(
                e,
                pt(f)
              )
            ), s();
          },
          children: [
            /* @__PURE__ */ n("span", { children: f.name || f.value }),
            g ? /* @__PURE__ */ n(wt, { size: 14 }) : null
          ]
        },
        f.id || f.value
      );
    }) });
  }
  if (e.type === "multi_option")
    return /* @__PURE__ */ n(Kn, { param: e, value: t, onChange: r });
  if (e.type === "description")
    return /* @__PURE__ */ n("p", { className: "ws-prompt-param-description", children: String(t || e.default_value || "") });
  if (e.type === "switch") {
    const c = Mr(t);
    return /* @__PURE__ */ v(
      "button",
      {
        type: "button",
        className: `ws-prompt-switch ${c ? "is-on" : ""}`,
        onClick: () => r(!c),
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
      value: Ot(t),
      placeholder: e.name,
      onChange: (c) => r(c.target.value)
    }
  ) : /* @__PURE__ */ n(
    "input",
    {
      className: "ws-prompt-param-input",
      "aria-label": e.name,
      type: e.value_type === "number" ? "number" : "text",
      value: Ot(t),
      placeholder: e.name,
      onChange: (c) => r(
        e.value_type === "number" ? Number(c.target.value) : c.target.value
      )
    }
  );
}
function Tt(e, t) {
  if (e.type === "switch")
    return `${e.name}: ${Mr(t) ? "开" : "关"}`;
  if (e.type === "multi_option") {
    const s = kr(t).length;
    return s > 0 ? `${e.name} ${s}` : e.name;
  }
  if (e.type === "option" || e.type === "select")
    return Ut(e.options || [], t)?.name || e.name;
  const r = Ot(t);
  return r ? `${e.name}: ${r}` : e.name;
}
function qn(e, t) {
  const r = String(t.preferredUsage || "").trim();
  if (r) {
    const l = e.find((c) => c.key === r);
    if (l)
      return l;
  }
  const s = new Set(t.acceptedKinds || []);
  if (s.size > 0) {
    const l = e.find(
      (c) => $t(c).some((f) => s.has(f))
    );
    if (l)
      return l;
  }
  return e.length === 1 ? e[0] : void 0;
}
function or(e, t) {
  return JSON.stringify([String(e || ""), t?.parts || []]);
}
function Wn(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e?.parts || []) {
    if (r.type !== "reference" || r.ref_media_excluded)
      continue;
    if (r.ref_media_items?.some((l) => l.usage)) {
      for (const l of r.ref_media_items) {
        const c = l.usage || r.usage;
        c && t.set(c, (t.get(c) || 0) + 1);
      }
      continue;
    }
    if (!r.usage) continue;
    const s = pn(
      r,
      Number(r.ref_media_count || 0)
    );
    t.set(r.usage, (t.get(r.usage) || 0) + s);
  }
  return t;
}
function Yn(e, t) {
  const r = Lt(e);
  if (e.type !== "files")
    return t > 0 ? `${r}：已选择素材` : `选择${r}素材`;
  const s = Math.max(0, Number(e.max_files || 0));
  return t <= 0 ? s > 0 ? `选择${r}素材，最多 ${s} 个` : `选择${r}素材` : s > 0 ? `${r}：已选择 ${t} 个，最多 ${s} 个` : `${r}：已选择 ${t} 个`;
}
function Lt(e) {
  return String(e.name || e.key || "").trim() || "文件";
}
function Gn(e) {
  const t = $t(e);
  return t.length === 1 ? t[0] : "file";
}
function Ot(e) {
  return e == null ? "" : Array.isArray(e) ? e.join("、") : String(e);
}
function kr(e) {
  if (Array.isArray(e))
    return e.map((t) => String(t)).filter(Boolean);
  if (typeof e == "string") {
    const t = Hn(e);
    return Array.isArray(t) ? t.map((r) => String(r)).filter(Boolean) : e ? [e] : [];
  }
  return e ? [String(e)] : [];
}
function Hn(e) {
  if (!e)
    return e;
  try {
    return JSON.parse(e);
  } catch {
    return e;
  }
}
function Rr({
  id: e,
  label: t,
  ariaLabel: r,
  icon: s,
  value: l,
  options: c,
  disabled: f = !1,
  openKey: g,
  onToggle: d,
  onChange: y
}) {
  return c.length === 0 ? null : /* @__PURE__ */ n(
    Ue,
    {
      id: e,
      openKey: g,
      label: t,
      icon: s,
      disabled: f,
      onToggle: d,
      children: /* @__PURE__ */ n("div", { className: "ws-prompt-menu-list", role: "menu", "aria-label": r, children: c.map((a) => /* @__PURE__ */ v(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${a.key === l ? "is-active" : ""}`,
          disabled: f,
          role: "menuitemradio",
          "aria-checked": a.key === l,
          onClick: () => {
            y(a.key), d("");
          },
          children: [
            /* @__PURE__ */ n("span", { children: a.label }),
            a.key === l ? /* @__PURE__ */ n(wt, { size: 14 }) : null
          ]
        },
        a.key
      )) })
    }
  );
}
function Jn({
  value: e,
  options: t,
  disabled: r = !1,
  openKey: s,
  onToggle: l,
  onChange: c
}) {
  const f = t.find((g) => g.key === e);
  return t.length === 0 ? null : /* @__PURE__ */ n(
    Rr,
    {
      id: "storyboard-work-type",
      ariaLabel: "作品类型",
      label: f?.name || e,
      icon: /* @__PURE__ */ n(tn, { size: 15 }),
      value: e,
      options: t.map((g) => ({
        key: g.key,
        label: g.name
      })),
      disabled: r,
      openKey: s,
      onToggle: l,
      onChange: c
    }
  );
}
function Zn({
  value: e,
  options: t,
  disabled: r = !1,
  openKey: s,
  onToggle: l,
  onChange: c
}) {
  const f = t.find((g) => g.seconds === e);
  return /* @__PURE__ */ n(
    Rr,
    {
      id: "storyboard-min-shot-duration",
      ariaLabel: "单镜最短时长",
      label: `单镜最短 ${f?.name || `${e}秒`}`,
      icon: /* @__PURE__ */ n(rn, { size: 15 }),
      value: e,
      options: t.map((g) => ({
        key: g.seconds,
        label: g.name
      })),
      disabled: r,
      openKey: s,
      onToggle: l,
      onChange: c
    }
  );
}
const pe = 1e3, ht = 60, Qn = [
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
  const t = Math.max(
    0,
    Math.floor(Number(e || 0) / pe)
  );
  return {
    minutes: Math.floor(t / ht),
    seconds: t % ht
  };
}
function Xn(e, t) {
  const r = e.find(
    (g) => String(g.purpose || "") === "soundtrack"
  ), s = mt(r?.asset_id), l = mt(r?.version_id), c = t.filter(
    (g) => mt(g.refId) === s
  ), f = c.find(
    (g) => !l || mt(g.versionID) === l
  ) || c[0];
  return {
    durationMs: sr(f?.output) || sr(f?.asset),
    audioUrl: String(f?.preview?.audioUrl || "").trim()
  };
}
function sr(e) {
  return xt(e, 0, /* @__PURE__ */ new Set());
}
function ar(e, t, r) {
  const s = Pt(r);
  if (s < pe)
    return;
  const l = Math.min(
    Pt(e),
    s - pe
  ), c = Math.min(
    s,
    Math.max(
      l + pe,
      t == null ? s : Pt(t)
    )
  );
  return {
    startMs: l,
    endMs: c,
    soundtrackDurationMs: s
  };
}
function eo(e) {
  return {
    start: {
      minMs: 0,
      maxMs: e.endMs - pe
    },
    end: {
      minMs: e.startMs + pe,
      maxMs: e.soundtrackDurationMs
    }
  };
}
function ir({
  minutes: e,
  seconds: t
}) {
  return (Math.max(0, Math.floor(e)) * ht + Math.min(ht - 1, Math.max(0, Math.floor(t)))) * pe;
}
function cr(e) {
  const { minutes: t, seconds: r } = gt(e);
  return `${String(t).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}
function xt(e, t, r) {
  if (e == null || t > 6)
    return 0;
  if (Array.isArray(e)) {
    for (const c of e) {
      const f = xt(c, t + 1, r);
      if (f > 0)
        return f;
    }
    return 0;
  }
  if (typeof e != "object" || r.has(e))
    return 0;
  r.add(e);
  const s = e;
  for (const c of ["duration_ms", "durationMs"]) {
    const f = lr(s[c], 1);
    if (f > 0)
      return f;
  }
  const l = lr(s.duration, pe);
  if (l > 0)
    return l;
  for (const c of Qn) {
    const f = xt(
      s[c],
      t + 1,
      r
    );
    if (f > 0)
      return f;
  }
  return 0;
}
function lr(e, t) {
  const r = Number(e);
  return Number.isFinite(r) && r > 0 ? Math.round(r * t) : 0;
}
function Pt(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? Math.floor(t / pe) * pe : 0;
}
function mt(e) {
  const t = Number(e);
  return Number.isInteger(t) && t > 0 ? t : 0;
}
const kt = 1e3;
function to({
  startMs: e,
  endMs: t,
  soundtrackDurationMs: r,
  soundtrackUrl: s,
  disabled: l = !1,
  openKey: c,
  onToggle: f,
  onChange: g
}) {
  const d = ro(
    r,
    s
  ), y = P(
    () => ar(
      e,
      t,
      d.durationMs
    ),
    [t, d.durationMs, e]
  ), a = y, I = a ? eo(a) : void 0, T = !!(y && y.startMs === 0 && y.endMs === y.soundtrackDurationMs), m = y ? T ? "全曲" : `${cr(y.startMs)}–${cr(y.endMs)}` : "制作范围";
  function M(h, q) {
    const B = ar(
      h,
      q,
      d.durationMs
    );
    B && g(B.startMs, B.endMs);
  }
  return /* @__PURE__ */ n(
    Ue,
    {
      id: "storyboard-time-range",
      openKey: c,
      label: m,
      icon: /* @__PURE__ */ n(nn, { size: 15 }),
      filled: !!(y && !T),
      disabled: l,
      onToggle: f,
      children: /* @__PURE__ */ n("div", { className: "ws-storyboard-range-form", children: a && I ? /* @__PURE__ */ v(vt, { children: [
        /* @__PURE__ */ n(
          ur,
          {
            label: "开始位置",
            ariaLabelPrefix: "开始位置",
            valueMs: a.startMs,
            minMs: I.start.minMs,
            maxMs: I.start.maxMs,
            disabled: l,
            onChange: (h) => M(h, a.endMs)
          }
        ),
        /* @__PURE__ */ n(
          ur,
          {
            label: "结束位置",
            ariaLabelPrefix: "结束位置",
            valueMs: a.endMs,
            minMs: I.end.minMs,
            maxMs: I.end.maxMs,
            disabled: l,
            onChange: (h) => M(a.startMs, h)
          }
        )
      ] }) : /* @__PURE__ */ n("p", { className: "ws-storyboard-range-status", children: d.loading ? "正在读取音轨时长..." : "无法读取音轨时长" }) })
    }
  );
}
function ur({
  label: e,
  ariaLabelPrefix: t,
  valueMs: r,
  minMs: s,
  maxMs: l,
  disabled: c,
  onChange: f
}) {
  const g = gt(r), d = gt(s), y = gt(l), a = mr(d.minutes, y.minutes), I = dr(g.minutes, d, y), T = mr(I.minimum, I.maximum);
  return /* @__PURE__ */ v("div", { className: "ws-storyboard-range-field", children: [
    /* @__PURE__ */ n("span", { children: e }),
    /* @__PURE__ */ v("div", { className: "ws-storyboard-range-time", children: [
      /* @__PURE__ */ n(
        "select",
        {
          value: g.minutes,
          disabled: c,
          "aria-label": `${t}分钟`,
          onChange: (m) => {
            const M = Number(m.target.value), h = dr(
              M,
              d,
              y
            );
            f(
              ir({
                minutes: M,
                seconds: no(
                  g.seconds,
                  h.minimum,
                  h.maximum
                )
              })
            );
          },
          children: a.map((m) => /* @__PURE__ */ v("option", { value: m, children: [
            m,
            "分"
          ] }, m))
        }
      ),
      /* @__PURE__ */ n(
        "select",
        {
          value: g.seconds,
          disabled: c,
          "aria-label": `${t}秒数`,
          onChange: (m) => f(
            ir({
              ...g,
              seconds: Number(m.target.value)
            })
          ),
          children: T.map((m) => /* @__PURE__ */ v("option", { value: m, children: [
            String(m).padStart(2, "0"),
            "秒"
          ] }, m))
        }
      )
    ] })
  ] });
}
function ro(e, t) {
  const r = pr(e), s = String(t || "").trim(), [l, c] = U({
    audioUrl: "",
    durationMs: 0,
    failed: !1
  });
  H(() => {
    if (r || !s)
      return;
    const d = document.createElement("audio");
    let y = !0;
    const a = (m) => {
      if (!y)
        return;
      const M = pr(m);
      c({ audioUrl: s, durationMs: M, failed: !M });
    }, I = () => a(d.duration * 1e3), T = () => a(0);
    return d.preload = "metadata", d.addEventListener("loadedmetadata", I), d.addEventListener("error", T), d.src = s, d.load(), () => {
      y = !1, d.removeEventListener("loadedmetadata", I), d.removeEventListener("error", T), d.removeAttribute("src"), d.load();
    };
  }, [s, r]);
  const f = l.audioUrl === s ? l : void 0, g = r || f?.durationMs || 0;
  return {
    durationMs: g,
    loading: !g && !!s && !f?.failed
  };
}
function dr(e, t, r) {
  return {
    minimum: e === t.minutes ? t.seconds : 0,
    maximum: e === r.minutes ? r.seconds : 59
  };
}
function mr(e, t) {
  return Array.from(
    { length: Math.max(0, t - e + 1) },
    (r, s) => e + s
  );
}
function no(e, t, r) {
  return Math.min(r, Math.max(t, e));
}
function pr(e) {
  const t = Number(e);
  return Number.isFinite(t) && t >= kt ? Math.floor(t / kt) * kt : 0;
}
const fr = { zIndex: 999 }, we = { save: "immediate" }, oo = [], so = {
  id: 0,
  name: "上传",
  key: "files",
  type: "files",
  usage: 2,
  max_files: 6
}, ao = [so];
function Xe(e) {
  return On(e?.source_rule);
}
function io(e) {
  return e && ["option", "select", "multi_option", "switch"].includes(e.type) ? we : void 0;
}
function gr(e, t, r, s) {
  const l = e.storyboardItem, c = new Set(l?.dependencyNodeIds || []);
  if (l?.itemType !== "shot" && l?.itemType !== "shot_image" || !l.continuityAnchor || c.size !== 1)
    return { content: t, items: r };
  const f = r.filter(
    (a) => a.source === "current" && c.has(String(a.id || ""))
  ), g = new Set(
    f.map((a) => Number(a.refId || 0)).filter((a) => a > 0)
  );
  if (g.size === 0)
    return { content: t, items: r };
  const d = r.map(
    (a) => f.includes(a) ? { ...a, kind: "image" } : a
  );
  if (l.itemType === "shot_image")
    return { content: t, items: d };
  const y = wn(s);
  return {
    content: t && {
      ...t,
      parts: t.parts.map(
        (a) => a.type === "reference" && a.ref_type === "asset" && g.has(Number(a.ref_id || 0)) ? { ...a, usage: y } : a
      )
    },
    items: d
  };
}
function yr(e, t, r, s) {
  if (!s || !t || Cr(t, e.selectedTargetId || 0))
    return {
      content: e.promptContent,
      references: e.storyboardReferences || []
    };
  const l = e.storyboardWorkType || "short";
  return ft(
    e.promptContent,
    e.storyboardReferences,
    r,
    e.prompt || "",
    l,
    t.storyboard_reference_purposes
  );
}
function ko({ node: e, onReplaceImage: t }) {
  const [r, s] = U(""), {
    projectId: l,
    canvasId: c,
    runningNode: f,
    onNodeDraftChange: g,
    onAssetCreated: d,
    onClearFeedbackRecords: y,
    onRunBackendNode: a,
    onTextParamConnectionRemove: I,
    requestConfirm: T
  } = e, [m, M] = U(null), h = e.composerDraft, q = e.storyboardItem?.generatedPrompt, B = m?.params.find(Ct)?.key, w = P(
    () => Wt(
      Jt(
        Yt(h),
        q,
        B
      )
    ),
    [B, q, h]
  ), Q = P(
    () => Gt(w),
    [w]
  ), k = oe(w), le = oe(""), [Ve, fe] = U(w.prompt || ""), [C, j] = U(w.promptContent), [J, Se] = U(w.storyboardReferences || []), [W, Me] = U(w.storyboardWorkType || "short"), [ue, Ee] = U(w.storyboardLyricsSourceNodeId || ""), [Te, Oe] = U(
    () => Qe(w.minShotDuration)
  ), [Le, Ie] = U(
    w.storyboardRangeStartMs || 0
  ), [ze, ge] = U(w.storyboardRangeEndMs), [St, tt] = U(!1), [X, rt] = U(!1), [ee, Y] = U(
    w.selectedTargetId || 0
  ), [L, Ce] = U(
    w.paramValues || {}
  ), [xe, ye] = U(w.multiImageMode), nt = oe(m), Ne = e.inputContext, Mt = e.runBlockedReason;
  H(() => {
    const o = le.current;
    o && o !== Q || (le.current = "", k.current = w);
  }, [w, Q]), H(() => {
    nt.current = m;
  }, [m]);
  const se = St || Gr(f) || e.type === "power" && tr(e.power, e.kind, e.outputType).viewMode === "writing" && sn(e, e.resultOutput)?.document.status === "running", z = e.type, We = e.id, Ye = e.flow?.id || 0, Ae = e.type === "power" && e.power?.id || 0, ae = e.type === "power" && e.power?.key || "", V = e.type === "agent" ? Number(e.role?.agent_id || 0) : 0, be = e.space, Fe = e.canvasReferenceItems, _ = e.connectedMediaReferences, Pe = e.onConnectedMediaUsagesChange, Be = e.onConnectedMediaEdgeRemove, de = e.catalogCache, he = Number(
    be?.release?.id || be?.project.release_id || 0
  ), $e = Number(e.assetCateId || 0), R = P(
    () => cn(
      Ne,
      Fe.filter((o) => o.id !== e.id)
    ),
    [Fe, Ne, e.id]
  ), Ge = P(
    () => Xn(
      J,
      R.current
    ),
    [R, J]
  ), ke = oe(R);
  H(() => {
    ke.current = R;
  }, [R]);
  const ie = P(() => {
    const o = /* @__PURE__ */ new Map();
    for (const i of Ne?.sources || [])
      o.set(i.nodeId, {
        title: i.title || "上游节点",
        text: i.preview.text || (typeof i.output == "string" ? i.output : "")
      });
    const u = new Set(
      Object.values(w.paramBindings || {}).map(
        (i) => i.sourceNodeId
      )
    );
    ue && u.add(ue);
    for (const i of u) {
      if (o.has(i))
        continue;
      const b = Fe.find(
        (E) => E.id === i
      );
      o.set(i, {
        title: b?.title || "上游节点",
        text: b?.preview.text || ""
      });
    }
    return Object.fromEntries(o);
  }, [
    Fe,
    Ne,
    w.paramBindings,
    ue
  ]), D = e.type === "power" && tr(e.power, e.kind, e.outputType)?.viewMode === "storyboard";
  H(() => {
    if (z === "power" && (Ae || ae)) {
      const o = k.current.selectedTargetId || 0;
      let u = !1;
      return rt(!0), de.loadPowerForm(
        {
          projectId: l,
          releaseId: he,
          flowId: Ye,
          powerId: Ae,
          powerKey: ae,
          targetId: o
        },
        () => Ht({
          projectId: l,
          flowId: Ye,
          powerId: Ae,
          powerKey: ae,
          targetId: o
        })
      ).then((i) => {
        if (u)
          return;
        const b = Jt(
          k.current,
          q,
          i.params.find(Ct)?.key
        ), E = yr(
          b,
          i,
          ke.current.current,
          D
        );
        M(i), Y(
          Xe(i) && (i.selected_target_id || o) || 0
        ), Ce(
          Zt(i, b)
        ), fe(b.prompt || ""), j(E.content), Se(E.references), Me(b.storyboardWorkType || "short"), Ee(
          b.storyboardLyricsSourceNodeId || ""
        ), Oe(
          Qe(b.minShotDuration)
        ), Ie(b.storyboardRangeStartMs || 0), ge(b.storyboardRangeEndMs), ye(b.multiImageMode);
      }).catch((i) => {
        u || s(
          i instanceof Error ? i.message : "加载能力参数失败"
        );
      }).finally(() => {
        u || rt(!1);
      }), () => {
        u = !0;
      };
    }
    if (M(null), z === "agent") {
      const o = k.current;
      Ce(o.paramValues || {}), fe(o.prompt || ""), j(o.promptContent), Se(o.storyboardReferences || []), Me(o.storyboardWorkType || "short"), Ee(""), Oe(er), Ie(0), ge(void 0), ye(void 0), Y(0);
      return;
    }
    Ce({}), Y(0), fe(""), j(void 0), Se([]), Me("short"), Ee(""), Oe(er), Ie(0), ge(void 0), ye(void 0);
  }, [
    de,
    q,
    D,
    l,
    he,
    Ye,
    V,
    We,
    z,
    Ae,
    ae
  ]);
  const O = m?.params || oo, Re = Cr(
    m,
    ee
  ), p = P(
    () => Re ? L : dt(
      O,
      L,
      _.map((o) => o.source)
    ),
    [_, L, O, Re]
  ), S = P(
    () => Qt({
      node: e,
      content: C,
      items: R.current,
      connections: _,
      params: O,
      values: p,
      requestedMode: xe
    }),
    [
      R,
      _,
      p,
      e,
      O,
      C,
      xe
    ]
  ), N = S.active ? S.mode : void 0, $ = !!le.current && le.current !== Q ? k.current.multiImageMode || xe || N : w.multiImageMode || N, G = P(
    () => Je(O, p),
    [p, O]
  ), Z = P(
    () => Ze(G),
    [G]
  ), _e = P(
    () => z === "power" ? gn(
      Z,
      N
    ) : [],
    [Z, N, z]
  ), zt = P(() => {
    const o = new Set(
      Z.map((i) => i.key)
    ), u = new Set(
      _e.map((i) => i.key)
    );
    return G.filter(
      (i) => yn(i, O) && (!qe(i) || !o.has(i.key) || u.has(i.key))
    );
  }, [
    Z,
    G,
    _e,
    O
  ]), It = P(
    () => gr(
      e,
      C,
      R.current,
      _e
    ),
    [R, _e, e, C]
  ), _r = P(
    () => D ? Pn(
      W,
      m?.storyboard_reference_purposes || []
    ) : [],
    [D, m, W]
  ), ot = z === "power" && ["image", "video"].includes(bn(e) || ""), Dr = P(
    () => z === "power" && !X ? Nt(
      _,
      It.content,
      It.items,
      _e,
      {},
      ot,
      N
    ) : "",
    [
      _,
      _e,
      It,
      X,
      ot,
      z,
      N
    ]
  ), Er = P(
    () => D && !X ? m ? kn(
      J,
      W,
      m.storyboard_work_types,
      m.storyboard_reference_purposes
    ) : "分镜作品类型与参考用途配置加载失败，请重新打开节点后重试" : "",
    [
      D,
      m,
      X,
      J,
      W
    ]
  ), He = e.storyboardItem?.itemType === "shot" ? e.storyboardItem.requiredDurationValues : void 0, st = P(
    () => Rn(
      m?.sources || [],
      He
    ),
    [m?.sources, He]
  ), Tr = P(() => {
    if (!He?.length || X || !m)
      return "";
    const o = _n(
      He
    );
    return st.length === 0 ? o : Xe(m) && ee > 0 && !st.some(
      (u) => u.target_id === ee || u.id === ee
    ) ? `当前所选模型不满足时长要求；${o}` : "";
  }, [
    st,
    m,
    X,
    He,
    ee
  ]), at = Mt || (Re ? "原来源已不可用，请重新选择来源" : "") || S.error || Dr || Er || Tr, ce = P(
    () => G.find(Ct) || null,
    [G]
  ), Or = P(
    () => zt.filter(
      (o) => o.key !== ce?.key && (qe(o) || wr(o) || Rt(o, O))
    ),
    [zt, O, ce?.key]
  ), re = ce ? String(p[ce.key] ?? "") : Ve, xr = String(
    m?.power?.description || e.power?.description || ""
  ).trim() || (ce ? "在此处为该能力输入生成提示词..." : "当前能力无需填写提示词"), it = Xe(m), ne = m ? it ? ee : 0 : w.selectedTargetId || 0;
  H(() => {
    if (z !== "power" && z !== "agent")
      return;
    const o = k.current, u = nt.current, i = yr(
      o,
      u,
      ke.current.current,
      D
    );
    fe(o.prompt || ""), j(i.content), Se(i.references), Me(o.storyboardWorkType || "short"), Ee(
      o.storyboardLyricsSourceNodeId || ""
    ), Oe(
      Qe(o.minShotDuration)
    ), Ie(o.storyboardRangeStartMs || 0), ge(o.storyboardRangeEndMs), ye(o.multiImageMode), Y(
      z === "power" && (!u || Xe(u)) && (o.selectedTargetId || u?.selected_target_id) || 0
    ), Ce(
      z === "power" && u ? Zt(u, o) : o.paramValues || {}
    );
  }, [D, Q, z]);
  const De = K(
    (o, u) => {
      const i = Object.prototype.hasOwnProperty.call(
        o,
        "promptContent"
      ) ? o.promptContent : C, b = Yt({
        ...k.current,
        ...o,
        promptContent: i,
        ...D ? {} : {
          storyboardReferences: [],
          storyboardWorkType: void 0,
          storyboardLyricsSourceNodeId: void 0,
          minShotDuration: void 0,
          storyboardRangeStartMs: void 0,
          storyboardRangeEndMs: void 0
        }
      });
      S.active && b.multiImageMode && (b.mediaSelections = hn(
        b.mediaSelections,
        vn(
          O,
          b.paramValues || {},
          b.multiImageMode
        ),
        b.promptContent,
        R.current,
        _
      )), k.current = b;
      const E = Gt(
        Wt(b)
      );
      return le.current = E === Q ? "" : E, ye(b.multiImageMode), g(e.id, b, u), b;
    },
    [
      D,
      Q,
      e.id,
      g,
      C,
      S.active,
      O,
      R,
      _
    ]
  ), ct = K(
    (o, u) => {
      o && T({
        title: "删除文本连接",
        description: u,
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => I(o, e.id)
      });
    },
    [e.id, I, T]
  ), Ar = K(
    (o) => {
      const u = k.current.paramBindings?.[o]?.sourceNodeId || "";
      ct(
        u,
        "删除后，上游文本将不再传入这个参数。"
      );
    },
    [ct]
  ), $r = K(() => {
    ct(
      String(k.current.storyboardLyricsSourceNodeId || "").trim(),
      "删除后，上游文本将不再作为 MV 歌词传入。"
    );
  }, [ct]), ve = K(
    (o, u, i) => (Ce(o), De({ ...u, paramValues: o }, i)),
    [De]
  );
  H(() => {
    Re || p === L || ve(p, {
      prompt: re,
      promptContent: C,
      selectedTargetId: ne,
      multiImageMode: $
    });
  }, [
    ne,
    p,
    L,
    re,
    C,
    ve,
    $,
    Re
  ]);
  function Ur(o, u) {
    const i = Ke(C) !== Ke(u), b = i ? je(
      C,
      u,
      R.current,
      _e,
      _,
      N
    ) : { content: u, assignments: {} }, E = b.content;
    Object.keys(b.assignments).length > 0 && Pe?.(b.assignments), fe(o);
    const x = D && i ? ft(
      E,
      J,
      R.current,
      o,
      W,
      m?.storyboard_reference_purposes || []
    ) : {
      content: E,
      references: J
    };
    j(x.content), Se(x.references);
    const A = k.current.paramValues || L, F = ce ? { ...A, [ce.key]: o } : A;
    ve(
      F,
      {
        prompt: o,
        promptContent: x.content,
        selectedTargetId: ne,
        storyboardReferences: x.references,
        storyboardWorkType: D ? W : void 0,
        minShotDuration: D ? Te : void 0,
        multiImageMode: $
      },
      i ? we : void 0
    );
  }
  function Vr(o) {
    const u = ft(
      C,
      J,
      R.current,
      re,
      o,
      m?.storyboard_reference_purposes || []
    ), i = o === "mv" ? ue : "";
    Me(o), Ee(i), j(u.content), Se(u.references), De(
      {
        prompt: re,
        promptContent: u.content,
        paramValues: L,
        selectedTargetId: ne,
        storyboardReferences: u.references,
        storyboardWorkType: o,
        storyboardLyricsSourceNodeId: i || void 0,
        minShotDuration: Te,
        multiImageMode: $
      },
      we
    );
  }
  function Lr(o) {
    const u = Qe(o);
    Oe(u), De(
      {
        prompt: re,
        promptContent: C,
        paramValues: L,
        selectedTargetId: ne,
        storyboardReferences: J,
        storyboardWorkType: W,
        minShotDuration: u,
        multiImageMode: $
      },
      we
    );
  }
  function zr(o, u) {
    Ie(o), ge(u), De(
      {
        prompt: re,
        promptContent: C,
        paramValues: L,
        selectedTargetId: ne,
        storyboardReferences: J,
        storyboardWorkType: W,
        storyboardRangeStartMs: o,
        storyboardRangeEndMs: u,
        minShotDuration: Te,
        multiImageMode: $
      },
      we
    );
  }
  function Fr(o, u) {
    const i = Sn(O, {
      ...k.current.paramValues || L,
      [o]: u
    }, o), b = O.find((A) => A.key === o), E = io(b), x = N;
    if (b && _t(b) && x) {
      const A = Xt({
        content: k.current.promptContent || C,
        items: R.current,
        connections: _,
        params: O,
        previousValues: k.current.paramValues || L,
        nextValues: i,
        previousMode: x,
        nextMode: x,
        selections: k.current.mediaSelections
      }), F = je(
        C,
        A.content,
        R.current,
        Ze(Je(O, i)),
        _,
        x
      );
      Object.keys(F.assignments).length && Pe?.(F.assignments), s(""), j(F.content), ve(
        i,
        {
          prompt: re,
          promptContent: F.content,
          selectedTargetId: ne,
          multiImageMode: x,
          mediaSelections: A.selections
        },
        E
      );
      return;
    }
    if (b && Rt(b, O)) {
      const A = Ze(
        Je(O, i)
      ), F = je(
        C,
        C,
        R.current,
        A,
        _,
        x
      );
      Object.keys(F.assignments).length > 0 && Pe?.(F.assignments), j(F.content), ve(
        i,
        {
          prompt: re,
          promptContent: F.content,
          selectedTargetId: ne,
          multiImageMode: $
        },
        E
      );
      return;
    }
    ve(
      i,
      {
        prompt: re,
        promptContent: C,
        selectedTargetId: ne,
        multiImageMode: $
      },
      E
    );
  }
  function Br(o) {
    const u = S.options.find(
      (te) => te.value === o
    );
    if (!S.active || !u?.enabled) {
      s(u?.reason || "当前能力不支持该多图生成方式");
      return;
    }
    const i = k.current.paramValues || L, b = dt(
      O,
      i,
      _.map((te) => te.source)
    ), E = Ze(
      Je(O, b)
    ), x = Xt({
      content: k.current.promptContent || C,
      items: R.current,
      connections: _,
      params: O,
      previousValues: i,
      nextValues: b,
      previousMode: N || $ || "per_image",
      nextMode: o,
      selections: k.current.mediaSelections
    }), A = je(
      C,
      x.content,
      R.current,
      E,
      _,
      o
    ), F = Nt(
      _,
      A.content,
      R.current,
      E,
      A.assignments,
      ot,
      o
    );
    s(F), Object.keys(A.assignments).length > 0 && Pe?.(A.assignments), j(A.content), ve(
      b,
      {
        prompt: re,
        promptContent: A.content,
        selectedTargetId: ne,
        storyboardReferences: J,
        multiImageMode: o,
        mediaSelections: x.selections
      },
      we
    );
  }
  function jr(o, u) {
    const i = Ke(C) !== Ke(u);
    fe(o), j(u), De(
      {
        prompt: o,
        promptContent: u,
        paramValues: k.current.paramValues || L,
        selectedTargetId: 0
      },
      i ? we : void 0
    );
  }
  function Kr(o, u) {
    const i = {
      ...k.current.paramValues || L,
      [o]: u
    };
    ve(
      i,
      {
        prompt: Ve,
        selectedTargetId: 0
      },
      we
    );
  }
  async function Ft(o, u, i) {
    const b = await xn({
      projectID: l,
      canvasID: c,
      teamID: Number(be?.project.team_id || 0),
      files: o,
      ruleID: u.upload_rule_id,
      onProgress: i?.onProgress
    });
    for (const E of b) {
      const x = an(E.asset);
      x.id && d?.(x);
    }
    return b;
  }
  async function qr(o) {
    if (!(se || !it) && !(e.type !== "power" || !e.power))
      try {
        const u = await de.loadPowerForm(
          {
            projectId: l,
            releaseId: he,
            flowId: e.flow?.id || 0,
            powerId: e.power.id,
            powerKey: e.power.key,
            targetId: o
          },
          () => Ht({
            projectId: l,
            flowId: e.flow?.id || 0,
            powerId: e.power?.id || 0,
            powerKey: e.power?.key || "",
            targetId: o
          })
        ), i = u.params || [], b = Mn(
          i,
          k.current.paramValues || L,
          m?.params || []
        ), E = dt(
          i,
          b,
          _.map((Yr) => Yr.source)
        ), x = Qt({
          node: e,
          content: C,
          items: R.current,
          connections: _,
          params: i,
          values: E,
          requestedMode: xe || N
        }), A = x.active ? x.mode : void 0;
        if (x.error) {
          s(`无法切换能力来源：${x.error}`);
          return;
        }
        const F = Ze(
          Je(i, E)
        ), te = je(
          C,
          C,
          R.current,
          F,
          _,
          A
        ), lt = gr(
          e,
          te.content,
          R.current,
          F
        ), ut = Nt(
          _,
          lt.content,
          lt.items,
          F,
          te.assignments,
          ot,
          A
        );
        if (ut) {
          s(`无法切换能力来源：${ut}`);
          return;
        }
        Object.keys(te.assignments).length > 0 && Pe?.(te.assignments), M(u);
        const jt = Xe(u) ? u.selected_target_id || o : 0;
        Y(jt), j(te.content), ve(
          E,
          {
            prompt: re,
            promptContent: te.content,
            selectedTargetId: jt,
            multiImageMode: A
          },
          we
        ), s("");
      } catch (u) {
        s(
          u instanceof Error ? u.message : "加载能力参数失败"
        );
      }
  }
  const Wr = async (o, u) => {
    y([e.id]), tt(!0);
    try {
      if (e.type === "power" && e.power) {
        const i = k.current, b = Object.prototype.hasOwnProperty.call(
          i,
          "promptContent"
        ) ? i.promptContent : u, E = i.storyboardWorkType || W, x = Qe(
          i.minShotDuration ?? Te
        ), A = D ? ft(
          b,
          i.storyboardReferences || J,
          R.current,
          o,
          E,
          m?.storyboard_reference_purposes || []
        ) : {
          content: b,
          references: i.storyboardReferences || []
        }, F = N, te = {
          ...dt(
            O,
            i.paramValues || p,
            _.map((ut) => ut.source)
          )
        };
        ce && (te[ce.key] = o);
        const lt = De({
          ...i,
          prompt: o,
          promptContent: A.content,
          paramValues: te,
          selectedTargetId: ne,
          storyboardReferences: A.references,
          storyboardWorkType: D ? E : void 0,
          minShotDuration: D ? x : void 0,
          multiImageMode: F
        });
        await a({
          ...e,
          composerDraft: lt
        });
        return;
      }
      if (e.type === "agent" && e.role) {
        const i = k.current, b = De({
          ...i,
          prompt: o,
          promptContent: Object.prototype.hasOwnProperty.call(
            i,
            "promptContent"
          ) ? i.promptContent : u,
          paramValues: i.paramValues || L,
          selectedTargetId: 0
        });
        await a({
          ...e,
          composerDraft: b
        });
        return;
      }
      throw new Error("当前节点缺少可运行配置");
    } catch (i) {
      s(i instanceof Error ? i.message : "执行出错");
    } finally {
      tt(!1);
    }
  }, Bt = async (o, u) => {
    if (!se) {
      if (at) {
        s(at);
        return;
      }
      await Wr(o, u);
    }
  };
  return e.type === "power" ? /* @__PURE__ */ v(
    "div",
    {
      className: "ws-node-bottom-settings is-composer nodrag nowheel",
      onClick: (o) => o.stopPropagation(),
      style: fr,
      children: [
        /* @__PURE__ */ n(
          Kt,
          {
            message: r,
            onDismiss: () => s("")
          }
        ),
        t && /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "ws-prompt-tool nodrag nopan",
            onClick: t,
            children: "选择或上传替换图片"
          }
        ),
        X && !se && !m ? /* @__PURE__ */ v("div", { className: "ws-prompt-loading", children: [
          /* @__PURE__ */ n(br, { size: 16, className: "ws-spin" }),
          /* @__PURE__ */ n("span", { children: "正在加载能力参数..." })
        ] }) : /* @__PURE__ */ n(
          nr,
          {
            value: re,
            referenceContent: C,
            placeholder: xr,
            running: se,
            textInputEnabled: !!ce,
            showMediaParamButtons: !0,
            mediaParamPower: m?.power || e.power,
            sourceOptions: it ? st : [],
            selectedSourceId: ne,
            params: Or,
            primaryParam: ce || void 0,
            paramValues: p,
            paramBindings: w.paramBindings,
            paramBindingSources: ie,
            storyboardLyricsBindingSource: D && W === "mv" && ue ? ie[ue] || {
              title: "上游节点"
            } : void 0,
            assetLibrary: R,
            assetReference: {
              teamID: Number(be?.project.team_id || 0),
              projectID: l,
              assetCateID: $e
            },
            connectedMediaReferences: _,
            mediaUsageOptions: _e,
            referenceUsageOptions: D ? _r : void 0,
            referenceUsageField: D ? "purpose" : "usage",
            multiImagePlan: S,
            multiImageMode: N,
            toolbarContent: D ? ({ openKey: o, onToggle: u }) => /* @__PURE__ */ v(vt, { children: [
              /* @__PURE__ */ n(
                Jn,
                {
                  value: W,
                  options: m?.storyboard_work_types || [],
                  disabled: X || se,
                  openKey: o,
                  onToggle: u,
                  onChange: Vr
                }
              ),
              /* @__PURE__ */ n(
                Zn,
                {
                  value: Te,
                  options: m?.storyboard_min_shot_durations || [],
                  disabled: X || se,
                  openKey: o,
                  onToggle: u,
                  onChange: Lr
                }
              ),
              W === "mv" && J.some(
                (i) => i.purpose === "soundtrack"
              ) ? /* @__PURE__ */ n(
                to,
                {
                  startMs: Le,
                  endMs: ze,
                  soundtrackDurationMs: Ge.durationMs,
                  soundtrackUrl: Ge.audioUrl,
                  disabled: X || se,
                  openKey: o,
                  onToggle: u,
                  onChange: zr
                }
              ) : null
            ] }) : void 0,
            onConnectedMediaEdgeRemove: Be,
            disabled: X || !m,
            submitDisabled: !!at,
            submitDisabledReason: at,
            onChange: Ur,
            onParamChange: Fr,
            onParamBindingConnectionRemove: Ar,
            onStoryboardLyricsConnectionRemove: $r,
            onMultiImageModeChange: Br,
            onSourceChange: it ? (o) => {
              qr(o);
            } : void 0,
            onLocalUpload: Ft,
            onSubmit: Bt
          }
        )
      ]
    }
  ) : /* @__PURE__ */ v(
    "div",
    {
      className: "ws-node-bottom-settings is-composer nodrag nowheel",
      onClick: (o) => o.stopPropagation(),
      style: fr,
      children: [
        /* @__PURE__ */ n(
          Kt,
          {
            message: r,
            onDismiss: () => s("")
          }
        ),
        /* @__PURE__ */ n(
          nr,
          {
            value: Ve,
            referenceContent: C,
            placeholder: "向智能体发送任务指令...",
            running: se,
            params: ao,
            paramValues: L,
            assetLibrary: R,
            assetReference: {
              teamID: Number(be?.project.team_id || 0),
              projectID: l,
              assetCateID: $e
            },
            connectedMediaReferences: _,
            onConnectedMediaEdgeRemove: Be,
            onChange: jr,
            onParamChange: Kr,
            onLocalUpload: Ft,
            onSubmit: Bt
          }
        )
      ]
    }
  );
}
export {
  ko as CanvasNodeSettings
};
