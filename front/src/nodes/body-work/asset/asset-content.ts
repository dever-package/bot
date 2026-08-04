import { richDocument } from "../shared/rich-document";
import {
  looksLikeMarkdownSyntax,
  markdownCompatibleRichContent,
} from "../shared/content-output";
import type { AssetKind, AssetVersion } from "./asset-types";

const mediaOutputFields: Partial<Record<AssetKind, string>> = {
  image: "images",
  audio: "audios",
  video: "videos",
  file: "files",
};

export type AssetFileInfo = {
  url: string;
  name: string;
  extension: string;
};

export function assetPreviewOutput(kind: AssetKind, content: unknown) {
  const mediaField = mediaOutputFields[kind];
  const mediaURL = mediaField ? findAssetMediaURL(content, kind) : "";
  if (mediaField && mediaURL) {
    return { [mediaField]: [mediaURL] };
  }
  const rich = richDocument(content);
  if (!rich) {
    return content;
  }
  const markdown = markdownCompatibleRichContent(rich);
  if (
    markdown &&
    (kind === "text" || looksLikeMarkdownSyntax(markdown.plainText))
  ) {
    return { text: markdown.markdown };
  }
  return { rich };
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
    collection: [],
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
  const nestedKeys = [
    mediaOutputFields[kind],
    "content",
    "output",
    "result",
    "data",
    "attrs",
    "text",
  ].filter((key): key is string => Boolean(key));
  for (const key of nestedKeys) {
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

export function assetVersionPrompt(version: AssetVersion | null | undefined) {
  const prompt = version?.source?.prompt;
  return typeof prompt === "string" ? prompt.trim() : "";
}

export function assetFileInfo(content: unknown): AssetFileInfo {
  const url = findAssetMediaURL(content, "file");
  const name = findAssetFileName(content) || fileNameFromURL(url);
  const extension = name.match(/\.([a-z0-9]{1,10})$/i)?.[1] || "";
  return { url, name, extension };
}

function findAssetFileName(value: unknown, depth = 0): string {
  if (value == null || depth > 8) return "";
  if (typeof value === "string") {
    const text = value.trim();
    return looksLikeURL(text) ? "" : text;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const name = findAssetFileName(item, depth + 1);
      if (name) return name;
    }
    return "";
  }
  if (typeof value !== "object") return "";
  const record = value as Record<string, unknown>;
  for (const key of [
    "name",
    "file_name",
    "fileName",
    "filename",
    "label",
    "title",
  ]) {
    const name = findAssetFileName(record[key], depth + 1);
    if (name) return name;
  }
  for (const key of [
    "file",
    "files",
    "attrs",
    "data",
    "content",
    "output",
    "result",
  ]) {
    const name = findAssetFileName(record[key], depth + 1);
    if (name) return name;
  }
  return "";
}

function fileNameFromURL(url: string) {
  if (!url || /^(data|blob):/.test(url)) return "";
  const path = url.split(/[?#]/, 1)[0];
  const encodedName = path.slice(path.lastIndexOf("/") + 1);
  if (!encodedName) return "";
  try {
    return decodeURIComponent(encodedName);
  } catch {
    return encodedName;
  }
}

function looksLikeURL(value: string) {
  return /^(https?:\/\/|\/|data:|blob:)/.test(value.trim());
}
