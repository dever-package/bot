import { a as J, d as Y } from "./file-kind-Cq3pESGF.js";
function $(e) {
  const n = e;
  return n?.code === 0 || n?.status === 1;
}
function K(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function g(e) {
  return K(e) ? e : {};
}
function N(e) {
  return Array.isArray(e) ? e : [];
}
function f(e, n = 0) {
  const o = Number(e || 0);
  return Number.isFinite(o) && o > 0 ? o : n;
}
function Me(e, n = 0) {
  const o = Number(e || 0);
  return Number.isFinite(o) && o >= 0 ? o : n;
}
function c(e) {
  return e == null ? "" : String(e).trim();
}
function De(e, n) {
  return g(Q(e, n));
}
function Q(e, n) {
  const o = g(e);
  if (!$(o)) {
    const r = new Error(
      c(o.message || o.msg) || n
    );
    throw r.code = o.code, r;
  }
  return o.data;
}
function Oe(e, n) {
  return e instanceof Error && e.message ? e.message : n;
}
const E = {
  baseColor: "#96a29c",
  brandPrimaryColor: "",
  loginTemplate: "minimal",
  loginTextColor: "",
  loginBackgroundColor: "",
  loginBackgroundImage: "",
  workbenchTemplate: "rail",
  workbenchBackgroundColor: "",
  workbenchBackgroundImage: ""
}, X = /* @__PURE__ */ new Set([
  "minimal",
  "split",
  "focus",
  "showcase"
]), Z = /* @__PURE__ */ new Set([
  "rail",
  "sidebar",
  "topbar"
]), ee = /^#[0-9a-f]{6}$/i, ne = 0.82, oe = 0.82, re = 0.55, te = 0.82, ie = 0.06;
function ce(e, n = E) {
  return {
    baseColor: w(
      e.baseColor,
      n.baseColor
    ),
    brandPrimaryColor: w(
      e.brandPrimaryColor,
      n.brandPrimaryColor
    ),
    loginTemplate: M(
      e.loginTemplate,
      X,
      n.loginTemplate
    ),
    loginTextColor: w(
      e.loginTextColor,
      n.loginTextColor
    ),
    loginBackgroundColor: w(
      e.loginBackgroundColor,
      n.loginBackgroundColor
    ),
    loginBackgroundImage: U(e.loginBackgroundImage) || n.loginBackgroundImage,
    workbenchTemplate: M(
      e.workbenchTemplate,
      Z,
      n.workbenchTemplate
    ),
    workbenchBackgroundColor: w(
      e.workbenchBackgroundColor,
      n.workbenchBackgroundColor
    ),
    workbenchBackgroundImage: U(e.workbenchBackgroundImage) || n.workbenchBackgroundImage
  };
}
function Fe(e, n) {
  const o = n !== "dark", r = _(e.baseColor) || E.baseColor, t = _(e.brandPrimaryColor), u = ae(r, o);
  if (!t)
    return u;
  const s = o ? t : a(t, "#ffffff", 0.32), p = o ? a(t, "#000000", 0.2) : a(t, "#ffffff", 0.18), m = a(
    t,
    "#ffffff",
    o ? 0.14 : 0.44
  ), i = a(
    t,
    o ? "#ffffff" : "#111513",
    o ? 0.88 : 0.76
  );
  return {
    ...u,
    "--body-work-primary": s,
    "--body-work-primary-strong": p,
    "--body-work-primary-bright": m,
    "--body-work-primary-soft": i,
    "--body-work-on-primary": se(s, p),
    "--body-work-ring": H(s, 0.2)
  };
}
function ae(e, n) {
  const o = le(e) < ne ? a(e, "#ffffff", oe) : e, r = n ? o : a(e, "#111513", 0.95), t = n ? a(r, "#111513", 0.96) : a(e, "#f2f5f3", 0.9), u = n ? a(r, "#ffffff", re) : a(e, "#171c19", 0.94), s = n ? a(r, "#ffffff", te) : a(u, t, ie), p = n ? a(r, t, 0.035) : a(e, "#0c0f0e", 0.96), m = a(t, p, n ? 0.4 : 0.42), i = a(r, t, n ? 0.12 : 0.08), l = a(r, t, n ? 0.09 : 0.06);
  return {
    "--body-work-bg": p,
    "--body-work-canvas": r,
    "--body-work-surface": u,
    "--body-work-surface-raised": s,
    "--body-work-text": t,
    "--body-work-muted": m,
    "--body-work-line": i,
    "--body-work-active": l,
    "--body-work-shadow": n ? `0 14px 34px ${H(t, 0.08)}` : "0 18px 42px rgba(0, 0, 0, 0.28)"
  };
}
function $e(e, n) {
  const { color: o, image: r } = j(e, n), t = n === "login" ? _(e.loginTextColor) || (r ? "#ffffff" : "") : "";
  return {
    ...o ? { backgroundColor: o } : {},
    ...r ? { backgroundImage: `url(${JSON.stringify(r)})` } : {},
    ...t ? { "--login-copy-color": t } : {}
  };
}
function je(e, n) {
  const { color: o, image: r } = j(e, n);
  return !!(o || r);
}
function _(e) {
  const n = String(e || "").trim().toLowerCase();
  return ee.test(n) ? n : "";
}
function w(e, n) {
  return _(e) || _(n);
}
function U(e) {
  return String(e || "").trim();
}
function j(e, n) {
  return n === "login" ? {
    color: e.loginBackgroundColor,
    image: e.loginBackgroundImage
  } : {
    color: e.workbenchBackgroundColor,
    image: e.workbenchBackgroundImage
  };
}
function M(e, n, o) {
  const r = String(e || "").trim();
  return n.has(r) ? r : o;
}
function a(e, n, o) {
  const r = R(e), t = R(n), u = (s) => Math.round(
    r[s] + (t[s] - r[s]) * o
  );
  return fe(u("red"), u("green"), u("blue"));
}
function se(...e) {
  return ["#111513", "#ffffff"].reduce(
    (o, r) => D(e, r) > D(e, o) ? r : o
  );
}
function D(e, n) {
  return Math.min(
    ...e.map((o) => ue(o, n))
  );
}
function ue(e, n) {
  const o = O(e), r = O(n);
  return (Math.max(o, r) + 0.05) / (Math.min(o, r) + 0.05);
}
function O(e) {
  const { red: n, green: o, blue: r } = R(e);
  return 0.2126 * v(n) + 0.7152 * v(o) + 0.0722 * v(r);
}
function le(e) {
  const { red: n, green: o, blue: r } = R(e);
  return (Math.max(n, o, r) + Math.min(n, o, r)) / 510;
}
function v(e) {
  const n = e / 255;
  return n <= 0.04045 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
}
function H(e, n) {
  const { red: o, green: r, blue: t } = R(e);
  return `rgba(${o}, ${r}, ${t}, ${n})`;
}
function R(e) {
  return {
    red: Number.parseInt(e.slice(1, 3), 16),
    green: Number.parseInt(e.slice(3, 5), 16),
    blue: Number.parseInt(e.slice(5, 7), 16)
  };
}
function fe(e, n, o) {
  return `#${[e, n, o].map((r) => r.toString(16).padStart(2, "0")).join("")}`;
}
function de(e) {
  return typeof window > "u" ? "" : q(
    e,
    ["http:", "https:", "mailto:"],
    window.location.origin
  );
}
function x(e) {
  return q(e, ["http:", "https:"]);
}
function q(e, n, o) {
  const r = e == null ? "" : String(e).trim();
  if (!r)
    return "";
  try {
    const t = o ? new URL(r, o) : new URL(r);
    return n.includes(t.protocol) ? t.href : "";
  } catch {
    return "";
  }
}
function ge(e) {
  const n = g(e), o = c(n.type) === "article" ? "article" : "url";
  return {
    id: f(n.id),
    code: c(n.code).toLowerCase(),
    name: c(n.name),
    type: o,
    articleID: o === "article" ? f(n.article_id) : 0,
    url: o === "url" ? de(n.url) : "",
    target: c(n.target) === "_self" ? "_self" : "_blank",
    scenes: N(n.scenes).map(ye).filter((r) => !!r)
  };
}
function me(e) {
  return !!(e.id && e.name && (e.type === "article" ? e.articleID : e.url));
}
function He(e) {
  return e.type === "article" ? pe(e.articleID) : e.url;
}
function qe(e) {
  return e.type === "article" && e.target === "_self";
}
function pe(e) {
  const n = f(e);
  return n ? `${W("content")}?id=${encodeURIComponent(String(n))}` : "";
}
function We() {
  return W("work");
}
function W(e) {
  return `${String(be()?.basePath || "").trim().replace(/\/+$/, "")}/bot/${e.replace(/^\/+/, "")}`;
}
function be() {
  if (!(typeof window > "u"))
    return window.appRuntime;
}
function ye(e) {
  const n = c(e).toLowerCase();
  return n === "navigation" || n === "workbench_content" ? n : null;
}
await window.DeverFront?.ensureCompat?.(["@/config/app-config", "@/lib/request"]);
const T = window.DeverFront?.sdk?.getCompatModule("@/config/app-config");
if (!T || Object.keys(T).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/config/app-config");
const he = T.getSiteConfig, L = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!L || Object.keys(L).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const we = L.joinSiteApi, ke = L.request, Ce = "把想法变成作品", _e = "调用团队能力，与智能体协作，把每一次创作沉淀为可复用的项目资产。", G = [
  ["works", "创作", "file-stack"],
  ["dialogue", "对话", "messages-square"],
  ["function", "工具", "zap"],
  ["assets", "资产", "archive"],
  ["points", "积分", "sparkles"],
  ["messages", "消息", "bell"],
  ["content", "内容", "book-open-text"]
];
let C = null, k = null;
function Ge() {
  return Re().config;
}
function Re() {
  const [e, n] = J(() => ({
    config: C || z(),
    loaded: !1
  }));
  return Y(() => {
    let o = !0;
    return V().then((r) => {
      o && n({ config: r, loaded: !0 });
    }), () => {
      o = !1;
    };
  }, []), e;
}
function V() {
  return k || (k = ke(we("login/config"), "get").then((e) => {
    if (!$(e))
      throw new Error(String(e?.message || e?.msg || "读取登录配置失败"));
    return C = Be(e?.data), C;
  }).catch(() => C || z()).finally(() => {
    k = null;
  }), k);
}
async function Ve(e) {
  const n = C || await V(), o = f(n.site.uploadRules[e]);
  if (o <= 0)
    throw new Error("上传规则未配置");
  return o;
}
function Je(e) {
  if (typeof document > "u" || (e.siteName && (document.title = e.siteName), !e.favicon))
    return;
  let n = document.querySelector("link[rel~='icon']");
  n || (n = document.createElement("link"), n.rel = "icon", document.head.appendChild(n)), n.href = e.favicon;
}
function Be(e) {
  const n = z(), o = g(e), r = g(o.config), t = N(o.links).map(ge).filter(me);
  return {
    site: {
      siteName: c(r.site_name) || n.site.siteName,
      logo: d(r.logo) || n.site.logo,
      favicon: d(r.favicon) || n.site.favicon,
      loginImage: d(r.login_image) || n.site.loginImage,
      loginTitle: c(r.login_title) || n.site.loginTitle,
      loginDescription: Object.prototype.hasOwnProperty.call(
        r,
        "login_description"
      ) ? c(r.login_description) : n.site.loginDescription,
      registerEnabled: r.register_enabled == null ? n.site.registerEnabled : P(r.register_enabled),
      appearance: ce(
        {
          baseColor: r.base_color,
          brandPrimaryColor: r.brand_primary_color,
          loginTemplate: r.login_template,
          loginTextColor: r.login_text_color,
          loginBackgroundColor: r.login_background_color,
          loginBackgroundImage: d(r.login_background_image),
          workbenchTemplate: r.workbench_template,
          workbenchBackgroundColor: r.workbench_background_color,
          workbenchBackgroundImage: d(
            r.workbench_background_image
          )
        },
        n.site.appearance
      ),
      homeMenu: Ie(r.home_menu, n.site.homeMenu),
      uploadRules: Le(r.upload_rules),
      filing: {
        content: c(r.filing_content),
        contentConfigured: Object.prototype.hasOwnProperty.call(
          r,
          "filing_content"
        ),
        companyName: c(r.company_name),
        companyAddress: c(r.company_address),
        businessLicenseURL: x(r.business_license_url),
        icpRecord: c(r.icp_record),
        icpRecordURL: x(r.icp_record_url),
        publicSecurityRecord: c(r.public_security_record),
        publicSecurityRecordURL: x(
          r.public_security_record_url
        )
      }
    },
    links: t.filter(xe),
    legalLinks: {
      termsOfService: F(
        t,
        "terms_of_service"
      ),
      privacyPolicy: F(
        t,
        "privacy_policy"
      )
    },
    accounts: N(o.accounts).map(Ne).filter(Te)
  };
}
function z() {
  const e = he?.() || {};
  return {
    site: {
      siteName: c(e.name) || "神创工作台",
      logo: d(e.logo),
      favicon: d(e.favicon),
      loginImage: "",
      loginTitle: Ce,
      loginDescription: _e,
      registerEnabled: !0,
      appearance: E,
      homeMenu: ve(),
      uploadRules: Se(),
      filing: Ae()
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
function Le(e) {
  const n = g(e);
  return {
    image: f(n.image),
    video: f(n.video),
    audio: f(n.audio),
    file: f(n.file),
    text: f(n.text),
    avatar: f(n.avatar)
  };
}
function Se() {
  return {
    image: 0,
    video: 0,
    audio: 0,
    file: 0,
    text: 0,
    avatar: 0
  };
}
function Ie(e, n) {
  const o = g(e);
  return Object.fromEntries(
    G.map(([r]) => {
      const t = g(o[r]);
      return [
        r,
        {
          name: c(t.name) || n[r].name,
          icon: c(t.icon) || n[r].icon,
          iconImage: d(t.icon_image),
          enabled: t.enabled == null ? n[r].enabled : P(t.enabled),
          sort: Ee(t.sort, n[r].sort)
        }
      ];
    })
  );
}
function ve() {
  return Object.fromEntries(
    G.map(([e, n, o], r) => [
      e,
      { name: n, icon: o, iconImage: "", enabled: !0, sort: (r + 1) * 10 }
    ])
  );
}
function xe(e) {
  return e.scenes.includes("navigation") ? !0 : !e.code && e.scenes.length === 0;
}
function F(e, n) {
  return e.find((o) => o.code === n) || null;
}
function Ne(e) {
  const n = g(e);
  return {
    id: f(n.id),
    provider: c(n.provider).toLowerCase(),
    name: c(n.name),
    icon: d(n.icon),
    appID: c(n.app_id || n.appId),
    configured: P(n.configured)
  };
}
function Te(e) {
  return !!(e.id && e.provider && e.name);
}
function Ae() {
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
function d(e) {
  if (Array.isArray(e))
    return d(e[0]);
  if (e && typeof e == "object") {
    const o = e;
    return c(o.url || o.src || o.path || o.open_url);
  }
  const n = c(e);
  if (!n || !n.startsWith("[") && !n.startsWith("{"))
    return n;
  try {
    return d(JSON.parse(n));
  } catch {
    return n;
  }
}
function Ee(e, n) {
  const o = Number(e);
  return Number.isFinite(o) ? o : n;
}
function P(e) {
  return typeof e == "boolean" ? e : ["1", "true", "yes", "on"].includes(
    c(e).toLowerCase()
  );
}
function Ye(e, n) {
  const o = e.map((i) => ({
    name: String(i.name || ""),
    size: A(i.size)
  })), r = o.reduce((i, l) => i + l.size, 0), t = o.map((i) => Math.max(i.size, 1)), u = t.reduce((i, l) => i + l, 0), s = o.map(() => 0);
  function p(i, l) {
    const b = o[i];
    if (!b || !n) return;
    const y = o.reduce(
      (h, S, I) => h + S.size * s[I],
      0
    ), B = t.reduce(
      (h, S, I) => h + S * s[I],
      0
    );
    n({
      phase: l,
      fileName: b.name,
      fileIndex: i + 1,
      fileCount: o.length,
      loaded: Math.round(y),
      total: r,
      percent: u > 0 ? Math.round(Math.min(1, B / u) * 100) : 100
    });
  }
  function m(i, l, b) {
    o[i] && (s[i] = Math.max(s[i], Pe(l)), p(i, b));
  }
  return {
    start(i) {
      m(i, 0, "preparing");
    },
    report(i, l, b, y = "uploading") {
      const B = o[i];
      if (!B) return;
      const h = y === "saving" || y === "complete" ? 1 : ze(l, b, B.size);
      m(i, h, y);
    },
    saving(i) {
      m(i, 1, "saving");
    },
    complete(i) {
      m(i, 1, "complete");
    }
  };
}
function ze(e, n, o) {
  const r = A(e), t = A(n);
  return t > 0 ? r / t : o > 0 ? r / o : 0;
}
function A(e) {
  const n = Number(e || 0);
  return Number.isFinite(n) && n > 0 ? n : 0;
}
function Pe(e) {
  return Math.max(0, Math.min(Number.isFinite(e) ? e : 0, 1));
}
export {
  N as a,
  g as b,
  Ye as c,
  c as d,
  f as e,
  He as f,
  Je as g,
  We as h,
  me as i,
  Me as j,
  K as k,
  Ve as l,
  $ as m,
  ge as n,
  $e as o,
  je as p,
  Fe as q,
  Oe as r,
  De as s,
  Ge as t,
  Re as u,
  qe as v,
  Q as w
};
