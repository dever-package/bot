import {
  type FormEvent,
  type ReactNode,
  useEffect,
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
  const [showPassword, setShowPassword] = useState(false);
  const [mobileLinksOpen, setMobileLinksOpen] = useState(false);

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

  function switchMode() {
    if (loading) {
      return;
    }
    setMode((current) => (current === "login" ? "register" : "login"));
    setMessage("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) {
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
        setMessage(result.message || result.msg || "操作失败");
        return;
      }

      resetFrontRuntimeCache();
      auth.setUser(result.data.user);
      auth.setAccessToken(result.data.token);
      toast.success(
        mode === "login"
          ? `欢迎回来，${result.data.user?.name || payload.data.account}`
          : "账号已创建",
      );
      await navigateAfterLogin(navigate, readRedirectParam());
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
          <section className="bot-work-login-auth" aria-labelledby="login-title">
            <div className="bot-work-login-copy">
              <h1 id="login-title">{config.site.loginTitle}</h1>
              {config.site.loginDescription ? (
                <p>{config.site.loginDescription}</p>
              ) : null}
            </div>

            <section className="bot-work-login-form-panel">
              <ThirdPartyAccounts accounts={config.accounts} />

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
                  disabled={loading}
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
                <button type="button" disabled={loading} onClick={switchMode}>
                  {mode === "login" ? "注册" : "登录"}
                </button>
              </p>

              <p className="bot-work-login-legal">
                继续即表示您同意 {config.site.siteName} 的
                <span>服务条款</span>和<span>隐私政策</span>
              </p>
            </section>
          </section>

          <LoginArtwork siteName={config.site.siteName} />
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

function LoginArtwork({ siteName }: { siteName: string }) {
  return (
    <section className="bot-work-login-artwork" aria-label="创作灵感">
      <img src={LOGIN_ARTWORK_SRC} alt={`${siteName} 创作灵感插画`} />
    </section>
  );
}

function ThirdPartyAccounts({ accounts }: { accounts: BodyLoginAccount[] }) {
  if (accounts.length === 0) {
    return null;
  }

  return (
    <div className="bot-work-login-third-party">
      {accounts.map((account) => (
        <button
          key={account.id}
          type="button"
          onClick={() =>
            toast.info(
              account.provider === "feishu"
                ? "飞书账户登录将在接入配置后开放"
                : `${account.name}暂未开放`,
            )
          }
        >
          <BodyConfiguredImage
            src={account.icon}
            alt=""
            fallback={<PanelsTopLeft size={19} strokeWidth={1.9} />}
          />
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
