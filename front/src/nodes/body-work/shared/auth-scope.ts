import { useAuthStore } from "@dever/front-plugin";

export function useAuthUserScopeKey() {
  const user = useAuthStore((state: any) => state.auth?.user);
  return authUserScopeKey(user);
}

export function authUserScopeKey(user: unknown) {
  if (!user || typeof user !== "object" || Array.isArray(user)) {
    return "";
  }

  const current = user as Record<string, unknown>;
  const userID = Number(current.id || 0);
  if (Number.isFinite(userID) && userID > 0) {
    return `user:${userID}`;
  }

  const account = String(current.account || "").trim();
  return account ? `account:${account}` : "";
}
