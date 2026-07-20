import { ExternalLink, FileText } from "lucide-react";
import { assetFileInfo } from "./asset-content";

export function AssetFilePreview({
  content,
  summary,
  compact = false,
}: {
  content: unknown;
  summary?: string;
  compact?: boolean;
}) {
  const file = assetFileInfo(content);
  const name = file.name || summary || "文件";
  const extension = file.extension ? file.extension.toUpperCase() : "FILE";
  const type = file.extension ? `${file.extension.toUpperCase()} 文件` : "文件";

  if (compact) {
    return (
      <div className="wb-asset-file-card-preview">
        <strong>{extension}</strong>
        <p title={name}>{name}</p>
        <span>文件</span>
      </div>
    );
  }

  return (
    <section className="wb-asset-file-preview">
      <span className="wb-asset-file-icon">
        <FileText aria-hidden="true" />
      </span>
      <div className="wb-asset-file-copy">
        <strong title={name}>{name}</strong>
        <span>{type}</span>
      </div>
      {file.url ? (
        <a href={file.url} target="_blank" rel="noreferrer">
          <ExternalLink aria-hidden="true" />
          <span>打开文件</span>
        </a>
      ) : (
        <span className="wb-asset-file-unavailable">文件暂不可用</span>
      )}
    </section>
  );
}
