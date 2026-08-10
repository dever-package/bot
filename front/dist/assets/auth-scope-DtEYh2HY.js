import { m as o } from "./project-dialogs-CdThoMTm.js";
const n = o.useAuthStore;
function i() {
  const t = n((r) => r.auth?.user);
  return c(t);
}
function c(t) {
  if (!t || typeof t != "object" || Array.isArray(t))
    return "";
  const r = t, e = Number(r.id || 0);
  if (Number.isFinite(e) && e > 0)
    return `user:${e}`;
  const u = String(r.account || "").trim();
  return u ? `account:${u}` : "";
}
export {
  i as u
};
