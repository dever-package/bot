import {
  FileAudio,
  FileText,
  Film,
  Image as ImageIcon,
  Paperclip,
} from "lucide-react";
import { CanvasNodeContentView } from "../space/space-content-view";
import { AssetAudioPreview } from "./asset-audio-preview";
import { AssetFilePreview } from "./asset-file-preview";
import { AssetLazyCover } from "./asset-lazy-cover";
import { AssetTextCardPreview } from "./asset-text-card-preview";
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
  prompt,
  compact = false,
}: {
  kind: AssetKind;
  content: unknown;
  summary?: string;
  prompt?: string;
  compact?: boolean;
}) {
  const mediaURL = findAssetMediaURL(content, kind);
  if (!compact) {
    if (kind === "audio") {
      return <AssetAudioPreview src={mediaURL} prompt={prompt} detailed />;
    }
    if (kind === "file") {
      return <AssetFilePreview content={content} summary={summary} />;
    }
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

  if (kind === "image" && mediaURL) {
    return <AssetLazyCover kind="image" src={mediaURL} />;
  }
  if (kind === "video" && mediaURL) {
    return <AssetLazyCover kind="video" src={mediaURL} />;
  }
  if (kind === "audio") {
    return <AssetAudioPreview src={mediaURL} />;
  }
  if (kind === "file") {
    return <AssetFilePreview content={content} summary={summary} compact />;
  }
  if (kind === "text" || kind === "richtext") {
    return (
      <AssetTextCardPreview
        kind={kind}
        content={content}
        summary={summary}
      />
    );
  }
  return (
    <div className="wb-asset-card-fallback">
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
