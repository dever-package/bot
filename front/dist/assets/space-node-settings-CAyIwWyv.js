import { a as w, j as o, F as Dt, r as Ut } from "./react-D9GkiX5b.js";
import { N as Ue, a as It, O as Vt, P as Lt, Q as zt, R as Ft, k as zr, T as Fr, w as Bt, S as jt, U as Br } from "./writing-run-labels-CtoDipVX.js";
import { u as S, h as B, a as A, b as te, d as W, F as jr } from "./file-kind-D6bMOzYN.js";
import { C as Ge, b as Kr, aG as qr, r as pr, as as Wr, c as fr, L as yr, aE as Kt, h as Yr, O as Gr, T as Hr, z as Jr } from "./vendor-icons-fVDtJt66.js";
import { y as Ye, z as Tt, A as gr, B as Ct, C as qt, D as Qr, E as Zr, F as We, G as Xr, H as en, P as tn, I as Pt, J as br, K as rn, L as ht, M as Wt, N as wt, i as nn, O as Yt, Q as hr, R as ct, S as Gt, T as ut, U as lt, V as on, W as sn, q as an, X as vt, Y as cn, Z as un } from "./space-ordered-list-BzuXThI0.js";
import { P as ln, a as Ht } from "./power-icon-DJNs4aGY.js";
import { C as dn } from "./space-reference-editor-B5nVnbhA.js";
import { E as mn, B as _t, N as Ke, O as Jt, P as pn, Q as fn, R as yn, T as gn, U as mt } from "./asset-preview-qznc7rjG.js";
import { n as bn } from "./text-content-save-actions-CJZJZrHM.js";
import { u as hn } from "./asset-reference-provider-BlG684s9.js";
import { r as wn, i as vn } from "./preloadable-CT3tMmBD.js";
import { b as Mn } from "./space-upload-1ncl2HCu.js";
function Qt(e) {
  return wn(
    e?.service_name,
    e?.name,
    "来源"
  );
}
const Sn = 240, In = [], Cn = [], Pn = {}, Nn = {};
function Zt({
  value: e,
  placeholder: t,
  running: r = !1,
  disabled: s = !1,
  textInputEnabled: l = !0,
  showMediaParamButtons: u = !1,
  mediaParamPower: d,
  submitDisabled: y = !1,
  submitDisabledReason: g = "",
  sourceOptions: m = [],
  selectedSourceId: f = 0,
  params: M = [],
  primaryParam: p,
  paramValues: h = {},
  paramBindings: $ = Pn,
  paramBindingSources: x = Nn,
  storyboardLyricsBindingSource: Pe,
  assetLibrary: v = { current: [] },
  referenceContent: K,
  assetReference: C,
  connectedMediaReferences: se = In,
  mediaUsageOptions: de = Cn,
  referenceUsageOptions: ae,
  referenceUsageField: I = "usage",
  multiImagePlan: Y,
  multiImageMode: F,
  toolbarContent: me,
  onConnectedMediaEdgeRemove: j,
  onChange: pe,
  onParamChange: fe,
  onParamBindingConnectionRemove: ye,
  onStoryboardLyricsConnectionRemove: Ne,
  onSourceChange: Re,
  onMultiImageModeChange: yt,
  onLocalUpload: re,
  onSubmit: He
}) {
  const ne = S(
    () => M.filter(Ye),
    [M]
  ), Le = p ? $[p.key] : void 0, Je = Le ? x[Le.sourceNodeId] : void 0, q = B(
    (i) => {
      const k = Dn(i);
      v.current = [
        ...v.current.filter(
          (_) => _.refType !== i.refType || Number(_.refId || 0) !== i.refId
        ),
        k
      ];
    },
    [v]
  ), Qe = B(
    async (i, k) => {
      if (!re)
        throw new Error("当前节点未配置本地上传");
      const _ = En(ne, k);
      if (!_)
        throw new Error("当前能力没有与所选素材类型匹配的上传参数");
      const V = (await re(i, _, {
        onProgress: k.onProgress
      })).map((Xe) => bn(Xe.asset)).filter((Xe) => Xe.id > 0);
      if (V.length === 0)
        throw new Error("上传成功，但没有生成可用资产");
      return V;
    },
    [re, ne]
  ), ge = hn({
    notificationMode: "inline",
    teamID: Number(C?.teamID || 0),
    scopeProjectID: Number(C?.projectID || 0),
    initialFilters: C?.projectID ? {
      sourceType: "project",
      projectID: C.projectID,
      assetCateID: Number(C.assetCateID || 0)
    } : void 0,
    onSelect: q,
    onUpload: re ? Qe : void 0
  }), [H, P] = A(""), [ke, De] = A(), be = te(0), ze = B((i) => {
    P(""), be.current += 1, De({
      id: be.current,
      trigger: "@",
      preferredUsage: i.key,
      acceptedKinds: Tt(i)
    });
  }, []), Ee = B(
    (i) => {
      De(
        (k) => k?.id === i ? void 0 : k
      );
    },
    []
  ), Ze = S(
    () => M.filter(
      (i) => Ye(i) || gr(i) || Ct(i, M)
    ),
    [M]
  ), J = S(
    () => m.find(
      (i) => i.target_id === f || i.id === f
    ),
    [f, m]
  ), U = f > 0 && !J, gt = Ze.some(
    qt
  ), Oe = /* @__PURE__ */ o(
    Rn,
    {
      plan: Y,
      openKey: H,
      disabled: s || r,
      onToggle: P,
      onChange: yt
    }
  ), ie = v.current, D = S(() => {
    if (U || s)
      return { value: e, content: K };
    const i = Qr(
      e,
      K,
      Zr(se, ie)
    );
    return {
      ...i,
      content: We(
        K,
        i.content,
        ie,
        de,
        se,
        F
      ).content
    };
  }, [
    se,
    s,
    de,
    F,
    K,
    ie,
    U,
    e
  ]), Fe = S(
    () => de.map((i) => ({
      key: i.key,
      label: i.label,
      acceptedKinds: i.acceptedKinds,
      maxFiles: i.maxFiles
    })),
    [de]
  ), Te = S(
    () => ae || Fe,
    [ae, Fe]
  ), xe = S(
    () => On(D.content),
    [D.content]
  ), O = S(
    () => er(e, K),
    [K, e]
  ), he = S(
    () => er(
      D.value,
      D.content
    ),
    [D.content, D.value]
  ), we = te({
    value: D.value,
    content: D.content
  }), ce = te(!1), ve = te(null), Be = te(pe), R = te(He);
  Be.current = pe, R.current = He;
  const _e = B(() => {
    ve.current !== null && (window.clearTimeout(ve.current), ve.current = null);
  }, []), G = B(() => {
    if (_e(), !ce.current)
      return;
    ce.current = !1;
    const i = we.current;
    Be.current(i.value, i.content);
  }, [_e]), Ae = B(
    (i, k, _ = !1) => {
      const Q = we.current.content;
      we.current = {
        value: i,
        content: k
      }, ce.current = !0;
      const V = Ue(Q) !== Ue(k);
      if (_ || V) {
        G();
        return;
      }
      _e(), ve.current = window.setTimeout(
        G,
        Sn
      );
    },
    [_e, G]
  ), T = B(() => {
    const i = we.current;
    return G(), R.current(i.value, i.content);
  }, [G]);
  return W(() => {
    ce.current || (we.current = {
      value: D.value,
      content: D.content
    });
  }, [
    he,
    D.content,
    D.value
  ]), W(
    () => () => {
      G();
    },
    [G]
  ), W(() => {
    (s || r) && P("");
  }, [s, r]), W(() => {
    U || s || O !== he && (ce.current || Ae(
      D.value,
      D.content,
      !0
    ));
  }, [
    O,
    s,
    he,
    D.content,
    D.value,
    U,
    Ae
  ]), /* @__PURE__ */ w(
    "div",
    {
      className: `ws-prompt-composer nowheel ${r ? "is-running" : ""}`,
      children: [
        /* @__PURE__ */ o("div", { className: "ws-prompt-main", children: /* @__PURE__ */ w("div", { className: "ws-prompt-editor-shell", children: [
          p && Le ? /* @__PURE__ */ o(
            Nt,
            {
              label: It(p),
              source: Je,
              compact: !0,
              disabled: s || r,
              onRemove: () => ye?.(p.key)
            }
          ) : null,
          Pe ? /* @__PURE__ */ o(
            Nt,
            {
              label: "歌词",
              source: Pe,
              compact: !0,
              disabled: s || r,
              onRemove: () => Ne?.()
            }
          ) : null,
          /* @__PURE__ */ o(
            dn,
            {
              className: "ws-prompt-reference-editor nodrag nopan",
              value: D.value,
              content: D.content,
              disabled: s || r,
              textEditable: l,
              placeholder: t,
              items: ie,
              usageOptions: Te,
              usageField: I,
              mediaUsageOptions: Fe,
              autoAssignUsage: I !== "purpose",
              pickerRequest: ke,
              onPickerRequestConsumed: Ee,
              assetReferenceProvider: C?.teamID ? ge : void 0,
              onReferenceDelete: (i) => {
                i.ref_origin === "edge" && i.ref_origin_id && j?.(i.ref_origin_id);
              },
              onChange: Ae,
              onBlur: G,
              onSubmit: !r && !y ? () => {
                T();
              } : void 0
            }
          )
        ] }) }),
        /* @__PURE__ */ w("div", { className: "ws-prompt-toolbar", children: [
          /* @__PURE__ */ w("div", { className: "ws-prompt-tools", children: [
            m.length > 0 || f > 0 ? /* @__PURE__ */ o(
              Ve,
              {
                id: "source",
                openKey: H,
                label: U ? "来源不可用，请重新选择" : Qt(J),
                icon: /* @__PURE__ */ o(Kr, { size: 15 }),
                disabled: s || r,
                onToggle: P,
                children: /* @__PURE__ */ w("div", { className: "ws-prompt-menu-list", children: [
                  m.length === 0 ? /* @__PURE__ */ o("span", { className: "ws-prompt-menu-item", role: "status", children: "暂无可用来源" }) : null,
                  m.map((i) => {
                    const k = i.target_id || i.id, _ = k === f;
                    return /* @__PURE__ */ w(
                      "button",
                      {
                        type: "button",
                        className: `ws-prompt-menu-item ${_ ? "is-active" : ""}`,
                        disabled: s || r,
                        onClick: () => {
                          Re?.(k), P("");
                        },
                        children: [
                          /* @__PURE__ */ o("span", { children: Qt(i) }),
                          _ ? /* @__PURE__ */ o(Ge, { size: 14 }) : null
                        ]
                      },
                      k
                    );
                  })
                ] })
              }
            ) : null,
            me?.({ openKey: H, onToggle: P }),
            gt ? null : Oe,
            !u && ne.length > 0 ? /* @__PURE__ */ o(
              Ve,
              {
                id: "attachments",
                openKey: H,
                label: "添加素材",
                icon: /* @__PURE__ */ o(qr, { size: 17 }),
                iconOnly: !0,
                variant: "attachments",
                disabled: s || r,
                onToggle: P,
                children: /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list is-attachments", role: "menu", children: ne.map((i) => /* @__PURE__ */ w(
                  "button",
                  {
                    type: "button",
                    className: "ws-prompt-menu-item",
                    role: "menuitem",
                    onClick: () => ze(i),
                    children: [
                      /* @__PURE__ */ o("span", { className: "ws-prompt-menu-kind-icon", children: /* @__PURE__ */ o(mn, { kind: An(i) }) }),
                      /* @__PURE__ */ o("span", { children: Et(i) })
                    ]
                  },
                  i.key
                )) })
              }
            ) : null,
            Ze.map((i) => {
              const k = $[i.key], _ = Ye(i) ? u ? /* @__PURE__ */ o(
                kn,
                {
                  param: i,
                  power: d,
                  selectedCount: xe.get(i.key) || 0,
                  disabled: s || r,
                  onClick: () => ze(i)
                }
              ) : null : /* @__PURE__ */ o(
                Tn,
                {
                  param: i,
                  value: h[i.key],
                  binding: k,
                  bindingSource: k ? x[k.sourceNodeId] : void 0,
                  openKey: H,
                  disabled: s || r,
                  onToggle: P,
                  onChange: (Q) => fe?.(i.key, Q),
                  onBindingRemove: ye
                }
              );
              return /* @__PURE__ */ w(jr, { children: [
                _,
                qt(i) ? Oe : null
              ] }, i.key);
            })
          ] }),
          /* @__PURE__ */ o("div", { className: "ws-prompt-submit-group", children: /* @__PURE__ */ o(_t, { label: g || void 0, children: /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              className: "ws-prompt-submit",
              disabled: s || r || y,
              onClick: () => {
                T();
              },
              "aria-label": g || "发送",
              children: r ? /* @__PURE__ */ o(pr, { size: 17, className: "ws-spin" }) : /* @__PURE__ */ o(Wr, { size: 18 })
            }
          ) }) })
        ] })
      ]
    }
  );
}
function Rn({
  plan: e,
  openKey: t,
  disabled: r,
  onToggle: s,
  onChange: l
}) {
  if (!e?.active || !e.mode)
    return null;
  const u = e.options.filter((f) => f.enabled), y = u.find(
    (f) => f.value === e.mode
  )?.label || (e.mode === "per_image" ? "逐图生成" : "合并生成"), g = e.mode === "per_image" ? e.imageCount : 1, m = `${y} · ${g}条`;
  return u.length <= 1 ? /* @__PURE__ */ o("span", { className: "ws-prompt-tool-wrap", children: /* @__PURE__ */ w("span", { className: "ws-prompt-tool is-static", "aria-label": m, children: [
    /* @__PURE__ */ o(Kt, { size: 15 }),
    /* @__PURE__ */ o("span", { children: m })
  ] }) }) : /* @__PURE__ */ o(
    Ve,
    {
      id: "multi-image-mode",
      openKey: t,
      label: m,
      icon: /* @__PURE__ */ o(Kt, { size: 15 }),
      disabled: r,
      onToggle: s,
      children: /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list", children: u.map((f) => {
        const M = f.value === e.mode, p = f.value === "per_image" ? e.imageCount : 1;
        return /* @__PURE__ */ w(
          "button",
          {
            type: "button",
            className: `ws-prompt-menu-item ${M ? "is-active" : ""}`,
            disabled: r,
            onClick: () => {
              l?.(f.value), s("");
            },
            children: [
              /* @__PURE__ */ o("span", { children: `${f.label} · ${p}条` }),
              M ? /* @__PURE__ */ o(Ge, { size: 14 }) : null
            ]
          },
          f.value
        );
      }) })
    }
  );
}
function kn({
  param: e,
  power: t,
  selectedCount: r,
  disabled: s,
  onClick: l
}) {
  const u = r > 0;
  return /* @__PURE__ */ o(_t, { label: xn(e, r), children: /* @__PURE__ */ w(
    "button",
    {
      type: "button",
      className: `ws-prompt-tool is-media-param ${u ? "is-selected" : ""}`,
      disabled: s,
      "aria-pressed": u,
      onClick: l,
      children: [
        /* @__PURE__ */ o(ln, { power: t, size: 15 }),
        /* @__PURE__ */ o("span", { children: Et(e) }),
        e.type === "files" && u ? /* @__PURE__ */ o("small", { className: "ws-prompt-media-count", children: r }) : null
      ]
    }
  ) });
}
function Dn(e) {
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
function Tn({
  param: e,
  value: t,
  binding: r,
  bindingSource: s,
  openKey: l,
  disabled: u,
  onToggle: d,
  onChange: y,
  onBindingRemove: g
}) {
  const [m, f] = A(!1), [M, p] = A(null), h = en(e.preview_type);
  if (W(() => {
    (u || h === "none") && f(!1);
  }, [u, h]), (e.type === "option" || e.type === "select") && h !== "none") {
    const $ = Xt(e, t);
    return /* @__PURE__ */ w(Dt, { children: [
      /* @__PURE__ */ o("span", { className: "ws-prompt-tool-wrap", children: /* @__PURE__ */ w(
        "button",
        {
          type: "button",
          className: "ws-prompt-tool",
          disabled: u,
          "aria-label": $,
          onClick: (x) => {
            d(""), p(x.currentTarget.closest(
              ".ws-storyboard-workspace-editor-anchor"
            )), f(!0);
          },
          children: [
            /* @__PURE__ */ o(Ht, { name: e.icon, size: 15 }),
            /* @__PURE__ */ o("span", { children: $ }),
            /* @__PURE__ */ o(fr, { size: 14 })
          ]
        }
      ) }),
      /* @__PURE__ */ o(
        tn,
        {
          open: m,
          portalContainer: M,
          layerZIndex: M ? 1100 : void 0,
          title: e.name || e.key,
          previewType: h,
          options: e.options || [],
          value: t,
          disabled: u,
          onOpenChange: f,
          onConfirm: (x) => y(Pt(e, x))
        }
      )
    ] });
  }
  return /* @__PURE__ */ o(
    Ve,
    {
      id: e.key,
      openKey: l,
      label: r ? `${It(e)} · 已连接` : Xt(e, t),
      icon: r ? /* @__PURE__ */ o(yr, { size: 15 }) : /* @__PURE__ */ o(Ht, { name: e.icon, size: 15 }),
      filled: !!r,
      disabled: u,
      onToggle: d,
      children: r ? /* @__PURE__ */ o(
        Nt,
        {
          label: It(e),
          source: s,
          disabled: u,
          onRemove: () => g?.(e.key)
        }
      ) : /* @__PURE__ */ o(
        _n,
        {
          param: e,
          value: t,
          onChange: y,
          onClose: () => d("")
        }
      )
    }
  );
}
function Nt({
  label: e,
  source: t,
  compact: r = !1,
  disabled: s,
  onRemove: l
}) {
  const u = String(t?.title || "上游节点").trim(), d = String(t?.text || "").trim();
  return /* @__PURE__ */ w("div", { className: `ws-param-binding-preview ${r ? "is-compact" : ""}`, children: [
    /* @__PURE__ */ w("div", { className: "ws-param-binding-preview-heading", children: [
      /* @__PURE__ */ o(yr, { size: 15, "aria-hidden": "true" }),
      /* @__PURE__ */ w("span", { children: [
        /* @__PURE__ */ o("strong", { children: e }),
        /* @__PURE__ */ w("small", { title: u, children: [
          "来自 ",
          u
        ] })
      ] }),
      /* @__PURE__ */ o(_t, { label: "删除连接", children: /* @__PURE__ */ o(
        "button",
        {
          type: "button",
          className: "ws-param-binding-remove",
          disabled: s,
          "aria-label": "删除连接",
          onClick: l,
          children: /* @__PURE__ */ o(Yr, { size: 14 })
        }
      ) })
    ] }),
    /* @__PURE__ */ o(
      "p",
      {
        className: d ? "" : "is-empty",
        title: d || void 0,
        children: d || "等待上游生成"
      }
    )
  ] });
}
function Ve({
  id: e,
  openKey: t,
  label: r,
  icon: s,
  iconOnly: l = !1,
  variant: u = "default",
  filled: d = !1,
  disabled: y,
  children: g,
  onToggle: m
}) {
  const f = !y && t === e, M = u === "attachments" ? "is-attachments" : "", p = te(null), h = B(() => {
    p.current != null && (window.clearTimeout(p.current), p.current = null);
  }, []), $ = B(() => {
    h(), p.current = window.setTimeout(() => {
      p.current = null, m("");
    }, 240);
  }, [h, m]);
  return W(() => (f || h(), h), [h, f]), /* @__PURE__ */ w(
    "span",
    {
      className: `ws-prompt-tool-wrap ${M} ${f ? "is-open" : ""}`,
      onMouseEnter: () => {
        h(), y || m(e);
      },
      onMouseLeave: () => {
        f && $();
      },
      children: [
        /* @__PURE__ */ w(
          "button",
          {
            type: "button",
            className: `ws-prompt-tool ${l ? "is-icon-only" : ""} ${f ? "is-open" : ""} ${d ? "is-filled" : ""}`,
            disabled: y,
            "aria-label": r,
            "aria-expanded": u === "attachments" ? f : void 0,
            "aria-haspopup": u === "attachments" ? "menu" : void 0,
            onClick: () => {
              y || (h(), m(f ? "" : e));
            },
            children: [
              s,
              l ? null : /* @__PURE__ */ o("span", { children: r }),
              l ? null : /* @__PURE__ */ o(fr, { size: 14 })
            ]
          }
        ),
        f ? /* @__PURE__ */ o(
          "div",
          {
            className: `ws-prompt-popover ${M}`,
            onMouseEnter: h,
            children: g
          }
        ) : null
      ]
    }
  );
}
function _n({
  param: e,
  value: t,
  onChange: r,
  onClose: s
}) {
  if (e.type === "option" || e.type === "select") {
    const l = e.options || [];
    return /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list", children: l.map((u) => {
      const d = ht(
        u,
        [String(t ?? "")],
        l
      );
      return /* @__PURE__ */ w(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${d ? "is-active" : ""}`,
          onClick: () => {
            r(
              Pt(
                e,
                Wt(u)
              )
            ), s();
          },
          children: [
            /* @__PURE__ */ o("span", { children: u.name || u.value }),
            d ? /* @__PURE__ */ o(Ge, { size: 14 }) : null
          ]
        },
        u.id || u.value
      );
    }) });
  }
  if (e.type === "multi_option") {
    const l = wr(t), u = e.options || [];
    return /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list", children: u.map((d) => {
      const y = ht(d, l, u);
      return /* @__PURE__ */ w(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${y ? "is-active" : ""}`,
          onClick: () => {
            let g = [...l];
            y ? g = g.filter(
              (m) => !ht(d, [m], u)
            ) : g.push(Wt(d)), r(Pt(e, g));
          },
          children: [
            /* @__PURE__ */ o("span", { children: d.name || d.value }),
            y ? /* @__PURE__ */ o(Ge, { size: 14 }) : null
          ]
        },
        d.id || d.value
      );
    }) });
  }
  if (e.type === "switch") {
    const l = br(t);
    return /* @__PURE__ */ w(
      "button",
      {
        type: "button",
        className: `ws-prompt-switch ${l ? "is-on" : ""}`,
        onClick: () => r(!l),
        children: [
          /* @__PURE__ */ o("span", { children: e.name }),
          /* @__PURE__ */ o("i", {})
        ]
      }
    );
  }
  return e.type === "prompt" || e.type === "textarea" ? /* @__PURE__ */ o(
    "textarea",
    {
      className: "ws-prompt-param-textarea",
      value: Rt(t),
      placeholder: e.name,
      onChange: (l) => r(l.target.value)
    }
  ) : /* @__PURE__ */ o(
    "input",
    {
      className: "ws-prompt-param-input",
      type: e.value_type === "number" ? "number" : "text",
      value: Rt(t),
      placeholder: e.name,
      onChange: (l) => r(
        e.value_type === "number" ? Number(l.target.value) : l.target.value
      )
    }
  );
}
function Xt(e, t) {
  if (e.type === "switch")
    return `${e.name}: ${br(t) ? "开" : "关"}`;
  if (e.type === "multi_option") {
    const s = wr(t).length;
    return s > 0 ? `${e.name} ${s}` : e.name;
  }
  if (e.type === "option" || e.type === "select")
    return rn(e.options || [], t)?.name || e.name;
  const r = Rt(t);
  return r ? `${e.name}: ${r}` : e.name;
}
function En(e, t) {
  const r = String(t.preferredUsage || "").trim();
  if (r) {
    const l = e.find((u) => u.key === r);
    if (l)
      return l;
  }
  const s = new Set(t.acceptedKinds || []);
  if (s.size > 0) {
    const l = e.find(
      (u) => Tt(u).some((d) => s.has(d))
    );
    if (l)
      return l;
  }
  return e.length === 1 ? e[0] : void 0;
}
function er(e, t) {
  return JSON.stringify([String(e || ""), t?.parts || []]);
}
function On(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e?.parts || []) {
    if (r.type !== "reference" || !r.usage)
      continue;
    const s = Xr(
      r,
      Number(r.ref_media_count || 0)
    );
    t.set(r.usage, (t.get(r.usage) || 0) + s);
  }
  return t;
}
function xn(e, t) {
  const r = Et(e);
  if (e.type !== "files")
    return t > 0 ? `${r}：已选择素材` : `选择${r}素材`;
  const s = Math.max(0, Number(e.max_files || 0));
  return t <= 0 ? s > 0 ? `选择${r}素材，最多 ${s} 个` : `选择${r}素材` : s > 0 ? `${r}：已选择 ${t} 个，最多 ${s} 个` : `${r}：已选择 ${t} 个`;
}
function Et(e) {
  return String(e.name || e.key || "").trim() || "文件";
}
function An(e) {
  const t = Tt(e);
  return t.length === 1 ? t[0] : "file";
}
function Rt(e) {
  return e == null ? "" : Array.isArray(e) ? e.join("、") : String(e);
}
function wr(e) {
  if (Array.isArray(e))
    return e.map((t) => String(t)).filter(Boolean);
  if (typeof e == "string") {
    const t = $n(e);
    return Array.isArray(t) ? t.map((r) => String(r)).filter(Boolean) : e ? [e] : [];
  }
  return e ? [String(e)] : [];
}
function $n(e) {
  if (!e)
    return e;
  try {
    return JSON.parse(e);
  } catch {
    return e;
  }
}
function vr({
  id: e,
  label: t,
  ariaLabel: r,
  icon: s,
  value: l,
  options: u,
  disabled: d = !1,
  openKey: y,
  onToggle: g,
  onChange: m
}) {
  return u.length === 0 ? null : /* @__PURE__ */ o(
    Ve,
    {
      id: e,
      openKey: y,
      label: t,
      icon: s,
      disabled: d,
      onToggle: g,
      children: /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list", role: "menu", "aria-label": r, children: u.map((f) => /* @__PURE__ */ w(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${f.key === l ? "is-active" : ""}`,
          disabled: d,
          role: "menuitemradio",
          "aria-checked": f.key === l,
          onClick: () => {
            m(f.key), g("");
          },
          children: [
            /* @__PURE__ */ o("span", { children: f.label }),
            f.key === l ? /* @__PURE__ */ o(Ge, { size: 14 }) : null
          ]
        },
        f.key
      )) })
    }
  );
}
function Un({
  value: e,
  options: t,
  disabled: r = !1,
  openKey: s,
  onToggle: l,
  onChange: u
}) {
  const d = t.find((y) => y.key === e);
  return t.length === 0 ? null : /* @__PURE__ */ o(
    vr,
    {
      id: "storyboard-work-type",
      ariaLabel: "作品类型",
      label: d?.name || e,
      icon: /* @__PURE__ */ o(Gr, { size: 15 }),
      value: e,
      options: t.map((y) => ({
        key: y.key,
        label: y.name
      })),
      disabled: r,
      openKey: s,
      onToggle: l,
      onChange: u
    }
  );
}
function Vn({
  value: e,
  options: t,
  disabled: r = !1,
  openKey: s,
  onToggle: l,
  onChange: u
}) {
  const d = t.find((y) => y.seconds === e);
  return /* @__PURE__ */ o(
    vr,
    {
      id: "storyboard-min-shot-duration",
      ariaLabel: "单镜最短时长",
      label: `单镜最短 ${d?.name || `${e}秒`}`,
      icon: /* @__PURE__ */ o(Hr, { size: 15 }),
      value: e,
      options: t.map((y) => ({
        key: y.seconds,
        label: y.name
      })),
      disabled: r,
      openKey: s,
      onToggle: l,
      onChange: u
    }
  );
}
const oe = 1e3, ft = 60, Ln = [
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
function pt(e) {
  const t = Math.max(
    0,
    Math.floor(Number(e || 0) / oe)
  );
  return {
    minutes: Math.floor(t / ft),
    seconds: t % ft
  };
}
function zn(e, t) {
  const r = e.find(
    (y) => String(y.purpose || "") === "soundtrack"
  ), s = dt(r?.asset_id), l = dt(r?.version_id), u = t.filter(
    (y) => dt(y.refId) === s
  ), d = u.find(
    (y) => !l || dt(y.versionID) === l
  ) || u[0];
  return {
    durationMs: tr(d?.output) || tr(d?.asset),
    audioUrl: String(d?.preview?.audioUrl || "").trim()
  };
}
function tr(e) {
  return kt(e, 0, /* @__PURE__ */ new Set());
}
function rr(e, t, r) {
  const s = Mt(r);
  if (s < oe)
    return;
  const l = Math.min(
    Mt(e),
    s - oe
  ), u = Math.min(
    s,
    Math.max(
      l + oe,
      t == null ? s : Mt(t)
    )
  );
  return {
    startMs: l,
    endMs: u,
    soundtrackDurationMs: s
  };
}
function Fn(e) {
  return {
    start: {
      minMs: 0,
      maxMs: e.endMs - oe
    },
    end: {
      minMs: e.startMs + oe,
      maxMs: e.soundtrackDurationMs
    }
  };
}
function nr({
  minutes: e,
  seconds: t
}) {
  return (Math.max(0, Math.floor(e)) * ft + Math.min(ft - 1, Math.max(0, Math.floor(t)))) * oe;
}
function or(e) {
  const { minutes: t, seconds: r } = pt(e);
  return `${String(t).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}
function kt(e, t, r) {
  if (e == null || t > 6)
    return 0;
  if (Array.isArray(e)) {
    for (const u of e) {
      const d = kt(u, t + 1, r);
      if (d > 0)
        return d;
    }
    return 0;
  }
  if (typeof e != "object" || r.has(e))
    return 0;
  r.add(e);
  const s = e;
  for (const u of ["duration_ms", "durationMs"]) {
    const d = sr(s[u], 1);
    if (d > 0)
      return d;
  }
  const l = sr(s.duration, oe);
  if (l > 0)
    return l;
  for (const u of Ln) {
    const d = kt(
      s[u],
      t + 1,
      r
    );
    if (d > 0)
      return d;
  }
  return 0;
}
function sr(e, t) {
  const r = Number(e);
  return Number.isFinite(r) && r > 0 ? Math.round(r * t) : 0;
}
function Mt(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? Math.floor(t / oe) * oe : 0;
}
function dt(e) {
  const t = Number(e);
  return Number.isInteger(t) && t > 0 ? t : 0;
}
const St = 1e3;
function Bn({
  startMs: e,
  endMs: t,
  soundtrackDurationMs: r,
  soundtrackUrl: s,
  disabled: l = !1,
  openKey: u,
  onToggle: d,
  onChange: y
}) {
  const g = jn(
    r,
    s
  ), m = S(
    () => rr(
      e,
      t,
      g.durationMs
    ),
    [t, g.durationMs, e]
  ), f = m, M = f ? Fn(f) : void 0, p = !!(m && m.startMs === 0 && m.endMs === m.soundtrackDurationMs), h = m ? p ? "全曲" : `${or(m.startMs)}–${or(m.endMs)}` : "制作范围";
  function $(x, Pe) {
    const v = rr(
      x,
      Pe,
      g.durationMs
    );
    v && y(v.startMs, v.endMs);
  }
  return /* @__PURE__ */ o(
    Ve,
    {
      id: "storyboard-time-range",
      openKey: u,
      label: h,
      icon: /* @__PURE__ */ o(Jr, { size: 15 }),
      filled: !!(m && !p),
      disabled: l,
      onToggle: d,
      children: /* @__PURE__ */ o("div", { className: "ws-storyboard-range-form", children: f && M ? /* @__PURE__ */ w(Dt, { children: [
        /* @__PURE__ */ o(
          ar,
          {
            label: "开始位置",
            ariaLabelPrefix: "开始位置",
            valueMs: f.startMs,
            minMs: M.start.minMs,
            maxMs: M.start.maxMs,
            disabled: l,
            onChange: (x) => $(x, f.endMs)
          }
        ),
        /* @__PURE__ */ o(
          ar,
          {
            label: "结束位置",
            ariaLabelPrefix: "结束位置",
            valueMs: f.endMs,
            minMs: M.end.minMs,
            maxMs: M.end.maxMs,
            disabled: l,
            onChange: (x) => $(f.startMs, x)
          }
        )
      ] }) : /* @__PURE__ */ o("p", { className: "ws-storyboard-range-status", children: g.loading ? "正在读取音轨时长..." : "无法读取音轨时长" }) })
    }
  );
}
function ar({
  label: e,
  ariaLabelPrefix: t,
  valueMs: r,
  minMs: s,
  maxMs: l,
  disabled: u,
  onChange: d
}) {
  const y = pt(r), g = pt(s), m = pt(l), f = cr(g.minutes, m.minutes), M = ir(y.minutes, g, m), p = cr(M.minimum, M.maximum);
  return /* @__PURE__ */ w("div", { className: "ws-storyboard-range-field", children: [
    /* @__PURE__ */ o("span", { children: e }),
    /* @__PURE__ */ w("div", { className: "ws-storyboard-range-time", children: [
      /* @__PURE__ */ o(
        "select",
        {
          value: y.minutes,
          disabled: u,
          "aria-label": `${t}分钟`,
          onChange: (h) => {
            const $ = Number(h.target.value), x = ir(
              $,
              g,
              m
            );
            d(
              nr({
                minutes: $,
                seconds: Kn(
                  y.seconds,
                  x.minimum,
                  x.maximum
                )
              })
            );
          },
          children: f.map((h) => /* @__PURE__ */ w("option", { value: h, children: [
            h,
            "分"
          ] }, h))
        }
      ),
      /* @__PURE__ */ o(
        "select",
        {
          value: y.seconds,
          disabled: u,
          "aria-label": `${t}秒数`,
          onChange: (h) => d(
            nr({
              ...y,
              seconds: Number(h.target.value)
            })
          ),
          children: p.map((h) => /* @__PURE__ */ w("option", { value: h, children: [
            String(h).padStart(2, "0"),
            "秒"
          ] }, h))
        }
      )
    ] })
  ] });
}
function jn(e, t) {
  const r = ur(e), s = String(t || "").trim(), [l, u] = A({
    audioUrl: "",
    durationMs: 0,
    failed: !1
  });
  W(() => {
    if (r || !s)
      return;
    const g = document.createElement("audio");
    let m = !0;
    const f = (h) => {
      if (!m)
        return;
      const $ = ur(h);
      u({ audioUrl: s, durationMs: $, failed: !$ });
    }, M = () => f(g.duration * 1e3), p = () => f(0);
    return g.preload = "metadata", g.addEventListener("loadedmetadata", M), g.addEventListener("error", p), g.src = s, g.load(), () => {
      m = !1, g.removeEventListener("loadedmetadata", M), g.removeEventListener("error", p), g.removeAttribute("src"), g.load();
    };
  }, [s, r]);
  const d = l.audioUrl === s ? l : void 0, y = r || d?.durationMs || 0;
  return {
    durationMs: y,
    loading: !y && !!s && !d?.failed
  };
}
function ir(e, t, r) {
  return {
    minimum: e === t.minutes ? t.seconds : 0,
    maximum: e === r.minutes ? r.seconds : 59
  };
}
function cr(e, t) {
  return Array.from(
    { length: Math.max(0, t - e + 1) },
    (r, s) => e + s
  );
}
function Kn(e, t, r) {
  return Math.min(r, Math.max(t, e));
}
function ur(e) {
  const t = Number(e);
  return Number.isFinite(t) && t >= St ? Math.floor(t / St) * St : 0;
}
const lr = { zIndex: 999 }, le = { save: "immediate" }, qn = [], Wn = {
  id: 0,
  name: "上传",
  key: "files",
  type: "files",
  usage: 2,
  max_files: 6
}, Yn = [Wn];
function qe(e) {
  return vn(e?.source_rule);
}
function Gn(e) {
  return e && ["option", "select", "multi_option", "switch"].includes(e.type) ? le : void 0;
}
function dr(e, t, r, s) {
  const l = e.storyboardItem, u = new Set(l?.dependencyNodeIds || []);
  if (l?.itemType !== "shot" || !l.continuityAnchor || u.size !== 1)
    return { content: t, items: r };
  const d = r.filter(
    (m) => m.source === "current" && u.has(String(m.id || ""))
  ), y = new Set(
    d.map((m) => Number(m.refId || 0)).filter((m) => m > 0)
  );
  if (y.size === 0)
    return { content: t, items: r };
  const g = cn(s);
  return {
    content: t && {
      ...t,
      parts: t.parts.map(
        (m) => m.type === "reference" && m.ref_type === "asset" && y.has(Number(m.ref_id || 0)) ? { ...m, usage: g } : m
      )
    },
    items: r.map(
      (m) => d.includes(m) ? { ...m, kind: "image" } : m
    )
  };
}
function mr(e, t, r, s) {
  if (!s || !t || hr(t, e.selectedTargetId || 0))
    return {
      content: e.promptContent,
      references: e.storyboardReferences || []
    };
  const l = e.storyboardWorkType || "short";
  return mt(
    e.promptContent,
    e.storyboardReferences,
    r,
    e.prompt || "",
    l,
    t.storyboard_reference_purposes
  );
}
function uo({ node: e }) {
  const [t, r] = A(""), {
    projectId: s,
    canvasId: l,
    runningNode: u,
    onNodeDraftChange: d,
    onAssetCreated: y,
    onClearFeedbackRecords: g,
    onRunBackendNode: m,
    onTextParamConnectionRemove: f,
    requestConfirm: M
  } = e, [p, h] = A(null), $ = e.composerDraft, x = e.storyboardItem?.generatedPrompt, Pe = p?.params.find(wt)?.key, v = S(
    () => Vt(
      Lt(
        zt($),
        x,
        Pe
      )
    ),
    [Pe, x, $]
  ), K = S(
    () => Ft(v),
    [v]
  ), C = te(v), se = te(""), [de, ae] = A(v.prompt || ""), [I, Y] = A(v.promptContent), [F, me] = A(v.storyboardReferences || []), [j, pe] = A(v.storyboardWorkType || "short"), [fe, ye] = A(v.storyboardLyricsSourceNodeId || ""), [Ne, Re] = A(
    () => Ke(v.minShotDuration)
  ), [yt, re] = A(
    v.storyboardRangeStartMs || 0
  ), [He, ne] = A(v.storyboardRangeEndMs), [Le, Je] = A(!1), [q, Qe] = A(!1), [ge, H] = A(
    v.selectedTargetId || 0
  ), [P, ke] = A(
    v.paramValues || {}
  ), [De, be] = A(v.multiImageMode), ze = te(p), Ee = e.inputContext, Ze = e.runBlockedReason;
  W(() => {
    const n = se.current;
    n && n !== K || (se.current = "", C.current = v);
  }, [v, K]), W(() => {
    ze.current = p;
  }, [p]);
  const J = Le || zr(u) || e.type === "power" && Ut(e.power, e.kind, e.outputType).viewMode === "writing" && nn(e, e.resultOutput)?.document.status === "running", U = e.type, gt = e.id, Oe = e.flow?.id || 0, ie = e.type === "power" && e.power?.id || 0, D = e.type === "power" && e.power?.key || "", Fe = e.type === "agent" ? Number(e.role?.agent_id || 0) : 0, Te = e.space, xe = e.canvasReferenceItems, O = e.connectedMediaReferences, he = e.onConnectedMediaUsagesChange, we = e.onConnectedMediaEdgeRemove, ce = e.catalogCache, ve = Number(
    Te?.release?.id || Te?.project.release_id || 0
  ), Be = Number(e.assetCateId || 0), R = S(
    () => Fr(
      Ee,
      xe.filter((n) => n.id !== e.id)
    ),
    [xe, Ee, e.id]
  ), _e = S(
    () => zn(
      F,
      R.current
    ),
    [R, F]
  ), G = te(R);
  W(() => {
    G.current = R;
  }, [R]);
  const Ae = S(() => {
    const n = /* @__PURE__ */ new Map();
    for (const a of Ee?.sources || [])
      n.set(a.nodeId, {
        title: a.title || "上游节点",
        text: a.preview.text || (typeof a.output == "string" ? a.output : "")
      });
    const c = new Set(
      Object.values(v.paramBindings || {}).map(
        (a) => a.sourceNodeId
      )
    );
    fe && c.add(fe);
    for (const a of c) {
      if (n.has(a))
        continue;
      const b = xe.find(
        (N) => N.id === a
      );
      n.set(a, {
        title: b?.title || "上游节点",
        text: b?.preview.text || ""
      });
    }
    return Object.fromEntries(n);
  }, [
    xe,
    Ee,
    v.paramBindings,
    fe
  ]), T = e.type === "power" && Ut(e.power, e.kind, e.outputType)?.viewMode === "storyboard";
  W(() => {
    if (U === "power" && (ie || D)) {
      const n = C.current.selectedTargetId || 0;
      let c = !1;
      return Qe(!0), ce.loadPowerForm(
        {
          projectId: s,
          releaseId: ve,
          flowId: Oe,
          powerId: ie,
          powerKey: D,
          targetId: n
        },
        () => Bt({
          projectId: s,
          flowId: Oe,
          powerId: ie,
          powerKey: D,
          targetId: n
        })
      ).then((a) => {
        if (c)
          return;
        const b = Lt(
          C.current,
          x,
          a.params.find(wt)?.key
        ), N = mr(
          b,
          a,
          G.current.current,
          T
        );
        h(a), H(
          qe(a) && (a.selected_target_id || n) || 0
        ), ke(
          Yt(a, b)
        ), ae(b.prompt || ""), Y(N.content), me(N.references), pe(b.storyboardWorkType || "short"), ye(
          b.storyboardLyricsSourceNodeId || ""
        ), Re(
          Ke(b.minShotDuration)
        ), re(b.storyboardRangeStartMs || 0), ne(b.storyboardRangeEndMs), be(b.multiImageMode);
      }).catch((a) => {
        c || r(
          a instanceof Error ? a.message : "加载能力参数失败"
        );
      }).finally(() => {
        c || Qe(!1);
      }), () => {
        c = !0;
      };
    }
    if (h(null), U === "agent") {
      const n = C.current;
      ke(n.paramValues || {}), ae(n.prompt || ""), Y(n.promptContent), me(n.storyboardReferences || []), pe(n.storyboardWorkType || "short"), ye(""), Re(Jt), re(0), ne(void 0), be(void 0), H(0);
      return;
    }
    ke({}), H(0), ae(""), Y(void 0), me([]), pe("short"), ye(""), Re(Jt), re(0), ne(void 0), be(void 0);
  }, [
    ce,
    x,
    T,
    s,
    ve,
    Oe,
    Fe,
    gt,
    U,
    ie,
    D
  ]);
  const i = p?.params || qn, k = hr(
    p,
    ge
  ), _ = S(
    () => k ? P : ct(
      i,
      P,
      O.map((n) => n.source)
    ),
    [O, P, i, k]
  ), Q = S(
    () => Gt({
      node: e,
      content: I,
      items: R.current,
      connections: O,
      params: i,
      values: _,
      requestedMode: De
    }),
    [
      R,
      O,
      _,
      e,
      i,
      I,
      De
    ]
  ), V = Q.active ? Q.mode : void 0, Me = !!se.current && se.current !== K ? C.current.multiImageMode || De || V : v.multiImageMode || V, $e = S(
    () => ut(i, _),
    [_, i]
  ), et = S(
    () => lt($e),
    [$e]
  ), Se = S(
    () => U === "power" ? on(
      et,
      V
    ) : [],
    [et, V, U]
  ), Ot = S(() => {
    const n = new Set(
      et.map((a) => a.key)
    ), c = new Set(
      Se.map((a) => a.key)
    );
    return $e.filter(
      (a) => sn(a, i) && (!Ye(a) || !n.has(a.key) || c.has(a.key))
    );
  }, [
    et,
    $e,
    Se,
    i
  ]), bt = S(
    () => dr(
      e,
      I,
      R.current,
      Se
    ),
    [R, Se, e, I]
  ), Mr = S(
    () => T ? pn(
      j,
      p?.storyboard_reference_purposes || []
    ) : [],
    [T, p, j]
  ), tt = U === "power" && ["image", "video"].includes(an(e) || ""), Sr = S(
    () => U === "power" && !q ? vt(
      O,
      bt.content,
      bt.items,
      Se,
      {},
      tt,
      V
    ) : "",
    [
      O,
      Se,
      bt,
      q,
      tt,
      U,
      V
    ]
  ), Ir = S(
    () => T && !q ? p ? fn(
      F,
      j,
      p.storyboard_work_types,
      p.storyboard_reference_purposes
    ) : "分镜作品类型与参考用途配置加载失败，请重新打开节点后重试" : "",
    [
      T,
      p,
      q,
      F,
      j
    ]
  ), je = e.storyboardItem?.itemType === "shot" ? e.storyboardItem.requiredDurationValues : void 0, rt = S(
    () => yn(
      p?.sources || [],
      je
    ),
    [p?.sources, je]
  ), Cr = S(() => {
    if (!je?.length || q || !p)
      return "";
    const n = gn(
      je
    );
    return rt.length === 0 ? n : qe(p) && ge > 0 && !rt.some(
      (c) => c.target_id === ge || c.id === ge
    ) ? `当前所选模型不满足时长要求；${n}` : "";
  }, [
    rt,
    p,
    q,
    je,
    ge
  ]), nt = Ze || (k ? "原来源已不可用，请重新选择来源" : "") || Q.error || Sr || Ir || Cr, Z = S(
    () => $e.find(wt) || null,
    [$e]
  ), Pr = S(
    () => Ot.filter(
      (n) => n.key !== Z?.key && (Ye(n) || gr(n) || Ct(n, i))
    ),
    [Ot, i, Z?.key]
  ), X = Z ? String(_[Z.key] ?? "") : de, Nr = String(
    p?.power?.description || e.power?.description || ""
  ).trim() || (Z ? "在此处为该能力输入生成提示词..." : "当前能力无需填写提示词"), ot = qe(p), ee = p ? ot ? ge : 0 : v.selectedTargetId || 0;
  W(() => {
    if (U !== "power" && U !== "agent")
      return;
    const n = C.current, c = ze.current, a = mr(
      n,
      c,
      G.current.current,
      T
    );
    ae(n.prompt || ""), Y(a.content), me(a.references), pe(n.storyboardWorkType || "short"), ye(
      n.storyboardLyricsSourceNodeId || ""
    ), Re(
      Ke(n.minShotDuration)
    ), re(n.storyboardRangeStartMs || 0), ne(n.storyboardRangeEndMs), be(n.multiImageMode), H(
      U === "power" && (!c || qe(c)) && (n.selectedTargetId || c?.selected_target_id) || 0
    ), ke(
      U === "power" && c ? Yt(c, n) : n.paramValues || {}
    );
  }, [T, K, U]);
  const Ie = B(
    (n, c) => {
      const a = Object.prototype.hasOwnProperty.call(
        n,
        "promptContent"
      ) ? n.promptContent : I, b = zt({
        ...C.current,
        ...n,
        promptContent: a,
        ...T ? {} : {
          storyboardReferences: [],
          storyboardWorkType: void 0,
          storyboardLyricsSourceNodeId: void 0,
          minShotDuration: void 0,
          storyboardRangeStartMs: void 0,
          storyboardRangeEndMs: void 0
        }
      });
      C.current = b;
      const N = Ft(
        Vt(b)
      );
      return se.current = N === K ? "" : N, be(b.multiImageMode), d(e.id, b, c), b;
    },
    [
      T,
      K,
      e.id,
      d,
      I
    ]
  ), st = B(
    (n, c) => {
      n && M({
        title: "删除文本连接",
        description: c,
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => f(n, e.id)
      });
    },
    [e.id, f, M]
  ), Rr = B(
    (n) => {
      const c = C.current.paramBindings?.[n]?.sourceNodeId || "";
      st(
        c,
        "删除后，上游文本将不再传入这个参数。"
      );
    },
    [st]
  ), kr = B(() => {
    st(
      String(C.current.storyboardLyricsSourceNodeId || "").trim(),
      "删除后，上游文本将不再作为 MV 歌词传入。"
    );
  }, [st]), Ce = B(
    (n, c, a) => (ke(n), Ie({ ...c, paramValues: n }, a)),
    [Ie]
  );
  W(() => {
    k || _ === P || Ce(_, {
      prompt: X,
      promptContent: I,
      selectedTargetId: ee,
      multiImageMode: Me
    });
  }, [
    ee,
    _,
    P,
    X,
    I,
    Ce,
    Me,
    k
  ]);
  function Dr(n, c) {
    const a = Ue(I) !== Ue(c), b = a ? We(
      I,
      c,
      R.current,
      Se,
      O,
      V
    ) : { content: c, assignments: {} }, N = b.content;
    Object.keys(b.assignments).length > 0 && he?.(b.assignments), ae(n);
    const E = T && a ? mt(
      N,
      F,
      R.current,
      n,
      j,
      p?.storyboard_reference_purposes || []
    ) : {
      content: N,
      references: F
    };
    Y(E.content), me(E.references);
    const L = C.current.paramValues || P, z = Z ? { ...L, [Z.key]: n } : L;
    Ce(
      z,
      {
        prompt: n,
        promptContent: E.content,
        selectedTargetId: ee,
        storyboardReferences: E.references,
        storyboardWorkType: T ? j : void 0,
        minShotDuration: T ? Ne : void 0,
        multiImageMode: Me
      },
      a ? le : void 0
    );
  }
  function Tr(n) {
    const c = mt(
      I,
      F,
      R.current,
      X,
      n,
      p?.storyboard_reference_purposes || []
    ), a = n === "mv" ? fe : "";
    pe(n), ye(a), Y(c.content), me(c.references), Ie(
      {
        prompt: X,
        promptContent: c.content,
        paramValues: P,
        selectedTargetId: ee,
        storyboardReferences: c.references,
        storyboardWorkType: n,
        storyboardLyricsSourceNodeId: a || void 0,
        minShotDuration: Ne,
        multiImageMode: Me
      },
      le
    );
  }
  function _r(n) {
    const c = Ke(n);
    Re(c), Ie(
      {
        prompt: X,
        promptContent: I,
        paramValues: P,
        selectedTargetId: ee,
        storyboardReferences: F,
        storyboardWorkType: j,
        minShotDuration: c,
        multiImageMode: Me
      },
      le
    );
  }
  function Er(n, c) {
    re(n), ne(c), Ie(
      {
        prompt: X,
        promptContent: I,
        paramValues: P,
        selectedTargetId: ee,
        storyboardReferences: F,
        storyboardWorkType: j,
        storyboardRangeStartMs: n,
        storyboardRangeEndMs: c,
        minShotDuration: Ne,
        multiImageMode: Me
      },
      le
    );
  }
  function Or(n, c) {
    const a = {
      ...C.current.paramValues || P,
      [n]: c
    }, b = i.find((L) => L.key === n), N = Gn(b), E = V;
    if (b && Ct(b, i)) {
      const L = lt(
        ut(i, a)
      ), z = We(
        I,
        I,
        R.current,
        L,
        O,
        E
      );
      Object.keys(z.assignments).length > 0 && he?.(z.assignments), Y(z.content), Ce(
        a,
        {
          prompt: X,
          promptContent: z.content,
          selectedTargetId: ee,
          multiImageMode: Me
        },
        N
      );
      return;
    }
    Ce(
      a,
      {
        prompt: X,
        promptContent: I,
        selectedTargetId: ee,
        multiImageMode: Me
      },
      N
    );
  }
  function xr(n) {
    const c = Q.options.find(
      (z) => z.value === n
    );
    if (!Q.active || !c?.enabled) {
      r(c?.reason || "当前能力不支持该多图生成方式");
      return;
    }
    const a = C.current.paramValues || P, b = ct(
      i,
      a,
      O.map((z) => z.source)
    ), N = lt(
      ut(i, b)
    ), E = We(
      I,
      I,
      R.current,
      N,
      O,
      n
    ), L = vt(
      O,
      E.content,
      R.current,
      N,
      E.assignments,
      tt,
      n
    );
    L && r(L), Object.keys(E.assignments).length > 0 && he?.(E.assignments), Y(E.content), Ce(
      b,
      {
        prompt: X,
        promptContent: E.content,
        selectedTargetId: ee,
        storyboardReferences: F,
        multiImageMode: n
      },
      le
    );
  }
  function Ar(n, c) {
    const a = Ue(I) !== Ue(c);
    ae(n), Y(c), Ie(
      {
        prompt: n,
        promptContent: c,
        paramValues: C.current.paramValues || P,
        selectedTargetId: 0
      },
      a ? le : void 0
    );
  }
  function $r(n, c) {
    const a = {
      ...C.current.paramValues || P,
      [n]: c
    };
    Ce(
      a,
      {
        prompt: de,
        selectedTargetId: 0
      },
      le
    );
  }
  async function xt(n, c, a) {
    const b = await Mn({
      projectID: s,
      canvasID: l,
      teamID: Number(Te?.project.team_id || 0),
      files: n,
      ruleID: c.upload_rule_id,
      onProgress: a?.onProgress
    });
    for (const N of b) {
      const E = Br(N.asset);
      E.id && y?.(E);
    }
    return b;
  }
  async function Ur(n) {
    if (!(J || !ot) && !(e.type !== "power" || !e.power))
      try {
        const c = await ce.loadPowerForm(
          {
            projectId: s,
            releaseId: ve,
            flowId: e.flow?.id || 0,
            powerId: e.power.id,
            powerKey: e.power.key,
            targetId: n
          },
          () => Bt({
            projectId: s,
            flowId: e.flow?.id || 0,
            powerId: e.power?.id || 0,
            powerKey: e.power?.key || "",
            targetId: n
          })
        ), a = c.params || [], b = un(
          a,
          C.current.paramValues || P,
          p?.params || []
        ), N = ct(
          a,
          b,
          O.map((Lr) => Lr.source)
        ), E = Gt({
          node: e,
          content: I,
          items: R.current,
          connections: O,
          params: a,
          values: N,
          requestedMode: De || V
        }), L = E.active ? E.mode : void 0;
        if (E.error) {
          r(`无法切换能力来源：${E.error}`);
          return;
        }
        const z = lt(
          ut(a, N)
        ), ue = We(
          I,
          I,
          R.current,
          z,
          O,
          L
        ), at = dr(
          e,
          ue.content,
          R.current,
          z
        ), it = vt(
          O,
          at.content,
          at.items,
          z,
          ue.assignments,
          tt,
          L
        );
        if (it) {
          r(`无法切换能力来源：${it}`);
          return;
        }
        Object.keys(ue.assignments).length > 0 && he?.(ue.assignments), h(c);
        const $t = qe(c) ? c.selected_target_id || n : 0;
        H($t), Y(ue.content), Ce(
          N,
          {
            prompt: X,
            promptContent: ue.content,
            selectedTargetId: $t,
            multiImageMode: L
          },
          le
        );
      } catch (c) {
        r(
          c instanceof Error ? c.message : "加载能力参数失败"
        );
      }
  }
  const Vr = async (n, c) => {
    g([e.id]), Je(!0);
    try {
      if (e.type === "power" && e.power) {
        const a = C.current, b = Object.prototype.hasOwnProperty.call(
          a,
          "promptContent"
        ) ? a.promptContent : c, N = a.storyboardWorkType || j, E = Ke(
          a.minShotDuration ?? Ne
        ), L = T ? mt(
          b,
          a.storyboardReferences || F,
          R.current,
          n,
          N,
          p?.storyboard_reference_purposes || []
        ) : {
          content: b,
          references: a.storyboardReferences || []
        }, z = V, ue = {
          ...ct(
            i,
            a.paramValues || _,
            O.map((it) => it.source)
          )
        };
        Z && (ue[Z.key] = n);
        const at = Ie({
          ...a,
          prompt: n,
          promptContent: L.content,
          paramValues: ue,
          selectedTargetId: ee,
          storyboardReferences: L.references,
          storyboardWorkType: T ? N : void 0,
          minShotDuration: T ? E : void 0,
          multiImageMode: z
        });
        await m({
          ...e,
          composerDraft: at
        });
        return;
      }
      if (e.type === "agent" && e.role) {
        const a = C.current, b = Ie({
          ...a,
          prompt: n,
          promptContent: Object.prototype.hasOwnProperty.call(
            a,
            "promptContent"
          ) ? a.promptContent : c,
          paramValues: a.paramValues || P,
          selectedTargetId: 0
        });
        await m({
          ...e,
          composerDraft: b
        });
        return;
      }
      throw new Error("当前节点缺少可运行配置");
    } catch (a) {
      r(a instanceof Error ? a.message : "执行出错");
    } finally {
      Je(!1);
    }
  }, At = async (n, c) => {
    if (!J) {
      if (nt) {
        r(nt);
        return;
      }
      await Vr(n, c);
    }
  };
  return e.type === "power" ? /* @__PURE__ */ w(
    "div",
    {
      className: "ws-node-bottom-settings is-composer nodrag nowheel",
      onClick: (n) => n.stopPropagation(),
      style: lr,
      children: [
        /* @__PURE__ */ o(
          jt,
          {
            message: t,
            onDismiss: () => r("")
          }
        ),
        q && !J && !p ? /* @__PURE__ */ w("div", { className: "ws-prompt-loading", children: [
          /* @__PURE__ */ o(pr, { size: 16, className: "ws-spin" }),
          /* @__PURE__ */ o("span", { children: "正在加载能力参数..." })
        ] }) : /* @__PURE__ */ o(
          Zt,
          {
            value: X,
            referenceContent: I,
            placeholder: Nr,
            running: J,
            textInputEnabled: !!Z,
            showMediaParamButtons: !0,
            mediaParamPower: p?.power || e.power,
            sourceOptions: ot ? rt : [],
            selectedSourceId: ee,
            params: Pr,
            primaryParam: Z || void 0,
            paramValues: _,
            paramBindings: v.paramBindings,
            paramBindingSources: Ae,
            storyboardLyricsBindingSource: T && j === "mv" && fe ? Ae[fe] || {
              title: "上游节点"
            } : void 0,
            assetLibrary: R,
            assetReference: {
              teamID: Number(Te?.project.team_id || 0),
              projectID: s,
              assetCateID: Be
            },
            connectedMediaReferences: O,
            mediaUsageOptions: Se,
            referenceUsageOptions: T ? Mr : void 0,
            referenceUsageField: T ? "purpose" : "usage",
            multiImagePlan: Q,
            multiImageMode: V,
            toolbarContent: T ? ({ openKey: n, onToggle: c }) => /* @__PURE__ */ w(Dt, { children: [
              /* @__PURE__ */ o(
                Un,
                {
                  value: j,
                  options: p?.storyboard_work_types || [],
                  disabled: q || J,
                  openKey: n,
                  onToggle: c,
                  onChange: Tr
                }
              ),
              /* @__PURE__ */ o(
                Vn,
                {
                  value: Ne,
                  options: p?.storyboard_min_shot_durations || [],
                  disabled: q || J,
                  openKey: n,
                  onToggle: c,
                  onChange: _r
                }
              ),
              j === "mv" && F.some(
                (a) => a.purpose === "soundtrack"
              ) ? /* @__PURE__ */ o(
                Bn,
                {
                  startMs: yt,
                  endMs: He,
                  soundtrackDurationMs: _e.durationMs,
                  soundtrackUrl: _e.audioUrl,
                  disabled: q || J,
                  openKey: n,
                  onToggle: c,
                  onChange: Er
                }
              ) : null
            ] }) : void 0,
            onConnectedMediaEdgeRemove: we,
            disabled: q || !p,
            submitDisabled: !!nt,
            submitDisabledReason: nt,
            onChange: Dr,
            onParamChange: Or,
            onParamBindingConnectionRemove: Rr,
            onStoryboardLyricsConnectionRemove: kr,
            onMultiImageModeChange: xr,
            onSourceChange: ot ? (n) => {
              Ur(n);
            } : void 0,
            onLocalUpload: xt,
            onSubmit: At
          }
        )
      ]
    }
  ) : /* @__PURE__ */ w(
    "div",
    {
      className: "ws-node-bottom-settings is-composer nodrag nowheel",
      onClick: (n) => n.stopPropagation(),
      style: lr,
      children: [
        /* @__PURE__ */ o(
          jt,
          {
            message: t,
            onDismiss: () => r("")
          }
        ),
        /* @__PURE__ */ o(
          Zt,
          {
            value: de,
            referenceContent: I,
            placeholder: "向智能体发送任务指令...",
            running: J,
            params: Yn,
            paramValues: P,
            assetLibrary: R,
            assetReference: {
              teamID: Number(Te?.project.team_id || 0),
              projectID: s,
              assetCateID: Be
            },
            connectedMediaReferences: O,
            onConnectedMediaEdgeRemove: we,
            onChange: Ar,
            onParamChange: $r,
            onLocalUpload: xt,
            onSubmit: At
          }
        )
      ]
    }
  );
}
export {
  uo as CanvasNodeSettings
};
