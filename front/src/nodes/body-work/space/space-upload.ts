import { getCompatModule } from "@dever/front-plugin";
import {
  completeSpaceUpload,
  initSpaceUpload,
  uploadSpacePart,
} from "./space-api";
import { saveBodyUploadedAssets } from "../asset/upload-asset-api";
import type { UploadPreview } from "./space-prompt-composer";

const { digestUploadFile, uploadFileDirect } = getCompatModule("@/lib/upload") as {
  digestUploadFile?: (file: File) => Promise<string>;
  uploadFileDirect?: (
    file: File,
    direct: unknown,
    onProgress?: (loaded: number, total: number) => void,
  ) => Promise<void>;
};

export async function uploadSpaceFiles(
  input: {
    projectID: number;
    teamID: number;
    files: File[];
    ruleID?: number;
  },
): Promise<UploadPreview[]> {
  const uploadRuleId = Number(input.ruleID || 0);
  if (uploadRuleId <= 0) {
    throw new Error("当前节点未配置上传规则");
  }
  const previews: UploadPreview[] = [];
  for (const file of input.files) {
    const hash = await computeSpaceUploadHash(file);
    const init = await initSpaceUpload({
      projectId: input.projectID,
      ruleId: uploadRuleId,
      name: file.name,
      size: file.size,
      mime: file.type,
      hash,
      kind: uploadKindFromFile(file),
    });
    if (String(init.transport || "relay").toLowerCase() === "direct") {
      if (!uploadFileDirect) {
        throw new Error("当前导入入口缺少前端直传能力");
      }
      await uploadFileDirect(file, init.direct);
    } else {
      const chunkSize = Math.max(1, Number(init.chunk_size || file.size || 1));
      const chunkTotal = Math.max(
        1,
        Number(init.chunk_total || Math.ceil(file.size / chunkSize)),
      );
      for (let index = 0; index < chunkTotal; index += 1) {
        const start = index * chunkSize;
        const end = Math.min(file.size, start + chunkSize);
        await uploadSpacePart({
          projectId: input.projectID,
          sessionId: Number(init.session_id || 0),
          partNumber: index + 1,
          file: file.slice(start, end),
        });
      }
    }
    const completed = await completeSpaceUpload({
      projectId: input.projectID,
      sessionId: Number(init.session_id || 0),
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

async function computeSpaceUploadHash(file: File) {
  const hash = digestUploadFile ? await digestUploadFile(file) : "";
  if (!hash) {
    throw new Error("文件标识生成失败，请重新选择文件");
  }
  return hash;
}

function uploadKindFromFile(file: File) {
  const mime = String(file.type || "").toLowerCase();
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  return "file";
}

function uploadPreviewFromPayload(
  payload: any,
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
