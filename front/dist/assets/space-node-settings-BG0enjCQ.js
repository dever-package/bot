import { a as S, j as n, F as Ct } from "./preloadable-CbkzeflN.js";
import { i as sn, S as Xt } from "./space-node-runtime-CTTiHQ3e.js";
import { u as R, h as G, a as A, b as se, d as H, F as an } from "./file-kind-X0KKJPkQ.js";
import { C as nt, b as cn, aF as ln, r as kr, aG as Nr, c as jt, L as Pr, aA as un, X as dn, aD as er, h as mn, a5 as pn, T as fn, y as gn } from "./vendor-icons-B1zF1_4n.js";
import { u as yn, v as We, x as vt, y as xt, z as Ot, A as bn, B as tr, C as rr, D as nr, l as hn, m as or, E as vn } from "./writing-reference-DgnCfuWu.js";
import { i as Rr, h as wn, j as Rt, k as Sn } from "./node-detail-header-YT4Fy3hu.js";
import { i as Ke, e as qt, f as Dr, g as $t, h as Mn, j as Vt, k as Cn, r as qe, l as sr, m as In, n as kn, s as Nn, o as Pn, p as At, P as _r, q as rt, t as Tr, u as Wt, v as yt, w as Er, S as Rn, x as Dt, y as ar, z as xr, A as ft, B as ir, C as Qe, D as Xe, E as Dn, F as _n, a as Tn, G as En, H as xn, I as On, J as $n, K as _t, L as Vn, M as An } from "./space-media-references-DvDILtpP.js";
import { a as wt } from "./space-story-setting-reference-Dmqa_708.js";
import { a as Ut, P as Or } from "./power-icon-D3f9lTzM.js";
import { a as Un } from "./space-reference-editor-CJ0l3Yrs.js";
import { o as zn, B as Kt } from "./asset-preview-B63J-8X6.js";
import { n as Fn } from "./text-content-save-actions-DDFA390i.js";
import { u as Ln } from "./asset-reference-provider-DrWXqwbl.js";
import { d as Bn, r as cr, i as jn } from "./space-assistant-layout-B9KyeCM0.js";
import { P as et, Q as lr, R as qn, T as Wn, U as Kn, V as Yn, W as bt } from "./asset-audio-preview-DlcU6JQ0.js";
import { b as Gn } from "./space-upload-DC6G8tEj.js";
function ur(e) {
  return Bn(
    e?.service_name,
    e?.name,
    "来源"
  );
}
const Hn = 240, Jn = [], Zn = [], Qn = {}, Xn = {};
function dr({
  value: e,
  placeholder: r,
  running: t = !1,
  disabled: o = !1,
  textInputEnabled: a = !0,
  showMediaParamButtons: c = !1,
  mediaParamPower: d,
  submitDisabled: g = !1,
  submitDisabledReason: u = "",
  sourceOptions: y = [],
  selectedSourceId: i = 0,
  params: v = [],
  primaryParam: M,
  paramValues: m = {},
  paramBindings: b = Qn,
  paramBindingSources: h = Xn,
  storyboardLyricsBindingSource: q,
  assetLibrary: K = { current: [] },
  referenceContent: j,
  assetReference: _,
  connectedMediaReferences: Z = Jn,
  mediaUsageOptions: D = Zn,
  referenceUsageOptions: we,
  referenceUsageField: Ve = "usage",
  multiImagePlan: ie,
  multiImageMode: P,
  toolbarContent: ee,
  onConnectedMediaEdgeRemove: Q,
  onChange: fe,
  onParamChange: J,
  onParamBindingConnectionRemove: ge,
  onStoryboardLyricsConnectionRemove: Se,
  onSourceChange: Ne,
  onMultiImageModeChange: Pe,
  onLocalUpload: de,
  onSubmit: ot
}) {
  const me = R(
    () => v.filter(Ke),
    [v]
  ), Ye = M ? b[M.key] : void 0, Re = Ye ? h[Ye.sourceNodeId] : void 0, kt = G(
    (f) => {
      const I = ro(f);
      K.current = [
        ...K.current.filter(
          (E) => E.refType !== f.refType || Number(E.refId || 0) !== f.refId
        ),
        I
      ];
    },
    [K]
  ), st = G(
    async (f, I) => {
      if (!de)
        throw new Error("当前节点未配置本地上传");
      const E = ao(me, I);
      if (!E)
        throw new Error("当前能力没有与所选素材类型匹配的上传参数");
      const V = (await de(f, E, {
        onProgress: I.onProgress
      })).map((L) => Fn(L.asset)).filter((L) => L.id > 0);
      if (V.length === 0)
        throw new Error("上传成功，但没有生成可用资产");
      return V;
    },
    [de, me]
  ), te = Ln({
    notificationMode: "inline",
    teamID: Number(_?.teamID || 0),
    scopeProjectID: Number(_?.projectID || 0),
    initialFilters: _?.projectID ? {
      sourceType: "project",
      projectID: _.projectID,
      assetCateID: Number(_.assetCateID || 0)
    } : void 0,
    onSelect: kt,
    onUpload: de ? st : void 0
  }), [ce, W] = A(""), [De, z] = A(), Me = se(0), Ce = G((f) => {
    W(""), Me.current += 1, z({
      id: Me.current,
      trigger: "@",
      preferredUsage: f.key,
      acceptedKinds: qt(f)
    });
  }, []), _e = G(
    (f) => {
      z(
        (I) => I?.id === f ? void 0 : I
      );
    },
    []
  ), Ae = R(
    () => v.filter(
      (f) => Ke(f) || !!f.group || Dr(f) || $t(f, v)
    ),
    [v]
  ), Ue = R(
    () => Mn(Ae),
    [Ae]
  ), at = R(
    () => y.find(
      (f) => f.target_id === i || f.id === i
    ),
    [i, y]
  ), X = i > 0 && !at, F = ie?.active && P === "shared_reference" ? ie.frameUsages : [], Nt = Ae.some(
    Vt
  ), ze = /* @__PURE__ */ n(
    eo,
    {
      plan: ie,
      openKey: ce,
      disabled: o || t,
      onToggle: W,
      onChange: Pe
    }
  ), re = K.current, $ = R(() => {
    if (X || o)
      return { value: e, content: j };
    const f = yn(
      e,
      j,
      Cn(Z, re)
    );
    return {
      ...f,
      content: qe(
        j,
        f.content,
        re,
        D,
        Z,
        P
      ).content
    };
  }, [
    Z,
    o,
    D,
    P,
    j,
    re,
    X,
    e
  ]), it = F.length ? sr(
    $.content,
    re,
    Z
  ) : [], Te = In(it), Fe = F.some(
    (f) => ce === `frame:${f.key}`
  ) ? kn(it, re, Z) : [], x = R(
    () => D.map((f) => ({
      key: f.key,
      label: f.label,
      acceptedKinds: f.acceptedKinds,
      maxFiles: f.maxFiles
    })),
    [D]
  ), Ee = R(
    () => we || x,
    [we, x]
  ), Ge = R(
    () => io($.content),
    [$.content]
  ), Le = R(
    () => mr(e, j),
    [j, e]
  ), xe = R(
    () => mr(
      $.value,
      $.content
    ),
    [$.content, $.value]
  ), ye = se({
    value: $.value,
    content: $.content
  }), N = se(!1), Oe = se(null), Be = se(fe), He = se(ot);
  Be.current = fe, He.current = ot;
  const O = G(() => {
    Oe.current !== null && (window.clearTimeout(Oe.current), Oe.current = null);
  }, []), C = G(() => {
    if (O(), !N.current)
      return;
    N.current = !1;
    const f = ye.current;
    Be.current(f.value, f.content);
  }, [O]), le = G(
    (f, I, E = !1) => {
      const Y = ye.current.content;
      ye.current = {
        value: f,
        content: I
      }, N.current = !0;
      const V = We(Y) !== We(I);
      if (E || V) {
        C();
        return;
      }
      O(), Oe.current = window.setTimeout(
        C,
        Hn
      );
    },
    [O, C]
  ), ne = G(
    (f, I, E) => {
      const Y = ye.current;
      if (!Y.content) return "请先添加参考图片";
      const V = sr(
        Y.content,
        re,
        Z
      );
      try {
        const L = Nn(
          Y.content,
          V,
          I,
          f && E ? { part: f, media: E } : void 0
        );
        le(Y.value, L, !0);
      } catch (L) {
        return L instanceof Error ? L.message : String(L);
      }
    },
    [Z, re, le]
  ), be = G(() => {
    const f = ye.current;
    return C(), He.current(f.value, f.content);
  }, [C]);
  return H(() => {
    N.current || (ye.current = {
      value: $.value,
      content: $.content
    });
  }, [
    xe,
    $.content,
    $.value
  ]), H(
    () => () => {
      C();
    },
    [C]
  ), H(() => {
    (o || t) && W("");
  }, [o, t]), H(() => {
    X || o || Le !== xe && (N.current || le(
      $.value,
      $.content,
      !0
    ));
  }, [
    Le,
    o,
    xe,
    $.content,
    $.value,
    X,
    le
  ]), /* @__PURE__ */ S(
    "div",
    {
      className: `ws-prompt-composer nowheel ${t ? "is-running" : ""}`,
      children: [
        /* @__PURE__ */ n("div", { className: "ws-prompt-main", children: /* @__PURE__ */ S("div", { className: "ws-prompt-editor-shell", children: [
          M && Ye ? /* @__PURE__ */ n(
            St,
            {
              label: wt(M),
              source: Re,
              compact: !0,
              disabled: o || t,
              onRemove: () => ge?.(M.key)
            }
          ) : null,
          q ? /* @__PURE__ */ n(
            St,
            {
              label: "歌词",
              source: q,
              compact: !0,
              disabled: o || t,
              onRemove: () => Se?.()
            }
          ) : null,
          /* @__PURE__ */ n(
            Un,
            {
              className: "ws-prompt-reference-editor nodrag nopan",
              value: $.value,
              content: $.content,
              disabled: o || t,
              textEditable: a,
              placeholder: r,
              items: re,
              usageOptions: F.length > 0 ? [] : Ee,
              usageField: Ve,
              mediaUsageOptions: x,
              mediaSelectionMaxFiles: ie?.active && P === "per_image" ? 0 : void 0,
              mediaSelectionUsages: F.length ? F : void 0,
              onReferenceMediaUsageSelect: ne,
              autoAssignUsage: Ve !== "purpose",
              pickerRequest: De,
              onPickerRequestConsumed: _e,
              assetReferenceProvider: _?.teamID ? te : void 0,
              onReferenceDelete: (f) => {
                f.ref_origin === "edge" && f.ref_origin_id && Q?.(f.ref_origin_id);
              },
              onChange: le,
              onBlur: C,
              onSubmit: !t && !g ? () => {
                be();
              } : void 0
            }
          )
        ] }) }),
        /* @__PURE__ */ S("div", { className: "ws-prompt-toolbar", children: [
          /* @__PURE__ */ S("div", { className: "ws-prompt-tools", children: [
            y.length > 0 || i > 0 ? /* @__PURE__ */ n(
              ke,
              {
                id: "source",
                openKey: ce,
                label: X ? "来源不可用，请重新选择" : ur(at),
                icon: /* @__PURE__ */ n(cn, { size: 15 }),
                disabled: o || t,
                onToggle: W,
                children: /* @__PURE__ */ S("div", { className: "ws-prompt-menu-list", children: [
                  y.length === 0 ? /* @__PURE__ */ n("span", { className: "ws-prompt-menu-item", role: "status", children: "暂无可用来源" }) : null,
                  y.map((f) => {
                    const I = f.target_id || f.id, E = I === i;
                    return /* @__PURE__ */ S(
                      "button",
                      {
                        type: "button",
                        className: `ws-prompt-menu-item ${E ? "is-active" : ""}`,
                        disabled: o || t,
                        onClick: () => {
                          Ne?.(I), W("");
                        },
                        children: [
                          /* @__PURE__ */ n("span", { children: ur(f) }),
                          E ? /* @__PURE__ */ n(nt, { size: 14 }) : null
                        ]
                      },
                      I
                    );
                  })
                ] })
              }
            ) : null,
            ee?.({ openKey: ce, onToggle: W }),
            Nt ? null : ze,
            !c && me.length > 0 ? /* @__PURE__ */ n(
              ke,
              {
                id: "attachments",
                openKey: ce,
                label: "添加素材",
                icon: /* @__PURE__ */ n(ln, { size: 17 }),
                iconOnly: !0,
                variant: "attachments",
                disabled: o || t,
                onToggle: W,
                children: /* @__PURE__ */ n("div", { className: "ws-prompt-menu-list is-attachments", role: "menu", children: me.map((f) => /* @__PURE__ */ S(
                  "button",
                  {
                    type: "button",
                    className: "ws-prompt-menu-item",
                    role: "menuitem",
                    onClick: () => Ce(f),
                    children: [
                      /* @__PURE__ */ n("span", { className: "ws-prompt-menu-kind-icon", children: /* @__PURE__ */ n(zn, { kind: lo(f) }) }),
                      /* @__PURE__ */ n("span", { children: It(f) })
                    ]
                  },
                  f.key
                )) })
              }
            ) : null,
            Ue.map((f) => {
              if ("group" in f)
                return /* @__PURE__ */ n(
                  oo,
                  {
                    group: f.group,
                    params: f.params,
                    values: m,
                    bindings: b,
                    bindingSources: h,
                    mediaCounts: Ge,
                    mediaPower: d,
                    openKey: ce,
                    disabled: o || t,
                    onToggle: W,
                    onChange: (V, L) => J?.(V.key, L),
                    onMediaPick: Ce,
                    onBindingRemove: ge
                  },
                  f.key
                );
              const I = f.param, E = b[I.key], Y = Ke(I) ? c ? F.some((V) => V.key === I.key) ? /* @__PURE__ */ n(
                to,
                {
                  param: I,
                  power: d,
                  selected: Te.find(
                    (V) => V.media.usage === I.key
                  ),
                  candidates: Fe,
                  openKey: ce,
                  disabled: o || t,
                  onToggle: W,
                  onPick: (V) => ne(
                    V?.part,
                    I.key,
                    V?.media
                  ),
                  onAdd: () => Ce(I)
                }
              ) : /* @__PURE__ */ n(
                $r,
                {
                  param: I,
                  power: d,
                  selectedCount: Ge.get(I.key) || 0,
                  disabled: o || t,
                  onClick: () => Ce(I)
                }
              ) : null : /* @__PURE__ */ n(
                no,
                {
                  param: I,
                  value: m[I.key],
                  binding: E,
                  bindingSource: E ? h[E.sourceNodeId] : void 0,
                  openKey: ce,
                  disabled: o || t,
                  onToggle: W,
                  onChange: (V) => J?.(I.key, V),
                  onBindingRemove: ge
                }
              );
              return /* @__PURE__ */ S(an, { children: [
                Y,
                Vt(I) ? ze : null
              ] }, I.key);
            })
          ] }),
          /* @__PURE__ */ n("div", { className: "ws-prompt-submit-group", children: /* @__PURE__ */ n(Kt, { label: u || void 0, children: /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "ws-prompt-submit",
              disabled: o || t || g,
              onClick: () => {
                be();
              },
              "aria-label": u || "发送",
              children: t ? /* @__PURE__ */ n(kr, { size: 17, className: "ws-spin" }) : /* @__PURE__ */ n(Nr, { size: 18 })
            }
          ) }) })
        ] })
      ]
    }
  );
}
function eo({
  plan: e,
  openKey: r,
  disabled: t,
  onToggle: o,
  onChange: a
}) {
  if (!e?.active || !e.mode || !e.frameUsages.length && e.imageCount <= 1 && !e.structured)
    return null;
  const d = e.options.filter((i) => i.enabled).find(
    (i) => i.value === e.mode
  ), g = e.mode === "shared_reference" && e.frameUsages.length > 0 && e.imageCount === 1 ? "首帧生成" : d?.label || (e.mode === "per_image" ? "每图一条视频" : "多图共同参考"), u = e.mode === "per_image" ? e.imageCount : 1, y = `${g} · 共${u}条`;
  return e.options.length <= 1 ? /* @__PURE__ */ n("span", { className: "ws-prompt-tool-wrap", children: /* @__PURE__ */ S("span", { className: "ws-prompt-tool is-static", "aria-label": y, children: [
    /* @__PURE__ */ n(er, { size: 15 }),
    /* @__PURE__ */ n("span", { children: y })
  ] }) }) : /* @__PURE__ */ n(
    ke,
    {
      id: "multi-image-mode",
      openKey: r,
      label: y,
      icon: /* @__PURE__ */ n(er, { size: 15 }),
      disabled: t,
      onToggle: o,
      children: /* @__PURE__ */ n("div", { className: "ws-prompt-menu-list", children: e.options.map((i) => {
        const v = i.value === e.mode, M = i.value === "per_image" ? e.imageCount : 1;
        return /* @__PURE__ */ S(
          "button",
          {
            type: "button",
            className: `ws-prompt-menu-item ${v ? "is-active" : ""}`,
            disabled: t || !i.enabled,
            title: i.reason,
            onClick: () => {
              a?.(i.value), o("");
            },
            children: [
              /* @__PURE__ */ n("span", { children: `${i.label} · 共${M}条` }),
              v ? /* @__PURE__ */ n(nt, { size: 14 }) : null
            ]
          },
          i.value
        );
      }) })
    }
  );
}
function to({
  param: e,
  power: r,
  selected: t,
  candidates: o,
  openKey: a,
  disabled: c,
  onToggle: d,
  onPick: g,
  onAdd: u
}) {
  const y = `frame:${e.key}`, i = It(e), [v, M] = A("");
  function m(b) {
    const h = g(b);
    M(h || ""), h || d("");
  }
  return /* @__PURE__ */ n(
    ke,
    {
      id: y,
      openKey: a,
      label: t ? `${i} · ${t.media.index ? `图 ${t.media.index}` : "已选"}` : `选择${i}`,
      icon: /* @__PURE__ */ n(Or, { power: r, size: 15 }),
      filled: !!t,
      variant: "group",
      disabled: c,
      onToggle: (b) => {
        M(""), d(b);
      },
      children: /* @__PURE__ */ S("div", { className: "ws-prompt-menu-list", children: [
        o.length > 0 ? /* @__PURE__ */ n("div", { className: "ws-prompt-menu-list ws-frame-candidates nowheel", children: o.map((b) => {
          const h = t?.part === b.part && (t.media.url ? t.media.url === b.media.url : t.media.index === b.media.index);
          return /* @__PURE__ */ S(
            "button",
            {
              type: "button",
              className: `ws-prompt-menu-item ${h ? "is-active" : ""}`,
              "aria-pressed": h,
              title: b.label,
              onClick: () => m(h ? void 0 : b),
              children: [
                /* @__PURE__ */ n("img", { src: b.media.url, alt: "", loading: "lazy" }),
                /* @__PURE__ */ n("span", { children: b.label }),
                h ? /* @__PURE__ */ n(nt, { size: 15 }) : null
              ]
            },
            `${b.part.ref_type}:${b.part.ref_id}:${b.part.ref_version_id || 0}:${b.part.ref_origin_id || ""}:${b.media.index}`
          );
        }) }) : null,
        t ? /* @__PURE__ */ S("button", { type: "button", className: "ws-prompt-menu-item", onClick: () => m(), children: [
          "清除",
          i
        ] }) : null,
        /* @__PURE__ */ n("button", { type: "button", className: "ws-prompt-menu-item", onClick: u, children: "从素材库添加图片" }),
        v ? /* @__PURE__ */ n("span", { role: "alert", children: v }) : null
      ] })
    }
  );
}
function $r({
  param: e,
  power: r,
  selectedCount: t,
  disabled: o,
  onClick: a
}) {
  const c = t > 0;
  return /* @__PURE__ */ n(Kt, { label: co(e, t), children: /* @__PURE__ */ S(
    "button",
    {
      type: "button",
      className: `ws-prompt-tool is-media-param ${c ? "is-selected" : ""}`,
      disabled: o,
      "aria-pressed": c,
      onClick: a,
      children: [
        /* @__PURE__ */ n(Or, { power: r, size: 15 }),
        /* @__PURE__ */ n("span", { children: It(e) }),
        e.type === "files" && c ? /* @__PURE__ */ n("small", { className: "ws-prompt-media-count", children: t }) : null
      ]
    }
  ) });
}
function ro(e) {
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
function no({
  param: e,
  value: r,
  binding: t,
  bindingSource: o,
  openKey: a,
  disabled: c,
  onToggle: d,
  onChange: g,
  onBindingRemove: u
}) {
  const [y, i] = A(!1), [v, M] = A(
    null
  ), m = At(e.preview_type);
  if (H(() => {
    (c || m === "none") && i(!1);
  }, [c, m]), (e.type === "option" || e.type === "select") && m !== "none") {
    const b = zt(e, r);
    return /* @__PURE__ */ S(Ct, { children: [
      /* @__PURE__ */ n("span", { className: "ws-prompt-tool-wrap", children: /* @__PURE__ */ S(
        "button",
        {
          type: "button",
          className: "ws-prompt-tool",
          disabled: c,
          "aria-label": b,
          onClick: (h) => {
            d(""), M(
              h.currentTarget.closest(
                ".ws-storyboard-workspace-editor-anchor"
              )
            ), i(!0);
          },
          children: [
            /* @__PURE__ */ n(Ut, { name: e.icon, size: 15 }),
            /* @__PURE__ */ n("span", { children: b }),
            /* @__PURE__ */ n(jt, { size: 14 })
          ]
        }
      ) }),
      /* @__PURE__ */ n(
        _r,
        {
          open: y,
          portalContainer: v,
          layerZIndex: v ? 1100 : void 0,
          title: e.name || e.key,
          previewType: m,
          options: e.options || [],
          value: r,
          disabled: c,
          onOpenChange: i,
          onConfirm: (h) => g(rt(e, h))
        }
      )
    ] });
  }
  return /* @__PURE__ */ n(
    ke,
    {
      id: e.key,
      openKey: a,
      label: t ? `${wt(e)} · 已连接` : zt(e, r),
      icon: t ? /* @__PURE__ */ n(Pr, { size: 15 }) : /* @__PURE__ */ n(Ut, { name: e.icon, size: 15 }),
      filled: !!t,
      disabled: c,
      onToggle: d,
      children: t ? /* @__PURE__ */ n(
        St,
        {
          label: wt(e),
          source: o,
          disabled: c,
          onRemove: () => u?.(e.key)
        }
      ) : /* @__PURE__ */ n(
        Vr,
        {
          param: e,
          value: r,
          onChange: g,
          onClose: () => d("")
        }
      )
    }
  );
}
function oo({
  group: e,
  params: r,
  values: t,
  bindings: o,
  bindingSources: a,
  mediaCounts: c,
  mediaPower: d,
  openKey: g,
  disabled: u,
  onToggle: y,
  onChange: i,
  onMediaPick: v,
  onBindingRemove: M
}) {
  const [m, b] = A(null);
  return H(() => {
    u && b(null);
  }, [u]), /* @__PURE__ */ S(Ct, { children: [
    /* @__PURE__ */ n(
      ke,
      {
        id: `param-group:${e.id}`,
        openKey: g,
        label: e.name,
        icon: /* @__PURE__ */ n(Ut, { name: e.icon, size: 15 }),
        variant: "group",
        disabled: u,
        onToggle: y,
        children: /* @__PURE__ */ n("div", { className: "ws-prompt-param-group", children: r.map((h) => {
          const q = o[h.key], K = h.type === "option" && At(h.preview_type) !== "none";
          return /* @__PURE__ */ S("div", { className: "ws-prompt-param-group-field", children: [
            /* @__PURE__ */ S("label", { children: [
              h.name,
              h.required ? /* @__PURE__ */ n("span", { className: "ws-prompt-param-required", children: " *" }) : null
            ] }),
            q ? /* @__PURE__ */ n(
              St,
              {
                label: wt(h),
                source: a[q.sourceNodeId],
                disabled: u,
                onRemove: () => M?.(h.key)
              }
            ) : Ke(h) ? /* @__PURE__ */ n(
              $r,
              {
                param: h,
                power: d,
                selectedCount: c.get(h.key) || 0,
                disabled: u,
                onClick: () => v(h)
              }
            ) : K ? /* @__PURE__ */ S(
              "button",
              {
                type: "button",
                className: "ws-prompt-group-option",
                disabled: u,
                onClick: (j) => {
                  b({
                    param: h,
                    container: j.currentTarget.closest(
                      ".ws-storyboard-workspace-editor-anchor"
                    )
                  }), y("");
                },
                children: [
                  /* @__PURE__ */ n("span", { children: zt(h, t[h.key]) }),
                  /* @__PURE__ */ n(jt, { size: 14 })
                ]
              }
            ) : /* @__PURE__ */ n(
              Vr,
              {
                param: h,
                value: t[h.key],
                inline: !0,
                onChange: (j) => i(h, j),
                onClose: () => {
                }
              }
            )
          ] }, h.key);
        }) })
      }
    ),
    m ? /* @__PURE__ */ n(
      _r,
      {
        open: !0,
        portalContainer: m.container,
        layerZIndex: m.container ? 1100 : void 0,
        title: m.param.name,
        previewType: At(
          m.param.preview_type
        ),
        options: m.param.options || [],
        value: t[m.param.key],
        disabled: u,
        onOpenChange: (h) => {
          h || b(null);
        },
        onConfirm: (h) => i(
          m.param,
          rt(m.param, h)
        )
      }
    ) : null
  ] });
}
function St({
  label: e,
  source: r,
  compact: t = !1,
  disabled: o,
  onRemove: a
}) {
  const c = String(r?.title || "上游节点").trim(), d = String(r?.text || "").trim();
  return /* @__PURE__ */ S("div", { className: `ws-param-binding-preview ${t ? "is-compact" : ""}`, children: [
    /* @__PURE__ */ S("div", { className: "ws-param-binding-preview-heading", children: [
      /* @__PURE__ */ n(Pr, { size: 15, "aria-hidden": "true" }),
      /* @__PURE__ */ S("span", { children: [
        /* @__PURE__ */ n("strong", { children: e }),
        /* @__PURE__ */ S("small", { title: c, children: [
          "来自 ",
          c
        ] })
      ] }),
      /* @__PURE__ */ n(Kt, { label: "删除连接", children: /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "ws-param-binding-remove",
          disabled: o,
          "aria-label": "删除连接",
          onClick: a,
          children: /* @__PURE__ */ n(mn, { size: 14 })
        }
      ) })
    ] }),
    /* @__PURE__ */ n(
      "p",
      {
        className: d ? "" : "is-empty",
        title: d || void 0,
        children: d || "等待上游生成"
      }
    )
  ] });
}
function ke({
  id: e,
  openKey: r,
  label: t,
  icon: o,
  iconOnly: a = !1,
  variant: c = "default",
  filled: d = !1,
  disabled: g,
  children: u,
  onToggle: y
}) {
  const i = !g && r === e, v = c === "attachments" ? "is-attachments" : c === "group" ? "is-parameter-group" : "", M = se(null), m = se(null), b = G(() => {
    m.current != null && (window.clearTimeout(m.current), m.current = null);
  }, []), h = G(() => {
    b(), m.current = window.setTimeout(() => {
      m.current = null, y("");
    }, 240);
  }, [b, y]);
  return H(() => (i || b(), b), [b, i]), H(() => {
    if (!i || c !== "group") return;
    const q = (j) => {
      j.target instanceof Node && !M.current?.contains(j.target) && y("");
    }, K = (j) => {
      j.key === "Escape" && y("");
    };
    return document.addEventListener("pointerdown", q), document.addEventListener("keydown", K), () => {
      document.removeEventListener("pointerdown", q), document.removeEventListener("keydown", K);
    };
  }, [y, i, c]), /* @__PURE__ */ S(
    "span",
    {
      ref: M,
      className: `ws-prompt-tool-wrap ${v} ${i ? "is-open" : ""}`,
      onMouseEnter: () => {
        b(), !g && c !== "group" && y(e);
      },
      onMouseLeave: () => {
        i && c !== "group" && h();
      },
      children: [
        /* @__PURE__ */ S(
          "button",
          {
            type: "button",
            className: `ws-prompt-tool ${a ? "is-icon-only" : ""} ${i ? "is-open" : ""} ${d ? "is-filled" : ""}`,
            disabled: g,
            "aria-label": t,
            "aria-expanded": i,
            "aria-haspopup": c === "attachments" ? "menu" : void 0,
            onClick: () => {
              g || (b(), y(i ? "" : e));
            },
            children: [
              o,
              a ? null : /* @__PURE__ */ n("span", { children: t }),
              a ? null : /* @__PURE__ */ n(jt, { size: 14 })
            ]
          }
        ),
        i ? /* @__PURE__ */ n(
          "div",
          {
            className: `ws-prompt-popover ${v}`,
            onMouseEnter: b,
            children: u
          }
        ) : null
      ]
    }
  );
}
function so({
  param: e,
  value: r,
  onChange: t
}) {
  const o = Ar(r), a = e.options || [], c = !!e.max_items && o.length >= e.max_items, d = (u) => {
    const y = Wt(a, u);
    return y?.name || y?.value || u;
  }, g = (u, y) => {
    const i = [...o];
    [i[u], i[u + y]] = [i[u + y], i[u]], t(i);
  };
  return /* @__PURE__ */ S("div", { className: "ws-prompt-multi-select", onPointerDown: (u) => u.stopPropagation(), children: [
    /* @__PURE__ */ n(
      Rn,
      {
        multiple: !0,
        clearable: !1,
        value: o,
        options: a.filter((u) => !c || Er(u, o, a)).map((u) => ({ id: yt(u), value: u.name || u.value })),
        placeholder: "选择选项，可多选",
        className: "border-0 bg-muted/30 shadow-none",
        onChange: (u) => t(rt(e, u))
      }
    ),
    o.length > 0 ? /* @__PURE__ */ n("div", { className: "ws-prompt-selected-list", children: o.map((u, y) => /* @__PURE__ */ S("div", { className: "ws-prompt-selected-item", children: [
      /* @__PURE__ */ n("span", { className: "ws-prompt-selected-order", children: y + 1 }),
      /* @__PURE__ */ n("span", { className: "ws-prompt-selected-name", children: d(u) }),
      /* @__PURE__ */ n("button", { type: "button", "aria-label": `前移${d(u)}`, disabled: y === 0, onClick: () => g(y, -1), children: /* @__PURE__ */ n(Nr, { size: 12 }) }),
      /* @__PURE__ */ n("button", { type: "button", "aria-label": `后移${d(u)}`, disabled: y === o.length - 1, onClick: () => g(y, 1), children: /* @__PURE__ */ n(un, { size: 12 }) }),
      /* @__PURE__ */ n("button", { type: "button", "aria-label": `移除${d(u)}`, onClick: () => t(o.filter((i) => i !== u)), children: /* @__PURE__ */ n(dn, { size: 12 }) })
    ] }, u)) }) : null,
    /* @__PURE__ */ S("small", { className: "ws-prompt-selection-count", children: [
      "已选 ",
      o.length,
      e.max_items ? ` / ${e.max_items}` : "",
      " 项",
      c ? " · 可先移除再添加" : ""
    ] })
  ] });
}
function Vr({
  param: e,
  value: r,
  onChange: t,
  onClose: o,
  inline: a = !1
}) {
  if (e.type === "option" || e.type === "select") {
    const c = e.options || [];
    if (a) {
      const d = Wt(c, r);
      return /* @__PURE__ */ S(
        "select",
        {
          className: "ws-prompt-param-input",
          "aria-label": e.name,
          value: d ? yt(d) : "",
          onChange: (g) => t(rt(e, g.target.value)),
          children: [
            d ? null : /* @__PURE__ */ S("option", { value: "", children: [
              "请选择",
              e.name
            ] }),
            c.map((g) => /* @__PURE__ */ n("option", { value: yt(g), children: g.name || g.value }, g.id))
          ]
        }
      );
    }
    return /* @__PURE__ */ n("div", { className: "ws-prompt-menu-list", children: c.map((d) => {
      const g = Er(
        d,
        [String(r ?? "")],
        c
      );
      return /* @__PURE__ */ S(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${g ? "is-active" : ""}`,
          onClick: () => {
            t(
              rt(
                e,
                yt(d)
              )
            ), o();
          },
          children: [
            /* @__PURE__ */ n("span", { children: d.name || d.value }),
            g ? /* @__PURE__ */ n(nt, { size: 14 }) : null
          ]
        },
        d.id || d.value
      );
    }) });
  }
  if (e.type === "multi_option")
    return /* @__PURE__ */ n(so, { param: e, value: r, onChange: t });
  if (e.type === "description")
    return /* @__PURE__ */ n("p", { className: "ws-prompt-param-description", children: String(r || e.default_value || "") });
  if (e.type === "switch") {
    const c = Tr(r);
    return /* @__PURE__ */ S(
      "button",
      {
        type: "button",
        className: `ws-prompt-switch ${c ? "is-on" : ""}`,
        onClick: () => t(!c),
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
      value: Ft(r),
      placeholder: e.name,
      onChange: (c) => t(c.target.value)
    }
  ) : /* @__PURE__ */ n(
    "input",
    {
      className: "ws-prompt-param-input",
      "aria-label": e.name,
      type: e.value_type === "number" ? "number" : "text",
      value: Ft(r),
      placeholder: e.name,
      onChange: (c) => t(
        e.value_type === "number" ? Number(c.target.value) : c.target.value
      )
    }
  );
}
function zt(e, r) {
  if (e.type === "switch")
    return `${e.name}: ${Tr(r) ? "开" : "关"}`;
  if (e.type === "multi_option") {
    const o = Ar(r).length;
    return o > 0 ? `${e.name} ${o}` : e.name;
  }
  if (e.type === "option" || e.type === "select")
    return Wt(e.options || [], r)?.name || e.name;
  const t = Ft(r);
  return t ? `${e.name}: ${t}` : e.name;
}
function ao(e, r) {
  const t = String(r.preferredUsage || "").trim();
  if (t) {
    const a = e.find((c) => c.key === t);
    if (a)
      return a;
  }
  const o = new Set(r.acceptedKinds || []);
  if (o.size > 0) {
    const a = e.find(
      (c) => qt(c).some((d) => o.has(d))
    );
    if (a)
      return a;
  }
  return e.length === 1 ? e[0] : void 0;
}
function mr(e, r) {
  return JSON.stringify([String(e || ""), r?.parts || []]);
}
function io(e) {
  const r = /* @__PURE__ */ new Map();
  for (const t of e?.parts || []) {
    if (t.type !== "reference" || t.ref_media_excluded)
      continue;
    if (t.ref_media_items?.some((a) => a.usage)) {
      for (const a of t.ref_media_items) {
        const c = a.usage || t.usage;
        c && r.set(c, (r.get(c) || 0) + 1);
      }
      continue;
    }
    if (!t.usage) continue;
    const o = Pn(
      t,
      Number(t.ref_media_count || 0)
    );
    r.set(t.usage, (r.get(t.usage) || 0) + o);
  }
  return r;
}
function co(e, r) {
  const t = It(e);
  if (e.type !== "files")
    return r > 0 ? `${t}：已选择素材` : `选择${t}素材`;
  const o = Math.max(0, Number(e.max_files || 0));
  return r <= 0 ? o > 0 ? `选择${t}素材，最多 ${o} 个` : `选择${t}素材` : o > 0 ? `${t}：已选择 ${r} 个，最多 ${o} 个` : `${t}：已选择 ${r} 个`;
}
function It(e) {
  return String(e.name || e.key || "").trim() || "文件";
}
function lo(e) {
  const r = qt(e);
  return r.length === 1 ? r[0] : "file";
}
function Ft(e) {
  return e == null ? "" : Array.isArray(e) ? e.join("、") : String(e);
}
function Ar(e) {
  if (Array.isArray(e))
    return e.map((r) => String(r)).filter(Boolean);
  if (typeof e == "string") {
    const r = uo(e);
    return Array.isArray(r) ? r.map((t) => String(t)).filter(Boolean) : e ? [e] : [];
  }
  return e ? [String(e)] : [];
}
function uo(e) {
  if (!e)
    return e;
  try {
    return JSON.parse(e);
  } catch {
    return e;
  }
}
function Ur({
  id: e,
  label: r,
  ariaLabel: t,
  icon: o,
  value: a,
  options: c,
  disabled: d = !1,
  openKey: g,
  onToggle: u,
  onChange: y
}) {
  return c.length === 0 ? null : /* @__PURE__ */ n(
    ke,
    {
      id: e,
      openKey: g,
      label: r,
      icon: o,
      disabled: d,
      onToggle: u,
      children: /* @__PURE__ */ n("div", { className: "ws-prompt-menu-list", role: "menu", "aria-label": t, children: c.map((i) => /* @__PURE__ */ S(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${i.key === a ? "is-active" : ""}`,
          disabled: d,
          role: "menuitemradio",
          "aria-checked": i.key === a,
          onClick: () => {
            y(i.key), u("");
          },
          children: [
            /* @__PURE__ */ n("span", { children: i.label }),
            i.key === a ? /* @__PURE__ */ n(nt, { size: 14 }) : null
          ]
        },
        i.key
      )) })
    }
  );
}
function mo({
  value: e,
  options: r,
  disabled: t = !1,
  openKey: o,
  onToggle: a,
  onChange: c
}) {
  const d = r.find((g) => g.key === e);
  return r.length === 0 ? null : /* @__PURE__ */ n(
    Ur,
    {
      id: "storyboard-work-type",
      ariaLabel: "作品类型",
      label: d?.name || e,
      icon: /* @__PURE__ */ n(pn, { size: 15 }),
      value: e,
      options: r.map((g) => ({
        key: g.key,
        label: g.name
      })),
      disabled: t,
      openKey: o,
      onToggle: a,
      onChange: c
    }
  );
}
function po({
  value: e,
  options: r,
  disabled: t = !1,
  openKey: o,
  onToggle: a,
  onChange: c
}) {
  const d = r.find((g) => g.seconds === e);
  return /* @__PURE__ */ n(
    Ur,
    {
      id: "storyboard-min-shot-duration",
      ariaLabel: "单镜最短时长",
      label: `单镜最短 ${d?.name || `${e}秒`}`,
      icon: /* @__PURE__ */ n(fn, { size: 15 }),
      value: e,
      options: r.map((g) => ({
        key: g.seconds,
        label: g.name
      })),
      disabled: t,
      openKey: o,
      onToggle: a,
      onChange: c
    }
  );
}
const pe = 1e3, Mt = 60, fo = [
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
function ht(e) {
  const r = Math.max(
    0,
    Math.floor(Number(e || 0) / pe)
  );
  return {
    minutes: Math.floor(r / Mt),
    seconds: r % Mt
  };
}
function go(e, r) {
  const t = e.find(
    (g) => String(g.purpose || "") === "soundtrack"
  ), o = gt(t?.asset_id), a = gt(t?.version_id), c = r.filter(
    (g) => gt(g.refId) === o
  ), d = c.find(
    (g) => !a || gt(g.versionID) === a
  ) || c[0];
  return {
    durationMs: pr(d?.output) || pr(d?.asset),
    audioUrl: String(d?.preview?.audioUrl || "").trim()
  };
}
function pr(e) {
  return Lt(e, 0, /* @__PURE__ */ new Set());
}
function fr(e, r, t) {
  const o = Tt(t);
  if (o < pe)
    return;
  const a = Math.min(
    Tt(e),
    o - pe
  ), c = Math.min(
    o,
    Math.max(
      a + pe,
      r == null ? o : Tt(r)
    )
  );
  return {
    startMs: a,
    endMs: c,
    soundtrackDurationMs: o
  };
}
function yo(e) {
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
function gr({
  minutes: e,
  seconds: r
}) {
  return (Math.max(0, Math.floor(e)) * Mt + Math.min(Mt - 1, Math.max(0, Math.floor(r)))) * pe;
}
function yr(e) {
  const { minutes: r, seconds: t } = ht(e);
  return `${String(r).padStart(2, "0")}:${String(t).padStart(2, "0")}`;
}
function Lt(e, r, t) {
  if (e == null || r > 6)
    return 0;
  if (Array.isArray(e)) {
    for (const c of e) {
      const d = Lt(c, r + 1, t);
      if (d > 0)
        return d;
    }
    return 0;
  }
  if (typeof e != "object" || t.has(e))
    return 0;
  t.add(e);
  const o = e;
  for (const c of ["duration_ms", "durationMs"]) {
    const d = br(o[c], 1);
    if (d > 0)
      return d;
  }
  const a = br(o.duration, pe);
  if (a > 0)
    return a;
  for (const c of fo) {
    const d = Lt(
      o[c],
      r + 1,
      t
    );
    if (d > 0)
      return d;
  }
  return 0;
}
function br(e, r) {
  const t = Number(e);
  return Number.isFinite(t) && t > 0 ? Math.round(t * r) : 0;
}
function Tt(e) {
  const r = Number(e);
  return Number.isFinite(r) && r > 0 ? Math.floor(r / pe) * pe : 0;
}
function gt(e) {
  const r = Number(e);
  return Number.isInteger(r) && r > 0 ? r : 0;
}
const Et = 1e3;
function bo({
  startMs: e,
  endMs: r,
  soundtrackDurationMs: t,
  soundtrackUrl: o,
  disabled: a = !1,
  openKey: c,
  onToggle: d,
  onChange: g
}) {
  const u = ho(
    t,
    o
  ), y = R(
    () => fr(
      e,
      r,
      u.durationMs
    ),
    [r, u.durationMs, e]
  ), i = y, v = i ? yo(i) : void 0, M = !!(y && y.startMs === 0 && y.endMs === y.soundtrackDurationMs), m = y ? M ? "全曲" : `${yr(y.startMs)}–${yr(y.endMs)}` : "制作范围";
  function b(h, q) {
    const K = fr(
      h,
      q,
      u.durationMs
    );
    K && g(K.startMs, K.endMs);
  }
  return /* @__PURE__ */ n(
    ke,
    {
      id: "storyboard-time-range",
      openKey: c,
      label: m,
      icon: /* @__PURE__ */ n(gn, { size: 15 }),
      filled: !!(y && !M),
      disabled: a,
      onToggle: d,
      children: /* @__PURE__ */ n("div", { className: "ws-storyboard-range-form", children: i && v ? /* @__PURE__ */ S(Ct, { children: [
        /* @__PURE__ */ n(
          hr,
          {
            label: "开始位置",
            ariaLabelPrefix: "开始位置",
            valueMs: i.startMs,
            minMs: v.start.minMs,
            maxMs: v.start.maxMs,
            disabled: a,
            onChange: (h) => b(h, i.endMs)
          }
        ),
        /* @__PURE__ */ n(
          hr,
          {
            label: "结束位置",
            ariaLabelPrefix: "结束位置",
            valueMs: i.endMs,
            minMs: v.end.minMs,
            maxMs: v.end.maxMs,
            disabled: a,
            onChange: (h) => b(i.startMs, h)
          }
        )
      ] }) : /* @__PURE__ */ n("p", { className: "ws-storyboard-range-status", children: u.loading ? "正在读取音轨时长..." : "无法读取音轨时长" }) })
    }
  );
}
function hr({
  label: e,
  ariaLabelPrefix: r,
  valueMs: t,
  minMs: o,
  maxMs: a,
  disabled: c,
  onChange: d
}) {
  const g = ht(t), u = ht(o), y = ht(a), i = wr(u.minutes, y.minutes), v = vr(g.minutes, u, y), M = wr(v.minimum, v.maximum);
  return /* @__PURE__ */ S("div", { className: "ws-storyboard-range-field", children: [
    /* @__PURE__ */ n("span", { children: e }),
    /* @__PURE__ */ S("div", { className: "ws-storyboard-range-time", children: [
      /* @__PURE__ */ n(
        "select",
        {
          value: g.minutes,
          disabled: c,
          "aria-label": `${r}分钟`,
          onChange: (m) => {
            const b = Number(m.target.value), h = vr(
              b,
              u,
              y
            );
            d(
              gr({
                minutes: b,
                seconds: vo(
                  g.seconds,
                  h.minimum,
                  h.maximum
                )
              })
            );
          },
          children: i.map((m) => /* @__PURE__ */ S("option", { value: m, children: [
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
          "aria-label": `${r}秒数`,
          onChange: (m) => d(
            gr({
              ...g,
              seconds: Number(m.target.value)
            })
          ),
          children: M.map((m) => /* @__PURE__ */ S("option", { value: m, children: [
            String(m).padStart(2, "0"),
            "秒"
          ] }, m))
        }
      )
    ] })
  ] });
}
function ho(e, r) {
  const t = Sr(e), o = String(r || "").trim(), [a, c] = A({
    audioUrl: "",
    durationMs: 0,
    failed: !1
  });
  H(() => {
    if (t || !o)
      return;
    const u = document.createElement("audio");
    let y = !0;
    const i = (m) => {
      if (!y)
        return;
      const b = Sr(m);
      c({ audioUrl: o, durationMs: b, failed: !b });
    }, v = () => i(u.duration * 1e3), M = () => i(0);
    return u.preload = "metadata", u.addEventListener("loadedmetadata", v), u.addEventListener("error", M), u.src = o, u.load(), () => {
      y = !1, u.removeEventListener("loadedmetadata", v), u.removeEventListener("error", M), u.removeAttribute("src"), u.load();
    };
  }, [o, t]);
  const d = a.audioUrl === o ? a : void 0, g = t || d?.durationMs || 0;
  return {
    durationMs: g,
    loading: !g && !!o && !d?.failed
  };
}
function vr(e, r, t) {
  return {
    minimum: e === r.minutes ? r.seconds : 0,
    maximum: e === t.minutes ? t.seconds : 59
  };
}
function wr(e, r) {
  return Array.from(
    { length: Math.max(0, r - e + 1) },
    (t, o) => e + o
  );
}
function vo(e, r, t) {
  return Math.min(t, Math.max(r, e));
}
function Sr(e) {
  const r = Number(e);
  return Number.isFinite(r) && r >= Et ? Math.floor(r / Et) * Et : 0;
}
function Bt(e, r) {
  return (r ? r.parts.map((t) => t.type === "text" ? t.text : "").join("") : e).trim();
}
function zr(e) {
  const r = e.generatedPrompt || "";
  return Bt(r, bn(
    r,
    vt(e.generatedInputs?.referenceContent)
  ));
}
function wo(e, r, t, o) {
  if (!Rr(e)) return;
  const a = Bt(t, o);
  return a === Bt(r.prompt || "", r.promptContent) ? r.storyboardPromptOverride : a && a !== zr(e) ? t.trim() : void 0;
}
function So(e, r, t) {
  if (!r?.trim())
    return e;
  const o = Rt(e.prompt, r), a = e.promptContent, c = Ot(a), d = a?.parts.filter((M) => M.type === "text").map((M) => M.text).join(""), g = [c, d].some(
    (M) => !!M?.trim() && !Rt(M, r)
  ), u = g ? xt(
    o,
    vt(a)
  ) : a, y = g && !u?.parts.length ? void 0 : u;
  let i = e.paramValues;
  const v = t ? i?.[t] : void 0;
  if (t && typeof v == "string") {
    const M = Rt(v, r);
    M !== v && (i = { ...i, [t]: M });
  }
  return o === e.prompt && y === a && i === e.paramValues ? e : { ...e, prompt: o, promptContent: y, paramValues: i };
}
function Mr(e, r, t) {
  if (Rr(r)) {
    const v = wn(e, r) || zr(r), M = vt(e.promptContent), m = M.length ? xt(v, M) : void 0, b = m ? Ot(m) : v;
    return {
      ...e,
      prompt: b,
      promptContent: m,
      paramValues: t ? { ...e.paramValues, [t]: b } : e.paramValues
    };
  }
  const o = r?.generatedPrompt, a = So(
    e,
    o,
    t
  ), c = String(o || "");
  if (!c.trim())
    return a;
  const d = Ot(
    a.promptContent
  ), g = a.promptContent?.parts.filter((v) => v.type === "text").map((v) => v.text).join(""), u = a.prompt?.trim() ? a.prompt : g?.trim() ? d : c;
  let y = a.paramValues;
  t && y?.[t] !== u && (y = { ...y || {}, [t]: u });
  const i = a.promptContent ? xt(
    u,
    vt(a.promptContent)
  ) : a.promptContent;
  return u === a.prompt && i === a.promptContent && y === a.paramValues ? a : { ...a, prompt: u, promptContent: i, paramValues: y };
}
const Cr = { zIndex: 999 }, ve = { save: "immediate" }, Mo = [], Co = {
  id: 0,
  name: "上传",
  key: "files",
  type: "files",
  usage: 2,
  max_files: 6
}, Io = [Co];
function tt(e) {
  return jn(e?.source_rule);
}
function ko(e) {
  return e && ["option", "select", "multi_option", "switch"].includes(e.type) ? ve : void 0;
}
function No(e, r, t, o) {
  const a = e.storyboardItem, c = new Set(a?.dependencyNodeIds || []);
  if (a?.itemType !== "shot" && a?.itemType !== "shot_image" || !a.continuityAnchor || c.size !== 1)
    return { content: r, items: t };
  const d = t.filter(
    (i) => i.source === "current" && c.has(String(i.id || ""))
  ), g = new Set(
    d.map((i) => Number(i.refId || 0)).filter((i) => i > 0)
  );
  if (g.size === 0)
    return { content: r, items: t };
  const u = t.map(
    (i) => d.includes(i) ? { ...i, kind: "image" } : i
  );
  if (a.itemType === "shot_image")
    return { content: r, items: u };
  const y = $n(o);
  return {
    content: r && {
      ...r,
      parts: r.parts.map(
        (i) => i.type === "reference" && i.ref_type === "asset" && g.has(Number(i.ref_id || 0)) ? { ...i, usage: y } : i
      )
    },
    items: u
  };
}
function Ir(e, r, t, o) {
  if (!o || !r || xr(r, e.selectedTargetId || 0))
    return {
      content: e.promptContent,
      references: e.storyboardReferences || []
    };
  const a = e.storyboardWorkType || "short";
  return bt(
    e.promptContent,
    e.storyboardReferences,
    t,
    e.prompt || "",
    a,
    r.storyboard_reference_purposes
  );
}
function Wo({ node: e, onReplaceImage: r }) {
  const [t, o] = A(""), {
    projectId: a,
    canvasId: c,
    runningNode: d,
    onNodeDraftChange: g,
    onAssetCreated: u,
    onClearFeedbackRecords: y,
    onRunBackendNode: i,
    onTextParamConnectionRemove: v,
    requestConfirm: M
  } = e, [m, b] = A(null), h = e.composerDraft, q = e.storyboardItem, K = se(q);
  H(() => {
    K.current = q;
  }, [q]);
  const j = m?.params.find(Dt)?.key, _ = R(
    () => tr(
      Mr(
        rr(h),
        q,
        j
      )
    ),
    [j, q, h]
  ), Z = R(
    () => nr(_),
    [_]
  ), D = se(_), we = se(""), [Ve, ie] = A(_.prompt || ""), [P, ee] = A(_.promptContent), [Q, fe] = A(_.storyboardReferences || []), [J, ge] = A(_.storyboardWorkType || "short"), [Se, Ne] = A(_.storyboardLyricsSourceNodeId || ""), [Pe, de] = A(
    () => et(_.minShotDuration)
  ), [ot, me] = A(
    _.storyboardRangeStartMs || 0
  ), [Ye, Re] = A(_.storyboardRangeEndMs), [kt, st] = A(!1), [te, ce] = A(!1), [W, De] = A(
    _.selectedTargetId || 0
  ), [z, Me] = A(
    _.paramValues || {}
  ), [Ce, _e] = A(_.multiImageMode), Ae = se(m), Ue = e.inputContext, at = e.runBlockedReason;
  H(() => {
    const s = we.current;
    s && s !== Z || (we.current = "", D.current = _);
  }, [_, Z]), H(() => {
    Ae.current = m;
  }, [m]);
  const X = kt || sn(d) || e.type === "power" && cr(e.power, e.kind, e.outputType).viewMode === "writing" && hn(e, e.resultOutput)?.document.status === "running", F = e.type, Nt = e.id, ze = e.flow?.id || 0, re = e.type === "power" && e.power?.id || 0, $ = e.type === "power" && e.power?.key || "", it = e.type === "agent" ? Number(e.role?.agent_id || 0) : 0, Te = e.space, Fe = e.canvasReferenceItems, x = e.connectedMediaReferences, Ee = e.onConnectedMediaUsagesChange, Ge = e.onConnectedMediaEdgeRemove, Le = e.catalogCache, xe = Number(
    Te?.release?.id || Te?.project.release_id || 0
  ), ye = Number(e.assetCateId || 0), N = R(
    () => Sn(
      Ue,
      Fe.filter((s) => s.id !== e.id)
    ),
    [Fe, Ue, e.id]
  ), Oe = R(
    () => go(
      Q,
      N.current
    ),
    [N, Q]
  ), Be = se(N);
  H(() => {
    Be.current = N;
  }, [N]);
  const He = R(() => {
    const s = /* @__PURE__ */ new Map();
    for (const l of Ue?.sources || [])
      s.set(l.nodeId, {
        title: l.title || "上游节点",
        text: l.preview.text || (typeof l.output == "string" ? l.output : "")
      });
    const p = new Set(
      Object.values(_.paramBindings || {}).map(
        (l) => l.sourceNodeId
      )
    );
    Se && p.add(Se);
    for (const l of p) {
      if (s.has(l))
        continue;
      const w = Fe.find(
        (k) => k.id === l
      );
      s.set(l, {
        title: w?.title || "上游节点",
        text: w?.preview.text || ""
      });
    }
    return Object.fromEntries(s);
  }, [
    Fe,
    Ue,
    _.paramBindings,
    Se
  ]), O = e.type === "power" && cr(e.power, e.kind, e.outputType)?.viewMode === "storyboard";
  H(() => {
    if (F === "power" && (re || $)) {
      const s = D.current.selectedTargetId || 0;
      let p = !1;
      return ce(!0), Le.loadPowerForm(
        {
          projectId: a,
          releaseId: xe,
          flowId: ze,
          powerId: re,
          powerKey: $,
          targetId: s
        },
        () => or({
          projectId: a,
          flowId: ze,
          powerId: re,
          powerKey: $,
          targetId: s
        })
      ).then((l) => {
        if (p)
          return;
        const w = Mr(
          D.current,
          K.current,
          l.params.find(Dt)?.key
        ), k = Ir(
          w,
          l,
          Be.current.current,
          O
        );
        b(l), De(
          tt(l) && (l.selected_target_id || s) || 0
        ), Me(
          ar(l, w)
        ), ie(w.prompt || ""), ee(k.content), fe(k.references), ge(w.storyboardWorkType || "short"), Ne(
          w.storyboardLyricsSourceNodeId || ""
        ), de(
          et(w.minShotDuration)
        ), me(w.storyboardRangeStartMs || 0), Re(w.storyboardRangeEndMs), _e(w.multiImageMode);
      }).catch((l) => {
        p || o(
          l instanceof Error ? l.message : "加载能力参数失败"
        );
      }).finally(() => {
        p || ce(!1);
      }), () => {
        p = !0;
      };
    }
    if (b(null), F === "agent") {
      const s = D.current;
      Me(s.paramValues || {}), ie(s.prompt || ""), ee(s.promptContent), fe(s.storyboardReferences || []), ge(s.storyboardWorkType || "short"), Ne(""), de(lr), me(0), Re(void 0), _e(void 0), De(0);
      return;
    }
    Me({}), De(0), ie(""), ee(void 0), fe([]), ge("short"), Ne(""), de(lr), me(0), Re(void 0), _e(void 0);
  }, [
    Le,
    O,
    a,
    xe,
    ze,
    it,
    Nt,
    F,
    re,
    $
  ]);
  const C = m?.params || Mo, le = xr(
    m,
    W
  ), ne = R(
    () => le ? z : ft(
      C,
      z,
      x.map((s) => s.source)
    ),
    [x, z, C, le]
  ), be = R(
    () => ir({
      node: e,
      content: P,
      items: N.current,
      connections: x,
      params: C,
      values: ne,
      requestedMode: Ce
    }),
    [
      N,
      x,
      ne,
      e,
      C,
      P,
      Ce
    ]
  ), f = be.active ? be.mode : void 0, E = !!we.current && we.current !== Z ? D.current.multiImageMode || Ce || f : _.multiImageMode || f, Y = R(
    () => Qe(C, ne),
    [ne, C]
  ), V = R(
    () => Xe(Y),
    [Y]
  ), L = R(
    () => F === "power" ? Dn(
      V,
      f
    ) : [],
    [V, f, F]
  ), Yt = R(() => {
    const s = new Set(
      V.map((l) => l.key)
    ), p = new Set(
      L.map((l) => l.key)
    );
    return Y.filter(
      (l) => _n(l, C) && (!Ke(l) || !s.has(l.key) || p.has(l.key))
    );
  }, [
    V,
    Y,
    L,
    C
  ]), Pt = R(
    () => No(
      e,
      P,
      N.current,
      L
    ),
    [N, L, e, P]
  ), Fr = R(
    () => O ? qn(
      J,
      m?.storyboard_reference_purposes || []
    ) : [],
    [O, m, J]
  ), Gt = F === "power" && ["image", "video"].includes(Tn(e) || ""), Lr = R(
    () => F === "power" && !te ? En(
      x,
      Pt.content,
      Pt.items,
      L,
      {},
      Gt,
      f
    ) : "",
    [
      x,
      L,
      Pt,
      te,
      Gt,
      F,
      f
    ]
  ), Br = R(
    () => O && !te ? m ? Wn(
      Q,
      J,
      m.storyboard_work_types,
      m.storyboard_reference_purposes
    ) : "分镜作品类型与参考用途配置加载失败，请重新打开节点后重试" : "",
    [
      O,
      m,
      te,
      Q,
      J
    ]
  ), Je = e.storyboardItem?.itemType === "shot" ? e.storyboardItem.requiredDurationValues : void 0, ct = R(
    () => Kn(
      m?.sources || [],
      Je
    ),
    [m?.sources, Je]
  ), jr = R(() => {
    if (!Je?.length || te || !m)
      return "";
    const s = Yn(
      Je
    );
    return ct.length === 0 ? s : tt(m) && W > 0 && !ct.some(
      (p) => p.target_id === W || p.id === W
    ) ? `当前所选模型不满足时长要求；${s}` : "";
  }, [
    ct,
    m,
    te,
    Je,
    W
  ]), lt = at || (le ? "原来源已不可用，请重新选择来源" : "") || be.error || Lr || Br || jr, ue = R(
    () => Y.find(Dt) || null,
    [Y]
  ), qr = R(
    () => Yt.filter(
      (s) => s.key !== ue?.key && (Ke(s) || Dr(s) || $t(s, C))
    ),
    [Yt, C, ue?.key]
  ), oe = ue ? String(ne[ue.key] ?? "") : Ve, Wr = String(
    m?.power?.description || e.power?.description || ""
  ).trim() || (ue ? "在此处为该能力输入生成提示词..." : "当前能力无需填写提示词"), ut = tt(m), ae = m ? ut ? W : 0 : _.selectedTargetId || 0;
  H(() => {
    if (F !== "power" && F !== "agent")
      return;
    const s = D.current, p = Ae.current, l = Ir(
      s,
      p,
      Be.current.current,
      O
    );
    ie(s.prompt || ""), ee(l.content), fe(l.references), ge(s.storyboardWorkType || "short"), Ne(
      s.storyboardLyricsSourceNodeId || ""
    ), de(
      et(s.minShotDuration)
    ), me(s.storyboardRangeStartMs || 0), Re(s.storyboardRangeEndMs), _e(s.multiImageMode), De(
      F === "power" && (!p || tt(p)) && (s.selectedTargetId || p?.selected_target_id) || 0
    ), Me(
      F === "power" && p ? ar(p, s) : s.paramValues || {}
    );
  }, [O, Z, F]);
  const Ie = G(
    (s, p, l = C) => {
      const w = Object.prototype.hasOwnProperty.call(
        s,
        "promptContent"
      ) ? s.promptContent : P, k = rr({
        ...D.current,
        ...s,
        promptContent: w,
        ...O ? {} : {
          storyboardReferences: [],
          storyboardWorkType: void 0,
          storyboardLyricsSourceNodeId: void 0,
          minShotDuration: void 0,
          storyboardRangeStartMs: void 0,
          storyboardRangeEndMs: void 0
        }
      });
      k.multiImageMode && (k.mediaSelections = xn(
        k.mediaSelections,
        On(
          l,
          k.paramValues || {},
          k.multiImageMode
        ),
        k.promptContent,
        N.current,
        x
      )), D.current = k;
      const T = nr(
        tr(k)
      );
      return we.current = T === Z ? "" : T, _e(k.multiImageMode), g(e.id, k, p), k;
    },
    [
      O,
      Z,
      e.id,
      g,
      P,
      C,
      N,
      x
    ]
  ), dt = G(
    (s, p) => {
      s && M({
        title: "删除文本连接",
        description: p,
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => v(s, e.id)
      });
    },
    [e.id, v, M]
  ), Kr = G(
    (s) => {
      const p = D.current.paramBindings?.[s]?.sourceNodeId || "";
      dt(
        p,
        "删除后，上游文本将不再传入这个参数。"
      );
    },
    [dt]
  ), Yr = G(() => {
    dt(
      String(D.current.storyboardLyricsSourceNodeId || "").trim(),
      "删除后，上游文本将不再作为 MV 歌词传入。"
    );
  }, [dt]), he = G(
    (s, p, l, w) => (Me(s), Ie(
      { ...p, paramValues: s },
      l,
      w
    )),
    [Ie]
  );
  H(() => {
    le || ne === z || he(ne, {
      prompt: oe,
      promptContent: P,
      selectedTargetId: ae,
      multiImageMode: E
    });
  }, [
    ae,
    ne,
    z,
    oe,
    P,
    he,
    E,
    le
  ]);
  function Gr(s, p) {
    const l = We(P) !== We(p), w = l ? qe(
      P,
      p,
      N.current,
      L,
      x,
      f
    ) : { content: p, assignments: {} }, k = w.content;
    Object.keys(w.assignments).length > 0 && Ee?.(w.assignments), ie(s);
    const T = O && l ? bt(
      k,
      Q,
      N.current,
      s,
      J,
      m?.storyboard_reference_purposes || []
    ) : {
      content: k,
      references: Q
    };
    ee(T.content), fe(T.references);
    const U = D.current.paramValues || z, B = ue ? { ...U, [ue.key]: s } : U;
    he(
      B,
      {
        prompt: s,
        storyboardPromptOverride: wo(
          q,
          { prompt: oe, promptContent: P, storyboardPromptOverride: D.current.storyboardPromptOverride },
          s,
          T.content
        ),
        promptContent: T.content,
        selectedTargetId: ae,
        storyboardReferences: T.references,
        storyboardWorkType: O ? J : void 0,
        minShotDuration: O ? Pe : void 0,
        multiImageMode: E
      },
      l ? ve : void 0
    );
  }
  function Hr(s) {
    const p = bt(
      P,
      Q,
      N.current,
      oe,
      s,
      m?.storyboard_reference_purposes || []
    ), l = s === "mv" ? Se : "";
    ge(s), Ne(l), ee(p.content), fe(p.references), Ie(
      {
        prompt: oe,
        promptContent: p.content,
        paramValues: z,
        selectedTargetId: ae,
        storyboardReferences: p.references,
        storyboardWorkType: s,
        storyboardLyricsSourceNodeId: l || void 0,
        minShotDuration: Pe,
        multiImageMode: E
      },
      ve
    );
  }
  function Jr(s) {
    const p = et(s);
    de(p), Ie(
      {
        prompt: oe,
        promptContent: P,
        paramValues: z,
        selectedTargetId: ae,
        storyboardReferences: Q,
        storyboardWorkType: J,
        minShotDuration: p,
        multiImageMode: E
      },
      ve
    );
  }
  function Zr(s, p) {
    me(s), Re(p), Ie(
      {
        prompt: oe,
        promptContent: P,
        paramValues: z,
        selectedTargetId: ae,
        storyboardReferences: Q,
        storyboardWorkType: J,
        storyboardRangeStartMs: s,
        storyboardRangeEndMs: p,
        minShotDuration: Pe,
        multiImageMode: E
      },
      ve
    );
  }
  function Qr(s, p) {
    const l = Vn(C, {
      ...D.current.paramValues || z,
      [s]: p
    }, s), w = C.find((U) => U.key === s), k = ko(w), T = f;
    if (w && Vt(w) && T) {
      const U = _t({
        content: D.current.promptContent || P,
        items: N.current,
        connections: x,
        params: C,
        previousValues: D.current.paramValues || z,
        nextValues: l,
        previousMode: T,
        nextMode: T,
        selections: D.current.mediaSelections
      }), B = qe(
        P,
        U.content,
        N.current,
        Xe(Qe(C, l)),
        x,
        T
      );
      Object.keys(B.assignments).length && Ee?.(B.assignments), o(""), ee(B.content), he(
        l,
        {
          prompt: oe,
          promptContent: B.content,
          selectedTargetId: ae,
          multiImageMode: T,
          mediaSelections: U.selections
        },
        k
      );
      return;
    }
    if (w && $t(w, C)) {
      const U = Xe(
        Qe(C, l)
      ), B = qe(
        P,
        P,
        N.current,
        U,
        x,
        T
      );
      Object.keys(B.assignments).length > 0 && Ee?.(B.assignments), ee(B.content), he(
        l,
        {
          prompt: oe,
          promptContent: B.content,
          selectedTargetId: ae,
          multiImageMode: E
        },
        k
      );
      return;
    }
    he(
      l,
      {
        prompt: oe,
        promptContent: P,
        selectedTargetId: ae,
        multiImageMode: E
      },
      k
    );
  }
  function Xr(s) {
    const p = be.options.find(
      (B) => B.value === s
    );
    if (!be.active || !p?.enabled) {
      o(p?.reason || "当前能力不支持该多图生成方式");
      return;
    }
    const l = D.current.paramValues || z, w = ft(
      C,
      l,
      x.map((B) => B.source)
    ), k = Xe(
      Qe(C, w)
    ), T = _t({
      content: D.current.promptContent || P,
      items: N.current,
      connections: x,
      params: C,
      previousValues: l,
      nextValues: w,
      previousMode: f || E || "per_image",
      nextMode: s,
      selections: D.current.mediaSelections
    }), U = qe(
      P,
      T.content,
      N.current,
      k,
      x,
      s
    );
    o(""), Object.keys(U.assignments).length > 0 && Ee?.(U.assignments), ee(U.content), he(
      w,
      {
        prompt: oe,
        promptContent: U.content,
        selectedTargetId: ae,
        storyboardReferences: Q,
        multiImageMode: s,
        mediaSelections: T.selections
      },
      ve
    );
  }
  function en(s, p) {
    const l = We(P) !== We(p);
    ie(s), ee(p), Ie(
      {
        prompt: s,
        promptContent: p,
        paramValues: D.current.paramValues || z,
        selectedTargetId: 0
      },
      l ? ve : void 0
    );
  }
  function tn(s, p) {
    const l = {
      ...D.current.paramValues || z,
      [s]: p
    };
    he(
      l,
      {
        prompt: Ve,
        selectedTargetId: 0
      },
      ve
    );
  }
  async function Ht(s, p, l) {
    const w = await Gn({
      projectID: a,
      canvasID: c,
      teamID: Number(Te?.project.team_id || 0),
      files: s,
      ruleID: p.upload_rule_id,
      onProgress: l?.onProgress
    });
    for (const k of w) {
      const T = vn(k.asset);
      T.id && u?.(T);
    }
    return w;
  }
  async function rn(s) {
    if (!(X || !ut) && !(e.type !== "power" || !e.power))
      try {
        const p = await Le.loadPowerForm(
          {
            projectId: a,
            releaseId: xe,
            flowId: e.flow?.id || 0,
            powerId: e.power.id,
            powerKey: e.power.key,
            targetId: s
          },
          () => or({
            projectId: a,
            flowId: e.flow?.id || 0,
            powerId: e.power?.id || 0,
            powerKey: e.power?.key || "",
            targetId: s
          })
        ), l = p.params || [], w = D.current, k = w.paramValues || z, T = w.promptContent || P, U = w.multiImageMode || f, B = An(
          l,
          k,
          C
        ), $e = ft(
          l,
          B,
          x.map((pt) => pt.source)
        ), Ze = ir({
          node: e,
          content: T,
          items: N.current,
          connections: x,
          params: l,
          values: $e,
          requestedMode: U
        }), je = Ze.options.find(
          (pt) => pt.enabled && pt.value === Ze.mode
        )?.value || Ze.defaultMode, Zt = U && je ? _t({
          content: T,
          items: N.current,
          connections: x,
          params: l,
          previousParams: C,
          previousValues: k,
          nextValues: $e,
          previousMode: U,
          nextMode: je,
          selections: w.mediaSelections
        }) : { content: T, selections: w.mediaSelections }, on = Xe(
          Qe(l, $e)
        ), mt = qe(
          T,
          Zt.content,
          N.current,
          on,
          x,
          je
        );
        Object.keys(mt.assignments).length > 0 && Ee?.(mt.assignments), b(p);
        const Qt = tt(p) ? p.selected_target_id || s : 0;
        De(Qt), ee(mt.content), he(
          $e,
          {
            prompt: oe,
            promptContent: mt.content,
            selectedTargetId: Qt,
            multiImageMode: je,
            mediaSelections: Zt.selections
          },
          ve,
          l
        ), o("");
      } catch (p) {
        o(
          p instanceof Error ? p.message : "加载能力参数失败"
        );
      }
  }
  const nn = async (s, p) => {
    y([e.id]), st(!0);
    try {
      if (e.type === "power" && e.power) {
        const l = D.current, w = Object.prototype.hasOwnProperty.call(
          l,
          "promptContent"
        ) ? l.promptContent : p, k = l.storyboardWorkType || J, T = et(
          l.minShotDuration ?? Pe
        ), U = O ? bt(
          w,
          l.storyboardReferences || Q,
          N.current,
          s,
          k,
          m?.storyboard_reference_purposes || []
        ) : {
          content: w,
          references: l.storyboardReferences || []
        }, B = f, $e = {
          ...ft(
            C,
            l.paramValues || ne,
            x.map((je) => je.source)
          )
        };
        ue && ($e[ue.key] = s);
        const Ze = Ie({
          ...l,
          prompt: s,
          promptContent: U.content,
          paramValues: $e,
          selectedTargetId: ae,
          storyboardReferences: U.references,
          storyboardWorkType: O ? k : void 0,
          minShotDuration: O ? T : void 0,
          multiImageMode: B
        });
        await i({
          ...e,
          composerDraft: Ze
        });
        return;
      }
      if (e.type === "agent" && e.role) {
        const l = D.current, w = Ie({
          ...l,
          prompt: s,
          promptContent: Object.prototype.hasOwnProperty.call(
            l,
            "promptContent"
          ) ? l.promptContent : p,
          paramValues: l.paramValues || z,
          selectedTargetId: 0
        });
        await i({
          ...e,
          composerDraft: w
        });
        return;
      }
      throw new Error("当前节点缺少可运行配置");
    } catch (l) {
      o(l instanceof Error ? l.message : "执行出错");
    } finally {
      st(!1);
    }
  }, Jt = async (s, p) => {
    if (!X) {
      if (lt) {
        o(lt);
        return;
      }
      await nn(s, p);
    }
  };
  return e.type === "power" ? /* @__PURE__ */ S(
    "div",
    {
      className: "ws-node-bottom-settings is-composer nodrag nowheel",
      onClick: (s) => s.stopPropagation(),
      style: Cr,
      children: [
        /* @__PURE__ */ n(
          Xt,
          {
            message: t,
            onDismiss: () => o("")
          }
        ),
        r && /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "ws-prompt-tool nodrag nopan",
            onClick: r,
            children: "选择或上传替换图片"
          }
        ),
        te && !X && !m ? /* @__PURE__ */ S("div", { className: "ws-prompt-loading", children: [
          /* @__PURE__ */ n(kr, { size: 16, className: "ws-spin" }),
          /* @__PURE__ */ n("span", { children: "正在加载能力参数..." })
        ] }) : /* @__PURE__ */ n(
          dr,
          {
            value: oe,
            referenceContent: P,
            placeholder: Wr,
            running: X,
            textInputEnabled: !!ue,
            showMediaParamButtons: !0,
            mediaParamPower: m?.power || e.power,
            sourceOptions: ut ? ct : [],
            selectedSourceId: ae,
            params: qr,
            primaryParam: ue || void 0,
            paramValues: ne,
            paramBindings: _.paramBindings,
            paramBindingSources: He,
            storyboardLyricsBindingSource: O && J === "mv" && Se ? He[Se] || {
              title: "上游节点"
            } : void 0,
            assetLibrary: N,
            assetReference: {
              teamID: Number(Te?.project.team_id || 0),
              projectID: a,
              assetCateID: ye
            },
            connectedMediaReferences: x,
            mediaUsageOptions: L,
            referenceUsageOptions: O ? Fr : void 0,
            referenceUsageField: O ? "purpose" : "usage",
            multiImagePlan: be,
            multiImageMode: f,
            toolbarContent: O ? ({ openKey: s, onToggle: p }) => /* @__PURE__ */ S(Ct, { children: [
              /* @__PURE__ */ n(
                mo,
                {
                  value: J,
                  options: m?.storyboard_work_types || [],
                  disabled: te || X,
                  openKey: s,
                  onToggle: p,
                  onChange: Hr
                }
              ),
              /* @__PURE__ */ n(
                po,
                {
                  value: Pe,
                  options: m?.storyboard_min_shot_durations || [],
                  disabled: te || X,
                  openKey: s,
                  onToggle: p,
                  onChange: Jr
                }
              ),
              J === "mv" && Q.some(
                (l) => l.purpose === "soundtrack"
              ) ? /* @__PURE__ */ n(
                bo,
                {
                  startMs: ot,
                  endMs: Ye,
                  soundtrackDurationMs: Oe.durationMs,
                  soundtrackUrl: Oe.audioUrl,
                  disabled: te || X,
                  openKey: s,
                  onToggle: p,
                  onChange: Zr
                }
              ) : null
            ] }) : void 0,
            onConnectedMediaEdgeRemove: Ge,
            disabled: te || !m,
            submitDisabled: !!lt,
            submitDisabledReason: lt,
            onChange: Gr,
            onParamChange: Qr,
            onParamBindingConnectionRemove: Kr,
            onStoryboardLyricsConnectionRemove: Yr,
            onMultiImageModeChange: Xr,
            onSourceChange: ut ? (s) => {
              rn(s);
            } : void 0,
            onLocalUpload: Ht,
            onSubmit: Jt
          }
        )
      ]
    }
  ) : /* @__PURE__ */ S(
    "div",
    {
      className: "ws-node-bottom-settings is-composer nodrag nowheel",
      onClick: (s) => s.stopPropagation(),
      style: Cr,
      children: [
        /* @__PURE__ */ n(
          Xt,
          {
            message: t,
            onDismiss: () => o("")
          }
        ),
        /* @__PURE__ */ n(
          dr,
          {
            value: Ve,
            referenceContent: P,
            placeholder: "向智能体发送任务指令...",
            running: X,
            params: Io,
            paramValues: z,
            assetLibrary: N,
            assetReference: {
              teamID: Number(Te?.project.team_id || 0),
              projectID: a,
              assetCateID: ye
            },
            connectedMediaReferences: x,
            onConnectedMediaEdgeRemove: Ge,
            onChange: en,
            onParamChange: tn,
            onLocalUpload: Ht,
            onSubmit: Jt
          }
        )
      ]
    }
  );
}
export {
  Wo as CanvasNodeSettings
};
