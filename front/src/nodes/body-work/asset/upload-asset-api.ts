import { joinSiteApi, request } from "@dever/front-plugin";
import { isSuccessResponse } from "../shared/api-response";

export const BODY_UPLOAD_BIZ_KEY = "bot_work";
export const BODY_UPLOAD_BIZ_NAME = "神创工作台";

export type BodyUploadedFile = {
  id: string | number;
};

export async function saveBodyUploadedAssets(input: {
  teamID: number;
  projectID?: number;
  files: BodyUploadedFile[];
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
      },
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
