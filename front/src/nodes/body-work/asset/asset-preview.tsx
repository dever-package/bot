import {
  FileAudio,
  FileText,
  Film,
  Image as ImageIcon,
  Paperclip,
} from "lucide-react";
import { CanvasNodeContentView } from "../space/space-content-view";
import { richDocument } from "../space/space-model";
import type { AssetKind } from "./asset-types";
import { assetKindLabel } from "./asset-contract";

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
    const output = fullPreviewOutput(kind, content);
    return (
      <CanvasNodeContentView
        output={output}
        fallback={summary || ""}
        emptyText="该版本暂无可预览内容"
        className="wb-asset-preview-content"
      />
    );
  }

  const mediaURL = findMediaURL(content, kind);
  if (kind === "image" && mediaURL) {
    return <img src={mediaURL} alt="" loading="lazy" />;
  }
  if (kind === "video" && mediaURL) {
    return <video src={mediaURL} muted preload="metadata" />;
  }
  return (
    <div className="wb-asset-card-fallback">
      <AssetKindIcon kind={kind} />
      <p>{summary || previewText(content) || assetKindLabel(kind)}</p>
    </div>
  );
}

function fullPreviewOutput(kind: AssetKind, content: unknown) {
  const mediaField = mediaOutputFields[kind];
  const mediaURL = mediaField ? findMediaURL(content, kind) : "";
  if (mediaField && mediaURL) {
    return { [mediaField]: [mediaURL] };
  }
  const rich = richDocument(content);
  return rich ? { rich } : content;
}

const mediaOutputFields: Partial<Record<AssetKind, string>> = {
  image: "images",
  audio: "audios",
  video: "videos",
  file: "files",
};

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

function findMediaURL(value: unknown, kind: AssetKind, depth = 0): string {
  if (depth > 10 || value == null) return "";
  if (typeof value === "string") {
    return looksLikeURL(value) ? value : "";
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const url = findMediaURL(item, kind, depth + 1);
      if (url) return url;
    }
    return "";
  }
  if (typeof value !== "object") return "";
  const record = value as Record<string, unknown>;
  const keysByKind: Record<AssetKind, string[]> = {
    text: [],
    image: ["src", "url", "image", "image_url", "file_url"],
    audio: ["src", "url", "audio", "audio_url", "file_url"],
    video: ["src", "url", "video", "video_url", "file_url"],
    richtext: ["src", "url"],
    file: ["src", "url", "file", "file_url"],
  };
  for (const key of keysByKind[kind]) {
    const text = typeof record[key] === "string" ? String(record[key]) : "";
    if (looksLikeURL(text)) return text;
  }
  for (const key of ["content", "output", "result", "data", "attrs", "text"]) {
    const url = findMediaURL(record[key], kind, depth + 1);
    if (url) return url;
  }
  return "";
}

function previewText(value: unknown, depth = 0): string {
  if (depth > 8 || value == null) return "";
  if (typeof value === "string") return looksLikeURL(value) ? "" : value.trim();
  if (Array.isArray(value)) {
    return value.map((item) => previewText(item, depth + 1)).filter(Boolean)[0] || "";
  }
  if (typeof value !== "object") return "";
  const record = value as Record<string, unknown>;
  for (const key of ["summary", "title", "text", "caption", "content", "output", "result"]) {
    const text = previewText(record[key], depth + 1);
    if (text) return text;
  }
  return "";
}

function looksLikeURL(value: string) {
  return /^(https?:\/\/|\/|data:|blob:)/.test(value.trim());
}
