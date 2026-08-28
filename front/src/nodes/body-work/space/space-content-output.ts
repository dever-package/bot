import {
  contentOutputMediaCount,
  contentOutputMediaItems,
  hasContentOutput,
  normalizeContentOutputItems,
  type ContentMediaKind,
} from "../shared/content-output";
import { canvasContentNeedsRenderer } from "./space-content-classifier";

export type CanvasContentMediaPreview = {
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  fileUrl?: string;
};

export function contentOutputNeedsRenderer(
  output: unknown,
  preview?: CanvasContentMediaPreview,
) {
  if (isStandalonePreviewMediaOutput(output, preview)) {
    return false;
  }
  const mediaCount = contentOutputMediaCount(output);
  const items = normalizeContentOutputItems(output);
  const previewMedia = canvasPreviewMedia(preview);
  return canvasContentNeedsRenderer({
    items,
    mediaCount,
    previewMediaURL: previewMedia?.url,
    outputMediaURLs: previewMedia
      ? contentOutputMediaItems(output, previewMedia.kind).map(
          (item) => item.url,
        )
      : [],
  });
}

export function canvasMultiMediaGridOutput(
  output: unknown,
  kind?: ContentMediaKind,
) {
  if (!kind) {
    return null;
  }
  const items = contentOutputMediaItems(output, kind);
  return items.length > 1 ? { kind, items } : null;
}

export function canvasMediaGridKind(
  preview?: CanvasContentMediaPreview,
): ContentMediaKind | undefined {
  return canvasPreviewMedia(preview)?.kind;
}

function canvasPreviewMedia(preview?: CanvasContentMediaPreview) {
  if (preview?.videoUrl) {
    return { kind: "video" as const, url: preview.videoUrl };
  }
  if (preview?.imageUrl) {
    return { kind: "image" as const, url: preview.imageUrl };
  }
  if (preview?.audioUrl) {
    return { kind: "audio" as const, url: preview.audioUrl };
  }
  return undefined;
}

function isStandalonePreviewMediaOutput(
  output: unknown,
  preview?: CanvasContentMediaPreview,
) {
  const outputText = standaloneOutputText(output, new Set(), 0);
  if (!outputText || !preview) {
    return false;
  }
  return [
    preview.imageUrl,
    preview.videoUrl,
    preview.audioUrl,
    preview.fileUrl,
  ].some((url) => String(url || "").trim() === outputText);
}

function standaloneOutputText(
  value: unknown,
  seen: Set<object>,
  depth: number,
): string {
  if (value == null || depth > 12) {
    return "";
  }
  if (typeof value === "string") {
    return value.trim();
  }
  if (Array.isArray(value)) {
    return value.length === 1
      ? standaloneOutputText(value[0], seen, depth + 1)
      : "";
  }
  if (typeof value !== "object" || seen.has(value)) {
    return "";
  }
  seen.add(value);

  const record = value as Record<string, unknown>;
  const contentValues = Object.entries(record)
    .filter(
      ([key, item]) =>
        !["type", "kind", "format", "version"].includes(key) &&
        hasContentOutput(item),
    )
    .map(([, item]) => item);
  return contentValues.length === 1
    ? standaloneOutputText(contentValues[0], seen, depth + 1)
    : "";
}
