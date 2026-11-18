import { a as n, j as e, F as Z } from "./space-storyboard-material-ECvLpyk_.js";
import { a as V, u as B, b as Y, d as he } from "./file-kind-Cq3pESGF.js";
import { aq as X, ar as Re, h as $e, A as Pe, X as ze, aa as Q, as as xe, at as Ae, n as ve, M as ge, a5 as re, P as fe, a4 as Fe, r as _e, j as be } from "./vendor-icons-BZHLe0mm.js";
import { o as ae, s as le, m as Be } from "./text-content-save-actions-CrfXuWSV.js";
import { h as we, v as E, n as de, g as Le, j as Ke, k as je, l as qe, m as Ge, V as Ye } from "./node-detail-header-Cn59agL3.js";
import { S as Xe } from "./space-sequence-card-Dk-OwCSY.js";
import { B as Ce, u as Qe } from "./asset-audio-preview-Cezm24us.js";
import { V as W } from "./media-inspector-gallery-BR6rzcOx.js";
import { C as We } from "./space-content-view-DfYKFqXc.js";
import { a as He, b as Je, d as ce } from "./space-media-references-BUYeAxyJ.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-video-compose-view-CEKPaQdh.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/components/media/first-frame-video"]);
const H = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!H || Object.keys(H).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const Ze = H.FirstFrameVideo;
function ei({
  clip: i,
  index: s,
  last: l,
  item: o,
  selected: p,
  readonly: t,
  wholeCardDraggable: r,
  dragging: a,
  dropPlacement: h,
  onSelect: b,
  onPanel: N,
  onRemove: c,
  onDuration: I,
  onDragStart: M,
  onDragOver: S,
  onDrop: D,
  onDragEnd: w
}) {
  const k = i.visualVideo?.mediaThumbnail || o?.preview.videoPosterUrl || "", z = !l && i.transitionToNext.type !== "none", x = !!(i.originalAudioSource || i.speechTracks.length > 0);
  return /* @__PURE__ */ n(
    Xe,
    {
      itemId: i.id,
      index: s,
      durationLabel: i.duration > 0 ? `${we(i.duration)}秒` : "待读取",
      className: "ws-video-compose-card",
      dragClassName: "ws-video-compose-drag",
      selected: p,
      readonly: t,
      wholeCardDraggable: r,
      dragging: a,
      dropPlacement: h,
      ariaLabel: `镜头 ${s + 1}`,
      onSelect: b,
      onDragStart: M,
      onDragOver: S,
      onDrop: D,
      onDragEnd: w,
      headerActions: t ? void 0 : /* @__PURE__ */ e(Ce, { label: "删除镜头", children: /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: "ws-video-compose-remove",
          "aria-label": `删除镜头 ${s + 1}`,
          onClick: (R) => {
            R.stopPropagation(), c();
          },
          children: /* @__PURE__ */ e($e, { size: 12 })
        }
      ) }),
      children: [
        /* @__PURE__ */ e("div", { className: "ws-video-compose-card-preview", children: i.visualVideo?.mediaUrl || o?.preview.videoUrl ? /* @__PURE__ */ e(
          Ze,
          {
            src: i.visualVideo?.mediaUrl || o?.preview.videoUrl || "",
            poster: k || void 0,
            muted: !0,
            playsInline: !0,
            preload: k && i.duration > 0 ? "none" : "metadata",
            onLoadedMetadata: (R) => {
              const U = R.currentTarget.duration;
              Number.isFinite(U) && U > 0 && I(U);
            }
          }
        ) : o?.preview.imageUrl ? /* @__PURE__ */ e(
          "img",
          {
            src: o.preview.imageUrl,
            alt: "",
            loading: "lazy",
            decoding: "async"
          }
        ) : /* @__PURE__ */ e("div", { children: /* @__PURE__ */ e("span", { children: "素材不可用" }) }) }),
        /* @__PURE__ */ n("div", { className: "ws-video-compose-card-meta", children: [
          /* @__PURE__ */ e("strong", { className: "ws-video-compose-card-title", children: i.title || o?.title || `镜头 ${s + 1}` }),
          i.blockingIssues.length ? /* @__PURE__ */ e("small", { className: "ws-video-compose-card-blocking", children: i.blockingIssues[0] }) : null
        ] }),
        /* @__PURE__ */ n("footer", { children: [
          /* @__PURE__ */ e(
            ue,
            {
              active: x,
              label: "声音",
              icon: /* @__PURE__ */ e(X, { size: 12 }),
              onClick: () => N("sound")
            }
          ),
          l ? /* @__PURE__ */ e("span", {}) : /* @__PURE__ */ e(
            ue,
            {
              active: z,
              label: "转场",
              icon: /* @__PURE__ */ e(Re, { size: 12 }),
              onClick: () => N("transition")
            }
          )
        ] })
      ]
    }
  );
}
function ue({
  label: i,
  icon: s,
  active: l,
  onClick: o
}) {
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: l ? "is-active" : "",
      onClick: (p) => {
        p.stopPropagation(), o();
      },
      children: [
        s,
        i
      ]
    }
  );
}
function ii({
  title: i,
  kind: s,
  items: l,
  allowOrderedSelection: o = !1,
  resolveReferences: p,
  onSelect: t,
  onClose: r
}) {
  const [a, h] = V(), [b, N] = V("all"), [c, I] = V([]), M = B(
    () => l.filter(
      (m) => m.kind === s && Number(m.refId || 0) > 0 && Number(m.versionID || 0) > 0
    ).map((m) => ({ item: m, references: p(m, s) })).filter((m) => m.references.length > 0),
    [l, s, p]
  ), S = s === "video" ? Q : ge, D = s === "video" ? "视频" : "音频", w = a?.references || [], k = b === "all" ? w : c, z = (m) => {
    const { references: f } = m;
    if (f.length) {
      if (f.length === 1) {
        t(f);
        return;
      }
      h(m), N("all"), I(o ? f : []);
    }
  }, x = () => {
    N("custom"), I(
      c.length ? c : w
    );
  }, R = (m) => {
    const f = E(m), C = c.findIndex(
      (g) => E(g) === f
    );
    if (C >= 0) {
      I(
        c.filter((g, O) => O !== C)
      );
      return;
    }
    I([...c, m]);
  }, U = (m, f) => {
    const C = m + f;
    if (C < 0 || C >= c.length)
      return;
    const g = [...c];
    [g[m], g[C]] = [g[C], g[m]], I(g);
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
                h(void 0), N("all"), I([]);
              },
              "aria-label": "返回素材列表",
              children: /* @__PURE__ */ e(Pe, { size: 17 })
            }
          ) : null,
          /* @__PURE__ */ n("div", { children: [
            /* @__PURE__ */ e("strong", { children: a ? a.item.title : i }),
            /* @__PURE__ */ e("span", { children: a ? o ? "选择需要合成的内容，并调整镜头顺序" : `选择一个${D}` : `选择当前画布中已经生成的${D}素材` })
          ] }),
          /* @__PURE__ */ e("button", { type: "button", onClick: r, "aria-label": "关闭", children: /* @__PURE__ */ e(ze, { size: 17 }) })
        ] }),
        a ? /* @__PURE__ */ n("div", { className: "ws-video-compose-picker-selection", children: [
          /* @__PURE__ */ n("div", { className: "ws-video-compose-picker-selection-modes", children: [
            /* @__PURE__ */ n("span", { children: [
              "共 ",
              w.length,
              " 个",
              D
            ] }),
            o ? /* @__PURE__ */ n("div", { children: [
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  className: b === "all" ? "is-active" : "",
                  onClick: () => N("all"),
                  children: "全部"
                }
              ),
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: b === "custom" ? "is-active" : "",
                  onClick: x,
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
            if (!o)
              return /* @__PURE__ */ e(
                si,
                {
                  kind: s,
                  reference: m,
                  index: f,
                  onSelect: () => t([m])
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
                      N("custom"), I(
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
                      children: /* @__PURE__ */ e(Ae, { size: 14 })
                    }
                  )
                ] }) : null
              ] })
            ] }, C);
          }) }),
          o ? /* @__PURE__ */ n("footer", { children: [
            /* @__PURE__ */ n("span", { children: [
              "将按当前顺序添加 ",
              k.length,
              " 个镜头"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                disabled: !k.length,
                onClick: () => t(k),
                children: [
                  /* @__PURE__ */ e(ve, { size: 15 }),
                  "确认添加"
                ]
              }
            )
          ] }) : null
        ] }) : /* @__PURE__ */ e("div", { className: "ws-video-compose-picker-grid", children: M.length ? M.map((m) => {
          const { item: f, references: C } = m, g = C.length;
          return /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: () => z(m),
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
                    D
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
          /* @__PURE__ */ e("span", { children: "请先运行对应节点，或通过引用节点添加素材。" })
        ] }) })
      ]
    }
  ) });
}
function si({
  kind: i,
  reference: s,
  index: l,
  onSelect: o
}) {
  const p = i === "video" ? "视频" : "音频", t = s.label || `${p} ${l + 1}`;
  return /* @__PURE__ */ n("article", { children: [
    /* @__PURE__ */ e("section", { className: `ws-video-compose-picker-single-preview is-${i}`, children: i === "audio" ? /* @__PURE__ */ n(Z, { children: [
      /* @__PURE__ */ e(ge, { size: 22, "aria-hidden": "true" }),
      s.mediaUrl ? /* @__PURE__ */ e(
        "audio",
        {
          src: s.mediaUrl,
          controls: !0,
          preload: "none",
          "aria-label": t
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
      /* @__PURE__ */ e("strong", { children: t }),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "ws-video-compose-picker-single-select",
          onClick: o,
          children: [
            /* @__PURE__ */ e(ve, { size: 14 }),
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
const ni = J.FirstFrameVideo, me = [
  { value: "auto", label: "跟随首个镜头" },
  { value: "1280x720", label: "720P" },
  { value: "1920x1080", label: "1080P" },
  { value: "3840x2160", label: "4K" }
], oi = [];
function Mi({
  composition: i,
  referenceItems: s,
  connectedMediaReferences: l = oi,
  readonly: o = !1,
  running: p = !1,
  fullScreen: t = !1,
  finalOutput: r,
  onChange: a,
  onConnectedMediaEdgeRemove: h,
  onRun: b,
  onOpenDetail: N
}) {
  const c = B(
    () => de(i) || Le(),
    [i]
  ), [I, M] = V(
    c.clips[0]?.id || ""
  ), [S, D] = V(
    ""
  ), [w, k] = V(""), [z, x] = V(""), [R, U] = V(""), [q, m] = V([]), [f, C] = V(
    "before"
  ), g = Y(null), O = Y(""), $ = Y([]), A = B(
    () => ae(c.clips, q, (d) => d.id),
    [q, c.clips]
  ), T = c.clips.find((d) => d.id === I) || c.clips[0], Te = T ? mi(s, T.visualVideo) : void 0, ee = Ke(c), L = je(c), ye = p || o || c.clips.length === 0 || L.length > 0, Ve = B(() => {
    const d = /* @__PURE__ */ new Map();
    for (const u of s)
      u.refId && u.versionID && d.set(`${u.refId}:${u.versionID}`, u);
    return d;
  }, [s]), ie = B(
    () => li(l, s),
    [l, s]
  );
  he(() => {
    if (o || !a)
      return;
    const d = di(c, ie);
    d !== c && (d.clips.some((u) => u.id === I) || (M(d.clips[0]?.id || ""), D("")), a(d));
  }, [ie, a, o, I, c]);
  const F = (d) => {
    o || a?.(de(d));
  }, K = (d, u) => {
    F({
      ...c,
      clips: c.clips.map(
        (v) => v.id === d ? { ...v, ...u } : v
      )
    });
  }, Me = (d, u) => {
    M(d), D(
      (v) => I === d && v === u ? "" : u
    );
  }, De = (d) => {
    const u = d[0];
    if (u) {
      if (w === "clip") {
        const v = d.map((y) => Ie(y));
        F({ ...c, clips: [...c.clips, ...v] }), M(v[0]?.id || "");
      } else if (w === "original" && T)
        K(T.id, {
          originalAudioSource: u
        });
      else if (w === "speech" && T) {
        const v = pi(u);
        K(T.id, {
          speechTracks: [...T.speechTracks, v]
        });
      } else w === "global" && F({
        ...c,
        audioTracks: [
          ...c.audioTracks,
          hi(u)
        ]
      });
      k("");
    }
  }, Ue = (d) => {
    const u = c.clips.map((v) => v.id);
    O.current = d, $.current = u, x(d), U(""), m(u);
  }, Oe = (d, u) => {
    const v = O.current, y = $.current;
    if (!v || !d || v === d || !y.includes(v) || !y.includes(d))
      return;
    const _ = u.currentTarget.getBoundingClientRect(), oe = u.currentTarget.parentElement?.getBoundingClientRect(), te = !!(oe && _.width * 1.5 < oe.width) ? u.clientX < _.left + _.width / 2 ? "before" : "after" : u.clientY < _.top + _.height / 2 ? "before" : "after", G = Be(
      y,
      v,
      d,
      te,
      (Se) => Se
    );
    U(d), C(te), !le(y, G) && ($.current = G, m(G));
  }, se = () => {
    O.current = "", $.current = [], x(""), U(""), m([]);
  }, Ee = () => {
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
      className: `ws-video-compose ${t ? "is-fullscreen" : "is-compact"}`,
      children: [
        /* @__PURE__ */ n("header", { className: "ws-video-compose-head", children: [
          /* @__PURE__ */ n("div", { className: "ws-video-compose-actions nodrag", children: [
            t ? /* @__PURE__ */ n("span", { children: [
              /* @__PURE__ */ e(re, { size: 14 }),
              "视频合成"
            ] }) : null,
            /* @__PURE__ */ n("small", { children: [
              c.clips.length,
              " 个镜头",
              ee > 0 ? ` · ${we(ee)} 秒` : "",
              L.length ? ` · ${L.length} 项待处理` : ""
            ] })
          ] }),
          /* @__PURE__ */ n("div", { children: [
            o ? null : /* @__PURE__ */ n("button", { type: "button", onClick: () => k("clip"), children: [
              /* @__PURE__ */ e(fe, { size: 13 }),
              "添加镜头"
            ] }),
            !t && N ? /* @__PURE__ */ n("button", { type: "button", onClick: N, children: [
              /* @__PURE__ */ e(Fe, { size: 13 }),
              "打开合成器"
            ] }) : null,
            b ? /* @__PURE__ */ e(Ce, { label: L[0] || "开始合成", children: /* @__PURE__ */ e("span", { className: "ws-video-compose-tooltip-trigger", children: /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "is-primary",
                disabled: ye,
                onClick: () => b(c),
                children: [
                  p ? /* @__PURE__ */ e(_e, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ e(be, { size: 13, fill: "currentColor" }),
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
              ei,
              {
                clip: d,
                index: u,
                last: u === A.length - 1,
                item: Ve.get(
                  qe(d.visualVideo)
                ),
                selected: d.id === T?.id,
                readonly: o,
                wholeCardDraggable: t,
                dragging: z === d.id,
                dropPlacement: R === d.id && z !== d.id ? f : void 0,
                onSelect: () => M(d.id),
                onPanel: (v) => Me(d.id, v),
                onRemove: () => {
                  d.sourceEdgeId && h?.(d.sourceEdgeId);
                  const v = d.sourceEdgeId ? c.clips.filter(
                    (y) => y.sourceEdgeId !== d.sourceEdgeId
                  ) : c.clips.filter((y) => y.id !== d.id);
                  F({ ...c, clips: v }), v.some((y) => y.id === I) || (M(v[0]?.id || ""), D(""));
                },
                onDuration: (v) => {
                  d.duration <= 0 && v > 0 && K(d.id, {
                    duration: Math.max(1, Math.floor(v))
                  });
                },
                onDragStart: () => Ue(d.id),
                onDragOver: (v) => Oe(d.id, v),
                onDrop: Ee,
                onDragEnd: se
              },
              d.id
            )) : /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "ws-video-compose-empty",
                disabled: o,
                onClick: () => k("clip"),
                children: [
                  /* @__PURE__ */ e(re, { size: 26 }),
                  /* @__PURE__ */ e("strong", { children: "等待添加镜头" }),
                  /* @__PURE__ */ e("span", { children: "从当前画布选择已经生成的视频素材" })
                ]
              }
            )
          }
        ),
        T && S ? /* @__PURE__ */ e(
          ti,
          {
            clip: T,
            panel: S,
            readonly: o,
            onChange: (d) => K(T.id, d),
            onChooseOriginal: () => k("original"),
            onChooseSpeech: () => k("speech")
          }
        ) : null,
        t ? /* @__PURE__ */ e(
          ri,
          {
            composition: c,
            readonly: o,
            onChooseAudio: () => k("global"),
            onChange: F
          }
        ) : null
      ]
    }
  );
  return /* @__PURE__ */ n(Z, { children: [
    t ? /* @__PURE__ */ n("div", { className: "ws-video-compose-workspace", children: [
      /* @__PURE__ */ e("div", { className: "ws-video-compose-operations", children: ne }),
      /* @__PURE__ */ e(
        ai,
        {
          clip: T,
          item: Te,
          finalOutput: r
        }
      )
    ] }) : ne,
    w ? /* @__PURE__ */ e(
      ii,
      {
        title: w === "clip" ? "添加镜头" : w === "original" ? "选择原声来源" : w === "global" ? "添加全片声音" : "添加语音",
        kind: w === "clip" ? "video" : "audio",
        items: s,
        allowOrderedSelection: w === "clip",
        resolveReferences: Ne,
        onSelect: De,
        onClose: () => k("")
      }
    ) : null
  ] });
}
function ti({
  clip: i,
  panel: s,
  readonly: l,
  onChange: o,
  onChooseOriginal: p,
  onChooseSpeech: t
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
            onChange: (r) => o({
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
          onClick: () => o({ originalAudioSource: void 0 }),
          children: "移除原声"
        }
      ) : null,
      /* @__PURE__ */ n("button", { type: "button", disabled: l, onClick: t, children: [
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
              onChange: (h) => o({
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
              onChange: (h) => o({
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
              onChange: (h) => o({
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
              onChange: (h) => o({
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
            onClick: () => o({
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
            onChange: (r) => o({
              transitionToNext: {
                ...i.transitionToNext,
                type: r.target.value
              }
            }),
            children: Ye.map((r) => /* @__PURE__ */ e("optgroup", { label: r.name, children: r.options.map((a) => /* @__PURE__ */ e("option", { value: a.key, children: a.name }, a.key)) }, r.name))
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
            onChange: (r) => o({
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
function ri({
  composition: i,
  readonly: s,
  onChooseAudio: l,
  onChange: o
}) {
  const p = me.some(
    (t) => t.value === i.settings.resolution
  );
  return /* @__PURE__ */ n("div", { className: "ws-video-compose-global nodrag", children: [
    /* @__PURE__ */ n("label", { children: [
      /* @__PURE__ */ e("span", { children: "分辨率" }),
      /* @__PURE__ */ n(
        "select",
        {
          value: i.settings.resolution,
          disabled: s,
          onChange: (t) => o({
            ...i,
            settings: {
              ...i.settings,
              resolution: t.target.value
            }
          }),
          children: [
            p ? null : /* @__PURE__ */ e("option", { value: i.settings.resolution, children: i.settings.resolution.replace("x", " × ") }),
            me.map((t) => /* @__PURE__ */ e("option", { value: t.value, children: t.label }, t.value))
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
          onChange: (t) => o({
            ...i,
            settings: {
              ...i.settings,
              fps: Number(t.target.value)
            }
          }),
          children: [
            /* @__PURE__ */ e("option", { value: 0, children: "跟随首个镜头" }),
            [24, 25, 30, 50, 60].map((t) => /* @__PURE__ */ n("option", { value: t, children: [
              t,
              " 帧/秒"
            ] }, t))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ n("div", { className: "ws-video-compose-global-audio", children: [
      /* @__PURE__ */ n("div", { className: "ws-video-compose-global-audio-head", children: [
        /* @__PURE__ */ e("strong", { children: "全片声音" }),
        /* @__PURE__ */ n("button", { type: "button", disabled: s, onClick: l, children: [
          /* @__PURE__ */ e(fe, { size: 13 }),
          "添加全片声音"
        ] })
      ] }),
      i.audioTracks.map((t, r) => /* @__PURE__ */ n("div", { className: "ws-video-compose-speech-track", children: [
        /* @__PURE__ */ e("strong", { children: t.audio?.label || `全片声音 ${r + 1}` }),
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ e("span", { children: "类型" }),
          /* @__PURE__ */ n(
            "select",
            {
              value: t.kind,
              disabled: s,
              onChange: (a) => {
                const h = a.target.value;
                o({
                  ...i,
                  audioTracks: P(
                    i.audioTracks,
                    t.id,
                    {
                      kind: h,
                      fit: h === "music" ? "trim" : "strict",
                      loop: h === "music" && t.loop,
                      fadeOut: h === "music" ? Math.max(1, t.fadeOut) : 0
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
              value: t.startTime,
              readOnly: s,
              onChange: (a) => o({
                ...i,
                audioTracks: P(
                  i.audioTracks,
                  t.id,
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
              value: t.sourceStart,
              readOnly: s,
              onChange: (a) => o({
                ...i,
                audioTracks: P(
                  i.audioTracks,
                  t.id,
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
              value: t.fit,
              disabled: s,
              onChange: (a) => o({
                ...i,
                audioTracks: P(
                  i.audioTracks,
                  t.id,
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
        t.kind === "music" ? /* @__PURE__ */ n(Z, { children: [
          /* @__PURE__ */ n("label", { children: [
            /* @__PURE__ */ e(
              "input",
              {
                type: "checkbox",
                checked: t.loop,
                disabled: s,
                onChange: (a) => o({
                  ...i,
                  audioTracks: P(
                    i.audioTracks,
                    t.id,
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
                value: t.fadeOut,
                readOnly: s,
                onChange: (a) => o({
                  ...i,
                  audioTracks: P(
                    i.audioTracks,
                    t.id,
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
              value: t.volume,
              disabled: s,
              onChange: (a) => o({
                ...i,
                audioTracks: P(
                  i.audioTracks,
                  t.id,
                  { volume: Number(a.target.value) }
                )
              })
            }
          ),
          /* @__PURE__ */ n("small", { children: [
            Math.round(t.volume * 100),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            disabled: s,
            onClick: () => o({
              ...i,
              audioTracks: i.audioTracks.filter(
                (a) => a.id !== t.id
              )
            }),
            children: "移除"
          }
        )
      ] }, t.id))
    ] })
  ] });
}
function ai({
  clip: i,
  item: s,
  finalOutput: l
}) {
  const o = i?.visualVideo?.mediaUrl || s?.preview.videoUrl || "", p = i?.visualVideo?.mediaThumbnail || s?.preview.videoPosterUrl || "", t = Qe(l), [r, a] = V(
    t ? "final" : "clip"
  );
  he(() => {
    t && a("final");
  }, [t, l]);
  const h = r === "final" && t;
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
            disabled: !t,
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
    ) : o ? /* @__PURE__ */ e(
      ni,
      {
        src: o,
        poster: p || void 0,
        controls: !0,
        playsInline: !0,
        preload: p ? "none" : "metadata"
      },
      o
    ) : s?.preview.imageUrl ? /* @__PURE__ */ e(
      "img",
      {
        src: s.preview.imageUrl,
        alt: "",
        loading: "lazy",
        decoding: "async"
      }
    ) : /* @__PURE__ */ n("span", { children: [
      /* @__PURE__ */ e(be, { size: 28 }),
      "选择左侧镜头后预览"
    ] }) })
  ] });
}
function Ie(i, s = "") {
  return {
    id: vi(),
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
function li(i, s) {
  const l = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set(), p = [], t = /* @__PURE__ */ new Map();
  for (const r of i) {
    if (!r.edge.id || He(r.source) !== "video")
      continue;
    l.add(r.edge.id);
    const a = t.get(r.edge.id) || {
      complete: !0,
      references: []
    };
    t.set(r.edge.id, a);
    const h = Je(s, r.source);
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
  for (const [r, a] of t)
    !a.complete || !a.references.length || (o.add(r), p.push(
      ...a.references.map((h) => ({ edgeId: r, reference: h }))
    ));
  return { edgeIds: l, resolvedEdgeIds: o, references: p };
}
function di(i, s) {
  const l = /* @__PURE__ */ new Map();
  for (const r of s.references) {
    const a = pe(r);
    a && !l.has(a) && l.set(a, r);
  }
  let o = !1;
  const p = /* @__PURE__ */ new Set(), t = i.clips.flatMap((r) => {
    if (!r.sourceEdgeId || !Ge({ id: r.sourceEdgeId }))
      return [r];
    if (!s.edgeIds.has(r.sourceEdgeId))
      return o = !0, [];
    if (!s.resolvedEdgeIds.has(r.sourceEdgeId))
      return [r];
    const a = pe({
      edgeId: r.sourceEdgeId,
      reference: r.visualVideo
    });
    return !a || !l.has(a) || p.has(a) ? (o = !0, []) : (p.add(a), [r]);
  });
  for (const [r, a] of l) {
    if (p.has(r))
      continue;
    const h = E(a.reference), b = t.findIndex(
      (N) => !N.sourceEdgeId && E(N.visualVideo) === h
    );
    b >= 0 ? t[b] = {
      ...t[b],
      sourceEdgeId: a.edgeId
    } : t.push(Ie(a.reference, a.edgeId)), p.add(r), o = !0;
  }
  return o ? { ...i, clips: t } : i;
}
function pe(i) {
  const s = E(i.reference);
  return i.edgeId && s ? `${i.edgeId}:${s}` : "";
}
function ci(i) {
  const s = Number(i.refId || 0), l = Number(i.versionID || 0);
  return !s || !l ? null : { assetId: s, versionId: l, label: i.title };
}
function Ne(i, s) {
  const l = ci(i);
  if (!l)
    return [];
  const o = s === "video" ? i.preview.videoUrl : i.preview.audioUrl, p = ui([
    ...ce(i.output, s),
    ...ce(i.asset, s),
    ...o ? [
      {
        url: o,
        thumbnail: s === "video" ? i.preview.videoPosterUrl : void 0
      }
    ] : []
  ]);
  if (!p.length)
    return [l];
  const t = s === "video" ? "视频" : "音频";
  return p.map((r, a) => ({
    ...l,
    label: p.length > 1 ? `${l.label || t} · ${t} ${a + 1}` : l.label,
    mediaIndex: a + 1,
    mediaUrl: r.url,
    ...r.thumbnail ? { mediaThumbnail: r.thumbnail } : {}
  }));
}
function ui(i) {
  const s = /* @__PURE__ */ new Map();
  for (const l of i) {
    const o = l.url.trim();
    if (!o)
      continue;
    const p = s.get(o);
    if (!p) {
      s.set(o, { ...l, url: o });
      continue;
    }
    !p.thumbnail && l.thumbnail && s.set(o, { ...p, thumbnail: l.thumbnail });
  }
  return Array.from(s.values());
}
function mi(i, s) {
  if (s)
    return i.find(
      (l) => Number(l.refId || 0) === s.assetId && Number(l.versionID || 0) === s.versionId
    );
}
function pi(i) {
  return {
    id: ke(),
    audio: i,
    startTime: 0,
    sourceStart: 0,
    fit: "trim",
    kind: "dialogue",
    text: "",
    volume: 1
  };
}
function hi(i) {
  return {
    id: ke("global-audio"),
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
    (o) => o.id === s ? { ...o, ...l } : o
  );
}
function P(i, s, l) {
  return i.map(
    (o) => o.id === s ? { ...o, ...l } : o
  );
}
function vi() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? `clip-${crypto.randomUUID()}` : `clip-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function ke(i = "speech") {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? `${i}-${crypto.randomUUID()}` : `${i}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
export {
  Mi as VideoComposeView
};
