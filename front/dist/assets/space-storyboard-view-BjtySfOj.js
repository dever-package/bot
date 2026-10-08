import { j as e, a, F as qe } from "./react-CDpwMNlY.js";
import { a as S, b as X, u as Ce, e as z, l as Bt } from "./file-kind-DFeonxO2.js";
import { a as lt } from "./preloadable-B6OSmL0f.js";
import { X as ct, h as Ve, n as xe, L as zt, aG as Lt, B as je, P as Ie, r as $e, w as Pt, q as dt, ae as At, c as Ft, au as He, av as Qe, y as Ut } from "./vendor-icons-Cz5zFzlk.js";
import { S as le, B as Z, K as Yt, L as Ze, M as Ge, N as qt, O as Vt, P as jt, Q as ut, t as ht, j as mt, i as Gt, R as Je, T as Wt, U as Xt, V as Ke, W as Ht, e as Qt, X as Ae, Y as Zt, Z as Jt, _ as Kt, $ as en, a0 as tn, s as et, a1 as nn, a2 as an, d as rn, a3 as sn, a4 as on, a5 as ln, a6 as tt, a7 as cn, a8 as nt, a9 as dn, aa as un } from "./node-detail-content-DEcv8fc7.js";
import { o as at, s as Fe, m as hn, K as mn } from "./space-sequence-card-B8s1aEtn.js";
import { u as pt, a as pn, b as bn } from "./space-reference-editor-DIXNeCSO.js";
import { a as fn } from "./space-storyboard-shot-card-DP3WELdX.js";
import { s as gn, S as vn } from "./space-storyboard-confirm-dialog-F_zhiFye.js";
function yn({
  material: n,
  creating: s = !1,
  readonly: c,
  usage: i,
  existingNames: o = [],
  portalContainer: d,
  onSave: p,
  onRemove: C,
  onClose: R
}) {
  const [b, A] = S(n.name), [M, u] = S(n.prompt), [f, w] = S(n.voice), [D, J] = S(!1), O = b.trim().replace(/^[@#]+/, ""), I = M.trim(), $ = o.some(
    (k) => k.trim().toLocaleLowerCase() === O.toLocaleLowerCase()
  ), ne = (i?.shotIds.length || 0) + (i?.speechIds.length || 0), q = !s && !c && !!C && ne === 0, H = le[n.type];
  X(() => {
    function k(x) {
      x.key === "Escape" && (x.preventDefault(), R());
    }
    return window.addEventListener("keydown", k), () => window.removeEventListener("keydown", k);
  }, [R]);
  const V = /* @__PURE__ */ e(
    "div",
    {
      className: "ws-storyboard-shot-backdrop ws-storyboard-material-backdrop",
      onMouseDown: R,
      children: /* @__PURE__ */ a(
        "section",
        {
          className: "ws-storyboard-shot-dialog ws-storyboard-material-dialog",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": `${s ? "新增" : c ? "查看" : "编辑"}${H}素材 ${n.name}`,
          onMouseDown: (k) => k.stopPropagation(),
          children: [
            /* @__PURE__ */ a("header", { children: [
              /* @__PURE__ */ a("div", { children: [
                /* @__PURE__ */ e("strong", { children: s ? `新增${H}` : n.name || H }),
                /* @__PURE__ */ a("span", { children: [
                  H,
                  "素材",
                  c ? " · 当前版本只读" : s ? " · 保存后加入当前分镜草稿" : " · 修改会保存到当前分镜草稿"
                ] })
              ] }),
              /* @__PURE__ */ e(Z, { label: "关闭", children: /* @__PURE__ */ e("button", { type: "button", "aria-label": "关闭", onClick: R, children: /* @__PURE__ */ e(ct, { size: 18 }) }) })
            ] }),
            /* @__PURE__ */ a("div", { className: "ws-storyboard-material-form nowheel", children: [
              /* @__PURE__ */ a("label", { children: [
                /* @__PURE__ */ e("span", { children: "素材名称" }),
                /* @__PURE__ */ e(
                  "input",
                  {
                    value: b,
                    readOnly: c,
                    autoFocus: !c,
                    placeholder: `例如：${n.type === "character" ? "主角" : n.type === "scene" ? "咖啡馆" : "红色雨伞"}`,
                    onChange: (k) => A(k.target.value)
                  }
                ),
                $ ? /* @__PURE__ */ e("small", { className: "ws-storyboard-form-error", children: "素材名称不能重复，否则画布引用无法准确定位。" }) : null
              ] }),
              /* @__PURE__ */ a("label", { children: [
                /* @__PURE__ */ e("span", { children: "生成提示词" }),
                /* @__PURE__ */ e(
                  "textarea",
                  {
                    value: M,
                    readOnly: c,
                    placeholder: `描述${O || H}的外观、结构、材质与风格`,
                    onChange: (k) => u(k.target.value)
                  }
                )
              ] }),
              n.type === "character" ? /* @__PURE__ */ a("label", { children: [
                /* @__PURE__ */ e("span", { children: "配音音色参数值" }),
                /* @__PURE__ */ e(
                  "input",
                  {
                    value: f,
                    readOnly: c,
                    placeholder: "自动配音时必填",
                    onChange: (k) => w(k.target.value)
                  }
                ),
                /* @__PURE__ */ e("small", { children: "填写当前语音能力支持的音色值。" })
              ] }) : null,
              !s && ne > 0 ? /* @__PURE__ */ a("div", { className: "ws-storyboard-material-usage", role: "note", children: [
                /* @__PURE__ */ e("strong", { children: "当前素材正在使用" }),
                /* @__PURE__ */ a("span", { children: [
                  i?.shotIds.length || 0,
                  " 个镜头",
                  i?.speechIds.length ? ` · ${i.speechIds.length} 条对白` : "",
                  "。请先在对应镜头中取消关联或更换对白角色，再删除素材。"
                ] })
              ] }) : null,
              /* @__PURE__ */ e("p", { children: "保存分镜版本后，未被手动覆盖的对应素材节点会同步更新；已经生成的后续内容需要重新执行。" })
            ] }),
            /* @__PURE__ */ a("footer", { children: [
              /* @__PURE__ */ e("div", { children: !c && !s && C ? /* @__PURE__ */ e(
                Z,
                {
                  label: ne > 0 ? "该素材仍被镜头或对白引用" : D ? "再次点击确认删除" : "删除素材",
                  children: /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      className: "is-danger",
                      disabled: !q,
                      onClick: () => {
                        if (!D) {
                          J(!0);
                          return;
                        }
                        C(n.id);
                      },
                      children: [
                        /* @__PURE__ */ e(Ve, { size: 14 }),
                        D ? "确认删除" : "删除素材"
                      ]
                    }
                  )
                }
              ) : null }),
              /* @__PURE__ */ a("div", { children: [
                /* @__PURE__ */ e("button", { type: "button", onClick: R, children: c ? "关闭" : "取消" }),
                c ? null : /* @__PURE__ */ a(
                  "button",
                  {
                    type: "button",
                    className: "is-primary",
                    disabled: !O || !I || $,
                    onClick: () => p({
                      ...n,
                      name: O,
                      prompt: I,
                      voice: n.type === "character" ? f.trim() : ""
                    }),
                    children: [
                      /* @__PURE__ */ e(xe, { size: 14 }),
                      s ? "添加素材" : "确认修改"
                    ]
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
  return typeof document > "u" ? null : lt(V, d || document.body);
}
function _n({
  storyboard: n,
  referenceItems: s,
  workType: c,
  purposeSpecs: i,
  editable: o,
  disabled: d,
  onChange: p
}) {
  const C = pt(s);
  if (n.references.length === 0)
    return null;
  const R = (b, A, M = !1) => {
    let u = M ? bt(n, b) : n;
    if (u = {
      ...u,
      references: u.references.map(
        (f) => f.key === b ? { ...f, ...A } : f
      )
    }, M) {
      const f = u.references.find((D) => D.key === b), w = f ? rt(u, f, i) : [];
      w.length === 1 && (u = st(u, b, w[0].value));
    }
    p(u);
  };
  return /* @__PURE__ */ a("section", { className: "ws-storyboard-references", "aria-label": "参考素材", children: [
    /* @__PURE__ */ a("header", { children: [
      /* @__PURE__ */ e(zt, { size: 14 }),
      /* @__PURE__ */ e("strong", { children: "参考素材" }),
      /* @__PURE__ */ a("span", { children: [
        n.references.length,
        " 项"
      ] })
    ] }),
    /* @__PURE__ */ e("div", { className: "ws-storyboard-reference-list", children: n.references.map((b) => {
      const A = rt(
        n,
        b,
        i
      ), M = Nn(n, b.key), u = Yt(
        b.kind,
        c,
        i
      ), f = u.some(
        (w) => w.value === b.purpose
      );
      return /* @__PURE__ */ a(
        "div",
        {
          className: `ws-storyboard-reference-row ${f ? "" : "is-invalid"}`,
          children: [
            /* @__PURE__ */ e(
              pn,
              {
                className: "ws-storyboard-reference-asset",
                value: `@${b.label}`,
                content: wn(b),
                adapter: C
              }
            ),
            o ? /* @__PURE__ */ a(qe, { children: [
              /* @__PURE__ */ a(
                "select",
                {
                  className: "nodrag nopan",
                  value: b.purpose,
                  disabled: d,
                  "aria-label": `${b.label}的参考用途`,
                  onChange: (w) => R(
                    b.key,
                    {
                      purpose: w.target.value
                    },
                    !0
                  ),
                  children: [
                    f ? null : /* @__PURE__ */ a("option", { value: b.purpose, children: [
                      Ze(
                        b.purpose,
                        i
                      ),
                      "（当前类型不支持）"
                    ] }),
                    u.map((w) => /* @__PURE__ */ e("option", { value: w.value, children: w.label }, w.value))
                  ]
                }
              ),
              it(
                b.purpose,
                i
              ) ? /* @__PURE__ */ a(
                "select",
                {
                  className: "nodrag nopan",
                  value: M,
                  disabled: d,
                  "aria-label": `${b.label}的关联目标`,
                  onChange: (w) => p(
                    st(
                      n,
                      b.key,
                      w.target.value
                    )
                  ),
                  children: [
                    /* @__PURE__ */ e("option", { value: "", children: "选择关联目标" }),
                    A.map((w) => /* @__PURE__ */ e("option", { value: w.value, children: w.label }, w.value))
                  ]
                }
              ) : /* @__PURE__ */ e("span", { className: "ws-storyboard-reference-global", children: ot(
                b.purpose,
                i
              ) })
            ] }) : /* @__PURE__ */ a(qe, { children: [
              /* @__PURE__ */ e("span", { className: "ws-storyboard-reference-purpose", children: Ze(
                b.purpose,
                i
              ) }),
              /* @__PURE__ */ e("span", { className: "ws-storyboard-reference-target", children: Sn(n, M) || (it(
                b.purpose,
                i
              ) ? "未关联" : ot(
                b.purpose,
                i
              )) })
            ] })
          ]
        },
        b.key
      );
    }) })
  ] });
}
function wn(n) {
  return {
    version: 1,
    parts: [
      {
        type: "reference",
        ref_type: "asset",
        ref_id: n.asset_id,
        label: n.label,
        purpose: n.purpose,
        ref_trigger: "@",
        ref_version_id: n.version_id
      }
    ]
  };
}
function rt(n, s, c) {
  const i = Ge(
    s.purpose,
    c
  );
  return i?.scope === "material" ? n.materials.filter((o) => o.type === i.material_type).map((o) => ({
    value: `material:${o.id}`,
    label: o.name
  })) : i?.scope === "shot" ? n.shots.map((o, d) => ({
    value: `shot:${o.id}`,
    label: `镜头 ${o.order || d + 1}`
  })) : [];
}
function Nn(n, s) {
  const c = n.materials.find(
    (o) => o.reference_keys.includes(s)
  );
  if (c)
    return `material:${c.id}`;
  const i = n.shots.find(
    (o) => o.reference_keys.includes(s)
  );
  return i ? `shot:${i.id}` : "";
}
function Sn(n, s) {
  const [c, i] = s.split(":", 2);
  if (c === "material")
    return n.materials.find((o) => o.id === i)?.name || "";
  if (c === "shot") {
    const o = n.shots.findIndex((d) => d.id === i);
    return o >= 0 ? `镜头 ${n.shots[o].order || o + 1}` : "";
  }
  return "";
}
function st(n, s, c) {
  const i = bt(n, s);
  if (!c)
    return i;
  const [o, d] = c.split(":", 2);
  return o === "material" ? {
    ...i,
    materials: i.materials.map(
      (p) => p.id === d ? {
        ...p,
        reference_keys: [...p.reference_keys, s]
      } : p
    )
  } : o === "shot" ? {
    ...i,
    shots: i.shots.map(
      (p) => p.id === d ? { ...p, reference_keys: [...p.reference_keys, s] } : p
    )
  } : i;
}
function bt(n, s) {
  return {
    ...n,
    materials: n.materials.map((c) => ({
      ...c,
      reference_keys: c.reference_keys.filter(
        (i) => i !== s
      )
    })),
    shots: n.shots.map((c) => ({
      ...c,
      reference_keys: c.reference_keys.filter((i) => i !== s)
    }))
  };
}
function it(n, s) {
  const c = Ge(n, s)?.scope;
  return c === "material" || c === "shot";
}
function ot(n, s) {
  const c = Ge(n, s);
  if (!c)
    return "用途无效";
  switch (c.scope) {
    case "composition":
      return "合成应用";
    case "context":
      return "上下文参考";
    default:
      return "全局应用";
  }
}
function Cn({
  storyboard: n,
  sourceNodeId: s,
  canvasNodes: c
}) {
  const i = ft(n, s, c);
  return /* @__PURE__ */ e("div", { className: "ws-storyboard-board", "aria-label": "画面预览", children: i.map(
    ({ shot: o, start: d, end: p, singleRole: C, references: R, emptyLabel: b }) => /* @__PURE__ */ a("article", { className: "ws-storyboard-board-frame", children: [
      /* @__PURE__ */ a("header", { children: [
        /* @__PURE__ */ e("strong", { children: String(o.order).padStart(2, "0") }),
        /* @__PURE__ */ a("span", { children: [
          o.duration,
          " 秒"
        ] }),
        /* @__PURE__ */ e("span", { children: On(o) })
      ] }),
      R ? /* @__PURE__ */ e(
        "div",
        {
          className: `ws-storyboard-frame-media is-reference-group${R.length <= 1 ? " is-single" : ""}`,
          style: { aspectRatio: Ue(n) },
          children: (R.length ? R : [d]).map(
            (A, M) => /* @__PURE__ */ e(
              Ee,
              {
                shot: o,
                media: A,
                label: `参考图 ${M + 1}`,
                emptyLabel: "参考图待生成"
              },
              `${o.id}:reference:${M}`
            )
          )
        }
      ) : p ? /* @__PURE__ */ a(
        "div",
        {
          className: "ws-storyboard-frame-media is-paired",
          style: { aspectRatio: Ue(n) },
          children: [
            /* @__PURE__ */ e(
              Ee,
              {
                shot: o,
                media: d,
                frameRole: "start",
                label: "首帧"
              }
            ),
            /* @__PURE__ */ e(
              Ee,
              {
                shot: o,
                media: p,
                frameRole: "end",
                label: "尾帧"
              }
            )
          ]
        }
      ) : /* @__PURE__ */ e(
        "div",
        {
          className: "ws-storyboard-frame-media",
          style: { aspectRatio: Ue(n) },
          children: /* @__PURE__ */ e(
            Ee,
            {
              shot: o,
              media: d,
              frameRole: C,
              label: C === "end" ? "尾帧" : void 0,
              emptyLabel: b
            }
          )
        }
      ),
      /* @__PURE__ */ a("div", { className: "ws-storyboard-frame-copy", children: [
        /* @__PURE__ */ e("strong", { children: o.beat }),
        /* @__PURE__ */ e("span", { children: o.camera_instruction || "固定机位" }),
        /* @__PURE__ */ a("div", { className: "ws-storyboard-frame-continuity", children: [
          /* @__PURE__ */ a("p", { children: [
            /* @__PURE__ */ e("b", { children: "入" }),
            /* @__PURE__ */ e("span", { children: o.continuity_state.entry })
          ] }),
          /* @__PURE__ */ a("p", { children: [
            /* @__PURE__ */ e("b", { children: "出" }),
            /* @__PURE__ */ e("span", { children: o.continuity_state.exit })
          ] })
        ] }),
        /* @__PURE__ */ e(
          Rn,
          {
            start: d,
            end: p,
            references: R
          }
        )
      ] })
    ] }, o.id)
  ) });
}
function Rn({
  start: n,
  end: s,
  references: c
}) {
  const i = n.node?.runError || s?.node?.runError || c?.find((o) => o.node?.runError)?.node?.runError || "";
  return i ? /* @__PURE__ */ e("small", { children: i }) : null;
}
function In(n, s, c) {
  return ft(n, s, c).some(
    (i) => !!(i.start.imageURL || i.end?.imageURL || i.references?.some((o) => o.imageURL))
  );
}
function ft(n, s, c) {
  const i = /* @__PURE__ */ new Map();
  for (const o of c) {
    const d = o.storyboardItem;
    if (d?.sourceNodeId === s && d.itemType === "shot_image" && d.shotId) {
      const p = i.get(d.shotId) || {};
      if (qt(d.shotImageMode) === "references") {
        p.referenceNode = o, i.set(d.shotId, p);
        continue;
      }
      const C = Vt(
        d.frameMediaItems
      );
      if (C.length)
        for (const R of C)
          p[R.frameRole] = {
            node: o,
            mediaIndex: R.mediaIndex
          };
      else
        p[jt(d.frameRole)] = {
          node: o,
          mediaIndex: 1
        };
      i.set(d.shotId, p);
    }
  }
  return n.shots.map((o) => {
    const d = i.get(o.id), p = ut(o);
    return p.nodeMode === "references" ? {
      shot: o,
      start: Re(),
      references: kn(d?.referenceNode)
    } : p.nodeMode === "last_frame" ? {
      shot: o,
      start: Re(d?.end),
      singleRole: "end"
    } : p.nodeMode === "none" ? {
      shot: o,
      start: Re(),
      emptyLabel: o.continue_previous ? "沿用上一镜尾帧" : "无需参考图"
    } : {
      shot: o,
      start: Re(d?.start),
      ...d?.end ? { end: Re(d.end) } : {}
    };
  });
}
function kn(n) {
  const s = n ? ht(n) : void 0;
  return (s ? mt(s, "image") : []).slice(0, 4).map((i) => ({ node: n, imageURL: i }));
}
function Re(n) {
  const s = n ? ht(n.node) : void 0;
  return {
    node: n?.node,
    imageURL: s ? Mn(s, n?.mediaIndex || 1) : ""
  };
}
function Mn(n, s) {
  const c = n && typeof n == "object" && !Array.isArray(n) ? n : void 0, i = c?.meta && typeof c.meta == "object" && !Array.isArray(c.meta) ? c.meta : void 0, d = (Array.isArray(i?.items) ? i.items : []).find((C) => !C || typeof C != "object" || Array.isArray(C) ? !1 : Number(C.order) === s);
  return String(d?.image || "").trim() || mt(n, "image")[s - 1] || "";
}
function Ee({
  shot: n,
  media: s,
  frameRole: c,
  label: i,
  emptyLabel: o
}) {
  const d = s.imageURL ? /* @__PURE__ */ e("a", { href: s.imageURL, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ e(
    "img",
    {
      src: s.imageURL,
      alt: `镜头 ${n.order}${i ? ` ${i}` : " 故事板"}`,
      loading: "lazy",
      decoding: "async"
    }
  ) }) : /* @__PURE__ */ a("div", { className: "ws-storyboard-frame-empty", children: [
    /* @__PURE__ */ e(Lt, { size: 22 }),
    /* @__PURE__ */ e("span", { children: o || Dn(n, s.node, c) })
  ] });
  return i ? /* @__PURE__ */ a("div", { className: "ws-storyboard-frame-slot", children: [
    /* @__PURE__ */ e("span", { className: "ws-storyboard-frame-role", children: i }),
    d
  ] }) : d;
}
function On(n) {
  return n.continue_previous ? "尾帧续接" : n.match_previous ? "画面匹配" : "新镜头";
}
function Dn(n, s, c) {
  return s?.runError ? "生成失败" : s ? "暂无结果" : c === "end" ? "尾帧待生成" : c === "start" && n.continue_previous ? "运行时取上一镜尾帧" : n.continue_previous ? "沿用上一镜尾帧" : "待生成";
}
function Ue(n) {
  return n.aspect_ratio.replace(":", " / ");
}
function En({
  hasPreview: n,
  previewMatchesInstruction: s,
  hasUnappliedInstruction: c,
  detailed: i,
  draftChangedManually: o
}) {
  return n ? s ? "preview" : "blocked" : i && (!c || o) ? "manual" : "blocked";
}
const Tn = [], $n = [], xn = [], Bn = [], zn = [
  {
    value: "independent",
    label: "独立切镜",
    description: "新构图或新状态"
  },
  {
    value: "match",
    label: "画面匹配",
    description: "沿用上一镜结束画面"
  },
  {
    value: "continue",
    label: "动作续接",
    description: "从上一段真实尾帧继续"
  }
];
function ra({
  storyboard: n,
  layout: s = "stacked",
  editable: c = !1,
  disabled: i = !1,
  onSave: o,
  onChange: d,
  onConfirm: p,
  onCreateRevision: C,
  onGenerateShot: R,
  workflowAction: b = "",
  saveStatus: A,
  showSaveStatus: M = !0,
  showMetrics: u = !0,
  referenceItems: f = Tn,
  storyboardSourceNodeId: w = "",
  canvasNodes: D = $n,
  workTypeSpecs: J = xn,
  purposeSpecs: O = Bn,
  focus: I
}) {
  const $ = Ce(
    () => JSON.stringify(n),
    [n]
  ), [ne, q] = S(n), [H, V] = S("saved"), [k, x] = S(""), [ye, E] = S(""), [ae, F] = S(null), [j, ce] = S("script"), [de, _e] = S(""), [ke, re] = S(""), [G, se] = S([]), [we, W] = S(
    "before"
  ), U = z(null), ue = U.current?.closest(".wb-detail-backdrop, .ws-page") || null, he = z(""), K = z([]), Me = z(/* @__PURE__ */ new Map()), B = z(/* @__PURE__ */ new Map()), Y = z(n), me = z(!1), ee = z(0), ie = z($), L = z(null), Oe = z(Promise.resolve()), oe = z(!0), t = !!d, r = t ? n : ne, h = J.find(
    (l) => l.key === r.work_type
  )?.name, y = Gt(r), v = c && !i && !y && !b && !!(d || o), N = v && !t && !!o, pe = pt(f), Q = r.shots.find((l) => l.id === k), Be = r.shots.findIndex(
    (l) => l.id === k
  ), yt = Be > 0 ? r.shots[Be - 1] : void 0, ze = r.materials.find(
    (l) => l.id === ye
  ), be = ze || ae, _t = be ? Je(r, be.id) : void 0, wt = Ce(
    () => at(r.shots, G, (l) => l.id),
    [r.shots, G]
  ), Le = Ce(
    () => gn(r, {
      coreOnly: !0,
      workTypeSpecs: J,
      purposeSpecs: O
    }),
    [r, O, J]
  ), Nt = Le.some(
    (l) => l.severity === "error"
  ), St = (l) => {
    if (l.materialId) {
      x(""), F(null), E(l.materialId);
      return;
    }
    l.shotId && (E(""), F(null), x(l.shotId));
  }, De = Ce(
    () => !!w && In(r, w, D),
    [D, r, w]
  ), Ct = Ce(
    () => r.shots.some(
      (l) => l.speech.some(
        (m) => m.kind === "narration" && !!m.text.trim()
      )
    ),
    [r.shots]
  );
  X(() => (oe.current = !0, () => {
    oe.current = !1, L.current && window.clearTimeout(L.current);
  }), []), X(
    () => () => {
      for (const l of B.current.values())
        l.cancel();
      B.current.clear();
    },
    []
  ), Bt(() => {
    const l = Me.current, m = U.current;
    if (!m || l.size === 0)
      return;
    const _ = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    m.querySelectorAll(
      ".ws-storyboard-card[data-sequence-item-id]"
    ).forEach((g) => {
      if (g.classList.contains("is-dragging"))
        return;
      const T = g.dataset.sequenceItemId || "", te = l.get(T);
      if (!te || _)
        return;
      const Pe = g.getBoundingClientRect(), Ne = te.left - Pe.left, fe = te.top - Pe.top;
      if (Math.abs(Ne) < 1 && Math.abs(fe) < 1)
        return;
      B.current.get(T)?.cancel();
      const Se = g.animate(
        [
          { transform: `translate3d(${Ne}px, ${fe}px, 0)` },
          { transform: "translate3d(0, 0, 0)" }
        ],
        {
          duration: 190,
          easing: "cubic-bezier(0.2, 0.75, 0.25, 1)"
        }
      );
      B.current.set(T, Se), Se.onfinish = () => {
        B.current.get(T) === Se && B.current.delete(T);
      };
    }), l.clear();
  }, [G]), X(() => {
    ie.current !== $ && (ie.current = $, !me.current && (Y.current = n, q(n), V("saved")));
  }, [$, n]), X(() => {
    k && !Q && x("");
  }, [Q, k]), X(() => {
    ye && !ze && E("");
  }, [ze, ye]), X(() => {
    !De && j === "board" && ce("script");
  }, [j, De]), X(() => {
    if (!I)
      return;
    if (I.materialId && r.materials.some((m) => m.id === I.materialId)) {
      F(null), x(""), E(I.materialId);
      return;
    }
    if (I.shotId && r.shots.some((m) => m.id === I.shotId)) {
      F(null), E(""), x(I.shotId);
      return;
    }
    const l = window.requestAnimationFrame(() => {
      const m = I.materialType ? `[data-storyboard-material-type="${I.materialType}"]` : I.section === "materials" ? ".ws-storyboard-material-settings" : ".ws-storyboard-grid";
      U.current?.querySelector(m)?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
    return () => window.cancelAnimationFrame(l);
  }, [I?.materialId, I?.materialType, I?.section, I?.shotId]), X(() => {
    if (!N || !me.current || !o)
      return;
    L.current && window.clearTimeout(L.current);
    const l = r, m = ee.current;
    return L.current = window.setTimeout(() => {
      L.current = null, Oe.current = Oe.current.catch(() => {
      }).then(async () => {
        oe.current && m === ee.current && V("saving");
        try {
          if (await o(l), !oe.current || m !== ee.current)
            return;
          me.current = !1, V("saved");
        } catch {
          if (!oe.current || m !== ee.current)
            return;
          V("error");
        }
      });
    }, 800), () => {
      L.current && (window.clearTimeout(L.current), L.current = null);
    };
  }, [N, r, o]);
  const P = (l) => {
    if (!v)
      return;
    const m = t ? n : Y.current, _ = l(m), g = An(
      Zt(Jt(m, _)),
      pe.options
    );
    if (Y.current = g, t) {
      d?.(g);
      return;
    }
    me.current = !0, ee.current += 1, q(g), V("typing");
  }, We = () => {
    const l = U.current;
    if (!l)
      return;
    const m = /* @__PURE__ */ new Map();
    l.querySelectorAll(
      ".ws-storyboard-card[data-sequence-item-id]"
    ).forEach((_) => {
      const g = _.dataset.sequenceItemId || "";
      g && m.set(g, _.getBoundingClientRect());
    }), Me.current = m;
  }, Rt = (l) => {
    const m = r.shots.map((_) => _.id);
    he.current = l, K.current = m, _e(l), re(""), se(m);
  }, It = (l, m) => {
    const _ = he.current, g = K.current;
    if (!_ || !l || _ === l || !g.length || !g.includes(_) || !g.includes(l))
      return;
    const T = m.currentTarget.getBoundingClientRect(), te = m.currentTarget.parentElement?.getBoundingClientRect(), Ne = !!(te && T.width * 1.5 < te.width) ? m.clientX < T.left + T.width / 2 ? "before" : "after" : m.clientY < T.top + T.height / 2 ? "before" : "after", fe = hn(
      g,
      _,
      l,
      Ne,
      (Se) => Se
    );
    re(l), W(Ne), !Fe(g, fe) && (We(), K.current = fe, se(fe));
  }, Xe = () => {
    const l = K.current, m = r.shots.map((_) => _.id);
    l.length > 0 && !Fe(l, m) && We(), he.current = "", K.current = [], _e(""), re(""), se([]);
  }, kt = () => {
    const l = K.current;
    l.length > 0 && P((m) => {
      const _ = at(m.shots, l, (g) => g.id);
      return Fe(
        m.shots.map((g) => g.id),
        _.map((g) => g.id)
      ) ? m : { ...m, shots: _ };
    }), Xe();
  }, Mt = (l, m) => {
    P((_) => ({
      ..._,
      materials: m,
      shots: _.shots.map((g) => g.id === l.id ? l : g)
    })), x("");
  }, Ot = (l) => {
    P((m) => {
      const _ = m.materials.some((g) => g.id === l.id);
      return {
        ...m,
        materials: _ ? m.materials.map(
          (g) => g.id === l.id ? l : g
        ) : [...m.materials, l]
      };
    }), E(""), F(null);
  }, Dt = (l) => {
    E(""), F(Kt(r.materials, l));
  }, Et = (l) => {
    const m = Je(r, l);
    m.shotIds.length || m.speechIds.length || (P((_) => ({
      ..._,
      materials: _.materials.filter((g) => g.id !== l)
    })), E(""), F(null));
  }, Tt = (l) => {
    P((m) => m.shots.length <= 1 ? m : {
      ...m,
      shots: m.shots.filter((_) => _.id !== l)
    });
  }, $t = (l) => {
    P((m) => {
      if (m.shots.length >= Ae)
        return m;
      const _ = Xn(m.shots, l), g = m.shots.findIndex((te) => te.id === l.id), T = [...m.shots];
      return T.splice(g + 1, 0, _), { ...m, shots: T };
    });
  }, xt = () => {
    P((l) => l.shots.length >= Ae ? l : {
      ...l,
      shots: [...l.shots, gt(l.shots)]
    });
  };
  return /* @__PURE__ */ a(
    "section",
    {
      ref: U,
      className: `ws-storyboard is-${s} ${v ? "is-editable" : "is-readonly"}`,
      "aria-label": "分镜脚本",
      children: [
        /* @__PURE__ */ a("div", { className: "ws-storyboard-layout", children: [
          /* @__PURE__ */ a("aside", { className: "ws-storyboard-sidebar", "aria-label": "脚本基本信息", children: [
            /* @__PURE__ */ a("section", { className: "ws-storyboard-overview", children: [
              /* @__PURE__ */ a("header", { children: [
                /* @__PURE__ */ e(je, { size: 14 }),
                /* @__PURE__ */ e("strong", { children: "内容简介" }),
                h ? /* @__PURE__ */ e("span", { className: "ws-storyboard-work-type", children: h }) : null
              ] }),
              /* @__PURE__ */ e("p", { children: Wt(r) })
            ] }),
            /* @__PURE__ */ a("div", { className: "ws-storyboard-creative-settings", children: [
              /* @__PURE__ */ e(
                _n,
                {
                  storyboard: r,
                  referenceItems: f,
                  editable: v,
                  disabled: i,
                  workType: r.work_type,
                  purposeSpecs: O,
                  onChange: (l) => P(() => l)
                }
              ),
              /* @__PURE__ */ e("section", { className: "ws-storyboard-basic-settings", children: /* @__PURE__ */ a("div", { className: "ws-storyboard-global-settings", children: [
                /* @__PURE__ */ a("label", { children: [
                  /* @__PURE__ */ e("strong", { children: /* @__PURE__ */ e(Z, { label: "写实影像包含真人、摄影和超写实；非写实影像包含动画、插画、漫画、卡通 3D、水墨等", children: /* @__PURE__ */ e("span", { children: "画面类型" }) }) }),
                  v ? /* @__PURE__ */ e(
                    "select",
                    {
                      className: "nodrag nopan",
                      value: r.visual_mode,
                      disabled: i,
                      onChange: (l) => P((m) => ({
                        ...m,
                        visual_mode: l.target.value
                      })),
                      children: Xt.map((l) => /* @__PURE__ */ e("option", { value: l, children: Ke[l] }, l))
                    }
                  ) : /* @__PURE__ */ e("span", { children: Ke[r.visual_mode] })
                ] }),
                /* @__PURE__ */ a("label", { children: [
                  /* @__PURE__ */ e("strong", { children: "画幅" }),
                  v ? /* @__PURE__ */ e(
                    "select",
                    {
                      className: "nodrag nopan",
                      value: r.aspect_ratio,
                      disabled: i,
                      onChange: (l) => P((m) => ({
                        ...m,
                        aspect_ratio: l.target.value
                      })),
                      children: Ht.map((l) => /* @__PURE__ */ e("option", { value: l, children: l }, l))
                    }
                  ) : /* @__PURE__ */ e("span", { children: r.aspect_ratio })
                ] }),
                Ct || r.narrator_voice ? /* @__PURE__ */ a("label", { className: "ws-storyboard-setting-wide", children: [
                  /* @__PURE__ */ e("strong", { children: "旁白音色" }),
                  v ? /* @__PURE__ */ e(
                    "input",
                    {
                      className: "nodrag nopan",
                      value: r.narrator_voice,
                      placeholder: "自动配音时必填",
                      disabled: i,
                      onChange: (l) => P((m) => ({
                        ...m,
                        narrator_voice: l.target.value
                      }))
                    }
                  ) : /* @__PURE__ */ e("span", { children: r.narrator_voice || "未配置" })
                ] }) : null,
                /* @__PURE__ */ a("div", { className: "ws-storyboard-style", children: [
                  /* @__PURE__ */ e("strong", { children: "统一视觉风格" }),
                  v ? /* @__PURE__ */ e(
                    "input",
                    {
                      className: "nodrag nopan",
                      value: r.style_prompt,
                      placeholder: "可选，整部作品保持一致的画面风格",
                      disabled: i,
                      onChange: (l) => P(
                        (m) => un(
                          m,
                          l.target.value
                        )
                      )
                    }
                  ) : /* @__PURE__ */ e(Z, { label: r.style_prompt, children: /* @__PURE__ */ e("span", { children: r.style_prompt || "未设置统一视觉风格" }) })
                ] })
              ] }) }),
              r.materials.length || v ? /* @__PURE__ */ e(
                Ln,
                {
                  materials: r.materials,
                  editable: v,
                  onOpen: E,
                  onCreate: Dt
                }
              ) : null
            ] })
          ] }),
          /* @__PURE__ */ a("main", { className: "ws-storyboard-main", children: [
            /* @__PURE__ */ e("header", { className: "ws-storyboard-toolbar", children: /* @__PURE__ */ a("div", { className: "ws-storyboard-toolbar-end", children: [
              De ? /* @__PURE__ */ a("div", { className: "ws-storyboard-view-tabs", role: "tablist", children: [
                /* @__PURE__ */ e(
                  "button",
                  {
                    type: "button",
                    role: "tab",
                    "aria-selected": j === "script",
                    className: j === "script" ? "is-active" : "",
                    onClick: () => ce("script"),
                    children: "分镜脚本"
                  }
                ),
                /* @__PURE__ */ e(
                  "button",
                  {
                    type: "button",
                    role: "tab",
                    "aria-selected": j === "board",
                    className: j === "board" ? "is-active" : "",
                    onClick: () => ce("board"),
                    children: "画面预览"
                  }
                )
              ] }) : null,
              u || v && M ? /* @__PURE__ */ a("div", { className: "ws-storyboard-toolbar-meta", children: [
                u ? /* @__PURE__ */ a("span", { children: [
                  r.shots.length,
                  " 个镜头 ·",
                  " ",
                  Qt(r),
                  " 秒 · ",
                  r.aspect_ratio
                ] }) : null,
                v && M ? /* @__PURE__ */ e(
                  Yn,
                  {
                    status: t ? A || "saved" : H
                  }
                ) : null
              ] }) : null,
              v ? /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command nodrag nopan",
                  disabled: i || r.shots.length >= Ae,
                  onClick: xt,
                  children: [
                    /* @__PURE__ */ e(Ie, { size: 13 }),
                    /* @__PURE__ */ e("span", { children: "添加镜头" })
                  ]
                }
              ) : null,
              y && C ? /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command",
                  disabled: i || !!b,
                  onClick: () => {
                    C();
                  },
                  children: [
                    b === "revising" ? /* @__PURE__ */ e($e, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ e(Pt, { size: 13 }),
                    b === "revising" ? "创建中" : "创建修订稿"
                  ]
                }
              ) : !y && v && p ? /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "ws-storyboard-command is-primary",
                  disabled: i || !!b || Nt,
                  onClick: () => {
                    p();
                  },
                  children: [
                    b === "confirming" ? /* @__PURE__ */ e($e, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ e(xe, { size: 13 }),
                    b === "confirming" ? "保存中" : "确认脚本"
                  ]
                }
              ) : null
            ] }) }),
            j === "script" && v && Le.length ? /* @__PURE__ */ e(
              vn,
              {
                issues: Le,
                onOpen: St
              }
            ) : null,
            j === "board" && De ? /* @__PURE__ */ e(
              Cn,
              {
                storyboard: r,
                sourceNodeId: w,
                canvasNodes: D
              }
            ) : /* @__PURE__ */ e("div", { className: "ws-storyboard-grid nowheel", children: r.shots.length ? wt.map((l, m) => /* @__PURE__ */ e(
              fn,
              {
                shot: l,
                index: m,
                storyboard: r,
                selected: k === l.id,
                editable: v,
                dragging: de === l.id,
                dropPlacement: ke === l.id && de !== l.id ? we : void 0,
                onOpen: () => x(l.id),
                onDuplicate: () => $t(l),
                onRemove: () => Tt(l.id),
                onDragStart: () => Rt(l.id),
                onDragOver: (_) => It(l.id, _),
                onDrop: kt,
                onDragEnd: Xe
              },
              l.id
            )) : /* @__PURE__ */ a("div", { className: "ws-storyboard-empty", children: [
              /* @__PURE__ */ e(je, { size: 26 }),
              /* @__PURE__ */ e("strong", { children: "暂无镜头" }),
              /* @__PURE__ */ e("span", { children: "添加第一个镜头后开始编排脚本" })
            ] }) })
          ] })
        ] }),
        Q ? /* @__PURE__ */ e(
          Pn,
          {
            shot: Q,
            index: Be,
            previousShot: yt,
            storyboard: r,
            materials: r.materials,
            readonly: !v,
            referenceAdapter: pe,
            portalContainer: ue,
            onEditMaterial: E,
            onGenerate: R,
            onSave: Mt,
            onClose: () => x("")
          },
          Q.id
        ) : null,
        be ? /* @__PURE__ */ e(
          yn,
          {
            material: be,
            creating: !!ae,
            readonly: !v,
            usage: _t,
            existingNames: r.materials.filter((l) => l.id !== be.id).map((l) => l.name),
            portalContainer: ue,
            onSave: Ot,
            onRemove: Et,
            onClose: () => {
              E(""), F(null);
            }
          },
          `${ae ? "create" : "edit"}:${be.id}`
        ) : null
      ]
    }
  );
}
function Ln({
  materials: n,
  editable: s,
  onOpen: c,
  onCreate: i
}) {
  return /* @__PURE__ */ a("section", { className: "ws-storyboard-material-settings", "aria-label": "素材设定", children: [
    /* @__PURE__ */ a("header", { children: [
      /* @__PURE__ */ e("strong", { children: "素材设定" }),
      s ? /* @__PURE__ */ e("div", { className: "ws-storyboard-material-add-actions", children: ["character", "scene", "prop"].map((o) => /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "nodrag nopan",
          onClick: () => i(o),
          children: [
            /* @__PURE__ */ e(Ie, { size: 11 }),
            le[o]
          ]
        },
        o
      )) }) : null
    ] }),
    /* @__PURE__ */ a("div", { className: "ws-storyboard-material-setting-list", children: [
      ["character", "scene", "prop"].map((o) => {
        const d = n.filter(
          (p) => p.type === o
        );
        return d.length ? /* @__PURE__ */ a(
          "div",
          {
            className: "ws-storyboard-material-setting-group",
            "data-storyboard-material-type": o,
            children: [
              /* @__PURE__ */ e("span", { children: le[o] }),
              d.map((p) => /* @__PURE__ */ e(
                Z,
                {
                  label: `${s ? "编辑" : "查看"}${le[o]}提示词：${p.name}`,
                  children: /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      className: "nodrag nopan",
                      onClick: () => c(p.id),
                      children: [
                        /* @__PURE__ */ e("span", { children: p.name }),
                        s ? /* @__PURE__ */ e(dt, { size: 11 }) : null
                      ]
                    }
                  )
                },
                p.id
              ))
            ]
          },
          o
        ) : null;
      }),
      n.length ? null : /* @__PURE__ */ e("span", { className: "ws-storyboard-material-setting-empty", children: "暂无角色、场景或道具" })
    ] })
  ] });
}
function Pn({
  shot: n,
  index: s,
  previousShot: c,
  storyboard: i,
  materials: o,
  readonly: d,
  referenceAdapter: p,
  portalContainer: C,
  onEditMaterial: R,
  onGenerate: b,
  onSave: A,
  onClose: M
}) {
  const [u, f] = S(() => vt(n)), w = z(u), [D, J] = S(() => o), [O, I] = S(!1), [$, ne] = S(d || !b), [q, H] = S(""), [V, k] = S(null), [x, ye] = S(
    null
  ), [E, ae] = S("");
  X(() => {
    J((t) => {
      const r = new Set(o.map((h) => h.id));
      return [
        ...o,
        ...t.filter((h) => !r.has(h.id))
      ];
    });
  }, [o]);
  const F = new Set(
    o.map((t) => t.id)
  ), j = D.filter(
    (t) => t.type === "character"
  ), ce = new Set(
    u.speech.filter((t) => t.kind === "dialogue").map((t) => t.character_id || "").filter(Boolean)
  ), de = en(u), _e = tn(u, s), ke = Vn(u), re = u.speech.some(
    (t) => t.start_time < 0 || t.start_time >= u.duration
  ), G = !u.continuity_state.entry.trim() || !u.continuity_state.exit.trim() || _e && u.continuity_state.entry.trim() !== c?.continuity_state.exit.trim() || s > 0 && (u.continue_previous && !u.continuity_anchor.trim() || u.continue_previous && u.match_previous), se = !u.beat.trim() || s > 0 && !u.transition.trim(), we = u.captions.some(
    (t) => !t.text.trim() || t.start_time < 0 || t.end_time <= t.start_time || t.end_time > u.duration
  ), W = V !== null, U = W && q.trim() === V, ue = !!q.trim() && !U, he = En({
    hasPreview: W,
    previewMatchesInstruction: U,
    hasUnappliedInstruction: ue,
    detailed: $,
    draftChangedManually: u !== (x || w.current)
  }), K = et(i, n).map((t) => t.name).join("、"), Me = et(
    { ...i, materials: D },
    u
  ).map((t) => t.name).join("、"), B = (t, r, h) => {
    f((y) => ({
      ...y,
      ...Un(y, t, r, h)
    }));
  }, Y = (t, r) => {
    f((h) => {
      const y = h.speech.map(
        (N) => N.id === t ? qn(N, r) : N
      ), v = y.filter((N) => N.kind === "dialogue").map((N) => N.character_id || "").filter(Boolean);
      return {
        ...h,
        material_ids: [.../* @__PURE__ */ new Set([...h.material_ids, ...v])],
        speech: y
      };
    });
  }, me = (t) => {
    f((r) => r.material_ids.includes(t) ? ce.has(t) ? r : {
      ...r,
      material_ids: r.material_ids.filter((h) => h !== t)
    } : {
      ...r,
      material_ids: [...r.material_ids, t]
    });
  }, ee = (t, r) => {
    f((h) => {
      const y = h.speech.findIndex(
        (Q) => Q.id === t
      ), v = y + r;
      if (y < 0 || v < 0 || v >= h.speech.length)
        return h;
      const N = [...h.speech], [pe] = N.splice(y, 1);
      return N.splice(v, 0, pe), { ...h, speech: N };
    });
  }, ie = (t, r) => {
    f((h) => ({
      ...h,
      captions: h.captions.map(
        (y) => y.id === t ? { ...y, ...r } : y
      )
    }));
  }, L = (t, r) => {
    f((h) => {
      const y = h.captions.findIndex(
        (Q) => Q.id === t
      ), v = y + r;
      if (y < 0 || v < 0 || v >= h.captions.length)
        return h;
      const N = [...h.captions], [pe] = N.splice(y, 1);
      return N.splice(v, 0, pe), { ...h, captions: N };
    });
  }, Oe = async (t) => {
    if (!b || O)
      return !1;
    ae(""), I(!0);
    try {
      const r = {
        ...i,
        materials: D,
        shots: i.shots.map(
          (v) => v.id === u.id ? u : v
        )
      }, h = await b(
        r,
        u.id,
        t.trim()
      );
      J(h.materials);
      const y = {
        ...h.shot,
        reference_contents: { ...u.reference_contents || {} }
      };
      return f(y), ye(y), k(t.trim()), !0;
    } catch (r) {
      return ae(
        r instanceof Error ? r.message : "生成镜头失败，请重试"
      ), !1;
    } finally {
      I(!1);
    }
  }, oe = /* @__PURE__ */ e(
    "div",
    {
      className: "ws-storyboard-shot-backdrop",
      "data-slot": "dialog-layer",
      onMouseDown: (t) => {
        t.target instanceof Element && t.target.closest('[data-assistant-layer="true"]') || O || M();
      },
      children: /* @__PURE__ */ a(
        "section",
        {
          className: `ws-storyboard-shot-dialog${$ ? "" : " is-quick"}`,
          "data-slot": "dialog-content",
          role: "dialog",
          "aria-modal": "true",
          "aria-busy": O,
          "aria-label": `${d ? "查看" : "编辑"}镜头 ${s + 1}`,
          onMouseDown: (t) => t.stopPropagation(),
          children: [
            /* @__PURE__ */ a("header", { children: [
              /* @__PURE__ */ a("div", { children: [
                /* @__PURE__ */ a("strong", { children: [
                  d ? "查看镜头" : "编辑镜头",
                  " ",
                  String(s + 1).padStart(2, "0")
                ] }),
                /* @__PURE__ */ e("span", { children: d ? "当前分镜已经确认" : "修改会保存到当前分镜草稿" })
              ] }),
              /* @__PURE__ */ e(Z, { label: "关闭", children: /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  "aria-label": "关闭",
                  disabled: O,
                  onClick: M,
                  children: /* @__PURE__ */ e(ct, { size: 18 })
                }
              ) })
            ] }),
            /* @__PURE__ */ a(
              "fieldset",
              {
                className: `ws-storyboard-shot-form nowheel${$ ? "" : " is-quick"}`,
                disabled: O,
                children: [
                  O ? /* @__PURE__ */ a("div", { className: "ws-storyboard-generation-mask", role: "status", children: [
                    /* @__PURE__ */ e($e, { size: 18, className: "ws-spin" }),
                    /* @__PURE__ */ e("span", { children: "正在生成镜头" })
                  ] }) : null,
                  !d && b ? /* @__PURE__ */ a("section", { className: "ws-storyboard-quick-edit", children: [
                    /* @__PURE__ */ a("div", { className: "ws-storyboard-quick-preview", children: [
                      /* @__PURE__ */ a("div", { children: [
                        /* @__PURE__ */ a("strong", { children: [
                          "原镜头 · ",
                          n.duration,
                          " 秒"
                        ] }),
                        /* @__PURE__ */ e("p", { children: n.description || "尚未填写镜头画面" }),
                        n.spatial_layout ? /* @__PURE__ */ a("small", { children: [
                          "空间：",
                          n.spatial_layout
                        ] }) : null,
                        /* @__PURE__ */ a("small", { children: [
                          "素材：",
                          K || "无"
                        ] })
                      ] }),
                      W ? /* @__PURE__ */ a("div", { children: [
                        /* @__PURE__ */ a("strong", { children: [
                          U ? "修改预览" : "上次预览",
                          " · ",
                          u.duration,
                          " 秒"
                        ] }),
                        /* @__PURE__ */ e("p", { children: u.description }),
                        u.spatial_layout ? /* @__PURE__ */ a("small", { children: [
                          "空间：",
                          u.spatial_layout
                        ] }) : null,
                        /* @__PURE__ */ a("small", { children: [
                          "素材：",
                          Me || "无"
                        ] })
                      ] }) : null
                    ] }),
                    /* @__PURE__ */ a("label", { children: [
                      /* @__PURE__ */ e("span", { children: "想怎么修改这个镜头" }),
                      /* @__PURE__ */ e(
                        "textarea",
                        {
                          className: "nodrag nopan nowheel",
                          value: q,
                          placeholder: "描述要调整的主体、动作、位置或镜头视角",
                          onChange: (t) => {
                            H(t.target.value), ae("");
                          }
                        }
                      )
                    ] }),
                    ue || W && !U ? /* @__PURE__ */ e("p", { className: "ws-storyboard-form-error", role: "status", children: W ? "当前修改要求与预览不一致，请重新生成后再保存。" : "修改要求未应用。请生成预览；也可以在详细编辑中手动调整原镜头。" }) : null,
                    E ? /* @__PURE__ */ e("p", { className: "ws-storyboard-form-error", role: "alert", children: E }) : null,
                    W && (de.size > 1 || re || se || G || we) ? /* @__PURE__ */ e("p", { className: "ws-storyboard-form-error", role: "alert", children: "修改结果未满足脚本要求，请重新生成或在详细编辑中调整。" }) : null,
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        disabled: O || !q.trim(),
                        onClick: () => {
                          Oe(q);
                        },
                        children: [
                          /* @__PURE__ */ e(At, { size: 14 }),
                          W ? "重新生成修改" : "生成修改"
                        ]
                      }
                    )
                  ] }) : null,
                  !d && b ? /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      className: "ws-storyboard-advanced-toggle",
                      "aria-expanded": $,
                      onClick: () => ne((t) => !t),
                      children: [
                        "详细编辑",
                        /* @__PURE__ */ e(Ft, { size: 14, className: $ ? "is-open" : "" })
                      ]
                    }
                  ) : null,
                  /* @__PURE__ */ a("section", { className: "ws-storyboard-shot-section", children: [
                    /* @__PURE__ */ a("div", { className: "ws-storyboard-shot-section-head", children: [
                      /* @__PURE__ */ e("strong", { children: "镜头内容" }),
                      /* @__PURE__ */ e("div", { children: /* @__PURE__ */ a("label", { children: [
                        "时长",
                        /* @__PURE__ */ e(
                          "input",
                          {
                            type: "number",
                            min: nn,
                            step: 1,
                            value: u.duration,
                            disabled: d,
                            onChange: (t) => f((r) => ({
                              ...r,
                              duration: Gn(
                                t,
                                r.duration
                              )
                            }))
                          }
                        ),
                        "秒"
                      ] }) })
                    ] }),
                    /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-field-row is-single", children: /* @__PURE__ */ a("label", { children: [
                      /* @__PURE__ */ e("span", { children: "镜头图片" }),
                      /* @__PURE__ */ e(
                        "select",
                        {
                          value: u.shot_image_mode,
                          disabled: d,
                          onChange: (t) => f((r) => ({
                            ...r,
                            shot_image_mode: sn(
                              t.target.value
                            )
                          })),
                          children: an(u).map((t) => /* @__PURE__ */ e("option", { value: t, children: t === "first_frame" && u.continue_previous ? "首帧（沿用上镜尾帧）" : t === "last_frame" && u.continue_previous ? "尾帧（首帧沿用上镜）" : rn[t] }, t))
                        }
                      )
                    ] }) }),
                    /* @__PURE__ */ a(
                      "details",
                      {
                        className: `ws-storyboard-continuity-settings${G ? " is-invalid" : ""}`,
                        open: G || void 0,
                        children: [
                          /* @__PURE__ */ a("summary", { children: [
                            /* @__PURE__ */ a("span", { children: [
                              "连续性设置",
                              /* @__PURE__ */ e("small", { children: "高级" })
                            ] }),
                            /* @__PURE__ */ e("b", { children: G ? "需要处理" : s === 0 ? "首镜" : u.continue_previous ? "动作延续" : u.match_previous ? "画面匹配" : "独立切镜" })
                          ] }),
                          /* @__PURE__ */ a("div", { children: [
                            s > 0 ? /* @__PURE__ */ e("div", { className: "ws-storyboard-continuity-modes", children: zn.map((t) => /* @__PURE__ */ a(
                              "label",
                              {
                                className: `ws-storyboard-continuity-input${ke === t.value ? " is-selected" : ""}`,
                                children: [
                                  /* @__PURE__ */ e(
                                    "input",
                                    {
                                      type: "radio",
                                      name: `storyboard-continuity-${n.id}`,
                                      value: t.value,
                                      checked: ke === t.value,
                                      disabled: d,
                                      onChange: () => f(
                                        (r) => jn(
                                          r,
                                          t.value,
                                          c
                                        )
                                      )
                                    }
                                  ),
                                  /* @__PURE__ */ a("span", { children: [
                                    /* @__PURE__ */ e("strong", { children: t.label }),
                                    /* @__PURE__ */ e("small", { children: t.description })
                                  ] })
                                ]
                              },
                              t.value
                            )) }) : null,
                            s > 0 && u.continue_previous ? /* @__PURE__ */ a("label", { className: "ws-storyboard-continuity-anchor", children: [
                              /* @__PURE__ */ e("span", { children: "连续性锚点" }),
                              /* @__PURE__ */ e(
                                "textarea",
                                {
                                  value: u.continuity_anchor,
                                  readOnly: d,
                                  placeholder: "写明上一镜头结束时需要延续的主体位置、姿态、动作方向、道具状态和光线",
                                  onChange: (t) => f((r) => ({
                                    ...r,
                                    continuity_anchor: t.target.value
                                  }))
                                }
                              )
                            ] }) : null,
                            G ? /* @__PURE__ */ e("p", { className: "ws-storyboard-form-error", children: "请填写入镜和出镜状态；匹配或延续上一镜时，入镜状态必须等于上一镜出镜状态；视频延续还必须填写连续性锚点。" }) : null,
                            /* @__PURE__ */ a("div", { className: "ws-storyboard-shot-field-row", children: [
                              /* @__PURE__ */ e(
                                Te,
                                {
                                  label: "入镜状态",
                                  value: u.continuity_state.entry,
                                  placeholder: "主体位置、姿态、服装、道具状态、时间、光线和运动方向",
                                  readonly: d || _e,
                                  onChange: (t) => f((r) => ({
                                    ...r,
                                    continuity_state: {
                                      ...r.continuity_state,
                                      entry: t
                                    }
                                  }))
                                }
                              ),
                              /* @__PURE__ */ e(
                                Te,
                                {
                                  label: "出镜状态",
                                  value: u.continuity_state.exit,
                                  placeholder: "本镜主要动作完成后，主体和环境停在什么可见状态",
                                  readonly: d,
                                  onChange: (t) => f((r) => ({
                                    ...r,
                                    continuity_state: {
                                      ...r.continuity_state,
                                      exit: t
                                    }
                                  }))
                                }
                              )
                            ] })
                          ] })
                        ]
                      }
                    ),
                    /* @__PURE__ */ a(
                      "div",
                      {
                        className: `ws-storyboard-shot-field-row ${s === 0 ? "is-single" : ""}`,
                        children: [
                          /* @__PURE__ */ e(
                            Te,
                            {
                              label: "本镜变化",
                              value: u.beat,
                              placeholder: "本镜头带来的一项新信息、动作结果或关系变化",
                              readonly: d,
                              onChange: (t) => f((r) => ({ ...r, beat: t }))
                            }
                          ),
                          s > 0 ? /* @__PURE__ */ e(
                            Te,
                            {
                              label: "与上镜关系",
                              value: u.transition,
                              placeholder: "上一镜头的什么结果触发本镜，或通过什么明确方式转场",
                              readonly: d,
                              onChange: (t) => f((r) => ({
                                ...r,
                                transition: t
                              }))
                            }
                          ) : null
                        ]
                      }
                    ),
                    s > 0 ? /* @__PURE__ */ a("div", { className: "ws-storyboard-shot-field-row", children: [
                      /* @__PURE__ */ a("label", { children: [
                        /* @__PURE__ */ e("span", { children: "剪辑转场" }),
                        /* @__PURE__ */ e(
                          "select",
                          {
                            value: u.transition_type,
                            disabled: d,
                            onChange: (t) => f((r) => {
                              const h = t.target.value;
                              return {
                                ...r,
                                transition_type: h,
                                transition_duration_ms: h === "none" ? 0 : Math.max(500, r.transition_duration_ms)
                              };
                            }),
                            children: on.map((t) => /* @__PURE__ */ e("option", { value: t, children: ln[t] }, t))
                          }
                        )
                      ] }),
                      u.transition_type !== "none" ? /* @__PURE__ */ a("label", { children: [
                        /* @__PURE__ */ e("span", { children: "转场时长" }),
                        /* @__PURE__ */ e(
                          "input",
                          {
                            type: "number",
                            min: 100,
                            max: 5e3,
                            step: 100,
                            value: u.transition_duration_ms,
                            disabled: d,
                            onChange: (t) => f((r) => ({
                              ...r,
                              transition_duration_ms: Math.min(
                                5e3,
                                Wn(
                                  t,
                                  r.transition_duration_ms,
                                  100
                                )
                              )
                            }))
                          }
                        )
                      ] }) : null
                    ] }) : null,
                    se ? /* @__PURE__ */ e("p", { className: "ws-storyboard-form-error", children: "请填写本镜变化；除第一镜外，还需要说明与上一镜头的承接关系。" }) : null,
                    /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-field-row is-single", children: /* @__PURE__ */ e(
                      ge,
                      {
                        label: "镜头描述",
                        value: u.description,
                        content: u.reference_contents?.description,
                        placeholder: "描述开场状态、核心内容或动作，以及结束状态",
                        readonly: d,
                        referenceAdapter: p,
                        onChange: (t, r) => B("description", t, r)
                      }
                    ) }),
                    /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-field-row is-single", children: /* @__PURE__ */ e(
                      ge,
                      {
                        label: "空间关系",
                        value: u.spatial_layout,
                        content: u.reference_contents?.spatial_layout,
                        placeholder: "主体、环境和物件的前后左右、接触或承载关系，以及真实相对尺度",
                        readonly: d,
                        referenceAdapter: p,
                        onChange: (t, r) => B("spatial_layout", t, r)
                      }
                    ) }),
                    /* @__PURE__ */ a("div", { className: "ws-storyboard-shot-field-row", children: [
                      /* @__PURE__ */ e(
                        ge,
                        {
                          label: "起始构图",
                          value: u.start_framing || "",
                          content: u.reference_contents?.start_framing,
                          placeholder: "动作开始时的景别、机位、主体位置、景深与焦点",
                          readonly: d,
                          referenceAdapter: p,
                          onChange: (t, r) => B("start_framing", t, r)
                        }
                      ),
                      /* @__PURE__ */ e(
                        ge,
                        {
                          label: "结束构图",
                          value: u.end_framing || "",
                          content: u.reference_contents?.end_framing,
                          placeholder: "动作结束时的景别、机位、主体位置、景深与焦点",
                          readonly: d,
                          referenceAdapter: p,
                          onChange: (t, r) => B("end_framing", t, r)
                        }
                      )
                    ] }),
                    /* @__PURE__ */ a("div", { className: "ws-storyboard-shot-field-row", children: [
                      /* @__PURE__ */ e(
                        ge,
                        {
                          label: "镜头语言",
                          value: u.camera_instruction,
                          content: u.reference_contents?.camera_instruction,
                          placeholder: "景别、机位和运动方式",
                          readonly: d,
                          referenceAdapter: p,
                          onChange: (t, r) => B("camera_instruction", t, r)
                        }
                      ),
                      /* @__PURE__ */ e(
                        ge,
                        {
                          label: "视频提示词",
                          value: u.video_prompt,
                          content: u.reference_contents?.video_prompt,
                          placeholder: "完整描述动作、运镜、光线与风格",
                          readonly: d,
                          referenceAdapter: p,
                          onChange: (t, r) => B("video_prompt", t, r)
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ a("section", { className: "ws-storyboard-shot-section", children: [
                    /* @__PURE__ */ e("div", { className: "ws-storyboard-shot-section-head", children: /* @__PURE__ */ a("div", { children: [
                      /* @__PURE__ */ e("strong", { children: "关联素材" }),
                      /* @__PURE__ */ a("span", { children: [
                        u.material_ids.length,
                        " 个素材"
                      ] })
                    ] }) }),
                    D.length ? /* @__PURE__ */ e("div", { className: "ws-storyboard-material-groups", children: ["character", "scene", "prop"].map((t) => {
                      const r = D.filter(
                        (h) => h.type === t
                      );
                      return r.length ? /* @__PURE__ */ a("fieldset", { children: [
                        /* @__PURE__ */ e("legend", { children: le[t] }),
                        /* @__PURE__ */ e("div", { children: r.map((h) => {
                          const y = u.material_ids.includes(
                            h.id
                          ), v = ce.has(h.id), N = F.has(
                            h.id
                          );
                          return /* @__PURE__ */ a(
                            "div",
                            {
                              className: "ws-storyboard-material-option",
                              children: [
                                /* @__PURE__ */ e(
                                  Z,
                                  {
                                    label: y && v ? "该角色已用于对白，不能取消关联" : y ? "取消关联" : "关联素材",
                                    children: /* @__PURE__ */ a("label", { children: [
                                      /* @__PURE__ */ e(
                                        "input",
                                        {
                                          type: "checkbox",
                                          checked: y,
                                          disabled: d || y && v,
                                          onChange: () => me(h.id)
                                        }
                                      ),
                                      /* @__PURE__ */ a("span", { className: "sr-only", children: [
                                        "关联 ",
                                        h.name
                                      ] })
                                    ] })
                                  }
                                ),
                                /* @__PURE__ */ e(
                                  Z,
                                  {
                                    label: N ? `${d ? "查看" : "编辑"}${le[t]}提示词：${h.name}` : `AI 新增${le[t]}，确认镜头后可编辑：${h.name}`,
                                    children: /* @__PURE__ */ a(
                                      "button",
                                      {
                                        type: "button",
                                        disabled: !N,
                                        onClick: () => R(h.id),
                                        children: [
                                          /* @__PURE__ */ e("span", { children: h.name }),
                                          !d && N ? /* @__PURE__ */ e(dt, { size: 11 }) : null
                                        ]
                                      }
                                    )
                                  }
                                )
                              ]
                            },
                            h.id
                          );
                        }) })
                      ] }, t) : null;
                    }) }) : /* @__PURE__ */ e("div", { className: "ws-storyboard-material-empty", children: "当前脚本没有角色、场景或道具素材" })
                  ] }),
                  /* @__PURE__ */ a("section", { className: "ws-storyboard-shot-section", children: [
                    /* @__PURE__ */ a("div", { className: "ws-storyboard-shot-section-head", children: [
                      /* @__PURE__ */ a("div", { children: [
                        /* @__PURE__ */ e("strong", { children: "角色配音与旁白" }),
                        /* @__PURE__ */ a("span", { children: [
                          u.speech.length,
                          " 条语音"
                        ] })
                      ] }),
                      d ? null : /* @__PURE__ */ a("div", { children: [
                        /* @__PURE__ */ a(
                          "button",
                          {
                            type: "button",
                            onClick: () => f((t) => ({
                              ...t,
                              speech: [
                                ...t.speech,
                                tt(t, "dialogue")
                              ]
                            })),
                            children: [
                              /* @__PURE__ */ e(Ie, { size: 13 }),
                              "添加对白"
                            ]
                          }
                        ),
                        /* @__PURE__ */ a(
                          "button",
                          {
                            type: "button",
                            onClick: () => f((t) => ({
                              ...t,
                              speech: [
                                ...t.speech,
                                tt(t, "narration")
                              ]
                            })),
                            children: [
                              /* @__PURE__ */ e(Ie, { size: 13 }),
                              "添加旁白"
                            ]
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ e("div", { className: "ws-storyboard-speech-list", children: u.speech.length ? u.speech.map((t, r) => /* @__PURE__ */ a("div", { className: "ws-storyboard-speech-row", children: [
                      /* @__PURE__ */ a("div", { className: "ws-storyboard-speech-row-head", children: [
                        /* @__PURE__ */ a("strong", { children: [
                          "语音 ",
                          r + 1
                        ] }),
                        d ? null : /* @__PURE__ */ a("div", { children: [
                          /* @__PURE__ */ e(
                            ve,
                            {
                              label: "上移语音",
                              disabled: r === 0,
                              onClick: () => ee(t.id, -1),
                              children: /* @__PURE__ */ e(He, { size: 13 })
                            }
                          ),
                          /* @__PURE__ */ e(
                            ve,
                            {
                              label: "下移语音",
                              disabled: r === u.speech.length - 1,
                              onClick: () => ee(t.id, 1),
                              children: /* @__PURE__ */ e(Qe, { size: 13 })
                            }
                          ),
                          /* @__PURE__ */ e(
                            ve,
                            {
                              label: "删除语音",
                              danger: !0,
                              onClick: () => f((h) => ({
                                ...h,
                                speech: h.speech.filter(
                                  (y) => y.id !== t.id
                                )
                              })),
                              children: /* @__PURE__ */ e(Ve, { size: 13 })
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ a("div", { className: "ws-storyboard-speech-fields", children: [
                        /* @__PURE__ */ a("label", { children: [
                          "类型",
                          /* @__PURE__ */ a(
                            "select",
                            {
                              value: t.kind,
                              disabled: d,
                              onChange: (h) => Y(t.id, {
                                kind: h.target.value
                              }),
                              children: [
                                /* @__PURE__ */ e("option", { value: "dialogue", children: "角色对白" }),
                                /* @__PURE__ */ e("option", { value: "narration", children: "旁白" })
                              ]
                            }
                          )
                        ] }),
                        t.kind === "dialogue" ? /* @__PURE__ */ a(qe, { children: [
                          /* @__PURE__ */ a("label", { children: [
                            "角色",
                            /* @__PURE__ */ a(
                              "select",
                              {
                                value: t.character_id || "",
                                disabled: d,
                                onChange: (h) => Y(t.id, {
                                  character_id: h.target.value
                                }),
                                children: [
                                  /* @__PURE__ */ e("option", { value: "", children: "请选择角色" }),
                                  j.map((h) => /* @__PURE__ */ e("option", { value: h.id, children: h.name }, h.id))
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ a("label", { children: [
                            "说话方式",
                            /* @__PURE__ */ a(
                              "select",
                              {
                                value: t.speaker_mode || "offscreen",
                                disabled: d,
                                onChange: (h) => Y(t.id, {
                                  speaker_mode: h.target.value === "visible" ? "visible" : "offscreen"
                                }),
                                children: [
                                  /* @__PURE__ */ e("option", { value: "visible", children: "出镜对白" }),
                                  /* @__PURE__ */ e("option", { value: "offscreen", children: "画外音" })
                                ]
                              }
                            )
                          ] })
                        ] }) : null,
                        /* @__PURE__ */ a("label", { children: [
                          "开始时间",
                          /* @__PURE__ */ a("span", { className: "ws-storyboard-time-input", children: [
                            /* @__PURE__ */ e(
                              "input",
                              {
                                type: "number",
                                min: 0,
                                max: Math.max(0, u.duration - 0.01),
                                step: 0.1,
                                value: t.start_time,
                                disabled: d,
                                onChange: (h) => Y(t.id, {
                                  start_time: Ye(h)
                                })
                              }
                            ),
                            "秒"
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ a("label", { className: "ws-storyboard-speech-text", children: [
                        "文本",
                        /* @__PURE__ */ e(
                          "textarea",
                          {
                            value: t.text,
                            readOnly: d,
                            placeholder: t.kind === "narration" ? "输入旁白" : "输入对白",
                            onChange: (h) => Y(t.id, { text: h.target.value })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ a("div", { className: "ws-storyboard-speech-subtitle", children: [
                        /* @__PURE__ */ a("label", { children: [
                          /* @__PURE__ */ e(
                            "input",
                            {
                              type: "checkbox",
                              checked: t.subtitle_enabled,
                              disabled: d,
                              onChange: (h) => Y(t.id, {
                                subtitle_enabled: h.target.checked
                              })
                            }
                          ),
                          "加入字幕"
                        ] }),
                        t.subtitle_enabled ? /* @__PURE__ */ e(
                          "input",
                          {
                            value: t.subtitle_text,
                            readOnly: d,
                            placeholder: "可选：填写精简字幕；留空使用原文",
                            onChange: (h) => Y(t.id, {
                              subtitle_text: h.target.value
                            })
                          }
                        ) : null
                      ] })
                    ] }, t.id)) : /* @__PURE__ */ a("div", { className: "ws-storyboard-speech-empty", children: [
                      /* @__PURE__ */ e(Ut, { size: 24 }),
                      /* @__PURE__ */ e("span", { children: "当前镜头没有对白或旁白" })
                    ] }) }),
                    de.size > 1 ? /* @__PURE__ */ e("p", { className: "ws-storyboard-form-error", children: "一个镜头最多只能有一个出镜说话角色，请拆分镜头或改为画外音。" }) : null,
                    re ? /* @__PURE__ */ e("p", { className: "ws-storyboard-form-error", children: "语音开始时间必须小于当前镜头时长。" }) : null
                  ] }),
                  /* @__PURE__ */ a("section", { className: "ws-storyboard-shot-section", children: [
                    /* @__PURE__ */ a("div", { className: "ws-storyboard-shot-section-head", children: [
                      /* @__PURE__ */ a("div", { children: [
                        /* @__PURE__ */ e("strong", { children: "附加字幕文案" }),
                        /* @__PURE__ */ a("span", { children: [
                          u.captions.length,
                          " 条文案"
                        ] })
                      ] }),
                      d ? null : /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          onClick: () => f((t) => ({
                            ...t,
                            captions: [
                              ...t.captions,
                              cn(t)
                            ]
                          })),
                          children: [
                            /* @__PURE__ */ e(Ie, { size: 13 }),
                            "添加文案"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e("div", { className: "ws-storyboard-speech-list", children: u.captions.length ? u.captions.map((t, r) => /* @__PURE__ */ a("div", { className: "ws-storyboard-speech-row", children: [
                      /* @__PURE__ */ a("div", { className: "ws-storyboard-speech-row-head", children: [
                        /* @__PURE__ */ a("strong", { children: [
                          "文案 ",
                          r + 1
                        ] }),
                        d ? null : /* @__PURE__ */ a("div", { children: [
                          /* @__PURE__ */ e(
                            ve,
                            {
                              label: "上移文案",
                              disabled: r === 0,
                              onClick: () => L(t.id, -1),
                              children: /* @__PURE__ */ e(He, { size: 13 })
                            }
                          ),
                          /* @__PURE__ */ e(
                            ve,
                            {
                              label: "下移文案",
                              disabled: r === u.captions.length - 1,
                              onClick: () => L(t.id, 1),
                              children: /* @__PURE__ */ e(Qe, { size: 13 })
                            }
                          ),
                          /* @__PURE__ */ e(
                            ve,
                            {
                              label: "删除文案",
                              danger: !0,
                              onClick: () => f((h) => ({
                                ...h,
                                captions: h.captions.filter(
                                  (y) => y.id !== t.id
                                )
                              })),
                              children: /* @__PURE__ */ e(Ve, { size: 13 })
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ a("div", { className: "ws-storyboard-speech-fields", children: [
                        /* @__PURE__ */ a("label", { children: [
                          "类型",
                          /* @__PURE__ */ a(
                            "select",
                            {
                              value: t.type,
                              disabled: d,
                              onChange: (h) => ie(t.id, {
                                type: h.target.value
                              }),
                              children: [
                                /* @__PURE__ */ e("option", { value: "caption", children: "说明" }),
                                /* @__PURE__ */ e("option", { value: "title", children: "标题" }),
                                /* @__PURE__ */ e("option", { value: "highlight", children: "重点" })
                              ]
                            }
                          )
                        ] }),
                        /* @__PURE__ */ a("label", { children: [
                          "开始时间",
                          /* @__PURE__ */ a("span", { className: "ws-storyboard-time-input", children: [
                            /* @__PURE__ */ e(
                              "input",
                              {
                                type: "number",
                                min: 0,
                                max: u.duration,
                                step: 0.1,
                                value: t.start_time,
                                disabled: d,
                                onChange: (h) => ie(t.id, {
                                  start_time: Ye(h)
                                })
                              }
                            ),
                            "秒"
                          ] })
                        ] }),
                        /* @__PURE__ */ a("label", { children: [
                          "结束时间",
                          /* @__PURE__ */ a("span", { className: "ws-storyboard-time-input", children: [
                            /* @__PURE__ */ e(
                              "input",
                              {
                                type: "number",
                                min: 0.1,
                                max: u.duration,
                                step: 0.1,
                                value: t.end_time,
                                disabled: d,
                                onChange: (h) => ie(t.id, {
                                  end_time: Ye(h)
                                })
                              }
                            ),
                            "秒"
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ a("label", { className: "ws-storyboard-speech-text", children: [
                        "文本",
                        /* @__PURE__ */ e(
                          "textarea",
                          {
                            value: t.text,
                            readOnly: d,
                            placeholder: "输入不对应语音的标题、说明或重点文字",
                            onChange: (h) => ie(t.id, {
                              text: h.target.value
                            })
                          }
                        )
                      ] })
                    ] }, t.id)) : /* @__PURE__ */ a("div", { className: "ws-storyboard-speech-empty", children: [
                      /* @__PURE__ */ e(je, { size: 24 }),
                      /* @__PURE__ */ e("span", { children: "当前镜头没有附加字幕文案" })
                    ] }) }),
                    we ? /* @__PURE__ */ e("p", { className: "ws-storyboard-form-error", children: "字幕文案必须填写文本，并设置在镜头时长内的有效起止时间。" }) : null
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ a("footer", { children: [
              /* @__PURE__ */ e("button", { type: "button", disabled: O, onClick: M, children: d ? "关闭" : "取消" }),
              d ? null : /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "is-primary",
                  disabled: O || he === "blocked" || de.size > 1 || re || se || G || we,
                  onClick: () => A(
                    u,
                    D.filter(
                      (t) => F.has(t.id) || u.material_ids.includes(t.id)
                    )
                  ),
                  children: [
                    /* @__PURE__ */ e(xe, { size: 14 }),
                    he === "manual" && (ue || W && !U) ? "仅保存手动修改" : "确认修改"
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  );
  return typeof document > "u" ? null : lt(oe, C || document.body);
}
function ge({
  label: n,
  value: s,
  content: c,
  placeholder: i,
  readonly: o,
  referenceAdapter: d,
  onChange: p
}) {
  return /* @__PURE__ */ a("label", { className: "ws-storyboard-shot-field", children: [
    /* @__PURE__ */ e("span", { children: n }),
    /* @__PURE__ */ e(
      bn,
      {
        className: "ws-storyboard-reference-editor nodrag nopan nowheel",
        value: s,
        content: c,
        adapter: d,
        placeholder: i,
        disabled: o,
        layerZIndex: 2700,
        onChange: p
      }
    )
  ] });
}
function Te({
  label: n,
  value: s,
  placeholder: c,
  readonly: i,
  onChange: o
}) {
  return /* @__PURE__ */ a("label", { className: "ws-storyboard-shot-field", children: [
    /* @__PURE__ */ e("span", { children: n }),
    /* @__PURE__ */ e(
      "textarea",
      {
        className: "nodrag nopan nowheel ws-storyboard-plain-field",
        value: s,
        rows: 3,
        placeholder: c,
        readOnly: i,
        onChange: (d) => o(d.target.value)
      }
    )
  ] });
}
function An(n, s) {
  return {
    ...n,
    shots: n.shots.map((c) => {
      const i = { ...c.reference_contents || {} };
      for (const o of Fn) {
        const d = mn(
          c[o] || "",
          i[o],
          s
        );
        d ? i[o] = d : delete i[o];
      }
      return { ...c, reference_contents: i };
    })
  };
}
const Fn = [
  "description",
  "spatial_layout",
  "start_framing",
  "end_framing",
  "camera_instruction",
  "video_prompt"
];
function Un(n, s, c, i) {
  const o = { ...n.reference_contents || {} };
  return i ? o[s] = i : delete o[s], {
    [s]: c,
    reference_contents: o
  };
}
function ve({
  label: n,
  disabled: s,
  danger: c = !1,
  onClick: i,
  children: o
}) {
  return /* @__PURE__ */ e(Z, { label: n, children: /* @__PURE__ */ e(
    "button",
    {
      type: "button",
      className: `ws-storyboard-icon-button nodrag nopan ${c ? "is-danger" : ""}`,
      "aria-label": n,
      disabled: s,
      onClick: i,
      children: o
    }
  ) });
}
function Yn({ status: n }) {
  return /* @__PURE__ */ a("span", { className: `ws-storyboard-save-state is-${n}`, children: [
    n === "saving" ? /* @__PURE__ */ e($e, { size: 12, className: "ws-spin" }) : n === "saved" ? /* @__PURE__ */ e(xe, { size: 12 }) : null,
    n === "typing" ? "编辑中" : n === "saving" ? "保存中" : n === "error" ? "保存失败" : "已保存"
  ] });
}
function qn(n, s) {
  const c = { ...n, ...s };
  return c.kind === "dialogue" ? (c.character_id ||= "", c.speaker_mode ||= "offscreen") : (delete c.character_id, delete c.speaker_mode), c.subtitle_enabled = !!c.subtitle_enabled, c.subtitle_text ||= "", c;
}
function Vn(n) {
  return n.continue_previous ? "continue" : n.match_previous ? "match" : "independent";
}
function jn(n, s, c) {
  const i = s !== "independent", o = s === "continue";
  return {
    ...n,
    match_previous: s === "match",
    continue_previous: o,
    shot_image_mode: ut({
      ...n,
      match_previous: s === "match",
      continue_previous: o
    }).mode,
    continuity_anchor: o ? n.continuity_anchor : "",
    continuity_state: i ? {
      ...n.continuity_state,
      entry: c?.continuity_state.exit || n.continuity_state.entry
    } : n.continuity_state
  };
}
function Gn(n, s) {
  const c = Number(n.target.value);
  return dn(c) ? c : s;
}
function Wn(n, s, c) {
  const i = Number(n.target.value);
  return Number.isInteger(i) && i >= c ? i : s;
}
function Ye(n) {
  const s = Number.parseFloat(n.target.value);
  return Number.isFinite(s) && s >= 0 ? s : 0;
}
function gt(n) {
  const s = new Set(n.map((o) => o.id));
  let c = n.length, i = nt(c);
  for (; s.has(i.id); )
    c += 1, i = nt(c);
  return i;
}
function Xn(n, s) {
  const c = gt(n);
  return {
    ...vt(s),
    id: c.id,
    order: c.order,
    speech: s.speech.map((i, o) => ({
      ...i,
      id: `${c.id}-speech-${o + 1}`
    })),
    captions: s.captions.map((i, o) => ({
      ...i,
      id: `${c.id}-caption-${o + 1}`
    }))
  };
}
function vt(n) {
  return {
    ...n,
    material_ids: [...n.material_ids],
    continuity_state: { ...n.continuity_state },
    speech: n.speech.map((s) => ({ ...s })),
    captions: n.captions.map((s) => ({ ...s })),
    reference_contents: { ...n.reference_contents || {} }
  };
}
export {
  ra as StoryboardView
};
