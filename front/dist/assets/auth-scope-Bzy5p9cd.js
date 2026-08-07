import { c as o } from "./createLucideIcon-fWv1XcFy.js";
import { u } from "./runtime-entry-ClkZDmNs.js";
const n = [
  ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1", key: "1wp1u1" }],
  ["path", { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8", key: "1s80jp" }],
  ["path", { d: "M10 12h4", key: "a56b0p" }]
], h = o("archive", n);
function p() {
  const t = u((e) => e.auth?.user);
  return i(t);
}
function i(t) {
  if (!t || typeof t != "object" || Array.isArray(t))
    return "";
  const e = t, r = Number(e.id || 0);
  if (Number.isFinite(r) && r > 0)
    return `user:${r}`;
  const c = String(e.account || "").trim();
  return c ? `account:${c}` : "";
}
export {
  h as A,
  p as u
};
