import { c as Y, j as o, a as u } from "./createLucideIcon-CEtb6KSk.js";
import { o as Z, e as Q, i as ee, u as m, a as te, d as oe, p as re, b as w, r as z, j as $, I as A, q as ne, s as ae } from "./runtime-entry-CIrzyMsA.js";
import { L as W } from "./loader-circle-QnfinZ3F.js";
import { E as ie } from "./eye-off-nE66yPeQ.js";
import { E as se } from "./eye-EJzwoxVH.js";
import { M as le, h as ce, B as de, a as ue } from "./body-filing-CasaiOm8.js";
import { X as ge } from "./x-D8YQA7_X.js";
import { t as p } from "./index-DqjOvQjw.js";
import { i as x } from "./api-response-C-VXY2RJ.js";
import { u as me, a as he, e as fe, h as pe } from "./site-config-BtBYhKpy.js";
import { B as we, d as C, a as be, b as H, c as j } from "./site-brand-CjG-wydo.js";
import { u as ke } from "./use-body-appearance-Br-DLopK.js";
const ye = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M9 21V9", key: "1oto5p" }]
], Ne = Y("panels-top-left", ye), Le = "https://open.feishu.cn/open-apis/authen/v1/authorize", D = "bot.body.feishu-auth", Ee = 600 * 1e3;
function Ie(e, t) {
  if (!e.configured || !e.appID.trim())
    throw new Error("飞书登录尚未配置，请联系管理员");
  const n = ve(), l = {
    state: n,
    accountID: e.id,
    redirectTo: t.trim(),
    createdAt: Date.now()
  };
  try {
    window.sessionStorage.setItem(
      D,
      JSON.stringify(l)
    );
  } catch {
    throw new Error("浏览器无法保存飞书授权状态，请检查隐私设置");
  }
  const c = new URLSearchParams({
    app_id: e.appID.trim(),
    redirect_uri: Te(),
    response_type: "code",
    state: n
  });
  window.location.assign(`${Le}?${c.toString()}`);
}
function Se() {
  if (typeof window > "u")
    return null;
  const e = new URLSearchParams(window.location.search), t = (e.get("code") || "").trim(), n = (e.get("error") || "").trim();
  if (!t && !n)
    return null;
  const l = (e.get("state") || "").trim(), c = (e.get("error_description") || "").trim(), i = Ae();
  Ce(e);
  try {
    window.sessionStorage.removeItem(D);
  } catch {
  }
  if (n)
    throw new Error(c || "飞书授权未完成");
  const s = i ? Date.now() - i.createdAt : -1;
  if (!i || !Number.isFinite(i.createdAt) || !l || l !== i.state || s < 0 || s > Ee)
    throw new Error("飞书授权状态已失效，请重新登录");
  if (!Number.isFinite(i.accountID) || i.accountID <= 0)
    throw new Error("飞书登录入口无效，请重新登录");
  return {
    code: t,
    accountID: i.accountID,
    redirectTo: i.redirectTo
  };
}
function ve() {
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
function Ae() {
  try {
    const e = window.sessionStorage.getItem(D);
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
function Te() {
  return new URL(window.location.pathname, window.location.origin).toString();
}
function Ce(e) {
  for (const l of ["code", "state", "error", "error_description"])
    e.delete(l);
  const t = e.toString(), n = `${window.location.pathname}${t ? `?${t}` : ""}${window.location.hash}`;
  window.history.replaceState(window.history.state, "", n);
}
function Ke() {
  const { config: e, loaded: t } = me(), n = De(
    e.site.appearance.loginBackgroundImage,
    t
  ), l = Z(), { auth: c } = Q(), { resolvedTheme: i } = ee();
  ke(e.site.appearance, i);
  const [s, y] = m("login"), [U, q] = m(""), [B, G] = m(""), [P, N] = m(""), [R, g] = m(""), [L, M] = m(!1), [F, b] = m(
    null
  ), [k, J] = m(!1), [E, I] = m(!1), S = te(!1), h = L || F !== null, _ = e.site.appearance.loginTemplate === "minimal", v = oe(
    async (r, d) => {
      if (!r?.token)
        throw new Error("登录返回缺少 token");
      re(), c.setUser(r.user), c.setAccessToken(r.token), p.success(
        d.successMessage || `欢迎回来，${r.user?.name || d.fallbackName}`
      ), await _e(l, d.redirectTo);
    },
    [c, l]
  );
  w(() => {
    t && he(e.site);
  }, [t, e.site]), w(() => {
    e.site.registerEnabled || s !== "register" || (y("login"), N(""), g(""));
  }, [e.site.registerEnabled, s]), w(() => {
    if (!E)
      return;
    function r(d) {
      d.key === "Escape" && I(!1);
    }
    return window.addEventListener("keydown", r), () => window.removeEventListener("keydown", r);
  }, [E]), w(() => {
    if (S.current)
      return;
    let r;
    try {
      r = Se();
    } catch (a) {
      S.current = !0;
      const f = a instanceof Error && a.message ? a.message : "飞书登录失败，请重新尝试";
      g(f), p.error(f);
      return;
    }
    if (!r)
      return;
    const d = r;
    S.current = !0, b(d.accountID), g(""), (async () => {
      try {
        const a = await z($("login/feishu"), "post", {
          account_id: d.accountID,
          code: d.code
        });
        if (!x(a) || !a.data?.token)
          throw new Error(a?.message || a?.msg || "飞书登录失败");
        await v(a.data, {
          fallbackName: "飞书用户",
          redirectTo: d.redirectTo
        });
      } catch (a) {
        const f = a instanceof Error && a.message ? a.message : "飞书登录失败，请稍后重试";
        g(f), p.error(f);
      } finally {
        b(null);
      }
    })();
  }, [v]);
  function V() {
    h || !e.site.registerEnabled && s === "login" || (y((r) => r === "login" ? "register" : "login"), g(""));
  }
  async function X(r) {
    if (r.preventDefault(), h)
      return;
    if (s === "register" && !e.site.registerEnabled) {
      y("login"), N(""), g("当前站点已关闭注册");
      return;
    }
    const d = Fe(s, U, B, P);
    if (d.error || !d.data) {
      g(d.error);
      return;
    }
    M(!0), g("");
    try {
      const a = await z(
        s === "login" ? "/user/auth/login" : $("login/register"),
        "post",
        d.data
      );
      if (!x(a) || !a.data?.token) {
        g(a?.message || a?.msg || "操作失败");
        return;
      }
      await v(a.data, {
        fallbackName: d.data.account,
        redirectTo: O(),
        successMessage: s === "register" ? "账号已创建" : void 0
      });
    } catch (a) {
      g(
        a instanceof Error && a.message ? a.message : "操作失败，请稍后重试"
      );
    } finally {
      M(!1);
    }
  }
  function K(r) {
    if (!h) {
      if (r.provider !== "feishu") {
        p.info(`${r.name}暂未开放`);
        return;
      }
      g(""), b(r.id);
      try {
        Ie(r, O());
      } catch (d) {
        const a = d instanceof Error && d.message ? d.message : "飞书登录发起失败";
        g(a), b(null), p.error(a);
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
      "data-page-background": pe(e.site.appearance, "login") ? "custom" : void 0,
      style: fe(e.site.appearance, "login"),
      children: [
        /* @__PURE__ */ o(we, {}),
        _ ? null : /* @__PURE__ */ o(
          Ue,
          {
            config: e,
            mobileLinksOpen: E,
            onCloseMobileLinks: () => I(!1),
            onToggleMobileLinks: () => I((r) => !r)
          }
        ),
        /* @__PURE__ */ o("div", { className: "bot-work-login-stage", children: /* @__PURE__ */ u("div", { className: "bot-work-login-layout", children: [
          e.site.loginImage ? /* @__PURE__ */ o(
            Re,
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
                  _ && e.site.logo ? /* @__PURE__ */ o(
                    C,
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
                    Me,
                    {
                      accounts: e.accounts,
                      disabled: h,
                      loadingID: F,
                      onSelect: K
                    }
                  ),
                  e.accounts.length > 0 ? /* @__PURE__ */ o("div", { className: "bot-work-login-divider", children: /* @__PURE__ */ o("span", { children: "或" }) }) : null,
                  /* @__PURE__ */ u("form", { className: "bot-work-login-form", onSubmit: X, children: [
                    /* @__PURE__ */ o(T, { label: "手机号", children: /* @__PURE__ */ o(
                      A,
                      {
                        value: U,
                        autoComplete: "username",
                        placeholder: "输入手机号",
                        "aria-label": "手机号",
                        className: "bot-work-login-input",
                        onChange: (r) => q(r.target.value)
                      }
                    ) }),
                    s === "register" ? /* @__PURE__ */ o(T, { label: "昵称", children: /* @__PURE__ */ o(
                      A,
                      {
                        value: P,
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
                          type: k ? "text" : "password",
                          autoComplete: s === "login" ? "current-password" : "new-password",
                          placeholder: "至少 6 位",
                          "aria-label": "密码",
                          className: "bot-work-login-input",
                          onChange: (r) => G(r.target.value)
                        }
                      ),
                      /* @__PURE__ */ o(
                        "button",
                        {
                          type: "button",
                          "aria-label": k ? "隐藏密码" : "显示密码",
                          title: k ? "隐藏密码" : "显示密码",
                          onClick: () => J((r) => !r),
                          children: k ? /* @__PURE__ */ o(ie, { size: 17, strokeWidth: 1.8 }) : /* @__PURE__ */ o(se, { size: 17, strokeWidth: 1.8 })
                        }
                      )
                    ] }) }),
                    R ? /* @__PURE__ */ o("div", { className: "bot-work-login-message", role: "alert", children: R }) : null,
                    /* @__PURE__ */ u(
                      "button",
                      {
                        type: "submit",
                        className: "bot-work-login-submit",
                        disabled: h,
                        children: [
                          L ? /* @__PURE__ */ o(W, { className: "bot-work-login-spin" }) : null,
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
        /* @__PURE__ */ o(Pe, { filing: e.site.filing })
      ]
    }
  );
}
function De(e, t) {
  const [n, l] = m("");
  return w(() => {
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
function Ue({
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
          children: t ? /* @__PURE__ */ o(ge, { size: 18 }) : /* @__PURE__ */ o(le, { size: 18 })
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
    t ? /* @__PURE__ */ o(j, { link: t }) : null,
    t && n ? "和" : null,
    n ? /* @__PURE__ */ o(j, { link: n }) : null
  ] });
}
function Pe({ filing: e }) {
  return ce(e) ? /* @__PURE__ */ o("footer", { className: "bot-work-login-filing", "aria-label": "站点备案信息", children: /* @__PURE__ */ o(
    de,
    {
      filing: e,
      className: "bot-work-login-filing-rich",
      fallback: /* @__PURE__ */ o(
        ue,
        {
          filing: e,
          itemClassName: "bot-work-login-filing-item"
        }
      )
    }
  ) }) : null;
}
function Re({
  image: e,
  siteName: t
}) {
  const n = `${t} 登录页展示图`;
  return /* @__PURE__ */ o("section", { className: "bot-work-login-artwork", "aria-label": "创作灵感", children: /* @__PURE__ */ o(C, { src: e, alt: n, fallback: null }) });
}
function Me({
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
        n === c.id ? /* @__PURE__ */ o(W, { className: "bot-work-login-spin", size: 19 }) : /* @__PURE__ */ o(
          C,
          {
            src: c.icon,
            alt: "",
            fallback: /* @__PURE__ */ o(Ne, { size: 19, strokeWidth: 1.9 })
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
function Fe(e, t, n, l) {
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
function O() {
  return typeof window > "u" ? "" : new URLSearchParams(window.location.search).get("redirect") || "";
}
async function _e(e, t) {
  try {
    const n = await ne(), l = ae({
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
  Ke as WorkLoginPage
};
