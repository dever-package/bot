if (!window.DeverFront?.ensureStyles) {
  throw new Error("Dever front runtime does not support chunk styles");
}
await window.DeverFront.ensureStyles([new URL("./space-storyboard-view-VOsjM4rT.css", import.meta.url).href]);
import { a as c, j as n, F as ie } from "./preloadable-B6QZqbLd.js";
import { s as ut } from "./space-story-setting-reference-HUiOpGO8.js";
import { u as se, a as C, b as R, d as L, l as mt } from "./file-kind-Cq3pESGF.js";
import { L as pt, B as ht, r as Ye, ag as ft, n as ze } from "./vendor-icons-IZIW7U43.js";
import { v as gt, w as Oe, x as ce, o as yt, y as Te, m as Ce, z as vt, S as bt, A as Ee, B as St, i as wt, u as Ie, C as _t, n as Rt, r as Nt, D as Me } from "./asset-preview-CF7Cok8_.js";
import { o as De, a as oe, m as Ot } from "./space-content-view-BZ7HjOCd.js";
import { k as Tt } from "./writing-reference-Co5JVp43.js";
import { u as qe, C as Ct } from "./space-reference-editor-w61sPoRQ.js";
import { a as Et, S as It } from "./space-storyboard-material-dialog-C5YkhxaY.js";
import { B as Be } from "./asset-audio-preview-CWf3Wq_n.js";
import { c as Mt, S as Dt } from "./space-storyboard-shot-request-D_x0u-ae.js";
/* empty css                               */
function xe({
  storyboard: r,
  editable: l,
  onChange: s
}) {
  const a = r.screenplay;
  return a ? /* @__PURE__ */ c("section", { className: "ws-screenplay", children: [
    /* @__PURE__ */ n("p", { children: "系统按本章正文自动拆分场景，再生成镜头；这里可以对照原文查看剧本。" }),
    a.parts.map((o, p) => /* @__PURE__ */ c("article", { children: [
      /* @__PURE__ */ c("strong", { children: [
        p + 1,
        ". ",
        o.title
      ] }),
      /* @__PURE__ */ c("small", { children: [
        "原文第 ",
        o.source_start,
        "—",
        o.source_end,
        " 段 ·",
        " ",
        o.connection === "reset" ? "换场" : o.connection === "match" ? "同场换机位" : "动作接续"
      ] }),
      l ? /* @__PURE__ */ n(
        "textarea",
        {
          className: "nodrag nopan nowheel",
          "aria-label": o.title,
          value: o.description,
          onChange: (h) => s?.({
            ...r,
            screenplay: {
              ...a,
              parts: a.parts.map(
                (E, I) => I === p ? { ...E, description: h.target.value } : E
              )
            }
          })
        }
      ) : /* @__PURE__ */ n("p", { children: o.description }),
      /* @__PURE__ */ c("details", { children: [
        /* @__PURE__ */ n("summary", { children: "对照原文" }),
        /* @__PURE__ */ n("p", { children: a.source_passages.slice(o.source_start - 1, o.source_end).map((h) => h.text).join("") })
      ] })
    ] }, p))
  ] }) : null;
}
function Bt({
  storyboard: r,
  referenceItems: l,
  workType: s,
  purposeSpecs: a,
  editable: o,
  disabled: p,
  onChange: h
}) {
  const E = qe(l);
  if (r.references.length === 0)
    return null;
  const I = (m, Y, S = !1) => {
    let v = S ? Fe(r, m) : r;
    if (v = {
      ...v,
      references: v.references.map(
        (w) => w.key === m ? { ...w, ...Y } : w
      )
    }, S) {
      const w = v.references.find((j) => j.key === m), f = w ? Ae(v, w, a) : [];
      f.length === 1 && (v = Pe(v, m, f[0].value));
    }
    h(v);
  };
  return /* @__PURE__ */ c("section", { className: "ws-storyboard-references", "aria-label": "参考素材", children: [
    /* @__PURE__ */ c("header", { children: [
      /* @__PURE__ */ n(pt, { size: 14 }),
      /* @__PURE__ */ n("strong", { children: "参考素材" }),
      /* @__PURE__ */ c("span", { children: [
        r.references.length,
        " 项"
      ] })
    ] }),
    /* @__PURE__ */ n("div", { className: "ws-storyboard-reference-list", children: r.references.map((m) => {
      const Y = Ae(
        r,
        m,
        a
      ), S = At(r, m.key), v = gt(
        m.kind,
        s,
        a
      ), w = v.some(
        (f) => f.value === m.purpose
      );
      return /* @__PURE__ */ c(
        "div",
        {
          className: `ws-storyboard-reference-row ${w ? "" : "is-invalid"}`,
          children: [
            /* @__PURE__ */ n(
              Ct,
              {
                className: "ws-storyboard-reference-asset",
                value: `@${m.label}`,
                content: xt(m),
                adapter: E
              }
            ),
            o ? /* @__PURE__ */ c(ie, { children: [
              /* @__PURE__ */ c(
                "select",
                {
                  className: "nodrag nopan",
                  value: m.purpose,
                  disabled: p,
                  "aria-label": `${m.label}的参考用途`,
                  onChange: (f) => I(
                    m.key,
                    {
                      purpose: f.target.value
                    },
                    !0
                  ),
                  children: [
                    w ? null : /* @__PURE__ */ c("option", { value: m.purpose, children: [
                      Oe(
                        m.purpose,
                        a
                      ),
                      "（当前类型不支持）"
                    ] }),
                    v.map((f) => /* @__PURE__ */ n("option", { value: f.value, children: f.label }, f.value))
                  ]
                }
              ),
              $e(
                m.purpose,
                a
              ) ? /* @__PURE__ */ c(
                "select",
                {
                  className: "nodrag nopan",
                  value: S,
                  disabled: p,
                  "aria-label": `${m.label}的关联目标`,
                  onChange: (f) => h(
                    Pe(
                      r,
                      m.key,
                      f.target.value
                    )
                  ),
                  children: [
                    /* @__PURE__ */ n("option", { value: "", children: "选择关联目标" }),
                    Y.map((f) => /* @__PURE__ */ n("option", { value: f.value, children: f.label }, f.value))
                  ]
                }
              ) : /* @__PURE__ */ n("span", { className: "ws-storyboard-reference-global", children: ke(
                m.purpose,
                a
              ) })
            ] }) : /* @__PURE__ */ c(ie, { children: [
              /* @__PURE__ */ n("span", { className: "ws-storyboard-reference-purpose", children: Oe(
                m.purpose,
                a
              ) }),
              /* @__PURE__ */ n("span", { className: "ws-storyboard-reference-target", children: Pt(r, S) || ($e(
                m.purpose,
                a
              ) ? "未关联" : ke(
                m.purpose,
                a
              )) })
            ] })
          ]
        },
        m.key
      );
    }) })
  ] });
}
function xt(r) {
  return {
    version: 1,
    parts: [
      {
        type: "reference",
        ref_type: "asset",
        ref_id: r.asset_id,
        label: r.label,
        purpose: r.purpose,
        ref_trigger: "@",
        ref_version_id: r.version_id
      }
    ]
  };
}
function Ae(r, l, s) {
  const a = ce(
    l.purpose,
    s
  );
  return a?.scope === "material" ? r.materials.filter((o) => o.type === a.material_type).map((o) => ({
    value: `material:${o.id}`,
    label: o.name
  })) : a?.scope === "shot" ? r.shots.map((o, p) => ({
    value: `shot:${o.id}`,
    label: `镜头 ${o.order || p + 1}`
  })) : [];
}
function At(r, l) {
  const s = r.materials.find(
    (o) => o.reference_keys.includes(l)
  );
  if (s)
    return `material:${s.id}`;
  const a = r.shots.find(
    (o) => o.reference_keys.includes(l)
  );
  return a ? `shot:${a.id}` : "";
}
function Pt(r, l) {
  const [s, a] = l.split(":", 2);
  if (s === "material")
    return r.materials.find((o) => o.id === a)?.name || "";
  if (s === "shot") {
    const o = r.shots.findIndex((p) => p.id === a);
    return o >= 0 ? `镜头 ${r.shots[o].order || o + 1}` : "";
  }
  return "";
}
function Pe(r, l, s) {
  const a = Fe(r, l);
  if (!s)
    return a;
  const [o, p] = s.split(":", 2);
  return o === "material" ? {
    ...a,
    materials: a.materials.map(
      (h) => h.id === p ? {
        ...h,
        reference_keys: [...h.reference_keys, l]
      } : h
    )
  } : o === "shot" ? {
    ...a,
    shots: a.shots.map(
      (h) => h.id === p ? { ...h, reference_keys: [...h.reference_keys, l] } : h
    )
  } : a;
}
function Fe(r, l) {
  return {
    ...r,
    materials: r.materials.map((s) => ({
      ...s,
      reference_keys: s.reference_keys.filter(
        (a) => a !== l
      )
    })),
    shots: r.shots.map((s) => ({
      ...s,
      reference_keys: s.reference_keys.filter((a) => a !== l)
    }))
  };
}
function $e(r, l) {
  const s = ce(r, l)?.scope;
  return s === "material" || s === "shot";
}
function ke(r, l) {
  const s = ce(r, l);
  if (!s)
    return "用途无效";
  switch (s.scope) {
    case "composition":
      return "合成应用";
    case "context":
      return "上下文参考";
    default:
      return "全局应用";
  }
}
const $t = [], kt = [], Lt = [], Yt = [];
function rr({
  storyboard: r,
  editable: l = !1,
  disabled: s = !1,
  onSave: a,
  onChange: o,
  onConfirm: p,
  onCreateRevision: h,
  onGenerateShot: E,
  onSaveShotEdit: I,
  promptVersion: m,
  productionGroups: Y,
  workflowAction: S = "",
  saveStatus: v,
  showSaveStatus: w = !0,
  showMetrics: f = !0,
  referenceItems: j = $t,
  storyboardSourceNodeId: Ue = "",
  canvasNodes: Ve = kt,
  canvasEdges: je = [],
  workTypeSpecs: Je = Lt,
  purposeSpecs: Xe = Yt,
  focus: y,
  renderWorkspace: M
}) {
  const J = se(
    () => JSON.stringify(r),
    [r]
  ), [He, le] = C(r), [de, z] = C("saved"), [G, O] = C(""), [Z, D] = C(null), [ue, me] = C(""), [Qe, W] = C(""), [K, ee] = C([]), [Ge, Ze] = C(
    "before"
  ), X = R(null), te = R(""), B = R([]), pe = R(/* @__PURE__ */ new Map()), x = R(/* @__PURE__ */ new Map()), re = R(r), H = R(!1), q = R(0), he = R(J), N = R(null), fe = R(Promise.resolve()), F = R(!0), A = !!o, i = A ? r : He, ge = Je.find(
    (e) => e.key === i.work_type
  )?.name, Q = yt(i), T = ut(Ve, je, Ue), ye = l && !s && !Q && !!(o || a), g = ye && !S, ve = g && !A && !!a, We = qe(j), ae = i.materials.find(
    (e) => e.id === G
  ), P = ae || Z, Ke = P ? Te(i, P.id) : void 0, et = se(
    () => De(i.shots, K, (e) => e.id),
    [i.shots, K]
  ), tt = se(
    () => i.shots.some(
      (e) => e.speech.some(
        (t) => t.kind === "narration" && !!t.text.trim()
      )
    ),
    [i.shots]
  );
  L(() => (F.current = !0, () => {
    F.current = !1, N.current && window.clearTimeout(N.current);
  }), []), L(
    () => () => {
      for (const e of x.current.values())
        e.cancel();
      x.current.clear();
    },
    []
  ), mt(() => {
    const e = pe.current, t = X.current;
    if (!t || e.size === 0)
      return;
    const d = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    t.querySelectorAll(
      ".ws-storyboard-shot-row[data-sequence-item-id]"
    ).forEach((u) => {
      if (u.dataset.dragging === "true")
        return;
      const b = u.dataset.sequenceItemId || "", $ = e.get(b);
      if (!$ || d)
        return;
      const ne = u.getBoundingClientRect(), U = $.left - ne.left, k = $.top - ne.top;
      if (Math.abs(U) < 1 && Math.abs(k) < 1)
        return;
      x.current.get(b)?.cancel();
      const V = u.animate(
        [
          { transform: `translate3d(${U}px, ${k}px, 0)` },
          { transform: "translate3d(0, 0, 0)" }
        ],
        {
          duration: 190,
          easing: "cubic-bezier(0.2, 0.75, 0.25, 1)"
        }
      );
      x.current.set(b, V), V.onfinish = () => {
        x.current.get(b) === V && x.current.delete(b);
      };
    }), e.clear();
  }, [K]), L(() => {
    he.current !== J && (he.current = J, !H.current && (re.current = r, le(r), z("saved")));
  }, [J, r]), L(() => {
    G && !ae && O("");
  }, [ae, G]), L(() => {
    if (!y)
      return;
    if (y.materialId && i.materials.some((t) => t.id === y.materialId)) {
      D(null), O(y.materialId);
      return;
    }
    if (y.addMaterial && y.materialType && g && !T) {
      O(""), D(Ce(i.materials, y.materialType));
      return;
    }
    if (y.section === "materials") return;
    const e = window.requestAnimationFrame(() => {
      const t = y.shotId ? '[data-sequence-item-id="' + CSS.escape(y.shotId) + '"]' : ".ws-storyboard-shot-list";
      X.current?.querySelector(t)?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(e);
  }, [y?.addMaterial, y?.materialId, y?.materialType, y?.section, y?.shotId]), L(() => {
    if (!ve || !H.current || !a)
      return;
    N.current && window.clearTimeout(N.current);
    const e = i, t = q.current;
    return N.current = window.setTimeout(() => {
      N.current = null, fe.current = fe.current.catch(() => {
      }).then(async () => {
        F.current && t === q.current && z("saving");
        try {
          if (await a(e), !F.current || t !== q.current)
            return;
          H.current = !1, z("saved");
        } catch {
          if (!F.current || t !== q.current)
            return;
          z("error");
        }
      });
    }, 800), () => {
      N.current && (window.clearTimeout(N.current), N.current = null);
    };
  }, [ve, i, a]);
  const be = (e, t) => zt(
    Rt(Nt(e, t)),
    We.options
  ), _ = (e) => {
    if (!g)
      return;
    const t = A ? r : re.current, d = be(t, e(t));
    if (re.current = d, A) {
      o?.(d);
      return;
    }
    H.current = !0, q.current += 1, le(d), z("typing");
  }, Se = () => {
    const e = X.current;
    if (!e)
      return;
    const t = /* @__PURE__ */ new Map();
    e.querySelectorAll(
      ".ws-storyboard-shot-row[data-sequence-item-id]"
    ).forEach((d) => {
      const u = d.dataset.sequenceItemId || "";
      u && t.set(u, d.getBoundingClientRect());
    }), pe.current = t;
  }, rt = (e) => {
    const t = i.shots.map((d) => d.id);
    te.current = e, B.current = t, me(e), W(""), ee(t);
  }, at = (e, t) => {
    const d = te.current, u = B.current;
    if (!d || !e || d === e || !u.length || !u.includes(d) || !u.includes(e))
      return;
    const b = t.currentTarget.getBoundingClientRect(), U = ((t.currentTarget.parentElement?.clientWidth || 0) > b.width * 2 ? t.clientX < b.left + b.width / 2 : t.clientY < b.top + b.height / 2) ? "before" : "after", k = Ot(
      u,
      d,
      e,
      U,
      (V) => V
    );
    W(e), Ze(U), !oe(u, k) && (Se(), B.current = k, ee(k));
  }, we = () => {
    const e = B.current, t = i.shots.map((d) => d.id);
    e.length > 0 && !oe(e, t) && Se(), te.current = "", B.current = [], me(""), W(""), ee([]);
  }, nt = () => {
    const e = B.current;
    e.length > 0 && _((t) => {
      const d = De(t.shots, e, (u) => u.id);
      return oe(
        t.shots.map((u) => u.id),
        d.map((u) => u.id)
      ) ? t : { ...t, shots: d };
    }), we();
  }, st = (e) => {
    _((t) => {
      const d = t.materials.some((u) => u.id === e.id);
      return {
        ...t,
        materials: d ? t.materials.map(
          (u) => u.id === e.id ? e : u
        ) : [...t.materials, e]
      };
    }), O(""), D(null);
  }, ot = (e) => {
    O(""), D(Ce(i.materials, e));
  }, it = (e) => {
    const t = Te(i, e);
    t.shotIds.length || t.speechIds.length || (_((d) => ({
      ...d,
      materials: d.materials.filter((u) => u.id !== e)
    })), O(""), D(null));
  }, ct = (e) => {
    _((t) => t.shots.length <= 1 ? t : {
      ...t,
      shots: t.shots.filter((d) => d.id !== e)
    });
  }, lt = (e) => {
    _((t) => {
      if (t.shots.length >= Ie)
        return t;
      const d = Ft(t.shots, e), u = t.shots.findIndex(($) => $.id === e.id), b = [...t.shots];
      return b.splice(u + 1, 0, d), { ...t, shots: b };
    });
  };
  if (i.screenplay && !i.shots.length)
    return /* @__PURE__ */ c("section", { className: "ws-storyboard is-editable", "aria-label": "章节剧本", children: [
      /* @__PURE__ */ c("header", { className: "ws-storyboard-toolbar", children: [
        /* @__PURE__ */ c("strong", { children: [
          i.title,
          " · 剧本"
        ] }),
        /* @__PURE__ */ n(
          Le,
          {
            status: A ? v || "saved" : de
          }
        ),
        g && p && /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "ws-storyboard-command is-primary",
            disabled: s || !!S,
            onClick: () => {
              p();
            },
            children: "继续生成分镜"
          }
        )
      ] }),
      /* @__PURE__ */ n(
        xe,
        {
          storyboard: i,
          editable: g && !s,
          onChange: (e) => _(() => e)
        }
      )
    ] });
  const _e = i.screenplay ? /* @__PURE__ */ c("details", { className: "ws-storyboard-chapter", children: [
    /* @__PURE__ */ n("summary", { children: "本章剧本" }),
    /* @__PURE__ */ n(xe, { storyboard: i, editable: !1 })
  ] }) : null, Re = /* @__PURE__ */ c("div", { className: "ws-storyboard-summary", "aria-label": "脚本基本信息", children: [
    /* @__PURE__ */ c("section", { className: "ws-storyboard-overview", children: [
      /* @__PURE__ */ c("header", { children: [
        /* @__PURE__ */ n(ht, { size: 14 }),
        /* @__PURE__ */ n("strong", { children: "内容简介" }),
        ge ? /* @__PURE__ */ n("span", { className: "ws-storyboard-work-type", children: ge }) : null
      ] }),
      /* @__PURE__ */ n("p", { children: vt(i) })
    ] }),
    /* @__PURE__ */ c("div", { className: "ws-storyboard-creative-settings", children: [
      /* @__PURE__ */ n(
        Bt,
        {
          storyboard: i,
          referenceItems: j,
          editable: g,
          disabled: s,
          workType: i.work_type,
          purposeSpecs: Xe,
          onChange: (e) => _(() => e)
        }
      ),
      /* @__PURE__ */ c("section", { className: "ws-storyboard-basic-settings", children: [
        M && /* @__PURE__ */ n("h3", { className: "ws-storyboard-visual-settings-title", children: "画面设置" }),
        T && /* @__PURE__ */ n("p", { children: "画风、画幅及人物形象由画布上的“设定”统一管理，各章共用。" }),
        /* @__PURE__ */ c("div", { className: "ws-storyboard-global-settings", children: [
          /* @__PURE__ */ c("label", { children: [
            /* @__PURE__ */ n("strong", { children: /* @__PURE__ */ n(Be, { label: "写实影像包含真人、摄影和超写实；非写实影像包含动画、插画、漫画、卡通 3D、水墨等", children: /* @__PURE__ */ n("span", { children: "画面类型" }) }) }),
            g && !T ? /* @__PURE__ */ n(
              "select",
              {
                className: "nodrag nopan",
                value: i.visual_mode,
                disabled: s,
                onChange: (e) => _((t) => ({
                  ...t,
                  visual_mode: e.target.value
                })),
                children: bt.map((e) => /* @__PURE__ */ n("option", { value: e, children: Ee[e] }, e))
              }
            ) : /* @__PURE__ */ n("span", { children: Ee[i.visual_mode] })
          ] }),
          /* @__PURE__ */ c("label", { children: [
            /* @__PURE__ */ n("strong", { children: "画幅" }),
            g && !T ? /* @__PURE__ */ n(
              "select",
              {
                className: "nodrag nopan",
                value: i.aspect_ratio,
                disabled: s,
                onChange: (e) => _((t) => ({
                  ...t,
                  aspect_ratio: e.target.value
                })),
                children: St.map((e) => /* @__PURE__ */ n("option", { value: e, children: e }, e))
              }
            ) : /* @__PURE__ */ n("span", { children: i.aspect_ratio })
          ] }),
          tt || i.narrator_voice ? /* @__PURE__ */ c("label", { className: "ws-storyboard-setting-wide", children: [
            /* @__PURE__ */ n("strong", { children: "旁白音色" }),
            g ? /* @__PURE__ */ n(
              "input",
              {
                className: "nodrag nopan",
                value: i.narrator_voice,
                placeholder: "自动配音时必填",
                disabled: s,
                onChange: (e) => _((t) => ({
                  ...t,
                  narrator_voice: e.target.value
                }))
              }
            ) : /* @__PURE__ */ n("span", { children: i.narrator_voice || "未配置" })
          ] }) : null,
          /* @__PURE__ */ c("div", { className: "ws-storyboard-style", children: [
            /* @__PURE__ */ n("strong", { children: "统一视觉风格" }),
            g && !T ? /* @__PURE__ */ n(
              "textarea",
              {
                className: "nodrag nopan nowheel",
                "aria-label": "统一视觉风格",
                rows: 3,
                value: i.style_prompt,
                placeholder: "可选，整部作品保持一致的画面风格",
                disabled: s,
                onChange: (e) => _(
                  (t) => _t(
                    t,
                    e.target.value
                  )
                )
              }
            ) : /* @__PURE__ */ n(Be, { label: i.style_prompt, children: /* @__PURE__ */ n("span", { children: i.style_prompt || "未设置统一视觉风格" }) })
          ] })
        ] })
      ] })
    ] })
  ] }), Ne = /* @__PURE__ */ n(
    "section",
    {
      ref: X,
      className: `ws-storyboard ${g ? "is-editable" : "is-readonly"}`,
      "aria-label": "分镜脚本",
      children: /* @__PURE__ */ c("div", { className: "ws-storyboard-layout", children: [
        !M && Re,
        /* @__PURE__ */ c("div", { className: "ws-storyboard-main", children: [
          /* @__PURE__ */ n("header", { className: "ws-storyboard-toolbar", children: /* @__PURE__ */ c("div", { className: "ws-storyboard-toolbar-end", children: [
            M && /* @__PURE__ */ n("h2", { className: "ws-storyboard-list-title", children: "镜头列表" }),
            f || g && w ? /* @__PURE__ */ c("div", { className: "ws-storyboard-toolbar-meta", children: [
              f ? /* @__PURE__ */ c("span", { children: [
                i.shots.length,
                " 个镜头 ·",
                " ",
                wt(i),
                " 秒 · ",
                i.aspect_ratio
              ] }) : null,
              g && w ? /* @__PURE__ */ n(
                Le,
                {
                  status: A ? v || "saved" : de
                }
              ) : null
            ] }) : null,
            Q && h ? /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "ws-storyboard-command",
                disabled: s || !!S,
                onClick: () => {
                  h();
                },
                children: [
                  S === "revising" ? /* @__PURE__ */ n(Ye, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ n(ft, { size: 13 }),
                  S === "revising" ? "创建中" : "创建修订稿"
                ]
              }
            ) : !Q && g && p ? /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "ws-storyboard-command is-primary",
                onClick: () => {
                  p();
                },
                children: [
                  /* @__PURE__ */ n(ze, { size: 13 }),
                  "确认脚本"
                ]
              }
            ) : null
          ] }) }),
          !M && _e,
          /* @__PURE__ */ n(
            Et,
            {
              shots: et,
              storyboard: i,
              groups: Y,
              promptVersion: m,
              onSave: g ? async (e, t) => {
                if (JSON.stringify(i) !== JSON.stringify(t))
                  throw new Error("分镜已有新改动，请重新打开此镜");
                I ? await I(be(i, e)) : _(() => e);
              } : void 0,
              onCreateRevision: Q ? h : void 0,
              onGenerate: ye && E && (!S || S === "generating_shot") ? (e, t) => E(i, e, t) : void 0,
              rowActions: g ? (e) => ({
                dragging: ue === e.id,
                dropPlacement: Qe === e.id && ue !== e.id ? Ge : void 0,
                onDuplicate: i.shots.length < Ie ? () => lt(e) : void 0,
                onRemove: i.shots.length > 1 ? () => ct(e.id) : void 0,
                onDragStart: () => rt(e.id),
                onDragOver: (t) => at(e.id, t),
                onDrop: nt,
                onDragEnd: we
              }) : void 0
            }
          )
        ] })
      ] })
    }
  ), dt = {
    defaultType: y?.materialType,
    materials: T ? void 0 : i.materials,
    materialActions: g && !T ? {
      disabled: s,
      onEdit: (e) => O(e.id),
      onAdd: ot
    } : void 0
  };
  return /* @__PURE__ */ c(ie, { children: [
    M ? M(Ne, dt, /* @__PURE__ */ c("div", { className: "ws-storyboard ws-storyboard-layout", children: [
      Re,
      _e
    ] })) : Ne,
    P ? /* @__PURE__ */ n(
      It,
      {
        material: P,
        creating: !!Z,
        readonly: !g || !!T,
        usage: Ke,
        existingNames: i.materials.filter((e) => e.id !== P.id).map((e) => e.name),
        onSave: st,
        onRemove: it,
        onClose: () => {
          O(""), D(null);
        }
      },
      `${Z ? "create" : "edit"}:${P.id}`
    ) : null
  ] });
}
function zt(r, l) {
  return {
    ...r,
    shots: r.shots.map((s) => {
      const a = { ...s.reference_contents || {} };
      for (const o of Dt) {
        const p = Tt(
          s[o] || "",
          a[o],
          l
        );
        p ? a[o] = p : delete a[o];
      }
      return { ...s, reference_contents: a };
    })
  };
}
function Le({ status: r }) {
  return /* @__PURE__ */ c("span", { className: `ws-storyboard-save-state is-${r}`, children: [
    r === "saving" ? /* @__PURE__ */ n(Ye, { size: 12, className: "ws-spin" }) : r === "saved" ? /* @__PURE__ */ n(ze, { size: 12 }) : null,
    r === "typing" ? "编辑中" : r === "saving" ? "保存中" : r === "error" ? "保存失败" : "已保存"
  ] });
}
function qt(r) {
  const l = new Set(r.map((o) => o.id));
  let s = r.length, a = Me(s);
  for (; l.has(a.id); )
    s += 1, a = Me(s);
  return a;
}
function Ft(r, l) {
  const s = qt(r);
  return {
    ...Mt(l),
    id: s.id,
    order: s.order,
    speech: l.speech.map((a, o) => ({
      ...a,
      id: `${s.id}-speech-${o + 1}`
    })),
    captions: l.captions.map((a, o) => ({
      ...a,
      id: `${s.id}-caption-${o + 1}`
    }))
  };
}
export {
  rr as StoryboardView
};
