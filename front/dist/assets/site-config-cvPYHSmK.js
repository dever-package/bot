import { a as z, b as F } from "./file-kind-DFeonxO2.js";
function A(e) {
  const n = e;
  return n?.code === 0 || n?.status === 1;
}
function H(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function f(e) {
  return H(e) ? e : {};
}
function B(e) {
  return Array.isArray(e) ? e : [];
}
function a(e, n = 0) {
  const r = Number(e || 0);
  return Number.isFinite(r) && r > 0 ? r : n;
}
function ve(e, n = 0) {
  const r = Number(e || 0);
  return Number.isFinite(r) && r >= 0 ? r : n;
}
function i(e) {
  return e == null ? "" : String(e).trim();
}
function xe(e, n) {
  return f(q(e, n));
}
function q(e, n) {
  const r = f(e);
  if (!A(r))
    throw new Error(i(r.message || r.msg) || n);
  return r.data;
}
function Te(e, n) {
  return e instanceof Error && e.message ? e.message : n;
}
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
}, G = /* @__PURE__ */ new Set([
  "minimal",
  "split",
  "focus",
  "showcase"
]), W = /* @__PURE__ */ new Set([
  "rail",
  "sidebar",
  "topbar"
]), V = /^#[0-9a-f]{6}$/i, J = 0.82, Y = 0.82, K = 0.55, Q = 0.82, X = 0.06;
function Z(e, n = L) {
  return {
    baseColor: g(
      e.baseColor,
      n.baseColor
    ),
    brandPrimaryColor: g(
      e.brandPrimaryColor,
      n.brandPrimaryColor
    ),
    loginTemplate: x(
      e.loginTemplate,
      G,
      n.loginTemplate
    ),
    loginTextColor: g(
      e.loginTextColor,
      n.loginTextColor
    ),
    loginBackgroundColor: g(
      e.loginBackgroundColor,
      n.loginBackgroundColor
    ),
    loginBackgroundImage: v(e.loginBackgroundImage) || n.loginBackgroundImage,
    workbenchTemplate: x(
      e.workbenchTemplate,
      W,
      n.workbenchTemplate
    ),
    workbenchBackgroundColor: g(
      e.workbenchBackgroundColor,
      n.workbenchBackgroundColor
    ),
    workbenchBackgroundImage: v(e.workbenchBackgroundImage) || n.workbenchBackgroundImage
  };
}
function Ne(e, n) {
  const r = n !== "dark", o = b(e.baseColor) || L.baseColor, t = b(e.brandPrimaryColor), u = ee(o, r);
  if (!t)
    return u;
  const l = r ? t : c(t, "#ffffff", 0.32), d = r ? c(t, "#000000", 0.2) : c(t, "#ffffff", 0.18), h = c(
    t,
    "#ffffff",
    r ? 0.14 : 0.44
  ), k = c(
    t,
    r ? "#ffffff" : "#111513",
    r ? 0.88 : 0.76
  );
  return {
    ...u,
    "--body-work-primary": l,
    "--body-work-primary-strong": d,
    "--body-work-primary-bright": h,
    "--body-work-primary-soft": k,
    "--body-work-on-primary": ne(l, d),
    "--body-work-ring": U(l, 0.2)
  };
}
function ee(e, n) {
  const r = re(e) < J ? c(e, "#ffffff", Y) : e, o = n ? r : c(e, "#111513", 0.95), t = n ? c(o, "#111513", 0.96) : c(e, "#f2f5f3", 0.9), u = n ? c(o, "#ffffff", K) : c(e, "#171c19", 0.94), l = n ? c(o, "#ffffff", Q) : c(u, t, X), d = n ? c(o, t, 0.035) : c(e, "#0c0f0e", 0.96), h = c(t, d, n ? 0.4 : 0.42), k = c(o, t, n ? 0.12 : 0.08), j = c(o, t, n ? 0.09 : 0.06);
  return {
    "--body-work-bg": d,
    "--body-work-canvas": o,
    "--body-work-surface": u,
    "--body-work-surface-raised": l,
    "--body-work-text": t,
    "--body-work-muted": h,
    "--body-work-line": k,
    "--body-work-active": j,
    "--body-work-shadow": n ? `0 14px 34px ${U(t, 0.08)}` : "0 18px 42px rgba(0, 0, 0, 0.28)"
  };
}
function Ee(e, n) {
  const { color: r, image: o } = P(e, n), t = n === "login" ? b(e.loginTextColor) || (o ? "#ffffff" : "") : "";
  return {
    ...r ? { backgroundColor: r } : {},
    ...o ? { backgroundImage: `url(${JSON.stringify(o)})` } : {},
    ...t ? { "--login-copy-color": t } : {}
  };
}
function Ae(e, n) {
  const { color: r, image: o } = P(e, n);
  return !!(r || o);
}
function b(e) {
  const n = String(e || "").trim().toLowerCase();
  return V.test(n) ? n : "";
}
function g(e, n) {
  return b(e) || b(n);
}
function v(e) {
  return String(e || "").trim();
}
function P(e, n) {
  return n === "login" ? {
    color: e.loginBackgroundColor,
    image: e.loginBackgroundImage
  } : {
    color: e.workbenchBackgroundColor,
    image: e.workbenchBackgroundImage
  };
}
function x(e, n, r) {
  const o = String(e || "").trim();
  return n.has(o) ? o : r;
}
function c(e, n, r) {
  const o = y(e), t = y(n), u = (l) => Math.round(
    o[l] + (t[l] - o[l]) * r
  );
  return te(u("red"), u("green"), u("blue"));
}
function ne(...e) {
  return ["#111513", "#ffffff"].reduce(
    (r, o) => T(e, o) > T(e, r) ? o : r
  );
}
function T(e, n) {
  return Math.min(
    ...e.map((r) => oe(r, n))
  );
}
function oe(e, n) {
  const r = N(e), o = N(n);
  return (Math.max(r, o) + 0.05) / (Math.min(r, o) + 0.05);
}
function N(e) {
  const { red: n, green: r, blue: o } = y(e);
  return 0.2126 * C(n) + 0.7152 * C(r) + 0.0722 * C(o);
}
function re(e) {
  const { red: n, green: r, blue: o } = y(e);
  return (Math.max(n, r, o) + Math.min(n, r, o)) / 510;
}
function C(e) {
  const n = e / 255;
  return n <= 0.04045 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
}
function U(e, n) {
  const { red: r, green: o, blue: t } = y(e);
  return `rgba(${r}, ${o}, ${t}, ${n})`;
}
function y(e) {
  return {
    red: Number.parseInt(e.slice(1, 3), 16),
    green: Number.parseInt(e.slice(3, 5), 16),
    blue: Number.parseInt(e.slice(5, 7), 16)
  };
}
function te(e, n, r) {
  return `#${[e, n, r].map((o) => o.toString(16).padStart(2, "0")).join("")}`;
}
function ie(e) {
  return typeof window > "u" ? "" : D(
    e,
    ["http:", "https:", "mailto:"],
    window.location.origin
  );
}
function _(e) {
  return D(e, ["http:", "https:"]);
}
function D(e, n, r) {
  const o = e == null ? "" : String(e).trim();
  if (!o)
    return "";
  try {
    const t = r ? new URL(o, r) : new URL(o);
    return n.includes(t.protocol) ? t.href : "";
  } catch {
    return "";
  }
}
function ce(e) {
  const n = f(e), r = i(n.type) === "article" ? "article" : "url";
  return {
    id: a(n.id),
    code: i(n.code).toLowerCase(),
    name: i(n.name),
    type: r,
    articleID: r === "article" ? a(n.article_id) : 0,
    url: r === "url" ? ie(n.url) : "",
    target: i(n.target) === "_self" ? "_self" : "_blank",
    scenes: B(n.scenes).map(le).filter((o) => !!o)
  };
}
function ae(e) {
  return !!(e.id && e.name && (e.type === "article" ? e.articleID : e.url));
}
function Pe(e) {
  return e.type === "article" ? se(e.articleID) : e.url;
}
function Ue(e) {
  return e.type === "article" && e.target === "_self";
}
function se(e) {
  const n = a(e);
  return n ? `${O("content")}?id=${encodeURIComponent(String(n))}` : "";
}
function De() {
  return O("work");
}
function O(e) {
  return `${String(ue()?.basePath || "").trim().replace(/\/+$/, "")}/bot/${e.replace(/^\/+/, "")}`;
}
function ue() {
  if (!(typeof window > "u"))
    return window.appRuntime;
}
function le(e) {
  const n = i(e).toLowerCase();
  return n === "navigation" || n === "workbench_content" ? n : null;
}
await window.DeverFront?.ensureCompat?.(["@/config/app-config", "@/lib/request"]);
const R = window.DeverFront?.sdk?.getCompatModule("@/config/app-config");
if (!R || Object.keys(R).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/config/app-config");
const fe = R.getSiteConfig, w = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!w || Object.keys(w).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const de = w.joinSiteApi, ge = w.request, me = "把想法变成作品", pe = "调用团队能力，与智能体协作，把每一次创作沉淀为可复用的项目资产。", M = [
  ["works", "创作", "file-stack"],
  ["dialogue", "对话", "messages-square"],
  ["function", "工具", "zap"],
  ["assets", "资产", "archive"],
  ["points", "积分", "sparkles"],
  ["messages", "消息", "bell"],
  ["content", "内容", "book-open-text"]
];
let p = null, m = null;
function Oe() {
  return be().config;
}
function be() {
  const [e, n] = z(() => ({
    config: p || S(),
    loaded: !1
  }));
  return F(() => {
    let r = !0;
    return $().then((o) => {
      r && n({ config: o, loaded: !0 });
    }), () => {
      r = !1;
    };
  }, []), e;
}
function $() {
  return m || (m = ge(de("login/config"), "get").then((e) => {
    if (!A(e))
      throw new Error(String(e?.message || e?.msg || "读取登录配置失败"));
    return p = ye(e?.data), p;
  }).catch(() => p || S()).finally(() => {
    m = null;
  }), m);
}
async function Me(e) {
  const n = p || await $(), r = a(n.site.uploadRules[e]);
  if (r <= 0)
    throw new Error("上传规则未配置");
  return r;
}
function $e(e) {
  if (typeof document > "u" || (e.siteName && (document.title = e.siteName), !e.favicon))
    return;
  let n = document.querySelector("link[rel~='icon']");
  n || (n = document.createElement("link"), n.rel = "icon", document.head.appendChild(n)), n.href = e.favicon;
}
function ye(e) {
  const n = S(), r = f(e), o = f(r.config), t = B(r.links).map(ce).filter(ae);
  return {
    site: {
      siteName: i(o.site_name) || n.site.siteName,
      logo: s(o.logo) || n.site.logo,
      favicon: s(o.favicon) || n.site.favicon,
      loginImage: s(o.login_image) || n.site.loginImage,
      loginTitle: i(o.login_title) || n.site.loginTitle,
      loginDescription: Object.prototype.hasOwnProperty.call(
        o,
        "login_description"
      ) ? i(o.login_description) : n.site.loginDescription,
      registerEnabled: o.register_enabled == null ? n.site.registerEnabled : I(o.register_enabled),
      appearance: Z(
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
        n.site.appearance
      ),
      homeMenu: ke(o.home_menu, n.site.homeMenu),
      uploadRules: we(o.upload_rules),
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
    links: t.filter(_e),
    legalLinks: {
      termsOfService: E(
        t,
        "terms_of_service"
      ),
      privacyPolicy: E(
        t,
        "privacy_policy"
      )
    },
    accounts: B(r.accounts).map(Be).filter(Re)
  };
}
function S() {
  const e = fe?.() || {};
  return {
    site: {
      siteName: i(e.name) || "神创工作台",
      logo: s(e.logo),
      favicon: s(e.favicon),
      loginImage: "",
      loginTitle: me,
      loginDescription: pe,
      registerEnabled: !0,
      appearance: L,
      homeMenu: Ce(),
      uploadRules: he(),
      filing: Le()
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
function we(e) {
  const n = f(e);
  return {
    image: a(n.image),
    video: a(n.video),
    audio: a(n.audio),
    file: a(n.file),
    text: a(n.text),
    avatar: a(n.avatar)
  };
}
function he() {
  return {
    image: 0,
    video: 0,
    audio: 0,
    file: 0,
    text: 0,
    avatar: 0
  };
}
function ke(e, n) {
  const r = f(e);
  return Object.fromEntries(
    M.map(([o]) => {
      const t = f(r[o]);
      return [
        o,
        {
          name: i(t.name) || n[o].name,
          icon: i(t.icon) || n[o].icon,
          iconImage: s(t.icon_image),
          enabled: t.enabled == null ? n[o].enabled : I(t.enabled),
          sort: Se(t.sort, n[o].sort)
        }
      ];
    })
  );
}
function Ce() {
  return Object.fromEntries(
    M.map(([e, n, r], o) => [
      e,
      { name: n, icon: r, iconImage: "", enabled: !0, sort: (o + 1) * 10 }
    ])
  );
}
function _e(e) {
  return e.scenes.includes("navigation") ? !0 : !e.code && e.scenes.length === 0;
}
function E(e, n) {
  return e.find((r) => r.code === n) || null;
}
function Be(e) {
  const n = f(e);
  return {
    id: a(n.id),
    provider: i(n.provider).toLowerCase(),
    name: i(n.name),
    icon: s(n.icon),
    appID: i(n.app_id || n.appId),
    configured: I(n.configured)
  };
}
function Re(e) {
  return !!(e.id && e.provider && e.name);
}
function Le() {
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
function s(e) {
  if (Array.isArray(e))
    return s(e[0]);
  if (e && typeof e == "object") {
    const r = e;
    return i(r.url || r.src || r.path || r.open_url);
  }
  const n = i(e);
  if (!n || !n.startsWith("[") && !n.startsWith("{"))
    return n;
  try {
    return s(JSON.parse(n));
  } catch {
    return n;
  }
}
function Se(e, n) {
  const r = Number(e);
  return Number.isFinite(r) ? r : n;
}
function I(e) {
  return typeof e == "boolean" ? e : ["1", "true", "yes", "on"].includes(
    i(e).toLowerCase()
  );
}
export {
  B as a,
  Ne as b,
  a as c,
  f as d,
  Pe as e,
  $e as f,
  De as g,
  ve as h,
  ae as i,
  H as j,
  Te as k,
  Me as l,
  A as m,
  ce as n,
  Ee as o,
  Ae as p,
  q,
  i as r,
  xe as s,
  Oe as t,
  be as u,
  Ue as v
};
