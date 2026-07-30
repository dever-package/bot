import { c as I, j as a, a as o, F as ue } from "./createLucideIcon-Gw0gLVQ5.js";
import { r as de, g as fe, d as me, a as he, u as d, b as G, D as pe, t as ge, v as be, w as ve, x as we, y as ye, B as A, I as Y } from "./runtime-entry-CkPHMDB1.js";
import { L as $ } from "./loader-circle-3ZsHTZm7.js";
import { U as Ne } from "./user-round-RPwSJfiU.js";
import { E as Pe } from "./eye-off-CjZZHDHf.js";
import { E as Ce } from "./eye-p4fPCmBj.js";
import { T as Ae } from "./trash-2-Cga0ORNu.js";
import { t as H } from "./index-wo12HRHg.js";
import { W as ke } from "./home-shell-BrUTJHpe.js";
import { i as Re } from "./api-response-C-VXY2RJ.js";
const _e = [
  [
    "path",
    {
      d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
      key: "18u6gg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
], Se = I("camera", _e);
const De = [
  [
    "path",
    {
      d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
      key: "1s6t7t"
    }
  ],
  ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor", key: "w0ekpg" }]
], Fe = I("key-round", De);
const Ee = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], Ie = I("shield-check", Ee), Le = 1, Ue = 10 * 1024 * 1024, xe = /* @__PURE__ */ new Set([
  "image/jpeg",
  "image/png",
  "image/webp"
]), { uploadFileByRule: q } = fe("@/lib/upload");
async function je() {
  const e = await L("profile", "get", void 0, "加载个人资料失败");
  return Q(e.user);
}
async function We(e) {
  const r = await L(
    "profile",
    "post",
    {
      name: e.name,
      avatar_file_id: e.avatarFileID
    },
    "保存个人资料失败"
  );
  return Q(r.user);
}
async function ze(e) {
  await L(
    "password",
    "post",
    {
      current_password: e.currentPassword,
      new_password: e.newPassword
    },
    "修改密码失败"
  );
}
async function Me(e, r) {
  if (Z(r), !q)
    throw new Error("当前页面缺少头像上传能力");
  const i = await q(Le, r, {
    kind: "image",
    bizKey: `user_avatar_${e}`,
    bizName: "用户头像"
  }), c = E(i.id);
  if (c <= 0)
    throw new Error("头像上传失败");
  return c;
}
function Z(e) {
  if (!xe.has(e.type))
    throw new Error("头像仅支持 JPG、PNG 或 WebP 格式");
  if (e.size > Ue)
    throw new Error("头像文件不能超过 10MB");
}
async function L(e, r, i, c) {
  const n = await de(`/user/auth/${e}`, r, i);
  if (!Re(n))
    throw new Error(String(n?.message || n?.msg || c));
  return ee(n?.data) ? n.data : {};
}
function Q(e) {
  const r = ee(e) ? e : {};
  return {
    id: E(r.id),
    name: D(r.name),
    account: D(r.account),
    avatar: D(r.avatar),
    avatarFileID: E(r.avatar_file_id)
  };
}
function ee(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function E(e) {
  const r = Number(e || 0);
  return Number.isFinite(r) && r > 0 ? r : 0;
}
function D(e) {
  return e == null ? "" : String(e).trim();
}
function Ze({
  open: e,
  roleLabel: r,
  onOpenChange: i,
  onPasswordChanged: c
}) {
  const n = me((t) => t.auth), f = he(null), [l, g] = d("profile"), [u, b] = d(
    () => K(n.user)
  ), [w, k] = d(u.name), [v, R] = d(null), [re, U] = d(""), [x, _] = d(!1), [S, j] = d(""), [y, W] = d(""), [z, M] = d(""), [te, T] = d(!1), [N, V] = d(!1), [p, P] = d(!1), [B, s] = d("");
  G(() => {
    if (!e)
      return;
    let t = !0;
    const m = K(n.user);
    return b(m), k(m.name), oe(), V(!0), je().then((h) => {
      t && (b(h), k(h.name), n.setUser({ ...n.user, ...X(h) }));
    }).catch((h) => {
      t && s(C(h, "加载个人资料失败"));
    }).finally(() => {
      t && V(!1);
    }), () => {
      t = !1;
    };
  }, [e]), G(() => {
    if (!v) {
      U("");
      return;
    }
    const t = URL.createObjectURL(v);
    return U(t), () => URL.revokeObjectURL(t);
  }, [v]);
  const ne = re || (x ? "" : u.avatar);
  function oe() {
    g("profile"), R(null), _(!1), j(""), W(""), M(""), T(!1), s("");
  }
  function O(t) {
    p || (g(t), s(""));
  }
  function ie(t) {
    const m = t.target.files?.[0];
    if (t.target.value = "", !!m)
      try {
        Z(m), R(m), _(!1), s("");
      } catch (h) {
        s(C(h, "头像文件不可用"));
      }
  }
  async function se(t) {
    if (t.preventDefault(), !(p || N)) {
      if (l === "profile") {
        await ce();
        return;
      }
      await le();
    }
  }
  async function ce() {
    const t = w.trim();
    if (!t) {
      s("请输入昵称");
      return;
    }
    if (Array.from(t).length > 64) {
      s("昵称不能超过 64 个字符");
      return;
    }
    if (u.id <= 0) {
      s("用户信息不完整，请刷新页面后重试");
      return;
    }
    P(!0), s("");
    try {
      const m = v ? await Me(u.id, v) : x ? 0 : u.avatarFileID, h = await We({
        name: t,
        avatarFileID: m
      });
      n.setUser({ ...n.user, ...X(h) }), b(h), H.success("个人资料已更新"), i(!1);
    } catch (m) {
      s(C(m, "保存个人资料失败"));
    } finally {
      P(!1);
    }
  }
  async function le() {
    if (!S) {
      s("请输入当前密码");
      return;
    }
    if (Array.from(y).length < 6) {
      s("新密码不能少于 6 位");
      return;
    }
    if (y !== z) {
      s("两次输入的新密码不一致");
      return;
    }
    P(!0), s("");
    try {
      await ze({ currentPassword: S, newPassword: y }), H.success("密码已修改，请重新登录"), c();
    } catch (t) {
      s(C(t, "修改密码失败"));
    } finally {
      P(!1);
    }
  }
  return /* @__PURE__ */ a(pe, { open: e, onOpenChange: p ? void 0 : i, children: /* @__PURE__ */ o(ge, { className: "hb-profile-modal sm:max-w-xl", children: [
    /* @__PURE__ */ o(be, { className: "hb-profile-modal-header", children: [
      /* @__PURE__ */ a(ve, { children: "个人信息" }),
      /* @__PURE__ */ a(we, { children: "管理公开资料与登录安全设置。" })
    ] }),
    /* @__PURE__ */ o("div", { className: "hb-profile-tabs", "aria-label": "个人信息设置", children: [
      /* @__PURE__ */ o(
        "button",
        {
          type: "button",
          className: l === "profile" ? "is-active" : "",
          "aria-pressed": l === "profile",
          onClick: () => O("profile"),
          children: [
            /* @__PURE__ */ a(Ne, {}),
            "基本资料"
          ]
        }
      ),
      /* @__PURE__ */ o(
        "button",
        {
          type: "button",
          className: l === "security" ? "is-active" : "",
          "aria-pressed": l === "security",
          onClick: () => O("security"),
          children: [
            /* @__PURE__ */ a(Fe, {}),
            "账号安全"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ o("form", { className: "hb-profile-form", onSubmit: se, children: [
      /* @__PURE__ */ o("div", { className: "hb-profile-form-body", children: [
        l === "profile" ? /* @__PURE__ */ a(
          Te,
          {
            profile: u,
            name: w,
            avatarURL: ne,
            roleLabel: r,
            fileInputRef: f,
            disabled: N || p,
            onNameChange: k,
            onAvatarChange: ie,
            onChooseAvatar: () => f.current?.click(),
            onRemoveAvatar: () => {
              R(null), _(!0);
            }
          }
        ) : /* @__PURE__ */ a(
          Ve,
          {
            currentPassword: S,
            newPassword: y,
            confirmPassword: z,
            showPasswords: te,
            disabled: p,
            onCurrentPasswordChange: j,
            onNewPasswordChange: W,
            onConfirmPasswordChange: M,
            onTogglePasswords: () => T((t) => !t)
          }
        ),
        N ? /* @__PURE__ */ o("div", { className: "hb-profile-status", role: "status", children: [
          /* @__PURE__ */ a($, { className: "is-spinning" }),
          "正在读取最新资料"
        ] }) : B ? /* @__PURE__ */ a("div", { className: "hb-profile-status is-error", role: "alert", children: B }) : null
      ] }),
      /* @__PURE__ */ o(ye, { className: "hb-profile-modal-footer", children: [
        /* @__PURE__ */ a(
          A,
          {
            type: "button",
            variant: "outline",
            disabled: p,
            onClick: () => i(!1),
            children: "取消"
          }
        ),
        /* @__PURE__ */ o(A, { type: "submit", disabled: N || p, children: [
          p ? /* @__PURE__ */ a($, { className: "is-spinning" }) : null,
          p ? l === "profile" ? "保存中" : "修改中" : l === "profile" ? "保存资料" : "修改密码"
        ] })
      ] })
    ] })
  ] }) });
}
function Te({
  profile: e,
  name: r,
  avatarURL: i,
  roleLabel: c,
  fileInputRef: n,
  disabled: f,
  onNameChange: l,
  onAvatarChange: g,
  onChooseAvatar: u,
  onRemoveAvatar: b
}) {
  return /* @__PURE__ */ o(ue, { children: [
    /* @__PURE__ */ o("section", { className: "hb-profile-avatar-section", children: [
      /* @__PURE__ */ a(
        ke,
        {
          src: i,
          name: r,
          account: e.account,
          className: "hb-profile-avatar"
        }
      ),
      /* @__PURE__ */ o("div", { children: [
        /* @__PURE__ */ a("strong", { children: "头像" }),
        /* @__PURE__ */ a("span", { children: "支持 JPG、PNG、WebP，文件不超过 10MB。" }),
        /* @__PURE__ */ o("div", { className: "hb-profile-avatar-actions", children: [
          /* @__PURE__ */ o(
            A,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              disabled: f,
              onClick: u,
              children: [
                /* @__PURE__ */ a(Se, {}),
                "更换头像"
              ]
            }
          ),
          i ? /* @__PURE__ */ o(
            A,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              disabled: f,
              onClick: b,
              children: [
                /* @__PURE__ */ a(Ae, {}),
                "移除"
              ]
            }
          ) : null
        ] }),
        /* @__PURE__ */ a(
          "input",
          {
            ref: n,
            type: "file",
            accept: ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp",
            hidden: !0,
            onChange: g
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ a(ae, { label: "昵称", htmlFor: "hb-profile-name", children: /* @__PURE__ */ a(
      Y,
      {
        id: "hb-profile-name",
        value: r,
        maxLength: 64,
        autoComplete: "name",
        disabled: f,
        placeholder: "输入昵称",
        onChange: (w) => l(w.target.value)
      }
    ) }),
    /* @__PURE__ */ o("div", { className: "hb-profile-readonly-grid", children: [
      /* @__PURE__ */ a(J, { label: "手机号", value: e.account || "未设置" }),
      /* @__PURE__ */ a(J, { label: "账号角色", value: c })
    ] })
  ] });
}
function Ve({
  currentPassword: e,
  newPassword: r,
  confirmPassword: i,
  showPasswords: c,
  disabled: n,
  onCurrentPasswordChange: f,
  onNewPasswordChange: l,
  onConfirmPasswordChange: g,
  onTogglePasswords: u
}) {
  return /* @__PURE__ */ o("section", { className: "hb-profile-security", children: [
    /* @__PURE__ */ o("div", { className: "hb-profile-security-note", children: [
      /* @__PURE__ */ a(Ie, {}),
      /* @__PURE__ */ a("span", { children: "修改密码后，当前账号在所有设备上的登录状态都会失效，需要重新登录。" })
    ] }),
    /* @__PURE__ */ a(
      F,
      {
        id: "hb-current-password",
        label: "当前密码",
        value: e,
        autoComplete: "current-password",
        show: c,
        disabled: n,
        onChange: f,
        onToggle: u
      }
    ),
    /* @__PURE__ */ a(
      F,
      {
        id: "hb-new-password",
        label: "新密码",
        value: r,
        autoComplete: "new-password",
        show: c,
        disabled: n,
        onChange: l,
        onToggle: u
      }
    ),
    /* @__PURE__ */ a(
      F,
      {
        id: "hb-confirm-password",
        label: "确认新密码",
        value: i,
        autoComplete: "new-password",
        show: c,
        disabled: n,
        onChange: g,
        onToggle: u
      }
    )
  ] });
}
function ae({
  label: e,
  htmlFor: r,
  children: i
}) {
  return /* @__PURE__ */ o("label", { className: "hb-profile-field", htmlFor: r, children: [
    /* @__PURE__ */ a("span", { children: e }),
    i
  ] });
}
function J({ label: e, value: r }) {
  return /* @__PURE__ */ o("div", { className: "hb-profile-readonly-field", children: [
    /* @__PURE__ */ a("span", { children: e }),
    /* @__PURE__ */ a("strong", { children: r })
  ] });
}
function F({
  id: e,
  label: r,
  value: i,
  autoComplete: c,
  show: n,
  disabled: f,
  onChange: l,
  onToggle: g
}) {
  return /* @__PURE__ */ a(ae, { label: r, htmlFor: e, children: /* @__PURE__ */ o("span", { className: "hb-profile-password-input", children: [
    /* @__PURE__ */ a(
      Y,
      {
        id: e,
        type: n ? "text" : "password",
        value: i,
        autoComplete: c,
        disabled: f,
        onChange: (u) => l(u.target.value)
      }
    ),
    /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        "aria-label": n ? "隐藏密码" : "显示密码",
        title: n ? "隐藏密码" : "显示密码",
        onClick: g,
        children: n ? /* @__PURE__ */ a(Pe, {}) : /* @__PURE__ */ a(Ce, {})
      }
    )
  ] }) });
}
function K(e) {
  return {
    id: Number(e?.id || 0),
    name: String(e?.name || ""),
    account: String(e?.account || ""),
    avatar: String(e?.avatar || ""),
    avatarFileID: Number(e?.avatar_file_id || 0)
  };
}
function X(e) {
  return {
    id: e.id,
    name: e.name,
    account: e.account,
    avatar: e.avatar,
    avatar_file_id: e.avatarFileID
  };
}
function C(e, r) {
  return e instanceof Error && e.message ? e.message : r;
}
export {
  Ze as WorkbenchProfileDialog
};
