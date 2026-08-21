import { a as D, j as o, r as zt, F as Ut, i as jt } from "./preloadable-Bomi5PEU.js";
import { u as v, e as B, a as K, d as Z, b as H, F as Kt } from "./_commonjsHelpers-61wyk6v6.js";
import { C as _e, b as Bt, as as Lt, L as It, ap as Wt, c as Pt, at, n as qt } from "./vendor-icons-B3DKX3la.js";
import { t as oe } from "./index-2TBwAJWu.js";
import { x as Ie, y as ct, z as it, A as Yt, B as Gt, f as lt, D as Jt, E as Ht, F as Qt } from "./space-page-CeQICFO0.js";
import { i as Ne, f as et, g as kt, h as Qe, j as ut, r as Xt, k as Zt, l as Re, p as er, q as tr, P as rr, t as Xe, u as Mt, v as nr, w as Je, x as dt, y as pt, z as je, A as mt, B as Ke, C as Be, D as or, E as sr, b as ar, F as He, G as cr, H as ir, I as lr } from "./space-sequence-card-3BvRvWb9.js";
import { P as ur, d as ft, r as dr } from "./power-icon-HeeWAKmZ.js";
import { C as pr } from "./space-reference-editor-w9KUUA5i.js";
import { b as mr } from "./asset-page-D9DFDknb.js";
import { u as fr, B as St, v as gr, w as yr, x as wr, y as We } from "./upload-asset-api-CJCwVOwh.js";
import { u as hr } from "./node-detail-content-CouIBoj-.js";
function gt(e) {
  return zt(
    e?.service_name,
    e?.name,
    "来源"
  );
}
const vr = 240, br = [], Cr = [];
function yt({
  value: e,
  placeholder: r,
  running: n = !1,
  disabled: i = !1,
  textInputEnabled: u = !0,
  showMediaParamButtons: d = !1,
  mediaParamPower: g,
  submitDisabled: y = !1,
  submitDisabledReason: m = "",
  sourceOptions: l = [],
  selectedSourceId: p = 0,
  params: S = [],
  paramValues: O = {},
  assetLibrary: U = { current: [] },
  referenceContent: w,
  assetReference: T,
  connectedMediaReferences: L = br,
  mediaUsageOptions: W = Cr,
  referenceUsageOptions: q,
  referenceUsageField: se = "usage",
  multiImagePlan: qe,
  multiImageMode: Pe,
  toolbarContent: C,
  onConnectedMediaEdgeRemove: ke,
  onChange: Q,
  onParamChange: Te,
  onSourceChange: Ye,
  onMultiImageModeChange: ue,
  onLocalUpload: _,
  onSubmit: ae
}) {
  const ee = v(
    () => S.filter(Ne),
    [S]
  ), de = B(
    (a) => {
      const R = kr(a);
      U.current = [
        ...U.current.filter(
          (j) => Number(j.refId || 0) !== a.refId
        ),
        R
      ];
    },
    [U]
  ), Ee = B(
    async (a, R) => {
      if (!_)
        throw new Error("当前节点未配置本地上传");
      const j = Rr(ee, R);
      if (!j)
        throw new Error("当前能力没有与所选素材类型匹配的上传参数");
      const be = (await _(a, j, {
        onProgress: R.onProgress
      })).map((Se) => fr(Se.asset)).filter((Se) => Se.id > 0);
      if (be.length === 0)
        throw new Error("上传成功，但没有生成可用资产");
      return be;
    },
    [_, ee]
  ), Oe = hr({
    teamID: Number(T?.teamID || 0),
    scopeProjectID: Number(T?.projectID || 0),
    initialFilters: T?.projectID ? {
      sourceType: "project",
      projectID: T.projectID,
      assetCateID: Number(T.assetCateID || 0)
    } : void 0,
    onSelect: de,
    onUpload: _ ? Ee : void 0
  }), [pe, A] = K(""), [$, Ve] = K(), he = Z(0), me = B((a) => {
    A(""), he.current += 1, Ve({
      id: he.current,
      trigger: "@",
      preferredUsage: a.key,
      acceptedKinds: et(a)
    });
  }, []), ve = B(
    (a) => {
      Ve(
        (R) => R?.id === a ? void 0 : R
      );
    },
    []
  ), Ae = v(
    () => S.filter(
      (a) => Ne(a) || kt(a) || Qe(a, S)
    ),
    [S]
  ), fe = v(
    () => l.find(
      (a) => a.target_id === p || a.id === p
    ),
    [p, l]
  ), $e = Ae.some(
    ut
  ), P = /* @__PURE__ */ o(
    Ir,
    {
      plan: qe,
      openKey: pe,
      disabled: i || n,
      onToggle: A,
      onChange: ue
    }
  ), te = U.current, k = v(() => {
    const a = Xt(
      e,
      w,
      Zt(L, te)
    );
    return {
      ...a,
      content: Re(
        w,
        a.content,
        te,
        W,
        L,
        Pe
      ).content
    };
  }, [
    L,
    W,
    Pe,
    w,
    te,
    e
  ]), ge = v(
    () => W.map((a) => ({
      key: a.key,
      label: a.label,
      acceptedKinds: a.acceptedKinds,
      maxFiles: a.maxFiles
    })),
    [W]
  ), Me = v(
    () => q || ge,
    [q, ge]
  ), Fe = v(
    () => Nr(k.content),
    [k.content]
  ), M = v(
    () => ht(e, w),
    [w, e]
  ), N = v(
    () => ht(
      k.value,
      k.content
    ),
    [k.content, k.value]
  ), I = Z({
    value: k.value,
    content: k.content
  }), V = Z(!1), Y = Z(null), z = Z(Q), Ge = Z(ae);
  z.current = Q, Ge.current = ae;
  const G = B(() => {
    Y.current !== null && (window.clearTimeout(Y.current), Y.current = null);
  }, []), F = B(() => {
    if (G(), !V.current)
      return;
    V.current = !1;
    const a = I.current;
    z.current(a.value, a.content);
  }, [G]), ce = B(
    (a, R, j = !1) => {
      const ye = I.current.content;
      I.current = {
        value: a,
        content: R
      }, V.current = !0;
      const be = Ie(ye) !== Ie(R);
      if (j || be) {
        F();
        return;
      }
      G(), Y.current = window.setTimeout(
        F,
        vr
      );
    },
    [G, F]
  ), J = B(() => {
    const a = I.current;
    return F(), Ge.current(a.value, a.content);
  }, [F]);
  return H(() => {
    V.current || (I.current = {
      value: k.value,
      content: k.content
    });
  }, [
    N,
    k.content,
    k.value
  ]), H(
    () => () => {
      F();
    },
    [F]
  ), H(() => {
    (i || n) && A("");
  }, [i, n]), H(() => {
    M !== N && (V.current || ce(
      k.value,
      k.content,
      !0
    ));
  }, [
    M,
    N,
    k.content,
    k.value,
    ce
  ]), /* @__PURE__ */ D(
    "div",
    {
      className: `ws-prompt-composer nowheel ${n ? "is-running" : ""}`,
      children: [
        /* @__PURE__ */ o("div", { className: "ws-prompt-main", children: /* @__PURE__ */ o("div", { className: "ws-prompt-editor-shell", children: /* @__PURE__ */ o(
          pr,
          {
            className: "ws-prompt-reference-editor nodrag nopan",
            value: k.value,
            content: k.content,
            disabled: i || n,
            textEditable: u,
            placeholder: r,
            items: te,
            usageOptions: Me,
            usageField: se,
            mediaUsageOptions: ge,
            autoAssignUsage: se !== "purpose",
            pickerRequest: $,
            onPickerRequestConsumed: ve,
            assetReferenceProvider: T?.teamID ? Oe : void 0,
            onReferenceDelete: (a) => {
              a.ref_origin === "edge" && a.ref_origin_id && ke?.(a.ref_origin_id);
            },
            onChange: ce,
            onBlur: F,
            onSubmit: !n && !y ? () => {
              J();
            } : void 0
          }
        ) }) }),
        /* @__PURE__ */ D("div", { className: "ws-prompt-toolbar", children: [
          /* @__PURE__ */ D("div", { className: "ws-prompt-tools", children: [
            l.length > 0 ? /* @__PURE__ */ o(
              De,
              {
                id: "source",
                openKey: pe,
                label: gt(fe),
                icon: /* @__PURE__ */ o(Bt, { size: 15 }),
                disabled: i || n,
                onToggle: A,
                children: /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list", children: l.map((a) => {
                  const R = a.target_id || a.id, j = R === p;
                  return /* @__PURE__ */ D(
                    "button",
                    {
                      type: "button",
                      className: `ws-prompt-menu-item ${j ? "is-active" : ""}`,
                      disabled: i || n,
                      onClick: () => {
                        Ye?.(R), A("");
                      },
                      children: [
                        /* @__PURE__ */ o("span", { children: gt(a) }),
                        j ? /* @__PURE__ */ o(_e, { size: 14 }) : null
                      ]
                    },
                    R
                  );
                }) })
              }
            ) : null,
            C?.({ openKey: pe, onToggle: A }),
            $e ? null : P,
            !d && ee.length > 0 ? /* @__PURE__ */ o(
              De,
              {
                id: "attachments",
                openKey: pe,
                label: "添加素材",
                icon: /* @__PURE__ */ o(Lt, { size: 17 }),
                iconOnly: !0,
                variant: "attachments",
                disabled: i || n,
                onToggle: A,
                children: /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list is-attachments", role: "menu", children: ee.map((a) => /* @__PURE__ */ D(
                  "button",
                  {
                    type: "button",
                    className: "ws-prompt-menu-item",
                    role: "menuitem",
                    onClick: () => me(a),
                    children: [
                      /* @__PURE__ */ o("span", { className: "ws-prompt-menu-kind-icon", children: /* @__PURE__ */ o(mr, { kind: Dr(a) }) }),
                      /* @__PURE__ */ o("span", { children: tt(a) })
                    ]
                  },
                  a.key
                )) })
              }
            ) : null,
            Ae.map((a) => {
              const R = Ne(a) ? d ? /* @__PURE__ */ o(
                Pr,
                {
                  param: a,
                  power: g,
                  selectedCount: Fe.get(a.key) || 0,
                  disabled: i || n,
                  onClick: () => me(a)
                }
              ) : null : /* @__PURE__ */ o(
                Mr,
                {
                  param: a,
                  value: O[a.key],
                  openKey: pe,
                  disabled: i || n,
                  onToggle: A,
                  onChange: (j) => Te?.(a.key, j)
                }
              );
              return /* @__PURE__ */ D(Kt, { children: [
                R,
                ut(a) ? P : null
              ] }, a.key);
            })
          ] }),
          /* @__PURE__ */ o("div", { className: "ws-prompt-submit-group", children: /* @__PURE__ */ o(St, { label: m || void 0, children: /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              className: "ws-prompt-submit",
              disabled: i || n || y,
              onClick: () => {
                J();
              },
              "aria-label": m || "发送",
              children: n ? /* @__PURE__ */ o(It, { size: 17, className: "ws-spin" }) : /* @__PURE__ */ o(Wt, { size: 18 })
            }
          ) }) })
        ] })
      ]
    }
  );
}
function Ir({
  plan: e,
  openKey: r,
  disabled: n,
  onToggle: i,
  onChange: u
}) {
  if (!e?.active || !e.mode)
    return null;
  const d = e.options.filter((p) => p.enabled), y = d.find(
    (p) => p.value === e.mode
  )?.label || (e.mode === "per_image" ? "逐图生成" : "合并生成"), m = e.mode === "per_image" ? e.imageCount : 1, l = `${y} · ${m}条`;
  return d.length <= 1 ? /* @__PURE__ */ o("span", { className: "ws-prompt-tool-wrap", children: /* @__PURE__ */ D("span", { className: "ws-prompt-tool is-static", "aria-label": l, children: [
    /* @__PURE__ */ o(at, { size: 15 }),
    /* @__PURE__ */ o("span", { children: l })
  ] }) }) : /* @__PURE__ */ o(
    De,
    {
      id: "multi-image-mode",
      openKey: r,
      label: l,
      icon: /* @__PURE__ */ o(at, { size: 15 }),
      disabled: n,
      onToggle: i,
      children: /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list", children: d.map((p) => {
        const S = p.value === e.mode, O = p.value === "per_image" ? e.imageCount : 1;
        return /* @__PURE__ */ D(
          "button",
          {
            type: "button",
            className: `ws-prompt-menu-item ${S ? "is-active" : ""}`,
            disabled: n,
            onClick: () => {
              u?.(p.value), i("");
            },
            children: [
              /* @__PURE__ */ o("span", { children: `${p.label} · ${O}条` }),
              S ? /* @__PURE__ */ o(_e, { size: 14 }) : null
            ]
          },
          p.value
        );
      }) })
    }
  );
}
function Pr({
  param: e,
  power: r,
  selectedCount: n,
  disabled: i,
  onClick: u
}) {
  const d = n > 0;
  return /* @__PURE__ */ o(St, { label: _r(e, n), children: /* @__PURE__ */ D(
    "button",
    {
      type: "button",
      className: `ws-prompt-tool is-media-param ${d ? "is-selected" : ""}`,
      disabled: i,
      "aria-pressed": d,
      onClick: u,
      children: [
        /* @__PURE__ */ o(ur, { power: r, size: 15 }),
        /* @__PURE__ */ o("span", { children: tt(e) }),
        e.type === "files" && d ? /* @__PURE__ */ o("small", { className: "ws-prompt-media-count", children: n }) : null
      ]
    }
  ) });
}
function kr(e) {
  const r = String(e.preview?.kind || "file"), n = String(e.preview?.url || "");
  return {
    id: `asset:${e.refId}`,
    title: e.label,
    kind: r,
    source: "asset",
    refType: "asset",
    refId: e.refId,
    versionID: e.versionID,
    output: e.output,
    asset: e.asset,
    preview: {
      text: e.description || "",
      imageUrl: r === "image" ? n : "",
      videoUrl: r === "video" ? n : "",
      audioUrl: r === "audio" ? n : "",
      fileUrl: r === "file" ? n : ""
    }
  };
}
function Mr({
  param: e,
  value: r,
  openKey: n,
  disabled: i,
  onToggle: u,
  onChange: d
}) {
  const [g, y] = K(!1), m = tr(e.preview_type);
  if (H(() => {
    (i || m === "none") && y(!1);
  }, [i, m]), (e.type === "option" || e.type === "select") && m !== "none") {
    const l = wt(e, r);
    return /* @__PURE__ */ D(Ut, { children: [
      /* @__PURE__ */ o("span", { className: "ws-prompt-tool-wrap", children: /* @__PURE__ */ D(
        "button",
        {
          type: "button",
          className: "ws-prompt-tool",
          disabled: i,
          "aria-label": l,
          onClick: () => {
            u(""), y(!0);
          },
          children: [
            /* @__PURE__ */ o(ft, { name: e.icon, size: 15 }),
            /* @__PURE__ */ o("span", { children: l }),
            /* @__PURE__ */ o(Pt, { size: 14 })
          ]
        }
      ) }),
      /* @__PURE__ */ o(
        rr,
        {
          open: g,
          title: e.name || e.key,
          previewType: m,
          options: e.options || [],
          value: r,
          disabled: i,
          onOpenChange: y,
          onConfirm: (p) => d(Xe(e, p))
        }
      )
    ] });
  }
  return /* @__PURE__ */ o(
    De,
    {
      id: e.key,
      openKey: n,
      label: wt(e, r),
      icon: /* @__PURE__ */ o(ft, { name: e.icon, size: 15 }),
      disabled: i,
      onToggle: u,
      children: /* @__PURE__ */ o(
        Sr,
        {
          param: e,
          value: r,
          onChange: d,
          onClose: () => u("")
        }
      )
    }
  );
}
function De({
  id: e,
  openKey: r,
  label: n,
  icon: i,
  iconOnly: u = !1,
  variant: d = "default",
  disabled: g,
  children: y,
  onToggle: m
}) {
  const l = !g && r === e, p = d === "attachments" ? "is-attachments" : "", S = Z(null), O = B(() => {
    S.current != null && (window.clearTimeout(S.current), S.current = null);
  }, []), U = B(() => {
    O(), S.current = window.setTimeout(() => {
      S.current = null, m("");
    }, 240);
  }, [O, m]);
  return H(() => (l || O(), O), [O, l]), /* @__PURE__ */ D(
    "span",
    {
      className: `ws-prompt-tool-wrap ${p} ${l ? "is-open" : ""}`,
      onMouseEnter: () => {
        O(), g || m(e);
      },
      onMouseLeave: () => {
        l && U();
      },
      children: [
        /* @__PURE__ */ D(
          "button",
          {
            type: "button",
            className: `ws-prompt-tool ${u ? "is-icon-only" : ""} ${l ? "is-open" : ""}`,
            disabled: g,
            "aria-label": n,
            "aria-expanded": d === "attachments" ? l : void 0,
            "aria-haspopup": d === "attachments" ? "menu" : void 0,
            onClick: () => {
              g || (O(), m(l ? "" : e));
            },
            children: [
              i,
              u ? null : /* @__PURE__ */ o("span", { children: n }),
              u ? null : /* @__PURE__ */ o(Pt, { size: 14 })
            ]
          }
        ),
        l ? /* @__PURE__ */ o(
          "div",
          {
            className: `ws-prompt-popover ${p}`,
            onMouseEnter: O,
            children: y
          }
        ) : null
      ]
    }
  );
}
function Sr({
  param: e,
  value: r,
  onChange: n,
  onClose: i
}) {
  if (e.type === "option" || e.type === "select") {
    const u = e.options || [];
    return /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list", children: u.map((d) => {
      const g = Je(
        d,
        [String(r ?? "")],
        u
      );
      return /* @__PURE__ */ D(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${g ? "is-active" : ""}`,
          onClick: () => {
            n(
              Xe(
                e,
                dt(d)
              )
            ), i();
          },
          children: [
            /* @__PURE__ */ o("span", { children: d.name || d.value }),
            g ? /* @__PURE__ */ o(_e, { size: 14 }) : null
          ]
        },
        d.id || d.value
      );
    }) });
  }
  if (e.type === "multi_option") {
    const u = Rt(r), d = e.options || [];
    return /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list", children: d.map((g) => {
      const y = Je(g, u, d);
      return /* @__PURE__ */ D(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${y ? "is-active" : ""}`,
          onClick: () => {
            let m = [...u];
            y ? m = m.filter(
              (l) => !Je(g, [l], d)
            ) : m.push(dt(g)), n(Xe(e, m));
          },
          children: [
            /* @__PURE__ */ o("span", { children: g.name || g.value }),
            y ? /* @__PURE__ */ o(_e, { size: 14 }) : null
          ]
        },
        g.id || g.value
      );
    }) });
  }
  if (e.type === "switch") {
    const u = Mt(r);
    return /* @__PURE__ */ D(
      "button",
      {
        type: "button",
        className: `ws-prompt-switch ${u ? "is-on" : ""}`,
        onClick: () => n(!u),
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
      value: Ze(r),
      placeholder: e.name,
      onChange: (u) => n(u.target.value)
    }
  ) : /* @__PURE__ */ o(
    "input",
    {
      className: "ws-prompt-param-input",
      type: e.value_type === "number" ? "number" : "text",
      value: Ze(r),
      placeholder: e.name,
      onChange: (u) => n(
        e.value_type === "number" ? Number(u.target.value) : u.target.value
      )
    }
  );
}
function wt(e, r) {
  if (e.type === "switch")
    return `${e.name}: ${Mt(r) ? "开" : "关"}`;
  if (e.type === "multi_option") {
    const i = Rt(r).length;
    return i > 0 ? `${e.name} ${i}` : e.name;
  }
  if (e.type === "option" || e.type === "select")
    return nr(e.options || [], r)?.name || e.name;
  const n = Ze(r);
  return n ? `${e.name}: ${n}` : e.name;
}
function Rr(e, r) {
  const n = String(r.preferredUsage || "").trim();
  if (n) {
    const u = e.find((d) => d.key === n);
    if (u)
      return u;
  }
  const i = new Set(r.acceptedKinds || []);
  if (i.size > 0) {
    const u = e.find(
      (d) => et(d).some((g) => i.has(g))
    );
    if (u)
      return u;
  }
  return e.length === 1 ? e[0] : void 0;
}
function ht(e, r) {
  return JSON.stringify([String(e || ""), r?.parts || []]);
}
function Nr(e) {
  const r = /* @__PURE__ */ new Map();
  for (const n of e?.parts || []) {
    if (n.type !== "reference" || !n.usage)
      continue;
    const i = er(
      n,
      Number(n.ref_media_count || 0)
    );
    r.set(n.usage, (r.get(n.usage) || 0) + i);
  }
  return r;
}
function _r(e, r) {
  const n = tt(e);
  if (e.type !== "files")
    return r > 0 ? `${n}：已选择素材` : `选择${n}素材`;
  const i = Math.max(0, Number(e.max_files || 0));
  return r <= 0 ? i > 0 ? `选择${n}素材，最多 ${i} 个` : `选择${n}素材` : i > 0 ? `${n}：已选择 ${r} 个，最多 ${i} 个` : `${n}：已选择 ${r} 个`;
}
function tt(e) {
  return String(e.name || e.key || "").trim() || "文件";
}
function Dr(e) {
  const r = et(e);
  return r.length === 1 ? r[0] : "file";
}
function Ze(e) {
  return e == null ? "" : Array.isArray(e) ? e.join("、") : String(e);
}
function Rt(e) {
  if (Array.isArray(e))
    return e.map((r) => String(r)).filter(Boolean);
  if (typeof e == "string") {
    const r = Tr(e);
    return Array.isArray(r) ? r.map((n) => String(n)).filter(Boolean) : e ? [e] : [];
  }
  return e ? [String(e)] : [];
}
function Tr(e) {
  if (!e)
    return e;
  try {
    return JSON.parse(e);
  } catch {
    return e;
  }
}
function Er({
  value: e,
  options: r,
  disabled: n = !1,
  openKey: i,
  onToggle: u,
  onChange: d
}) {
  const g = r.find((y) => y.key === e);
  return r.length === 0 ? null : /* @__PURE__ */ o(
    De,
    {
      id: "storyboard-work-type",
      openKey: i,
      label: g?.name || e,
      icon: /* @__PURE__ */ o(qt, { size: 15 }),
      disabled: n,
      onToggle: u,
      children: /* @__PURE__ */ o("div", { className: "ws-prompt-menu-list", role: "menu", "aria-label": "作品类型", children: r.map((y) => /* @__PURE__ */ D(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${y.key === e ? "is-active" : ""}`,
          disabled: n,
          role: "menuitemradio",
          "aria-checked": y.key === e,
          onClick: () => {
            gr(y.key) && (d(y.key), u(""));
          },
          children: [
            /* @__PURE__ */ o("span", { children: y.name }),
            y.key === e ? /* @__PURE__ */ o(_e, { size: 14 }) : null
          ]
        },
        y.key
      )) })
    }
  );
}
const vt = { zIndex: 999 }, we = { save: "immediate" }, Or = [], Vr = {
  id: 0,
  name: "上传",
  key: "files",
  type: "files",
  usage: 2,
  max_files: 6
}, Ar = [Vr];
function Le(e) {
  return jt(e?.source_rule);
}
function $r(e) {
  return e && ["option", "select", "multi_option", "switch"].includes(e.type) ? we : void 0;
}
function bt(e, r, n, i) {
  const u = e.storyboardItem, d = new Set(u?.dependencyNodeIds || []);
  if (u?.itemType !== "shot" || !u.continuityAnchor || d.size !== 1)
    return { content: r, items: n };
  const g = n.filter(
    (l) => l.source === "current" && d.has(String(l.id || ""))
  ), y = new Set(
    g.map((l) => Number(l.refId || 0)).filter((l) => l > 0)
  );
  if (y.size === 0)
    return { content: r, items: n };
  const m = ir(i);
  return {
    content: r && {
      ...r,
      parts: r.parts.map(
        (l) => l.type === "reference" && l.ref_type === "asset" && y.has(Number(l.ref_id || 0)) ? { ...l, usage: m } : l
      )
    },
    items: n.map(
      (l) => g.includes(l) ? { ...l, kind: "image" } : l
    )
  };
}
function Ct(e, r, n, i) {
  if (!i || !r)
    return {
      content: e.promptContent,
      references: e.storyboardReferences || []
    };
  const u = e.storyboardWorkType || "short";
  return We(
    e.promptContent,
    e.storyboardReferences,
    n,
    e.prompt || "",
    u,
    r.storyboard_reference_purposes
  );
}
function Jr({ node: e }) {
  const {
    projectId: r,
    runningNode: n,
    onNodeDraftChange: i,
    onAssetCreated: u,
    onClearFeedbackRecords: d,
    onRunBackendNode: g
  } = e, y = e.composerDraft, m = v(
    () => ct(y),
    [y]
  ), l = v(
    () => it(m),
    [m]
  ), p = Z(m), S = Z(""), [O, U] = K(m.prompt || ""), [w, T] = K(m.promptContent), [L, W] = K(m.storyboardReferences || []), [q, se] = K(
    m.storyboardWorkType || "short"
  ), [qe, Pe] = K(!1), [C, ke] = K(null), [Q, Te] = K(!1), [Ye, ue] = K(
    m.selectedTargetId || 0
  ), [_, ae] = K(
    m.paramValues || {}
  ), [ee, de] = K(m.multiImageMode), Ee = Z(C), Oe = e.inputContext, pe = e.runBlockedReason;
  H(() => {
    const t = S.current;
    t && t !== l || (S.current = "", p.current = m);
  }, [m, l]), H(() => {
    Ee.current = C;
  }, [C]);
  const A = qe || Yt(n), $ = e.type, Ve = e.id, he = e.flow?.id || 0, me = e.type === "power" && e.power?.id || 0, ve = e.type === "power" && e.power?.key || "", Ae = e.type === "agent" ? Number(e.role?.agent_id || 0) : 0, fe = e.space, $e = e.canvasReferenceItems, P = e.connectedMediaReferences, te = e.onConnectedMediaUsagesChange, k = e.onConnectedMediaEdgeRemove, ge = e.catalogCache, Me = Number(
    fe?.release?.id || fe?.project.release_id || 0
  ), Fe = Number(e.assetCateId || 0), M = v(
    () => Gt(
      Oe,
      $e.filter((t) => t.id !== e.id)
    ),
    [$e, Oe, e.id]
  ), N = e.type === "power" && dr(e.power, e.kind, e.outputType)?.viewMode === "storyboard";
  H(() => {
    if ($ === "power" && (me || ve)) {
      const t = p.current.selectedTargetId || 0;
      let c = !1;
      return Te(!0), ge.loadPowerForm(
        {
          projectId: r,
          releaseId: Me,
          flowId: he,
          powerId: me,
          powerKey: ve,
          targetId: t
        },
        () => lt({
          projectId: r,
          flowId: he,
          powerId: me,
          powerKey: ve,
          targetId: t
        })
      ).then((s) => {
        if (c)
          return;
        const f = p.current, b = Ct(
          f,
          s,
          M.current,
          N
        );
        ke(s), ue(
          Le(s) && (s.selected_target_id || t) || 0
        ), ae(
          pt(s.params || [], f)
        ), U(f.prompt || ""), T(b.content), W(b.references), se(f.storyboardWorkType || "short"), de(f.multiImageMode);
      }).catch((s) => {
        c || oe.error(
          s instanceof Error ? s.message : "加载能力参数失败"
        );
      }).finally(() => {
        c || Te(!1);
      }), () => {
        c = !0;
      };
    }
    if (ke(null), $ === "agent") {
      const t = p.current;
      ae(t.paramValues || {}), U(t.prompt || ""), T(t.promptContent), W(t.storyboardReferences || []), se(t.storyboardWorkType || "short"), de(void 0), ue(0);
      return;
    }
    ae({}), ue(0), U(""), T(void 0), W([]), se("short"), de(void 0);
  }, [
    ge,
    r,
    Me,
    he,
    Ae,
    Ve,
    $,
    me,
    ve
  ]);
  const I = C?.params || Or, V = v(
    () => je(
      I,
      _,
      P.map((t) => t.source)
    ),
    [P, _, I]
  ), Y = v(
    () => mt({
      node: e,
      content: w,
      items: M.current,
      connections: P,
      params: I,
      values: V,
      requestedMode: ee
    }),
    [
      M,
      P,
      V,
      e,
      I,
      w,
      ee
    ]
  ), z = Y.active ? Y.mode : void 0, G = !!S.current && S.current !== l ? p.current.multiImageMode || ee || z : m.multiImageMode || z, F = v(
    () => Ke(I, V),
    [V, I]
  ), ce = v(
    () => Be(F),
    [F]
  ), J = v(
    () => $ === "power" ? or(
      ce,
      z
    ) : [],
    [ce, z, $]
  ), a = v(
    () => {
      const t = new Set(
        ce.map((s) => s.key)
      ), c = new Set(
        J.map((s) => s.key)
      );
      return F.filter(
        (s) => sr(s, I) && (!Ne(s) || !t.has(s.key) || c.has(s.key))
      );
    },
    [
      ce,
      F,
      J,
      I
    ]
  ), R = v(
    () => bt(
      e,
      w,
      M.current,
      J
    ),
    [M, J, e, w]
  ), j = v(
    () => N ? yr(
      q,
      C?.storyboard_reference_purposes || []
    ) : [],
    [N, C, q]
  ), ye = $ === "power" && ["image", "video"].includes(ar(e) || ""), be = v(
    () => $ === "power" && !Q ? He(
      P,
      R.content,
      R.items,
      J,
      {},
      ye,
      z
    ) : "",
    [
      P,
      J,
      R,
      Q,
      ye,
      $,
      z
    ]
  ), Se = v(
    () => N && !Q ? C ? wr(
      L,
      q,
      C.storyboard_work_types,
      C.storyboard_reference_purposes
    ) : "分镜作品类型与参考用途配置加载失败，请重新打开节点后重试" : "",
    [
      N,
      C,
      Q,
      L,
      q
    ]
  ), xe = pe || Y.error || be || Se, X = v(
    () => F.find(cr) || null,
    [F]
  ), Nt = v(
    () => a.filter(
      (t) => t.key !== X?.key && (Ne(t) || kt(t) || Qe(t, I))
    ),
    [a, I, X?.key]
  ), re = X ? String(V[X.key] ?? "") : O, _t = String(
    C?.power?.description || e.power?.description || ""
  ).trim() || (X ? "在此处为该能力输入生成提示词..." : "当前能力无需填写提示词"), ze = Le(C), ne = ze ? Ye : 0;
  H(() => {
    if ($ !== "power" && $ !== "agent")
      return;
    const t = p.current, c = Ee.current, s = Ct(
      t,
      c,
      M.current,
      N
    );
    U(t.prompt || ""), T(s.content), W(s.references), se(t.storyboardWorkType || "short"), de(t.multiImageMode), ue(
      $ === "power" && Le(c) && (t.selectedTargetId || c?.selected_target_id) || 0
    ), ae(
      $ === "power" && c ? pt(
        c.params || [],
        t
      ) : t.paramValues || {}
    );
  }, [l, $]);
  const Ce = B(
    (t, c) => {
      const s = Object.prototype.hasOwnProperty.call(
        t,
        "promptContent"
      ) ? t.promptContent : w, f = Jt({
        ...p.current,
        ...t,
        promptContent: s,
        ...N ? {} : {
          storyboardReferences: [],
          storyboardWorkType: void 0
        }
      });
      p.current = f;
      const b = it(
        ct(f)
      );
      return S.current = b === l ? "" : b, de(f.multiImageMode), i(e.id, f, c), f;
    },
    [
      N,
      l,
      e.id,
      i,
      w
    ]
  ), ie = B(
    (t, c, s) => (ae(t), Ce(
      { ...c, paramValues: t },
      s
    )),
    [Ce]
  );
  H(() => {
    V !== _ && ie(V, {
      prompt: re,
      promptContent: w,
      selectedTargetId: ne,
      multiImageMode: G
    });
  }, [
    ne,
    V,
    _,
    re,
    w,
    ie,
    G
  ]);
  function Dt(t, c) {
    const s = Ie(w) !== Ie(c), f = s ? Re(
      w,
      c,
      M.current,
      J,
      P,
      z
    ) : { content: c, assignments: {} }, b = f.content;
    Object.keys(f.assignments).length > 0 && te?.(f.assignments), U(t);
    const h = N && s ? We(
      b,
      L,
      M.current,
      t,
      q,
      C?.storyboard_reference_purposes || []
    ) : {
      content: b,
      references: L
    };
    T(h.content), W(h.references);
    const x = p.current.paramValues || _, E = X ? { ...x, [X.key]: t } : x;
    ie(
      E,
      {
        prompt: t,
        promptContent: h.content,
        selectedTargetId: ne,
        storyboardReferences: h.references,
        storyboardWorkType: N ? q : void 0,
        multiImageMode: G
      },
      s ? we : void 0
    );
  }
  function Tt(t) {
    const c = We(
      w,
      L,
      M.current,
      re,
      t,
      C?.storyboard_reference_purposes || []
    );
    se(t), T(c.content), W(c.references), Ce(
      {
        prompt: re,
        promptContent: c.content,
        paramValues: _,
        selectedTargetId: ne,
        storyboardReferences: c.references,
        storyboardWorkType: t,
        multiImageMode: G
      },
      we
    );
  }
  function Et(t, c) {
    const s = {
      ...p.current.paramValues || _,
      [t]: c
    }, f = I.find((x) => x.key === t), b = $r(f), h = z;
    if (f && Qe(f, I)) {
      const x = Be(
        Ke(I, s)
      ), E = Re(
        w,
        w,
        M.current,
        x,
        P,
        h
      );
      Object.keys(E.assignments).length > 0 && te?.(E.assignments), T(E.content), ie(
        s,
        {
          prompt: re,
          promptContent: E.content,
          selectedTargetId: ne,
          multiImageMode: G
        },
        b
      );
      return;
    }
    ie(
      s,
      {
        prompt: re,
        promptContent: w,
        selectedTargetId: ne,
        multiImageMode: G
      },
      b
    );
  }
  function Ot(t) {
    const c = Y.options.find(
      (E) => E.value === t
    );
    if (!Y.active || !c?.enabled) {
      oe.error(c?.reason || "当前能力不支持该多图生成方式");
      return;
    }
    const s = p.current.paramValues || _, f = je(
      I,
      s,
      P.map((E) => E.source)
    ), b = Be(
      Ke(I, f)
    ), h = Re(
      w,
      w,
      M.current,
      b,
      P,
      t
    ), x = He(
      P,
      h.content,
      M.current,
      b,
      h.assignments,
      ye,
      t
    );
    x && oe.error(x), Object.keys(h.assignments).length > 0 && te?.(h.assignments), T(h.content), ie(
      f,
      {
        prompt: re,
        promptContent: h.content,
        selectedTargetId: ne,
        storyboardReferences: L,
        multiImageMode: t
      },
      we
    );
  }
  function Vt(t, c) {
    const s = Ie(w) !== Ie(c);
    U(t), T(c), Ce(
      {
        prompt: t,
        promptContent: c,
        paramValues: p.current.paramValues || _,
        selectedTargetId: 0
      },
      s ? we : void 0
    );
  }
  function At(t, c) {
    const s = {
      ...p.current.paramValues || _,
      [t]: c
    };
    ie(
      s,
      {
        prompt: O,
        selectedTargetId: 0
      },
      we
    );
  }
  async function rt(t, c, s) {
    const f = await Ht({
      projectID: r,
      teamID: Number(fe?.project.team_id || 0),
      files: t,
      ruleID: c.upload_rule_id,
      onProgress: s?.onProgress
    });
    for (const b of f) {
      const h = Qt(b.asset);
      h.id && u?.(h);
    }
    return f;
  }
  async function $t(t) {
    if (!(A || !ze) && !(e.type !== "power" || !e.power))
      try {
        const c = await ge.loadPowerForm(
          {
            projectId: r,
            releaseId: Me,
            flowId: e.flow?.id || 0,
            powerId: e.power.id,
            powerKey: e.power.key,
            targetId: t
          },
          () => lt({
            projectId: r,
            flowId: e.flow?.id || 0,
            powerId: e.power?.id || 0,
            powerKey: e.power?.key || "",
            targetId: t
          })
        ), s = c.params || [], f = lr(
          s,
          p.current.paramValues || _,
          C?.params || []
        ), b = je(
          s,
          f,
          P.map((xt) => xt.source)
        ), h = mt({
          node: e,
          content: w,
          items: M.current,
          connections: P,
          params: s,
          values: b,
          requestedMode: ee || z
        }), x = h.active ? h.mode : void 0;
        if (h.error) {
          oe.error(`无法切换能力来源：${h.error}`);
          return;
        }
        const E = Be(
          Ke(s, b)
        ), le = Re(
          w,
          w,
          M.current,
          E,
          P,
          x
        ), Ue = bt(
          e,
          le.content,
          M.current,
          E
        ), ot = He(
          P,
          Ue.content,
          Ue.items,
          E,
          le.assignments,
          ye,
          x
        );
        if (ot) {
          oe.error(`无法切换能力来源：${ot}`);
          return;
        }
        Object.keys(le.assignments).length > 0 && te?.(le.assignments), ke(c);
        const st = Le(c) ? c.selected_target_id || t : 0;
        ue(st), T(le.content), ie(
          b,
          {
            prompt: re,
            promptContent: le.content,
            selectedTargetId: st,
            multiImageMode: x
          },
          we
        );
      } catch (c) {
        oe.error(c instanceof Error ? c.message : "加载能力参数失败");
      }
  }
  const Ft = async (t, c) => {
    d([e.id]), Pe(!0);
    try {
      if (e.type === "power" && e.power) {
        const s = p.current, f = Object.prototype.hasOwnProperty.call(
          s,
          "promptContent"
        ) ? s.promptContent : c, b = s.storyboardWorkType || q, h = N ? We(
          f,
          s.storyboardReferences || L,
          M.current,
          t,
          b,
          C?.storyboard_reference_purposes || []
        ) : {
          content: f,
          references: s.storyboardReferences || []
        }, x = z, E = {
          ...je(
            I,
            s.paramValues || V,
            P.map((Ue) => Ue.source)
          )
        };
        X && (E[X.key] = t);
        const le = Ce({
          ...s,
          prompt: t,
          promptContent: h.content,
          paramValues: E,
          selectedTargetId: ne,
          storyboardReferences: h.references,
          storyboardWorkType: N ? b : void 0,
          multiImageMode: x
        });
        await g({
          ...e,
          composerDraft: le
        }), oe.success("能力节点执行成功");
        return;
      }
      if (e.type === "agent" && e.role) {
        const s = p.current, f = Ce({
          ...s,
          prompt: t,
          promptContent: Object.prototype.hasOwnProperty.call(
            s,
            "promptContent"
          ) ? s.promptContent : c,
          paramValues: s.paramValues || _,
          selectedTargetId: 0
        });
        await g({
          ...e,
          composerDraft: f
        });
        return;
      }
      throw new Error("当前节点缺少可运行配置");
    } catch (s) {
      oe.error(s instanceof Error ? s.message : "执行出错");
    } finally {
      Pe(!1);
    }
  }, nt = async (t, c) => {
    if (!A) {
      if (xe) {
        oe.error(xe);
        return;
      }
      await Ft(t, c);
    }
  };
  return e.type === "power" ? /* @__PURE__ */ o(
    "div",
    {
      className: "ws-node-bottom-settings is-composer nodrag nowheel",
      onClick: (t) => t.stopPropagation(),
      style: vt,
      children: Q && !A && !C ? /* @__PURE__ */ D("div", { className: "ws-prompt-loading", children: [
        /* @__PURE__ */ o(It, { size: 16, className: "ws-spin" }),
        /* @__PURE__ */ o("span", { children: "正在加载能力参数..." })
      ] }) : /* @__PURE__ */ o(
        yt,
        {
          value: re,
          referenceContent: w,
          placeholder: _t,
          running: A,
          textInputEnabled: !!X,
          showMediaParamButtons: !0,
          mediaParamPower: C?.power || e.power,
          sourceOptions: ze ? C?.sources || [] : [],
          selectedSourceId: ne,
          params: Nt,
          paramValues: V,
          assetLibrary: M,
          assetReference: {
            teamID: Number(fe?.project.team_id || 0),
            projectID: r,
            assetCateID: Fe
          },
          connectedMediaReferences: P,
          mediaUsageOptions: J,
          referenceUsageOptions: N ? j : void 0,
          referenceUsageField: N ? "purpose" : "usage",
          multiImagePlan: Y,
          multiImageMode: z,
          toolbarContent: N ? ({ openKey: t, onToggle: c }) => /* @__PURE__ */ o(
            Er,
            {
              value: q,
              options: C?.storyboard_work_types || [],
              disabled: Q || A,
              openKey: t,
              onToggle: c,
              onChange: Tt
            }
          ) : void 0,
          onConnectedMediaEdgeRemove: k,
          disabled: Q,
          submitDisabled: !!xe,
          submitDisabledReason: xe,
          onChange: Dt,
          onParamChange: Et,
          onMultiImageModeChange: Ot,
          onSourceChange: ze ? (t) => {
            $t(t);
          } : void 0,
          onLocalUpload: rt,
          onSubmit: nt
        }
      )
    }
  ) : /* @__PURE__ */ o(
    "div",
    {
      className: "ws-node-bottom-settings is-composer nodrag nowheel",
      onClick: (t) => t.stopPropagation(),
      style: vt,
      children: /* @__PURE__ */ o(
        yt,
        {
          value: O,
          referenceContent: w,
          placeholder: "向智能体发送任务指令...",
          running: A,
          params: Ar,
          paramValues: _,
          assetLibrary: M,
          assetReference: {
            teamID: Number(fe?.project.team_id || 0),
            projectID: r,
            assetCateID: Fe
          },
          connectedMediaReferences: P,
          onConnectedMediaEdgeRemove: k,
          onChange: Vt,
          onParamChange: At,
          onLocalUpload: rt,
          onSubmit: nt
        }
      )
    }
  );
}
export {
  Jr as CanvasNodeSettings
};
