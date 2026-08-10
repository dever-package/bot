import { a as o, j as u } from "./_commonjsHelpers-CTFd9u1x.js";
import { l as m, u as Q, b as ee, o as p } from "./react-C7Xtl8sB.js";
import { E as te, w as oe, L as G, X as re, s as ne, O as ae } from "./vendor-icons-Cc7Kl3It.js";
import { t as f } from "./index-BxqXLJC9.js";
import { u as ie } from "./runtime-entry-CEEPqE_1.js";
import { m as se } from "./input-DLnnH2-7.js";
import { m as y } from "./in-flight-request-DlB1DJg0.js";
import { m as le } from "./project-dialogs-CdThoMTm.js";
import { m as ce } from "./theme-provider-vgtP-iBt.js";
import { u as de, f as ue, m as x, o as ge, p as me } from "./site-config-BVY1isir.js";
import { h as he, a as we, b as fe } from "./body-filing-MMyHqq3B.js";
import { B as pe, d as F, a as be, b as H, c as O } from "./site-brand-ByNt4_8T.js";
import { u as ke } from "./use-body-appearance-BJXSEKAq.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./login-page-y0Dfxu1T.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/lib/auth-redirect"]);
const D = window.DeverFront?.sdk?.getCompatModule("@/lib/auth-redirect");
if (!D || Object.keys(D).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/auth-redirect");
const ye = "https://open.feishu.cn/open-apis/authen/v1/authorize", R = "bot.body.feishu-auth", Ne = 600 * 1e3;
function ve(e, t) {
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
      R,
      JSON.stringify(l)
    );
  } catch {
    throw new Error("浏览器无法保存飞书授权状态，请检查隐私设置");
  }
  const c = new URLSearchParams({
    app_id: e.appID.trim(),
    redirect_uri: Ie(),
    response_type: "code",
    state: n
  });
  window.location.assign(`${ye}?${c.toString()}`);
}
function Le() {
  if (typeof window > "u")
    return null;
  const e = new URLSearchParams(window.location.search), t = (e.get("code") || "").trim(), n = (e.get("error") || "").trim();
  if (!t && !n)
    return null;
  const l = (e.get("state") || "").trim(), c = (e.get("error_description") || "").trim(), i = Ee();
  Ae(e);
  try {
    window.sessionStorage.removeItem(R);
  } catch {
  }
  if (n)
    throw new Error(c || "飞书授权未完成");
  const s = i ? Date.now() - i.createdAt : -1;
  if (!i || !Number.isFinite(i.createdAt) || !l || l !== i.state || s < 0 || s > Ne)
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
function Ee() {
  try {
    const e = window.sessionStorage.getItem(R);
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
function Ie() {
  return new URL(window.location.pathname, window.location.origin).toString();
}
function Ae(e) {
  for (const l of ["code", "state", "error", "error_description"])
    e.delete(l);
  const t = e.toString(), n = `${window.location.pathname}${t ? `?${t}` : ""}${window.location.hash}`;
  window.history.replaceState(window.history.state, "", n);
}
const T = se.Input, j = y.joinSiteApi, Te = y.loadMainInfo, W = y.request, Ce = y.resetFrontRuntimeCache, De = D.resolvePostLoginTarget, Fe = le.useAuthStore, Re = ce.useTheme;
function et() {
  const { config: e, loaded: t } = de(), n = Ue(
    e.site.appearance.loginBackgroundImage,
    t
  ), l = ie(), { auth: c } = Fe(), { resolvedTheme: i } = Re();
  ke(e.site.appearance, i);
  const [s, N] = m("login"), [U, J] = m(""), [P, X] = m(""), [B, v] = m(""), [M, g] = m(""), [L, $] = m(!1), [_, b] = m(
    null
  ), [k, K] = m(!1), [S, E] = m(!1), I = Q(!1), h = L || _ !== null, z = e.site.appearance.loginTemplate === "minimal", A = ee(
    async (r, d) => {
      if (!r?.token)
        throw new Error("登录返回缺少 token");
      Ce(), c.setUser(r.user), c.setAccessToken(r.token), f.success(
        d.successMessage || `欢迎回来，${r.user?.name || d.fallbackName}`
      ), await xe(l, d.redirectTo);
    },
    [c, l]
  );
  p(() => {
    t && ue(e.site);
  }, [t, e.site]), p(() => {
    e.site.registerEnabled || s !== "register" || (N("login"), v(""), g(""));
  }, [e.site.registerEnabled, s]), p(() => {
    if (!S)
      return;
    function r(d) {
      d.key === "Escape" && E(!1);
    }
    return window.addEventListener("keydown", r), () => window.removeEventListener("keydown", r);
  }, [S]), p(() => {
    if (I.current)
      return;
    let r;
    try {
      r = Le();
    } catch (a) {
      I.current = !0;
      const w = a instanceof Error && a.message ? a.message : "飞书登录失败，请重新尝试";
      g(w), f.error(w);
      return;
    }
    if (!r)
      return;
    const d = r;
    I.current = !0, b(d.accountID), g(""), (async () => {
      try {
        const a = await W(j("login/feishu"), "post", {
          account_id: d.accountID,
          code: d.code
        });
        if (!x(a) || !a.data?.token)
          throw new Error(a?.message || a?.msg || "飞书登录失败");
        await A(a.data, {
          fallbackName: "飞书用户",
          redirectTo: d.redirectTo
        });
      } catch (a) {
        const w = a instanceof Error && a.message ? a.message : "飞书登录失败，请稍后重试";
        g(w), f.error(w);
      } finally {
        b(null);
      }
    })();
  }, [A]);
  function V() {
    h || !e.site.registerEnabled && s === "login" || (N((r) => r === "login" ? "register" : "login"), g(""));
  }
  async function Y(r) {
    if (r.preventDefault(), h)
      return;
    if (s === "register" && !e.site.registerEnabled) {
      N("login"), v(""), g("当前站点已关闭注册");
      return;
    }
    const d = ze(s, U, P, B);
    if (d.error || !d.data) {
      g(d.error);
      return;
    }
    $(!0), g("");
    try {
      const a = await W(
        s === "login" ? "/user/auth/login" : j("login/register"),
        "post",
        d.data
      );
      if (!x(a) || !a.data?.token) {
        g(a?.message || a?.msg || "操作失败");
        return;
      }
      await A(a.data, {
        fallbackName: d.data.account,
        redirectTo: q(),
        successMessage: s === "register" ? "账号已创建" : void 0
      });
    } catch (a) {
      g(
        a instanceof Error && a.message ? a.message : "操作失败，请稍后重试"
      );
    } finally {
      $(!1);
    }
  }
  function Z(r) {
    if (!h) {
      if (r.provider !== "feishu") {
        f.info(`${r.name}暂未开放`);
        return;
      }
      g(""), b(r.id);
      try {
        ve(r, q());
      } catch (d) {
        const a = d instanceof Error && d.message ? d.message : "飞书登录发起失败";
        g(a), b(null), f.error(a);
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
        /* @__PURE__ */ o(pe, {}),
        z ? null : /* @__PURE__ */ o(
          Pe,
          {
            config: e,
            mobileLinksOpen: S,
            onCloseMobileLinks: () => E(!1),
            onToggleMobileLinks: () => E((r) => !r)
          }
        ),
        /* @__PURE__ */ o("div", { className: "bot-work-login-stage", children: /* @__PURE__ */ u("div", { className: "bot-work-login-layout", children: [
          e.site.loginImage ? /* @__PURE__ */ o(
            $e,
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
                  z && e.site.logo ? /* @__PURE__ */ o(
                    F,
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
                    _e,
                    {
                      accounts: e.accounts,
                      disabled: h,
                      loadingID: _,
                      onSelect: Z
                    }
                  ),
                  e.accounts.length > 0 ? /* @__PURE__ */ o("div", { className: "bot-work-login-divider", children: /* @__PURE__ */ o("span", { children: "或" }) }) : null,
                  /* @__PURE__ */ u("form", { className: "bot-work-login-form", onSubmit: Y, children: [
                    /* @__PURE__ */ o(C, { label: "手机号", children: /* @__PURE__ */ o(
                      T,
                      {
                        value: U,
                        autoComplete: "username",
                        placeholder: "输入手机号",
                        "aria-label": "手机号",
                        className: "bot-work-login-input",
                        onChange: (r) => J(r.target.value)
                      }
                    ) }),
                    s === "register" ? /* @__PURE__ */ o(C, { label: "昵称", children: /* @__PURE__ */ o(
                      T,
                      {
                        value: B,
                        autoComplete: "name",
                        placeholder: "输入昵称",
                        "aria-label": "昵称",
                        className: "bot-work-login-input",
                        onChange: (r) => v(r.target.value)
                      }
                    ) }) : null,
                    /* @__PURE__ */ o(C, { label: "密码", children: /* @__PURE__ */ u("span", { className: "bot-work-login-password", children: [
                      /* @__PURE__ */ o(
                        T,
                        {
                          value: P,
                          type: k ? "text" : "password",
                          autoComplete: s === "login" ? "current-password" : "new-password",
                          placeholder: "至少 6 位",
                          "aria-label": "密码",
                          className: "bot-work-login-input",
                          onChange: (r) => X(r.target.value)
                        }
                      ),
                      /* @__PURE__ */ o(
                        "button",
                        {
                          type: "button",
                          "aria-label": k ? "隐藏密码" : "显示密码",
                          title: k ? "隐藏密码" : "显示密码",
                          onClick: () => K((r) => !r),
                          children: k ? /* @__PURE__ */ o(te, { size: 17, strokeWidth: 1.8 }) : /* @__PURE__ */ o(oe, { size: 17, strokeWidth: 1.8 })
                        }
                      )
                    ] }) }),
                    M ? /* @__PURE__ */ o("div", { className: "bot-work-login-message", role: "alert", children: M }) : null,
                    /* @__PURE__ */ u(
                      "button",
                      {
                        type: "submit",
                        className: "bot-work-login-submit",
                        disabled: h,
                        children: [
                          L ? /* @__PURE__ */ o(G, { className: "bot-work-login-spin" }) : null,
                          /* @__PURE__ */ o("span", { children: L ? "处理中" : s === "login" ? "登录" : "注册" })
                        ]
                      }
                    )
                  ] }),
                  e.site.registerEnabled ? /* @__PURE__ */ u("p", { className: "bot-work-login-mode-switch", children: [
                    /* @__PURE__ */ o("span", { children: s === "login" ? "还没有账号？" : "已经有账号？" }),
                    /* @__PURE__ */ o("button", { type: "button", disabled: h, onClick: V, children: s === "login" ? "注册" : "登录" })
                  ] }) : null,
                  /* @__PURE__ */ o(Be, { config: e })
                ] })
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ o(Me, { filing: e.site.filing })
      ]
    }
  );
}
function Ue(e, t) {
  const [n, l] = m("");
  return p(() => {
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
function Pe({
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
        H,
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
          children: t ? /* @__PURE__ */ o(re, { size: 18 }) : /* @__PURE__ */ o(ne, { size: 18 })
        }
      ) }) : null
    ] }),
    t && e.links.length > 0 ? /* @__PURE__ */ o(
      H,
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
function Be({ config: e }) {
  const { termsOfService: t, privacyPolicy: n } = e.legalLinks;
  return !t && !n ? null : /* @__PURE__ */ u("p", { className: "bot-work-login-legal", children: [
    "继续即表示您同意 ",
    e.site.siteName,
    " 的",
    t ? /* @__PURE__ */ o(O, { link: t }) : null,
    t && n ? "和" : null,
    n ? /* @__PURE__ */ o(O, { link: n }) : null
  ] });
}
function Me({ filing: e }) {
  return he(e) ? /* @__PURE__ */ o("footer", { className: "bot-work-login-filing", "aria-label": "站点备案信息", children: /* @__PURE__ */ o(
    we,
    {
      filing: e,
      className: "bot-work-login-filing-rich",
      fallback: /* @__PURE__ */ o(
        fe,
        {
          filing: e,
          itemClassName: "bot-work-login-filing-item"
        }
      )
    }
  ) }) : null;
}
function $e({
  image: e,
  siteName: t
}) {
  const n = `${t} 登录页展示图`;
  return /* @__PURE__ */ o("section", { className: "bot-work-login-artwork", "aria-label": "创作灵感", children: /* @__PURE__ */ o(F, { src: e, alt: n, fallback: null }) });
}
function _e({
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
        n === c.id ? /* @__PURE__ */ o(G, { className: "bot-work-login-spin", size: 19 }) : /* @__PURE__ */ o(
          F,
          {
            src: c.icon,
            alt: "",
            fallback: /* @__PURE__ */ o(ae, { size: 19, strokeWidth: 1.9 })
          }
        ),
        /* @__PURE__ */ o("span", { children: c.name })
      ]
    },
    c.id
  )) });
}
function C({
  label: e,
  children: t
}) {
  return /* @__PURE__ */ u("label", { className: "bot-work-login-field", children: [
    /* @__PURE__ */ o("span", { className: "bot-work-login-field-label", children: e }),
    t
  ] });
}
function ze(e, t, n, l) {
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
function q() {
  return typeof window > "u" ? "" : new URLSearchParams(window.location.search).get("redirect") || "";
}
async function xe(e, t) {
  try {
    const n = await Te(), l = De({
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
  et as WorkLoginPage
};
