import { getCompatModule } from "@dever/front-plugin";
import {
  BODY_UPLOAD_BIZ_KEY,
  BODY_UPLOAD_BIZ_NAME,
  saveBodyUploadedAssets,
  type BodyUploadedFile,
} from "../asset/upload-asset-api";
import type { UploadPreview } from "./space-prompt-composer";

type SpaceUploadedFile = BodyUploadedFile & Record<string, unknown>;

const { uploadFileByRule } = getCompatModule("@/lib/upload") as {
  uploadFileByRule?: (
    ruleID: number,
    file: File,
    options?: Record<string, unknown>,
  ) => Promise<SpaceUploadedFile>;
};

export async function uploadSpaceFiles(input: {
  projectID: number;
  teamID: number;
  files: File[];
  ruleID?: number;
}): Promise<UploadPreview[]> {
  if (!uploadFileByRule) {
    throw new Error("当前画布缺少上传能力");
  }
  const configuredRuleID = Number(input.ruleID || 0);
  const previews: UploadPreview[] = [];
  for (const file of input.files) {
    const uploadRuleID =
      configuredRuleID > 0 ? configuredRuleID : uploadRuleIDFromFile(file);
    const completed = await uploadFileByRule(uploadRuleID, file, {
      kind: uploadKindFromFile(file),
      bizKey: BODY_UPLOAD_BIZ_KEY,
      bizName: BODY_UPLOAD_BIZ_NAME,
    });
    const [asset] = await saveBodyUploadedAssets({
      teamID: input.teamID,
      projectID: input.projectID,
      files: [completed],
    });
    previews.push(uploadPreviewFromPayload(completed, file, asset));
  }
  return previews;
}

function uploadRuleIDFromFile(file: File) {
  const kind = uploadKindFromFile(file);
  if (kind === "image") return 1;
  if (kind === "video") return 2;
  if (kind === "audio") return 3;
  return 4;
}

function uploadKindFromFile(file: File) {
  const mime = String(file.type || "").toLowerCase();
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  return "file";
}

function uploadPreviewFromPayload(
  payload: SpaceUploadedFile,
  file: File,
  asset: Record<string, unknown>,
): UploadPreview {
  const url = String(
    payload?.url || payload?.open_url || payload?.download || "",
  );
  const kind = String(payload?.kind || uploadKindFromFile(file));
  return {
    name: String(payload?.name || file.name),
    alias: String(payload?.name || file.name),
    kind,
    source: "upload",
    type: String(payload?.mime || file.type || kind),
    url,
    text: String(payload?.name || file.name),
    output: payload,
    asset,
  };
}
