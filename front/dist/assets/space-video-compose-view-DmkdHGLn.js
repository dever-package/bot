import { c as Z, a as n, j as e, F as me } from "./createLucideIcon-CEtb6KSk.js";
import { u as f, a as _, c as G, b as he } from "./runtime-entry-CIrzyMsA.js";
import { L as ve } from "./loader-circle-QnfinZ3F.js";
import { C as K } from "./space-power-icon-DPR3KYFq.js";
import { M as ge } from "./interaction-d6W_Ir2J.js";
import { P as ee } from "./play-cbWwOmIe.js";
import { P as be } from "./plus-Di9i7LEg.js";
import { V as E } from "./volume-2-DdZ8s7Ri.js";
import { o as X, s as H, m as fe } from "./space-DNu08Ce2.js";
import { b as ie, x as Ce, y as we, z as Ne, D as ke, V as ye, E as Ie, C as Te } from "./upload-asset-api-DAbIOMVJ.js";
import { T as De } from "./trash-2-EsqTj1ob.js";
import { S as Me } from "./space-sequence-card-z9keCOTE.js";
import { V as Oe } from "./video-BAp8-tqb.js";
import { X as Ve } from "./x-D8YQA7_X.js";
const Se = [
  ["circle", { cx: "8", cy: "18", r: "4", key: "1fc0mg" }],
  ["path", { d: "M12 18V2l7 4", key: "g04rme" }]
], xe = Z("music-2", Se);
const Pe = [
  ["path", { d: "m18 14 4 4-4 4", key: "10pe0f" }],
  ["path", { d: "m18 2 4 4-4 4", key: "pucp1d" }],
  ["path", { d: "M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22", key: "1ailkh" }],
  ["path", { d: "M2 6h1.972a4 4 0 0 1 3.6 2.2", key: "km57vx" }],
  ["path", { d: "M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45", key: "os18l9" }]
], Ue = Z("shuffle", Pe);
function ze({
  clip: i,
  index: t,
  last: s,
  item: c,
  selected: a,
  readonly: h,
  wholeCardDraggable: l,
  dragging: d,
  dropPlacement: v,
  onSelect: p,
  onPanel: w,
  onRemove: N,
  onDuration: O,
  onDragStart: V,
  onDragOver: g,
  onDrop: b,
  onDragEnd: S
}) {
  const x = !s && i.transitionToNext.type !== "none", $ = !!(i.originalAudioSource || i.speechTracks.length > 0);
  return /* @__PURE__ */ n(
    Me,
    {
      itemId: i.id,
      index: t,
      durationLabel: i.duration > 0 ? `${$e(i.duration)}秒` : "待读取",
      className: "ws-video-compose-card",
      dragClassName: "ws-video-compose-drag",
      selected: a,
      readonly: h,
      wholeCardDraggable: l,
      dragging: d,
      dropPlacement: v,
      ariaLabel: `镜头 ${t + 1}`,
      onSelect: p,
      onDragStart: V,
      onDragOver: g,
      onDrop: b,
      onDragEnd: S,
      headerActions: h ? void 0 : /* @__PURE__ */ e(ie, { label: "删除镜头", children: /* @__PURE__ */ e(
        "button",
        {
          type: "button",
          className: "ws-video-compose-remove",
          "aria-label": `删除镜头 ${t + 1}`,
          onClick: (C) => {
            C.stopPropagation(), N();
          },
          children: /* @__PURE__ */ e(De, { size: 12 })
        }
      ) }),
      children: [
        /* @__PURE__ */ e("div", { className: "ws-video-compose-card-preview", children: c?.preview.videoUrl ? /* @__PURE__ */ e(
          "video",
          {
            src: c.preview.videoUrl,
            muted: !0,
            playsInline: !0,
            preload: "metadata",
            onLoadedMetadata: (C) => {
              const k = C.currentTarget.duration;
              Number.isFinite(k) && k > 0 && O(k);
            }
          }
        ) : c?.preview.imageUrl ? /* @__PURE__ */ e(
          "img",
          {
            src: c.preview.imageUrl,
            alt: "",
            loading: "lazy",
            decoding: "async"
          }
        ) : /* @__PURE__ */ e("div", { children: /* @__PURE__ */ e("span", { children: "素材不可用" }) }) }),
        /* @__PURE__ */ n("div", { className: "ws-video-compose-card-meta", children: [
          /* @__PURE__ */ e("strong", { className: "ws-video-compose-card-title", children: i.title || c?.title || `镜头 ${t + 1}` }),
          i.blockingIssues.length ? /* @__PURE__ */ e("small", { className: "ws-video-compose-card-blocking", children: i.blockingIssues[0] }) : null
        ] }),
        /* @__PURE__ */ n("footer", { children: [
          /* @__PURE__ */ e(
            W,
            {
              active: $,
              label: "声音",
              icon: /* @__PURE__ */ e(E, { size: 12 }),
              onClick: () => w("sound")
            }
          ),
          s ? /* @__PURE__ */ e("span", {}) : /* @__PURE__ */ e(
            W,
            {
              active: x,
              label: "转场",
              icon: /* @__PURE__ */ e(Ue, { size: 12 }),
              onClick: () => w("transition")
            }
          )
        ] })
      ]
    }
  );
}
function W({
  label: i,
  icon: t,
  active: s,
  onClick: c
}) {
  return /* @__PURE__ */ n(
    "button",
    {
      type: "button",
      className: s ? "is-active" : "",
      onClick: (a) => {
        a.stopPropagation(), c();
      },
      children: [
        t,
        i
      ]
    }
  );
}
function $e(i) {
  return i >= 10 ? Math.round(i).toString() : i.toFixed(1);
}
function Re({
  title: i,
  kind: t,
  items: s,
  onSelect: c,
  onClose: a
}) {
  const h = s.filter(
    (d) => d.kind === t && Number(d.refId || 0) > 0 && Number(d.versionID || 0) > 0
  ), l = t === "video" ? Oe : xe;
  return /* @__PURE__ */ e("div", { className: "ws-video-compose-picker-backdrop", onMouseDown: a, children: /* @__PURE__ */ n(
    "section",
    {
      className: "ws-video-compose-picker",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": i,
      onMouseDown: (d) => d.stopPropagation(),
      children: [
        /* @__PURE__ */ n("header", { children: [
          /* @__PURE__ */ n("div", { children: [
            /* @__PURE__ */ e("strong", { children: i }),
            /* @__PURE__ */ n("span", { children: [
              "选择当前画布中已经生成的",
              t === "video" ? "视频" : "音频",
              "素材"
            ] })
          ] }),
          /* @__PURE__ */ e("button", { type: "button", onClick: a, "aria-label": "关闭", children: /* @__PURE__ */ e(Ve, { size: 17 }) })
        ] }),
        /* @__PURE__ */ e("div", { className: "ws-video-compose-picker-grid", children: h.length ? h.map((d) => /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            onClick: () => c(d),
            children: [
              /* @__PURE__ */ e("span", { className: "ws-video-compose-picker-preview", children: d.preview.imageUrl ? /* @__PURE__ */ e(
                "img",
                {
                  src: d.preview.imageUrl,
                  alt: "",
                  loading: "lazy",
                  decoding: "async"
                }
              ) : d.preview.videoUrl ? /* @__PURE__ */ e(
                "video",
                {
                  src: d.preview.videoUrl,
                  muted: !0,
                  playsInline: !0,
                  preload: "metadata"
                }
              ) : /* @__PURE__ */ e(l, { size: 24 }) }),
              /* @__PURE__ */ e("strong", { children: d.title })
            ]
          },
          `${d.refId}:${d.versionID}`
        )) : /* @__PURE__ */ n("div", { className: "ws-video-compose-picker-empty", children: [
          /* @__PURE__ */ e(l, { size: 28 }),
          /* @__PURE__ */ n("strong", { children: [
            "暂无可用",
            t === "video" ? "视频" : "音频"
          ] }),
          /* @__PURE__ */ e("span", { children: "请先运行对应节点，或通过导入节点添加素材。" })
        ] }) })
      ]
    }
  ) });
}
const J = [
  { value: "auto", label: "跟随首个镜头" },
  { value: "1280x720", label: "720P" },
  { value: "1920x1080", label: "1080P" },
  { value: "3840x2160", label: "4K" }
];
function Ae({
  composition: i,
  referenceItems: t,
  readonly: s = !1,
  running: c = !1,
  fullScreen: a = !1,
  finalOutput: h,
  onChange: l,
  onRun: d,
  onOpenDetail: v
}) {
  const p = i || ke(), [w, N] = f(
    p.clips[0]?.id || ""
  ), [O, V] = f(
    ""
  ), [g, b] = f(""), [S, x] = f(""), [$, C] = f(""), [k, R] = f([]), [oe, ne] = f(
    "before"
  ), I = _(null), P = _(""), T = _([]), B = G(
    () => X(p.clips, k, (o) => o.id),
    [k, p.clips]
  ), m = p.clips.find((o) => o.id === w) || p.clips[0], se = m ? je(t, m.visualVideo) : void 0, F = Ce(p), U = we(p), te = c || s || p.clips.length === 0 || U.length > 0, re = G(() => {
    const o = /* @__PURE__ */ new Map();
    for (const r of t)
      r.refId && r.versionID && o.set(`${r.refId}:${r.versionID}`, r);
    return o;
  }, [t]), D = (o) => {
    s || l?.(o);
  }, z = (o, r) => {
    D({
      ...p,
      clips: p.clips.map(
        (u) => u.id === o ? { ...u, ...r } : u
      )
    });
  }, ae = (o, r) => {
    N(o), V(
      (u) => w === o && u === r ? "" : r
    );
  }, le = (o) => {
    const r = Le(o);
    if (r) {
      if (g === "clip") {
        const u = Fe(r);
        D({ ...p, clips: [...p.clips, u] }), N(u.id);
      } else if (g === "original" && m)
        z(m.id, {
          originalAudioSource: r
        });
      else if (g === "speech" && m) {
        const u = qe(r);
        z(m.id, {
          speechTracks: [...m.speechTracks, u]
        });
      }
      b("");
    }
  }, ce = (o) => {
    const r = p.clips.map((u) => u.id);
    P.current = o, T.current = r, x(o), C(""), R(r);
  }, de = (o, r) => {
    const u = P.current, y = T.current;
    if (!u || !o || u === o || !y.includes(u) || !y.includes(o))
      return;
    const M = r.currentTarget.getBoundingClientRect(), q = r.currentTarget.parentElement?.getBoundingClientRect(), Y = !!(q && M.width * 1.5 < q.width) ? r.clientX < M.left + M.width / 2 ? "before" : "after" : r.clientY < M.top + M.height / 2 ? "before" : "after", A = fe(
      y,
      u,
      o,
      Y,
      (pe) => pe
    );
    C(o), ne(Y), !H(y, A) && (T.current = A, R(A));
  }, L = () => {
    P.current = "", T.current = [], x(""), C(""), R([]);
  }, ue = () => {
    const o = X(
      p.clips,
      T.current,
      (r) => r.id
    );
    H(
      p.clips.map((r) => r.id),
      o.map((r) => r.id)
    ) || D({ ...p, clips: o }), L();
  }, j = /* @__PURE__ */ n(
    "section",
    {
      className: `ws-video-compose ${a ? "is-fullscreen" : "is-compact"}`,
      children: [
        /* @__PURE__ */ n("header", { className: "ws-video-compose-head", children: [
          /* @__PURE__ */ n("div", { className: "ws-video-compose-actions nodrag", children: [
            /* @__PURE__ */ n("span", { children: [
              /* @__PURE__ */ e(K, { size: 14 }),
              "视频合成"
            ] }),
            /* @__PURE__ */ n("small", { children: [
              p.clips.length,
              " 个镜头",
              F > 0 ? ` · ${Ke(F)} 秒` : "",
              U.length ? ` · ${U.length} 项待处理` : ""
            ] })
          ] }),
          /* @__PURE__ */ n("div", { children: [
            s ? null : /* @__PURE__ */ n("button", { type: "button", onClick: () => b("clip"), children: [
              /* @__PURE__ */ e(be, { size: 13 }),
              "添加镜头"
            ] }),
            !a && v ? /* @__PURE__ */ n("button", { type: "button", onClick: v, children: [
              /* @__PURE__ */ e(ge, { size: 13 }),
              "打开合成器"
            ] }) : null,
            d ? /* @__PURE__ */ e(ie, { label: U[0] || "开始合成", children: /* @__PURE__ */ e("span", { className: "ws-video-compose-tooltip-trigger", children: /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "is-primary",
                disabled: te,
                onClick: () => d(p),
                children: [
                  c ? /* @__PURE__ */ e(ve, { size: 13, className: "ws-spin" }) : /* @__PURE__ */ e(ee, { size: 13, fill: "currentColor" }),
                  c ? "合成中" : "开始合成"
                ]
              }
            ) }) }) : null
          ] })
        ] }),
        /* @__PURE__ */ e(
          "div",
          {
            ref: I,
            className: "ws-video-compose-grid nodrag nowheel",
            onDragOver: (o) => {
              if (!P.current || !I.current)
                return;
              const r = I.current.getBoundingClientRect();
              o.clientY < r.top + 36 ? I.current.scrollTop -= 12 : o.clientY > r.bottom - 36 && (I.current.scrollTop += 12);
            },
            children: p.clips.length ? B.map((o, r) => /* @__PURE__ */ e(
              ze,
              {
                clip: o,
                index: r,
                last: r === B.length - 1,
                item: re.get(
                  Ne(o.visualVideo)
                ),
                selected: o.id === m?.id,
                readonly: s,
                wholeCardDraggable: a,
                dragging: S === o.id,
                dropPlacement: $ === o.id && S !== o.id ? oe : void 0,
                onSelect: () => N(o.id),
                onPanel: (u) => ae(o.id, u),
                onRemove: () => {
                  const u = p.clips.filter((y) => y.id !== o.id);
                  D({ ...p, clips: u }), w === o.id && (N(u[0]?.id || ""), V(""));
                },
                onDuration: (u) => {
                  o.duration <= 0 && u > 0 && z(o.id, { duration: u });
                },
                onDragStart: () => ce(o.id),
                onDragOver: (u) => de(o.id, u),
                onDrop: ue,
                onDragEnd: L
              },
              o.id
            )) : /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "ws-video-compose-empty",
                disabled: s,
                onClick: () => b("clip"),
                children: [
                  /* @__PURE__ */ e(K, { size: 26 }),
                  /* @__PURE__ */ e("strong", { children: "等待添加镜头" }),
                  /* @__PURE__ */ e("span", { children: "从当前画布选择已经生成的视频素材" })
                ]
              }
            )
          }
        ),
        m && O ? /* @__PURE__ */ e(
          _e,
          {
            clip: m,
            panel: O,
            readonly: s,
            onChange: (o) => z(m.id, o),
            onChooseOriginal: () => b("original"),
            onChooseSpeech: () => b("speech")
          }
        ) : null,
        a ? /* @__PURE__ */ e(
          Ee,
          {
            composition: p,
            readonly: s,
            onChange: D
          }
        ) : null
      ]
    }
  );
  return /* @__PURE__ */ n(me, { children: [
    a ? /* @__PURE__ */ n("div", { className: "ws-video-compose-workspace", children: [
      /* @__PURE__ */ e("div", { className: "ws-video-compose-operations", children: j }),
      /* @__PURE__ */ e(
        Be,
        {
          clip: m,
          item: se,
          finalOutput: h
        }
      )
    ] }) : j,
    g ? /* @__PURE__ */ e(
      Re,
      {
        title: g === "clip" ? "添加镜头" : g === "original" ? "选择原声来源" : "添加语音轨",
        kind: g === "clip" ? "video" : "audio",
        items: t,
        onSelect: le,
        onClose: () => b("")
      }
    ) : null
  ] });
}
function _e({
  clip: i,
  panel: t,
  readonly: s,
  onChange: c,
  onChooseOriginal: a,
  onChooseSpeech: h
}) {
  return /* @__PURE__ */ n("div", { className: "ws-video-compose-inspector nodrag nowheel", children: [
    /* @__PURE__ */ e("strong", { children: t === "sound" ? "声音" : "转场" }),
    t === "sound" ? /* @__PURE__ */ n("div", { className: "ws-video-compose-sound-fields", children: [
      /* @__PURE__ */ n("button", { type: "button", disabled: s, onClick: a, children: [
        /* @__PURE__ */ e(E, { size: 13 }),
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
            disabled: s || !i.originalAudioSource,
            onChange: (l) => c({
              originalVolume: Number(l.target.value)
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
          disabled: s,
          onClick: () => c({ originalAudioSource: void 0 }),
          children: "移除原声"
        }
      ) : null,
      /* @__PURE__ */ n("button", { type: "button", disabled: s, onClick: h, children: [
        /* @__PURE__ */ e(E, { size: 13 }),
        "添加语音轨"
      ] }),
      i.speechTracks.map((l, d) => /* @__PURE__ */ n("div", { className: "ws-video-compose-speech-track", children: [
        /* @__PURE__ */ e("strong", { children: l.audio?.label || `语音 ${d + 1}` }),
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ e("span", { children: "开始时间" }),
          /* @__PURE__ */ e(
            "input",
            {
              type: "number",
              min: "0",
              step: "0.1",
              value: l.startTime,
              readOnly: s,
              onChange: (v) => c({
                speechTracks: Q(
                  i.speechTracks,
                  l.id,
                  { startTime: Number(v.target.value) }
                )
              })
            }
          ),
          "秒"
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
              value: l.volume,
              disabled: s,
              onChange: (v) => c({
                speechTracks: Q(
                  i.speechTracks,
                  l.id,
                  { volume: Number(v.target.value) }
                )
              })
            }
          ),
          /* @__PURE__ */ n("small", { children: [
            Math.round(l.volume * 100),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            disabled: s,
            onClick: () => c({
              speechTracks: i.speechTracks.filter(
                (v) => v.id !== l.id
              )
            }),
            children: "移除"
          }
        )
      ] }, l.id)),
      i.blockingIssues.length ? /* @__PURE__ */ e("div", { className: "ws-video-compose-blocking", children: i.blockingIssues.map((l) => /* @__PURE__ */ e("span", { children: l }, l)) }) : null
    ] }) : /* @__PURE__ */ n("div", { className: "ws-video-compose-transition-fields", children: [
      /* @__PURE__ */ n("label", { children: [
        /* @__PURE__ */ e("span", { children: "转场" }),
        /* @__PURE__ */ e(
          "select",
          {
            value: i.transitionToNext.type,
            disabled: s,
            onChange: (l) => c({
              transitionToNext: {
                ...i.transitionToNext,
                type: l.target.value
              }
            }),
            children: ye.map((l) => /* @__PURE__ */ e("optgroup", { label: l.name, children: l.options.map((d) => /* @__PURE__ */ e("option", { value: d.key, children: d.name }, d.key)) }, l.name))
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
            readOnly: s,
            onChange: (l) => c({
              transitionToNext: {
                ...i.transitionToNext,
                durationMs: Math.round(Number(l.target.value) * 1e3)
              }
            })
          }
        ),
        "秒"
      ] }) : null
    ] })
  ] });
}
function Ee({
  composition: i,
  readonly: t,
  onChange: s
}) {
  const c = J.some(
    (a) => a.value === i.settings.resolution
  );
  return /* @__PURE__ */ n("div", { className: "ws-video-compose-global nodrag", children: [
    /* @__PURE__ */ n("label", { children: [
      /* @__PURE__ */ e("span", { children: "分辨率" }),
      /* @__PURE__ */ n(
        "select",
        {
          value: i.settings.resolution,
          disabled: t,
          onChange: (a) => s({
            ...i,
            settings: {
              ...i.settings,
              resolution: a.target.value
            }
          }),
          children: [
            c ? null : /* @__PURE__ */ e("option", { value: i.settings.resolution, children: i.settings.resolution.replace("x", " × ") }),
            J.map((a) => /* @__PURE__ */ e("option", { value: a.value, children: a.label }, a.value))
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
          disabled: t,
          onChange: (a) => s({
            ...i,
            settings: {
              ...i.settings,
              fps: Number(a.target.value)
            }
          }),
          children: [
            /* @__PURE__ */ e("option", { value: 0, children: "跟随首个镜头" }),
            [24, 25, 30, 50, 60].map((a) => /* @__PURE__ */ n("option", { value: a, children: [
              a,
              " 帧/秒"
            ] }, a))
          ]
        }
      )
    ] })
  ] });
}
function Be({
  clip: i,
  item: t,
  finalOutput: s
}) {
  const c = t?.preview.videoUrl || "", a = Ie(s), [h, l] = f(
    a ? "final" : "clip"
  );
  he(() => {
    a && l("final");
  }, [a, s]);
  const d = h === "final" && a;
  return /* @__PURE__ */ n("aside", { className: "ws-video-compose-preview", children: [
    /* @__PURE__ */ n("header", { children: [
      /* @__PURE__ */ e("strong", { children: d ? "合成结果" : i?.title || "视频预览" }),
      /* @__PURE__ */ n("div", { className: "ws-video-compose-preview-modes", children: [
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: d ? "" : "is-active",
            disabled: !i,
            onClick: () => l("clip"),
            children: "当前镜头"
          }
        ),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            className: d ? "is-active" : "",
            disabled: !a,
            onClick: () => l("final"),
            children: "合成结果"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e("div", { children: d ? /* @__PURE__ */ e(
      Te,
      {
        output: s,
        fallback: "视频合成结果",
        className: "ws-video-compose-final-output"
      }
    ) : c ? /* @__PURE__ */ e(
      "video",
      {
        src: c,
        controls: !0,
        playsInline: !0,
        preload: "metadata"
      },
      c
    ) : t?.preview.imageUrl ? /* @__PURE__ */ e(
      "img",
      {
        src: t.preview.imageUrl,
        alt: "",
        loading: "lazy",
        decoding: "async"
      }
    ) : /* @__PURE__ */ n("span", { children: [
      /* @__PURE__ */ e(ee, { size: 28 }),
      "选择左侧镜头后预览"
    ] }) })
  ] });
}
function Fe(i) {
  return {
    id: Ye(),
    title: i.label || "镜头",
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
function Le(i) {
  const t = Number(i.refId || 0), s = Number(i.versionID || 0);
  return !t || !s ? null : { assetId: t, versionId: s, label: i.title };
}
function je(i, t) {
  if (t)
    return i.find(
      (s) => Number(s.refId || 0) === t.assetId && Number(s.versionID || 0) === t.versionId
    );
}
function qe(i) {
  return {
    id: Ge(),
    audio: i,
    startTime: 0,
    kind: "dialogue",
    text: "",
    volume: 1
  };
}
function Q(i, t, s) {
  return i.map(
    (c) => c.id === t ? { ...c, ...s } : c
  );
}
function Ye() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? `clip-${crypto.randomUUID()}` : `clip-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Ge() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? `speech-${crypto.randomUUID()}` : `speech-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function Ke(i) {
  return i >= 10 ? Math.round(i).toString() : i.toFixed(1);
}
const ci = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  VideoComposeView: Ae
}, Symbol.toStringTag, { value: "Module" }));
export {
  xe as M,
  Ae as V,
  ci as s
};
