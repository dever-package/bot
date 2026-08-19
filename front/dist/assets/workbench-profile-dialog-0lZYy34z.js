import { j as t, a as n, F as he } from "./preloadable-Bomi5PEU.js";
import { d as me, a as d, b as K } from "./_commonjsHelpers-61wyk6v6.js";
import { s as ge, Y as ve, L as Y, _ as we, h as be, $ as ye, a0 as Ce, k as Pe } from "./vendor-icons-B3DKX3la.js";
import { t as X } from "./index-2TBwAJWu.js";
import { W as De } from "./home-shell-BPM5Zt6P.js";
import { s as _e, d as j, r as E, j as ke, k as _ } from "./site-config-C63CM9jT.js";
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/lib/upload"]);
const M = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!M || Object.keys(M).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const Ne = M.request, I = window.DeverFront?.sdk?.getCompatModule("@/lib/upload");
if (!I || Object.keys(I).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/upload");
const Fe = 1, Re = 10 * 1024 * 1024, Ae = /* @__PURE__ */ new Set([
  "image/jpeg",
  "image/png",
  "image/webp"
]), { uploadFileByRule: Z } = I;
async function Ee() {
  const e = await W("profile", "get", void 0, "加载个人资料失败");
  return ae(e.user);
}
async function Se(e) {
  const r = await W(
    "profile",
    "post",
    {
      name: e.name,
      avatar_file_id: e.avatarFileID
    },
    "保存个人资料失败"
  );
  return ae(r.user);
}
async function je(e) {
  await W(
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
  if (re(r), !Z)
    throw new Error("当前页面缺少头像上传能力");
  const s = await Z(Fe, r, {
    kind: "image",
    bizKey: `user_avatar_${e}`,
    bizName: "用户头像"
  }), l = j(s.id);
  if (l <= 0)
    throw new Error("头像上传失败");
  return l;
}
function re(e) {
  if (!Ae.has(e.type))
    throw new Error("头像仅支持 JPG、PNG 或 WebP 格式");
  if (e.size > Re)
    throw new Error("头像文件不能超过 10MB");
}
async function W(e, r, s, l) {
  const o = await Ne(`/user/auth/${e}`, r, s);
  return _e(o, l);
}
function ae(e) {
  const r = ke(e) ? e : {};
  return {
    id: j(r.id),
    name: E(r.name),
    account: E(r.account),
    avatar: E(r.avatar),
    avatarFileID: j(r.avatar_file_id)
  };
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/button", "@/components/ui/dialog", "@/components/ui/input", "@/stores/auth-store"]);
const L = window.DeverFront?.sdk?.getCompatModule("@/components/ui/button");
if (!L || Object.keys(L).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/button");
const k = L.Button, v = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dialog");
if (!v || Object.keys(v).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dialog");
const Ie = v.Dialog, Le = v.DialogContent, Ue = v.DialogDescription, Oe = v.DialogFooter, We = v.DialogHeader, Te = v.DialogTitle, U = window.DeverFront?.sdk?.getCompatModule("@/components/ui/input");
if (!U || Object.keys(U).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/input");
const ne = U.Input, O = window.DeverFront?.sdk?.getCompatModule("@/stores/auth-store");
if (!O || Object.keys(O).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/stores/auth-store");
const xe = O.useAuthStore;
function Ke({
  open: e,
  roleLabel: r,
  onOpenChange: s,
  onPasswordChanged: l
}) {
  const o = xe((a) => a.auth), f = me(null), [c, g] = d("profile"), [u, w] = d(
    () => ee(o.user)
  ), [y, N] = d(u.name), [b, F] = d(null), [se, T] = d(""), [x, R] = d(!1), [A, q] = d(""), [C, z] = d(""), [B, $] = d(""), [ie, G] = d(!1), [P, V] = d(!1), [m, D] = d(!1), [H, i] = d("");
  K(() => {
    if (!e)
      return;
    let a = !0;
    const p = ee(o.user);
    return w(p), N(p.name), ce(), V(!0), Ee().then((h) => {
      a && (w(h), N(h.name), o.setUser({ ...o.user, ...te(h) }));
    }).catch((h) => {
      a && i(_(h, "加载个人资料失败"));
    }).finally(() => {
      a && V(!1);
    }), () => {
      a = !1;
    };
  }, [e]), K(() => {
    if (!b) {
      T("");
      return;
    }
    const a = URL.createObjectURL(b);
    return T(a), () => URL.revokeObjectURL(a);
  }, [b]);
  const le = se || (x ? "" : u.avatar);
  function ce() {
    g("profile"), F(null), R(!1), q(""), z(""), $(""), G(!1), i("");
  }
  function J(a) {
    m || (g(a), i(""));
  }
  function ue(a) {
    const p = a.target.files?.[0];
    if (a.target.value = "", !!p)
      try {
        re(p), F(p), R(!1), i("");
      } catch (h) {
        i(_(h, "头像文件不可用"));
      }
  }
  async function de(a) {
    if (a.preventDefault(), !(m || P)) {
      if (c === "profile") {
        await fe();
        return;
      }
      await pe();
    }
  }
  async function fe() {
    const a = y.trim();
    if (!a) {
      i("请输入昵称");
      return;
    }
    if (Array.from(a).length > 64) {
      i("昵称不能超过 64 个字符");
      return;
    }
    if (u.id <= 0) {
      i("用户信息不完整，请刷新页面后重试");
      return;
    }
    D(!0), i("");
    try {
      const p = b ? await Me(u.id, b) : x ? 0 : u.avatarFileID, h = await Se({
        name: a,
        avatarFileID: p
      });
      o.setUser({ ...o.user, ...te(h) }), w(h), X.success("个人资料已更新"), s(!1);
    } catch (p) {
      i(_(p, "保存个人资料失败"));
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
    if (C !== B) {
      i("两次输入的新密码不一致");
      return;
    }
    D(!0), i("");
    try {
      await je({ currentPassword: A, newPassword: C }), X.success("密码已修改，请重新登录"), l();
    } catch (a) {
      i(_(a, "修改密码失败"));
    } finally {
      D(!1);
    }
  }
  return /* @__PURE__ */ t(Ie, { open: e, onOpenChange: m ? void 0 : s, children: /* @__PURE__ */ n(Le, { className: "hb-profile-modal sm:max-w-xl", children: [
    /* @__PURE__ */ n(We, { className: "hb-profile-modal-header", children: [
      /* @__PURE__ */ t(Te, { children: "个人信息" }),
      /* @__PURE__ */ t(Ue, { children: "管理公开资料与登录安全设置。" })
    ] }),
    /* @__PURE__ */ n("div", { className: "hb-profile-tabs", "aria-label": "个人信息设置", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: c === "profile" ? "is-active" : "",
          "aria-pressed": c === "profile",
          onClick: () => J("profile"),
          children: [
            /* @__PURE__ */ t(ge, {}),
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
          onClick: () => J("security"),
          children: [
            /* @__PURE__ */ t(ve, {}),
            "账号安全"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ n("form", { className: "hb-profile-form", onSubmit: de, children: [
      /* @__PURE__ */ n("div", { className: "hb-profile-form-body", children: [
        c === "profile" ? /* @__PURE__ */ t(
          qe,
          {
            profile: u,
            name: y,
            avatarURL: le,
            roleLabel: r,
            fileInputRef: f,
            disabled: P || m,
            onNameChange: N,
            onAvatarChange: ue,
            onChooseAvatar: () => f.current?.click(),
            onRemoveAvatar: () => {
              F(null), R(!0);
            }
          }
        ) : /* @__PURE__ */ t(
          ze,
          {
            currentPassword: A,
            newPassword: C,
            confirmPassword: B,
            showPasswords: ie,
            disabled: m,
            onCurrentPasswordChange: q,
            onNewPasswordChange: z,
            onConfirmPasswordChange: $,
            onTogglePasswords: () => G((a) => !a)
          }
        ),
        P ? /* @__PURE__ */ n("div", { className: "hb-profile-status", role: "status", children: [
          /* @__PURE__ */ t(Y, { className: "is-spinning" }),
          "正在读取最新资料"
        ] }) : H ? /* @__PURE__ */ t("div", { className: "hb-profile-status is-error", role: "alert", children: H }) : null
      ] }),
      /* @__PURE__ */ n(Oe, { className: "hb-profile-modal-footer", children: [
        /* @__PURE__ */ t(
          k,
          {
            type: "button",
            variant: "outline",
            disabled: m,
            onClick: () => s(!1),
            children: "取消"
          }
        ),
        /* @__PURE__ */ n(k, { type: "submit", disabled: P || m, children: [
          m ? /* @__PURE__ */ t(Y, { className: "is-spinning" }) : null,
          m ? c === "profile" ? "保存中" : "修改中" : c === "profile" ? "保存资料" : "修改密码"
        ] })
      ] })
    ] })
  ] }) });
}
function qe({
  profile: e,
  name: r,
  avatarURL: s,
  roleLabel: l,
  fileInputRef: o,
  disabled: f,
  onNameChange: c,
  onAvatarChange: g,
  onChooseAvatar: u,
  onRemoveAvatar: w
}) {
  return /* @__PURE__ */ n(he, { children: [
    /* @__PURE__ */ n("section", { className: "hb-profile-avatar-section", children: [
      /* @__PURE__ */ t(
        De,
        {
          src: s,
          name: r,
          account: e.account,
          className: "hb-profile-avatar"
        }
      ),
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ t("strong", { children: "头像" }),
        /* @__PURE__ */ t("span", { children: "支持 JPG、PNG、WebP，文件不超过 10MB。" }),
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
                /* @__PURE__ */ t(we, {}),
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
            ref: o,
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
        value: r,
        maxLength: 64,
        autoComplete: "name",
        disabled: f,
        placeholder: "输入昵称",
        onChange: (y) => c(y.target.value)
      }
    ) }),
    /* @__PURE__ */ n("div", { className: "hb-profile-readonly-grid", children: [
      /* @__PURE__ */ t(Q, { label: "手机号", value: e.account || "未设置" }),
      /* @__PURE__ */ t(Q, { label: "账号角色", value: l })
    ] })
  ] });
}
function ze({
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
        show: l,
        disabled: o,
        onChange: f,
        onToggle: u
      }
    ),
    /* @__PURE__ */ t(
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
    /* @__PURE__ */ t(
      S,
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
function oe({
  label: e,
  htmlFor: r,
  children: s
}) {
  return /* @__PURE__ */ n("label", { className: "hb-profile-field", htmlFor: r, children: [
    /* @__PURE__ */ t("span", { children: e }),
    s
  ] });
}
function Q({ label: e, value: r }) {
  return /* @__PURE__ */ n("div", { className: "hb-profile-readonly-field", children: [
    /* @__PURE__ */ t("span", { children: e }),
    /* @__PURE__ */ t("strong", { children: r })
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
  onToggle: g
}) {
  return /* @__PURE__ */ t(oe, { label: r, htmlFor: e, children: /* @__PURE__ */ n("span", { className: "hb-profile-password-input", children: [
    /* @__PURE__ */ t(
      ne,
      {
        id: e,
        type: o ? "text" : "password",
        value: s,
        autoComplete: l,
        disabled: f,
        onChange: (u) => c(u.target.value)
      }
    ),
    /* @__PURE__ */ t(
      "button",
      {
        type: "button",
        "aria-label": o ? "隐藏密码" : "显示密码",
        title: o ? "隐藏密码" : "显示密码",
        onClick: g,
        children: o ? /* @__PURE__ */ t(Ce, {}) : /* @__PURE__ */ t(Pe, {})
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
  Ke as WorkbenchProfileDialog
};
