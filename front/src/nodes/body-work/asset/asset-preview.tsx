import {
  FileAudio,
  FileText,
  Film,
  FolderOpen,
  Image as ImageIcon,
  Paperclip,
} from "lucide-react";
import { BodyContentView } from "../shared/content-view";
import { MediaInspector } from "../../shared/media-inspector-gallery";
import { AssetAudioPreview } from "./asset-audio-preview";
import { AssetFilePreview } from "./asset-file-preview";
import { AssetLazyCover } from "./asset-lazy-cover";
import { AssetTextCardPreview } from "./asset-text-card-preview";
import type { AssetKind } from "./asset-types";
import { assetKindLabel } from "./asset-contract";
import {
  assetPreviewOutput,
  assetPreviewText,
  findAssetMediaURLs,
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
  const mediaURLs = findAssetMediaURLs(content, kind);
  const mediaURL = mediaURLs[0] || "";
  if (!compact) {
    if ((kind === "image" || kind === "video") && mediaURLs.length > 0) {
      return (
        <MediaInspector
          kind={kind}
          urls={mediaURLs}
          downloadable
          className="wb-asset-media-gallery"
        />
      );
    }
    if (kind === "audio") {
      return <AssetAudioPreview src={mediaURL} prompt={prompt} detailed />;
    }
    if (kind === "file") {
      return <AssetFilePreview content={content} summary={summary} />;
    }
    const output = assetPreviewOutput(kind, content);
    return (
      <BodyContentView
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
    case "collection":
      return <FolderOpen aria-hidden="true" />;
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
