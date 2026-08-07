import { Download, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getCompatModule } from "@dever/front-plugin";
import { resourceDownloadName } from "./resource-file";

type DownloadUploadFile = (file: {
  name: string;
  url: string;
  download: string;
}) => Promise<void>;

const { downloadUploadFile } = getCompatModule("@/lib/upload") as {
  downloadUploadFile?: DownloadUploadFile;
};

export function ResourceDownloadButton({
  url,
  name,
  label = "下载内容",
  className = "",
  iconSize = 17,
}: {
  url: string;
  name?: string;
  label?: string;
  className?: string;
  iconSize?: number;
}) {
  const [state, setState] = useState<"idle" | "downloading" | "error">(
    "idle",
  );

  useEffect(() => setState("idle"), [name, url]);

  const downloading = state === "downloading";
  const buttonLabel = state === "error" ? "下载失败，请重试" : label;

  async function download() {
    if (!url || downloading) return;
    setState("downloading");
    try {
      if (typeof downloadUploadFile !== "function") {
        throw new Error("当前页面未提供下载能力");
      }
      await downloadUploadFile({
        name: resourceDownloadName(url, name),
        url,
        download: url,
      });
      setState("idle");
    } catch (error) {
      console.error("[resource-download] 下载失败", error);
      setState("error");
    }
  }

  return (
    <button
      type="button"
      className={className}
      disabled={downloading}
      aria-busy={downloading || undefined}
      aria-label={buttonLabel}
      title={buttonLabel}
      onClick={() => void download()}
    >
      {downloading ? (
        <Loader2 size={iconSize} className="animate-spin" aria-hidden="true" />
      ) : (
        <Download size={iconSize} aria-hidden="true" />
      )}
    </button>
  );
}
