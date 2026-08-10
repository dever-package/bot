import { richDocument } from "../shared/rich-document";
import {
  looksLikeMarkdownSyntax,
  markdownCompatibleRichContent,
} from "../shared/content-output";
import {
  extractMediaContentItems,
  type MediaContentItem,
  type MediaContentKind,
} from "../shared/media-content";
import { resourceNameFromURL } from "../../shared/resource-file";
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

export type AssetMediaItem = MediaContentItem;

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

export function findAssetMediaURL(value: unknown, kind: AssetKind): string {
  return findAssetMediaURLs(value, kind)[0] || "";
}

export function findAssetMediaURLs(value: unknown, kind: AssetKind): string[] {
  return findAssetMediaItems(value, kind).map((item) => item.url);
}

export function findAssetMediaItems(
  value: unknown,
  kind: AssetKind,
): AssetMediaItem[] {
  return isMediaAssetKind(kind) ? extractMediaContentItems(value, kind) : [];
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

function isMediaAssetKind(kind: AssetKind): kind is MediaContentKind {
  return (
    kind === "image" ||
    kind === "video" ||
    kind === "audio" ||
    kind === "file"
  );
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
