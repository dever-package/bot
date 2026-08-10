import { l as z, o as F } from "./react-C7Xtl8sB.js";
import { m as E } from "./in-flight-request-DlB1DJg0.js";
function v(n) {
  const o = n;
  return o?.code === 0 || o?.status === 1;
}
function H(n) {
  return !!n && typeof n == "object" && !Array.isArray(n);
}
function l(n) {
  return H(n) ? n : {};
}
function _(n) {
  return Array.isArray(n) ? n : [];
}
function y(n, o = 0) {
  const r = Number(n || 0);
  return Number.isFinite(r) && r > 0 ? r : o;
}
function xn(n, o = 0) {
  const r = Number(n || 0);
  return Number.isFinite(r) && r >= 0 ? r : o;
}
function i(n) {
  return n == null ? "" : String(n).trim();
}
function Tn(n, o) {
  return l(M(n, o));
}
function M(n, o) {
  const r = l(n);
  if (!v(r))
    throw new Error(i(r.message || r.msg) || o);
  return r.data;
}
function Nn(n, o) {
  return n instanceof Error && n.message ? n.message : o;
}
await window.DeverFront?.ensureCompat?.(["@/config/app-config"]);
const B = window.DeverFront?.sdk?.getCompatModule("@/config/app-config");
if (!B || Object.keys(B).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/config/app-config");
const L = {
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
function X(n, o = L) {
  return {
    baseColor: g(
      n.baseColor,
      o.baseColor
    ),
    brandPrimaryColor: g(
      n.brandPrimaryColor,
      o.brandPrimaryColor
    ),
    loginTemplate: x(
      n.loginTemplate,
      q,
      o.loginTemplate
    ),
    loginTextColor: g(
      n.loginTextColor,
      o.loginTextColor
    ),
    loginBackgroundColor: g(
      n.loginBackgroundColor,
      o.loginBackgroundColor
    ),
    loginBackgroundImage: I(n.loginBackgroundImage) || o.loginBackgroundImage,
    workbenchTemplate: x(
      n.workbenchTemplate,
      G,
      o.workbenchTemplate
    ),
    workbenchBackgroundColor: g(
      n.workbenchBackgroundColor,
      o.workbenchBackgroundColor
    ),
    workbenchBackgroundImage: I(n.workbenchBackgroundImage) || o.workbenchBackgroundImage
  };
}
function An(n, o) {
  const r = o !== "dark", e = m(n.baseColor) || L.baseColor, t = m(n.brandPrimaryColor), s = Z(e, r);
  if (!t)
    return s;
  const u = r ? t : c(t, "#ffffff", 0.32), f = r ? c(t, "#000000", 0.2) : c(t, "#ffffff", 0.18), h = c(
    t,
    "#ffffff",
    r ? 0.14 : 0.44
  ), w = c(
    t,
    r ? "#ffffff" : "#111513",
    r ? 0.88 : 0.76
  );
  return {
    ...s,
    "--body-work-primary": u,
    "--body-work-primary-strong": f,
    "--body-work-primary-bright": h,
    "--body-work-primary-soft": w,
    "--body-work-on-primary": nn(u, f),
    "--body-work-ring": U(u, 0.2)
  };
}
function Z(n, o) {
  const r = en(n) < V ? c(n, "#ffffff", J) : n, e = o ? r : c(n, "#111513", 0.95), t = o ? c(e, "#111513", 0.96) : c(n, "#f2f5f3", 0.9), s = o ? c(e, "#ffffff", Y) : c(n, "#171c19", 0.94), u = o ? c(e, "#ffffff", K) : c(s, t, Q), f = o ? c(e, t, 0.035) : c(n, "#0c0f0e", 0.96), h = c(t, f, o ? 0.4 : 0.42), w = c(e, t, o ? 0.12 : 0.08), j = c(e, t, o ? 0.09 : 0.06);
  return {
    "--body-work-bg": f,
    "--body-work-canvas": e,
    "--body-work-surface": s,
    "--body-work-surface-raised": u,
    "--body-work-text": t,
    "--body-work-muted": h,
    "--body-work-line": w,
    "--body-work-active": j,
    "--body-work-shadow": o ? `0 14px 34px ${U(t, 0.08)}` : "0 18px 42px rgba(0, 0, 0, 0.28)"
  };
}
function En(n, o) {
  const { color: r, image: e } = P(n, o), t = o === "login" ? m(n.loginTextColor) || (e ? "#ffffff" : "") : "";
  return {
    ...r ? { backgroundColor: r } : {},
    ...e ? { backgroundImage: `url(${JSON.stringify(e)})` } : {},
    ...t ? { "--login-copy-color": t } : {}
  };
}
function vn(n, o) {
  const { color: r, image: e } = P(n, o);
  return !!(r || e);
}
function m(n) {
  const o = String(n || "").trim().toLowerCase();
  return W.test(o) ? o : "";
}
function g(n, o) {
  return m(n) || m(o);
}
function I(n) {
  return String(n || "").trim();
}
function P(n, o) {
  return o === "login" ? {
    color: n.loginBackgroundColor,
    image: n.loginBackgroundImage
  } : {
    color: n.workbenchBackgroundColor,
    image: n.workbenchBackgroundImage
  };
}
function x(n, o, r) {
  const e = String(n || "").trim();
  return o.has(e) ? e : r;
}
function c(n, o, r) {
  const e = p(n), t = p(o), s = (u) => Math.round(
    e[u] + (t[u] - e[u]) * r
  );
  return rn(s("red"), s("green"), s("blue"));
}
function nn(...n) {
  return ["#111513", "#ffffff"].reduce(
    (r, e) => T(n, e) > T(n, r) ? e : r
  );
}
function T(n, o) {
  return Math.min(
    ...n.map((r) => on(r, o))
  );
}
function on(n, o) {
  const r = N(n), e = N(o);
  return (Math.max(r, e) + 0.05) / (Math.min(r, e) + 0.05);
}
function N(n) {
  const { red: o, green: r, blue: e } = p(n);
  return 0.2126 * k(o) + 0.7152 * k(r) + 0.0722 * k(e);
}
function en(n) {
  const { red: o, green: r, blue: e } = p(n);
  return (Math.max(o, r, e) + Math.min(o, r, e)) / 510;
}
function k(n) {
  const o = n / 255;
  return o <= 0.04045 ? o / 12.92 : Math.pow((o + 0.055) / 1.055, 2.4);
}
function U(n, o) {
  const { red: r, green: e, blue: t } = p(n);
  return `rgba(${r}, ${e}, ${t}, ${o})`;
}
function p(n) {
  return {
    red: Number.parseInt(n.slice(1, 3), 16),
    green: Number.parseInt(n.slice(3, 5), 16),
    blue: Number.parseInt(n.slice(5, 7), 16)
  };
}
function rn(n, o, r) {
  return `#${[n, o, r].map((e) => e.toString(16).padStart(2, "0")).join("")}`;
}
function tn(n) {
  return typeof window > "u" ? "" : D(
    n,
    ["http:", "https:", "mailto:"],
    window.location.origin
  );
}
function C(n) {
  return D(n, ["http:", "https:"]);
}
function D(n, o, r) {
  const e = n == null ? "" : String(n).trim();
  if (!e)
    return "";
  try {
    const t = r ? new URL(e, r) : new URL(e);
    return o.includes(t.protocol) ? t.href : "";
  } catch {
    return "";
  }
}
function cn(n) {
  const o = l(n), r = i(o.type) === "article" ? "article" : "url";
  return {
    id: y(o.id),
    code: i(o.code).toLowerCase(),
    name: i(o.name),
    type: r,
    articleID: r === "article" ? y(o.article_id) : 0,
    url: r === "url" ? tn(o.url) : "",
    target: i(o.target) === "_self" ? "_self" : "_blank",
    scenes: _(o.scenes).map(ln).filter((e) => !!e)
  };
}
function an(n) {
  return !!(n.id && n.name && (n.type === "article" ? n.articleID : n.url));
}
function Pn(n) {
  return n.type === "article" ? sn(n.articleID) : n.url;
}
function Un(n) {
  return n.type === "article" && n.target === "_self";
}
function sn(n) {
  const o = y(n);
  return o ? `${O("content")}?id=${encodeURIComponent(String(o))}` : "";
}
function Dn() {
  return O("work");
}
function O(n) {
  return `${String(un()?.basePath || "").trim().replace(/\/+$/, "")}/bot/${n.replace(/^\/+/, "")}`;
}
function un() {
  if (!(typeof window > "u"))
    return window.appRuntime;
}
function ln(n) {
  const o = i(n).toLowerCase();
  return o === "navigation" || o === "workbench_content" ? o : null;
}
const fn = B.getSiteConfig, gn = E.joinSiteApi, dn = E.request, mn = "把想法变成作品", pn = "调用团队能力，与智能体协作，把每一次创作沉淀为可复用的项目资产。", $ = [
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
  const [n, o] = z(() => ({
    config: b || R(),
    loaded: !1
  }));
  return F(() => {
    let r = !0;
    return yn().then((e) => {
      r && o({ config: e, loaded: !0 });
    }), () => {
      r = !1;
    };
  }, []), n;
}
function yn() {
  return d || (d = dn(gn("login/config"), "get").then((n) => {
    if (!v(n))
      throw new Error(String(n?.message || n?.msg || "读取登录配置失败"));
    return b = hn(n?.data), b;
  }).catch(() => b || R()).finally(() => {
    d = null;
  }), d);
}
function $n(n) {
  if (typeof document > "u" || (n.siteName && (document.title = n.siteName), !n.favicon))
    return;
  let o = document.querySelector("link[rel~='icon']");
  o || (o = document.createElement("link"), o.rel = "icon", document.head.appendChild(o)), o.href = n.favicon;
}
function hn(n) {
  const o = R(), r = l(n), e = l(r.config), t = _(r.links).map(cn).filter(an);
  return {
    site: {
      siteName: i(e.site_name) || o.site.siteName,
      logo: a(e.logo) || o.site.logo,
      favicon: a(e.favicon) || o.site.favicon,
      loginImage: a(e.login_image) || o.site.loginImage,
      loginTitle: i(e.login_title) || o.site.loginTitle,
      loginDescription: Object.prototype.hasOwnProperty.call(
        e,
        "login_description"
      ) ? i(e.login_description) : o.site.loginDescription,
      registerEnabled: e.register_enabled == null ? o.site.registerEnabled : S(e.register_enabled),
      appearance: X(
        {
          baseColor: e.base_color,
          brandPrimaryColor: e.brand_primary_color,
          loginTemplate: e.login_template,
          loginTextColor: e.login_text_color,
          loginBackgroundColor: e.login_background_color,
          loginBackgroundImage: a(e.login_background_image),
          workbenchTemplate: e.workbench_template,
          workbenchBackgroundColor: e.workbench_background_color,
          workbenchBackgroundImage: a(
            e.workbench_background_image
          )
        },
        o.site.appearance
      ),
      homeMenu: wn(e.home_menu, o.site.homeMenu),
      filing: {
        content: i(e.filing_content),
        contentConfigured: Object.prototype.hasOwnProperty.call(
          e,
          "filing_content"
        ),
        companyName: i(e.company_name),
        companyAddress: i(e.company_address),
        businessLicenseURL: C(e.business_license_url),
        icpRecord: i(e.icp_record),
        icpRecordURL: C(e.icp_record_url),
        publicSecurityRecord: i(e.public_security_record),
        publicSecurityRecordURL: C(
          e.public_security_record_url
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
    accounts: _(r.accounts).map(_n).filter(Bn)
  };
}
function R() {
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
      appearance: L,
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
function wn(n, o) {
  const r = l(n);
  return Object.fromEntries(
    $.map(([e]) => {
      const t = l(r[e]);
      return [
        e,
        {
          name: i(t.name) || o[e].name,
          icon: i(t.icon) || o[e].icon,
          iconImage: a(t.icon_image),
          enabled: t.enabled == null ? o[e].enabled : S(t.enabled),
          sort: Rn(t.sort, o[e].sort)
        }
      ];
    })
  );
}
function kn() {
  return Object.fromEntries(
    $.map(([n, o, r], e) => [
      n,
      { name: o, icon: r, iconImage: "", enabled: !0, sort: (e + 1) * 10 }
    ])
  );
}
function Cn(n) {
  return n.scenes.includes("navigation") ? !0 : !n.code && n.scenes.length === 0;
}
function A(n, o) {
  return n.find((r) => r.code === o) || null;
}
function _n(n) {
  const o = l(n);
  return {
    id: y(o.id),
    provider: i(o.provider).toLowerCase(),
    name: i(o.name),
    icon: a(o.icon),
    appID: i(o.app_id || o.appId),
    configured: S(o.configured)
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
  const o = i(n);
  if (!o || !o.startsWith("[") && !o.startsWith("{"))
    return o;
  try {
    return a(JSON.parse(o));
  } catch {
    return o;
  }
}
function Rn(n, o) {
  const r = Number(n);
  return Number.isFinite(r) ? r : o;
}
function S(n) {
  return typeof n == "boolean" ? n : ["1", "true", "yes", "on"].includes(
    i(n).toLowerCase()
  );
}
export {
  _ as a,
  l as b,
  y as c,
  An as d,
  Pn as e,
  $n as f,
  Dn as g,
  H as h,
  an as i,
  Nn as j,
  xn as k,
  On as l,
  v as m,
  cn as n,
  En as o,
  vn as p,
  Un as q,
  i as r,
  Tn as s,
  M as t,
  bn as u
};
