import { j as t, a as o, F as he } from "./react-CDpwMNlY.js";
import { e as me, a as d, b as V } from "./file-kind-DFeonxO2.js";
import { x as ge, a3 as ve, r as X, a4 as we, h as be, a5 as ye, a6 as Ce, k as Pe } from "./vendor-icons-Cz5zFzlk.js";
import { t as Y } from "./index-CVhTq79S.js";
import { W as De } from "./home-shell-B0kc4R6J.js";
import { s as ke, c as j, r as E, j as Ne, l as _e, k } from "./site-config-cvPYHSmK.js";
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/lib/upload"]);
const M = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!M || Object.keys(M).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Fe = M.request, I = window.DeverFront?.sdk?.getCompatModule("@/lib/upload");
if (!I || Object.keys(I).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/upload");
const Re = 10 * 1024 * 1024, Ae = /* @__PURE__ */ new Set([
  "image/jpeg",
  "image/png",
  "image/webp"
]), { uploadFileByRule: Z } = I;
async function Ee() {
  const e = await x("profile", "get", void 0, "加载个人资料失败");
  return re(e.user);
}
async function Se(e) {
  const a = await x(
    "profile",
    "post",
    {
      name: e.name,
      avatar_file_id: e.avatarFileID
    },
    "保存个人资料失败"
  );
  return re(a.user);
}
async function je(e) {
  await x(
    "password",
    "post",
    {
      current_password: e.currentPassword,
      new_password: e.newPassword
    },
    "修改密码失败"
  );
}
async function Me(e, a) {
  if (ae(a), !Z)
    throw new Error("当前页面缺少头像上传能力");
  const s = await _e("avatar"), u = await Z(s, a, {
    kind: "image",
    bizKey: `user_avatar_${e}`,
    bizName: "用户头像"
  }), n = j(u.id);
  if (n <= 0)
    throw new Error("头像上传失败");
  return n;
}
function ae(e) {
  if (!Ae.has(e.type))
    throw new Error("头像仅支持 JPG、PNG 或 WebP 格式");
  if (e.size > Re)
    throw new Error("头像文件不能超过 10MB");
}
async function x(e, a, s, u) {
  const n = await Fe(`/user/auth/${e}`, a, s);
  return ke(n, u);
}
function re(e) {
  const a = Ne(e) ? e : {};
  return {
    id: j(a.id),
    name: E(a.name),
    account: E(a.account),
    avatar: E(a.avatar),
    avatarFileID: j(a.avatar_file_id)
  };
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/button", "@/components/ui/dialog", "@/components/ui/input", "@/stores/auth-store"]);
const L = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!L || Object.keys(L).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const N = L.Button, v = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!v || Object.keys(v).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const Ie = v.Dialog, Le = v.DialogContent, Ue = v.DialogDescription, We = v.DialogFooter, xe = v.DialogHeader, Oe = v.DialogTitle, U = window.DeverFront?.sdk?.getCompatModule("@/components/ui/input");
if (!U || Object.keys(U).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/input");
const ne = U.Input, W = window.DeverFront?.sdk?.getCompatModule("@/stores/auth-store");
if (!W || Object.keys(W).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/stores/auth-store");
const Te = W.useAuthStore;
function Ve({
  open: e,
  roleLabel: a,
  onOpenChange: s,
  onPasswordChanged: u
}) {
  const n = Te((r) => r.auth), f = me(null), [l, g] = d("profile"), [c, w] = d(
    () => ee(n.user)
  ), [y, _] = d(c.name), [b, F] = d(null), [se, O] = d(""), [T, R] = d(!1), [A, q] = d(""), [C, B] = d(""), [z, G] = d(""), [ie, $] = d(!1), [P, H] = d(!1), [m, D] = d(!1), [J, i] = d("");
  V(() => {
    if (!e)
      return;
    let r = !0;
    const p = ee(n.user);
    return w(p), _(p.name), ce(), H(!0), Ee().then((h) => {
      r && (w(h), _(h.name), n.setUser({ ...n.user, ...te(h) }));
    }).catch((h) => {
      r && i(k(h, "加载个人资料失败"));
    }).finally(() => {
      r && H(!1);
    }), () => {
      r = !1;
    };
  }, [e]), V(() => {
    if (!b) {
      O("");
      return;
    }
    const r = URL.createObjectURL(b);
    return O(r), () => URL.revokeObjectURL(r);
  }, [b]);
  const le = se || (T ? "" : c.avatar);
  function ce() {
    g("profile"), F(null), R(!1), q(""), B(""), G(""), $(!1), i("");
  }
  function K(r) {
    m || (g(r), i(""));
  }
  function ue(r) {
    const p = r.target.files?.[0];
    if (r.target.value = "", !!p)
      try {
        ae(p), F(p), R(!1), i("");
      } catch (h) {
        i(k(h, "头像文件不可用"));
      }
  }
  async function de(r) {
    if (r.preventDefault(), !(m || P)) {
      if (l === "profile") {
        await fe();
        return;
      }
      await pe();
    }
  }
  async function fe() {
    const r = y.trim();
    if (!r) {
      i("请输入昵称");
      return;
    }
    if (Array.from(r).length > 64) {
      i("昵称不能超过 64 个字符");
      return;
    }
    if (c.id <= 0) {
      i("用户信息不完整，请刷新页面后重试");
      return;
    }
    D(!0), i("");
    try {
      const p = b ? await Me(c.id, b) : T ? 0 : c.avatarFileID, h = await Se({
        name: r,
        avatarFileID: p
      });
      n.setUser({ ...n.user, ...te(h) }), w(h), Y.success("个人资料已更新"), s(!1);
    } catch (p) {
      i(k(p, "保存个人资料失败"));
    } finally {
      D(!1);
    }
  }
  async function pe() {
    if (!A) {
      i("请输入当前密码");
      return;
    }
    if (Array.from(C).length < 6) {
      i("新密码不能少于 6 位");
      return;
    }
    if (C !== z) {
      i("两次输入的新密码不一致");
      return;
    }
    D(!0), i("");
    try {
      await je({ currentPassword: A, newPassword: C }), Y.success("密码已修改，请重新登录"), u();
    } catch (r) {
      i(k(r, "修改密码失败"));
    } finally {
      D(!1);
    }
  }
  return /* @__PURE__ */ t(Ie, { open: e, onOpenChange: m ? void 0 : s, children: /* @__PURE__ */ o(Le, { className: "hb-profile-modal sm:max-w-xl", children: [
    /* @__PURE__ */ o(xe, { className: "hb-profile-modal-header", children: [
      /* @__PURE__ */ t(Oe, { children: "个人信息" }),
      /* @__PURE__ */ t(Ue, { children: "管理公开资料与登录安全设置。" })
    ] }),
    /* @__PURE__ */ o("div", { className: "hb-profile-tabs", "aria-label": "个人信息设置", children: [
      /* @__PURE__ */ o(
        "button",
        {
          type: "button",
          className: l === "profile" ? "is-active" : "",
          "aria-pressed": l === "profile",
          onClick: () => K("profile"),
          children: [
            /* @__PURE__ */ t(ge, {}),
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
          onClick: () => K("security"),
          children: [
            /* @__PURE__ */ t(ve, {}),
            "账号安全"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ o("form", { className: "hb-profile-form", onSubmit: de, children: [
      /* @__PURE__ */ o("div", { className: "hb-profile-form-body", children: [
        l === "profile" ? /* @__PURE__ */ t(
          qe,
          {
            profile: c,
            name: y,
            avatarURL: le,
            roleLabel: a,
            fileInputRef: f,
            disabled: P || m,
            onNameChange: _,
            onAvatarChange: ue,
            onChooseAvatar: () => f.current?.click(),
            onRemoveAvatar: () => {
              F(null), R(!0);
            }
          }
        ) : /* @__PURE__ */ t(
          Be,
          {
            currentPassword: A,
            newPassword: C,
            confirmPassword: z,
            showPasswords: ie,
            disabled: m,
            onCurrentPasswordChange: q,
            onNewPasswordChange: B,
            onConfirmPasswordChange: G,
            onTogglePasswords: () => $((r) => !r)
          }
        ),
        P ? /* @__PURE__ */ o("div", { className: "hb-profile-status", role: "status", children: [
          /* @__PURE__ */ t(X, { className: "is-spinning" }),
          "正在读取最新资料"
        ] }) : J ? /* @__PURE__ */ t("div", { className: "hb-profile-status is-error", role: "alert", children: J }) : null
      ] }),
      /* @__PURE__ */ o(We, { className: "hb-profile-modal-footer", children: [
        /* @__PURE__ */ t(
          N,
          {
            type: "button",
            variant: "outline",
            disabled: m,
            onClick: () => s(!1),
            children: "取消"
          }
        ),
        /* @__PURE__ */ o(N, { type: "submit", disabled: P || m, children: [
          m ? /* @__PURE__ */ t(X, { className: "is-spinning" }) : null,
          m ? l === "profile" ? "保存中" : "修改中" : l === "profile" ? "保存资料" : "修改密码"
        ] })
      ] })
    ] })
  ] }) });
}
function qe({
  profile: e,
  name: a,
  avatarURL: s,
  roleLabel: u,
  fileInputRef: n,
  disabled: f,
  onNameChange: l,
  onAvatarChange: g,
  onChooseAvatar: c,
  onRemoveAvatar: w
}) {
  return /* @__PURE__ */ o(he, { children: [
    /* @__PURE__ */ o("section", { className: "hb-profile-avatar-section", children: [
      /* @__PURE__ */ t(
        De,
        {
          src: s,
          name: a,
          account: e.account,
          className: "hb-profile-avatar"
        }
      ),
      /* @__PURE__ */ o("div", { children: [
        /* @__PURE__ */ t("strong", { children: "头像" }),
        /* @__PURE__ */ t("span", { children: "支持 JPG、PNG、WebP，文件不超过 10MB。" }),
        /* @__PURE__ */ o("div", { className: "hb-profile-avatar-actions", children: [
          /* @__PURE__ */ o(
            N,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              disabled: f,
              onClick: c,
              children: [
                /* @__PURE__ */ t(we, {}),
                "更换头像"
              ]
            }
          ),
          s ? /* @__PURE__ */ o(
            N,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              disabled: f,
              onClick: w,
              children: [
                /* @__PURE__ */ t(be, {}),
                "移除"
              ]
            }
          ) : null
        ] }),
        /* @__PURE__ */ t(
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
    /* @__PURE__ */ t(oe, { label: "昵称", htmlFor: "hb-profile-name", children: /* @__PURE__ */ t(
      ne,
      {
        id: "hb-profile-name",
        value: a,
        maxLength: 64,
        autoComplete: "name",
        disabled: f,
        placeholder: "输入昵称",
        onChange: (y) => l(y.target.value)
      }
    ) }),
    /* @__PURE__ */ o("div", { className: "hb-profile-readonly-grid", children: [
      /* @__PURE__ */ t(Q, { label: "手机号", value: e.account || "未设置" }),
      /* @__PURE__ */ t(Q, { label: "账号角色", value: u })
    ] })
  ] });
}
function Be({
  currentPassword: e,
  newPassword: a,
  confirmPassword: s,
  showPasswords: u,
  disabled: n,
  onCurrentPasswordChange: f,
  onNewPasswordChange: l,
  onConfirmPasswordChange: g,
  onTogglePasswords: c
}) {
  return /* @__PURE__ */ o("section", { className: "hb-profile-security", children: [
    /* @__PURE__ */ o("div", { className: "hb-profile-security-note", children: [
      /* @__PURE__ */ t(ye, {}),
      /* @__PURE__ */ t("span", { children: "修改密码后，当前账号在所有设备上的登录状态都会失效，需要重新登录。" })
    ] }),
    /* @__PURE__ */ t(
      S,
      {
        id: "hb-current-password",
        label: "当前密码",
        value: e,
        autoComplete: "current-password",
        show: u,
        disabled: n,
        onChange: f,
        onToggle: c
      }
    ),
    /* @__PURE__ */ t(
      S,
      {
        id: "hb-new-password",
        label: "新密码",
        value: a,
        autoComplete: "new-password",
        show: u,
        disabled: n,
        onChange: l,
        onToggle: c
      }
    ),
    /* @__PURE__ */ t(
      S,
      {
        id: "hb-confirm-password",
        label: "确认新密码",
        value: s,
        autoComplete: "new-password",
        show: u,
        disabled: n,
        onChange: g,
        onToggle: c
      }
    )
  ] });
}
function oe({
  label: e,
  htmlFor: a,
  children: s
}) {
  return /* @__PURE__ */ o("label", { className: "hb-profile-field", htmlFor: a, children: [
    /* @__PURE__ */ t("span", { children: e }),
    s
  ] });
}
function Q({ label: e, value: a }) {
  return /* @__PURE__ */ o("div", { className: "hb-profile-readonly-field", children: [
    /* @__PURE__ */ t("span", { children: e }),
    /* @__PURE__ */ t("strong", { children: a })
  ] });
}
function S({
  id: e,
  label: a,
  value: s,
  autoComplete: u,
  show: n,
  disabled: f,
  onChange: l,
  onToggle: g
}) {
  return /* @__PURE__ */ t(oe, { label: a, htmlFor: e, children: /* @__PURE__ */ o("span", { className: "hb-profile-password-input", children: [
    /* @__PURE__ */ t(
      ne,
      {
        id: e,
        type: n ? "text" : "password",
        value: s,
        autoComplete: u,
        disabled: f,
        onChange: (c) => l(c.target.value)
      }
    ),
    /* @__PURE__ */ t(
      "button",
      {
        type: "button",
        "aria-label": n ? "隐藏密码" : "显示密码",
        title: n ? "隐藏密码" : "显示密码",
        onClick: g,
        children: n ? /* @__PURE__ */ t(Ce, {}) : /* @__PURE__ */ t(Pe, {})
      }
    )
  ] }) });
}
function ee(e) {
  return {
    id: Number(e?.id || 0),
    name: String(e?.name || ""),
    account: String(e?.account || ""),
    avatar: String(e?.avatar || ""),
    avatarFileID: Number(e?.avatar_file_id || 0)
  };
}
function te(e) {
  return {
    id: e.id,
    name: e.name,
    account: e.account,
    avatar: e.avatar,
    avatar_file_id: e.avatarFileID
  };
}
export {
  Ve as WorkbenchProfileDialog
};
