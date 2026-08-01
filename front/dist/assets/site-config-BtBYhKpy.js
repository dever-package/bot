import { u as D, b as z, t as H, r as j, j as F } from "./runtime-entry-CIrzyMsA.js";
import { i as M } from "./api-response-C-VXY2RJ.js";
const B = {
  baseColor: "#96a29c",
  brandPrimaryColor: "",
  loginTemplate: "minimal",
  loginTextColor: "",
  loginBackgroundColor: "",
  loginBackgroundImage: "",
  workbenchTemplate: "rail",
  workbenchBackgroundColor: "",
  workbenchBackgroundImage: ""
}, V = /* @__PURE__ */ new Set([
  "minimal",
  "split",
  "focus",
  "showcase"
]), G = /* @__PURE__ */ new Set([
  "rail",
  "sidebar",
  "topbar"
]), W = /^#[0-9a-f]{6}$/i, q = 0.82, J = 0.82, Y = 0.55, K = 0.82, Q = 0.06;
function X(n, o = B) {
  return {
    baseColor: f(
      n.baseColor,
      o.baseColor
    ),
    brandPrimaryColor: f(
      n.brandPrimaryColor,
      o.brandPrimaryColor
    ),
    loginTemplate: I(
      n.loginTemplate,
      V,
      o.loginTemplate
    ),
    loginTextColor: f(
      n.loginTextColor,
      o.loginTextColor
    ),
    loginBackgroundColor: f(
      n.loginBackgroundColor,
      o.loginBackgroundColor
    ),
    loginBackgroundImage: R(n.loginBackgroundImage) || o.loginBackgroundImage,
    workbenchTemplate: I(
      n.workbenchTemplate,
      G,
      o.workbenchTemplate
    ),
    workbenchBackgroundColor: f(
      n.workbenchBackgroundColor,
      o.workbenchBackgroundColor
    ),
    workbenchBackgroundImage: R(n.workbenchBackgroundImage) || o.workbenchBackgroundImage
  };
}
function xn(n, o) {
  const r = o !== "dark", e = m(n.baseColor) || B.baseColor, t = m(n.brandPrimaryColor), s = Z(e, r);
  if (!t)
    return s;
  const u = r ? t : i(t, "#ffffff", 0.32), l = r ? i(t, "#000000", 0.2) : i(t, "#ffffff", 0.18), h = i(
    t,
    "#ffffff",
    r ? 0.14 : 0.44
  ), k = i(
    t,
    r ? "#ffffff" : "#111513",
    r ? 0.88 : 0.76
  );
  return {
    ...s,
    "--body-work-primary": u,
    "--body-work-primary-strong": l,
    "--body-work-primary-bright": h,
    "--body-work-primary-soft": k,
    "--body-work-on-primary": nn(u, l),
    "--body-work-ring": E(u, 0.2)
  };
}
function Z(n, o) {
  const r = en(n) < q ? i(n, "#ffffff", J) : n, e = o ? r : i(n, "#111513", 0.95), t = o ? i(e, "#111513", 0.96) : i(n, "#f2f5f3", 0.9), s = o ? i(e, "#ffffff", Y) : i(n, "#171c19", 0.94), u = o ? i(e, "#ffffff", K) : i(s, t, Q), l = o ? i(e, t, 0.035) : i(n, "#0c0f0e", 0.96), h = i(t, l, o ? 0.4 : 0.42), k = i(e, t, o ? 0.12 : 0.08), v = i(e, t, o ? 0.09 : 0.06);
  return {
    "--body-work-bg": l,
    "--body-work-canvas": e,
    "--body-work-surface": s,
    "--body-work-surface-raised": u,
    "--body-work-text": t,
    "--body-work-muted": h,
    "--body-work-line": k,
    "--body-work-active": v,
    "--body-work-shadow": o ? `0 14px 34px ${E(t, 0.08)}` : "0 18px 42px rgba(0, 0, 0, 0.28)"
  };
}
function Tn(n, o) {
  const { color: r, image: e } = P(n, o), t = o === "login" ? m(n.loginTextColor) || (e ? "#ffffff" : "") : "";
  return {
    ...r ? { backgroundColor: r } : {},
    ...e ? { backgroundImage: `url(${JSON.stringify(e)})` } : {},
    ...t ? { "--login-copy-color": t } : {}
  };
}
function An(n, o) {
  const { color: r, image: e } = P(n, o);
  return !!(r || e);
}
function m(n) {
  const o = String(n || "").trim().toLowerCase();
  return W.test(o) ? o : "";
}
function f(n, o) {
  return m(n) || m(o);
}
function R(n) {
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
function I(n, o, r) {
  const e = String(n || "").trim();
  return o.has(e) ? e : r;
}
function i(n, o, r) {
  const e = p(n), t = p(o), s = (u) => Math.round(
    e[u] + (t[u] - e[u]) * r
  );
  return rn(s("red"), s("green"), s("blue"));
}
function nn(...n) {
  return ["#111513", "#ffffff"].reduce(
    (r, e) => x(n, e) > x(n, r) ? e : r
  );
}
function x(n, o) {
  return Math.min(
    ...n.map((r) => on(r, o))
  );
}
function on(n, o) {
  const r = T(n), e = T(o);
  return (Math.max(r, e) + 0.05) / (Math.min(r, e) + 0.05);
}
function T(n) {
  const { red: o, green: r, blue: e } = p(n);
  return 0.2126 * w(o) + 0.7152 * w(r) + 0.0722 * w(e);
}
function en(n) {
  const { red: o, green: r, blue: e } = p(n);
  return (Math.max(o, r, e) + Math.min(o, r, e)) / 510;
}
function w(n) {
  const o = n / 255;
  return o <= 0.04045 ? o / 12.92 : Math.pow((o + 0.055) / 1.055, 2.4);
}
function E(n, o) {
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
  return typeof window > "u" ? "" : U(
    n,
    ["http:", "https:", "mailto:"],
    window.location.origin
  );
}
function C(n) {
  return U(n, ["http:", "https:"]);
}
function U(n, o, r) {
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
  const o = gn(n), r = d(o.type) === "article" ? "article" : "url";
  return {
    id: _(o.id),
    code: d(o.code).toLowerCase(),
    name: d(o.name),
    type: r,
    articleID: r === "article" ? _(o.article_id) : 0,
    url: r === "url" ? tn(o.url) : "",
    target: d(o.target) === "_self" ? "_self" : "_blank",
    scenes: fn(o.scenes).map(ln).filter((e) => !!e)
  };
}
function an(n) {
  return !!(n.id && n.name && (n.type === "article" ? n.articleID : n.url));
}
function Nn(n) {
  return n.type === "article" ? sn(n.articleID) : n.url;
}
function Pn(n) {
  return n.type === "article" && n.target === "_self";
}
function sn(n) {
  const o = _(n);
  return o ? `${$("content")}?id=${encodeURIComponent(String(o))}` : "";
}
function En() {
  return $("work");
}
function $(n) {
  return `${String(un()?.basePath || "").trim().replace(/\/+$/, "")}/bot/${n.replace(/^\/+/, "")}`;
}
function un() {
  if (!(typeof window > "u"))
    return window.appRuntime;
}
function ln(n) {
  const o = d(n).toLowerCase();
  return o === "navigation" || o === "workbench_content" ? o : null;
}
function fn(n) {
  return Array.isArray(n) ? n : [];
}
function gn(n) {
  return n && typeof n == "object" && !Array.isArray(n) ? n : {};
}
function _(n) {
  const o = Number(n || 0);
  return Number.isFinite(o) && o > 0 ? o : 0;
}
function d(n) {
  return n == null ? "" : String(n).trim();
}
const dn = "把想法变成作品", mn = "调用团队能力，与智能体协作，把每一次创作沉淀为可复用的项目资产。", O = [
  ["works", "创作", "file-stack"],
  ["dialogue", "对话", "messages-square"],
  ["function", "工具", "zap"],
  ["assets", "资产", "archive"],
  ["points", "积分", "sparkles"],
  ["messages", "消息", "bell"],
  ["content", "内容", "book-open-text"]
];
let y = null, g = null;
function Un() {
  return pn().config;
}
function pn() {
  const [n, o] = D(() => ({
    config: y || L(),
    loaded: !1
  }));
  return z(() => {
    let r = !0;
    return bn().then((e) => {
      r && o({ config: e, loaded: !0 });
    }), () => {
      r = !1;
    };
  }, []), n;
}
function bn() {
  return g || (g = j(F("login/config"), "get").then((n) => {
    if (!M(n))
      throw new Error(String(n?.message || n?.msg || "读取登录配置失败"));
    return y = yn(n?.data), y;
  }).catch(() => y || L()).finally(() => {
    g = null;
  }), g);
}
function $n(n) {
  if (typeof document > "u" || (n.siteName && (document.title = n.siteName), !n.favicon))
    return;
  let o = document.querySelector("link[rel~='icon']");
  o || (o = document.createElement("link"), o.rel = "icon", document.head.appendChild(o)), o.href = n.favicon;
}
function yn(n) {
  const o = L(), r = b(n), e = b(r.config), t = N(r.links).map(cn).filter(an);
  return {
    site: {
      siteName: c(e.site_name) || o.site.siteName,
      logo: a(e.logo) || o.site.logo,
      favicon: a(e.favicon) || o.site.favicon,
      loginImage: a(e.login_image) || o.site.loginImage,
      loginTitle: c(e.login_title) || o.site.loginTitle,
      loginDescription: Object.prototype.hasOwnProperty.call(
        e,
        "login_description"
      ) ? c(e.login_description) : o.site.loginDescription,
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
      homeMenu: hn(e.home_menu, o.site.homeMenu),
      filing: {
        content: c(e.filing_content),
        contentConfigured: Object.prototype.hasOwnProperty.call(
          e,
          "filing_content"
        ),
        companyName: c(e.company_name),
        companyAddress: c(e.company_address),
        businessLicenseURL: C(e.business_license_url),
        icpRecord: c(e.icp_record),
        icpRecordURL: C(e.icp_record_url),
        publicSecurityRecord: c(e.public_security_record),
        publicSecurityRecordURL: C(
          e.public_security_record_url
        )
      }
    },
    links: t.filter(wn),
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
    accounts: N(r.accounts).map(Cn).filter(_n)
  };
}
function L() {
  const n = H?.() || {};
  return {
    site: {
      siteName: c(n.name) || "神创工作台",
      logo: a(n.logo),
      favicon: a(n.favicon),
      loginImage: "",
      loginTitle: dn,
      loginDescription: mn,
      registerEnabled: !0,
      appearance: B,
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
function hn(n, o) {
  const r = b(n);
  return Object.fromEntries(
    O.map(([e]) => {
      const t = b(r[e]);
      return [
        e,
        {
          name: c(t.name) || o[e].name,
          icon: c(t.icon) || o[e].icon,
          iconImage: a(t.icon_image),
          enabled: t.enabled == null ? o[e].enabled : S(t.enabled),
          sort: Sn(t.sort, o[e].sort)
        }
      ];
    })
  );
}
function kn() {
  return Object.fromEntries(
    O.map(([n, o, r], e) => [
      n,
      { name: o, icon: r, iconImage: "", enabled: !0, sort: (e + 1) * 10 }
    ])
  );
}
function wn(n) {
  return n.scenes.includes("navigation") ? !0 : !n.code && n.scenes.length === 0;
}
function A(n, o) {
  return n.find((r) => r.code === o) || null;
}
function Cn(n) {
  const o = b(n);
  return {
    id: Ln(o.id),
    provider: c(o.provider).toLowerCase(),
    name: c(o.name),
    icon: a(o.icon),
    appID: c(o.app_id || o.appId),
    configured: S(o.configured)
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
function a(n) {
  if (Array.isArray(n))
    return a(n[0]);
  if (n && typeof n == "object") {
    const r = n;
    return c(r.url || r.src || r.path || r.open_url);
  }
  const o = c(n);
  if (!o || !o.startsWith("[") && !o.startsWith("{"))
    return o;
  try {
    return a(JSON.parse(o));
  } catch {
    return o;
  }
}
function b(n) {
  return n && typeof n == "object" && !Array.isArray(n) ? n : {};
}
function N(n) {
  return Array.isArray(n) ? n : [];
}
function Ln(n) {
  const o = Number(n || 0);
  return Number.isFinite(o) && o > 0 ? o : 0;
}
function Sn(n, o) {
  const r = Number(n);
  return Number.isFinite(r) ? r : o;
}
function c(n) {
  return n == null ? "" : String(n).trim();
}
function S(n) {
  return typeof n == "boolean" ? n : ["1", "true", "yes", "on"].includes(
    c(n).toLowerCase()
  );
}
export {
  $n as a,
  xn as b,
  En as c,
  Nn as d,
  Tn as e,
  Pn as f,
  Un as g,
  An as h,
  an as i,
  cn as n,
  pn as u
};
