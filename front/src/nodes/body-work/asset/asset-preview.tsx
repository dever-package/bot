import {
  FileAudio,
  FileText,
  Film,
  Image as ImageIcon,
  Paperclip,
} from "lucide-react";
import { CanvasNodeContentView } from "../space/space-content-view";
import type { AssetKind } from "./asset-types";
import { assetKindLabel } from "./asset-contract";
import {
  assetPreviewOutput,
  assetPreviewText,
  findAssetMediaURL,
} from "./asset-content";

export function AssetPreview({
  kind,
  content,
  summary,
  compact = false,
}: {
  kind: AssetKind;
  content: unknown;
  summary?: string;
  compact?: boolean;
}) {
  if (!compact) {
    const output = assetPreviewOutput(kind, content);
    return (
      <CanvasNodeContentView
        output={output}
        fallback={summary || ""}
        emptyText="该版本暂无可预览内容"
        className="wb-asset-preview-content"
        markdownClassName="wb-asset-detail-prose"
        richClassName="wb-asset-detail-prose"
        mediaLayout="detail"
      />
    );
  }

  const mediaURL = findAssetMediaURL(content, kind);
  if (kind === "image" && mediaURL) {
    return <img src={mediaURL} alt="" loading="lazy" />;
  }
  if (kind === "video" && mediaURL) {
    return <video src={mediaURL} muted preload="metadata" />;
  }
  return (
    <div className="wb-asset-card-fallback">
      <AssetKindIcon kind={kind} />
      <p>{summary || assetPreviewText(content) || assetKindLabel(kind)}</p>
    </div>
  );
}

export function AssetKindIcon({ kind }: { kind: AssetKind }) {
  switch (kind) {
    case "image":
      return <ImageIcon aria-hidden="true" />;
    case "audio":
      return <FileAudio aria-hidden="true" />;
    case "video":
      return <Film aria-hidden="true" />;
    case "file":
      return <Paperclip aria-hidden="true" />;
    default:
      return <FileText aria-hidden="true" />;
  }
}
