import {
  type FormEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Eye,
  EyeOff,
  Languages,
  Loader2,
  Menu,
  PanelsTopLeft,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Input,
  joinSiteApi,
  loadMainInfo,
  request,
  resetFrontRuntimeCache,
  resolvePostLoginTarget,
  useAuthStore,
  useNavigate,
} from "@dever/front-plugin";
import { isSuccessResponse } from "../shared/api-response";
import { BodyToaster } from "../shared/body-toaster";
import "../shared/body-theme.css";
import { BodyConfiguredImage, BodySiteBrand } from "./site-brand";
import {
  consumeFeishuAuthCallback,
  startFeishuAuthorization,
} from "./feishu-auth";
import {
  applyBodySiteMetadata,
  type BodyLoginAccount,
  type BodyLoginConfig,
  useBodyLoginConfig,
} from "./site-config";
import "./login-page.css";

const LOGIN_ARTWORK_SRC = new URL(
  "./assets/login-artwork.png",
  import.meta.url,
).href;

type AuthMode = "login" | "register";

type AuthPayload = {
  account: string;
  password: string;
  name?: string;
};

type CompleteLoginOptions = {
  fallbackName: string;
  redirectTo: string;
  successMessage?: string;
};

export function WorkLoginPage() {
  const config = useBodyLoginConfig();
  const navigate = useNavigate();
  const { auth } = useAuthStore();
  const [mode, setMode] = useState<AuthMode>("login");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [thirdPartyLoadingID, setThirdPartyLoadingID] = useState<number | null>(
    null,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [mobileLinksOpen, setMobileLinksOpen] = useState(false);
  const feishuCallbackHandled = useRef(false);
  const busy = loading || thirdPartyLoadingID !== null;

  const completeLogin = useCallback(
    async (data: any, options: CompleteLoginOptions) => {
      if (!data?.token) {
        throw new Error("登录返回缺少 token");
      }
      resetFrontRuntimeCache();
      auth.setUser(data.user);
      auth.setAccessToken(data.token);
      toast.success(
        options.successMessage ||
          `欢迎回来，${data.user?.name || options.fallbackName}`,
      );
      await navigateAfterLogin(navigate, options.redirectTo);
    },
    [auth, navigate],
  );

  useEffect(() => {
    applyBodySiteMetadata(config.site);
  }, [config.site]);

  useEffect(() => {
    if (!mobileLinksOpen) {
      return;
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileLinksOpen(false);
      }
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileLinksOpen]);

  useEffect(() => {
    if (feishuCallbackHandled.current) {
      return;
    }

    let callback: ReturnType<typeof consumeFeishuAuthCallback>;
    try {
      callback = consumeFeishuAuthCallback();
    } catch (currentError: unknown) {
      feishuCallbackHandled.current = true;
      const errorMessage =
        currentError instanceof Error && currentError.message
          ? currentError.message
          : "飞书登录失败，请重新尝试";
      setMessage(errorMessage);
      toast.error(errorMessage);
      return;
    }
    if (!callback) {
      return;
    }
    const authCallback = callback;

    feishuCallbackHandled.current = true;
    setThirdPartyLoadingID(authCallback.accountID);
    setMessage("");
    void (async () => {
      try {
        const result = await request(joinSiteApi("login/feishu"), "post", {
          account_id: authCallback.accountID,
          code: authCallback.code,
        });
        if (!isSuccessResponse(result) || !result.data?.token) {
          throw new Error(result?.message || result?.msg || "飞书登录失败");
        }
        await completeLogin(result.data, {
          fallbackName: "飞书用户",
          redirectTo: authCallback.redirectTo,
        });
      } catch (currentError: unknown) {
        const errorMessage =
          currentError instanceof Error && currentError.message
            ? currentError.message
            : "飞书登录失败，请稍后重试";
        setMessage(errorMessage);
        toast.error(errorMessage);
      } finally {
        setThirdPartyLoadingID(null);
      }
    })();
  }, [completeLogin]);

  function switchMode() {
    if (busy) {
      return;
    }
    setMode((current) => (current === "login" ? "register" : "login"));
    setMessage("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) {
      return;
    }

    const payload = buildAuthPayload(mode, account, password, name);
    if (payload.error || !payload.data) {
      setMessage(payload.error);
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const result = await request(
        mode === "login" ? "/user/auth/login" : "/user/auth/register",
        "post",
        payload.data,
      );
      if (!isSuccessResponse(result) || !result.data?.token) {
        setMessage(result?.message || result?.msg || "操作失败");
        return;
      }

      await completeLogin(result.data, {
        fallbackName: payload.data.account,
        redirectTo: readRedirectParam(),
        successMessage: mode === "register" ? "账号已创建" : undefined,
      });
    } catch (currentError: unknown) {
      setMessage(
        currentError instanceof Error && currentError.message
          ? currentError.message
          : "操作失败，请稍后重试",
      );
    } finally {
      setLoading(false);
    }
  }

  function startThirdPartyLogin(account: BodyLoginAccount) {
    if (busy) {
      return;
    }
    if (account.provider !== "feishu") {
      toast.info(`${account.name}暂未开放`);
      return;
    }

    setMessage("");
    setThirdPartyLoadingID(account.id);
    try {
      startFeishuAuthorization(account, readRedirectParam());
    } catch (currentError: unknown) {
      const errorMessage =
        currentError instanceof Error && currentError.message
          ? currentError.message
          : "飞书登录发起失败";
      setMessage(errorMessage);
      setThirdPartyLoadingID(null);
      toast.error(errorMessage);
    }
  }

  return (
    <main className="bot-work-login-page">
      <BodyToaster />
      <LoginHeader
        config={config}
        mobileLinksOpen={mobileLinksOpen}
        onCloseMobileLinks={() => setMobileLinksOpen(false)}
        onToggleMobileLinks={() => setMobileLinksOpen((open) => !open)}
      />

      <div className="bot-work-login-stage">
        <div className="bot-work-login-layout">
          <LoginArtwork
            image={config.site.loginImage}
            siteName={config.site.siteName}
          />

          <section className="bot-work-login-auth" aria-labelledby="login-title">
            <div className="bot-work-login-copy">
              <h1 id="login-title">{config.site.loginTitle}</h1>
              {config.site.loginDescription ? (
                <p>{config.site.loginDescription}</p>
              ) : null}
            </div>

            <section className="bot-work-login-form-panel">
              <ThirdPartyAccounts
                accounts={config.accounts}
                disabled={busy}
                loadingID={thirdPartyLoadingID}
                onSelect={startThirdPartyLogin}
              />

              {config.accounts.length > 0 ? (
                <div className="bot-work-login-divider">
                  <span>或</span>
                </div>
              ) : null}

              <form className="bot-work-login-form" onSubmit={submit}>
                <AuthField label="账号">
                  <Input
                    value={account}
                    autoComplete="username"
                    placeholder="输入手机号或账号"
                    aria-label="账号"
                    className="bot-work-login-input"
                    onChange={(event) => setAccount(event.target.value)}
                  />
                </AuthField>

                {mode === "register" ? (
                  <AuthField label="昵称">
                    <Input
                      value={name}
                      autoComplete="name"
                      placeholder="输入昵称"
                      aria-label="昵称"
                      className="bot-work-login-input"
                      onChange={(event) => setName(event.target.value)}
                    />
                  </AuthField>
                ) : null}

                <AuthField label="密码">
                  <span className="bot-work-login-password">
                    <Input
                      value={password}
                      type={showPassword ? "text" : "password"}
                      autoComplete={
                        mode === "login" ? "current-password" : "new-password"
                      }
                      placeholder="至少 6 位"
                      aria-label="密码"
                      className="bot-work-login-input"
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "隐藏密码" : "显示密码"}
                      title={showPassword ? "隐藏密码" : "显示密码"}
                      onClick={() => setShowPassword((show) => !show)}
                    >
                      {showPassword ? (
                        <EyeOff size={17} strokeWidth={1.8} />
                      ) : (
                        <Eye size={17} strokeWidth={1.8} />
                      )}
                    </button>
                  </span>
                </AuthField>

                {message ? (
                  <div className="bot-work-login-message" role="alert">
                    {message}
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="bot-work-login-submit"
                  disabled={busy}
                >
                  {loading ? (
                    <Loader2 className="bot-work-login-spin" />
                  ) : null}
                  <span>
                    {loading
                      ? "处理中"
                      : mode === "login"
                        ? "登录"
                        : "注册"}
                  </span>
                </button>
              </form>

              <p className="bot-work-login-mode-switch">
                <span>{mode === "login" ? "还没有账号？" : "已经有账号？"}</span>
                <button type="button" disabled={busy} onClick={switchMode}>
                  {mode === "login" ? "注册" : "登录"}
                </button>
              </p>

              <p className="bot-work-login-legal">
                继续即表示您同意 {config.site.siteName} 的
                <span>服务条款</span>和<span>隐私政策</span>
              </p>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}

function LoginHeader({
  config,
  mobileLinksOpen,
  onCloseMobileLinks,
  onToggleMobileLinks,
}: {
  config: BodyLoginConfig;
  mobileLinksOpen: boolean;
  onCloseMobileLinks: () => void;
  onToggleMobileLinks: () => void;
}) {
  return (
    <header className="bot-work-login-header">
      <div className="bot-work-login-header-inner">
        <BodySiteBrand
          site={config.site}
          className="bot-work-login-brand"
          logoClassName="bot-work-login-brand-logo"
          nameClassName="bot-work-login-brand-name"
        />

        <nav className="bot-work-login-links" aria-label="站点链接">
          {config.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target={link.target}
              rel={link.target === "_blank" ? "noreferrer" : undefined}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="bot-work-login-header-actions">
          {config.links.length > 0 ? (
            <button
              type="button"
              className="bot-work-login-menu-button"
              aria-label={mobileLinksOpen ? "关闭站点链接" : "打开站点链接"}
              aria-controls="bot-work-login-mobile-links"
              aria-expanded={mobileLinksOpen}
              onClick={onToggleMobileLinks}
            >
              {mobileLinksOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          ) : null}
          <span className="bot-work-login-language" aria-label="当前语言：中文">
            <Languages size={15} strokeWidth={1.8} />
            中文
          </span>
        </div>
      </div>

      {mobileLinksOpen && config.links.length > 0 ? (
        <nav
          id="bot-work-login-mobile-links"
          className="bot-work-login-mobile-links"
          aria-label="移动端站点链接"
        >
          {config.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target={link.target}
              rel={link.target === "_blank" ? "noreferrer" : undefined}
              onClick={onCloseMobileLinks}
            >
              {link.name}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

function LoginArtwork({
  image,
  siteName,
}: {
  image: string;
  siteName: string;
}) {
  const alt = `${siteName} 登录页展示图`;
  return (
    <section className="bot-work-login-artwork" aria-label="创作灵感">
      <BodyConfiguredImage
        src={image}
        alt={alt}
        fallback={<img src={LOGIN_ARTWORK_SRC} alt={alt} />}
      />
    </section>
  );
}

function ThirdPartyAccounts({
  accounts,
  disabled,
  loadingID,
  onSelect,
}: {
  accounts: BodyLoginAccount[];
  disabled: boolean;
  loadingID: number | null;
  onSelect: (account: BodyLoginAccount) => void;
}) {
  if (accounts.length === 0) {
    return null;
  }

  return (
    <div className="bot-work-login-third-party">
      {accounts.map((account) => (
        <button
          key={account.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(account)}
        >
          {loadingID === account.id ? (
            <Loader2 className="bot-work-login-spin" size={19} />
          ) : (
            <BodyConfiguredImage
              src={account.icon}
              alt=""
              fallback={<PanelsTopLeft size={19} strokeWidth={1.9} />}
            />
          )}
          <span>{account.name}</span>
        </button>
      ))}
    </div>
  );
}

function AuthField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="bot-work-login-field">
      <span className="bot-work-login-field-label">{label}</span>
      {children}
    </label>
  );
}

function buildAuthPayload(
  mode: AuthMode,
  account: string,
  password: string,
  name: string,
): { error: string; data: AuthPayload | null } {
  const normalizedAccount = account.trim();
  const normalizedPassword = password.trim();
  const normalizedName = name.trim();

  if (!normalizedAccount || !normalizedPassword) {
    return { error: "请输入账号和密码", data: null };
  }
  if (normalizedPassword.length < 6) {
    return { error: "密码不能少于 6 位", data: null };
  }

  return {
    error: "",
    data: {
      account: normalizedAccount,
      password: normalizedPassword,
      ...(mode === "register"
        ? { name: normalizedName || normalizedAccount }
        : {}),
    },
  };
}

function readRedirectParam() {
  if (typeof window === "undefined") {
    return "";
  }
  return new URLSearchParams(window.location.search).get("redirect") || "";
}

async function navigateAfterLogin(
  navigate: ReturnType<typeof useNavigate>,
  redirectTo: string,
) {
  try {
    const mainInfo = await loadMainInfo();
    const target = resolvePostLoginTarget({
      redirectTo,
      entry: mainInfo.entry,
      menu: mainInfo.menu,
    });
    navigate({ to: target.to, search: target.search, replace: true });
  } catch {
    navigate({ to: "/", replace: true });
  }
}
