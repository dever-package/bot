import { a as w, j as o, F as kt } from "./react-CDpwMNlY.js";
import { u as I, h as j, a as A, e as ee, b as Y, F as Vr } from "./file-kind-DFeonxO2.js";
import { C as Ge, b as Ur, aE as Lr, r as lr, au as zr, c as dr, L as mr, aF as $t, h as Fr, J as Br, T as jr, Q as Kr } from "./vendor-icons-Cz5zFzlk.js";
import { t as Se } from "./index-CVhTq79S.js";
import { B as Ve, a as St, D as Vt, E as Ut, F as Lt, G as zt, H as qr, I as Wr, j as Ft, J as Yr } from "./space-page-B7eY-TDj.js";
import { i as Ye, f as Dt, g as pr, h as It, j as Bt, r as Gr, k as Jr, l as We, p as Hr, q as Qr, P as Xr, t as Ct, u as fr, v as Zr, w as bt, x as jt, y as ht, z as Kt, A as yr, B as it, C as qt, D as ct, E as ut, F as en, G as tn, b as rn, H as vt, I as nn, J as on } from "./space-sequence-card-B8s1aEtn.js";
import { P as sn, d as Wt, r as an } from "./power-icon-Dfs_ppQs.js";
import { C as cn } from "./space-reference-editor-DIXNeCSO.js";
import { u as un, e as ln } from "./asset-reference-provider-d_hsIG-H.js";
import { n as dn } from "./asset-api-nw012__Q.js";
import { B as _t, z as Ke, E as Yt, F as mn, G as pn, H as fn, I as yn, J as dt } from "./node-detail-content-DEcv8fc7.js";
import { r as gn, i as bn } from "./preloadable-B6OSmL0f.js";
import { b as hn } from "./space-upload-CiyhICGY.js";
function Gt(e) {
  return gn(
    e?.service_name,
    e?.name,
    "来源"
  );
}
const vn = 240, wn = [], Mn = [], Sn = {}, In = {};
function Jt({
  value: e,
  placeholder: t,
  running: r = !1,
  disabled: s = !1,
  textInputEnabled: l = !0,
  showMediaParamButtons: u = !1,
  mediaParamPower: m,
  submitDisabled: f = !1,
  submitDisabledReason: y = "",
  sourceOptions: p = [],
  selectedSourceId: i = 0,
  params: v = [],
  primaryParam: C,
  paramValues: b = {},
  paramBindings: $ = Sn,
  paramBindingSources: h = In,
  storyboardLyricsBindingSource: J,
  assetLibrary: P = { current: [] },
  referenceContent: G,
  assetReference: te,
  connectedMediaReferences: re = wn,
  mediaUsageOptions: M = Mn,
  referenceUsageOptions: K,
  referenceUsageField: z = "usage",
  multiImagePlan: de,
  multiImageMode: F,
  toolbarContent: Ie,
  onConnectedMediaEdgeRemove: me,
  onChange: pe,
  onParamChange: Ce,
  onParamBindingConnectionRemove: fe,
  onStoryboardLyricsConnectionRemove: ft,
  onSourceChange: Pe,
  onMultiImageModeChange: yt,
  onLocalUpload: ne,
  onSubmit: Je
}) {
  const Ne = I(
    () => v.filter(Ye),
    [v]
  ), B = C ? $[C.key] : void 0, He = B ? h[B.sourceNodeId] : void 0, ye = j(
    (d) => {
      const R = Nn(d);
      P.current = [
        ...P.current.filter(
          (_) => _.refType !== d.refType || Number(_.refId || 0) !== d.refId
        ),
        R
      ];
    },
    [P]
  ), Re = j(
    async (d, R) => {
      if (!ne)
        throw new Error("当前节点未配置本地上传");
      const _ = Dn(Ne, R);
      if (!_)
        throw new Error("当前能力没有与所选素材类型匹配的上传参数");
      const W = (await ne(d, _, {
        onProgress: R.onProgress
      })).map((se) => dn(se.asset)).filter((se) => se.id > 0);
      if (W.length === 0)
        throw new Error("上传成功，但没有生成可用资产");
      return W;
    },
    [ne, Ne]
  ), O = un({
    teamID: Number(te?.teamID || 0),
    scopeProjectID: Number(te?.projectID || 0),
    initialFilters: te?.projectID ? {
      sourceType: "project",
      projectID: te.projectID,
      assetCateID: Number(te.assetCateID || 0)
    } : void 0,
    onSelect: ye,
    onUpload: ne ? Re : void 0
  }), [H, q] = A(""), [ke, Le] = A(), De = ee(0), Qe = j((d) => {
    q(""), De.current += 1, Le({
      id: De.current,
      trigger: "@",
      preferredUsage: d.key,
      acceptedKinds: Dt(d)
    });
  }, []), oe = j(
    (d) => {
      Le(
        (R) => R?.id === d ? void 0 : R
      );
    },
    []
  ), V = I(
    () => v.filter(
      (d) => Ye(d) || pr(d) || It(d, v)
    ),
    [v]
  ), Xe = I(
    () => p.find(
      (d) => d.target_id === i || d.id === i
    ),
    [i, p]
  ), ie = i > 0 && !Xe, xe = V.some(
    Bt
  ), _e = /* @__PURE__ */ o(
    Cn,
    {
      plan: de,
      openKey: H,
      disabled: s || r,
      onToggle: q,
      onChange: yt
    }
  ), Oe = P.current, D = I(() => {
    if (ie || s)
      return { value: e, content: G };
    const d = Gr(
      e,
      G,
      Jr(re, Oe)
    );
    return {
      ...d,
      content: We(
        G,
        d.content,
        Oe,
        M,
        re,
        F
      ).content
    };
  }, [
    re,
    s,
    M,
    F,
    G,
    Oe,
    ie,
    e
  ]), ge = I(
    () => M.map((d) => ({
      key: d.key,
      label: d.label,
      acceptedKinds: d.acceptedKinds,
      maxFiles: d.maxFiles
    })),
    [M]
  ), E = I(
    () => K || ge,
    [K, ge]
  ), Ae = I(
    () => _n(D.content),
    [D.content]
  ), ze = I(
    () => Qt(e, G),
    [G, e]
  ), Te = I(
    () => Qt(
      D.value,
      D.content
    ),
    [D.content, D.value]
  ), ce = ee({
    value: D.value,
    content: D.content
  }), be = ee(!1), N = ee(null), Fe = ee(pe), $e = ee(Je);
  Fe.current = pe, $e.current = Je;
  const Ee = j(() => {
    N.current !== null && (window.clearTimeout(N.current), N.current = null);
  }, []), S = j(() => {
    if (Ee(), !be.current)
      return;
    be.current = !1;
    const d = ce.current;
    Fe.current(d.value, d.content);
  }, [Ee]), x = j(
    (d, R, _ = !1) => {
      const Be = ce.current.content;
      ce.current = {
        value: d,
        content: R
      }, be.current = !0;
      const W = Ve(Be) !== Ve(R);
      if (_ || W) {
        S();
        return;
      }
      Ee(), N.current = window.setTimeout(
        S,
        vn
      );
    },
    [Ee, S]
  ), he = j(() => {
    const d = ce.current;
    return S(), $e.current(d.value, d.content);
  }, [S]);
  return Y(() => {
    be.current || (ce.current = {
      value: D.value,
      content: D.content
    });
  }, [
    Te,
    D.content,
    D.value
  ]), Y(
    () => () => {
      S();
    },
    [S]
  ), Y(() => {
    (s || r) && q("");
  }, [s, r]), Y(() => {
    ie || s || ze !== Te && (be.current || x(
      D.value,
      D.content,
      !0
    ));
  }, [
    ze,
    s,
    Te,
    D.content,
    D.value,
    ie,
    x
  ]), /* @__PURE__ */ w(
    "div",
    {
      className: `ws-prompt-composer nowheel ${r ? "is-running" : ""}`,
      children: [
        /* @__PURE__ */ o("div", { className: "ws-prompt-main", children: /* @__PURE__ */ w("div", { className: "ws-prompt-editor-shell", children: [
          C && B ? /* @__PURE__ */ o(
            Pt,
            {
              label: St(C),
              source: He,
              compact: !0,
              disabled: s || r,
              onRemove: () => fe?.(C.key)
            }
          ) : null,
          J ? /* @__PURE__ */ o(
            Pt,
            {
              label: "歌词",
              source: J,
              compact: !0,
              disabled: s || r,
              onRemove: () => ft?.()
            }
          ) : null,
          /* @__PURE__ */ o(
            cn,
            {
              className: "ws-prompt-reference-editor nodrag nopan",
              value: D.value,
              content: D.content,
              disabled: s || r,
              textEditable: l,
              placeholder: t,
              items: Oe,
              usageOptions: E,
              usageField: z,
              mediaUsageOptions: ge,
              autoAssignUsage: z !== "purpose",
              pickerRequest: ke,
              onPickerRequestConsumed: oe,
              assetReferenceProvider: te?.teamID ? O : void 0,
              onReferenceDelete: (d) => {
                d.ref_origin === "edge" && d.ref_origin_id && me?.(d.ref_origin_id);
              },
              onChange: x,
              onBlur: S,
              onSubmit: !r && !f ? () => {
                he();
              } : void 0
            }
          )
        ] }) }),
        /* @__PURE__ */ w("div", { className: "ws-prompt-toolbar", children: [
          /* @__PURE__ */ w("div", { className: "ws-prompt-tools", children: [
            p.length > 0 || i > 0 ? /* @__PURE__ */ o(
              Ue,
              {
                id: "source",
                openKey: H,
                label: ie ? "来源不可用，请重新选择" : Gt(Xe),
                icon: /* @__PURE__ */ o(Ur, { size: 15 }),
                disabled: s || r,
                onToggle: q,
                children: /* @__PURE__ */ w("div", { className: "ws-prompt-menu-list", children: [
                  p.length === 0 ? /* @__PURE__ */ o("span", { className: "ws-prompt-menu-item", role: "status", children: "暂无可用来源" }) : null,
                  p.map((d) => {
                    const R = d.target_id || d.id, _ = R === i;
                    return /* @__PURE__ */ w(
                      "button",
                      {
                        type: "button",
                        className: `ws-prompt-menu-item ${_ ? "is-active" : ""}`,
                        disabled: s || r,
                        onClick: () => {
                          Pe?.(R), q("");
                        },
                        children: [
                          /* @__PURE__ */ o("span", { children: Gt(d) }),
                          _ ? /* @__PURE__ */ o(Ge, { size: 14 }) : null
                        ]
                      },
                      R
                    );
                  })
                ] })
              }
            ) : null,
            Ie?.({ openKey: H, onToggle: q }),
            xe ? null : _e,
            !u && Ne.length > 0 ? /* @__PURE__ */ o(
              Ue,
              {
                id: "attachments",
                openKey: H,
                label: "添加素材",
                icon: /* @__PURE__ */ o(Lr, { size: 17 }),
                iconOnly: !0,
                variant: "attachments",
                disabled: s || r,
                onToggle: q,
                children: /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list is-attachments", role: "menu", children: Ne.map((d) => /* @__PURE__ */ w(
                  "button",
                  {
                    type: "button",
                    className: "ws-prompt-menu-item",
                    role: "menuitem",
                    onClick: () => Qe(d),
                    children: [
                      /* @__PURE__ */ o("span", { className: "ws-prompt-menu-kind-icon", children: /* @__PURE__ */ o(ln, { kind: En(d) }) }),
                      /* @__PURE__ */ o("span", { children: Tt(d) })
                    ]
                  },
                  d.key
                )) })
              }
            ) : null,
            V.map((d) => {
              const R = $[d.key], _ = Ye(d) ? u ? /* @__PURE__ */ o(
                Pn,
                {
                  param: d,
                  power: m,
                  selectedCount: Ae.get(d.key) || 0,
                  disabled: s || r,
                  onClick: () => Qe(d)
                }
              ) : null : /* @__PURE__ */ o(
                Rn,
                {
                  param: d,
                  value: b[d.key],
                  binding: R,
                  bindingSource: R ? h[R.sourceNodeId] : void 0,
                  openKey: H,
                  disabled: s || r,
                  onToggle: q,
                  onChange: (Be) => Ce?.(d.key, Be),
                  onBindingRemove: fe
                }
              );
              return /* @__PURE__ */ w(Vr, { children: [
                _,
                Bt(d) ? _e : null
              ] }, d.key);
            })
          ] }),
          /* @__PURE__ */ o("div", { className: "ws-prompt-submit-group", children: /* @__PURE__ */ o(_t, { label: y || void 0, children: /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              className: "ws-prompt-submit",
              disabled: s || r || f,
              onClick: () => {
                he();
              },
              "aria-label": y || "发送",
              children: r ? /* @__PURE__ */ o(lr, { size: 17, className: "ws-spin" }) : /* @__PURE__ */ o(zr, { size: 18 })
            }
          ) }) })
        ] })
      ]
    }
  );
}
function Cn({
  plan: e,
  openKey: t,
  disabled: r,
  onToggle: s,
  onChange: l
}) {
  if (!e?.active || !e.mode)
    return null;
  const u = e.options.filter((i) => i.enabled), f = u.find(
    (i) => i.value === e.mode
  )?.label || (e.mode === "per_image" ? "逐图生成" : "合并生成"), y = e.mode === "per_image" ? e.imageCount : 1, p = `${f} · ${y}条`;
  return u.length <= 1 ? /* @__PURE__ */ o("span", { className: "ws-prompt-tool-wrap", children: /* @__PURE__ */ w("span", { className: "ws-prompt-tool is-static", "aria-label": p, children: [
    /* @__PURE__ */ o($t, { size: 15 }),
    /* @__PURE__ */ o("span", { children: p })
  ] }) }) : /* @__PURE__ */ o(
    Ue,
    {
      id: "multi-image-mode",
      openKey: t,
      label: p,
      icon: /* @__PURE__ */ o($t, { size: 15 }),
      disabled: r,
      onToggle: s,
      children: /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list", children: u.map((i) => {
        const v = i.value === e.mode, C = i.value === "per_image" ? e.imageCount : 1;
        return /* @__PURE__ */ w(
          "button",
          {
            type: "button",
            className: `ws-prompt-menu-item ${v ? "is-active" : ""}`,
            disabled: r,
            onClick: () => {
              l?.(i.value), s("");
            },
            children: [
              /* @__PURE__ */ o("span", { children: `${i.label} · ${C}条` }),
              v ? /* @__PURE__ */ o(Ge, { size: 14 }) : null
            ]
          },
          i.value
        );
      }) })
    }
  );
}
function Pn({
  param: e,
  power: t,
  selectedCount: r,
  disabled: s,
  onClick: l
}) {
  const u = r > 0;
  return /* @__PURE__ */ o(_t, { label: Tn(e, r), children: /* @__PURE__ */ w(
    "button",
    {
      type: "button",
      className: `ws-prompt-tool is-media-param ${u ? "is-selected" : ""}`,
      disabled: s,
      "aria-pressed": u,
      onClick: l,
      children: [
        /* @__PURE__ */ o(sn, { power: t, size: 15 }),
        /* @__PURE__ */ o("span", { children: Tt(e) }),
        e.type === "files" && u ? /* @__PURE__ */ o("small", { className: "ws-prompt-media-count", children: r }) : null
      ]
    }
  ) });
}
function Nn(e) {
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
function Rn({
  param: e,
  value: t,
  binding: r,
  bindingSource: s,
  openKey: l,
  disabled: u,
  onToggle: m,
  onChange: f,
  onBindingRemove: y
}) {
  const [p, i] = A(!1), v = Qr(e.preview_type);
  if (Y(() => {
    (u || v === "none") && i(!1);
  }, [u, v]), (e.type === "option" || e.type === "select") && v !== "none") {
    const C = Ht(e, t);
    return /* @__PURE__ */ w(kt, { children: [
      /* @__PURE__ */ o("span", { className: "ws-prompt-tool-wrap", children: /* @__PURE__ */ w(
        "button",
        {
          type: "button",
          className: "ws-prompt-tool",
          disabled: u,
          "aria-label": C,
          onClick: () => {
            m(""), i(!0);
          },
          children: [
            /* @__PURE__ */ o(Wt, { name: e.icon, size: 15 }),
            /* @__PURE__ */ o("span", { children: C }),
            /* @__PURE__ */ o(dr, { size: 14 })
          ]
        }
      ) }),
      /* @__PURE__ */ o(
        Xr,
        {
          open: p,
          title: e.name || e.key,
          previewType: v,
          options: e.options || [],
          value: t,
          disabled: u,
          onOpenChange: i,
          onConfirm: (b) => f(Ct(e, b))
        }
      )
    ] });
  }
  return /* @__PURE__ */ o(
    Ue,
    {
      id: e.key,
      openKey: l,
      label: r ? `${St(e)} · 已连接` : Ht(e, t),
      icon: r ? /* @__PURE__ */ o(mr, { size: 15 }) : /* @__PURE__ */ o(Wt, { name: e.icon, size: 15 }),
      filled: !!r,
      disabled: u,
      onToggle: m,
      children: r ? /* @__PURE__ */ o(
        Pt,
        {
          label: St(e),
          source: s,
          disabled: u,
          onRemove: () => y?.(e.key)
        }
      ) : /* @__PURE__ */ o(
        kn,
        {
          param: e,
          value: t,
          onChange: f,
          onClose: () => m("")
        }
      )
    }
  );
}
function Pt({
  label: e,
  source: t,
  compact: r = !1,
  disabled: s,
  onRemove: l
}) {
  const u = String(t?.title || "上游节点").trim(), m = String(t?.text || "").trim();
  return /* @__PURE__ */ w("div", { className: `ws-param-binding-preview ${r ? "is-compact" : ""}`, children: [
    /* @__PURE__ */ w("div", { className: "ws-param-binding-preview-heading", children: [
      /* @__PURE__ */ o(mr, { size: 15, "aria-hidden": "true" }),
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
          children: /* @__PURE__ */ o(Fr, { size: 14 })
        }
      ) })
    ] }),
    /* @__PURE__ */ o(
      "p",
      {
        className: m ? "" : "is-empty",
        title: m || void 0,
        children: m || "等待上游生成"
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
  variant: u = "default",
  filled: m = !1,
  disabled: f,
  children: y,
  onToggle: p
}) {
  const i = !f && t === e, v = u === "attachments" ? "is-attachments" : "", C = ee(null), b = j(() => {
    C.current != null && (window.clearTimeout(C.current), C.current = null);
  }, []), $ = j(() => {
    b(), C.current = window.setTimeout(() => {
      C.current = null, p("");
    }, 240);
  }, [b, p]);
  return Y(() => (i || b(), b), [b, i]), /* @__PURE__ */ w(
    "span",
    {
      className: `ws-prompt-tool-wrap ${v} ${i ? "is-open" : ""}`,
      onMouseEnter: () => {
        b(), f || p(e);
      },
      onMouseLeave: () => {
        i && $();
      },
      children: [
        /* @__PURE__ */ w(
          "button",
          {
            type: "button",
            className: `ws-prompt-tool ${l ? "is-icon-only" : ""} ${i ? "is-open" : ""} ${m ? "is-filled" : ""}`,
            disabled: f,
            "aria-label": r,
            "aria-expanded": u === "attachments" ? i : void 0,
            "aria-haspopup": u === "attachments" ? "menu" : void 0,
            onClick: () => {
              f || (b(), p(i ? "" : e));
            },
            children: [
              s,
              l ? null : /* @__PURE__ */ o("span", { children: r }),
              l ? null : /* @__PURE__ */ o(dr, { size: 14 })
            ]
          }
        ),
        i ? /* @__PURE__ */ o(
          "div",
          {
            className: `ws-prompt-popover ${v}`,
            onMouseEnter: b,
            children: y
          }
        ) : null
      ]
    }
  );
}
function kn({
  param: e,
  value: t,
  onChange: r,
  onClose: s
}) {
  if (e.type === "option" || e.type === "select") {
    const l = e.options || [];
    return /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list", children: l.map((u) => {
      const m = bt(
        u,
        [String(t ?? "")],
        l
      );
      return /* @__PURE__ */ w(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${m ? "is-active" : ""}`,
          onClick: () => {
            r(
              Ct(
                e,
                jt(u)
              )
            ), s();
          },
          children: [
            /* @__PURE__ */ o("span", { children: u.name || u.value }),
            m ? /* @__PURE__ */ o(Ge, { size: 14 }) : null
          ]
        },
        u.id || u.value
      );
    }) });
  }
  if (e.type === "multi_option") {
    const l = gr(t), u = e.options || [];
    return /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list", children: u.map((m) => {
      const f = bt(m, l, u);
      return /* @__PURE__ */ w(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${f ? "is-active" : ""}`,
          onClick: () => {
            let y = [...l];
            f ? y = y.filter(
              (p) => !bt(m, [p], u)
            ) : y.push(jt(m)), r(Ct(e, y));
          },
          children: [
            /* @__PURE__ */ o("span", { children: m.name || m.value }),
            f ? /* @__PURE__ */ o(Ge, { size: 14 }) : null
          ]
        },
        m.id || m.value
      );
    }) });
  }
  if (e.type === "switch") {
    const l = fr(t);
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
      value: Nt(t),
      placeholder: e.name,
      onChange: (l) => r(l.target.value)
    }
  ) : /* @__PURE__ */ o(
    "input",
    {
      className: "ws-prompt-param-input",
      type: e.value_type === "number" ? "number" : "text",
      value: Nt(t),
      placeholder: e.name,
      onChange: (l) => r(
        e.value_type === "number" ? Number(l.target.value) : l.target.value
      )
    }
  );
}
function Ht(e, t) {
  if (e.type === "switch")
    return `${e.name}: ${fr(t) ? "开" : "关"}`;
  if (e.type === "multi_option") {
    const s = gr(t).length;
    return s > 0 ? `${e.name} ${s}` : e.name;
  }
  if (e.type === "option" || e.type === "select")
    return Zr(e.options || [], t)?.name || e.name;
  const r = Nt(t);
  return r ? `${e.name}: ${r}` : e.name;
}
function Dn(e, t) {
  const r = String(t.preferredUsage || "").trim();
  if (r) {
    const l = e.find((u) => u.key === r);
    if (l)
      return l;
  }
  const s = new Set(t.acceptedKinds || []);
  if (s.size > 0) {
    const l = e.find(
      (u) => Dt(u).some((m) => s.has(m))
    );
    if (l)
      return l;
  }
  return e.length === 1 ? e[0] : void 0;
}
function Qt(e, t) {
  return JSON.stringify([String(e || ""), t?.parts || []]);
}
function _n(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e?.parts || []) {
    if (r.type !== "reference" || !r.usage)
      continue;
    const s = Hr(
      r,
      Number(r.ref_media_count || 0)
    );
    t.set(r.usage, (t.get(r.usage) || 0) + s);
  }
  return t;
}
function Tn(e, t) {
  const r = Tt(e);
  if (e.type !== "files")
    return t > 0 ? `${r}：已选择素材` : `选择${r}素材`;
  const s = Math.max(0, Number(e.max_files || 0));
  return t <= 0 ? s > 0 ? `选择${r}素材，最多 ${s} 个` : `选择${r}素材` : s > 0 ? `${r}：已选择 ${t} 个，最多 ${s} 个` : `${r}：已选择 ${t} 个`;
}
function Tt(e) {
  return String(e.name || e.key || "").trim() || "文件";
}
function En(e) {
  const t = Dt(e);
  return t.length === 1 ? t[0] : "file";
}
function Nt(e) {
  return e == null ? "" : Array.isArray(e) ? e.join("、") : String(e);
}
function gr(e) {
  if (Array.isArray(e))
    return e.map((t) => String(t)).filter(Boolean);
  if (typeof e == "string") {
    const t = xn(e);
    return Array.isArray(t) ? t.map((r) => String(r)).filter(Boolean) : e ? [e] : [];
  }
  return e ? [String(e)] : [];
}
function xn(e) {
  if (!e)
    return e;
  try {
    return JSON.parse(e);
  } catch {
    return e;
  }
}
function br({
  id: e,
  label: t,
  ariaLabel: r,
  icon: s,
  value: l,
  options: u,
  disabled: m = !1,
  openKey: f,
  onToggle: y,
  onChange: p
}) {
  return u.length === 0 ? null : /* @__PURE__ */ o(
    Ue,
    {
      id: e,
      openKey: f,
      label: t,
      icon: s,
      disabled: m,
      onToggle: y,
      children: /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list", role: "menu", "aria-label": r, children: u.map((i) => /* @__PURE__ */ w(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${i.key === l ? "is-active" : ""}`,
          disabled: m,
          role: "menuitemradio",
          "aria-checked": i.key === l,
          onClick: () => {
            p(i.key), y("");
          },
          children: [
            /* @__PURE__ */ o("span", { children: i.label }),
            i.key === l ? /* @__PURE__ */ o(Ge, { size: 14 }) : null
          ]
        },
        i.key
      )) })
    }
  );
}
function On({
  value: e,
  options: t,
  disabled: r = !1,
  openKey: s,
  onToggle: l,
  onChange: u
}) {
  const m = t.find((f) => f.key === e);
  return t.length === 0 ? null : /* @__PURE__ */ o(
    br,
    {
      id: "storyboard-work-type",
      ariaLabel: "作品类型",
      label: m?.name || e,
      icon: /* @__PURE__ */ o(Br, { size: 15 }),
      value: e,
      options: t.map((f) => ({
        key: f.key,
        label: f.name
      })),
      disabled: r,
      openKey: s,
      onToggle: l,
      onChange: u
    }
  );
}
function An({
  value: e,
  options: t,
  disabled: r = !1,
  openKey: s,
  onToggle: l,
  onChange: u
}) {
  const m = t.find((f) => f.seconds === e);
  return /* @__PURE__ */ o(
    br,
    {
      id: "storyboard-min-shot-duration",
      ariaLabel: "单镜最短时长",
      label: `单镜最短 ${m?.name || `${e}秒`}`,
      icon: /* @__PURE__ */ o(jr, { size: 15 }),
      value: e,
      options: t.map((f) => ({
        key: f.seconds,
        label: f.name
      })),
      disabled: r,
      openKey: s,
      onToggle: l,
      onChange: u
    }
  );
}
const ae = 1e3, pt = 60, $n = [
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
function mt(e) {
  const t = Math.max(
    0,
    Math.floor(Number(e || 0) / ae)
  );
  return {
    minutes: Math.floor(t / pt),
    seconds: t % pt
  };
}
function Vn(e, t) {
  const r = e.find(
    (f) => String(f.purpose || "") === "soundtrack"
  ), s = lt(r?.asset_id), l = lt(r?.version_id), u = t.filter(
    (f) => lt(f.refId) === s
  ), m = u.find(
    (f) => !l || lt(f.versionID) === l
  ) || u[0];
  return {
    durationMs: Xt(m?.output) || Xt(m?.asset),
    audioUrl: String(m?.preview?.audioUrl || "").trim()
  };
}
function Xt(e) {
  return Rt(e, 0, /* @__PURE__ */ new Set());
}
function Zt(e, t, r) {
  const s = wt(r);
  if (s < ae)
    return;
  const l = Math.min(
    wt(e),
    s - ae
  ), u = Math.min(
    s,
    Math.max(
      l + ae,
      t == null ? s : wt(t)
    )
  );
  return {
    startMs: l,
    endMs: u,
    soundtrackDurationMs: s
  };
}
function Un(e) {
  return {
    start: {
      minMs: 0,
      maxMs: e.endMs - ae
    },
    end: {
      minMs: e.startMs + ae,
      maxMs: e.soundtrackDurationMs
    }
  };
}
function er({
  minutes: e,
  seconds: t
}) {
  return (Math.max(0, Math.floor(e)) * pt + Math.min(pt - 1, Math.max(0, Math.floor(t)))) * ae;
}
function tr(e) {
  const { minutes: t, seconds: r } = mt(e);
  return `${String(t).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}
function Rt(e, t, r) {
  if (e == null || t > 6)
    return 0;
  if (Array.isArray(e)) {
    for (const u of e) {
      const m = Rt(u, t + 1, r);
      if (m > 0)
        return m;
    }
    return 0;
  }
  if (typeof e != "object" || r.has(e))
    return 0;
  r.add(e);
  const s = e;
  for (const u of ["duration_ms", "durationMs"]) {
    const m = rr(s[u], 1);
    if (m > 0)
      return m;
  }
  const l = rr(s.duration, ae);
  if (l > 0)
    return l;
  for (const u of $n) {
    const m = Rt(
      s[u],
      t + 1,
      r
    );
    if (m > 0)
      return m;
  }
  return 0;
}
function rr(e, t) {
  const r = Number(e);
  return Number.isFinite(r) && r > 0 ? Math.round(r * t) : 0;
}
function wt(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? Math.floor(t / ae) * ae : 0;
}
function lt(e) {
  const t = Number(e);
  return Number.isInteger(t) && t > 0 ? t : 0;
}
const Mt = 1e3;
function Ln({
  startMs: e,
  endMs: t,
  soundtrackDurationMs: r,
  soundtrackUrl: s,
  disabled: l = !1,
  openKey: u,
  onToggle: m,
  onChange: f
}) {
  const y = zn(
    r,
    s
  ), p = I(
    () => Zt(
      e,
      t,
      y.durationMs
    ),
    [t, y.durationMs, e]
  ), i = p, v = i ? Un(i) : void 0, C = !!(p && p.startMs === 0 && p.endMs === p.soundtrackDurationMs), b = p ? C ? "全曲" : `${tr(p.startMs)}–${tr(p.endMs)}` : "制作范围";
  function $(h, J) {
    const P = Zt(
      h,
      J,
      y.durationMs
    );
    P && f(P.startMs, P.endMs);
  }
  return /* @__PURE__ */ o(
    Ue,
    {
      id: "storyboard-time-range",
      openKey: u,
      label: b,
      icon: /* @__PURE__ */ o(Kr, { size: 15 }),
      filled: !!(p && !C),
      disabled: l,
      onToggle: m,
      children: /* @__PURE__ */ o("div", { className: "ws-storyboard-range-form", children: i && v ? /* @__PURE__ */ w(kt, { children: [
        /* @__PURE__ */ o(
          nr,
          {
            label: "开始位置",
            ariaLabelPrefix: "开始位置",
            valueMs: i.startMs,
            minMs: v.start.minMs,
            maxMs: v.start.maxMs,
            disabled: l,
            onChange: (h) => $(h, i.endMs)
          }
        ),
        /* @__PURE__ */ o(
          nr,
          {
            label: "结束位置",
            ariaLabelPrefix: "结束位置",
            valueMs: i.endMs,
            minMs: v.end.minMs,
            maxMs: v.end.maxMs,
            disabled: l,
            onChange: (h) => $(i.startMs, h)
          }
        )
      ] }) : /* @__PURE__ */ o("p", { className: "ws-storyboard-range-status", children: y.loading ? "正在读取音轨时长..." : "无法读取音轨时长" }) })
    }
  );
}
function nr({
  label: e,
  ariaLabelPrefix: t,
  valueMs: r,
  minMs: s,
  maxMs: l,
  disabled: u,
  onChange: m
}) {
  const f = mt(r), y = mt(s), p = mt(l), i = sr(y.minutes, p.minutes), v = or(f.minutes, y, p), C = sr(v.minimum, v.maximum);
  return /* @__PURE__ */ w("div", { className: "ws-storyboard-range-field", children: [
    /* @__PURE__ */ o("span", { children: e }),
    /* @__PURE__ */ w("div", { className: "ws-storyboard-range-time", children: [
      /* @__PURE__ */ o(
        "select",
        {
          value: f.minutes,
          disabled: u,
          "aria-label": `${t}分钟`,
          onChange: (b) => {
            const $ = Number(b.target.value), h = or(
              $,
              y,
              p
            );
            m(
              er({
                minutes: $,
                seconds: Fn(
                  f.seconds,
                  h.minimum,
                  h.maximum
                )
              })
            );
          },
          children: i.map((b) => /* @__PURE__ */ w("option", { value: b, children: [
            b,
            "分"
          ] }, b))
        }
      ),
      /* @__PURE__ */ o(
        "select",
        {
          value: f.seconds,
          disabled: u,
          "aria-label": `${t}秒数`,
          onChange: (b) => m(
            er({
              ...f,
              seconds: Number(b.target.value)
            })
          ),
          children: C.map((b) => /* @__PURE__ */ w("option", { value: b, children: [
            String(b).padStart(2, "0"),
            "秒"
          ] }, b))
        }
      )
    ] })
  ] });
}
function zn(e, t) {
  const r = ar(e), s = String(t || "").trim(), [l, u] = A({
    audioUrl: "",
    durationMs: 0,
    failed: !1
  });
  Y(() => {
    if (r || !s)
      return;
    const y = document.createElement("audio");
    let p = !0;
    const i = (b) => {
      if (!p)
        return;
      const $ = ar(b);
      u({ audioUrl: s, durationMs: $, failed: !$ });
    }, v = () => i(y.duration * 1e3), C = () => i(0);
    return y.preload = "metadata", y.addEventListener("loadedmetadata", v), y.addEventListener("error", C), y.src = s, y.load(), () => {
      p = !1, y.removeEventListener("loadedmetadata", v), y.removeEventListener("error", C), y.removeAttribute("src"), y.load();
    };
  }, [s, r]);
  const m = l.audioUrl === s ? l : void 0, f = r || m?.durationMs || 0;
  return {
    durationMs: f,
    loading: !f && !!s && !m?.failed
  };
}
function or(e, t, r) {
  return {
    minimum: e === t.minutes ? t.seconds : 0,
    maximum: e === r.minutes ? r.seconds : 59
  };
}
function sr(e, t) {
  return Array.from(
    { length: Math.max(0, t - e + 1) },
    (r, s) => e + s
  );
}
function Fn(e, t, r) {
  return Math.min(r, Math.max(t, e));
}
function ar(e) {
  const t = Number(e);
  return Number.isFinite(t) && t >= Mt ? Math.floor(t / Mt) * Mt : 0;
}
const ir = { zIndex: 999 }, le = { save: "immediate" }, Bn = [], jn = {
  id: 0,
  name: "上传",
  key: "files",
  type: "files",
  usage: 2,
  max_files: 6
}, Kn = [jn];
function qe(e) {
  return bn(e?.source_rule);
}
function qn(e) {
  return e && ["option", "select", "multi_option", "switch"].includes(e.type) ? le : void 0;
}
function cr(e, t, r, s) {
  const l = e.storyboardItem, u = new Set(l?.dependencyNodeIds || []);
  if (l?.itemType !== "shot" || !l.continuityAnchor || u.size !== 1)
    return { content: t, items: r };
  const m = r.filter(
    (p) => p.source === "current" && u.has(String(p.id || ""))
  ), f = new Set(
    m.map((p) => Number(p.refId || 0)).filter((p) => p > 0)
  );
  if (f.size === 0)
    return { content: t, items: r };
  const y = nn(s);
  return {
    content: t && {
      ...t,
      parts: t.parts.map(
        (p) => p.type === "reference" && p.ref_type === "asset" && f.has(Number(p.ref_id || 0)) ? { ...p, usage: y } : p
      )
    },
    items: r.map(
      (p) => m.includes(p) ? { ...p, kind: "image" } : p
    )
  };
}
function ur(e, t, r, s) {
  if (!s || !t || yr(t, e.selectedTargetId || 0))
    return {
      content: e.promptContent,
      references: e.storyboardReferences || []
    };
  const l = e.storyboardWorkType || "short";
  return dt(
    e.promptContent,
    e.storyboardReferences,
    r,
    e.prompt || "",
    l,
    t.storyboard_reference_purposes
  );
}
function io({ node: e }) {
  const {
    projectId: t,
    canvasId: r,
    runningNode: s,
    onNodeDraftChange: l,
    onAssetCreated: u,
    onClearFeedbackRecords: m,
    onRunBackendNode: f,
    onTextParamConnectionRemove: y,
    requestConfirm: p
  } = e, [i, v] = A(null), C = e.composerDraft, b = e.storyboardItem?.generatedPrompt, $ = i?.params.find(ht)?.key, h = I(
    () => Vt(
      Ut(
        Lt(C),
        b,
        $
      )
    ),
    [$, b, C]
  ), J = I(
    () => zt(h),
    [h]
  ), P = ee(h), G = ee(""), [te, re] = A(h.prompt || ""), [M, K] = A(h.promptContent), [z, de] = A(h.storyboardReferences || []), [F, Ie] = A(h.storyboardWorkType || "short"), [me, pe] = A(h.storyboardLyricsSourceNodeId || ""), [Ce, fe] = A(
    () => Ke(h.minShotDuration)
  ), [ft, Pe] = A(
    h.storyboardRangeStartMs || 0
  ), [yt, ne] = A(h.storyboardRangeEndMs), [Je, Ne] = A(!1), [B, He] = A(!1), [ye, Re] = A(
    h.selectedTargetId || 0
  ), [O, H] = A(
    h.paramValues || {}
  ), [q, ke] = A(h.multiImageMode), Le = ee(i), De = e.inputContext, Qe = e.runBlockedReason;
  Y(() => {
    const n = G.current;
    n && n !== J || (G.current = "", P.current = h);
  }, [h, J]), Y(() => {
    Le.current = i;
  }, [i]);
  const oe = Je || qr(s), V = e.type, Xe = e.id, ie = e.flow?.id || 0, xe = e.type === "power" && e.power?.id || 0, _e = e.type === "power" && e.power?.key || "", Oe = e.type === "agent" ? Number(e.role?.agent_id || 0) : 0, D = e.space, ge = e.canvasReferenceItems, E = e.connectedMediaReferences, Ae = e.onConnectedMediaUsagesChange, ze = e.onConnectedMediaEdgeRemove, Te = e.catalogCache, ce = Number(
    D?.release?.id || D?.project.release_id || 0
  ), be = Number(e.assetCateId || 0), N = I(
    () => Wr(
      De,
      ge.filter((n) => n.id !== e.id)
    ),
    [ge, De, e.id]
  ), Fe = I(
    () => Vn(
      z,
      N.current
    ),
    [N, z]
  ), $e = ee(N);
  Y(() => {
    $e.current = N;
  }, [N]);
  const Ee = I(() => {
    const n = /* @__PURE__ */ new Map();
    for (const a of De?.sources || [])
      n.set(a.nodeId, {
        title: a.title || "上游节点",
        text: a.preview.text || (typeof a.output == "string" ? a.output : "")
      });
    const c = new Set(
      Object.values(h.paramBindings || {}).map(
        (a) => a.sourceNodeId
      )
    );
    me && c.add(me);
    for (const a of c) {
      if (n.has(a))
        continue;
      const g = ge.find(
        (k) => k.id === a
      );
      n.set(a, {
        title: g?.title || "上游节点",
        text: g?.preview.text || ""
      });
    }
    return Object.fromEntries(n);
  }, [
    ge,
    De,
    h.paramBindings,
    me
  ]), S = e.type === "power" && an(e.power, e.kind, e.outputType)?.viewMode === "storyboard";
  Y(() => {
    if (V === "power" && (xe || _e)) {
      const n = P.current.selectedTargetId || 0;
      let c = !1;
      return He(!0), Te.loadPowerForm(
        {
          projectId: t,
          releaseId: ce,
          flowId: ie,
          powerId: xe,
          powerKey: _e,
          targetId: n
        },
        () => Ft({
          projectId: t,
          flowId: ie,
          powerId: xe,
          powerKey: _e,
          targetId: n
        })
      ).then((a) => {
        if (c)
          return;
        const g = Ut(
          P.current,
          b,
          a.params.find(ht)?.key
        ), k = ur(
          g,
          a,
          $e.current.current,
          S
        );
        v(a), Re(
          qe(a) && (a.selected_target_id || n) || 0
        ), H(
          Kt(a, g)
        ), re(g.prompt || ""), K(k.content), de(k.references), Ie(g.storyboardWorkType || "short"), pe(
          g.storyboardLyricsSourceNodeId || ""
        ), fe(
          Ke(g.minShotDuration)
        ), Pe(g.storyboardRangeStartMs || 0), ne(g.storyboardRangeEndMs), ke(g.multiImageMode);
      }).catch((a) => {
        c || Se.error(
          a instanceof Error ? a.message : "加载能力参数失败"
        );
      }).finally(() => {
        c || He(!1);
      }), () => {
        c = !0;
      };
    }
    if (v(null), V === "agent") {
      const n = P.current;
      H(n.paramValues || {}), re(n.prompt || ""), K(n.promptContent), de(n.storyboardReferences || []), Ie(n.storyboardWorkType || "short"), pe(""), fe(Yt), Pe(0), ne(void 0), ke(void 0), Re(0);
      return;
    }
    H({}), Re(0), re(""), K(void 0), de([]), Ie("short"), pe(""), fe(Yt), Pe(0), ne(void 0), ke(void 0);
  }, [
    Te,
    b,
    S,
    t,
    ce,
    ie,
    Oe,
    Xe,
    V,
    xe,
    _e
  ]);
  const x = i?.params || Bn, he = yr(
    i,
    ye
  ), d = I(
    () => he ? O : it(
      x,
      O,
      E.map((n) => n.source)
    ),
    [E, O, x, he]
  ), R = I(
    () => qt({
      node: e,
      content: M,
      items: N.current,
      connections: E,
      params: x,
      values: d,
      requestedMode: q
    }),
    [
      N,
      E,
      d,
      e,
      x,
      M,
      q
    ]
  ), _ = R.active ? R.mode : void 0, W = !!G.current && G.current !== J ? P.current.multiImageMode || q || _ : h.multiImageMode || _, se = I(
    () => ct(x, d),
    [d, x]
  ), Ze = I(
    () => ut(se),
    [se]
  ), ve = I(
    () => V === "power" ? en(
      Ze,
      _
    ) : [],
    [Ze, _, V]
  ), Et = I(() => {
    const n = new Set(
      Ze.map((a) => a.key)
    ), c = new Set(
      ve.map((a) => a.key)
    );
    return se.filter(
      (a) => tn(a, x) && (!Ye(a) || !n.has(a.key) || c.has(a.key))
    );
  }, [
    Ze,
    se,
    ve,
    x
  ]), gt = I(
    () => cr(
      e,
      M,
      N.current,
      ve
    ),
    [N, ve, e, M]
  ), hr = I(
    () => S ? mn(
      F,
      i?.storyboard_reference_purposes || []
    ) : [],
    [S, i, F]
  ), et = V === "power" && ["image", "video"].includes(rn(e) || ""), vr = I(
    () => V === "power" && !B ? vt(
      E,
      gt.content,
      gt.items,
      ve,
      {},
      et,
      _
    ) : "",
    [
      E,
      ve,
      gt,
      B,
      et,
      V,
      _
    ]
  ), wr = I(
    () => S && !B ? i ? pn(
      z,
      F,
      i.storyboard_work_types,
      i.storyboard_reference_purposes
    ) : "分镜作品类型与参考用途配置加载失败，请重新打开节点后重试" : "",
    [
      S,
      i,
      B,
      z,
      F
    ]
  ), je = e.storyboardItem?.itemType === "shot" ? e.storyboardItem.requiredDurationValues : void 0, tt = I(
    () => fn(
      i?.sources || [],
      je
    ),
    [i?.sources, je]
  ), Mr = I(() => {
    if (!je?.length || B || !i)
      return "";
    const n = yn(
      je
    );
    return tt.length === 0 ? n : qe(i) && ye > 0 && !tt.some(
      (c) => c.target_id === ye || c.id === ye
    ) ? `当前所选模型不满足时长要求；${n}` : "";
  }, [
    tt,
    i,
    B,
    je,
    ye
  ]), rt = Qe || (he ? "原来源已不可用，请重新选择来源" : "") || R.error || vr || wr || Mr, Q = I(
    () => se.find(ht) || null,
    [se]
  ), Sr = I(
    () => Et.filter(
      (n) => n.key !== Q?.key && (Ye(n) || pr(n) || It(n, x))
    ),
    [Et, x, Q?.key]
  ), X = Q ? String(d[Q.key] ?? "") : te, Ir = String(
    i?.power?.description || e.power?.description || ""
  ).trim() || (Q ? "在此处为该能力输入生成提示词..." : "当前能力无需填写提示词"), nt = qe(i), Z = i ? nt ? ye : 0 : h.selectedTargetId || 0;
  Y(() => {
    if (V !== "power" && V !== "agent")
      return;
    const n = P.current, c = Le.current, a = ur(
      n,
      c,
      $e.current.current,
      S
    );
    re(n.prompt || ""), K(a.content), de(a.references), Ie(n.storyboardWorkType || "short"), pe(
      n.storyboardLyricsSourceNodeId || ""
    ), fe(
      Ke(n.minShotDuration)
    ), Pe(n.storyboardRangeStartMs || 0), ne(n.storyboardRangeEndMs), ke(n.multiImageMode), Re(
      V === "power" && (!c || qe(c)) && (n.selectedTargetId || c?.selected_target_id) || 0
    ), H(
      V === "power" && c ? Kt(c, n) : n.paramValues || {}
    );
  }, [S, J, V]);
  const we = j(
    (n, c) => {
      const a = Object.prototype.hasOwnProperty.call(
        n,
        "promptContent"
      ) ? n.promptContent : M, g = Lt({
        ...P.current,
        ...n,
        promptContent: a,
        ...S ? {} : {
          storyboardReferences: [],
          storyboardWorkType: void 0,
          storyboardLyricsSourceNodeId: void 0,
          minShotDuration: void 0,
          storyboardRangeStartMs: void 0,
          storyboardRangeEndMs: void 0
        }
      });
      P.current = g;
      const k = zt(
        Vt(g)
      );
      return G.current = k === J ? "" : k, ke(g.multiImageMode), l(e.id, g, c), g;
    },
    [
      S,
      J,
      e.id,
      l,
      M
    ]
  ), ot = j(
    (n, c) => {
      n && p({
        title: "删除文本连接",
        description: c,
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => y(n, e.id)
      });
    },
    [e.id, y, p]
  ), Cr = j(
    (n) => {
      const c = P.current.paramBindings?.[n]?.sourceNodeId || "";
      ot(
        c,
        "删除后，上游文本将不再传入这个参数。"
      );
    },
    [ot]
  ), Pr = j(() => {
    ot(
      String(P.current.storyboardLyricsSourceNodeId || "").trim(),
      "删除后，上游文本将不再作为 MV 歌词传入。"
    );
  }, [ot]), Me = j(
    (n, c, a) => (H(n), we({ ...c, paramValues: n }, a)),
    [we]
  );
  Y(() => {
    he || d === O || Me(d, {
      prompt: X,
      promptContent: M,
      selectedTargetId: Z,
      multiImageMode: W
    });
  }, [
    Z,
    d,
    O,
    X,
    M,
    Me,
    W,
    he
  ]);
  function Nr(n, c) {
    const a = Ve(M) !== Ve(c), g = a ? We(
      M,
      c,
      N.current,
      ve,
      E,
      _
    ) : { content: c, assignments: {} }, k = g.content;
    Object.keys(g.assignments).length > 0 && Ae?.(g.assignments), re(n);
    const T = S && a ? dt(
      k,
      z,
      N.current,
      n,
      F,
      i?.storyboard_reference_purposes || []
    ) : {
      content: k,
      references: z
    };
    K(T.content), de(T.references);
    const U = P.current.paramValues || O, L = Q ? { ...U, [Q.key]: n } : U;
    Me(
      L,
      {
        prompt: n,
        promptContent: T.content,
        selectedTargetId: Z,
        storyboardReferences: T.references,
        storyboardWorkType: S ? F : void 0,
        minShotDuration: S ? Ce : void 0,
        multiImageMode: W
      },
      a ? le : void 0
    );
  }
  function Rr(n) {
    const c = dt(
      M,
      z,
      N.current,
      X,
      n,
      i?.storyboard_reference_purposes || []
    ), a = n === "mv" ? me : "";
    Ie(n), pe(a), K(c.content), de(c.references), we(
      {
        prompt: X,
        promptContent: c.content,
        paramValues: O,
        selectedTargetId: Z,
        storyboardReferences: c.references,
        storyboardWorkType: n,
        storyboardLyricsSourceNodeId: a || void 0,
        minShotDuration: Ce,
        multiImageMode: W
      },
      le
    );
  }
  function kr(n) {
    const c = Ke(n);
    fe(c), we(
      {
        prompt: X,
        promptContent: M,
        paramValues: O,
        selectedTargetId: Z,
        storyboardReferences: z,
        storyboardWorkType: F,
        minShotDuration: c,
        multiImageMode: W
      },
      le
    );
  }
  function Dr(n, c) {
    Pe(n), ne(c), we(
      {
        prompt: X,
        promptContent: M,
        paramValues: O,
        selectedTargetId: Z,
        storyboardReferences: z,
        storyboardWorkType: F,
        storyboardRangeStartMs: n,
        storyboardRangeEndMs: c,
        minShotDuration: Ce,
        multiImageMode: W
      },
      le
    );
  }
  function _r(n, c) {
    const a = {
      ...P.current.paramValues || O,
      [n]: c
    }, g = x.find((U) => U.key === n), k = qn(g), T = _;
    if (g && It(g, x)) {
      const U = ut(
        ct(x, a)
      ), L = We(
        M,
        M,
        N.current,
        U,
        E,
        T
      );
      Object.keys(L.assignments).length > 0 && Ae?.(L.assignments), K(L.content), Me(
        a,
        {
          prompt: X,
          promptContent: L.content,
          selectedTargetId: Z,
          multiImageMode: W
        },
        k
      );
      return;
    }
    Me(
      a,
      {
        prompt: X,
        promptContent: M,
        selectedTargetId: Z,
        multiImageMode: W
      },
      k
    );
  }
  function Tr(n) {
    const c = R.options.find(
      (L) => L.value === n
    );
    if (!R.active || !c?.enabled) {
      Se.error(c?.reason || "当前能力不支持该多图生成方式");
      return;
    }
    const a = P.current.paramValues || O, g = it(
      x,
      a,
      E.map((L) => L.source)
    ), k = ut(
      ct(x, g)
    ), T = We(
      M,
      M,
      N.current,
      k,
      E,
      n
    ), U = vt(
      E,
      T.content,
      N.current,
      k,
      T.assignments,
      et,
      n
    );
    U && Se.error(U), Object.keys(T.assignments).length > 0 && Ae?.(T.assignments), K(T.content), Me(
      g,
      {
        prompt: X,
        promptContent: T.content,
        selectedTargetId: Z,
        storyboardReferences: z,
        multiImageMode: n
      },
      le
    );
  }
  function Er(n, c) {
    const a = Ve(M) !== Ve(c);
    re(n), K(c), we(
      {
        prompt: n,
        promptContent: c,
        paramValues: P.current.paramValues || O,
        selectedTargetId: 0
      },
      a ? le : void 0
    );
  }
  function xr(n, c) {
    const a = {
      ...P.current.paramValues || O,
      [n]: c
    };
    Me(
      a,
      {
        prompt: te,
        selectedTargetId: 0
      },
      le
    );
  }
  async function xt(n, c, a) {
    const g = await hn({
      projectID: t,
      canvasID: r,
      teamID: Number(D?.project.team_id || 0),
      files: n,
      ruleID: c.upload_rule_id,
      onProgress: a?.onProgress
    });
    for (const k of g) {
      const T = Yr(k.asset);
      T.id && u?.(T);
    }
    return g;
  }
  async function Or(n) {
    if (!(oe || !nt) && !(e.type !== "power" || !e.power))
      try {
        const c = await Te.loadPowerForm(
          {
            projectId: t,
            releaseId: ce,
            flowId: e.flow?.id || 0,
            powerId: e.power.id,
            powerKey: e.power.key,
            targetId: n
          },
          () => Ft({
            projectId: t,
            flowId: e.flow?.id || 0,
            powerId: e.power?.id || 0,
            powerKey: e.power?.key || "",
            targetId: n
          })
        ), a = c.params || [], g = on(
          a,
          P.current.paramValues || O,
          i?.params || []
        ), k = it(
          a,
          g,
          E.map(($r) => $r.source)
        ), T = qt({
          node: e,
          content: M,
          items: N.current,
          connections: E,
          params: a,
          values: k,
          requestedMode: q || _
        }), U = T.active ? T.mode : void 0;
        if (T.error) {
          Se.error(`无法切换能力来源：${T.error}`);
          return;
        }
        const L = ut(
          ct(a, k)
        ), ue = We(
          M,
          M,
          N.current,
          L,
          E,
          U
        ), st = cr(
          e,
          ue.content,
          N.current,
          L
        ), at = vt(
          E,
          st.content,
          st.items,
          L,
          ue.assignments,
          et,
          U
        );
        if (at) {
          Se.error(`无法切换能力来源：${at}`);
          return;
        }
        Object.keys(ue.assignments).length > 0 && Ae?.(ue.assignments), v(c);
        const At = qe(c) ? c.selected_target_id || n : 0;
        Re(At), K(ue.content), Me(
          k,
          {
            prompt: X,
            promptContent: ue.content,
            selectedTargetId: At,
            multiImageMode: U
          },
          le
        );
      } catch (c) {
        Se.error(c instanceof Error ? c.message : "加载能力参数失败");
      }
  }
  const Ar = async (n, c) => {
    m([e.id]), Ne(!0);
    try {
      if (e.type === "power" && e.power) {
        const a = P.current, g = Object.prototype.hasOwnProperty.call(
          a,
          "promptContent"
        ) ? a.promptContent : c, k = a.storyboardWorkType || F, T = Ke(
          a.minShotDuration ?? Ce
        ), U = S ? dt(
          g,
          a.storyboardReferences || z,
          N.current,
          n,
          k,
          i?.storyboard_reference_purposes || []
        ) : {
          content: g,
          references: a.storyboardReferences || []
        }, L = _, ue = {
          ...it(
            x,
            a.paramValues || d,
            E.map((at) => at.source)
          )
        };
        Q && (ue[Q.key] = n);
        const st = we({
          ...a,
          prompt: n,
          promptContent: U.content,
          paramValues: ue,
          selectedTargetId: Z,
          storyboardReferences: U.references,
          storyboardWorkType: S ? k : void 0,
          minShotDuration: S ? T : void 0,
          multiImageMode: L
        });
        await f({
          ...e,
          composerDraft: st
        });
        return;
      }
      if (e.type === "agent" && e.role) {
        const a = P.current, g = we({
          ...a,
          prompt: n,
          promptContent: Object.prototype.hasOwnProperty.call(
            a,
            "promptContent"
          ) ? a.promptContent : c,
          paramValues: a.paramValues || O,
          selectedTargetId: 0
        });
        await f({
          ...e,
          composerDraft: g
        });
        return;
      }
      throw new Error("当前节点缺少可运行配置");
    } catch (a) {
      Se.error(a instanceof Error ? a.message : "执行出错");
    } finally {
      Ne(!1);
    }
  }, Ot = async (n, c) => {
    if (!oe) {
      if (rt) {
        Se.error(rt);
        return;
      }
      await Ar(n, c);
    }
  };
  return e.type === "power" ? /* @__PURE__ */ o(
    "div",
    {
      className: "ws-node-bottom-settings is-composer nodrag nowheel",
      onClick: (n) => n.stopPropagation(),
      style: ir,
      children: B && !oe && !i ? /* @__PURE__ */ w("div", { className: "ws-prompt-loading", children: [
        /* @__PURE__ */ o(lr, { size: 16, className: "ws-spin" }),
        /* @__PURE__ */ o("span", { children: "正在加载能力参数..." })
      ] }) : /* @__PURE__ */ o(
        Jt,
        {
          value: X,
          referenceContent: M,
          placeholder: Ir,
          running: oe,
          textInputEnabled: !!Q,
          showMediaParamButtons: !0,
          mediaParamPower: i?.power || e.power,
          sourceOptions: nt ? tt : [],
          selectedSourceId: Z,
          params: Sr,
          primaryParam: Q || void 0,
          paramValues: d,
          paramBindings: h.paramBindings,
          paramBindingSources: Ee,
          storyboardLyricsBindingSource: S && F === "mv" && me ? Ee[me] || {
            title: "上游节点"
          } : void 0,
          assetLibrary: N,
          assetReference: {
            teamID: Number(D?.project.team_id || 0),
            projectID: t,
            assetCateID: be
          },
          connectedMediaReferences: E,
          mediaUsageOptions: ve,
          referenceUsageOptions: S ? hr : void 0,
          referenceUsageField: S ? "purpose" : "usage",
          multiImagePlan: R,
          multiImageMode: _,
          toolbarContent: S ? ({ openKey: n, onToggle: c }) => /* @__PURE__ */ w(kt, { children: [
            /* @__PURE__ */ o(
              On,
              {
                value: F,
                options: i?.storyboard_work_types || [],
                disabled: B || oe,
                openKey: n,
                onToggle: c,
                onChange: Rr
              }
            ),
            /* @__PURE__ */ o(
              An,
              {
                value: Ce,
                options: i?.storyboard_min_shot_durations || [],
                disabled: B || oe,
                openKey: n,
                onToggle: c,
                onChange: kr
              }
            ),
            F === "mv" && z.some(
              (a) => a.purpose === "soundtrack"
            ) ? /* @__PURE__ */ o(
              Ln,
              {
                startMs: ft,
                endMs: yt,
                soundtrackDurationMs: Fe.durationMs,
                soundtrackUrl: Fe.audioUrl,
                disabled: B || oe,
                openKey: n,
                onToggle: c,
                onChange: Dr
              }
            ) : null
          ] }) : void 0,
          onConnectedMediaEdgeRemove: ze,
          disabled: B || !i,
          submitDisabled: !!rt,
          submitDisabledReason: rt,
          onChange: Nr,
          onParamChange: _r,
          onParamBindingConnectionRemove: Cr,
          onStoryboardLyricsConnectionRemove: Pr,
          onMultiImageModeChange: Tr,
          onSourceChange: nt ? (n) => {
            Or(n);
          } : void 0,
          onLocalUpload: xt,
          onSubmit: Ot
        }
      )
    }
  ) : /* @__PURE__ */ o(
    "div",
    {
      className: "ws-node-bottom-settings is-composer nodrag nowheel",
      onClick: (n) => n.stopPropagation(),
      style: ir,
      children: /* @__PURE__ */ o(
        Jt,
        {
          value: te,
          referenceContent: M,
          placeholder: "向智能体发送任务指令...",
          running: oe,
          params: Kn,
          paramValues: O,
          assetLibrary: N,
          assetReference: {
            teamID: Number(D?.project.team_id || 0),
            projectID: t,
            assetCateID: be
          },
          connectedMediaReferences: E,
          onConnectedMediaEdgeRemove: ze,
          onChange: Er,
          onParamChange: xr,
          onLocalUpload: xt,
          onSubmit: Ot
        }
      )
    }
  );
}
export {
  io as CanvasNodeSettings
};
