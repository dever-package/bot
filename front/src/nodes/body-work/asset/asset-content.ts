import { richDocument } from "../space/space-model";
import type { AssetKind } from "./asset-types";

const mediaOutputFields: Partial<Record<AssetKind, string>> = {
  image: "images",
  audio: "audios",
  video: "videos",
  file: "files",
};

export function assetPreviewOutput(kind: AssetKind, content: unknown) {
  const mediaField = mediaOutputFields[kind];
  const mediaURL = mediaField ? findAssetMediaURL(content, kind) : "";
  if (mediaField && mediaURL) {
    return { [mediaField]: [mediaURL] };
  }
  const rich = richDocument(content);
  return rich ? { rich } : content;
}

export function findAssetMediaURL(
  value: unknown,
  kind: AssetKind,
  depth = 0,
): string {
  if (depth > 10 || value == null) return "";
  if (typeof value === "string") {
    return looksLikeURL(value) ? value : "";
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const url = findAssetMediaURL(item, kind, depth + 1);
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
    const url = findAssetMediaURL(record[key], kind, depth + 1);
    if (url) return url;
  }
  return "";
}

export function assetPreviewText(value: unknown, depth = 0): string {
  if (depth > 8 || value == null) return "";
  if (typeof value === "string") return looksLikeURL(value) ? "" : value.trim();
  if (Array.isArray(value)) {
    return (
      value
        .map((item) => assetPreviewText(item, depth + 1))
        .filter(Boolean)[0] || ""
    );
  }
  if (typeof value !== "object") return "";
  const record = value as Record<string, unknown>;
  for (const key of [
    "summary",
    "title",
    "text",
    "caption",
    "content",
    "output",
    "result",
  ]) {
    const text = assetPreviewText(record[key], depth + 1);
    if (text) return text;
  }
  return "";
}

function looksLikeURL(value: string) {
  return /^(https?:\/\/|\/|data:|blob:)/.test(value.trim());
}
