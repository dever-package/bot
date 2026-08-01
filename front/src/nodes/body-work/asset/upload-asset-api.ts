import { getCompatModule, joinSiteApi, request } from "@dever/front-plugin";
import { isSuccessResponse } from "../shared/api-response";

export const BODY_UPLOAD_BIZ_KEY = "bot_work";
export const BODY_UPLOAD_BIZ_NAME = "神创工作台";

const bodyTextFileExtensions = new Set([
  "txt",
  "md",
  "markdown",
  "mdown",
  "mkd",
]);

export type BodyUploadedFile = {
  id: string | number;
};

export type BodyUploadedAsset = {
  sourceFile: File;
  uploadedFile: BodyUploadedFile & Record<string, unknown>;
  asset: Record<string, unknown>;
};

const { uploadFileByRule } = getCompatModule("@/lib/upload") as {
  uploadFileByRule?: (
    ruleID: number,
    file: File,
    options?: Record<string, unknown>,
  ) => Promise<BodyUploadedFile & Record<string, unknown>>;
};

export async function uploadBodyAssetFiles(input: {
  teamID: number;
  projectID?: number;
  files: File[];
  ruleID?: number;
  kind?: string;
}): Promise<BodyUploadedAsset[]> {
  if (!uploadFileByRule) {
    throw new Error("当前页面缺少上传能力");
  }

  const results: BodyUploadedAsset[] = [];
  for (const sourceFile of input.files) {
    const kind = normalizeUploadKind(input.kind) || bodyUploadKind(sourceFile);
    const ruleID = Number(input.ruleID || 0) || uploadRuleID(kind);
    const textContent = kind === "text" ? await sourceFile.text() : undefined;
    const uploadedFile = await uploadFileByRule(ruleID, sourceFile, {
      kind,
      bizKey: BODY_UPLOAD_BIZ_KEY,
      bizName: BODY_UPLOAD_BIZ_NAME,
      reportError: false,
    });
    const fileID = Number(uploadedFile.id || 0);
    const [asset] = await saveBodyUploadedAssets({
      teamID: input.teamID,
      projectID: input.projectID,
      files: [uploadedFile],
      textContents:
        textContent === undefined
          ? undefined
          : new Map([[fileID, textContent]]),
    });
    if (!asset) {
      throw new Error(`${sourceFile.name} 保存到资产库失败`);
    }
    results.push({ sourceFile, uploadedFile, asset });
  }
  return results;
}

export async function saveBodyUploadedAssets(input: {
  teamID: number;
  projectID?: number;
  files: BodyUploadedFile[];
  textContents?: ReadonlyMap<number, string>;
}): Promise<Record<string, unknown>[]> {
  const assets: Record<string, unknown>[] = [];
  const savedFileIDs = new Set<number>();
  for (const file of input.files) {
    const fileID = Number(file.id || 0);
    if (!Number.isFinite(fileID) || fileID <= 0) {
      throw new Error("上传文件标识无效");
    }
    if (savedFileIDs.has(fileID)) {
      continue;
    }
    const result = await request(
      joinSiteApi("workbench/upload_save_asset"),
      "post",
      {
        team_id: input.teamID,
        project_id: input.projectID || undefined,
        file_id: fileID,
        text_content: input.textContents?.get(fileID),
      },
      { reportError: false },
    );
    if (!isSuccessResponse(result)) {
      throw new Error(
        String(result?.message || result?.msg || "保存上传资产失败"),
      );
    }
    const asset = result?.data?.asset;
    if (!asset || typeof asset !== "object" || Array.isArray(asset)) {
      throw new Error("保存上传资产结果为空");
    }
    savedFileIDs.add(fileID);
    assets.push(asset as Record<string, unknown>);
  }
  return assets;
}

function bodyUploadKind(file: File) {
  const mime = String(file.type || "").toLowerCase();
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (
    ["text/plain", "text/markdown", "text/x-markdown"].includes(mime) ||
    bodyTextFileExtensions.has(fileExtension(file.name))
  ) {
    return "text";
  }
  return "file";
}

function normalizeUploadKind(value: string | undefined) {
  const kind = String(value || "").toLowerCase();
  return ["image", "video", "audio", "text", "file"].includes(kind)
    ? kind
    : "";
}

function uploadRuleID(kind: string) {
  if (kind === "image") return 1;
  if (kind === "video") return 2;
  if (kind === "audio") return 3;
  return 7;
}

function fileExtension(name: string) {
  const normalized = String(name || "").trim().toLowerCase();
  const index = normalized.lastIndexOf(".");
  return index >= 0 ? normalized.slice(index + 1) : "";
}
