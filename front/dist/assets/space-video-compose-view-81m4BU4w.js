import { a as n, j as e, F as Z } from "./preloadable-Bomi5PEU.js";
import { a as V, u as L, d as Y, b as pe } from "./_commonjsHelpers-61wyk6v6.js";
import { an as X, ao as Se, h as Re, A as $e, X as Pe, a2 as Q, ap as xe, aq as ze, o as he, ad as ve, n as re, P as ge, M as Ae, L as Fe, j as fe } from "./vendor-icons-B3DKX3la.js";
import { S as _e, o as ae, b as Le, d as Be, s as le, m as Ke, e as de } from "./space-sequence-card-3BvRvWb9.js";
import { p as be, v as E, e as je, q as qe, t as Ge, w as Ye, V as Xe } from "./space-page-CeQICFO0.js";
import { B as we, t as Qe, C as We } from "./upload-asset-api-CJCwVOwh.js";
import { V as W } from "./media-inspector-gallery-ho9rlZcO.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-video-compose-view-CEKPaQdh.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/components/media/first-frame-video"]);
const H = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!H || Object.keys(H).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const He = H.FirstFrameVideo;
function Je({
  clip: i,
  index: s,
  last: l,
  item: t,
  selected: p,
  readonly: o,
  wholeCardDraggable: r,
  dragging: a,
  dropPlacement: h,
  onSelect: b,
  onPanel: I,
  onRemove: c,
  onDuration: N,
  onDragStart: D,
  onDragOver: S,
  onDrop: M,
  onDragEnd: w
}) {
  const T = i.visualVideo?.mediaThumbnail || t?.preview.videoPosterUrl || "", x = !l && i.transitionToNext.type !== "none", z = !!(i.originalAudioSource || i.speechTracks.length > 0);
  return /* @__PURE__ */ n(
    _e,
    {
      itemId: i.id,
      index: s,
      durationLabel: i.duration > 0 ? `${be(i.duration)}秒` : "待读取",
      className: "ws-video-compose-card",
      dragClassName: "ws-video-compose-drag",
      selected: p,
      readonly: o,
      wholeCardDraggable: r,
      dragging: a,
      dropPlacement: h,
      ariaLabel: `镜头 ${s + 1}`,
      onSelect: b,
      onDragStart: D,
      onDragOver: S,
      onDrop: M,
      onDragEnd: w,
      headerActions: o ? void 0 : /* @__PURE__ */ e(we, { label: "删除镜头", children: /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: "ws-video-compose-remove",
          "aria-label": `删除镜头 ${s + 1}`,
          onClick: (R) => {
            R.stopPropagation(), c();
          },
          children: /* @__PURE__ */ e(Re, { size: 12 })
        }
      ) }),
      children: [
        /* @__PURE__ */ e("div", { className: "ws-video-compose-card-preview", children: i.visualVideo?.mediaUrl || t?.preview.videoUrl ? /* @__PURE__ */ e(
          He,
          {
            src: i.visualVideo?.mediaUrl || t?.preview.videoUrl || "",
            poster: T || void 0,
            muted: !0,
            playsInline: !0,
            preload: T && i.duration > 0 ? "none" : "metadata",
            onLoadedMetadata: (R) => {
              const U = R.currentTarget.duration;
              Number.isFinite(U) && U > 0 && N(U);
            }
          }
        ) : t?.preview.imageUrl ? /* @__PURE__ */ e(
          "img",
          {
            src: t.preview.imageUrl,
            alt: "",
            loading: "lazy",
            decoding: "async"
          }
        ) : /* @__PURE__ */ e("div", { children: /* @__PURE__ */ e("span", { children: "素材不可用" }) }) }),
        /* @__PURE__ */ n("div", { className: "ws-video-compose-card-meta", children: [
          /* @__PURE__ */ e("strong", { className: "ws-video-compose-card-title", children: i.title || t?.title || `镜头 ${s + 1}` }),
          i.blockingIssues.length ? /* @__PURE__ */ e("small", { className: "ws-video-compose-card-blocking", children: i.blockingIssues[0] }) : null
        ] }),
        /* @__PURE__ */ n("footer", { children: [
          /* @__PURE__ */ e(
            ce,
            {
              active: z,
              label: "声音",
              icon: /* @__PURE__ */ e(X, { size: 12 }),
              onClick: () => I("sound")
            }
          ),
          l ? /* @__PURE__ */ e("span", {}) : /* @__PURE__ */ e(
            ce,
            {
              active: x,
              label: "转场",
              icon: /* @__PURE__ */ e(Se, { size: 12 }),
              onClick: () => I("transition")
            }
          )
        ] })
      ]
    }
  );
}
function ce({
  label: i,
  icon: s,
  active: l,
  onClick: t
}) {
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: l ? "is-active" : "",
      onClick: (p) => {
        p.stopPropagation(), t();
      },
      children: [
        s,
        i
      ]
    }
  );
}
function Ze({
  title: i,
  kind: s,
  items: l,
  allowOrderedSelection: t = !1,
  resolveReferences: p,
  onSelect: o,
  onClose: r
}) {
  const [a, h] = V(), [b, I] = V("all"), [c, N] = V([]), D = L(
    () => l.filter(
      (m) => m.kind === s && Number(m.refId || 0) > 0 && Number(m.versionID || 0) > 0
    ).map((m) => ({ item: m, references: p(m, s) })).filter((m) => m.references.length > 0),
    [l, s, p]
  ), S = s === "video" ? Q : ve, M = s === "video" ? "视频" : "音频", w = a?.references || [], T = b === "all" ? w : c, x = (m) => {
    const { references: f } = m;
    if (f.length) {
      if (f.length === 1) {
        o(f);
        return;
      }
      h(m), I("all"), N(t ? f : []);
    }
  }, z = () => {
    I("custom"), N(
      c.length ? c : w
    );
  }, R = (m) => {
    const f = E(m), C = c.findIndex(
      (g) => E(g) === f
    );
    if (C >= 0) {
      N(
        c.filter((g, O) => O !== C)
      );
      return;
    }
    N([...c, m]);
  }, U = (m, f) => {
    const C = m + f;
    if (C < 0 || C >= c.length)
      return;
    const g = [...c];
    [g[m], g[C]] = [g[C], g[m]], N(g);
  };
  return /* @__PURE__ */ e("div", { className: "ws-video-compose-picker-backdrop", onMouseDown: r, children: /* @__PURE__ */ n(
    "section",
    {
      className: "ws-video-compose-picker",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": i,
      onMouseDown: (m) => m.stopPropagation(),
      children: [
        /* @__PURE__ */ n("header", { children: [
          a ? /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              onClick: () => {
                h(void 0), I("all"), N([]);
              },
              "aria-label": "返回素材列表",
              children: /* @__PURE__ */ e($e, { size: 17 })
            }
          ) : null,
          /* @__PURE__ */ n("div", { children: [
            /* @__PURE__ */ e("strong", { children: a ? a.item.title : i }),
            /* @__PURE__ */ e("span", { children: a ? t ? "选择需要合成的内容，并调整镜头顺序" : `选择一个${M}` : `选择当前画布中已经生成的${M}素材` })
          ] }),
          /* @__PURE__ */ e("button", { type: "button", onClick: r, "aria-label": "关闭", children: /* @__PURE__ */ e(Pe, { size: 17 }) })
        ] }),
        a ? /* @__PURE__ */ n("div", { className: "ws-video-compose-picker-selection", children: [
          /* @__PURE__ */ n("div", { className: "ws-video-compose-picker-selection-modes", children: [
            /* @__PURE__ */ n("span", { children: [
              "共 ",
              w.length,
              " 个",
              M
            ] }),
            t ? /* @__PURE__ */ n("div", { children: [
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  className: b === "all" ? "is-active" : "",
                  onClick: () => I("all"),
                  children: "全部"
                }
              ),
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: b === "custom" ? "is-active" : "",
                  onClick: z,
                  children: [
                    "自选",
                    " ",
                    b === "custom" ? c.length : 0,
                    "/",
                    w.length
                  ]
                }
              )
            ] }) : null
          ] }),
          /* @__PURE__ */ e("div", { className: "ws-video-compose-picker-media-grid", children: w.map((m, f) => {
            const C = E(m);
            if (!t)
              return /* @__PURE__ */ e(
                ei,
                {
                  kind: s,
                  reference: m,
                  index: f,
                  onSelect: () => o([m])
                },
                C
              );
            const g = c.findIndex(
              (A) => E(A) === C
            ), O = b === "all" || g >= 0, $ = b === "all" ? f : g;
            return /* @__PURE__ */ n("article", { className: O ? "is-selected" : "", children: [
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "ws-video-compose-picker-media-toggle",
                  onClick: () => {
                    if (b !== "custom") {
                      I("custom"), N(
                        w.filter(
                          (A) => E(A) !== C
                        )
                      );
                      return;
                    }
                    R(m);
                  },
                  "aria-pressed": O,
                  children: [
                    m.mediaUrl ? /* @__PURE__ */ e(
                      W,
                      {
                        src: m.mediaUrl,
                        poster: m.mediaThumbnail
                      }
                    ) : /* @__PURE__ */ e(Q, { size: 24 }),
                    O ? /* @__PURE__ */ e("span", { className: "ws-video-compose-picker-media-order", children: $ + 1 }) : null
                  ]
                }
              ),
              /* @__PURE__ */ n("div", { children: [
                /* @__PURE__ */ e("strong", { children: m.label || `视频 ${f + 1}` }),
                b === "custom" && g >= 0 ? /* @__PURE__ */ n("span", { className: "ws-video-compose-picker-media-actions", children: [
                  /* @__PURE__ */ e(
                    "button",
                    {
                      type: "button",
                      disabled: g === 0,
                      onClick: () => U(g, -1),
                      "aria-label": "前移",
                      children: /* @__PURE__ */ e(xe, { size: 14 })
                    }
                  ),
                  /* @__PURE__ */ e(
                    "button",
                    {
                      type: "button",
                      disabled: g === c.length - 1,
                      onClick: () => U(g, 1),
                      "aria-label": "后移",
                      children: /* @__PURE__ */ e(ze, { size: 14 })
                    }
                  )
                ] }) : null
              ] })
            ] }, C);
          }) }),
          t ? /* @__PURE__ */ n("footer", { children: [
            /* @__PURE__ */ n("span", { children: [
              "将按当前顺序添加 ",
              T.length,
              " 个镜头"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                disabled: !T.length,
                onClick: () => o(T),
                children: [
                  /* @__PURE__ */ e(he, { size: 15 }),
                  "确认添加"
                ]
              }
            )
          ] }) : null
        ] }) : /* @__PURE__ */ e("div", { className: "ws-video-compose-picker-grid", children: D.length ? D.map((m) => {
          const { item: f, references: C } = m, g = C.length;
          return /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: () => x(m),
              children: [
                /* @__PURE__ */ n("span", { className: "ws-video-compose-picker-preview", children: [
                  f.preview.imageUrl ? /* @__PURE__ */ e(
                    "img",
                    {
                      src: f.preview.imageUrl,
                      alt: "",
                      loading: "lazy",
                      decoding: "async"
                    }
                  ) : f.preview.videoUrl ? /* @__PURE__ */ e(
                    W,
                    {
                      src: f.preview.videoUrl,
                      poster: f.preview.videoPosterUrl
                    }
                  ) : /* @__PURE__ */ e(S, { size: 24 }),
                  g > 1 ? /* @__PURE__ */ n("small", { children: [
                    g,
                    " 个",
                    M
                  ] }) : null
                ] }),
                /* @__PURE__ */ e("strong", { children: f.title })
              ]
            },
            `${f.refId}:${f.versionID}`
          );
        }) : /* @__PURE__ */ n("div", { className: "ws-video-compose-picker-empty", children: [
          /* @__PURE__ */ e(S, { size: 28 }),
          /* @__PURE__ */ n("strong", { children: [
            "暂无可用",
            s === "video" ? "视频" : "音频"
          ] }),
          /* @__PURE__ */ e("span", { children: "请先运行对应节点，或通过导入节点添加素材。" })
        ] }) })
      ]
    }
  ) });
}
function ei({
  kind: i,
  reference: s,
  index: l,
  onSelect: t
}) {
  const p = i === "video" ? "视频" : "音频", o = s.label || `${p} ${l + 1}`;
  return /* @__PURE__ */ n("article", { children: [
    /* @__PURE__ */ e("section", { className: `ws-video-compose-picker-single-preview is-${i}`, children: i === "audio" ? /* @__PURE__ */ n(Z, { children: [
      /* @__PURE__ */ e(ve, { size: 22, "aria-hidden": "true" }),
      s.mediaUrl ? /* @__PURE__ */ e(
        "audio",
        {
          src: s.mediaUrl,
          controls: !0,
          preload: "none",
          "aria-label": o
        }
      ) : null
    ] }) : s.mediaUrl ? /* @__PURE__ */ e(
      W,
      {
        src: s.mediaUrl,
        poster: s.mediaThumbnail
      }
    ) : /* @__PURE__ */ e(Q, { size: 24 }) }),
    /* @__PURE__ */ n("div", { children: [
      /* @__PURE__ */ e("strong", { children: o }),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "ws-video-compose-picker-single-select",
          onClick: t,
          children: [
            /* @__PURE__ */ e(he, { size: 14 }),
            "选择"
          ]
        }
      )
    ] })
  ] });
}
await window.DeverFront?.ensureCompat?.(["@/components/media/first-frame-video"]);
const J = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!J || Object.keys(J).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const ii = J.FirstFrameVideo, ue = [
  { value: "auto", label: "跟随首个镜头" },
  { value: "1280x720", label: "720P" },
  { value: "1920x1080", label: "1080P" },
  { value: "3840x2160", label: "4K" }
], si = [];
function Ii({
  composition: i,
  referenceItems: s,
  connectedMediaReferences: l = si,
  readonly: t = !1,
  running: p = !1,
  fullScreen: o = !1,
  finalOutput: r,
  onChange: a,
  onConnectedMediaEdgeRemove: h,
  onRun: b,
  onOpenDetail: I
}) {
  const c = L(
    () => i || je(),
    [i]
  ), [N, D] = V(
    c.clips[0]?.id || ""
  ), [S, M] = V(
    ""
  ), [w, T] = V(""), [x, z] = V(""), [R, U] = V(""), [q, m] = V([]), [f, C] = V(
    "before"
  ), g = Y(null), O = Y(""), $ = Y([]), A = L(
    () => ae(c.clips, q, (d) => d.id),
    [q, c.clips]
  ), k = c.clips.find((d) => d.id === N) || c.clips[0], Te = k ? ci(s, k.visualVideo) : void 0, ee = qe(c), B = Ge(c), ke = p || t || c.clips.length === 0 || B.length > 0, ye = L(() => {
    const d = /* @__PURE__ */ new Map();
    for (const u of s)
      u.refId && u.versionID && d.set(`${u.refId}:${u.versionID}`, u);
    return d;
  }, [s]), ie = L(
    () => ri(l, s),
    [l, s]
  );
  pe(() => {
    if (t || !a)
      return;
    const d = ai(c, ie);
    d !== c && (d.clips.some((u) => u.id === N) || (D(d.clips[0]?.id || ""), M("")), a(d));
  }, [ie, a, t, N, c]);
  const F = (d) => {
    t || a?.(d);
  }, K = (d, u) => {
    F({
      ...c,
      clips: c.clips.map(
        (v) => v.id === d ? { ...v, ...u } : v
      )
    });
  }, Ve = (d, u) => {
    D(d), M(
      (v) => N === d && v === u ? "" : u
    );
  }, De = (d) => {
    const u = d[0];
    if (u) {
      if (w === "clip") {
        const v = d.map((y) => Ce(y));
        F({ ...c, clips: [...c.clips, ...v] }), D(v[0]?.id || "");
      } else if (w === "original" && k)
        K(k.id, {
          originalAudioSource: u
        });
      else if (w === "speech" && k) {
        const v = ui(u);
        K(k.id, {
          speechTracks: [...k.speechTracks, v]
        });
      } else w === "global" && F({
        ...c,
        audioTracks: [
          ...c.audioTracks,
          mi(u)
        ]
      });
      T("");
    }
  }, Me = (d) => {
    const u = c.clips.map((v) => v.id);
    O.current = d, $.current = u, z(d), U(""), m(u);
  }, Ue = (d, u) => {
    const v = O.current, y = $.current;
    if (!v || !d || v === d || !y.includes(v) || !y.includes(d))
      return;
    const _ = u.currentTarget.getBoundingClientRect(), te = u.currentTarget.parentElement?.getBoundingClientRect(), oe = !!(te && _.width * 1.5 < te.width) ? u.clientX < _.left + _.width / 2 ? "before" : "after" : u.clientY < _.top + _.height / 2 ? "before" : "after", G = Ke(
      y,
      v,
      d,
      oe,
      (Ee) => Ee
    );
    U(d), C(oe), !le(y, G) && ($.current = G, m(G));
  }, se = () => {
    O.current = "", $.current = [], z(""), U(""), m([]);
  }, Oe = () => {
    const d = ae(
      c.clips,
      $.current,
      (u) => u.id
    );
    le(
      c.clips.map((u) => u.id),
      d.map((u) => u.id)
    ) || F({ ...c, clips: d }), se();
  }, ne = /* @__PURE__ */ n(
    "section",
    {
      className: `ws-video-compose ${o ? "is-fullscreen" : "is-compact"}`,
      children: [
        /* @__PURE__ */ n("header", { className: "ws-video-compose-head", children: [
          /* @__PURE__ */ n("div", { className: "ws-video-compose-actions nodrag", children: [
            /* @__PURE__ */ n("span", { children: [
              /* @__PURE__ */ e(re, { size: 14 }),
              "视频合成"
            ] }),
            /* @__PURE__ */ n("small", { children: [
              c.clips.length,
              " 个镜头",
              ee > 0 ? ` · ${be(ee)} 秒` : "",
              B.length ? ` · ${B.length} 项待处理` : ""
            ] })
          ] }),
          /* @__PURE__ */ n("div", { children: [
            t ? null : /* @__PURE__ */ n("button", { type: "button", onClick: () => T("clip"), children: [
              /* @__PURE__ */ e(ge, { size: 13 }),
              "添加镜头"
            ] }),
            !o && I ? /* @__PURE__ */ n("button", { type: "button", onClick: I, children: [
              /* @__PURE__ */ e(Ae, { size: 13 }),
              "打开合成器"
            ] }) : null,
            b ? /* @__PURE__ */ e(we, { label: B[0] || "开始合成", children: /* @__PURE__ */ e("span", { className: "ws-video-compose-tooltip-trigger", children: /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "is-primary",
                disabled: ke,
                onClick: () => b(c),
                children: [
                  p ? /* @__PURE__ */ e(Fe, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ e(fe, { size: 13, fill: "currentColor" }),
                  p ? "合成中" : "开始合成"
                ]
              }
            ) }) }) : null
          ] })
        ] }),
        /* @__PURE__ */ e(
          "div",
          {
            ref: g,
            className: "ws-video-compose-grid nodrag nowheel",
            onDragOver: (d) => {
              if (!O.current || !g.current)
                return;
              const u = g.current.getBoundingClientRect();
              d.clientY < u.top + 36 ? g.current.scrollTop -= 12 : d.clientY > u.bottom - 36 && (g.current.scrollTop += 12);
            },
            children: c.clips.length ? A.map((d, u) => /* @__PURE__ */ e(
              Je,
              {
                clip: d,
                index: u,
                last: u === A.length - 1,
                item: ye.get(
                  Ye(d.visualVideo)
                ),
                selected: d.id === k?.id,
                readonly: t,
                wholeCardDraggable: o,
                dragging: x === d.id,
                dropPlacement: R === d.id && x !== d.id ? f : void 0,
                onSelect: () => D(d.id),
                onPanel: (v) => Ve(d.id, v),
                onRemove: () => {
                  d.sourceEdgeId && h?.(d.sourceEdgeId);
                  const v = d.sourceEdgeId ? c.clips.filter(
                    (y) => y.sourceEdgeId !== d.sourceEdgeId
                  ) : c.clips.filter((y) => y.id !== d.id);
                  F({ ...c, clips: v }), v.some((y) => y.id === N) || (D(v[0]?.id || ""), M(""));
                },
                onDuration: (v) => {
                  d.duration <= 0 && v > 0 && K(d.id, {
                    duration: Math.max(1, Math.floor(v))
                  });
                },
                onDragStart: () => Me(d.id),
                onDragOver: (v) => Ue(d.id, v),
                onDrop: Oe,
                onDragEnd: se
              },
              d.id
            )) : /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "ws-video-compose-empty",
                disabled: t,
                onClick: () => T("clip"),
                children: [
                  /* @__PURE__ */ e(re, { size: 26 }),
                  /* @__PURE__ */ e("strong", { children: "等待添加镜头" }),
                  /* @__PURE__ */ e("span", { children: "从当前画布选择已经生成的视频素材" })
                ]
              }
            )
          }
        ),
        k && S ? /* @__PURE__ */ e(
          ni,
          {
            clip: k,
            panel: S,
            readonly: t,
            onChange: (d) => K(k.id, d),
            onChooseOriginal: () => T("original"),
            onChooseSpeech: () => T("speech")
          }
        ) : null,
        o ? /* @__PURE__ */ e(
          ti,
          {
            composition: c,
            readonly: t,
            onChooseAudio: () => T("global"),
            onChange: F
          }
        ) : null
      ]
    }
  );
  return /* @__PURE__ */ n(Z, { children: [
    o ? /* @__PURE__ */ n("div", { className: "ws-video-compose-workspace", children: [
      /* @__PURE__ */ e("div", { className: "ws-video-compose-operations", children: ne }),
      /* @__PURE__ */ e(
        oi,
        {
          clip: k,
          item: Te,
          finalOutput: r
        }
      )
    ] }) : ne,
    w ? /* @__PURE__ */ e(
      Ze,
      {
        title: w === "clip" ? "添加镜头" : w === "original" ? "选择原声来源" : w === "global" ? "添加全片声音" : "添加语音",
        kind: w === "clip" ? "video" : "audio",
        items: s,
        allowOrderedSelection: w === "clip",
        resolveReferences: Ne,
        onSelect: De,
        onClose: () => T("")
      }
    ) : null
  ] });
}
function ni({
  clip: i,
  panel: s,
  readonly: l,
  onChange: t,
  onChooseOriginal: p,
  onChooseSpeech: o
}) {
  return /* @__PURE__ */ n("div", { className: "ws-video-compose-inspector nodrag nowheel", children: [
    /* @__PURE__ */ e("strong", { children: s === "sound" ? "声音" : "转场" }),
    s === "sound" ? /* @__PURE__ */ n("div", { className: "ws-video-compose-sound-fields", children: [
      /* @__PURE__ */ n("button", { type: "button", disabled: l, onClick: p, children: [
        /* @__PURE__ */ e(X, { size: 13 }),
        i.originalAudioSource?.label || "选择原声来源"
      ] }),
      /* @__PURE__ */ n("label", { children: [
        /* @__PURE__ */ e("span", { children: "原声音量" }),
        /* @__PURE__ */ e(
          "input",
          {
            type: "range",
            min: "0",
            max: "1",
            step: "0.05",
            value: i.originalVolume,
            disabled: l || !i.originalAudioSource,
            onChange: (r) => t({
              originalVolume: Number(r.target.value)
            })
          }
        ),
        /* @__PURE__ */ n("small", { children: [
          Math.round(i.originalVolume * 100),
          "%"
        ] })
      ] }),
      i.originalAudioSource ? /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          disabled: l,
          onClick: () => t({ originalAudioSource: void 0 }),
          children: "移除原声"
        }
      ) : null,
      /* @__PURE__ */ n("button", { type: "button", disabled: l, onClick: o, children: [
        /* @__PURE__ */ e(X, { size: 13 }),
        "添加语音"
      ] }),
      i.speechTracks.map((r, a) => /* @__PURE__ */ n("div", { className: "ws-video-compose-speech-track", children: [
        /* @__PURE__ */ e("strong", { children: r.audio?.label || `语音 ${a + 1}` }),
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ e("span", { children: "镜头起点" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "number",
              min: "0",
              step: "0.1",
              value: r.startTime,
              readOnly: l,
              onChange: (h) => t({
                speechTracks: j(
                  i.speechTracks,
                  r.id,
                  { startTime: Number(h.target.value) }
                )
              })
            }
          ),
          "秒"
        ] }),
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ e("span", { children: "源起点" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "number",
              min: "0",
              step: "0.1",
              value: r.sourceStart,
              readOnly: l,
              onChange: (h) => t({
                speechTracks: j(
                  i.speechTracks,
                  r.id,
                  { sourceStart: Number(h.target.value) }
                )
              })
            }
          ),
          "秒"
        ] }),
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ e("span", { children: "超出镜头" }),
          /* @__PURE__ */ n(
            "select",
            {
              value: r.fit,
              disabled: l,
              onChange: (h) => t({
                speechTracks: j(
                  i.speechTracks,
                  r.id,
                  {
                    fit: h.target.value
                  }
                )
              }),
              children: [
                /* @__PURE__ */ e("option", { value: "trim", children: "自动裁剪" }),
                /* @__PURE__ */ e("option", { value: "strict", children: "阻止合成" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ e("span", { children: "音量" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "range",
              min: "0",
              max: "1",
              step: "0.05",
              value: r.volume,
              disabled: l,
              onChange: (h) => t({
                speechTracks: j(
                  i.speechTracks,
                  r.id,
                  { volume: Number(h.target.value) }
                )
              })
            }
          ),
          /* @__PURE__ */ n("small", { children: [
            Math.round(r.volume * 100),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            disabled: l,
            onClick: () => t({
              speechTracks: i.speechTracks.filter(
                (h) => h.id !== r.id
              )
            }),
            children: "移除"
          }
        )
      ] }, r.id)),
      i.blockingIssues.length ? /* @__PURE__ */ e("div", { className: "ws-video-compose-blocking", children: i.blockingIssues.map((r) => /* @__PURE__ */ e("span", { children: r }, r)) }) : null
    ] }) : /* @__PURE__ */ n("div", { className: "ws-video-compose-transition-fields", children: [
      /* @__PURE__ */ n("label", { children: [
        /* @__PURE__ */ e("span", { children: "转场" }),
        /* @__PURE__ */ e(
          "select",
          {
            value: i.transitionToNext.type,
            disabled: l,
            onChange: (r) => t({
              transitionToNext: {
                ...i.transitionToNext,
                type: r.target.value
              }
            }),
            children: Xe.map((r) => /* @__PURE__ */ e("optgroup", { label: r.name, children: r.options.map((a) => /* @__PURE__ */ e("option", { value: a.key, children: a.name }, a.key)) }, r.name))
          }
        )
      ] }),
      i.transitionToNext.type !== "none" ? /* @__PURE__ */ n("label", { children: [
        /* @__PURE__ */ e("span", { children: "时长" }),
        /* @__PURE__ */ e(
          "input",
          {
            type: "number",
            min: "0.1",
            max: "5",
            step: "0.1",
            value: i.transitionToNext.durationMs / 1e3,
            readOnly: l,
            onChange: (r) => t({
              transitionToNext: {
                ...i.transitionToNext,
                durationMs: Math.round(Number(r.target.value) * 1e3)
              }
            })
          }
        ),
        "秒"
      ] }) : null
    ] })
  ] });
}
function ti({
  composition: i,
  readonly: s,
  onChooseAudio: l,
  onChange: t
}) {
  const p = ue.some(
    (o) => o.value === i.settings.resolution
  );
  return /* @__PURE__ */ n("div", { className: "ws-video-compose-global nodrag", children: [
    /* @__PURE__ */ n("label", { children: [
      /* @__PURE__ */ e("span", { children: "分辨率" }),
      /* @__PURE__ */ n(
        "select",
        {
          value: i.settings.resolution,
          disabled: s,
          onChange: (o) => t({
            ...i,
            settings: {
              ...i.settings,
              resolution: o.target.value
            }
          }),
          children: [
            p ? null : /* @__PURE__ */ e("option", { value: i.settings.resolution, children: i.settings.resolution.replace("x", " × ") }),
            ue.map((o) => /* @__PURE__ */ e("option", { value: o.value, children: o.label }, o.value))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ n("label", { children: [
      /* @__PURE__ */ e("span", { children: "帧率" }),
      /* @__PURE__ */ n(
        "select",
        {
          value: i.settings.fps,
          disabled: s,
          onChange: (o) => t({
            ...i,
            settings: {
              ...i.settings,
              fps: Number(o.target.value)
            }
          }),
          children: [
            /* @__PURE__ */ e("option", { value: 0, children: "跟随首个镜头" }),
            [24, 25, 30, 50, 60].map((o) => /* @__PURE__ */ n("option", { value: o, children: [
              o,
              " 帧/秒"
            ] }, o))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ n("div", { className: "ws-video-compose-global-audio", children: [
      /* @__PURE__ */ n("div", { className: "ws-video-compose-global-audio-head", children: [
        /* @__PURE__ */ e("strong", { children: "全片声音" }),
        /* @__PURE__ */ n("button", { type: "button", disabled: s, onClick: l, children: [
          /* @__PURE__ */ e(ge, { size: 13 }),
          "添加全片声音"
        ] })
      ] }),
      i.audioTracks.map((o, r) => /* @__PURE__ */ n("div", { className: "ws-video-compose-speech-track", children: [
        /* @__PURE__ */ e("strong", { children: o.audio?.label || `全片声音 ${r + 1}` }),
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ e("span", { children: "类型" }),
          /* @__PURE__ */ n(
            "select",
            {
              value: o.kind,
              disabled: s,
              onChange: (a) => {
                const h = a.target.value;
                t({
                  ...i,
                  audioTracks: P(
                    i.audioTracks,
                    o.id,
                    {
                      kind: h,
                      fit: h === "music" ? "trim" : "strict",
                      loop: h === "music" && o.loop,
                      fadeOut: h === "music" ? Math.max(1, o.fadeOut) : 0
                    }
                  )
                });
              },
              children: [
                /* @__PURE__ */ e("option", { value: "music", children: "背景音乐" }),
                /* @__PURE__ */ e("option", { value: "narration", children: "全片语音" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ e("span", { children: "全片起点" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "number",
              min: "0",
              step: "0.1",
              value: o.startTime,
              readOnly: s,
              onChange: (a) => t({
                ...i,
                audioTracks: P(
                  i.audioTracks,
                  o.id,
                  { startTime: Number(a.target.value) }
                )
              })
            }
          ),
          "秒"
        ] }),
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ e("span", { children: "源起点" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "number",
              min: "0",
              step: "0.1",
              value: o.sourceStart,
              readOnly: s,
              onChange: (a) => t({
                ...i,
                audioTracks: P(
                  i.audioTracks,
                  o.id,
                  { sourceStart: Number(a.target.value) }
                )
              })
            }
          ),
          "秒"
        ] }),
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ e("span", { children: "超出全片" }),
          /* @__PURE__ */ n(
            "select",
            {
              value: o.fit,
              disabled: s,
              onChange: (a) => t({
                ...i,
                audioTracks: P(
                  i.audioTracks,
                  o.id,
                  {
                    fit: a.target.value
                  }
                )
              }),
              children: [
                /* @__PURE__ */ e("option", { value: "trim", children: "自动裁剪" }),
                /* @__PURE__ */ e("option", { value: "strict", children: "阻止合成" })
              ]
            }
          )
        ] }),
        o.kind === "music" ? /* @__PURE__ */ n(Z, { children: [
          /* @__PURE__ */ n("label", { children: [
            /* @__PURE__ */ e(
              "input",
              {
                type: "checkbox",
                checked: o.loop,
                disabled: s,
                onChange: (a) => t({
                  ...i,
                  audioTracks: P(
                    i.audioTracks,
                    o.id,
                    { loop: a.target.checked }
                  )
                })
              }
            ),
            /* @__PURE__ */ e("span", { children: "循环铺满" })
          ] }),
          /* @__PURE__ */ n("label", { children: [
            /* @__PURE__ */ e("span", { children: "淡出" }),
            /* @__PURE__ */ e(
              "input",
              {
                type: "number",
                min: "0",
                max: "10",
                step: "0.1",
                value: o.fadeOut,
                readOnly: s,
                onChange: (a) => t({
                  ...i,
                  audioTracks: P(
                    i.audioTracks,
                    o.id,
                    { fadeOut: Number(a.target.value) }
                  )
                })
              }
            ),
            "秒"
          ] })
        ] }) : null,
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ e("span", { children: "音量" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "range",
              min: "0",
              max: "1",
              step: "0.05",
              value: o.volume,
              disabled: s,
              onChange: (a) => t({
                ...i,
                audioTracks: P(
                  i.audioTracks,
                  o.id,
                  { volume: Number(a.target.value) }
                )
              })
            }
          ),
          /* @__PURE__ */ n("small", { children: [
            Math.round(o.volume * 100),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            disabled: s,
            onClick: () => t({
              ...i,
              audioTracks: i.audioTracks.filter(
                (a) => a.id !== o.id
              )
            }),
            children: "移除"
          }
        )
      ] }, o.id))
    ] })
  ] });
}
function oi({
  clip: i,
  item: s,
  finalOutput: l
}) {
  const t = i?.visualVideo?.mediaUrl || s?.preview.videoUrl || "", p = i?.visualVideo?.mediaThumbnail || s?.preview.videoPosterUrl || "", o = Qe(l), [r, a] = V(
    o ? "final" : "clip"
  );
  pe(() => {
    o && a("final");
  }, [o, l]);
  const h = r === "final" && o;
  return /* @__PURE__ */ n("aside", { className: "ws-video-compose-preview", children: [
    /* @__PURE__ */ n("header", { children: [
      /* @__PURE__ */ e("strong", { children: h ? "合成结果" : i?.title || "视频预览" }),
      /* @__PURE__ */ n("div", { className: "ws-video-compose-preview-modes", children: [
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: h ? "" : "is-active",
            disabled: !i,
            onClick: () => a("clip"),
            children: "当前镜头"
          }
        ),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: h ? "is-active" : "",
            disabled: !o,
            onClick: () => a("final"),
            children: "合成结果"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e("div", { children: h ? /* @__PURE__ */ e(
      We,
      {
        output: l,
        fallback: "视频合成结果",
        className: "ws-video-compose-final-output"
      }
    ) : t ? /* @__PURE__ */ e(
      ii,
      {
        src: t,
        poster: p || void 0,
        controls: !0,
        playsInline: !0,
        preload: p ? "none" : "metadata"
      },
      t
    ) : s?.preview.imageUrl ? /* @__PURE__ */ e(
      "img",
      {
        src: s.preview.imageUrl,
        alt: "",
        loading: "lazy",
        decoding: "async"
      }
    ) : /* @__PURE__ */ n("span", { children: [
      /* @__PURE__ */ e(fe, { size: 28 }),
      "选择左侧镜头后预览"
    ] }) })
  ] });
}
function Ce(i, s = "") {
  return {
    id: pi(),
    title: i.label || "镜头",
    ...s ? { sourceEdgeId: s } : {},
    visualVideo: i,
    originalAudioSource: i,
    duration: 0,
    originalVolume: 1,
    speechTracks: [],
    subtitleTracks: [],
    useOriginalVideo: !1,
    blockingIssues: [],
    transitionToNext: {
      type: "none",
      durationMs: 500
    }
  };
}
function ri(i, s) {
  const l = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Set(), p = [], o = /* @__PURE__ */ new Map();
  for (const r of i) {
    if (!r.edge.id || Le(r.source) !== "video")
      continue;
    l.add(r.edge.id);
    const a = o.get(r.edge.id) || {
      complete: !0,
      references: []
    };
    o.set(r.edge.id, a);
    const h = Be(s, r.source);
    if (!h) {
      a.complete = !1;
      continue;
    }
    const b = Ne(h, "video");
    if (!b.length) {
      a.complete = !1;
      continue;
    }
    a.references.push(...b);
  }
  for (const [r, a] of o)
    !a.complete || !a.references.length || (t.add(r), p.push(
      ...a.references.map((h) => ({ edgeId: r, reference: h }))
    ));
  return { edgeIds: l, resolvedEdgeIds: t, references: p };
}
function ai(i, s) {
  const l = /* @__PURE__ */ new Map();
  for (const r of s.references) {
    const a = me(r);
    a && !l.has(a) && l.set(a, r);
  }
  let t = !1;
  const p = /* @__PURE__ */ new Set(), o = i.clips.flatMap((r) => {
    if (!r.sourceEdgeId)
      return [r];
    if (!s.edgeIds.has(r.sourceEdgeId))
      return t = !0, [];
    if (!s.resolvedEdgeIds.has(r.sourceEdgeId))
      return [r];
    const a = me({
      edgeId: r.sourceEdgeId,
      reference: r.visualVideo
    });
    return !a || !l.has(a) || p.has(a) ? (t = !0, []) : (p.add(a), [r]);
  });
  for (const [r, a] of l) {
    if (p.has(r))
      continue;
    const h = E(a.reference), b = o.findIndex(
      (I) => !I.sourceEdgeId && E(I.visualVideo) === h
    );
    b >= 0 ? o[b] = {
      ...o[b],
      sourceEdgeId: a.edgeId
    } : o.push(Ce(a.reference, a.edgeId)), p.add(r), t = !0;
  }
  return t ? { ...i, clips: o } : i;
}
function me(i) {
  const s = E(i.reference);
  return i.edgeId && s ? `${i.edgeId}:${s}` : "";
}
function li(i) {
  const s = Number(i.refId || 0), l = Number(i.versionID || 0);
  return !s || !l ? null : { assetId: s, versionId: l, label: i.title };
}
function Ne(i, s) {
  const l = li(i);
  if (!l)
    return [];
  const t = s === "video" ? i.preview.videoUrl : i.preview.audioUrl, p = di([
    ...de(i.output, s),
    ...de(i.asset, s),
    ...t ? [
      {
        url: t,
        thumbnail: s === "video" ? i.preview.videoPosterUrl : void 0
      }
    ] : []
  ]);
  if (!p.length)
    return [l];
  const o = s === "video" ? "视频" : "音频";
  return p.map((r, a) => ({
    ...l,
    label: p.length > 1 ? `${l.label || o} · ${o} ${a + 1}` : l.label,
    mediaIndex: a + 1,
    mediaUrl: r.url,
    ...r.thumbnail ? { mediaThumbnail: r.thumbnail } : {}
  }));
}
function di(i) {
  const s = /* @__PURE__ */ new Map();
  for (const l of i) {
    const t = l.url.trim();
    if (!t)
      continue;
    const p = s.get(t);
    if (!p) {
      s.set(t, { ...l, url: t });
      continue;
    }
    !p.thumbnail && l.thumbnail && s.set(t, { ...p, thumbnail: l.thumbnail });
  }
  return Array.from(s.values());
}
function ci(i, s) {
  if (s)
    return i.find(
      (l) => Number(l.refId || 0) === s.assetId && Number(l.versionID || 0) === s.versionId
    );
}
function ui(i) {
  return {
    id: Ie(),
    audio: i,
    startTime: 0,
    sourceStart: 0,
    fit: "trim",
    kind: "dialogue",
    text: "",
    volume: 1
  };
}
function mi(i) {
  return {
    id: Ie("global-audio"),
    audio: i,
    startTime: 0,
    sourceStart: 0,
    kind: "music",
    volume: 0.35,
    fit: "trim",
    loop: !1,
    fadeOut: 1
  };
}
function j(i, s, l) {
  return i.map(
    (t) => t.id === s ? { ...t, ...l } : t
  );
}
function P(i, s, l) {
  return i.map(
    (t) => t.id === s ? { ...t, ...l } : t
  );
}
function pi() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? `clip-${crypto.randomUUID()}` : `clip-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Ie(i = "speech") {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? `${i}-${crypto.randomUUID()}` : `${i}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
export {
  Ii as VideoComposeView
};
