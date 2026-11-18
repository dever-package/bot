import { a, j as e, S as j } from "./space-storyboard-material-ECvLpyk_.js";
import { O as x, Q as H, h as T, X as Q, n as X } from "./vendor-icons-BZHLe0mm.js";
import { S as Y } from "./space-sequence-card-Dk-OwCSY.js";
import { B as S, D as Z } from "./asset-audio-preview-Cezm24us.js";
import { a as g, d as q } from "./file-kind-Cq3pESGF.js";
import "./space-storyboard-confirm-dialog-BDTdbniY.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-storyboard-material-dialog-Bba4DQcv.css", import.meta.url).href]);
function le({
  shot: r,
  index: l,
  storyboard: c,
  frame: o,
  media: i,
  selected: d = !1,
  editable: u = !1,
  dragging: t = !1,
  dropPlacement: p,
  onOpen: h,
  onDuplicate: b,
  onRemove: v,
  onDragStart: y,
  onDragOver: L,
  onDrop: s,
  onDragEnd: w
}) {
  return /* @__PURE__ */ a(
    Y,
    {
      itemId: r.id,
      index: l,
      durationLabel: `${r.duration}秒`,
      className: "ws-storyboard-card",
      dragClassName: "ws-storyboard-card-drag",
      selected: d,
      readonly: !u,
      wholeCardDraggable: !0,
      dragging: t,
      dropPlacement: p,
      ariaLabel: `镜头 ${l + 1}`,
      onSelect: h,
      onDragStart: y || R,
      onDragOver: L || G,
      onDrop: s || R,
      onDragEnd: w || R,
      children: [
        /* @__PURE__ */ e(
          F,
          {
            shot: r,
            storyboard: c,
            frame: o,
            media: i
          }
        ),
        /* @__PURE__ */ a("footer", { children: [
          /* @__PURE__ */ e(S, { label: u ? "编辑镜头" : "查看镜头", children: /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              "aria-label": u ? "编辑镜头" : "查看镜头",
              onClick: I(h),
              children: [
                /* @__PURE__ */ e(x, { size: 13 }),
                /* @__PURE__ */ e("span", { children: u ? "编辑镜头" : "查看镜头" })
              ]
            }
          ) }),
          u && b ? /* @__PURE__ */ e(S, { label: "复制镜头", children: /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              "aria-label": "复制镜头",
              onClick: I(b),
              children: /* @__PURE__ */ e(H, { size: 13 })
            }
          ) }) : null,
          u && v ? /* @__PURE__ */ e(S, { label: "删除镜头", children: /* @__PURE__ */ e(
            "button",
            {
              type: "button",
              className: "is-danger",
              "aria-label": "删除镜头",
              onClick: I(v),
              children: /* @__PURE__ */ e(T, { size: 13 })
            }
          ) }) : null
        ] })
      ]
    }
  );
}
function oe({
  shot: r,
  index: l,
  storyboard: c,
  frame: o,
  onOpen: i
}) {
  return /* @__PURE__ */ a(
    "button",
    {
      type: "button",
      className: "ws-storyboard-compact-card nodrag nopan",
      "aria-label": `查看镜头 ${l + 1}`,
      disabled: !i,
      onMouseDown: (d) => d.stopPropagation(),
      onClick: (d) => {
        d.preventDefault(), d.stopPropagation(), i?.();
      },
      children: [
        /* @__PURE__ */ a("span", { className: "ws-storyboard-compact-head", children: [
          /* @__PURE__ */ a("strong", { children: [
            "镜头 ",
            String(l + 1).padStart(2, "0")
          ] }),
          /* @__PURE__ */ a("span", { children: [
            r.duration,
            "秒"
          ] })
        ] }),
        /* @__PURE__ */ e(
          F,
          {
            shot: r,
            storyboard: c,
            frame: o
          }
        )
      ]
    }
  );
}
function F({
  shot: r,
  storyboard: l,
  frame: c,
  media: o
}) {
  const i = l?.shots?.find(
    (t) => t.id === r.shared_end_shot_id
  ), d = c?.references?.filter((t) => t.imageURL) || [c?.start, c?.end].filter(
    (t) => !!t?.imageURL
  ), u = r.speech.filter((t) => t.text.trim());
  return /* @__PURE__ */ a("div", { className: "ws-storyboard-card-reading", children: [
    r.shared_end_shot_id ? /* @__PURE__ */ e("p", { className: "ws-storyboard-card-camera", children: i ? `结束画面：镜头 ${i.order} 首帧` : "共享来源已移除" }) : null,
    r.start_framing || r.camera_instruction ? /* @__PURE__ */ a("p", { className: "ws-storyboard-card-camera", children: [
      r.start_framing ? /* @__PURE__ */ e("span", { title: r.start_framing, children: r.start_framing }) : null,
      r.camera_instruction ? /* @__PURE__ */ e("span", { title: r.camera_instruction, children: r.camera_instruction }) : null
    ] }) : null,
    o ? /* @__PURE__ */ e("div", { className: "ws-storyboard-card-node", children: o }) : d.length ? /* @__PURE__ */ e(
      "div",
      {
        className: "ws-storyboard-card-images",
        style: {
          aspectRatio: l?.aspect_ratio?.replace(":", " / ")
        },
        children: d.slice(0, 1).map((t, p) => /* @__PURE__ */ e(
          "img",
          {
            src: t.imageURL,
            alt: `镜头 ${r.order}画面`,
            loading: "lazy",
            decoding: "async"
          },
          `${t.imageURL}:${p}`
        ))
      }
    ) : null,
    /* @__PURE__ */ a("div", { className: "ws-storyboard-card-description", children: [
      r.beat ? /* @__PURE__ */ e("p", { children: r.beat }) : null,
      r.description && r.description.trim() !== r.beat.trim() ? /* @__PURE__ */ e("p", { children: r.description }) : null,
      !r.beat && !r.description ? /* @__PURE__ */ e("p", { children: "等待补充镜头内容" }) : null
    ] }),
    u.length ? /* @__PURE__ */ e("div", { className: "ws-storyboard-card-speech", children: u.map((t) => /* @__PURE__ */ a("p", { children: [
      /* @__PURE__ */ e("strong", { children: t.kind === "dialogue" ? l?.materials.find(
        (p) => p.id === t.character_id
      )?.name || "对白" : "旁白" }),
      /* @__PURE__ */ e("span", { children: t.text })
    ] }, t.id)) }) : null
  ] });
}
function I(r) {
  return (l) => {
    l.stopPropagation(), r();
  };
}
function R() {
}
function G(r) {
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/dialog"]);
const f = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!f || Object.keys(f).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const V = f.Dialog, W = f.DialogContent, J = f.DialogTitle;
function ie({
  material: r,
  creating: l = !1,
  context: c = "storyboard",
  readonly: o,
  usage: i,
  existingNames: d = [],
  onSave: u,
  onRemove: t,
  onClose: p,
  loadVoiceOptions: h
}) {
  const [b, v] = g(r.name), [y, L] = g(r.prompt), [s, w] = g(r.voice), [m, O] = g(null), [C, M] = g(""), E = r.type === "character" && !!h;
  q(() => {
    if (!E || !h) return;
    let n = !1;
    return h().then(
      (N) => {
        n || O(N);
      },
      (N) => {
        n || M(N instanceof Error ? N.message : "读取音色失败");
      }
    ), () => {
      n = !0;
    };
  }, [E, h]);
  const [k, P] = g(!1), [z] = g(
    () => typeof document < "u" && document.activeElement instanceof HTMLElement ? document.activeElement : null
  ), D = b.trim().replace(/^[@#]+/, ""), A = y.trim(), B = d.some(
    (n) => n.trim().toLocaleLowerCase() === D.toLocaleLowerCase()
  ), $ = (i?.shotIds.length || 0) + (i?.speechIds.length || 0), U = !l && !o && !!t && $ === 0, _ = j[r.type];
  return /* @__PURE__ */ e(V, { open: !0, onOpenChange: (n) => !n && p(), children: /* @__PURE__ */ a(
    W,
    {
      className: "ws-storyboard-shot-dialog ws-storyboard-material-dialog nodrag nopan nowheel",
      layerClassName: "wb-detail-backdrop is-dialog-layer",
      layerZIndex: Z + 20,
      showCloseButton: !1,
      "aria-describedby": void 0,
      onCloseAutoFocus: (n) => {
        z?.isConnected && (n.preventDefault(), z.focus({ preventScroll: !0 }));
      },
      children: [
        /* @__PURE__ */ a("header", { children: [
          /* @__PURE__ */ a("div", { children: [
            /* @__PURE__ */ e(J, { children: l ? `新增${_}` : r.name || _ }),
            /* @__PURE__ */ a("span", { children: [
              _,
              "素材",
              o ? " · 当前版本只读" : l ? c === "setting" ? " · 保存到共用设定" : " · 保存后加入当前分镜草稿" : c === "setting" ? " · 所连接的分镜共用此设定" : " · 修改会保存到当前分镜草稿"
            ] })
          ] }),
          /* @__PURE__ */ e("button", { type: "button", "aria-label": "关闭", onClick: p, children: /* @__PURE__ */ e(Q, { size: 18 }) })
        ] }),
        /* @__PURE__ */ a("div", { className: "ws-storyboard-material-form nowheel", children: [
          /* @__PURE__ */ a("label", { children: [
            /* @__PURE__ */ e("span", { children: "素材名称" }),
            /* @__PURE__ */ e(
              "input",
              {
                value: b,
                readOnly: o,
                autoFocus: !o,
                placeholder: `例如：${r.type === "character" ? "主角" : r.type === "scene" ? "咖啡馆" : "红色雨伞"}`,
                onChange: (n) => v(n.target.value)
              }
            ),
            B ? /* @__PURE__ */ e("small", { className: "ws-storyboard-form-error", children: "素材名称不能重复，否则画布引用无法准确定位。" }) : null
          ] }),
          /* @__PURE__ */ a("label", { children: [
            /* @__PURE__ */ e("span", { children: "生成提示词" }),
            /* @__PURE__ */ e(
              "textarea",
              {
                value: y,
                readOnly: o,
                placeholder: `描述${D || _}的外观、结构、材质与风格`,
                onChange: (n) => L(n.target.value)
              }
            )
          ] }),
          r.type === "character" && E ? /* @__PURE__ */ a("label", { children: [
            /* @__PURE__ */ e("span", { children: "配音音色" }),
            m && m.length > 0 ? /* @__PURE__ */ a("select", { value: s, disabled: o, onChange: (n) => w(n.target.value), children: [
              /* @__PURE__ */ e("option", { value: "", children: "暂不指定" }),
              s && !m.some((n) => n.value === s) ? /* @__PURE__ */ a("option", { value: s, children: [
                "当前值：",
                s
              ] }) : null,
              m.map((n) => /* @__PURE__ */ e("option", { value: n.value, children: n.group ? `${n.group} · ${n.name}` : n.name }, n.id || n.value))
            ] }) : /* @__PURE__ */ e("select", { value: s, disabled: !0, children: /* @__PURE__ */ e("option", { value: s, children: C ? "读取音色失败" : m ? s || "暂不指定" : "正在读取音色…" }) }),
            /* @__PURE__ */ e("small", { className: C ? "ws-storyboard-form-error" : void 0, children: C || (m && m.length === 0 ? "当前没有可用的语音合成能力，配置后可在这里选择音色。" : "角色对白自动配音时使用；不指定时可在配音节点里再选。") })
          ] }) : r.type === "character" ? /* @__PURE__ */ a("label", { children: [
            /* @__PURE__ */ e("span", { children: "配音音色" }),
            /* @__PURE__ */ e(
              "input",
              {
                value: s,
                readOnly: o,
                placeholder: "自动配音时必填",
                onChange: (n) => w(n.target.value)
              }
            ),
            /* @__PURE__ */ e("small", { children: "填写当前语音能力支持的音色值。" })
          ] }) : null,
          !l && $ > 0 ? /* @__PURE__ */ a("div", { className: "ws-storyboard-material-usage", role: "note", children: [
            /* @__PURE__ */ e("strong", { children: "当前素材正在使用" }),
            /* @__PURE__ */ a("span", { children: [
              i?.shotIds.length || 0,
              " 个镜头",
              i?.speechIds.length ? ` · ${i.speechIds.length} 条对白` : "",
              "。请先在对应镜头中取消关联或更换对白角色，再删除素材。"
            ] })
          ] }) : null,
          /* @__PURE__ */ e("p", { children: c === "setting" ? "修改后保留旧形象，重新生成或上传替换后用于后续制作。" : "保存分镜版本后，未被手动覆盖的对应素材节点会同步更新；已经生成的后续内容需要重新执行。" })
        ] }),
        /* @__PURE__ */ a("footer", { children: [
          /* @__PURE__ */ e("div", { children: !o && !l && t ? /* @__PURE__ */ e(
            S,
            {
              label: $ > 0 ? "该素材仍被镜头或对白引用" : k ? "再次点击确认删除" : "删除素材",
              children: /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "is-danger",
                  disabled: !U,
                  onClick: () => {
                    if (!k) {
                      P(!0);
                      return;
                    }
                    t(r.id);
                  },
                  children: [
                    /* @__PURE__ */ e(T, { size: 14 }),
                    k ? "确认删除" : "删除素材"
                  ]
                }
              )
            }
          ) : null }),
          /* @__PURE__ */ a("div", { children: [
            /* @__PURE__ */ e("button", { type: "button", onClick: p, children: o ? "关闭" : "取消" }),
            o ? null : /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "is-primary",
                disabled: !D || !A || B,
                onClick: () => u({
                  ...r,
                  name: D,
                  prompt: A,
                  voice: r.type === "character" ? s.trim() : ""
                }),
                children: [
                  /* @__PURE__ */ e(X, { size: 14 }),
                  l ? "添加素材" : "确认修改"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
export {
  ie as S,
  oe as a,
  le as b
};
