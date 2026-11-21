if (!window.DeverFront?.ensureStyles) {
  throw new Error("Dever front runtime does not support chunk styles");
}
await window.DeverFront.ensureStyles([new URL("./space-storyboard-view-VOsjM4rT.css", import.meta.url).href]);
import { j as e, a as t, F as I } from "./preloadable-CnUP9jgB.js";
import { X as O, n as y, r as T } from "./vendor-icons-B8sieP24.js";
import { a as w, n as E, u as g } from "./file-kind-Cq3pESGF.js";
import { D as A } from "./asset-audio-preview-CsYcyVm8.js";
import { c as F, d as L, e as M, g as j, h as C, i as x, j as V, k as z, l as $ } from "./asset-preview-DonyTaaN.js";
/* empty css                               */
await window.DeverFront?.ensureCompat?.(["@/components/ui/dialog"]);
const u = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!u || Object.keys(u).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const G = u.Dialog, U = u.DialogContent, H = u.DialogDescription, R = u.DialogTitle, X = [
  {
    value: "shot_images",
    title: "参考图",
    description: "生成素材设定和逐镜参考图，之后可自行连线继续制作。"
  },
  {
    value: "shot_videos",
    title: "镜头视频",
    description: "生成参考图、各镜头视频和所选附加内容，不创建最终合成。"
  },
  {
    value: "final_video",
    title: "完整视频",
    description: "生成参考图、各镜头视频和所选附加内容，并完成视频合成。"
  }
], Z = [
  { value: "native", title: "视频原声" },
  { value: "auto", title: "独立配音" },
  { value: "off", title: "不加声音" }
];
function te({
  errorFeedback: n,
  storyboard: i,
  submitting: s,
  onClose: r,
  onConfirm: m
}) {
  const [a, p] = w(
    () => F(i)
  ), c = L(i), h = M(i), f = j(i), v = E(), l = g(
    () => Y(a, {
      speech: c > 0,
      subtitles: h > 0,
      soundtrackOnly: f
    }),
    [a, c, h, f]
  ), b = g(
    () => ({ ...i, production_plan: l }),
    [l, i]
  ), D = g(
    () => q(b),
    [b]
  ), N = C(
    b
  ), k = l.voice_mode === "native" ? `需要支持原声的视频模型。${c > 0 ? "按脚本生成台词与环境声。" : "只生成环境声与动作音效。"}` : l.voice_mode === "auto" ? `按脚本中的 ${c} 条对白或旁白创建配音。` : "不生成配音，合成时静音镜头原声。", [_] = w(
    () => document.activeElement instanceof HTMLElement ? document.activeElement : null
  ), S = async () => {
    await m(l) && r();
  };
  return /* @__PURE__ */ e(G, { open: !0, onOpenChange: (o) => !o && !s && r(), children: /* @__PURE__ */ t(
    U,
    {
      className: "ws-storyboard-shot-dialog ws-storyboard-confirm-dialog nodrag nopan nowheel",
      layerClassName: "wb-detail-backdrop is-dialog-layer",
      layerZIndex: A,
      showCloseButton: !1,
      onCloseAutoFocus: (o) => {
        _?.isConnected && (o.preventDefault(), _.focus({ preventScroll: !0 }));
      },
      children: [
        /* @__PURE__ */ t("header", { children: [
          /* @__PURE__ */ t("div", { children: [
            /* @__PURE__ */ e(R, { children: "确认分镜" }),
            /* @__PURE__ */ e(H, { asChild: !0, children: /* @__PURE__ */ e("span", { children: "这一步只创建制作区，点击「开始制作」后才会生成内容。" }) })
          ] }),
          /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              "aria-label": "关闭",
              disabled: s,
              onClick: r,
              children: /* @__PURE__ */ e(O, { size: 18 })
            }
          )
        ] }),
        /* @__PURE__ */ t("div", { className: "ws-storyboard-confirm-body nowheel", children: [
          n,
          /* @__PURE__ */ t("div", { className: "ws-storyboard-confirm-summary", children: [
            /* @__PURE__ */ e("strong", { children: i.title.trim() || "分镜脚本" }),
            /* @__PURE__ */ t("span", { children: [
              i.shots.length,
              " 个镜头"
            ] }),
            /* @__PURE__ */ t("span", { children: [
              x(i),
              " 秒"
            ] }),
            /* @__PURE__ */ t("span", { children: [
              c,
              " 条语音"
            ] })
          ] }),
          /* @__PURE__ */ t("fieldset", { className: "ws-storyboard-confirm-section", children: [
            /* @__PURE__ */ e("legend", { children: "产出目标" }),
            /* @__PURE__ */ e("div", { className: "ws-storyboard-output-options", children: X.map((o) => /* @__PURE__ */ t(
              "label",
              {
                className: a.output_target === o.value ? "is-selected" : "",
                children: [
                  /* @__PURE__ */ e(
                    "input",
                    {
                      type: "radio",
                      name: "storyboard-output-target",
                      value: o.value,
                      checked: a.output_target === o.value,
                      disabled: s,
                      onChange: () => p((d) => ({
                        ...d,
                        output_target: o.value
                      }))
                    }
                  ),
                  /* @__PURE__ */ t("span", { children: [
                    /* @__PURE__ */ e("strong", { children: o.title }),
                    /* @__PURE__ */ e("small", { children: o.description })
                  ] }),
                  a.output_target === o.value ? /* @__PURE__ */ e(y, { size: 16, "aria-hidden": "true" }) : null
                ]
              },
              o.value
            )) })
          ] }),
          N ? /* @__PURE__ */ t("fieldset", { className: "ws-storyboard-confirm-section", children: [
            /* @__PURE__ */ e("legend", { children: "声音与字幕" }),
            f ? /* @__PURE__ */ e("p", { className: "ws-storyboard-confirm-note", children: "MV 只使用歌曲音轨，不生成配音或字幕。" }) : /* @__PURE__ */ t(I, { children: [
              /* @__PURE__ */ e("div", { className: "ws-storyboard-voice-options", role: "radiogroup", "aria-label": "声音模式", "aria-describedby": v, children: Z.map(({ value: o, title: d }) => /* @__PURE__ */ t("label", { children: [
                /* @__PURE__ */ e(
                  "input",
                  {
                    type: "radio",
                    name: v,
                    value: o,
                    checked: l.voice_mode === o,
                    disabled: s || o === "auto" && c === 0,
                    onChange: () => p((P) => ({ ...P, voice_mode: o }))
                  }
                ),
                d
              ] }, o)) }),
              /* @__PURE__ */ t("p", { id: v, className: "ws-storyboard-confirm-note", children: [
                k,
                c === 0 ? " 没有对白或旁白，不能独立配音。" : null
              ] }),
              /* @__PURE__ */ e(
                B,
                {
                  title: "字幕",
                  description: h > 0 ? `按脚本中的 ${h} 条字幕内容创建字幕组。` : "当前脚本没有可用字幕内容。",
                  checked: l.subtitle_mode === "auto",
                  disabled: s || h === 0,
                  onChange: (o) => p((d) => ({ ...d, subtitle_mode: o ? "auto" : "off" }))
                }
              )
            ] })
          ] }) : null,
          /* @__PURE__ */ t("section", { className: "ws-storyboard-confirm-section", children: [
            /* @__PURE__ */ t("div", { className: "ws-storyboard-confirm-section-title", children: [
              /* @__PURE__ */ e("strong", { children: "制作流程" }),
              /* @__PURE__ */ e("span", { children: "镜头参考图由分镜连续性自动判断，无需手动选择。" })
            ] }),
            /* @__PURE__ */ e("div", { className: "ws-storyboard-production-flow", children: D.map((o, d) => /* @__PURE__ */ t("span", { children: [
              d > 0 ? /* @__PURE__ */ e("i", { "aria-hidden": "true", children: "/" }) : null,
              o
            ] }, o)) })
          ] })
        ] }),
        /* @__PURE__ */ t("footer", { children: [
          /* @__PURE__ */ e("button", { type: "button", disabled: s, onClick: r, children: "返回修改" }),
          /* @__PURE__ */ t(
            "button",
            {
              type: "button",
              className: "is-primary",
              disabled: s,
              onClick: () => {
                S();
              },
              children: [
                s ? /* @__PURE__ */ e(T, { size: 15, className: "ws-spin" }) : /* @__PURE__ */ e(y, { size: 15 }),
                s ? "创建中" : "确认并创建制作区"
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function B({
  title: n,
  description: i,
  checked: s,
  disabled: r,
  onChange: m
}) {
  return /* @__PURE__ */ t("label", { className: `ws-storyboard-production-switch${r ? " is-disabled" : ""}`, children: [
    /* @__PURE__ */ t("span", { children: [
      /* @__PURE__ */ e("strong", { children: n }),
      /* @__PURE__ */ e("small", { children: i })
    ] }),
    /* @__PURE__ */ e(
      "input",
      {
        type: "checkbox",
        role: "switch",
        checked: s,
        disabled: r,
        onChange: (a) => m(a.target.checked)
      }
    ),
    /* @__PURE__ */ e("i", { "aria-hidden": "true" })
  ] });
}
function Y(n, i) {
  if (i.soundtrackOnly || !["shot_videos", "final_video"].includes(n.output_target))
    return {
      ...n,
      voice_mode: "off",
      subtitle_mode: "off"
    };
  const s = n.voice_mode === "native" ? "native" : i.speech && n.voice_mode === "auto" ? "auto" : "off";
  return {
    ...n,
    voice_mode: s,
    subtitle_mode: i.subtitles && n.subtitle_mode === "auto" ? "auto" : "off"
  };
}
function q(n) {
  if (n.production_plan.output_target === "storyboard_only")
    return ["确认分镜"];
  const i = [
    ...n.materials.length ? ["素材设定"] : [],
    "镜头参考图"
  ];
  return C(n) && i.push("镜头视频"), V(n) && i.push("配音"), z(n) && i.push("字幕"), $(n) && i.push("视频合成"), i;
}
export {
  te as StoryboardConfirmDialog
};
