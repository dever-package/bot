import { c as ue, a as s, j as e, F as J } from "./createLucideIcon-fWv1XcFy.js";
import { b as y, i as F, e as X, c as me } from "./runtime-entry-ClkZDmNs.js";
import { L as De } from "./vanilla-BSPxkY5-.js";
import { C as ne } from "./power-icon-B4F9A-tn.js";
import { M as Re } from "./interaction-Cyugb7TD.js";
import { P as pe } from "./play-Cgnd9XVW.js";
import { P as he } from "./_commonjsHelpers-BNFp87fY.js";
import { V as H } from "./volume-2-R-g4DEHT.js";
import { S as Ee, o as oe, l as $e, m as xe, q as re, t as ze, a as ae } from "./space-storyboard-shot-card-DVUe0KAE.js";
import { l as ve, v as D, e as Ae, n as Pe, o as _e, p as Le, V as Fe } from "./space-page-jOKilSym.js";
import { T as Be } from "./trash-2-C2PWG3er.js";
import { g as ge, L as Ke } from "./storyboard-grid-view-BldHSQpc.js";
import { F as B, V as W } from "./first-frame-video-DlIx6mwp.js";
import { A as je } from "./arrow-down-BEwslZTQ.js";
import { A as qe } from "./arrow-left-8fGzp-c8.js";
import { A as Ge } from "./arrow-up-gCOxsuD7.js";
import { C as fe } from "./check-B_RB4H2g.js";
import { X as Ye } from "./in-flight-request-CXY2yBH9.js";
import { C as Xe } from "./space-content-view-TucLzffi.js";
const He = [
  ["circle", { cx: "8", cy: "18", r: "4", key: "1fc0mg" }],
  ["path", { d: "M12 18V2l7 4", key: "g04rme" }]
], be = ue("music-2", He);
const We = [
  ["path", { d: "m18 14 4 4-4 4", key: "10pe0f" }],
  ["path", { d: "m18 2 4 4-4 4", key: "pucp1d" }],
  ["path", { d: "M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22", key: "1ailkh" }],
  ["path", { d: "M2 6h1.972a4 4 0 0 1 3.6 2.2", key: "km57vx" }],
  ["path", { d: "M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45", key: "os18l9" }]
], Je = ue("shuffle", We);
function Qe({
  clip: i,
  index: t,
  last: d,
  item: n,
  selected: p,
  readonly: o,
  wholeCardDraggable: a,
  dragging: r,
  dropPlacement: h,
  onSelect: b,
  onPanel: k,
  onRemove: c,
  onDuration: N,
  onDragStart: M,
  onDragOver: R,
  onDrop: V,
  onDragEnd: C
}) {
  const I = !d && i.transitionToNext.type !== "none", z = !!(i.originalAudioSource || i.speechTracks.length > 0);
  return /* @__PURE__ */ s(
    Ee,
    {
      itemId: i.id,
      index: t,
      durationLabel: i.duration > 0 ? `${ve(i.duration)}秒` : "待读取",
      className: "ws-video-compose-card",
      dragClassName: "ws-video-compose-drag",
      selected: p,
      readonly: o,
      wholeCardDraggable: a,
      dragging: r,
      dropPlacement: h,
      ariaLabel: `镜头 ${t + 1}`,
      onSelect: b,
      onDragStart: M,
      onDragOver: R,
      onDrop: V,
      onDragEnd: C,
      headerActions: o ? void 0 : /* @__PURE__ */ e(ge, { label: "删除镜头", children: /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: "ws-video-compose-remove",
          "aria-label": `删除镜头 ${t + 1}`,
          onClick: (U) => {
            U.stopPropagation(), c();
          },
          children: /* @__PURE__ */ e(Be, { size: 12 })
        }
      ) }),
      children: [
        /* @__PURE__ */ e("div", { className: "ws-video-compose-card-preview", children: i.visualVideo?.mediaUrl || n?.preview.videoUrl ? /* @__PURE__ */ e(
          B,
          {
            src: i.visualVideo?.mediaUrl || n?.preview.videoUrl || "",
            muted: !0,
            playsInline: !0,
            preload: "metadata",
            onLoadedMetadata: (U) => {
              const E = U.currentTarget.duration;
              Number.isFinite(E) && E > 0 && N(E);
            }
          }
        ) : n?.preview.imageUrl ? /* @__PURE__ */ e(
          "img",
          {
            src: n.preview.imageUrl,
            alt: "",
            loading: "lazy",
            decoding: "async"
          }
        ) : /* @__PURE__ */ e("div", { children: /* @__PURE__ */ e("span", { children: "素材不可用" }) }) }),
        /* @__PURE__ */ s("div", { className: "ws-video-compose-card-meta", children: [
          /* @__PURE__ */ e("strong", { className: "ws-video-compose-card-title", children: i.title || n?.title || `镜头 ${t + 1}` }),
          i.blockingIssues.length ? /* @__PURE__ */ e("small", { className: "ws-video-compose-card-blocking", children: i.blockingIssues[0] }) : null
        ] }),
        /* @__PURE__ */ s("footer", { children: [
          /* @__PURE__ */ e(
            le,
            {
              active: z,
              label: "声音",
              icon: /* @__PURE__ */ e(H, { size: 12 }),
              onClick: () => k("sound")
            }
          ),
          d ? /* @__PURE__ */ e("span", {}) : /* @__PURE__ */ e(
            le,
            {
              active: I,
              label: "转场",
              icon: /* @__PURE__ */ e(Je, { size: 12 }),
              onClick: () => k("transition")
            }
          )
        ] })
      ]
    }
  );
}
function le({
  label: i,
  icon: t,
  active: d,
  onClick: n
}) {
  return /* @__PURE__ */ s(
    "button",
    {
      type: "button",
      className: d ? "is-active" : "",
      onClick: (p) => {
        p.stopPropagation(), n();
      },
      children: [
        t,
        i
      ]
    }
  );
}
function Ze({
  title: i,
  kind: t,
  items: d,
  allowOrderedSelection: n = !1,
  resolveReferences: p,
  onSelect: o,
  onClose: a
}) {
  const [r, h] = y(), [b, k] = y("all"), [c, N] = y([]), M = F(
    () => d.filter(
      (m) => m.kind === t && Number(m.refId || 0) > 0 && Number(m.versionID || 0) > 0
    ).map((m) => ({ item: m, references: p(m, t) })).filter((m) => m.references.length > 0),
    [d, t, p]
  ), R = t === "video" ? W : be, V = t === "video" ? "视频" : "音频", C = r?.references || [], I = b === "all" ? C : c, z = (m) => {
    const { references: f } = m;
    if (f.length) {
      if (f.length === 1) {
        o(f);
        return;
      }
      h(m), k("all"), N(n ? f : []);
    }
  }, U = () => {
    k("custom"), N(
      c.length ? c : C
    );
  }, E = (m) => {
    const f = D(m), w = c.findIndex(
      (g) => D(g) === f
    );
    if (w >= 0) {
      N(
        c.filter((g, O) => O !== w)
      );
      return;
    }
    N([...c, m]);
  }, A = (m, f) => {
    const w = m + f;
    if (w < 0 || w >= c.length)
      return;
    const g = [...c];
    [g[m], g[w]] = [g[w], g[m]], N(g);
  };
  return /* @__PURE__ */ e("div", { className: "ws-video-compose-picker-backdrop", onMouseDown: a, children: /* @__PURE__ */ s(
    "section",
    {
      className: "ws-video-compose-picker",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": i,
      onMouseDown: (m) => m.stopPropagation(),
      children: [
        /* @__PURE__ */ s("header", { children: [
          r ? /* @__PURE__ */ e("button", { type: "button", onClick: () => {
            h(void 0), k("all"), N([]);
          }, "aria-label": "返回素材列表", children: /* @__PURE__ */ e(qe, { size: 17 }) }) : null,
          /* @__PURE__ */ s("div", { children: [
            /* @__PURE__ */ e("strong", { children: r ? r.item.title : i }),
            /* @__PURE__ */ e("span", { children: r ? n ? "选择需要合成的内容，并调整镜头顺序" : `选择一个${V}` : `选择当前画布中已经生成的${V}素材` })
          ] }),
          /* @__PURE__ */ e("button", { type: "button", onClick: a, "aria-label": "关闭", children: /* @__PURE__ */ e(Ye, { size: 17 }) })
        ] }),
        r ? /* @__PURE__ */ s("div", { className: "ws-video-compose-picker-selection", children: [
          /* @__PURE__ */ s("div", { className: "ws-video-compose-picker-selection-modes", children: [
            /* @__PURE__ */ s("span", { children: [
              "共 ",
              C.length,
              " 个",
              V
            ] }),
            n ? /* @__PURE__ */ s("div", { children: [
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  className: b === "all" ? "is-active" : "",
                  onClick: () => k("all"),
                  children: "全部"
                }
              ),
              /* @__PURE__ */ s(
                "button",
                {
                  type: "button",
                  className: b === "custom" ? "is-active" : "",
                  onClick: U,
                  children: [
                    "自选",
                    " ",
                    b === "custom" ? c.length : 0,
                    "/",
                    C.length
                  ]
                }
              )
            ] }) : null
          ] }),
          /* @__PURE__ */ e("div", { className: "ws-video-compose-picker-media-grid", children: C.map((m, f) => {
            const w = D(m);
            if (!n)
              return /* @__PURE__ */ e(
                ei,
                {
                  kind: t,
                  reference: m,
                  index: f,
                  onSelect: () => o([m])
                },
                w
              );
            const g = c.findIndex(
              (P) => D(P) === w
            ), O = b === "all" || g >= 0, $ = b === "all" ? f : g;
            return /* @__PURE__ */ s("article", { className: O ? "is-selected" : "", children: [
              /* @__PURE__ */ s(
                "button",
                {
                  type: "button",
                  className: "ws-video-compose-picker-media-toggle",
                  onClick: () => {
                    if (b !== "custom") {
                      k("custom"), N(
                        C.filter(
                          (P) => D(P) !== w
                        )
                      );
                      return;
                    }
                    E(m);
                  },
                  "aria-pressed": O,
                  children: [
                    m.mediaUrl ? /* @__PURE__ */ e(
                      B,
                      {
                        src: m.mediaUrl,
                        muted: !0,
                        playsInline: !0,
                        preload: "metadata"
                      }
                    ) : /* @__PURE__ */ e(W, { size: 24 }),
                    O ? /* @__PURE__ */ e("span", { className: "ws-video-compose-picker-media-order", children: $ + 1 }) : null
                  ]
                }
              ),
              /* @__PURE__ */ s("div", { children: [
                /* @__PURE__ */ e("strong", { children: m.label || `视频 ${f + 1}` }),
                b === "custom" && g >= 0 ? /* @__PURE__ */ s("span", { className: "ws-video-compose-picker-media-actions", children: [
                  /* @__PURE__ */ e(
                    "button",
                    {
                      type: "button",
                      disabled: g === 0,
                      onClick: () => A(g, -1),
                      "aria-label": "前移",
                      children: /* @__PURE__ */ e(Ge, { size: 14 })
                    }
                  ),
                  /* @__PURE__ */ e(
                    "button",
                    {
                      type: "button",
                      disabled: g === c.length - 1,
                      onClick: () => A(g, 1),
                      "aria-label": "后移",
                      children: /* @__PURE__ */ e(je, { size: 14 })
                    }
                  )
                ] }) : null
              ] })
            ] }, w);
          }) }),
          n ? /* @__PURE__ */ s("footer", { children: [
            /* @__PURE__ */ s("span", { children: [
              "将按当前顺序添加 ",
              I.length,
              " 个镜头"
            ] }),
            /* @__PURE__ */ s(
              "button",
              {
                type: "button",
                disabled: !I.length,
                onClick: () => o(I),
                children: [
                  /* @__PURE__ */ e(fe, { size: 15 }),
                  "确认添加"
                ]
              }
            )
          ] }) : null
        ] }) : /* @__PURE__ */ e("div", { className: "ws-video-compose-picker-grid", children: M.length ? M.map((m) => {
          const { item: f, references: w } = m, g = w.length;
          return /* @__PURE__ */ s(
            "button",
            {
              type: "button",
              onClick: () => z(m),
              children: [
                /* @__PURE__ */ s("span", { className: "ws-video-compose-picker-preview", children: [
                  f.preview.imageUrl ? /* @__PURE__ */ e(
                    "img",
                    {
                      src: f.preview.imageUrl,
                      alt: "",
                      loading: "lazy",
                      decoding: "async"
                    }
                  ) : f.preview.videoUrl ? /* @__PURE__ */ e(
                    B,
                    {
                      src: f.preview.videoUrl,
                      muted: !0,
                      playsInline: !0,
                      preload: "metadata"
                    }
                  ) : /* @__PURE__ */ e(R, { size: 24 }),
                  g > 1 ? /* @__PURE__ */ s("small", { children: [
                    g,
                    " 个",
                    V
                  ] }) : null
                ] }),
                /* @__PURE__ */ e("strong", { children: f.title })
              ]
            },
            `${f.refId}:${f.versionID}`
          );
        }) : /* @__PURE__ */ s("div", { className: "ws-video-compose-picker-empty", children: [
          /* @__PURE__ */ e(R, { size: 28 }),
          /* @__PURE__ */ s("strong", { children: [
            "暂无可用",
            t === "video" ? "视频" : "音频"
          ] }),
          /* @__PURE__ */ e("span", { children: "请先运行对应节点，或通过导入节点添加素材。" })
        ] }) })
      ]
    }
  ) });
}
function ei({
  kind: i,
  reference: t,
  index: d,
  onSelect: n
}) {
  const p = i === "video" ? "视频" : "音频", o = t.label || `${p} ${d + 1}`;
  return /* @__PURE__ */ s("article", { children: [
    /* @__PURE__ */ e(
      "section",
      {
        className: `ws-video-compose-picker-single-preview is-${i}`,
        children: i === "audio" ? /* @__PURE__ */ s(J, { children: [
          /* @__PURE__ */ e(be, { size: 22, "aria-hidden": "true" }),
          t.mediaUrl ? /* @__PURE__ */ e(
            "audio",
            {
              src: t.mediaUrl,
              controls: !0,
              preload: "metadata",
              "aria-label": o
            }
          ) : null
        ] }) : t.mediaUrl ? /* @__PURE__ */ e(
          B,
          {
            src: t.mediaUrl,
            muted: !0,
            playsInline: !0,
            preload: "metadata"
          }
        ) : /* @__PURE__ */ e(W, { size: 24 })
      }
    ),
    /* @__PURE__ */ s("div", { children: [
      /* @__PURE__ */ e("strong", { children: o }),
      /* @__PURE__ */ s(
        "button",
        {
          type: "button",
          className: "ws-video-compose-picker-single-select",
          onClick: n,
          children: [
            /* @__PURE__ */ e(fe, { size: 14 }),
            "选择"
          ]
        }
      )
    ] })
  ] });
}
const de = [
  { value: "auto", label: "跟随首个镜头" },
  { value: "1280x720", label: "720P" },
  { value: "1920x1080", label: "1080P" },
  { value: "3840x2160", label: "4K" }
], ii = [];
function si({
  composition: i,
  referenceItems: t,
  connectedMediaReferences: d = ii,
  readonly: n = !1,
  running: p = !1,
  fullScreen: o = !1,
  finalOutput: a,
  onChange: r,
  onConnectedMediaEdgeRemove: h,
  onRun: b,
  onOpenDetail: k
}) {
  const c = F(
    () => i || Ae(),
    [i]
  ), [N, M] = y(
    c.clips[0]?.id || ""
  ), [R, V] = y(
    ""
  ), [C, I] = y(""), [z, U] = y(""), [E, A] = y(""), [G, m] = y([]), [f, w] = y(
    "before"
  ), g = X(null), O = X(""), $ = X([]), P = F(
    () => oe(c.clips, G, (l) => l.id),
    [G, c.clips]
  ), T = c.clips.find((l) => l.id === N) || c.clips[0], ke = T ? di(t, T.visualVideo) : void 0, Q = Pe(c), K = _e(c), Ie = p || n || c.clips.length === 0 || K.length > 0, Te = F(() => {
    const l = /* @__PURE__ */ new Map();
    for (const u of t)
      u.refId && u.versionID && l.set(`${u.refId}:${u.versionID}`, u);
    return l;
  }, [t]), Z = F(
    () => ri(
      d,
      t
    ),
    [d, t]
  );
  me(() => {
    if (n || !r)
      return;
    const l = ai(
      c,
      Z
    );
    l !== c && (l.clips.some((u) => u.id === N) || (M(l.clips[0]?.id || ""), V("")), r(l));
  }, [
    Z,
    r,
    n,
    N,
    c
  ]);
  const _ = (l) => {
    n || r?.(l);
  }, j = (l, u) => {
    _({
      ...c,
      clips: c.clips.map(
        (v) => v.id === l ? { ...v, ...u } : v
      )
    });
  }, ye = (l, u) => {
    M(l), V(
      (v) => N === l && v === u ? "" : u
    );
  }, Me = (l) => {
    const u = l[0];
    if (u) {
      if (C === "clip") {
        const v = l.map(Ce);
        _({ ...c, clips: [...c.clips, ...v] }), M(v[0]?.id || "");
      } else if (C === "original" && T)
        j(T.id, {
          originalAudioSource: u
        });
      else if (C === "speech" && T) {
        const v = ci(u);
        j(T.id, {
          speechTracks: [...T.speechTracks, v]
        });
      } else C === "global" && _({
        ...c,
        audioTracks: [
          ...c.audioTracks,
          ui(u)
        ]
      });
      I("");
    }
  }, Ve = (l) => {
    const u = c.clips.map((v) => v.id);
    O.current = l, $.current = u, U(l), A(""), m(u);
  }, Oe = (l, u) => {
    const v = O.current, S = $.current;
    if (!v || !l || v === l || !S.includes(v) || !S.includes(l))
      return;
    const L = u.currentTarget.getBoundingClientRect(), se = u.currentTarget.parentElement?.getBoundingClientRect(), te = !!(se && L.width * 1.5 < se.width) ? u.clientX < L.left + L.width / 2 ? "before" : "after" : u.clientY < L.top + L.height / 2 ? "before" : "after", Y = ze(
      S,
      v,
      l,
      te,
      (Ue) => Ue
    );
    A(l), w(te), !re(S, Y) && ($.current = Y, m(Y));
  }, ee = () => {
    O.current = "", $.current = [], U(""), A(""), m([]);
  }, Se = () => {
    const l = oe(
      c.clips,
      $.current,
      (u) => u.id
    );
    re(
      c.clips.map((u) => u.id),
      l.map((u) => u.id)
    ) || _({ ...c, clips: l }), ee();
  }, ie = /* @__PURE__ */ s(
    "section",
    {
      className: `ws-video-compose ${o ? "is-fullscreen" : "is-compact"}`,
      children: [
        /* @__PURE__ */ s("header", { className: "ws-video-compose-head", children: [
          /* @__PURE__ */ s("div", { className: "ws-video-compose-actions nodrag", children: [
            /* @__PURE__ */ s("span", { children: [
              /* @__PURE__ */ e(ne, { size: 14 }),
              "视频合成"
            ] }),
            /* @__PURE__ */ s("small", { children: [
              c.clips.length,
              " 个镜头",
              Q > 0 ? ` · ${ve(Q)} 秒` : "",
              K.length ? ` · ${K.length} 项待处理` : ""
            ] })
          ] }),
          /* @__PURE__ */ s("div", { children: [
            n ? null : /* @__PURE__ */ s("button", { type: "button", onClick: () => I("clip"), children: [
              /* @__PURE__ */ e(he, { size: 13 }),
              "添加镜头"
            ] }),
            !o && k ? /* @__PURE__ */ s("button", { type: "button", onClick: k, children: [
              /* @__PURE__ */ e(Re, { size: 13 }),
              "打开合成器"
            ] }) : null,
            b ? /* @__PURE__ */ e(ge, { label: K[0] || "开始合成", children: /* @__PURE__ */ e("span", { className: "ws-video-compose-tooltip-trigger", children: /* @__PURE__ */ s(
              "button",
              {
                type: "button",
                className: "is-primary",
                disabled: Ie,
                onClick: () => b(c),
                children: [
                  p ? /* @__PURE__ */ e(De, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ e(pe, { size: 13, fill: "currentColor" }),
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
            onDragOver: (l) => {
              if (!O.current || !g.current)
                return;
              const u = g.current.getBoundingClientRect();
              l.clientY < u.top + 36 ? g.current.scrollTop -= 12 : l.clientY > u.bottom - 36 && (g.current.scrollTop += 12);
            },
            children: c.clips.length ? P.map((l, u) => /* @__PURE__ */ e(
              Qe,
              {
                clip: l,
                index: u,
                last: u === P.length - 1,
                item: Te.get(
                  Le(l.visualVideo)
                ),
                selected: l.id === T?.id,
                readonly: n,
                wholeCardDraggable: o,
                dragging: z === l.id,
                dropPlacement: E === l.id && z !== l.id ? f : void 0,
                onSelect: () => M(l.id),
                onPanel: (v) => ye(l.id, v),
                onRemove: () => {
                  l.sourceEdgeId && h?.(l.sourceEdgeId);
                  const v = l.sourceEdgeId ? c.clips.filter(
                    (S) => S.sourceEdgeId !== l.sourceEdgeId
                  ) : c.clips.filter((S) => S.id !== l.id);
                  _({ ...c, clips: v }), v.some((S) => S.id === N) || (M(v[0]?.id || ""), V(""));
                },
                onDuration: (v) => {
                  l.duration <= 0 && v > 0 && j(l.id, {
                    duration: Math.max(1, Math.floor(v))
                  });
                },
                onDragStart: () => Ve(l.id),
                onDragOver: (v) => Oe(l.id, v),
                onDrop: Se,
                onDragEnd: ee
              },
              l.id
            )) : /* @__PURE__ */ s(
              "button",
              {
                type: "button",
                className: "ws-video-compose-empty",
                disabled: n,
                onClick: () => I("clip"),
                children: [
                  /* @__PURE__ */ e(ne, { size: 26 }),
                  /* @__PURE__ */ e("strong", { children: "等待添加镜头" }),
                  /* @__PURE__ */ e("span", { children: "从当前画布选择已经生成的视频素材" })
                ]
              }
            )
          }
        ),
        T && R ? /* @__PURE__ */ e(
          ti,
          {
            clip: T,
            panel: R,
            readonly: n,
            onChange: (l) => j(T.id, l),
            onChooseOriginal: () => I("original"),
            onChooseSpeech: () => I("speech")
          }
        ) : null,
        o ? /* @__PURE__ */ e(
          ni,
          {
            composition: c,
            readonly: n,
            onChooseAudio: () => I("global"),
            onChange: _
          }
        ) : null
      ]
    }
  );
  return /* @__PURE__ */ s(J, { children: [
    o ? /* @__PURE__ */ s("div", { className: "ws-video-compose-workspace", children: [
      /* @__PURE__ */ e("div", { className: "ws-video-compose-operations", children: ie }),
      /* @__PURE__ */ e(
        oi,
        {
          clip: T,
          item: ke,
          finalOutput: a
        }
      )
    ] }) : ie,
    C ? /* @__PURE__ */ e(
      Ze,
      {
        title: C === "clip" ? "添加镜头" : C === "original" ? "选择原声来源" : C === "global" ? "添加全片声音" : "添加语音",
        kind: C === "clip" ? "video" : "audio",
        items: t,
        allowOrderedSelection: C === "clip",
        resolveReferences: we,
        onSelect: Me,
        onClose: () => I("")
      }
    ) : null
  ] });
}
function ti({
  clip: i,
  panel: t,
  readonly: d,
  onChange: n,
  onChooseOriginal: p,
  onChooseSpeech: o
}) {
  return /* @__PURE__ */ s("div", { className: "ws-video-compose-inspector nodrag nowheel", children: [
    /* @__PURE__ */ e("strong", { children: t === "sound" ? "声音" : "转场" }),
    t === "sound" ? /* @__PURE__ */ s("div", { className: "ws-video-compose-sound-fields", children: [
      /* @__PURE__ */ s("button", { type: "button", disabled: d, onClick: p, children: [
        /* @__PURE__ */ e(H, { size: 13 }),
        i.originalAudioSource?.label || "选择原声来源"
      ] }),
      /* @__PURE__ */ s("label", { children: [
        /* @__PURE__ */ e("span", { children: "原声音量" }),
        /* @__PURE__ */ e(
          "input",
          {
            type: "range",
            min: "0",
            max: "1",
            step: "0.05",
            value: i.originalVolume,
            disabled: d || !i.originalAudioSource,
            onChange: (a) => n({
              originalVolume: Number(a.target.value)
            })
          }
        ),
        /* @__PURE__ */ s("small", { children: [
          Math.round(i.originalVolume * 100),
          "%"
        ] })
      ] }),
      i.originalAudioSource ? /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          disabled: d,
          onClick: () => n({ originalAudioSource: void 0 }),
          children: "移除原声"
        }
      ) : null,
      /* @__PURE__ */ s("button", { type: "button", disabled: d, onClick: o, children: [
        /* @__PURE__ */ e(H, { size: 13 }),
        "添加语音"
      ] }),
      i.speechTracks.map((a, r) => /* @__PURE__ */ s("div", { className: "ws-video-compose-speech-track", children: [
        /* @__PURE__ */ e("strong", { children: a.audio?.label || `语音 ${r + 1}` }),
        /* @__PURE__ */ s("label", { children: [
          /* @__PURE__ */ e("span", { children: "镜头起点" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "number",
              min: "0",
              step: "0.1",
              value: a.startTime,
              readOnly: d,
              onChange: (h) => n({
                speechTracks: q(
                  i.speechTracks,
                  a.id,
                  { startTime: Number(h.target.value) }
                )
              })
            }
          ),
          "秒"
        ] }),
        /* @__PURE__ */ s("label", { children: [
          /* @__PURE__ */ e("span", { children: "源起点" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "number",
              min: "0",
              step: "0.1",
              value: a.sourceStart,
              readOnly: d,
              onChange: (h) => n({
                speechTracks: q(
                  i.speechTracks,
                  a.id,
                  { sourceStart: Number(h.target.value) }
                )
              })
            }
          ),
          "秒"
        ] }),
        /* @__PURE__ */ s("label", { children: [
          /* @__PURE__ */ e("span", { children: "超出镜头" }),
          /* @__PURE__ */ s(
            "select",
            {
              value: a.fit,
              disabled: d,
              onChange: (h) => n({
                speechTracks: q(
                  i.speechTracks,
                  a.id,
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
        /* @__PURE__ */ s("label", { children: [
          /* @__PURE__ */ e("span", { children: "音量" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "range",
              min: "0",
              max: "1",
              step: "0.05",
              value: a.volume,
              disabled: d,
              onChange: (h) => n({
                speechTracks: q(
                  i.speechTracks,
                  a.id,
                  { volume: Number(h.target.value) }
                )
              })
            }
          ),
          /* @__PURE__ */ s("small", { children: [
            Math.round(a.volume * 100),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            disabled: d,
            onClick: () => n({
              speechTracks: i.speechTracks.filter(
                (h) => h.id !== a.id
              )
            }),
            children: "移除"
          }
        )
      ] }, a.id)),
      i.blockingIssues.length ? /* @__PURE__ */ e("div", { className: "ws-video-compose-blocking", children: i.blockingIssues.map((a) => /* @__PURE__ */ e("span", { children: a }, a)) }) : null
    ] }) : /* @__PURE__ */ s("div", { className: "ws-video-compose-transition-fields", children: [
      /* @__PURE__ */ s("label", { children: [
        /* @__PURE__ */ e("span", { children: "转场" }),
        /* @__PURE__ */ e(
          "select",
          {
            value: i.transitionToNext.type,
            disabled: d,
            onChange: (a) => n({
              transitionToNext: {
                ...i.transitionToNext,
                type: a.target.value
              }
            }),
            children: Fe.map((a) => /* @__PURE__ */ e("optgroup", { label: a.name, children: a.options.map((r) => /* @__PURE__ */ e("option", { value: r.key, children: r.name }, r.key)) }, a.name))
          }
        )
      ] }),
      i.transitionToNext.type !== "none" ? /* @__PURE__ */ s("label", { children: [
        /* @__PURE__ */ e("span", { children: "时长" }),
        /* @__PURE__ */ e(
          "input",
          {
            type: "number",
            min: "0.1",
            max: "5",
            step: "0.1",
            value: i.transitionToNext.durationMs / 1e3,
            readOnly: d,
            onChange: (a) => n({
              transitionToNext: {
                ...i.transitionToNext,
                durationMs: Math.round(Number(a.target.value) * 1e3)
              }
            })
          }
        ),
        "秒"
      ] }) : null
    ] })
  ] });
}
function ni({
  composition: i,
  readonly: t,
  onChooseAudio: d,
  onChange: n
}) {
  const p = de.some(
    (o) => o.value === i.settings.resolution
  );
  return /* @__PURE__ */ s("div", { className: "ws-video-compose-global nodrag", children: [
    /* @__PURE__ */ s("label", { children: [
      /* @__PURE__ */ e("span", { children: "分辨率" }),
      /* @__PURE__ */ s(
        "select",
        {
          value: i.settings.resolution,
          disabled: t,
          onChange: (o) => n({
            ...i,
            settings: {
              ...i.settings,
              resolution: o.target.value
            }
          }),
          children: [
            p ? null : /* @__PURE__ */ e("option", { value: i.settings.resolution, children: i.settings.resolution.replace("x", " × ") }),
            de.map((o) => /* @__PURE__ */ e("option", { value: o.value, children: o.label }, o.value))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ s("label", { children: [
      /* @__PURE__ */ e("span", { children: "帧率" }),
      /* @__PURE__ */ s(
        "select",
        {
          value: i.settings.fps,
          disabled: t,
          onChange: (o) => n({
            ...i,
            settings: {
              ...i.settings,
              fps: Number(o.target.value)
            }
          }),
          children: [
            /* @__PURE__ */ e("option", { value: 0, children: "跟随首个镜头" }),
            [24, 25, 30, 50, 60].map((o) => /* @__PURE__ */ s("option", { value: o, children: [
              o,
              " 帧/秒"
            ] }, o))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ s("div", { className: "ws-video-compose-global-audio", children: [
      /* @__PURE__ */ s("div", { className: "ws-video-compose-global-audio-head", children: [
        /* @__PURE__ */ e("strong", { children: "全片声音" }),
        /* @__PURE__ */ s("button", { type: "button", disabled: t, onClick: d, children: [
          /* @__PURE__ */ e(he, { size: 13 }),
          "添加全片声音"
        ] })
      ] }),
      i.audioTracks.map((o, a) => /* @__PURE__ */ s("div", { className: "ws-video-compose-speech-track", children: [
        /* @__PURE__ */ e("strong", { children: o.audio?.label || `全片声音 ${a + 1}` }),
        /* @__PURE__ */ s("label", { children: [
          /* @__PURE__ */ e("span", { children: "类型" }),
          /* @__PURE__ */ s(
            "select",
            {
              value: o.kind,
              disabled: t,
              onChange: (r) => {
                const h = r.target.value;
                n({
                  ...i,
                  audioTracks: x(
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
        /* @__PURE__ */ s("label", { children: [
          /* @__PURE__ */ e("span", { children: "全片起点" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "number",
              min: "0",
              step: "0.1",
              value: o.startTime,
              readOnly: t,
              onChange: (r) => n({
                ...i,
                audioTracks: x(
                  i.audioTracks,
                  o.id,
                  { startTime: Number(r.target.value) }
                )
              })
            }
          ),
          "秒"
        ] }),
        /* @__PURE__ */ s("label", { children: [
          /* @__PURE__ */ e("span", { children: "源起点" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "number",
              min: "0",
              step: "0.1",
              value: o.sourceStart,
              readOnly: t,
              onChange: (r) => n({
                ...i,
                audioTracks: x(
                  i.audioTracks,
                  o.id,
                  { sourceStart: Number(r.target.value) }
                )
              })
            }
          ),
          "秒"
        ] }),
        /* @__PURE__ */ s("label", { children: [
          /* @__PURE__ */ e("span", { children: "超出全片" }),
          /* @__PURE__ */ s(
            "select",
            {
              value: o.fit,
              disabled: t,
              onChange: (r) => n({
                ...i,
                audioTracks: x(
                  i.audioTracks,
                  o.id,
                  {
                    fit: r.target.value
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
        o.kind === "music" ? /* @__PURE__ */ s(J, { children: [
          /* @__PURE__ */ s("label", { children: [
            /* @__PURE__ */ e(
              "input",
              {
                type: "checkbox",
                checked: o.loop,
                disabled: t,
                onChange: (r) => n({
                  ...i,
                  audioTracks: x(
                    i.audioTracks,
                    o.id,
                    { loop: r.target.checked }
                  )
                })
              }
            ),
            /* @__PURE__ */ e("span", { children: "循环铺满" })
          ] }),
          /* @__PURE__ */ s("label", { children: [
            /* @__PURE__ */ e("span", { children: "淡出" }),
            /* @__PURE__ */ e(
              "input",
              {
                type: "number",
                min: "0",
                max: "10",
                step: "0.1",
                value: o.fadeOut,
                readOnly: t,
                onChange: (r) => n({
                  ...i,
                  audioTracks: x(
                    i.audioTracks,
                    o.id,
                    { fadeOut: Number(r.target.value) }
                  )
                })
              }
            ),
            "秒"
          ] })
        ] }) : null,
        /* @__PURE__ */ s("label", { children: [
          /* @__PURE__ */ e("span", { children: "音量" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "range",
              min: "0",
              max: "1",
              step: "0.05",
              value: o.volume,
              disabled: t,
              onChange: (r) => n({
                ...i,
                audioTracks: x(
                  i.audioTracks,
                  o.id,
                  { volume: Number(r.target.value) }
                )
              })
            }
          ),
          /* @__PURE__ */ s("small", { children: [
            Math.round(o.volume * 100),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            disabled: t,
            onClick: () => n({
              ...i,
              audioTracks: i.audioTracks.filter(
                (r) => r.id !== o.id
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
  item: t,
  finalOutput: d
}) {
  const n = i?.visualVideo?.mediaUrl || t?.preview.videoUrl || "", p = Ke(d), [o, a] = y(
    p ? "final" : "clip"
  );
  me(() => {
    p && a("final");
  }, [p, d]);
  const r = o === "final" && p;
  return /* @__PURE__ */ s("aside", { className: "ws-video-compose-preview", children: [
    /* @__PURE__ */ s("header", { children: [
      /* @__PURE__ */ e("strong", { children: r ? "合成结果" : i?.title || "视频预览" }),
      /* @__PURE__ */ s("div", { className: "ws-video-compose-preview-modes", children: [
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: r ? "" : "is-active",
            disabled: !i,
            onClick: () => a("clip"),
            children: "当前镜头"
          }
        ),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: r ? "is-active" : "",
            disabled: !p,
            onClick: () => a("final"),
            children: "合成结果"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e("div", { children: r ? /* @__PURE__ */ e(
      Xe,
      {
        output: d,
        fallback: "视频合成结果",
        className: "ws-video-compose-final-output"
      }
    ) : n ? /* @__PURE__ */ e(
      B,
      {
        src: n,
        controls: !0,
        playsInline: !0,
        preload: "metadata"
      },
      n
    ) : t?.preview.imageUrl ? /* @__PURE__ */ e(
      "img",
      {
        src: t.preview.imageUrl,
        alt: "",
        loading: "lazy",
        decoding: "async"
      }
    ) : /* @__PURE__ */ s("span", { children: [
      /* @__PURE__ */ e(pe, { size: 28 }),
      "选择左侧镜头后预览"
    ] }) })
  ] });
}
function Ce(i, t = "") {
  return {
    id: mi(),
    title: i.label || "镜头",
    ...t ? { sourceEdgeId: t } : {},
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
function ri(i, t) {
  const d = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), p = [], o = /* @__PURE__ */ new Map();
  for (const a of i) {
    if (!a.edge.id || $e(a.source) !== "video")
      continue;
    d.add(a.edge.id);
    const r = o.get(a.edge.id) || {
      complete: !0,
      references: []
    };
    o.set(a.edge.id, r);
    const h = xe(t, a.source);
    if (!h) {
      r.complete = !1;
      continue;
    }
    const b = we(h, "video");
    if (!b.length) {
      r.complete = !1;
      continue;
    }
    r.references.push(...b);
  }
  for (const [a, r] of o)
    !r.complete || !r.references.length || (n.add(a), p.push(
      ...r.references.map((h) => ({ edgeId: a, reference: h }))
    ));
  return { edgeIds: d, resolvedEdgeIds: n, references: p };
}
function ai(i, t) {
  const d = /* @__PURE__ */ new Map();
  for (const a of t.references) {
    const r = ce(a);
    r && !d.has(r) && d.set(r, a);
  }
  let n = !1;
  const p = /* @__PURE__ */ new Set(), o = i.clips.flatMap((a) => {
    if (!a.sourceEdgeId)
      return [a];
    if (!t.edgeIds.has(a.sourceEdgeId))
      return n = !0, [];
    if (!t.resolvedEdgeIds.has(a.sourceEdgeId))
      return [a];
    const r = ce({
      edgeId: a.sourceEdgeId,
      reference: a.visualVideo
    });
    return !r || !d.has(r) || p.has(r) ? (n = !0, []) : (p.add(r), [a]);
  });
  for (const [a, r] of d) {
    if (p.has(a))
      continue;
    const h = D(r.reference), b = o.findIndex(
      (k) => !k.sourceEdgeId && D(k.visualVideo) === h
    );
    b >= 0 ? o[b] = {
      ...o[b],
      sourceEdgeId: r.edgeId
    } : o.push(
      Ce(r.reference, r.edgeId)
    ), p.add(a), n = !0;
  }
  return n ? { ...i, clips: o } : i;
}
function ce(i) {
  const t = D(i.reference);
  return i.edgeId && t ? `${i.edgeId}:${t}` : "";
}
function li(i) {
  const t = Number(i.refId || 0), d = Number(i.versionID || 0);
  return !t || !d ? null : { assetId: t, versionId: d, label: i.title };
}
function we(i, t) {
  const d = li(i);
  if (!d)
    return [];
  const n = t === "video" ? i.preview.videoUrl : i.preview.audioUrl, p = Array.from(
    new Set([
      ...ae(i.output, t),
      ...ae(i.asset, t),
      n
    ].filter(Boolean))
  );
  if (!p.length)
    return [d];
  const o = t === "video" ? "视频" : "音频";
  return p.map((a, r) => ({
    ...d,
    label: p.length > 1 ? `${d.label || o} · ${o} ${r + 1}` : d.label,
    mediaIndex: r + 1,
    mediaUrl: a
  }));
}
function di(i, t) {
  if (t)
    return i.find(
      (d) => Number(d.refId || 0) === t.assetId && Number(d.versionID || 0) === t.versionId
    );
}
function ci(i) {
  return {
    id: Ne(),
    audio: i,
    startTime: 0,
    sourceStart: 0,
    fit: "trim",
    kind: "dialogue",
    text: "",
    volume: 1
  };
}
function ui(i) {
  return {
    id: Ne("global-audio"),
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
function q(i, t, d) {
  return i.map(
    (n) => n.id === t ? { ...n, ...d } : n
  );
}
function x(i, t, d) {
  return i.map(
    (n) => n.id === t ? { ...n, ...d } : n
  );
}
function mi() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? `clip-${crypto.randomUUID()}` : `clip-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Ne(i = "speech") {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? `${i}-${crypto.randomUUID()}` : `${i}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
const Ei = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  VideoComposeView: si
}, Symbol.toStringTag, { value: "Module" }));
export {
  be as M,
  si as V,
  Ei as s
};
