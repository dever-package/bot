import { j as n, F as p } from "./runtime-entry-9YhLBCWA.js";
await window.DeverFront?.ensureCompat?.(["@/components/rich-text-view", "@/lib/rich-text-html"]);
const o = window.DeverFront?.sdk?.getCompatModule("@/components/rich-text-view");
if (!o || Object.keys(o).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/rich-text-view");
const c = window.DeverFront?.sdk?.getCompatModule("@/lib/rich-text-html");
if (!c || Object.keys(c).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/rich-text-html");
const s = o.RichTextView, i = c.richTextToHtml;
function h({
  value: e,
  className: t,
  fallback: r,
  outline: l,
  onOutlineChange: d
}) {
  return !a(e) || !s ? /* @__PURE__ */ n(p, { children: r }) : /* @__PURE__ */ n(
    s,
    {
      value: e,
      className: t,
      outline: l,
      onOutlineChange: d
    }
  );
}
function a(e) {
  const t = String(e || "").trim();
  if (!t)
    return !1;
  if (!i)
    return !0;
  try {
    return !!i(t, { wrapper: !1 }).trim();
  } catch {
    return !1;
  }
}
function b({
  filing: e,
  className: t,
  fallback: r
}) {
  return /* @__PURE__ */ n(
    h,
    {
      value: e.content,
      className: t,
      fallback: e.contentConfigured ? void 0 : r
    }
  );
}
function u(e) {
  const t = [];
  return e.businessLicenseURL && t.push({
    key: "business-license",
    label: "营业执照",
    url: e.businessLicenseURL
  }), e.icpRecord && t.push({
    key: "icp-record",
    label: e.icpRecord,
    url: e.icpRecordURL
  }), e.publicSecurityRecord && t.push({
    key: "public-security-record",
    label: e.publicSecurityRecord,
    url: e.publicSecurityRecordURL
  }), e.companyName && t.push({ key: "company-name", label: e.companyName }), e.companyAddress && t.push({ key: "company-address", label: e.companyAddress }), t;
}
function w({
  filing: e,
  itemClassName: t
}) {
  return u(e).map((r) => /* @__PURE__ */ n("span", { className: t, children: r.url ? /* @__PURE__ */ n("a", { href: r.url, target: "_blank", rel: "noreferrer noopener", children: r.label }) : r.label }, r.key));
}
function R(e) {
  return m(e.content) || !e.contentConfigured && u(e).length > 0;
}
function m(e) {
  return a(e);
}
export {
  h as B,
  b as a,
  w as b,
  R as h
};
