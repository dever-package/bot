import type { AssetKind as LibraryAssetKind } from "../asset/asset-types";
import type { PowerParam } from "./types";

export type CanvasMediaKind = "image" | "video" | "audio" | "file";

const CANVAS_MEDIA_KINDS = new Set<CanvasMediaKind>([
  "image",
  "video",
  "audio",
  "file",
]);

export function isUploadPowerParam(param: PowerParam) {
  return param.type === "file" || param.type === "files";
}

export function acceptedAssetKinds(param: PowerParam): LibraryAssetKind[] {
  const configured = Array.from(
    new Set(
      (param.accepted_kinds || param.asset_kinds || [])
        .map(normalizeAssetKind)
        .filter((kind): kind is LibraryAssetKind => Boolean(kind)),
    ),
  );
  if (configured.length > 0) {
    return configured;
  }

  const name = `${param.name || ""} ${param.key || ""}`.toLowerCase();
  if (/video|视频/.test(name)) {
    return ["video"];
  }
  if (/audio|music|音频|音乐/.test(name)) {
    return ["audio"];
  }
  if (/image|img|photo|picture|图片|图像|参考图|首帧|尾帧/.test(name)) {
    return ["image"];
  }
  if (/text|文本|提示词|文案/.test(name)) {
    return ["file"];
  }
  return ["image", "audio", "video", "file"];
}

export function acceptedMediaKinds(param: PowerParam): CanvasMediaKind[] {
  return (param.accepted_kinds || []).map(normalizeAssetKind).filter(
    (kind): kind is CanvasMediaKind =>
      Boolean(kind) && CANVAS_MEDIA_KINDS.has(kind as CanvasMediaKind),
  );
}

export function normalizeCanvasMediaKind(
  value: unknown,
): CanvasMediaKind | undefined {
  const kind = normalizeAssetKind(value);
  return kind && CANVAS_MEDIA_KINDS.has(kind as CanvasMediaKind)
    ? (kind as CanvasMediaKind)
    : undefined;
}

export function mediaParamCapacity(param: PowerParam) {
  if (param.type !== "files") {
    return 1;
  }
  return Math.max(0, Number(param.max_files || 0));
}

function normalizeAssetKind(value: unknown): LibraryAssetKind | undefined {
  const kind = String(value || "").toLowerCase();
  if (kind === "rich") return "richtext";
  if (kind === "music") return "audio";
  return [
    "collection",
    "text",
    "image",
    "audio",
    "video",
    "richtext",
    "file",
  ].includes(kind)
    ? (kind as LibraryAssetKind)
    : undefined;
}
