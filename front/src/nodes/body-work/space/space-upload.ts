import { uploadBodyAssetFiles } from "../asset/upload-asset-api";
import type { UploadPreview } from "./space-prompt-composer";

type SpaceUploadedFile = Record<string, unknown>;

export async function uploadSpaceFiles(input: {
  projectID: number;
  teamID: number;
  files: File[];
  ruleID?: number;
}): Promise<UploadPreview[]> {
  const uploaded = await uploadBodyAssetFiles({
    teamID: input.teamID,
    projectID: input.projectID,
    files: input.files,
    ruleID: input.ruleID,
  });
  return uploaded.map(({ sourceFile, uploadedFile, asset }) =>
    uploadPreviewFromPayload(uploadedFile, sourceFile, asset),
  );
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
