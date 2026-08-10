import { a, j as n, F as ce } from "./_commonjsHelpers-CTFd9u1x.js";
import { u as ue, l as d, o as q } from "./react-C7Xtl8sB.js";
import { U as de, K as fe, L as G, u as me, T as he, v as pe, E as ge, w as ve } from "./vendor-icons-Cc7Kl3It.js";
import { t as K } from "./index-BxqXLJC9.js";
import { m as be } from "./button-CpfaQlDK.js";
import { m as v } from "./dialog-Oss_U0H4.js";
import { m as we } from "./input-DLnnH2-7.js";
import { m as ye } from "./project-dialogs-CdThoMTm.js";
import { W as Pe } from "./home-shell-CgpDp6ol.js";
import { s as Ne, c as I, r as S, h as Ce, j as R } from "./site-config-BVY1isir.js";
import { m as Re } from "./upload-5FgQdFzM.js";
import { m as Ae } from "./in-flight-request-DlB1DJg0.js";
const De = Ae.request, _e = 1, Fe = 10 * 1024 * 1024, ke = /* @__PURE__ */ new Set([
  "image/jpeg",
  "image/png",
  "image/webp"
]), { uploadFileByRule: V } = Re;
async function Se() {
  const e = await L("profile", "get", void 0, "加载个人资料失败");
  return Z(e.user);
}
async function Ee(e) {
  const r = await L(
    "profile",
    "post",
    {
      name: e.name,
      avatar_file_id: e.avatarFileID
    },
    "保存个人资料失败"
  );
  return Z(r.user);
}
async function Ie(e) {
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
async function Le(e, r) {
  if (Y(r), !V)
    throw new Error("当前页面缺少头像上传能力");
  const s = await V(_e, r, {
    kind: "image",
    bizKey: `user_avatar_${e}`,
    bizName: "用户头像"
  }), l = I(s.id);
  if (l <= 0)
    throw new Error("头像上传失败");
  return l;
}
function Y(e) {
  if (!ke.has(e.type))
    throw new Error("头像仅支持 JPG、PNG 或 WebP 格式");
  if (e.size > Fe)
    throw new Error("头像文件不能超过 10MB");
}
async function L(e, r, s, l) {
  const o = await De(`/user/auth/${e}`, r, s);
  return Ne(o, l);
}
function Z(e) {
  const r = Ce(e) ? e : {};
  return {
    id: I(r.id),
    name: S(r.name),
    account: S(r.account),
    avatar: S(r.avatar),
    avatarFileID: I(r.avatar_file_id)
  };
}
const A = be.Button, Ue = v.Dialog, je = v.DialogContent, Te = v.DialogDescription, We = v.DialogFooter, xe = v.DialogHeader, $e = v.DialogTitle, Q = we.Input, ze = ye.useAuthStore;
function aa({
  open: e,
  roleLabel: r,
  onOpenChange: s,
  onPasswordChanged: l
}) {
  const o = ze((t) => t.auth), f = ue(null), [c, g] = d("profile"), [u, b] = d(
    () => J(o.user)
  ), [y, D] = d(u.name), [w, _] = d(null), [ae, U] = d(""), [j, F] = d(!1), [k, T] = d(""), [P, W] = d(""), [x, $] = d(""), [re, z] = d(!1), [N, B] = d(!1), [p, C] = d(!1), [M, i] = d("");
  q(() => {
    if (!e)
      return;
    let t = !0;
    const m = J(o.user);
    return b(m), D(m.name), ne(), B(!0), Se().then((h) => {
      t && (b(h), D(h.name), o.setUser({ ...o.user, ...X(h) }));
    }).catch((h) => {
      t && i(R(h, "加载个人资料失败"));
    }).finally(() => {
      t && B(!1);
    }), () => {
      t = !1;
    };
  }, [e]), q(() => {
    if (!w) {
      U("");
      return;
    }
    const t = URL.createObjectURL(w);
    return U(t), () => URL.revokeObjectURL(t);
  }, [w]);
  const te = ae || (j ? "" : u.avatar);
  function ne() {
    g("profile"), _(null), F(!1), T(""), W(""), $(""), z(!1), i("");
  }
  function O(t) {
    p || (g(t), i(""));
  }
  function oe(t) {
    const m = t.target.files?.[0];
    if (t.target.value = "", !!m)
      try {
        Y(m), _(m), F(!1), i("");
      } catch (h) {
        i(R(h, "头像文件不可用"));
      }
  }
  async function se(t) {
    if (t.preventDefault(), !(p || N)) {
      if (c === "profile") {
        await ie();
        return;
      }
      await le();
    }
  }
  async function ie() {
    const t = y.trim();
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
    C(!0), i("");
    try {
      const m = w ? await Le(u.id, w) : j ? 0 : u.avatarFileID, h = await Ee({
        name: t,
        avatarFileID: m
      });
      o.setUser({ ...o.user, ...X(h) }), b(h), K.success("个人资料已更新"), s(!1);
    } catch (m) {
      i(R(m, "保存个人资料失败"));
    } finally {
      C(!1);
    }
  }
  async function le() {
    if (!k) {
      i("请输入当前密码");
      return;
    }
    if (Array.from(P).length < 6) {
      i("新密码不能少于 6 位");
      return;
    }
    if (P !== x) {
      i("两次输入的新密码不一致");
      return;
    }
    C(!0), i("");
    try {
      await Ie({ currentPassword: k, newPassword: P }), K.success("密码已修改，请重新登录"), l();
    } catch (t) {
      i(R(t, "修改密码失败"));
    } finally {
      C(!1);
    }
  }
  return /* @__PURE__ */ a(Ue, { open: e, onOpenChange: p ? void 0 : s, children: /* @__PURE__ */ n(je, { className: "hb-profile-modal sm:max-w-xl", children: [
    /* @__PURE__ */ n(xe, { className: "hb-profile-modal-header", children: [
      /* @__PURE__ */ a($e, { children: "个人信息" }),
      /* @__PURE__ */ a(Te, { children: "管理公开资料与登录安全设置。" })
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
            /* @__PURE__ */ a(de, {}),
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
            /* @__PURE__ */ a(fe, {}),
            "账号安全"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ n("form", { className: "hb-profile-form", onSubmit: se, children: [
      /* @__PURE__ */ n("div", { className: "hb-profile-form-body", children: [
        c === "profile" ? /* @__PURE__ */ a(
          Be,
          {
            profile: u,
            name: y,
            avatarURL: te,
            roleLabel: r,
            fileInputRef: f,
            disabled: N || p,
            onNameChange: D,
            onAvatarChange: oe,
            onChooseAvatar: () => f.current?.click(),
            onRemoveAvatar: () => {
              _(null), F(!0);
            }
          }
        ) : /* @__PURE__ */ a(
          Me,
          {
            currentPassword: k,
            newPassword: P,
            confirmPassword: x,
            showPasswords: re,
            disabled: p,
            onCurrentPasswordChange: T,
            onNewPasswordChange: W,
            onConfirmPasswordChange: $,
            onTogglePasswords: () => z((t) => !t)
          }
        ),
        N ? /* @__PURE__ */ n("div", { className: "hb-profile-status", role: "status", children: [
          /* @__PURE__ */ a(G, { className: "is-spinning" }),
          "正在读取最新资料"
        ] }) : M ? /* @__PURE__ */ a("div", { className: "hb-profile-status is-error", role: "alert", children: M }) : null
      ] }),
      /* @__PURE__ */ n(We, { className: "hb-profile-modal-footer", children: [
        /* @__PURE__ */ a(
          A,
          {
            type: "button",
            variant: "outline",
            disabled: p,
            onClick: () => s(!1),
            children: "取消"
          }
        ),
        /* @__PURE__ */ n(A, { type: "submit", disabled: N || p, children: [
          p ? /* @__PURE__ */ a(G, { className: "is-spinning" }) : null,
          p ? c === "profile" ? "保存中" : "修改中" : c === "profile" ? "保存资料" : "修改密码"
        ] })
      ] })
    ] })
  ] }) });
}
function Be({
  profile: e,
  name: r,
  avatarURL: s,
  roleLabel: l,
  fileInputRef: o,
  disabled: f,
  onNameChange: c,
  onAvatarChange: g,
  onChooseAvatar: u,
  onRemoveAvatar: b
}) {
  return /* @__PURE__ */ n(ce, { children: [
    /* @__PURE__ */ n("section", { className: "hb-profile-avatar-section", children: [
      /* @__PURE__ */ a(
        Pe,
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
            A,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              disabled: f,
              onClick: u,
              children: [
                /* @__PURE__ */ a(me, {}),
                "更换头像"
              ]
            }
          ),
          s ? /* @__PURE__ */ n(
            A,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              disabled: f,
              onClick: b,
              children: [
                /* @__PURE__ */ a(he, {}),
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
            onChange: g
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ a(ee, { label: "昵称", htmlFor: "hb-profile-name", children: /* @__PURE__ */ a(
      Q,
      {
        id: "hb-profile-name",
        value: r,
        maxLength: 64,
        autoComplete: "name",
        disabled: f,
        placeholder: "输入昵称",
        onChange: (y) => c(y.target.value)
      }
    ) }),
    /* @__PURE__ */ n("div", { className: "hb-profile-readonly-grid", children: [
      /* @__PURE__ */ a(H, { label: "手机号", value: e.account || "未设置" }),
      /* @__PURE__ */ a(H, { label: "账号角色", value: l })
    ] })
  ] });
}
function Me({
  currentPassword: e,
  newPassword: r,
  confirmPassword: s,
  showPasswords: l,
  disabled: o,
  onCurrentPasswordChange: f,
  onNewPasswordChange: c,
  onConfirmPasswordChange: g,
  onTogglePasswords: u
}) {
  return /* @__PURE__ */ n("section", { className: "hb-profile-security", children: [
    /* @__PURE__ */ n("div", { className: "hb-profile-security-note", children: [
      /* @__PURE__ */ a(pe, {}),
      /* @__PURE__ */ a("span", { children: "修改密码后，当前账号在所有设备上的登录状态都会失效，需要重新登录。" })
    ] }),
    /* @__PURE__ */ a(
      E,
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
      E,
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
      E,
      {
        id: "hb-confirm-password",
        label: "确认新密码",
        value: s,
        autoComplete: "new-password",
        show: l,
        disabled: o,
        onChange: g,
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
function H({ label: e, value: r }) {
  return /* @__PURE__ */ n("div", { className: "hb-profile-readonly-field", children: [
    /* @__PURE__ */ a("span", { children: e }),
    /* @__PURE__ */ a("strong", { children: r })
  ] });
}
function E({
  id: e,
  label: r,
  value: s,
  autoComplete: l,
  show: o,
  disabled: f,
  onChange: c,
  onToggle: g
}) {
  return /* @__PURE__ */ a(ee, { label: r, htmlFor: e, children: /* @__PURE__ */ n("span", { className: "hb-profile-password-input", children: [
    /* @__PURE__ */ a(
      Q,
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
        onClick: g,
        children: o ? /* @__PURE__ */ a(ge, {}) : /* @__PURE__ */ a(ve, {})
      }
    )
  ] }) });
}
function J(e) {
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
  aa as WorkbenchProfileDialog
};
