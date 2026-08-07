import { b as $, c as F, P as z, r as H, n as j } from "./runtime-entry-ClkZDmNs.js";
const a = window.ReactDOM || {}, Sn = a.createPortal, In = a.flushSync;
a.preconnect;
a.prefetchDNS;
a.preinit;
a.preinitModule;
a.preload;
a.preloadModule;
a.requestFormReset;
a.unstable_batchedUpdates;
a.useFormState;
a.useFormStatus;
a.version;
function A(n) {
  const e = n;
  return e?.code === 0 || e?.status === 1;
}
function q(n) {
  return !!n && typeof n == "object" && !Array.isArray(n);
}
function f(n) {
  return q(n) ? n : {};
}
function B(n) {
  return Array.isArray(n) ? n : [];
}
function h(n, e = 0) {
  const r = Number(n || 0);
  return Number.isFinite(r) && r > 0 ? r : e;
}
function xn(n, e = 0) {
  const r = Number(n || 0);
  return Number.isFinite(r) && r >= 0 ? r : e;
}
function i(n) {
  return n == null ? "" : String(n).trim();
}
function Tn(n, e) {
  return f(G(n, e));
}
function G(n, e) {
  const r = f(n);
  if (!A(r))
    throw new Error(i(r.message || r.msg) || e);
  return r.data;
}
function Nn(n, e) {
  return n instanceof Error && n.message ? n.message : e;
}
const R = {
  baseColor: "#96a29c",
  brandPrimaryColor: "",
  loginTemplate: "minimal",
  loginTextColor: "",
  loginBackgroundColor: "",
  loginBackgroundImage: "",
  workbenchTemplate: "rail",
  workbenchBackgroundColor: "",
  workbenchBackgroundImage: ""
}, W = /* @__PURE__ */ new Set([
  "minimal",
  "split",
  "focus",
  "showcase"
]), V = /* @__PURE__ */ new Set([
  "rail",
  "sidebar",
  "topbar"
]), J = /^#[0-9a-f]{6}$/i, Y = 0.82, K = 0.82, Q = 0.55, X = 0.82, Z = 0.06;
function nn(n, e = R) {
  return {
    baseColor: g(
      n.baseColor,
      e.baseColor
    ),
    brandPrimaryColor: g(
      n.brandPrimaryColor,
      e.brandPrimaryColor
    ),
    loginTemplate: x(
      n.loginTemplate,
      W,
      e.loginTemplate
    ),
    loginTextColor: g(
      n.loginTextColor,
      e.loginTextColor
    ),
    loginBackgroundColor: g(
      n.loginBackgroundColor,
      e.loginBackgroundColor
    ),
    loginBackgroundImage: I(n.loginBackgroundImage) || e.loginBackgroundImage,
    workbenchTemplate: x(
      n.workbenchTemplate,
      V,
      e.workbenchTemplate
    ),
    workbenchBackgroundColor: g(
      n.workbenchBackgroundColor,
      e.workbenchBackgroundColor
    ),
    workbenchBackgroundImage: I(n.workbenchBackgroundImage) || e.workbenchBackgroundImage
  };
}
function Pn(n, e) {
  const r = e !== "dark", o = p(n.baseColor) || R.baseColor, t = p(n.brandPrimaryColor), u = en(o, r);
  if (!t)
    return u;
  const l = r ? t : c(t, "#ffffff", 0.32), d = r ? c(t, "#000000", 0.2) : c(t, "#ffffff", 0.18), k = c(
    t,
    "#ffffff",
    r ? 0.14 : 0.44
  ), w = c(
    t,
    r ? "#ffffff" : "#111513",
    r ? 0.88 : 0.76
  );
  return {
    ...u,
    "--body-work-primary": l,
    "--body-work-primary-strong": d,
    "--body-work-primary-bright": k,
    "--body-work-primary-soft": w,
    "--body-work-on-primary": on(l, d),
    "--body-work-ring": v(l, 0.2)
  };
}
function en(n, e) {
  const r = tn(n) < Y ? c(n, "#ffffff", K) : n, o = e ? r : c(n, "#111513", 0.95), t = e ? c(o, "#111513", 0.96) : c(n, "#f2f5f3", 0.9), u = e ? c(o, "#ffffff", Q) : c(n, "#171c19", 0.94), l = e ? c(o, "#ffffff", X) : c(u, t, Z), d = e ? c(o, t, 0.035) : c(n, "#0c0f0e", 0.96), k = c(t, d, e ? 0.4 : 0.42), w = c(o, t, e ? 0.12 : 0.08), M = c(o, t, e ? 0.09 : 0.06);
  return {
    "--body-work-bg": d,
    "--body-work-canvas": o,
    "--body-work-surface": u,
    "--body-work-surface-raised": l,
    "--body-work-text": t,
    "--body-work-muted": k,
    "--body-work-line": w,
    "--body-work-active": M,
    "--body-work-shadow": e ? `0 14px 34px ${v(t, 0.08)}` : "0 18px 42px rgba(0, 0, 0, 0.28)"
  };
}
function An(n, e) {
  const { color: r, image: o } = E(n, e), t = e === "login" ? p(n.loginTextColor) || (o ? "#ffffff" : "") : "";
  return {
    ...r ? { backgroundColor: r } : {},
    ...o ? { backgroundImage: `url(${JSON.stringify(o)})` } : {},
    ...t ? { "--login-copy-color": t } : {}
  };
}
function En(n, e) {
  const { color: r, image: o } = E(n, e);
  return !!(r || o);
}
function p(n) {
  const e = String(n || "").trim().toLowerCase();
  return J.test(e) ? e : "";
}
function g(n, e) {
  return p(n) || p(e);
}
function I(n) {
  return String(n || "").trim();
}
function E(n, e) {
  return e === "login" ? {
    color: n.loginBackgroundColor,
    image: n.loginBackgroundImage
  } : {
    color: n.workbenchBackgroundColor,
    image: n.workbenchBackgroundImage
  };
}
function x(n, e, r) {
  const o = String(n || "").trim();
  return e.has(o) ? o : r;
}
function c(n, e, r) {
  const o = b(n), t = b(e), u = (l) => Math.round(
    o[l] + (t[l] - o[l]) * r
  );
  return cn(u("red"), u("green"), u("blue"));
}
function on(...n) {
  return ["#111513", "#ffffff"].reduce(
    (r, o) => T(n, o) > T(n, r) ? o : r
  );
}
function T(n, e) {
  return Math.min(
    ...n.map((r) => rn(r, e))
  );
}
function rn(n, e) {
  const r = N(n), o = N(e);
  return (Math.max(r, o) + 0.05) / (Math.min(r, o) + 0.05);
}
function N(n) {
  const { red: e, green: r, blue: o } = b(n);
  return 0.2126 * C(e) + 0.7152 * C(r) + 0.0722 * C(o);
}
function tn(n) {
  const { red: e, green: r, blue: o } = b(n);
  return (Math.max(e, r, o) + Math.min(e, r, o)) / 510;
}
function C(n) {
  const e = n / 255;
  return e <= 0.04045 ? e / 12.92 : Math.pow((e + 0.055) / 1.055, 2.4);
}
function v(n, e) {
  const { red: r, green: o, blue: t } = b(n);
  return `rgba(${r}, ${o}, ${t}, ${e})`;
}
function b(n) {
  return {
    red: Number.parseInt(n.slice(1, 3), 16),
    green: Number.parseInt(n.slice(3, 5), 16),
    blue: Number.parseInt(n.slice(5, 7), 16)
  };
}
function cn(n, e, r) {
  return `#${[n, e, r].map((o) => o.toString(16).padStart(2, "0")).join("")}`;
}
function an(n) {
  return typeof window > "u" ? "" : U(
    n,
    ["http:", "https:", "mailto:"],
    window.location.origin
  );
}
function _(n) {
  return U(n, ["http:", "https:"]);
}
function U(n, e, r) {
  const o = n == null ? "" : String(n).trim();
  if (!o)
    return "";
  try {
    const t = r ? new URL(o, r) : new URL(o);
    return e.includes(t.protocol) ? t.href : "";
  } catch {
    return "";
  }
}
function sn(n) {
  const e = f(n), r = i(e.type) === "article" ? "article" : "url";
  return {
    id: h(e.id),
    code: i(e.code).toLowerCase(),
    name: i(e.name),
    type: r,
    articleID: r === "article" ? h(e.article_id) : 0,
    url: r === "url" ? an(e.url) : "",
    target: i(e.target) === "_self" ? "_self" : "_blank",
    scenes: B(e.scenes).map(dn).filter((o) => !!o)
  };
}
function un(n) {
  return !!(n.id && n.name && (n.type === "article" ? n.articleID : n.url));
}
function vn(n) {
  return n.type === "article" ? ln(n.articleID) : n.url;
}
function Un(n) {
  return n.type === "article" && n.target === "_self";
}
function ln(n) {
  const e = h(n);
  return e ? `${D("content")}?id=${encodeURIComponent(String(e))}` : "";
}
function Dn() {
  return D("work");
}
function D(n) {
  return `${String(fn()?.basePath || "").trim().replace(/\/+$/, "")}/bot/${n.replace(/^\/+/, "")}`;
}
function fn() {
  if (!(typeof window > "u"))
    return window.appRuntime;
}
function dn(n) {
  const e = i(n).toLowerCase();
  return e === "navigation" || e === "workbench_content" ? e : null;
}
const gn = "把想法变成作品", mn = "调用团队能力，与智能体协作，把每一次创作沉淀为可复用的项目资产。", O = [
  ["works", "创作", "file-stack"],
  ["dialogue", "对话", "messages-square"],
  ["function", "工具", "zap"],
  ["assets", "资产", "archive"],
  ["points", "积分", "sparkles"],
  ["messages", "消息", "bell"],
  ["content", "内容", "book-open-text"]
];
let y = null, m = null;
function On() {
  return pn().config;
}
function pn() {
  const [n, e] = $(() => ({
    config: y || L(),
    loaded: !1
  }));
  return F(() => {
    let r = !0;
    return bn().then((o) => {
      r && e({ config: o, loaded: !0 });
    }), () => {
      r = !1;
    };
  }, []), n;
}
function bn() {
  return m || (m = H(j("login/config"), "get").then((n) => {
    if (!A(n))
      throw new Error(String(n?.message || n?.msg || "读取登录配置失败"));
    return y = yn(n?.data), y;
  }).catch(() => y || L()).finally(() => {
    m = null;
  }), m);
}
function Mn(n) {
  if (typeof document > "u" || (n.siteName && (document.title = n.siteName), !n.favicon))
    return;
  let e = document.querySelector("link[rel~='icon']");
  e || (e = document.createElement("link"), e.rel = "icon", document.head.appendChild(e)), e.href = n.favicon;
}
function yn(n) {
  const e = L(), r = f(n), o = f(r.config), t = B(r.links).map(sn).filter(un);
  return {
    site: {
      siteName: i(o.site_name) || e.site.siteName,
      logo: s(o.logo) || e.site.logo,
      favicon: s(o.favicon) || e.site.favicon,
      loginImage: s(o.login_image) || e.site.loginImage,
      loginTitle: i(o.login_title) || e.site.loginTitle,
      loginDescription: Object.prototype.hasOwnProperty.call(
        o,
        "login_description"
      ) ? i(o.login_description) : e.site.loginDescription,
      registerEnabled: o.register_enabled == null ? e.site.registerEnabled : S(o.register_enabled),
      appearance: nn(
        {
          baseColor: o.base_color,
          brandPrimaryColor: o.brand_primary_color,
          loginTemplate: o.login_template,
          loginTextColor: o.login_text_color,
          loginBackgroundColor: o.login_background_color,
          loginBackgroundImage: s(o.login_background_image),
          workbenchTemplate: o.workbench_template,
          workbenchBackgroundColor: o.workbench_background_color,
          workbenchBackgroundImage: s(
            o.workbench_background_image
          )
        },
        e.site.appearance
      ),
      homeMenu: hn(o.home_menu, e.site.homeMenu),
      filing: {
        content: i(o.filing_content),
        contentConfigured: Object.prototype.hasOwnProperty.call(
          o,
          "filing_content"
        ),
        companyName: i(o.company_name),
        companyAddress: i(o.company_address),
        businessLicenseURL: _(o.business_license_url),
        icpRecord: i(o.icp_record),
        icpRecordURL: _(o.icp_record_url),
        publicSecurityRecord: i(o.public_security_record),
        publicSecurityRecordURL: _(
          o.public_security_record_url
        )
      }
    },
    links: t.filter(wn),
    legalLinks: {
      termsOfService: P(
        t,
        "terms_of_service"
      ),
      privacyPolicy: P(
        t,
        "privacy_policy"
      )
    },
    accounts: B(r.accounts).map(Cn).filter(_n)
  };
}
function L() {
  const n = z?.() || {};
  return {
    site: {
      siteName: i(n.name) || "神创工作台",
      logo: s(n.logo),
      favicon: s(n.favicon),
      loginImage: "",
      loginTitle: gn,
      loginDescription: mn,
      registerEnabled: !0,
      appearance: R,
      homeMenu: kn(),
      filing: Bn()
    },
    links: [],
    legalLinks: {
      termsOfService: null,
      privacyPolicy: null
    },
    accounts: [
      {
        id: 1,
        provider: "feishu",
        name: "使用飞书账户继续",
        icon: "",
        appID: "",
        configured: !1
      }
    ]
  };
}
function hn(n, e) {
  const r = f(n);
  return Object.fromEntries(
    O.map(([o]) => {
      const t = f(r[o]);
      return [
        o,
        {
          name: i(t.name) || e[o].name,
          icon: i(t.icon) || e[o].icon,
          iconImage: s(t.icon_image),
          enabled: t.enabled == null ? e[o].enabled : S(t.enabled),
          sort: Rn(t.sort, e[o].sort)
        }
      ];
    })
  );
}
function kn() {
  return Object.fromEntries(
    O.map(([n, e, r], o) => [
      n,
      { name: e, icon: r, iconImage: "", enabled: !0, sort: (o + 1) * 10 }
    ])
  );
}
function wn(n) {
  return n.scenes.includes("navigation") ? !0 : !n.code && n.scenes.length === 0;
}
function P(n, e) {
  return n.find((r) => r.code === e) || null;
}
function Cn(n) {
  const e = f(n);
  return {
    id: h(e.id),
    provider: i(e.provider).toLowerCase(),
    name: i(e.name),
    icon: s(e.icon),
    appID: i(e.app_id || e.appId),
    configured: S(e.configured)
  };
}
function _n(n) {
  return !!(n.id && n.provider && n.name);
}
function Bn() {
  return {
    content: "",
    contentConfigured: !1,
    companyName: "",
    companyAddress: "",
    businessLicenseURL: "",
    icpRecord: "",
    icpRecordURL: "",
    publicSecurityRecord: "",
    publicSecurityRecordURL: ""
  };
}
function s(n) {
  if (Array.isArray(n))
    return s(n[0]);
  if (n && typeof n == "object") {
    const r = n;
    return i(r.url || r.src || r.path || r.open_url);
  }
  const e = i(n);
  if (!e || !e.startsWith("[") && !e.startsWith("{"))
    return e;
  try {
    return s(JSON.parse(e));
  } catch {
    return e;
  }
}
function Rn(n, e) {
  const r = Number(n);
  return Number.isFinite(r) ? r : e;
}
function S(n) {
  return typeof n == "boolean" ? n : ["1", "true", "yes", "on"].includes(
    i(n).toLowerCase()
  );
}
export {
  a as R,
  Mn as a,
  Dn as b,
  Sn as c,
  B as d,
  f as e,
  h as f,
  vn as g,
  Pn as h,
  un as i,
  q as j,
  Nn as k,
  On as l,
  A as m,
  sn as n,
  An as o,
  En as p,
  xn as q,
  i as r,
  Tn as s,
  Un as t,
  pn as u,
  G as v,
  In as w
};
