import { c as I, j as a, a as n, F as ce } from "./createLucideIcon-fWv1XcFy.js";
import { r as ue, g as de, u as fe, e as he, b as d, c as q, D as me, q as pe, s as ve, t as ge, v as be, w as we, B as k, I as Y } from "./runtime-entry-ClkZDmNs.js";
import { L as G } from "./vanilla-BSPxkY5-.js";
import { U as ye } from "./user-round-5NX4bvyQ.js";
import { E as Pe } from "./eye-off-BhvtJvtS.js";
import { E as Ne } from "./eye-D9RIhpvx.js";
import { T as Ce } from "./trash-2-C2PWG3er.js";
import { t as $ } from "./index-Cf7idtTi.js";
import { W as ke } from "./home-shell-B1yhTnnn.js";
import { s as Ae, f as E, r as F, j as Re, k as C } from "./site-config-DrnclGFw.js";
const _e = [
  [
    "path",
    {
      d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
      key: "18u6gg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
], De = I("camera", _e);
const Fe = [
  [
    "path",
    {
      d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
      key: "1s6t7t"
    }
  ],
  ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor", key: "w0ekpg" }]
], Se = I("key-round", Fe);
const Ee = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
], Ie = I("shield-check", Ee), Le = 1, Ue = 10 * 1024 * 1024, je = /* @__PURE__ */ new Set([
  "image/jpeg",
  "image/png",
  "image/webp"
]), { uploadFileByRule: H } = de("@/lib/upload");
async function xe() {
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
async function Te(e, r) {
  if (Z(r), !H)
    throw new Error("当前页面缺少头像上传能力");
  const s = await H(Le, r, {
    kind: "image",
    bizKey: `user_avatar_${e}`,
    bizName: "用户头像"
  }), l = E(s.id);
  if (l <= 0)
    throw new Error("头像上传失败");
  return l;
}
function Z(e) {
  if (!je.has(e.type))
    throw new Error("头像仅支持 JPG、PNG 或 WebP 格式");
  if (e.size > Ue)
    throw new Error("头像文件不能超过 10MB");
}
async function L(e, r, s, l) {
  const o = await ue(`/user/auth/${e}`, r, s);
  return Ae(o, l);
}
function Q(e) {
  const r = Re(e) ? e : {};
  return {
    id: E(r.id),
    name: F(r.name),
    account: F(r.account),
    avatar: F(r.avatar),
    avatarFileID: E(r.avatar_file_id)
  };
}
function Ze({
  open: e,
  roleLabel: r,
  onOpenChange: s,
  onPasswordChanged: l
}) {
  const o = fe((t) => t.auth), f = he(null), [c, v] = d("profile"), [u, g] = d(
    () => K(o.user)
  ), [w, A] = d(u.name), [b, R] = d(null), [ae, U] = d(""), [j, _] = d(!1), [D, x] = d(""), [y, W] = d(""), [z, T] = d(""), [re, M] = d(!1), [P, B] = d(!1), [p, N] = d(!1), [V, i] = d("");
  q(() => {
    if (!e)
      return;
    let t = !0;
    const h = K(o.user);
    return g(h), A(h.name), ne(), B(!0), xe().then((m) => {
      t && (g(m), A(m.name), o.setUser({ ...o.user, ...X(m) }));
    }).catch((m) => {
      t && i(C(m, "加载个人资料失败"));
    }).finally(() => {
      t && B(!1);
    }), () => {
      t = !1;
    };
  }, [e]), q(() => {
    if (!b) {
      U("");
      return;
    }
    const t = URL.createObjectURL(b);
    return U(t), () => URL.revokeObjectURL(t);
  }, [b]);
  const te = ae || (j ? "" : u.avatar);
  function ne() {
    v("profile"), R(null), _(!1), x(""), W(""), T(""), M(!1), i("");
  }
  function O(t) {
    p || (v(t), i(""));
  }
  function oe(t) {
    const h = t.target.files?.[0];
    if (t.target.value = "", !!h)
      try {
        Z(h), R(h), _(!1), i("");
      } catch (m) {
        i(C(m, "头像文件不可用"));
      }
  }
  async function se(t) {
    if (t.preventDefault(), !(p || P)) {
      if (c === "profile") {
        await ie();
        return;
      }
      await le();
    }
  }
  async function ie() {
    const t = w.trim();
    if (!t) {
      i("请输入昵称");
      return;
    }
    if (Array.from(t).length > 64) {
      i("昵称不能超过 64 个字符");
      return;
    }
    if (u.id <= 0) {
      i("用户信息不完整，请刷新页面后重试");
      return;
    }
    N(!0), i("");
    try {
      const h = b ? await Te(u.id, b) : j ? 0 : u.avatarFileID, m = await We({
        name: t,
        avatarFileID: h
      });
      o.setUser({ ...o.user, ...X(m) }), g(m), $.success("个人资料已更新"), s(!1);
    } catch (h) {
      i(C(h, "保存个人资料失败"));
    } finally {
      N(!1);
    }
  }
  async function le() {
    if (!D) {
      i("请输入当前密码");
      return;
    }
    if (Array.from(y).length < 6) {
      i("新密码不能少于 6 位");
      return;
    }
    if (y !== z) {
      i("两次输入的新密码不一致");
      return;
    }
    N(!0), i("");
    try {
      await ze({ currentPassword: D, newPassword: y }), $.success("密码已修改，请重新登录"), l();
    } catch (t) {
      i(C(t, "修改密码失败"));
    } finally {
      N(!1);
    }
  }
  return /* @__PURE__ */ a(me, { open: e, onOpenChange: p ? void 0 : s, children: /* @__PURE__ */ n(pe, { className: "hb-profile-modal sm:max-w-xl", children: [
    /* @__PURE__ */ n(ve, { className: "hb-profile-modal-header", children: [
      /* @__PURE__ */ a(ge, { children: "个人信息" }),
      /* @__PURE__ */ a(be, { children: "管理公开资料与登录安全设置。" })
    ] }),
    /* @__PURE__ */ n("div", { className: "hb-profile-tabs", "aria-label": "个人信息设置", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: c === "profile" ? "is-active" : "",
          "aria-pressed": c === "profile",
          onClick: () => O("profile"),
          children: [
            /* @__PURE__ */ a(ye, {}),
            "基本资料"
          ]
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: c === "security" ? "is-active" : "",
          "aria-pressed": c === "security",
          onClick: () => O("security"),
          children: [
            /* @__PURE__ */ a(Se, {}),
            "账号安全"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ n("form", { className: "hb-profile-form", onSubmit: se, children: [
      /* @__PURE__ */ n("div", { className: "hb-profile-form-body", children: [
        c === "profile" ? /* @__PURE__ */ a(
          Me,
          {
            profile: u,
            name: w,
            avatarURL: te,
            roleLabel: r,
            fileInputRef: f,
            disabled: P || p,
            onNameChange: A,
            onAvatarChange: oe,
            onChooseAvatar: () => f.current?.click(),
            onRemoveAvatar: () => {
              R(null), _(!0);
            }
          }
        ) : /* @__PURE__ */ a(
          Be,
          {
            currentPassword: D,
            newPassword: y,
            confirmPassword: z,
            showPasswords: re,
            disabled: p,
            onCurrentPasswordChange: x,
            onNewPasswordChange: W,
            onConfirmPasswordChange: T,
            onTogglePasswords: () => M((t) => !t)
          }
        ),
        P ? /* @__PURE__ */ n("div", { className: "hb-profile-status", role: "status", children: [
          /* @__PURE__ */ a(G, { className: "is-spinning" }),
          "正在读取最新资料"
        ] }) : V ? /* @__PURE__ */ a("div", { className: "hb-profile-status is-error", role: "alert", children: V }) : null
      ] }),
      /* @__PURE__ */ n(we, { className: "hb-profile-modal-footer", children: [
        /* @__PURE__ */ a(
          k,
          {
            type: "button",
            variant: "outline",
            disabled: p,
            onClick: () => s(!1),
            children: "取消"
          }
        ),
        /* @__PURE__ */ n(k, { type: "submit", disabled: P || p, children: [
          p ? /* @__PURE__ */ a(G, { className: "is-spinning" }) : null,
          p ? c === "profile" ? "保存中" : "修改中" : c === "profile" ? "保存资料" : "修改密码"
        ] })
      ] })
    ] })
  ] }) });
}
function Me({
  profile: e,
  name: r,
  avatarURL: s,
  roleLabel: l,
  fileInputRef: o,
  disabled: f,
  onNameChange: c,
  onAvatarChange: v,
  onChooseAvatar: u,
  onRemoveAvatar: g
}) {
  return /* @__PURE__ */ n(ce, { children: [
    /* @__PURE__ */ n("section", { className: "hb-profile-avatar-section", children: [
      /* @__PURE__ */ a(
        ke,
        {
          src: s,
          name: r,
          account: e.account,
          className: "hb-profile-avatar"
        }
      ),
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ a("strong", { children: "头像" }),
        /* @__PURE__ */ a("span", { children: "支持 JPG、PNG、WebP，文件不超过 10MB。" }),
        /* @__PURE__ */ n("div", { className: "hb-profile-avatar-actions", children: [
          /* @__PURE__ */ n(
            k,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              disabled: f,
              onClick: u,
              children: [
                /* @__PURE__ */ a(De, {}),
                "更换头像"
              ]
            }
          ),
          s ? /* @__PURE__ */ n(
            k,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              disabled: f,
              onClick: g,
              children: [
                /* @__PURE__ */ a(Ce, {}),
                "移除"
              ]
            }
          ) : null
        ] }),
        /* @__PURE__ */ a(
          "input",
          {
            ref: o,
            type: "file",
            accept: ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp",
            hidden: !0,
            onChange: v
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ a(ee, { label: "昵称", htmlFor: "hb-profile-name", children: /* @__PURE__ */ a(
      Y,
      {
        id: "hb-profile-name",
        value: r,
        maxLength: 64,
        autoComplete: "name",
        disabled: f,
        placeholder: "输入昵称",
        onChange: (w) => c(w.target.value)
      }
    ) }),
    /* @__PURE__ */ n("div", { className: "hb-profile-readonly-grid", children: [
      /* @__PURE__ */ a(J, { label: "手机号", value: e.account || "未设置" }),
      /* @__PURE__ */ a(J, { label: "账号角色", value: l })
    ] })
  ] });
}
function Be({
  currentPassword: e,
  newPassword: r,
  confirmPassword: s,
  showPasswords: l,
  disabled: o,
  onCurrentPasswordChange: f,
  onNewPasswordChange: c,
  onConfirmPasswordChange: v,
  onTogglePasswords: u
}) {
  return /* @__PURE__ */ n("section", { className: "hb-profile-security", children: [
    /* @__PURE__ */ n("div", { className: "hb-profile-security-note", children: [
      /* @__PURE__ */ a(Ie, {}),
      /* @__PURE__ */ a("span", { children: "修改密码后，当前账号在所有设备上的登录状态都会失效，需要重新登录。" })
    ] }),
    /* @__PURE__ */ a(
      S,
      {
        id: "hb-current-password",
        label: "当前密码",
        value: e,
        autoComplete: "current-password",
        show: l,
        disabled: o,
        onChange: f,
        onToggle: u
      }
    ),
    /* @__PURE__ */ a(
      S,
      {
        id: "hb-new-password",
        label: "新密码",
        value: r,
        autoComplete: "new-password",
        show: l,
        disabled: o,
        onChange: c,
        onToggle: u
      }
    ),
    /* @__PURE__ */ a(
      S,
      {
        id: "hb-confirm-password",
        label: "确认新密码",
        value: s,
        autoComplete: "new-password",
        show: l,
        disabled: o,
        onChange: v,
        onToggle: u
      }
    )
  ] });
}
function ee({
  label: e,
  htmlFor: r,
  children: s
}) {
  return /* @__PURE__ */ n("label", { className: "hb-profile-field", htmlFor: r, children: [
    /* @__PURE__ */ a("span", { children: e }),
    s
  ] });
}
function J({ label: e, value: r }) {
  return /* @__PURE__ */ n("div", { className: "hb-profile-readonly-field", children: [
    /* @__PURE__ */ a("span", { children: e }),
    /* @__PURE__ */ a("strong", { children: r })
  ] });
}
function S({
  id: e,
  label: r,
  value: s,
  autoComplete: l,
  show: o,
  disabled: f,
  onChange: c,
  onToggle: v
}) {
  return /* @__PURE__ */ a(ee, { label: r, htmlFor: e, children: /* @__PURE__ */ n("span", { className: "hb-profile-password-input", children: [
    /* @__PURE__ */ a(
      Y,
      {
        id: e,
        type: o ? "text" : "password",
        value: s,
        autoComplete: l,
        disabled: f,
        onChange: (u) => c(u.target.value)
      }
    ),
    /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        "aria-label": o ? "隐藏密码" : "显示密码",
        title: o ? "隐藏密码" : "显示密码",
        onClick: v,
        children: o ? /* @__PURE__ */ a(Pe, {}) : /* @__PURE__ */ a(Ne, {})
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
export {
  Ze as WorkbenchProfileDialog
};
