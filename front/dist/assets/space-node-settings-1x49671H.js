import { j as T, a as r, F as Vt } from "./_commonjsHelpers-CTFd9u1x.js";
import { d as C, b as K, l as B, u as X, o as J } from "./react-C7Xtl8sB.js";
import { b as Ne, F as Ot, ay as rt, az as At, L as gt, aw as $t, j as wt, a as zt } from "./vendor-icons-Cc7Kl3It.js";
import { t as se } from "./index-BxqXLJC9.js";
import { x as Be, y as nt, z as ot, A as jt, B as xt, f as st, C as Ft, D as Ut, E as Bt } from "./space-page-D3VBae11.js";
import { i as Fe, f as Qe, g as ht, h as Ge, r as Kt, j as Lt, k as Re, l as Wt, p as qt, P as Yt, q as Je, t as bt, u as Gt, v as qe, w as at, x as ct, y as it, z as $e, A as ze, B as Jt, C as Ht, D as je, b as Qt, E as Ye, F as Xt, G as Zt } from "./space-ordered-list-C1oWfuUW.js";
import { P as er, d as lt, r as tr } from "./space-add-node-menu-pcpVf0B3.js";
import { C as rr } from "./space-reference-editor-DQKtEtx8.js";
import { H as nr, v as or, B as vt } from "./storyboard-grid-view-CJXm84yJ.js";
import { u as sr } from "./asset-reference-provider-C3LvPld5.js";
import { j as ar, k as cr, l as ir, m as Ue } from "./node-detail-content-DhUE_leQ.js";
function ut(e) {
  return e?.service_name?.trim() || e?.name?.trim() || "来源";
}
const lr = 240, ur = [], pr = [];
function pt({
  value: e,
  placeholder: n,
  running: s = !1,
  disabled: i = !1,
  textInputEnabled: l = !0,
  showMediaParamButtons: u = !1,
  mediaParamPower: f,
  submitDisabled: g = !1,
  submitDisabledReason: p = "",
  sourceOptions: w = [],
  selectedSourceId: y = 0,
  params: D = [],
  paramValues: z = {},
  assetLibrary: F = { current: [] },
  referenceContent: m,
  assetReference: _,
  connectedMediaReferences: L = ur,
  mediaUsageOptions: W = pr,
  referenceUsageOptions: q,
  referenceUsageField: ae = "usage",
  multiImagePlan: H,
  multiImageMode: Ce,
  toolbarContent: P,
  onConnectedMediaEdgeRemove: Pe,
  onChange: Q,
  onParamChange: Se,
  onSourceChange: Ke,
  onMultiImageModeChange: ue,
  onLocalUpload: N,
  onSubmit: ce
}) {
  const Z = C(
    () => D.filter(Fe),
    [D]
  ), pe = K(
    (o) => {
      const b = mr(o);
      F.current = [
        ...F.current.filter(
          (Y) => Number(Y.refId || 0) !== o.refId
        ),
        b
      ];
    },
    [F]
  ), De = K(
    async (o, b) => {
      if (!N)
        throw new Error("当前节点未配置本地上传");
      const Y = gr(Z, b);
      if (!Y)
        throw new Error("当前能力没有与所选素材类型匹配的上传参数");
      const re = (await N(o, Y)).map((x) => nr(x.asset)).filter((x) => x.id > 0);
      if (re.length === 0)
        throw new Error("上传成功，但没有生成可用资产");
      return re;
    },
    [N, Z]
  ), _e = sr({
    teamID: Number(_?.teamID || 0),
    scopeProjectID: Number(_?.projectID || 0),
    initialFilters: _?.projectID ? {
      sourceType: "project",
      projectID: _.projectID,
      assetCateID: Number(_.assetCateID || 0)
    } : void 0,
    onSelect: pe,
    onUpload: N ? De : void 0
  }), [de, E] = B(""), [A, Te] = B(), we = X(0), me = K((o) => {
    E(""), we.current += 1, Te({
      id: we.current,
      trigger: "@",
      preferredUsage: o.key,
      acceptedKinds: Qe(o)
    });
  }, []), he = K(
    (o) => {
      Te(
        (b) => b?.id === o ? void 0 : b
      );
    },
    []
  ), Le = C(
    () => D.filter(
      (o) => Fe(o) || ht(o) || Ge(o, D)
    ),
    [D]
  ), fe = C(
    () => w.find(
      (o) => o.target_id === y || o.id === y
    ),
    [y, w]
  ), Ie = C(
    () => (H?.options || []).filter((o) => o.enabled),
    [H?.options]
  ), I = H?.mode ? `${H.mode === "per_image" ? "逐图生成" : "共同参考"} · ${H.imageCount} 张` : "", ee = F.current, R = C(() => {
    const o = Kt(
      e,
      m,
      Lt(L, ee)
    );
    return {
      ...o,
      content: Re(
        m,
        o.content,
        ee,
        W,
        L,
        Ce
      ).content
    };
  }, [
    L,
    W,
    Ce,
    m,
    ee,
    e
  ]), ye = C(
    () => W.map((o) => ({
      key: o.key,
      label: o.label,
      acceptedKinds: o.acceptedKinds,
      maxFiles: o.maxFiles
    })),
    [W]
  ), ke = C(
    () => q || ye,
    [q, ye]
  ), Ee = C(
    () => wr(R.content),
    [R.content]
  ), M = C(
    () => mt(e, m),
    [m, e]
  ), S = C(
    () => mt(
      R.value,
      R.content
    ),
    [R.content, R.value]
  ), k = X({
    value: R.value,
    content: R.content
  }), j = X(!1), V = X(null), We = X(Q), te = X(ce);
  We.current = Q, te.current = ce;
  const U = K(() => {
    V.current !== null && (window.clearTimeout(V.current), V.current = null);
  }, []), $ = K(() => {
    if (U(), !j.current)
      return;
    j.current = !1;
    const o = k.current;
    We.current(o.value, o.content);
  }, [U]), be = K(
    (o, b, Y = !1) => {
      const Ve = k.current.content;
      k.current = {
        value: o,
        content: b
      }, j.current = !0;
      const re = Be(Ve) !== Be(b);
      if (Y || re) {
        $();
        return;
      }
      U(), V.current = window.setTimeout(
        $,
        lr
      );
    },
    [U, $]
  ), ge = K(() => {
    const o = k.current;
    return $(), te.current(o.value, o.content);
  }, [$]);
  return J(() => {
    j.current || (k.current = {
      value: R.value,
      content: R.content
    });
  }, [
    S,
    R.content,
    R.value
  ]), J(
    () => () => {
      $();
    },
    [$]
  ), J(() => {
    (i || s) && E("");
  }, [i, s]), J(() => {
    M !== S && (j.current || be(
      R.value,
      R.content,
      !0
    ));
  }, [
    M,
    S,
    R.content,
    R.value,
    be
  ]), /* @__PURE__ */ T(
    "div",
    {
      className: `ws-prompt-composer nowheel ${s ? "is-running" : ""}`,
      children: [
        /* @__PURE__ */ r("div", { className: "ws-prompt-main", children: /* @__PURE__ */ r("div", { className: "ws-prompt-editor-shell", children: /* @__PURE__ */ r(
          rr,
          {
            className: "ws-prompt-reference-editor nodrag nopan",
            value: R.value,
            content: R.content,
            disabled: i || s,
            textEditable: l,
            placeholder: n,
            items: ee,
            usageOptions: ke,
            usageField: ae,
            mediaUsageOptions: ye,
            autoAssignUsage: ae !== "purpose",
            pickerRequest: A,
            onPickerRequestConsumed: he,
            assetReferenceProvider: _?.teamID ? _e : void 0,
            onReferenceDelete: (o) => {
              o.ref_origin === "edge" && o.ref_origin_id && Pe?.(o.ref_origin_id);
            },
            onChange: be,
            onBlur: $,
            onSubmit: !s && !g ? () => {
              ge();
            } : void 0
          }
        ) }) }),
        /* @__PURE__ */ T("div", { className: "ws-prompt-toolbar", children: [
          /* @__PURE__ */ T("div", { className: "ws-prompt-tools", children: [
            w.length > 0 ? /* @__PURE__ */ r(
              Me,
              {
                id: "source",
                openKey: de,
                label: ut(fe),
                icon: /* @__PURE__ */ r(Ot, { size: 15 }),
                disabled: i || s,
                onToggle: E,
                children: /* @__PURE__ */ r("div", { className: "ws-prompt-menu-list", children: w.map((o) => {
                  const b = o.target_id || o.id, Y = b === y;
                  return /* @__PURE__ */ T(
                    "button",
                    {
                      type: "button",
                      className: `ws-prompt-menu-item ${Y ? "is-active" : ""}`,
                      disabled: i || s,
                      onClick: () => {
                        Ke?.(b), E("");
                      },
                      children: [
                        /* @__PURE__ */ r("span", { children: ut(o) }),
                        Y ? /* @__PURE__ */ r(Ne, { size: 14 }) : null
                      ]
                    },
                    b
                  );
                }) })
              }
            ) : null,
            P?.({ openKey: de, onToggle: E }),
            H?.active && H.mode ? Ie.length > 1 ? /* @__PURE__ */ r(
              Me,
              {
                id: "multi-image-mode",
                openKey: de,
                label: I,
                icon: /* @__PURE__ */ r(rt, { size: 15 }),
                disabled: i || s,
                onToggle: E,
                children: /* @__PURE__ */ r("div", { className: "ws-prompt-menu-list", children: Ie.map((o) => {
                  const b = o.value === H.mode;
                  return /* @__PURE__ */ T(
                    "button",
                    {
                      type: "button",
                      className: `ws-prompt-menu-item ${b ? "is-active" : ""}`,
                      disabled: i || s,
                      onClick: () => {
                        ue?.(o.value), E("");
                      },
                      children: [
                        /* @__PURE__ */ r("span", { children: o.label }),
                        b ? /* @__PURE__ */ r(Ne, { size: 14 }) : null
                      ]
                    },
                    o.value
                  );
                }) })
              }
            ) : /* @__PURE__ */ r("span", { className: "ws-prompt-tool-wrap", children: /* @__PURE__ */ T(
              "span",
              {
                className: "ws-prompt-tool is-static",
                "aria-label": I,
                children: [
                  /* @__PURE__ */ r(rt, { size: 15 }),
                  /* @__PURE__ */ r("span", { children: I })
                ]
              }
            ) }) : null,
            !u && Z.length > 0 ? /* @__PURE__ */ r(
              Me,
              {
                id: "attachments",
                openKey: de,
                label: "添加素材",
                icon: /* @__PURE__ */ r(At, { size: 17 }),
                iconOnly: !0,
                variant: "attachments",
                disabled: i || s,
                onToggle: E,
                children: /* @__PURE__ */ r("div", { className: "ws-prompt-menu-list is-attachments", role: "menu", children: Z.map((o) => /* @__PURE__ */ T(
                  "button",
                  {
                    type: "button",
                    className: "ws-prompt-menu-item",
                    role: "menuitem",
                    onClick: () => me(o),
                    children: [
                      /* @__PURE__ */ r("span", { className: "ws-prompt-menu-kind-icon", children: /* @__PURE__ */ r(or, { kind: br(o) }) }),
                      /* @__PURE__ */ r("span", { children: Xe(o) })
                    ]
                  },
                  o.key
                )) })
              }
            ) : null,
            Le.map((o) => Fe(o) ? u ? /* @__PURE__ */ r(
              dr,
              {
                param: o,
                power: f,
                selectedCount: Ee.get(o.key) || 0,
                disabled: i || s,
                onClick: () => me(o)
              },
              o.key
            ) : null : /* @__PURE__ */ r(
              fr,
              {
                param: o,
                value: z[o.key],
                openKey: de,
                disabled: i || s,
                onToggle: E,
                onChange: (b) => Se?.(o.key, b)
              },
              o.key
            ))
          ] }),
          /* @__PURE__ */ r("div", { className: "ws-prompt-submit-group", children: /* @__PURE__ */ r(vt, { label: p || void 0, children: /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "ws-prompt-submit",
              disabled: i || s || g,
              onClick: () => {
                ge();
              },
              "aria-label": p || "发送",
              children: s ? /* @__PURE__ */ r(gt, { size: 17, className: "ws-spin" }) : /* @__PURE__ */ r($t, { size: 18 })
            }
          ) }) })
        ] })
      ]
    }
  );
}
function dr({
  param: e,
  power: n,
  selectedCount: s,
  disabled: i,
  onClick: l
}) {
  const u = s > 0;
  return /* @__PURE__ */ r(vt, { label: hr(e, s), children: /* @__PURE__ */ T(
    "button",
    {
      type: "button",
      className: `ws-prompt-tool is-media-param ${u ? "is-selected" : ""}`,
      disabled: i,
      "aria-pressed": u,
      onClick: l,
      children: [
        /* @__PURE__ */ r(er, { power: n, size: 15 }),
        /* @__PURE__ */ r("span", { children: Xe(e) }),
        e.type === "files" && u ? /* @__PURE__ */ r("small", { className: "ws-prompt-media-count", children: s }) : null
      ]
    }
  ) });
}
function mr(e) {
  const n = String(e.preview?.kind || "file"), s = String(e.preview?.url || "");
  return {
    id: `asset:${e.refId}`,
    title: e.label,
    kind: n,
    source: "asset",
    refType: "asset",
    refId: e.refId,
    versionID: e.versionID,
    output: e.output,
    asset: e.asset,
    preview: {
      text: e.description || "",
      imageUrl: n === "image" ? s : "",
      videoUrl: n === "video" ? s : "",
      audioUrl: n === "audio" ? s : "",
      fileUrl: n === "file" ? s : ""
    }
  };
}
function fr({
  param: e,
  value: n,
  openKey: s,
  disabled: i,
  onToggle: l,
  onChange: u
}) {
  const [f, g] = B(!1), p = qt(e.preview_type);
  if (J(() => {
    (i || p === "none") && g(!1);
  }, [i, p]), (e.type === "option" || e.type === "select") && p !== "none") {
    const w = dt(e, n);
    return /* @__PURE__ */ T(Vt, { children: [
      /* @__PURE__ */ r("span", { className: "ws-prompt-tool-wrap", children: /* @__PURE__ */ T(
        "button",
        {
          type: "button",
          className: "ws-prompt-tool",
          disabled: i,
          "aria-label": w,
          onClick: () => {
            l(""), g(!0);
          },
          children: [
            /* @__PURE__ */ r(lt, { name: e.icon, size: 15 }),
            /* @__PURE__ */ r("span", { children: w }),
            /* @__PURE__ */ r(wt, { size: 14 })
          ]
        }
      ) }),
      /* @__PURE__ */ r(
        Yt,
        {
          open: f,
          title: e.name || e.key,
          previewType: p,
          options: e.options || [],
          value: n,
          disabled: i,
          onOpenChange: g,
          onConfirm: (y) => u(Je(e, y))
        }
      )
    ] });
  }
  return /* @__PURE__ */ r(
    Me,
    {
      id: e.key,
      openKey: s,
      label: dt(e, n),
      icon: /* @__PURE__ */ r(lt, { name: e.icon, size: 15 }),
      disabled: i,
      onToggle: l,
      children: /* @__PURE__ */ r(
        yr,
        {
          param: e,
          value: n,
          onChange: u,
          onClose: () => l("")
        }
      )
    }
  );
}
function Me({
  id: e,
  openKey: n,
  label: s,
  icon: i,
  iconOnly: l = !1,
  variant: u = "default",
  disabled: f,
  children: g,
  onToggle: p
}) {
  const w = !f && n === e, y = u === "attachments" ? "is-attachments" : "", D = X(null), z = K(() => {
    D.current != null && (window.clearTimeout(D.current), D.current = null);
  }, []), F = K(() => {
    z(), D.current = window.setTimeout(() => {
      D.current = null, p("");
    }, 240);
  }, [z, p]);
  return J(() => (w || z(), z), [z, w]), /* @__PURE__ */ T(
    "span",
    {
      className: `ws-prompt-tool-wrap ${y} ${w ? "is-open" : ""}`,
      onMouseEnter: () => {
        z(), f || p(e);
      },
      onMouseLeave: () => {
        w && F();
      },
      children: [
        /* @__PURE__ */ T(
          "button",
          {
            type: "button",
            className: `ws-prompt-tool ${l ? "is-icon-only" : ""} ${w ? "is-open" : ""}`,
            disabled: f,
            "aria-label": s,
            "aria-expanded": u === "attachments" ? w : void 0,
            "aria-haspopup": u === "attachments" ? "menu" : void 0,
            onClick: () => {
              f || (z(), p(w ? "" : e));
            },
            children: [
              i,
              l ? null : /* @__PURE__ */ r("span", { children: s }),
              l ? null : /* @__PURE__ */ r(wt, { size: 14 })
            ]
          }
        ),
        w ? /* @__PURE__ */ r(
          "div",
          {
            className: `ws-prompt-popover ${y}`,
            onMouseEnter: z,
            children: g
          }
        ) : null
      ]
    }
  );
}
function yr({
  param: e,
  value: n,
  onChange: s,
  onClose: i
}) {
  if (e.type === "option" || e.type === "select") {
    const l = e.options || [];
    return /* @__PURE__ */ r("div", { className: "ws-prompt-menu-list", children: l.map((u) => {
      const f = qe(
        u,
        [String(n ?? "")],
        l
      );
      return /* @__PURE__ */ T(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${f ? "is-active" : ""}`,
          onClick: () => {
            s(
              Je(
                e,
                at(u)
              )
            ), i();
          },
          children: [
            /* @__PURE__ */ r("span", { children: u.name || u.value }),
            f ? /* @__PURE__ */ r(Ne, { size: 14 }) : null
          ]
        },
        u.id || u.value
      );
    }) });
  }
  if (e.type === "multi_option") {
    const l = Ct(n), u = e.options || [];
    return /* @__PURE__ */ r("div", { className: "ws-prompt-menu-list", children: u.map((f) => {
      const g = qe(f, l, u);
      return /* @__PURE__ */ T(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${g ? "is-active" : ""}`,
          onClick: () => {
            let p = [...l];
            g ? p = p.filter(
              (w) => !qe(f, [w], u)
            ) : p.push(at(f)), s(Je(e, p));
          },
          children: [
            /* @__PURE__ */ r("span", { children: f.name || f.value }),
            g ? /* @__PURE__ */ r(Ne, { size: 14 }) : null
          ]
        },
        f.id || f.value
      );
    }) });
  }
  if (e.type === "switch") {
    const l = bt(n);
    return /* @__PURE__ */ T(
      "button",
      {
        type: "button",
        className: `ws-prompt-switch ${l ? "is-on" : ""}`,
        onClick: () => s(!l),
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
      value: He(n),
      placeholder: e.name,
      onChange: (l) => s(l.target.value)
    }
  ) : /* @__PURE__ */ r(
    "input",
    {
      className: "ws-prompt-param-input",
      type: e.value_type === "number" ? "number" : "text",
      value: He(n),
      placeholder: e.name,
      onChange: (l) => s(
        e.value_type === "number" ? Number(l.target.value) : l.target.value
      )
    }
  );
}
function dt(e, n) {
  if (e.type === "switch")
    return `${e.name}: ${bt(n) ? "开" : "关"}`;
  if (e.type === "multi_option") {
    const i = Ct(n).length;
    return i > 0 ? `${e.name} ${i}` : e.name;
  }
  if (e.type === "option" || e.type === "select")
    return Gt(e.options || [], n)?.name || e.name;
  const s = He(n);
  return s ? `${e.name}: ${s}` : e.name;
}
function gr(e, n) {
  const s = String(n.preferredUsage || "").trim();
  if (s) {
    const l = e.find((u) => u.key === s);
    if (l)
      return l;
  }
  const i = new Set(n.acceptedKinds || []);
  if (i.size > 0) {
    const l = e.find(
      (u) => Qe(u).some((f) => i.has(f))
    );
    if (l)
      return l;
  }
  return e.length === 1 ? e[0] : void 0;
}
function mt(e, n) {
  return JSON.stringify([String(e || ""), n?.parts || []]);
}
function wr(e) {
  const n = /* @__PURE__ */ new Map();
  for (const s of e?.parts || []) {
    if (s.type !== "reference" || !s.usage)
      continue;
    const i = Wt(
      s,
      Number(s.ref_media_count || 0)
    );
    n.set(s.usage, (n.get(s.usage) || 0) + i);
  }
  return n;
}
function hr(e, n) {
  const s = Xe(e);
  if (e.type !== "files")
    return n > 0 ? `${s}：已选择素材` : `选择${s}素材`;
  const i = Math.max(0, Number(e.max_files || 0));
  return n <= 0 ? i > 0 ? `选择${s}素材，最多 ${i} 个` : `选择${s}素材` : i > 0 ? `${s}：已选择 ${n} 个，最多 ${i} 个` : `${s}：已选择 ${n} 个`;
}
function Xe(e) {
  return String(e.name || e.key || "").trim() || "文件";
}
function br(e) {
  const n = Qe(e);
  return n.length === 1 ? n[0] : "file";
}
function He(e) {
  return e == null ? "" : Array.isArray(e) ? e.join("、") : String(e);
}
function Ct(e) {
  if (Array.isArray(e))
    return e.map((n) => String(n)).filter(Boolean);
  if (typeof e == "string") {
    const n = vr(e);
    return Array.isArray(n) ? n.map((s) => String(s)).filter(Boolean) : e ? [e] : [];
  }
  return e ? [String(e)] : [];
}
function vr(e) {
  if (!e)
    return e;
  try {
    return JSON.parse(e);
  } catch {
    return e;
  }
}
function Cr({
  value: e,
  options: n,
  disabled: s = !1,
  openKey: i,
  onToggle: l,
  onChange: u
}) {
  const f = n.find((g) => g.key === e);
  return n.length === 0 ? null : /* @__PURE__ */ r(
    Me,
    {
      id: "storyboard-work-type",
      openKey: i,
      label: f?.name || e,
      icon: /* @__PURE__ */ r(zt, { size: 15 }),
      disabled: s,
      onToggle: l,
      children: /* @__PURE__ */ r("div", { className: "ws-prompt-menu-list", role: "menu", "aria-label": "作品类型", children: n.map((g) => /* @__PURE__ */ T(
        "button",
        {
          type: "button",
          className: `ws-prompt-menu-item ${g.key === e ? "is-active" : ""}`,
          disabled: s,
          role: "menuitemradio",
          "aria-checked": g.key === e,
          onClick: () => {
            ar(g.key) && (u(g.key), l(""));
          },
          children: [
            /* @__PURE__ */ r("span", { children: g.name }),
            g.key === e ? /* @__PURE__ */ r(Ne, { size: 14 }) : null
          ]
        },
        g.key
      )) })
    }
  );
}
const ft = { zIndex: 999 }, Pr = [], Ir = {
  id: 0,
  name: "上传",
  key: "files",
  type: "files",
  usage: 2,
  max_files: 6
}, kr = [Ir];
function xe(e) {
  return Number(e?.source_rule || 0) === 2;
}
function yt(e, n, s, i) {
  if (!i || !n)
    return {
      content: e.promptContent,
      references: e.storyboardReferences || []
    };
  const l = e.storyboardWorkType || "short";
  return Ue(
    e.promptContent,
    e.storyboardReferences,
    s,
    e.prompt || "",
    l,
    n.storyboard_reference_purposes
  );
}
function zr({ node: e }) {
  const {
    projectId: n,
    runningNode: s,
    onNodeDraftChange: i,
    onAssetCreated: l,
    onClearFeedbackRecords: u,
    onRunBackendNode: f
  } = e, g = e.composerDraft, p = C(
    () => nt(g),
    [g]
  ), w = C(
    () => ot(p),
    [p]
  ), y = X(p), D = X(""), [z, F] = B(p.prompt || ""), [m, _] = B(p.promptContent), [L, W] = B(p.storyboardReferences || []), [q, ae] = B(
    p.storyboardWorkType || "short"
  ), [H, Ce] = B(!1), [P, Pe] = B(null), [Q, Se] = B(!1), [Ke, ue] = B(
    p.selectedTargetId || 0
  ), [N, ce] = B(
    p.paramValues || {}
  ), [Z, pe] = B(p.multiImageMode), De = X(P), _e = e.inputContext, de = e.runBlockedReason;
  J(() => {
    const t = D.current;
    t && t !== w || (D.current = "", y.current = p);
  }, [p, w]), J(() => {
    De.current = P;
  }, [P]);
  const E = H || jt(s), A = e.type, Te = e.id, we = e.flow?.id || 0, me = e.type === "power" && e.power?.id || 0, he = e.type === "power" && e.power?.key || "", Le = e.type === "agent" ? Number(e.role?.agent_id || 0) : 0, fe = e.space, Ie = e.canvasReferenceItems, I = e.connectedMediaReferences, ee = e.onConnectedMediaUsagesChange, R = e.onConnectedMediaEdgeRemove, ye = e.catalogCache, ke = Number(
    fe?.release?.id || fe?.project.release_id || 0
  ), Ee = Number(e.assetCateId || 0), M = C(
    () => xt(
      _e,
      Ie.filter((t) => t.id !== e.id)
    ),
    [Ie, _e, e.id]
  ), S = e.type === "power" && tr(e.power, e.kind, e.outputType)?.viewMode === "storyboard";
  J(() => {
    if (A === "power" && (me || he)) {
      const t = y.current.selectedTargetId || 0;
      let a = !1;
      return Se(!0), ye.loadPowerForm(
        {
          projectId: n,
          releaseId: ke,
          flowId: we,
          powerId: me,
          powerKey: he,
          targetId: t
        },
        () => st({
          projectId: n,
          flowId: we,
          powerId: me,
          powerKey: he,
          targetId: t
        })
      ).then((c) => {
        if (a)
          return;
        const d = y.current, h = yt(
          d,
          c,
          M.current,
          S
        );
        Pe(c), ue(
          xe(c) && (c.selected_target_id || t) || 0
        ), ce(
          ct(c.params || [], d)
        ), F(d.prompt || ""), _(h.content), W(h.references), ae(d.storyboardWorkType || "short"), pe(d.multiImageMode);
      }).catch((c) => {
        a || se.error(
          c instanceof Error ? c.message : "加载能力参数失败"
        );
      }).finally(() => {
        a || Se(!1);
      }), () => {
        a = !0;
      };
    }
    if (Pe(null), A === "agent") {
      const t = y.current;
      ce(t.paramValues || {}), F(t.prompt || ""), _(t.promptContent), W(t.storyboardReferences || []), ae(t.storyboardWorkType || "short"), pe(void 0), ue(0);
      return;
    }
    ce({}), ue(0), F(""), _(void 0), W([]), ae("short"), pe(void 0);
  }, [
    ye,
    n,
    ke,
    we,
    Le,
    Te,
    A,
    me,
    he
  ]);
  const k = P?.params || Pr, j = C(
    () => it({
      node: e,
      content: m,
      items: M.current,
      connections: I,
      params: k,
      values: N,
      requestedMode: Z
    }),
    [
      M,
      I,
      e,
      N,
      k,
      m,
      Z
    ]
  ), V = j.active ? j.mode : void 0, te = !!D.current && D.current !== w ? y.current.multiImageMode || Z || V : p.multiImageMode || V, U = C(
    () => $e(
      k,
      N,
      I.map((t) => t.source),
      V
    ),
    [
      I,
      N,
      k,
      V
    ]
  ), $ = C(
    () => ze(k, U),
    [U, k]
  ), be = C(
    () => $.filter(
      (t) => Jt(t, k) && !(j.active && Ht(t))
    ),
    [$, j.active, k]
  ), ge = C(
    () => A === "power" ? je($) : [],
    [$, A]
  ), o = C(
    () => S ? cr(
      q,
      P?.storyboard_reference_purposes || []
    ) : [],
    [S, P, q]
  ), b = A === "power" && ["image", "video"].includes(Qt(e) || ""), Y = C(
    () => A === "power" && !Q ? Ye(
      I,
      m,
      M.current,
      ge,
      {},
      b,
      V
    ) : "",
    [
      M,
      I,
      ge,
      Q,
      m,
      b,
      A,
      V
    ]
  ), Ve = C(
    () => S && !Q ? P ? ir(
      L,
      q,
      P.storyboard_work_types,
      P.storyboard_reference_purposes
    ) : "分镜作品类型与参考用途配置加载失败，请重新打开节点后重试" : "",
    [
      S,
      P,
      Q,
      L,
      q
    ]
  ), re = de || j.error || Y || Ve, x = C(
    () => $.find(Xt) || null,
    [$]
  ), Pt = C(
    () => be.filter(
      (t) => t.key !== x?.key && (Fe(t) || ht(t) || Ge(t, k))
    ),
    [be, k, x?.key]
  ), ne = x ? String(U[x.key] ?? "") : z, It = String(
    P?.power?.description || e.power?.description || ""
  ).trim() || (x ? "在此处为该能力输入生成提示词..." : "当前能力无需填写提示词"), Oe = xe(P), oe = Oe ? Ke : 0;
  J(() => {
    if (A !== "power" && A !== "agent")
      return;
    const t = y.current, a = De.current, c = yt(
      t,
      a,
      M.current,
      S
    );
    F(t.prompt || ""), _(c.content), W(c.references), ae(t.storyboardWorkType || "short"), pe(t.multiImageMode), ue(
      A === "power" && xe(a) && (t.selectedTargetId || a?.selected_target_id) || 0
    ), ce(
      A === "power" && a ? ct(
        a.params || [],
        t
      ) : t.paramValues || {}
    );
  }, [w, A]);
  const ve = K(
    (t, a) => {
      const c = Object.prototype.hasOwnProperty.call(
        t,
        "promptContent"
      ) ? t.promptContent : m, d = Ft({
        ...y.current,
        ...t,
        promptContent: c,
        ...S ? {} : {
          storyboardReferences: [],
          storyboardWorkType: void 0
        }
      });
      y.current = d;
      const h = ot(
        nt(d)
      );
      return D.current = h === w ? "" : h, pe(d.multiImageMode), i(e.id, d, a), d;
    },
    [
      S,
      w,
      e.id,
      i,
      m
    ]
  ), ie = K(
    (t, a, c) => (ce(t), ve(
      { ...a, paramValues: t },
      c
    )),
    [ve]
  );
  J(() => {
    U !== N && ie(U, {
      prompt: ne,
      promptContent: m,
      selectedTargetId: oe,
      multiImageMode: te
    });
  }, [
    oe,
    U,
    N,
    ne,
    m,
    ie,
    te
  ]);
  function kt(t, a) {
    const c = Be(m) !== Be(a), d = c ? Re(
      m,
      a,
      M.current,
      ge,
      I,
      V
    ) : { content: a, assignments: {} }, h = d.content;
    Object.keys(d.assignments).length > 0 && ee?.(d.assignments), F(t);
    const v = S && c ? Ue(
      h,
      L,
      M.current,
      t,
      q,
      P?.storyboard_reference_purposes || []
    ) : {
      content: h,
      references: L
    };
    _(v.content), W(v.references);
    const O = y.current.paramValues || N, G = x ? { ...O, [x.key]: t } : O;
    ie(G, {
      prompt: t,
      promptContent: v.content,
      selectedTargetId: oe,
      storyboardReferences: v.references,
      storyboardWorkType: S ? q : void 0,
      multiImageMode: te
    });
  }
  function Rt(t) {
    const a = Ue(
      m,
      L,
      M.current,
      ne,
      t,
      P?.storyboard_reference_purposes || []
    );
    ae(t), _(a.content), W(a.references), ve({
      prompt: ne,
      promptContent: a.content,
      paramValues: N,
      selectedTargetId: oe,
      storyboardReferences: a.references,
      storyboardWorkType: t,
      multiImageMode: te
    });
  }
  function Mt(t, a) {
    const c = {
      ...y.current.paramValues || N,
      [t]: a
    }, d = k.find((v) => v.key === t), h = V;
    if (d && Ge(d, k)) {
      const v = je(
        ze(k, c)
      ), O = Re(
        m,
        m,
        M.current,
        v,
        I,
        h
      );
      Object.keys(O.assignments).length > 0 && ee?.(O.assignments), _(O.content), ie(c, {
        prompt: ne,
        promptContent: O.content,
        selectedTargetId: oe,
        multiImageMode: te
      });
      return;
    }
    ie(c, {
      prompt: ne,
      promptContent: m,
      selectedTargetId: oe,
      multiImageMode: te
    });
  }
  function Nt(t) {
    const a = j.options.find(
      (G) => G.value === t
    );
    if (!j.active || !a?.enabled) {
      se.error(a?.reason || "当前能力不支持该多图生成方式");
      return;
    }
    const c = y.current.paramValues || N, d = $e(
      k,
      c,
      I.map((G) => G.source),
      t
    ), h = je(
      ze(k, d)
    ), v = Re(
      m,
      m,
      M.current,
      h,
      I,
      t
    ), O = Ye(
      I,
      v.content,
      M.current,
      h,
      v.assignments,
      b,
      t
    );
    O && se.error(O), Object.keys(v.assignments).length > 0 && ee?.(v.assignments), _(v.content), ie(
      d,
      {
        prompt: ne,
        promptContent: v.content,
        selectedTargetId: oe,
        storyboardReferences: L,
        multiImageMode: t
      },
      { save: "immediate" }
    );
  }
  function St(t, a) {
    F(t), _(a), ve({
      prompt: t,
      promptContent: a,
      paramValues: y.current.paramValues || N,
      selectedTargetId: 0
    });
  }
  function Dt(t, a) {
    const c = {
      ...y.current.paramValues || N,
      [t]: a
    };
    ie(c, {
      prompt: z,
      selectedTargetId: 0
    });
  }
  async function Ze(t, a) {
    const c = await Ut({
      projectID: n,
      teamID: Number(fe?.project.team_id || 0),
      files: t,
      ruleID: a.upload_rule_id
    });
    for (const d of c) {
      const h = Bt(d.asset);
      h.id && l?.(h);
    }
    return c;
  }
  async function _t(t) {
    if (!(E || !Oe) && !(e.type !== "power" || !e.power))
      try {
        const a = await ye.loadPowerForm(
          {
            projectId: n,
            releaseId: ke,
            flowId: e.flow?.id || 0,
            powerId: e.power.id,
            powerKey: e.power.key,
            targetId: t
          },
          () => st({
            projectId: n,
            flowId: e.flow?.id || 0,
            powerId: e.power?.id || 0,
            powerKey: e.power?.key || "",
            targetId: t
          })
        ), c = a.params || [], d = Zt(
          c,
          y.current.paramValues || N,
          P?.params || []
        ), h = it({
          node: e,
          content: m,
          items: M.current,
          connections: I,
          params: c,
          values: d,
          requestedMode: Z || V
        }), v = h.active ? h.mode : void 0;
        if (h.error) {
          se.error(`无法切换能力来源：${h.error}`);
          return;
        }
        const O = $e(
          c,
          d,
          I.map((Et) => Et.source),
          v
        ), G = je(
          ze(c, O)
        ), le = Re(
          m,
          m,
          M.current,
          G,
          I,
          v
        ), Ae = Ye(
          I,
          le.content,
          M.current,
          G,
          le.assignments,
          b,
          v
        );
        if (Ae) {
          se.error(`无法切换能力来源：${Ae}`);
          return;
        }
        Object.keys(le.assignments).length > 0 && ee?.(le.assignments), Pe(a);
        const tt = xe(a) ? a.selected_target_id || t : 0;
        ue(tt), _(le.content), ie(O, {
          prompt: ne,
          promptContent: le.content,
          selectedTargetId: tt,
          multiImageMode: v
        });
      } catch (a) {
        se.error(a instanceof Error ? a.message : "加载能力参数失败");
      }
  }
  const Tt = async (t, a) => {
    u([e.id]), Ce(!0);
    try {
      if (e.type === "power" && e.power) {
        const c = y.current, d = Object.prototype.hasOwnProperty.call(
          c,
          "promptContent"
        ) ? c.promptContent : a, h = c.storyboardWorkType || q, v = S ? Ue(
          d,
          c.storyboardReferences || L,
          M.current,
          t,
          h,
          P?.storyboard_reference_purposes || []
        ) : {
          content: d,
          references: c.storyboardReferences || []
        }, O = V, G = {
          ...$e(
            k,
            c.paramValues || U,
            I.map((Ae) => Ae.source),
            O
          )
        };
        x && (G[x.key] = t);
        const le = ve({
          ...c,
          prompt: t,
          promptContent: v.content,
          paramValues: G,
          selectedTargetId: oe,
          storyboardReferences: v.references,
          storyboardWorkType: S ? h : void 0,
          multiImageMode: O
        });
        await f({
          ...e,
          composerDraft: le
        }), se.success("能力节点执行成功");
        return;
      }
      if (e.type === "agent" && e.role) {
        const c = y.current, d = ve({
          ...c,
          prompt: t,
          promptContent: Object.prototype.hasOwnProperty.call(
            c,
            "promptContent"
          ) ? c.promptContent : a,
          paramValues: c.paramValues || N,
          selectedTargetId: 0
        });
        await f({
          ...e,
          composerDraft: d
        });
        return;
      }
      throw new Error("当前节点缺少可运行配置");
    } catch (c) {
      se.error(c instanceof Error ? c.message : "执行出错");
    } finally {
      Ce(!1);
    }
  }, et = async (t, a) => {
    if (!E) {
      if (re) {
        se.error(re);
        return;
      }
      await Tt(t, a);
    }
  };
  return e.type === "power" ? /* @__PURE__ */ r(
    "div",
    {
      className: "ws-node-bottom-settings is-composer nodrag nowheel",
      onClick: (t) => t.stopPropagation(),
      style: ft,
      children: Q && !E && !P ? /* @__PURE__ */ T("div", { className: "ws-prompt-loading", children: [
        /* @__PURE__ */ r(gt, { size: 16, className: "ws-spin" }),
        /* @__PURE__ */ r("span", { children: "正在加载能力参数..." })
      ] }) : /* @__PURE__ */ r(
        pt,
        {
          value: ne,
          referenceContent: m,
          placeholder: It,
          running: E,
          textInputEnabled: !!x,
          showMediaParamButtons: !0,
          mediaParamPower: P?.power || e.power,
          sourceOptions: Oe ? P?.sources || [] : [],
          selectedSourceId: oe,
          params: Pt,
          paramValues: U,
          assetLibrary: M,
          assetReference: {
            teamID: Number(fe?.project.team_id || 0),
            projectID: n,
            assetCateID: Ee
          },
          connectedMediaReferences: I,
          mediaUsageOptions: ge,
          referenceUsageOptions: S ? o : void 0,
          referenceUsageField: S ? "purpose" : "usage",
          multiImagePlan: j,
          multiImageMode: V,
          toolbarContent: S ? ({ openKey: t, onToggle: a }) => /* @__PURE__ */ r(
            Cr,
            {
              value: q,
              options: P?.storyboard_work_types || [],
              disabled: Q || E,
              openKey: t,
              onToggle: a,
              onChange: Rt
            }
          ) : void 0,
          onConnectedMediaEdgeRemove: R,
          disabled: Q,
          submitDisabled: !!re,
          submitDisabledReason: re,
          onChange: kt,
          onParamChange: Mt,
          onMultiImageModeChange: Nt,
          onSourceChange: Oe ? (t) => {
            _t(t);
          } : void 0,
          onLocalUpload: Ze,
          onSubmit: et
        }
      )
    }
  ) : /* @__PURE__ */ r(
    "div",
    {
      className: "ws-node-bottom-settings is-composer nodrag nowheel",
      onClick: (t) => t.stopPropagation(),
      style: ft,
      children: /* @__PURE__ */ r(
        pt,
        {
          value: z,
          referenceContent: m,
          placeholder: "向智能体发送任务指令...",
          running: E,
          params: kr,
          paramValues: N,
          assetLibrary: M,
          assetReference: {
            teamID: Number(fe?.project.team_id || 0),
            projectID: n,
            assetCateID: Ee
          },
          connectedMediaReferences: I,
          onConnectedMediaEdgeRemove: R,
          onChange: St,
          onParamChange: Dt,
          onLocalUpload: Ze,
          onSubmit: et
        }
      )
    }
  );
}
export {
  zr as CanvasNodeSettings
};
