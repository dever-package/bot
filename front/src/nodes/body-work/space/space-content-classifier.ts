export type CanvasContentRenderFacts = {
  items: unknown[];
  mediaCount: number;
  previewMediaURL?: string;
  outputMediaURLs?: string[];
};

const CONTENT_RENDERER_FIELDS = [
  "title",
  "text",
  "reasoning",
  "progress",
  "error",
  "json",
] as const;

const RICH_MEDIA_NODE_TYPES = new Set([
  "audio",
  "editormediaaudio",
  "editormediaembed",
  "editormediaexternal",
  "editormediaimage",
  "editormediavideo",
  "externalmedia",
  "image",
  "mediaaudio",
  "mediaembed",
  "mediaexternal",
  "mediaimage",
  "mediavideo",
  "video",
]);

const RICH_VISIBLE_LEAF_NODE_TYPES = new Set([
  "agentabilityplaceholder",
  "agenttaskplaceholder",
  "horizontalrule",
]);

export function canvasContentNeedsRenderer({
  items,
  mediaCount,
  previewMediaURL,
  outputMediaURLs = [],
}: CanvasContentRenderFacts) {
  if (items.length > 1 || mediaCount > 1) {
    return true;
  }
  const hasMatchingSinglePreviewMedia =
    mediaCount === 1 &&
    normalizedText(previewMediaURL) !== "" &&
    outputMediaURLs.length === 1 &&
    normalizedText(outputMediaURLs[0]) === normalizedText(previewMediaURL);
  return items.some((item) =>
    contentItemNeedsRenderer(item, hasMatchingSinglePreviewMedia),
  );
}

function contentItemNeedsRenderer(
  item: unknown,
  hasMatchingSinglePreviewMedia: boolean,
) {
  if (!isPlainRecord(item)) {
    return hasContent(item);
  }
  if (CONTENT_RENDERER_FIELDS.some((field) => hasContent(item[field]))) {
    return true;
  }
  if (!hasContent(item.rich)) {
    return false;
  }
  return (
    !hasMatchingSinglePreviewMedia ||
    richContentHasVisibleNonMedia(item.rich, new Set<object>(), 0)
  );
}

function richContentHasVisibleNonMedia(
  value: unknown,
  seen: Set<object>,
  depth: number,
): boolean {
  if (value == null || value === "") {
    return false;
  }
  if (depth > 32) {
    return true;
  }
  if (typeof value === "string") {
    const text = value.trim();
    if (!text) {
      return false;
    }
    try {
      return richContentHasVisibleNonMedia(
        JSON.parse(text),
        seen,
        depth + 1,
      );
    } catch {
      return true;
    }
  }
  if (Array.isArray(value)) {
    return value.some((item) =>
      richContentHasVisibleNonMedia(item, seen, depth + 1),
    );
  }
  if (!isPlainRecord(value)) {
    return true;
  }
  if (seen.has(value)) {
    return true;
  }
  seen.add(value);

  const type = normalizedRichNodeType(value.type);
  if (type === "text") {
    return normalizedText(value.text) !== "";
  }
  if (RICH_MEDIA_NODE_TYPES.has(type)) {
    const attrs = isPlainRecord(value.attrs) ? value.attrs : undefined;
    return hasContent(attrs?.caption);
  }
  if (RICH_VISIBLE_LEAF_NODE_TYPES.has(type)) {
    return true;
  }
  return Array.isArray(value.content)
    ? value.content.some((item) =>
        richContentHasVisibleNonMedia(item, seen, depth + 1),
      )
    : false;
}

function hasContent(value: unknown) {
  if (value == null) {
    return false;
  }
  if (typeof value === "string") {
    return value.trim() !== "";
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === "object") {
    return Object.keys(value).length > 0;
  }
  return true;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function normalizedRichNodeType(value: unknown) {
  return normalizedText(value)
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function normalizedText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
