import { a as j, b as F } from "./_commonjsHelpers-61wyk6v6.js";
function E(n) {
  const e = n;
  return e?.code === 0 || e?.status === 1;
}
function z(n) {
  return !!n && typeof n == "object" && !Array.isArray(n);
}
function l(n) {
  return z(n) ? n : {};
}
function B(n) {
  return Array.isArray(n) ? n : [];
}
function y(n, e = 0) {
  const r = Number(n || 0);
  return Number.isFinite(r) && r > 0 ? r : e;
}
function In(n, e = 0) {
  const r = Number(n || 0);
  return Number.isFinite(r) && r >= 0 ? r : e;
}
function i(n) {
  return n == null ? "" : String(n).trim();
}
function xn(n, e) {
  return l(H(n, e));
}
function H(n, e) {
  const r = l(n);
  if (!E(r))
    throw new Error(i(r.message || r.msg) || e);
  return r.data;
}
function Tn(n, e) {
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
}, q = /* @__PURE__ */ new Set([
  "minimal",
  "split",
  "focus",
  "showcase"
]), G = /* @__PURE__ */ new Set([
  "rail",
  "sidebar",
  "topbar"
]), W = /^#[0-9a-f]{6}$/i, V = 0.82, J = 0.82, Y = 0.55, K = 0.82, Q = 0.06;
function X(n, e = R) {
  return {
    baseColor: g(
      n.baseColor,
      e.baseColor
    ),
    brandPrimaryColor: g(
      n.brandPrimaryColor,
      e.brandPrimaryColor
    ),
    loginTemplate: T(
      n.loginTemplate,
      q,
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
    loginBackgroundImage: x(n.loginBackgroundImage) || e.loginBackgroundImage,
    workbenchTemplate: T(
      n.workbenchTemplate,
      G,
      e.workbenchTemplate
    ),
    workbenchBackgroundColor: g(
      n.workbenchBackgroundColor,
      e.workbenchBackgroundColor
    ),
    workbenchBackgroundImage: x(n.workbenchBackgroundImage) || e.workbenchBackgroundImage
  };
}
function Nn(n, e) {
  const r = e !== "dark", o = m(n.baseColor) || R.baseColor, t = m(n.brandPrimaryColor), s = Z(o, r);
  if (!t)
    return s;
  const u = r ? t : c(t, "#ffffff", 0.32), f = r ? c(t, "#000000", 0.2) : c(t, "#ffffff", 0.18), h = c(
    t,
    "#ffffff",
    r ? 0.14 : 0.44
  ), k = c(
    t,
    r ? "#ffffff" : "#111513",
    r ? 0.88 : 0.76
  );
  return {
    ...s,
    "--body-work-primary": u,
    "--body-work-primary-strong": f,
    "--body-work-primary-bright": h,
    "--body-work-primary-soft": k,
    "--body-work-on-primary": nn(u, f),
    "--body-work-ring": D(u, 0.2)
  };
}
function Z(n, e) {
  const r = on(n) < V ? c(n, "#ffffff", J) : n, o = e ? r : c(n, "#111513", 0.95), t = e ? c(o, "#111513", 0.96) : c(n, "#f2f5f3", 0.9), s = e ? c(o, "#ffffff", Y) : c(n, "#171c19", 0.94), u = e ? c(o, "#ffffff", K) : c(s, t, Q), f = e ? c(o, t, 0.035) : c(n, "#0c0f0e", 0.96), h = c(t, f, e ? 0.4 : 0.42), k = c(o, t, e ? 0.12 : 0.08), $ = c(o, t, e ? 0.09 : 0.06);
  return {
    "--body-work-bg": f,
    "--body-work-canvas": o,
    "--body-work-surface": s,
    "--body-work-surface-raised": u,
    "--body-work-text": t,
    "--body-work-muted": h,
    "--body-work-line": k,
    "--body-work-active": $,
    "--body-work-shadow": e ? `0 14px 34px ${D(t, 0.08)}` : "0 18px 42px rgba(0, 0, 0, 0.28)"
  };
}
function vn(n, e) {
  const { color: r, image: o } = P(n, e), t = e === "login" ? m(n.loginTextColor) || (o ? "#ffffff" : "") : "";
  return {
    ...r ? { backgroundColor: r } : {},
    ...o ? { backgroundImage: `url(${JSON.stringify(o)})` } : {},
    ...t ? { "--login-copy-color": t } : {}
  };
}
function An(n, e) {
  const { color: r, image: o } = P(n, e);
  return !!(r || o);
}
function m(n) {
  const e = String(n || "").trim().toLowerCase();
  return W.test(e) ? e : "";
}
function g(n, e) {
  return m(n) || m(e);
}
function x(n) {
  return String(n || "").trim();
}
function P(n, e) {
  return e === "login" ? {
    color: n.loginBackgroundColor,
    image: n.loginBackgroundImage
  } : {
    color: n.workbenchBackgroundColor,
    image: n.workbenchBackgroundImage
  };
}
function T(n, e, r) {
  const o = String(n || "").trim();
  return e.has(o) ? o : r;
}
function c(n, e, r) {
  const o = p(n), t = p(e), s = (u) => Math.round(
    o[u] + (t[u] - o[u]) * r
  );
  return rn(s("red"), s("green"), s("blue"));
}
function nn(...n) {
  return ["#111513", "#ffffff"].reduce(
    (r, o) => N(n, o) > N(n, r) ? o : r
  );
}
function N(n, e) {
  return Math.min(
    ...n.map((r) => en(r, e))
  );
}
function en(n, e) {
  const r = v(n), o = v(e);
  return (Math.max(r, o) + 0.05) / (Math.min(r, o) + 0.05);
}
function v(n) {
  const { red: e, green: r, blue: o } = p(n);
  return 0.2126 * C(e) + 0.7152 * C(r) + 0.0722 * C(o);
}
function on(n) {
  const { red: e, green: r, blue: o } = p(n);
  return (Math.max(e, r, o) + Math.min(e, r, o)) / 510;
}
function C(n) {
  const e = n / 255;
  return e <= 0.04045 ? e / 12.92 : Math.pow((e + 0.055) / 1.055, 2.4);
}
function D(n, e) {
  const { red: r, green: o, blue: t } = p(n);
  return `rgba(${r}, ${o}, ${t}, ${e})`;
}
function p(n) {
  return {
    red: Number.parseInt(n.slice(1, 3), 16),
    green: Number.parseInt(n.slice(3, 5), 16),
    blue: Number.parseInt(n.slice(5, 7), 16)
  };
}
function rn(n, e, r) {
  return `#${[n, e, r].map((o) => o.toString(16).padStart(2, "0")).join("")}`;
}
function tn(n) {
  return typeof window > "u" ? "" : O(
    n,
    ["http:", "https:", "mailto:"],
    window.location.origin
  );
}
function _(n) {
  return O(n, ["http:", "https:"]);
}
function O(n, e, r) {
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
function cn(n) {
  const e = l(n), r = i(e.type) === "article" ? "article" : "url";
  return {
    id: y(e.id),
    code: i(e.code).toLowerCase(),
    name: i(e.name),
    type: r,
    articleID: r === "article" ? y(e.article_id) : 0,
    url: r === "url" ? tn(e.url) : "",
    target: i(e.target) === "_self" ? "_self" : "_blank",
    scenes: B(e.scenes).map(ln).filter((o) => !!o)
  };
}
function an(n) {
  return !!(n.id && n.name && (n.type === "article" ? n.articleID : n.url));
}
function En(n) {
  return n.type === "article" ? sn(n.articleID) : n.url;
}
function Pn(n) {
  return n.type === "article" && n.target === "_self";
}
function sn(n) {
  const e = y(n);
  return e ? `${U("content")}?id=${encodeURIComponent(String(e))}` : "";
}
function Dn() {
  return U("work");
}
function U(n) {
  return `${String(un()?.basePath || "").trim().replace(/\/+$/, "")}/bot/${n.replace(/^\/+/, "")}`;
}
function un() {
  if (!(typeof window > "u"))
    return window.appRuntime;
}
function ln(n) {
  const e = i(n).toLowerCase();
  return e === "navigation" || e === "workbench_content" ? e : null;
}
await window.DeverFront?.ensureCompat?.(["@/config/app-config", "@/lib/request"]);
const L = window.DeverFront?.sdk?.getCompatModule("@/config/app-config");
if (!L || Object.keys(L).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/config/app-config");
const fn = L.getSiteConfig, w = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!w || Object.keys(w).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const gn = w.joinSiteApi, dn = w.request, mn = "把想法变成作品", pn = "调用团队能力，与智能体协作，把每一次创作沉淀为可复用的项目资产。", M = [
  ["works", "创作", "file-stack"],
  ["dialogue", "对话", "messages-square"],
  ["function", "工具", "zap"],
  ["assets", "资产", "archive"],
  ["points", "积分", "sparkles"],
  ["messages", "消息", "bell"],
  ["content", "内容", "book-open-text"]
];
let b = null, d = null;
function On() {
  return bn().config;
}
function bn() {
  const [n, e] = j(() => ({
    config: b || S(),
    loaded: !1
  }));
  return F(() => {
    let r = !0;
    return yn().then((o) => {
      r && e({ config: o, loaded: !0 });
    }), () => {
      r = !1;
    };
  }, []), n;
}
function yn() {
  return d || (d = dn(gn("login/config"), "get").then((n) => {
    if (!E(n))
      throw new Error(String(n?.message || n?.msg || "读取登录配置失败"));
    return b = wn(n?.data), b;
  }).catch(() => b || S()).finally(() => {
    d = null;
  }), d);
}
function Un(n) {
  if (typeof document > "u" || (n.siteName && (document.title = n.siteName), !n.favicon))
    return;
  let e = document.querySelector("link[rel~='icon']");
  e || (e = document.createElement("link"), e.rel = "icon", document.head.appendChild(e)), e.href = n.favicon;
}
function wn(n) {
  const e = S(), r = l(n), o = l(r.config), t = B(r.links).map(cn).filter(an);
  return {
    site: {
      siteName: i(o.site_name) || e.site.siteName,
      logo: a(o.logo) || e.site.logo,
      favicon: a(o.favicon) || e.site.favicon,
      loginImage: a(o.login_image) || e.site.loginImage,
      loginTitle: i(o.login_title) || e.site.loginTitle,
      loginDescription: Object.prototype.hasOwnProperty.call(
        o,
        "login_description"
      ) ? i(o.login_description) : e.site.loginDescription,
      registerEnabled: o.register_enabled == null ? e.site.registerEnabled : I(o.register_enabled),
      appearance: X(
        {
          baseColor: o.base_color,
          brandPrimaryColor: o.brand_primary_color,
          loginTemplate: o.login_template,
          loginTextColor: o.login_text_color,
          loginBackgroundColor: o.login_background_color,
          loginBackgroundImage: a(o.login_background_image),
          workbenchTemplate: o.workbench_template,
          workbenchBackgroundColor: o.workbench_background_color,
          workbenchBackgroundImage: a(
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
    links: t.filter(Cn),
    legalLinks: {
      termsOfService: A(
        t,
        "terms_of_service"
      ),
      privacyPolicy: A(
        t,
        "privacy_policy"
      )
    },
    accounts: B(r.accounts).map(_n).filter(Bn)
  };
}
function S() {
  const n = fn?.() || {};
  return {
    site: {
      siteName: i(n.name) || "神创工作台",
      logo: a(n.logo),
      favicon: a(n.favicon),
      loginImage: "",
      loginTitle: mn,
      loginDescription: pn,
      registerEnabled: !0,
      appearance: R,
      homeMenu: kn(),
      filing: Ln()
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
  const r = l(n);
  return Object.fromEntries(
    M.map(([o]) => {
      const t = l(r[o]);
      return [
        o,
        {
          name: i(t.name) || e[o].name,
          icon: i(t.icon) || e[o].icon,
          iconImage: a(t.icon_image),
          enabled: t.enabled == null ? e[o].enabled : I(t.enabled),
          sort: Rn(t.sort, e[o].sort)
        }
      ];
    })
  );
}
function kn() {
  return Object.fromEntries(
    M.map(([n, e, r], o) => [
      n,
      { name: e, icon: r, iconImage: "", enabled: !0, sort: (o + 1) * 10 }
    ])
  );
}
function Cn(n) {
  return n.scenes.includes("navigation") ? !0 : !n.code && n.scenes.length === 0;
}
function A(n, e) {
  return n.find((r) => r.code === e) || null;
}
function _n(n) {
  const e = l(n);
  return {
    id: y(e.id),
    provider: i(e.provider).toLowerCase(),
    name: i(e.name),
    icon: a(e.icon),
    appID: i(e.app_id || e.appId),
    configured: I(e.configured)
  };
}
function Bn(n) {
  return !!(n.id && n.provider && n.name);
}
function Ln() {
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
function a(n) {
  if (Array.isArray(n))
    return a(n[0]);
  if (n && typeof n == "object") {
    const r = n;
    return i(r.url || r.src || r.path || r.open_url);
  }
  const e = i(n);
  if (!e || !e.startsWith("[") && !e.startsWith("{"))
    return e;
  try {
    return a(JSON.parse(e));
  } catch {
    return e;
  }
}
function Rn(n, e) {
  const r = Number(n);
  return Number.isFinite(r) ? r : e;
}
function I(n) {
  return typeof n == "boolean" ? n : ["1", "true", "yes", "on"].includes(
    i(n).toLowerCase()
  );
}
export {
  B as a,
  Nn as b,
  l as c,
  y as d,
  En as e,
  Un as f,
  Dn as g,
  In as h,
  an as i,
  z as j,
  Tn as k,
  E as l,
  vn as m,
  cn as n,
  An as o,
  H as p,
  On as q,
  i as r,
  xn as s,
  Pn as t,
  bn as u
};
