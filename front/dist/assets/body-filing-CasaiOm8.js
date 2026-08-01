import { c as r, j as o } from "./createLucideIcon-CEtb6KSk.js";
import { h as s, B as t } from "./body-rich-text-DcI-dTud.js";
const u = [
  ["path", { d: "M4 5h16", key: "1tepv9" }],
  ["path", { d: "M4 12h16", key: "1lakjw" }],
  ["path", { d: "M4 19h16", key: "1djgab" }]
], y = r("menu", u);
function h({
  filing: e,
  className: c,
  fallback: n
}) {
  return /* @__PURE__ */ o(
    t,
    {
      value: e.content,
      className: c,
      fallback: e.contentConfigured ? void 0 : n
    }
  );
}
function a(e) {
  const c = [];
  return e.businessLicenseURL && c.push({
    key: "business-license",
    label: "营业执照",
    url: e.businessLicenseURL
  }), e.icpRecord && c.push({
    key: "icp-record",
    label: e.icpRecord,
    url: e.icpRecordURL
  }), e.publicSecurityRecord && c.push({
    key: "public-security-record",
    label: e.publicSecurityRecord,
    url: e.publicSecurityRecordURL
  }), e.companyName && c.push({ key: "company-name", label: e.companyName }), e.companyAddress && c.push({ key: "company-address", label: e.companyAddress }), c;
}
function i({
  filing: e,
  itemClassName: c
}) {
  return a(e).map((n) => /* @__PURE__ */ o("span", { className: c, children: n.url ? /* @__PURE__ */ o("a", { href: n.url, target: "_blank", rel: "noreferrer noopener", children: n.label }) : n.label }, n.key));
}
function b(e) {
  return d(e.content) || !e.contentConfigured && a(e).length > 0;
}
function d(e) {
  return s(e);
}
export {
  h as B,
  y as M,
  i as a,
  b as h
};
