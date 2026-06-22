import { type FormEvent, type ReactNode, useState } from "react";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Card,
  Input,
  SiteLogo,
  getSiteConfig,
  loadMainInfo,
  request,
  resetFrontRuntimeCache,
  resolvePostLoginTarget,
  useAuthStore,
  useNavigate,
} from "@dever/front-plugin";
import { isSuccessResponse } from "../shared/api-response";

type AuthMode = "login" | "register";
type AuthPayload = {
  account: string;
  password: string;
  name?: string;
};

export function WorkLoginPage() {
  const site = getSiteConfig();
  const navigate = useNavigate();
  const redirect = readRedirectParam();
  const { auth } = useAuthStore();
  const [mode, setMode] = useState<AuthMode>("login");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

      const mainInfo = await loadMainInfo();
      const target = resolvePostLoginTarget({
        redirectTo: redirect,
        entry: mainInfo.entry,
        menu: mainInfo.menu,
      });
      navigate({ to: target.to, search: target.search, replace: true });
      toast.success(
        mode === "login"
          ? `欢迎回来，${result.data.user?.name || payload.data.account}`
          : "账号已创建",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <WorkLoginStyles />
      <main className="bot-work-auth-shell">
        <section className="bot-work-auth-aside">
          <div className="bot-work-auth-aside-content">
            <div className="bot-work-auth-mark">
              <Sparkles className="size-7" aria-hidden="true" />
            </div>
            <p className="bot-work-auth-kicker">
              AI Creative Workspace
            </p>
            <h1 className="bot-work-auth-title">
              神创 Work 工作台
            </h1>
            <p className="bot-work-auth-description">
              创建项目，编排能力节点和智能体流程，把每一次生成结果沉淀为可复用的项目资产。
            </p>
            <div className="bot-work-auth-features">
              {["项目工作台", "能力编排", "资产沉淀"].map((item) => (
                <div
                  key={item}
                  className="bot-work-auth-feature"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bot-work-auth-panel">
          <div className="bot-work-auth-form-wrap">
            <div className="bot-work-auth-mobile-brand">
              <SiteLogo className="bot-work-auth-mobile-logo" />
              <div>
                <p className="bot-work-auth-mobile-name">
                  {site.name || "工作台"}
                </p>
                <p className="bot-work-auth-mobile-desc">AI 工作台</p>
              </div>
            </div>

            <Card className="bot-work-auth-card">
              <div className="bot-work-auth-card-header">
                <div>
                  <p className="bot-work-auth-card-eyebrow">项目账号</p>
                  <h2 className="bot-work-auth-card-title">
                    {mode === "login" ? "登录" : "创建账号"}
                  </h2>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="bot-work-auth-mode-button"
                  onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    setMessage("");
                  }}
                >
                  {mode === "login" ? "注册" : "登录"}
                </Button>
              </div>

              <form className="bot-work-auth-form" onSubmit={submit}>
                <AuthField label="账号">
                  <Input
                    value={account}
                    onChange={(event) => setAccount(event.target.value)}
                    autoComplete="username"
                    placeholder="输入手机号或账号"
                    className="h-11"
                  />
                </AuthField>

                {mode === "register" ? (
                  <AuthField label="昵称">
                    <Input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      autoComplete="name"
                      placeholder="项目中显示的名字"
                      className="h-11"
                    />
                  </AuthField>
                ) : null}

                <AuthField label="密码">
                  <Input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    placeholder="至少 6 位"
                    type="password"
                    className="h-11"
                  />
                </AuthField>

                {message ? (
                  <div className="bot-work-auth-message">
                    {message}
                  </div>
                ) : null}

                <Button
                  className="bot-work-auth-submit"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                  {loading
                    ? "处理中"
                    : mode === "login"
                      ? "进入工作台"
                      : "注册并进入"}
                  {!loading ? <ArrowRight className="size-4" /> : null}
                </Button>
              </form>
            </Card>
          </div>
        </section>
      </main>
    </>
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
    <label className="bot-work-auth-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function WorkLoginStyles() {
  return <style>{WORK_LOGIN_STYLES}</style>;
}

const WORK_LOGIN_STYLES = `
.bot-work-auth-shell {
  min-height: 100svh;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(26rem, 30rem);
  overflow: hidden;
  background: var(--background);
  color: var(--foreground);
}

.bot-work-auth-aside {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  border-right: 1px solid var(--border);
  background:
    linear-gradient(90deg, color-mix(in oklab, var(--border) 55%, transparent) 1px, transparent 1px),
    linear-gradient(0deg, color-mix(in oklab, var(--border) 45%, transparent) 1px, transparent 1px),
    color-mix(in oklab, var(--card) 92%, var(--muted) 8%);
  background-size: 4rem 4rem;
  padding: 4rem clamp(3rem, 7vw, 6rem);
}

.bot-work-auth-aside-content {
  width: 100%;
  max-width: 42rem;
}

.bot-work-auth-mark {
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  color: var(--primary);
  background: color-mix(in oklab, var(--primary) 10%, transparent);
  border: 1px solid color-mix(in oklab, var(--primary) 14%, transparent);
}

.bot-work-auth-kicker {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--primary);
  font-size: .875rem;
  font-weight: 600;
}

.bot-work-auth-title {
  max-width: 42rem;
  color: var(--foreground);
  font-size: clamp(2.5rem, 5vw, 4.25rem);
  line-height: 1.08;
  font-weight: 700;
}

.bot-work-auth-description {
  margin-top: 1.5rem;
  max-width: 36rem;
  color: var(--muted-foreground);
  font-size: 1.125rem;
  line-height: 1.85;
}

.bot-work-auth-features {
  margin-top: 2.5rem;
  max-width: 36rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: .75rem;
}

.bot-work-auth-feature {
  border: 1px solid var(--border);
  border-radius: .75rem;
  background: color-mix(in oklab, var(--background) 76%, transparent);
  padding: .75rem 1rem;
  color: var(--foreground);
  font-size: .875rem;
  font-weight: 500;
}

.bot-work-auth-panel {
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--background);
}

.bot-work-auth-form-wrap {
  width: 100%;
  max-width: 28rem;
}

.bot-work-auth-mobile-brand {
  display: none;
  align-items: center;
  justify-content: center;
  gap: .75rem;
  margin-bottom: 1.75rem;
}

.bot-work-auth-mobile-logo {
  width: 2rem;
  height: 2rem;
}

.bot-work-auth-mobile-name {
  max-width: 16rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--foreground);
  font-size: 1.125rem;
  font-weight: 700;
}

.bot-work-auth-mobile-desc {
  color: var(--muted-foreground);
  font-size: .75rem;
}

.bot-work-auth-card {
  display: block;
  gap: 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid color-mix(in oklab, var(--border) 88%, transparent);
  border-radius: 1rem;
  background: var(--card);
  box-shadow: 0 24px 70px rgb(15 23 42 / 10%);
}

.bot-work-auth-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  border-bottom: 1px solid var(--border);
  padding: 1.5rem;
}

.bot-work-auth-card-eyebrow {
  margin-bottom: .5rem;
  color: var(--muted-foreground);
  font-size: .875rem;
}

.bot-work-auth-card-title {
  color: var(--foreground);
  font-size: 1.5rem;
  line-height: 1.25;
  font-weight: 700;
}

.bot-work-auth-mode-button {
  flex-shrink: 0;
}

.bot-work-auth-form {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
}

.bot-work-auth-field {
  display: grid;
  gap: .5rem;
}

.bot-work-auth-field > span {
  color: var(--foreground);
  font-size: .875rem;
  font-weight: 600;
}

.bot-work-auth-message {
  border: 1px solid color-mix(in oklab, var(--destructive) 30%, transparent);
  border-radius: .5rem;
  background: color-mix(in oklab, var(--destructive) 10%, transparent);
  padding: .5rem .75rem;
  color: var(--destructive);
  font-size: .875rem;
}

.bot-work-auth-submit {
  width: 100%;
  height: 2.75rem;
  gap: .5rem;
}

@media (max-width: 1023px) {
  .bot-work-auth-shell {
    grid-template-columns: minmax(0, 1fr);
  }

  .bot-work-auth-aside {
    display: none;
  }

  .bot-work-auth-mobile-brand {
    display: flex;
  }
}

@media (max-width: 640px) {
  .bot-work-auth-panel {
    padding: 1.25rem;
  }

  .bot-work-auth-card-header,
  .bot-work-auth-form {
    padding: 1.25rem;
  }
}
`;

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
