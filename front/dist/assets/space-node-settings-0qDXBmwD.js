import { a as M, j as o, r as _r, F as Ct, i as Er } from "./preloadable-Bomi5PEU.js";
import { u as S, e as K, a as A, d as re, b as Y, F as Tr } from "./_commonjsHelpers-61wyk6v6.js";
import { C as Ke, b as xr, aE as Or, r as or, au as Ar, L as sr, h as $r, c as ar, aF as Tt, w as Vr, T as zr, O as Lr } from "./vendor-icons-DwjYEojZ.js";
import { t as we } from "./index-BqbNvFGg.js";
import { z as $e, c as ht, A as xt, B as Ot, D as Fr, E as Ur, g as At, F as Br, G as jr, H as Kr } from "./space-page-Dnizy28C.js";
import { i as je, f as Pt, g as ir, h as vt, j as $t, r as qr, k as Wr, l as Be, p as Yr, q as Gr, P as Hr, t as wt, u as cr, v as Jr, w as ft, x as Vt, y as zt, z as rt, A as Lt, B as nt, C as ot, D as Qr, E as Xr, b as Zr, F as yt, G as en, H as tn, I as rn } from "./space-sequence-card-LI0YIDhg.js";
import { P as nn, d as Ft, r as on } from "./power-icon-DzGqVPMs.js";
import { C as sn } from "./space-reference-editor-Bi365szy.js";
import { c as an } from "./asset-page-B8_TS_uu.js";
import { v as cn, B as Nt, w as Fe, x as Ut, y as un, z as dn, E as ln, F as mn, G as at } from "./upload-asset-api-DDv34zo1.js";
import { u as pn } from "./node-detail-content-BcHQCibx.js";
function Bt(e) {
  return _r(
    e?.service_name,
    e?.name,
    "来源"
  );
}
const fn = 240, yn = [], gn = [], bn = {}, hn = {};
function jt({
  value: e,
  placeholder: t,
  running: r = !1,
  disabled: a = !1,
  textInputEnabled: c = !0,
  showMediaParamButtons: u = !1,
  mediaParamPower: m,
  submitDisabled: p = !1,
  submitDisabledReason: b = "",
  sourceOptions: l = [],
  selectedSourceId: y = 0,
  params: f = [],
  primaryParam: w,
  paramValues: g = {},
  paramBindings: $ = bn,
  paramBindingSources: T = hn,
  storyboardLyricsBindingSource: j,
  assetLibrary: v = { current: [] },
  referenceContent: V,
  assetReference: P,
  connectedMediaReferences: ne = yn,
  mediaUsageOptions: z = gn,
  referenceUsageOptions: me,
  referenceUsageField: ae = "usage",
  multiImagePlan: Me,
  multiImageMode: pe,
  toolbarContent: Se,
  onConnectedMediaEdgeRemove: ut,
  onChange: fe,
  onParamChange: dt,
  onParamBindingConnectionRemove: ye,
  onStoryboardLyricsConnectionRemove: lt,
  onSourceChange: qe,
  onMultiImageModeChange: I,
  onLocalUpload: ge,
  onSubmit: q
}) {
  const Ie = S(
    () => f.filter(je),
    [f]
  ), ie = w ? $[w.key] : void 0, Ce = ie ? T[ie.sourceNodeId] : void 0, L = K(
    (d) => {
      const O = Mn(d);
      v.current = [
        ...v.current.filter(
          (x) => x.refType !== d.refType || Number(x.refId || 0) !== d.refId
        ),
        O
      ];
    },
    [v]
  ), Pe = K(
    async (d, O) => {
      if (!ge)
        throw new Error("当前节点未配置本地上传");
      const x = Cn(Ie, O);
      if (!x)
        throw new Error("当前能力没有与所选素材类型匹配的上传参数");
      const ue = (await ge(d, x, {
        onProgress: O.onProgress
      })).map((G) => cn(G.asset)).filter((G) => G.id > 0);
      if (ue.length === 0)
        throw new Error("上传成功，但没有生成可用资产");
      return ue;
    },
    [ge, Ie]
  ), ke = pn({
    teamID: Number(P?.teamID || 0),
    scopeProjectID: Number(P?.projectID || 0),
    initialFilters: P?.projectID ? {
      sourceType: "project",
      projectID: P.projectID,
      assetCateID: Number(P.assetCateID || 0)
    } : void 0,
    onSelect: L,
    onUpload: ge ? Pe : void 0
  }), [H, J] = A(""), [De, We] = A(), Q = re(0), F = K((d) => {
    J(""), Q.current += 1, We({
      id: Q.current,
      trigger: "@",
      preferredUsage: d.key,
      acceptedKinds: Pt(d)
    });
  }, []), mt = K(
    (d) => {
      We(
        (O) => O?.id === d ? void 0 : O
      );
    },
    []
  ), _e = S(
    () => f.filter(
      (d) => je(d) || ir(d) || vt(d, f)
    ),
    [f]
  ), Ee = S(
    () => l.find(
      (d) => d.target_id === y || d.id === y
    ),
    [y, l]
  ), Te = _e.some(
    $t
  ), Ye = /* @__PURE__ */ o(
    vn,
    {
      plan: Me,
      openKey: H,
      disabled: a || r,
      onToggle: J,
      onChange: I
    }
  ), oe = v.current, D = S(() => {
    const d = qr(
      e,
      V,
      Wr(ne, oe)
    );
    return {
      ...d,
      content: Be(
        V,
        d.content,
        oe,
        z,
        ne,
        pe
      ).content
    };
  }, [
    ne,
    z,
    pe,
    V,
    oe,
    e
  ]), E = S(
    () => z.map((d) => ({
      key: d.key,
      label: d.label,
      acceptedKinds: d.acceptedKinds,
      maxFiles: d.maxFiles
    })),
    [z]
  ), xe = S(
    () => me || E,
    [me, E]
  ), Ge = S(
    () => Pn(D.content),
    [D.content]
  ), Oe = S(
    () => qt(e, V),
    [V, e]
  ), Ne = S(
    () => qt(
      D.value,
      D.content
    ),
    [D.content, D.value]
  ), be = re({
    value: D.value,
    content: D.content
  }), C = re(!1), Re = re(null), Ae = re(fe), ze = re(q);
  Ae.current = fe, ze.current = q;
  const N = K(() => {
    Re.current !== null && (window.clearTimeout(Re.current), Re.current = null);
  }, []), R = K(() => {
    if (N(), !C.current)
      return;
    C.current = !1;
    const d = be.current;
    Ae.current(d.value, d.content);
  }, [N]), W = K(
    (d, O, x = !1) => {
      const X = be.current.content;
      be.current = {
        value: d,
        content: O
      }, C.current = !0;
      const ue = $e(X) !== $e(O);
      if (x || ue) {
        R();
        return;
      }
      N(), Re.current = window.setTimeout(
        R,
        fn
      );
    },
    [N, R]
  ), ce = K(() => {
    const d = be.current;
    return R(), ze.current(d.value, d.content);
  }, [R]);
  return Y(() => {
    C.current || (be.current = {
      value: D.value,
      content: D.content
    });
  }, [
    Ne,
    D.content,
    D.value
  ]), Y(
    () => () => {
      R();
    },
    [R]
  ), Y(() => {
    (a || r) && J("");
  }, [a, r]), Y(() => {
    Oe !== Ne && (C.current || W(
      D.value,
      D.content,
      !0
    ));
  }, [
    Oe,
    Ne,
    D.content,
    D.value,
    W
  ]), /* @__PURE__ */ M(
    "div",
    {
      className: `ws-prompt-composer nowheel ${r ? "is-running" : ""}`,
      children: [
        /* @__PURE__ */ o("div", { className: "ws-prompt-main", children: /* @__PURE__ */ M("div", { className: "ws-prompt-editor-shell", children: [
          w && ie ? /* @__PURE__ */ o(
            Mt,
            {
              label: ht(w),
              source: Ce,
              compact: !0,
              disabled: a || r,
              onRemove: () => ye?.(w.key)
            }
          ) : null,
          j ? /* @__PURE__ */ o(
            Mt,
            {
              label: "歌词",
              source: j,
              compact: !0,
              disabled: a || r,
              onRemove: () => lt?.()
            }
          ) : null,
          /* @__PURE__ */ o(
            sn,
            {
              className: "ws-prompt-reference-editor nodrag nopan",
              value: D.value,
              content: D.content,
              disabled: a || r,
              textEditable: c,
              placeholder: t,
              items: oe,
              usageOptions: xe,
              usageField: ae,
              mediaUsageOptions: E,
              autoAssignUsage: ae !== "purpose",
              pickerRequest: De,
              onPickerRequestConsumed: mt,
              assetReferenceProvider: P?.teamID ? ke : void 0,
              onReferenceDelete: (d) => {
                d.ref_origin === "edge" && d.ref_origin_id && ut?.(d.ref_origin_id);
              },
              onChange: W,
              onBlur: R,
              onSubmit: !r && !p ? () => {
                ce();
              } : void 0
            }
          )
        ] }) }),
        /* @__PURE__ */ M("div", { className: "ws-prompt-toolbar", children: [
          /* @__PURE__ */ M("div", { className: "ws-prompt-tools", children: [
            l.length > 0 ? /* @__PURE__ */ o(
              Ve,
              {
                id: "source",
                openKey: H,
                label: Bt(Ee),
                icon: /* @__PURE__ */ o(xr, { size: 15 }),
                disabled: a || r,
                onToggle: J,
                children: /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list", children: l.map((d) => {
                  const O = d.target_id || d.id, x = O === y;
                  return /* @__PURE__ */ M(
                    "button",
                    {
                      type: "button",
                      className: `ws-prompt-menu-item ${x ? "is-active" : ""}`,
                      disabled: a || r,
                      onClick: () => {
                        qe?.(O), J("");
                      },
                      children: [
                        /* @__PURE__ */ o("span", { children: Bt(d) }),
                        x ? /* @__PURE__ */ o(Ke, { size: 14 }) : null
                      ]
                    },
                    O
                  );
                }) })
              }
            ) : null,
            Se?.({ openKey: H, onToggle: J }),
            Te ? null : Ye,
            !u && Ie.length > 0 ? /* @__PURE__ */ o(
              Ve,
              {
                id: "attachments",
                openKey: H,
                label: "添加素材",
                icon: /* @__PURE__ */ o(Or, { size: 17 }),
                iconOnly: !0,
                variant: "attachments",
                disabled: a || r,
                onToggle: J,
                children: /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list is-attachments", role: "menu", children: Ie.map((d) => /* @__PURE__ */ M(
                  "button",
                  {
                    type: "button",
                    className: "ws-prompt-menu-item",
                    role: "menuitem",
                    onClick: () => F(d),
                    children: [
                      /* @__PURE__ */ o("span", { className: "ws-prompt-menu-kind-icon", children: /* @__PURE__ */ o(an, { kind: Rn(d) }) }),
                      /* @__PURE__ */ o("span", { children: Rt(d) })
                    ]
                  },
                  d.key
                )) })
              }
            ) : null,
            _e.map((d) => {
              const O = $[d.key], x = je(d) ? u ? /* @__PURE__ */ o(
                wn,
                {
                  param: d,
                  power: m,
                  selectedCount: Ge.get(d.key) || 0,
                  disabled: a || r,
                  onClick: () => F(d)
                }
              ) : null : /* @__PURE__ */ o(
                Sn,
                {
                  param: d,
                  value: g[d.key],
                  binding: O,
                  bindingSource: O ? T[O.sourceNodeId] : void 0,
                  openKey: H,
                  disabled: a || r,
                  onToggle: J,
                  onChange: (X) => dt?.(d.key, X),
                  onBindingRemove: ye
                }
              );
              return /* @__PURE__ */ M(Tr, { children: [
                x,
                $t(d) ? Ye : null
              ] }, d.key);
            })
          ] }),
          /* @__PURE__ */ o("div", { className: "ws-prompt-submit-group", children: /* @__PURE__ */ o(Nt, { label: b || void 0, children: /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              className: "ws-prompt-submit",
              disabled: a || r || p,
              onClick: () => {
                ce();
              },
              "aria-label": b || "发送",
              children: r ? /* @__PURE__ */ o(or, { size: 17, className: "ws-spin" }) : /* @__PURE__ */ o(Ar, { size: 18 })
            }
          ) }) })
        ] })
      ]
    }
  );
}
function vn({
  plan: e,
  openKey: t,
  disabled: r,
  onToggle: a,
  onChange: c
}) {
  if (!e?.active || !e.mode)
    return null;
  const u = e.options.filter((y) => y.enabled), p = u.find(
    (y) => y.value === e.mode
  )?.label || (e.mode === "per_image" ? "逐图生成" : "合并生成"), b = e.mode === "per_image" ? e.imageCount : 1, l = `${p} · ${b}条`;
  return u.length <= 1 ? /* @__PURE__ */ o("span", { className: "ws-prompt-tool-wrap", children: /* @__PURE__ */ M("span", { className: "ws-prompt-tool is-static", "aria-label": l, children: [
    /* @__PURE__ */ o(Tt, { size: 15 }),
    /* @__PURE__ */ o("span", { children: l })
  ] }) }) : /* @__PURE__ */ o(
    Ve,
    {
      id: "multi-image-mode",
      openKey: t,
      label: l,
      icon: /* @__PURE__ */ o(Tt, { size: 15 }),
      disabled: r,
      onToggle: a,
      children: /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list", children: u.map((y) => {
        const f = y.value === e.mode, w = y.value === "per_image" ? e.imageCount : 1;
        return /* @__PURE__ */ M(
          "button",
          {
            type: "button",
            className: `ws-prompt-menu-item ${f ? "is-active" : ""}`,
            disabled: r,
            onClick: () => {
              c?.(y.value), a("");
            },
            children: [
              /* @__PURE__ */ o("span", { children: `${y.label} · ${w}条` }),
              f ? /* @__PURE__ */ o(Ke, { size: 14 }) : null
            ]
          },
          y.value
        );
      }) })
    }
  );
}
function wn({
  param: e,
  power: t,
  selectedCount: r,
  disabled: a,
  onClick: c
}) {
  const u = r > 0;
  return /* @__PURE__ */ o(Nt, { label: Nn(e, r), children: /* @__PURE__ */ M(
    "button",
    {
      type: "button",
      className: `ws-prompt-tool is-media-param ${u ? "is-selected" : ""}`,
      disabled: a,
      "aria-pressed": u,
      onClick: c,
      children: [
        /* @__PURE__ */ o(nn, { power: t, size: 15 }),
        /* @__PURE__ */ o("span", { children: Rt(e) }),
        e.type === "files" && u ? /* @__PURE__ */ o("small", { className: "ws-prompt-media-count", children: r }) : null
      ]
    }
  ) });
}
function Mn(e) {
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
function Sn({
  param: e,
  value: t,
  binding: r,
  bindingSource: a,
  openKey: c,
  disabled: u,
  onToggle: m,
  onChange: p,
  onBindingRemove: b
}) {
  const [l, y] = A(!1), f = Gr(e.preview_type);
  if (Y(() => {
    (u || f === "none") && y(!1);
  }, [u, f]), (e.type === "option" || e.type === "select") && f !== "none") {
    const w = Kt(e, t);
    return /* @__PURE__ */ M(Ct, { children: [
      /* @__PURE__ */ o("span", { className: "ws-prompt-tool-wrap", children: /* @__PURE__ */ M(
        "button",
        {
          type: "button",
          className: "ws-prompt-tool",
          disabled: u,
          "aria-label": w,
          onClick: () => {
            m(""), y(!0);
          },
          children: [
            /* @__PURE__ */ o(Ft, { name: e.icon, size: 15 }),
            /* @__PURE__ */ o("span", { children: w }),
            /* @__PURE__ */ o(ar, { size: 14 })
          ]
        }
      ) }),
      /* @__PURE__ */ o(
        Hr,
        {
          open: l,
          title: e.name || e.key,
          previewType: f,
          options: e.options || [],
          value: t,
          disabled: u,
          onOpenChange: y,
          onConfirm: (g) => p(wt(e, g))
        }
      )
    ] });
  }
  return /* @__PURE__ */ o(
    Ve,
    {
      id: e.key,
      openKey: c,
      label: r ? `${ht(e)} · 已连接` : Kt(e, t),
      icon: r ? /* @__PURE__ */ o(sr, { size: 15 }) : /* @__PURE__ */ o(Ft, { name: e.icon, size: 15 }),
      filled: !!r,
      disabled: u,
      onToggle: m,
      children: r ? /* @__PURE__ */ o(
        Mt,
        {
          label: ht(e),
          source: a,
          disabled: u,
          onRemove: () => b?.(e.key)
        }
      ) : /* @__PURE__ */ o(
        In,
        {
          param: e,
          value: t,
          onChange: p,
          onClose: () => m("")
        }
      )
    }
  );
}
function Mt({
  label: e,
  source: t,
  compact: r = !1,
  disabled: a,
  onRemove: c
}) {
  const u = String(t?.title || "上游节点").trim(), m = String(t?.text || "").trim();
  return /* @__PURE__ */ M("div", { className: `ws-param-binding-preview ${r ? "is-compact" : ""}`, children: [
    /* @__PURE__ */ M("div", { className: "ws-param-binding-preview-heading", children: [
      /* @__PURE__ */ o(sr, { size: 15, "aria-hidden": "true" }),
      /* @__PURE__ */ M("span", { children: [
        /* @__PURE__ */ o("strong", { children: e }),
        /* @__PURE__ */ M("small", { title: u, children: [
          "来自 ",
          u
        ] })
      ] }),
      /* @__PURE__ */ o(Nt, { label: "删除连接", children: /* @__PURE__ */ o(
        "button",
        {
          type: "button",
          className: "ws-param-binding-remove",
          disabled: a,
          "aria-label": "删除连接",
          onClick: c,
          children: /* @__PURE__ */ o($r, { size: 14 })
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
function Ve({
  id: e,
  openKey: t,
  label: r,
  icon: a,
  iconOnly: c = !1,
  variant: u = "default",
  filled: m = !1,
  disabled: p,
  children: b,
  onToggle: l
}) {
  const y = !p && t === e, f = u === "attachments" ? "is-attachments" : "", w = re(null), g = K(() => {
    w.current != null && (window.clearTimeout(w.current), w.current = null);
  }, []), $ = K(() => {
    g(), w.current = window.setTimeout(() => {
      w.current = null, l("");
    }, 240);
  }, [g, l]);
  return Y(() => (y || g(), g), [g, y]), /* @__PURE__ */ M(
    "span",
    {
      className: `ws-prompt-tool-wrap ${f} ${y ? "is-open" : ""}`,
      onMouseEnter: () => {
        g(), p || l(e);
      },
      onMouseLeave: () => {
        y && $();
      },
      children: [
        /* @__PURE__ */ M(
          "button",
          {
            type: "button",
            className: `ws-prompt-tool ${c ? "is-icon-only" : ""} ${y ? "is-open" : ""} ${m ? "is-filled" : ""}`,
            disabled: p,
            "aria-label": r,
            "aria-expanded": u === "attachments" ? y : void 0,
            "aria-haspopup": u === "attachments" ? "menu" : void 0,
            onClick: () => {
              p || (g(), l(y ? "" : e));
            },
            children: [
              a,
              c ? null : /* @__PURE__ */ o("span", { children: r }),
              c ? null : /* @__PURE__ */ o(ar, { size: 14 })
            ]
          }
        ),
        y ? /* @__PURE__ */ o(
          "div",
          {
            className: `ws-prompt-popover ${f}`,
            onMouseEnter: g,
            children: b
          }
        ) : null
      ]
    }
  );
}
function In({
  param: e,
  value: t,
  onChange: r,
  onClose: a
}) {
  if (e.type === "option" || e.type === "select") {
    const c = e.options || [];
    return /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list", children: c.map((u) => {
      const m = ft(
        u,
        [String(t ?? "")],
        c
      );
      return /* @__PURE__ */ M(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${m ? "is-active" : ""}`,
          onClick: () => {
            r(
              wt(
                e,
                Vt(u)
              )
            ), a();
          },
          children: [
            /* @__PURE__ */ o("span", { children: u.name || u.value }),
            m ? /* @__PURE__ */ o(Ke, { size: 14 }) : null
          ]
        },
        u.id || u.value
      );
    }) });
  }
  if (e.type === "multi_option") {
    const c = ur(t), u = e.options || [];
    return /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list", children: u.map((m) => {
      const p = ft(m, c, u);
      return /* @__PURE__ */ M(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${p ? "is-active" : ""}`,
          onClick: () => {
            let b = [...c];
            p ? b = b.filter(
              (l) => !ft(m, [l], u)
            ) : b.push(Vt(m)), r(wt(e, b));
          },
          children: [
            /* @__PURE__ */ o("span", { children: m.name || m.value }),
            p ? /* @__PURE__ */ o(Ke, { size: 14 }) : null
          ]
        },
        m.id || m.value
      );
    }) });
  }
  if (e.type === "switch") {
    const c = cr(t);
    return /* @__PURE__ */ M(
      "button",
      {
        type: "button",
        className: `ws-prompt-switch ${c ? "is-on" : ""}`,
        onClick: () => r(!c),
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
      value: St(t),
      placeholder: e.name,
      onChange: (c) => r(c.target.value)
    }
  ) : /* @__PURE__ */ o(
    "input",
    {
      className: "ws-prompt-param-input",
      type: e.value_type === "number" ? "number" : "text",
      value: St(t),
      placeholder: e.name,
      onChange: (c) => r(
        e.value_type === "number" ? Number(c.target.value) : c.target.value
      )
    }
  );
}
function Kt(e, t) {
  if (e.type === "switch")
    return `${e.name}: ${cr(t) ? "开" : "关"}`;
  if (e.type === "multi_option") {
    const a = ur(t).length;
    return a > 0 ? `${e.name} ${a}` : e.name;
  }
  if (e.type === "option" || e.type === "select")
    return Jr(e.options || [], t)?.name || e.name;
  const r = St(t);
  return r ? `${e.name}: ${r}` : e.name;
}
function Cn(e, t) {
  const r = String(t.preferredUsage || "").trim();
  if (r) {
    const c = e.find((u) => u.key === r);
    if (c)
      return c;
  }
  const a = new Set(t.acceptedKinds || []);
  if (a.size > 0) {
    const c = e.find(
      (u) => Pt(u).some((m) => a.has(m))
    );
    if (c)
      return c;
  }
  return e.length === 1 ? e[0] : void 0;
}
function qt(e, t) {
  return JSON.stringify([String(e || ""), t?.parts || []]);
}
function Pn(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e?.parts || []) {
    if (r.type !== "reference" || !r.usage)
      continue;
    const a = Yr(
      r,
      Number(r.ref_media_count || 0)
    );
    t.set(r.usage, (t.get(r.usage) || 0) + a);
  }
  return t;
}
function Nn(e, t) {
  const r = Rt(e);
  if (e.type !== "files")
    return t > 0 ? `${r}：已选择素材` : `选择${r}素材`;
  const a = Math.max(0, Number(e.max_files || 0));
  return t <= 0 ? a > 0 ? `选择${r}素材，最多 ${a} 个` : `选择${r}素材` : a > 0 ? `${r}：已选择 ${t} 个，最多 ${a} 个` : `${r}：已选择 ${t} 个`;
}
function Rt(e) {
  return String(e.name || e.key || "").trim() || "文件";
}
function Rn(e) {
  const t = Pt(e);
  return t.length === 1 ? t[0] : "file";
}
function St(e) {
  return e == null ? "" : Array.isArray(e) ? e.join("、") : String(e);
}
function ur(e) {
  if (Array.isArray(e))
    return e.map((t) => String(t)).filter(Boolean);
  if (typeof e == "string") {
    const t = kn(e);
    return Array.isArray(t) ? t.map((r) => String(r)).filter(Boolean) : e ? [e] : [];
  }
  return e ? [String(e)] : [];
}
function kn(e) {
  if (!e)
    return e;
  try {
    return JSON.parse(e);
  } catch {
    return e;
  }
}
function dr({
  id: e,
  label: t,
  ariaLabel: r,
  icon: a,
  value: c,
  options: u,
  disabled: m = !1,
  openKey: p,
  onToggle: b,
  onChange: l
}) {
  return u.length === 0 ? null : /* @__PURE__ */ o(
    Ve,
    {
      id: e,
      openKey: p,
      label: t,
      icon: a,
      disabled: m,
      onToggle: b,
      children: /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list", role: "menu", "aria-label": r, children: u.map((y) => /* @__PURE__ */ M(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${y.key === c ? "is-active" : ""}`,
          disabled: m,
          role: "menuitemradio",
          "aria-checked": y.key === c,
          onClick: () => {
            l(y.key), b("");
          },
          children: [
            /* @__PURE__ */ o("span", { children: y.label }),
            y.key === c ? /* @__PURE__ */ o(Ke, { size: 14 }) : null
          ]
        },
        y.key
      )) })
    }
  );
}
function Dn({
  value: e,
  options: t,
  disabled: r = !1,
  openKey: a,
  onToggle: c,
  onChange: u
}) {
  const m = t.find((p) => p.key === e);
  return t.length === 0 ? null : /* @__PURE__ */ o(
    dr,
    {
      id: "storyboard-work-type",
      ariaLabel: "作品类型",
      label: m?.name || e,
      icon: /* @__PURE__ */ o(Vr, { size: 15 }),
      value: e,
      options: t.map((p) => ({
        key: p.key,
        label: p.name
      })),
      disabled: r,
      openKey: a,
      onToggle: c,
      onChange: u
    }
  );
}
function _n({
  value: e,
  options: t,
  disabled: r = !1,
  openKey: a,
  onToggle: c,
  onChange: u
}) {
  const m = t.find((p) => p.seconds === e);
  return /* @__PURE__ */ o(
    dr,
    {
      id: "storyboard-min-shot-duration",
      ariaLabel: "单镜最短时长",
      label: `单镜最短 ${m?.name || `${e}秒`}`,
      icon: /* @__PURE__ */ o(zr, { size: 15 }),
      value: e,
      options: t.map((p) => ({
        key: p.seconds,
        label: p.name
      })),
      disabled: r,
      openKey: a,
      onToggle: c,
      onChange: u
    }
  );
}
const se = 1e3, ct = 60, En = [
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
function it(e) {
  const t = Math.max(
    0,
    Math.floor(Number(e || 0) / se)
  );
  return {
    minutes: Math.floor(t / ct),
    seconds: t % ct
  };
}
function Tn(e, t) {
  const r = e.find(
    (p) => String(p.purpose || "") === "soundtrack"
  ), a = st(r?.asset_id), c = st(r?.version_id), u = t.filter(
    (p) => st(p.refId) === a
  ), m = u.find(
    (p) => !c || st(p.versionID) === c
  ) || u[0];
  return {
    durationMs: Wt(m?.output) || Wt(m?.asset),
    audioUrl: String(m?.preview?.audioUrl || "").trim()
  };
}
function Wt(e) {
  return It(e, 0, /* @__PURE__ */ new Set());
}
function Yt(e, t, r) {
  const a = gt(r);
  if (a < se)
    return;
  const c = Math.min(
    gt(e),
    a - se
  ), u = Math.min(
    a,
    Math.max(
      c + se,
      t == null ? a : gt(t)
    )
  );
  return {
    startMs: c,
    endMs: u,
    soundtrackDurationMs: a
  };
}
function xn(e) {
  return {
    start: {
      minMs: 0,
      maxMs: e.endMs - se
    },
    end: {
      minMs: e.startMs + se,
      maxMs: e.soundtrackDurationMs
    }
  };
}
function Gt({
  minutes: e,
  seconds: t
}) {
  return (Math.max(0, Math.floor(e)) * ct + Math.min(ct - 1, Math.max(0, Math.floor(t)))) * se;
}
function Ht(e) {
  const { minutes: t, seconds: r } = it(e);
  return `${String(t).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}
function It(e, t, r) {
  if (e == null || t > 6)
    return 0;
  if (Array.isArray(e)) {
    for (const u of e) {
      const m = It(u, t + 1, r);
      if (m > 0)
        return m;
    }
    return 0;
  }
  if (typeof e != "object" || r.has(e))
    return 0;
  r.add(e);
  const a = e;
  for (const u of ["duration_ms", "durationMs"]) {
    const m = Jt(a[u], 1);
    if (m > 0)
      return m;
  }
  const c = Jt(a.duration, se);
  if (c > 0)
    return c;
  for (const u of En) {
    const m = It(
      a[u],
      t + 1,
      r
    );
    if (m > 0)
      return m;
  }
  return 0;
}
function Jt(e, t) {
  const r = Number(e);
  return Number.isFinite(r) && r > 0 ? Math.round(r * t) : 0;
}
function gt(e) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? Math.floor(t / se) * se : 0;
}
function st(e) {
  const t = Number(e);
  return Number.isInteger(t) && t > 0 ? t : 0;
}
const bt = 1e3;
function On({
  startMs: e,
  endMs: t,
  soundtrackDurationMs: r,
  soundtrackUrl: a,
  disabled: c = !1,
  openKey: u,
  onToggle: m,
  onChange: p
}) {
  const b = An(
    r,
    a
  ), l = S(
    () => Yt(
      e,
      t,
      b.durationMs
    ),
    [t, b.durationMs, e]
  ), y = l ? `${l.startMs}:${l.endMs}:${l.soundtrackDurationMs}` : "unavailable", [f, w] = A({ key: "", startMs: 0 }), g = f.key === y ? f.startMs : l?.startMs || 0, $ = f.key === y ? f.endMs : l?.endMs, T = Yt(
    g,
    $,
    b.durationMs
  ), j = T ? xn(T) : void 0, v = !!(l && l.startMs === 0 && l.endMs === l.soundtrackDurationMs), V = l ? v ? "全曲" : `${Ht(l.startMs)}–${Ht(l.endMs)}` : "制作范围";
  return /* @__PURE__ */ o(
    Ve,
    {
      id: "storyboard-time-range",
      openKey: u,
      label: V,
      icon: /* @__PURE__ */ o(Lr, { size: 15 }),
      filled: !!(l && !v),
      disabled: c,
      onToggle: m,
      children: /* @__PURE__ */ M(
        "form",
        {
          className: "ws-storyboard-range-form",
          onSubmit: (P) => {
            P.preventDefault(), T && (p(T.startMs, T.endMs), m(""));
          },
          children: [
            T && j ? /* @__PURE__ */ M(Ct, { children: [
              /* @__PURE__ */ o(
                Qt,
                {
                  label: "开始位置",
                  ariaLabelPrefix: "开始位置",
                  valueMs: T.startMs,
                  minMs: j.start.minMs,
                  maxMs: j.start.maxMs,
                  disabled: c,
                  onChange: (P) => w({
                    key: y,
                    startMs: P,
                    endMs: T.endMs
                  })
                }
              ),
              /* @__PURE__ */ o(
                Qt,
                {
                  label: "结束位置",
                  ariaLabelPrefix: "结束位置",
                  valueMs: T.endMs,
                  minMs: j.end.minMs,
                  maxMs: j.end.maxMs,
                  disabled: c,
                  onChange: (P) => w({
                    key: y,
                    startMs: T.startMs,
                    endMs: P
                  })
                }
              )
            ] }) : /* @__PURE__ */ o("p", { className: "ws-storyboard-range-status", children: b.loading ? "正在读取音轨时长..." : "无法读取音轨时长" }),
            /* @__PURE__ */ o("button", { type: "submit", disabled: c || !T, children: "确定" })
          ]
        }
      )
    }
  );
}
function Qt({
  label: e,
  ariaLabelPrefix: t,
  valueMs: r,
  minMs: a,
  maxMs: c,
  disabled: u,
  onChange: m
}) {
  const p = it(r), b = it(a), l = it(c), y = Zt(b.minutes, l.minutes), f = Xt(p.minutes, b, l), w = Zt(f.minimum, f.maximum);
  return /* @__PURE__ */ M("div", { className: "ws-storyboard-range-field", children: [
    /* @__PURE__ */ o("span", { children: e }),
    /* @__PURE__ */ M("div", { className: "ws-storyboard-range-time", children: [
      /* @__PURE__ */ o(
        "select",
        {
          value: p.minutes,
          disabled: u,
          "aria-label": `${t}分钟`,
          onChange: (g) => {
            const $ = Number(g.target.value), T = Xt(
              $,
              b,
              l
            );
            m(
              Gt({
                minutes: $,
                seconds: $n(
                  p.seconds,
                  T.minimum,
                  T.maximum
                )
              })
            );
          },
          children: y.map((g) => /* @__PURE__ */ M("option", { value: g, children: [
            g,
            "分"
          ] }, g))
        }
      ),
      /* @__PURE__ */ o(
        "select",
        {
          value: p.seconds,
          disabled: u,
          "aria-label": `${t}秒数`,
          onChange: (g) => m(
            Gt({
              ...p,
              seconds: Number(g.target.value)
            })
          ),
          children: w.map((g) => /* @__PURE__ */ M("option", { value: g, children: [
            String(g).padStart(2, "0"),
            "秒"
          ] }, g))
        }
      )
    ] })
  ] });
}
function An(e, t) {
  const r = er(e), a = String(t || "").trim(), [c, u] = A({
    audioUrl: "",
    durationMs: 0,
    failed: !1
  });
  Y(() => {
    if (r || !a)
      return;
    const b = document.createElement("audio");
    let l = !0;
    const y = (g) => {
      if (!l)
        return;
      const $ = er(g);
      u({ audioUrl: a, durationMs: $, failed: !$ });
    }, f = () => y(b.duration * 1e3), w = () => y(0);
    return b.preload = "metadata", b.addEventListener("loadedmetadata", f), b.addEventListener("error", w), b.src = a, b.load(), () => {
      l = !1, b.removeEventListener("loadedmetadata", f), b.removeEventListener("error", w), b.removeAttribute("src"), b.load();
    };
  }, [a, r]);
  const m = c.audioUrl === a ? c : void 0, p = r || m?.durationMs || 0;
  return {
    durationMs: p,
    loading: !p && !!a && !m?.failed
  };
}
function Xt(e, t, r) {
  return {
    minimum: e === t.minutes ? t.seconds : 0,
    maximum: e === r.minutes ? r.seconds : 59
  };
}
function Zt(e, t) {
  return Array.from(
    { length: Math.max(0, t - e + 1) },
    (r, a) => e + a
  );
}
function $n(e, t, r) {
  return Math.min(r, Math.max(t, e));
}
function er(e) {
  const t = Number(e);
  return Number.isFinite(t) && t >= bt ? Math.floor(t / bt) * bt : 0;
}
const tr = { zIndex: 999 }, le = { save: "immediate" }, Vn = [], zn = {
  id: 0,
  name: "上传",
  key: "files",
  type: "files",
  usage: 2,
  max_files: 6
}, Ln = [zn];
function Ue(e) {
  return Er(e?.source_rule);
}
function Fn(e) {
  return e && ["option", "select", "multi_option", "switch"].includes(e.type) ? le : void 0;
}
function rr(e, t, r, a) {
  const c = e.storyboardItem, u = new Set(c?.dependencyNodeIds || []);
  if (c?.itemType !== "shot" || !c.continuityAnchor || u.size !== 1)
    return { content: t, items: r };
  const m = r.filter(
    (l) => l.source === "current" && u.has(String(l.id || ""))
  ), p = new Set(
    m.map((l) => Number(l.refId || 0)).filter((l) => l > 0)
  );
  if (p.size === 0)
    return { content: t, items: r };
  const b = tn(a);
  return {
    content: t && {
      ...t,
      parts: t.parts.map(
        (l) => l.type === "reference" && l.ref_type === "asset" && p.has(Number(l.ref_id || 0)) ? { ...l, usage: b } : l
      )
    },
    items: r.map(
      (l) => m.includes(l) ? { ...l, kind: "image" } : l
    )
  };
}
function nr(e, t, r, a) {
  if (!a || !t)
    return {
      content: e.promptContent,
      references: e.storyboardReferences || []
    };
  const c = e.storyboardWorkType || "short";
  return at(
    e.promptContent,
    e.storyboardReferences,
    r,
    e.prompt || "",
    c,
    t.storyboard_reference_purposes
  );
}
function Zn({ node: e }) {
  const {
    projectId: t,
    canvasId: r,
    runningNode: a,
    onNodeDraftChange: c,
    onAssetCreated: u,
    onClearFeedbackRecords: m,
    onRunBackendNode: p,
    onTextParamConnectionRemove: b,
    requestConfirm: l
  } = e, y = e.composerDraft, f = S(
    () => xt(y),
    [y]
  ), w = S(
    () => Ot(f),
    [f]
  ), g = re(f), $ = re(""), [T, j] = A(f.prompt || ""), [v, V] = A(f.promptContent), [P, ne] = A(f.storyboardReferences || []), [z, me] = A(f.storyboardWorkType || "short"), [ae, Me] = A(f.storyboardLyricsSourceNodeId || ""), [pe, Se] = A(
    () => Fe(f.minShotDuration)
  ), [ut, fe] = A(
    f.storyboardRangeStartMs || 0
  ), [dt, ye] = A(f.storyboardRangeEndMs), [lt, qe] = A(!1), [I, ge] = A(null), [q, Ie] = A(!1), [ie, Ce] = A(
    f.selectedTargetId || 0
  ), [L, Pe] = A(
    f.paramValues || {}
  ), [ke, H] = A(f.multiImageMode), J = re(I), De = e.inputContext, We = e.runBlockedReason;
  Y(() => {
    const n = $.current;
    n && n !== w || ($.current = "", g.current = f);
  }, [f, w]), Y(() => {
    J.current = I;
  }, [I]);
  const Q = lt || Fr(a), F = e.type, mt = e.id, _e = e.flow?.id || 0, Ee = e.type === "power" && e.power?.id || 0, Te = e.type === "power" && e.power?.key || "", Ye = e.type === "agent" ? Number(e.role?.agent_id || 0) : 0, oe = e.space, D = e.canvasReferenceItems, E = e.connectedMediaReferences, xe = e.onConnectedMediaUsagesChange, Ge = e.onConnectedMediaEdgeRemove, Oe = e.catalogCache, Ne = Number(
    oe?.release?.id || oe?.project.release_id || 0
  ), be = Number(e.assetCateId || 0), C = S(
    () => Ur(
      De,
      D.filter((n) => n.id !== e.id)
    ),
    [D, De, e.id]
  ), Re = S(
    () => Tn(
      P,
      C.current
    ),
    [C, P]
  ), Ae = re(C);
  Y(() => {
    Ae.current = C;
  }, [C]);
  const ze = S(() => {
    const n = /* @__PURE__ */ new Map();
    for (const s of De?.sources || [])
      n.set(s.nodeId, {
        title: s.title || "上游节点",
        text: s.preview.text || (typeof s.output == "string" ? s.output : "")
      });
    const i = new Set(
      Object.values(f.paramBindings || {}).map(
        (s) => s.sourceNodeId
      )
    );
    ae && i.add(ae);
    for (const s of i) {
      if (n.has(s))
        continue;
      const h = D.find(
        (k) => k.id === s
      );
      n.set(s, {
        title: h?.title || "上游节点",
        text: h?.preview.text || ""
      });
    }
    return Object.fromEntries(n);
  }, [
    D,
    De,
    f.paramBindings,
    ae
  ]), N = e.type === "power" && on(e.power, e.kind, e.outputType)?.viewMode === "storyboard";
  Y(() => {
    if (F === "power" && (Ee || Te)) {
      const n = g.current.selectedTargetId || 0;
      let i = !1;
      return Ie(!0), Oe.loadPowerForm(
        {
          projectId: t,
          releaseId: Ne,
          flowId: _e,
          powerId: Ee,
          powerKey: Te,
          targetId: n
        },
        () => At({
          projectId: t,
          flowId: _e,
          powerId: Ee,
          powerKey: Te,
          targetId: n
        })
      ).then((s) => {
        if (i)
          return;
        const h = g.current, k = nr(
          h,
          s,
          Ae.current.current,
          N
        );
        ge(s), Ce(
          Ue(s) && (s.selected_target_id || n) || 0
        ), Pe(
          zt(s.params || [], h)
        ), j(h.prompt || ""), V(k.content), ne(k.references), me(h.storyboardWorkType || "short"), Me(
          h.storyboardLyricsSourceNodeId || ""
        ), Se(
          Fe(h.minShotDuration)
        ), fe(h.storyboardRangeStartMs || 0), ye(h.storyboardRangeEndMs), H(h.multiImageMode);
      }).catch((s) => {
        i || we.error(
          s instanceof Error ? s.message : "加载能力参数失败"
        );
      }).finally(() => {
        i || Ie(!1);
      }), () => {
        i = !0;
      };
    }
    if (ge(null), F === "agent") {
      const n = g.current;
      Pe(n.paramValues || {}), j(n.prompt || ""), V(n.promptContent), ne(n.storyboardReferences || []), me(n.storyboardWorkType || "short"), Me(""), Se(Ut), fe(0), ye(void 0), H(void 0), Ce(0);
      return;
    }
    Pe({}), Ce(0), j(""), V(void 0), ne([]), me("short"), Me(""), Se(Ut), fe(0), ye(void 0), H(void 0);
  }, [
    Oe,
    N,
    t,
    Ne,
    _e,
    Ye,
    mt,
    F,
    Ee,
    Te
  ]);
  const R = I?.params || Vn, W = S(
    () => rt(
      R,
      L,
      E.map((n) => n.source)
    ),
    [E, L, R]
  ), ce = S(
    () => Lt({
      node: e,
      content: v,
      items: C.current,
      connections: E,
      params: R,
      values: W,
      requestedMode: ke
    }),
    [
      C,
      E,
      W,
      e,
      R,
      v,
      ke
    ]
  ), d = ce.active ? ce.mode : void 0, x = !!$.current && $.current !== w ? g.current.multiImageMode || ke || d : f.multiImageMode || d, X = S(
    () => nt(R, W),
    [W, R]
  ), ue = S(
    () => ot(X),
    [X]
  ), G = S(
    () => F === "power" ? Qr(
      ue,
      d
    ) : [],
    [ue, d, F]
  ), kt = S(() => {
    const n = new Set(
      ue.map((s) => s.key)
    ), i = new Set(
      G.map((s) => s.key)
    );
    return X.filter(
      (s) => Xr(s, R) && (!je(s) || !n.has(s.key) || i.has(s.key))
    );
  }, [
    ue,
    X,
    G,
    R
  ]), pt = S(
    () => rr(
      e,
      v,
      C.current,
      G
    ),
    [C, G, e, v]
  ), lr = S(
    () => N ? un(
      z,
      I?.storyboard_reference_purposes || []
    ) : [],
    [N, I, z]
  ), He = F === "power" && ["image", "video"].includes(Zr(e) || ""), mr = S(
    () => F === "power" && !q ? yt(
      E,
      pt.content,
      pt.items,
      G,
      {},
      He,
      d
    ) : "",
    [
      E,
      G,
      pt,
      q,
      He,
      F,
      d
    ]
  ), pr = S(
    () => N && !q ? I ? dn(
      P,
      z,
      I.storyboard_work_types,
      I.storyboard_reference_purposes
    ) : "分镜作品类型与参考用途配置加载失败，请重新打开节点后重试" : "",
    [
      N,
      I,
      q,
      P,
      z
    ]
  ), Le = e.storyboardItem?.itemType === "shot" ? e.storyboardItem.requiredDurationValues : void 0, Je = S(
    () => ln(
      I?.sources || [],
      Le
    ),
    [I?.sources, Le]
  ), fr = S(() => {
    if (!Le?.length || q || !I)
      return "";
    const n = mn(
      Le
    );
    return Je.length === 0 ? n : Ue(I) && ie > 0 && !Je.some(
      (i) => i.target_id === ie || i.id === ie
    ) ? `当前所选模型不满足时长要求；${n}` : "";
  }, [
    Je,
    I,
    q,
    Le,
    ie
  ]), Qe = We || ce.error || mr || pr || fr, Z = S(
    () => X.find(en) || null,
    [X]
  ), yr = S(
    () => kt.filter(
      (n) => n.key !== Z?.key && (je(n) || ir(n) || vt(n, R))
    ),
    [kt, R, Z?.key]
  ), ee = Z ? String(W[Z.key] ?? "") : T, gr = String(
    I?.power?.description || e.power?.description || ""
  ).trim() || (Z ? "在此处为该能力输入生成提示词..." : "当前能力无需填写提示词"), Xe = Ue(I), te = Xe ? ie : 0;
  Y(() => {
    if (F !== "power" && F !== "agent")
      return;
    const n = g.current, i = J.current, s = nr(
      n,
      i,
      Ae.current.current,
      N
    );
    j(n.prompt || ""), V(s.content), ne(s.references), me(n.storyboardWorkType || "short"), Me(
      n.storyboardLyricsSourceNodeId || ""
    ), Se(
      Fe(n.minShotDuration)
    ), fe(n.storyboardRangeStartMs || 0), ye(n.storyboardRangeEndMs), H(n.multiImageMode), Ce(
      F === "power" && Ue(i) && (n.selectedTargetId || i?.selected_target_id) || 0
    ), Pe(
      F === "power" && i ? zt(
        i.params || [],
        n
      ) : n.paramValues || {}
    );
  }, [N, w, F]);
  const he = K(
    (n, i) => {
      const s = Object.prototype.hasOwnProperty.call(
        n,
        "promptContent"
      ) ? n.promptContent : v, h = Br({
        ...g.current,
        ...n,
        promptContent: s,
        ...N ? {} : {
          storyboardReferences: [],
          storyboardWorkType: void 0,
          storyboardLyricsSourceNodeId: void 0,
          minShotDuration: void 0,
          storyboardRangeStartMs: void 0,
          storyboardRangeEndMs: void 0
        }
      });
      g.current = h;
      const k = Ot(
        xt(h)
      );
      return $.current = k === w ? "" : k, H(h.multiImageMode), c(e.id, h, i), h;
    },
    [
      N,
      w,
      e.id,
      c,
      v
    ]
  ), Ze = K(
    (n, i) => {
      n && l({
        title: "删除文本连接",
        description: i,
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => b(n, e.id)
      });
    },
    [e.id, b, l]
  ), br = K(
    (n) => {
      const i = g.current.paramBindings?.[n]?.sourceNodeId || "";
      Ze(
        i,
        "删除后，上游文本将不再传入这个参数。"
      );
    },
    [Ze]
  ), hr = K(() => {
    Ze(
      String(g.current.storyboardLyricsSourceNodeId || "").trim(),
      "删除后，上游文本将不再作为 MV 歌词传入。"
    );
  }, [Ze]), ve = K(
    (n, i, s) => (Pe(n), he({ ...i, paramValues: n }, s)),
    [he]
  );
  Y(() => {
    W !== L && ve(W, {
      prompt: ee,
      promptContent: v,
      selectedTargetId: te,
      multiImageMode: x
    });
  }, [
    te,
    W,
    L,
    ee,
    v,
    ve,
    x
  ]);
  function vr(n, i) {
    const s = $e(v) !== $e(i), h = s ? Be(
      v,
      i,
      C.current,
      G,
      E,
      d
    ) : { content: i, assignments: {} }, k = h.content;
    Object.keys(h.assignments).length > 0 && xe?.(h.assignments), j(n);
    const _ = N && s ? at(
      k,
      P,
      C.current,
      n,
      z,
      I?.storyboard_reference_purposes || []
    ) : {
      content: k,
      references: P
    };
    V(_.content), ne(_.references);
    const U = g.current.paramValues || L, B = Z ? { ...U, [Z.key]: n } : U;
    ve(
      B,
      {
        prompt: n,
        promptContent: _.content,
        selectedTargetId: te,
        storyboardReferences: _.references,
        storyboardWorkType: N ? z : void 0,
        minShotDuration: N ? pe : void 0,
        multiImageMode: x
      },
      s ? le : void 0
    );
  }
  function wr(n) {
    const i = at(
      v,
      P,
      C.current,
      ee,
      n,
      I?.storyboard_reference_purposes || []
    ), s = n === "mv" ? ae : "";
    me(n), Me(s), V(i.content), ne(i.references), he(
      {
        prompt: ee,
        promptContent: i.content,
        paramValues: L,
        selectedTargetId: te,
        storyboardReferences: i.references,
        storyboardWorkType: n,
        storyboardLyricsSourceNodeId: s || void 0,
        minShotDuration: pe,
        multiImageMode: x
      },
      le
    );
  }
  function Mr(n) {
    const i = Fe(n);
    Se(i), he(
      {
        prompt: ee,
        promptContent: v,
        paramValues: L,
        selectedTargetId: te,
        storyboardReferences: P,
        storyboardWorkType: z,
        minShotDuration: i,
        multiImageMode: x
      },
      le
    );
  }
  function Sr(n, i) {
    fe(n), ye(i), he(
      {
        prompt: ee,
        promptContent: v,
        paramValues: L,
        selectedTargetId: te,
        storyboardReferences: P,
        storyboardWorkType: z,
        storyboardRangeStartMs: n,
        storyboardRangeEndMs: i,
        minShotDuration: pe,
        multiImageMode: x
      },
      le
    );
  }
  function Ir(n, i) {
    const s = {
      ...g.current.paramValues || L,
      [n]: i
    }, h = R.find((U) => U.key === n), k = Fn(h), _ = d;
    if (h && vt(h, R)) {
      const U = ot(
        nt(R, s)
      ), B = Be(
        v,
        v,
        C.current,
        U,
        E,
        _
      );
      Object.keys(B.assignments).length > 0 && xe?.(B.assignments), V(B.content), ve(
        s,
        {
          prompt: ee,
          promptContent: B.content,
          selectedTargetId: te,
          multiImageMode: x
        },
        k
      );
      return;
    }
    ve(
      s,
      {
        prompt: ee,
        promptContent: v,
        selectedTargetId: te,
        multiImageMode: x
      },
      k
    );
  }
  function Cr(n) {
    const i = ce.options.find(
      (B) => B.value === n
    );
    if (!ce.active || !i?.enabled) {
      we.error(i?.reason || "当前能力不支持该多图生成方式");
      return;
    }
    const s = g.current.paramValues || L, h = rt(
      R,
      s,
      E.map((B) => B.source)
    ), k = ot(
      nt(R, h)
    ), _ = Be(
      v,
      v,
      C.current,
      k,
      E,
      n
    ), U = yt(
      E,
      _.content,
      C.current,
      k,
      _.assignments,
      He,
      n
    );
    U && we.error(U), Object.keys(_.assignments).length > 0 && xe?.(_.assignments), V(_.content), ve(
      h,
      {
        prompt: ee,
        promptContent: _.content,
        selectedTargetId: te,
        storyboardReferences: P,
        multiImageMode: n
      },
      le
    );
  }
  function Pr(n, i) {
    const s = $e(v) !== $e(i);
    j(n), V(i), he(
      {
        prompt: n,
        promptContent: i,
        paramValues: g.current.paramValues || L,
        selectedTargetId: 0
      },
      s ? le : void 0
    );
  }
  function Nr(n, i) {
    const s = {
      ...g.current.paramValues || L,
      [n]: i
    };
    ve(
      s,
      {
        prompt: T,
        selectedTargetId: 0
      },
      le
    );
  }
  async function Dt(n, i, s) {
    const h = await jr({
      projectID: t,
      canvasID: r,
      teamID: Number(oe?.project.team_id || 0),
      files: n,
      ruleID: i.upload_rule_id,
      onProgress: s?.onProgress
    });
    for (const k of h) {
      const _ = Kr(k.asset);
      _.id && u?.(_);
    }
    return h;
  }
  async function Rr(n) {
    if (!(Q || !Xe) && !(e.type !== "power" || !e.power))
      try {
        const i = await Oe.loadPowerForm(
          {
            projectId: t,
            releaseId: Ne,
            flowId: e.flow?.id || 0,
            powerId: e.power.id,
            powerKey: e.power.key,
            targetId: n
          },
          () => At({
            projectId: t,
            flowId: e.flow?.id || 0,
            powerId: e.power?.id || 0,
            powerKey: e.power?.key || "",
            targetId: n
          })
        ), s = i.params || [], h = rn(
          s,
          g.current.paramValues || L,
          I?.params || []
        ), k = rt(
          s,
          h,
          E.map((Dr) => Dr.source)
        ), _ = Lt({
          node: e,
          content: v,
          items: C.current,
          connections: E,
          params: s,
          values: k,
          requestedMode: ke || d
        }), U = _.active ? _.mode : void 0;
        if (_.error) {
          we.error(`无法切换能力来源：${_.error}`);
          return;
        }
        const B = ot(
          nt(s, k)
        ), de = Be(
          v,
          v,
          C.current,
          B,
          E,
          U
        ), et = rr(
          e,
          de.content,
          C.current,
          B
        ), tt = yt(
          E,
          et.content,
          et.items,
          B,
          de.assignments,
          He,
          U
        );
        if (tt) {
          we.error(`无法切换能力来源：${tt}`);
          return;
        }
        Object.keys(de.assignments).length > 0 && xe?.(de.assignments), ge(i);
        const Et = Ue(i) ? i.selected_target_id || n : 0;
        Ce(Et), V(de.content), ve(
          k,
          {
            prompt: ee,
            promptContent: de.content,
            selectedTargetId: Et,
            multiImageMode: U
          },
          le
        );
      } catch (i) {
        we.error(i instanceof Error ? i.message : "加载能力参数失败");
      }
  }
  const kr = async (n, i) => {
    m([e.id]), qe(!0);
    try {
      if (e.type === "power" && e.power) {
        const s = g.current, h = Object.prototype.hasOwnProperty.call(
          s,
          "promptContent"
        ) ? s.promptContent : i, k = s.storyboardWorkType || z, _ = Fe(
          s.minShotDuration ?? pe
        ), U = N ? at(
          h,
          s.storyboardReferences || P,
          C.current,
          n,
          k,
          I?.storyboard_reference_purposes || []
        ) : {
          content: h,
          references: s.storyboardReferences || []
        }, B = d, de = {
          ...rt(
            R,
            s.paramValues || W,
            E.map((tt) => tt.source)
          )
        };
        Z && (de[Z.key] = n);
        const et = he({
          ...s,
          prompt: n,
          promptContent: U.content,
          paramValues: de,
          selectedTargetId: te,
          storyboardReferences: U.references,
          storyboardWorkType: N ? k : void 0,
          minShotDuration: N ? _ : void 0,
          multiImageMode: B
        });
        await p({
          ...e,
          composerDraft: et
        });
        return;
      }
      if (e.type === "agent" && e.role) {
        const s = g.current, h = he({
          ...s,
          prompt: n,
          promptContent: Object.prototype.hasOwnProperty.call(
            s,
            "promptContent"
          ) ? s.promptContent : i,
          paramValues: s.paramValues || L,
          selectedTargetId: 0
        });
        await p({
          ...e,
          composerDraft: h
        });
        return;
      }
      throw new Error("当前节点缺少可运行配置");
    } catch (s) {
      we.error(s instanceof Error ? s.message : "执行出错");
    } finally {
      qe(!1);
    }
  }, _t = async (n, i) => {
    if (!Q) {
      if (Qe) {
        we.error(Qe);
        return;
      }
      await kr(n, i);
    }
  };
  return e.type === "power" ? /* @__PURE__ */ o(
    "div",
    {
      className: "ws-node-bottom-settings is-composer nodrag nowheel",
      onClick: (n) => n.stopPropagation(),
      style: tr,
      children: q && !Q && !I ? /* @__PURE__ */ M("div", { className: "ws-prompt-loading", children: [
        /* @__PURE__ */ o(or, { size: 16, className: "ws-spin" }),
        /* @__PURE__ */ o("span", { children: "正在加载能力参数..." })
      ] }) : /* @__PURE__ */ o(
        jt,
        {
          value: ee,
          referenceContent: v,
          placeholder: gr,
          running: Q,
          textInputEnabled: !!Z,
          showMediaParamButtons: !0,
          mediaParamPower: I?.power || e.power,
          sourceOptions: Xe ? Je : [],
          selectedSourceId: te,
          params: yr,
          primaryParam: Z || void 0,
          paramValues: W,
          paramBindings: f.paramBindings,
          paramBindingSources: ze,
          storyboardLyricsBindingSource: N && z === "mv" && ae ? ze[ae] || {
            title: "上游节点"
          } : void 0,
          assetLibrary: C,
          assetReference: {
            teamID: Number(oe?.project.team_id || 0),
            projectID: t,
            assetCateID: be
          },
          connectedMediaReferences: E,
          mediaUsageOptions: G,
          referenceUsageOptions: N ? lr : void 0,
          referenceUsageField: N ? "purpose" : "usage",
          multiImagePlan: ce,
          multiImageMode: d,
          toolbarContent: N ? ({ openKey: n, onToggle: i }) => /* @__PURE__ */ M(Ct, { children: [
            /* @__PURE__ */ o(
              Dn,
              {
                value: z,
                options: I?.storyboard_work_types || [],
                disabled: q || Q,
                openKey: n,
                onToggle: i,
                onChange: wr
              }
            ),
            /* @__PURE__ */ o(
              _n,
              {
                value: pe,
                options: I?.storyboard_min_shot_durations || [],
                disabled: q || Q,
                openKey: n,
                onToggle: i,
                onChange: Mr
              }
            ),
            z === "mv" && P.some(
              (s) => s.purpose === "soundtrack"
            ) ? /* @__PURE__ */ o(
              On,
              {
                startMs: ut,
                endMs: dt,
                soundtrackDurationMs: Re.durationMs,
                soundtrackUrl: Re.audioUrl,
                disabled: q || Q,
                openKey: n,
                onToggle: i,
                onChange: Sr
              }
            ) : null
          ] }) : void 0,
          onConnectedMediaEdgeRemove: Ge,
          disabled: q,
          submitDisabled: !!Qe,
          submitDisabledReason: Qe,
          onChange: vr,
          onParamChange: Ir,
          onParamBindingConnectionRemove: br,
          onStoryboardLyricsConnectionRemove: hr,
          onMultiImageModeChange: Cr,
          onSourceChange: Xe ? (n) => {
            Rr(n);
          } : void 0,
          onLocalUpload: Dt,
          onSubmit: _t
        }
      )
    }
  ) : /* @__PURE__ */ o(
    "div",
    {
      className: "ws-node-bottom-settings is-composer nodrag nowheel",
      onClick: (n) => n.stopPropagation(),
      style: tr,
      children: /* @__PURE__ */ o(
        jt,
        {
          value: T,
          referenceContent: v,
          placeholder: "向智能体发送任务指令...",
          running: Q,
          params: Ln,
          paramValues: L,
          assetLibrary: C,
          assetReference: {
            teamID: Number(oe?.project.team_id || 0),
            projectID: t,
            assetCateID: be
          },
          connectedMediaReferences: E,
          onConnectedMediaEdgeRemove: Ge,
          onChange: Pr,
          onParamChange: Nr,
          onLocalUpload: Dt,
          onSubmit: _t
        }
      )
    }
  );
}
export {
  Zn as CanvasNodeSettings
};
