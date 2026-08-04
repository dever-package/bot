import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  type RefObject,
} from "react";
import {
  Camera,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  useAuthStore,
} from "@dever/front-plugin";
import { WorkbenchAvatar } from "./workbench-avatar";
import { requestErrorMessage as errorMessage } from "../shared/api-response";
import {
  changeWorkbenchPassword,
  loadWorkbenchProfile,
  updateWorkbenchProfile,
  uploadWorkbenchAvatar,
  validateWorkbenchAvatar,
  type WorkbenchProfile,
} from "./workbench-profile-api";

type ProfileSection = "profile" | "security";

export function WorkbenchProfileDialog({
  open,
  roleLabel,
  onOpenChange,
  onPasswordChanged,
}: {
  open: boolean;
  roleLabel: string;
  onOpenChange: (open: boolean) => void;
  onPasswordChanged: () => void;
}) {
  const auth = useAuthStore((state: any) => state.auth);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [section, setSection] = useState<ProfileSection>("profile");
  const [profile, setProfile] = useState<WorkbenchProfile>(() =>
    cachedProfile(auth.user),
  );
  const [name, setName] = useState(profile.name);
  const [pendingAvatar, setPendingAvatar] = useState<File | null>(null);
  const [pendingAvatarURL, setPendingAvatarURL] = useState("");
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }
    let active = true;
    const initial = cachedProfile(auth.user);
    setProfile(initial);
    setName(initial.name);
    resetDrafts();
    setLoading(true);
    void loadWorkbenchProfile()
      .then((loaded) => {
        if (!active) return;
        setProfile(loaded);
        setName(loaded.name);
        auth.setUser({ ...auth.user, ...profileUserPayload(loaded) });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setMessage(errorMessage(error, "加载个人资料失败"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    if (!pendingAvatar) {
      setPendingAvatarURL("");
      return;
    }
    const objectURL = URL.createObjectURL(pendingAvatar);
    setPendingAvatarURL(objectURL);
    return () => URL.revokeObjectURL(objectURL);
  }, [pendingAvatar]);

  const avatarURL = pendingAvatarURL || (avatarRemoved ? "" : profile.avatar);

  function resetDrafts() {
    setSection("profile");
    setPendingAvatar(null);
    setAvatarRemoved(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswords(false);
    setMessage("");
  }

  function changeSection(nextSection: ProfileSection) {
    if (submitting) return;
    setSection(nextSection);
    setMessage("");
  }

  function selectAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      validateWorkbenchAvatar(file);
      setPendingAvatar(file);
      setAvatarRemoved(false);
      setMessage("");
    } catch (error: unknown) {
      setMessage(errorMessage(error, "头像文件不可用"));
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || loading) return;
    if (section === "profile") {
      await saveProfile();
      return;
    }
    await savePassword();
  }

  async function saveProfile() {
    const nextName = name.trim();
    if (!nextName) {
      setMessage("请输入昵称");
      return;
    }
    if (Array.from(nextName).length > 64) {
      setMessage("昵称不能超过 64 个字符");
      return;
    }
    if (profile.id <= 0) {
      setMessage("用户信息不完整，请刷新页面后重试");
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      const avatarFileID = pendingAvatar
        ? await uploadWorkbenchAvatar(profile.id, pendingAvatar)
        : avatarRemoved
          ? 0
          : profile.avatarFileID;
      const updated = await updateWorkbenchProfile({
        name: nextName,
        avatarFileID,
      });
      auth.setUser({ ...auth.user, ...profileUserPayload(updated) });
      setProfile(updated);
      toast.success("个人资料已更新");
      onOpenChange(false);
    } catch (error: unknown) {
      setMessage(errorMessage(error, "保存个人资料失败"));
    } finally {
      setSubmitting(false);
    }
  }

  async function savePassword() {
    if (!currentPassword) {
      setMessage("请输入当前密码");
      return;
    }
    if (Array.from(newPassword).length < 6) {
      setMessage("新密码不能少于 6 位");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("两次输入的新密码不一致");
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      await changeWorkbenchPassword({ currentPassword, newPassword });
      toast.success("密码已修改，请重新登录");
      onPasswordChanged();
    } catch (error: unknown) {
      setMessage(errorMessage(error, "修改密码失败"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={submitting ? undefined : onOpenChange}>
      <DialogContent className="hb-profile-modal sm:max-w-xl">
        <DialogHeader className="hb-profile-modal-header">
          <DialogTitle>个人信息</DialogTitle>
          <DialogDescription>
            管理公开资料与登录安全设置。
          </DialogDescription>
        </DialogHeader>

        <div className="hb-profile-tabs" aria-label="个人信息设置">
          <button
            type="button"
            className={section === "profile" ? "is-active" : ""}
            aria-pressed={section === "profile"}
            onClick={() => changeSection("profile")}
          >
            <UserRound />
            基本资料
          </button>
          <button
            type="button"
            className={section === "security" ? "is-active" : ""}
            aria-pressed={section === "security"}
            onClick={() => changeSection("security")}
          >
            <KeyRound />
            账号安全
          </button>
        </div>

        <form className="hb-profile-form" onSubmit={submit}>
          <div className="hb-profile-form-body">
            {section === "profile" ? (
              <ProfileBasicsSection
                profile={profile}
                name={name}
                avatarURL={avatarURL}
                roleLabel={roleLabel}
                fileInputRef={fileInputRef}
                disabled={loading || submitting}
                onNameChange={setName}
                onAvatarChange={selectAvatar}
                onChooseAvatar={() => fileInputRef.current?.click()}
                onRemoveAvatar={() => {
                  setPendingAvatar(null);
                  setAvatarRemoved(true);
                }}
              />
            ) : (
              <ProfileSecuritySection
                currentPassword={currentPassword}
                newPassword={newPassword}
                confirmPassword={confirmPassword}
                showPasswords={showPasswords}
                disabled={submitting}
                onCurrentPasswordChange={setCurrentPassword}
                onNewPasswordChange={setNewPassword}
                onConfirmPasswordChange={setConfirmPassword}
                onTogglePasswords={() =>
                  setShowPasswords((current) => !current)
                }
              />
            )}

            {loading ? (
              <div className="hb-profile-status" role="status">
                <Loader2 className="is-spinning" />
                正在读取最新资料
              </div>
            ) : message ? (
              <div className="hb-profile-status is-error" role="alert">
                {message}
              </div>
            ) : null}
          </div>

          <DialogFooter className="hb-profile-modal-footer">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading || submitting}>
              {submitting ? <Loader2 className="is-spinning" /> : null}
              {submitting
                ? section === "profile"
                  ? "保存中"
                  : "修改中"
                : section === "profile"
                  ? "保存资料"
                  : "修改密码"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ProfileBasicsSection({
  profile,
  name,
  avatarURL,
  roleLabel,
  fileInputRef,
  disabled,
  onNameChange,
  onAvatarChange,
  onChooseAvatar,
  onRemoveAvatar,
}: {
  profile: WorkbenchProfile;
  name: string;
  avatarURL: string;
  roleLabel: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  disabled: boolean;
  onNameChange: (name: string) => void;
  onAvatarChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onChooseAvatar: () => void;
  onRemoveAvatar: () => void;
}) {
  return (
    <>
      <section className="hb-profile-avatar-section">
        <WorkbenchAvatar
          src={avatarURL}
          name={name}
          account={profile.account}
          className="hb-profile-avatar"
        />
        <div>
          <strong>头像</strong>
          <span>支持 JPG、PNG、WebP，文件不超过 10MB。</span>
          <div className="hb-profile-avatar-actions">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={onChooseAvatar}
            >
              <Camera />
              更换头像
            </Button>
            {avatarURL ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled}
                onClick={onRemoveAvatar}
              >
                <Trash2 />
                移除
              </Button>
            ) : null}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            hidden
            onChange={onAvatarChange}
          />
        </div>
      </section>

      <ProfileField label="昵称" htmlFor="hb-profile-name">
        <Input
          id="hb-profile-name"
          value={name}
          maxLength={64}
          autoComplete="name"
          disabled={disabled}
          placeholder="输入昵称"
          onChange={(event) => onNameChange(event.target.value)}
        />
      </ProfileField>

      <div className="hb-profile-readonly-grid">
        <ReadonlyField label="手机号" value={profile.account || "未设置"} />
        <ReadonlyField label="账号角色" value={roleLabel} />
      </div>
    </>
  );
}

function ProfileSecuritySection({
  currentPassword,
  newPassword,
  confirmPassword,
  showPasswords,
  disabled,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onTogglePasswords,
}: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showPasswords: boolean;
  disabled: boolean;
  onCurrentPasswordChange: (password: string) => void;
  onNewPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onTogglePasswords: () => void;
}) {
  return (
    <section className="hb-profile-security">
      <div className="hb-profile-security-note">
        <ShieldCheck />
        <span>
          修改密码后，当前账号在所有设备上的登录状态都会失效，需要重新登录。
        </span>
      </div>
      <PasswordField
        id="hb-current-password"
        label="当前密码"
        value={currentPassword}
        autoComplete="current-password"
        show={showPasswords}
        disabled={disabled}
        onChange={onCurrentPasswordChange}
        onToggle={onTogglePasswords}
      />
      <PasswordField
        id="hb-new-password"
        label="新密码"
        value={newPassword}
        autoComplete="new-password"
        show={showPasswords}
        disabled={disabled}
        onChange={onNewPasswordChange}
        onToggle={onTogglePasswords}
      />
      <PasswordField
        id="hb-confirm-password"
        label="确认新密码"
        value={confirmPassword}
        autoComplete="new-password"
        show={showPasswords}
        disabled={disabled}
        onChange={onConfirmPasswordChange}
        onToggle={onTogglePasswords}
      />
    </section>
  );
}

function ProfileField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label className="hb-profile-field" htmlFor={htmlFor}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="hb-profile-readonly-field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  autoComplete,
  show,
  disabled,
  onChange,
  onToggle,
}: {
  id: string;
  label: string;
  value: string;
  autoComplete: string;
  show: boolean;
  disabled: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}) {
  return (
    <ProfileField label={label} htmlFor={id}>
      <span className="hb-profile-password-input">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          autoComplete={autoComplete}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          aria-label={show ? "隐藏密码" : "显示密码"}
          title={show ? "隐藏密码" : "显示密码"}
          onClick={onToggle}
        >
          {show ? <EyeOff /> : <Eye />}
        </button>
      </span>
    </ProfileField>
  );
}

function cachedProfile(user: any): WorkbenchProfile {
  return {
    id: Number(user?.id || 0),
    name: String(user?.name || ""),
    account: String(user?.account || ""),
    avatar: String(user?.avatar || ""),
    avatarFileID: Number(user?.avatar_file_id || 0),
  };
}

function profileUserPayload(profile: WorkbenchProfile) {
  return {
    id: profile.id,
    name: profile.name,
    account: profile.account,
    avatar: profile.avatar,
    avatar_file_id: profile.avatarFileID,
  };
}
