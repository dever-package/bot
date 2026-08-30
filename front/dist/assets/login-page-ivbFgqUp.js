import { j as o, a as u } from "./preloadable-Bomi5PEU.js";
import { a as m, d as oe, e as re, b } from "./_commonjsHelpers-61wyk6v6.js";
import { a6 as ne, k as ae, r as K, X as ie, $ as se, aa as le } from "./vendor-icons-DwjYEojZ.js";
import { t as f } from "./index-BqbNvFGg.js";
import { a as ce } from "./react-DXzVgfWS.js";
import { u as de, f as ue, l as H, m as ge, o as me } from "./site-config-C63CM9jT.js";
import { h as he, a as we, b as pe } from "./body-filing-Ifyd_E3m.js";
import { B as fe, d as R, a as be, b as q, c as W } from "./site-brand-C-CcdipL.js";
import { u as ke } from "./use-body-appearance-RBVqJFik.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./login-page-y0Dfxu1T.css", import.meta.url).href]);
const ye = "https://open.feishu.cn/open-apis/authen/v1/authorize", U = "bot.body.feishu-auth", ve = 600 * 1e3;
function Ne(e, t) {
  if (!e.configured || !e.appID.trim())
    throw new Error("飞书登录尚未配置，请联系管理员");
  const n = Se(), l = {
    state: n,
    accountID: e.id,
    redirectTo: t.trim(),
    createdAt: Date.now()
  };
  try {
    window.sessionStorage.setItem(
      U,
      JSON.stringify(l)
    );
  } catch {
    throw new Error("浏览器无法保存飞书授权状态，请检查隐私设置");
  }
  const c = new URLSearchParams({
    app_id: e.appID.trim(),
    redirect_uri: Ce(),
    response_type: "code",
    state: n
  });
  window.location.assign(`${ye}?${c.toString()}`);
}
function Ee() {
  if (typeof window > "u")
    return null;
  const e = new URLSearchParams(window.location.search), t = (e.get("code") || "").trim(), n = (e.get("error") || "").trim();
  if (!t && !n)
    return null;
  const l = (e.get("state") || "").trim(), c = (e.get("error_description") || "").trim(), i = Le();
  Ie(e);
  try {
    window.sessionStorage.removeItem(U);
  } catch {
  }
  if (n)
    throw new Error(c || "飞书授权未完成");
  const s = i ? Date.now() - i.createdAt : -1;
  if (!i || !Number.isFinite(i.createdAt) || !l || l !== i.state || s < 0 || s > ve)
    throw new Error("飞书授权状态已失效，请重新登录");
  if (!Number.isFinite(i.accountID) || i.accountID <= 0)
    throw new Error("飞书登录入口无效，请重新登录");
  return {
    code: t,
    accountID: i.accountID,
    redirectTo: i.redirectTo
  };
}
function Se() {
  if (typeof globalThis.crypto?.randomUUID == "function")
    return globalThis.crypto.randomUUID();
  const e = new Uint8Array(24);
  globalThis.crypto?.getRandomValues?.(e);
  const t = Array.from(
    e,
    (n) => n.toString(16).padStart(2, "0")
  ).join("");
  if (!t || /^0+$/.test(t))
    throw new Error("当前浏览器无法创建安全的飞书授权状态");
  return t;
}
function Le() {
  try {
    const e = window.sessionStorage.getItem(U);
    if (!e)
      return null;
    const t = JSON.parse(e);
    return {
      state: typeof t.state == "string" ? t.state : "",
      accountID: Number(t.accountID || 0),
      redirectTo: typeof t.redirectTo == "string" ? t.redirectTo : "",
      createdAt: Number(t.createdAt || 0)
    };
  } catch {
    return null;
  }
}
function Ce() {
  return new URL(window.location.pathname, window.location.origin).toString();
}
function Ie(e) {
  for (const l of ["code", "state", "error", "error_description"])
    e.delete(l);
  const t = e.toString(), n = `${window.location.pathname}${t ? `?${t}` : ""}${window.location.hash}`;
  window.history.replaceState(window.history.state, "", n);
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/input", "@/lib/request", "@/lib/auth-redirect", "@/stores/auth-store", "@/context/theme-provider"]);
const D = window.DeverFront?.sdk?.getCompatModule("@/components/ui/input");
if (!D || Object.keys(D).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/input");
const A = D.Input, w = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!w || Object.keys(w).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const G = w.joinSiteApi, Ae = w.loadMainInfo, J = w.request, Te = w.resetFrontRuntimeCache, F = window.DeverFront?.sdk?.getCompatModule("@/lib/auth-redirect");
if (!F || Object.keys(F).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/auth-redirect");
const De = F.resolvePostLoginTarget, M = window.DeverFront?.sdk?.getCompatModule("@/stores/auth-store");
if (!M || Object.keys(M).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/stores/auth-store");
const Fe = M.useAuthStore, _ = window.DeverFront?.sdk?.getCompatModule("@/context/theme-provider");
if (!_ || Object.keys(_).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/context/theme-provider");
const Me = _.useTheme;
function Ve() {
  const { config: e, loaded: t } = de(), n = _e(
    e.site.appearance.loginBackgroundImage,
    t
  ), l = ce(), { auth: c } = Fe(), { resolvedTheme: i } = Me();
  ke(e.site.appearance, i);
  const [s, v] = m("login"), [P, V] = m(""), [B, Y] = m(""), [$, N] = m(""), [j, g] = m(""), [E, x] = m(!1), [z, k] = m(
    null
  ), [y, Z] = m(!1), [S, L] = m(!1), C = oe(!1), h = E || z !== null, O = e.site.appearance.loginTemplate === "minimal", I = re(
    async (r, d) => {
      if (!r?.token)
        throw new Error("登录返回缺少 token");
      Te(), c.setUser(r.user), c.setAccessToken(r.token), f.success(
        d.successMessage || `欢迎回来，${r.user?.name || d.fallbackName}`
      ), await xe(l, d.redirectTo);
    },
    [c, l]
  );
  b(() => {
    t && ue(e.site);
  }, [t, e.site]), b(() => {
    e.site.registerEnabled || s !== "register" || (v("login"), N(""), g(""));
  }, [e.site.registerEnabled, s]), b(() => {
    if (!S)
      return;
    function r(d) {
      d.key === "Escape" && L(!1);
    }
    return window.addEventListener("keydown", r), () => window.removeEventListener("keydown", r);
  }, [S]), b(() => {
    if (C.current)
      return;
    let r;
    try {
      r = Ee();
    } catch (a) {
      C.current = !0;
      const p = a instanceof Error && a.message ? a.message : "飞书登录失败，请重新尝试";
      g(p), f.error(p);
      return;
    }
    if (!r)
      return;
    const d = r;
    C.current = !0, k(d.accountID), g(""), (async () => {
      try {
        const a = await J(G("login/feishu"), "post", {
          account_id: d.accountID,
          code: d.code
        });
        if (!H(a) || !a.data?.token)
          throw new Error(a?.message || a?.msg || "飞书登录失败");
        await I(a.data, {
          fallbackName: "飞书用户",
          redirectTo: d.redirectTo
        });
      } catch (a) {
        const p = a instanceof Error && a.message ? a.message : "飞书登录失败，请稍后重试";
        g(p), f.error(p);
      } finally {
        k(null);
      }
    })();
  }, [I]);
  function Q() {
    h || !e.site.registerEnabled && s === "login" || (v((r) => r === "login" ? "register" : "login"), g(""));
  }
  async function ee(r) {
    if (r.preventDefault(), h)
      return;
    if (s === "register" && !e.site.registerEnabled) {
      v("login"), N(""), g("当前站点已关闭注册");
      return;
    }
    const d = je(s, P, B, $);
    if (d.error || !d.data) {
      g(d.error);
      return;
    }
    x(!0), g("");
    try {
      const a = await J(
        s === "login" ? "/user/auth/login" : G("login/register"),
        "post",
        d.data
      );
      if (!H(a) || !a.data?.token) {
        g(a?.message || a?.msg || "操作失败");
        return;
      }
      await I(a.data, {
        fallbackName: d.data.account,
        redirectTo: X(),
        successMessage: s === "register" ? "账号已创建" : void 0
      });
    } catch (a) {
      g(
        a instanceof Error && a.message ? a.message : "操作失败，请稍后重试"
      );
    } finally {
      x(!1);
    }
  }
  function te(r) {
    if (!h) {
      if (r.provider !== "feishu") {
        f.info(`${r.name}暂未开放`);
        return;
      }
      g(""), k(r.id);
      try {
        Ne(r, X());
      } catch (d) {
        const a = d instanceof Error && d.message ? d.message : "飞书登录发起失败";
        g(a), k(null), f.error(a);
      }
    }
  }
  return !t || !n ? /* @__PURE__ */ o(
    "main",
    {
      className: "bot-work-login-page bot-work-login-page-loading",
      "aria-busy": "true"
    }
  ) : /* @__PURE__ */ u(
    "main",
    {
      className: "bot-work-login-page",
      "data-login-template": e.site.appearance.loginTemplate,
      "data-login-background-image": e.site.appearance.loginBackgroundImage ? "true" : void 0,
      "data-page-background": me(e.site.appearance, "login") ? "custom" : void 0,
      style: ge(e.site.appearance, "login"),
      children: [
        /* @__PURE__ */ o(fe, {}),
        O ? null : /* @__PURE__ */ o(
          Re,
          {
            config: e,
            mobileLinksOpen: S,
            onCloseMobileLinks: () => L(!1),
            onToggleMobileLinks: () => L((r) => !r)
          }
        ),
        /* @__PURE__ */ o("div", { className: "bot-work-login-stage", children: /* @__PURE__ */ u("div", { className: "bot-work-login-layout", children: [
          e.site.loginImage ? /* @__PURE__ */ o(
            Be,
            {
              image: e.site.loginImage,
              siteName: e.site.siteName
            }
          ) : null,
          /* @__PURE__ */ u(
            "section",
            {
              className: "bot-work-login-auth",
              "aria-labelledby": "login-title",
              children: [
                /* @__PURE__ */ u("div", { className: "bot-work-login-copy", children: [
                  O && e.site.logo ? /* @__PURE__ */ o(
                    R,
                    {
                      src: e.site.logo,
                      alt: `${e.site.siteName} Logo`,
                      className: "bot-work-login-copy-logo",
                      fallback: null
                    }
                  ) : null,
                  /* @__PURE__ */ o("h1", { id: "login-title", children: e.site.loginTitle }),
                  e.site.loginDescription ? /* @__PURE__ */ o("p", { children: e.site.loginDescription }) : null
                ] }),
                /* @__PURE__ */ u("section", { className: "bot-work-login-form-panel", children: [
                  /* @__PURE__ */ o(
                    $e,
                    {
                      accounts: e.accounts,
                      disabled: h,
                      loadingID: z,
                      onSelect: te
                    }
                  ),
                  e.accounts.length > 0 ? /* @__PURE__ */ o("div", { className: "bot-work-login-divider", children: /* @__PURE__ */ o("span", { children: "或" }) }) : null,
                  /* @__PURE__ */ u("form", { className: "bot-work-login-form", onSubmit: ee, children: [
                    /* @__PURE__ */ o(T, { label: "手机号", children: /* @__PURE__ */ o(
                      A,
                      {
                        value: P,
                        autoComplete: "username",
                        placeholder: "输入手机号",
                        "aria-label": "手机号",
                        className: "bot-work-login-input",
                        onChange: (r) => V(r.target.value)
                      }
                    ) }),
                    s === "register" ? /* @__PURE__ */ o(T, { label: "昵称", children: /* @__PURE__ */ o(
                      A,
                      {
                        value: $,
                        autoComplete: "name",
                        placeholder: "输入昵称",
                        "aria-label": "昵称",
                        className: "bot-work-login-input",
                        onChange: (r) => N(r.target.value)
                      }
                    ) }) : null,
                    /* @__PURE__ */ o(T, { label: "密码", children: /* @__PURE__ */ u("span", { className: "bot-work-login-password", children: [
                      /* @__PURE__ */ o(
                        A,
                        {
                          value: B,
                          type: y ? "text" : "password",
                          autoComplete: s === "login" ? "current-password" : "new-password",
                          placeholder: "至少 6 位",
                          "aria-label": "密码",
                          className: "bot-work-login-input",
                          onChange: (r) => Y(r.target.value)
                        }
                      ),
                      /* @__PURE__ */ o(
                        "button",
                        {
                          type: "button",
                          "aria-label": y ? "隐藏密码" : "显示密码",
                          title: y ? "隐藏密码" : "显示密码",
                          onClick: () => Z((r) => !r),
                          children: y ? /* @__PURE__ */ o(ne, { size: 17, strokeWidth: 1.8 }) : /* @__PURE__ */ o(ae, { size: 17, strokeWidth: 1.8 })
                        }
                      )
                    ] }) }),
                    j ? /* @__PURE__ */ o("div", { className: "bot-work-login-message", role: "alert", children: j }) : null,
                    /* @__PURE__ */ u(
                      "button",
                      {
                        type: "submit",
                        className: "bot-work-login-submit",
                        disabled: h,
                        children: [
                          E ? /* @__PURE__ */ o(K, { className: "bot-work-login-spin" }) : null,
                          /* @__PURE__ */ o("span", { children: E ? "处理中" : s === "login" ? "登录" : "注册" })
                        ]
                      }
                    )
                  ] }),
                  e.site.registerEnabled ? /* @__PURE__ */ u("p", { className: "bot-work-login-mode-switch", children: [
                    /* @__PURE__ */ o("span", { children: s === "login" ? "还没有账号？" : "已经有账号？" }),
                    /* @__PURE__ */ o("button", { type: "button", disabled: h, onClick: Q, children: s === "login" ? "注册" : "登录" })
                  ] }) : null,
                  /* @__PURE__ */ o(Ue, { config: e })
                ] })
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ o(Pe, { filing: e.site.filing })
      ]
    }
  );
}
function _e(e, t) {
  const [n, l] = m("");
  return b(() => {
    if (!t || !e || typeof window > "u")
      return;
    let c = !0;
    const i = new window.Image(), s = () => {
      c && l(e);
    };
    return i.onload = s, i.onerror = s, i.src = e, i.complete && s(), () => {
      c = !1, i.onload = null, i.onerror = null;
    };
  }, [t, e]), !t || !e || n === e;
}
function Re({
  config: e,
  mobileLinksOpen: t,
  onCloseMobileLinks: n,
  onToggleMobileLinks: l
}) {
  return /* @__PURE__ */ u("header", { className: "bot-work-login-header", children: [
    /* @__PURE__ */ u("div", { className: "bot-work-login-header-inner", children: [
      /* @__PURE__ */ o(
        be,
        {
          site: e.site,
          className: "bot-work-login-brand",
          logoClassName: "bot-work-login-brand-logo",
          nameClassName: "bot-work-login-brand-name"
        }
      ),
      /* @__PURE__ */ o(
        q,
        {
          links: e.links,
          className: "bot-work-login-links",
          ariaLabel: "站点链接"
        }
      ),
      e.links.length > 0 ? /* @__PURE__ */ o("div", { className: "bot-work-login-header-actions", children: /* @__PURE__ */ o(
        "button",
        {
          type: "button",
          className: "bot-work-login-menu-button",
          "aria-label": t ? "关闭站点链接" : "打开站点链接",
          "aria-controls": "bot-work-login-mobile-links",
          "aria-expanded": t,
          onClick: l,
          children: t ? /* @__PURE__ */ o(ie, { size: 18 }) : /* @__PURE__ */ o(se, { size: 18 })
        }
      ) }) : null
    ] }),
    t && e.links.length > 0 ? /* @__PURE__ */ o(
      q,
      {
        id: "bot-work-login-mobile-links",
        links: e.links,
        className: "bot-work-login-mobile-links",
        ariaLabel: "移动端站点链接",
        onLinkClick: n
      }
    ) : null
  ] });
}
function Ue({ config: e }) {
  const { termsOfService: t, privacyPolicy: n } = e.legalLinks;
  return !t && !n ? null : /* @__PURE__ */ u("p", { className: "bot-work-login-legal", children: [
    "继续即表示您同意 ",
    e.site.siteName,
    " 的",
    t ? /* @__PURE__ */ o(W, { link: t }) : null,
    t && n ? "和" : null,
    n ? /* @__PURE__ */ o(W, { link: n }) : null
  ] });
}
function Pe({ filing: e }) {
  return he(e) ? /* @__PURE__ */ o("footer", { className: "bot-work-login-filing", "aria-label": "站点备案信息", children: /* @__PURE__ */ o(
    we,
    {
      filing: e,
      className: "bot-work-login-filing-rich",
      fallback: /* @__PURE__ */ o(
        pe,
        {
          filing: e,
          itemClassName: "bot-work-login-filing-item"
        }
      )
    }
  ) }) : null;
}
function Be({
  image: e,
  siteName: t
}) {
  const n = `${t} 登录页展示图`;
  return /* @__PURE__ */ o("section", { className: "bot-work-login-artwork", "aria-label": "创作灵感", children: /* @__PURE__ */ o(R, { src: e, alt: n, fallback: null }) });
}
function $e({
  accounts: e,
  disabled: t,
  loadingID: n,
  onSelect: l
}) {
  return e.length === 0 ? null : /* @__PURE__ */ o("div", { className: "bot-work-login-third-party", children: e.map((c) => /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      disabled: t,
      onClick: () => l(c),
      children: [
        n === c.id ? /* @__PURE__ */ o(K, { className: "bot-work-login-spin", size: 19 }) : /* @__PURE__ */ o(
          R,
          {
            src: c.icon,
            alt: "",
            fallback: /* @__PURE__ */ o(le, { size: 19, strokeWidth: 1.9 })
          }
        ),
        /* @__PURE__ */ o("span", { children: c.name })
      ]
    },
    c.id
  )) });
}
function T({
  label: e,
  children: t
}) {
  return /* @__PURE__ */ u("label", { className: "bot-work-login-field", children: [
    /* @__PURE__ */ o("span", { className: "bot-work-login-field-label", children: e }),
    t
  ] });
}
function je(e, t, n, l) {
  const c = t.trim(), i = n.trim(), s = l.trim();
  return !c || !i ? { error: "请输入手机号和密码", data: null } : i.length < 6 ? { error: "密码不能少于 6 位", data: null } : {
    error: "",
    data: {
      account: c,
      password: i,
      ...e === "register" ? { name: s || c } : {}
    }
  };
}
function X() {
  return typeof window > "u" ? "" : new URLSearchParams(window.location.search).get("redirect") || "";
}
async function xe(e, t) {
  try {
    const n = await Ae(), l = De({
      redirectTo: t,
      entry: n.entry,
      menu: n.menu
    });
    e({ to: l.to, search: l.search, replace: !0 });
  } catch {
    e({ to: "/", replace: !0 });
  }
}
export {
  Ve as WorkLoginPage
};
