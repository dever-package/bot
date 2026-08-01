import { e as n } from "./runtime-entry-CIrzyMsA.js";
function s() {
  const t = n((r) => r.auth?.user);
  return o(t);
}
function o(t) {
  if (!t || typeof t != "object" || Array.isArray(t))
    return "";
  const r = t, e = Number(r.id || 0);
  if (Number.isFinite(e) && e > 0)
    return `user:${e}`;
  const u = String(r.account || "").trim();
  return u ? `account:${u}` : "";
}
export {
  s as u
};
