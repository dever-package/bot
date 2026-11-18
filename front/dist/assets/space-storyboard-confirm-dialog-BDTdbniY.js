import { j as e, a as n } from "./space-storyboard-material-ECvLpyk_.js";
import { a as S, u as f, d as C } from "./file-kind-Cq3pESGF.js";
import { c as D } from "./space-assistant-layout-Drz4je9C.js";
import { X as E, n as b, r as L } from "./vendor-icons-BZHLe0mm.js";
import { s as M, a as T, b as x, d as y, e as z, f as I, g as j, h as U } from "./asset-preview-Bb3VoJnt.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-confirm-dialog-D4bO_bnb.css", import.meta.url).href]);
const V = [
  {
    value: "shot_images",
    title: "生成参考图",
    description: "生成素材设定和逐镜参考图，之后可自行连线继续制作。"
  },
  {
    value: "shot_videos",
    title: "生成镜头视频",
    description: "生成参考图、各镜头视频和所选附加内容，不创建最终合成。"
  },
  {
    value: "final_video",
    title: "完成视频",
    description: "生成参考图、各镜头视频和所选附加内容，并完成视频合成。"
  }
];
function q({
  errorFeedback: i,
  storyboard: t,
  submitting: r,
  portalContainer: u,
  onClose: a,
  onConfirm: h
}) {
  const [s, v] = S(
    () => M(t)
  ), c = T(t), l = x(t), m = f(
    () => $(s, {
      speech: c > 0,
      subtitles: l > 0
    }),
    [s, c, l]
  ), p = f(
    () => ({ ...t, production_plan: m }),
    [m, t]
  ), g = f(
    () => A(p),
    [p]
  ), P = y(
    p
  );
  C(() => {
    const o = (d) => {
      d.key === "Escape" && !r && a();
    };
    return window.addEventListener("keydown", o), () => window.removeEventListener("keydown", o);
  }, [a, r]);
  const _ = (o, d) => {
    v((N) => ({
      ...N,
      [o]: d ? o === "voice_mode" && t.production_plan.voice_mode === "native" ? "native" : "auto" : "off"
    }));
  }, k = async () => {
    await h(m) && a();
  };
  return D(
    /* @__PURE__ */ e(
      "div",
      {
        className: "ws-storyboard-shot-backdrop ws-storyboard-confirm-backdrop",
        onMouseDown: () => {
          r || a();
        },
        children: /* @__PURE__ */ n(
          "section",
          {
            className: "ws-storyboard-shot-dialog ws-storyboard-confirm-dialog",
            role: "dialog",
            "aria-modal": "true",
            "aria-label": "确认分镜制作方案",
            onMouseDown: (o) => o.stopPropagation(),
            children: [
              i,
              /* @__PURE__ */ n("header", { children: [
                /* @__PURE__ */ n("div", { children: [
                  /* @__PURE__ */ e("strong", { children: "选择生成结果" }),
                  /* @__PURE__ */ e("span", { children: "确认后会创建制作区；需要调整脚本时仍可创建修订稿。" })
                ] }),
                /* @__PURE__ */ e(
                  "button",
                  {
                    type: "button",
                    "aria-label": "关闭",
                    disabled: r,
                    onClick: a,
                    children: /* @__PURE__ */ e(E, { size: 18 })
                  }
                )
              ] }),
              /* @__PURE__ */ n("div", { className: "ws-storyboard-confirm-body nowheel", children: [
                /* @__PURE__ */ n("div", { className: "ws-storyboard-confirm-summary", children: [
                  /* @__PURE__ */ e("strong", { children: t.title.trim() || "分镜脚本" }),
                  /* @__PURE__ */ n("span", { children: [
                    t.shots.length,
                    " 个镜头"
                  ] }),
                  /* @__PURE__ */ n("span", { children: [
                    z(t),
                    " 秒"
                  ] }),
                  /* @__PURE__ */ n("span", { children: [
                    c,
                    " 条语音"
                  ] })
                ] }),
                /* @__PURE__ */ n("fieldset", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ e("legend", { children: "产出目标" }),
                  /* @__PURE__ */ e("div", { className: "ws-storyboard-output-options", children: V.map((o) => /* @__PURE__ */ n(
                    "label",
                    {
                      className: s.output_target === o.value ? "is-selected" : "",
                      children: [
                        /* @__PURE__ */ e(
                          "input",
                          {
                            type: "radio",
                            name: "storyboard-output-target",
                            value: o.value,
                            checked: s.output_target === o.value,
                            disabled: r,
                            onChange: () => v((d) => ({
                              ...d,
                              output_target: o.value
                            }))
                          }
                        ),
                        /* @__PURE__ */ n("span", { children: [
                          /* @__PURE__ */ e("strong", { children: o.title }),
                          /* @__PURE__ */ e("small", { children: o.description })
                        ] }),
                        s.output_target === o.value ? /* @__PURE__ */ e(b, { size: 16, "aria-hidden": "true" }) : null
                      ]
                    },
                    o.value
                  )) })
                ] }),
                P ? /* @__PURE__ */ n("fieldset", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ e("legend", { children: "附加内容" }),
                  /* @__PURE__ */ e(
                    w,
                    {
                      title: t.production_plan.voice_mode === "native" ? "视频原声" : "配音",
                      description: t.production_plan.voice_mode === "native" ? "逐镜生成脚本台词与环境声，合成保留视频原声。" : c > 0 ? `按脚本中的 ${c} 条对白或旁白创建配音。` : "当前脚本没有对白或旁白。",
                      checked: s.voice_mode === "native" || c > 0 && s.voice_mode === "auto",
                      disabled: r || c === 0 && t.production_plan.voice_mode !== "native",
                      onChange: (o) => _("voice_mode", o)
                    }
                  ),
                  /* @__PURE__ */ e(
                    w,
                    {
                      title: "字幕",
                      description: l > 0 ? `按脚本中的 ${l} 条字幕内容创建字幕组。` : "当前脚本没有可用字幕内容。",
                      checked: l > 0 && s.subtitle_mode === "auto",
                      disabled: r || l === 0,
                      onChange: (o) => _("subtitle_mode", o)
                    }
                  )
                ] }) : null,
                /* @__PURE__ */ n("section", { className: "ws-storyboard-confirm-section", children: [
                  /* @__PURE__ */ n("div", { className: "ws-storyboard-confirm-section-title", children: [
                    /* @__PURE__ */ e("strong", { children: "制作流程" }),
                    /* @__PURE__ */ e("span", { children: "镜头参考图由分镜连续性自动判断，无需手动选择。" })
                  ] }),
                  /* @__PURE__ */ e("div", { className: "ws-storyboard-production-flow", children: g.map((o, d) => /* @__PURE__ */ n("span", { children: [
                    d > 0 ? /* @__PURE__ */ e("i", { "aria-hidden": "true", children: "/" }) : null,
                    o
                  ] }, o)) })
                ] })
              ] }),
              /* @__PURE__ */ n("footer", { children: [
                /* @__PURE__ */ e("button", { type: "button", disabled: r, onClick: a, children: "返回修改" }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "is-primary",
                    disabled: r,
                    onClick: () => {
                      k();
                    },
                    children: [
                      r ? /* @__PURE__ */ e(L, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ e(b, { size: 15 }),
                      r ? "创建中" : F(s.output_target)
                    ]
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    u || document.body
  );
}
function w({
  title: i,
  description: t,
  checked: r,
  disabled: u,
  onChange: a
}) {
  return /* @__PURE__ */ n("label", { className: `ws-storyboard-production-switch${u ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ n("span", { children: [
      /* @__PURE__ */ e("strong", { children: i }),
      /* @__PURE__ */ e("small", { children: t })
    ] }),
    /* @__PURE__ */ e(
      "input",
      {
        type: "checkbox",
        checked: r,
        disabled: u,
        onChange: (h) => a(h.target.checked)
      }
    ),
    /* @__PURE__ */ e("i", { "aria-hidden": "true" })
  ] });
}
function $(i, t) {
  if (!["shot_videos", "final_video"].includes(i.output_target))
    return {
      ...i,
      voice_mode: "off",
      subtitle_mode: "off"
    };
  const r = i.voice_mode === "native" ? "native" : t.speech && i.voice_mode === "auto" ? "auto" : "off";
  return {
    ...i,
    voice_mode: r,
    subtitle_mode: t.subtitles && i.subtitle_mode === "auto" ? "auto" : "off"
  };
}
function A(i) {
  if (i.production_plan.output_target === "storyboard_only")
    return ["确认分镜"];
  const t = [
    ...i.materials.length ? ["素材设定"] : [],
    "镜头参考图"
  ];
  return y(i) && t.push("镜头视频"), I(i) && t.push("配音"), j(i) && t.push("字幕"), U(i) && t.push("视频合成"), t;
}
function F(i) {
  return i === "shot_images" ? "创建参考图" : i === "shot_videos" ? "创建镜头视频" : "完成视频";
}
export {
  q as StoryboardConfirmDialog
};
