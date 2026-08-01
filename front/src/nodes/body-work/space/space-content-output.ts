import { getCompatModule } from "@dever/front-plugin";

type PlainRichNode = {
  type?: unknown;
  text?: unknown;
  marks?: unknown;
  attrs?: Record<string, unknown>;
  content?: PlainRichNode[];
};

type PlainRichDocument = PlainRichNode & {
  content: PlainRichNode[];
};

export type CanvasContentMediaKind = "image" | "video" | "audio";

const CANVAS_CONTENT_MEDIA_KINDS: CanvasContentMediaKind[] = [
  "image",
  "video",
  "audio",
];

const CANVAS_CONTENT_MEDIA_FIELDS: Record<
  CanvasContentMediaKind,
  readonly string[]
> = {
  image: ["image", "image_url", "imageUrl", "images", "imageUrls"],
  video: ["video", "video_url", "videoUrl", "videos", "videoUrls"],
  audio: ["audio", "audio_url", "audioUrl", "audios", "audioUrls"],
};

type ContentOutputModule = {
  normalizeEnergonOutput?: (output: any) => any[];
};

const contentOutputModule = getCompatModule(
  "@/components/energon/content-view",
) as ContentOutputModule;

export const normalizeEnergonOutput =
  contentOutputModule.normalizeEnergonOutput;

export function plainMarkdownTextFromRichOutput(value: unknown) {
  const content = markdownCompatibleRichContent(value);
  if (!content || content.hasMedia) {
    return "";
  }
  return content.markdown;
}

export function markdownCompatibleRichContent(value: unknown) {
  const rich = plainRichDocument(value);
  if (!rich || !isMarkdownCompatibleRichNode(rich)) {
    return null;
  }
  return {
    markdown: rich.content
      .map(markdownCompatibleRichNodeText)
      .join("\n\n")
      .trim(),
    plainText: rich.content
      .map(markdownCompatibleRichNodePlainText)
      .join("\n\n")
      .trim(),
    hasMedia: richNodeHasMedia(rich),
  };
}

export function looksLikeMarkdownSyntax(value: string) {
  return (
    /(^|\n)\s*(#{1,6}\s|[-*+]\s|>\s|\d+\.\s|```)/m.test(value) ||
    /(\*\*[^*]+\*\*|__[^_]+__|\[[^\]]+\]\([^)]+\)|`[^`]+`)/.test(
      value,
    )
  );
}

export function contentOutputHasMedia(output: unknown) {
  return contentOutputMediaKinds(output).length > 0;
}

export function contentOutputMediaKinds(output: unknown) {
  const media = contentOutputMediaIndex(output);
  return CANVAS_CONTENT_MEDIA_KINDS.filter((kind) => media[kind].size > 0);
}

export function contentOutputMediaCount(output: unknown) {
  const media = contentOutputMediaIndex(output);
  return CANVAS_CONTENT_MEDIA_KINDS.reduce(
    (total, kind) => total + media[kind].size,
    0,
  );
}

export function contentOutputMediaURLs(
  output: unknown,
  kind: CanvasContentMediaKind,
) {
  return Array.from(contentOutputMediaIndex(output)[kind]);
}

export function preferRicherMediaOutput(...values: unknown[]) {
  let fallback: unknown;
  let selected: unknown;
  let selectedMediaCount = 0;
  for (const value of values) {
    if (!hasCanvasContent(value)) {
      continue;
    }
    if (fallback === undefined) {
      fallback = value;
    }
    const mediaCount = contentOutputMediaCount(value);
    if (mediaCount > selectedMediaCount) {
      selected = value;
      selectedMediaCount = mediaCount;
    }
  }
  return selectedMediaCount > 0 ? selected : fallback;
}

export function hasCanvasContent(value: unknown) {
  if (value == null || value === "") {
    return false;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === "object") {
    return Object.keys(value).length > 0;
  }
  return true;
}

function contentOutputMediaIndex(output: unknown) {
  const media: Record<CanvasContentMediaKind, Set<string>> = {
    image: new Set<string>(),
    video: new Set<string>(),
    audio: new Set<string>(),
  };
  const seen = new Set<object>();
  for (const item of normalizeContentOutputItems(output)) {
    collectContentMedia(item, media, seen, 0);
  }
  return media;
}

export function normalizeContentOutputItems(output: unknown): unknown[] {
  if (!hasCanvasContent(output)) {
    return [];
  }
  const normalized = normalizeEnergonOutput?.(output);
  if (Array.isArray(normalized) && normalized.length > 0) {
    return normalized;
  }
  return Array.isArray(output) ? output : [output];
}

function collectContentMedia(
  value: unknown,
  media: Record<CanvasContentMediaKind, Set<string>>,
  seen: Set<object>,
  depth: number,
  fieldKind?: CanvasContentMediaKind,
): void {
  if (value == null || depth > 12) {
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) =>
      collectContentMedia(item, media, seen, depth + 1, fieldKind),
    );
    return;
  }
  if (typeof value === "string") {
    const kind = fieldKind || contentMediaKindFromURL(value);
    if (kind) {
      const identity = value.trim();
      if (identity) {
        media[kind].add(identity);
      }
    }
    return;
  }
  if (typeof value !== "object" || seen.has(value)) {
    return;
  }
  seen.add(value);

  const record = value as Record<string, unknown>;
  if (fieldKind) {
    for (const direct of [
      record.url,
      record.src,
      record.thumbnail,
      record.download_url,
      record.downloadUrl,
    ]) {
      collectContentMedia(direct, media, seen, depth + 1, fieldKind);
    }
  }
  for (const kind of CANVAS_CONTENT_MEDIA_KINDS) {
    for (const fieldValue of contentMediaFieldValues(record, kind)) {
      collectContentMedia(fieldValue, media, seen, depth + 1, kind);
    }
  }

  const explicitKind = contentMediaKindFromType(record.type);
  const attrs = isPlainRecord(record.attrs) ? record.attrs : undefined;
  if (
    explicitKind &&
    [record.url, record.src, attrs?.src, attrs?.url].some(hasCanvasContent)
  ) {
    for (const direct of [record.url, record.src, attrs?.src, attrs?.url]) {
      collectContentMedia(direct, media, seen, depth + 1, explicitKind);
    }
  }

  for (const nested of [
    record.rich,
    record.content,
    record.output,
    record.result,
    record.data,
    record.body,
    record.value,
    record.json,
    record.media_files,
    record.mediaFiles,
  ]) {
    collectContentMedia(nested, media, seen, depth + 1);
  }
}

function contentMediaFieldValues(
  record: Record<string, unknown>,
  kind: CanvasContentMediaKind,
) {
  return CANVAS_CONTENT_MEDIA_FIELDS[kind].map((field) => record[field]);
}

function contentMediaKindFromType(value: unknown) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
  if (["image", "mediaimage", "editormediaimage"].includes(normalized)) {
    return "image" as const;
  }
  if (["video", "mediavideo", "editormediavideo"].includes(normalized)) {
    return "video" as const;
  }
  if (
    ["audio", "music", "voice", "mediaaudio", "editormediaaudio"].includes(
      normalized,
    )
  ) {
    return "audio" as const;
  }
  return undefined;
}

function contentMediaKindFromURL(value: string) {
  const url = value.trim();
  if (/\.(png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i.test(url)) {
    return "image" as const;
  }
  if (/\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(url)) {
    return "video" as const;
  }
  if (/\.(mp3|wav|ogg|m4a|aac)(?:[?#].*)?$/i.test(url)) {
    return "audio" as const;
  }
  return undefined;
}

function plainRichDocument(value: unknown): PlainRichDocument | null {
  if (!isPlainRecord(value)) {
    return null;
  }
  if (value.type === "doc" && Array.isArray(value.content)) {
    return value as PlainRichDocument;
  }
  return isPlainRecord(value.rich) &&
    value.rich.type === "doc" &&
    Array.isArray(value.rich.content)
    ? (value.rich as PlainRichDocument)
    : null;
}

function isMarkdownCompatibleRichNode(node: unknown): boolean {
  if (!isPlainRecord(node)) {
    return false;
  }
  if (node.type === "text") {
    return !Array.isArray(node.marks) || node.marks.length === 0;
  }
  if (node.type === "hardBreak") {
    return true;
  }
  if (isRichImageNode(node)) {
    return Boolean(imageSource(node));
  }
  if (node.type !== "doc" && node.type !== "paragraph") {
    return false;
  }
  return (
    Array.isArray(node.content) &&
    node.content.every(isMarkdownCompatibleRichNode)
  );
}

function markdownCompatibleRichNodeText(node: PlainRichNode): string {
  if (node.type === "text") {
    return String(node.text || "");
  }
  if (node.type === "hardBreak") {
    return "\n";
  }
  if (isRichImageNode(node)) {
    const alt = escapeMarkdownImageAlt(
      String(node.attrs?.alt || node.attrs?.caption || "图片"),
    );
    return `![${alt}](<${escapeMarkdownImageSource(imageSource(node))}>)`;
  }
  return Array.isArray(node.content)
    ? node.content.map(markdownCompatibleRichNodeText).join("")
    : "";
}

function markdownCompatibleRichNodePlainText(node: PlainRichNode): string {
  if (node.type === "text") {
    return String(node.text || "");
  }
  if (node.type === "hardBreak") {
    return "\n";
  }
  if (isRichImageNode(node)) {
    return "";
  }
  return Array.isArray(node.content)
    ? node.content.map(markdownCompatibleRichNodePlainText).join("")
    : "";
}

function richNodeHasMedia(node: PlainRichNode): boolean {
  return (
    isRichImageNode(node) ||
    Boolean(node.content?.some((child) => richNodeHasMedia(child)))
  );
}

function isRichImageNode(node: PlainRichNode) {
  return ["image", "mediaImage", "editorMediaImage"].includes(
    String(node.type || ""),
  );
}

function imageSource(node: PlainRichNode) {
  return String(node.attrs?.src || "").trim();
}

function escapeMarkdownImageAlt(value: string) {
  return value.replace(/([\\\[\]])/g, "\\$1");
}

function escapeMarkdownImageSource(value: string) {
  return value.replace(/</g, "%3C").replace(/>/g, "%3E");
}

function isPlainRecord(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
