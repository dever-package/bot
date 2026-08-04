import { getCompatModule } from "@dever/front-plugin";
import { embeddedJSONValues, isPlainRecord } from "./structured-json";

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

export type ContentMediaKind = "image" | "video" | "audio";

export type StoryboardGridFrame = {
  id: string;
  order: number;
  title: string;
  description: string;
  prompt: string;
  status: string;
  image: string;
  error: string;
  assetID: number;
  assetVersionID: number;
};

export type StoryboardGridDocument = {
  type: "storyboard_grid";
  version: number;
  title: string;
  summary: string;
  frames: StoryboardGridFrame[];
};

const CONTENT_MEDIA_KINDS: ContentMediaKind[] = [
  "image",
  "video",
  "audio",
];

const CONTENT_MEDIA_FIELDS: Record<
  ContentMediaKind,
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

export function firstNonEmptyText(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

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
  return CONTENT_MEDIA_KINDS.filter((kind) => media[kind].size > 0);
}

export function contentOutputMediaCount(output: unknown) {
  const media = contentOutputMediaIndex(output);
  return CONTENT_MEDIA_KINDS.reduce(
    (total, kind) => total + media[kind].size,
    0,
  );
}

export function contentOutputMediaURLs(
  output: unknown,
  kind: ContentMediaKind,
) {
  return Array.from(contentOutputMediaIndex(output)[kind]);
}

export function parseStoryboardGridOutput(
  value: unknown,
): StoryboardGridDocument | null {
  return findStoryboardGrid(value, new Set<object>(), 0);
}

export function contentOutputHasType(value: unknown, expectedType: string) {
  const normalizedType = expectedType.trim().toLowerCase();
  return normalizedType
    ? findContentOutputType(value, normalizedType, new Set<object>(), 0)
    : false;
}

export function preferRicherMediaOutput(...values: unknown[]) {
  let fallback: unknown;
  let selected: unknown;
  let selectedMediaCount = 0;
  for (const value of values) {
    if (!hasContentOutput(value)) {
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

export function hasContentOutput(value: unknown) {
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
  const media: Record<ContentMediaKind, Set<string>> = {
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
  if (!hasContentOutput(output)) {
    return [];
  }
  const normalized = normalizeEnergonOutput?.(output);
  if (Array.isArray(normalized) && normalized.length > 0) {
    return normalized;
  }
  return Array.isArray(output) ? output : [output];
}

function findContentOutputType(
  value: unknown,
  expectedType: string,
  seen: Set<object>,
  depth: number,
): boolean {
  if (value == null || depth > 12) {
    return false;
  }
  if (typeof value === "string") {
    return embeddedJSONValues(value).some((parsed) =>
      findContentOutputType(parsed, expectedType, seen, depth + 1),
    );
  }
  if (Array.isArray(value)) {
    return value.some((item) =>
      findContentOutputType(item, expectedType, seen, depth + 1),
    );
  }
  if (!isPlainRecord(value) || seen.has(value)) {
    return false;
  }
  seen.add(value);
  if (String(value.type || "").trim().toLowerCase() === expectedType) {
    return true;
  }
  return [
    value.json,
    value.output,
    value.result,
    value.data,
    value.content,
    value.body,
    value.value,
    value.text,
    value.finalOutput,
    value.final_output,
    value.rich,
  ].some((nested) =>
    findContentOutputType(nested, expectedType, seen, depth + 1),
  );
}

function findStoryboardGrid(
  value: unknown,
  seen: Set<object>,
  depth: number,
): StoryboardGridDocument | null {
  if (value == null || depth > 12) {
    return null;
  }
  if (typeof value === "string") {
    const text = value.trim();
    if (!text || (!text.startsWith("{") && !text.startsWith("["))) {
      return null;
    }
    try {
      return findStoryboardGrid(JSON.parse(text), seen, depth + 1);
    } catch {
      return null;
    }
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const grid = findStoryboardGrid(item, seen, depth + 1);
      if (grid) {
        return grid;
      }
    }
    return null;
  }
  if (!isPlainRecord(value) || seen.has(value)) {
    return null;
  }
  seen.add(value);

  const direct = normalizeStoryboardGridDocument(value);
  if (direct) {
    return direct;
  }
  for (const key of [
    "json",
    "storyboard_grid",
    "output",
    "result",
    "data",
    "content",
    "body",
    "value",
    "text",
    "rich",
  ]) {
    const grid = findStoryboardGrid(value[key], seen, depth + 1);
    if (grid) {
      return grid;
    }
  }
  return null;
}

function normalizeStoryboardGridDocument(
  value: Record<string, unknown>,
): StoryboardGridDocument | null {
  if (
    String(value.type || "").trim().toLowerCase() !== "storyboard_grid" ||
    !Array.isArray(value.frames)
  ) {
    return null;
  }
  const frames = value.frames
    .map(normalizeStoryboardGridFrame)
    .filter((frame): frame is StoryboardGridFrame => Boolean(frame))
    .sort((left, right) => left.order - right.order);
  if (frames.length < 2 || frames.length > 9) {
    return null;
  }
  return {
    type: "storyboard_grid",
    version: Math.max(1, Math.trunc(Number(value.version) || 1)),
    title: firstNonEmptyText(value.title, "宫格图片"),
    summary: firstNonEmptyText(value.summary),
    frames,
  };
}

function normalizeStoryboardGridFrame(
  value: unknown,
  index: number,
): StoryboardGridFrame | null {
  if (!isPlainRecord(value)) {
    return null;
  }
  const order = Math.max(1, Math.trunc(Number(value.order) || index + 1));
  return {
    id: firstNonEmptyText(value.id, `frame-${String(order).padStart(2, "0")}`),
    order,
    title: firstNonEmptyText(value.title, `画面 ${String(order).padStart(2, "0")}`),
    description: firstNonEmptyText(value.description),
    prompt: firstNonEmptyText(value.prompt),
    status: firstNonEmptyText(value.status),
    image: firstNonEmptyText(value.image, value.image_url, value.imageUrl),
    error: firstNonEmptyText(value.error),
    assetID: positiveInteger(value.asset_id, value.assetId, value.assetID),
    assetVersionID: positiveInteger(
      value.asset_version_id,
      value.assetVersionId,
      value.assetVersionID,
    ),
  };
}

function positiveInteger(...values: unknown[]) {
  for (const value of values) {
    const number = Math.trunc(Number(value) || 0);
    if (number > 0) {
      return number;
    }
  }
  return 0;
}

function collectContentMedia(
  value: unknown,
  media: Record<ContentMediaKind, Set<string>>,
  seen: Set<object>,
  depth: number,
  fieldKind?: ContentMediaKind,
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
  for (const kind of CONTENT_MEDIA_KINDS) {
    for (const fieldValue of contentMediaFieldValues(record, kind)) {
      collectContentMedia(fieldValue, media, seen, depth + 1, kind);
    }
  }

  const explicitKind = contentMediaKindFromType(record.type);
  const attrs = isPlainRecord(record.attrs) ? record.attrs : undefined;
  if (
    explicitKind &&
    [record.url, record.src, attrs?.src, attrs?.url].some(hasContentOutput)
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
  kind: ContentMediaKind,
) {
  return CONTENT_MEDIA_FIELDS[kind].map((field) => record[field]);
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
