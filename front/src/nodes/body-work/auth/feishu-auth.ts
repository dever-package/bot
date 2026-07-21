const FEISHU_AUTHORIZE_URL =
  "https://open.feishu.cn/open-apis/authen/v1/authorize";
const FEISHU_AUTH_STORAGE_KEY = "bot.body.feishu-auth";
const FEISHU_AUTH_MAX_AGE = 10 * 60 * 1000;

type FeishuAccountConfig = {
  id: number;
  appID: string;
  configured: boolean;
};

type StoredFeishuAuth = {
  state: string;
  accountID: number;
  redirectTo: string;
  createdAt: number;
};

export type FeishuAuthCallback = {
  code: string;
  accountID: number;
  redirectTo: string;
};

export function startFeishuAuthorization(
  account: FeishuAccountConfig,
  redirectTo: string,
) {
  if (!account.configured || !account.appID.trim()) {
    throw new Error("飞书登录尚未配置，请联系管理员");
  }
  const state = createFeishuAuthState();
  const context: StoredFeishuAuth = {
    state,
    accountID: account.id,
    redirectTo: redirectTo.trim(),
    createdAt: Date.now(),
  };
  try {
    window.sessionStorage.setItem(
      FEISHU_AUTH_STORAGE_KEY,
      JSON.stringify(context),
    );
  } catch {
    throw new Error("浏览器无法保存飞书授权状态，请检查隐私设置");
  }

  const params = new URLSearchParams({
    app_id: account.appID.trim(),
    redirect_uri: feishuCallbackURL(),
    response_type: "code",
    state,
  });
  window.location.assign(`${FEISHU_AUTHORIZE_URL}?${params.toString()}`);
}

export function consumeFeishuAuthCallback(): FeishuAuthCallback | null {
  if (typeof window === "undefined") {
    return null;
  }
  const params = new URLSearchParams(window.location.search);
  const code = (params.get("code") || "").trim();
  const oauthError = (params.get("error") || "").trim();
  if (!code && !oauthError) {
    return null;
  }

  const returnedState = (params.get("state") || "").trim();
  const errorDescription = (params.get("error_description") || "").trim();
  const stored = readStoredFeishuAuth();
  clearFeishuAuthCallbackURL(params);
  try {
    window.sessionStorage.removeItem(FEISHU_AUTH_STORAGE_KEY);
  } catch {
    // The callback remains single-use in memory even when storage is blocked.
  }

  if (oauthError) {
    throw new Error(errorDescription || "飞书授权未完成");
  }
  const authAge = stored ? Date.now() - stored.createdAt : -1;
  if (
    !stored ||
    !Number.isFinite(stored.createdAt) ||
    !returnedState ||
    returnedState !== stored.state ||
    authAge < 0 ||
    authAge > FEISHU_AUTH_MAX_AGE
  ) {
    throw new Error("飞书授权状态已失效，请重新登录");
  }
  if (!Number.isFinite(stored.accountID) || stored.accountID <= 0) {
    throw new Error("飞书登录入口无效，请重新登录");
  }
  return {
    code,
    accountID: stored.accountID,
    redirectTo: stored.redirectTo,
  };
}

function createFeishuAuthState() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  const bytes = new Uint8Array(24);
  globalThis.crypto?.getRandomValues?.(bytes);
  const value = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  if (!value || /^0+$/.test(value)) {
    throw new Error("当前浏览器无法创建安全的飞书授权状态");
  }
  return value;
}

function readStoredFeishuAuth(): StoredFeishuAuth | null {
  try {
    const raw = window.sessionStorage.getItem(FEISHU_AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const value = JSON.parse(raw) as Partial<StoredFeishuAuth>;
    return {
      state: typeof value.state === "string" ? value.state : "",
      accountID: Number(value.accountID || 0),
      redirectTo: typeof value.redirectTo === "string" ? value.redirectTo : "",
      createdAt: Number(value.createdAt || 0),
    };
  } catch {
    return null;
  }
}

function feishuCallbackURL() {
  return new URL(window.location.pathname, window.location.origin).toString();
}

function clearFeishuAuthCallbackURL(params: URLSearchParams) {
  for (const key of ["code", "state", "error", "error_description"]) {
    params.delete(key);
  }
  const search = params.toString();
  const nextURL = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
  window.history.replaceState(window.history.state, "", nextURL);
}
