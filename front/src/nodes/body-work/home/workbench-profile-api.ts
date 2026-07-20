import { getCompatModule, request } from "@dever/front-plugin";
import { isSuccessResponse } from "../shared/api-response";

const PROFILE_AVATAR_RULE_ID = 1;
const PROFILE_AVATAR_MAX_SIZE = 10 * 1024 * 1024;
const PROFILE_AVATAR_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const { uploadFileByRule } = getCompatModule("@/lib/upload") as {
  uploadFileByRule?: (
    ruleID: number,
    file: File,
    options?: Record<string, unknown>,
  ) => Promise<{ id: string | number }>;
};

export type WorkbenchProfile = {
  id: number;
  name: string;
  account: string;
  mobile: string;
  avatar: string;
  avatarFileID: number;
};

export async function loadWorkbenchProfile() {
  const data = await profileRequest("profile", "get", undefined, "加载个人资料失败");
  return normalizeWorkbenchProfile(data.user);
}

export async function updateWorkbenchProfile(input: {
  name: string;
  avatarFileID: number;
}) {
  const data = await profileRequest(
    "profile",
    "post",
    {
      name: input.name,
      avatar_file_id: input.avatarFileID,
    },
    "保存个人资料失败",
  );
  return normalizeWorkbenchProfile(data.user);
}

export async function changeWorkbenchPassword(input: {
  currentPassword: string;
  newPassword: string;
}) {
  await profileRequest(
    "password",
    "post",
    {
      current_password: input.currentPassword,
      new_password: input.newPassword,
    },
    "修改密码失败",
  );
}

export async function uploadWorkbenchAvatar(userID: number, file: File) {
  validateWorkbenchAvatar(file);
  if (!uploadFileByRule) {
    throw new Error("当前页面缺少头像上传能力");
  }
  const uploaded = await uploadFileByRule(PROFILE_AVATAR_RULE_ID, file, {
    kind: "image",
    bizKey: `user_avatar_${userID}`,
    bizName: "用户头像",
  });
  const fileID = numberValue(uploaded.id);
  if (fileID <= 0) {
    throw new Error("头像上传失败");
  }
  return fileID;
}

export function validateWorkbenchAvatar(file: File) {
  if (!PROFILE_AVATAR_TYPES.has(file.type)) {
    throw new Error("头像仅支持 JPG、PNG 或 WebP 格式");
  }
  if (file.size > PROFILE_AVATAR_MAX_SIZE) {
    throw new Error("头像文件不能超过 10MB");
  }
}

async function profileRequest(
  path: string,
  method: "get" | "post",
  payload: Record<string, unknown> | undefined,
  fallback: string,
) {
  const result = await request(`/user/auth/${path}`, method, payload);
  if (!isSuccessResponse(result)) {
    throw new Error(String(result?.message || result?.msg || fallback));
  }
  return isRecord(result?.data) ? result.data : {};
}

function normalizeWorkbenchProfile(value: unknown): WorkbenchProfile {
  const profile = isRecord(value) ? value : {};
  return {
    id: numberValue(profile.id),
    name: textValue(profile.name),
    account: textValue(profile.account),
    mobile: textValue(profile.mobile),
    avatar: textValue(profile.avatar),
    avatarFileID: numberValue(profile.avatar_file_id),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function numberValue(value: unknown) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function textValue(value: unknown) {
  return value == null ? "" : String(value).trim();
}
