import { a as o, j as i, F as ve } from "./preloadable-B6QZqbLd.js";
import { a as I, u as E, b as K, d as ge, S as xe } from "./file-kind-Cq3pESGF.js";
import { aq as G, ar as Ae, h as ze, A as Fe, X as _e, M as q, n as Be, a5 as ae, P as fe, a4 as Le, r as je, j as be } from "./vendor-icons-IZIW7U43.js";
import { o as le, a as de, m as Ke, C as qe } from "./space-content-view-BZ7HjOCd.js";
import { g as we, v as F, n as ce, f as Ge, h as Xe, j as Ye, k as Je, l as We, V as He } from "./space-story-setting-reference-HUiOpGO8.js";
import { S as Qe } from "./space-sequence-card-JjPxOg1o.js";
import { B as Ce, r as Ze } from "./asset-audio-preview-CWf3Wq_n.js";
import { A as ei, C as ii } from "./node-detail-header-DivpGPu9.js";
import { a as ni, b as oi, d as X } from "./space-media-references-DVjtzkRP.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-video-compose-view-BfJt3XIO.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/components/media/first-frame-video"]);
const Y = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!Y || Object.keys(Y).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const si = Y.FirstFrameVideo;
function ri({
  clip: e,
  index: s,
  last: d,
  item: r,
  selected: m,
  readonly: n,
  wholeCardDraggable: a,
  dragging: t,
  dropPlacement: c,
  onSelect: v,
  onPanel: g,
  onRemove: y,
  onDuration: _,
  onDragStart: U,
  onDragOver: P,
  onDrop: p,
  onDragEnd: N
}) {
  const k = e.visualVideo?.mediaThumbnail || r?.preview.videoPosterUrl || "", R = !d && e.transitionToNext.type !== "none", M = !!(e.originalAudioSource || e.speechTracks.length > 0);
  return /* @__PURE__ */ o(
    Qe,
    {
      itemId: e.id,
      index: s,
      durationLabel: e.duration > 0 ? `${we(e.duration)}秒` : "待读取",
      className: "ws-video-compose-card",
      dragClassName: "ws-video-compose-drag",
      selected: m,
      readonly: n,
      wholeCardDraggable: a,
      dragging: t,
      dropPlacement: c,
      ariaLabel: `镜头 ${s + 1}`,
      onSelect: v,
      onDragStart: U,
      onDragOver: P,
      onDrop: p,
      onDragEnd: N,
      headerActions: n ? void 0 : /* @__PURE__ */ i(Ce, { label: "删除镜头", children: /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          className: "ws-video-compose-remove",
          "aria-label": `删除镜头 ${s + 1}`,
          onClick: (f) => {
            f.stopPropagation(), y();
          },
          children: /* @__PURE__ */ i(ze, { size: 12 })
        }
      ) }),
      children: [
        /* @__PURE__ */ i("div", { className: "ws-video-compose-card-preview", children: e.visualVideo?.mediaUrl || r?.preview.videoUrl ? /* @__PURE__ */ i(
          si,
          {
            src: e.visualVideo?.mediaUrl || r?.preview.videoUrl || "",
            poster: k || void 0,
            muted: !0,
            playsInline: !0,
            preload: k && e.duration > 0 ? "none" : "metadata",
            onLoadedMetadata: (f) => {
              const b = f.currentTarget.duration;
              Number.isFinite(b) && b > 0 && _(b);
            }
          }
        ) : r?.preview.imageUrl ? /* @__PURE__ */ i(
          "img",
          {
            src: r.preview.imageUrl,
            alt: "",
            loading: "lazy",
            decoding: "async"
          }
        ) : /* @__PURE__ */ i("div", { children: /* @__PURE__ */ i("span", { children: "素材不可用" }) }) }),
        /* @__PURE__ */ o("div", { className: "ws-video-compose-card-meta", children: [
          /* @__PURE__ */ i("strong", { className: "ws-video-compose-card-title", children: e.title || r?.title || `镜头 ${s + 1}` }),
          e.blockingIssues.length ? /* @__PURE__ */ i("small", { className: "ws-video-compose-card-blocking", children: e.blockingIssues[0] }) : null
        ] }),
        /* @__PURE__ */ o("footer", { children: [
          /* @__PURE__ */ i(
            ue,
            {
              active: M,
              label: "声音",
              icon: /* @__PURE__ */ i(G, { size: 12 }),
              onClick: () => g("sound")
            }
          ),
          d ? /* @__PURE__ */ i("span", {}) : /* @__PURE__ */ i(
            ue,
            {
              active: R,
              label: "转场",
              icon: /* @__PURE__ */ i(Ae, { size: 12 }),
              onClick: () => g("transition")
            }
          )
        ] })
      ]
    }
  );
}
function ue({
  label: e,
  icon: s,
  active: d,
  onClick: r
}) {
  return /* @__PURE__ */ o(
    "button",
    {
      type: "button",
      className: d ? "is-active" : "",
      onClick: (m) => {
        m.stopPropagation(), r();
      },
      children: [
        s,
        e
      ]
    }
  );
}
function ti({
  title: e,
  items: s,
  resolveReferences: d,
  onSelect: r,
  onClose: m
}) {
  const [n, a] = I(), t = E(
    () => s.filter((c) => c.kind === "audio").map((c) => ({ item: c, references: d(c, "audio") })).filter((c) => c.references.length > 0),
    [s, d]
  );
  return /* @__PURE__ */ i("div", { className: "ws-video-compose-picker-backdrop", onMouseDown: m, children: /* @__PURE__ */ o(
    "section",
    {
      className: "ws-video-compose-picker",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": e,
      onMouseDown: (c) => c.stopPropagation(),
      children: [
        /* @__PURE__ */ o("header", { children: [
          n ? /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              onClick: () => a(void 0),
              "aria-label": "返回素材列表",
              children: /* @__PURE__ */ i(Fe, { size: 17 })
            }
          ) : null,
          /* @__PURE__ */ o("div", { children: [
            /* @__PURE__ */ i("strong", { children: n ? n.item.title : e }),
            /* @__PURE__ */ i("span", { children: n ? "选择一个音频" : "选择当前画布中已经生成的音频素材" })
          ] }),
          /* @__PURE__ */ i("button", { type: "button", onClick: m, "aria-label": "关闭", children: /* @__PURE__ */ i(_e, { size: 17 }) })
        ] }),
        n ? /* @__PURE__ */ o("div", { className: "ws-video-compose-picker-selection", children: [
          /* @__PURE__ */ i("div", { className: "ws-video-compose-picker-selection-modes", children: /* @__PURE__ */ o("span", { children: [
            "共 ",
            n.references.length,
            " 个音频"
          ] }) }),
          /* @__PURE__ */ i("div", { className: "ws-video-compose-picker-media-grid", children: n.references.map((c, v) => {
            const g = c.label || `音频 ${v + 1}`;
            return /* @__PURE__ */ o("article", { children: [
              /* @__PURE__ */ o("section", { className: "ws-video-compose-picker-single-preview", children: [
                /* @__PURE__ */ i(q, { size: 22, "aria-hidden": "true" }),
                c.mediaUrl ? /* @__PURE__ */ i(
                  "audio",
                  {
                    src: c.mediaUrl,
                    controls: !0,
                    preload: "none",
                    "aria-label": g
                  }
                ) : null
              ] }),
              /* @__PURE__ */ o("div", { children: [
                /* @__PURE__ */ i("strong", { children: g }),
                /* @__PURE__ */ o(
                  "button",
                  {
                    type: "button",
                    className: "ws-video-compose-picker-single-select",
                    onClick: () => r([c]),
                    children: [
                      /* @__PURE__ */ i(Be, { size: 14 }),
                      "选择"
                    ]
                  }
                )
              ] })
            ] }, F(c));
          }) })
        ] }) : /* @__PURE__ */ i("div", { className: "ws-video-compose-picker-grid", children: t.length ? t.map((c) => {
          const { item: v, references: g } = c;
          return /* @__PURE__ */ o(
            "button",
            {
              type: "button",
              onClick: () => {
                g.length === 1 ? r(g) : a(c);
              },
              children: [
                /* @__PURE__ */ o("span", { className: "ws-video-compose-picker-preview", children: [
                  v.preview.imageUrl ? /* @__PURE__ */ i(
                    "img",
                    {
                      src: v.preview.imageUrl,
                      alt: "",
                      loading: "lazy",
                      decoding: "async"
                    }
                  ) : /* @__PURE__ */ i(q, { size: 24 }),
                  g.length > 1 ? /* @__PURE__ */ o("small", { children: [
                    g.length,
                    " 个音频"
                  ] }) : null
                ] }),
                /* @__PURE__ */ i("strong", { children: v.title })
              ]
            },
            `${v.refId}:${v.versionID}`
          );
        }) : /* @__PURE__ */ o("div", { className: "ws-video-compose-picker-empty", children: [
          /* @__PURE__ */ i(q, { size: 28 }),
          /* @__PURE__ */ i("strong", { children: "暂无可用音频" }),
          /* @__PURE__ */ i("span", { children: "请先运行对应节点，或通过引用节点添加素材。" })
        ] }) })
      ]
    }
  ) });
}
await window.DeverFront?.ensureCompat?.(["@/components/media/first-frame-video"]);
const J = window.DeverFront?.sdk?.getCompatModule("@/components/media/first-frame-video");
if (!J || Object.keys(J).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/media/first-frame-video");
const ai = J.FirstFrameVideo, me = [
  { value: "auto", label: "跟随首个镜头" },
  { value: "1280x720", label: "720P" },
  { value: "1920x1080", label: "1080P" },
  { value: "3840x2160", label: "4K" }
], li = [], di = 50;
function Ei({
  teamId: e,
  projectId: s,
  canvasId: d,
  outputAssetId: r,
  composition: m,
  referenceItems: n,
  connectedMediaReferences: a = li,
  readonly: t = !1,
  running: c = !1,
  fullScreen: v = !1,
  finalOutput: g,
  onChange: y,
  onConnectedMediaEdgeRemove: _,
  onRun: U,
  onOpenDetail: P
}) {
  const p = E(
    () => ce(m) || Ge(),
    [m]
  ), [N, k] = I(
    p.clips[0]?.id || ""
  ), [R, M] = I(
    ""
  ), [f, b] = I(""), [W, H] = I(""), [ye, B] = I(""), [Q, L] = I([]), [De, Me] = I(
    "before"
  ), O = K(null), $ = K(""), V = K([]), Z = E(
    () => le(p.clips, Q, (l) => l.id),
    [Q, p.clips]
  ), w = p.clips.find((l) => l.id === N) || p.clips[0], Oe = w ? fi(n, w.visualVideo) : void 0, ee = Xe(p), x = Ye(p), Ve = c || t || p.clips.length === 0 || x.length > 0, Se = E(() => {
    const l = /* @__PURE__ */ new Map();
    for (const u of n)
      u.refId && u.versionID && l.set(`${u.refId}:${u.versionID}`, u);
    return l;
  }, [n]), ie = E(
    () => pi(a, n),
    [a, n]
  );
  ge(() => {
    if (t || !y)
      return;
    const l = hi(p, ie);
    l !== p && (l.clips.some((u) => u.id === N) || (k(l.clips[0]?.id || ""), M("")), y(l));
  }, [ie, y, t, N, p]);
  const D = (l) => {
    t || y?.(ce(l));
  }, A = (l, u) => {
    D({
      ...p,
      clips: p.clips.map(
        (h) => h.id === l ? { ...h, ...u } : h
      )
    });
  }, Ee = (l, u) => {
    k(l), M(
      (h) => N === l && h === u ? "" : u
    );
  }, ne = (l) => {
    const u = l[0];
    if (u) {
      if (f === "clip") {
        const h = l.map((C) => Ie(C));
        D({ ...p, clips: [...p.clips, ...h] }), k(h[0]?.id || "");
      } else if (f === "original" && w)
        A(w.id, {
          originalAudioSource: u
        });
      else if (f === "speech" && w) {
        const h = bi(u);
        A(w.id, {
          speechTracks: [...w.speechTracks, h]
        });
      } else f === "global" && D({
        ...p,
        audioTracks: [
          ...p.audioTracks,
          wi(u)
        ]
      });
      b("");
    }
  }, Ue = (l) => {
    const u = p.clips.map((h) => h.id);
    $.current = l, V.current = u, H(l), B(""), L(u);
  }, Pe = (l, u) => {
    const h = $.current, C = V.current;
    if (!h || !l || h === l || !C.includes(h) || !C.includes(l))
      return;
    const S = u.currentTarget.getBoundingClientRect(), re = u.currentTarget.parentElement?.getBoundingClientRect(), te = !!(re && S.width * 1.5 < re.width) ? u.clientX < S.left + S.width / 2 ? "before" : "after" : u.clientY < S.top + S.height / 2 ? "before" : "after", j = Ke(
      C,
      h,
      l,
      te,
      ($e) => $e
    );
    B(l), Me(te), !de(C, j) && (V.current = j, L(j));
  }, oe = () => {
    $.current = "", V.current = [], H(""), B(""), L([]);
  }, Re = () => {
    const l = le(
      p.clips,
      V.current,
      (u) => u.id
    );
    de(
      p.clips.map((u) => u.id),
      l.map((u) => u.id)
    ) || D({ ...p, clips: l }), oe();
  }, se = /* @__PURE__ */ o(
    "section",
    {
      className: `ws-video-compose ${v ? "is-fullscreen" : "is-compact"}`,
      children: [
        /* @__PURE__ */ o("header", { className: "ws-video-compose-head", children: [
          /* @__PURE__ */ o("div", { className: "ws-video-compose-actions nodrag", children: [
            v ? /* @__PURE__ */ o("span", { children: [
              /* @__PURE__ */ i(ae, { size: 14 }),
              "视频合成"
            ] }) : null,
            /* @__PURE__ */ o("small", { children: [
              p.clips.length,
              " 个镜头",
              ee > 0 ? ` · ${we(ee)} 秒` : "",
              x.length ? ` · ${x.length} 项待处理` : ""
            ] })
          ] }),
          /* @__PURE__ */ o("div", { children: [
            t ? null : /* @__PURE__ */ o("button", { type: "button", onClick: () => b("clip"), children: [
              /* @__PURE__ */ i(fe, { size: 13 }),
              "添加镜头"
            ] }),
            !v && P ? /* @__PURE__ */ o("button", { type: "button", onClick: P, children: [
              /* @__PURE__ */ i(Le, { size: 13 }),
              "打开合成器"
            ] }) : null,
            U ? /* @__PURE__ */ i(Ce, { label: x[0] || "开始合成", children: /* @__PURE__ */ i("span", { className: "ws-video-compose-tooltip-trigger", children: /* @__PURE__ */ o(
              "button",
              {
                type: "button",
                className: "is-primary",
                disabled: Ve,
                onClick: () => U(p),
                children: [
                  c ? /* @__PURE__ */ i(je, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ i(be, { size: 13, fill: "currentColor" }),
                  c ? "合成中" : "开始合成"
                ]
              }
            ) }) }) : null
          ] })
        ] }),
        /* @__PURE__ */ i(
          "div",
          {
            ref: O,
            className: "ws-video-compose-grid nodrag nowheel",
            onDragOver: (l) => {
              if (!$.current || !O.current)
                return;
              const u = O.current.getBoundingClientRect();
              l.clientY < u.top + 36 ? O.current.scrollTop -= 12 : l.clientY > u.bottom - 36 && (O.current.scrollTop += 12);
            },
            children: p.clips.length ? Z.map((l, u) => /* @__PURE__ */ i(
              ri,
              {
                clip: l,
                index: u,
                last: u === Z.length - 1,
                item: Se.get(
                  Je(l.visualVideo)
                ),
                selected: l.id === w?.id,
                readonly: t,
                wholeCardDraggable: v,
                dragging: W === l.id,
                dropPlacement: ye === l.id && W !== l.id ? De : void 0,
                onSelect: () => k(l.id),
                onPanel: (h) => Ee(l.id, h),
                onRemove: () => {
                  l.sourceEdgeId && _?.(l.sourceEdgeId);
                  const h = l.sourceEdgeId ? p.clips.filter(
                    (C) => C.sourceEdgeId !== l.sourceEdgeId
                  ) : p.clips.filter((C) => C.id !== l.id);
                  D({ ...p, clips: h }), h.some((C) => C.id === N) || (k(h[0]?.id || ""), M(""));
                },
                onDuration: (h) => {
                  l.duration <= 0 && h > 0 && A(l.id, {
                    duration: Math.max(1, Math.floor(h))
                  });
                },
                onDragStart: () => Ue(l.id),
                onDragOver: (h) => Pe(l.id, h),
                onDrop: Re,
                onDragEnd: oe
              },
              l.id
            )) : /* @__PURE__ */ o(
              "button",
              {
                type: "button",
                className: "ws-video-compose-empty",
                disabled: t,
                onClick: () => b("clip"),
                children: [
                  /* @__PURE__ */ i(ae, { size: 26 }),
                  /* @__PURE__ */ i("strong", { children: "等待添加镜头" }),
                  /* @__PURE__ */ i("span", { children: "从资产中选择视频镜头" })
                ]
              }
            )
          }
        ),
        w && R ? /* @__PURE__ */ i(
          ci,
          {
            clip: w,
            panel: R,
            readonly: t,
            onChange: (l) => A(w.id, l),
            onChooseOriginal: () => b("original"),
            onChooseSpeech: () => b("speech")
          }
        ) : null,
        v ? /* @__PURE__ */ i(
          ui,
          {
            composition: p,
            readonly: t,
            onChooseAudio: () => b("global"),
            onChange: D
          }
        ) : null
      ]
    }
  );
  return /* @__PURE__ */ o(ve, { children: [
    v ? /* @__PURE__ */ o("div", { className: "ws-video-compose-workspace", children: [
      /* @__PURE__ */ i("div", { className: "ws-video-compose-operations", children: se }),
      /* @__PURE__ */ i(
        mi,
        {
          clip: w,
          item: Oe,
          finalOutput: g
        }
      )
    ] }) : se,
    f === "clip" && !t ? /* @__PURE__ */ i(
      xe,
      {
        fallback: /* @__PURE__ */ i(ii, { label: "正在加载资产选择器", overlay: !0 }),
        children: /* @__PURE__ */ i(
          ei,
          {
            open: !0,
            teamID: e,
            scopeProjectID: s,
            title: "添加镜头",
            description: "可进入集合选择视频，选中的镜头将按顺序追加。",
            initialFilters: {
              sourceType: "project",
              projectID: s,
              canvasID: d
            },
            allowedKinds: ["video"],
            includeOfficial: !1,
            multiple: !0,
            maxSelection: di,
            confirmSelection: !0,
            contentMode: "full",
            notificationMode: "inline",
            validateAsset: (l) => l.id === r ? "不能添加此合成节点自己的成片。" : he(l).length > 0 ? "" : "该资产没有可用的视频。",
            onConfirm: (l) => ne(l.flatMap(he)),
            onClose: () => b("")
          }
        )
      }
    ) : f && f !== "clip" ? /* @__PURE__ */ i(
      ti,
      {
        title: f === "original" ? "选择原声来源" : f === "global" ? "添加全片声音" : "添加语音",
        items: n,
        resolveReferences: ke,
        onSelect: ne,
        onClose: () => b("")
      }
    ) : null
  ] });
}
function ci({
  clip: e,
  panel: s,
  readonly: d,
  onChange: r,
  onChooseOriginal: m,
  onChooseSpeech: n
}) {
  return /* @__PURE__ */ o("div", { className: "ws-video-compose-inspector nodrag nowheel", children: [
    /* @__PURE__ */ i("strong", { children: s === "sound" ? "声音" : "转场" }),
    s === "sound" ? /* @__PURE__ */ o("div", { className: "ws-video-compose-sound-fields", children: [
      /* @__PURE__ */ o("button", { type: "button", disabled: d, onClick: m, children: [
        /* @__PURE__ */ i(G, { size: 13 }),
        e.originalAudioSource?.label || "选择原声来源"
      ] }),
      /* @__PURE__ */ o("label", { children: [
        /* @__PURE__ */ i("span", { children: "原声音量" }),
        /* @__PURE__ */ i(
          "input",
          {
            type: "range",
            min: "0",
            max: "1",
            step: "0.05",
            value: e.originalVolume,
            disabled: d || !e.originalAudioSource,
            onChange: (a) => r({
              originalVolume: Number(a.target.value)
            })
          }
        ),
        /* @__PURE__ */ o("small", { children: [
          Math.round(e.originalVolume * 100),
          "%"
        ] })
      ] }),
      e.originalAudioSource ? /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          disabled: d,
          onClick: () => r({ originalAudioSource: void 0 }),
          children: "移除原声"
        }
      ) : null,
      /* @__PURE__ */ o("button", { type: "button", disabled: d, onClick: n, children: [
        /* @__PURE__ */ i(G, { size: 13 }),
        "添加语音"
      ] }),
      e.speechTracks.map((a, t) => /* @__PURE__ */ o("div", { className: "ws-video-compose-speech-track", children: [
        /* @__PURE__ */ i("strong", { children: a.audio?.label || `语音 ${t + 1}` }),
        /* @__PURE__ */ o("label", { children: [
          /* @__PURE__ */ i("span", { children: "镜头起点" }),
          /* @__PURE__ */ i(
            "input",
            {
              type: "number",
              min: "0",
              step: "0.1",
              value: a.startTime,
              readOnly: d,
              onChange: (c) => r({
                speechTracks: z(
                  e.speechTracks,
                  a.id,
                  { startTime: Number(c.target.value) }
                )
              })
            }
          ),
          "秒"
        ] }),
        /* @__PURE__ */ o("label", { children: [
          /* @__PURE__ */ i("span", { children: "源起点" }),
          /* @__PURE__ */ i(
            "input",
            {
              type: "number",
              min: "0",
              step: "0.1",
              value: a.sourceStart,
              readOnly: d,
              onChange: (c) => r({
                speechTracks: z(
                  e.speechTracks,
                  a.id,
                  { sourceStart: Number(c.target.value) }
                )
              })
            }
          ),
          "秒"
        ] }),
        /* @__PURE__ */ o("label", { children: [
          /* @__PURE__ */ i("span", { children: "超出镜头" }),
          /* @__PURE__ */ o(
            "select",
            {
              value: a.fit,
              disabled: d,
              onChange: (c) => r({
                speechTracks: z(
                  e.speechTracks,
                  a.id,
                  {
                    fit: c.target.value
                  }
                )
              }),
              children: [
                /* @__PURE__ */ i("option", { value: "trim", children: "自动裁剪" }),
                /* @__PURE__ */ i("option", { value: "strict", children: "阻止合成" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ o("label", { children: [
          /* @__PURE__ */ i("span", { children: "音量" }),
          /* @__PURE__ */ i(
            "input",
            {
              type: "range",
              min: "0",
              max: "1",
              step: "0.05",
              value: a.volume,
              disabled: d,
              onChange: (c) => r({
                speechTracks: z(
                  e.speechTracks,
                  a.id,
                  { volume: Number(c.target.value) }
                )
              })
            }
          ),
          /* @__PURE__ */ o("small", { children: [
            Math.round(a.volume * 100),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            disabled: d,
            onClick: () => r({
              speechTracks: e.speechTracks.filter(
                (c) => c.id !== a.id
              )
            }),
            children: "移除"
          }
        )
      ] }, a.id)),
      e.blockingIssues.length ? /* @__PURE__ */ i("div", { className: "ws-video-compose-blocking", children: e.blockingIssues.map((a) => /* @__PURE__ */ i("span", { children: a }, a)) }) : null
    ] }) : /* @__PURE__ */ o("div", { className: "ws-video-compose-transition-fields", children: [
      /* @__PURE__ */ o("label", { children: [
        /* @__PURE__ */ i("span", { children: "转场" }),
        /* @__PURE__ */ i(
          "select",
          {
            value: e.transitionToNext.type,
            disabled: d,
            onChange: (a) => r({
              transitionToNext: {
                ...e.transitionToNext,
                type: a.target.value
              }
            }),
            children: He.map((a) => /* @__PURE__ */ i("optgroup", { label: a.name, children: a.options.map((t) => /* @__PURE__ */ i("option", { value: t.key, children: t.name }, t.key)) }, a.name))
          }
        )
      ] }),
      e.transitionToNext.type !== "none" ? /* @__PURE__ */ o("label", { children: [
        /* @__PURE__ */ i("span", { children: "时长" }),
        /* @__PURE__ */ i(
          "input",
          {
            type: "number",
            min: "0.1",
            max: "5",
            step: "0.1",
            value: e.transitionToNext.durationMs / 1e3,
            readOnly: d,
            onChange: (a) => r({
              transitionToNext: {
                ...e.transitionToNext,
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
function ui({
  composition: e,
  readonly: s,
  onChooseAudio: d,
  onChange: r
}) {
  const m = me.some(
    (n) => n.value === e.settings.resolution
  );
  return /* @__PURE__ */ o("div", { className: "ws-video-compose-global nodrag", children: [
    /* @__PURE__ */ o("label", { children: [
      /* @__PURE__ */ i("span", { children: "分辨率" }),
      /* @__PURE__ */ o(
        "select",
        {
          value: e.settings.resolution,
          disabled: s,
          onChange: (n) => r({
            ...e,
            settings: {
              ...e.settings,
              resolution: n.target.value
            }
          }),
          children: [
            m ? null : /* @__PURE__ */ i("option", { value: e.settings.resolution, children: e.settings.resolution.replace("x", " × ") }),
            me.map((n) => /* @__PURE__ */ i("option", { value: n.value, children: n.label }, n.value))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ o("label", { children: [
      /* @__PURE__ */ i("span", { children: "帧率" }),
      /* @__PURE__ */ o(
        "select",
        {
          value: e.settings.fps,
          disabled: s,
          onChange: (n) => r({
            ...e,
            settings: {
              ...e.settings,
              fps: Number(n.target.value)
            }
          }),
          children: [
            /* @__PURE__ */ i("option", { value: 0, children: "跟随首个镜头" }),
            [24, 25, 30, 50, 60].map((n) => /* @__PURE__ */ o("option", { value: n, children: [
              n,
              " 帧/秒"
            ] }, n))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ o("div", { className: "ws-video-compose-global-audio", children: [
      /* @__PURE__ */ o("div", { className: "ws-video-compose-global-audio-head", children: [
        /* @__PURE__ */ i("strong", { children: "全片声音" }),
        /* @__PURE__ */ o("button", { type: "button", disabled: s, onClick: d, children: [
          /* @__PURE__ */ i(fe, { size: 13 }),
          "添加全片声音"
        ] })
      ] }),
      e.audioTracks.map((n, a) => /* @__PURE__ */ o("div", { className: "ws-video-compose-speech-track", children: [
        /* @__PURE__ */ i("strong", { children: n.audio?.label || `全片声音 ${a + 1}` }),
        /* @__PURE__ */ o("label", { children: [
          /* @__PURE__ */ i("span", { children: "类型" }),
          /* @__PURE__ */ o(
            "select",
            {
              value: n.kind,
              disabled: s,
              onChange: (t) => {
                const c = t.target.value;
                r({
                  ...e,
                  audioTracks: T(
                    e.audioTracks,
                    n.id,
                    {
                      kind: c,
                      fit: c === "music" ? "trim" : "strict",
                      loop: c === "music" && n.loop,
                      fadeOut: c === "music" ? Math.max(1, n.fadeOut) : 0
                    }
                  )
                });
              },
              children: [
                /* @__PURE__ */ i("option", { value: "music", children: "背景音乐" }),
                /* @__PURE__ */ i("option", { value: "narration", children: "全片语音" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ o("label", { children: [
          /* @__PURE__ */ i("span", { children: "全片起点" }),
          /* @__PURE__ */ i(
            "input",
            {
              type: "number",
              min: "0",
              step: "0.1",
              value: n.startTime,
              readOnly: s,
              onChange: (t) => r({
                ...e,
                audioTracks: T(
                  e.audioTracks,
                  n.id,
                  { startTime: Number(t.target.value) }
                )
              })
            }
          ),
          "秒"
        ] }),
        /* @__PURE__ */ o("label", { children: [
          /* @__PURE__ */ i("span", { children: "源起点" }),
          /* @__PURE__ */ i(
            "input",
            {
              type: "number",
              min: "0",
              step: "0.1",
              value: n.sourceStart,
              readOnly: s,
              onChange: (t) => r({
                ...e,
                audioTracks: T(
                  e.audioTracks,
                  n.id,
                  { sourceStart: Number(t.target.value) }
                )
              })
            }
          ),
          "秒"
        ] }),
        /* @__PURE__ */ o("label", { children: [
          /* @__PURE__ */ i("span", { children: "超出全片" }),
          /* @__PURE__ */ o(
            "select",
            {
              value: n.fit,
              disabled: s,
              onChange: (t) => r({
                ...e,
                audioTracks: T(
                  e.audioTracks,
                  n.id,
                  {
                    fit: t.target.value
                  }
                )
              }),
              children: [
                /* @__PURE__ */ i("option", { value: "trim", children: "自动裁剪" }),
                /* @__PURE__ */ i("option", { value: "strict", children: "阻止合成" })
              ]
            }
          )
        ] }),
        n.kind === "music" ? /* @__PURE__ */ o(ve, { children: [
          /* @__PURE__ */ o("label", { children: [
            /* @__PURE__ */ i(
              "input",
              {
                type: "checkbox",
                checked: n.loop,
                disabled: s,
                onChange: (t) => r({
                  ...e,
                  audioTracks: T(
                    e.audioTracks,
                    n.id,
                    { loop: t.target.checked }
                  )
                })
              }
            ),
            /* @__PURE__ */ i("span", { children: "循环铺满" })
          ] }),
          /* @__PURE__ */ o("label", { children: [
            /* @__PURE__ */ i("span", { children: "淡出" }),
            /* @__PURE__ */ i(
              "input",
              {
                type: "number",
                min: "0",
                max: "10",
                step: "0.1",
                value: n.fadeOut,
                readOnly: s,
                onChange: (t) => r({
                  ...e,
                  audioTracks: T(
                    e.audioTracks,
                    n.id,
                    { fadeOut: Number(t.target.value) }
                  )
                })
              }
            ),
            "秒"
          ] })
        ] }) : null,
        /* @__PURE__ */ o("label", { children: [
          /* @__PURE__ */ i("span", { children: "音量" }),
          /* @__PURE__ */ i(
            "input",
            {
              type: "range",
              min: "0",
              max: "1",
              step: "0.05",
              value: n.volume,
              disabled: s,
              onChange: (t) => r({
                ...e,
                audioTracks: T(
                  e.audioTracks,
                  n.id,
                  { volume: Number(t.target.value) }
                )
              })
            }
          ),
          /* @__PURE__ */ o("small", { children: [
            Math.round(n.volume * 100),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            disabled: s,
            onClick: () => r({
              ...e,
              audioTracks: e.audioTracks.filter(
                (t) => t.id !== n.id
              )
            }),
            children: "移除"
          }
        )
      ] }, n.id))
    ] })
  ] });
}
function mi({
  clip: e,
  item: s,
  finalOutput: d
}) {
  const r = e?.visualVideo?.mediaUrl || s?.preview.videoUrl || "", m = e?.visualVideo?.mediaThumbnail || s?.preview.videoPosterUrl || "", n = Ze(d), [a, t] = I(
    n ? "final" : "clip"
  );
  ge(() => {
    n && t("final");
  }, [n, d]);
  const c = a === "final" && n;
  return /* @__PURE__ */ o("aside", { className: "ws-video-compose-preview", children: [
    /* @__PURE__ */ o("header", { children: [
      /* @__PURE__ */ i("strong", { children: c ? "合成结果" : e?.title || "视频预览" }),
      /* @__PURE__ */ o("div", { className: "ws-video-compose-preview-modes", children: [
        /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: c ? "" : "is-active",
            disabled: !e,
            onClick: () => t("clip"),
            children: "当前镜头"
          }
        ),
        /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: c ? "is-active" : "",
            disabled: !n,
            onClick: () => t("final"),
            children: "合成结果"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ i("div", { children: c ? /* @__PURE__ */ i(
      qe,
      {
        output: d,
        fallback: "视频合成结果",
        className: "ws-video-compose-final-output"
      }
    ) : r ? /* @__PURE__ */ i(
      ai,
      {
        src: r,
        poster: m || void 0,
        controls: !0,
        playsInline: !0,
        preload: m ? "none" : "metadata"
      },
      r
    ) : s?.preview.imageUrl ? /* @__PURE__ */ i(
      "img",
      {
        src: s.preview.imageUrl,
        alt: "",
        loading: "lazy",
        decoding: "async"
      }
    ) : /* @__PURE__ */ o("span", { children: [
      /* @__PURE__ */ i(be, { size: 28 }),
      "选择左侧镜头后预览"
    ] }) })
  ] });
}
function Ie(e, s = "") {
  return {
    id: Ci(),
    title: e.label || "镜头",
    ...s ? { sourceEdgeId: s } : {},
    visualVideo: e,
    originalAudioSource: e,
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
function pi(e, s) {
  const d = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), m = [], n = /* @__PURE__ */ new Map();
  for (const a of e) {
    if (!a.edge.id || ni(a.source) !== "video")
      continue;
    d.add(a.edge.id);
    const t = n.get(a.edge.id) || {
      complete: !0,
      references: []
    };
    n.set(a.edge.id, t);
    const c = oi(s, a.source);
    if (!c) {
      t.complete = !1;
      continue;
    }
    const v = ke(c, "video");
    if (!v.length) {
      t.complete = !1;
      continue;
    }
    t.references.push(...v);
  }
  for (const [a, t] of n)
    !t.complete || !t.references.length || (r.add(a), m.push(
      ...t.references.map((c) => ({ edgeId: a, reference: c }))
    ));
  return { edgeIds: d, resolvedEdgeIds: r, references: m };
}
function hi(e, s) {
  const d = /* @__PURE__ */ new Map();
  for (const a of s.references) {
    const t = pe(a);
    t && !d.has(t) && d.set(t, a);
  }
  let r = !1;
  const m = /* @__PURE__ */ new Set(), n = e.clips.flatMap((a) => {
    if (!a.sourceEdgeId || !We({ id: a.sourceEdgeId }))
      return [a];
    if (!s.edgeIds.has(a.sourceEdgeId))
      return r = !0, [];
    if (!s.resolvedEdgeIds.has(a.sourceEdgeId))
      return [a];
    const t = pe({
      edgeId: a.sourceEdgeId,
      reference: a.visualVideo
    });
    return !t || !d.has(t) || m.has(t) ? (r = !0, []) : (m.add(t), [a]);
  });
  for (const [a, t] of d) {
    if (m.has(a))
      continue;
    const c = F(t.reference), v = n.findIndex(
      (g) => !g.sourceEdgeId && F(g.visualVideo) === c
    );
    v >= 0 ? n[v] = {
      ...n[v],
      sourceEdgeId: t.edgeId
    } : n.push(Ie(t.reference, t.edgeId)), m.add(a), r = !0;
  }
  return r ? { ...e, clips: n } : e;
}
function pe(e) {
  const s = F(e.reference);
  return e.edgeId && s ? `${e.edgeId}:${s}` : "";
}
function vi(e) {
  const s = Number(e.refId || 0), d = Number(e.versionID || 0);
  return !s || !d ? null : { assetId: s, versionId: d, label: e.title };
}
function ke(e, s) {
  const d = vi(e);
  if (!d)
    return [];
  const r = s === "video" ? e.preview.videoUrl : e.preview.audioUrl, m = gi([
    ...X(e.output, s),
    ...X(e.asset, s),
    ...r ? [
      {
        url: r,
        thumbnail: s === "video" ? e.preview.videoPosterUrl : void 0
      }
    ] : []
  ]);
  return m.length ? Ne(d, m, s) : [d];
}
function he(e) {
  return !e.versionID || e.kind !== "video" ? [] : Ne(
    { assetId: e.id, versionId: e.versionID, label: e.name },
    X(e.version?.content, "video"),
    "video"
  );
}
function Ne(e, s, d) {
  const r = d === "video" ? "视频" : "音频";
  return s.map((m, n) => ({
    ...e,
    label: s.length > 1 ? `${e.label || r} · ${r} ${n + 1}` : e.label,
    mediaIndex: n + 1,
    mediaUrl: m.url,
    ...m.thumbnail ? { mediaThumbnail: m.thumbnail } : {}
  }));
}
function gi(e) {
  const s = /* @__PURE__ */ new Map();
  for (const d of e) {
    const r = d.url.trim();
    if (!r)
      continue;
    const m = s.get(r);
    if (!m) {
      s.set(r, { ...d, url: r });
      continue;
    }
    !m.thumbnail && d.thumbnail && s.set(r, { ...m, thumbnail: d.thumbnail });
  }
  return Array.from(s.values());
}
function fi(e, s) {
  if (s)
    return e.find(
      (d) => Number(d.refId || 0) === s.assetId && Number(d.versionID || 0) === s.versionId
    );
}
function bi(e) {
  return {
    id: Te(),
    audio: e,
    startTime: 0,
    sourceStart: 0,
    fit: "trim",
    kind: "dialogue",
    text: "",
    volume: 1
  };
}
function wi(e) {
  return {
    id: Te("global-audio"),
    audio: e,
    startTime: 0,
    sourceStart: 0,
    kind: "music",
    volume: 0.35,
    fit: "trim",
    loop: !1,
    fadeOut: 1
  };
}
function z(e, s, d) {
  return e.map(
    (r) => r.id === s ? { ...r, ...d } : r
  );
}
function T(e, s, d) {
  return e.map(
    (r) => r.id === s ? { ...r, ...d } : r
  );
}
function Ci() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? `clip-${crypto.randomUUID()}` : `clip-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Te(e = "speech") {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? `${e}-${crypto.randomUUID()}` : `${e}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
export {
  Ei as VideoComposeView
};
