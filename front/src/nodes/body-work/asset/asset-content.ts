import { richDocument } from "../shared/rich-document";
import {
  looksLikeMarkdownSyntax,
  markdownCompatibleRichContent,
} from "../shared/content-output";
import { resourceNameFromURL } from "../../shared/resource-file";
import type { AssetKind, AssetVersion } from "./asset-types";

const mediaOutputFields: Partial<Record<AssetKind, string>> = {
  image: "images",
  audio: "audios",
  video: "videos",
  file: "files",
};

const mediaCollectionFields: Partial<Record<AssetKind, string[]>> = {
  image: ["images", "image_urls", "imageUrls"],
  audio: ["audios", "audio_urls", "audioUrls"],
  video: ["videos", "video_urls", "videoUrls"],
  file: ["files", "file_urls", "fileUrls"],
};

export type AssetFileInfo = {
  url: string;
  name: string;
  extension: string;
};

export function assetPreviewOutput(kind: AssetKind, content: unknown) {
  const mediaField = mediaOutputFields[kind];
  const mediaURLs = mediaField ? findAssetMediaURLs(content, kind) : [];
  if (mediaField && mediaURLs.length > 0) {
    return { [mediaField]: mediaURLs };
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
): string {
  return findAssetMediaURLs(value, kind)[0] || "";
}

export function findAssetMediaURLs(value: unknown, kind: AssetKind): string[] {
  const result: string[] = [];
  collectAssetMediaURLs(value, kind, 0, result, new Set());
  return result;
}

export function assetMediaCount(value: unknown, kind: AssetKind): number {
  if (!mediaOutputFields[kind]) {
    return 0;
  }
  const discoveredCount = findAssetMediaURLs(value, kind).length;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return discoveredCount;
  }
  const declaredCount = Number(
    (value as Record<string, unknown>).media_count || 0,
  );
  return Math.max(
    discoveredCount,
    Number.isFinite(declaredCount) ? Math.trunc(declaredCount) : 0,
  );
}

function collectAssetMediaURLs(
  value: unknown,
  kind: AssetKind,
  depth: number,
  result: string[],
  seen: Set<string>,
) {
  if (depth > 12 || value == null) return;
  if (typeof value === "string") {
    const url = value.trim();
    if (
      (url.startsWith("{") || url.startsWith("[") || url.startsWith('"')) &&
      url.length > 1
    ) {
      try {
        collectAssetMediaURLs(
          JSON.parse(url),
          kind,
          depth + 1,
          result,
          seen,
        );
        return;
      } catch {
        // Keep legacy plain-string media values on the normal URL path.
      }
    }
    if (looksLikeURL(url) && !seen.has(url)) {
      seen.add(url);
      result.push(url);
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      collectAssetMediaURLs(item, kind, depth + 1, result, seen);
    }
    return;
  }
  if (typeof value !== "object") return;
  const record = value as Record<string, unknown>;
  const explicitKind = assetContentMediaKind(record);
  const keysByKind: Record<AssetKind, string[]> = {
    collection: [],
    text: [],
    image: [
      "src",
      "url",
      "image",
      "image_url",
      "imageUrl",
      "file_url",
      "fileUrl",
    ],
    audio: [
      "src",
      "url",
      "audio",
      "audio_url",
      "audioUrl",
      "file_url",
      "fileUrl",
    ],
    video: [
      "src",
      "url",
      "video",
      "video_url",
      "videoUrl",
      "file_url",
      "fileUrl",
    ],
    richtext: ["src", "url"],
    file: [
      "src",
      "url",
      "file",
      "file_url",
      "fileUrl",
      "download",
      "open_url",
      "path",
    ],
  };
  if (!explicitKind || explicitKind === kind) {
    for (const key of keysByKind[kind]) {
      collectAssetMediaURLs(record[key], kind, depth + 1, result, seen);
    }
  }
  for (const key of mediaCollectionFields[kind] || []) {
    collectAssetMediaURLs(record[key], kind, depth + 1, result, seen);
  }
  if (explicitKind === kind) {
    collectAssetMediaURLs(record.attrs, kind, depth + 1, result, seen);
  }
  const nestedKeys = [
    "content",
    "output",
    "result",
    "data",
    "body",
    "value",
    "json",
    "rich",
    "media_files",
    "mediaFiles",
    "text",
  ];
  for (const key of nestedKeys) {
    collectAssetMediaURLs(record[key], kind, depth + 1, result, seen);
  }
}

function assetContentMediaKind(record: Record<string, unknown>): AssetKind | "" {
  const value = [record.type, record.kind, record.media_type, record.mime]
    .map((item) => String(item || "").trim().toLowerCase())
    .find(Boolean);
  if (!value) return "";
  if (value.includes("image")) return "image";
  if (value.includes("video")) return "video";
  if (value.includes("audio") || value.includes("music")) return "audio";
  if (value.includes("file")) return "file";
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
  const name = findAssetFileName(content) || resourceNameFromURL(url);
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

function looksLikeURL(value: string) {
  return /^(https?:\/\/|\/|data:|blob:)/.test(value.trim());
}
